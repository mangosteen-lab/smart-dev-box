'use client';

import { useEffect, useRef, useState } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { runDetection, executeTool, getAllTools } from '@/lib/tools';
import { extractSections, type ExtractedSection } from '@/lib/tools/text';

// ── Design tokens ─────────────────────────────────────────────────────────────

const LANG_COLOR: Record<ExtractedSection['language'], { fg: string; bg: string; border: string }> = {
  json: { fg: '#fbbf24', bg: 'rgba(251,191,36,0.07)', border: 'rgba(251,191,36,0.25)' },
  xml:  { fg: '#38bdf8', bg: 'rgba(56,189,248,0.07)',  border: 'rgba(56,189,248,0.25)' },
  sql:  { fg: '#a78bfa', bg: 'rgba(167,139,250,0.07)', border: 'rgba(167,139,250,0.25)' },
};

// ── Syntax-highlighted code block ─────────────────────────────────────────────

function HighlightedCode({ code, language }: { code: string; language: string }) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    (async () => {
      try {
        const { createHighlighterCore } = await import('@shikijs/core');
        const { createOnigurumaEngine } = await import('shiki/engine/oniguruma');
        const hl = await createHighlighterCore({
          themes: [import('shiki/themes/github-dark.mjs')],
          langs: [import('shiki/langs/json.mjs'), import('shiki/langs/xml.mjs'), import('shiki/langs/sql.mjs')],
          engine: createOnigurumaEngine(),
        });
        const result = hl.codeToHtml(code, { lang: language, theme: 'github-dark' });
        if (!cancelled) setHtml(result);
      } catch { setHtml(null); }
    })();
    return () => { cancelled = true; };
  }, [code, language]);

  if (html) return <div dangerouslySetInnerHTML={{ __html: html }} style={{ fontFamily: 'var(--font)', fontSize: 'var(--fs-xs)' }} />;

  return (
    <pre style={{ color: 'var(--text)', fontFamily: 'var(--font)', fontSize: 'var(--fs-xs)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>
      {code}
    </pre>
  );
}

// ── Small ghost / active button helper ───────────────────────────────────────

function Btn({ children, onClick, active, green, disabled, title, style: extraStyle }: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  green?: boolean;
  disabled?: boolean;
  title?: string;
  style?: React.CSSProperties;
}) {
  const isAccent = green || active;
  const base: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '4px',
    fontSize: 'var(--fs-xs)', fontFamily: 'var(--font)',
    padding: '5px 10px', borderRadius: '4px', cursor: disabled ? 'default' : 'pointer',
    border: `1px solid ${isAccent ? 'var(--green-dim)' : 'transparent'}`,
    background: isAccent ? 'var(--green-bg)' : 'none',
    color: isAccent ? 'var(--green)' : 'var(--text3)',
    fontWeight: isAccent ? 600 : 400,
    opacity: disabled ? 0.4 : 1,
    transition: 'background .1s, border-color .1s, color .1s',
    ...extraStyle,
  };
  return (
    <button style={base} onClick={disabled ? undefined : onClick} title={title}
      onMouseEnter={(e) => { if (!disabled) { const el = e.currentTarget as HTMLElement; el.style.borderColor = green || active ? 'var(--green)' : 'var(--border2)'; el.style.background = green || active ? 'rgba(74,222,128,0.12)' : 'var(--bg2)'; el.style.color = green || active ? 'var(--green)' : 'var(--text)'; } }}
      onMouseLeave={(e) => { if (!disabled) { const el = e.currentTarget as HTMLElement; el.style.borderColor = green || active ? 'var(--green-dim)' : 'transparent'; el.style.background = green || active ? 'var(--green-bg)' : 'none'; el.style.color = green || active ? 'var(--green)' : 'var(--text3)'; } }}
    >
      {children}
    </button>
  );
}

// ── Per-section card shown inside the popup ───────────────────────────────────

