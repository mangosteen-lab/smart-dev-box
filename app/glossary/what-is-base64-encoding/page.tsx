import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is Base64 Encoding? Definition, Examples & How It Works',
  description:
    'Base64 encoding converts binary data into a text-safe string of 64 printable ASCII characters. Learn how it works, why it exists, and when to use it — with a free online decoder.',
  keywords: [
    'what is base64 encoding',
    'base64 encoding explained',
    'how does base64 work',
    'base64 definition',
    'base64 vs base64url',
    'base64 encode decode online',
    'base64 encoding example',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-base64-encoding' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'What Is Base64 Encoding? Definition, Examples & How It Works',
    description:
      'Base64 converts binary data to 64-character ASCII text. Learn why it exists, how it works, and the difference between Base64 and Base64url.',
    url: 'https://smartdevbox.com/glossary/what-is-base64-encoding',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is Base64 Encoding? Definition, Examples & How It Works',
    description:
      'Base64 converts binary data to 64-character ASCII text. Learn why it exists, how it works, and the difference between Base64 and Base64url.',
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What Is Base64 Encoding? Definition, Examples & How It Works',
  description:
    'Base64 encoding converts binary data into a text-safe string of 64 printable ASCII characters. Learn how it works, why it exists, and when to use it.',
  url: 'https://smartdevbox.com/glossary/what-is-base64-encoding',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  mainEntityOfPage: 'https://smartdevbox.com/glossary/what-is-base64-encoding',
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Base64 encoding?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Base64 encoding is a method of converting binary data into a string of 64 printable ASCII characters (A–Z, a–z, 0–9, +, /). It is used whenever binary data needs to be stored or transmitted in a context that only supports text, such as email attachments (MIME), data URIs in HTML/CSS, or HTTP Basic Authentication headers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Base64 encryption?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Base64 is an encoding scheme, not an encryption algorithm. It does not use a key and provides no confidentiality. Anyone can decode a Base64 string back to its original bytes instantly. Do not use Base64 to protect sensitive data.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Base64 and Base64url?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard Base64 uses + (plus) and / (slash) as its 62nd and 63rd characters and pads output to a multiple of 4 with = signs. Base64url replaces + with - (hyphen) and / with _ (underscore) and omits padding, making it safe to use in URLs and HTTP headers without percent-encoding. JWTs use Base64url for their header and payload sections.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does Base64 increase data size?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Base64 encodes every 3 bytes of input as 4 ASCII characters, increasing the data size by approximately 33%. For example, a 300-byte binary file becomes roughly 400 bytes when Base64-encoded.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I decode a Base64 string online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Paste your Base64 string into SmartDevBox at smartdevbox.com. It automatically detects Base64 encoding and decodes it to readable text in the browser — no button to click, no data sent to a server.',
      },
    },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-base64-encoding' },
    { '@type': 'ListItem', position: 3, name: 'What Is Base64 Encoding?', item: 'https://smartdevbox.com/glossary/what-is-base64-encoding' },
  ],
};

const ALPHABET_ROWS = [
  { chars: 'A–Z', values: '0–25',  count: 26 },
  { chars: 'a–z', values: '26–51', count: 26 },
  { chars: '0–9', values: '52–61', count: 10 },
  { chars: '+',   values: '62',    count: 1 },
  { chars: '/',   values: '63',    count: 1 },
];

const USE_CASES = [
  { label: 'Email attachments (MIME)', desc: 'SMTP allows only 7-bit ASCII. Base64 lets binary files travel safely as email attachment bodies.' },
  { label: 'Data URIs', desc: 'Embed images, fonts, or other binary resources directly in HTML or CSS without a separate HTTP request: data:image/png;base64,...' },
  { label: 'HTTP Basic Auth', desc: 'The Authorization header encodes username:password as Base64 — e.g. Authorization: Basic dXNlcjpwYXNz' },
  { label: 'JWT tokens', desc: 'The header and payload sections of a JSON Web Token are Base64url-encoded (a URL-safe variant) so they can travel in HTTP headers.' },
  { label: 'Binary in JSON / XML', desc: 'JSON and XML are text formats. Base64 is the standard way to embed binary data (images, certificates, keys) in these formats.' },
  { label: 'Kubernetes secrets', desc: 'Secret values in Kubernetes manifests are stored as Base64-encoded strings in the YAML data field.' },
];

