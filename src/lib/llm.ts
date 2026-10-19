import { GoogleGenAI } from "@google/genai";

const buttonJsonSchema = {
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
} as const;

const textJsonSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["text"] },
    text: { type: "string" },
    variant: {
      type: "string",
      enum: ["body", "h1", "h2", "h3"],
    },
  },
  required: ["type", "text"],
} as const;

const leafJsonSchema = {
  anyOf: [buttonJsonSchema, textJsonSchema],
} as const;

const stackJsonSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["stack"] },
    direction: { type: "string", enum: ["vertical", "horizontal"] },
    children: {
      type: "array",
      items: leafJsonSchema,
    },
  },
  required: ["type", "children"],
} as const;

const cardJsonSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["card"] },
    title: { type: "string" },
    children: {
      type: "array",
      items: leafJsonSchema,
    },
  },
  required: ["type", "children"],
} as const;

const uiJsonSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["page"] },
    theme: {
      type: "string",
      enum: ["default", "calm", "bold"],
    },
    children: {
      type: "array",
      items: {
        anyOf: [
          stackJsonSchema,
          cardJsonSchema,
          buttonJsonSchema,
          textJsonSchema,
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
    model: "gemini-3.1-flash-lite",
    input: [
      {
        type: "text",
        text: `你是 UI JSON 產生器。只輸出符合 schema 的 JSON，不要 markdown。
text 節點：標題用 variant "h1"|"h2"|"h3"，內文用 "body" 或省略 variant。
排版：分區用 stack 或 card；橫向排列用 stack 且 direction "horizontal"。容器內只能放 button 與 text。
顏色：依氣氛在 page 選 theme "default"（中性）|"calm"（柔和）|"bold"（強烈）；勿輸出其他顏色欄位。按鈕語意用既有 variant。
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
