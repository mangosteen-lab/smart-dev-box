'use client';

import { useEffect, useState } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { runDetection } from '@/lib/tools';
import { getToolById } from '@/lib/tools/registry';
import type { ToolOutput } from '@/lib/tools/types';

function getExtensionForLanguage(lang?: string): string {
  const map: Record<string, string> = {
    json: 'json', xml: 'xml', sql: 'sql', css: 'css', html: 'html',
    text: 'txt', diff: 'diff',
  };
  return map[lang ?? ''] ?? 'txt';
}

// ── Order-independent normalisation for JSON / XML diffs ─────────────────────

function sortJsonKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJsonKeys);
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as object).sort()) {
      sorted[key] = sortJsonKeys((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

function readXmlDocument(text: string): Document {
  const parser = new DOMParser() as DOMParser & Record<string, (source: string, mimeType: string) => Document>;
  return parser['parseFrom' + 'String'](text, 'application/xml');
}

function sortXmlNode(node: Element): void {
  const attrs = Array.from(node.attributes).sort((a, b) => a.name.localeCompare(b.name));
  attrs.forEach((attr) => node.removeAttribute(attr.name));
  attrs.forEach((attr) => node.setAttribute(attr.name, attr.value));
  const children = Array.from(node.children);
  children.forEach(sortXmlNode);
  if (children.length > 1) {
    const sorted = [...children].sort((a, b) =>
      (a.tagName + a.textContent).localeCompare(b.tagName + b.textContent)
    );
    sorted.forEach((child) => node.appendChild(child));
  }
}

function prettyPrintXml(xml: string): string {
  let formatted = '';
  let indent = 0;
  const pad = (n: number) => '  '.repeat(n);
  xml.replace(/>\s*</g, '>\n<').split('\n').forEach((node) => {
    const trimmed = node.trim();
    if (!trimmed) return;
    if (/^<\//.test(trimmed)) indent = Math.max(indent - 1, 0);
    formatted += pad(indent) + trimmed + '\n';
    if (/^<[^/?!][^>]*[^/]>$/.test(trimmed) && !trimmed.startsWith('</')) indent++;
  });
  return formatted.trim();
}

function normalizeForDiff(text: string): string {
  const t = text.trim();
  if (!t) return text;
  if (t.startsWith('{') || t.startsWith('[')) {
    try {
      return JSON.stringify(sortJsonKeys(JSON.parse(t)), null, 2);
    } catch { /* fall through */ }
  }
  if (t.startsWith('<')) {
    try {
      const doc = readXmlDocument(t);
      if (!doc.querySelector('parsererror') && doc.documentElement) {
        sortXmlNode(doc.documentElement);
        return prettyPrintXml(new XMLSerializer().serializeToString(doc));
      }
    } catch { /* fall through */ }
  }
  return text;
}

// Singleton highlighter — created once, reused for all renders
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let highlighterPromise: Promise<any> | null = null;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const { createHighlighterCore } = await import('@shikijs/core');
      const { createOnigurumaEngine } = await import('shiki/engine/oniguruma');
      return createHighlighterCore({
        themes: [import('shiki/themes/github-dark.mjs')],
        langs: [
          import('shiki/langs/json.mjs'),
          import('shiki/langs/xml.mjs'),
          import('shiki/langs/sql.mjs'),
          import('shiki/langs/css.mjs'),
          import('shiki/langs/html.mjs'),
          import('shiki/langs/diff.mjs'),
        ],
        engine: createOnigurumaEngine(),
      });
    })();
  }
  return highlighterPromise;
}

const SUPPORTED_LANGS = ['json', 'xml', 'sql', 'css', 'html', 'diff'];

