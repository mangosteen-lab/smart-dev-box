import type { Metadata } from 'next';
import Link from 'next/link';
import { ENGINEERING_RECIPES, RECIPE_CATEGORIES } from '@/lib/recipes';

export const metadata: Metadata = {
  title: 'Engineering Recipes for Developer Workflows | SmartDevBox',
  description:
    'Practical engineering recipes for comparing JSON responses, decoding JWTs, extracting URLs from logs, reviewing secrets, diffing Kubernetes YAML, and more.',
  keywords: [
    'engineering recipes',
    'developer workflow tutorials',
    'json response diff',
    'decode jwt token',
    'extract urls from logs',
    'compare kubernetes yaml',
  ],
  alternates: { canonical: 'https://smartdevbox.com/recipes' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'Engineering Recipes for Developer Workflows | SmartDevBox',
    description:
      'Workflow-first tutorials for real debugging tasks using SmartDevBox tools locally in the browser.',
    url: 'https://smartdevbox.com/recipes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering Recipes for Developer Workflows | SmartDevBox',
    description:
      'Compare API responses, decode JWTs, extract log data, review secrets, and document requests with local browser tools.',
  },
};

const collectionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Engineering Recipes',
  url: 'https://smartdevbox.com/recipes',
  description:
    'Practical engineering workflow tutorials using SmartDevBox developer tools.',
  hasPart: ENGINEERING_RECIPES.map((recipe) => ({
    '@type': 'HowTo',
    name: recipe.title,
    url: `https://smartdevbox.com/recipes/${recipe.slug}`,
    description: recipe.metaDescription,
  })),
};

export default function RecipesIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow"><span className="feat-eyebrow-dot" />Engineering Recipes</div>
          <h1 className="feat-h1">Developer Workflow Recipes</h1>
          <p className="feat-lead">
            Practical, problem-first guides for debugging API responses, logs, tokens,
            Kubernetes manifests, certificates, and prompt changes with SmartDevBox tools.
            These pages target real engineering searches, not another list of generic generators.
          </p>
        </div>

        <div className="feat-prose">
          <section className="feat-section" id="recipes">
            <h2 className="feat-h2">Recipes</h2>
            <div className="feat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
              {ENGINEERING_RECIPES.map((recipe) => (
                <Link
                  key={recipe.slug}
                  href={`/recipes/${recipe.slug}`}
                  className="feat-card recipe-card-link"
                >
                  <span className="feat-card-label">{recipe.title}</span>
                  <span className="feat-card-desc">{recipe.summary}</span>
                  <span className="recipe-card-meta">{recipe.category} · {recipe.targetQuery}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="feat-section" id="why-recipes">
            <h2 className="feat-h2">Why Recipes Instead of More Generators?</h2>
            <p>
              Search demand around developer utilities is competitive at the single-tool
              keyword level. A workflow page can be more useful because it matches the
              situation a developer is actually in: comparing two responses, redacting
              logs, checking a token, or validating a manifest before a deployment.
            </p>
            <p>
              Each recipe links to the relevant SmartDevBox tools, but the page itself
              explains the debugging path: what to inspect first, where mistakes hide,
              and how to keep sensitive input local.
            </p>
          </section>

          <section className="feat-section" id="categories">
            <h2 className="feat-h2">Categories</h2>
            <div className="feat-grid">
              {RECIPE_CATEGORIES.map((category) => (
                <div key={category} className="feat-card">
                  <span className="feat-card-label">{category}</span>
                  <span className="feat-card-desc">
                    {ENGINEERING_RECIPES.filter((recipe) => recipe.category === category).length} recipes
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>

      <aside className="feat-toc" aria-label="On this page">
        <p className="feat-toc-title">On this page</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><a href="#recipes">Recipes</a></li>
          <li className="feat-toc-item"><a href="#why-recipes">Why recipes?</a></li>
          <li className="feat-toc-item"><a href="#categories">Categories</a></li>
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools">Tool Guides</Link></li>
          <li className="feat-toc-item"><Link href="/features/privacy">Privacy</Link></li>
        </ul>
      </aside>
    </>
  );
}
