// BYOK: the user's own Gemini API key lives only in this browser's localStorage.
// It is never bundled into the code and never sent to our own server.
const STORAGE_KEY = "gen-ui:gemini-api-key";

export function loadApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    // Treat the key as unset when the browser blocks storage
    return "";
  }
}

export function saveApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // If saving fails, the key lives only in page memory and must be pasted again after a reload
  }
}

export function clearApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear when storage is blocked
  }
}
