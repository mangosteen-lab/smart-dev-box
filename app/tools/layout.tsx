import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  metadataBase: new URL('https://smartdevbox.com'),
};

const NAV_LINKS = [
  { href: '/features/auto-detection', label: 'Auto Detection' },
  { href: '/features/tools',          label: 'All Tools' },
  { href: '/features/smart-extract',  label: 'Smart Extract' },
  { href: '/features/compare',        label: 'Compare' },
  { href: '/features/plugins',        label: 'Plugin System' },
  { href: '/features/privacy',        label: 'Privacy & Security' },
];

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="feat-shell">
      {/* ── Sticky sub-nav ───────────────────────────────────────────────── */}
      <nav aria-label="Features navigation" className="feat-subnav">
        <Link href="/" className="feat-subnav-back" aria-label="Back to app">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
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
          Open SmartDevBox — free, no sign-up
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
        <span className="feat-hero-sub">91+ tools · 100% client-side · no account required</span>
      </div>

      {/* ── Two-column body (article + TOC slot) ─────────────────────────── */}
      <div className="feat-body">
        {children}
      </div>

      {/* ── Footer CTA ───────────────────────────────────────────────────── */}
      <footer className="feat-footer">
        <Link href="/" className="feat-footer-cta">
          Open SmartDevBox — free, no sign-up
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
        <p className="feat-footer-sub">91+ tools · 100% client-side · no account required</p>
      </footer>
    </div>
  );
}
