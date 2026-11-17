# gen-ui project rules

Flow: user prompt → Gemini outputs JSON following a JSON Schema → Zod validation → `Renderer` renders it recursively.

## Writing the schema (important)

The Zod schema in `src/schema/index.ts` has two purposes:

1. Validate the result Gemini returns (`safeParseUiPage`).
2. Convert it with `z.toJSONSchema` into a JSON Schema and put it in `response_format.schema` to tell Gemini the output format.

Gemini structured output supports only a subset of JSON Schema. The official docs do not list `const` or `oneOf`;
in testing, using either one noticeably lowered the pass rate (4/9 vs 9/9, small sample). So:

- For fixed values (for example a component's `type`), use `z.enum(["x"])` and **do not use** `z.literal("x")` (it emits `const`).
- For unions, use `z.union` and **do not use** `z.discriminatedUnion` (it emits `oneOf`).

```ts
// ❌ Emits const / oneOf, which Gemini does not recognize
type: z.literal("badge")
z.discriminatedUnion("type", [buttonSchema, badgeSchema])

// ✅ Emits enum / anyOf
type: z.enum(["badge"])
z.union([buttonSchema, badgeSchema])
```

After changing the schema, confirm that the output of `uiPageJsonSchema` contains no `const`, `oneOf`, or `$schema`.
Also, Gemini returns `400 INVALID_ARGUMENT` for schemas that are too complex (too many branches, too deeply nested),
so do not add too many components at once, and test against the real API after adding any.

## Steps to add a component

1. Add a schema in `src/schema/index.ts` (following the rules above) and add it to `leafNodeSchema`.
2. Add the matching case in `src/Renderer.tsx`. Both `switch` statements have a `default: never` check, so a missing case becomes a compile error.
3. Update the prompt in `src/lib/llm.ts` (which components a container may hold, and what the new component is for).
4. Add an example to `src/mock-response.ts` so you can check the screen without calling the API.

After adding a component with the shadcn CLI, check:

- Whether the generated file imports `cn` from `@/lib/utils` (it has happened that the npm package `cn` was imported by mistake).
- Whether `package.json` gained extra dependencies.
- Whether the color tokens the component uses (for example `bg-popover`, `bg-accent`) are defined in `src/index.css`.
  An undefined token renders as transparent (the dialog background was once transparent because `--popover` was missing).
  Overlays are mounted on body, so they only need the token on `:root`.

## API key (BYOK)

- The user pastes the Gemini API key in the settings dialog in the top-right corner of the screen. It is stored only in the browser's localStorage (`src/lib/api-key.ts`)
  and sent directly from the browser to Google. The project does not read environment variables such as `VITE_GEMINI_API_KEY`,
  so the key cannot be bundled into the build. **Do not** add an environment-variable fallback back.
- The key for `generateUiTree(prompt, apiKey)` is passed in by the caller. When writing verification scripts, supply your own key;
  do not write the key into code, and do not print it in logs or error messages.

## Other

- Containers (`stack`, `card`) can only hold leaf components and cannot be nested.
- The root node is always `page`.
