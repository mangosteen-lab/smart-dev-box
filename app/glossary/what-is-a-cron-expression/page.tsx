import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is a Cron Expression? Syntax, Fields & Examples',
  description:
    'A cron expression is a 5- or 6-field string that schedules recurring tasks in Unix-like systems. Learn each field, special characters, and common schedule patterns — with a free parser.',
  keywords: [
    'what is a cron expression',
    'cron syntax explained',
    'cron schedule format',
    'cron fields',
    'cron examples',
    'parse cron expression online',
    'cron job explained',
    '0 9 * * 1-5 meaning',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-a-cron-expression' },
  openGraph: {
    type: 'article', siteName: 'SmartDevBox',
    title: 'What Is a Cron Expression? Syntax, Fields & Examples',
    description: 'Learn cron syntax — 5 fields, special characters, and common schedule patterns. Parse any cron expression for free.',
    url: 'https://smartdevbox.com/glossary/what-is-a-cron-expression',
  },
  twitter: { card: 'summary_large_image', title: 'What Is a Cron Expression? Syntax, Fields & Examples', description: 'Learn cron syntax — 5 fields, special characters, and common schedule patterns.' },
};

const articleJsonLd = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'What Is a Cron Expression? Syntax, Fields & Examples',
  description: 'A cron expression is a 5- or 6-field string that schedules recurring tasks in Unix-like systems.',
  url: 'https://smartdevbox.com/glossary/what-is-a-cron-expression',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
};

const faqJsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is a cron expression?', acceptedAnswer: { '@type': 'Answer', text: 'A cron expression is a string of 5 (or 6) space-separated fields that defines a recurring schedule for a cron job. The fields represent minute, hour, day of month, month, and day of week (plus optionally seconds). Wildcards (*), ranges (1-5), lists (1,3,5), and step values (*/15) let you express almost any schedule concisely.' } },
    { '@type': 'Question', name: 'What does "0 9 * * 1-5" mean?', acceptedAnswer: { '@type': 'Answer', text: '"0 9 * * 1-5" means: at minute 0, hour 9, every day of the month, every month, Monday through Friday. In plain English: run at 09:00 every weekday.' } },
    { '@type': 'Question', name: 'What is the difference between cron and crontab?', acceptedAnswer: { '@type': 'Answer', text: 'Cron is the daemon (background service) that runs scheduled tasks on Unix-like systems. A crontab (cron table) is the file that lists the schedules and commands for a particular user. You edit your crontab with the "crontab -e" command.' } },
    { '@type': 'Question', name: 'How do I parse a cron expression online?', acceptedAnswer: { '@type': 'Answer', text: 'Paste your cron expression into SmartDevBox. It automatically detects the cron format and explains each field in plain English, then lists the next scheduled run times.' } },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-a-cron-expression' },
    { '@type': 'ListItem', position: 3, name: 'What Is a Cron Expression?', item: 'https://smartdevbox.com/glossary/what-is-a-cron-expression' },
  ],
};

const FIELDS = [
  { pos: '1', name: 'Minute', range: '0–59', notes: '' },
  { pos: '2', name: 'Hour', range: '0–23', notes: '0 = midnight' },
  { pos: '3', name: 'Day of month', range: '1–31', notes: '? in some implementations means "any"' },
  { pos: '4', name: 'Month', range: '1–12', notes: 'Also JAN–DEC' },
  { pos: '5', name: 'Day of week', range: '0–7', notes: '0 and 7 both mean Sunday. Also SUN–SAT' },
];

const SPECIAL_CHARS = [
  { char: '*', meaning: 'Any value', example: '* in hour = every hour' },
  { char: ',', meaning: 'Value list', example: '1,3,5 in day-of-week = Mon, Wed, Fri' },
  { char: '-', meaning: 'Range', example: '9-17 in hour = 9 AM through 5 PM' },
  { char: '/', meaning: 'Step', example: '*/15 in minute = every 15 minutes' },
  { char: '@yearly', meaning: 'Alias', example: 'Equivalent to 0 0 1 1 *' },
  { char: '@monthly', meaning: 'Alias', example: 'Equivalent to 0 0 1 * *' },
  { char: '@weekly', meaning: 'Alias', example: 'Equivalent to 0 0 * * 0' },
  { char: '@daily', meaning: 'Alias', example: 'Equivalent to 0 0 * * *' },
  { char: '@hourly', meaning: 'Alias', example: 'Equivalent to 0 * * * *' },
];

