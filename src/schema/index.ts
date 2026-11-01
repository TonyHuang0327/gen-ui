import z from "zod";

export const buttonSchema = z.object({
  type: z.literal("button"),
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
  type: z.literal("text"),
  text: z.string(),
  variant: z.enum(["body", "h1", "h2", "h3"]).optional(),
});

export const leafNodeSchema = z.discriminatedUnion("type", [
  buttonSchema,
  textSchema,
]);

export const stackSchema = z.object({
  type: z.literal("stack"),
  direction: z.enum(["vertical", "horizontal"]).optional(),
  children: z.array(leafNodeSchema),
});

export const cardSchema = z.object({
  type: z.literal("card"),
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
  type: z.literal("page"),
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

/** Gemini response_format：由 uiPageSchema 衍生，移除 $schema 等 host 不吃的欄位 */
function toGeminiJsonSchema(schema: Record<string, unknown>) {
  const rest = { ...schema };
  delete rest.$schema;
  return rest;
}

export const uiPageJsonSchema = toGeminiJsonSchema(
  z.toJSONSchema(uiPageSchema) as Record<string, unknown>,
);
