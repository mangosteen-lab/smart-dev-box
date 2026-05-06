import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is XML? Syntax, Structure & How It Differs from JSON',
  description:
    'XML (Extensible Markup Language) is a text format for representing hierarchical data using tags, attributes, and nested elements. Learn its syntax, rules, and when to use XML over JSON.',
  keywords: [
    'what is xml',
    'xml explained',
    'xml syntax rules',
    'xml vs json',
    'xml elements and attributes',
    'xml namespace',
    'format xml online',
    'xml definition',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-xml' },
  openGraph: {
    type: 'article', siteName: 'SmartDevBox',
    title: 'What Is XML? Syntax, Structure & How It Differs from JSON',
    description: 'XML is a tag-based hierarchical data format. Learn its syntax rules, when to use it, and how it compares to JSON.',
    url: 'https://smartdevbox.com/glossary/what-is-xml',
  },
  twitter: { card: 'summary_large_image', title: 'What Is XML? Syntax, Structure & How It Differs from JSON', description: 'XML is a tag-based hierarchical data format. Learn syntax, rules, and XML vs JSON.' },
};

const articleJsonLd = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'What Is XML? Syntax, Structure & How It Differs from JSON',
  description: 'XML (Extensible Markup Language) is a text format for representing hierarchical data.',
  url: 'https://smartdevbox.com/glossary/what-is-xml',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
};

const faqJsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is XML?', acceptedAnswer: { '@type': 'Answer', text: 'XML (Extensible Markup Language) is a text-based format for storing and transporting hierarchical, structured data. Unlike HTML (which has a fixed set of tags), XML lets you define your own tag names. It is defined by the W3C and forms the basis of many web technologies including SVG, XHTML, RSS, Atom, SOAP, and many configuration file formats.' } },
    { '@type': 'Question', name: 'What is the difference between XML and JSON?', acceptedAnswer: { '@type': 'Answer', text: 'JSON is more compact and maps naturally to objects and arrays in code. XML supports attributes (key-value pairs inside a tag), namespaces (for combining vocabularies), comments, mixed content (text alongside child elements), and document-type declarations. JSON is preferred for REST APIs; XML for SOAP services, document formats (Office, SVG, DocBook), and configuration files (Maven pom.xml, Spring beans).' } },
    { '@type': 'Question', name: 'What is an XML namespace?', acceptedAnswer: { '@type': 'Answer', text: 'An XML namespace is a URI that uniquely identifies a set of element and attribute names, preventing naming conflicts when combining XML from different vocabularies. Namespaces are declared with the xmlns attribute: xmlns:xsd="http://www.w3.org/2001/XMLSchema". The prefix (xsd:) is then used to qualify element names.' } },
    { '@type': 'Question', name: 'How do I format or validate XML online?', acceptedAnswer: { '@type': 'Answer', text: 'Paste your XML into SmartDevBox. It auto-detects XML and pretty-prints it with correct indentation. If the XML is not well-formed (unclosed tags, invalid characters), an error is reported. All processing is client-side.' } },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-xml' },
    { '@type': 'ListItem', position: 3, name: 'What Is XML?', item: 'https://smartdevbox.com/glossary/what-is-xml' },
  ],
};

export default function WhatIsXmlPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow"><span className="feat-eyebrow-dot" />Glossary</div>
          <h1 className="feat-h1">What Is XML?</h1>
          <p className="feat-lead">
            XML (Extensible Markup Language) is a text format for representing hierarchical,
            structured data using tags you define yourself. Unlike HTML, XML has no
            predefined tags — you create a vocabulary suited to your data. It underlies SVG,
            RSS, SOAP, XHTML, and countless enterprise configuration formats.
          </p>
        </div>

        <div className="feat-prose">
          <h2 id="definition">The One-Line Definition</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            <p><strong>XML</strong> is a W3C-defined text format that uses opening and closing tags to represent hierarchical data. It is both human-readable and machine-parseable, and supports attributes, namespaces, comments, and a schema system (XSD).</p>
          </div>

          <h2 id="syntax">XML Syntax Rules</h2>
          <pre style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1rem 1.25rem', fontSize: 'var(--fs-sm)', overflowX: 'auto', lineHeight: '1.7', color: 'var(--text)' }}>{`<?xml version="1.0" encoding="UTF-8"?>
<users>
  <user id="42" active="true">
    <name>Ada Lovelace</name>
    <email>ada@example.com</email>
    <roles>
      <role>admin</role>
      <role>editor</role>
    </roles>
  </user>
