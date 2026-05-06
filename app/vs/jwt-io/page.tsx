import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SmartDevBox vs jwt.io — Best Free JWT Decoder Alternatives',
  description:
    'Comparing SmartDevBox and jwt.io for JWT decoding. SmartDevBox auto-detects JWTs on paste and includes 97+ other dev tools. jwt.io is a single-purpose JWT decoder/verifier with algorithm support.',
  keywords: [
    'jwt.io alternative',
    'best jwt decoder online',
    'jwt decoder alternative to jwt.io',
    'jwt.io vs smartdevbox',
    'free jwt decoder',
    'jwt inspector online',
    'decode jwt token online',
    'jwt.io replacement',
  ],
  alternates: { canonical: 'https://smartdevbox.com/vs/jwt-io' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'SmartDevBox vs jwt.io — Best JWT Decoder Alternatives',
    description:
      'SmartDevBox auto-decodes JWTs on paste alongside 97+ dev tools. jwt.io offers signature verification. Full comparison inside.',
    url: 'https://smartdevbox.com/vs/jwt-io',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartDevBox vs jwt.io — Best JWT Decoder Alternatives',
    description:
      'SmartDevBox: auto-detect JWTs on paste, 97+ tools. jwt.io: signature verification, algorithm support. See the full comparison.',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is there a good jwt.io alternative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. SmartDevBox is a strong jwt.io alternative for JWT decoding. It auto-detects JWT tokens the moment you paste them and displays the decoded header and payload without any manual steps. Unlike jwt.io it also includes 97+ other developer tools, so you can decode a JWT, format the JSON payload, and convert the exp timestamp all in one tab.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can SmartDevBox verify JWT signatures like jwt.io?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SmartDevBox decodes the header and payload of any JWT without a secret. For HMAC-signed tokens (HS256, HS384, HS512), the JWT Encoder tool can create and sign tokens. Signature verification against a known secret is not supported in the decoder — use jwt.io for that specific use case.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it safe to paste JWTs into an online decoder?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SmartDevBox decodes entirely in your browser — no data is sent to any server. Your JWT never leaves your machine. For maximum safety, avoid pasting long-lived production tokens (refresh tokens, API keys) into any online tool regardless of the privacy policy.',
      },
    },
    {
      '@type': 'Question',
      name: 'What JWT algorithms does SmartDevBox support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SmartDevBox decodes JWTs signed with any algorithm — the decoder simply Base64url-decodes the header and payload regardless of the alg field. For signing (JWT Encoder), HS256, HS384, and HS512 are supported.',
      },
    },
  ],
};

const COMPARISON_ROWS = [
  {
    feature: 'JWT decoding',
    smartdevbox: 'Auto-detected on paste — header and payload displayed immediately',
    jwtio: 'Paste into dedicated input field, result shown below',
  },
  {
    feature: 'Steps to see decoded payload',
    smartdevbox: '1 — paste anywhere in SmartDevBox',
    jwtio: '2 — open jwt.io, paste into the token field',
  },
  {
    feature: 'Signature verification',
    smartdevbox: 'Not supported in decoder (encoder supports HS256/384/512)',
    jwtio: 'Yes — paste the secret or public key to verify',
  },
  {
    feature: 'RS256 / ES256 verification',
    smartdevbox: 'Not supported',
    jwtio: 'Yes — paste the PEM public key',
  },
  {
    feature: 'JWT signing / creation',
    smartdevbox: 'Yes — JWT Encoder tool with HS256/384/512',
    jwtio: 'Yes — edit payload inline and re-sign',
  },
  {
    feature: 'Auto-detection of JWT',
    smartdevbox: 'Yes — detected from three-part Base64url.Base64url.Base64url pattern',
    jwtio: 'No — dedicated single-purpose page',
  },
  {
    feature: 'Other tools beyond JWT',
    smartdevbox: '97+ tools (JSON, Base64, URL, hash, regex, cron, XML, SQL, and more)',
    jwtio: 'JWT only',
  },
  {
    feature: 'exp claim display',
    smartdevbox: 'Shown as Unix timestamp — paste into Unix Timestamp tool to convert',
    jwtio: 'Shown as formatted date/time inline',
  },
  {
    feature: 'JWKS endpoint lookup',
    smartdevbox: 'Not supported',
    jwtio: 'Yes — fetches public keys from a JWKS URL',
  },
  {
    feature: 'Privacy',
    smartdevbox: '100% client-side, no server communication',
    jwtio: '100% client-side (Auth0-maintained open source)',
  },
  {
    feature: 'Free to use',
    smartdevbox: 'Yes',
    jwtio: 'Yes',
  },
  {
    feature: 'Works offline',
    smartdevbox: 'Yes (PWA)',
    jwtio: 'No — requires network for page load',
  },
];

