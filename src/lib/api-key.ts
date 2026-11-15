// BYOK：使用者自己的 Gemini API key 只存在這個瀏覽器的 localStorage，
// 不會被打包進程式碼，也不會送到我們自己的伺服器。
const STORAGE_KEY = "gen-ui:gemini-api-key";

export function loadApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    // 瀏覽器禁用儲存時視為尚未設定
    return "";
  }
}

export function saveApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // 儲存失敗時，這次只存在頁面的記憶體裡，重新整理後需要重貼
  }
}

export function clearApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 儲存被禁用時沒有東西可清
  }
}
