import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is a UUID? Versions, Format & When to Use Each',
  description:
    'A UUID is a 128-bit identifier formatted as 32 hex digits in five groups. Learn the difference between UUID v1, v4, v5, and v7, and when to use a UUID vs a ULID.',
  keywords: [
    'what is a uuid',
    'uuid explained',
    'uuid v4 vs v1',
    'uuid format',
    'uuid vs ulid',
    'generate uuid online',
    'universally unique identifier',
    'uuid versions',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-a-uuid' },
  openGraph: {
    type: 'article', siteName: 'SmartDevBox',
    title: 'What Is a UUID? Versions, Format & When to Use Each',
    description: 'A UUID is a 128-bit identifier in 8-4-4-4-12 hex format. Learn UUID v1, v4, v5, v7 and when to use UUID vs ULID.',
    url: 'https://smartdevbox.com/glossary/what-is-a-uuid',
  },
  twitter: { card: 'summary_large_image', title: 'What Is a UUID? Versions, Format & When to Use Each', description: 'Learn UUID v1, v4, v5, v7 format and when to use UUID vs ULID.' },
};

const articleJsonLd = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'What Is a UUID? Versions, Format & When to Use Each',
  description: 'A UUID is a 128-bit identifier formatted as 32 hex digits in five groups.',
  url: 'https://smartdevbox.com/glossary/what-is-a-uuid',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
};

const faqJsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is a UUID?', acceptedAnswer: { '@type': 'Answer', text: 'A UUID (Universally Unique Identifier) is a 128-bit number used to identify information in computer systems. It is represented as 32 lowercase hexadecimal digits displayed in five groups separated by hyphens: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (e.g. 550e8400-e29b-41d4-a716-446655440000). Defined in RFC 4122.' } },
    { '@type': 'Question', name: 'What is the difference between UUID v1 and UUID v4?', acceptedAnswer: { '@type': 'Answer', text: 'UUID v1 is time-based: it encodes the current timestamp and the MAC address of the generating machine, making it sortable by creation time but potentially revealing the host identity. UUID v4 is randomly generated — 122 bits of cryptographically random data — with no embedded information about the generator. UUID v4 is the most widely used version for general-purpose unique IDs.' } },
    { '@type': 'Question', name: 'What is the difference between a UUID and a ULID?', acceptedAnswer: { '@type': 'Answer', text: 'A ULID (Universally Unique Lexicographically Sortable Identifier) is also a 128-bit identifier but encodes a millisecond-precision timestamp in the first 48 bits followed by 80 bits of randomness. Unlike UUID v4, ULIDs are lexicographically sortable — they sort in creation order — which makes them efficient as database primary keys. They are encoded in Crockford Base32 (26 characters) rather than hex (32 characters with hyphens).' } },
    { '@type': 'Question', name: 'How do I generate a UUID online?', acceptedAnswer: { '@type': 'Answer', text: 'Use the UUID Generator tool on SmartDevBox. It generates UUID v4 values using the Web Crypto API (crypto.randomUUID()) entirely in the browser. No data is sent to a server.' } },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-a-uuid' },
    { '@type': 'ListItem', position: 3, name: 'What Is a UUID?', item: 'https://smartdevbox.com/glossary/what-is-a-uuid' },
  ],
};

const VERSIONS = [
  { ver: 'v1', basis: 'Time + MAC address', sortable: 'Yes', private: 'No — embeds MAC', use: 'When sortability matters and privacy is not a concern. Deprecated in many systems.' },
  { ver: 'v3', basis: 'MD5 hash of namespace + name', sortable: 'No', private: 'Yes', use: 'Deterministic IDs from a name (e.g. always the same ID for the same URL). Avoid — MD5 is broken.' },
  { ver: 'v4', basis: '122 bits of random data', sortable: 'No', private: 'Yes', use: 'General-purpose unique IDs. The most widely used version. Use this by default.' },
  { ver: 'v5', basis: 'SHA-1 hash of namespace + name', sortable: 'No', private: 'Yes', use: 'Deterministic IDs from a name. Prefer over v3 (SHA-1 is stronger than MD5, though still deprecated for security).' },
  { ver: 'v7', basis: 'Unix timestamp (ms) + random', sortable: 'Yes', private: 'Yes', use: 'Modern replacement for v1. Sortable, random, no MAC address. Best choice for database primary keys in new systems.' },
];

