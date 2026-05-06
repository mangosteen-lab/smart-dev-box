import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is SQL? Queries, DDL/DML/DCL, and Online Formatter',
  description:
    'SQL (Structured Query Language) is the standard language for querying and managing relational databases. Learn DDL, DML, DCL commands, query anatomy, and format SQL instantly in the browser.',
  keywords: [
    'what is sql',
    'sql explained',
    'sql ddl dml dcl',
    'sql query structure',
    'sql select join where',
    'format sql online',
    'sql formatter',
    'relational database language',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-sql' },
  openGraph: {
    type: 'article', siteName: 'SmartDevBox',
    title: 'What Is SQL? Queries, DDL/DML/DCL, and Online Formatter',
    description: 'SQL is the standard language for relational databases. Learn DDL, DML, DCL commands and format SQL online for free.',
    url: 'https://smartdevbox.com/glossary/what-is-sql',
  },
  twitter: { card: 'summary_large_image', title: 'What Is SQL? Queries, DDL/DML/DCL, and Online Formatter', description: 'Learn SQL DDL, DML, DCL commands and format SQL online for free.' },
};

const articleJsonLd = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'What Is SQL? Queries, DDL/DML/DCL, and Online Formatter',
  description: 'SQL is the standard language for querying and managing relational databases.',
  url: 'https://smartdevbox.com/glossary/what-is-sql',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
};

const faqJsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is SQL?', acceptedAnswer: { '@type': 'Answer', text: 'SQL (Structured Query Language) is the standard language for interacting with relational databases. It lets you create schema objects (DDL), read and write data (DML), and control access (DCL). SQL is declarative — you describe what data you want, and the database engine decides how to retrieve it.' } },
    { '@type': 'Question', name: 'What is the difference between DDL, DML, and DCL?', acceptedAnswer: { '@type': 'Answer', text: 'DDL (Data Definition Language) defines schema: CREATE, ALTER, DROP. DML (Data Manipulation Language) works with data: SELECT, INSERT, UPDATE, DELETE. DCL (Data Control Language) manages permissions: GRANT, REVOKE. Some sources add TCL (Transaction Control Language) for COMMIT, ROLLBACK, SAVEPOINT.' } },
    { '@type': 'Question', name: 'How do SQL JOINs work?', acceptedAnswer: { '@type': 'Answer', text: 'A JOIN combines rows from two or more tables based on a related column. INNER JOIN returns only matching rows. LEFT JOIN returns all rows from the left table plus matches from the right (NULLs where no match). RIGHT JOIN is the mirror image. FULL OUTER JOIN returns all rows from both tables.' } },
    { '@type': 'Question', name: 'How do I format SQL online?', acceptedAnswer: { '@type': 'Answer', text: 'Paste your SQL into SmartDevBox. The SQL Formatter tool indents clauses, uppercases keywords, and aligns columns — all in the browser without sending your query to a server.' } },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-sql' },
    { '@type': 'ListItem', position: 3, name: 'What Is SQL?', item: 'https://smartdevbox.com/glossary/what-is-sql' },
  ],
};

const COMMAND_GROUPS = [
  { group: 'DDL — Data Definition Language', commands: 'CREATE TABLE, ALTER TABLE, DROP TABLE, CREATE INDEX', purpose: 'Define and modify schema structure.' },
  { group: 'DML — Data Manipulation Language', commands: 'SELECT, INSERT, UPDATE, DELETE, MERGE', purpose: 'Read and write rows.' },
  { group: 'DCL — Data Control Language', commands: 'GRANT, REVOKE', purpose: 'Manage user permissions and access.' },
  { group: 'TCL — Transaction Control Language', commands: 'BEGIN, COMMIT, ROLLBACK, SAVEPOINT', purpose: 'Control multi-statement transactions.' },
];

const JOIN_TYPES = [
  { join: 'INNER JOIN', result: 'Only rows with a match in both tables.' },
  { join: 'LEFT JOIN', result: 'All rows from the left table; NULLs for unmatched right rows.' },
  { join: 'RIGHT JOIN', result: 'All rows from the right table; NULLs for unmatched left rows.' },
  { join: 'FULL OUTER JOIN', result: 'All rows from both tables; NULLs where no match.' },
  { join: 'CROSS JOIN', result: 'Cartesian product — every left row paired with every right row.' },
  { join: 'SELF JOIN', result: 'A table joined to itself, typically to find hierarchical relationships.' },
];

