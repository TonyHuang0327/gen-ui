export type LeafNode = CustomButton | CustomText;

export type PageChild = CustomStack | CustomCard | LeafNode;

export type UiNode = CustomPage | CustomStack | CustomCard | LeafNode;

export type PageTheme = "default" | "calm" | "bold";

type CustomPage = {
  type: "page";
  theme?: PageTheme;
  children: PageChild[];
};

type CustomStack = {
  type: "stack";
  direction?: "vertical" | "horizontal";
  children: LeafNode[];
};

type CustomCard = {
  type: "card";
  title?: string;
  children: LeafNode[];
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
