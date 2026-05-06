## Why

Developer utility websites like base64 encoders, JSON formatters, and timestamp converters exist, but they split each tool across separate pages — users must navigate away, losing context and momentum. This project consolidates all tools into a single, AI-assisted page where the user brings data and the right tool is automatically surfaced.

## What Changes

- Introduce a new Next.js web application (the "DevBox") as the root of this repository
- Build a single-page interface with a universal input area, auto-detection, and output panel
- Implement a library of developer tools (encoding, formatting, conversion, inspection, generation)
- Add an AI routing layer that interprets natural language commands and corrects malformed input
- Provide a collapsible tool sidebar for manual tool selection and discovery

## Capabilities

### New Capabilities

- `app-shell`: Top-level Next.js app layout, theme toggle, routing scaffold, and global state
- `universal-input`: The primary input area — paste or type anything, supports drag-and-drop, auto-detects content type
- `tool-engine`: Core tool registry, execution pipeline, and result model
- `ai-routing`: AI-powered intent parsing and input correction layer
- `tool-sidebar`: Collapsible sidebar listing all tools grouped by category with search
- `output-panel`: Tabbed, syntax-highlighted output area with copy/download/diff actions
- `tools-encoding`: Base64 encode/decode, URL encode/decode, HTML entities, JWT inspector
- `tools-formatting`: JSON formatter, XML formatter, SQL formatter, CSS/HTML beautifier
- `tools-conversion`: Unix timestamp converter, color format converter, number base converter
- `tools-generation`: UUID generator, hash generator (MD5/SHA), Lorem ipsum generator
- `tools-inspection`: Regex tester, diff viewer, JSON path evaluator

### Modified Capabilities

## Impact

- New Next.js project created at repository root (or `/app` subdirectory)
- Dependencies: Next.js 14+, React 18+, Tailwind CSS, an AI SDK (e.g. Vercel AI SDK with OpenAI), syntax highlighting library (e.g. Shiki or Prism), and individual tool utility libraries
- No existing code affected — this is a greenfield build
