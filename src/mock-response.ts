import type { UiPage } from "@/schema";

export const mockResponse: UiPage = {
  type: "page",
  theme: "calm",
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
          type: "list",
          items: ["輸入想要的畫面", "按下送出", "檢視產生的 UI"],
          ordered: true,
        },
        {
          type: "badge",
          label: "Beta",
          variant: "secondary",
        },
        {
          type: "alert",
          title: "提示",
          description: "目前的畫面是預設範例，尚未呼叫模型。",
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