</users>`}</pre>
          <div className="feat-grid">
            {[
              { label: 'Declaration', desc: '<?xml version="1.0" encoding="UTF-8"?> — optional prolog declaring the XML version and character encoding.' },
              { label: 'Elements', desc: 'Tags like <name>Ada</name>. Every opening tag must have a matching closing tag (or use self-closing <tag/>).' },
              { label: 'Attributes', desc: 'Key-value pairs inside opening tags: id="42". Values must be quoted (single or double).' },
              { label: 'Root element', desc: 'Every XML document must have exactly one root element containing all others.' },
              { label: 'Comments', desc: '<!-- comment --> — XML supports comments; parsers ignore them.' },
              { label: 'Character escaping', desc: '& → &amp;, < → &lt;, > → &gt;, " → &quot; inside attributes.' },
            ].map(c => (
              <div key={c.label} className="feat-card">
                <span className="feat-card-label">{c.label}</span>
                <span className="feat-card-desc">{c.desc}</span>
              </div>
            ))}
          </div>

          <h2 id="xml-vs-json">XML vs JSON</h2>
          <div className="feat-grid">
            <div className="feat-card">
              <span className="feat-card-label">XML — expressive</span>
              <span className="feat-card-desc">Supports attributes, namespaces, comments, mixed content, document-type declarations, and XSD schemas. Used in SOAP, SVG, XHTML, Maven, Spring, Office formats.</span>
            </div>
            <div className="feat-card">
              <span className="feat-card-label">JSON — compact</span>
              <span className="feat-card-desc">Smaller payload for equivalent data. Maps directly to language types. No attributes or namespaces. Used in REST APIs, NoSQL databases, configuration (package.json).</span>
            </div>
          </div>

          <h2 id="where-used">Where XML Is Used Today</h2>
          <div className="feat-grid">
            {[
              { label: 'SOAP web services', desc: 'Enterprise APIs built on WS-* standards use XML-based SOAP envelopes for request/response messages.' },
              { label: 'SVG', desc: 'Scalable Vector Graphics is an XML vocabulary for 2D vector graphics, embedded in HTML or used as standalone files.' },
              { label: 'Maven / Gradle (pom.xml)', desc: 'Java build tools use XML to define project structure, dependencies, and plugins.' },
              { label: 'Android layouts', desc: 'Android UI layouts and manifests are defined in XML files.' },
              { label: 'RSS / Atom feeds', desc: 'Web syndication formats for blog posts and news are XML vocabularies.' },
              { label: 'Office formats (OOXML)', desc: 'Microsoft Office .docx, .xlsx, .pptx files are ZIP archives containing XML documents.' },
            ].map(c => (
              <div key={c.label} className="feat-card">
                <span className="feat-card-label">{c.label}</span>
                <span className="feat-card-desc">{c.desc}</span>
              </div>
            ))}
          </div>

          <h2 id="try-it">Format or Convert XML Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </span>
            <p>
              Paste any XML into SmartDevBox and it is formatted instantly.{' '}
              <Link href="/tools/xml-formatter"><strong>XML Formatter →</strong></Link>{' '}·{' '}
              <Link href="/tools/xml-to-json"><strong>XML to JSON →</strong></Link>
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'What is the difference between XML and JSON?', a: 'JSON is more compact and maps to language types. XML supports attributes, namespaces, comments, and mixed content — making it more expressive but more verbose. JSON dominates REST APIs; XML is common in SOAP, SVG, and config files.' },
              { q: 'What is an XML namespace?', a: 'A URI that uniquely identifies a vocabulary of element names, preventing conflicts when combining XML from different sources. Declared with xmlns:prefix="uri".' },
              { q: 'How do I format XML online?', a: 'Paste your XML into SmartDevBox. It auto-detects XML and pretty-prints it. Invalid XML triggers an error report.' },
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
              { href: '/tools/xml-formatter', label: 'XML Formatter', desc: 'Auto-detects and pretty-prints XML. Reports well-formedness errors.' },
              { href: '/tools/xml-to-json', label: 'XML to JSON', desc: 'Convert XML to JSON with one paste.' },
              { href: '/glossary/what-is-json', label: 'What Is JSON?', desc: 'The alternative to XML for most REST APIs.' },
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
          {[['#definition','Definition'],['#syntax','Syntax rules'],['#xml-vs-json','XML vs JSON'],['#where-used','Where it\'s used'],['#try-it','Try it now'],['#faq','FAQ'],['#related','Related']].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/xml-formatter">XML Formatter</Link></li>
        </ul>
      </aside>
    </>
  );
}
