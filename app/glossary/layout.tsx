import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  metadataBase: new URL('https://smartdevbox.com'),
};

const softwareAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SmartDevBox',
  url: 'https://smartdevbox.com',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any (browser-based)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'SmartDevBox is a free browser-based developer toolbox with 97+ built-in tools. It automatically detects input formats and applies the correct tool instantly. No sign-up. 100% client-side.',
};

const NAV_LINKS = [
  { href: '/glossary/what-is-base64-encoding',  label: 'What is Base64?' },
  { href: '/glossary/what-is-a-jwt',            label: 'What is a JWT?' },
  { href: '/glossary/what-is-a-unix-timestamp', label: 'What is a Unix timestamp?' },
  { href: '/glossary/what-is-json',             label: 'What is JSON?' },
  { href: '/glossary/what-is-a-hash-function',  label: 'What is a hash function?' },
  { href: '/glossary/what-is-a-url',            label: 'What is a URL?' },
  { href: '/glossary/what-is-a-uuid',           label: 'What is a UUID?' },
  { href: '/glossary/what-is-a-cron-expression',label: 'What is a cron expression?' },
  { href: '/glossary/what-is-xml',              label: 'What is XML?' },
  { href: '/glossary/what-is-a-regex',          label: 'What is a regex?' },
  { href: '/glossary/what-is-an-x509-certificate', label: 'What is an X.509 certificate?' },
  { href: '/glossary/what-is-csv',              label: 'What is CSV?' },
  { href: '/glossary/what-is-sql',              label: 'What is SQL?' },
  { href: '/glossary/what-is-yaml',             label: 'What is YAML?' },
  { href: '/glossary/what-is-a-color-code',     label: 'What is a color code?' },
];

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="feat-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />

      {/* ── Sticky sub-nav ─────────────────────────────────────────────────── */}
      <nav aria-label="Glossary navigation" className="feat-subnav">
        <Link href="/" className="feat-subnav-back" aria-label="Back to app">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          App
        </Link>
        <div className="feat-subnav-links" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="feat-subnav-link" role="listitem">
              {label}
            </Link>
          ))}
          <Link href="/features/tools" className="feat-subnav-link" role="listitem">All Tools</Link>
        </div>
      </nav>

      {/* ── Header CTA ─────────────────────────────────────────────────────── */}
      <div className="feat-hero">
        <Link href="/" className="feat-hero-cta">
          Try SmartDevBox free — no sign-up
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
        <span className="feat-hero-sub">97+ tools · 100% client-side · no account required</span>
      </div>

      {/* ── Two-column body (article + TOC slot) ───────────────────────────── */}
      <div className="feat-body">
        {children}
      </div>

      {/* ── Footer CTA ─────────────────────────────────────────────────────── */}
      <footer className="feat-footer">
        <Link href="/" className="feat-footer-cta">
          Try SmartDevBox free — no sign-up
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
        <p className="feat-footer-sub">97+ tools · 100% client-side · no account required</p>
      </footer>
    </div>
  );
}
