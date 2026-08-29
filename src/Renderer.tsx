import { Button } from "./components/ui/button";
import type { UiNode } from "./types";

export const Renderer = ({ node }: { node: UiNode }) => {
  switch (node.type) {
    case "page":
      return (
        <div>
          {node.children.map((child, index) => (
            <Renderer key={index} node={child} />
          ))}
        </div>
      );
    case "button":
      return <Button variant={node.variant}>{node.label}</Button>;
    case "text":
      return <p>{node.text}</p>;
  }
};
