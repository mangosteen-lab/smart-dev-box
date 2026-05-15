import type { Metadata } from 'next';
import Link from 'next/link';
import { RelatedArticles } from '@/components/features/RelatedArticles';

export const metadata: Metadata = {
  title: 'Text & Code Diff Comparison Tool | SmartDevBox',
  description:
    'SmartDevBox includes a free side-by-side diff tool. Paste two versions of any text or code and see additions, deletions, and unchanged lines highlighted instantly in the browser.',
  keywords: [
    'online diff tool',
    'text comparison tool',
    'code diff online',
    'side by side diff',
    'compare two texts online',
    'find differences between texts',
    'json diff online',
    'free diff checker',
  ],
  alternates: { canonical: 'https://smartdevbox.com/features/compare' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'Text & Code Diff Comparison | SmartDevBox',
    description:
      'Free side-by-side diff tool. Paste two versions of any text or code and see changes highlighted instantly — no sign-up, runs in the browser.',
    url: 'https://smartdevbox.com/features/compare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Diff Tool — Compare Any Text or Code | SmartDevBox',
    description:
      'Side-by-side diff for text, JSON, SQL, config files, and code. Additions and deletions highlighted instantly in your browser. No sign-up.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the diff line-level or character-level?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The primary view is line-level, like git diff. Within changed lines, intra-line character differences are also highlighted to help you spot small changes like a renamed key or a changed value.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a size limit for the diff tool?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No hard limit — the diff runs client-side, limited only by your browser\'s available memory. Typical development payloads up to a few thousand lines compare instantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the diff tool send my text anywhere?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Both panes are processed entirely in the browser. Your text never leaves your machine.',
      },
    },
  ],
};

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to compare two texts or code files online with SmartDevBox',
  description: 'Use the free Split & Diff tool in SmartDevBox to compare any two blocks of text or code side-by-side, with additions and deletions highlighted in real time.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Open SmartDevBox',
      text: 'Navigate to smartdevbox.com — no account or sign-up required.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Select the Split & Diff tool',
      text: 'In the left sidebar, click Split & Diff under the Text category, or press ⌘K and type "diff".',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Paste the original version',
      text: 'Paste the original text or code into the left pane.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Paste the modified version',
      text: 'Paste the updated text or code into the right pane.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Review the highlighted diff',
      text: 'Added lines are highlighted in green, removed lines in red. Intra-line character changes are also highlighted for precision.',
    },
  ],
};

const WHAT_YOU_CAN_COMPARE = [
  { name: 'JSON objects',         desc: 'Spot added, renamed, or changed fields between two API responses.' },
  { name: 'SQL queries',          desc: 'Review a query change before deploying.' },
  { name: 'Config files',         desc: 'YAML, TOML, INI, .env — compare any version.' },
  { name: 'XML documents',        desc: 'Compare two API payloads or schema versions.' },
  { name: 'CSS stylesheets',      desc: 'Before and after a refactor.' },
  { name: 'JavaScript / TypeScript', desc: 'Compare two function or module implementations.' },
  { name: 'Plain text',           desc: 'Contracts, docs, commit messages, release notes.' },
  { name: 'Log output',           desc: 'Spot what changed between two runs.' },
  { name: 'HTML markup',          desc: 'Compare two rendered templates.' },
];

