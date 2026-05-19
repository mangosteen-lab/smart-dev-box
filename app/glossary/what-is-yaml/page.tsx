import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is YAML? Syntax, Rules, vs JSON, and Online Converter',
  description:
    'YAML (YAML Ain\'t Markup Language) is a human-readable data serialisation format. Learn indentation rules, data types, anchors, and convert YAML to JSON or JSON to YAML instantly in the browser.',
  keywords: [
    'what is yaml',
    'yaml explained',
    'yaml syntax',
    'yaml vs json',
    'yaml indentation',
    'yaml anchors aliases',
    'convert yaml to json online',
    'yaml formatter',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-yaml' },
  openGraph: {
    type: 'article', siteName: 'SmartDevBox',
    title: 'What Is YAML? Syntax, Rules, vs JSON, and Online Converter',
    description: 'YAML is a human-readable serialisation format. Learn syntax, indentation rules, and convert YAML ↔ JSON for free.',
    url: 'https://smartdevbox.com/glossary/what-is-yaml',
  },
  twitter: { card: 'summary_large_image', title: 'What Is YAML? Syntax, Rules, vs JSON, and Online Converter', description: 'Learn YAML syntax, indentation rules, and convert YAML ↔ JSON for free.' },
};

const articleJsonLd = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'What Is YAML? Syntax, Rules, vs JSON, and Online Converter',
  description: 'YAML is a human-readable data serialisation format commonly used for configuration files.',
  url: 'https://smartdevbox.com/glossary/what-is-yaml',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
};

const faqJsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is YAML?', acceptedAnswer: { '@type': 'Answer', text: 'YAML (YAML Ain\'t Markup Language) is a human-readable data serialisation format. It uses indentation to express structure and is commonly used for configuration files (GitHub Actions, Kubernetes, Docker Compose, Ansible) and data exchange. YAML is a superset of JSON — every valid JSON document is also valid YAML.' } },
    { '@type': 'Question', name: 'What are the YAML indentation rules?', acceptedAnswer: { '@type': 'Answer', text: 'YAML uses spaces for indentation — never tabs. The number of spaces must be consistent within a block, though it can vary between blocks (2 spaces and 4 spaces are both common). Child elements must be indented further than their parent. Mismatched indentation is a common source of parse errors.' } },
    { '@type': 'Question', name: 'What is the difference between YAML and JSON?', acceptedAnswer: { '@type': 'Answer', text: 'YAML is a superset of JSON and is more human-friendly: it supports comments (# …), multi-line strings, anchors and aliases for reuse, and does not require quotes around string values. JSON is more strict and widely supported as a wire format. YAML is typically preferred for config files; JSON is preferred for APIs.' } },
    { '@type': 'Question', name: 'What are YAML anchors and aliases?', acceptedAnswer: { '@type': 'Answer', text: 'An anchor (&name) marks a node so it can be reused. An alias (*name) references the anchored node, copying its value. This eliminates duplication in large config files. Example: defaults: &defaults\n  timeout: 30\nservice:\n  <<: *defaults\n  port: 8080' } },
    { '@type': 'Question', name: 'How do I convert YAML to JSON online?', acceptedAnswer: { '@type': 'Answer', text: 'Paste your YAML into SmartDevBox. The YAML to JSON tool converts the document and pretty-prints the result — all client-side with no data sent to a server.' } },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-yaml' },
    { '@type': 'ListItem', position: 3, name: 'What Is YAML?', item: 'https://smartdevbox.com/glossary/what-is-yaml' },
  ],
};

const DATA_TYPES = [
  { type: 'String', yaml: 'hello or "hello"', note: 'Quotes are optional unless the value contains special characters.' },
  { type: 'Integer', yaml: '42', note: 'Plain decimal. Use 0x1F for hex, 0o17 for octal.' },
  { type: 'Float', yaml: '3.14 or 1.2e3', note: 'Scientific notation supported.' },
  { type: 'Boolean', yaml: 'true / false', note: 'YAML 1.1 also accepted yes/no/on/off; YAML 1.2 only true/false.' },
  { type: 'Null', yaml: 'null or ~', note: 'Represents an absent or empty value.' },
  { type: 'Sequence (array)', yaml: '- item1\n- item2', note: 'Block style uses dash + space prefix per item.' },
  { type: 'Mapping (object)', yaml: 'key: value', note: 'Keys and values separated by colon + space.' },
  { type: 'Multi-line string', yaml: '| (literal) or > (folded)', note: '| preserves newlines. > folds newlines into spaces.' },
];

const VS_JSON = [
  { feature: 'Comments', yaml: '# comment', json: 'Not supported' },
  { feature: 'Quotes required', yaml: 'No (optional)', json: 'Yes, for strings' },
  { feature: 'Indentation', yaml: 'Significant (spaces only)', json: 'Cosmetic only' },
  { feature: 'Anchors / aliases', yaml: '&anchor / *alias', json: 'Not supported' },
  { feature: 'Multi-line strings', yaml: '| and > block scalars', json: '\\n escapes only' },
  { feature: 'JSON superset', yaml: 'Yes (YAML 1.2)', json: 'N/A' },
  { feature: 'Common use', yaml: 'Config files', json: 'API payloads' },
];

