# SmartDevBox

**Paste anything here — SmartDevBox helps you pick the right developer tool.**

SmartDevBox is an open-source, browser-based developer toolbox for the data that
engineers handle every day: JSON, JWTs, Base64, URLs, XML, YAML, SQL,
timestamps, hashes, certificates, colors, cron expressions, IP ranges, text
snippets, and more.

Live site: https://smartdevbox.com

## Feature Walkthrough

[![Watch the SmartDevBox feature walkthrough](https://img.youtube.com/vi/Vq8spOVd59A/hqdefault.jpg)](https://www.youtube.com/watch?v=Vq8spOVd59A)

Watch the demo: https://www.youtube.com/watch?v=Vq8spOVd59A

## Why Engineers Use SmartDevBox

- **Paste-first workflow**: paste a value and SmartDevBox suggests the relevant tools instead of making you search through menus first.
- **97+ built-in tools**: encoding, decoding, formatting, conversion, generation, inspection, security helpers, networking helpers, and text utilities.
- **Client-side by default**: normal tools run in the browser, so pasted data stays on your machine.
- **Focused tool pages**: each `/tools/...` article includes a dedicated input/output panel, so users landing from search can act immediately.
- **Generator Hub**: create UUIDs, ULIDs, Nano IDs, random strings, passwords, numbers, IPs, MAC addresses, QR codes, hashes, HMACs, TOTP codes, and sample text.
- **Custom panels where they matter**: JWT signing, Markdown preview, HTML preview, QR generation, section extraction, split diff, and Smart Regex Builder get richer UI than plain text boxes.
- **Optional AI routing**: when `OPENAI_API_KEY` is configured, AI mode can help route vague commands while keeping the core toolbox fully usable without AI.
- **Plugin-friendly architecture**: bundled and user-defined tools share the same registry model.

## Common Workflows

SmartDevBox is useful when you need to:

- Decode Base64 from logs, HTTP headers, Kubernetes secrets, or API payloads.
- Inspect JWT claims and sign test JWTs for local development.
- Format, validate, and convert JSON, YAML, XML, CSV, TOML, SQL, HTML, CSS, and JavaScript.
- Convert Unix timestamps, date strings, colors, number bases, Roman numerals, UUID hex values, and time durations.
- Parse URLs, HTTP status codes, CIDR blocks, IP addresses, cron expressions, X.509 certificates, MongoDB ObjectIDs, ULIDs, semver ranges, and `.env` files.
- Extract emails, URLs, numbers, structured sections, or other useful text from messy input.
- Generate hashes, HMAC signatures, TOTP codes, UUIDs, random passwords, and QR codes.
- Build and test regex patterns from real sample text.

For the complete inventory, see [docs/functionality.md](docs/functionality.md).

## Feature Areas

| Area | Examples |
|---|---|
| Encoding / Decoding | Base64, Base32, URL, HTML entities, hex, ROT13/ROT47, JWT inspection, LZ-String |
| Formatting | JSON, XML, SQL, CSS, HTML, JavaScript, Markdown preview |
| Conversion | JSON ↔ YAML/XML/CSV, CSV to JSON, HTML to JSX/text, color conversion, timestamps, TOML |
| Generation | UUID, ULID, Nano ID, hashes, HMAC, TOTP, random passwords, QR codes |
| Inspection | Regex, JSONPath, strings, cron, certificates, ObjectIDs, ULIDs, semver, CIDR, IPs, HTTP codes |
| Text | Case conversion, sorting, dedupe, trimming, line numbering, extraction, reverse/invert |
| Plugins | Bundled plugin JSON plus user-defined detector and generator plugins |

## Privacy Model

Most SmartDevBox tools execute entirely in the browser. Text files are read with
`FileReader`; they are not uploaded to a server. Optional AI routing is disabled
unless `OPENAI_API_KEY` is configured, and selected tools still run on the full
browser-side input.

Current client-side limits:

- Large input warning above `1 MB`.
- Text file load limit of `5 MB`.
- Optional AI routing sends only the first `8,000` characters to `/api/ai`.

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Zustand for persisted UI state
- Tailwind CSS plus global CSS design tokens
- Jest and ts-jest for unit tests
- Playwright for browser smoke tests
- OpenNext and Wrangler for Cloudflare builds/deploys
- Optional OpenAI routing through `OPENAI_API_KEY`

## Local Development

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open http://localhost:3000.

Daily validation:

```bash
npm run check        # typecheck + lint + unit tests
npm run test:e2e     # Playwright browser smoke tests
npm run build        # production Next.js build
```

Cloudflare/OpenNext build:

```bash
npm run build:cloudflare
```

The Playwright config uses `/usr/bin/google-chrome` when present. On machines
without a system Chrome/Chromium install, run this once before `npm run test:e2e`:

```bash
npx playwright install chromium
```

Make targets are also available:

```bash
make dev
make check
make test
make test-e2e
make typecheck
make lint
```

## Optional Environment

Create `.env.local` for optional settings:

```bash
OPENAI_API_KEY=...
```

When `OPENAI_API_KEY` is absent, AI routing is disabled and the core toolbox
still works.

## Project Structure

- `app/` — App Router pages, API routes, metadata, and the `DevboxApp` client shell.
- `components/tools/` — main tool UI panels and special-purpose tool panels.
- `components/layout/` — navbar and theme provider.
- `lib/tools/` — tool registry, shared types, and category implementations.
- `store/devbox.ts` — central Zustand state for input, detection, outputs, history, UI preferences, plugins, recents, and pins.
- `plugins/` — bundled plugin JSON files.
- `e2e/` — Playwright smoke tests.
- `docs/` — product behavior and tool functionality references.
- `openspec/` — historical feature specs and task docs.

## Adding A Standard Tool

Register a tool in the relevant `lib/tools/<category>/index.ts` file:

```ts
registerTool({
  id,
  name,
  category,
  description,
  keywords,
  detect(input): number {
    return 0;
  },
  execute(input, options) {
    return { output: input, outputLanguage: 'text' };
  },
});
```

Tool definitions automatically feed the sidebar, command palette, detection
engine, and article-page runner when the tool is compatible with a simple
input/output flow.

For custom panels, add the panel under `components/tools/` and register it in
`CUSTOM_PANELS` inside `app/DevboxApp.tsx`.

## Contributing

Issues, feature ideas, and pull requests are welcome. Good contributions tend to
be small and focused:

- Add a missing everyday developer tool.
- Improve detection confidence for a common pasted format.
- Make an existing tool handle edge cases more safely.
- Add browser smoke coverage for user-facing flows.
- Improve docs and examples for engineers landing from search.

Before opening a pull request, run:

```bash
npm run check
npm run test:e2e
npm run build
```
