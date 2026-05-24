import type { Metadata } from 'next';
import Link from 'next/link';
import { RelatedArticles } from '@/components/features/RelatedArticles';

export const metadata: Metadata = {
  title: 'Plugin System — Extend SmartDevBox with Custom Tools | SmartDevBox',
  description:
    'SmartDevBox has a rich plugin system that lets you add custom tools, transformers, and detectors without forking the codebase. Ship your own tools alongside the 97+ built-in ones.',
  keywords: [
    'developer tools plugin system',
    'custom dev tools',
    'extend developer toolbox',
    'SmartDevBox plugins',
    'custom tool browser extension',
    'extensible developer tools',
  ],
  alternates: { canonical: 'https://smartdevbox.com/features/plugins' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'Plugin System | SmartDevBox',
    description:
      'Add your own tools to SmartDevBox with the built-in plugin system. Write a detector and a transformer, register it, and it appears alongside all 97+ built-in tools.',
    url: 'https://smartdevbox.com/features/plugins',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plugin System — Add Custom Tools to SmartDevBox',
    description:
      'Register your own detectors and transformers alongside the 97+ built-in tools. No fork required — just write a plugin and load it.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do plugins need to be deployed with the application?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Built-in plugins in the /plugins directory are bundled at build time. Dynamically registered plugins (via Plugin Manager or /api/plugins) are loaded at runtime and survive page reloads without a rebuild.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can a plugin participate in auto-detection?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. If your detect() function returns a score above 0.3 for a given input, it will appear as a detection chip alongside the built-in detections.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the plugin system open source?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SmartDevBox is self-hosted. The plugin registry, API routes, and Plugin Manager component are all part of the open application codebase and can be freely inspected, modified, or extended.',
      },
    },
  ],
};

const PLUGIN_FIELDS = [
  { name: 'id',          desc: 'A unique string identifier, e.g. "my-custom-tool"' },
  { name: 'name',        desc: 'Human-readable display name shown in the sidebar' },
  { name: 'category',    desc: 'The sidebar category to group the tool under' },
  { name: 'description', desc: 'Short description shown in the Command Palette (⌘K)' },
  { name: 'detect()',    desc: 'Returns a confidence score 0–1; used by auto-detection' },
  { name: 'transform()', desc: 'Produces the tool\'s output from the input string' },
];

const USE_CASES = [
  'Decode a proprietary binary format used internally',
  'Transform Avro or Protobuf data with your own schema',
  'Add a company-specific ID format validator or generator',
  'Create a custom JWT decoder that understands your claim structure',
  'Convert between an internal config format and standard JSON',
  'Build a formatter for an internal DSL or query language',
  'Add hash functions beyond MD5/SHA — e.g. BLAKE2 or CRC32',
  'Extend the detection engine to recognise your company\'s token formats',
];

