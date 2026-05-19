import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is a JWT (JSON Web Token)? Definition, Structure & Examples',
  description:
    'A JWT is a compact, URL-safe token that encodes a JSON payload as three Base64url-encoded sections. Learn its structure, how signing works, and when to use it — with a free decoder.',
  keywords: [
    'what is a jwt',
    'what is a json web token',
    'jwt explained',
    'jwt structure',
    'how does jwt work',
    'jwt header payload signature',
    'jwt vs session token',
    'decode jwt online',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-a-jwt' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'What Is a JWT (JSON Web Token)? Definition, Structure & Examples',
    description:
      'A JWT encodes a JSON payload as three Base64url sections separated by dots. Learn how the header, payload, and signature work — and decode one for free.',
    url: 'https://smartdevbox.com/glossary/what-is-a-jwt',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is a JWT (JSON Web Token)? Definition, Structure & Examples',
    description:
      'A JWT encodes a JSON payload as three Base64url sections separated by dots. Learn how the header, payload, and signature work.',
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What Is a JWT (JSON Web Token)? Definition, Structure & Examples',
  description: 'A JWT is a compact, URL-safe token that encodes a JSON payload as three Base64url-encoded sections.',
  url: 'https://smartdevbox.com/glossary/what-is-a-jwt',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  mainEntityOfPage: 'https://smartdevbox.com/glossary/what-is-a-jwt',
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a JWT?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A JSON Web Token (JWT) is a compact, URL-safe string that encodes a JSON payload along with a cryptographic signature. It consists of three Base64url-encoded sections — header, payload, and signature — separated by dots. JWTs are commonly used to transmit authentication and authorization claims between a client and a server without requiring server-side session storage.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you decode a JWT without the secret key?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The header and payload sections of a JWT are simply Base64url-encoded — they are not encrypted. Anyone can decode and read them without knowing the signing secret. The signature section is used to verify authenticity, not to hide the payload. Never include sensitive data (passwords, credit card numbers) in a JWT payload.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between JWT authentication and session-based authentication?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Session-based authentication stores session state on the server (in a database or in-memory store) and gives the client an opaque session ID cookie. JWT authentication encodes the claims directly in the token — the server verifies the signature and trusts the payload, requiring no server-side storage. JWTs are stateless and scale horizontally, but cannot be revoked without additional infrastructure.',
      },
    },
    {
      '@type': 'Question',
      name: 'What JWT signing algorithms are there?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The most common are: HS256/HS384/HS512 (HMAC with SHA-2 — symmetric, same key signs and verifies), RS256/RS384/RS512 (RSA with SHA-2 — asymmetric, private key signs, public key verifies), ES256/ES384/ES512 (ECDSA — asymmetric, smaller signatures than RSA), and PS256/PS384/PS512 (RSA-PSS). HS256 is simplest; RS256 and ES256 are preferred when the verifier should not be able to issue tokens.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I decode a JWT online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Paste your JWT into SmartDevBox at smartdevbox.com. It automatically detects the three-part JWT structure and displays the decoded header and payload as formatted JSON. No secret is required to decode — only to verify the signature.',
      },
    },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-a-jwt' },
    { '@type': 'ListItem', position: 3, name: 'What Is a JWT?', item: 'https://smartdevbox.com/glossary/what-is-a-jwt' },
  ],
};

const REGISTERED_CLAIMS = [
  { claim: 'iss', type: 'string', meaning: 'Issuer — identifies who issued the token (e.g. your auth server URL)' },
  { claim: 'sub', type: 'string', meaning: 'Subject — the principal the token represents (typically a user ID)' },
  { claim: 'aud', type: 'string | string[]', meaning: 'Audience — the intended recipient(s); servers should reject tokens with the wrong aud' },
  { claim: 'exp', type: 'number', meaning: 'Expiration time — Unix timestamp after which the token must be rejected' },
  { claim: 'nbf', type: 'number', meaning: 'Not Before — Unix timestamp before which the token must be rejected' },
  { claim: 'iat', type: 'number', meaning: 'Issued At — Unix timestamp when the token was created' },
  { claim: 'jti', type: 'string', meaning: 'JWT ID — unique identifier for this token, used to prevent replay attacks' },
];

