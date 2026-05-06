## 1. Project Setup

- [x] 1.1 Initialize Next.js 14 app with App Router and TypeScript at repository root using `create-next-app`
- [x] 1.2 Install and configure Tailwind CSS
- [x] 1.3 Install core dependencies: Zustand, Shiki, Vercel AI SDK
- [x] 1.4 Install tool utility libraries: `js-base64`, `prettier`, `sql-formatter`, `jsonpath-plus`, `crypto-js`, `diff`
- [x] 1.5 Configure `next.config.js` for any required transpilation or environment variables
- [x] 1.6 Set up `.env.local.example` with `OPENAI_API_KEY` placeholder and document in README

## 2. App Shell & Layout

- [x] 2.1 Create root `app/layout.tsx` with global HTML structure, font, and theme provider
- [x] 2.2 Implement `ThemeProvider` using Zustand to manage dark/light mode and persist to localStorage
- [x] 2.3 Build `Navbar` component with logo, app name, theme toggle button, and settings button
- [x] 2.4 Create main single-page layout in `app/page.tsx` with sidebar + main content area using CSS Grid
- [x] 2.5 Implement responsive layout breakpoints: stacked on mobile (<768px), side-by-side on desktop

## 3. Tool Engine & Registry

- [x] 3.1 Define `ToolDefinition` and `ToolResult` TypeScript interfaces in `lib/tools/types.ts`
- [x] 3.2 Create `lib/tools/registry.ts` with tool registration, lookup by ID, and list by category functions
- [x] 3.3 Implement `runDetection(input: string): DetectionResult[]` function that calls all tool `detect` functions and returns sorted by confidence
- [x] 3.4 Implement `executeTool(toolId: string, input: string, options?): ToolResult` pipeline function
- [x] 3.5 Create Zustand store `store/devbox.ts` with state: `input`, `activeToolId`, `detectionResults`, `outputs`, `history`, `sidebarOpen`

## 4. Universal Input Component

- [x] 4.1 Build `UniversalInput` component with resizable textarea, placeholder text, and character count
- [x] 4.2 Wire input changes to Zustand store and trigger auto-detection with debounce (300ms)
- [x] 4.3 Implement drag-and-drop file reading onto the textarea
- [x] 4.4 Add natural language command bar (single-line input + Run button) below textarea
- [x] 4.5 Show large-input warning banner when input exceeds 1MB

## 5. Detection Bar Component

- [x] 5.1 Build `DetectionBar` component that reads `detectionResults` from store and renders detection chips
- [x] 5.2 Show primary detected tool with a prominent action button (e.g. "Format JSON")
- [x] 5.3 Show secondary detected tools as smaller chips with "More tools" overflow if > 3
- [x] 5.4 Show "Unrecognized input" message when no tool exceeds 0.3 confidence

## 6. Output Panel Component

- [x] 6.1 Build `OutputPanel` component with tabbed layout when multiple tool outputs exist
- [x] 6.2 Integrate Shiki for syntax-highlighted code display with per-output language hint
- [x] 6.3 Implement Copy button with clipboard API and "Copied!" confirmation state
- [x] 6.4 Implement Download button that triggers file download with appropriate extension
- [x] 6.5 Implement Diff view toggle using the `diff` library comparing input to output
- [x] 6.6 Add "AI assisted" chip to output header when output was AI-routed or AI-corrected

## 7. Tool Sidebar Component

- [x] 7.1 Build `ToolSidebar` component with collapsible toggle button and icon rail for collapsed state
- [x] 7.2 Render tools grouped by category with category headings
- [x] 7.3 Implement sidebar search input that filters tools by name, description, and keywords in real-time
- [x] 7.4 Wire tool click to set `activeToolId` in store and execute tool on current input
- [x] 7.5 Persist sidebar open/collapsed state to localStorage

## 8. Encoding / Decoding Tools

- [x] 8.1 Implement `base64-encode` tool with `detect` and `execute`
- [x] 8.2 Implement `base64-decode` tool with `detect`, `execute`, and invalid-input error handling
- [x] 8.3 Implement `url-encode` tool
- [x] 8.4 Implement `url-decode` tool
- [x] 8.5 Implement `jwt-inspector` tool that decodes header + payload and displays as formatted JSON
- [x] 8.6 Implement `html-encode` tool
- [x] 8.7 Implement `html-decode` tool
- [x] 8.8 Register all encoding tools in the registry

## 9. Formatting Tools

- [x] 9.1 Implement `json-formatter` tool using `JSON.parse` + `JSON.stringify` with indentation option
- [x] 9.2 Implement `xml-formatter` tool using a lightweight XML parser/pretty-printer
- [x] 9.3 Implement `sql-formatter` tool using `sql-formatter` library
- [x] 9.4 Implement `css-beautifier` tool using `prettier`
- [x] 9.5 Implement `html-beautifier` tool using `prettier`
- [x] 9.6 Register all formatting tools in the registry

## 10. Conversion Tools

- [x] 10.1 Implement `unix-timestamp` tool: detect epoch integers, convert to/from human-readable date-time with UTC and local timezone
- [x] 10.2 Add "Now" shortcut button to unix-timestamp tool UI
- [x] 10.3 Implement `color-converter` tool: detect HEX/RGB/HSL patterns, output all four formats
- [x] 10.4 Implement `number-base-converter` tool: detect binary/octal/hex patterns, output all four bases
- [x] 10.5 Register all conversion tools in the registry

## 11. Generation Tools

- [x] 11.1 Implement `uuid-generator` tool using `crypto.randomUUID()` with configurable count option
- [x] 11.2 Implement `hash-generator` tool outputting MD5, SHA-1, SHA-256, SHA-512 simultaneously
- [x] 11.3 Implement `lorem-ipsum` tool with configurable word/sentence/paragraph count
- [x] 11.4 Register all generation tools in the registry

## 12. Inspection Tools

- [x] 12.1 Implement `regex-tester` tool: separate pattern input, run match, list results with positions
- [x] 12.2 Implement `text-diff` tool: accept two text inputs, render inline diff with added/removed highlighting
- [x] 12.3 Implement `jsonpath-evaluator` tool using `jsonpath-plus` library
- [x] 12.4 Register all inspection tools in the registry

## 13. AI Routing Layer

- [x] 13.1 Create `/api/ai/route.ts` API route that accepts `{ input, userCommand }` and calls OpenAI
- [x] 13.2 Design system prompt for AI route to return structured `{ toolId, correctedInput, explanation }`
- [x] 13.3 Wire natural language command bar submission to `/api/ai` fetch call
- [x] 13.4 Apply AI result: set active tool, optionally show corrected input diff before applying
- [x] 13.5 Conditionally hide command bar when `OPENAI_API_KEY` is not configured (check via `/api/config` health endpoint)

## 14. Polish & Quality

- [x] 14.1 Audit and fix all mobile responsive layouts (input/output stack, sidebar bottom sheet)
- [x] 14.2 Add keyboard shortcut: `Cmd/Ctrl+Enter` to run active tool
- [x] 14.3 Add loading states and skeleton placeholders for async operations
- [x] 14.4 Write basic unit tests for core tool `execute` functions (JSON formatter, Base64, timestamp)
- [x] 14.5 Verify all tools handle empty input gracefully (no crashes, clear empty state message)
- [x] 14.6 Final pass: dark mode color consistency, font sizes, spacing, and contrast ratios