function PopupSectionCard({
  section,
  selected,
  selectionOrder,
  canSelect,
  onToggle,
}: {
  section: ExtractedSection;
  selected: boolean;
  selectionOrder: number | null;
  canSelect: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const c = LANG_COLOR[section.language];
  const preview = section.content.slice(0, 160);
  const hasMore = section.content.length > 160;

  return (
    <div
      style={{
        border: `1px solid ${selected ? 'var(--green)' : c.border}`,
        borderRadius: '6px',
        background: selected ? 'rgba(74,222,128,0.04)' : 'var(--bg)',
        overflow: 'hidden',
        flexShrink: 0,
        transition: 'border-color .15s, background .15s',
      }}
    >
      {/* Card header: click to select */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 12px',
          background: selected ? 'rgba(74,222,128,0.06)' : c.bg,
          cursor: (canSelect || selected) ? 'pointer' : 'default',
          userSelect: 'none',
          borderBottom: expanded ? `1px solid ${selected ? 'var(--green-dim)' : c.border}` : 'none',
        }}
        onClick={() => { if (canSelect || selected) onToggle(); }}
      >
        {/* Checkbox */}
        <div style={{
          width: '16px', height: '16px', borderRadius: '3px', flexShrink: 0,
          border: `1.5px solid ${selected ? 'var(--green)' : 'var(--border2)'}`,
          background: selected ? 'var(--green)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .12s, border-color .12s',
        }}>
          {selected && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>

        {/* Order badge */}
        {selectionOrder !== null && (
          <span style={{
            fontSize: 'var(--fs-2xs)', fontWeight: 700, color: 'var(--bg)',
            background: 'var(--green)', borderRadius: '3px', padding: '1px 5px',
            minWidth: '18px', textAlign: 'center',
          }}>
            {selectionOrder}
          </span>
        )}

        {/* Language + meta */}
        <span style={{ fontSize: 'var(--fs-2xs)', color: c.fg, fontWeight: 700, border: `1px solid ${c.border}`, borderRadius: '3px', padding: '1px 6px', background: 'var(--bg1)', letterSpacing: '0.05em' }}>
          {section.language.toUpperCase()}
        </span>
        <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text3)' }}>
          #{section.index} &middot; {section.content.length} chars
        </span>

        {/* Expand toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          {!canSelect && !selected && (
            <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)' }}>max reached</span>
          )}
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .15s', cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* Code preview */}
      {expanded && (
        <div style={{ padding: '10px 12px', maxHeight: '200px', overflow: 'auto' }}>
          <HighlightedCode code={section.content} language={section.language} />
        </div>
      )}
      {!expanded && (
        <div style={{ padding: '8px 12px', maxHeight: '80px', overflow: 'hidden', position: 'relative' }}>
          <HighlightedCode code={preview} language={section.language} />
          {hasMore && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30px', background: selected ? 'linear-gradient(transparent, rgba(74,222,128,0.04))' : `linear-gradient(transparent, var(--bg))`, pointerEvents: 'none' }} />
          )}
        </div>
      )}
    </div>
  );
}

// ── Selection popup modal ─────────────────────────────────────────────────────

