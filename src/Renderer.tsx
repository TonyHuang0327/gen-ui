import { Button } from "./components/ui/button";
import type { LeafNode, UiNode } from "./types";

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
  }
}

export const Renderer = ({ node }: { node: UiNode }) => {
  switch (node.type) {
    case "page":
      return (
        <div
          data-theme={node.theme ?? "default"}
          className="flex flex-col gap-4 bg-background text-foreground"
        >
          {node.children.map((child, index) => (
            <Renderer key={index} node={child} />
          ))}
        </div>
      );
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
      return renderLeaf(node);
  }
};
