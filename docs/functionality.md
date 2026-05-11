# SmartDevBox — Tool Functionality Reference

Complete inventory of all tools, their IDs, categories, and what they do.

---

## Encoding / Decoding

| ID | Name | Description |
|---|---|---|
| `base64-encode` | Base64 Encode | Encodes text to Base64 |
| `base64-decode` | Base64 Decode | Decodes Base64 to plain text |
| `url-encode` | URL Encode | Percent-encodes a string for use in URLs |
| `url-decode` | URL Decode | Decodes a percent-encoded URL string |
| `jwt-inspector` | JWT Inspector | Decodes and displays JWT header + payload (no signature verification) |
| `jwt-encoder` | JWT Encoder | Builds and signs a JWT from user-supplied header/payload/secret (special panel) |
| `html-encode` | HTML Encode | Converts special characters to HTML entities |
| `html-decode` | HTML Decode | Converts HTML entities back to characters |
| `hex-to-ascii` | Hex to ASCII | Converts a hex string to ASCII text |
| `ascii-to-hex` | ASCII to Hex | Converts ASCII text to hex representation |
| `backslash-escape` | Backslash Escape | Escapes special characters with backslashes |
| `backslash-unescape` | Backslash Unescape | Removes backslash escaping |
| `rot13` | ROT13 | Applies ROT13 cipher to text |
| `rot47` | ROT47 | Applies ROT47 cipher (printable ASCII range) |
| `base32-encode` | Base32 Encode | Encodes text to Base32 |
| `base32-decode` | Base32 Decode | Decodes Base32 to plain text |
| `url-parser` | URL Parser | Breaks a URL into its components (protocol, host, path, params, etc.) |
| `base64-image-decode` | Base64 Image Decode | Decodes a Base64 data URI and renders the image |

---

## Formatting

| ID | Name | Description |
|---|---|---|
| `json-formatter` | JSON Formatter | Pretty-prints JSON with configurable indentation |
| `xml-formatter` | XML Formatter | Pretty-prints XML |
| `sql-formatter` | SQL Formatter | Formats SQL queries with proper indentation and keyword casing |
| `css-beautifier` | CSS Beautifier | Formats and indents CSS |
| `html-beautifier` | HTML Beautifier | Pretty-prints HTML markup |
| `js-beautifier` | JS Beautifier | Formats JavaScript/TypeScript code |
| `js-minifier` | JS Minifier | Minifies JavaScript code |
| `markdown-preview` | Markdown Preview | Live side-by-side Markdown-to-HTML preview (special panel) |
| `json-validate` | JSON Validate | Validates JSON and reports parse errors with line/column info |
| `js-validate` | JS Validate | Validates JavaScript syntax |
| `xml-minify` | XML Minify | Removes whitespace from XML |
| `css-minify` | CSS Minify | Removes whitespace from CSS |

---

## Conversion

| ID | Name | Description |
|---|---|---|
| `json-to-csv` | JSON to CSV | Converts a JSON array of objects to CSV |
| `json-to-tsv` | JSON to TSV | Converts a JSON array of objects to TSV |
| `json-to-yaml` | JSON to YAML | Converts JSON to YAML format |
| `date-formatter` | Date Formatter | Parses and reformats date strings between common formats |
| `unix-timestamp` | Unix Timestamp | Converts between Unix timestamps and human-readable dates |
| `color-converter` | Color Converter | Converts colors between HEX, RGB, HSL, and HSV |
| `number-base-converter` | Number Base Converter | Converts numbers between binary, octal, decimal, and hex |
| `yaml-to-json` | YAML to JSON | Converts YAML to JSON |
| `csv-to-json` | CSV to JSON | Converts CSV to a JSON array of objects |
| `html-to-jsx` | HTML to JSX | Converts HTML to JSX-compatible syntax |
| `json-escape` | JSON Escape | Escapes a string for safe embedding inside a JSON value |
| `json-unescape` | JSON Unescape | Unescapes JSON-encoded string escapes |
| `xml-to-json` | XML to JSON | Converts XML to a JSON representation |
| `json-to-xml` | JSON to XML | Converts JSON to XML |
| `markdown-to-html` | Markdown to HTML | Converts Markdown source to raw HTML |
| `html-to-text` | HTML to Text | Strips HTML tags and returns plain text |
| `seconds-to-hms` | Seconds to H:M:S | Converts a number of seconds to H:M:S format |
| `hms-to-seconds` | H:M:S to Seconds | Converts H:M:S notation to total seconds |
| `decimal-to-roman` | Decimal to Roman | Converts a decimal integer to Roman numerals |
| `roman-to-decimal` | Roman to Decimal | Converts Roman numerals to a decimal integer |
| `uuid-hex-converter` | UUID ↔ Hex | Converts between UUID format and raw hex string |