function SelectionPopup({
  sections,
  maxSelect = 2,
  onConfirm,
  onClose,
}: {
  sections: ExtractedSection[];
  maxSelect?: number;
  onConfirm: (selected: ExtractedSection[]) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<ExtractedSection[]>([]);

  const toggle = (section: ExtractedSection) => {
    setSelected((prev) => {
      const already = prev.find((s) => s.index === section.index);
      if (already) return prev.filter((s) => s.index !== section.index);
      if (prev.length >= maxSelect) return prev;
      return [...prev, section];
    });
  };

  const selectionOrder = (section: ExtractedSection): number | null => {
    const idx = selected.findIndex((s) => s.index === section.index);
    return idx === -1 ? null : idx + 1;
  };

  const canSelect = (section: ExtractedSection) =>
    selected.some((s) => s.index === section.index) || selected.length < maxSelect;

  const hint =
    maxSelect === 1
      ? selected.length === 0
        ? 'Select a section to replace this pane'
        : 'One section selected — confirm to replace pane'
      : selected.length === 0
      ? 'Select 1 section for single view, or 2 for dual view'
      : selected.length === 1
      ? 'Select one more for dual view, or confirm for single view'
      : 'Two sections selected — will open in dual view';

  // Backdrop click to close
  const backdropRef = useRef<HTMLDivElement>(null);
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  // Keyboard: Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const confirmLabel = maxSelect === 1
    ? 'Replace pane'
    : selected.length === 2
    ? 'Open in dual view'
    : 'Open in single view';

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        style={{
          width: 'min(640px, 92vw)',
          maxHeight: '80vh',
          display: 'flex', flexDirection: 'column',
          background: 'var(--bg1)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', flexShrink: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'var(--text2)', letterSpacing: '0.03em' }}>
            {maxSelect === 1 ? 'Replace pane' : 'Choose sections'}
          </span>
          <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)', marginLeft: '2px' }}>
            {sections.length} found
          </span>
          {/* Lang counts */}
          {(['json', 'xml', 'sql'] as const).map((lang) => {
            const count = sections.filter((s) => s.language === lang).length;
            if (!count) return null;
            const c = LANG_COLOR[lang];
            return (
              <span key={lang} style={{ fontSize: 'var(--fs-2xs)', color: c.fg, background: c.bg, border: `1px solid ${c.border}`, borderRadius: '3px', padding: '1px 6px', fontWeight: 600 }}>
                {count} {lang.toUpperCase()}
              </span>
            );
          })}
          <button
            onClick={onClose}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text4)', display: 'flex', alignItems: 'center', padding: '2px' }}
            title="Close (Esc)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Section list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sections.map((section) => (
            <PopupSectionCard
              key={`${section.language}-${section.index}`}
              section={section}
              selected={selected.some((s) => s.index === section.index)}
              selectionOrder={selectionOrder(section)}
              canSelect={canSelect(section)}
              onToggle={() => toggle(section)}
            />
          ))}
        </div>

        {/* Footer: hint + actions */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '12px 18px', background: 'var(--bg2)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)', flex: 1 }}>{hint}</span>

          {/* Clear */}
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', background: 'none', border: '1px solid transparent', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font)', padding: '6px 12px' }}
            >
              clear
            </button>
          )}

          {/* Cancel */}
          <button
            onClick={onClose}
            style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', background: 'none', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font)', padding: '6px 14px' }}
          >
            cancel
          </button>

          {/* Confirm */}
          <button
            onClick={() => { if (selected.length > 0) onConfirm(selected); }}
            disabled={selected.length === 0}
            style={{
              fontSize: 'var(--fs-xs)', fontWeight: 700, fontFamily: 'var(--font)',
              color: selected.length === 0 ? 'var(--text4)' : 'var(--bg)',
              background: selected.length === 0 ? 'var(--bg2)' : 'var(--green)',
              border: `1px solid ${selected.length === 0 ? 'var(--border)' : 'var(--green)'}`,
              borderRadius: '4px', cursor: selected.length === 0 ? 'default' : 'pointer',
              padding: '6px 18px', display: 'flex', alignItems: 'center', gap: '6px',
              opacity: selected.length === 0 ? 0.5 : 1,
              transition: 'background .12s, opacity .12s',
            }}
          >
            {maxSelect === 1 ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                </svg>
                {confirmLabel}
              </>
            ) : selected.length === 2 ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>
                </svg>
                {confirmLabel}
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                </svg>
                {confirmLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Diff views ────────────────────────────────────────────────────────────────

function computeDiff(a: string, b: string): Array<{ type: 'same' | 'removed' | 'added'; line: string }> {
  const linesA = a.split('\n');
  const linesB = b.split('\n');
  // Simple LCS-based diff
  const m = linesA.length;
  const n = linesB.length;
  // Build LCS table (capped to avoid O(m*n) blowup on huge inputs)
  const MAX = 800;
  if (m > MAX || n > MAX) {
    // Fallback: show all removed then all added
    return [
      ...linesA.map((line) => ({ type: 'removed' as const, line })),
      ...linesB.map((line) => ({ type: 'added' as const, line })),
    ];
  }
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (linesA[i] === linesB[j]) dp[i][j] = 1 + dp[i + 1][j + 1];
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const result: Array<{ type: 'same' | 'removed' | 'added'; line: string }> = [];
  let i = 0, j = 0;
  while (i < m && j < n) {
    if (linesA[i] === linesB[j]) { result.push({ type: 'same', line: linesA[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { result.push({ type: 'removed', line: linesA[i] }); i++; }
    else { result.push({ type: 'added', line: linesB[j] }); j++; }
  }
  while (i < m) { result.push({ type: 'removed', line: linesA[i] }); i++; }
  while (j < n) { result.push({ type: 'added', line: linesB[j] }); j++; }
  return result;
}

// Unified (interleaved) diff
function UnifiedDiffView({ diff }: { diff: ReturnType<typeof computeDiff> }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
      {diff.map((entry, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: '0',
            background: entry.type === 'removed' ? 'rgba(248,113,113,0.10)' : entry.type === 'added' ? 'rgba(74,222,128,0.08)' : 'transparent',
            borderLeft: entry.type === 'removed' ? '3px solid rgba(248,113,113,0.6)' : entry.type === 'added' ? '3px solid rgba(74,222,128,0.5)' : '3px solid transparent',
          }}
        >
          <span style={{
            flexShrink: 0, width: '18px', textAlign: 'center',
            fontSize: 'var(--fs-2xs)', fontFamily: 'var(--font)', lineHeight: 1.7, paddingTop: '1px',
            color: entry.type === 'removed' ? '#f87171' : entry.type === 'added' ? '#4ade80' : 'var(--text4)',
            userSelect: 'none',
          }}>
            {entry.type === 'removed' ? '−' : entry.type === 'added' ? '+' : ' '}
          </span>
          <pre style={{
            flex: 1, margin: 0,
            fontFamily: 'var(--font)', fontSize: 'var(--fs-xs)', lineHeight: 1.7,
            whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            color: entry.type === 'removed' ? '#f87171' : entry.type === 'added' ? '#4ade80' : 'var(--text2)',
            padding: '0 12px 0 4px',
          }}>
            {entry.line}
          </pre>
        </div>
      ))}
    </div>
  );
}

// Pair removed/added lines together for side-by-side rendering
function pairDiff(diff: ReturnType<typeof computeDiff>): Array<{ left: { type: 'same' | 'removed' | 'added'; line: string } | null; right: { type: 'same' | 'removed' | 'added'; line: string } | null }> {
  const pairs: Array<{ left: { type: 'same' | 'removed' | 'added'; line: string } | null; right: { type: 'same' | 'removed' | 'added'; line: string } | null }> = [];
  let i = 0;
  while (i < diff.length) {
    const entry = diff[i];
    if (entry.type === 'same') {
      pairs.push({ left: entry, right: entry });
      i++;
    } else if (entry.type === 'removed') {
      // Peek ahead for a matching 'added'
      const next = diff[i + 1];
      if (next && next.type === 'added') {
        pairs.push({ left: entry, right: next });
        i += 2;
      } else {
        pairs.push({ left: entry, right: null });
        i++;
      }
    } else {
      // 'added' without a preceding 'removed'
      pairs.push({ left: null, right: entry });
      i++;
    }
  }
  return pairs;
}

// Side-by-side split diff
function SplitDiffView({ diff }: { diff: ReturnType<typeof computeDiff> }) {
  const pairs = pairDiff(diff);
  const cellStyle = (type: 'same' | 'removed' | 'added' | null): React.CSSProperties => ({
    flex: 1, minWidth: 0,
    background: type === 'removed' ? 'rgba(248,113,113,0.10)' : type === 'added' ? 'rgba(74,222,128,0.08)' : 'transparent',
    borderLeft: type === 'removed' ? '3px solid rgba(248,113,113,0.6)' : type === 'added' ? '3px solid rgba(74,222,128,0.5)' : '3px solid transparent',
    display: 'flex', alignItems: 'flex-start',
  });
  const gutterStyle = (type: 'same' | 'removed' | 'added' | null): React.CSSProperties => ({
    flexShrink: 0, width: '18px', textAlign: 'center',
    fontSize: 'var(--fs-2xs)', fontFamily: 'var(--font)', lineHeight: 1.7, paddingTop: '1px',
    color: type === 'removed' ? '#f87171' : type === 'added' ? '#4ade80' : 'var(--text4)',
    userSelect: 'none',
  });
  const preStyle = (type: 'same' | 'removed' | 'added' | null): React.CSSProperties => ({
    flex: 1, margin: 0,
    fontFamily: 'var(--font)', fontSize: 'var(--fs-xs)', lineHeight: 1.7,
    whiteSpace: 'pre-wrap', wordBreak: 'break-all',
    color: type === 'removed' ? '#f87171' : type === 'added' ? '#4ade80' : 'var(--text2)',
    padding: '0 8px 0 4px',
  });

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
      {/* Column headers */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '4px', paddingBottom: '4px' }}>
        <div style={{ flex: 1, minWidth: 0, paddingLeft: '21px', fontSize: 'var(--fs-2xs)', fontWeight: 600, color: 'var(--text4)', userSelect: 'none' }}>Left</div>
        <div style={{ width: '1px', background: 'var(--border)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0, paddingLeft: '21px', fontSize: 'var(--fs-2xs)', fontWeight: 600, color: 'var(--text4)', userSelect: 'none' }}>Right</div>
      </div>
      {pairs.map((pair, idx) => (
        <div key={idx} style={{ display: 'flex' }}>
          {/* Left cell */}
          <div style={cellStyle(pair.left?.type ?? null)}>
            <span style={gutterStyle(pair.left?.type ?? null)}>
              {pair.left ? (pair.left.type === 'removed' ? '−' : ' ') : ' '}
            </span>
            <pre style={preStyle(pair.left?.type ?? null)}>{pair.left?.line ?? ''}</pre>
          </div>
          {/* Divider */}
          <div style={{ width: '1px', background: 'var(--border)', flexShrink: 0 }} />
          {/* Right cell */}
          <div style={cellStyle(pair.right?.type ?? null)}>
            <span style={gutterStyle(pair.right?.type ?? null)}>
              {pair.right ? (pair.right.type === 'added' ? '+' : ' ') : ' '}
            </span>
            <pre style={preStyle(pair.right?.type ?? null)}>{pair.right?.line ?? ''}</pre>
          </div>
        </div>
      ))}
    </div>
  );
}

function DiffView({ left, right, mode }: { left: string; right: string; mode: 'unified' | 'split' }) {
  const diff = computeDiff(left, right);
  const addedCount = diff.filter((d) => d.type === 'added').length;
  const removedCount = diff.filter((d) => d.type === 'removed').length;

  return (
    <div style={{ flex: 1, minHeight: 0, border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Diff header */}
      <div style={{ padding: '6px 12px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <span style={{ fontSize: 'var(--fs-2xs)', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text4)' }}>DIFF</span>
        {removedCount > 0 && (
          <span style={{ fontSize: 'var(--fs-2xs)', color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '3px', padding: '1px 6px', fontWeight: 600 }}>
            -{removedCount}
          </span>
        )}
        {addedCount > 0 && (
          <span style={{ fontSize: 'var(--fs-2xs)', color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '3px', padding: '1px 6px', fontWeight: 600 }}>
            +{addedCount}
          </span>
        )}
        {addedCount === 0 && removedCount === 0 && (
          <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)' }}>identical</span>
        )}
      </div>
      {/* Diff body */}
      {mode === 'unified' ? <UnifiedDiffView diff={diff} /> : <SplitDiffView diff={diff} />}
    </div>
  );
}

// ── Small action button for the output bar ────────────────────────────────────

function OutputActionBtn({ children, onClick, title, green }: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  green?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        fontSize: 'var(--fs-2xs)', fontFamily: 'var(--font)',
        color: green ? 'var(--green)' : 'var(--text3)',
        background: green ? 'var(--green-bg)' : 'none',
        border: `1px solid ${green ? 'var(--green-dim)' : 'var(--border)'}`,
        borderRadius: '3px', cursor: 'pointer', padding: '3px 8px',
        transition: 'border-color .1s, background .1s, color .1s',
      }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--green-dim)'; el.style.background = 'var(--green-bg)'; el.style.color = 'var(--green)'; }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = green ? 'var(--green-dim)' : 'var(--border)'; el.style.background = green ? 'var(--green-bg)' : 'none'; el.style.color = green ? 'var(--green)' : 'var(--text3)'; }}
    >
      {children}
    </button>
  );
}

