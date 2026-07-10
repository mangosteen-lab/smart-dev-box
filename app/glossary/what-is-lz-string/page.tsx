import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is LZ-String? Compression for URLs & localStorage Explained',
  description:
    'LZ-String is a JavaScript library that compresses strings into compact, text-safe output — ideal for packing state into URLs or localStorage. Learn how it works, its output variants, and when to use it.',
  keywords: [
    'what is lz-string',
    'lz-string explained',
    'how does lz-string work',
    'lz-string compress url',
    'lz-string base64 vs encodeduricomponent',
    'lz-string localstorage',
    'lz-string decompress online',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-lz-string' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'What Is LZ-String? Compression for URLs & localStorage Explained',
    description:
      'LZ-String compresses strings into compact, text-safe output for URLs and localStorage. Learn how it works and which output variant to use.',
    url: 'https://smartdevbox.com/glossary/what-is-lz-string',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is LZ-String? Compression for URLs & localStorage Explained',
    description:
      'LZ-String compresses strings into compact, text-safe output for URLs and localStorage. Learn how it works and which output variant to use.',
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What Is LZ-String? Compression for URLs & localStorage Explained',
  description:
    'LZ-String is a JavaScript library that compresses strings into compact, text-safe output — ideal for packing state into URLs or localStorage. Learn how it works, its output variants, and when to use it.',
  url: 'https://smartdevbox.com/glossary/what-is-lz-string',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  mainEntityOfPage: 'https://smartdevbox.com/glossary/what-is-lz-string',
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is LZ-String?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LZ-String is an open-source JavaScript library by pieroxy that compresses a string into a much shorter, text-safe representation. It is designed for the browser and is most often used to pack application state into a URL or to store large values compactly in localStorage.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is LZ-String the same as gzip?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. LZ-String is an LZ-based compressor implemented in pure JavaScript and tuned for short strings and browser use. Its output is not compatible with gzip, zlib, or DEFLATE — you must decompress it with LZ-String again.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between compressToBase64 and compressToEncodedURIComponent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'compressToBase64 outputs the standard Base64 alphabet (A–Z, a–z, 0–9, +, /) with = padding — safe for JSON, headers, and general text. compressToEncodedURIComponent outputs a URL-safe alphabet (it uses - and $ instead of / and =), so the result can be dropped straight into a query string or hash fragment without percent-encoding. The two are NOT interchangeable — you must decompress with the matching function.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is LZ-String encryption?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. LZ-String is compression, not encryption. It uses no key and provides no confidentiality — anyone can decompress the output. Do not rely on it to protect sensitive data.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I decompress an LZ-String value online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Paste the compressed value into SmartDevBox. The LZ-String Decompress tool automatically tries every output variant (URL-safe, Base64, UTF-16, and raw) and returns the original text in your browser — no data leaves the page.',
      },
    },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-lz-string' },
    { '@type': 'ListItem', position: 3, name: 'What Is LZ-String?', item: 'https://smartdevbox.com/glossary/what-is-lz-string' },
  ],
};

const VARIANT_ROWS = [
  { fn: 'compress / decompress', alphabet: 'Raw 16-bit chars', safeFor: 'In-memory only — may contain invalid UTF-16; can be mangled by storage/transport', size: 'Smallest' },
  { fn: 'compressToUTF16 / decompressFromUTF16', alphabet: 'Valid UTF-16 (15 bits/char)', safeFor: 'localStorage, sessionStorage, IndexedDB', size: '≈ +6%' },
  { fn: 'compressToBase64 / decompressFromBase64', alphabet: 'A–Z a–z 0–9 + / =', safeFor: 'JSON, HTTP headers, general ASCII text', size: '≈ +33%' },
  { fn: 'compressToEncodedURIComponent / …', alphabet: 'A–Z a–z 0–9 + - $', safeFor: 'URL query strings & hash fragments (no % escaping)', size: '≈ +33%' },
  { fn: 'compressToUint8Array / …', alphabet: 'Raw bytes', safeFor: 'Blobs, file downloads, binary channels', size: 'Small' },
];

