import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is a Hash Function? Definition, Examples & Common Algorithms',
  description:
    'A cryptographic hash function maps input data of any size to a fixed-length digest. Learn how SHA-256, MD5, and SHA-1 work, why hash functions are one-way, and when to use each.',
  keywords: [
    'what is a hash function',
    'cryptographic hash function explained',
    'sha-256 vs md5',
    'what is sha256',
    'hash function definition',
    'one way function',
    'hash collision',
    'generate sha256 hash online',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-a-hash-function' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'What Is a Hash Function? Definition, Examples & Common Algorithms',
    description:
      'A hash function maps any input to a fixed-length digest. Learn how SHA-256, MD5, and SHA-1 work — and generate hashes for free in the browser.',
    url: 'https://smartdevbox.com/glossary/what-is-a-hash-function',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Is a Hash Function? Definition, Examples & Common Algorithms',
    description:
      'A hash function maps any input to a fixed-length digest. Learn how SHA-256, MD5, and SHA-1 work — and generate hashes for free in the browser.',
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What Is a Hash Function? Definition, Examples & Common Algorithms',
  description: 'A cryptographic hash function maps input data of any size to a fixed-length digest.',
  url: 'https://smartdevbox.com/glossary/what-is-a-hash-function',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  mainEntityOfPage: 'https://smartdevbox.com/glossary/what-is-a-hash-function',
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a cryptographic hash function?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A cryptographic hash function is a mathematical algorithm that takes an input of any size and produces a fixed-length output called a digest or hash. It has three key properties: it is deterministic (same input always produces the same output), it is one-way (you cannot reverse the hash to recover the original input), and it is collision-resistant (it is computationally infeasible to find two different inputs that produce the same hash).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between MD5, SHA-1, and SHA-256?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MD5 produces a 128-bit (32-character hex) digest and is fast but cryptographically broken — practical collisions can be generated in seconds. SHA-1 produces a 160-bit (40-character hex) digest and is also broken for security purposes (Google demonstrated a practical collision in 2017). SHA-256 produces a 256-bit (64-character hex) digest and is the current standard for security-sensitive applications including TLS certificates, git commit IDs, and JWT HMAC signing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can a hash be reversed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No — not for a well-designed cryptographic hash function. There is no algorithm that computes the original input from the hash output alone. However, hashes can be "cracked" by brute force or rainbow tables if the input space is small (e.g. a short password or a known value). For password storage, use a password-hashing function like bcrypt, scrypt, or Argon2 rather than a general-purpose hash like SHA-256.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a hash collision?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A hash collision occurs when two different inputs produce the same hash output. Because hash functions map an infinite input space to a finite output space (e.g. 2^256 values for SHA-256), collisions must theoretically exist — but for secure hash functions, finding one should be computationally infeasible. MD5 and SHA-1 are considered broken because practical collision attacks have been demonstrated.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I generate a SHA-256 hash online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use the Hash Generator tool on SmartDevBox. Paste any text and it computes MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously in the browser using the Web Crypto API. No data is sent to a server.',
      },
    },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-a-hash-function' },
    { '@type': 'ListItem', position: 3, name: 'What Is a Hash Function?', item: 'https://smartdevbox.com/glossary/what-is-a-hash-function' },
  ],
};

const ALGORITHMS = [
  { name: 'MD5',     bits: 128, hex: 32,  status: 'Broken',    use: 'Legacy checksums only. Do not use for security. Practical collisions demonstrated.' },
  { name: 'SHA-1',   bits: 160, hex: 40,  status: 'Broken',    use: 'Deprecated in TLS/certificates since 2017. Git still uses it for content-addressing but is migrating.' },
  { name: 'SHA-256', bits: 256, hex: 64,  status: 'Secure',    use: 'Current standard. Used in TLS certificates, git SHA-2 mode, JWT HMAC signing, and blockchain.' },
  { name: 'SHA-512', bits: 512, hex: 128, status: 'Secure',    use: 'Higher security margin than SHA-256. Preferred on 64-bit platforms where it can be faster.' },
  { name: 'SHA-3',   bits: 256, hex: 64,  status: 'Secure',    use: 'NIST standard (2015) with a different design from SHA-2. Not yet widely adopted in existing protocols.' },
  { name: 'bcrypt',  bits: null, hex: 60, status: 'Passwords', use: 'Designed specifically for password hashing. Slow by design with a tunable cost factor. Not a general hash.' },
];

