export type UiNode = CustomPage | CustomButton | CustomText;

type CustomPage = {
  type: "page";
  children: UiNode[];
};
type CustomButton = {
  type: "button";
  label: string;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "destructive"
    | "secondary"
    | "link";
};

type CustomText = {
  type: "text";
  text: string;
  variant?: "body" | "h1" | "h2" | "h3";
};
