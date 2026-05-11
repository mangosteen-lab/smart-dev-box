# SmartDevBox — UI Logic & Behavior Reference

Describes how the UI is structured, how state flows through it, and the behavioral rules governing each major component.

---

## Layout Overview

```
┌─ Navbar ─────────────────────────────────────────────────────┐
│  traffic-light dots | title | ⌘K button | theme toggle       │
├─ ToolSidebar ──┬─ Main Content Area ──────────────────────────┤
│                │  GeneratorBar                                 │
│  categories    │  DetectionBar                                 │
│  + tools       │  ┌─ ResizablePanels ──────────────────────┐  │
│                │  │  UniversalInput   │   OutputPanel       │  │
│                │  └───────────────────────────────────────────┘  │
└────────────────┴──────────────────────────────────────────────┘
```

On mobile the sidebar becomes a drawer (`mobileSidebarOpen`).  
Special-panel tools replace the `ResizablePanels` section with their own full-width UI.

---

## Navbar (`components/layout/Navbar.tsx`)

### Traffic-light dots (macOS-style)
| Dot | Color | Action |
|---|---|---|
| Close | Red | Clears current input (`setInput('')`, `clearOutputs()`) |
| Minimize | Yellow | Toggles sidebar mini mode (`toggleSidebarMini()`) |
| Expand | Green | Toggles sidebar open/closed (`toggleSidebar()`) |

### Other controls
- **Title**: Clicking navigates to home / resets state
- **⌘K button**: Opens Command Palette (`setCommandPaletteOpen(true)`)
- **Theme toggle**: Calls `toggleTheme()` in the store; persisted to localStorage
- **Hamburger (mobile only)**: Opens mobile sidebar drawer (`toggleMobileSidebar()`)

---

## ToolSidebar (`components/tools/ToolSidebar.tsx`)

### Three display modes
| Mode | Condition | Appearance |
|---|---|---|
| Full | `sidebarOpen && !sidebarMini` | Category headers + full tool names |
| Mini | `sidebarOpen && sidebarMini` | Icon strip with abbreviated tool labels |
| Hidden | `!sidebarOpen` | Sidebar not rendered (desktop) |
| Mobile drawer | `mobileSidebarOpen` | Full sidebar as overlay drawer |

### Features
- **Category collapsing**: Each category section is independently collapsible; state is local (not persisted).
- **Search filter**: Text input at the top filters tools by name in real time.
- **Pin toggle**: Each tool has a pin icon; clicking calls `togglePinnedTool(toolId)`. Pinned tools float to the top of the list.
- **Active highlight**: The tool matching `activeToolId` is highlighted.
- **Tool selection**: Clicking a tool sets `activeToolId` and adds it to `recentToolIds` via `addRecentTool(toolId)`.

---

## UniversalInput (`components/tools/UniversalInput.tsx`)

### Input flow
1. User types → `setInput(value)` updates store.
2. A **600ms debounce** triggers `runDetection(input)`.
3. Detection results are stored via `setDetectionResults(results)`.
4. The top-scoring tool's ID is set as `activeToolId` (if confidence > threshold).
5. `executeTool(activeToolId, input)` runs and result is stored via `addOutput(output)`.

### AI Command Bar
- Visible only when `aiEnabled === true`.
- User types a natural-language command (e.g. "format this as JSON").
- On submit: sets `isAiLoading = true`, `POST /api/ai` with `{ input, userMessage }`.
- On response: updates `activeToolId` and optionally replaces `input` with `correctedInput`.
- On error or completion: sets `isAiLoading = false`.

### Keyboard shortcuts
- **⌘K / Ctrl+K**: Opens Command Palette from anywhere in the app (global listener).
- **Tab**: Accepts top detection suggestion (sets `activeToolId` to top result).

---

## DetectionBar (`components/tools/DetectionBar.tsx`)

- Renders a horizontal strip of chips, one per `DetectionResult` above the confidence threshold.
- Each chip shows the tool name and confidence percentage.
- Clicking a chip sets `activeToolId` to that tool and immediately executes it.
- The currently active tool's chip is highlighted.

---

## OutputPanel (`components/tools/OutputPanel.tsx`)

