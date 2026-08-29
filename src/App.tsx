import { Renderer } from "./Renderer";
import { mockResponse } from "./mock-response";

function App() {
  return <Renderer node={mockResponse} />;
}

export default App;
