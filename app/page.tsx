import DevboxApp from './DevboxApp';

/**
 * Server component wrapper.
 *
 * The hidden <section> below is rendered as static HTML by the server,
 * making all tool names, descriptions, and FAQ answers fully crawlable by
 * search engines and AI assistants (Perplexity, ChatGPT, Google AI Overviews,
 * etc.) even though the interactive application is client-side only.
 *
 * `sr-only` hides it visually without using display:none (which crawlers may
 * ignore) — it is still part of the accessible, indexable DOM.
 */
export default function Home() {
  return (
    <>
      {/* ── Crawlable SEO / GEO content ─────────────────────────────────────
          Visually hidden, but present in the server-rendered HTML for
          search engines and AI crawlers.
      ─────────────────────────────────────────────────────────────────────── */}
      <section aria-label="About SmartDevBox" className="sr-only">
        <h1>SmartDevBox — Free AI-Powered Developer Toolbox</h1>
        <p>
          SmartDevBox is a free, browser-based developer toolbox at smartdevbox.com.
          Paste any text — Base64, JSON, JWT tokens, XML, SQL, URLs, Unix timestamps,
          hex strings, cron expressions, X.509 certificates, color codes, and more —
          and SmartDevBox automatically detects the format and applies the right tool.
          No sign-up required. All processing runs in the browser. 84+ tools across
          6 categories: Encoding/Decoding, Formatting, Conversion, Generation,
          Inspection, and Text.
        </p>

        <h2>Encoding and Decoding Tools</h2>
        <ul>
          <li><strong>Base64 Decode</strong> — Decode any Base64-encoded string back to plain text instantly.</li>
          <li><strong>Base64 Encode</strong> — Encode any text to Base64 format.</li>
          <li><strong>Base32 Encode / Decode</strong> — Encode or decode Base32 strings.</li>
          <li><strong>URL Encode / Decode</strong> — Percent-encode strings for use in URLs or decode them back.</li>
          <li><strong>URL Parser</strong> — Parse a URL into its protocol, host, path, query parameters, and hash fragment.</li>
          <li><strong>JWT Inspector</strong> — Decode and inspect a JWT token header and payload without needing the secret key.</li>
          <li><strong>JWT Encoder</strong> — Create signed JWT tokens using HMAC HS256, HS384, or HS512.</li>
          <li><strong>HTML Encode / Decode</strong> — Convert special characters to HTML entities and back.</li>
          <li><strong>Hex to ASCII / ASCII to Hex</strong> — Convert between hexadecimal byte strings and ASCII text.</li>
          <li><strong>Backslash Escape / Unescape</strong> — Escape or unescape backslash sequences in strings.</li>
          <li><strong>ROT13 / ROT47</strong> — Encode or decode text using ROT13 and ROT47 ciphers.</li>
          <li><strong>Base64 Image Decode</strong> — Decode a Base64 data URI and display image metadata.</li>
        </ul>

        <h2>Formatting Tools</h2>
        <ul>
          <li><strong>JSON Formatter</strong> — Pretty-print and validate JSON with configurable indentation. Highlights syntax errors with line and column numbers.</li>
          <li><strong>JSON Validate</strong> — Validate JSON syntax and report errors with precise location.</li>
          <li><strong>XML Formatter</strong> — Pretty-print and validate XML markup.</li>
          <li><strong>XML Minify</strong> — Minify XML by removing all unnecessary whitespace.</li>
          <li><strong>SQL Formatter</strong> — Format and beautify SQL queries for readability.</li>
          <li><strong>CSS Beautifier / Minify</strong> — Format or minify CSS stylesheets.</li>
          <li><strong>HTML Beautifier</strong> — Format and indent HTML markup.</li>
          <li><strong>JS Beautifier / Minifier / Validator</strong> — Format, minify, or validate JavaScript and TypeScript code.</li>
          <li><strong>Markdown Preview</strong> — Live split-pane preview of Markdown source and rendered output.</li>
        </ul>

        <h2>Conversion Tools</h2>
        <ul>
          <li><strong>JSON to CSV</strong> — Convert a JSON array of objects to CSV format.</li>
          <li><strong>JSON to TSV</strong> — Convert a JSON array to tab-separated values.</li>
          <li><strong>JSON to YAML</strong> — Convert JSON to YAML format.</li>
          <li><strong>YAML to JSON</strong> — Convert YAML back to JSON.</li>
          <li><strong>CSV to JSON</strong> — Parse CSV data into a JSON array of objects.</li>
          <li><strong>JSON to XML / XML to JSON</strong> — Convert between JSON and XML formats.</li>
          <li><strong>Markdown to HTML</strong> — Convert Markdown text to HTML.</li>
          <li><strong>HTML to Text</strong> — Strip HTML tags and extract readable plain text.</li>
          <li><strong>HTML to JSX</strong> — Convert HTML markup to React-compatible JSX.</li>
          <li><strong>JSON Escape / Unescape</strong> — Escape strings for embedding inside JSON values, or unescape them.</li>
          <li><strong>Color Converter</strong> — Convert colors between HEX, RGB, HSL, and HSV formats.</li>
          <li><strong>Number Base Converter</strong> — Convert integers between binary, octal, decimal, and hexadecimal.</li>
          <li><strong>Unix Timestamp Converter</strong> — Convert Unix timestamps to human-readable dates and times, and vice versa.</li>
          <li><strong>Date Formatter</strong> — Format dates in multiple locales and display styles.</li>
          <li><strong>Seconds to H:M:S / H:M:S to Seconds</strong> — Convert between seconds and hours:minutes:seconds notation.</li>
          <li><strong>Decimal to Roman / Roman to Decimal</strong> — Convert between decimal integers and Roman numerals.</li>
          <li><strong>UUID to Hex / Hex to UUID</strong> — Convert between standard UUID format and 32-character hex strings.</li>
        </ul>

        <h2>Generation Tools</h2>
        <ul>
          <li><strong>UUID Generator</strong> — Generate UUID v4 strings instantly.</li>
          <li><strong>ULID Generator</strong> — Generate Universally Unique Lexicographically Sortable Identifiers.</li>
          <li><strong>Hash Generator</strong> — Compute MD5, SHA-1, SHA-256, and SHA-512 hashes for any input text.</li>
          <li><strong>Random String Generator</strong> — Generate random strings with configurable character set and length.</li>
          <li><strong>Random Password Generator</strong> — Generate secure random passwords with configurable complexity.</li>
          <li><strong>Lorem Ipsum Generator</strong> — Generate placeholder Latin text by word, sentence, or paragraph count.</li>
          <li><strong>QR Code Generator</strong> — Generate QR codes from any URL or text, with PNG export.</li>
          <li><strong>Random Number Generator</strong> — Generate random integers or decimals within a custom range.</li>
          <li><strong>Random IP Generator</strong> — Generate random IPv4 addresses.</li>
          <li><strong>Random MAC Generator</strong> — Generate random MAC addresses.</li>
        </ul>

        <h2>Inspection Tools</h2>
        <ul>
          <li><strong>Regex Tester</strong> — Test regular expressions against any input text and list all matches with positions.</li>
          <li><strong>JSONPath Evaluator</strong> — Evaluate JSONPath expressions against JSON input and see matching nodes.</li>
          <li><strong>String Inspector</strong> — View detailed character, word, line, sentence, and byte statistics for any string.</li>
          <li><strong>Cron Job Parser</strong> — Parse and explain cron expressions in plain English, with next scheduled run times.</li>
          <li><strong>Certificate Decoder (X.509)</strong> — Decode and inspect PEM-encoded X.509 certificates: subject, issuer, validity, public key, and extensions.</li>
          <li><strong>HTML Preview</strong> — Live preview HTML markup in a sandboxed iframe with a split source view.</li>
        </ul>

        <h2>Text Tools</h2>
        <ul>
          <li><strong>Case Converters</strong> — Convert text to lowercase, UPPERCASE, Title Case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, or Invert Case.</li>
          <li><strong>Line Sort</strong> — Sort lines alphabetically in ascending or descending order.</li>
          <li><strong>Line Dedupe</strong> — Remove duplicate lines from any block of text.</li>
          <li><strong>Line Reverse</strong> — Reverse the order of lines.</li>
          <li><strong>Word Count</strong> — Count words, characters, lines, sentences, and paragraphs.</li>
          <li><strong>Text Reverse</strong> — Reverse all characters in the text.</li>
          <li><strong>Text Trim</strong> — Trim leading and trailing whitespace from each line.</li>
          <li><strong>Remove Empty Lines</strong> — Delete all blank lines from a text block.</li>
          <li><strong>Number Lines</strong> — Add sequential line numbers to each line.</li>
          <li><strong>Prefix / Suffix Lines</strong> — Add a custom prefix or suffix string to every line.</li>
          <li><strong>Join Lines</strong> — Join multiple lines into one with a configurable separator.</li>
          <li><strong>Extract Emails / URLs / Numbers</strong> — Extract all email addresses, URLs, or numeric values from any text.</li>
        </ul>

        <h2>Frequently Asked Questions</h2>

        <h3>How do I decode a Base64 string online?</h3>
        <p>
          Paste your Base64 string into SmartDevBox. The tool automatically detects Base64
          encoding and decodes it to plain text — no manual tool selection needed.
        </p>

        <h3>How do I decode a JWT token without a secret?</h3>
        <p>
          Paste your JWT into SmartDevBox. The JWT Inspector decodes the header and payload
          and displays them as formatted JSON. You do not need the signing secret to read the
          claims — only to verify the signature.
        </p>

        <h3>How do I format or pretty-print JSON?</h3>
        <p>
          Paste minified or unformatted JSON into SmartDevBox. The JSON Formatter detects it
          automatically and pretty-prints it with your choice of indentation level.
        </p>

        <h3>How do I convert a Unix timestamp to a human-readable date?</h3>
        <p>
          Paste a Unix timestamp (e.g. 1700000000) into SmartDevBox. The Unix Timestamp tool
          detects it and shows the equivalent date and time in UTC and your local timezone.
        </p>

        <h3>How do I convert JSON to CSV?</h3>
        <p>
          Paste a JSON array of objects into SmartDevBox and select the JSON → CSV tool.
          It produces comma-separated output with column headers derived from the JSON keys.
        </p>

        <h3>How do I compute a SHA-256 hash online?</h3>
        <p>
          Use the Hash Generator tool on SmartDevBox. Paste any input text and it computes
          MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously, entirely in the browser.
        </p>

        <h3>How do I parse and understand a cron expression?</h3>
        <p>
          Paste your cron expression (e.g. &quot;0 9 * * 1-5&quot;) into SmartDevBox. The Cron Job
          Parser explains it in plain English and lists the next scheduled run times.
        </p>

        <h3>How do I decode an X.509 certificate?</h3>
        <p>
          Paste a PEM-encoded certificate (starting with -----BEGIN CERTIFICATE-----) into
          SmartDevBox. The Certificate Decoder extracts the subject, issuer, validity period,
          public key algorithm, and all certificate extensions.
        </p>

        <h3>Does SmartDevBox send my data to a server?</h3>
        <p>
          No. All tools run entirely in the browser using client-side JavaScript. Your data
          never leaves your machine. An optional AI mode — which uses OpenAI to detect
          ambiguous input formats — can be enabled separately with your own API key.
        </p>

        <h3>Is SmartDevBox free?</h3>
        <p>
          Yes. SmartDevBox is completely free with no account or sign-up required.
        </p>
      </section>

      {/* ── Interactive application (client-rendered) ────────────────────── */}
      <DevboxApp />
    </>
  );
}
