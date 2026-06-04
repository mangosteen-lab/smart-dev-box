import type { Metadata } from 'next';
import Link from 'next/link';
import { TOOL_SEO_DATA } from '@/lib/tools/seo-data';
import { ENGINEERING_RECIPES } from '@/lib/recipes';

export const metadata: Metadata = {
  title: 'Tool Guides — SmartDevBox',
  description: 'In-depth guides for every tool in SmartDevBox: what each tool does, how to read its output, worked examples, and FAQs.',
  alternates: { canonical: 'https://smartdevbox.com/tools' },
};

/* Group tools by the category implied by their keywords / position in SEO_DATA.
   We derive this from the tool id prefix rather than importing the registry to
   keep this a pure server component with no client bundle. */
const CATEGORY_PREFIXES: { label: string; test: (id: string) => boolean }[] = [
  { label: 'Encoding & Decoding', test: (id) => /base64|base32|url-enc|url-dec|url-pars|jwt|html-enc|html-dec|hex-|ascii-|backslash|rot1|rot4|image-dec/.test(id) },
  { label: 'Formatting',          test: (id) => /format|beautif|minif|validat|prettif/.test(id) },
  { label: 'Conversion',          test: (id) => /to-|csv|yaml|markdown|color|number-base|unix|timestamp|seconds|roman|uuid-hex|hex-uuid/.test(id) },
  { label: 'Generation',          test: (id) => /generat|uuid$|ulid|hash|random|lorem|qr-code|hmac|totp|nanoid/.test(id) },
  { label: 'Inspection',          test: (id) => /regex|jsonpath|string-inspect|cron|cert|preview|cidr|ip-inspect|http-status/.test(id) },
  { label: 'Text',                test: (id) => /case|sort|dedup|reverse|word-count|trim|empty|number-lines|prefix|suffix|join|extract/.test(id) },
];

function categorise(id: string): string {
  for (const { label, test } of CATEGORY_PREFIXES) {
    if (test(id)) return label;
  }
  return 'Other';
}

type Group = { label: string; tools: typeof TOOL_SEO_DATA };

const groups: Group[] = [];
for (const tool of TOOL_SEO_DATA) {
  const label = categorise(tool.id);
  let group = groups.find((g) => g.label === label);
  if (!group) { group = { label, tools: [] }; groups.push(group); }
  group.tools.push(tool);
}

