import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ENGINEERING_RECIPES, RECIPE_SLUG_MAP } from '@/lib/recipes';

export function generateStaticParams() {
  return ENGINEERING_RECIPES.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = RECIPE_SLUG_MAP.get(slug);
  if (!recipe) return {};

  const url = `https://smartdevbox.com/recipes/${recipe.slug}`;
  return {
    title: `${recipe.title} | SmartDevBox`,
    description: recipe.metaDescription,
    keywords: [...recipe.keywords, 'smartdevbox', 'developer workflow', 'browser developer tools'],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      siteName: 'SmartDevBox',
      title: `${recipe.title} | SmartDevBox`,
      description: recipe.metaDescription,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${recipe.title} | SmartDevBox`,
      description: recipe.metaDescription,
    },
  };
}

function anchorId(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildJsonLd(recipe: (typeof ENGINEERING_RECIPES)[number]) {
  const BASE = 'https://smartdevbox.com';
  const url = `${BASE}/recipes/${recipe.slug}`;

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Engineering Recipes', item: `${BASE}/recipes` },
      { '@type': 'ListItem', position: 3, name: recipe.title, item: url },
    ],
  };

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: recipe.title,
    description: recipe.metaDescription,
    url,
    tool: recipe.relatedLinks.map((link) => link.label),
    step: recipe.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.body,
    })),
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: recipe.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return { breadcrumb, howTo, faqPage };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = RECIPE_SLUG_MAP.get(slug);
  if (!recipe) notFound();

  const { breadcrumb, howTo, faqPage } = buildJsonLd(recipe);
  const relatedRecipes = recipe.relatedRecipeSlugs
    .map((relatedSlug) => RECIPE_SLUG_MAP.get(relatedSlug))
    .filter(Boolean) as typeof ENGINEERING_RECIPES;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />

      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow"><span className="feat-eyebrow-dot" />{recipe.category}</div>
          <h1 className="feat-h1">{recipe.title}</h1>
          <p className="feat-lead">{recipe.summary}</p>
        </div>

        <div className="feat-prose">
          <section className="feat-section" id="problem">
            <h2 className="feat-h2">Problem</h2>
            <p>{recipe.problem}</p>
          </section>

          <section className="feat-section" id="solution">
            <h2 className="feat-h2">Solution</h2>
            <p>{recipe.solution}</p>
          </section>

          <section className="feat-section" id="workflow">
            <h2 className="feat-h2">Workflow</h2>
            <ol className="feat-steps">
              {recipe.steps.map((step, index) => (
                <li key={step.title} className="feat-step">
                  <span className="feat-step-num">{index + 1}</span>
                  <span className="feat-step-text">
                    <strong>{step.title}</strong>
                    <br />
                    {step.body}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="feat-section" id="examples">
            <h2 className="feat-h2">Examples</h2>
            {recipe.examples.map((example) => (
              <div key={example.title} className="recipe-example">
                <h3 className="feat-h3">{example.title}</h3>
                <p>{example.body}</p>
                {example.code && (
                  <pre className="feat-code-block"><code>{example.code}</code></pre>
                )}
              </div>
            ))}
          </section>

          <section className="feat-section" id="checklist">
            <h2 className="feat-h2">Checklist</h2>
            <ul>
              {recipe.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="feat-section" id="tools">
            <h2 className="feat-h2">Tools Used</h2>
            <ul className="feat-tool-list">
              {recipe.relatedLinks.map((link) => (
                <li key={link.href} className="feat-tool-row">
                  <Link href={link.href} className="feat-tool-name">{link.label}</Link>
                  <span className="feat-tool-desc">{link.desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="feat-section" id="faq">
            <h2 className="feat-h2">Frequently Asked Questions</h2>
            <div className="feat-faq">
              {recipe.faqs.map((faq) => (
                <div key={faq.q} className="feat-faq-item">
                  <h3 className="feat-faq-q">{faq.q}</h3>
                  <p className="feat-faq-a">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {relatedRecipes.length > 0 && (
            <section className="feat-section" id="related">
              <h2 className="feat-h2">Related Recipes</h2>
              <div className="feat-grid">
                {relatedRecipes.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/recipes/${related.slug}`}
                    className="feat-card recipe-card-link"
                  >
                    <span className="feat-card-label">{related.shortTitle}</span>
                    <span className="feat-card-desc">{related.summary}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <aside className="feat-toc" aria-label="On this page">
        <p className="feat-toc-title">On this page</p>
        <ul className="feat-toc-list">
          {['Problem', 'Solution', 'Workflow', 'Examples', 'Checklist', 'Tools', 'FAQ'].map((label) => (
            <li key={label} className="feat-toc-item">
              <a href={`#${anchorId(label)}`}>{label}</a>
            </li>
          ))}
          {relatedRecipes.length > 0 && (
            <li className="feat-toc-item"><a href="#related">Related</a></li>
          )}
        </ul>

        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/recipes">All Recipes</Link></li>
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools">Tool Guides</Link></li>
        </ul>
      </aside>
    </>
  );
}
