import Link from 'next/link';

export type FeatureSlug =
  | 'auto-detection'
  | 'tools'
  | 'smart-extract'
  | 'compare'
  | 'plugins'
  | 'privacy';

const ALL_PAGES: Record<
  FeatureSlug,
  { href: string; label: string; desc: string; icon: React.ReactNode }
> = {
  'auto-detection': {
    href: '/features/auto-detection',
    label: 'Auto Detection',
    desc: 'Paste anything — SmartDevBox identifies the format instantly.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
  },
  'tools': {
    href: '/features/tools',
    label: 'All 91+ Tools',
    desc: 'Browse the complete built-in tool list across all 6 categories.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="9" y1="3" x2="9" y2="21"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
      </svg>
    ),
  },
  'smart-extract': {
    href: '/features/smart-extract',
    label: 'Smart Extract',
    desc: 'Pull emails, URLs, and numbers from any block of text.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  'compare': {
    href: '/features/compare',
    label: 'Compare / Diff',
    desc: 'Side-by-side diff of any two text or code versions.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
        <line x1="12" y1="3" x2="12" y2="21"/>
      </svg>
    ),
  },
  'plugins': {
    href: '/features/plugins',
    label: 'Plugin System',
    desc: 'Add your own tools — they work exactly like built-in ones.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
        <line x1="16" y1="8" x2="2" y2="22"/>
        <line x1="17.5" y1="15" x2="9" y2="15"/>
      </svg>
    ),
  },
  'privacy': {
    href: '/features/privacy',
    label: 'Privacy & Security',
    desc: '100% client-side — your data never leaves your browser.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
};

/** Which related pages to show for each article, in order */
const RELATED: Record<FeatureSlug, FeatureSlug[]> = {
  'auto-detection': ['tools', 'smart-extract', 'privacy'],
  'tools':          ['auto-detection', 'compare', 'plugins'],
  'smart-extract':  ['auto-detection', 'compare', 'privacy'],
  'compare':        ['tools', 'smart-extract', 'auto-detection'],
  'plugins':        ['tools', 'auto-detection', 'privacy'],
  'privacy':        ['auto-detection', 'tools', 'plugins'],
};

export function RelatedArticles({ current }: { current: FeatureSlug }) {
  const slugs = RELATED[current];

  return (
    <div className="feat-related">
      <h2 className="feat-related-title">Continue reading</h2>
      <div className="feat-related-grid">
        {slugs.map((slug) => {
          const page = ALL_PAGES[slug];
          return (
            <Link key={slug} href={page.href} className="feat-related-card">
              <span className="feat-related-icon">{page.icon}</span>
              <span className="feat-related-text">
                <span className="feat-related-label">{page.label}</span>
                <span className="feat-related-desc">{page.desc}</span>
              </span>
              <svg
                className="feat-related-arrow"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