export default function ToolsIndexPage() {
  return (
    <>
      <article className="feat-article">
        <div className="feat-hero">
          <h1 className="feat-h1">Tool Guides</h1>
          <p className="feat-lead">
            In-depth reference articles for every tool in SmartDevBox — what each tool does,
            how to read its output fields, worked examples, and answers to common questions.
            All tools run 100% in your browser; no data is ever sent to a server.
          </p>
        </div>

        <div className="feat-prose">
          {groups.map(({ label, tools }) => (
            <section key={label} className="feat-section" aria-labelledby={`cat-${label.replace(/\s+/g, '-').toLowerCase()}`}>
              <h2 id={`cat-${label.replace(/\s+/g, '-').toLowerCase()}`} className="feat-h2">
                {label}
              </h2>
              <ul className="feat-tool-list">
                {tools.map((tool) => (
                  <li key={tool.id} className="feat-tool-row">
                    <Link href={`/tools/${tool.slug}`} className="feat-tool-name">
                      {tool.heading.split(' — ')[0].trim()}
                    </Link>
                    <span className="feat-tool-desc">{tool.metaDescription}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="feat-section" id="more">
            <h2 className="feat-h2">More from SmartDevBox</h2>

            <h3 className="feat-h3">SmartDevBox vs Alternatives</h3>
            <ul className="feat-tool-list">
              <li className="feat-tool-row">
                <Link href="/vs/cyberchef" className="feat-tool-name">SmartDevBox vs CyberChef</Link>
                <span className="feat-tool-desc">How auto-detection compares to CyberChef&apos;s recipe model.</span>
              </li>
              <li className="feat-tool-row">
                <Link href="/vs/jwt-io" className="feat-tool-name">SmartDevBox vs jwt.io</Link>
                <span className="feat-tool-desc">A single-purpose JWT decoder vs a 97-tool all-in-one toolkit.</span>
              </li>
              <li className="feat-tool-row">
                <Link href="/alternatives/base64decode-org" className="feat-tool-name">SmartDevBox vs base64decode.org</Link>
                <span className="feat-tool-desc">Why a dedicated Base64 site is no longer necessary.</span>
              </li>
              <li className="feat-tool-row">
                <Link href="/vs/jsonlint" className="feat-tool-name">SmartDevBox vs JSONLint</Link>
                <span className="feat-tool-desc">Compare a broad developer toolbox with a JSON-focused suite.</span>
              </li>
              <li className="feat-tool-row">
                <Link href="/vs/transform-tools" className="feat-tool-name">SmartDevBox vs Transform.tools</Link>
                <span className="feat-tool-desc">Everyday developer utilities compared with code and schema transforms.</span>
              </li>
              <li className="feat-tool-row">
                <Link href="/alternatives/cyberchef" className="feat-tool-name">CyberChef Alternative</Link>
                <span className="feat-tool-desc">A simpler option for common single-step developer tasks.</span>
              </li>
            </ul>

            <h3 className="feat-h3">Engineering Recipes</h3>
            <ul className="feat-tool-list">
              <li className="feat-tool-row">
                <Link href="/recipes" className="feat-tool-name">All Engineering Recipes</Link>
                <span className="feat-tool-desc">Workflow-first guides for API debugging, logs, DevOps, security, and AI prompts.</span>
              </li>
              {ENGINEERING_RECIPES.map((recipe) => (
                <li key={recipe.slug} className="feat-tool-row">
                  <Link href={`/recipes/${recipe.slug}`} className="feat-tool-name">{recipe.shortTitle}</Link>
                  <span className="feat-tool-desc">{recipe.summary}</span>
                </li>
              ))}
            </ul>

            <h3 className="feat-h3">Developer Glossary</h3>
            <ul className="feat-tool-list">
              <li className="feat-tool-row"><Link href="/glossary/what-is-base64-encoding" className="feat-tool-name">What is Base64 encoding?</Link><span className="feat-tool-desc">Binary-to-text encoding used in email, HTTP, and data URIs.</span></li>
              <li className="feat-tool-row"><Link href="/glossary/what-is-a-jwt" className="feat-tool-name">What is a JWT?</Link><span className="feat-tool-desc">Compact, self-contained token for transmitting authentication claims.</span></li>
              <li className="feat-tool-row"><Link href="/glossary/what-is-json" className="feat-tool-name">What is JSON?</Link><span className="feat-tool-desc">Lightweight text format for structured data.</span></li>
              <li className="feat-tool-row"><Link href="/glossary/what-is-xml" className="feat-tool-name">What is XML?</Link><span className="feat-tool-desc">Hierarchical markup language for structured data interchange.</span></li>
              <li className="feat-tool-row"><Link href="/glossary/what-is-a-unix-timestamp" className="feat-tool-name">What is a Unix timestamp?</Link><span className="feat-tool-desc">Seconds elapsed since 1970-01-01 UTC — the universal time representation.</span></li>
              <li className="feat-tool-row"><Link href="/glossary/what-is-a-hash-function" className="feat-tool-name">What is a hash function?</Link><span className="feat-tool-desc">One-way function mapping any input to a fixed-length digest.</span></li>
              <li className="feat-tool-row"><Link href="/glossary/what-is-a-url" className="feat-tool-name">What is a URL?</Link><span className="feat-tool-desc">Address of a resource on the internet: scheme, host, path, query, fragment.</span></li>
              <li className="feat-tool-row"><Link href="/glossary/what-is-a-uuid" className="feat-tool-name">What is a UUID?</Link><span className="feat-tool-desc">128-bit identifier formatted as 8-4-4-4-12 hex groups.</span></li>
              <li className="feat-tool-row"><Link href="/glossary/what-is-a-cron-expression" className="feat-tool-name">What is a cron expression?</Link><span className="feat-tool-desc">Five-field string that schedules recurring tasks in Unix-like systems.</span></li>
              <li className="feat-tool-row"><Link href="/glossary/what-is-a-regex" className="feat-tool-name">What is a regex?</Link><span className="feat-tool-desc">Pattern language for matching, searching, and extracting text.</span></li>
              <li className="feat-tool-row"><Link href="/glossary/what-is-an-x509-certificate" className="feat-tool-name">What is an X.509 certificate?</Link><span className="feat-tool-desc">Signed document binding a public key to an identity — the foundation of HTTPS.</span></li>
              <li className="feat-tool-row"><Link href="/glossary/what-is-csv" className="feat-tool-name">What is CSV?</Link><span className="feat-tool-desc">Plain-text tabular format with comma-separated fields.</span></li>
              <li className="feat-tool-row"><Link href="/glossary/what-is-sql" className="feat-tool-name">What is SQL?</Link><span className="feat-tool-desc">Standard language for querying and managing relational databases.</span></li>
              <li className="feat-tool-row"><Link href="/glossary/what-is-yaml" className="feat-tool-name">What is YAML?</Link><span className="feat-tool-desc">Human-readable, indentation-based data serialisation format.</span></li>
              <li className="feat-tool-row"><Link href="/glossary/what-is-a-color-code" className="feat-tool-name">What is a color code?</Link><span className="feat-tool-desc">HEX, RGB, or HSL notation that uniquely identifies a color.</span></li>
            </ul>
          </section>
        </div>
      </article>

      <aside className="feat-toc" aria-label="On this page">
        <p className="feat-toc-title">Categories</p>
        <ul className="feat-toc-list">
          {groups.map(({ label }) => (
            <li key={label} className="feat-toc-item">
              <a href={`#cat-${label.replace(/\s+/g, '-').toLowerCase()}`}>{label}</a>
            </li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/features/tools">All 97+ Tools</Link></li>
          <li className="feat-toc-item"><a href="#more">vs &amp; Glossary</a></li>
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>vs Alternatives</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/vs/cyberchef">vs CyberChef</Link></li>
          <li className="feat-toc-item"><Link href="/vs/jwt-io">vs jwt.io</Link></li>
          <li className="feat-toc-item"><Link href="/vs/jsonlint">vs JSONLint</Link></li>
          <li className="feat-toc-item"><Link href="/vs/transform-tools">vs Transform.tools</Link></li>
          <li className="feat-toc-item"><Link href="/alternatives/cyberchef">CyberChef alternative</Link></li>
          <li className="feat-toc-item"><Link href="/alternatives/base64decode-org">vs base64decode.org</Link></li>
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Glossary</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/glossary/what-is-base64-encoding">What is Base64?</Link></li>
          <li className="feat-toc-item"><Link href="/glossary/what-is-a-jwt">What is a JWT?</Link></li>
          <li className="feat-toc-item"><Link href="/glossary/what-is-json">What is JSON?</Link></li>
          <li className="feat-toc-item"><Link href="/glossary/what-is-xml">What is XML?</Link></li>
          <li className="feat-toc-item"><Link href="/glossary/what-is-a-unix-timestamp">What is a Unix timestamp?</Link></li>
          <li className="feat-toc-item"><Link href="/glossary/what-is-a-hash-function">What is a hash function?</Link></li>
          <li className="feat-toc-item"><Link href="/glossary/what-is-a-url">What is a URL?</Link></li>
          <li className="feat-toc-item"><Link href="/glossary/what-is-a-uuid">What is a UUID?</Link></li>
          <li className="feat-toc-item"><Link href="/glossary/what-is-a-cron-expression">What is a cron expression?</Link></li>
          <li className="feat-toc-item"><Link href="/glossary/what-is-a-regex">What is a regex?</Link></li>
          <li className="feat-toc-item"><Link href="/glossary/what-is-an-x509-certificate">What is an X.509 certificate?</Link></li>
          <li className="feat-toc-item"><Link href="/glossary/what-is-csv">What is CSV?</Link></li>
          <li className="feat-toc-item"><Link href="/glossary/what-is-sql">What is SQL?</Link></li>
          <li className="feat-toc-item"><Link href="/glossary/what-is-yaml">What is YAML?</Link></li>
          <li className="feat-toc-item"><Link href="/glossary/what-is-a-color-code">What is a color code?</Link></li>
        </ul>
      </aside>
    </>
  );
}