// ── Inline editor pane (for single / split result view) ───────────────────────

interface PaneState {
  input: string;
  output: string;
  outputLanguage?: string;
  error?: string;
  detectedTools: Array<{ toolId: string; toolName: string; confidence: number }>;
  activeToolId: string | null;
  isRunning: boolean;
}

function makePaneState(input: string): PaneState {
  const detectedTools = runDetection(input)
    .filter((r) => r.confidence >= 0.1)
    .map((r) => ({ toolId: r.toolId, toolName: r.toolName, confidence: r.confidence }));
  return { input, output: '', outputLanguage: undefined, error: undefined, detectedTools, activeToolId: null, isRunning: false };
}

function ResultPane({ state, label, onChange, onRun, onReselect, onUseAsInput }: {
  state: PaneState;
  label: string;
  onChange: (v: string) => void;
  onRun: (toolId: string) => void;
  onReselect?: () => void;
  onUseAsInput?: (text: string) => void;
}) {
  const significant = state.detectedTools.filter((r) => r.confidence >= 0.3);

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg1)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <span style={{ fontSize: 'var(--fs-2xs)', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text4)' }}>{label.toUpperCase()}</span>
        {state.input.trim() && <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)' }}>{state.input.length.toLocaleString()} chars</span>}
        {onReselect && (
          <button
            onClick={onReselect}
            title="Replace this pane with a different section"
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: 'var(--fs-2xs)', fontFamily: 'var(--font)', color: 'var(--text3)',
              background: 'none', border: '1px solid transparent', borderRadius: '3px',
              cursor: 'pointer', padding: '2px 6px',
              transition: 'border-color .1s, background .1s, color .1s',
            }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border2)'; el.style.background = 'var(--bg)'; el.style.color = 'var(--text)'; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'transparent'; el.style.background = 'none'; el.style.color = 'var(--text3)'; }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
            </svg>
            replace
          </button>
        )}
      </div>

      {/* Textarea */}
      <textarea
        value={state.input}
        onChange={(e) => onChange(e.target.value)}
        style={{ flex: 1, minHeight: '120px', resize: 'none', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: 'var(--fs-xs)', lineHeight: 1.7, padding: '10px 12px', border: 'none', outline: 'none' }}
        spellCheck={false}
      />

      {/* Detection bar */}
      {significant.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '6px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)' }}>format:</span>
          {significant.slice(0, 4).map((r) => (
            <button
              key={r.toolId}
              onClick={() => onRun(r.toolId)}
              disabled={state.isRunning}
              style={{
                fontSize: 'var(--fs-2xs)', fontFamily: 'var(--font)', padding: '2px 8px', borderRadius: '3px', cursor: 'pointer',
                background: state.activeToolId === r.toolId ? 'var(--green-bg)' : 'var(--bg2)',
                color: state.activeToolId === r.toolId ? 'var(--green)' : 'var(--text3)',
                border: `1px solid ${state.activeToolId === r.toolId ? 'var(--green-dim)' : 'var(--border)'}`,
              }}
            >
              {r.toolName} <span style={{ opacity: 0.6 }}>{Math.round(r.confidence * 100)}%</span>
            </button>
          ))}
        </div>
      )}

      {/* Output */}
      {(state.output || state.error) && (
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', flexDirection: 'column', maxHeight: '220px', flexShrink: 0 }}>
          {/* Output header */}
          <div style={{ padding: '5px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)' }}>
              output{state.activeToolId ? ` · ${getAllTools().find((t) => t.id === state.activeToolId)?.name ?? state.activeToolId}` : ''}
            </span>
          </div>
          {/* Scrollable output text */}
          {state.error ? (
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--error)', padding: '8px 12px', margin: 0, overflow: 'auto' }}>✕ {state.error}</p>
          ) : (
            <pre style={{ margin: 0, padding: '8px 12px', fontFamily: 'var(--font)', fontSize: 'var(--fs-xs)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: 'var(--text2)', overflow: 'auto', flex: 1 }}>{state.output}</pre>
          )}
          {/* Action bar — always visible, never scrolls away */}
          {!state.error && (
            <div style={{ borderTop: '1px solid var(--border)', padding: '5px 8px', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              {/* Copy */}
              <OutputActionBtn
                title="Copy output to clipboard"
                onClick={() => { navigator.clipboard?.writeText(state.output).catch(() => {}); }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                copy
              </OutputActionBtn>
              {/* Save */}
              <OutputActionBtn
                title="Save output as file"
                onClick={() => {
                  const blob = new Blob([state.output], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = state.activeToolId ? `${state.activeToolId}-output.txt` : 'output.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                save
              </OutputActionBtn>
              {/* Use as input */}
              {onUseAsInput && (
                <OutputActionBtn
                  title="Replace textarea content with this output"
                  onClick={() => onUseAsInput(state.output)}
                  green
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>
                  </svg>
                  use as input
                </OutputActionBtn>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main ExtractorPanel ───────────────────────────────────────────────────────

// Which pane's popup is open: null = closed, 'both' = initial choose, 'left' | 'right' = per-pane reselect
type PopupTarget = null | 'both' | 'left' | 'right';

export function ExtractorPanel() {
  const { input, setInput, setDetectionResults, clearOutputs } = useDevboxStore();
  const [sections, setSections] = useState<ExtractedSection[]>([]);
  const [popupTarget, setPopupTarget] = useState<PopupTarget>(null);

  // Result view state: null = not confirmed yet, array of 1–2 sections = confirmed
  const [confirmed, setConfirmed] = useState<ExtractedSection[] | null>(null);

  // Pane states for the result view
  const [leftPane, setLeftPane] = useState<PaneState | null>(null);
  const [rightPane, setRightPane] = useState<PaneState | null>(null);

  // Show diff view in split mode
  const [showDiff, setShowDiff] = useState(false);
  const [diffMode, setDiffMode] = useState<'unified' | 'split'>('unified');

  // Recompute sections whenever input changes; also reset confirmed state
  useEffect(() => {
    const next = extractSections(input);
    setSections(next);
    setConfirmed(null);
    setLeftPane(null);
    setRightPane(null);
    setShowDiff(false);
  }, [input]);

  const handleInputChange = (value: string) => {
    setInput(value);
    clearOutputs();
    setDetectionResults(runDetection(value));
  };

  // Called from the popup when user confirms a selection
  const handleConfirm = (selected: ExtractedSection[]) => {
    if (popupTarget === 'left') {
      // Replace left pane only
      setLeftPane(makePaneState(selected[0].content));
      setConfirmed((prev) => prev ? [selected[0], prev[1] ?? prev[0]] : selected);
    } else if (popupTarget === 'right') {
      // Replace right pane only
      setRightPane(makePaneState(selected[0].content));
      setConfirmed((prev) => prev ? [prev[0], selected[0]] : selected);
    } else {
      // Initial / full reselect
      setConfirmed(selected);
      setLeftPane(makePaneState(selected[0].content));
      setRightPane(selected.length === 2 ? makePaneState(selected[1].content) : null);
      setShowDiff(false);
    }
    setPopupTarget(null);
  };

  const handlePaneChange = (side: 'left' | 'right', value: string) => {
    const pane = makePaneState(value);
    if (side === 'left') setLeftPane(pane);
    else setRightPane(pane);
  };

  const handlePaneRun = async (side: 'left' | 'right', toolId: string) => {
    const pane = side === 'left' ? leftPane : rightPane;
    const setter = side === 'left' ? setLeftPane : setRightPane;
    if (!pane) return;
    setter((p) => p ? { ...p, isRunning: true, activeToolId: toolId } : p);
    try {
      const result = await executeTool(toolId, pane.input);
      setter((p) => p ? { ...p, isRunning: false, output: result.output ?? '', outputLanguage: result.outputLanguage, error: result.error } : p);
    } catch (err) {
      setter((p) => p ? { ...p, isRunning: false, error: err instanceof Error ? err.message : 'Unknown error' } : p);
    }
  };

  const isSplit = confirmed !== null && confirmed.length === 2;
  const isSingle = confirmed !== null && confirmed.length === 1;
  const popupMaxSelect = (popupTarget === 'left' || popupTarget === 'right') ? 1 : 2;

  return (
    <>
      {/* Popup overlay */}
      {popupTarget !== null && sections.length > 0 && (
        <SelectionPopup
          sections={sections}
          maxSelect={popupMaxSelect}
          onConfirm={handleConfirm}
          onClose={() => setPopupTarget(null)}
        />
      )}

      <div className="flex gap-3 flex-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* ── Left: raw input editor ─────────────────────────────────────────── */}
        <div style={{ flex: '0 0 300px', minWidth: '200px', maxWidth: '380px', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg1)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span style={{ fontSize: 'var(--fs-2xs)', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text4)' }}>INPUT</span>
            {sections.length > 0 && (
              <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--green)', fontWeight: 600 }}>
                {sections.length} section{sections.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            style={{ flex: 1, resize: 'none', background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font)', fontSize: 'var(--fs-xs)', lineHeight: 1.7, padding: '12px', border: 'none', outline: 'none' }}
            spellCheck={false}
            placeholder="Paste text containing XML, JSON, or SQL here..."
          />

          {/* Choose button */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '8px 10px', background: 'var(--bg2)', flexShrink: 0 }}>
            {sections.length === 0 ? (
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text4)' }}>
                {input.trim() ? 'no sections detected' : 'paste text above'}
              </span>
            ) : (
              <button
                onClick={() => setPopupTarget('both')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  fontSize: 'var(--fs-xs)', fontWeight: 600, fontFamily: 'var(--font)',
                  color: 'var(--green)', background: 'var(--green-bg)', border: '1px solid var(--green-dim)',
                  borderRadius: '5px', cursor: 'pointer', padding: '7px 12px',
                  transition: 'background .12s, border-color .12s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(74,222,128,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--green)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--green-bg)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--green-dim)'; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Choose sections{confirmed ? ' (reselect)' : ''}
              </button>
            )}
          </div>
        </div>

        {/* ── Right: result area ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0', overflow: 'hidden' }}>

          {/* No selection yet */}
          {!confirmed && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--bg1)', overflow: 'hidden' }}>
              <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                <span style={{ fontSize: 'var(--fs-2xs)', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text4)' }}>RESULT</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text4)', fontSize: 'var(--fs-xs)' }}>
                {sections.length === 0 && input.trim() ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    no XML, JSON, or SQL sections detected
                  </>
                ) : sections.length > 0 ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    <span>{sections.length} section{sections.length !== 1 ? 's' : ''} found &mdash; click <strong style={{ color: 'var(--green)' }}>Choose sections</strong> to continue</span>
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
                    </svg>
                    paste mixed text on the left to begin
                  </>
                )}
              </div>
            </div>
          )}

          {/* Single view */}
          {isSingle && leftPane && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '0' }}>
              {/* View header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 10px', marginBottom: '8px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                </svg>
                <span style={{ fontSize: 'var(--fs-2xs)', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--green-dim)' }}>SINGLE VIEW</span>
                <span style={{ fontSize: 'var(--fs-2xs)', color: LANG_COLOR[confirmed![0].language].fg, background: LANG_COLOR[confirmed![0].language].bg, border: `1px solid ${LANG_COLOR[confirmed![0].language].border}`, borderRadius: '3px', padding: '1px 6px', fontWeight: 600 }}>
                  {confirmed![0].language.toUpperCase()}
                </span>
                <Btn onClick={() => setPopupTarget('both')} style={{ marginLeft: 'auto', fontSize: 'var(--fs-2xs)' }}>
                  reselect
                </Btn>
              </div>
              <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <ResultPane
                  state={leftPane}
                  label="Section"
                  onChange={(v) => handlePaneChange('left', v)}
                  onRun={(id) => handlePaneRun('left', id)}
                />
              </div>
            </div>
          )}

          {/* Dual view */}
          {isSplit && leftPane && rightPane && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '0' }}>
              {/* View header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 10px', marginBottom: '8px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px', flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>
                </svg>
                <span style={{ fontSize: 'var(--fs-2xs)', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--green-dim)' }}>DUAL VIEW</span>
                {confirmed!.map((s, i) => (
                  <span key={i} style={{ fontSize: 'var(--fs-2xs)', color: LANG_COLOR[s.language].fg, background: LANG_COLOR[s.language].bg, border: `1px solid ${LANG_COLOR[s.language].border}`, borderRadius: '3px', padding: '1px 6px', fontWeight: 600 }}>
                    {i + 1} · {s.language.toUpperCase()}
                  </span>
                ))}

                {/* Compare / diff toggle */}
                <button
                  onClick={() => setShowDiff((v) => !v)}
                  title={showDiff ? 'Hide diff' : 'Show line-by-line diff between the two panes'}
                  style={{
                    marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: 'var(--fs-2xs)', fontFamily: 'var(--font)', fontWeight: showDiff ? 700 : 400,
                    color: showDiff ? 'var(--green)' : 'var(--text3)',
                    background: showDiff ? 'var(--green-bg)' : 'none',
                    border: `1px solid ${showDiff ? 'var(--green-dim)' : 'transparent'}`,
                    borderRadius: '4px', cursor: 'pointer', padding: '3px 8px',
                    transition: 'background .1s, border-color .1s, color .1s',
                  }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = showDiff ? 'var(--green)' : 'var(--border2)'; el.style.background = showDiff ? 'rgba(74,222,128,0.12)' : 'var(--bg)'; el.style.color = showDiff ? 'var(--green)' : 'var(--text)'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = showDiff ? 'var(--green-dim)' : 'transparent'; el.style.background = showDiff ? 'var(--green-bg)' : 'none'; el.style.color = showDiff ? 'var(--green)' : 'var(--text3)'; }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  {showDiff ? 'hide diff' : 'compare'}
                </button>

                {/* Diff mode toggle — only visible when diff is shown */}
                {showDiff && (
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <button
                      onClick={() => setDiffMode('unified')}
                      title="Unified diff"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: 'var(--fs-2xs)', fontFamily: 'var(--font)', fontWeight: diffMode === 'unified' ? 700 : 400,
                        color: diffMode === 'unified' ? 'var(--green)' : 'var(--text3)',
                        background: diffMode === 'unified' ? 'var(--green-bg)' : 'none',
                        border: 'none', cursor: 'pointer', padding: '3px 7px',
                        transition: 'background .1s, color .1s',
                      }}
                    >
                      {/* Single-column lines icon */}
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
                      </svg>
                      unified
                    </button>
                    <div style={{ width: '1px', background: 'var(--border)', alignSelf: 'stretch' }} />
                    <button
                      onClick={() => setDiffMode('split')}
                      title="Split diff"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        fontSize: 'var(--fs-2xs)', fontFamily: 'var(--font)', fontWeight: diffMode === 'split' ? 700 : 400,
                        color: diffMode === 'split' ? 'var(--green)' : 'var(--text3)',
                        background: diffMode === 'split' ? 'var(--green-bg)' : 'none',
                        border: 'none', cursor: 'pointer', padding: '3px 7px',
                        transition: 'background .1s, color .1s',
                      }}
                    >
                      {/* Two-column icon */}
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>
                      </svg>
                      split
                    </button>
                  </div>
                )}

                <Btn onClick={() => setPopupTarget('both')} style={{ fontSize: 'var(--fs-2xs)' }}>
                  reselect
                </Btn>
              </div>

              {/* Panes row (always visible) */}
              <div style={{ flex: showDiff ? '0 0 auto' : 1, minHeight: showDiff ? '0' : 0, overflow: 'hidden', display: 'flex', gap: '8px', ...(showDiff ? { maxHeight: '45%' } : {}) }}>
                <ResultPane
                  state={leftPane}
                  label="Left"
                  onChange={(v) => handlePaneChange('left', v)}
                  onRun={(id) => handlePaneRun('left', id)}
                  onReselect={() => setPopupTarget('left')}
                  onUseAsInput={(text) => handlePaneChange('left', text)}
                />
                <ResultPane
                  state={rightPane}
                  label="Right"
                  onChange={(v) => handlePaneChange('right', v)}
                  onRun={(id) => handlePaneRun('right', id)}
                  onReselect={() => setPopupTarget('right')}
                  onUseAsInput={(text) => handlePaneChange('right', text)}
                />
              </div>

              {/* Diff panel — shown below panes when compare is active */}
              {showDiff && (
                <div style={{ flex: 1, minHeight: 0, marginTop: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <DiffView left={leftPane.output || leftPane.input} right={rightPane.output || rightPane.input} mode={diffMode} />
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
