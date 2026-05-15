import type { Metadata } from 'next';
import Link from 'next/link';
import { RelatedArticles } from '@/components/features/RelatedArticles';

export const metadata: Metadata = {
  title: 'Auto Format Detection — Paste Anything, We Figure It Out',
  description:
    'SmartDevBox automatically detects Base64, JSON, JWT, XML, SQL, Unix timestamps, URLs, X.509 certificates, cron expressions, hex strings, color codes, and 80+ other formats the instant you paste. No manual tool selection. No clicking through menus.',
  keywords: [
    'auto detect developer tools',
    'paste and detect format',
    'automatic base64 detection',
    'automatic json detection',
    'smart developer toolbox',
    'format auto detection online',
    'auto format detection',
    'paste json auto detect',
  ],
  alternates: { canonical: 'https://smartdevbox.com/features/auto-detection' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'Auto Format Detection | SmartDevBox',
    description:
      'Paste anything. SmartDevBox detects Base64, JSON, JWT, XML, SQL, timestamps, URLs, certificates and 80+ formats instantly.',
    url: 'https://smartdevbox.com/features/auto-detection',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auto Format Detection | SmartDevBox',
    description:
      'Paste anything. SmartDevBox detects Base64, JSON, JWT, XML, SQL, timestamps, URLs, certificates and 80+ formats instantly — no manual tool selection.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What if my input matches more than one format?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The tool with the highest confidence score is applied automatically. All other matching tools appear as chips in the Detection Bar. Clicking any chip switches the active tool instantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I disable auto-detection and pick a tool manually?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Click any tool in the sidebar to lock it as the active tool, bypassing auto-detection. The sidebar is always accessible via the Tools button in the navigation bar.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does auto-detection send my data anywhere?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The heuristic detection engine runs entirely in the browser. Only the optional AI mode sends a format-detection request to OpenAI.',
      },
    },
  ],
};

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to use SmartDevBox auto format detection',
  description: 'SmartDevBox automatically detects the format of any pasted text and applies the correct developer tool — no manual tool selection required.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Open SmartDevBox',
      text: 'Navigate to smartdevbox.com — free, no sign-up required.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Paste your text',
      text: 'Paste any text — Base64, JSON, JWT, XML, SQL, a Unix timestamp, a URL, an X.509 certificate, a cron expression, or any other supported format — into the input area.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Wait 600 ms',
      text: 'After a 600 ms debounce, the detection engine scores your input against all 91 tools. The highest-scoring tool (above 0.8 confidence) runs automatically.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Review the result',
      text: 'The output appears in the right pane. The Detection Bar shows which format was recognised and at what confidence level.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Switch tools if needed',
      text: 'If a different format was intended, click any suggestion chip in the Detection Bar (tools with confidence 0.3–0.8) to switch the active tool instantly.',
    },
  ],
};

const FORMATS = [
  { name: 'Base64',            desc: 'Standard and URL-safe variants, with or without padding' },
  { name: 'JSON',              desc: 'Objects, arrays, strings, numbers — any valid JSON value' },
  { name: 'JWT tokens',        desc: 'Three-part dot-separated Base64url strings' },
  { name: 'XML / HTML',        desc: 'Tag-based markup, both well-formed and loose' },
  { name: 'SQL queries',       desc: 'SELECT, INSERT, UPDATE, DELETE, CREATE, and more' },
  { name: 'URLs',              desc: 'Full URIs with protocol, host, path, and query string' },
  { name: 'Unix timestamps',   desc: '10-digit (seconds) and 13-digit (milliseconds) integers' },
  { name: 'X.509 certificates',desc: 'PEM-encoded blocks beginning with -----BEGIN CERTIFICATE-----' },
  { name: 'Cron expressions',  desc: 'Standard five-field and extended six-field syntax' },
  { name: 'Hex strings',       desc: 'Raw byte sequences in hexadecimal notation' },
  { name: 'Color codes',       desc: 'HEX (#rrggbb), RGB, HSL, HSV values' },
  { name: 'YAML',              desc: 'Indented key-value documents' },
  { name: 'CSV / TSV',         desc: 'Comma- or tab-separated tabular data' },
  { name: 'Markdown',          desc: 'Heading, link, code-block, and list syntax' },
  { name: 'UUIDs',             desc: 'Standard 8-4-4-4-12 hyphenated format' },
  { name: 'ULIDs',             desc: '26-character Crockford Base32 strings' },
  { name: 'Base32',            desc: 'RFC 4648 encoded strings' },
  { name: 'Roman numerals',    desc: 'I through MMMCMXCIX' },
  { name: 'H:M:S durations',   desc: 'Hours:minutes:seconds notation' },
];

