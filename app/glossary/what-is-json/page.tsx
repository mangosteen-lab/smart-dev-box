import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is JSON? Definition, Syntax, Examples & Common Errors',
  description:
    'JSON (JavaScript Object Notation) is a lightweight text format for representing structured data as key-value pairs, arrays, and nested objects. Learn the syntax, rules, and how to validate it.',
  keywords: [
    'what is json',
    'json definition',
    'json explained',
    'json syntax rules',
    'json vs xml',
    'json format example',
    'validate json online',
    'pretty print json',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-json' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'What Is JSON? Definition, Syntax, Examples & Common Errors',
    description:
      'JSON is a lightweight text format for structured data. Learn the rules, common errors, and how to format or validate JSON instantly.',
    url: 'https://smartdevbox.com/glossary/what-is-json',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is JSON? Definition, Syntax, Examples & Common Errors',
    description:
      'JSON is a lightweight text format for structured data. Learn the rules, common errors, and how to format or validate JSON instantly.',
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What Is JSON? Definition, Syntax, Examples & Common Errors',
  description: 'JSON (JavaScript Object Notation) is a lightweight text format for representing structured data.',
  url: 'https://smartdevbox.com/glossary/what-is-json',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  mainEntityOfPage: 'https://smartdevbox.com/glossary/what-is-json',
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is JSON?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'JSON (JavaScript Object Notation) is a lightweight, human-readable text format for representing structured data. It was derived from JavaScript object literal syntax but is language-independent — parsers and generators exist in virtually every programming language. JSON is defined by RFC 8259 (ECMA-404).',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the JSON data types?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'JSON supports exactly six data types: string (double-quoted Unicode text), number (integer or floating-point, no quotes), boolean (true or false, lowercase), null, object (unordered set of key-value pairs in curly braces), and array (ordered list of values in square brackets). Note: JSON has no date, undefined, or function types.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between JSON and XML?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'JSON and XML are both text-based data interchange formats. JSON is more compact, easier to read, and maps directly to data structures in most languages. XML supports attributes, namespaces, comments, and mixed content (text nodes alongside child elements), making it more expressive but more verbose. JSON is the dominant format for REST APIs; XML remains common in SOAP services, configuration files, and document-centric applications.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the most common JSON syntax errors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The most common JSON errors are: trailing commas after the last item in an object or array (not allowed in JSON, unlike JavaScript); single-quoted strings (JSON requires double quotes); unquoted keys; comments (JSON has no comment syntax); undefined or NaN values (not valid JSON values); and numbers with leading zeros (e.g. 007 is invalid).',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I format and validate JSON online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Paste your JSON into SmartDevBox. It auto-detects JSON input and immediately pretty-prints it with configurable indentation. If the JSON is invalid, it reports the error with a line and column number. No button to click, no account required, 100% client-side.',
      },
    },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-json' },
    { '@type': 'ListItem', position: 3, name: 'What Is JSON?', item: 'https://smartdevbox.com/glossary/what-is-json' },
  ],
};

const DATA_TYPES = [
  { type: 'string',  example: '"Hello, world!"', note: 'Must use double quotes. Supports Unicode escape sequences (\\uXXXX).' },
  { type: 'number',  example: '42 / 3.14 / -7 / 1e10', note: 'Integer or floating-point. No leading zeros, no NaN, no Infinity.' },
  { type: 'boolean', example: 'true / false', note: 'Lowercase only. Not "True" or 1/0.' },
  { type: 'null',    example: 'null', note: 'Represents an absent or unknown value. Lowercase only.' },
  { type: 'object',  example: '{"key": "value"}', note: 'Unordered set of key-value pairs. Keys must be strings (double-quoted).' },
  { type: 'array',   example: '[1, "two", true, null]', note: 'Ordered list of any JSON values (mixed types are allowed).' },
];

const COMMON_ERRORS = [
  { error: 'Trailing comma', example: '{"a": 1, "b": 2,}', fix: 'Remove the comma after the last item. JSON (unlike JavaScript) does not allow trailing commas.' },
  { error: 'Single-quoted string', example: "{\"a\": 'hello'}", fix: 'Use double quotes: {"a": "hello"}' },
  { error: 'Unquoted key', example: '{a: 1}', fix: 'Keys must be double-quoted strings: {"a": 1}' },
  { error: 'Comment', example: '{"a": 1 // comment}', fix: 'JSON has no comment syntax. Remove comments before parsing.' },
  { error: 'undefined value', example: '{"a": undefined}', fix: 'JSON has no undefined type. Use null, omit the key, or encode as a string.' },
  { error: 'Leading zero in number', example: '{"a": 007}', fix: 'Leading zeros are invalid. Use 7 instead of 007.' },
];

