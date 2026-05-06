import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is a Unix Timestamp? Definition, Examples & Converter',
  description:
    'A Unix timestamp is the number of seconds (or milliseconds) elapsed since 00:00:00 UTC on 1 January 1970. Learn how it works, common pitfalls, and convert one for free.',
  keywords: [
    'what is a unix timestamp',
    'unix timestamp explained',
    'epoch time definition',
    'unix time vs utc',
    'convert unix timestamp',
    'unix timestamp milliseconds vs seconds',
    'what is epoch time',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-a-unix-timestamp' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'What Is a Unix Timestamp? Definition, Examples & Converter',
    description:
      'A Unix timestamp counts seconds since 1 January 1970 UTC. Learn how it works, the seconds vs milliseconds gotcha, and convert one instantly.',
    url: 'https://smartdevbox.com/glossary/what-is-a-unix-timestamp',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is a Unix Timestamp? Definition, Examples & Converter',
    description:
      'A Unix timestamp counts seconds since 1 January 1970 UTC. Learn how it works, the seconds vs milliseconds gotcha, and convert one instantly.',
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What Is a Unix Timestamp? Definition, Examples & Converter',
  description: 'A Unix timestamp is the number of seconds elapsed since 00:00:00 UTC on 1 January 1970.',
  url: 'https://smartdevbox.com/glossary/what-is-a-unix-timestamp',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  mainEntityOfPage: 'https://smartdevbox.com/glossary/what-is-a-unix-timestamp',
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a Unix timestamp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Unix timestamp (also called epoch time or POSIX time) is the number of seconds that have elapsed since 00:00:00 Coordinated Universal Time (UTC) on Thursday, 1 January 1970. It is an integer — for example, the timestamp 1700000000 represents 14 November 2023 22:13:20 UTC. It is timezone-independent, making it the standard way to represent a point in time in computer systems.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Unix timestamp seconds and milliseconds?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Unix timestamp in seconds is a 10-digit number for recent dates (e.g. 1700000000). Many programming environments — especially JavaScript — use milliseconds instead, resulting in a 13-digit number (e.g. 1700000000000). Confusing the two is a common bug. If a date calculation gives a result in 1970 or 55000 years in the future, you likely mixed up seconds and milliseconds.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Year 2038 problem?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many legacy systems store Unix timestamps as a signed 32-bit integer, which overflows on 19 January 2038 at 03:14:07 UTC (the maximum value 2,147,483,647 wraps to a large negative number, representing 13 December 1901). Modern systems use 64-bit integers, which extend the representable range to billions of years and are not affected.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a Unix timestamp the same as UTC time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'They represent the same point in time but in different forms. UTC is a human-readable time standard (e.g. "2023-11-14T22:13:20Z"). A Unix timestamp is a single integer counting seconds from the epoch. Converting between them is lossless — there is a 1:1 correspondence (ignoring leap seconds, which Unix time does not account for).',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I convert a Unix timestamp to a human-readable date online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Paste your Unix timestamp into SmartDevBox. It automatically detects 10-digit (seconds) and 13-digit (milliseconds) timestamps and displays the equivalent date and time in UTC and your local timezone — no tool selection needed.',
      },
    },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-a-unix-timestamp' },
    { '@type': 'ListItem', position: 3, name: 'What Is a Unix Timestamp?', item: 'https://smartdevbox.com/glossary/what-is-a-unix-timestamp' },
  ],
};

const EXAMPLES = [
  { ts: '0',           human: '1970-01-01 00:00:00 UTC', note: 'The epoch (time zero)' },
  { ts: '1000000000',  human: '2001-09-09 01:46:40 UTC', note: 'First 10-digit timestamp milestone' },
  { ts: '1700000000',  human: '2023-11-14 22:13:20 UTC', note: 'A recent timestamp (seconds)' },
  { ts: '1700000000000', human: '2023-11-14 22:13:20 UTC', note: 'Same moment in milliseconds (JavaScript default)' },
  { ts: '2147483647',  human: '2038-01-19 03:14:07 UTC', note: 'Maximum value for signed 32-bit — the Year 2038 problem' },
];