export default function WhatIsYamlPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow"><span className="feat-eyebrow-dot" />Glossary</div>
          <h1 className="feat-h1">What Is YAML?</h1>
          <p className="feat-lead">
            YAML (YAML Ain&apos;t Markup Language) is a human-readable data serialisation
            format popular for configuration files. GitHub Actions workflows, Kubernetes
            manifests, Docker Compose files, and Ansible playbooks are all written in YAML.
            It is a superset of JSON — so every JSON file is also valid YAML — but it adds
            comments, anchors, and cleaner syntax for complex structures.
          </p>
        </div>

        <div className="feat-prose">
          <h2 id="definition">The One-Line Definition</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            <p><strong>YAML</strong> is a whitespace-sensitive, human-readable data serialisation language defined by the YAML specification. It is commonly used for configuration files and supports rich data types including strings, numbers, booleans, lists, and mappings.</p>
          </div>

          <h2 id="example">A YAML Example</h2>
          <pre style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem 1.25rem', fontSize: 'var(--fs-sm)', overflowX: 'auto', lineHeight: '1.7', color: 'var(--text)' }}>{`# GitHub Actions workflow (YAML)
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test
        env:
          NODE_ENV: test`}</pre>

          <h2 id="indentation">Indentation Rules</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
            <p><strong>Always use spaces, never tabs.</strong> YAML parsers reject tab characters for indentation. Two spaces per level is the most common convention. Child keys must be indented further than their parent — inconsistent indentation causes parse errors.</p>
          </div>

          <h2 id="data-types">Data Types</h2>
          <div className="feat-grid">
            {DATA_TYPES.map(({ type, yaml, note }) => (
              <div key={type} className="feat-card">
                <span className="feat-card-label">{type}</span>
                <span className="feat-card-desc">
                  <code style={{ fontSize: 'var(--fs-xs)', background: 'var(--bg2)', padding: '1px 4px', borderRadius: '3px' }}>{yaml}</code>
                  <br />{note}
                </span>
              </div>
            ))}
          </div>

          <h2 id="anchors">Anchors &amp; Aliases</h2>
          <pre style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem 1.25rem', fontSize: 'var(--fs-sm)', overflowX: 'auto', lineHeight: '1.7', color: 'var(--text)' }}>{`# Define a reusable block with an anchor
defaults: &defaults
  timeout: 30
  retries: 3

# Merge the anchor with << and override one key
production:
  <<: *defaults
  timeout: 60   # override`}</pre>

          <h2 id="vs-json">YAML vs JSON</h2>
          <div className="feat-grid">
            {VS_JSON.map(({ feature, yaml, json }) => (
              <div key={feature} className="feat-card">
                <span className="feat-card-label">{feature}</span>
                <span className="feat-card-desc">
                  YAML: <code style={{ fontSize: 'var(--fs-xs)', background: 'var(--bg2)', padding: '1px 4px', borderRadius: '3px' }}>{yaml}</code>
                  &nbsp;·&nbsp;
                  JSON: <code style={{ fontSize: 'var(--fs-xs)', background: 'var(--bg2)', padding: '1px 4px', borderRadius: '3px' }}>{json}</code>
                </span>
              </div>
            ))}
          </div>

          <h2 id="try-it">Convert YAML Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </span>
            <p>
              <Link href="/tools/yaml-to-json"><strong>YAML to JSON →</strong></Link>{' '}·{' '}
              <Link href="/tools/json-to-yaml"><strong>JSON to YAML →</strong></Link>{' '}
              — all conversions run in the browser.
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'What are the YAML indentation rules?', a: 'Always use spaces, never tabs. Be consistent — two spaces per level is standard. Children must be indented further than their parent. Mismatched indentation causes parse errors.' },
              { q: 'What is the difference between YAML and JSON?', a: 'YAML supports comments, optional quotes, anchors for reuse, and multi-line strings. JSON is stricter and better for APIs. YAML is preferred for config files. YAML 1.2 is a strict superset of JSON.' },
              { q: 'What are YAML anchors and aliases?', a: '&name marks a block as an anchor. *name inserts a copy (alias) of that block. Use <<: *name to merge a mapping anchor into another mapping.' },
              { q: 'How do I convert YAML to JSON online?', a: 'Paste your YAML into SmartDevBox YAML to JSON tool. It converts and pretty-prints the result instantly, all client-side.' },
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
              { href: '/tools/yaml-to-json', label: 'YAML to JSON', desc: 'Convert a YAML document to JSON in the browser.' },
              { href: '/tools/json-to-yaml', label: 'JSON to YAML', desc: 'Convert a JSON document to YAML in the browser.' },
              { href: '/glossary/what-is-json', label: 'What Is JSON?', desc: 'JSON is the wire-format sibling to YAML — stricter, more portable.' },
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
          {[['#definition','Definition'],['#example','Example'],['#indentation','Indentation rules'],['#data-types','Data types'],['#anchors','Anchors & aliases'],['#vs-json','YAML vs JSON'],['#try-it','Convert now'],['#faq','FAQ'],['#related','Related']].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/yaml-to-json">YAML to JSON</Link></li>
        </ul>
      </aside>
    </>
  );
}
