import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is a URL? Structure, Components & Encoding Explained',
  description:
    'A URL (Uniform Resource Locator) is the address of a resource on the web. Learn its components — scheme, host, path, query string, fragment — and how URL encoding works.',
  keywords: [
    'what is a url',
    'url structure explained',
    'url components',
    'what is url encoding',
    'query string explained',
    'url vs uri',
    'percent encoding',
    'parse url online',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-a-url' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'What Is a URL? Structure, Components & Encoding Explained',
    description: 'Learn the anatomy of a URL — scheme, authority, path, query, fragment — and how percent-encoding makes special characters safe.',
    url: 'https://smartdevbox.com/glossary/what-is-a-url',
  },
  twitter: { card: 'summary_large_image', title: 'What Is a URL? Structure, Components & Encoding Explained', description: 'Learn the anatomy of a URL — scheme, authority, path, query, fragment — and how percent-encoding works.' },
};

const articleJsonLd = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'What Is a URL? Structure, Components & Encoding Explained',
  description: 'A URL is the address of a resource on the web. Learn its components and how URL encoding works.',
  url: 'https://smartdevbox.com/glossary/what-is-a-url',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
};

const faqJsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is a URL?', acceptedAnswer: { '@type': 'Answer', text: 'A URL (Uniform Resource Locator) is a string that identifies the location of a resource on a network. It is a specific type of URI (Uniform Resource Identifier) that includes the means to access the resource — the scheme (e.g. https) and the address (host + path). Defined in RFC 3986.' } },
    { '@type': 'Question', name: 'What is URL encoding (percent-encoding)?', acceptedAnswer: { '@type': 'Answer', text: 'URL encoding (percent-encoding) converts characters that are not allowed or have special meaning in a URL into a safe representation: a % sign followed by two hexadecimal digits representing the UTF-8 byte value. For example, a space becomes %20, & becomes %26, and = becomes %3D.' } },
    { '@type': 'Question', name: 'What is the difference between a URL and a URI?', acceptedAnswer: { '@type': 'Answer', text: 'A URI (Uniform Resource Identifier) is any string that identifies a resource — it may identify but not locate it. A URL is a URI that also specifies how to access the resource (the scheme and address). All URLs are URIs, but not all URIs are URLs. In everyday use the terms are often used interchangeably.' } },
    { '@type': 'Question', name: 'What is a query string?', acceptedAnswer: { '@type': 'Answer', text: 'A query string is the portion of a URL after the ? character. It contains key-value pairs separated by & (e.g. ?page=2&sort=date). Query strings pass data to the server or to client-side JavaScript without changing the URL path.' } },
    { '@type': 'Question', name: 'How do I parse or encode a URL online?', acceptedAnswer: { '@type': 'Answer', text: 'Paste any URL into SmartDevBox. The URL Parser breaks it into scheme, host, port, path, query parameters, and fragment. The URL Encoder/Decoder converts between raw and percent-encoded forms. All processing is client-side.' } },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-a-url' },
    { '@type': 'ListItem', position: 3, name: 'What Is a URL?', item: 'https://smartdevbox.com/glossary/what-is-a-url' },
  ],
};

const COMPONENTS = [
  { part: 'scheme', example: 'https', desc: 'The protocol to use when accessing the resource. Common values: https, http, ftp, mailto, ws.' },
  { part: 'authority', example: 'user:pass@example.com:8080', desc: 'Optional userinfo (user:pass@), the host (domain or IP), and optional port. Most URLs omit userinfo.' },
  { part: 'path', example: '/tools/url-parser', desc: 'Hierarchical identifier for the resource within the host. Always begins with / when an authority is present.' },
  { part: 'query', example: '?page=2&sort=date', desc: 'Optional. Begins with ?. Contains key=value pairs separated by &, passing data to the server or JavaScript.' },
  { part: 'fragment', example: '#faq', desc: 'Optional. Begins with #. Identifies a section within the document. Never sent to the server — used only by the browser.' },
];

const ENCODING_EXAMPLES = [
  { raw: 'hello world', encoded: 'hello%20world' },
  { raw: 'name=Ada Lovelace', encoded: 'name=Ada%20Lovelace' },
  { raw: 'tags=a&b', encoded: 'tags=a%26b' },
  { raw: 'price=£10', encoded: 'price=%C2%A310' },
  { raw: '日本語', encoded: '%E6%97%A5%E6%9C%AC%E8%AA%9E' },
];

