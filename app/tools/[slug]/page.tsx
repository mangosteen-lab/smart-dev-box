import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOOL_SEO_DATA, TOOL_SLUG_MAP } from '@/lib/tools/seo-data';
import { ENGINEERING_RECIPES } from '@/lib/recipes';

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
  const BASE = 'https://smartdevbox.com';
  const url = `${BASE}/tools/${tool.slug}`;
  const toolName = tool.heading.split(' — ')[0].trim();
  const faqs = getToolFaqs(tool);

  // SoftwareApplication — identifies each browser tool as an application
  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: toolName,
    url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    description: tool.metaDescription,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    creator: {
      '@type': 'Organization',
      name: 'SmartDevBox',
      url: BASE,
    },
  };

  // WebApplication — retained for completeness / other crawlers
  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: toolName,
    url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    description: tool.metaDescription,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    creator: {
      '@type': 'Organization',
      name: 'SmartDevBox',
      url: BASE,
    },
  };

  // BreadcrumbList — describes the tool's place in the site hierarchy
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'SmartDevBox',
        item: BASE,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: `${BASE}/features/tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: toolName,
        item: url,
      },
    ],
  };

  // FAQPage — wraps the visible question-and-answer content
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return { softwareApp, webApp, breadcrumb, faqPage };
}

function getToolFaqs(tool: (typeof TOOL_SEO_DATA)[number]) {
  if (tool.faqs.length > 0) return tool.faqs;

  const toolName = tool.heading.split(' — ')[0].trim();
  return [
    {
      q: `What does the ${toolName} do?`,
      a: tool.metaDescription,
    },
    {
      q: `Does the ${toolName} send my input to a server?`,
      a: `No. The ${toolName} runs in your browser, so your input stays on your device.`,
    },
  ];
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

  const { softwareApp, webApp, breadcrumb, faqPage } = buildJsonLd(tool);
  const faqs = getToolFaqs(tool);

  const relatedTools = tool.relatedToolIds
    .map((id) => TOOL_SEO_DATA.find((t) => t.id === id))
    .filter(Boolean) as typeof TOOL_SEO_DATA;

  const toolHref = `/tools/${tool.slug}`;
  const relatedRecipes = ENGINEERING_RECIPES.filter((recipe) =>
    recipe.relatedLinks.some((link) => link.href === toolHref)
  );

  return (
    <>
      {/* ── Structured data ──────────────────────────────────────────────── */}
      {/* SoftwareApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      {/* WebApplication — for other crawlers / schema validators */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }}
      />
      {/* BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {/* FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />

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
          {/* Body sections (long-form educational content) */}
          {tool.bodySections && tool.bodySections.length > 0 && tool.bodySections.map((section) => (
            <section key={section.heading} className="feat-section" aria-labelledby={`bs-${section.heading.replace(/\s+/g, '-').toLowerCase()}`}>
              <h2 id={`bs-${section.heading.replace(/\s+/g, '-').toLowerCase()}`} className="feat-h2">{section.heading}</h2>
              {section.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </section>
          ))}

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
          <section
            className="feat-section"
            aria-labelledby="faq-heading"
            itemScope
            itemType="https://schema.org/FAQPage"
          >
            <h2 id="faq-heading" className="feat-h2">Frequently Asked Questions</h2>
            {faqs.map((faq) => (
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

          {/* Related recipes */}
          {relatedRecipes.length > 0 && (
            <section className="feat-section" aria-labelledby="related-recipes-heading">
              <h2 id="related-recipes-heading" className="feat-h2">Related Recipes</h2>
              <ul className="feat-tool-list">
                {relatedRecipes.map((recipe) => (
                  <li key={recipe.slug} className="feat-tool-row">
                    <Link href={`/recipes/${recipe.slug}`} className="feat-tool-name">
                      {recipe.shortTitle}
                    </Link>
                    <span className="feat-tool-desc">{recipe.summary}</span>
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
          {tool.bodySections && tool.bodySections.map((section) => (
            <li key={section.heading} className="feat-toc-item">
              <a href={`#bs-${section.heading.replace(/\s+/g, '-').toLowerCase()}`}>{section.heading}</a>
            </li>
          ))}
          {tool.useCases.length > 0 && (
            <li className="feat-toc-item"><a href="#use-cases-heading">Use Cases</a></li>
          )}
          <li className="feat-toc-item"><a href="#faq-heading">FAQ</a></li>
          <li className="feat-toc-item"><a href="#privacy-heading">Privacy</a></li>
          {relatedTools.length > 0 && (
            <li className="feat-toc-item"><a href="#related-heading">Related Tools</a></li>
          )}
          {relatedRecipes.length > 0 && (
            <li className="feat-toc-item"><a href="#related-recipes-heading">Related Recipes</a></li>
          )}
        </ul>

        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/features/tools">All 97+ Tools</Link></li>
        </ul>
      </aside>
    </>
  );
}