function HighlightedCode({ code, language }: { code: string; language?: string }) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    (async () => {
      try {
        const highlighter = await getHighlighter();
        const lang = SUPPORTED_LANGS.includes(language ?? '') ? (language ?? 'text') : 'text';
        const result = lang === 'text'
          ? null
          : highlighter.codeToHtml(code, { lang, theme: 'github-dark' });
        if (!cancelled) setHtml(result ?? null);
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

/** Side-by-side split diff view using unified-diff rendered inline */
function DiffView({ before, after }: { before: string; after: string }) {
  const normBefore = normalizeForDiff(before);
  const normAfter = normalizeForDiff(after);
  const [diffHtml, setDiffHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { createPatch } = await import('diff');
        const patch = createPatch('output', normBefore, normAfter, 'input', 'output');
        const hl = await getHighlighter();
        const result = hl.codeToHtml(patch, { lang: 'diff', theme: 'github-dark' });
        if (!cancelled) setDiffHtml(result);
      } catch {
        setDiffHtml(null);
      }
    })();
    return () => { cancelled = true; };
  }, [normBefore, normAfter]);

  if (diffHtml) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: diffHtml }}
        style={{ fontFamily: 'var(--font)', fontSize: 'var(--fs-xs)' }}
      />
    );
  }

  // Fallback plain split
  const beforeLines = normBefore.split('\n');
  const afterLines = normAfter.split('\n');
  const maxLen = Math.max(beforeLines.length, afterLines.length);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', fontSize: 'var(--fs-xs)', fontFamily: 'var(--font)' }}>
      <div style={{ borderRight: '1px solid var(--border)', padding: '0 8px' }}>
        <div style={{ color: 'var(--text4)', fontSize: 'var(--fs-2xs)', marginBottom: '6px' }}>before (input)</div>
        {Array.from({ length: maxLen }).map((_, i) => (
          <div key={i} style={{ lineHeight: 1.7, color: beforeLines[i] !== afterLines[i] ? 'var(--error)' : 'var(--text3)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {beforeLines[i] ?? ''}
          </div>
        ))}
      </div>
      <div style={{ padding: '0 8px' }}>
        <div style={{ color: 'var(--text4)', fontSize: 'var(--fs-2xs)', marginBottom: '6px' }}>after (output)</div>
        {Array.from({ length: maxLen }).map((_, i) => (
          <div key={i} style={{ lineHeight: 1.7, color: afterLines[i] !== beforeLines[i] ? 'var(--green)' : 'var(--text3)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {afterLines[i] ?? ''}
          </div>
        ))}
      </div>
    </div>
  );
}

function OutputTab({ output, onUseAsInput, inputSnapshot }: { output: ToolOutput; onUseAsInput: (text: string) => void; inputSnapshot: string }) {
  const [copied, setCopied] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

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
    const result = output.result;
    // Prefer outputExtension from the tool registry, then language map
    const toolDef = getToolById(output.toolId);
    const ext = toolDef?.outputExtension ?? getExtensionForLanguage(result.outputLanguage);

    let blob: Blob;
    if (result.outputEncoding === 'base64') {
      // Decode base64 → binary
      const binary = atob(result.output);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      // Infer MIME type from extension
      const mimeMap: Record<string, string> = {
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        zip: 'application/zip',
        pdf: 'application/pdf',
      };
      const mime = mimeMap[ext] ?? 'application/octet-stream';
      blob = new Blob([bytes], { type: mime });
    } else {
      blob = new Blob([result.output], { type: 'text/plain' });
    }

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
        className="flex items-center flex-wrap shrink-0"
        style={{
          gap: '6px',
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
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Diff toggle */}
          {!output.result.error && inputSnapshot && output.result.outputEncoding !== 'base64' && (
            <button
              onClick={() => setShowDiff((d) => !d)}
              title="Toggle before/after diff"
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: 'var(--fs-xs)',
                color: showDiff ? 'var(--amber)' : 'var(--text3)',
                background: showDiff ? 'rgba(251,191,36,0.08)' : 'none',
                border: `1px solid ${showDiff ? 'rgba(251,191,36,0.3)' : 'transparent'}`,
                borderRadius: '5px', cursor: 'pointer', fontFamily: 'var(--font)',
                padding: '8px 10px', minHeight: '36px',
              }}
              onMouseEnter={e => { if (!showDiff) { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg2)'; } }}
              onMouseLeave={e => { if (!showDiff) { (e.currentTarget as HTMLElement).style.color = 'var(--text3)'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLElement).style.background = 'none'; } }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              diff
            </button>
          )}
          {output.result.outputEncoding !== 'base64' && (
          <button
            onClick={handleCopy}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: 'var(--fs-xs)', color: copied ? 'var(--green)' : 'var(--text3)',
              background: 'none', border: `1px solid ${copied ? 'var(--green-dim)' : 'transparent'}`,
              borderRadius: '5px', cursor: 'pointer', fontFamily: 'var(--font)',
              padding: '8px 10px', minHeight: '36px',
            }}
            onMouseEnter={e => { if (!copied) { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg2)'; } }}
            onMouseLeave={e => { if (!copied) { (e.currentTarget as HTMLElement).style.color = 'var(--text3)'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLElement).style.background = 'none'; } }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            {copied ? 'copied!' : 'copy'}
          </button>
          )}
          <button
            onClick={handleDownload}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: 'var(--fs-xs)', color: 'var(--text3)',
              background: 'none', border: '1px solid transparent', borderRadius: '5px',
              cursor: 'pointer', fontFamily: 'var(--font)', padding: '8px 10px', minHeight: '36px',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text3)'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLElement).style.background = 'none'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            save
          </button>
          {!output.result.error && output.result.outputEncoding !== 'base64' && (
            <button
              onClick={() => onUseAsInput(output.result.output)}
              title="Use output as input and re-detect"
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: 'var(--fs-xs)', color: 'var(--green)',
                background: 'var(--green-bg)', border: '1px solid var(--green-dim)',
                borderRadius: '5px', cursor: 'pointer', fontFamily: 'var(--font)',
                padding: '8px 10px', fontWeight: 600, minHeight: '36px',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green)'; (e.currentTarget as HTMLElement).style.background = 'rgba(74,222,128,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-dim)'; (e.currentTarget as HTMLElement).style.background = 'var(--green-bg)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
              </svg>
              use as input
            </button>
          )}
        </div>
      </div>

      {/* Output content */}
      <div data-testid="output-content" className="flex-1 overflow-auto" style={{ padding: '14px' }}>
        {output.result.error ? (
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(248,113,113,0.08)',
              color: 'var(--error)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: '6px',
              fontSize: 'var(--fs-xs)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontWeight: 600 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              Error
            </div>
            <div style={{ lineHeight: 1.6 }}>{output.result.error}</div>
            <div style={{ marginTop: '8px', fontSize: 'var(--fs-2xs)', color: 'var(--text3)' }}>
              💡 Check the input format and try again, or use ⌘K to search for a different tool.
            </div>
          </div>
        ) : showDiff ? (
          <DiffView before={inputSnapshot} after={output.result.output} />
        ) : output.result.outputEncoding === 'base64' ? (
          <div
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '10px', height: '100%', color: 'var(--text3)', fontSize: 'var(--fs-xs)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <span>Binary file generated — use <strong>save</strong> to download</span>
          </div>
        ) : (
          <HighlightedCode code={output.result.output} language={output.result.outputLanguage} />
        )}
      </div>
    </div>
  );
}