export default function AutoDetectionPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      {/* ── Article ──────────────────────────────────────────────────────── */}
      <article className="feat-article">
        {/* Hero */}
        <div className="feat-hero">
          <div className="feat-eyebrow">
            <span className="feat-eyebrow-dot" />
            Core Feature
          </div>
          <h1 className="feat-h1">Auto Format Detection</h1>
          <p className="feat-lead">
            Paste anything. SmartDevBox identifies the format and applies the right
            tool — instantly, with no clicking through menus.
          </p>
        </div>

        {/* Body */}
        <div className="feat-prose">
          <h2 id="what-is-it">What is Auto Detection?</h2>
          <p>
            SmartDevBox includes a real-time format detection engine that runs the
            moment you paste or type text into the input area. It scores your input
            against every one of the 91+ built-in tools simultaneously, identifies the
            most likely format with a confidence percentage, and automatically applies
            the correct tool — all before you have time to look for a menu.
          </p>
          <p>
            Instead of navigating a sidebar of tools and guessing which one applies,
            you paste once and the right tool fires. A detection bar below the input
            shows which formats were recognised and at what confidence level, so you
            always know what the engine saw.
          </p>

          <h2 id="how-it-works">How It Works</h2>
          <p>
            Every tool in SmartDevBox registers a <em>detector function</em> alongside
            its transformer. When input arrives, the engine calls every detector and
            collects a normalised confidence score from 0 to 1.
          </p>
          <div className="feat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            <div className="feat-card">
              <span className="feat-card-label">Score &gt; 0.8</span>
              <span className="feat-card-desc">Tool executes automatically — result appears immediately.</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">Score 0.3 – 0.8</span>
              <span className="feat-card-desc">Shown as a clickable suggestion chip. One click to switch.</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">Score &lt; 0.3</span>
              <span className="feat-card-desc">Quietly excluded — no noise from irrelevant tools.</span>
            </div>
          </div>
          <p>
            A 600 ms debounce prevents the engine from thrashing on every keystroke,
            so typing feels instant while detection fires only when you pause.
          </p>

          <h2 id="formats">Formats Recognised Automatically</h2>
          <p>
            These formats are detected and processed without any manual selection:
          </p>
          <div className="feat-grid">
            {FORMATS.map(f => (
              <div key={f.name} className="feat-card">
                <span className="feat-card-label">{f.name}</span>
                <span className="feat-card-desc">{f.desc}</span>
              </div>
            ))}
          </div>

          <h2 id="ai-mode">AI-Assisted Detection (Optional)</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </span>
            <p>
              AI mode is <strong>disabled by default</strong> and requires your own OpenAI
              API key. All 91+ tools work fully without it.
            </p>
          </div>
          <p>
            For ambiguous inputs where the heuristic engine is uncertain, SmartDevBox can
            optionally call the OpenAI API to classify the format. When active, an AI
            indicator appears in the detection bar. All tool processing still happens
            client-side; only the format-detection query is sent to OpenAI.
          </p>

          <h2 id="why">Why This Matters</h2>
          <p>
            Developer workflows involve constant context-switching: decode a JWT from a
            log file, format JSON from an API response, parse a timestamp from a database
            export, check a certificate expiry — often in the same five minutes. Having to
            manually select the right tool each time adds friction and breaks focus.
            Auto-detection eliminates that friction entirely.
          </p>

          <h2 id="vs-alternatives">SmartDevBox Auto-Detection vs Manual Tool Selection</h2>
          <p>
            Most developer toolboxes — including CyberChef, DevUtils, and single-purpose sites
            like base64decode.org or jsonlint.com — require you to choose the right tool before
            you can process your input. SmartDevBox inverts this model: you paste first, and the
            tool selection happens automatically.
          </p>
          <div className="feat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="feat-card">
              <span className="feat-card-label">Traditional approach</span>
              <span className="feat-card-desc">Open tool → select format → paste input → click submit → see result. Requires 3–5 deliberate steps per task.</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">SmartDevBox approach</span>
              <span className="feat-card-desc">Paste input → result appears. One step. The format identification is automated by the detection engine.</span>
            </div>
          </div>
          <p>
            This matters most when you are context-switching rapidly — decoding a Base64 blob
            from a log file, then formatting a JSON API response, then parsing a timestamp from
            a database export. Each paste triggers the correct tool automatically, with no
            navigation required between them.
          </p>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">What if my input matches more than one format?</h3>
              <p className="feat-faq-a">
                The tool with the highest confidence score is applied automatically. All
                other matching tools appear as chips in the Detection Bar. Clicking any
                chip switches the active tool instantly.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Can I disable auto-detection and pick a tool manually?</h3>
              <p className="feat-faq-a">
                Yes. Click any tool in the sidebar to lock it as the active tool,
                bypassing auto-detection. The sidebar is always accessible via the Tools
                button in the navigation bar.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Does auto-detection send my data anywhere?</h3>
              <p className="feat-faq-a">
                No. The heuristic detection engine runs entirely in the browser. Only the
                optional AI mode sends a format-detection request to OpenAI. See the{' '}
                <Link href="/features/privacy">Privacy &amp; Security</Link> page for
                full details.
              </p>
            </div>
          </div>
        </div>

        <RelatedArticles current="auto-detection" />
      </article>

      {/* ── TOC ──────────────────────────────────────────────────────────── */}
      <aside className="feat-toc" aria-label="On this page">
        <p className="feat-toc-title">On this page</p>
        <ul className="feat-toc-list">
          {[
            ['#what-is-it',       'What is it?'],
            ['#how-it-works',     'How it works'],
            ['#formats',          'Formats'],
            ['#ai-mode',          'AI mode'],
            ['#why',              'Why it matters'],
            ['#vs-alternatives',  'vs alternatives'],
            ['#faq',              'FAQ'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item">
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
