import { GoogleGenAI } from "@google/genai";

// 根一定是 page；children 只允許 button / text（先不遞迴 page，降低 schema 複雜度）
const uiJsonSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["page"] },
    children: {
      type: "array",
      items: {
        anyOf: [
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["button"] },
              label: { type: "string" },
              variant: {
                type: "string",
                enum: [
                  "default",
                  "outline",
                  "ghost",
                  "destructive",
                  "secondary",
                  "link",
                ],
              },
            },
            required: ["type", "label"],
          },
          {
            type: "object",
            properties: {
              type: { type: "string", enum: ["text"] },
              text: { type: "string" },
            },
            required: ["type", "text"],
          },
        ],
      },
    },
  },
  required: ["type", "children"],
} as const;

export async function generateUiTree(prompt: string): Promise<unknown> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("缺少 VITE_GEMINI_API_KEY");
  }

  const client = new GoogleGenAI({ apiKey });

  const interaction = await client.interactions.create({
    model: "gemini-3.6-flash",
    input: [
      {
        type: "text",
        text: `你是 UI JSON 產生器。只輸出符合 schema 的 JSON，不要 markdown。
使用者需求：${prompt}`,
      },
    ],
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: uiJsonSchema,
    },
  });

  const text = interaction.output_text;
  if (!text) {
    throw new Error("模型沒有回傳文字");
  }

  return JSON.parse(text);
}
