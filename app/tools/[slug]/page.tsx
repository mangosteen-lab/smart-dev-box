import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOOL_SEO_DATA, TOOL_SLUG_MAP } from '@/lib/tools/seo-data';

/* ─────────────────────────────────────────────────────────────────────────────
   Static params — Next.js generates one page per slug at build time.
───────────────────────────────────────────────────────────────────────────── */

export function generateStaticParams() {
  return TOOL_SEO_DATA.map((tool) => ({ slug: tool.slug }));
}

/* ─────────────────────────────────────────────────────────────────────────────
   Per-page metadata
───────────────────────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOL_SLUG_MAP.get(slug);
  if (!tool) return {};

  const url = `https://smartdevbox.com/tools/${tool.slug}`;
  return {
    title: tool.heading,
    description: tool.metaDescription,
    keywords: [...tool.keywords, 'smartdevbox', 'free online tool', 'developer tool no sign-up'],
    alternates: { canonical: url },
    openGraph: {
      title: tool.heading,
      description: tool.metaDescription,
      url,
      type: 'article',
      siteName: 'SmartDevBox',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.heading,
      description: tool.metaDescription,
    },
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   JSON-LD structured data helpers
───────────────────────────────────────────────────────────────────────────── */

function buildJsonLd(tool: (typeof TOOL_SEO_DATA)[number]) {
  const url = `https://smartdevbox.com/tools/${tool.slug}`;

  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.heading.split(' — ')[0].trim(),
    url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    description: tool.metaDescription,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    creator: {
      '@type': 'Organization',
      name: 'SmartDevBox',
      url: 'https://smartdevbox.com',
    },
  };

  const faqPage =
    tool.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: tool.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        }
      : null;

  return { webApp, faqPage };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page component
───────────────────────────────────────────────────────────────────────────── */

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = TOOL_SLUG_MAP.get(slug);
  if (!tool) notFound();

  const { webApp, faqPage } = buildJsonLd(tool);

  const relatedTools = tool.relatedToolIds
    .map((id) => TOOL_SEO_DATA.find((t) => t.id === id))
    .filter(Boolean) as typeof TOOL_SEO_DATA;

  return (
    <>
      {/* ── Structured data ──────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }}
      />
      {faqPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
        />
      )}

      {/* ── Article ──────────────────────────────────────────────────────── */}
      <article
        className="feat-article"
        itemScope
        itemType="https://schema.org/WebApplication"
      >
        <meta itemProp="applicationCategory" content="DeveloperApplication" />
        <meta itemProp="operatingSystem" content="Any" />

        <div className="feat-hero">
          <h1 className="feat-h1" itemProp="name">{tool.heading}</h1>
          <p className="feat-lead" itemProp="description">{tool.intro}</p>
        </div>

        <div className="feat-prose">
          {/* Use Cases */}
          {tool.useCases.length > 0 && (
            <section className="feat-section" aria-labelledby="use-cases-heading">
              <h2 id="use-cases-heading" className="feat-h2">Common Use Cases</h2>
              <ul style={{ listStyleType: 'disc' }}>
                {tool.useCases.map((uc) => (
                  <li key={uc}>{uc}</li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQ */}
          {tool.faqs.length > 0 && (
            <section
              className="feat-section"
              aria-labelledby="faq-heading"
              itemScope
              itemType="https://schema.org/FAQPage"
            >
              <h2 id="faq-heading" className="feat-h2">Frequently Asked Questions</h2>
              {tool.faqs.map((faq) => (
                <div
                  key={faq.q}
                  itemScope
                  itemType="https://schema.org/Question"
                  itemProp="mainEntity"
                >
                  <h3 className="feat-h3" itemProp="name">{faq.q}</h3>
                  <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    <p itemProp="text">{faq.a}</p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Privacy */}
          <section className="feat-section" aria-labelledby="privacy-heading">
            <h2 id="privacy-heading" className="feat-h2">Privacy & Security</h2>
            <p>
              This tool runs entirely in your browser using client-side JavaScript.
              No data is sent to a server — your input never leaves your machine.
              SmartDevBox has no account system, no usage tracking, and no paid tier.
              See the{' '}
              <Link href="/features/privacy">Privacy &amp; Security</Link> page for full details.
            </p>
          </section>

          {/* Related tools */}
          {relatedTools.length > 0 && (
            <section className="feat-section" aria-labelledby="related-heading">
              <h2 id="related-heading" className="feat-h2">Related Tools</h2>
              <ul className="feat-tool-list">
                {relatedTools.map((rt) => (
                  <li key={rt.id} className="feat-tool-row">
                    <Link href={`/tools/${rt.slug}`} className="feat-tool-name">
                      {rt.heading.split(' — ')[0].trim()}
                    </Link>
                    <span className="feat-tool-desc">{rt.metaDescription}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>

      {/* ── TOC ──────────────────────────────────────────────────────────── */}
      <aside className="feat-toc" aria-label="On this page">
        <p className="feat-toc-title">On this page</p>
        <ul className="feat-toc-list">
          {tool.useCases.length > 0 && (
            <li className="feat-toc-item"><a href="#use-cases-heading">Use Cases</a></li>
          )}
          {tool.faqs.length > 0 && (
            <li className="feat-toc-item"><a href="#faq-heading">FAQ</a></li>
          )}
          <li className="feat-toc-item"><a href="#privacy-heading">Privacy</a></li>
          {relatedTools.length > 0 && (
            <li className="feat-toc-item"><a href="#related-heading">Related Tools</a></li>
          )}
        </ul>

        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/features/tools">All 91+ Tools</Link></li>
        </ul>
      </aside>
    </>
  );
}
