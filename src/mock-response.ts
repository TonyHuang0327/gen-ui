import type { UiNode } from "./types";

export const mockResponse: UiNode = {
  type: "page",
  children: [
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