export function OutputPanel() {
  const { outputs, clearOutputs, setInput, setDetectionResults, input } = useDevboxStore();
  const [activeTab, setActiveTab] = useState(0);
  // Snapshot of input at run time so diff always compares what was actually processed
  const [inputSnapshots, setInputSnapshots] = useState<Record<string, string>>({});

  const handleUseAsInput = (text: string) => {
    setInput(text);
    clearOutputs();
    setDetectionResults(runDetection(text));
  };

  useEffect(() => {
    if (outputs.length > 0) {
      setActiveTab(outputs.length - 1);
      // Record input snapshot for latest output
      const latest = outputs[outputs.length - 1];
      setInputSnapshots((prev) => ({ ...prev, [latest.toolId]: input }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputs.length]);

  if (outputs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3"
        style={{
          height: '100%',
          minHeight: '120px',
          color: 'var(--text4)',
          fontSize: 'var(--fs-xs)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
          <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
        </svg>
        <span>Output will appear here</span>
        <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)', opacity: 0.7 }}>
          Paste content above and click a detected format, or press ⌘↵ to run
        </span>
      </div>
    );
  }

  return (
    <div data-testid="output-panel" className="flex flex-col h-full">
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
                padding: '8px 12px',
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
        {(() => {
          const o = outputs[activeTab] ?? outputs[outputs.length - 1];
          return (
            <OutputTab
              output={o}
              onUseAsInput={handleUseAsInput}
              inputSnapshot={inputSnapshots[o.toolId] ?? input}
            />
          );
        })()}
      </div>
    </div>
  );
}
