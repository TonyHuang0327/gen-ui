import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import type { LeafNode, PageChild, UiPage } from "@/schema";

function renderLeaf(node: LeafNode) {
  switch (node.type) {
    case "button":
      return <Button variant={node.variant}>{node.label}</Button>;
    case "text": {
      switch (node.variant) {
        case "h1":
          return (
            <h1 className="text-2xl font-semibold text-foreground">
              {node.text}
            </h1>
          );
        case "h2":
          return (
            <h2 className="text-xl font-semibold text-foreground">
              {node.text}
            </h2>
          );
        case "h3":
          return (
            <h3 className="text-lg font-semibold text-foreground">
              {node.text}
            </h3>
          );
        case "body":
        default:
          return <p className="text-foreground">{node.text}</p>;
      }
    }
    case "list": {
      const ListTag = node.ordered ? "ol" : "ul";
      return (
        <ListTag
          className={`${node.ordered ? "list-decimal" : "list-disc"} pl-5 text-foreground`}
        >
          {node.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ListTag>
      );
    }
    case "badge":
      return <Badge variant={node.variant}>{node.label}</Badge>;
    case "alert":
      return (
        <Alert variant={node.variant}>
          {node.title ? <AlertTitle>{node.title}</AlertTitle> : null}
          <AlertDescription>{node.description}</AlertDescription>
        </Alert>
      );
    default: {
      // 新增元件卻漏寫 case 時，這裡會變成編譯錯誤
      const unhandled: never = node;
      return unhandled;
    }
  }
}

function PageChildRenderer({ node }: { node: PageChild }) {
  switch (node.type) {
    case "stack": {
      const horizontal = node.direction === "horizontal";
      return (
        <div
          className={
            horizontal
              ? "flex flex-row flex-wrap gap-3"
              : "flex flex-col gap-3"
          }
        >
          {node.children.map((child, index) => (
            <div key={index}>{renderLeaf(child)}</div>
          ))}
        </div>
      );
    }
    case "card":
      return (
        <div className="rounded-xl border border-border bg-card p-4 text-card-foreground">
          {node.title ? (
            <h3 className="mb-3 text-lg font-semibold text-foreground">
              {node.title}
            </h3>
          ) : null}
          <div className="flex flex-col gap-3">
            {node.children.map((child, index) => (
              <div key={index}>{renderLeaf(child)}</div>
            ))}
          </div>
        </div>
      );
    case "button":
    case "text":
    case "list":
    case "badge":
    case "alert":
      return renderLeaf(node);
    default: {
      const unhandled: never = node;
      return unhandled;
    }
  }
}

export const Renderer = ({ node }: { node: UiPage }) => {
  return (
    <div
      data-theme={node.theme ?? "default"}
      className="flex flex-col gap-4 bg-background text-foreground"
    >
      {node.children.map((child, index) => (
        <PageChildRenderer key={index} node={child} />
      ))}
    </div>
  );
};
