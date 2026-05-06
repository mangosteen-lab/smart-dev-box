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
        className="text-sm overflow-auto"
        style={{ fontFamily: 'inherit' }}
      />
    );
  }

  return (
    <pre
      className="text-sm whitespace-pre-wrap overflow-auto"
      style={{ color: 'var(--foreground)', fontFamily: 'var(--font-mono, monospace)' }}
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
    <>
      <div className="flex flex-col gap-2">
        {/* Output header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
              {output.toolName}
            </span>
            {output.aiAssisted && (
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}
              >
                AI assisted
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="text-xs px-2 py-1 rounded transition-colors"
              style={{
                background: copied ? 'rgba(34,197,94,0.15)' : 'transparent',
                color: copied ? 'var(--success)' : 'var(--muted)',
                border: '1px solid var(--border)',
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="text-xs px-2 py-1 rounded"
              style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              Download
            </button>
          </div>
        </div>

        {/* Output content */}
        <div
          className="rounded-lg p-3 overflow-auto"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', maxHeight: '400px' }}
        >
          {output.result.error ? (
            <p className="text-sm" style={{ color: 'var(--error)' }}>
              Error: {output.result.error}
            </p>
          ) : (
            <HighlightedCode code={output.result.output} language={output.result.outputLanguage} />
          )}
        </div>
      </div>
    </>
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
        className="flex flex-col items-center justify-center h-40 rounded-lg text-sm"
        style={{ background: 'var(--surface)', border: '1px dashed var(--border)', color: 'var(--muted)' }}
      >
        Output will appear here
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {outputs.length > 1 && (
        <div className="flex items-center gap-1 overflow-x-auto">
          {outputs.map((o, i) => (
            <button
              key={o.toolId}
              onClick={() => setActiveTab(i)}
              className="text-xs px-3 py-1 rounded whitespace-nowrap"
              style={{
                background: activeTab === i ? 'var(--surface-2)' : 'transparent',
                color: activeTab === i ? 'var(--foreground)' : 'var(--muted)',
                border: '1px solid',
                borderColor: activeTab === i ? 'var(--border)' : 'transparent',
              }}
            >
              {o.toolName}
            </button>
          ))}
          <button
            onClick={clearOutputs}
            className="ml-auto text-xs px-2 py-1 rounded"
            style={{ color: 'var(--muted)' }}
          >
            Clear all
          </button>
        </div>
      )}
      <OutputTab output={outputs[activeTab] ?? outputs[outputs.length - 1]} />
    </div>
  );
}
