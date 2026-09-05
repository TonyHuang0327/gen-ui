import { useState, type FormEvent } from "react";
import { Button } from "./components/ui/button";
import { Renderer } from "./Renderer";
import { mockResponse } from "./mock-response";
import { safeParseUiNode } from "./schema";
import { generateUiTree } from "./lib/llm";

function App() {
  const [prompt, setPrompt] = useState("");
  const [uiTree, setUiTree] = useState(mockResponse);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;
    try {
      const data = await generateUiTree(trimmed); // 你 llm.ts 的函式
      const parsed = safeParseUiNode(data);
      if (!parsed.success) {
        // 顯示錯誤（state 或另外一個 error state）
        console.error(parsed.error.message);
        return;
      }
      setUiTree(parsed.data);
    } catch (error) {
      console.error(error);
    }
  }
  const parsedResponse = safeParseUiNode(uiTree);

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 px-4 py-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Gen UI</h1>
        <p className="mt-1 text-sm text-neutral-600">
          目前顯示 mock 畫面，之後才會接上模型。
        </p>
      </header>

      <section
        aria-label="產生結果"
        className="min-h-48 rounded-xl border border-neutral-200 bg-neutral-50 p-4"
      >
        {parsedResponse.success ? (
          <Renderer node={parsedResponse.data} />
        ) : (
          <p className="text-sm text-red-700">
            Error: {parsedResponse.error.message}
          </p>
        )}
      </section>

      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <label htmlFor="prompt" className="text-sm font-medium">
          提示
        </label>
        <textarea
          id="prompt"
          name="prompt"
          rows={3}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus-visible:border-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-400/50"
        />
        <div className="flex justify-end">
          <Button type="submit">送出</Button>
        </div>
      </form>
    </div>
  );
}

export default App;
