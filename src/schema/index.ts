import z from "zod";

// 注意：這份 schema 會直接轉成 JSON Schema 送給 Gemini，而 Gemini 只支援子集
// （文件列出 enum、anyOf，沒有 const、oneOf）。所以：
// - 固定值的 type 用 z.enum(["x"]) 而不是 z.literal("x")（literal 會輸出 const）
// - 聯集用 z.union 而不是 z.discriminatedUnion（後者會輸出 oneOf）
export const buttonSchema = z.object({
  type: z.enum(["button"]),
  label: z.string(),
  variant: z
    .enum([
      "default",
      "outline",
      "ghost",
      "destructive",
      "secondary",
      "link",
    ])
    .optional(),
});

export const textSchema = z.object({
  type: z.enum(["text"]),
  text: z.string(),
  variant: z.enum(["body", "h1", "h2", "h3"]).optional(),
});

export const listSchema = z.object({
  type: z.enum(["list"]),
  items: z.array(z.string()),
  ordered: z.boolean().optional(),
});

export const badgeSchema = z.object({
  type: z.enum(["badge"]),
  label: z.string(),
  variant: z.enum(["default", "secondary", "outline", "destructive"]).optional(),
});

export const alertSchema = z.object({
  type: z.enum(["alert"]),
  title: z.string().optional(),
  description: z.string(),
  variant: z.enum(["default", "destructive"]).optional(),
});

export const leafNodeSchema = z.union([
  buttonSchema,
  textSchema,
  listSchema,
  badgeSchema,
  alertSchema,
]);

export const stackSchema = z.object({
  type: z.enum(["stack"]),
  direction: z.enum(["vertical", "horizontal"]).optional(),
  children: z.array(leafNodeSchema),
});

export const cardSchema = z.object({
  type: z.enum(["card"]),
  title: z.string().optional(),
  children: z.array(leafNodeSchema),
});

export const pageChildSchema = z.union([
  stackSchema,
  cardSchema,
  leafNodeSchema,
]);

export const pageThemeSchema = z.enum(["default", "calm", "bold"]);

export const uiPageSchema = z.object({
  type: z.enum(["page"]),
  theme: pageThemeSchema.optional(),
  children: z.array(pageChildSchema),
});

export type UiPage = z.infer<typeof uiPageSchema>;
export type PageChild = z.infer<typeof pageChildSchema>;
export type LeafNode = z.infer<typeof leafNodeSchema>;
export type PageTheme = z.infer<typeof pageThemeSchema>;
export type RenderableNode = UiPage | PageChild;

export const safeParseUiPage = (data: unknown) => {
  return uiPageSchema.safeParse(data);
};

// Gemini response_format 用的 JSON Schema，由 uiPageSchema 衍生。
// z.toJSONSchema 會在根層加上 $schema，而它不在 Gemini 支援的子集內，所以移除。
const jsonSchema = z.toJSONSchema(uiPageSchema) as Record<string, unknown>;
delete jsonSchema.$schema;

export const uiPageJsonSchema = jsonSchema;
