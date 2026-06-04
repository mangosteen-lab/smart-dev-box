import Link from 'next/link';

export type ComparisonRow = {
  feature: string;
  smartdevbox: string;
  competitor: string;
};

export type ComparisonCard = {
  title: string;
  description: string;
};

export type ComparisonFaq = {
  q: string;
  a: string;
};

export type ComparisonLink = {
  href: string;
  label: string;
  description: string;
};

type ComparisonPageProps = {
  canonicalPath: string;
  eyebrow: string;
  title: string;
  lead: string;
  shortAnswer: string;
  competitorName: string;
  competitorHeading: string;
  competitorDescription: string[];
  smartDevBoxHeading: string;
  smartDevBoxDescription: string[];
  rows: ComparisonRow[];
  smartDevBoxCards: ComparisonCard[];
  competitorCards: ComparisonCard[];
  faqs: ComparisonFaq[];
  relatedLinks: ComparisonLink[];
};

const BASE_URL = 'https://smartdevbox.com';

export function ComparisonPage({
  canonicalPath,
  eyebrow,
  title,
  lead,
  shortAnswer,
  competitorName,
  competitorHeading,
  competitorDescription,
  smartDevBoxHeading,
  smartDevBoxDescription,
  rows,
  smartDevBoxCards,
  competitorCards,
  faqs,
  relatedLinks,
}: ComparisonPageProps) {
  const url = `${BASE_URL}${canonicalPath}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: eyebrow, item: url },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow">
            <span className="feat-eyebrow-dot" />
            {eyebrow}
          </div>
          <h1 className="feat-h1">{title}</h1>
          <p className="feat-lead">{lead}</p>
        </div>

        <div className="feat-prose">
          <h2 id="short-answer">The Short Answer</h2>
          <div className="feat-callout">
            <p>{shortAnswer}</p>
          </div>

          <h2 id="competitor">{competitorHeading}</h2>
          {competitorDescription.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

          <h2 id="smartdevbox">{smartDevBoxHeading}</h2>
          {smartDevBoxDescription.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

          <h2 id="comparison">Feature Comparison</h2>
          <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)', lineHeight: '1.6' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border2)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Feature</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem', color: 'var(--green)', fontWeight: 500 }}>SmartDevBox</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0 0.5rem 1rem', color: 'var(--text2)', fontWeight: 500 }}>{competitorName}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.6rem 1rem 0.6rem 0', color: 'var(--text2)', verticalAlign: 'top' }}>{row.feature}</td>
                    <td style={{ padding: '0.6rem 1rem', verticalAlign: 'top' }}>{row.smartdevbox}</td>
                    <td style={{ padding: '0.6rem 0 0.6rem 1rem', verticalAlign: 'top' }}>{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="choose-smartdevbox">Choose SmartDevBox When</h2>
          <div className="feat-grid">
            {smartDevBoxCards.map((card) => (
              <div key={card.title} className="feat-card">
                <span className="feat-card-label">{card.title}</span>
                <span className="feat-card-desc">{card.description}</span>
              </div>
            ))}
          </div>

          <h2 id="choose-competitor">Choose {competitorName} When</h2>
          <div className="feat-grid">
            {competitorCards.map((card) => (
              <div key={card.title} className="feat-card">
                <span className="feat-card-label">{card.title}</span>
                <span className="feat-card-desc">{card.description}</span>
              </div>
            ))}
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {faqs.map((faq) => (
              <div key={faq.q} className="feat-faq-item">
                <h3 className="feat-faq-q">{faq.q}</h3>
                <p className="feat-faq-a">{faq.a}</p>
              </div>
            ))}
          </div>

          <h2 id="related">Related Pages</h2>
          <div className="feat-grid">
            {relatedLinks.map((link) => (
              <div key={link.href} className="feat-card">
                <span className="feat-card-label">
                  <Link href={link.href} style={{ color: 'inherit' }}>{link.label}</Link>
                </span>
                <span className="feat-card-desc">{link.description}</span>
              </div>
            ))}
          </div>
        </div>
      </article>

      <aside className="feat-toc" aria-label="On this page">
        <p className="feat-toc-title">On this page</p>
        <ul className="feat-toc-list">
          {[
            ['#short-answer', 'Short answer'],
            ['#competitor', competitorHeading],
            ['#smartdevbox', smartDevBoxHeading],
            ['#comparison', 'Feature comparison'],
            ['#choose-smartdevbox', 'Choose SmartDevBox'],
            ['#choose-competitor', `Choose ${competitorName}`],
            ['#faq', 'FAQ'],
            ['#related', 'Related pages'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools">Browse tool guides</Link></li>
        </ul>
      </aside>
    </>
  );
}