const EXAMPLES = [
  { expr: '0 9 * * 1-5', plain: 'Every weekday at 09:00' },
  { expr: '*/15 * * * *', plain: 'Every 15 minutes' },
  { expr: '0 0 * * *', plain: 'Every day at midnight' },
  { expr: '0 12 1 * *', plain: 'At noon on the 1st of every month' },
  { expr: '30 18 * * 5', plain: 'Every Friday at 18:30' },
  { expr: '0 */6 * * *', plain: 'Every 6 hours (00:00, 06:00, 12:00, 18:00)' },
];

export default function WhatIsCronPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow"><span className="feat-eyebrow-dot" />Glossary</div>
          <h1 className="feat-h1">What Is a Cron Expression?</h1>
          <p className="feat-lead">
            A cron expression is a compact, 5-field string that tells the cron scheduler
            when to run a recurring job. Fields represent minute, hour, day-of-month, month,
            and day-of-week. Mastering a handful of special characters lets you express
            almost any schedule — from &quot;every 15 minutes&quot; to &quot;noon on the first of every month.&quot;
          </p>
        </div>

        <div className="feat-prose">
          <h2 id="definition">The One-Line Definition</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            <p>A <strong>cron expression</strong> is a string of 5 space-separated fields — <code style={{ color: 'var(--green)', fontSize: '0.9em' }}>minute hour day-of-month month day-of-week</code> — that defines when a recurring task should run on a Unix-like system.</p>
          </div>

          <h2 id="fields">The 5 Fields</h2>
          <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border2)' }}>
                  {['Position','Field','Allowed values','Notes'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem 0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FIELDS.map(f => (
                  <tr key={f.pos} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem 0.75rem 0.5rem 0', fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>{f.pos}</td>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text)' }}>{f.name}</td>
                    <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text)', fontSize: '0.85em' }}>{f.range}</td>
                    <td style={{ padding: '0.5rem 0', color: 'var(--text2)' }}>{f.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="special-chars">Special Characters & Aliases</h2>
          <div className="feat-grid">
            {SPECIAL_CHARS.map(c => (
              <div key={c.char} className="feat-card">
                <span className="feat-card-label" style={{ fontFamily: 'var(--font-mono)' }}>{c.char}</span>
                <span className="feat-card-desc"><strong>{c.meaning}.</strong> {c.example}</span>
              </div>
            ))}
          </div>

          <h2 id="examples">Common Schedule Examples</h2>
          <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border2)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 1rem 0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Expression</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0', color: 'var(--text2)', fontWeight: 500 }}>Plain English</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLES.map(e => (
                  <tr key={e.expr} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem 1rem 0.5rem 0', fontFamily: 'var(--font-mono)', color: 'var(--green)', whiteSpace: 'nowrap' }}>{e.expr}</td>
                    <td style={{ padding: '0.5rem 0', color: 'var(--text)' }}>{e.plain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="try-it">Parse a Cron Expression Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </span>
            <p>Paste any cron expression into SmartDevBox and it explains each field in plain English and lists the next run times.{' '}
              <Link href="/tools/cron-parser"><strong>Open the Cron Parser →</strong></Link>
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'What does "0 9 * * 1-5" mean?', a: 'Minute 0, hour 9, every day of month, every month, Monday–Friday. Plain English: run at 09:00 every weekday.' },
              { q: 'What is the difference between cron and crontab?', a: 'Cron is the background scheduler daemon. A crontab is the file listing schedules for a user. Edit yours with "crontab -e".' },
              { q: 'How do I parse a cron expression online?', a: 'Paste it into SmartDevBox. It auto-detects cron format and explains every field, then shows next run times.' },
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
              { href: '/tools/cron-parser', label: 'Cron Parser Tool', desc: 'Auto-detects cron expressions, explains fields, lists next run times.' },
              { href: '/glossary/what-is-a-unix-timestamp', label: 'What Is a Unix Timestamp?', desc: 'Cron run times are expressed as Unix timestamps internally.' },
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
          {[['#definition','Definition'],['#fields','The 5 fields'],['#special-chars','Special characters'],['#examples','Examples'],['#try-it','Parse one now'],['#faq','FAQ'],['#related','Related']].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/cron-parser">Cron Parser</Link></li>
        </ul>
      </aside>
    </>
  );
}
