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
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'SmartDevBox is a free browser-based developer toolbox with 98+ built-in tools across 6 categories. It automatically detects input formats — Base64, JSON, JWT, XML, SQL, Unix timestamps, X.509 certificates, and 80+ more — and applies the correct tool instantly. No sign-up. 100% client-side.',
  featureList: [
    '98+ built-in developer tools',
    'Automatic format detection across 19 format families',
    '600 ms debounce with two-tier confidence scoring',
    '100% client-side — no server, no data upload',
    'Plugin system for custom tools',
    'Progressive Web App (PWA)',
    'Free with no account required',
  ],
  screenshot: 'https://smartdevbox.com/og-image.png',
};

const NAV_LINKS = [
  { href: '/features/auto-detection', label: 'Auto Detection' },
  { href: '/features/tools',          label: 'All Tools' },
  { href: '/features/smart-extract',  label: 'Smart Extract' },
  { href: '/features/compare',        label: 'Compare' },
  { href: '/features/plugins',        label: 'Plugin System' },
  { href: '/features/privacy',        label: 'Privacy & Security' },
];

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="feat-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      {/* ── Sticky sub-nav ───────────────────────────────────────────────── */}
      <nav aria-label="Features navigation" className="feat-subnav">
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
        </div>
      </nav>

      {/* ── Header CTA ───────────────────────────────────────────────────── */}
      <div className="feat-hero">
        <Link href="/" className="feat-hero-cta">
          Paste anything here — we’ll help you rest.
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
        <span className="feat-hero-sub">97+ tools · 100% client-side · no account required</span>
      </div>

      {/* ── Two-column body (article + TOC slot) ─────────────────────────── */}
      <div className="feat-body">
        {children}
      </div>

      {/* ── Footer CTA ───────────────────────────────────────────────────── */}
      <footer className="feat-footer">
        <Link href="/" className="feat-footer-cta">
          Paste anything here — we’ll help you rest.
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
