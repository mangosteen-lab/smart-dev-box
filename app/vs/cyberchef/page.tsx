import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SmartDevBox vs CyberChef — Instant Auto-Detection vs Recipe Builder',
  description:
    'Comparing SmartDevBox and CyberChef for everyday developer tasks. SmartDevBox detects formats and shows output instantly with no recipe setup. CyberChef excels at complex multi-step transformations.',
  keywords: [
    'cyberchef alternative',
    'cyberchef vs smartdevbox',
    'better than cyberchef',
    'cyberchef replacement',
    'online developer tools comparison',
    'cyberchef free alternative',
    'instant format detection tool',
  ],
  alternates: { canonical: 'https://smartdevbox.com/vs/cyberchef' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'SmartDevBox vs CyberChef — Which Is Right for You?',
    description:
      'SmartDevBox detects your format and shows results instantly — no recipes. CyberChef chains custom operations. See the full comparison.',
    url: 'https://smartdevbox.com/vs/cyberchef',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartDevBox vs CyberChef',
    description:
      'SmartDevBox detects formats instantly with no setup. CyberChef requires manual recipe building. Full comparison inside.',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is SmartDevBox a good CyberChef alternative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — for the majority of day-to-day tasks (Base64 decode/encode, JSON formatting, JWT decoding, URL encoding, hash generation) SmartDevBox is faster because it auto-detects the format and shows output immediately without any recipe setup. CyberChef is the better choice for complex chained transformations that go beyond SmartDevBox\'s single-step tools.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does SmartDevBox work offline like CyberChef?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. SmartDevBox is a Progressive Web App. All 97+ tools run client-side with no server dependency. Once loaded, every tool works without an internet connection.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is SmartDevBox free like CyberChef?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. SmartDevBox is completely free with no account, no sign-up, and no paid tier. CyberChef is also free and open source.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can SmartDevBox chain multiple operations like CyberChef recipes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SmartDevBox tools are single-step. For multi-step pipelines (e.g. Base64 decode → gunzip → JSON format) CyberChef\'s recipe builder is the right tool. SmartDevBox is optimised for the single-step operations that make up the vast majority of real-world developer tasks.',
      },
    },
  ],
};

const COMPARISON_ROWS = [
  {
    feature: 'First result after paste',
    smartdevbox: 'Instant — auto-detected, no clicks',
    cyberchef: 'Requires finding and adding the right Recipe operation',
  },
  {
    feature: 'Format detection',
    smartdevbox: 'Automatic across 19 format families',
    cyberchef: 'Manual — you choose the operation',
  },
  {
    feature: 'Multi-step transforms',
    smartdevbox: 'Single-step per tool',
    cyberchef: 'Full recipe chaining (any number of steps)',
  },
  {
    feature: 'Number of built-in tools',
    smartdevbox: '97+ across 6 categories',
    cyberchef: '300+ operations',
  },
  {
    feature: 'JWT decoding',
    smartdevbox: 'Auto-detected on paste, header+payload shown',
    cyberchef: 'Must add "JWT Decode" operation manually',
  },
  {
    feature: 'JSON formatting',
    smartdevbox: 'Auto-detected and pretty-printed on paste',
    cyberchef: 'Must add "JSON Beautify" operation manually',
  },
  {
    feature: 'Input auto-detection',
    smartdevbox: 'Yes — 600 ms debounce, 0–1 confidence score',
    cyberchef: 'No — you specify the format manually',
  },
  {
    feature: 'Works offline',
    smartdevbox: 'Yes (PWA)',
    cyberchef: 'Yes (downloadable HTML file)',
  },
  {
    feature: 'Free / open source',
    smartdevbox: 'Free, closed source',
    cyberchef: 'Free, open source (Apache 2.0)',
  },
  {
    feature: 'Mobile usability',
    smartdevbox: 'Responsive — works on phones and tablets',
    cyberchef: 'Desktop-oriented, difficult on mobile',
  },
  {
    feature: 'Plugin / custom tools',
    smartdevbox: 'Yes — register a detector + transformer function',
    cyberchef: 'Contribute via GitHub pull request',
  },
  {
    feature: 'Privacy',
    smartdevbox: '100% client-side, no account, no analytics on tool output',
    cyberchef: '100% client-side (GCHQ-developed open source)',
  },
];