export default function WhatIsJsonPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow">
            <span className="feat-eyebrow-dot" />
            Glossary
          </div>
          <h1 className="feat-h1">What Is JSON?</h1>
          <p className="feat-lead">
            JSON (JavaScript Object Notation) is a lightweight, human-readable text
            format for representing structured data as key-value pairs, arrays, and
            nested objects. Despite the name, it is entirely language-independent and
            is the dominant data format for REST APIs, configuration files, and data
            storage across all modern programming languages.
          </p>
        </div>

        <div className="feat-prose">

          <h2 id="definition">The One-Line Definition</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </span>
            <p>
              <strong>JSON</strong> is a text-based data interchange format defined by{' '}
              <abbr title="Request for Comments 8259">RFC 8259</abbr> (ECMA-404). It
              represents structured data using six value types: strings, numbers,
              booleans, null, objects, and arrays.
            </p>
          </div>

          <h2 id="example">A JSON Example</h2>
          <pre style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '1rem 1.25rem',
            fontSize: 'var(--fs-sm)',
            overflowX: 'auto',
            lineHeight: '1.7',
            color: 'var(--text)',
          }}>{`{
  "user": {
    "id": 42,
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "active": true,
    "roles": ["admin", "editor"],
    "metadata": null
  }
}`}</pre>

          <h2 id="data-types">JSON Data Types</h2>
          <p>JSON supports exactly six value types — no more, no less:</p>
          <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border2)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Type</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--text2)', fontWeight: 500 }}>Example</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {DATA_TYPES.map(row => (
                  <tr key={row.type} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem 1rem 0.5rem 0', fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{row.type}</td>
                    <td style={{ padding: '0.5rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text)', fontSize: '0.85em' }}>{row.example}</td>
                    <td style={{ padding: '0.5rem 0', color: 'var(--text2)' }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="common-errors">Common JSON Syntax Errors</h2>
          <p>
            Because JSON is strict about syntax, small mistakes cause the entire document
            to fail to parse. These are the errors developers encounter most often:
          </p>
          <div className="feat-grid">
            {COMMON_ERRORS.map(e => (
              <div key={e.error} className="feat-card">
                <span className="feat-card-label">{e.error}</span>
                <span className="feat-card-desc">
                  <strong>Invalid:</strong>{' '}
                  <code style={{ fontSize: '0.85em', color: 'var(--green)' }}>{e.example}</code><br />
                  <strong>Fix:</strong> {e.fix}
                </span>
              </div>
            ))}
          </div>

          <h2 id="json-vs-xml">JSON vs XML</h2>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">JSON — compact, readable</span>
              <span className="feat-card-desc">
                No closing tags. Maps directly to objects and arrays in code. Smaller
                payload size. Dominant format for REST APIs. No support for attributes,
                namespaces, or comments.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">XML — expressive, verbose</span>
              <span className="feat-card-desc">
                Supports attributes, namespaces, comments, and mixed content. Used in
                SOAP services, SVG, HTML, and configuration files (pom.xml, web.xml).
                Larger payload for the same data.
              </span>
            </div>
          </div>

          {/* ── Tool CTA ── */}
          <h2 id="try-it">Format or Validate JSON Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </span>
            <p>
              Paste any JSON into SmartDevBox and it is auto-detected, formatted, and
              validated instantly — no button click. If there is a syntax error, the
              exact line and column number is reported.{' '}
              <Link href="/tools/json-formatter"><strong>Open the JSON Formatter →</strong></Link>
              {' '}or{' '}
              <Link href="/tools/json-validator"><strong>JSON Validator →</strong></Link>
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'What are the JSON data types?', a: 'Six: string (double-quoted), number, boolean (true/false), null, object ({key: value}), and array ([...]). There is no date, undefined, or function type in JSON.' },
              { q: 'What is the difference between JSON and XML?', a: 'JSON is more compact and maps directly to language data structures. XML supports attributes, namespaces, and comments, making it more expressive but more verbose. JSON dominates REST APIs; XML is common in SOAP and configuration files.' },
              { q: 'Can JSON have comments?', a: 'No. Standard JSON (RFC 8259) has no comment syntax. The JSON5 and JSONC formats add comment support but are not valid JSON.' },
              { q: 'How do I format and validate JSON online?', a: 'Paste your JSON into SmartDevBox. It auto-detects JSON input and pretty-prints it immediately. Syntax errors are reported with line and column numbers. 100% client-side — your data never leaves the browser.' },
            ].map(({ q, a }) => (
              <div key={q} className="feat-faq-item">
                <h3 className="feat-faq-q">{q}</h3>
                <p className="feat-faq-a">{a}</p>
              </div>
            ))}
          </div>

          <h2 id="related">Related Glossary Pages</h2>
          <div className="feat-grid">
            {[
              { href: '/glossary/what-is-base64-encoding', label: 'What Is Base64 Encoding?', desc: 'Binary data embedded in JSON (images, certificates) is typically Base64-encoded.' },
              { href: '/glossary/what-is-a-jwt', label: 'What Is a JWT?', desc: 'JWT payloads are JSON objects encoded as Base64url strings.' },
              { href: '/tools/json-formatter', label: 'JSON Formatter', desc: 'Auto-detects and pretty-prints JSON with configurable indentation.' },
              { href: '/tools/json-to-csv', label: 'JSON to CSV Converter', desc: 'Convert a JSON array of objects to CSV with one paste.' },
            ].map(({ href, label, desc }) => (
              <div key={href} className="feat-card">
                <span className="feat-card-label"><Link href={href} style={{ color: 'inherit' }}>{label} →</Link></span>
                <span className="feat-card-desc">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </article>

      <aside className="feat-toc" aria-label="On this page">
        <p className="feat-toc-title">On this page</p>
        <ul className="feat-toc-list">
          {[
            ['#definition',    'Definition'],
            ['#example',       'Example'],
            ['#data-types',    'Data types'],
            ['#common-errors', 'Common errors'],
            ['#json-vs-xml',   'JSON vs XML'],
            ['#try-it',        'Format JSON now'],
            ['#faq',           'FAQ'],
            ['#related',       'Related pages'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/json-formatter">JSON Formatter</Link></li>
          <li className="feat-toc-item"><Link href="/tools/json-validator">JSON Validator</Link></li>
        </ul>
      </aside>
    </>
  );
}
