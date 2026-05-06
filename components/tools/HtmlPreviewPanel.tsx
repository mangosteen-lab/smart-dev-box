'use client';

import { useDevboxStore } from '@/store/devbox';
import { useState } from 'react';

const PREVIEW_STYLES = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; }
`;

export function HtmlPreviewPanel() {
  const { input, setInput } = useDevboxStore();
  const [view, setView] = useState<'split' | 'source' | 'preview'>('split');

  const srcDoc = `<!DOCTYPE html><html><head><style>${PREVIEW_STYLES}</style></head><body>${input}</body></html>`;

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
              HTML Source
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
              placeholder="<h1>Hello World</h1>&#10;<p>Paste HTML here...</p>"
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
              className="flex-1 w-full border-0 bg-white"
              sandbox="allow-same-origin allow-scripts"
              title="HTML Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}
