import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is CSV? Format, Rules, Common Pitfalls & Converters',
  description:
    'CSV (Comma-Separated Values) is a plain-text format for tabular data where each row is a line and fields are separated by commas. Learn the rules, quoting, encoding gotchas, and convert to JSON for free.',
  keywords: [
    'what is csv',
    'csv format explained',
    'csv rules',
    'csv quoting',
    'csv vs tsv',
    'csv vs json',
    'convert csv to json online',
    'csv encoding',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-csv' },
  openGraph: {
    type: 'article', siteName: 'SmartDevBox',
    title: 'What Is CSV? Format, Rules, Common Pitfalls & Converters',
    description: 'CSV is a plain-text tabular format. Learn quoting rules, common pitfalls, and convert CSV to JSON for free.',
    url: 'https://smartdevbox.com/glossary/what-is-csv',
  },
  twitter: { card: 'summary_large_image', title: 'What Is CSV? Format, Rules, Common Pitfalls & Converters', description: 'Learn CSV quoting rules, common pitfalls, and convert to JSON for free.' },
};

const articleJsonLd = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'What Is CSV? Format, Rules, Common Pitfalls & Converters',
  description: 'CSV is a plain-text format for tabular data where each row is a line and fields are separated by commas.',
  url: 'https://smartdevbox.com/glossary/what-is-csv',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
};

const faqJsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is CSV?', acceptedAnswer: { '@type': 'Answer', text: 'CSV (Comma-Separated Values) is a plain-text format for tabular data. Each line represents one row, and fields within each row are separated by commas. A header row (the first line) typically names each column. CSV is defined loosely — RFC 4180 documents common practice but is not a strict standard — which is why parsers must handle many edge cases.' } },
    { '@type': 'Question', name: 'How does CSV handle commas or newlines inside a field?', acceptedAnswer: { '@type': 'Answer', text: 'Fields containing a comma, a double-quote, or a newline must be enclosed in double quotes. A double-quote character inside a quoted field is escaped by doubling it: "". For example: "Smith, John","He said ""hello""",New York.' } },
    { '@type': 'Question', name: 'What is the difference between CSV and TSV?', acceptedAnswer: { '@type': 'Answer', text: 'TSV (Tab-Separated Values) uses a tab character (\\t) as the field delimiter instead of a comma. TSV is less ambiguous when data contains commas (e.g. addresses, prose text) because tabs appear less often in natural-language data. Both formats share the same row-per-line structure.' } },
    { '@type': 'Question', name: 'How do I convert CSV to JSON online?', acceptedAnswer: { '@type': 'Answer', text: 'Paste your CSV into SmartDevBox. The CSV to JSON tool uses the header row as property names and converts each data row to a JSON object. The result is a JSON array ready to use in your application — all processing is client-side.' } },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-csv' },
    { '@type': 'ListItem', position: 3, name: 'What Is CSV?', item: 'https://smartdevbox.com/glossary/what-is-csv' },
  ],
};

const RULES = [
  { rule: 'Delimiter', detail: 'A comma , separates fields. Tabs, semicolons, or pipes are used in TSV/DSV variants.' },
  { rule: 'One row per line', detail: 'Each record occupies one line. Line endings may be CRLF (Windows) or LF (Unix).' },
  { rule: 'Optional header', detail: 'The first row is conventionally a header naming each column, but this is not required.' },
  { rule: 'Quoting', detail: 'Fields containing a comma, double-quote, or newline must be enclosed in double quotes: "Smith, John".' },
  { rule: 'Escaping quotes', detail: 'A double-quote inside a quoted field is escaped by doubling it: "He said ""hello""".' },
  { rule: 'Whitespace', detail: 'Whitespace around an unquoted field is technically part of the field value. Parsers vary in how they trim it.' },
  { rule: 'Encoding', detail: 'CSV has no encoding declaration. UTF-8 is recommended; Excel may produce Windows-1252 or UTF-16 with a BOM.' },
];

