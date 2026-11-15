import { useState, type FormEvent } from "react";
import { Button } from "./components/ui/button";
import { Renderer } from "./Renderer";
import { mockResponse } from "./mock-response";
import { safeParseUiPage, type UiPage } from "./schema";
import { generateUiTree } from "./lib/llm";
import { clearApiKey, loadApiKey, saveApiKey } from "./lib/api-key";
import { SettingsDialog } from "./components/settings-dialog";

function App() {
  const [apiKey, setApiKey] = useState(loadApiKey);
  const [prompt, setPrompt] = useState("");
  const [uiTree, setUiTree] = useState<UiPage>(mockResponse);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;

    if (!apiKey) {
      setError("請先點右上角的設定按鈕，貼上你的 Gemini API Key。");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await generateUiTree(trimmed, apiKey);
      const parsed = safeParseUiPage(data);
      if (!parsed.success) {
        setError(parsed.error.message);
        return;
      }
      setUiTree(parsed.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  function handleSaveApiKey(key: string) {
    saveApiKey(key);
    setApiKey(key);
    setError(null);
  }

  function handleClearApiKey() {
    clearApiKey();
    setApiKey("");
  }

  const parsedResponse = safeParseUiPage(uiTree);

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 px-4 py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gen UI</h1>
          <p className="mt-1 text-sm text-neutral-600">
            輸入提示，由模型產生 UI。
          </p>
          {apiKey ? null : (
            <p className="mt-1 text-sm text-amber-700">
              尚未設定 API Key，請點右上角的設定按鈕。
            </p>
          )}
        </div>
        <SettingsDialog
          apiKey={apiKey}
          onSave={handleSaveApiKey}
          onClear={handleClearApiKey}
        />
      </header>

      <section
        aria-label="產生結果"
        aria-busy={loading}
        aria-live="polite"
        className="min-h-48 rounded-xl border border-neutral-200 bg-neutral-50 p-4"
      >
        {loading ? (
          <p className="text-sm text-neutral-600">產生中…</p>
        ) : (
          <div className="flex flex-col gap-3">
            {error ? (
              <p className="text-sm text-red-700">Error: {error}</p>
            ) : null}
            {parsedResponse.success ? (
              <Renderer node={parsedResponse.data} />
            ) : (
              <p className="text-sm text-red-700">
                Error: {parsedResponse.error.message}
              </p>
            )}
          </div>
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
          disabled={loading}
          onChange={(event) => setPrompt(event.target.value)}
          className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus-visible:border-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-400/50 disabled:opacity-50"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !prompt.trim()}>
            {loading ? "產生中…" : "送出"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default App;