export default function WhatIsUrlPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow"><span className="feat-eyebrow-dot" />Glossary</div>
          <h1 className="feat-h1">What Is a URL?</h1>
          <p className="feat-lead">
            A URL (Uniform Resource Locator) is the address used to access a resource on a
            network. It encodes the protocol, server, path, and optional parameters into a
            single string — and has strict rules about which characters are allowed and how
            to encode the rest.
          </p>
        </div>

        <div className="feat-prose">
          <h2 id="definition">The One-Line Definition</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            <p>A <strong>URL</strong> is a string that identifies both the location of a resource and the protocol used to access it. It is defined by <abbr title="Request for Comments 3986">RFC 3986</abbr> and has the generic form: <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>scheme://authority/path?query#fragment</code>.</p>
          </div>

          <h2 id="anatomy">Anatomy of a URL</h2>
          <p>Consider: <code style={{ color: 'var(--green)', fontSize: '0.9em', wordBreak: 'break-all' }}>https://example.com:8080/tools/url-parser?page=2&sort=date#faq</code></p>
          <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border2)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Component</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--text2)', fontWeight: 500 }}>Example value</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {COMPONENTS.map(c => (
                  <tr key={c.part} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem 1rem 0.5rem 0', fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{c.part}</td>
                    <td style={{ padding: '0.5rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text)', fontSize: '0.85em', wordBreak: 'break-all' }}>{c.example}</td>
                    <td style={{ padding: '0.5rem 0', color: 'var(--text)' }}>{c.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="encoding">URL Encoding (Percent-Encoding)</h2>
          <p>
            URLs may only contain a limited set of ASCII characters. Characters outside
            this set — spaces, non-ASCII Unicode, and reserved characters used as delimiters —
            must be <strong>percent-encoded</strong>: replaced with a{' '}
            <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>%</code> followed by two
            hexadecimal digits representing the UTF-8 byte.
          </p>
          <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border2)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Raw</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Percent-encoded</th>
                </tr>
              </thead>
              <tbody>
                {ENCODING_EXAMPLES.map(e => (
                  <tr key={e.raw} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem 1rem 0.5rem 0', fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{e.raw}</td>
                    <td style={{ padding: '0.5rem 0', fontFamily: 'var(--font-mono)', color: 'var(--green)', wordBreak: 'break-all' }}>{e.encoded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="url-vs-uri">URL vs URI</h2>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">URI — identifies</span>
              <span className="feat-card-desc">A URI names or identifies a resource. It may or may not include how to locate it. Example: <code style={{ fontSize: '0.85em', color: 'var(--green)' }}>urn:isbn:0451450523</code> is a URI that identifies a book but doesn&apos;t tell you where to get it.</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">URL — locates</span>
              <span className="feat-card-desc">A URL is a URI that also tells you how to access the resource — the scheme specifies the protocol. All URLs are URIs; most URIs developers encounter daily are URLs.</span>
            </div>
          </div>

          <h2 id="try-it">Parse or Encode a URL Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </span>
            <p>
              Paste any URL into SmartDevBox and it is parsed into its components automatically.{' '}
              <Link href="/tools/url-parser"><strong>URL Parser →</strong></Link>{' '}·{' '}
              <Link href="/tools/url-encoder"><strong>URL Encoder →</strong></Link>{' '}·{' '}
              <Link href="/tools/url-decoder"><strong>URL Decoder →</strong></Link>
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'What is URL encoding?', a: 'URL encoding (percent-encoding) replaces unsafe characters with % followed by two hex digits representing the UTF-8 byte. A space becomes %20, & becomes %26.' },
              { q: 'What is the difference between a URL and a URI?', a: 'A URI identifies a resource. A URL is a URI that also specifies how to access it (via a scheme like https). All URLs are URIs.' },
              { q: 'What is a query string?', a: 'The portion after ? in a URL. Contains key=value pairs separated by &. Used to pass parameters to the server or client-side JavaScript.' },
              { q: 'How do I parse a URL online?', a: 'Paste your URL into SmartDevBox. It auto-detects URLs and breaks them into scheme, host, port, path, query parameters, and fragment — all client-side.' },
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
              { href: '/tools/url-parser', label: 'URL Parser', desc: 'Breaks any URL into scheme, host, port, path, query params, and fragment.' },
              { href: '/tools/url-encoder', label: 'URL Encoder', desc: 'Percent-encodes a string for safe use in a URL.' },
              { href: '/tools/url-decoder', label: 'URL Decoder', desc: 'Decodes percent-encoded URL components back to readable text.' },
              { href: '/glossary/what-is-base64-encoding', label: 'What Is Base64 Encoding?', desc: 'Base64url is a URL-safe variant of Base64 used in JWTs.' },
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
          {[['#definition','Definition'],['#anatomy','URL anatomy'],['#encoding','URL encoding'],['#url-vs-uri','URL vs URI'],['#try-it','Try it now'],['#faq','FAQ'],['#related','Related']].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/url-parser">URL Parser</Link></li>
          <li className="feat-toc-item"><Link href="/tools/url-encoder">URL Encoder</Link></li>
        </ul>
      </aside>
    </>
  );
}
