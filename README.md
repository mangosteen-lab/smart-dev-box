# SmartDevBox

SmartDevBox is a browser-based developer toolbox built with Next.js App Router and deployed to Cloudflare through OpenNext. It provides client-side tools for encoding, formatting, conversion, generation, inspection, text manipulation, plugin-defined tools, and optional AI-assisted tool routing.

Live site: https://smartdevbox.com

## Stack

- Next.js 15, React 19, TypeScript
- Zustand for persisted client state
- Tailwind CSS plus global CSS design tokens
- Jest and ts-jest for unit tests
- OpenNext and Wrangler for Cloudflare builds/deploys
- Optional OpenAI routing through `OPENAI_API_KEY`

## Daily Commands

```bash
npm run dev          # local dev server on 0.0.0.0
npm run check        # typecheck + lint + unit tests
npm run test:e2e     # Playwright browser smoke tests
npm run build        # production Next.js build
npm run build:cloudflare
```

The Playwright config uses `/usr/bin/google-chrome` when present. On machines without a system Chrome/Chromium install, run `npx playwright install chromium` once before `npm run test:e2e`.

Make targets are available for the same daily loop:

```bash
make dev
make check
make test
make test-e2e
make typecheck
make lint
```

## Project Shape

- `app/` contains App Router pages, API routes, metadata, and the `DevboxApp` client shell.
- `components/tools/` contains the main tool UI panels.
- `lib/tools/` contains the tool registry and category implementations.
- `store/devbox.ts` owns shared Zustand state.
- `plugins/` contains bundled plugin JSON.
- `docs/` and `openspec/` document behavior and feature specs.

To add a standard tool, register it in the right `lib/tools/<category>/index.ts` file with `registerTool({ id, name, category, description, keywords, detect, execute })`. It will appear in detection, the sidebar, and the command palette.

## Environment

Copy `.env.local.example` to `.env.local` for local optional settings.

```bash
OPENAI_API_KEY=...
```

When `OPENAI_API_KEY` is absent, AI routing is disabled and the core toolbox still works.