export default function WhatIsUnixTimestampPage() {
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
          <h1 className="feat-h1">What Is a Unix Timestamp?</h1>
          <p className="feat-lead">
            A Unix timestamp is a single integer: the number of seconds that have
            elapsed since <strong>00:00:00 UTC on 1 January 1970</strong> — a moment
            known as the Unix epoch. It is timezone-independent, making it the universal
            language for representing points in time across computer systems.
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
              A <strong>Unix timestamp</strong> (also called <em>epoch time</em> or{' '}
              <em>POSIX time</em>) is the number of seconds elapsed since{' '}
              <strong>1970-01-01 00:00:00 UTC</strong>. It is defined by the POSIX
              standard and is the most portable way to represent an absolute point in time.
            </p>
          </div>

          <h2 id="examples">Examples</h2>
          <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border2)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Timestamp</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--text2)', fontWeight: 500 }}>Human-readable</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLES.map(row => (
                  <tr key={row.ts} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem 1rem 0.5rem 0', fontFamily: 'var(--font-mono)', color: 'var(--green)', whiteSpace: 'nowrap' }}>{row.ts}</td>
                    <td style={{ padding: '0.5rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text)', whiteSpace: 'nowrap' }}>{row.human}</td>
                    <td style={{ padding: '0.5rem 0', color: 'var(--text2)' }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="seconds-vs-ms">Seconds vs Milliseconds — The Most Common Bug</h2>
          <p>
            The Unix standard defines time in <strong>seconds</strong>. However,
            JavaScript&apos;s <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>Date.now()</code>{' '}
            and many modern APIs return time in <strong>milliseconds</strong>. This
            produces a 13-digit number instead of a 10-digit one.
          </p>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">10-digit timestamp (seconds)</span>
              <span className="feat-card-desc">
                <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>1700000000</code><br />
                Standard Unix time. Used in POSIX APIs, JWT claims (<code style={{ fontSize: '0.85em', color: 'var(--green)' }}>exp</code>, <code style={{ fontSize: '0.85em', color: 'var(--green)' }}>iat</code>), and most server-side languages.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">13-digit timestamp (milliseconds)</span>
              <span className="feat-card-desc">
                <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>1700000000000</code><br />
                JavaScript default (<code style={{ fontSize: '0.85em', color: 'var(--green)' }}>Date.now()</code>). Also used in many REST APIs and database timestamps for sub-second precision.
              </span>
            </div>
          </div>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </span>
            <p>
              If a timestamp calculation gives a result in <strong>1970</strong> or{' '}
              <strong>55,000 years in the future</strong>, you almost certainly mixed up
              seconds and milliseconds. Divide by 1000 (or multiply by 1000) accordingly.
            </p>
          </div>

          <h2 id="why-1970">Why Does the Epoch Start on 1 January 1970?</h2>
          <p>
            The epoch date is a historical convention. When Unix was being developed at
            Bell Labs in the early 1970s, engineers chose a round date in the recent past
            that fit within the data types available at the time. The exact date has no
            deeper significance — it simply predates all Unix systems by a comfortable
            margin while remaining representable as a small positive integer.
          </p>

          <h2 id="year-2038">The Year 2038 Problem</h2>
          <p>
            Legacy C programs and embedded systems often store timestamps as a{' '}
            <strong>signed 32-bit integer</strong>. The maximum value is
            2,147,483,647, which corresponds to{' '}
            <strong>2038-01-19 03:14:07 UTC</strong>. One second later, the integer
            overflows to a large negative number representing December 1901 —
            potentially causing crashes, incorrect date calculations, or security
            vulnerabilities.
          </p>
          <p>
            Modern systems use <strong>64-bit integers</strong> for timestamps, extending
            the valid range to approximately 292 billion years — safely beyond any
            practical concern.
          </p>

          <h2 id="where-used">Where Unix Timestamps Are Used</h2>
          <div className="feat-grid">
            {[
              { label: 'JWT claims', desc: 'exp (expiration), iat (issued at), and nbf (not before) are all Unix timestamps in seconds.' },
              { label: 'Log files', desc: 'Server logs and structured logs (JSON, syslog) commonly use Unix timestamps for machine-parseable, timezone-neutral timestamps.' },
              { label: 'Databases', desc: 'UNIX_TIMESTAMP() in MySQL, extract(epoch from ...) in PostgreSQL, and many NoSQL stores use epoch seconds or milliseconds.' },
              { label: 'File system', desc: 'File modification times (mtime, ctime, atime) in POSIX file systems are stored as Unix timestamps.' },
              { label: 'HTTP headers', desc: 'The Expires and Last-Modified headers use RFC 7231 date strings, but many APIs accept or return epoch timestamps instead.' },
              { label: 'Distributed systems', desc: 'Epoch timestamps enable consistent event ordering across multiple servers in different timezones without timezone conversion logic.' },
            ].map(uc => (
              <div key={uc.label} className="feat-card">
                <span className="feat-card-label">{uc.label}</span>
                <span className="feat-card-desc">{uc.desc}</span>
              </div>
            ))}
          </div>

          {/* ── Tool CTA ── */}
          <h2 id="try-it">Convert a Unix Timestamp Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </span>
            <p>
              Paste any Unix timestamp (10-digit seconds or 13-digit milliseconds) into
              SmartDevBox and it converts to UTC and local time automatically — no tool
              selection, no button click, no data sent to a server.{' '}
              <Link href="/tools/unix-timestamp-converter"><strong>Open the Unix Timestamp Converter →</strong></Link>
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'What is a Unix timestamp?', a: 'A Unix timestamp is the number of seconds elapsed since 1970-01-01 00:00:00 UTC (the Unix epoch). It is an integer — timezone-independent and universally understood by computers.' },
              { q: 'What is the difference between Unix timestamp seconds and milliseconds?', a: 'Seconds produce a 10-digit number (e.g. 1700000000). Milliseconds — the JavaScript default — produce a 13-digit number (e.g. 1700000000000). Mixing them up is a common source of bugs. Divide by 1000 to convert milliseconds to seconds.' },
              { q: 'What is the Year 2038 problem?', a: 'Systems storing timestamps as signed 32-bit integers overflow on 2038-01-19 at 03:14:07 UTC. Modern 64-bit systems are not affected. Embedded systems and legacy C code may still be at risk.' },
              { q: 'How do I convert a Unix timestamp online?', a: 'Paste your timestamp into SmartDevBox. It auto-detects 10-digit (seconds) and 13-digit (milliseconds) timestamps and shows the date in UTC and your local timezone instantly.' },
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
              { href: '/glossary/what-is-a-jwt', label: 'What Is a JWT?', desc: 'JWT exp, iat, and nbf claims are Unix timestamps in seconds.' },
              { href: '/glossary/what-is-json', label: 'What Is JSON?', desc: 'Log files and API responses that contain Unix timestamps are often JSON-formatted.' },
              { href: '/tools/unix-timestamp-converter', label: 'Unix Timestamp Converter', desc: 'Auto-detects 10-digit and 13-digit timestamps. Converts to UTC and local time instantly.' },
              { href: '/tools/jwt-decoder', label: 'JWT Decoder', desc: 'Decodes JWT exp and iat claims — paste the decoded value into the timestamp converter.' },
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
            ['#examples',      'Examples'],
            ['#seconds-vs-ms', 'Seconds vs milliseconds'],
            ['#why-1970',      'Why 1970?'],
            ['#year-2038',     'Year 2038 problem'],
            ['#where-used',    'Where it\'s used'],
            ['#try-it',        'Convert one now'],
            ['#faq',           'FAQ'],
            ['#related',       'Related pages'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/unix-timestamp-converter">Timestamp Converter</Link></li>
        </ul>
      </aside>
    </>
  );
}
