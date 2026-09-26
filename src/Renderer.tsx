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
    case "text": {
      switch (node.variant) {
        case "h1":
          return <h1 className="text-2xl font-semibold">{node.text}</h1>;
        case "h2":
          return <h2 className="text-xl font-semibold">{node.text}</h2>;
        case "h3":
          return <h3 className="text-lg font-semibold">{node.text}</h3>;
        case "body":
        default:
          return <p>{node.text}</p>;
      }
    }
  }
};