export default function WhatIsCsvPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow"><span className="feat-eyebrow-dot" />Glossary</div>
          <h1 className="feat-h1">What Is CSV?</h1>
          <p className="feat-lead">
            CSV (Comma-Separated Values) is a plain-text format for tabular data: each
            line is a row, and fields within a row are separated by commas. Simple in
            concept, CSV is deceptively tricky in practice — quoting rules, line endings,
            encoding, and delimiter variations have tripped up every developer at least once.
          </p>
        </div>

        <div className="feat-prose">
          <h2 id="definition">The One-Line Definition</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            <p><strong>CSV</strong> is a plain-text format where each line represents a data record and fields within each record are separated by commas. Documented (but not strictly standardised) in RFC 4180.</p>
          </div>

          <h2 id="example">A CSV Example</h2>
          <pre style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem 1.25rem', fontSize: 'var(--fs-sm)', overflowX: 'auto', lineHeight: '1.7', color: 'var(--text)' }}>{`id,name,email,active
1,Ada Lovelace,ada@example.com,true
2,"Smith, John",john@example.com,false
3,Grace Hopper,"grace@example.com",true`}</pre>

          <h2 id="rules">The Rules (RFC 4180)</h2>
          <div className="feat-grid">
            {RULES.map(r => (
              <div key={r.rule} className="feat-card">
                <span className="feat-card-label">{r.rule}</span>
                <span className="feat-card-desc">{r.detail}</span>
              </div>
            ))}
          </div>

          <h2 id="csv-vs-tsv">CSV vs TSV</h2>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">CSV — comma delimiter</span>
              <span className="feat-card-desc">Most widely supported. Problematic when data contains commas (addresses, text). Requires quoting with double-quotes.</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">TSV — tab delimiter</span>
              <span className="feat-card-desc">Less ambiguous for text data — tabs rarely appear in natural language. Preferred for copy-paste from spreadsheets. Less universally supported than CSV.</span>
            </div>
          </div>

          <h2 id="encoding-gotcha">The Encoding Gotcha</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
            <p>CSV has no encoding header. Files exported from Microsoft Excel may use Windows-1252 encoding (breaking non-ASCII characters) or UTF-16 with a BOM. Always specify UTF-8 when exporting and validate the encoding before parsing.</p>
          </div>

          <h2 id="try-it">Convert CSV Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </span>
            <p>
              <Link href="/tools/csv-to-json"><strong>CSV to JSON →</strong></Link>{' '}·{' '}
              <Link href="/tools/json-to-csv"><strong>JSON to CSV →</strong></Link>{' '}
              — all conversions run in the browser.
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'How does CSV handle commas or newlines inside a field?', a: 'Wrap the field in double quotes: "Smith, John". A double-quote inside a quoted field is escaped by doubling it: "He said ""hello""".' },
              { q: 'What is the difference between CSV and TSV?', a: 'TSV uses a tab as delimiter instead of a comma. Tabs appear less often in data than commas, making TSV less ambiguous for text-heavy data.' },
              { q: 'How do I convert CSV to JSON online?', a: 'Paste your CSV into SmartDevBox. The CSV to JSON tool uses the header row as property names and returns a JSON array — all client-side.' },
            ].map(({ q, a }) => (
              <div key={q} className="feat-faq-item">
                <h3 className="feat-faq-q">{q}</h3>
                <p className="feat-faq-a">{a}</p>
              </div>
            ))}
          </div>

          <h2 id="related">Related Pages</h2>
          <div className="feat-grid">
            {[
              { href: '/tools/csv-to-json', label: 'CSV to JSON', desc: 'Convert CSV to a JSON array using the header row as property names.' },
              { href: '/tools/json-to-csv', label: 'JSON to CSV', desc: 'Flatten a JSON array of objects to CSV.' },
              { href: '/glossary/what-is-json', label: 'What Is JSON?', desc: 'The alternative format to CSV for structured data in APIs.' },
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
          {[['#definition','Definition'],['#example','Example'],['#rules','The rules'],['#csv-vs-tsv','CSV vs TSV'],['#encoding-gotcha','Encoding gotcha'],['#try-it','Convert now'],['#faq','FAQ'],['#related','Related']].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/csv-to-json">CSV to JSON</Link></li>
        </ul>
      </aside>
    </>
  );
}
