import type { UiNode } from "@/types";
import z from "zod";

const uiNodeSchema: z.ZodType<UiNode> = z.lazy(() =>
  z.discriminatedUnion("type", [
    z.object({ type: z.literal("page"), children: z.array(uiNodeSchema) }),
    z.object({
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
    }),
    z.object({ type: z.literal("text"), text: z.string() }),
  ]),
);
export const safeParseUiNode = (node: unknown) => {
  return uiNodeSchema.safeParse(node);
};
