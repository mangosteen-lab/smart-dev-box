import type { Metadata } from 'next';
import { RelatedArticles } from '@/components/features/RelatedArticles';

export const metadata: Metadata = {
  title: '100% Client-Side — Your Data Never Leaves Your Browser | SmartDevBox',
  description:
    'SmartDevBox processes all data entirely in your browser. No server uploads, no data storage, no accounts. Safe to use with sensitive tokens, certificates, API keys, and internal data.',
  keywords: [
    'client side developer tools',
    'private developer tools no server',
    'offline developer tools',
    'browser based tools no upload',
    'secure online developer tools',
    'decode jwt privately',
    'format json without sending data',
    'private base64 decoder',
  ],
  alternates: { canonical: 'https://smartdevbox.com/features/privacy' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'Client-Side Privacy & Security | SmartDevBox',
    description:
      'All 97+ SmartDevBox tools run entirely in your browser. Your JWTs, certificates, API keys, and code never touch a server.',
    url: 'https://smartdevbox.com/features/privacy',
  },
  twitter: {
    card: 'summary_large_image',
    title: '100% Client-Side — Your Data Never Leaves Your Browser | SmartDevBox',
    description:
      'All 97+ SmartDevBox tools run in the browser. No server. No account. Safe for JWTs, certificates, API keys, and sensitive internal data.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is it safe to paste a JWT token into SmartDevBox?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, as long as AI mode is disabled (the default). The JWT Inspector and JWT Encoder run entirely in the browser. Your token is never sent anywhere.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I verify that SmartDevBox sends no data to a server?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Open DevTools → Network tab → paste data. You will see no outbound fetch requests to any server. With AI mode enabled you will see a request to api.openai.com.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does SmartDevBox work in air-gapped environments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, after initial load. Once the application assets are cached, all tools work without network access. For fully air-gapped setups, you can self-host the application — it is a standard Next.js static export.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Google Analytics collect on SmartDevBox?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Page URL, referrer, browser, approximate geographic region, and session duration. It does not receive the content you paste into tools.',
      },
    },
  ],
};

const SENSITIVE_DATA = [
  { name: 'JWT tokens',          desc: 'Contain auth claims and are often long-lived.' },
  { name: 'API keys & secrets',  desc: 'Embedded in JSON config blobs or .env files.' },
  { name: 'X.509 certificates',  desc: 'May reveal internal infrastructure details.' },
  { name: 'Database exports',    desc: 'CSV or JSON files containing PII or business data.' },
  { name: 'API responses',       desc: 'Proprietary schema and field names.' },
  { name: 'Code snippets',       desc: 'Unreleased features, internal logic.' },
];