export default function WhatIsUuidPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow"><span className="feat-eyebrow-dot" />Glossary</div>
          <h1 className="feat-h1">What Is a UUID?</h1>
          <p className="feat-lead">
            A UUID (Universally Unique Identifier) is a 128-bit number used to identify
            records without a central authority assigning IDs. Its familiar
            <code style={{ color: 'var(--green)', fontSize: '0.9em' }}> 8-4-4-4-12 </code>
            hex format — like <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>550e8400-e29b-41d4-a716-446655440000</code> — is defined
            by RFC 4122 and appears in database primary keys, distributed systems,
            and API resources worldwide.
          </p>
        </div>

        <div className="feat-prose">
          <h2 id="definition">The One-Line Definition</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            <p>A <strong>UUID</strong> is a 128-bit identifier represented as 32 lowercase hex digits in five hyphen-separated groups (<code style={{ color: 'var(--green)', fontSize: '0.9em' }}>8-4-4-4-12</code>). The version digit (position 13) and variant bits (position 17) are embedded in the value itself.</p>
          </div>

          <h2 id="format">UUID Format</h2>
          <p>A UUID looks like this:</p>
          <pre style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', color: 'var(--green)', letterSpacing: '0.05em' }}>
            550e8400-e29b-<strong>4</strong>1d4-<strong>a</strong>716-446655440000
          </pre>
          <p>
            The <strong>4</strong> at position 13 is the version number (v4 = random).
            The <strong>a</strong> at position 17 (binary <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>10xx</code>) encodes the RFC 4122 variant.
          </p>

          <h2 id="versions">UUID Versions Compared</h2>
          <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border2)' }}>
                  {['Version', 'Basis', 'Sortable', 'Private', 'When to use'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem 0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VERSIONS.map(v => (
                  <tr key={v.ver} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem 0.75rem 0.5rem 0', fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{v.ver}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text)' }}>{v.basis}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: v.sortable === 'Yes' ? 'var(--green)' : 'var(--text2)' }}>{v.sortable}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: v.private === 'Yes' ? 'var(--green)' : 'var(--text2)' }}>{v.private}</td>
                    <td style={{ padding: '0.5rem 0', color: 'var(--text)' }}>{v.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="uuid-vs-ulid">UUID vs ULID</h2>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">UUID v4 — random</span>
              <span className="feat-card-desc">32 hex chars + 4 hyphens = 36 characters. Not sortable. Universally supported in databases and ORMs. Use when you need a widely compatible unique ID.</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">ULID — sortable</span>
              <span className="feat-card-desc">26 Crockford Base32 characters. First 10 chars encode a millisecond timestamp — lexicographically sortable by creation time. Better for database index locality. Use for new systems that need ordered IDs.</span>
            </div>
          </div>

          <h2 id="try-it">Generate a UUID Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </span>
            <p>
              <Link href="/tools/uuid-generator"><strong>UUID Generator →</strong></Link>{' '}
              generates v4 UUIDs using <code style={{ fontSize: '0.9em', color: 'var(--green)' }}>crypto.randomUUID()</code> in your browser. No server involved.
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'What is the difference between UUID v1 and UUID v4?', a: 'v1 encodes timestamp + MAC address (sortable but reveals host identity). v4 is 122 bits of random data — no embedded info. Use v4 for most purposes; v7 for new systems needing sortability.' },
              { q: 'What is the difference between a UUID and a ULID?', a: 'ULIDs encode a millisecond timestamp in the first 48 bits, making them lexicographically sortable. UUIDs (v4) are fully random and not sortable. ULIDs are better for database primary keys; UUIDs are more universally supported.' },
              { q: 'How do I generate a UUID online?', a: 'Use the UUID Generator on SmartDevBox. It uses the browser\'s crypto.randomUUID() API — no data is sent to a server.' },
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
              { href: '/tools/uuid-generator', label: 'UUID Generator', desc: 'Generate UUID v4 values using the browser crypto API.' },
              { href: '/glossary/what-is-a-hash-function', label: 'What Is a Hash Function?', desc: 'UUID v3 and v5 use MD5 and SHA-1 hashing internally.' },
              { href: '/glossary/what-is-a-unix-timestamp', label: 'What Is a Unix Timestamp?', desc: 'UUID v1 and v7 embed timestamps — v7 uses Unix milliseconds.' },
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
          {[['#definition','Definition'],['#format','UUID format'],['#versions','Versions compared'],['#uuid-vs-ulid','UUID vs ULID'],['#try-it','Generate one'],['#faq','FAQ'],['#related','Related']].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/uuid-generator">UUID Generator</Link></li>
        </ul>
      </aside>
    </>
  );
}