export default function PluginsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* ── Article ──────────────────────────────────────────────────────── */}
      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow">
            <span className="feat-eyebrow-dot" />
            Extensibility
          </div>
          <h1 className="feat-h1">Plugin System</h1>
          <p className="feat-lead">
            97+ tools built in. Unlimited tools with plugins. Add your own
            transformers, detectors, and generators — they appear and behave exactly
            like built-in tools.
          </p>
        </div>

        <div className="feat-prose">
          <h2 id="why">Why a Plugin System?</h2>
          <p>
            No general-purpose toolbox covers every workflow. Teams often need
            specialised transformations — proprietary encoding schemes, internal data
            formats, custom hash functions, or domain-specific converters.
            SmartDevBox&apos;s plugin system lets you add exactly those tools without
            forking the codebase or waiting for an upstream release.
          </p>
          <p>
            Plugins integrate at the same level as built-in tools: they appear in the
            sidebar, participate in{' '}
            <Link href="/features/auto-detection">auto-detection</Link>, and produce
            output in the standard panel with copy and download support.
          </p>

          <h2 id="architecture">Plugin Architecture</h2>
          <p>
            A SmartDevBox tool is a plain <code>ToolDefinition</code> object with six
            fields:
          </p>
          <div className="feat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {PLUGIN_FIELDS.map(f => (
              <div key={f.name} className="feat-card">
                <span className="feat-card-label"><code style={{ background: 'none', border: 'none', padding: 0, color: 'var(--amber)' }}>{f.name}</code></span>
                <span className="feat-card-desc">{f.desc}</span>
              </div>
            ))}
          </div>
          <p>
            Once registered, a plugin is indistinguishable from a built-in tool. It
            appears in the sidebar under the category you choose, is searchable via the
            Command Palette (<kbd>⌘K</kbd>), and triggers in the auto-detection engine
            if its <code>detect()</code> function returns a score above 0.3.
          </p>

          <h2 id="registry">The Plugin Registry</h2>
          <p>
            The registry exposes three functions:
          </p>
          <ul>
            <li><strong><code>registerPlugin(definition)</code></strong> — registers a tool definition</li>
            <li><strong><code>unregisterPlugin(id)</code></strong> — removes a registered tool</li>
            <li><strong><code>listPlugins()</code></strong> — returns all registered plugin tools</li>
          </ul>
          <p>
            A REST API at <code>/api/plugins</code> backs the Plugin Manager UI and
            persists plugins across sessions via local storage.
          </p>

          <h2 id="manager">Plugin Manager UI</h2>
          <p>
            SmartDevBox ships with a <strong>Plugin Manager</strong> panel accessible
            from the sidebar. It lists all installed plugins with their name, ID,
            category, and description. You can enable, disable, or remove plugins from
            this panel without touching any code.
          </p>

          <h2 id="use-cases">Use Cases for Custom Plugins</h2>
          <ul>
            {USE_CASES.map(uc => <li key={uc}>{uc}</li>)}
          </ul>

          <h2 id="security">Security Model</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </span>
            <p>
              Plugins run in the same browser context as SmartDevBox. Only install
              plugins from sources you trust — there is no sandboxing layer between
              plugin code and the browser.
            </p>
          </div>
          <p>
            Plugins you write yourself or distribute internally are safe by definition.
            Exercise the same caution with third-party plugins as you would with any
            third-party JavaScript.
          </p>

          <h2 id="vs-alternatives">SmartDevBox Plugins vs Browser Extensions</h2>
          <p>
            A common alternative for adding custom developer tools is to install a browser
            extension. SmartDevBox plugins offer a different trade-off:
          </p>
          <div className="feat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="feat-card">
              <span className="feat-card-label">Browser extensions</span>
              <span className="feat-card-desc">Require publishing to the Chrome Web Store or Firefox Add-ons, a review process, and user installation. Not practical for team-internal tools.</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">SmartDevBox plugins</span>
              <span className="feat-card-desc">Drop a file in the plugins directory (or register via the Plugin Manager). No app store, no review, no installation step. Instant for team-internal tools.</span>
            </div>
          </div>
          <p>
            Plugins also integrate with SmartDevBox&apos;s auto-detection system. A plugin
            that provides a <code>detector</code> function participates in the same confidence
            scoring used by all 91 built-in tools — so your custom tool can fire automatically
            on paste, just like the built-ins.
          </p>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Do plugins need to be deployed with the application?</h3>
              <p className="feat-faq-a">
                Built-in plugins in the <code>/plugins</code> directory are bundled at
                build time. Dynamically registered plugins (via Plugin Manager or
                <code> /api/plugins</code>) are loaded at runtime and survive page reloads
                without a rebuild.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Can a plugin participate in auto-detection?</h3>
              <p className="feat-faq-a">
                Yes. If your <code>detect()</code> function returns a score above 0.3
                for a given input, it will appear as a detection chip alongside the
                built-in detections.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Is the plugin system open source?</h3>
              <p className="feat-faq-a">
                SmartDevBox is self-hosted. The plugin registry, API routes, and Plugin
                Manager component are all part of the open application codebase and can
                be freely inspected, modified, or extended.
              </p>
            </div>
          </div>
        </div>

        <RelatedArticles current="plugins" />
      </article>

      {/* ── TOC ──────────────────────────────────────────────────────────── */}
      <aside className="feat-toc" aria-label="On this page">
        <p className="feat-toc-title">On this page</p>
        <ul className="feat-toc-list">
          {[
            ['#why',            'Why plugins?'],
            ['#architecture',   'Architecture'],
            ['#registry',       'Registry API'],
            ['#manager',        'Plugin Manager'],
            ['#use-cases',      'Use cases'],
            ['#security',       'Security'],
            ['#vs-alternatives','vs extensions'],
            ['#faq',            'FAQ'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
      </aside>
    </>
  );
}
