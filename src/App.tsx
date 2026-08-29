import { Renderer } from "./Renderer";
import { mockResponse } from "./mock-response";
import { safeParseUiNode } from "./schema";

function App() {
  const parsedResponse = safeParseUiNode(mockResponse);
  if (!parsedResponse.success) {
    return <div>Error: {parsedResponse.error.message}</div>;
  }
  return <Renderer node={parsedResponse.data} />;
}

export default App;
