import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What Is a Color Code? HEX, RGB, HSL Explained & Converter',
  description:
    'Color codes represent colors in digital systems. Learn the HEX, RGB, HSL, and RGBA formats, how to convert between them, and use the free online color converter in your browser.',
  keywords: [
    'what is a color code',
    'hex color code explained',
    'rgb color model',
    'hsl color',
    'hex vs rgb vs hsl',
    'convert hex to rgb online',
    'color code formats',
    'css color values',
  ],
  alternates: { canonical: 'https://smartdevbox.com/glossary/what-is-a-color-code' },
  openGraph: {
    type: 'article', siteName: 'SmartDevBox',
    title: 'What Is a Color Code? HEX, RGB, HSL Explained & Converter',
    description: 'Learn HEX, RGB, HSL color code formats and convert between them for free in the browser.',
    url: 'https://smartdevbox.com/glossary/what-is-a-color-code',
  },
  twitter: { card: 'summary_large_image', title: 'What Is a Color Code? HEX, RGB, HSL Explained & Converter', description: 'Learn HEX, RGB, HSL color formats and convert between them for free.' },
};

const articleJsonLd = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'What Is a Color Code? HEX, RGB, HSL Explained & Converter',
  description: 'Color codes represent colors in digital systems using HEX, RGB, HSL, and other notations.',
  url: 'https://smartdevbox.com/glossary/what-is-a-color-code',
  author: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
  publisher: { '@type': 'Organization', name: 'SmartDevBox', url: 'https://smartdevbox.com' },
};

const faqJsonLd = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is a color code?', acceptedAnswer: { '@type': 'Answer', text: 'A color code is a notation that represents a color as a value computers can process. Common formats include HEX (#rrggbb), RGB (rgb(r, g, b)), HSL (hsl(h, s%, l%)), and RGBA/HSLA which add an alpha channel for opacity. CSS supports all of these natively.' } },
    { '@type': 'Question', name: 'What is a HEX color code?', acceptedAnswer: { '@type': 'Answer', text: 'A HEX color code is a 6-character (or 3-character shorthand) hexadecimal string prefixed with #. Each pair of characters represents the intensity of red, green, and blue on a 0–255 scale written in base 16. For example, #FF5733 is red=255, green=87, blue=51.' } },
    { '@type': 'Question', name: 'What is the difference between RGB and HSL?', acceptedAnswer: { '@type': 'Answer', text: 'RGB describes a color by its red, green, and blue channel intensities (0–255 each). HSL describes a color by hue (0–360 degrees on the color wheel), saturation (0–100% — how vivid), and lightness (0–100% — how light or dark). HSL is more intuitive for humans: to lighten a color, increase L. To desaturate, decrease S.' } },
    { '@type': 'Question', name: 'How do I convert HEX to RGB?', acceptedAnswer: { '@type': 'Answer', text: 'Split the 6-digit HEX string into three 2-digit pairs and convert each from base 16 to base 10. Example: #1A2B3C → R=0x1A=26, G=0x2B=43, B=0x3C=60 → rgb(26, 43, 60). SmartDevBox converts HEX ↔ RGB ↔ HSL instantly in the browser.' } },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmartDevBox', item: 'https://smartdevbox.com' },
    { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://smartdevbox.com/glossary/what-is-a-color-code' },
    { '@type': 'ListItem', position: 3, name: 'What Is a Color Code?', item: 'https://smartdevbox.com/glossary/what-is-a-color-code' },
  ],
};

const FORMATS = [
  { format: 'HEX', example: '#FF5733', range: '00–FF per channel', notes: 'Most compact. 3-char shorthand (#RGB) for doubles: #ABC = #AABBCC.' },
  { format: 'HEXA', example: '#FF573380', range: '00–FF per channel + alpha', notes: '8-digit HEX adds an alpha channel. Less widely supported than rgba().' },
  { format: 'RGB', example: 'rgb(255, 87, 51)', range: '0–255 per channel', notes: 'Additive model. All channels at 255 = white; all at 0 = black.' },
  { format: 'RGBA', example: 'rgba(255, 87, 51, 0.5)', range: '0–255 + alpha 0–1', notes: 'Alpha 0 = fully transparent; 1 = fully opaque.' },
  { format: 'HSL', example: 'hsl(11, 100%, 60%)', range: 'H:0–360°, S:0–100%, L:0–100%', notes: 'H=hue angle, S=saturation, L=lightness. Intuitive for design adjustments.' },
  { format: 'HSLA', example: 'hsla(11, 100%, 60%, 0.5)', range: 'HSL + alpha 0–1', notes: 'Same as HSL with an alpha channel for transparency.' },
];

const HEX_CONV = [
  { step: '1. Strip the #', detail: 'Remove the leading hash character from the 6-digit string.' },
  { step: '2. Split into pairs', detail: 'Take the first 2 chars as red, next 2 as green, last 2 as blue.' },
  { step: '3. Parse base 16', detail: 'Convert each hex pair to decimal. FF → 255, 00 → 0, 80 → 128.' },
  { step: '4. Compose rgb()', detail: 'Wrap in rgb(R, G, B). Example: #1A2B3C → rgb(26, 43, 60).' },
];

