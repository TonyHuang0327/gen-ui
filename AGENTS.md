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

## 其他

- 容器（`stack`、`card`）只能放 leaf 元件，不能巢狀。
- 根節點固定是 `page`。
