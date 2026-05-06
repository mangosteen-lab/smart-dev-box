import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is an X.509 Certificate? Structure, Fields & How TLS Uses It',
  description:
    'An X.509 certificate binds a public key to an identity using a digital signature from a trusted CA. Learn its fields, the chain of trust, and how TLS uses certificates — with a free decoder.',
  keywords: [
    'what is an x509 certificate',
    'x509 certificate explained',
    'tls certificate structure',
    'ssl certificate fields',
    'certificate authority explained',
    'chain of trust',
    'decode ssl certificate online',
    'pem certificate',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-an-x509-certificate' },
  openGraph: {
    type: 'article', siteName: 'SmartDevBox',
    title: 'What Is an X.509 Certificate? Structure, Fields & How TLS Uses It',
    description: 'An X.509 certificate binds a public key to an identity. Learn its fields, chain of trust, and decode one for free.',
    url: 'https://smartdevbox.com/glossary/what-is-an-x509-certificate',
  },
  twitter: { card: 'summary_large_image', title: 'What Is an X.509 Certificate? Structure, Fields & How TLS Uses It', description: 'Learn X.509 certificate fields, chain of trust, and how TLS uses certificates.' },
};

const articleJsonLd = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'What Is an X.509 Certificate? Structure, Fields & How TLS Uses It',
  description: 'An X.509 certificate binds a public key to an identity using a CA digital signature.',
  url: 'https://smartdevbox.com/glossary/what-is-an-x509-certificate',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
};

const faqJsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is an X.509 certificate?', acceptedAnswer: { '@type': 'Answer', text: 'An X.509 certificate is a digital document that binds a public key to an identity (such as a domain name or organization) using a digital signature from a trusted Certificate Authority (CA). It is the foundation of TLS/HTTPS and is defined by the ITU-T X.509 standard (RFC 5280 on the internet).' } },
    { '@type': 'Question', name: 'What is a Certificate Authority (CA)?', acceptedAnswer: { '@type': 'Answer', text: 'A Certificate Authority is a trusted organization that issues X.509 certificates. When a CA signs a certificate, it vouches that the public key in the certificate genuinely belongs to the named subject. Browsers and operating systems ship with a built-in list of trusted root CAs. Examples: Let\'s Encrypt, DigiCert, Sectigo, GlobalSign.' } },
    { '@type': 'Question', name: 'What is the difference between DER, PEM, and PFX/PKCS#12?', acceptedAnswer: { '@type': 'Answer', text: 'DER (Distinguished Encoding Rules) is the binary encoding of the certificate. PEM (Privacy-Enhanced Mail) is DER encoded as Base64 with -----BEGIN CERTIFICATE----- and -----END CERTIFICATE----- headers — the most common format for sharing certificates. PFX/PKCS#12 bundles the certificate, intermediate chain, and private key into a single binary file, protected by a password — commonly used for importing/exporting in Windows and Java.' } },
    { '@type': 'Question', name: 'How do I decode an X.509 certificate online?', acceptedAnswer: { '@type': 'Answer', text: 'Paste a PEM-encoded certificate (beginning with -----BEGIN CERTIFICATE-----) into SmartDevBox. The Certificate Decoder automatically detects the format and displays the subject, issuer, validity dates, public key algorithm, key size, and all extensions.' } },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-an-x509-certificate' },
    { '@type': 'ListItem', position: 3, name: 'What Is an X.509 Certificate?', item: 'https://smartdevbox.com/glossary/what-is-an-x509-certificate' },
  ],
};

const FIELDS = [
  { field: 'Subject', desc: 'The entity the certificate belongs to. For TLS: Common Name (CN) = domain name; Organisation (O), Country (C) for EV certificates.' },
  { field: 'Issuer', desc: 'The CA that signed this certificate. For self-signed certs, Issuer == Subject.' },
  { field: 'Validity', desc: 'Not Before and Not After dates — the window during which the certificate is valid. TLS certificates now max out at 398 days.' },
  { field: 'Public Key', desc: 'The algorithm (RSA 2048-bit, ECDSA P-256, etc.) and the public key value. Corresponds to the private key held by the certificate owner.' },
  { field: 'Serial Number', desc: 'A unique integer assigned by the CA. Used in Certificate Revocation Lists (CRLs) to identify revoked certificates.' },
  { field: 'Signature Algorithm', desc: 'The hash + encryption algorithm used by the CA to sign this certificate. Modern certs use SHA-256 with RSA or ECDSA.' },
  { field: 'Extensions', desc: 'Optional fields defined in RFC 5280. Key ones: Subject Alternative Name (SAN — additional hostnames/IPs), Key Usage, Extended Key Usage (TLS server auth, code signing), Basic Constraints (is this a CA?).' },
];