### Output rendering
- Plain text output: rendered in a `<pre>` block.
- Typed output (`json`, `xml`, `sql`, `css`, `html`, `diff`): syntax-highlighted via **Shiki** (lazy-loaded on first use).

### Action buttons
| Button | Behavior |
|---|---|
| Copy | Copies output text to clipboard |
| Download | Downloads output as a file; filename uses `outputExtension` from the tool definition |
| Use as Input | Sets `input` to the current output string, triggering re-detection |

### Error display
If `result.error` is set, the panel renders the error message styled as an error state instead of output.

---

## GeneratorBar (`components/tools/GeneratorBar.tsx`)

- Renders one-click buttons for all generator tools (tools that produce output without input).
- Clicking a button:
  1. Sets `activeToolId` to that generator's ID.
  2. Calls `executeTool(id, '')` immediately.
  3. Stores result via `addOutput(output)`.
- Visible above the main input/output area at all times.

---

## ResizablePanels (`components/ResizablePanels.tsx`)

- Splits `UniversalInput` and `OutputPanel` horizontally on desktop.
- A draggable divider handle supports both **mouse** and **touch** events.
- Minimum width enforced for each panel to prevent collapse.
- Panel sizes are stored in local component state (not persisted).

---

## Command Palette (`components/CommandPalette.tsx`)

- Opened with **⌘K** / **Ctrl+K** or by clicking the navbar button.
- **Search order**: Pinned tools → Recent tools → all tools (alphabetical).
- Search matches against `name`, `description`, and `keywords`.
- Selecting a tool: closes palette, sets `activeToolId`, adds to recents, executes tool against current input.
- Keyboard navigation: ↑/↓ arrows, Enter to select, Escape to close.

---

## Special Panels

Special-panel tools bypass `UniversalInput` + `OutputPanel` entirely. They are lazy-loaded and rendered full-width when `activeToolId` matches their ID.

| Tool ID | Panel behavior |
|---|---|
| `jwt-encoder` | Multi-field form (header JSON, payload JSON, algorithm, secret); encodes on change |
| `markdown-preview` | Split view: left = editable markdown source, right = live HTML preview |
| `html-preview` | Textarea for HTML source + sandboxed `<iframe>` preview |
| `qr-code` | Text input + rendered QR code image + download button |
| `extractor` | Multi-mode structured data extraction with output table |
| `split-diff` | Two text areas side-by-side with diff highlighting |

---

## Theme System

- Default theme: **dark** (`isDark: true` initial state).
- CSS custom properties defined on `:root` and overridden for light mode.
- `toggleTheme()` flips `isDark`; ThemeProvider in `app/layout.tsx` applies the corresponding class to `<html>`.
- Persisted to localStorage via Zustand `persist` middleware.

---

## Persistence (localStorage)

The following state fields are persisted across sessions:

- `isDark`
- `sidebarOpen`
- `sidebarMini`
- `recentToolIds`
- `pinnedToolIds`
- `aiEnabled`
- `history`

Fields **not** persisted (reset on page load):
- `input`
- `outputs`
- `activeToolId`
- `detectionResults`
- `isAiLoading`
- `mobileSidebarOpen`

---

## Detection Confidence Thresholds

| Threshold | Behavior |
|---|---|
| `> 0.8` | Auto-executes and sets as active tool |
| `> 0.3` | Shown as a chip in DetectionBar |
| `≤ 0.3` | Filtered out, not shown |

*(Exact values are defined in `lib/tools/registry.ts` and `components/tools/DetectionBar.tsx`.)*

---

## Execution Lifecycle (summary)

```
User types
  └─ setInput()
       └─ [600ms debounce]
            └─ runDetection(input) → setDetectionResults()
                 └─ top result confidence > threshold?
                      ├─ YES → setActiveToolId() → executeTool() → addOutput()
                      └─ NO  → clear activeToolId

User clicks DetectionBar chip / sidebar tool / Command Palette result
  └─ setActiveToolId(id) → executeTool(id, input) → addOutput()

User clicks "Use as Input"
  └─ setInput(output.result.output) → [triggers detection flow above]
```