const JWT_CLAIMS = [
  { claim: 'iss', meaning: 'Issuer — who created the token (e.g. your auth server URL)' },
  { claim: 'sub', meaning: 'Subject — the principal (typically a user ID)' },
  { claim: 'aud', meaning: 'Audience — the intended recipient(s) of the token' },
  { claim: 'exp', meaning: 'Expiration — Unix timestamp after which the token is invalid' },
  { claim: 'iat', meaning: 'Issued At — Unix timestamp when the token was created' },
  { claim: 'jti', meaning: 'JWT ID — unique identifier for the token (used for revocation)' },
  { claim: 'nbf', meaning: 'Not Before — Unix timestamp before which the token is not valid' },
];

export default function VsJwtIoPage() {
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
          <h1 className="feat-h1">SmartDevBox vs jwt.io — Best JWT Decoder Alternatives</h1>
          <p className="feat-lead">
            jwt.io is the go-to JWT tool for signature verification. SmartDevBox is
            the go-to choice when you want a JWT decoded automatically the instant you
            paste — no tab-switching, no manual steps, plus 91 other tools in the same
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
              <strong>Use SmartDevBox</strong> when you want to paste a JWT from a log,
              API response, or Authorization header and see the payload immediately —
              no navigation, no page switch.{' '}
              <strong>Use jwt.io</strong> when you need to verify a token&apos;s signature
              against a known secret or JWKS endpoint, or when you need RS256 / ES256
              verification.
            </p>
          </div>

          {/* What is jwt.io */}
          <h2 id="what-is-jwt-io">What Is jwt.io?</h2>
          <p>
            jwt.io is a free web tool maintained by Auth0 (now Okta) that decodes JWT
            tokens and verifies their signatures. It is widely used because it was one
            of the first dedicated JWT debugging tools, has a clean three-column layout
            showing the encoded token, the decoded JSON sections, and the signature
            verification status simultaneously, and supports a wide range of algorithms
            (HS256, RS256, ES256, PS256, and more).
          </p>
          <p>
            The signature verification feature is jwt.io&apos;s main advantage: you can paste
            your HMAC secret or RSA/ECDSA public key and see immediately whether the
            token&apos;s signature is valid. It also supports fetching public keys from a JWKS
            endpoint URL, which is useful when debugging tokens from an IdP (Identity
            Provider) like Auth0, Okta, or Google.
          </p>

          {/* What is SmartDevBox JWT */}
          <h2 id="smartdevbox-jwt">SmartDevBox JWT Decoding</h2>
          <p>
            SmartDevBox auto-detects JWT tokens on paste using a pattern-matching
            detector: any string of the form{' '}
            <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>
              [Base64url].[Base64url].[Base64url]
            </code>{' '}
            is identified as a JWT and decoded automatically. The header JSON and
            payload JSON are displayed side-by-side, formatted and syntax-highlighted.
            All standard registered claims (iss, sub, aud, exp, iat, jti, nbf) are
            shown alongside any custom claims.
          </p>
          <p>
            The key workflow benefit: if you are already working in SmartDevBox — formatting
            JSON from an API response, converting a timestamp, decoding a Base64 value —
            and you paste a JWT next, it is decoded in the same interface without opening
            a new tab or navigating anywhere.
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
                  <th style={{ textAlign: 'left', padding: '0.5rem 0 0.5rem 1rem', color: 'var(--text2)', fontWeight: 500 }}>jwt.io</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.6rem 1rem 0.6rem 0', color: 'var(--text2)', whiteSpace: 'nowrap', verticalAlign: 'top' }}>{row.feature}</td>
                    <td style={{ padding: '0.6rem 1rem', color: 'var(--text)', verticalAlign: 'top' }}>{row.smartdevbox}</td>
                    <td style={{ padding: '0.6rem 0 0.6rem 1rem', color: 'var(--text)', verticalAlign: 'top' }}>{row.jwtio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* JWT claim reference */}
          <h2 id="jwt-claims">Standard JWT Claims Reference</h2>
          <p>
            Regardless of which tool you use to decode, here are the registered claim names
            defined by RFC 7519 that you will encounter in most JWTs:
          </p>
          <div className="feat-grid">
            {JWT_CLAIMS.map((c) => (
              <div key={c.claim} className="feat-card">
                <span className="feat-card-label" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>{c.claim}</span>
                <span className="feat-card-desc">{c.meaning}</span>
              </div>
            ))}
          </div>

          {/* Security */}
          <h2 id="security">Pasting JWTs into Online Tools — Safety Notes</h2>
          <p>
            Both SmartDevBox and jwt.io decode entirely in the browser — your token is
            never sent to a server. However, there are still risk considerations:
          </p>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">Short-lived access tokens</span>
              <span className="feat-card-desc">
                Low risk. Access tokens typically expire in 15–60 minutes. By the time
                a paste is at risk, the token is already expired.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">Long-lived refresh tokens</span>
              <span className="feat-card-desc">
                Higher risk. Refresh tokens can live for days or weeks. Avoid pasting
                them into any online tool, even client-side ones.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">Browser history / clipboard</span>
              <span className="feat-card-desc">
                Any token you paste is visible to browser extensions and clipboard
                managers. Use a private browsing window for sensitive tokens.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">Screen recording</span>
              <span className="feat-card-desc">
                If you are screen-sharing or recording, tokens visible on screen can
                be captured. Blur or close the tool before sharing your screen.
              </span>
            </div>
          </div>

          {/* Debugging workflow */}
          <h2 id="debugging-workflow">Recommended JWT Debugging Workflow</h2>
          <ol className="feat-steps">
            <li className="feat-step">
              <span className="feat-step-num">1</span>
              <span className="feat-step-text">
                <strong>Extract the token</strong> from the Authorization header, log
                file, or API response. Copy just the JWT (the three-part dot-separated
                string, without the &quot;Bearer &quot; prefix).
              </span>
            </li>
            <li className="feat-step">
              <span className="feat-step-num">2</span>
              <span className="feat-step-text">
                <strong>Paste into SmartDevBox.</strong> The JWT decoder fires automatically.
                Check the payload claims: is the sub (user ID) correct? Are the roles or
                permissions as expected? Are there custom claims the API requires?
              </span>
            </li>
            <li className="feat-step">
              <span className="feat-step-num">3</span>
              <span className="feat-step-text">
                <strong>Check expiry.</strong> Copy the exp claim value (a Unix timestamp)
                and paste it into the Unix Timestamp Converter tool in the same SmartDevBox
                interface. It converts it to a human-readable date/time in UTC and local
                timezone immediately.
              </span>
            </li>
            <li className="feat-step">
              <span className="feat-step-num">4</span>
              <span className="feat-step-text">
                <strong>Verify the signature</strong> (if needed). Open jwt.io, paste the
                token, and enter your HMAC secret or RSA/ECDSA public key. A green
                &quot;Signature Verified&quot; badge confirms the token is authentic.
              </span>
            </li>
          </ol>

          {/* FAQ */}
          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Is there a good jwt.io alternative?</h3>
              <p className="feat-faq-a">
                Yes. SmartDevBox is a strong alternative for JWT decoding. It auto-detects
                JWT tokens on paste and displays the decoded header and payload without any
                manual steps. Unlike jwt.io it also includes 97+ other developer tools.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Can SmartDevBox verify JWT signatures?</h3>
              <p className="feat-faq-a">
                SmartDevBox decodes the header and payload of any JWT without a secret. For
                HMAC tokens the JWT Encoder tool can create and sign. Signature verification
                against a known secret is not supported in the decoder — use jwt.io for that.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Is it safe to paste JWTs into an online decoder?</h3>
              <p className="feat-faq-a">
                SmartDevBox decodes entirely in your browser — no data is sent to any
                server. For maximum safety, avoid pasting long-lived production tokens
                (refresh tokens) into any online tool.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">What JWT algorithms does SmartDevBox support?</h3>
              <p className="feat-faq-a">
                SmartDevBox decodes JWTs signed with any algorithm — the decoder simply
                Base64url-decodes the header and payload. For signing (JWT Encoder),
                HS256, HS384, and HS512 are supported.
              </p>
            </div>
          </div>

          {/* Related */}
          <h2 id="related">Related Pages</h2>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">
                <Link href="/tools/jwt-decoder" style={{ color: 'inherit' }}>JWT Decoder Tool →</Link>
              </span>
              <span className="feat-card-desc">
                Decode any JWT token directly. Auto-detected on paste — header and
                payload shown as formatted JSON instantly.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">
                <Link href="/tools/jwt-encoder" style={{ color: 'inherit' }}>JWT Encoder Tool →</Link>
              </span>
              <span className="feat-card-desc">
                Create and sign JWT tokens with HS256, HS384, or HS512. All signing
                happens in the browser via the Web Crypto API.
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
            <div className="feat-card">
              <span className="feat-card-label">
                <Link href="/tools/unix-timestamp-converter" style={{ color: 'inherit' }}>Unix Timestamp Converter →</Link>
              </span>
              <span className="feat-card-desc">
                Convert the exp and iat claims from a decoded JWT to human-readable
                date and time.
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
            ['#tldr',                 'Short answer'],
            ['#what-is-jwt-io',       'What is jwt.io?'],
            ['#smartdevbox-jwt',      'SmartDevBox JWT decoding'],
            ['#comparison-table',     'Feature comparison'],
            ['#jwt-claims',           'JWT claims reference'],
            ['#security',             'Safety notes'],
            ['#debugging-workflow',   'Debugging workflow'],
            ['#faq',                  'FAQ'],
            ['#related',              'Related pages'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item">
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>

        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/jwt-decoder">JWT Decoder</Link></li>
          <li className="feat-toc-item"><Link href="/features/tools">All 97+ Tools</Link></li>
        </ul>
      </aside>
    </>
  );
}
