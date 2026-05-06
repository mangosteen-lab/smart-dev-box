import type { Metadata } from 'next';
import Link from 'next/link';
import { ENGINEERING_RECIPES } from '@/lib/recipes';

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
    'SmartDevBox is a free browser-based developer toolbox with 97+ built-in tools, automatic format detection, engineering recipes, and 100% client-side processing.',
};

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="feat-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />

      <nav aria-label="Engineering recipes navigation" className="feat-subnav">
        <Link href="/" className="feat-subnav-back" aria-label="Back to app">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          App
        </Link>
        <div className="feat-subnav-links" role="list">
          <Link href="/recipes" className="feat-subnav-link" role="listitem">Recipes</Link>
          {ENGINEERING_RECIPES.slice(0, 6).map((recipe) => (
            <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="feat-subnav-link" role="listitem">
              {recipe.shortTitle}
            </Link>
          ))}
          <Link href="/tools" className="feat-subnav-link" role="listitem">Tool Guides</Link>
        </div>
      </nav>

      <div className="feat-hero">
        <Link href="/" className="feat-hero-cta">
          Open SmartDevBox - free, no sign-up
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
        <span className="feat-hero-sub">Engineering workflows · local processing · practical examples</span>
      </div>

      <div className="feat-body">
        {children}
      </div>

      <footer className="feat-footer">
        <Link href="/" className="feat-footer-cta">
          Open SmartDevBox - free, no sign-up
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
