import { useState, type FormEvent } from "react";
import { SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type SettingsDialogProps = {
  /** The currently saved key. Only used to tell whether one is set; never shown on screen. */
  apiKey: string;
  onSave: (key: string) => void;
  onClear: () => void;
};

export function SettingsDialog({ apiKey, onSave, onClear }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  function handleOpenChange(next: boolean) {
    setOpen(next);
    // Always start empty; never fill the saved key back into the input.
    if (next) setDraft("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSave(trimmed);
    setOpen(false);
  }

  function handleClear() {
    onClear();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<Button variant="ghost" size="icon" aria-label="Settings" />}
      >
        <SettingsIcon />
      </DialogTrigger>
      <DialogContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Paste your own Gemini API key. The key is stored only in this
              browser and is sent directly to Google, never through any other
              server.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              Gemini API Key
            </label>
            <Input
              id="api-key"
              type="password"
              autoComplete="off"
              spellCheck={false}
              placeholder={
                apiKey ? "Already set. Paste a new key to replace it" : "Paste API key"
              }
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Status: {apiKey ? "Set" : "Not set"}
            </p>
          </div>

          <DialogFooter>
            {apiKey ? (
              <Button type="button" variant="outline" onClick={handleClear}>
                Clear
              </Button>
            ) : null}
            <Button type="submit" disabled={!draft.trim()}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
