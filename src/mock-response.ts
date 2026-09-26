import type { UiNode } from "./types";

export const mockResponse: UiNode = {
  type: "page",
  children: [
    {
      type: "text",
      text: "歡迎使用 Gen UI",
      variant: "h1",
    },
    {
      type: "button",
      label: "Click me",
      variant: "outline",
    },
    {
      type: "text",
      text: "Hello, world!",
    },
  ],
};