const PROPERTIES = [
  { name: 'Deterministic', desc: 'The same input always produces the same output. This is what makes hashes useful for verification and deduplication.' },
  { name: 'One-way (preimage resistance)', desc: 'Given a hash output, it is computationally infeasible to reconstruct the original input.' },
  { name: 'Collision resistance', desc: 'It is computationally infeasible to find two different inputs that produce the same hash output.' },
  { name: 'Avalanche effect', desc: 'A single-bit change in the input produces a completely different hash output — the outputs are uncorrelated.' },
  { name: 'Fixed output length', desc: 'Regardless of input size (1 byte or 1 GB), the digest is always the same fixed length (e.g. 256 bits for SHA-256).' },
];

export default function WhatIsHashFunctionPage() {
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
          <h1 className="feat-h1">What Is a Hash Function?</h1>
          <p className="feat-lead">
            A cryptographic hash function takes input of any size and produces a
            fixed-length fingerprint called a <em>digest</em>. It is one-way — you
            cannot reverse it — and collision-resistant — it is infeasible to find
            two different inputs that produce the same digest. These properties
            underpin digital signatures, password storage, file integrity checks,
            and blockchain.
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
              A <strong>cryptographic hash function</strong> is a deterministic algorithm
              that maps an input of arbitrary size to a fixed-length bit string (the
              <em>digest</em>) such that any change to the input produces a completely
              different digest.
            </p>
          </div>

          <h2 id="properties">Key Properties</h2>
          <div className="feat-grid">
            {PROPERTIES.map(p => (
              <div key={p.name} className="feat-card">
                <span className="feat-card-label">{p.name}</span>
                <span className="feat-card-desc">{p.desc}</span>
              </div>
            ))}
          </div>

          <h2 id="example">A Concrete Example</h2>
          <p>
            Hashing the string <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>hello</code>{' '}
            with SHA-256 always produces:
          </p>
          <pre style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            fontSize: 'var(--fs-sm)',
            overflowX: 'auto',
            color: 'var(--green)',
            wordBreak: 'break-all',
          }}>
            2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
          </pre>
          <p>
            Changing a single character — <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>Hello</code>{' '}
            (capital H) — produces a completely different digest:
          </p>
          <pre style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            fontSize: 'var(--fs-sm)',
            overflowX: 'auto',
            color: 'var(--green)',
            wordBreak: 'break-all',
          }}>
            185f8db32921bd46d35cc2e45a25b0e08fb2c0b67a17b4ea4b5c2d77ed1e3a8e
          </pre>
          <p>This is the avalanche effect.</p>

          <h2 id="algorithms">Common Hash Algorithms</h2>
          <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border2)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem 0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Algorithm</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'var(--text2)', fontWeight: 500 }}>Output</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'var(--text2)', fontWeight: 500 }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>When to use</th>
                </tr>
              </thead>
              <tbody>
                {ALGORITHMS.map(row => (
                  <tr key={row.name} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem 0.75rem 0.5rem 0', fontFamily: 'var(--font-mono)', color: 'var(--green)', whiteSpace: 'nowrap' }}>{row.name}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text2)', whiteSpace: 'nowrap' }}>{row.bits ? `${row.bits} bits / ${row.hex} hex chars` : `${row.hex} chars`}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: row.status === 'Broken' ? '#e05c5c' : row.status === 'Passwords' ? 'var(--text2)' : 'var(--green)', whiteSpace: 'nowrap', fontWeight: 500 }}>{row.status}</td>
                    <td style={{ padding: '0.5rem 0', color: 'var(--text)' }}>{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="not-encryption">Hash Functions Are Not Encryption</h2>
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
              Encryption is <em>reversible</em> (with the correct key). Hashing is
              <em>one-way</em> — there is no key and no decryption. Do not confuse
              the two. In particular: <strong>do not store passwords hashed with
              SHA-256</strong>. Use a purpose-built password hashing function like
              bcrypt, scrypt, or Argon2, which are intentionally slow and include
              a salt to prevent rainbow table attacks.
            </p>
          </div>

          <h2 id="use-cases">Where Hash Functions Are Used</h2>
          <div className="feat-grid">
            {[
              { label: 'File integrity checks', desc: 'Download pages publish the SHA-256 hash of a file. Re-hash the downloaded file and compare to detect tampering or corruption.' },
              { label: 'Digital signatures', desc: 'Signing hashes the message first, then encrypts the hash with a private key. Verifying decrypts and compares hashes — faster than signing the full message.' },
              { label: 'Password storage', desc: 'Servers store a hash of the password, not the plaintext. On login, the server hashes the input and compares. A breach exposes hashes, not passwords.' },
              { label: 'Git content addressing', desc: 'Every git commit, tree, and blob object is identified by its SHA-1 (or SHA-256 in new repos) hash — ensuring data integrity throughout history.' },
              { label: 'HMAC (JWT signing)', desc: 'HMAC-SHA256 combines a secret key with the message before hashing, producing a keyed MAC. Used in HS256-signed JWTs.' },
              { label: 'Deduplication & caching', desc: 'Content-addressable storage systems use hashes as lookup keys — identical content produces the same hash, enabling deduplication.' },
            ].map(uc => (
              <div key={uc.label} className="feat-card">
                <span className="feat-card-label">{uc.label}</span>
                <span className="feat-card-desc">{uc.desc}</span>
              </div>
            ))}
          </div>

          {/* ── Tool CTA ── */}
          <h2 id="try-it">Generate a Hash Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </span>
            <p>
              Paste any text into SmartDevBox&apos;s Hash Generator and get MD5, SHA-1,
              SHA-256, and SHA-512 digests simultaneously — all computed in the browser
              using the Web Crypto API. No data is sent to a server.{' '}
              <Link href="/tools/hash-generator"><strong>Open the Hash Generator →</strong></Link>
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'Can a hash be reversed?', a: 'No. A well-designed cryptographic hash function is one-way — there is no algorithm that recovers the original input from the hash alone. Short or common inputs can be "cracked" by brute force or rainbow tables, which is why password hashing uses bcrypt/Argon2 with salts.' },
              { q: 'What is the difference between MD5, SHA-1, and SHA-256?', a: 'MD5 (128-bit) and SHA-1 (160-bit) are cryptographically broken — practical collisions exist. SHA-256 (256-bit) is the current standard for security-sensitive use. Use SHA-256 or SHA-512 for new systems.' },
              { q: 'What is a hash collision?', a: 'Two different inputs producing the same hash output. Theoretically unavoidable (infinite inputs, finite outputs) but should be computationally infeasible for a secure hash function. MD5 and SHA-1 have practical collision attacks.' },
              { q: 'How do I generate a SHA-256 hash online?', a: 'Paste your text into SmartDevBox. The Hash Generator computes MD5, SHA-1, SHA-256, and SHA-512 simultaneously in the browser using the Web Crypto API. No data is sent to a server.' },
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
              { href: '/glossary/what-is-base64-encoding', label: 'What Is Base64 Encoding?', desc: 'Hash digests are frequently represented as Base64 or hex strings.' },
              { href: '/glossary/what-is-a-jwt', label: 'What Is a JWT?', desc: 'HS256-signed JWTs use HMAC-SHA256 — a keyed hash function — for their signature.' },
              { href: '/tools/hash-generator', label: 'Hash Generator Tool', desc: 'Compute MD5, SHA-1, SHA-256, and SHA-512 simultaneously. 100% client-side.' },
              { href: '/tools/base64-encoder', label: 'Base64 Encoder', desc: 'Encode hash digest bytes to Base64 for embedding in JSON or HTTP headers.' },
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
            ['#properties',    'Key properties'],
            ['#example',       'Concrete example'],
            ['#algorithms',    'Common algorithms'],
            ['#not-encryption','Not encryption'],
            ['#use-cases',     'Use cases'],
            ['#try-it',        'Generate a hash now'],
            ['#faq',           'FAQ'],
            ['#related',       'Related pages'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/hash-generator">Hash Generator</Link></li>
        </ul>
      </aside>
    </>
  );
}
