## Context

This is a greenfield Next.js application. There is no existing codebase to migrate. The goal is a single-page developer toolbox where all tools live in one unified interface, differentiated from competitors by auto-detection, AI-assisted routing, and a zero-navigation UX. The primary constraint is that the AI layer must be optional/degradable — all tools must work without an AI API key configured.

## Goals / Non-Goals

**Goals:**
- Ship a working Next.js 14 app (App Router) with Tailwind CSS
- Single-page UX: universal input → auto-detect → output, no page transitions for tool usage
- At least 15 tools across encoding, formatting, conversion, generation, and inspection categories
- AI layer for natural language command parsing and malformed input correction
- Collapsible sidebar for manual tool discovery and selection
- Dark mode default with light mode toggle
- Fully responsive (mobile-first)
- Copy/download actions on all outputs

**Non-Goals:**
- User accounts or persistence beyond browser session
- Collaboration or sharing features (phase 2)
- Server-side tool execution (all tools run client-side in the browser)
- Paid/gated tools

## Decisions

### 1. Next.js App Router with client components for tool execution

All tool logic runs entirely in the browser (no server round-trips for tool execution). Next.js is used for its ecosystem, routing, and future extensibility. Tool components are `"use client"` components. The App Router gives a clean layout system for the shell.

**Alternatives considered:**
- Plain Vite/React SPA: simpler, but loses Next.js ecosystem and SEO potential
- Server Actions for tools: adds latency and complexity with no benefit since inputs are sensitive (e.g. JWT tokens, private data)

### 2. Tool Registry pattern

All tools are registered in a central `tools/registry.ts` file. Each tool exports a `ToolDefinition` object:
```ts
{
  id: string
  name: string
  category: Category
  description: string
  detect: (input: string) => number  // confidence 0-1
  execute: (input: string, options?: Record<string, unknown>) => ToolResult
  keywords: string[]
}
```
The registry enables: auto-detection (run all `detect` functions, pick highest confidence), sidebar listing, AI routing by tool ID, and future dynamic loading.

**Alternatives considered:**
- File-system based discovery: too implicit, harder to type
- Per-page tools: defeats the single-page goal

### 3. AI via Vercel AI SDK (streaming, client-side fetch to `/api/ai`)

A single API route `/api/ai` receives `{ input, userCommand }` and returns structured JSON: `{ toolId, correctedInput, explanation }`. The client calls this when a natural language command is detected in the input bar. All tool execution still happens client-side with the AI's suggestion.

**Alternatives considered:**
- Calling OpenAI directly from browser: exposes API key
- LangChain: overkill for this use case

### 4. Shiki for syntax highlighting

Shiki is used for output syntax highlighting. It runs in the browser via its CDN/ESM bundle and supports all languages needed (JSON, XML, SQL, etc.). It produces accurate, theme-consistent output.

**Alternatives considered:**
- Prism: older, less accurate, harder to theme-match
- CodeMirror: great editor but heavy for read-only output display

### 5. Zustand for UI state

A single Zustand store holds: `{ input, detectedTools, activeToolId, output, history, sidebarOpen }`. Lightweight, no boilerplate, works well with React 18.

**Alternatives considered:**
- Context API: prop drilling becomes messy across Input → DetectionBar → OutputPanel
- Redux: too heavy for this scope

## Risks / Trade-offs

- **AI API key required for AI features** → Mitigation: graceful degradation — the app works fully without a key, AI features are hidden/disabled when `OPENAI_API_KEY` is not set
- **Large bundle size from tool libraries** → Mitigation: lazy-load tool modules; only load formatters (e.g. `prettier`) when first used
- **Auto-detection false positives** → Mitigation: show confidence level, let user override; never auto-execute destructive operations
- **Mobile UX for large inputs** → Mitigation: input/output stack vertically on mobile; sidebar becomes a bottom sheet drawer

## Migration Plan

1. Initialize Next.js project at repo root with `create-next-app`
2. Install dependencies (Tailwind, Zustand, Shiki, Vercel AI SDK, tool libs)
3. Build app shell + layout
4. Implement tool registry + first 3 tools (JSON formatter, Base64, timestamp)
5. Build universal input + auto-detection bar
6. Build output panel
7. Build sidebar
8. Add remaining tools
9. Add AI routing layer
10. Polish, responsive pass, dark/light theme

## Open Questions

- Which AI model to use? GPT-4o-mini is recommended for cost/speed — confirm with team
- Should history be persisted to `localStorage`? Default to yes, with a clear button
- Max input size limit? Suggest 1MB soft limit with a warning