const ALGORITHMS = [
  { alg: 'HS256 / HS384 / HS512', type: 'Symmetric (HMAC)', note: 'Same secret signs and verifies. Simple but the verifier can also issue tokens.' },
  { alg: 'RS256 / RS384 / RS512', type: 'Asymmetric (RSA)', note: 'Private key signs, public key verifies. Verifier cannot forge tokens.' },
  { alg: 'ES256 / ES384 / ES512', type: 'Asymmetric (ECDSA)', note: 'Smaller signatures than RSA. Preferred for mobile/IoT.' },
  { alg: 'PS256 / PS384 / PS512', type: 'Asymmetric (RSA-PSS)', note: 'Probabilistic RSA variant; recommended over RS256 in newer systems.' },
];

export default function WhatIsJwtPage() {
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
          <h1 className="feat-h1">What Is a JWT (JSON Web Token)?</h1>
          <p className="feat-lead">
            A JWT is a compact, self-contained token that encodes a JSON payload and a
            cryptographic signature as three dot-separated Base64url strings. It lets a
            server verify claims — like user identity and permissions — without storing
            session state.
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
              A <strong>JSON Web Token (JWT)</strong> is a URL-safe string of the form{' '}
              <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>header.payload.signature</code>
              {' '}where each section is Base64url-encoded. It is defined in{' '}
              <abbr title="Request for Comments 7519">RFC 7519</abbr>.
            </p>
          </div>

          <h2 id="structure">JWT Structure</h2>
          <p>
            Every JWT consists of exactly three sections, separated by dots:
          </p>
          <p>
            <code style={{ color: 'var(--green)', fontSize: '0.9em', wordBreak: 'break-all' }}>
              eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
              .eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
              .SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
            </code>
          </p>

          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">Header</span>
              <span className="feat-card-desc">
                Base64url-encoded JSON specifying the token type and signing algorithm.{' '}
                <code style={{ fontSize: '0.85em', color: 'var(--green)' }}>
                  {'{'}&#34;alg&#34;:&#34;HS256&#34;,&#34;typ&#34;:&#34;JWT&#34;{'}'}
                </code>
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">Payload</span>
              <span className="feat-card-desc">
                Base64url-encoded JSON containing the claims — statements about an
                entity (typically the user) and additional metadata.
              </span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">Signature</span>
              <span className="feat-card-desc">
                The result of signing <code style={{ fontSize: '0.85em', color: 'var(--green)' }}>
                Base64url(header) + &quot;.&quot; + Base64url(payload)</code> with the
                algorithm declared in the header and a secret or private key.
              </span>
            </div>
          </div>

          <h2 id="claims">Standard JWT Claims (Registered Claims)</h2>
          <p>
            RFC 7519 defines seven <em>registered</em> claim names. All are optional
            but widely used:
          </p>
          <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border2)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Claim</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--text2)', fontWeight: 500 }}>Type</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Meaning</th>
                </tr>
              </thead>
              <tbody>
                {REGISTERED_CLAIMS.map(row => (
                  <tr key={row.claim} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem 1rem 0.5rem 0', fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{row.claim}</td>
                    <td style={{ padding: '0.5rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text2)', fontSize: '0.85em' }}>{row.type}</td>
                    <td style={{ padding: '0.5rem 0', color: 'var(--text)' }}>{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="signing-algorithms">Signing Algorithms</h2>
          <div className="feat-grid">
            {ALGORITHMS.map(a => (
              <div key={a.alg} className="feat-card">
                <span className="feat-card-label" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9em' }}>{a.alg}</span>
                <span className="feat-card-desc"><strong>{a.type}.</strong> {a.note}</span>
              </div>
            ))}
          </div>

          <h2 id="payload-not-secret">The Payload Is Not Secret</h2>
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
              The header and payload are only Base64url-encoded — <strong>not encrypted</strong>.
              Anyone who holds the token can decode and read the payload without the signing
              secret. Never include passwords, credit card numbers, or other sensitive data in
              a JWT payload unless you use a JWE (JSON Web Encryption) token instead.
            </p>
          </div>

          <h2 id="jwt-vs-session">JWT vs Session-Based Authentication</h2>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">Session tokens (stateful)</span>
              <span className="feat-card-desc">Server stores session state (database or in-memory). Client sends an opaque session ID. Simple to invalidate. Does not scale horizontally without a shared session store.</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">JWTs (stateless)</span>
              <span className="feat-card-desc">All claims are in the token. Server only verifies the signature — no storage needed. Scales horizontally easily. Harder to revoke before expiry without a token blocklist.</span>
            </div>
          </div>

          {/* ── Tool CTA ── */}
          <h2 id="try-it">Decode a JWT Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </span>
            <p>
              Paste any JWT into SmartDevBox and the header and payload are decoded
              automatically — no tool selection, no secret required, no data sent to a
              server.{' '}
              <Link href="/tools/jwt-decoder"><strong>Open the JWT Decoder →</strong></Link>
              {' '}or{' '}
              <Link href="/tools/jwt-encoder"><strong>JWT Encoder (sign tokens) →</strong></Link>
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'Can you decode a JWT without the secret?', a: 'Yes. The header and payload are Base64url-encoded, not encrypted. Anyone can decode and read them. The secret is only needed to verify that the token was issued by a trusted party.' },
              { q: 'What is the difference between JWT authentication and session-based authentication?', a: 'Session-based auth stores state on the server; JWTs are stateless — all claims are in the token. JWTs scale horizontally without shared storage but are harder to revoke before expiry.' },
              { q: 'What JWT signing algorithms should I use?', a: 'For new systems: ES256 (ECDSA P-256) or RS256 for asymmetric scenarios where verifiers should not be able to issue tokens. HS256 is fine for simple server-to-server use where the same party signs and verifies. Avoid the none algorithm — it disables signature verification.' },
              { q: 'How do I decode a JWT online for free?', a: 'Paste your JWT into SmartDevBox. It auto-detects the three-part JWT structure and shows the decoded header and payload as formatted JSON — no account, no secret needed, 100% client-side.' },
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
              { href: '/glossary/what-is-base64-encoding', label: 'What Is Base64 Encoding?', desc: 'JWTs use Base64url — a URL-safe variant of Base64 — for their header and payload.' },
              { href: '/glossary/what-is-a-unix-timestamp', label: 'What Is a Unix Timestamp?', desc: 'JWT exp, iat, and nbf claims are all Unix timestamps.' },
              { href: '/tools/jwt-decoder', label: 'JWT Decoder Tool', desc: 'Auto-detects JWT on paste, shows decoded header and payload instantly.' },
              { href: '/vs/jwt-io', label: 'SmartDevBox vs jwt.io', desc: 'See how SmartDevBox compares to jwt.io for JWT debugging workflows.' },
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
            ['#structure',          'JWT structure'],
            ['#claims',             'Registered claims'],
            ['#signing-algorithms', 'Signing algorithms'],
            ['#payload-not-secret', 'Payload is not secret'],
            ['#jwt-vs-session',     'JWT vs sessions'],
            ['#try-it',             'Decode a JWT now'],
            ['#faq',                'FAQ'],
            ['#related',            'Related pages'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/jwt-decoder">JWT Decoder</Link></li>
          <li className="feat-toc-item"><Link href="/tools/jwt-encoder">JWT Encoder</Link></li>
        </ul>
      </aside>
    </>
  );
}
