import type { Metadata } from 'next';
import Link from 'next/link';
import { RelatedArticles } from '@/components/features/RelatedArticles';

/* ── Tool data ────────────────────────────────────────────────────────────── */

const TOOLS: Array<{
  id: string;
  category: string;
  description: string;
  tools: Array<{ name: string; desc: string; slug?: string }>;
}> = [
  {
    id: 'encoding',
    category: 'Encoding & Decoding',
    description: 'Encode and decode between common formats used in web development, APIs, and data transfer.',
    tools: [
      { name: 'Base64 Encode',        desc: 'Encode any text to Base64 format.',                                          slug: 'base64-encoder' },
      { name: 'Base64 Decode',        desc: 'Decode Base64-encoded strings back to plain text.',                          slug: 'base64-decoder' },
      { name: 'Base32 Encode',        desc: 'Encode text to Base32 (RFC 4648).',                                          slug: 'base32-encoder' },
      { name: 'Base32 Decode',        desc: 'Decode Base32 strings to plain text.',                                       slug: 'base32-decoder' },
      { name: 'URL Encode',           desc: 'Percent-encode a string for safe use in URLs.',                              slug: 'url-encoder' },
      { name: 'URL Decode',           desc: 'Decode a percent-encoded URL string.',                                       slug: 'url-decoder' },
      { name: 'URL Parser',           desc: 'Break a URL into protocol, host, path, query parameters, and fragment.',    slug: 'url-parser' },
      { name: 'JWT Inspector',        desc: 'Decode a JWT and display header + payload as JSON — no secret required.',   slug: 'jwt-decoder' },
      { name: 'JWT Encoder',          desc: 'Build and sign JWT tokens using HMAC HS256, HS384, or HS512.',               slug: 'jwt-encoder' },
      { name: 'HTML Encode',          desc: 'Convert special characters to HTML entities.',                               slug: 'html-encoder' },
      { name: 'HTML Decode',          desc: 'Convert HTML entities back to characters.',                                  slug: 'html-decoder' },
      { name: 'Hex to ASCII',         desc: 'Convert a hexadecimal byte string to ASCII text.',                          slug: 'hex-to-ascii' },
      { name: 'ASCII to Hex',         desc: 'Convert ASCII text to hexadecimal representation.',                         slug: 'ascii-to-hex' },
      { name: 'Backslash Escape',     desc: 'Escape special characters with backslash sequences.',                       slug: 'backslash-escape' },
      { name: 'Backslash Unescape',   desc: 'Remove backslash escaping from a string.',                                  slug: 'backslash-unescape' },
      { name: 'ROT13',                desc: 'Apply or reverse the ROT13 cipher.',                                        slug: 'rot13' },
      { name: 'ROT47',                desc: 'Apply or reverse ROT47 (full printable ASCII range).',                      slug: 'rot47' },
      { name: 'Base64 Image Decode',  desc: 'Decode a Base64 data URI and display the embedded image.',                  slug: 'base64-image-decoder' },
    ],
  },
  {
    id: 'formatting',
    category: 'Formatting',
    description: 'Beautify, minify, and validate code and markup for readability or production.',
    tools: [
      { name: 'JSON Formatter',   desc: 'Pretty-print JSON with configurable indentation. Highlights syntax errors with line and column.',  slug: 'json-formatter' },
      { name: 'JSON Validate',    desc: 'Validate JSON syntax and report exact error location.',                                            slug: 'json-validator' },
      { name: 'XML Formatter',    desc: 'Pretty-print and indent XML markup.',                                                              slug: 'xml-formatter' },
      { name: 'XML Minify',       desc: 'Remove all whitespace from XML for compact transmission.',                                        slug: 'xml-minifier' },
      { name: 'SQL Formatter',    desc: 'Format SQL queries with proper keyword casing and indentation.',                                   slug: 'sql-formatter' },
      { name: 'CSS Beautifier',   desc: 'Indent and format CSS stylesheets for readability.',                                              slug: 'css-formatter' },
      { name: 'CSS Minify',       desc: 'Remove whitespace from CSS for production use.',                                                  slug: 'css-minifier' },
      { name: 'HTML Beautifier',  desc: 'Pretty-print and indent HTML markup.',                                                            slug: 'html-formatter' },
      { name: 'JS Beautifier',    desc: 'Format JavaScript and TypeScript code.',                                                          slug: 'javascript-formatter' },
      { name: 'JS Minifier',      desc: 'Minify JavaScript for production bundles.',                                                       slug: 'javascript-minifier' },
      { name: 'JS Validate',      desc: 'Validate JavaScript syntax and report errors.',                                                   slug: 'javascript-validator' },
      { name: 'Markdown Preview', desc: 'Live split-pane Markdown editor with side-by-side rendered HTML.',                               slug: 'markdown-preview' },
    ],
  },
  {
    id: 'conversion',
    category: 'Conversion',
    description: 'Convert data between formats, time representations, number systems, and markup languages.',
    tools: [
      { name: 'JSON to CSV',             desc: 'Convert a JSON array of objects to comma-separated values.',              slug: 'json-to-csv' },
      { name: 'JSON to TSV',             desc: 'Convert a JSON array to tab-separated values.',                           slug: 'json-to-tsv' },
      { name: 'JSON to YAML',            desc: 'Convert JSON to YAML format.',                                            slug: 'json-to-yaml' },
      { name: 'JSON to XML',             desc: 'Convert a JSON object to XML representation.',                            slug: 'json-to-xml' },
      { name: 'YAML to JSON',            desc: 'Convert YAML back to JSON.',                                              slug: 'yaml-to-json' },
      { name: 'CSV to JSON',             desc: 'Parse CSV (with headers) to a JSON array of objects.',                   slug: 'csv-to-json' },
      { name: 'XML to JSON',             desc: 'Convert XML markup to a JSON representation.',                           slug: 'xml-to-json' },
      { name: 'Markdown to HTML',        desc: 'Convert Markdown source to raw HTML.',                                   slug: 'markdown-to-html' },
      { name: 'HTML to Text',            desc: 'Strip HTML tags and extract clean readable text.',                       slug: 'html-to-text' },
      { name: 'HTML to JSX',             desc: 'Convert HTML markup to React-compatible JSX syntax.',                   slug: 'html-to-jsx' },
      { name: 'JSON Escape',             desc: 'Escape a string for safe embedding inside a JSON value.',                slug: 'json-escape' },
      { name: 'JSON Unescape',           desc: 'Unescape JSON-encoded string escapes.',                                  slug: 'json-unescape' },
      { name: 'Color Converter',         desc: 'Convert colors between HEX, RGB, HSL, and HSV.',                        slug: 'color-converter' },
      { name: 'Number Base Converter',   desc: 'Convert integers between binary, octal, decimal, and hex.',             slug: 'number-base-converter' },
      { name: 'Unix Timestamp',          desc: 'Convert Unix timestamps to human-readable dates and vice versa.',        slug: 'unix-timestamp-converter' },
      { name: 'Date Formatter',          desc: 'Parse and reformat date strings across common locales and styles.',      slug: 'date-formatter' },
      { name: 'Seconds to H:M:S',        desc: 'Convert a number of seconds to hours:minutes:seconds.',                 slug: 'seconds-to-hms' },
      { name: 'H:M:S to Seconds',        desc: 'Convert H:M:S notation to total seconds.',                              slug: 'hms-to-seconds' },
      { name: 'Decimal to Roman',        desc: 'Convert a decimal integer to Roman numerals.',                          slug: 'decimal-to-roman' },
      { name: 'Roman to Decimal',        desc: 'Convert Roman numerals to a decimal integer.',                          slug: 'roman-to-decimal' },
      { name: 'UUID ↔ Hex',             desc: 'Convert between standard UUID format and 32-character hex strings.',    slug: 'uuid-hex-converter' },
    ],
  },
  {
    id: 'generation',
    category: 'Generation',
    description: 'Generate random values, identifiers, hashes, and placeholder content on demand.',
    tools: [
      { name: 'UUID v4 Generator',       desc: 'Generate cryptographically random UUID v4 identifiers.',                  slug: 'uuid-generator' },
      { name: 'ULID Generator',          desc: 'Generate Universally Unique Lexicographically Sortable Identifiers.',     slug: 'ulid-generator' },
      { name: 'Hash Generator',          desc: 'Compute MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously.',         slug: 'hash-generator' },
      { name: 'Random String Generator', desc: 'Generate random strings with configurable alphabet and length.',          slug: 'random-string-generator' },
      { name: 'Random Password',         desc: 'Generate secure random passwords with configurable complexity.',          slug: 'random-password-generator' },
      { name: 'Lorem Ipsum Generator',   desc: 'Generate placeholder Latin text by word, sentence, or paragraph count.', slug: 'lorem-ipsum-generator' },
      { name: 'QR Code Generator',       desc: 'Generate QR codes from any URL or text, with PNG download.',             slug: 'qr-code-generator' },
      { name: 'Random Number',           desc: 'Generate random integers or decimals within a custom range.',             slug: 'random-number-generator' },
      { name: 'Random IP Generator',     desc: 'Generate random IPv4 addresses.',                                         slug: 'random-ip-generator' },
      { name: 'Random MAC Generator',    desc: 'Generate random MAC addresses.',                                          slug: 'random-mac-generator' },
      { name: 'HMAC Generator',          desc: 'Generate HMAC-SHA256/384/512 signatures for API signing and webhook verification.', slug: 'hmac-generator' },
      { name: 'TOTP Generator',          desc: 'Generate Time-based One-Time Passwords (RFC 6238) for debugging 2FA flows.', slug: 'totp-generator' },
      { name: 'Nano ID Generator',       desc: 'Generate compact, URL-safe Nano IDs — a modern UUID alternative.',        slug: 'nanoid-generator' },
      { name: 'Regex Generator',         desc: 'Build regex patterns from selected sample text with snippets for JS, Python, Java, C#, C++, Go, Ruby, grep, and PHP.', slug: 'regex-generator' },
    ],
  },
  {
    id: 'inspection',
    category: 'Inspection',
    description: 'Analyse, query, and decode structured data to understand it at a deeper level.',
    tools: [
      { name: 'Regex Tester',              desc: 'Test regular expressions against input and list all matches with positions.',             slug: 'regex-tester' },
      { name: 'JSONPath Evaluator',        desc: 'Evaluate JSONPath expressions against JSON and display matching nodes.',                  slug: 'jsonpath-evaluator' },
      { name: 'String Inspector',          desc: 'View character, word, line, sentence, and byte statistics for any string.',              slug: 'string-inspector' },
      { name: 'Cron Job Parser',           desc: 'Parse cron expressions in plain English with next N scheduled run times.',               slug: 'cron-parser' },
      { name: 'Certificate Decoder',       desc: 'Decode PEM X.509 certificates: subject, issuer, validity, public key, SANs.',           slug: 'certificate-decoder' },
      { name: 'HTML Preview',              desc: 'Live preview HTML in a sandboxed iframe alongside the source editor.',                   slug: 'html-preview' },
      { name: 'CIDR / Subnet Calculator',  desc: 'Calculate subnet details from CIDR notation: network, broadcast, host range, mask.',     slug: 'cidr-calculator' },
      { name: 'IP Address Inspector',      desc: 'Inspect an IPv4 or IPv6 address: class, type, private/public, binary representation.',   slug: 'ip-inspector' },
      { name: 'HTTP Status Reference',     desc: 'Look up any HTTP status code: phrase, meaning, and usage notes.',                        slug: 'http-status-reference' },
    ],
  },
  {
    id: 'text',
    category: 'Text',
    description: 'Transform, analyse, and manipulate plain text lines and strings.',
    tools: [
      { name: 'Lowercase',         desc: 'Convert all text to lowercase.' },
      { name: 'Uppercase',         desc: 'Convert all text to UPPERCASE.' },
      { name: 'Title Case',        desc: 'Capitalise the first letter of every word.' },
      { name: 'camelCase',         desc: 'Convert text to camelCase.' },
      { name: 'PascalCase',        desc: 'Convert text to PascalCase.' },
      { name: 'snake_case',        desc: 'Convert text to snake_case.' },
      { name: 'kebab-case',        desc: 'Convert text to kebab-case.' },
      { name: 'CONSTANT_CASE',     desc: 'Convert text to CONSTANT_CASE.' },
      { name: 'Invert Case',       desc: 'Swap the case of every character.' },
      { name: 'Line Sort',         desc: 'Sort lines alphabetically ascending or descending.' },
      { name: 'Line Dedupe',       desc: 'Remove duplicate lines from a text block.' },
      { name: 'Line Reverse',      desc: 'Reverse the order of lines.' },
      { name: 'Word Count',        desc: 'Count words, characters, lines, sentences, and paragraphs.' },
      { name: 'Text Reverse',      desc: 'Reverse all characters in the text.' },
      { name: 'Text Trim',         desc: 'Trim leading and trailing whitespace from each line.' },
      { name: 'Remove Empty Lines', desc: 'Delete all blank lines from a text block.' },
      { name: 'Number Lines',      desc: 'Prefix each line with its sequential line number.' },
      { name: 'Prefix Lines',      desc: 'Add a custom prefix string to every line.' },
      { name: 'Suffix Lines',      desc: 'Add a custom suffix string to every line.' },
      { name: 'Join Lines',        desc: 'Join multiple lines into one with a configurable separator.' },
      { name: 'Extract Emails',    desc: 'Extract all email addresses from any block of text.' },
      { name: 'Extract URLs',      desc: 'Extract all URLs from any block of text.' },
      { name: 'Extract Numbers',   desc: 'Extract all numeric values from any block of text.' },
      { name: 'Split & Diff',      desc: 'Side-by-side visual diff of two text inputs with line-level highlighting.' },
    ],
  },
];

