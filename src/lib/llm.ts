import { GoogleGenAI } from "@google/genai";
import { uiPageJsonSchema } from "@/schema";

export async function generateUiTree(
  prompt: string,
  apiKey: string,
): Promise<unknown> {
  if (!apiKey) {
    throw new Error("Set your Gemini API key in the top-right corner first");
  }

  const client = new GoogleGenAI({ apiKey });

  const interaction = await client.interactions.create({
    model: "gemini-3.1-flash-lite",
    input: [
      {
        type: "text",
        text: `You are a UI JSON generator. Output only JSON that matches the schema, with no markdown.
Text nodes: use variant "h1"|"h2"|"h3" for headings, and "body" (or omit variant) for body text.
Layout: group content with stack or card; for a horizontal row use stack with direction "horizontal". Containers may only hold button, text, list, badge, and alert; never put a stack or card inside another container.
Component usage: list is for itemized content (an ordered list is numbered when ordered is true); badge is for a status or label; alert is for a notice or warning (use variant "destructive" for errors or danger).
Color: choose the page theme by mood: "default" (neutral)|"calm" (soft)|"bold" (strong). Do not output any other color fields. Use the existing variants for button meaning.
User request: ${prompt}`,
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
    throw new Error("The model returned no text");
  }

  return JSON.parse(text);
}
