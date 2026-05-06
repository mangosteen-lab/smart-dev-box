import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is a Regex (Regular Expression)? Syntax, Examples & Testing',
  description:
    'A regular expression (regex) is a pattern that matches sequences of characters. Learn the syntax — character classes, quantifiers, anchors, groups — with examples and a free tester.',
  keywords: [
    'what is a regex',
    'regular expression explained',
    'regex syntax',
    'regex character classes',
    'regex quantifiers',
    'regex anchors',
    'test regex online',
    'what is a regular expression',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-a-regex' },
  openGraph: {
    type: 'article', siteName: 'SmartDevBox',
    title: 'What Is a Regex (Regular Expression)? Syntax, Examples & Testing',
    description: 'A regex is a pattern for matching text. Learn character classes, quantifiers, anchors, groups — with a free online tester.',
    url: 'https://smartdevbox.com/glossary/what-is-a-regex',
  },
  twitter: { card: 'summary_large_image', title: 'What Is a Regex? Syntax, Examples & Testing', description: 'Learn regex character classes, quantifiers, anchors, and groups with examples.' },
};

const articleJsonLd = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'What Is a Regex (Regular Expression)? Syntax, Examples & Testing',
  description: 'A regular expression is a pattern that matches sequences of characters in text.',
  url: 'https://smartdevbox.com/glossary/what-is-a-regex',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
};

const faqJsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is a regular expression (regex)?', acceptedAnswer: { '@type': 'Answer', text: 'A regular expression (regex or regexp) is a sequence of characters that defines a search pattern. Regex engines scan text for substrings that match the pattern. They are built into virtually every programming language and many command-line tools (grep, sed, awk), and are used for input validation, text search and replace, parsing, and data extraction.' } },
    { '@type': 'Question', name: 'What is the difference between greedy and lazy quantifiers?', acceptedAnswer: { '@type': 'Answer', text: 'A greedy quantifier (e.g. .* or .+) matches as much text as possible while still allowing the overall pattern to match. A lazy (non-greedy) quantifier (.*? or .+?) matches as little text as possible. For example, given the input "<a>foo</a><b>bar</b>", the pattern <.*> (greedy) matches the entire string, while <.*?> (lazy) matches only <a>.' } },
    { '@type': 'Question', name: 'What are regex flags?', acceptedAnswer: { '@type': 'Answer', text: 'Regex flags modify how the pattern matches. Common flags: i (case-insensitive), g (global — find all matches, not just the first), m (multiline — ^ and $ match start/end of each line rather than the whole string), s (dotAll — . matches newline characters too).' } },
    { '@type': 'Question', name: 'How do I test a regex online?', acceptedAnswer: { '@type': 'Answer', text: 'Use the Regex Tester tool on SmartDevBox. Paste your test string in one panel and your pattern in another. Matches are highlighted in real time. The tool supports JavaScript regex syntax with full flag support.' } },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-a-regex' },
    { '@type': 'ListItem', position: 3, name: 'What Is a Regex?', item: 'https://smartdevbox.com/glossary/what-is-a-regex' },
  ],
};

const SYNTAX = [
  { token: '.', meaning: 'Any character (except newline by default)' },
  { token: '\\d', meaning: 'Any digit — equivalent to [0-9]' },
  { token: '\\w', meaning: 'Word character — [a-zA-Z0-9_]' },
  { token: '\\s', meaning: 'Whitespace — space, tab, newline, etc.' },
  { token: '[abc]', meaning: 'Character class — matches a, b, or c' },
  { token: '[^abc]', meaning: 'Negated class — matches anything except a, b, c' },
  { token: '^', meaning: 'Anchor — start of string (or line with m flag)' },
  { token: '$', meaning: 'Anchor — end of string (or line with m flag)' },
  { token: '*', meaning: 'Quantifier — 0 or more (greedy)' },
  { token: '+', meaning: 'Quantifier — 1 or more (greedy)' },
  { token: '?', meaning: 'Quantifier — 0 or 1; also makes * or + lazy when appended' },
  { token: '{n,m}', meaning: 'Quantifier — between n and m occurrences' },
  { token: '(abc)', meaning: 'Capturing group — matches abc and captures the result' },
  { token: '(?:abc)', meaning: 'Non-capturing group — groups without capturing' },
  { token: 'a|b', meaning: 'Alternation — matches a or b' },
];

