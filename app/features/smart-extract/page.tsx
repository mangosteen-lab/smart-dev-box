import type { Metadata } from 'next';
import Link from 'next/link';
import { RelatedArticles } from '@/components/features/RelatedArticles';

export const metadata: Metadata = {
  title: 'Smart Extract — Pull JSON, XML, Dates, URLs & Emails from Mixed Text | SmartDevBox',
  description:
    'SmartDevBox Extract Sections scans any mixed-format text and pulls out every embedded JSON object, XML element, HTML block, ISO date, URL, and email address — with exact line, column, and byte-offset metadata. No regex, no setup.',
  keywords: [
    'extract json from text online',
    'extract xml from text',
    'extract dates from text',
    'extract urls from mixed text',
    'extract emails from log',
    'mixed format text parser',
    'embedded json extractor',
    'smart extract developer tool',
  ],
  alternates: { canonical: 'https://smartdevbox.com/features/smart-extract' },
  openGraph: {
    type: 'article',
    siteName: 'SmartDevBox',
    title: 'Smart Extract — JSON, XML, Dates, URLs & Emails from Mixed Text | SmartDevBox',
    description:
      'Paste any mixed-format text. SmartDevBox finds and extracts every embedded JSON, XML, HTML, date, URL, and email — with position metadata.',
    url: 'https://smartdevbox.com/features/smart-extract',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Extract — Pull JSON, XML, Dates, URLs & Emails from Mixed Text',
    description:
      'Paste any mixed-format text. SmartDevBox extracts every embedded JSON, XML, date, URL, and email with exact line and column metadata.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What if the JSON in my text is invalid?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Only spans that pass JSON.parse() validation are returned as JSON sections. Invalid JSON fragments are silently skipped.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I extract multiple sections at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The current picker allows selecting one section at a time to send to the output. To process multiple sections, extract them one at a time using the Use as Input flow for each.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Smart Extract handle dates that look like version numbers (e.g. 1.2.3)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The date patterns require day, month, and year components in plausible ranges. A version string like 1.2.3 does not match because the year component is not a 2- or 4-digit value.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Smart Extract work on very large inputs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The extractor runs synchronously in the browser on every input change, with a short debounce. For very large files (hundreds of KB), detection may take a noticeable fraction of a second. There is no hard size limit.',
      },
    },
  ],
};

const SECTION_TYPES = [
  {
    lang: 'JSON',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
    what: 'JSON objects & arrays',
    how: 'Balanced brace/bracket matching with string-aware parsing. Only spans that pass JSON.parse() are kept — no false positives from partial structures.',
    examples: ['Embedded API payloads in log lines', 'Config blobs inside plaintext reports', 'Serialised objects in CSV fields'],
  },
  {
    lang: 'XML',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.1)',
    border: 'rgba(96,165,250,0.3)',
    what: 'XML elements',
    how: 'Tag-balanced extraction that recurses through nested children. Self-closing and void elements are skipped; only complete open/close pairs are returned.',
    examples: ['SOAP envelopes inside mixed responses', 'XML config blocks in log output', 'Data fragments in templated text'],
  },
  {
    lang: 'HTML',
    color: '#f87171',
    bg: 'rgba(248,113,113,0.1)',
    border: 'rgba(248,113,113,0.3)',
    what: 'HTML blocks',
    how: 'Same tag-balancing engine as XML, with a recognised set of HTML element names (div, p, table, form, section, article, and more). HTML sections are reported separately from XML.',
    examples: ['Rendered HTML snippets in API responses', 'Email body HTML in raw message dumps', 'Template fragments in mixed documents'],
  },
  {
    lang: 'DATE',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.3)',
    what: 'Dates & timestamps',
    how: 'Multiple regex patterns covering ISO 8601 (with optional time and timezone), named-month formats (Jan 1, 2024), slash/dash/dot-separated numeric dates, and Unix millisecond timestamps (13-digit).',
    examples: ['Created-at / updated-at fields in logs', 'Report dates in plaintext exports', 'Timestamps scattered across mixed output'],
  },
  {
    lang: 'URL',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.1)',
    border: 'rgba(52,211,153,0.3)',
    what: 'URLs',
    how: 'Matches absolute http:// and https:// URIs, stopping at whitespace or common delimiters. Captures full paths, query strings, and fragments.',
    examples: ['API endpoints buried in log lines', 'Links embedded in plaintext responses', 'Redirect chains in request traces'],
  },
  {
    lang: 'EMAIL',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.1)',
    border: 'rgba(251,146,60,0.3)',
    what: 'Email addresses',
    how: 'RFC 5321-style pattern: local part (letters, digits, dots, hyphens, plus signs) + @ + domain with at least one dot. Handles subdomains and multi-part TLDs.',
    examples: ['Contact addresses in text exports', 'Sender/recipient fields in raw email dumps', 'User emails in serialised records'],
  },
];

