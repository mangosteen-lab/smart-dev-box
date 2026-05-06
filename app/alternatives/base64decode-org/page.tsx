import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SmartDevBox vs base64decode.org — Best Free Base64 Decoder Alternatives',
  description:
    'Comparing SmartDevBox and base64decode.org for Base64 decoding. SmartDevBox auto-detects Base64 on paste alongside 97+ other dev tools. No sign-up, 100% client-side.',
  keywords: [
    'base64decode.org alternative',
    'best base64 decoder online',
    'base64 decoder alternative',
    'base64decode.org vs smartdevbox',
    'free base64 decoder',
    'base64 decode online',
    'base64 encoder decoder online',
    'base64decode.org replacement',
  ],
  alternates: { canonical: 'https://smartdevbox.com/alternatives/base64decode-org' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'SmartDevBox vs base64decode.org — Best Base64 Decoder Alternatives',
    description:
      'SmartDevBox auto-decodes Base64 on paste alongside 97+ dev tools. base64decode.org is a focused single-purpose decoder. Full comparison inside.',
    url: 'https://smartdevbox.com/alternatives/base64decode-org',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartDevBox vs base64decode.org — Best Base64 Decoder Alternatives',
    description:
      'SmartDevBox: auto-detect Base64 on paste, 97+ tools. base64decode.org: single-purpose decoder. See the full comparison.',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is there a good base64decode.org alternative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. SmartDevBox is a strong alternative to base64decode.org. It auto-detects Base64 strings on paste and decodes them immediately — no button click, no page load. It also includes 97+ other developer tools so you can decode Base64, format the JSON inside, and convert a timestamp all in one browser tab.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does SmartDevBox support Base64 for files and images?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SmartDevBox decodes Base64 text strings and displays the output as UTF-8 text. For data URIs containing images (e.g. data:image/png;base64,...), the decoder outputs the raw bytes as text. Dedicated image-preview from Base64 is not currently supported — use base64decode.org or a similar tool for that specific use case.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can SmartDevBox encode text to Base64?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Base64 Encoder tool in SmartDevBox converts any text input to its Base64 representation. Like all SmartDevBox tools it works entirely in the browser with no server involvement.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Base64 and Base64url?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard Base64 uses + and / as the 62nd and 63rd characters and pads output with = signs. Base64url replaces + with - and / with _ and omits padding, making the output safe to include in URLs and HTTP headers without percent-encoding. JWTs use Base64url for their header and payload sections.',
      },
    },
  ],
};

const COMPARISON_ROWS = [
  {
    feature: 'Base64 decoding',
    smartdevbox: 'Auto-detected on paste — result shown immediately',
    b64org: 'Paste into input field, click Decode button',
  },
  {
    feature: 'Steps to decode',
    smartdevbox: '1 — paste anywhere in SmartDevBox',
    b64org: '3 — open site, paste, click button',
  },
  {
    feature: 'Base64 encoding',
    smartdevbox: 'Yes — dedicated Base64 Encoder tool',
    b64org: 'Yes — Encode tab on same page',
  },
  {
    feature: 'Base64url support',
    smartdevbox: 'Yes — detected automatically from JWT pattern',
    b64org: 'Limited — standard Base64 only',
  },
  {
    feature: 'File / image Base64 preview',
    smartdevbox: 'Not supported (text output only)',
    b64org: 'Yes — can render decoded images inline',
  },
  {
    feature: 'Other tools beyond Base64',
    smartdevbox: '97+ tools (JSON, JWT, URL, hash, regex, cron, XML, SQL, and more)',
    b64org: 'Base64 encode/decode only',
  },
  {
    feature: 'Auto-detection of input format',
    smartdevbox: 'Yes — detects Base64, JSON, JWT, URL, XML, and 15+ other formats',
    b64org: 'No — single-purpose dedicated page',
  },
  {
    feature: 'Charset / encoding options',
    smartdevbox: 'UTF-8 output',
    b64org: 'Configurable charset (UTF-8, ISO-8859-1, etc.)',
  },
  {
    feature: 'Privacy',
    smartdevbox: '100% client-side, no server communication',
    b64org: 'Decodes server-side (data sent to server)',
  },
  {
    feature: 'Free to use',
    smartdevbox: 'Yes',
    b64org: 'Yes (ad-supported)',
  },
  {
    feature: 'Works offline',
    smartdevbox: 'Yes (PWA)',
    b64org: 'No — requires network',
  },
  {
    feature: 'No ads',
    smartdevbox: 'Yes — no advertising',
    b64org: 'No — ad-supported free tier',
  },
];