const EXAMPLES = [
  { pattern: '^\\d{4}-\\d{2}-\\d{2}$', matches: '2024-01-15', desc: 'ISO date (YYYY-MM-DD)' },
  { pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', matches: 'ada@example.com', desc: 'Email address (simplified)' },
  { pattern: 'https?://[^\\s]+', matches: 'https://example.com/path?q=1', desc: 'URL starting with http or https' },
  { pattern: '^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$', matches: '550e8400-e29b-41d4-a716-446655440000', desc: 'UUID v4' },
];

export default function WhatIsRegexPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow"><span className="feat-eyebrow-dot" />Glossary</div>
          <h1 className="feat-h1">What Is a Regex (Regular Expression)?</h1>
          <p className="feat-lead">
            A regular expression (regex) is a compact pattern that describes a set of
            strings. Regex engines scan text to find — and optionally replace — any
            substring that matches the pattern. They are built into every major
            programming language and are indispensable for input validation, log
            parsing, search-and-replace, and data extraction.
          </p>
        </div>

        <div className="feat-prose">
          <h2 id="definition">The One-Line Definition</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            <p>A <strong>regular expression</strong> is a sequence of characters that defines a search pattern. A regex engine tests whether a string (or part of it) matches that pattern.</p>
          </div>

          <h2 id="syntax">Core Syntax Reference</h2>
          <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border2)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Token</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Meaning</th>
                </tr>
              </thead>
              <tbody>
                {SYNTAX.map(s => (
                  <tr key={s.token} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem 1rem 0.5rem 0', fontFamily: 'var(--font-mono)', color: 'var(--green)', whiteSpace: 'nowrap' }}>{s.token}</td>
                    <td style={{ padding: '0.5rem 0', color: 'var(--text)' }}>{s.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="examples">Practical Examples</h2>
          <div className="feat-grid">
            {EXAMPLES.map(e => (
              <div key={e.desc} className="feat-card">
                <span className="feat-card-label">{e.desc}</span>
                <span className="feat-card-desc">
                  Pattern: <code style={{ fontSize: '0.85em', color: 'var(--green)', wordBreak: 'break-all' }}>{e.pattern}</code><br />
                  Matches: <code style={{ fontSize: '0.85em', color: 'var(--green)' }}>{e.matches}</code>
                </span>
              </div>
            ))}
          </div>

          <h2 id="greedy-lazy">Greedy vs Lazy Quantifiers</h2>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">Greedy (<code style={{ fontSize: '0.9em' }}>.*</code>)</span>
              <span className="feat-card-desc">Matches as much as possible. Given <code style={{ fontSize: '0.85em', color: 'var(--green)' }}>&lt;a&gt;foo&lt;/a&gt;&lt;b&gt;bar&lt;/b&gt;</code>, the pattern <code style={{ fontSize: '0.85em', color: 'var(--green)' }}>&lt;.*&gt;</code> matches the whole string.</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">Lazy (<code style={{ fontSize: '0.9em' }}>.*?</code>)</span>
              <span className="feat-card-desc">Matches as little as possible. The pattern <code style={{ fontSize: '0.85em', color: 'var(--green)' }}>&lt;.*?&gt;</code> matches only <code style={{ fontSize: '0.85em', color: 'var(--green)' }}>&lt;a&gt;</code> — stopping at the first <code style={{ fontSize: '0.85em', color: 'var(--green)' }}>&gt;</code>.</span>
            </div>
          </div>

          <h2 id="try-it">Test a Regex Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </span>
            <p>
              Test any regex pattern against your input in real time.{' '}
              <Link href="/tools/regex-tester"><strong>Open the Regex Tester →</strong></Link>
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'What is the difference between greedy and lazy quantifiers?', a: '* and + are greedy — they match as much as possible. *? and +? are lazy — they match as little as possible. Greedy is the default; lazy is safer when parsing HTML or nested structures.' },
              { q: 'What are regex flags?', a: 'Flags modify matching behavior. Common ones: i (case-insensitive), g (global — find all matches), m (multiline — ^ and $ match line start/end), s (dotAll — . matches newlines too).' },
              { q: 'How do I test a regex online?', a: 'Use the Regex Tester on SmartDevBox. Paste your test string and pattern; matches are highlighted in real time with full flag support.' },
            ].map(({ q, a }) => (
              <div key={q} className="feat-faq-item">
                <h3 className="feat-faq-q">{q}</h3>
                <p className="feat-faq-a">{a}</p>
              </div>
            ))}
          </div>

          <h2 id="related">Related Pages</h2>
          <div className="feat-grid">
            {[
              { href: '/tools/regex-tester', label: 'Regex Tester Tool', desc: 'Real-time regex matching with match highlighting and flag support.' },
              { href: '/glossary/what-is-a-uuid', label: 'What Is a UUID?', desc: 'UUIDs are often validated with a regex pattern.' },
            ].map(({ href, label, desc }) => (
              <div key={href} className="feat-card">
                <span className="feat-card-label"><Link href={href} style={{ color: 'inherit' }}>{label} →</Link></span>
                <span className="feat-card-desc">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </article>

      <aside className="feat-toc" aria-label="On this page">
        <p className="feat-toc-title">On this page</p>
        <ul className="feat-toc-list">
          {[['#definition','Definition'],['#syntax','Syntax reference'],['#examples','Examples'],['#greedy-lazy','Greedy vs lazy'],['#try-it','Test one now'],['#faq','FAQ'],['#related','Related']].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/regex-tester">Regex Tester</Link></li>
        </ul>
      </aside>
    </>
  );
}
