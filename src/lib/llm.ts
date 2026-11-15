import { GoogleGenAI } from "@google/genai";
import { uiPageJsonSchema } from "@/schema";

export async function generateUiTree(
  prompt: string,
  apiKey: string,
): Promise<unknown> {
  if (!apiKey) {
    throw new Error("請先在右上角設定 Gemini API Key");
  }

  const client = new GoogleGenAI({ apiKey });

  const interaction = await client.interactions.create({
    model: "gemini-3.1-flash-lite",
    input: [
      {
        type: "text",
        text: `你是 UI JSON 產生器。只輸出符合 schema 的 JSON，不要 markdown。
text 節點：標題用 variant "h1"|"h2"|"h3"，內文用 "body" 或省略 variant。
排版：分區用 stack 或 card；橫向排列用 stack 且 direction "horizontal"。容器內只能放 button、text、list、badge、alert，不能再放 stack 或 card。
元件用途：list 用於條列項目（ordered 為 true 時是編號清單）；badge 用於狀態或標籤；alert 用於提示或警告（出錯、危險用 variant "destructive"）。
顏色：依氣氛在 page 選 theme "default"（中性）|"calm"（柔和）|"bold"（強烈）；勿輸出其他顏色欄位。按鈕語意用既有 variant。
使用者需求：${prompt}`,
      },
    ],
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: uiPageJsonSchema,
    },
  });

  const text = interaction.output_text;
  if (!text) {
    throw new Error("模型沒有回傳文字");
  }

  return JSON.parse(text);
}