export default function WhatIsX509Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow"><span className="feat-eyebrow-dot" />Glossary</div>
          <h1 className="feat-h1">What Is an X.509 Certificate?</h1>
          <p className="feat-lead">
            An X.509 certificate is a digital document that proves a public key belongs
            to a named entity — a domain, an organisation, or a person. A trusted
            Certificate Authority (CA) signs the certificate with its own private key,
            creating a verifiable chain of trust that underlies every HTTPS connection
            on the web.
          </p>
        </div>

        <div className="feat-prose">
          <h2 id="definition">The One-Line Definition</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            <p>An <strong>X.509 certificate</strong> is a digitally signed data structure that binds a <em>public key</em> to a <em>subject name</em>, enabling a verifier to trust the key without knowing the subject directly. Defined in RFC 5280.</p>
          </div>

          <h2 id="fields">Certificate Fields</h2>
          <div className="feat-grid">
            {FIELDS.map(f => (
              <div key={f.field} className="feat-card">
                <span className="feat-card-label">{f.field}</span>
                <span className="feat-card-desc">{f.desc}</span>
              </div>
            ))}
          </div>

          <h2 id="chain-of-trust">The Chain of Trust</h2>
          <p>TLS certificates form a chain, not a single link:</p>
          <ol className="feat-steps">
            <li className="feat-step"><span className="feat-step-num">1</span><span className="feat-step-text"><strong>Root CA</strong> — A self-signed certificate pre-installed in your OS/browser trust store. DigiCert, Let&apos;s Encrypt ISRG Root X1, etc.</span></li>
            <li className="feat-step"><span className="feat-step-num">2</span><span className="feat-step-text"><strong>Intermediate CA</strong> — Signed by the root CA, kept online to issue end-entity certs. Isolates the root from daily operations.</span></li>
            <li className="feat-step"><span className="feat-step-num">3</span><span className="feat-step-text"><strong>End-entity certificate</strong> — Your domain&apos;s certificate, signed by an intermediate CA. Presented to browsers during TLS handshake.</span></li>
          </ol>
          <p>A browser verifies the chain by checking each certificate&apos;s signature against the issuer&apos;s public key, all the way up to a trusted root.</p>

          <h2 id="formats">PEM vs DER vs PFX</h2>
          <div className="feat-grid">
            {[
              { label: 'PEM', desc: 'Base64-encoded DER with -----BEGIN CERTIFICATE----- header. Plain text; easy to copy/paste. Most common format for sharing certs on Linux/macOS.' },
              { label: 'DER', desc: 'Binary ASN.1 encoding of the certificate. Compact; used by Java KeyStore and Windows CertMgr internally.' },
              { label: 'PFX / PKCS#12', desc: 'Binary bundle containing the certificate, intermediate chain, and private key — password-protected. Common for IIS, Windows, Java key import/export.' },
            ].map(f => (
              <div key={f.label} className="feat-card">
                <span className="feat-card-label">{f.label}</span>
                <span className="feat-card-desc">{f.desc}</span>
              </div>
            ))}
          </div>

          <h2 id="try-it">Decode a Certificate Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </span>
            <p>
              Paste a PEM certificate (starting with <code style={{ fontSize: '0.9em', color: 'var(--green)' }}>-----BEGIN CERTIFICATE-----</code>) into SmartDevBox. It is auto-detected and all fields are displayed.{' '}
              <Link href="/tools/cert-decoder"><strong>Open the Certificate Decoder →</strong></Link>
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'What is a Certificate Authority (CA)?', a: 'A trusted organisation that issues and signs X.509 certificates. Browsers ship with a list of trusted root CAs. When a CA signs your certificate, browsers trust that your public key belongs to your domain.' },
              { q: 'What is the difference between DER, PEM, and PFX?', a: 'DER is binary. PEM is DER Base64-encoded with -----BEGIN/END----- headers — most common for Linux. PFX/PKCS#12 bundles cert + private key in a password-protected binary — common for Windows.' },
              { q: 'How do I decode an X.509 certificate online?', a: 'Paste a PEM certificate into SmartDevBox. It auto-detects the format and shows subject, issuer, validity, public key, and extensions — all client-side.' },
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
              { href: '/tools/cert-decoder', label: 'Certificate Decoder', desc: 'Auto-detects PEM certificates and displays all fields.' },
              { href: '/glossary/what-is-a-hash-function', label: 'What Is a Hash Function?', desc: 'Certificate signatures use SHA-256 or SHA-384 hashing.' },
              { href: '/glossary/what-is-base64-encoding', label: 'What Is Base64?', desc: 'PEM is a Base64 encoding of the DER binary certificate.' },
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
          {[['#definition','Definition'],['#fields','Certificate fields'],['#chain-of-trust','Chain of trust'],['#formats','PEM vs DER vs PFX'],['#try-it','Decode one now'],['#faq','FAQ'],['#related','Related']].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/cert-decoder">Certificate Decoder</Link></li>
        </ul>
      </aside>
    </>
  );
}
