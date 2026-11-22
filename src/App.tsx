import { useState, type FormEvent } from "react";
import { Button } from "./components/ui/button";
import { Renderer } from "./Renderer";
import { mockResponse } from "./mock-response";
import { safeParseUiPage, type UiPage } from "./schema";
import { generateUiTree } from "./lib/llm";
import { clearApiKey, loadApiKey, saveApiKey } from "./lib/api-key";
import { SettingsDialog } from "./components/settings-dialog";
import { SendHorizontal } from "lucide-react";
import { cn } from "./lib/utils";

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
      setError(
        "Click the settings button in the top-right corner and paste your Gemini API key.",
      );
      return;
    }

    setLoading(true);
    setError(null);
    setPrompt("");

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
    <div className="flex flex-col gap-6 px-4 py-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gen UI</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Enter a prompt and let the model generate a UI.
          </p>
        </div>
        <SettingsDialog
          apiKey={apiKey}
          onSave={handleSaveApiKey}
          onClear={handleClearApiKey}
        />
      </header>

      <section
        aria-label="Generated result"
        aria-busy={loading}
        aria-live="polite"
        className="min-h-48 rounded-xl border border-neutral-200 bg-neutral-50 p-4"
      >
        {loading ? (
          <p className="text-sm text-neutral-600">Generating…</p>
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

      <form
        className="fixed mx-auto w-full max-w-2xl inset-x-0 bottom-5"
        onSubmit={handleSubmit}
      >
        <textarea
          id="prompt"
          name="prompt"
          value={prompt}
          disabled={loading || !apiKey}
          onChange={(event) => setPrompt(event.target.value)}
          className={cn(
            // layout
            "block w-full resize-none overflow-y-auto field-sizing-content max-h-40",
            // box
            "rounded-3xl border border-neutral-300 bg-white px-3 py-2 pr-12",
            // text
            "text-sm",
            "scrollbar-none",
            // focus
            "outline-none focus-visible:border-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-400/50",
            // disabled
            "disabled:opacity-50",
          )}
          placeholder={
            !apiKey ? "No API key set yet." : "Please type your prompt here..."
          }
        />
        <Button
          type="submit"
          disabled={loading || !prompt.trim() || !apiKey}
          className="absolute bottom-0.5 right-0.5 rounded-full"
          variant="ghost"
          size="icon"
          aria-label="Submit"
        >
          <SendHorizontal />
        </Button>
      </form>
    </div>
  );
}

export default App;