const USE_CASES = [
  { label: 'Shareable app state in URLs', desc: 'Playgrounds and editors (diagram tools, code sandboxes, query builders) encode the entire document into a URL so a link fully restores the state — no backend required.' },
  { label: 'Compact localStorage', desc: 'Browser storage quotas are limited. Compressing large JSON blobs with compressToUTF16 before storing them fits far more data under the same quota.' },
  { label: 'Shorter deep links', desc: 'Packing filters, form values, or wizard steps into a compressed query parameter keeps URLs short enough to survive copy-paste and messaging apps.' },
  { label: 'Reducing payload size', desc: 'When a small client-side payload must ride inside a text field, header, or QR code, LZ-String shrinks it without pulling in a heavy gzip dependency.' },
  { label: 'Offline-first caching', desc: 'Progressive web apps cache compressed snapshots of data locally so they load instantly and use less disk.' },
];

export default function WhatIsLzStringPage() {
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
          <h1 className="feat-h1">What Is LZ-String?</h1>
          <p className="feat-lead">
            LZ-String is a small JavaScript library that compresses a string into
            a much shorter, text-safe form. It was built for the browser — its
            signature use is packing application state into a URL or squeezing
            large values into <code>localStorage</code>.
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
              <strong>LZ-String</strong> is an open-source, dependency-free
              JavaScript compression library (created by{' '}
              <em>pieroxy</em>) that turns any string into a compact, text-safe
              string using an <abbr title="Lempel–Ziv">LZ</abbr>-based algorithm.
            </p>
          </div>

          <h2 id="why-it-exists">Why Does LZ-String Exist?</h2>
          <p>
            The web moves a lot of small strings through channels that were never
            meant for bulk data: URL query strings, hash fragments, HTTP headers,
            and the browser&rsquo;s <code>localStorage</code> (typically capped at
            around 5&nbsp;MB per origin). General-purpose compressors like gzip
            are geared toward files and, until recently, were not readily
            available in the browser.
          </p>
          <p>
            LZ-String fills that gap. It is tiny, runs entirely client-side, and —
            crucially — can emit output in several <strong>alphabets</strong> so
            the compressed result is safe to drop directly into a URL, a JSON
            field, or <code>localStorage</code> without a second encoding step.
          </p>

          <h2 id="how-it-works">How LZ-String Works</h2>
          <p>
            LZ-String uses a dictionary-based <strong>LZ</strong> scheme: as it
            scans the input it builds a growing dictionary of substrings it has
            already seen, and replaces repeated substrings with short numeric
            references. Highly repetitive text — like JSON with recurring keys —
            compresses dramatically.
          </p>
          <p>
            Its clever trick is <strong>bit packing</strong>. JavaScript strings
            are sequences of 16-bit code units, so LZ-String packs multiple output
            bits into each character rather than wasting a full byte per symbol.
            The raw <code>compress()</code> output is the most compact, but those
            characters can include values that are invalid or fragile in text
            channels — which is exactly why the encoded variants below exist.
          </p>
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
              LZ-String is <strong>not compatible with gzip, zlib, or DEFLATE</strong>.
              A value compressed with LZ-String can only be decompressed with
              LZ-String. It is optimised for short strings in the browser, not for
              interoperable file compression.
            </p>
          </div>

          <h2 id="variants">The Output Variants (and Which to Use)</h2>
          <p>
            This is the part that trips people up. LZ-String ships several
            compress/decompress pairs that differ only in the <strong>output
            alphabet</strong>. They are <em>not</em> interchangeable — you must
            decompress with the same variant that compressed the data.
          </p>
          <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border2)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Function pair</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--text2)', fontWeight: 500 }}>Output alphabet</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--text2)', fontWeight: 500 }}>Safe for</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Size vs raw</th>
                </tr>
              </thead>
              <tbody>
                {VARIANT_ROWS.map(row => (
                  <tr key={row.fn} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem 1rem 0.5rem 0', fontFamily: 'var(--font-mono)', color: 'var(--green)', whiteSpace: 'nowrap' }}>{row.fn}</td>
                    <td style={{ padding: '0.5rem 1rem', color: 'var(--text)' }}>{row.alphabet}</td>
                    <td style={{ padding: '0.5rem 1rem', color: 'var(--text)' }}>{row.safeFor}</td>
                    <td style={{ padding: '0.5rem 0', color: 'var(--text)', whiteSpace: 'nowrap' }}>{row.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">Sharing in a URL?</span>
              <span className="feat-card-desc">Use <strong>compressToEncodedURIComponent</strong>. Its output is already URL-safe, so it survives query strings and hash fragments without percent-encoding.</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">Storing in localStorage?</span>
              <span className="feat-card-desc">Use <strong>compressToUTF16</strong>. It stays within valid UTF-16 so the browser will not corrupt it on write/read.</span>
            </div>
          </div>

          <h2 id="compression-ratio">How Much Does It Save?</h2>
          <p>
            Savings depend entirely on the input. Long, repetitive text — pretty-printed
            JSON, HTML, application state with recurring keys — often shrinks by
            <strong> 50–90%</strong> even after re-encoding to a text-safe alphabet.
            Very short or high-entropy input (already-random tokens, tiny strings)
            can <em>grow</em>, because the dictionary and encoding overhead exceeds
            what little redundancy there is. LZ-String pays off on payloads of at
            least a few hundred characters.
          </p>

          <h2 id="not-encryption">LZ-String Is Not Encryption</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <p>
              A compressed string may <em>look</em> scrambled, but it offers
              <strong> no confidentiality</strong>. There is no key — anyone can
              decompress it in milliseconds. If you need to protect data, encrypt
              it with a real algorithm (AES-GCM, ChaCha20-Poly1305)
              <em> before</em> compressing.
            </p>
          </div>

          <h2 id="use-cases">Where LZ-String Is Used in Practice</h2>
          <div className="feat-grid">
            {USE_CASES.map(uc => (
              <div key={uc.label} className="feat-card">
                <span className="feat-card-label">{uc.label}</span>
                <span className="feat-card-desc">{uc.desc}</span>
              </div>
            ))}
          </div>

          {/* ── Tool CTA ── */}
          <h2 id="try-it">Compress or Decompress LZ-String Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </span>
            <p>
              SmartDevBox runs LZ-String entirely in your browser — your data is
              never sent to a server. Paste a compressed value and the decompressor
              auto-detects the variant (URL-safe, Base64, UTF-16, or raw) for you.{' '}
              <Link href="/tools/lz-string-compress"><strong>Open LZ-String Compress →</strong></Link>
              {' '}or{' '}
              <Link href="/tools/lz-string-decompress"><strong>LZ-String Decompress →</strong></Link>
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'Is LZ-String the same as gzip?', a: 'No. LZ-String is a pure-JavaScript, LZ-based compressor tuned for short strings in the browser. Its output is not compatible with gzip, zlib, or DEFLATE — decompress it with LZ-String.' },
              { q: 'What is the difference between compressToBase64 and compressToEncodedURIComponent?', a: 'Base64 output uses A–Z, a–z, 0–9, + and / with = padding. EncodedURIComponent output is URL-safe: it uses - and $ instead of / and =, so it needs no percent-encoding in a query string. They are not interchangeable — decompress with the matching function.' },
              { q: 'Why does my LZ-String value fail to decompress?', a: 'Almost always a variant mismatch — e.g. the value was produced by compressToBase64 but you are decompressing with the EncodedURIComponent function. SmartDevBox avoids this by trying every variant automatically.' },
              { q: 'Is LZ-String encryption?', a: 'No. It is compression with no key and no confidentiality. Anyone can decompress it. Encrypt sensitive data separately.' },
              { q: 'Can LZ-String make my string longer?', a: 'Yes, for very short or already-random input. The dictionary and text-safe encoding add overhead that only pays off once there is enough redundancy to compress — typically a few hundred characters or more.' },
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
              { href: '/tools/lz-string-compress', label: 'LZ-String Compress Tool', desc: 'Compress text into a URL-safe string, entirely in your browser.' },
              { href: '/tools/lz-string-decompress', label: 'LZ-String Decompress Tool', desc: 'Auto-detects the variant (URL-safe, Base64, UTF-16, raw) and restores the text.' },
              { href: '/glossary/what-is-base64-encoding', label: 'What Is Base64 Encoding?', desc: 'The ASCII-safe alphabet used by one of LZ-String’s output variants.' },
              { href: '/glossary/what-is-a-url', label: 'What Is a URL?', desc: 'The query string and fragment are where URL-safe LZ-String payloads live.' },
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
            ['#definition',         'Definition'],
            ['#why-it-exists',      'Why it exists'],
            ['#how-it-works',       'How it works'],
            ['#variants',           'Output variants'],
            ['#compression-ratio',  'How much it saves'],
            ['#not-encryption',     'Not encryption'],
            ['#use-cases',          'Use cases'],
            ['#try-it',             'Try it now'],
            ['#faq',                'FAQ'],
            ['#related',            'Related pages'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/lz-string-compress">LZ-String Compress</Link></li>
          <li className="feat-toc-item"><Link href="/tools/lz-string-decompress">LZ-String Decompress</Link></li>
        </ul>
      </aside>
    </>
  );
}
