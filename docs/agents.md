# SmartDevBox — Agent Reference

## Project Overview

**SmartDevBox** is a browser-based developer toolbox built with Next.js 15 (App Router), deployed on Cloudflare via OpenNext. It provides 100+ utility tools for encoding, formatting, conversion, generation, inspection, and text manipulation — all running client-side with no data leaving the browser (except optional AI routing).

Live URL: `https://smartdevbox.com`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | CSS Modules + CSS custom properties (dark-first) |
| State | Zustand with `persist` middleware (localStorage) |
| Deployment | Cloudflare Pages via OpenNext |
| Font | JetBrains Mono |
| Syntax highlighting | Shiki (lazy-loaded) |
| AI routing | OpenAI API (optional, gated by `OPENAI_API_KEY` env var) |

---

## Repository Structure

```
app/
  layout.tsx          # Root layout — metadata, font, ThemeProvider, Navbar
  page.tsx            # Server component — SEO content + DevboxApp mount
  DevboxApp.tsx       # Root client component — orchestrates all panels
  api/
    ai/route.ts       # POST /api/ai — AI-powered tool routing via OpenAI
    config/route.ts   # GET /api/config — returns { aiEnabled: bool }

store/
  devbox.ts           # Single Zustand store — all app state

lib/tools/
  types.ts            # Core types: ToolDefinition, ToolResult, DetectionResult, ToolOutput
  registry.ts         # registerTool(), runDetection(), executeTool(), GENERATOR_TOOL_IDS
  index.ts            # Imports all category indexes to populate registry
  utils.ts            # Shared utilities for tool implementations
  encoding/index.ts   # Encoding/decoding tools
  formatting/index.ts # Formatting/validation tools
  conversion/index.ts # Conversion tools (incl. TOML parser)
  generation/index.ts # Generator tools (UUID, ULID, Nano ID, random, Lorem, QR code)
  inspection/index.ts # Inspection/analysis tools (incl. JSON Schema, semver, .env, CIDR, IP, HTTP status)
  security/index.ts   # Security generators: HMAC, TOTP
  networking/index.ts # Networking inspection: CIDR calculator, IP inspector, HTTP status reference
  text/index.ts       # Text manipulation tools

components/
  layout/Navbar.tsx          # Top navigation bar
  tools/
    ToolSidebar.tsx          # Category/tool navigation sidebar
    UniversalInput.tsx       # Main textarea with detection + AI bar
    DetectionBar.tsx         # Detected format chips
    OutputPanel.tsx          # Syntax-highlighted output + actions
    GeneratorBar.tsx         # Generator Hub — single button opens a master-detail search panel
  CommandPalette.tsx         # ⌘K search palette
  ResizablePanels.tsx        # Drag-to-resize input/output split

openspec/changes/dev-toolbox-nextjs/   # Feature proposals and spec docs
```

---

## Core Abstractions

### ToolDefinition (`lib/tools/types.ts`)

```ts
interface ToolDefinition {
  id: string;                  // unique kebab-case identifier
  name: string;                // display name
  category: string;            // one of the 6 categories
  description: string;         // short description
  keywords: string[];          // search terms for Command Palette
  outputExtension?: string;    // file extension hint for downloads
  detect(input: string): number;                     // returns 0–1 confidence
  execute(input: string, options?: unknown): ToolResult;
}
```

### Tool Registry (`lib/tools/registry.ts`)

- `registerTool(def)` — adds a tool to the in-memory registry
- `getTools()` — returns all registered tools
- `getTool(id)` — returns a single tool by ID
- `runDetection(input)` — scores all tools, returns `DetectionResult[]` sorted by confidence
- `executeTool(id, input, options?)` — runs a tool and returns `ToolOutput`

### ToolResult

```ts
interface ToolResult {
  output: string;
  outputType?: 'json' | 'xml' | 'sql' | 'css' | 'html' | 'diff' | 'text';
  error?: string;
}
```

### ToolOutput (stored in state)

```ts
interface ToolOutput {
  toolId: string;
  result: ToolResult;
  timestamp: number;
}
```

---

## State Management (`store/devbox.ts`)

Zustand store with `persist` (localStorage). Key fields:

| Field | Type | Purpose |
|---|---|---|
| `input` | `string` | Current text in the universal input |
| `activeToolId` | `string \| null` | Currently selected tool |
| `detectionResults` | `DetectionResult[]` | Sorted format detection results |
| `outputs` | `ToolOutput[]` | One output per tool (keyed by toolId) |
| `history` | `Array<{input, toolId, timestamp}>` | Last 50 executions |
| `sidebarOpen` | `boolean` | Desktop sidebar visibility |
| `sidebarMini` | `boolean` | Desktop sidebar collapsed to icon strip |
| `mobileSidebarOpen` | `boolean` | Mobile drawer open state |
| `isDark` | `boolean` | Theme (default: `true`) |
| `isAiLoading` | `boolean` | AI request in-flight |
| `aiEnabled` | `boolean` | Whether OpenAI key is configured |
| `recentToolIds` | `string[]` | Recently used tool IDs |
| `pinnedToolIds` | `string[]` | User-pinned tool IDs |

---

## AI Integration

- **Endpoint**: `POST /api/ai` with `{ input: string, userMessage?: string }`
- **Response**: `{ toolId: string, correctedInput?: string }`
- **Behavior**: OpenAI selects the best tool for the input; optionally corrects the input (e.g. fixes malformed JSON). Gated by `OPENAI_API_KEY` env var.
- **Config check**: `GET /api/config` → `{ aiEnabled: boolean }` — fetched on app mount; populates `aiEnabled` in the store.
- **UI**: Command bar inside `UniversalInput` — only rendered when `aiEnabled === true`.

---

## Tool Categories

| Category | Count | Notes |
|---|---|---|
| Encoding / Decoding | 18 | Includes JWT inspector/encoder, Base64, URL, HTML, Hex, Base32 |
| Formatting | 12 | JSON/XML/SQL/CSS/HTML/JS format + minify + validate, Markdown preview |
| Conversion | 22 | JSON↔CSV/TSV/YAML/XML, dates, colors, number bases, Markdown→HTML, Roman numerals, UUID↔hex, TOML→JSON |
| Generation | 13 | UUID, ULID, Nano ID, HMAC, TOTP, hash, random string/number/password/IP/MAC, Lorem Ipsum, QR code |
| Inspection | 14 | Regex tester, JSONPath, string inspector, cron parser, cert decoder, HTML preview, JSON Schema validator, MongoDB ObjectID, ULID inspector, semver calculator, .env parser, CIDR calculator, IP inspector, HTTP status reference |
| Text | 24 | Case conversion, line ops, word count, extract emails/URLs/numbers/sections, trim, prefix/suffix, invert case |

---

## Special Panels

These tools render a custom full-panel UI instead of using the standard `UniversalInput → OutputPanel` flow:

- `jwt-encoder` — multi-field JWT builder
- `markdown-preview` — live Markdown preview split
- `html-preview` — sandboxed HTML preview iframe
- `qr-code` — QR code generator with download
- `extractor` — structured data extraction UI
- `split-diff` — side-by-side text diff

All special panels are **lazy-loaded** (`React.lazy` / dynamic import).

---

## Generator Tools

Tools that produce output without requiring input. Accessible via the **Generator Hub** (`Generate ▾` button in the toolbar), which uses a master-detail layout with search:

`uuid-generator`, `ulid-generator`, `nanoid-generator`, `hmac-generator`, `totp-generator`, `random-string`, `random-password`, `random-number`, `random-ip`, `random-mac`, `hash-generator`, `lorem-ipsum`, `qr-code`

New generators can be added by:
1. Registering the tool with `detect: () => 0` and adding the ID to `GENERATOR_TOOL_IDS` in `registry.ts`.
2. Adding a `GeneratorDef` entry in `buildBuiltinGroups()` inside `GeneratorBar.tsx` — the generic `GenericDetail` renderer handles all standard option types (`number`, `text`, `select`, `toggle`) automatically.

---

## Detection System

On each input change, `runDetection(input)` scores every tool and returns a sorted `DetectionResult[]`. The top match auto-executes after a **600ms debounce**. The `DetectionBar` component shows clickable chips for the top N results.

---

## SEO

`app/page.tsx` renders a server-side `sr-only` section listing all tool names and descriptions. This is invisible to users but indexable by search engines without requiring client-side JavaScript.

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | No | Enables AI tool routing feature |