export default function WhatIsSqlPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow"><span className="feat-eyebrow-dot" />Glossary</div>
          <h1 className="feat-h1">What Is SQL?</h1>
          <p className="feat-lead">
            SQL (Structured Query Language) is the standard language for interacting with
            relational databases. Pronounced &quot;sequel&quot; or &quot;S-Q-L&quot;, it is
            declarative — you describe <em>what</em> data you want, and the engine decides
            <em> how</em> to find it. Nearly every application that stores structured data
            uses SQL under the hood.
          </p>
        </div>

        <div className="feat-prose">
          <h2 id="definition">The One-Line Definition</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            <p><strong>SQL</strong> is a domain-specific language standardised by ANSI/ISO for defining, querying, and controlling data in relational database management systems (RDBMS) such as PostgreSQL, MySQL, SQLite, SQL Server, and Oracle.</p>
          </div>

          <h2 id="example">A Basic Query</h2>
          <pre style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem 1.25rem', fontSize: 'var(--fs-sm)', overflowX: 'auto', lineHeight: '1.7', color: 'var(--text)' }}>{`SELECT
  u.id,
  u.name,
  COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 0
ORDER BY order_count DESC
LIMIT 10;`}</pre>

          <h2 id="command-groups">DDL, DML, DCL, TCL</h2>
          <div className="feat-grid">
            {COMMAND_GROUPS.map(g => (
              <div key={g.group} className="feat-card">
                <span className="feat-card-label">{g.group}</span>
                <span className="feat-card-desc"><code style={{ fontSize: 'var(--fs-xs)', background: 'var(--bg2)', padding: '1px 4px', borderRadius: '3px' }}>{g.commands}</code><br />{g.purpose}</span>
              </div>
            ))}
          </div>

          <h2 id="query-anatomy">Query Anatomy</h2>
          <div className="feat-grid">
            {[
              { clause: 'SELECT', role: 'Choose which columns to return. Use * for all columns or list specific ones.' },
              { clause: 'FROM', role: 'Specify the base table (or subquery) to read from.' },
              { clause: 'JOIN … ON', role: 'Combine rows from a second table using a key relationship.' },
              { clause: 'WHERE', role: 'Filter rows before grouping. Cannot reference aggregate functions.' },
              { clause: 'GROUP BY', role: 'Collapse multiple rows into groups for aggregation (COUNT, SUM, AVG…).' },
              { clause: 'HAVING', role: 'Filter groups after aggregation. Can reference aggregate functions.' },
              { clause: 'ORDER BY', role: 'Sort the result set. ASC (default) or DESC.' },
              { clause: 'LIMIT / TOP', role: 'Return only the first N rows. Syntax varies by database.' },
            ].map(({ clause, role }) => (
              <div key={clause} className="feat-card">
                <span className="feat-card-label"><code style={{ fontSize: 'var(--fs-sm)' }}>{clause}</code></span>
                <span className="feat-card-desc">{role}</span>
              </div>
            ))}
          </div>

          <h2 id="joins">JOIN Types</h2>
          <div className="feat-grid">
            {JOIN_TYPES.map(({ join, result }) => (
              <div key={join} className="feat-card">
                <span className="feat-card-label"><code style={{ fontSize: 'var(--fs-sm)' }}>{join}</code></span>
                <span className="feat-card-desc">{result}</span>
              </div>
            ))}
          </div>

          <h2 id="try-it">Format SQL Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </span>
            <p>
              <Link href="/tools/sql-formatter"><strong>SQL Formatter →</strong></Link>{' '}
              — indent clauses, uppercase keywords, align columns. All client-side.
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'What is the difference between DDL, DML, and DCL?', a: 'DDL (CREATE, ALTER, DROP) defines schema. DML (SELECT, INSERT, UPDATE, DELETE) works with data. DCL (GRANT, REVOKE) manages permissions. TCL (COMMIT, ROLLBACK) controls transactions.' },
              { q: 'How do SQL JOINs work?', a: 'A JOIN combines rows from two tables based on a related column. INNER JOIN returns only matches. LEFT JOIN returns all left rows plus matched right rows (NULLs where no match).' },
              { q: 'What is the difference between WHERE and HAVING?', a: 'WHERE filters individual rows before grouping. HAVING filters groups after aggregation and can reference aggregate functions like COUNT() or SUM().' },
              { q: 'How do I format SQL online?', a: 'Paste your query into SmartDevBox SQL Formatter. It indents clauses and uppercases keywords instantly, all in the browser.' },
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
              { href: '/tools/sql-formatter', label: 'SQL Formatter', desc: 'Format and indent SQL queries in the browser.' },
              { href: '/glossary/what-is-json', label: 'What Is JSON?', desc: 'JSON is the common data interchange format used in REST APIs alongside SQL databases.' },
              { href: '/glossary/what-is-csv', label: 'What Is CSV?', desc: 'CSV is a common export format for SQL query results.' },
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
          {[['#definition','Definition'],['#example','Basic query'],['#command-groups','DDL / DML / DCL'],['#query-anatomy','Query anatomy'],['#joins','JOIN types'],['#try-it','Format now'],['#faq','FAQ'],['#related','Related']].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/sql-formatter">SQL Formatter</Link></li>
        </ul>
      </aside>
    </>
  );
}