export default function SmartExtractPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* ── Article ──────────────────────────────────────────────────────── */}
      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow">
            <span className="feat-eyebrow-dot" />
            Text Tools
          </div>
          <h1 className="feat-h1">Smart Extract</h1>
          <p className="feat-lead">
            Paste any mixed-format text. SmartDevBox scans it and pulls out every
            embedded JSON object, XML element, HTML block, date, URL, and email
            address — each tagged with its exact line, column, and byte offset.
          </p>
        </div>

        <div className="feat-prose">
          <h2 id="what">What Is Smart Extract?</h2>
          <p>
            Real-world text is rarely clean. Log files contain serialised JSON objects
            between plaintext lines. API responses embed XML fragments. Database exports
            mix ISO dates with prose. Emails scatter URLs and addresses through unstructured
            content.
          </p>
          <p>
            Smart Extract is a dedicated panel in SmartDevBox that scans any input — no
            matter how mixed — and identifies every recognisable structured section within
            it. It returns each section with its type, content, and precise position
            metadata (line number, column, character offset range) so you always know
            exactly where it came from.
          </p>

          <h2 id="section-types">What Gets Extracted</h2>
          <p>
            The extractor recognises six section types. Each type gets its own colour
            badge in the results panel:
          </p>

          {SECTION_TYPES.map((t) => (
            <div key={t.lang} style={{
              margin: '1.25rem 0',
              borderRadius: 8,
              border: `1px solid ${t.border}`,
              background: t.bg,
              overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderBottom: `1px solid ${t.border}`,
              }}>
                <span style={{
                  fontFamily: 'var(--font)',
                  fontSize: 'var(--fs-2xs)',
                  fontWeight: 700,
                  color: t.color,
                  background: t.bg,
                  border: `1px solid ${t.border}`,
                  borderRadius: 4,
                  padding: '2px 8px',
                  letterSpacing: '0.05em',
                }}>
                  {t.lang}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 'var(--fs-sm)' }}>{t.what}</span>
              </div>
              <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--text2)', lineHeight: 1.65 }}>
                  {t.how}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.25rem' }}>
                  {t.examples.map(ex => (
                    <span key={ex} style={{
                      fontSize: 'var(--fs-2xs)',
                      color: 'var(--text3)',
                      background: 'var(--bg2)',
                      border: '1px solid var(--border)',
                      borderRadius: 4,
                      padding: '2px 8px',
                    }}>
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <h2 id="position-metadata">Position Metadata</h2>
          <p>
            Every extracted section carries precise location information, not just its
            content:
          </p>
          <ul>
            <li><strong>Line & column</strong> — 1-based position of the section&apos;s first character in the original input</li>
            <li><strong>Character offset range</strong> — byte-accurate <code>start</code> and <code>end</code> indices into the source string</li>
            <li><strong>Size</strong> — character count and kilobyte equivalent displayed in the section card</li>
          </ul>
          <p>
            This metadata is especially useful when the source is a large log file or API
            trace — you can tell at a glance which line a JSON payload appeared on, and
            jump to it in your editor.
          </p>

          <h2 id="de-nesting">Smart De-nesting</h2>
          <p>
            Structured data is often nested — a JSON object may contain an XML string,
            or an HTML block may embed a JSON <code>data-</code> attribute. The extractor
            applies a <strong>outermost-wins</strong> rule per type: when one span of the
            same type fully contains another, only the outer span is returned. This
            prevents the results from being flooded with every intermediate object or
            element inside a larger structure.
          </p>

          <h2 id="how-to-use">How to Use It</h2>
          <ol className="feat-steps">
            {[
              <><Link href="/">Open SmartDevBox</Link> and paste your mixed-format text into the input area.</>,
              <>SmartDevBox will suggest <strong>Extract Sections</strong> automatically if it detects mixed structured content. Or select it manually from the <strong>Text</strong> category in the sidebar.</>,
              <>The detection bar shows a summary — e.g. <strong>3 JSON · 2 DATE · 1 URL</strong> — before you commit to extracting.</>,
              <>Click <strong>Extract →</strong> to open the section picker popup.</>,
              <>Filter by type (JSON / XML / HTML / DATE / URL / EMAIL), search by content, expand previews, then select the section you want.</>,
              <>Click <strong>Extract</strong> to send the selected section to the output panel, ready to copy or pipe into another tool.</>,
            ].map((step, i) => (
              <li key={i} className="feat-step">
                <span className="feat-step-num">{i + 1}</span>
                <span className="feat-step-text">{step}</span>
              </li>
            ))}
          </ol>

          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </span>
            <p>
              The extracted content is sent directly to the output panel. From there you
              can use <strong>Use as Input</strong> to pipe it straight into another tool —
              for example extract a JSON section, then immediately format it with the{' '}
              <Link href="/">JSON Formatter</Link>.
            </p>
          </div>

          <h2 id="use-cases">Use Cases</h2>
          <ul>
            <li>Pull a JSON payload out of a multi-line server log for formatting or inspection</li>
            <li>Extract XML response bodies embedded in SOAP trace output</li>
            <li>Harvest all dates from a report to audit timestamps</li>
            <li>Collect every URL from a raw HTTP response dump</li>
            <li>Extract email addresses from a batch of exported records</li>
            <li>Isolate an HTML fragment from a mixed API response for preview or conversion</li>
            <li>Grab a nested JSON config block from a large deployment manifest</li>
          </ul>

          <h2 id="privacy">Privacy</h2>
          <p>
            All extraction runs entirely in the browser using client-side JavaScript.
            Your text never leaves your machine — there is no server processing and no
            data retention. See the{' '}
            <Link href="/features/privacy">Privacy &amp; Security</Link> page for full
            details.
          </p>

          <h2 id="vs-alternatives">Smart Extract vs Manual Regex or grep</h2>
          <p>
            The traditional approach to extracting structured data from mixed text is to write
            a regular expression or use command-line tools like <code>grep</code> or
            <code>jq</code>. Smart Extract eliminates that friction:
          </p>
          <div className="feat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="feat-card">
              <span className="feat-card-label">grep / regex approach</span>
              <span className="feat-card-desc">Write and test a pattern for each format, handle multi-line JSON manually, pipe through jq — requires shell access and regex knowledge.</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">SmartDevBox Smart Extract</span>
              <span className="feat-card-desc">Paste mixed text. JSON, XML, dates, URLs, and emails are extracted automatically with line/column positions — in the browser, no shell required.</span>
            </div>
          </div>
          <p>
            Smart Extract is particularly useful when working with log files, API response
            dumps, or documentation that contains embedded data you need to inspect or reuse.
            The position metadata (line, column, byte offset) makes it easy to locate the
            original span in large files.
          </p>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">What if the JSON in my text is invalid?</h3>
              <p className="feat-faq-a">
                Only spans that pass <code>JSON.parse()</code> validation are returned as
                JSON sections. Invalid JSON fragments are silently skipped. You may still
                see them detected as plain text, but they won&apos;t be tagged as JSON.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Can I extract multiple sections at once?</h3>
              <p className="feat-faq-a">
                The current picker allows selecting one section at a time to send to the
                output. To process multiple sections, extract them one at a time and use
                the <strong>Use as Input</strong> flow for each.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">How does it handle dates that look like version numbers (e.g. 1.2.3)?</h3>
              <p className="feat-faq-a">
                The date patterns require day, month, and year components in plausible
                ranges. A version string like <code>1.2.3</code> does not match because
                the year component is not a 2- or 4-digit value. Some ambiguous strings
                may still be surfaced — use the type filter and preview to confirm before
                extracting.
              </p>
            </div>
            <div className="feat-faq-item">
              <h3 className="feat-faq-q">Does it work on very large inputs?</h3>
              <p className="feat-faq-a">
                The extractor runs synchronously in the browser on every input change,
                with a short debounce. For very large files (hundreds of KB), detection
                may take a noticeable fraction of a second. There is no hard size limit.
              </p>
            </div>
          </div>
        </div>

        <RelatedArticles current="smart-extract" />
      </article>

      {/* ── TOC ──────────────────────────────────────────────────────────── */}
      <aside className="feat-toc" aria-label="On this page">
        <p className="feat-toc-title">On this page</p>
        <ul className="feat-toc-list">
          {[
            ['#what',              'What is it?'],
            ['#section-types',     'Section types'],
            ['#position-metadata', 'Position metadata'],
            ['#de-nesting',        'Smart de-nesting'],
            ['#how-to-use',        'How to use'],
            ['#use-cases',         'Use cases'],
            ['#privacy',           'Privacy'],
            ['#vs-alternatives',   'vs alternatives'],
            ['#faq',               'FAQ'],
          ].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
      </aside>
    </>
  );
}