---

## Generation

These tools produce output without requiring user input and are shown in the **GeneratorBar**.

| ID | Name | Description |
|---|---|---|
| `uuid-generator` | UUID Generator | Generates a random UUID v4 |
| `hash-generator` | Hash Generator | Computes MD5, SHA-1, SHA-256, SHA-512 hashes of input text |
| `random-string` | Random String | Generates a random string with configurable length and character set |
| `lorem-ipsum` | Lorem Ipsum | Generates placeholder Lorem Ipsum text |
| `ulid-generator` | ULID Generator | Generates a random ULID |
| `qr-code` | QR Code | Generates a QR code from text or URL (special panel) |
| `random-number` | Random Number | Generates a random number within a configurable range |
| `random-password` | Random Password | Generates a secure random password |
| `random-ip` | Random IP | Generates a random IPv4 address |
| `random-mac` | Random MAC | Generates a random MAC address |

---

## Inspection

| ID | Name | Description |
|---|---|---|
| `regex-tester` | Regex Tester | Tests a regular expression against input text; highlights matches |
| `jsonpath-evaluator` | JSONPath Evaluator | Evaluates a JSONPath expression against a JSON document |
| `string-inspector` | String Inspector | Shows character counts, byte size, encoding analysis, and character breakdown |
| `cron-parser` | Cron Parser | Parses a cron expression and lists the next N scheduled times |
| `cert-decoder` | Cert Decoder | Decodes a PEM X.509 certificate and displays its fields |
| `html-preview` | HTML Preview | Renders HTML in a sandboxed iframe (special panel) |

---

## Text

| ID | Name | Description |
|---|---|---|
| `lowercase` | Lowercase | Converts text to all lowercase |
| `uppercase` | Uppercase | Converts text to all uppercase |
| `title-case` | Title Case | Capitalizes the first letter of each word |
| `camel-case` | camelCase | Converts text to camelCase |
| `pascal-case` | PascalCase | Converts text to PascalCase |
| `snake-case` | snake_case | Converts text to snake_case |
| `kebab-case` | kebab-case | Converts text to kebab-case |
| `constant-case` | CONSTANT_CASE | Converts text to CONSTANT_CASE |
| `line-sort` | Sort Lines | Sorts lines alphabetically (ascending or descending) |
| `line-dedupe` | Deduplicate Lines | Removes duplicate lines |
| `line-reverse` | Reverse Lines | Reverses the order of lines |
| `word-count` | Word Count | Counts words, characters, lines, and sentences |
| `text-reverse` | Reverse Text | Reverses the entire string character by character |
| `text-trim` | Trim Whitespace | Trims leading and trailing whitespace from each line |
| `remove-empty-lines` | Remove Empty Lines | Strips blank lines from text |
| `number-lines` | Number Lines | Prefixes each line with its line number |
| `prefix-lines` | Prefix Lines | Adds a custom prefix to every line |
| `suffix-lines` | Suffix Lines | Adds a custom suffix to every line |
| `join-lines` | Join Lines | Joins all lines with a configurable separator |
| `extract-emails` | Extract Emails | Extracts all email addresses from text |
| `extract-urls` | Extract URLs | Extracts all URLs from text |
| `extract-numbers` | Extract Numbers | Extracts all numbers from text |
| `extract-sections` | Extract Sections | Extracts structured sections/blocks from text |
| `invert-case` | Invert Case | Swaps uppercase ↔ lowercase for each character |

---

## Adding a New Tool

1. Choose the appropriate category directory under `lib/tools/`.
2. Call `registerTool({ id, name, category, description, keywords, detect, execute })` in that category's `index.ts`.
3. The tool is automatically available in the sidebar, Command Palette, and detection engine — no other registration needed.

### `detect(input): number`
Return a confidence score 0–1. Use content analysis (e.g. try `JSON.parse`, check regex patterns) to determine fit. Return `0` if the input clearly does not match.

### `execute(input, options?): ToolResult`
Return `{ output: string, outputType?, error? }`. Always handle exceptions and return `{ output: '', error: message }` on failure.

### Generator tools
Set `detect` to always return `0` (generators ignore input). Add the tool ID to the `GeneratorBar` component if it should appear in the generator strip.

### Special panels
If the tool needs a custom UI (not textarea-in/text-out), add a lazy-loaded component and register it in `DevboxApp.tsx`'s special panel switch.