export default function ComparePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      {/* ── Article ──────────────────────────────────────────────────────── */}
      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow">
            <span className="feat-eyebrow-dot" />
            Text Tools
          </div>
          <h1 className="feat-h1">Text &amp; Code Comparison</h1>
          <p className="feat-lead">
            Paste two versions of anything. See exactly what changed — additions
            in green, deletions in red, updated in real time as you type.
          </p>
        </div>

        <div className="feat-prose">
          <h2 id="tool">The Split Diff Tool</h2>
          <p>
            SmartDevBox includes a dedicated <strong>Split &amp; Diff</strong> panel that
            lets you compare two blocks of text side by side. The diff updates in real
            time as you type in either pane — no submit button, no page reload.
          </p>
          <p>
            The tool uses a line-level Myers diff algorithm — the same approach used by
            <code> git diff</code> — giving you an accurate and familiar view of changes
            between any two text versions.
          </p>

          <div className="feat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="feat-card" style={{ borderLeftColor: 'var(--green)', borderLeftWidth: 2 }}>
              <span className="feat-card-label" style={{ color: 'var(--green)' }}>Added lines</span>
              <span className="feat-card-desc">Highlighted in green</span>
            </div>
            <div className="feat-card" style={{ borderLeftColor: 'var(--error)', borderLeftWidth: 2 }}>
              <span className="feat-card-label" style={{ color: 'var(--error)' }}>Removed lines</span>
              <span className="feat-card-desc">Highlighted in red</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">Unchanged</span>
              <span className="feat-card-desc">Shown in neutral for context</span>
            </div>
          </div>

          <h2 id="what-to-compare">What You Can Compare</h2>
          <div className="feat-grid">
            {WHAT_YOU_CAN_COMPARE.map(item => (
              <div key={item.name} className="feat-card">
                <span className="feat-card-label">{item.name}</span>
                <span className="feat-card-desc">{item.desc}</span>
              </div>
            ))}
          </div>

          <h2 id="how-to-use">How to Use It</h2>
          <ol className="feat-steps">
            {[
              <><Link href="/">Open SmartDevBox</Link>.</>,
              <>In the left sidebar, select <strong>Split &amp; Diff</strong> under <strong>Text</strong> — or press <kbd>⌘K</kbd> and type &ldquo;diff&rdquo;.</>,
              <>Paste the original version in the <strong>left pane</strong>.</>,
              <>Paste the modified version in the <strong>right pane</strong>.</>,
              <>Differences highlight immediately — no button to click.</>,
            ].map((step, i) => (
              <li key={i} className="feat-step">
                <span className="feat-step-num">{i + 1}</span>
                <span className="feat-step-text">{step}</span>
              </li>
            ))}
          </ol>

          <h2 id="workflow">Combine with Other Tools</h2>
          <p>
            A common workflow is to format both inputs before diffing. For example:
          </p>
          <ol className="feat-steps">
            {[
              <>Paste minified JSON — SmartDevBox <Link href="/features/auto-detection">auto-detects</Link> and formats it.</>,
              <>Copy the formatted output.</>,
              <>Repeat for the second blob, then diff the two formatted versions.</>,
            ].map((step, i) => (
              <li key={i} className="feat-step">
                <span className="feat-step-num">{i + 1}</span>
                <span className="feat-step-text">{step}</span>
              </li>
            ))}
          </ol>
          <p>
            Because both inputs have consistent indentation, the diff is clean and
            perfectly line-aligned — no noise from whitespace differences.
          </p>

          <h2 id="why">Why a Browser-Based Diff Tool?</h2>
          <p>
            Opening a desktop diff application or uploading files to a web service adds
            unnecessary friction during debugging. SmartDevBox&apos;s diff tool is
            zero-friction: open the app, paste, done. No install, no account, and no
            data uploaded to a server. Both panes stay in the browser.
          </p>

          <h2 id="vs-alternatives">SmartDevBox Diff vs Standalone Diff Tools</h2>
          <p>
            Dedicated diff tools like <code>diff</code>, <code>vimdiff</code>, and
            web services like diffchecker.com all work well in isolation. SmartDevBox&apos;s
            diff tool is distinguished by its integration with the rest of the toolbox:
          </p>
          <div className="feat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="feat-card">
              <span className="feat-card-label">Isolated diff tools</span>
              <span className="feat-card-desc">Compare plain text only. To diff formatted JSON you must format it yourself first, in a separate tool or editor.</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">SmartDevBox diff</span>
              <span className="feat-card-desc">Auto-format JSON, XML, or SQL in the same app, then switch to Split & Diff. No copy-pasting between tools or browser tabs.</span>
            </div>
          </div>
          <p>
            For JSON comparison in particular, a recommended workflow is: paste into the
            main input area to auto-format, copy the formatted output, then open Split &amp; Diff
            and compare the two formatted versions. The diff is clean because consistent
            indentation eliminates whitespace noise.
          </p>
          <p>
            diffchecker.com and similar services upload your text to their servers.
            SmartDevBox&apos;s diff runs entirely in the browser — nothing is uploaded,
            making it safe for internal code, credentials, and API responses.
          </p>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Is the diff line-level or character-level?</h3>
              <p className="feat-faq-a">
                The primary view is line-level, like <code>git diff</code>. Within changed
                lines, intra-line character differences are also highlighted to help you
                spot small changes like a renamed key or a changed value.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Is there a size limit?</h3>
              <p className="feat-faq-a">
                No hard limit — the diff runs client-side, limited only by your
                browser&apos;s available memory. Typical development payloads up to a few
                thousand lines compare instantly.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Does the diff tool send my text anywhere?</h3>
              <p className="feat-faq-a">
                No. Both panes are processed entirely in the browser. See the{' '}
                <Link href="/features/privacy">Privacy &amp; Security</Link> page for
                full details.
              </p>
            </div>
          </div>
        </div>

        <RelatedArticles current="compare" />
      </article>

      {/* ── TOC ──────────────────────────────────────────────────────────── */}
      <aside className="feat-toc" aria-label="On this page">
        <p className="feat-toc-title">On this page</p>
        <ul className="feat-toc-list">
          {[
            ['#tool',            'The diff tool'],
            ['#what-to-compare', 'What to compare'],
            ['#how-to-use',      'How to use'],
            ['#workflow',        'Workflow tips'],
            ['#why',             'Why browser-based'],
            ['#vs-alternatives', 'vs alternatives'],
            ['#faq',             'FAQ'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
      </aside>
    </>
  );
}
