'use client';

import { useEffect, useState } from 'react';
import { useDevboxStore } from '@/store/devbox';
import type { ToolOutput } from '@/lib/tools/types';

function getExtensionForLanguage(lang?: string): string {
  const map: Record<string, string> = {
    json: 'json', xml: 'xml', sql: 'sql', css: 'css', html: 'html',
    text: 'txt', diff: 'diff',
  };
  return map[lang ?? ''] ?? 'txt';
}

function HighlightedCode({ code, language }: { code: string; language?: string }) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    (async () => {
      try {
        const { codeToHtml } = await import('shiki');
        const result = await codeToHtml(code, {
          lang: language ?? 'text',
          theme: document.documentElement.getAttribute('data-theme') === 'light'
            ? 'github-light'
            : 'github-dark',
        });
        if (!cancelled) setHtml(result);
      } catch {
        setHtml(null);
      }
    })();
    return () => { cancelled = true; };
  }, [code, language]);

  if (html) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className="overflow-auto"
        style={{ fontFamily: 'inherit', fontSize: '14px' }}
      />
    );
  }

  return (
    <pre
      className="whitespace-pre-wrap overflow-auto"
      style={{ color: 'var(--foreground)', fontFamily: 'var(--font-mono, monospace)', fontSize: '14px', lineHeight: 1.65 }}
    >
      {code}
    </pre>
  );
}

function OutputTab({ output }: { output: ToolOutput }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = output.result.output;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDownload = () => {
    const ext = getExtensionForLanguage(output.result.outputLanguage);
    const blob = new Blob([output.result.output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${output.toolId}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden animate-fade-in"
      style={{ border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-md)', background: 'var(--surface)' }}
    >
      {/* Output header bar */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-3"
        style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-2)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: output.result.error ? 'var(--error)' : 'var(--success)' }}
          />
          <span style={{ color: 'var(--foreground)', fontSize: '14px', fontWeight: 600 }}>
            {output.toolName}
          </span>
          {output.result.outputLanguage && (
            <span
              className="px-2.5 py-0.5 rounded-md font-mono"
              style={{
                background: 'var(--surface-3)',
                color: 'var(--muted)',
                border: '1px solid var(--border)',
                fontSize: '11px',
              }}
            >
              {output.result.outputLanguage}
            </span>
          )}
          {output.aiAssisted && (
            <span
              className="px-2.5 py-0.5 rounded-full font-medium"
              style={{
                background: 'rgba(139,92,246,0.12)',
                color: '#a78bfa',
                border: '1px solid rgba(139,92,246,0.25)',
                fontSize: '11px',
              }}
            >
              ✦ AI
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-90"
            style={{
              background: copied ? 'var(--success-muted)' : 'var(--surface-3)',
              color: copied ? 'var(--success)' : 'var(--muted)',
              border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
              fontSize: '13px',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80"
            style={{
              background: 'var(--surface-3)',
              color: 'var(--muted)',
              border: '1px solid var(--border)',
              fontSize: '13px',
            }}
          >
            ↓ Download
          </button>
        </div>
      </div>

      {/* Output content */}
      <div className="overflow-auto px-4 py-4" style={{ maxHeight: '440px', background: 'var(--surface)' }}>
        {output.result.error ? (
          <div
            className="flex items-start gap-2 px-4 py-3 rounded-lg"
            style={{
              background: 'var(--error-muted)',
              color: 'var(--error)',
              border: '1px solid rgba(244,63,94,0.2)',
              fontSize: '14px',
            }}
          >
            <span>✕</span>
            <span>{output.result.error}</span>
          </div>
        ) : (
          <HighlightedCode code={output.result.output} language={output.result.outputLanguage} />
        )}
      </div>
    </div>
  );
}

export function OutputPanel() {
  const { outputs, clearOutputs } = useDevboxStore();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (outputs.length > 0) setActiveTab(outputs.length - 1);
  }, [outputs.length]);

  if (outputs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-xl"
        style={{
          height: '160px',
          background: 'var(--surface)',
          border: '2px dashed var(--border)',
          color: 'var(--muted)',
        }}
      >
        <span style={{ fontSize: '30px', opacity: 0.25 }}>⬡</span>
        <span style={{ fontSize: '14px' }}>Output will appear here</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Tab bar */}
      {outputs.length > 1 && (
        <div
          className="flex items-center gap-1 overflow-x-auto rounded-xl p-1"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {outputs.map((o, i) => (
            <button
              key={`${o.toolId}-${i}`}
              onClick={() => setActiveTab(i)}
              className="px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all"
              style={{
                background: activeTab === i ? 'var(--primary-muted)' : 'transparent',
                color: activeTab === i ? 'var(--primary)' : 'var(--muted)',
                border: activeTab === i ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                fontSize: '13px',
              }}
            >
              {o.toolName}
            </button>
          ))}
          <button
            onClick={clearOutputs}
            className="ml-auto px-3 py-2 rounded-lg transition-all hover:opacity-80"
            style={{ color: 'var(--error)', background: 'var(--error-muted)', fontSize: '13px' }}
          >
            Clear all
          </button>
        </div>
      )}
      <OutputTab output={outputs[activeTab] ?? outputs[outputs.length - 1]} />
    </div>
  );
}