export default function WhatIsBase64Page() {
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
          <h1 className="feat-h1">What Is Base64 Encoding?</h1>
          <p className="feat-lead">
            Base64 encoding converts binary data into a string made entirely of
            64 printable ASCII characters. It was designed to carry binary data
            safely through systems that only understand text — like email, HTML
            attributes, and HTTP headers.
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
              <strong>Base64 encoding</strong> is a binary-to-text encoding scheme that
              represents binary data as a sequence of printable characters chosen from an
              alphabet of 64 symbols. It is defined in{' '}
              <abbr title="Request for Comments 4648">RFC 4648</abbr>.
            </p>
          </div>

          <h2 id="why-it-exists">Why Does Base64 Exist?</h2>
          <p>
            Most data transmission protocols — SMTP (email), HTTP headers, HTML attributes —
            were designed for 7-bit ASCII text. Raw binary data (images, executables,
            cryptographic keys) contains byte values that either have no printable
            representation or are interpreted as control characters, causing data corruption
            in transit.
          </p>
          <p>
            Base64 solves this by converting every 3 bytes of binary input into exactly
            4 printable characters. The result is a safe, portable string that any
            text-based system can transmit without alteration.
          </p>

          <h2 id="how-it-works">How Base64 Encoding Works</h2>
          <p>
            Base64 processes input 3 bytes at a time (24 bits). Those 24 bits are split
            into four 6-bit groups, and each 6-bit value is mapped to one character in
            the Base64 alphabet:
          </p>
          <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border2)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Characters</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--text2)', fontWeight: 500 }}>Values</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {ALPHABET_ROWS.map(row => (
                  <tr key={row.chars} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem 1rem 0.5rem 0', fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{row.chars}</td>
                    <td style={{ padding: '0.5rem 1rem', color: 'var(--text)' }}>{row.values}</td>
                    <td style={{ padding: '0.5rem 0', color: 'var(--text)' }}>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            If the input length is not a multiple of 3, padding characters (
            <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>=</code>) are appended
            to make the output length a multiple of 4.
          </p>
          <p>
            <strong>Worked example.</strong> Encoding the ASCII string{' '}
            <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>Man</code>:
          </p>
          <ul>
            <li>ASCII bytes: <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>77 97 110</code> → binary: <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>01001101 01100001 01101110</code></li>
            <li>Split into four 6-bit groups: <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>010011 010110 000101 101110</code></li>
            <li>Map to alphabet: <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>19→T, 22→W, 5→F, 46→u</code></li>
            <li>Result: <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>TWFu</code></li>
          </ul>

          <h2 id="size-overhead">Size Overhead</h2>
          <p>
            Because 3 raw bytes become 4 ASCII characters, Base64-encoded output is always
            approximately <strong>33% larger</strong> than the original binary input. A
            1 MB PNG image becomes about 1.37 MB as a Base64 string. This overhead is a
            deliberate trade-off for text-safety.
          </p>

          <h2 id="base64url">Base64 vs Base64url</h2>
          <p>
            Standard Base64 uses <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>+</code> and{' '}
            <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>/</code> as its 62nd and 63rd
            characters and pads output with <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>=</code>.
            Those characters are special in URLs and HTTP headers. <strong>Base64url</strong>{' '}
            (defined in RFC 4648 §5) replaces <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>+</code>{' '}
            with <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>-</code> and{' '}
            <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>/</code> with{' '}
            <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>_</code>, and omits{' '}
            <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>=</code> padding.
            JWTs use Base64url for the header and payload sections.
          </p>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">Standard Base64</span>
              <span className="feat-card-desc">Characters: A–Z, a–z, 0–9, <strong>+</strong>, <strong>/</strong><br/>Padding: yes (=)<br/>Used in: MIME email, data URIs, general encoding</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">Base64url</span>
              <span className="feat-card-desc">Characters: A–Z, a–z, 0–9, <strong>-</strong>, <strong>_</strong><br/>Padding: no<br/>Used in: JWTs, URL parameters, HTTP headers</span>
            </div>
          </div>

          <h2 id="not-encryption">Base64 Is Not Encryption</h2>
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
              Base64 provides <strong>no confidentiality</strong>. There is no key —
              anyone can decode a Base64 string in milliseconds. It is frequently
              misused as an obfuscation technique. Use a proper encryption algorithm
              (AES-GCM, ChaCha20-Poly1305) if you need to protect sensitive data.
            </p>
          </div>

          <h2 id="use-cases">Where Base64 Is Used in Practice</h2>
          <div className="feat-grid">
            {USE_CASES.map(uc => (
              <div key={uc.label} className="feat-card">
                <span className="feat-card-label">{uc.label}</span>
                <span className="feat-card-desc">{uc.desc}</span>
              </div>
            ))}
          </div>

          {/* ── Tool CTA ── */}
          <h2 id="try-it">Decode or Encode Base64 Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </span>
            <p>
              SmartDevBox automatically detects Base64 strings when you paste them —
              no tool selection, no button click. It runs entirely in your browser;
              your data is never sent to a server.{' '}
              <Link href="/tools/base64-decoder"><strong>Open the Base64 Decoder →</strong></Link>
              {' '}or{' '}
              <Link href="/tools/base64-encoder"><strong>Base64 Encoder →</strong></Link>
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'Is Base64 encryption?', a: 'No. Base64 is an encoding scheme, not an encryption algorithm. It uses no key and provides no confidentiality — anyone can decode it instantly. Use a real encryption algorithm to protect sensitive data.' },
              { q: 'What is the difference between Base64 and Base64url?', a: 'Standard Base64 uses + and / and pads with =. Base64url replaces + with - and / with _ and omits padding. Base64url is safe in URLs and HTTP headers. JWTs use Base64url.' },
              { q: 'How much does Base64 increase data size?', a: 'Approximately 33%. Every 3 bytes of input becomes 4 ASCII output characters.' },
              { q: 'How do I decode a Base64 string online for free?', a: 'Paste your Base64 string into SmartDevBox. It auto-detects Base64 and decodes it instantly in your browser — no account, no server, no ads.' },
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
              { href: '/glossary/what-is-a-jwt', label: 'What Is a JWT?', desc: 'JSON Web Tokens use Base64url encoding for their header and payload sections.' },
              { href: '/glossary/what-is-a-hash-function', label: 'What Is a Hash Function?', desc: 'Hash digests are often displayed as hex or Base64 strings.' },
              { href: '/tools/base64-decoder', label: 'Base64 Decoder Tool', desc: 'Auto-detects Base64 on paste and decodes it instantly in the browser.' },
              { href: '/tools/base64-encoder', label: 'Base64 Encoder Tool', desc: 'Encode any text to Base64 — all processing is client-side.' },
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
            ['#why-it-exists', 'Why it exists'],
            ['#how-it-works',  'How it works'],
            ['#size-overhead', 'Size overhead'],
            ['#base64url',     'Base64 vs Base64url'],
            ['#not-encryption','Not encryption'],
            ['#use-cases',     'Use cases'],
            ['#try-it',        'Try it now'],
            ['#faq',           'FAQ'],
            ['#related',       'Related pages'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/base64-decoder">Base64 Decoder</Link></li>
          <li className="feat-toc-item"><Link href="/tools/base64-encoder">Base64 Encoder</Link></li>
        </ul>
      </aside>
    </>
  );
}