const TOTAL = TOOLS.reduce((sum, cat) => sum + cat.tools.length, 0);
const CATEGORY_NAMES = TOOLS.map((c) => c.category).join(', ');

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: `${TOTAL}+ Built-in Developer Tools — Complete List | SmartDevBox`,
  description:
    `SmartDevBox ships with ${TOTAL} free, browser-based developer tools across 6 categories: ${CATEGORY_NAMES}. ` +
    `Every tool runs entirely client-side — no sign-up, no install, no data sent to a server.`,
  keywords: [
    'developer tools list',
    'online developer toolbox',
    'free developer tools no sign up',
    'client-side developer tools',
    'base64 encoder decoder online',
    'json formatter online',
    'jwt decoder online',
    'hash generator online',
    'unix timestamp converter',
    'url encoder decoder online',
    'xml formatter online',
    'css minifier online',
    'regex tester online',
    'all-in-one dev tools',
  ],
  alternates: { canonical: 'https://smartdevbox.com/features/tools' },
  openGraph: {
    title: `${TOTAL}+ Built-in Developer Tools | SmartDevBox`,
    description:
      `Complete list of every tool in SmartDevBox: encoding, formatting, conversion, generation, inspection, and text — ` +
      `all ${TOTAL} tools are free and run entirely in your browser.`,
    url: 'https://smartdevbox.com/features/tools',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TOTAL}+ Built-in Developer Tools | SmartDevBox`,
    description:
      `${TOTAL} free, browser-based developer tools across 6 categories. No sign-up. No install. 100% client-side.`,
  },
};

/* ── JSON-LD structured data ──────────────────────────────────────────────── */

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: `SmartDevBox — ${TOTAL} Built-in Developer Tools`,
  description: `Complete list of all ${TOTAL} developer tools available in SmartDevBox, grouped by category.`,
  url: 'https://smartdevbox.com/features/tools',
  numberOfItems: TOTAL,
  itemListElement: TOOLS.flatMap((cat, ci) =>
    cat.tools.map((tool, ti) => ({
      '@type': 'ListItem',
      position: ci * 100 + ti + 1,
      name: tool.name,
      description: tool.desc,
    })),
  ),
};

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function ToolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Article ──────────────────────────────────────────────────────── */}
      <article className="feat-article" itemScope itemType="https://schema.org/WebPage">
        <div className="feat-hero">
          <div className="feat-eyebrow">
            <span className="feat-eyebrow-dot" />
            Complete Reference
          </div>
          <h1 className="feat-h1" itemProp="name">{TOTAL}+ Built-in Developer Tools</h1>
          <p className="feat-lead" itemProp="description">
            Every tool ships out-of-the-box — no extensions, no account, no install.
            All {TOTAL} tools across {TOOLS.length} categories run entirely in
            your browser with{' '}
            <Link href="/features/auto-detection">automatic format detection</Link>.
          </p>
        </div>

        <div className="feat-prose">
          {/* ── FAQ-style intro for rich-snippet eligibility ── */}
          <section className="feat-section" aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="feat-h2">What tools does SmartDevBox include?</h2>
            <p>
              SmartDevBox includes <strong>{TOTAL} developer tools</strong> across{' '}
              <strong>{TOOLS.length} categories</strong>: {CATEGORY_NAMES}.
              Every tool runs entirely in the browser — your data never leaves your machine.
              There is no account, no install, and no paid tier.
            </p>
            <p>
              Tools are grouped below with a short description of what each one does.
              Use the category links in the sidebar to jump directly to a section.
            </p>
          </section>

          {/* ── Tool tables by category ── */}
          {TOOLS.map((cat) => (
            <section key={cat.id} className="feat-tool-section" id={cat.id}
              aria-labelledby={`cat-${cat.id}`}
              itemScope itemType="https://schema.org/ItemList">
              <meta itemProp="name" content={cat.category} />
              <div className="feat-tool-section-header">
                <h2 id={`cat-${cat.id}`} className="feat-tool-section-title"
                  style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>
                  {cat.category}
                </h2>
                <span className="feat-tool-section-count">({cat.tools.length} tools)</span>
              </div>
              <p className="feat-tool-section-desc" itemProp="description">{cat.description}</p>
              <ul className="feat-tool-list">
                {cat.tools.map((tool, i) => (
                  <li key={tool.name} className="feat-tool-row"
                    itemScope itemType="https://schema.org/ListItem">
                    <meta itemProp="position" content={String(i + 1)} />
                    <span className="feat-tool-name" itemProp="name">
                      {tool.slug ? (
                        <Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
                      ) : (
                        tool.name
                      )}
                    </span>
                    <span className="feat-tool-desc" itemProp="description">{tool.desc}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* ── FAQ section for People Also Ask ── */}
          <section className="feat-section" aria-labelledby="faq-heading"
            itemScope itemType="https://schema.org/FAQPage">
            <h2 id="faq-heading" className="feat-h2">Frequently Asked Questions</h2>

            <div itemScope itemType="https://schema.org/Question" itemProp="mainEntity">
              <h3 className="feat-h3" itemProp="name">Are all tools really free?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p itemProp="text">
                  Yes. All {TOTAL} tools in SmartDevBox are free with no account required.
                  There is no premium tier, no rate limit, and no usage tracking.
                </p>
              </div>
            </div>

            <div itemScope itemType="https://schema.org/Question" itemProp="mainEntity">
              <h3 className="feat-h3" itemProp="name">Do any tools send data to a server?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p itemProp="text">
                  No. Every tool runs entirely in your browser using client-side JavaScript.
                  Sensitive inputs like JWTs, certificates, and API keys never leave your machine.
                  See the <Link href="/features/privacy">Privacy &amp; Security</Link> page for details.
                </p>
              </div>
            </div>

            <div itemScope itemType="https://schema.org/Question" itemProp="mainEntity">
              <h3 className="feat-h3" itemProp="name">Can I add my own tools?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p itemProp="text">
                  Yes. SmartDevBox has a{' '}
                  <Link href="/features/plugins">plugin system</Link> that lets you register
                  custom tools without forking the codebase.
                </p>
              </div>
            </div>

            <div itemScope itemType="https://schema.org/Question" itemProp="mainEntity">
              <h3 className="feat-h3" itemProp="name">How does SmartDevBox know which tool to use?</h3>
              <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                <p itemProp="text">
                  SmartDevBox uses{' '}
                  <Link href="/features/auto-detection">automatic format detection</Link> to
                  identify the type of your input — JSON, JWT, Base64, URL, certificate, and more —
                  and route it to the most relevant tool automatically.
                </p>
              </div>
            </div>
          </section>
        </div>

        <RelatedArticles current="tools" />
      </article>

      {/* ── TOC ──────────────────────────────────────────────────────────── */}
      <aside className="feat-toc" aria-label="On this page">
        <p className="feat-toc-title">Categories</p>
        <ul className="feat-toc-list">
          {TOOLS.map(({ id, category, tools }) => (
            <li key={id} className="feat-toc-item">
              <a href={`#${id}`}>
                {category}{' '}
                <span style={{ color: 'var(--text4)', fontWeight: 400 }}>({tools.length})</span>
              </a>
            </li>
          ))}
          <li className="feat-toc-item"><a href="#faq-heading">FAQ</a></li>
        </ul>
      </aside>
    </>
  );
}