export default function VsCyberChefPage() {
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
            Comparison
          </div>
          <h1 className="feat-h1">SmartDevBox vs CyberChef</h1>
          <p className="feat-lead">
            Both are free browser-based developer toolkits. SmartDevBox auto-detects
            your format and shows output instantly. CyberChef lets you build
            arbitrarily complex multi-step recipes. Here is how to choose.
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
              <strong>Use SmartDevBox</strong> for fast single-step tasks: decode Base64, format JSON,
              inspect a JWT, convert a Unix timestamp, generate a hash. Paste and done.{' '}
              <strong>Use CyberChef</strong> when you need to chain multiple operations in
              sequence — e.g. Base64 decode → gunzip → JSON format → extract a field.
            </p>
          </div>

          {/* What is CyberChef */}
          <h2 id="what-is-cyberchef">What Is CyberChef?</h2>
          <p>
            CyberChef is an open-source web app built by GCHQ (the UK government communications
            centre) and released publicly in 2016. Its model is the{' '}
            <em>recipe</em>: you drag operations from a left-hand panel into a recipe chain,
            configure each operation, paste your input, and click &quot;Bake&quot;. With 300+ operations
            covering cryptography, compression, encoding, data formats, and network protocols,
            CyberChef is the tool of choice for CTF (Capture the Flag) competitions, digital
            forensics, and any task that requires multi-step transformation pipelines.
          </p>
          <p>
            The recipe model is CyberChef&apos;s superpower and its friction point simultaneously.
            For complex transforms it is uniquely capable. For a simple &quot;decode this Base64 string&quot;
            task it requires opening the app, finding the Base64 operation in the search panel,
            dragging it to the recipe, and clicking Bake — typically 4–6 deliberate steps before
            seeing any output.
          </p>

          {/* What is SmartDevBox */}
          <h2 id="what-is-smartdevbox">What Is SmartDevBox?</h2>
          <p>
            SmartDevBox is a browser-based developer toolkit with 97+ tools across encoding,
            formatting, generation, conversion, and inspection categories. Its defining feature
            is automatic format detection: paste any text and the tool identifies the format
            (Base64, JSON, JWT, XML, SQL, Unix timestamp, URL, X.509 certificate, cron
            expression, and 80+ others) and applies the correct tool automatically — no manual
            selection required.
          </p>
          <p>
            The workflow difference is stark: in SmartDevBox the first result is one step
            (paste); in CyberChef the first result is at minimum four steps (open, search,
            drag, bake). For the ad-hoc single-step decoding and formatting tasks that represent
            the majority of a developer&apos;s daily tool use, SmartDevBox is significantly faster.
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
                  <th style={{ textAlign: 'left', padding: '0.5rem 0 0.5rem 1rem', color: 'var(--text2)', fontWeight: 500 }}>CyberChef</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.6rem 1rem 0.6rem 0', color: 'var(--text2)', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{row.feature}</td>
                    <td style={{ padding: '0.6rem 1rem', color: 'var(--text)', verticalAlign: 'top' }}>{row.smartdevbox}</td>
                    <td style={{ padding: '0.6rem 0 0.6rem 1rem', color: 'var(--text)', verticalAlign: 'top' }}>{row.cyberchef}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* When to use SmartDevBox */}
          <h2 id="when-smartdevbox">When to Use SmartDevBox</h2>
          <p>
            SmartDevBox wins on speed for the tasks developers do multiple times per hour:
          </p>
          <ol className="feat-steps">
            <li className="feat-step">
              <span className="feat-step-num">1</span>
              <span className="feat-step-text">
                <strong>Decode a Base64 string</strong> from a log file, API response, or
                environment variable. Paste it — SmartDevBox auto-detects and decodes it
                before you can reach for another tab.
              </span>
            </li>
            <li className="feat-step">
              <span className="feat-step-num">2</span>
              <span className="feat-step-text">
                <strong>Inspect a JWT</strong> from an Authorization header. The header and
                payload are shown as formatted JSON, including expiry time relative to now,
                automatically on paste.
              </span>
            </li>
            <li className="feat-step">
              <span className="feat-step-num">3</span>
              <span className="feat-step-text">
                <strong>Format a minified JSON response</strong> from a REST API. Paste the
                response body and the JSON Formatter fires instantly with configurable
                indentation.
              </span>
            </li>
            <li className="feat-step">
              <span className="feat-step-num">4</span>
              <span className="feat-step-text">
                <strong>Convert a Unix timestamp</strong> from a database query result.
                Paste the 10-digit or 13-digit integer and see UTC and local time
                immediately.
              </span>
            </li>
            <li className="feat-step">
              <span className="feat-step-num">5</span>
              <span className="feat-step-text">
                <strong>Generate a SHA-256 hash</strong>, UUID, random password, or Base64
                encoding of a string with one click from the generator tools.
              </span>
            </li>
          </ol>

          {/* When to use CyberChef */}
          <h2 id="when-cyberchef">When to Use CyberChef</h2>
          <p>
            CyberChef is the better tool when:
          </p>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">Multi-step pipelines</span>
              <span className="feat-card-desc">
                You need to Base64-decode, then gunzip, then JSON-parse, then extract
                a specific field — all in one recipe. CyberChef&apos;s recipe model handles
                arbitrary chains; SmartDevBox tools are single-step.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">CTF and forensics</span>
              <span className="feat-card-desc">
                Capture the Flag competitions typically involve nested encodings and
                custom cipher operations. CyberChef&apos;s 300+ operations and recipe
                sharing (via URL) make it the standard tool in this domain.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">Cryptographic operations</span>
              <span className="feat-card-desc">
                AES encryption/decryption, RSA operations, XOR ciphers, and
                custom-key HMAC generation are available in CyberChef but not in
                SmartDevBox.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">Saved and shareable recipes</span>
              <span className="feat-card-desc">
                CyberChef encodes the full recipe in the URL, making it easy to share
                a specific multi-step transformation with a colleague. SmartDevBox does
                not have a recipe-sharing model.
              </span>
            </div>
          </div>

          {/* Migration */}
          <h2 id="migration">Switching from CyberChef to SmartDevBox</h2>
          <p>
            If the majority of your CyberChef use is single-step — you open a recipe
            with one operation (Base64 Decode, JSON Beautify, URL Decode) and bake —
            SmartDevBox replaces that workflow entirely and removes the recipe-building
            step. Bookmark <strong>smartdevbox.com</strong> and paste directly into it.
          </p>
          <p>
            For complex multi-step recipes, keep CyberChef. The two tools are
            complementary: SmartDevBox for speed on common single-step tasks, CyberChef
            for power when chaining is necessary.
          </p>

          {/* FAQ */}
          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Is SmartDevBox a good CyberChef alternative?</h3>
              <p className="feat-faq-a">
                Yes — for the majority of day-to-day tasks (Base64 decode/encode, JSON
                formatting, JWT decoding, URL encoding, hash generation) SmartDevBox is
                faster because it auto-detects the format and shows output immediately
                without any recipe setup. CyberChef is the better choice for complex
                chained transformations.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Does SmartDevBox work offline like CyberChef?</h3>
              <p className="feat-faq-a">
                Yes. SmartDevBox is a Progressive Web App. All 97+ tools run client-side
                with no server dependency. Once loaded, every tool works without an
                internet connection. CyberChef can also be downloaded as a standalone
                HTML file for offline use.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Can SmartDevBox chain operations like CyberChef?</h3>
              <p className="feat-faq-a">
                SmartDevBox tools are single-step. For multi-step pipelines CyberChef&apos;s
                recipe builder is the right tool. SmartDevBox is optimised for the
                single-step operations that make up the vast majority of real-world
                developer tasks.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Is SmartDevBox free like CyberChef?</h3>
              <p className="feat-faq-a">
                Yes. SmartDevBox is completely free with no account, no sign-up, and no
                paid tier. CyberChef is also free and open source under the Apache 2.0
                licence.
              </p>
            </div>
          </div>

          {/* Related comparisons */}
          <h2 id="related">Related Comparisons</h2>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">
                <Link href="/vs/jwt-io" style={{ color: 'inherit' }}>SmartDevBox vs jwt.io →</Link>
              </span>
              <span className="feat-card-desc">
                Full comparison for JWT decoding use cases. SmartDevBox decodes
                automatically on paste; jwt.io requires a page visit and manual paste.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">
                <Link href="/alternatives/base64decode-org" style={{ color: 'inherit' }}>SmartDevBox vs base64decode.org →</Link>
              </span>
              <span className="feat-card-desc">
                Comparing Base64 decoding tools. SmartDevBox handles Base64 alongside
                91 other tools; base64decode.org is single-purpose.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">
                <Link href="/tools/base64-decoder" style={{ color: 'inherit' }}>Free Base64 Decoder →</Link>
              </span>
              <span className="feat-card-desc">
                Decode Base64 strings in your browser, instantly, with auto-detection.
                No recipe configuration required.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">
                <Link href="/features/auto-detection" style={{ color: 'inherit' }}>Auto Format Detection →</Link>
              </span>
              <span className="feat-card-desc">
                How SmartDevBox detects Base64, JSON, JWT, XML, SQL, and 80+ other
                formats automatically — with no manual tool selection.
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
            ['#tldr',              'Short answer'],
            ['#what-is-cyberchef', 'What is CyberChef?'],
            ['#what-is-smartdevbox','What is SmartDevBox?'],
            ['#comparison-table',  'Feature comparison'],
            ['#when-smartdevbox',  'When to use SmartDevBox'],
            ['#when-cyberchef',    'When to use CyberChef'],
            ['#migration',         'Switching tools'],
            ['#faq',               'FAQ'],
            ['#related',           'Related comparisons'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item">
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>

        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/features/tools">All 97+ Tools</Link></li>
        </ul>
      </aside>
    </>
  );
}
