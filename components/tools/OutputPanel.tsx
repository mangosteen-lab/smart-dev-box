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
          theme: 'github-dark',
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
        style={{ fontFamily: 'var(--font)', fontSize: 'var(--fs-xs)' }}
      />
    );
  }

  return (
    <pre
      style={{
        color: 'var(--text)',
        fontFamily: 'var(--font)',
        fontSize: 'var(--fs-xs)',
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
      }}
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
    <div className="flex flex-col animate-fade-in" style={{ height: '100%' }}>
      {/* Output sub-header */}
      <div
        className="flex items-center shrink-0"
        style={{
          gap: '8px',
          padding: '5px 10px',
          borderBottom: '1px solid #141414',
        }}
      >
        <div
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: output.result.error ? 'var(--error)' : 'var(--green)',
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: 'var(--text2)' }}>
          {output.toolName}
        </span>
        {output.result.outputLanguage && (
          <span
            style={{
              fontSize: 'var(--fs-2xs)',
              color: 'var(--text3)',
              border: '1px solid var(--border)',
              borderRadius: '3px',
              padding: '1px 6px',
              background: 'var(--bg2)',
            }}
          >
            {output.result.outputLanguage}
          </span>
        )}
        {output.aiAssisted && (
          <span
            style={{
              fontSize: 'var(--fs-2xs)',
              color: 'var(--purple)',
              border: '1px solid rgba(167,139,250,0.25)',
              borderRadius: '3px',
              padding: '1px 6px',
              background: 'rgba(167,139,250,0.08)',
            }}
          >
            ✦ AI
          </span>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button
            onClick={handleCopy}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: 'var(--fs-xs)', color: copied ? 'var(--green)' : 'var(--text3)',
              background: 'none', border: `1px solid ${copied ? 'var(--green-dim)' : 'transparent'}`,
              borderRadius: '5px', cursor: 'pointer', fontFamily: 'var(--font)',
              padding: '4px 10px',
            }}
            onMouseEnter={e => { if (!copied) { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg2)'; } }}
            onMouseLeave={e => { if (!copied) { (e.currentTarget as HTMLElement).style.color = 'var(--text3)'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLElement).style.background = 'none'; } }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            {copied ? 'copied!' : 'copy'}
          </button>
          <button
            onClick={handleDownload}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: 'var(--fs-xs)', color: 'var(--text3)',
              background: 'none', border: '1px solid transparent', borderRadius: '5px',
              cursor: 'pointer', fontFamily: 'var(--font)', padding: '4px 10px',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text3)'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLElement).style.background = 'none'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            save
          </button>
        </div>
      </div>

      {/* Output content */}
      <div className="flex-1 overflow-auto" style={{ padding: '14px' }}>
        {output.result.error ? (
          <div
            style={{
              padding: '8px 12px',
              background: 'rgba(248,113,113,0.08)',
              color: 'var(--error)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: '4px',
              fontSize: 'var(--fs-xs)',
            }}
          >
            ✕ {output.result.error}
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
        className="flex flex-col items-center justify-center gap-2"
        style={{
          height: '100%',
          minHeight: '120px',
          color: 'var(--text4)',
          fontSize: 'var(--fs-xs)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
        </svg>
        <span>output will appear here</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      {outputs.length > 1 && (
        <div
          className="flex items-center shrink-0 overflow-x-auto"
          style={{
            borderBottom: '1px solid var(--border)',
            padding: '0 6px',
            gap: '2px',
          }}
        >
          {outputs.map((o, i) => (
            <button
              key={`${o.toolId}-${i}`}
              onClick={() => setActiveTab(i)}
              style={{
                padding: '5px 12px',
                fontSize: 'var(--fs-xs)',
                color: activeTab === i ? 'var(--green)' : 'var(--text3)',
                background: activeTab === i ? 'var(--green-bg)' : 'transparent',
                borderBottom: activeTab === i ? '1px solid var(--green)' : '1px solid transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font)',
                whiteSpace: 'nowrap',
                transition: 'color .12s',
              }}
            >
              {o.toolName}
            </button>
          ))}
          <button
            onClick={clearOutputs}
            style={{
              marginLeft: 'auto',
              padding: '4px 10px',
              fontSize: 'var(--fs-2xs)',
              color: 'var(--error)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font)',
            }}
          >
            clear all
          </button>
        </div>
      )}
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <OutputTab output={outputs[activeTab] ?? outputs[outputs.length - 1]} />
      </div>
    </div>
  );
}
