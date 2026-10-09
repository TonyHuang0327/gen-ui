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
      type: "card",
      title: "快速開始",
      children: [
        {
          type: "text",
          text: "輸入提示後送出，由模型產生 UI。",
        },
        {
          type: "button",
          label: "了解更多",
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
          label: "主要動作",
          variant: "default",
        },
        {
          type: "button",
          label: "次要動作",
          variant: "secondary",
        },
      ],
    },
  ],
};
