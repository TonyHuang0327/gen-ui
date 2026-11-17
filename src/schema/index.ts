import z from "zod";

// Note: this schema is converted directly to JSON Schema and sent to Gemini, which
// supports only a subset (its docs list enum and anyOf, but not const or oneOf). So:
// - Use z.enum(["x"]) for fixed values such as type, not z.literal("x") (literal emits const)
// - Use z.union, not z.discriminatedUnion (which emits oneOf)
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

// JSON Schema for Gemini's response_format, derived from uiPageSchema.
// z.toJSONSchema adds $schema at the root, which is outside the subset Gemini supports, so remove it.
const jsonSchema = z.toJSONSchema(uiPageSchema) as Record<string, unknown>;
delete jsonSchema.$schema;

export const uiPageJsonSchema = jsonSchema;
