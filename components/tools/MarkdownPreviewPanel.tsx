'use client';

import { useState } from 'react';
import { useDevboxStore } from '@/store/devbox';

// Pure-JS Markdown → HTML renderer (no dependencies)
function renderMarkdown(md: string): string {
  const html = md
    // Escape HTML entities first
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Fenced code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre><code class="language-${lang}">${code.trimEnd()}</code></pre>`)
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headings
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Horizontal rule
    .replace(/^---+$/gm, '<hr/>')
    // Blockquote
    .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered list items
    .replace(/^[\*\-] (.+)$/gm, '<li>$1</li>')
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" style="max-width:100%"/>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    // Paragraphs: blank-line-separated non-block content
    .replace(/\n\n([^<\n][^\n]*)\n\n/g, '\n\n<p>$1</p>\n\n')
    // Line breaks
    .replace(/\n/g, '<br/>');

  return html;
}

const PREVIEW_STYLES = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; padding: 16px; color: #e2e8f0; background: #1a1a2e; }
  h1,h2,h3,h4,h5,h6 { margin: 1em 0 0.5em; font-weight: 600; }
  h1 { font-size: 2em; border-bottom: 1px solid #334155; padding-bottom: 0.3em; }
  h2 { font-size: 1.5em; border-bottom: 1px solid #334155; padding-bottom: 0.2em; }
  code { background: #1e293b; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
  pre { background: #1e293b; padding: 12px; border-radius: 8px; overflow: auto; }
  pre code { padding: 0; background: none; }
  blockquote { border-left: 4px solid #3b82f6; margin: 0; padding-left: 12px; color: #94a3b8; }
  ul { padding-left: 1.5em; }
  a { color: #60a5fa; }
  hr { border: none; border-top: 1px solid #334155; }
  img { max-width: 100%; }
`;

export function MarkdownPreviewPanel() {
  const { input, setInput } = useDevboxStore();
  const [view, setView] = useState<'split' | 'preview' | 'source'>('split');

  const html = renderMarkdown(input);
  const srcDoc = `<!DOCTYPE html><html><head><style>${PREVIEW_STYLES}</style></head><body>${html}</body></html>`;

  return (
    <div className="flex flex-col gap-3" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 shrink-0">
        {(['split', 'source', 'preview'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="text-xs px-3 py-1.5 rounded capitalize font-medium"
            style={{
              background: view === v ? 'var(--primary)' : 'var(--surface-2)',
              color: view === v ? 'white' : 'var(--muted)',
              border: '1px solid var(--border)',
            }}
          >
            {v}
          </button>
        ))}
        <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>
          {input.length.toLocaleString()} chars
        </span>
      </div>

      {/* Panels */}
      <div className="flex gap-3 flex-1 overflow-hidden">
        {/* Source editor */}
        {(view === 'split' || view === 'source') && (
          <div className="flex flex-col flex-1 overflow-hidden rounded-lg"
            style={{ border: '1px solid var(--border)' }}>
            <div className="text-xs px-3 py-1.5 border-b font-semibold uppercase tracking-wider"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)', background: 'var(--surface)' }}>
              Markdown
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="code-input flex-1 w-full resize-none text-sm leading-relaxed outline-none p-3"
              style={{
                background: 'var(--surface)',
                color: 'var(--foreground)',
                fontFamily: 'var(--font-mono, monospace)',
              }}
              spellCheck={false}
              placeholder="# Hello World&#10;&#10;Start typing Markdown here..."
            />
          </div>
        )}

        {/* Preview */}
        {(view === 'split' || view === 'preview') && (
          <div className="flex flex-col flex-1 overflow-hidden rounded-lg"
            style={{ border: '1px solid var(--border)' }}>
            <div className="text-xs px-3 py-1.5 border-b font-semibold uppercase tracking-wider"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)', background: 'var(--surface)' }}>
              Preview
            </div>
            <iframe
              srcDoc={srcDoc}
              className="flex-1 w-full border-0"
              sandbox="allow-same-origin"
              title="Markdown Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}