export default function WhatIsAColorCodePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <article className="feat-article">
        <div className="feat-hero">
          <div className="feat-eyebrow"><span className="feat-eyebrow-dot" />Glossary</div>
          <h1 className="feat-h1">What Is a Color Code?</h1>
          <p className="feat-lead">
            A color code is a notation that tells a computer exactly which color to display.
            CSS supports several formats — HEX, RGB, HSL, and their alpha-channel variants
            — each suited to different workflows. Designers often prefer HSL for its
            human-intuitive hue/saturation/lightness model; engineers reach for HEX because
            it is compact and universally recognised.
          </p>
        </div>

        <div className="feat-prose">
          <h2 id="definition">The One-Line Definition</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            <p><strong>A color code</strong> is a standardised notation — HEX, RGB, HSL, or a named keyword — that uniquely identifies a color so browsers, design tools, and image processing libraries all render the same value.</p>
          </div>

          <h2 id="formats">Color Code Formats</h2>
          <div className="feat-grid">
            {FORMATS.map(({ format, example, range, notes }) => (
              <div key={format} className="feat-card">
                <span className="feat-card-label">{format} — <code style={{ fontSize: 'var(--fs-xs)' }}>{example}</code></span>
                <span className="feat-card-desc">Range: {range}<br />{notes}</span>
              </div>
            ))}
          </div>

          <h2 id="hex-to-rgb">How to Convert HEX to RGB</h2>
          <div className="feat-grid">
            {HEX_CONV.map(({ step, detail }) => (
              <div key={step} className="feat-card">
                <span className="feat-card-label">{step}</span>
                <span className="feat-card-desc">{detail}</span>
              </div>
            ))}
          </div>

          <h2 id="hsl-intuition">Why HSL Is Useful</h2>
          <div className="feat-grid">
            {[
              { action: 'Lighten a color', how: 'Increase L (lightness). hsl(200, 80%, 40%) → hsl(200, 80%, 60%).' },
              { action: 'Darken a color', how: 'Decrease L. hsl(200, 80%, 60%) → hsl(200, 80%, 30%).' },
              { action: 'Desaturate (grey out)', how: 'Decrease S. hsl(200, 80%, 50%) → hsl(200, 10%, 50%).' },
              { action: 'Create a complementary color', how: 'Add 180° to H. hsl(30, …) → hsl(210, …).' },
              { action: 'Create a triadic palette', how: 'Add 120° increments: H, H+120, H+240.' },
              { action: 'Add transparency', how: 'Switch to hsla() and set alpha < 1.' },
            ].map(({ action, how }) => (
              <div key={action} className="feat-card">
                <span className="feat-card-label">{action}</span>
                <span className="feat-card-desc">{how}</span>
              </div>
            ))}
          </div>

          <h2 id="try-it">Convert Color Codes Now</h2>
          <div className="feat-callout">
            <span className="feat-callout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </span>
            <p>
              <Link href="/tools/color-converter"><strong>Color Converter →</strong></Link>{' '}
              — convert HEX ↔ RGB ↔ HSL instantly in the browser.
            </p>
          </div>

          <h2 id="faq">Frequently Asked Questions</h2>
          <div className="feat-faq">
            {[
              { q: 'What is a HEX color code?', a: 'A 6-digit hexadecimal string prefixed with #. Each pair represents a color channel (RR, GG, BB) on a 0–255 scale in base 16. #FF5733 = red=255, green=87, blue=51.' },
              { q: 'What is the difference between RGB and HSL?', a: 'RGB specifies red/green/blue channel intensities (0–255). HSL specifies hue (0–360°), saturation (0–100%), and lightness (0–100%). HSL is more intuitive for design: increase L to lighten, decrease S to grey out.' },
              { q: 'What does the A in RGBA and HSLA mean?', a: 'Alpha — the opacity channel. 0 is fully transparent, 1 is fully opaque, 0.5 is 50% transparent.' },
              { q: 'How do I convert HEX to RGB online?', a: 'Paste the HEX value into the SmartDevBox Color Converter. It outputs the RGB and HSL equivalents instantly, all client-side.' },
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
              { href: '/tools/color-converter', label: 'Color Converter', desc: 'Convert HEX, RGB, and HSL color codes in the browser.' },
              { href: '/glossary/what-is-base64-encoding', label: 'What Is Base64?', desc: 'Base64 is used to encode binary image data — including colors — as text.' },
              { href: '/glossary/what-is-json', label: 'What Is JSON?', desc: 'JSON is often used to store theme tokens including color codes in design systems.' },
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
          {[['#definition','Definition'],['#formats','Formats'],['#hex-to-rgb','HEX → RGB'],['#hsl-intuition','Why HSL?'],['#try-it','Convert now'],['#faq','FAQ'],['#related','Related']].map(([href, label]) => (
            <li key={href} className="feat-toc-item"><a href={href}>{label}</a></li>
          ))}
        </ul>
        <p className="feat-toc-title" style={{ marginTop: '1.5rem' }}>Quick links</p>
        <ul className="feat-toc-list">
          <li className="feat-toc-item"><Link href="/">Open SmartDevBox</Link></li>
          <li className="feat-toc-item"><Link href="/tools/color-converter">Color Converter</Link></li>
        </ul>
      </aside>
    </>
  );
}
