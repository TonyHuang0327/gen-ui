import type { LeafNode, PageChild, UiNode } from "@/types";
import z from "zod";

const buttonSchema = z.object({
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

const textSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
  variant: z.enum(["body", "h1", "h2", "h3"]).optional(),
});

const leafNodeSchema: z.ZodType<LeafNode> = z.discriminatedUnion("type", [
  buttonSchema,
  textSchema,
]);

const stackSchema = z.object({
  type: z.literal("stack"),
  direction: z.enum(["vertical", "horizontal"]).optional(),
  children: z.array(leafNodeSchema),
});

const cardSchema = z.object({
  type: z.literal("card"),
  title: z.string().optional(),
  children: z.array(leafNodeSchema),
});

const pageChildSchema: z.ZodType<PageChild> = z.union([
  stackSchema,
  cardSchema,
  leafNodeSchema,
]);

const pageThemeSchema = z.enum(["default", "calm", "bold"]);

const uiNodeSchema: z.ZodType<UiNode> = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("page"),
    theme: pageThemeSchema.optional(),
    children: z.array(pageChildSchema),
  }),
  stackSchema,
  cardSchema,
  buttonSchema,
  textSchema,
]);

export const safeParseUiNode = (node: unknown) => {
  return uiNodeSchema.safeParse(node);
};