const BASE64_VARIANTS = [
  { name: 'Standard Base64', chars: 'A–Z, a–z, 0–9, +, /', padding: 'Yes (=)', use: 'General encoding, MIME/email attachments' },
  { name: 'Base64url', chars: 'A–Z, a–z, 0–9, -, _', padding: 'No', use: 'JWTs, URL parameters, HTTP headers' },
  { name: 'Base32', chars: 'A–Z, 2–7', padding: 'Yes (=)', use: 'TOTP secrets, case-insensitive contexts' },
  { name: 'Base16 (hex)', chars: '0–9, A–F', padding: 'No', use: 'Hash digests, binary data display' },
];

export default function VsBase64DecodeOrgPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Article ────────────────────────────────────────────────────────── */}
      <article className="feat-article">
        {/* Hero */}
        <div className="feat-hero">
          <div className="feat-eyebrow">
            <span className="feat-eyebrow-dot" />
            Alternative
          </div>
          <h1 className="feat-h1">SmartDevBox vs base64decode.org — Best Free Base64 Decoder Alternatives</h1>
          <p className="feat-lead">
            base64decode.org is a focused single-purpose decoder. SmartDevBox is the
            faster choice when you want Base64 decoded the instant you paste — with no
            button click and no tab switch — plus 91 other tools available in the same
            interface.
          </p>
        </div>

        {/* Body */}
        <div className="feat-prose">

          {/* TL;DR */}
          <h2 id="tldr">The Short Answer</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </span>
            <p>
              <strong>Use SmartDevBox</strong> when you want to paste a Base64 string
              from a log, config file, or API response and see the decoded output
              immediately — no navigation, no button click, no ads.{' '}
              <strong>Use base64decode.org</strong> when you specifically need to decode
              a Base64-encoded image and preview it inline, or when you need charset
              options beyond UTF-8.
            </p>
          </div>

          {/* What is base64decode.org */}
          <h2 id="what-is-base64decode-org">What Is base64decode.org?</h2>
          <p>
            base64decode.org is a free web tool that encodes and decodes Base64 strings.
            It has existed for over a decade and is one of the most-visited Base64 tools
            online, primarily because of its early ranking in search results for
            &quot;base64 decode online&quot;.
          </p>
          <p>
            Its main advantages over most alternatives are: support for multiple character
            sets (UTF-8, ISO-8859-1, Windows-1252, and others), the ability to render
            decoded images inline when you decode a data URI, and a simple two-tab
            interface (Encode / Decode) that is immediately understood by new users.
            The main limitations are: the site sends your input to a server for decoding
            (a privacy consideration), it shows display advertising, and it is a
            single-purpose tool — you cannot format the decoded JSON, parse a URL,
            or check a hash in the same interface.
          </p>

          {/* SmartDevBox Base64 */}
          <h2 id="smartdevbox-base64">SmartDevBox Base64 Decoding</h2>
          <p>
            SmartDevBox detects Base64 strings automatically on paste using a confidence-
            scoring detector. A string is identified as Base64 if it matches the
            character set (A–Z, a–z, 0–9, +, /, =), has a length that is a multiple
            of 4 (or is a valid padded length), and scores above the confidence
            threshold. The decoded UTF-8 output appears instantly, with no button click
            required.
          </p>
          <p>
            Because SmartDevBox runs entirely in the browser (no server requests), your
            Base64 input never leaves your machine. This matters when decoding
            configuration secrets, API credentials embedded in tokens, or any
            data that should not be transmitted over the network.
          </p>
          <p>
            If the decoded output is itself a JSON object — a common pattern in JWT
            payloads, OAuth responses, and AWS STS credentials — you can paste it into
            the JSON Formatter tool in the same SmartDevBox tab and it will be
            pretty-printed and syntax-highlighted immediately.
          </p>

          {/* Comparison table */}
          <h2 id="comparison-table">Feature Comparison</h2>
          <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 'var(--fs-sm)',
              lineHeight: '1.6',
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border2)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0', color: 'var(--text2)', fontWeight: 500, whiteSpace: 'nowrap' }}>Feature</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--green)', fontWeight: 500 }}>SmartDevBox</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0 0.5rem 1rem', color: 'var(--text2)', fontWeight: 500 }}>base64decode.org</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.6rem 1rem 0.6rem 0', color: 'var(--text2)', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{row.feature}</td>
                    <td style={{ padding: '0.6rem 1rem', color: 'var(--text)', verticalAlign: 'top' }}>{row.smartdevbox}</td>
                    <td style={{ padding: '0.6rem 0 0.6rem 1rem', color: 'var(--text)', verticalAlign: 'top' }}>{row.b64org}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Base64 variants reference */}
          <h2 id="base64-variants">Base64 Variants Reference</h2>
          <p>
            Not all Base64 is the same. Here are the four most common encoding variants
            you will encounter as a developer:
          </p>
          <div className="feat-grid">
            {BASE64_VARIANTS.map((v) => (
              <div key={v.name} className="feat-card">
                <span className="feat-card-label">{v.name}</span>
                <span className="feat-card-desc">
                  <strong>Chars:</strong> {v.chars}<br />
                  <strong>Padding:</strong> {v.padding}<br />
                  <strong>Used for:</strong> {v.use}
                </span>
              </div>
            ))}
          </div>

          {/* Privacy */}
          <h2 id="privacy">Privacy Comparison</h2>
          <p>
            This is the most important practical difference between the two tools for
            developers handling sensitive data.
          </p>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">SmartDevBox — fully client-side</span>
              <span className="feat-card-desc">
                All decoding happens in your browser via JavaScript. No HTTP request
                is made when you paste or decode. Your input cannot be logged,
                cached, or intercepted at a network level.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">base64decode.org — server-side</span>
              <span className="feat-card-desc">
                Your input is sent to a server for decoding. The server may log
                requests. This is a meaningful risk if you are decoding credentials,
                secrets, or tokens — even if the site has a privacy policy.
              </span>
            </div>
          </div>

          {/* Common use cases */}
          <h2 id="use-cases">Common Base64 Use Cases for Developers</h2>
          <ol className="feat-steps">
            <li className="feat-step">
              <span className="feat-step-num">1</span>
              <span className="feat-step-text">
                <strong>Decoding JWT payloads.</strong> A JWT&apos;s payload section is
                Base64url-encoded. Paste the middle section of a JWT (between the two
                dots) into SmartDevBox and it decodes the JSON claims automatically.
                Or paste the full token — SmartDevBox auto-detects the JWT pattern and
                shows both header and payload decoded.
              </span>
            </li>
            <li className="feat-step">
              <span className="feat-step-num">2</span>
              <span className="feat-step-text">
                <strong>Reading Kubernetes secrets.</strong> Kubernetes stores secret
                values as Base64-encoded strings in YAML. Copy the value and paste it
                into SmartDevBox to decode it inline — without sending the secret over
                the network.
              </span>
            </li>
            <li className="feat-step">
              <span className="feat-step-num">3</span>
              <span className="feat-step-text">
                <strong>Decoding Basic Auth credentials.</strong> HTTP Basic
                Authentication headers are formatted as{' '}
                <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>
                  Basic [Base64(username:password)]
                </code>
                . Paste the Base64 portion into SmartDevBox to verify the credentials
                without sending them to an external server.
              </span>
            </li>
            <li className="feat-step">
              <span className="feat-step-num">4</span>
              <span className="feat-step-text">
                <strong>Encoding credentials for config files.</strong> Use the Base64
                Encoder tool to generate the Base64 value for an HTTP Authorization
                header or a configuration file that requires Base64-encoded secrets.
              </span>
            </li>
          </ol>

          {/* FAQ */}
          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Is there a good base64decode.org alternative?</h3>
              <p className="feat-faq-a">
                Yes. SmartDevBox is a strong alternative. It auto-detects Base64 strings
                on paste and decodes them immediately with no button click. Unlike
                base64decode.org, it is fully client-side (your data is never sent to a
                server), has no ads, and includes 97+ other developer tools.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Does SmartDevBox support Base64 for files and images?</h3>
              <p className="feat-faq-a">
                SmartDevBox decodes Base64 text strings and displays UTF-8 output.
                Rendering decoded images inline is not currently supported — use
                base64decode.org or a similar tool for that specific use case.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Can SmartDevBox encode text to Base64?</h3>
              <p className="feat-faq-a">
                Yes. The Base64 Encoder tool converts any text input to Base64. All
                processing is done in the browser with no server involvement.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">What is the difference between Base64 and Base64url?</h3>
              <p className="feat-faq-a">
                Standard Base64 uses + and / as characters and pads output with =.
                Base64url replaces + with - and / with _ and omits padding, making
                the output safe in URLs and HTTP headers. JWTs use Base64url for their
                header and payload sections.
              </p>
            </div>
          </div>

          {/* Related */}
          <h2 id="related">Related Pages</h2>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">
                <Link href="/tools/base64-decoder" style={{ color: 'inherit' }}>Base64 Decoder Tool →</Link>
              </span>
              <span className="feat-card-desc">
                Decode any Base64 string. Auto-detected on paste — output shown as
                formatted UTF-8 text instantly.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">
                <Link href="/tools/base64-encoder" style={{ color: 'inherit' }}>Base64 Encoder Tool →</Link>
              </span>
              <span className="feat-card-desc">
                Encode any text string to Base64. Browser-only — your input never
                leaves your machine.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">
                <Link href="/vs/jwt-io" style={{ color: 'inherit' }}>SmartDevBox vs jwt.io →</Link>
              </span>
              <span className="feat-card-desc">
                Comparing SmartDevBox and jwt.io for JWT decoding. Auto-detection vs
                signature verification.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">
                <Link href="/vs/cyberchef" style={{ color: 'inherit' }}>SmartDevBox vs CyberChef →</Link>
              </span>
              <span className="feat-card-desc">
                Comparing SmartDevBox and CyberChef for everyday developer tasks.
                Auto-detection vs recipe building.
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* ── TOC ──────────────────────────────────────────────────────────────── */}
      <aside className="feat-toc" aria-label="On this page">
        <p className="feat-toc-title">On this page</p>
        <ul className="feat-toc-list">
          {[
            ['#tldr',                  'Short answer'],
            ['#what-is-base64decode-org', 'What is base64decode.org?'],
            ['#smartdevbox-base64',    'SmartDevBox Base64 decoding'],
            ['#comparison-table',      'Feature comparison'],
            ['#base64-variants',       'Base64 variants reference'],
            ['#privacy',               'Privacy comparison'],
            ['#use-cases',             'Common use cases'],
            ['#faq',                   'FAQ'],
            ['#related',               'Related pages'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item">
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>

        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/base64-decoder">Base64 Decoder</Link></li>
          <li className="feat-toc-item"><Link href="/features/tools">All 97+ Tools</Link></li>
        </ul>
      </aside>
    </>
  );
}