export default function PrivacyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* ── Article ──────────────────────────────────────────────────────── */}
      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow">
            <span className="feat-eyebrow-dot" />
            Privacy &amp; Security
          </div>
          <h1 className="feat-h1">100% Client-Side</h1>
          <p className="feat-lead">
            Your data never leaves your browser — not even a byte. Every one of the
            97+ tools runs entirely in the browser using client-side JavaScript.
          </p>
        </div>

        <div className="feat-prose">
          <h2 id="architecture">How It Works</h2>
          <p>
            When you paste a JWT token, format a JSON blob, decode a Base64 string,
            inspect an X.509 certificate, or compute a SHA-256 hash, all processing
            happens locally on your machine. Nothing is sent to a server.
          </p>
          <p>
            This is not a policy statement — it is an architectural fact. There is no
            server-side endpoint that receives tool input. SmartDevBox is a static Next.js
            application served from Cloudflare Pages; once loaded, it operates entirely
            offline. You can verify this at any time by opening your browser&apos;s Network
            panel and observing that pasting data generates no outbound requests.
          </p>

          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </span>
            <p>
              Open DevTools → Network tab → paste data into SmartDevBox. You will see
              <strong> zero outbound requests</strong> (other than the standard Google
              Analytics pageview ping, which contains no tool input).
            </p>
          </div>

          <h2 id="why">Why This Matters</h2>
          <p>
            Developers routinely work with sensitive data. Pasting any of the following
            into a tool that has a server backend is a security risk — even if the
            provider has a privacy policy. With SmartDevBox, there is no backend to
            leak to. The risk is structurally zero.
          </p>
          <div className="feat-grid">
            {SENSITIVE_DATA.map(item => (
              <div key={item.name} className="feat-card">
                <span className="feat-card-label">{item.name}</span>
                <span className="feat-card-desc">{item.desc}</span>
              </div>
            ))}
          </div>

          <h2 id="no-account">No Account. No Sign-Up. No Tracking of Inputs.</h2>
          <p>
            SmartDevBox requires no account and no sign-up. There is no user session on
            the server because there is no server handling your tool input. Your results
            are never stored, logged, or associated with any identifier.
          </p>
          <p>
            SmartDevBox uses Google Analytics (<code>G-6Q9YWVQLYN</code>) to measure
            aggregate page traffic. This is standard web analytics and does
            <strong> not</strong> include tool input content. No content you paste into
            SmartDevBox is ever captured by analytics.
          </p>

          <h2 id="ai-mode">The One Optional Exception: AI Mode</h2>
          <p>
            SmartDevBox includes an <em>optional</em> AI-assisted detection mode. When
            enabled, for ambiguous inputs where the local heuristic engine is uncertain,
            SmartDevBox sends a short format-detection query to the OpenAI API.
          </p>
          <ul>
            <li><strong>Disabled by default</strong> — must be explicitly activated</li>
            <li><strong>Your own API key</strong> — SmartDevBox does not proxy an OpenAI key</li>
            <li><strong>Limited scope</strong> — only the input text is sent for classification</li>
            <li><strong>Clearly indicated</strong> — an AI badge appears in the Detection Bar when active</li>
          </ul>
          <p>
            If your data must never leave your machine under any circumstances, keep AI
            mode disabled (the default). All 97+ tools work fully without it.
          </p>

          <h2 id="offline">Offline Use</h2>
          <p>
            Because SmartDevBox is a static client-side application, it can be loaded
            once and used without an internet connection. After the page assets are cached
            by your browser, all tools continue to function offline. There is no
            server-side dependency for any core tool functionality.
          </p>

          <h2 id="local-storage">Data Stored Locally</h2>
          <p>
            SmartDevBox uses <code>localStorage</code> (via Zustand persist) to remember
            UI preferences — dark/light theme, sidebar state, recently used tools. This
            data never leaves your machine. Clear it at any time by clearing browser
            local storage for <code>smartdevbox.com</code>.
          </p>

          <h2 id="vs-alternatives">SmartDevBox Privacy vs Server-Side Tools</h2>
          <p>
            Many developer utility sites process your input on their servers — your JWT, certificate,
            or JSON is sent over the network, logged in access logs, and potentially retained.
            SmartDevBox is architected to make server transmission architecturally impossible for
            the 98+ built-in tools:
          </p>
          <div className="feat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="feat-card">
              <span className="feat-card-label">Server-side tools</span>
              <span className="feat-card-desc">Your input is sent as an HTTP request. It appears in server access logs. The provider&apos;s privacy policy governs retention and use.</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">SmartDevBox (client-side)</span>
              <span className="feat-card-desc">All 98+ tools run in your browser tab. No HTTP request is made when you paste. There is no server to receive or log your input.</span>
            </div>
          </div>
          <p>
            You can verify this yourself: open DevTools → Network tab → paste a JWT or
            certificate into SmartDevBox. You will see no outbound requests to any server.
            (With optional AI mode enabled, you will see a request to <code>api.openai.com</code> only.)
          </p>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Is it safe to paste a JWT token?</h3>
              <p className="feat-faq-a">
                Yes, as long as AI mode is disabled (the default). The JWT Inspector and
                JWT Encoder run entirely in the browser. Your token is never sent anywhere.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Can I verify that no data is sent to a server?</h3>
              <p className="feat-faq-a">
                Yes. Open DevTools → Network tab → paste data. You will see no outbound
                fetch requests to any server. With AI mode enabled you will see a request
                to <code>api.openai.com</code>.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Does SmartDevBox work in air-gapped environments?</h3>
              <p className="feat-faq-a">
                Yes, after initial load. Once the application assets are cached, all tools
                work without network access. For fully air-gapped setups, you can
                self-host the application — it is a standard Next.js static export.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">What does Google Analytics collect?</h3>
              <p className="feat-faq-a">
                Page URL, referrer, browser, approximate geographic region, and session
                duration. It does not receive the content you paste into tools.
              </p>
            </div>
          </div>
        </div>

        <RelatedArticles current="privacy" />
      </article>

      {/* ── TOC ──────────────────────────────────────────────────────────── */}
      <aside className="feat-toc" aria-label="On this page">
        <p className="feat-toc-title">On this page</p>
        <ul className="feat-toc-list">
          {[
            ['#architecture',    'How it works'],
            ['#why',             'Why it matters'],
            ['#no-account',      'No account'],
            ['#ai-mode',         'AI mode exception'],
            ['#offline',         'Offline use'],
            ['#local-storage',   'Local storage'],
            ['#vs-alternatives', 'vs server-side tools'],
            ['#faq',             'FAQ'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
      </aside>
    </>
  );
}
