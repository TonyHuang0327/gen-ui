# gen-ui 專案規則

流程：使用者 prompt → Gemini 依 JSON Schema 輸出 JSON → Zod 驗證 → `Renderer` 遞迴渲染。

## Schema 寫法（重要）

`src/schema/index.ts` 的 Zod schema 有兩個用途：

1. 驗證 Gemini 回傳的結果（`safeParseUiPage`）。
2. 用 `z.toJSONSchema` 轉成 JSON Schema，放進 `response_format.schema` 告訴 Gemini 輸出格式。

Gemini 結構化輸出只支援 JSON Schema 的子集，官方文件沒有列出 `const` 與 `oneOf`；
實測用到這兩個時通過率明顯較低（4/9 對 9/9，樣本小）。所以：

- 固定值（例如元件的 `type`）用 `z.enum(["x"])`，**不要用** `z.literal("x")`（會輸出 `const`）。
- 聯集用 `z.union`，**不要用** `z.discriminatedUnion`（會輸出 `oneOf`）。

```ts
// ❌ 會輸出 const / oneOf，Gemini 不認得
type: z.literal("badge")
z.discriminatedUnion("type", [buttonSchema, badgeSchema])

// ✅ 輸出 enum / anyOf
type: z.enum(["badge"])
z.union([buttonSchema, badgeSchema])
```

改完 schema 後，確認 `uiPageJsonSchema` 的輸出不含 `const`、`oneOf`、`$schema`。
另外，Gemini 對過於複雜的 schema（分支太多、巢狀太深）會回 `400 INVALID_ARGUMENT`，
一次不要新增太多元件，新增後要實測一次。

## 新增元件的步驟

1. 在 `src/schema/index.ts` 新增 schema（遵守上面的寫法），並加進 `leafNodeSchema`。
2. 在 `src/Renderer.tsx` 補上對應的 case。兩個 `switch` 都有 `default: never` 檢查，漏寫會變成編譯錯誤。
3. 更新 `src/lib/llm.ts` 的 prompt（容器可放哪些元件、新元件的用途）。
4. 在 `src/mock-response.ts` 加範例，方便不呼叫 API 就檢查畫面。

用 shadcn CLI 加元件後要檢查：產生的檔案是否 import `cn` 自 `@/lib/utils`（曾出現誤匯入 npm 套件 `cn` 的情況），
以及 `package.json` 有沒有被多加依賴。
另外要檢查元件用到的顏色 token（例如 `bg-popover`、`bg-accent`）有沒有定義在 `src/index.css`；
沒定義的話那個顏色會是透明（對話框曾因缺 `--popover` 而背景透明）。浮層掛在 body 上，只需定義在 `:root`。

## API Key（BYOK）

- Gemini API key 由使用者在畫面右上角的設定對話框貼上，只存在瀏覽器的 localStorage（`src/lib/api-key.ts`），
  並由瀏覽器直接送到 Google。專案不讀 `VITE_GEMINI_API_KEY` 之類的環境變數，
  避免 key 被打包進 bundle。**不要**重新加回環境變數 fallback。
- `generateUiTree(prompt, apiKey)` 的 key 由呼叫端傳入。寫驗證腳本時要自己提供 key，
  不要把 key 寫進程式碼，也不要在 log 或錯誤訊息中印出。

## 其他

- 容器（`stack`、`card`）只能放 leaf 元件，不能巢狀。
- 根節點固定是 `page`。
