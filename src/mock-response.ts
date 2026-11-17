import type { UiPage } from "@/schema";

export const mockResponse: UiPage = {
  type: "page",
  theme: "calm",
  children: [
    {
      type: "text",
      text: "Welcome to Gen UI",
      variant: "h1",
    },
    {
      type: "card",
      title: "Quick start",
      children: [
        {
          type: "text",
          text: "Enter a prompt and submit it to let the model generate a UI.",
        },
        {
          type: "list",
          items: ["Describe the screen you want", "Press Submit", "Review the generated UI"],
          ordered: true,
        },
        {
          type: "badge",
          label: "Beta",
          variant: "secondary",
        },
        {
          type: "alert",
          title: "Note",
          description: "This is the default sample. The model has not been called yet.",
        },
        {
          type: "button",
          label: "Learn more",
          variant: "outline",
        },
      ],
    },
    {
      type: "stack",
      direction: "horizontal",
      children: [
        {
          type: "button",
          label: "Primary action",
          variant: "default",
        },
        {
          type: "button",
          label: "Secondary action",
          variant: "secondary",
        },
      ],
    },
  ],
};
