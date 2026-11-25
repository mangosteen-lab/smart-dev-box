# SmartDevBox Agent Guide

This file is the quick-start guide for coding agents working in this repository.
For deeper product behavior, see `docs/agents.md`, `docs/functionality.md`, and `docs/ui-logic.md`.

## Project Summary

SmartDevBox is a browser-based developer toolbox built with Next.js 15 App Router, React 19, TypeScript, Zustand, and Cloudflare/OpenNext. Most tools run entirely in the browser. The only normal server interactions are API routes for app config, plugin hub lookup, and optional AI tool routing when `OPENAI_API_KEY` is configured.

Live site: `https://smartdevbox.com`

## Daily Commands

Use these before handing work back:

```bash
npm run check        # TypeScript + ESLint + Jest
npm run build        # Next.js production build
```

Use these when browser behavior is touched:

```bash
npm run test:e2e     # Playwright smoke tests
npm run test:e2e:ui  # Interactive Playwright UI
```

Equivalent Make targets:

```bash
make check
make test
make test-e2e
make typecheck
make lint
```

Playwright starts `npm run dev:e2e` on `127.0.0.1:3000`. The config uses `/usr/bin/google-chrome` when available; otherwise install Chromium once with:

```bash
npx playwright install chromium
```

In restricted sandboxes, local server binding may require elevated execution.

## Repository Map

- `app/` - App Router pages, metadata, API routes, and `DevboxApp`.
- `components/layout/` - Navbar and theme provider.
- `components/tools/` - Main tool UI panels and special panels.
- `components/CommandPalette.tsx` - Global tool search and execution.
- `components/ResizablePanels.tsx` - Input/output split layout.
- `store/devbox.ts` - Central Zustand store and persisted UI state.
- `lib/tools/` - Tool registry, core types, and category implementations.
- `plugins/` - Bundled plugin JSON files.
- `e2e/` - Playwright smoke tests.
- `docs/` - Product behavior references.
- `openspec/` - Historical feature specs and task docs.

## Tool Architecture

Standard tools are registered through `registerTool()` in `lib/tools/<category>/index.ts`.

Each tool should provide:

```ts
{
  id,
  name,
  category,
  description,
  keywords,
  detect(input): number,
  execute(input, options?): ToolResult
}
```

Use `execute()` to return `{ output, outputLanguage?, error? }`. Handle exceptions inside tools or allow `executeTool()` to convert them into an error result.

Detection scores should be conservative. Return `0` when the input clearly does not match. Generator tools normally use `detect: () => 0`.

## Adding Tools

For a standard text-in/text-out tool:

1. Add it to the relevant `lib/tools/<category>/index.ts`.
2. Include useful `keywords` for sidebar and command palette search.
3. Add focused unit tests in `__tests__/tools.test.ts` for parsing, valid output, invalid input, and empty input behavior.
4. Run `npm run check`.

For generator tools:

1. Register the generator tool with `detect: () => 0`.
2. Add the ID to `GENERATOR_TOOL_IDS` in `lib/tools/registry.ts` if it can execute without input.
3. Add a `GeneratorDef` in `components/tools/GeneratorBar.tsx`.
4. Add browser coverage if the UI flow changes.

For custom-panel tools:

1. Create or update the panel in `components/tools/`.
2. Register it in `CUSTOM_PANELS` inside `app/DevboxApp.tsx`.
3. Keep the panel lazy-loaded through `dynamic(..., { ssr: false })`.
4. Add a Playwright smoke test if it is user-facing.

## State And UI Notes

- `store/devbox.ts` owns `input`, `activeToolId`, detection results, outputs, history, theme, sidebar state, command palette state, plugins, recents, and pins.
- Persisted state should remain limited to durable UI preferences and plugin data. Do not persist current input or outputs.
- The command palette open state is in Zustand. Navbar should call store actions directly, not dispatch synthetic keyboard events.
- Use `data-testid` sparingly for stable e2e selectors when accessible selectors are not robust enough.

## Upload And AI Limits

Text files are read client-side with `FileReader`; they are not uploaded to the server. Current limits:

- Large input warning: above `1 MB`.
- Text file load limit: `5 MB`.
- Optional AI routing sends only the first `8,000` characters to `/api/ai`; selected tools still execute on the full browser-side input.

Large inputs can still affect browser responsiveness because detection, formatting, syntax highlighting, and rendering run in the client.

## Testing Expectations

For most code changes:

```bash
npm run check
```

For UI flows, lazy-loaded panels, command palette, generator hub, file/input behavior, or state wiring:

```bash
npm run test:e2e
```

For deployment/build-sensitive changes:

```bash
npm run build
```

Current Playwright smoke coverage includes app shell, JSON formatting, command palette Base64 Decode, UUID generation, and QR panel rendering.

## Build And Deployment

- `npm run build` runs the production Next.js build.
- `npm run build:cloudflare` builds through OpenNext for Cloudflare.
- `npm run preview`, `npm run upload`, and `npm run deploy` use OpenNext/Cloudflare commands.
- `wrangler.jsonc` contains Cloudflare settings and plugin hub URL config.

## Engineering Constraints

- Prefer existing local patterns over new abstractions.
- Keep tool implementations pure where possible.
- Keep server API routes small and avoid sending full user input unless explicitly needed.
- Do not commit generated output such as `.next`, `.open-next`, `playwright-report`, `test-results`, or `coverage`.
- Avoid broad refactors while adding a tool or fixing one workflow.
- Keep comments short and only where they clarify non-obvious logic.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
