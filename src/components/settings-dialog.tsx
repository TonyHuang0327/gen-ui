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
  /** 目前已儲存的 key，只用來判斷是否已設定，不會顯示在畫面上 */
  apiKey: string;
  onSave: (key: string) => void;
  onClear: () => void;
};

export function SettingsDialog({ apiKey, onSave, onClear }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  function handleOpenChange(next: boolean) {
    setOpen(next);
    // 每次開啟都從空白開始，不把已存的 key 填回輸入框
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
        render={<Button variant="ghost" size="icon" aria-label="設定" />}
      >
        <SettingsIcon />
      </DialogTrigger>
      <DialogContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>設定</DialogTitle>
            <DialogDescription>
              貼上你自己的 Gemini API Key。Key 只會存在這個瀏覽器，並直接送到
              Google，不會經過其他伺服器。
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
              placeholder={apiKey ? "已設定，貼上新的 key 可覆蓋" : "貼上 API Key"}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              目前狀態：{apiKey ? "已設定" : "尚未設定"}
            </p>
          </div>

          <DialogFooter>
            {apiKey ? (
              <Button type="button" variant="outline" onClick={handleClear}>
                清除
              </Button>
            ) : null}
            <Button type="submit" disabled={!draft.trim()}>
              儲存
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
