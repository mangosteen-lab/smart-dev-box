'use client';

import { useState, useEffect, useRef } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { extractSections, type ExtractedSection, type ExtractedSectionLanguage } from '@/lib/tools/text';

// ── Language meta ────────────────────────────────────────────────────────────

const LANG_META: Record<ExtractedSectionLanguage, { label: string; color: string; bg: string }> = {
  json:   { label: 'JSON',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  xml:    { label: 'XML',    color: '#60a5fa', bg: 'rgba(96,165,250,0.12)'  },
  html:   { label: 'HTML',   color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  date:   { label: 'DATE',   color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  url:    { label: 'URL',    color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  email:  { label: 'EMAIL',  color: '#fb923c', bg: 'rgba(251,146,60,0.12)'  },
};

const ALL_LANGS: ExtractedSectionLanguage[] = ['json', 'xml', 'html', 'date', 'url', 'email'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

function preview(content: string, max = 140) {
  const flat = content.replace(/\s+/g, ' ').trim();
  return flat.length > max ? flat.slice(0, max) + '…' : flat;
}

// ── Badge ─────────────────────────────────────────────────────────────────────

function LangBadge({ lang }: { lang: ExtractedSectionLanguage }) {
  const meta = LANG_META[lang];
  return (
    <span
      className="text-xs font-mono font-bold px-1.5 py-0.5 rounded"
      style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.color}33` }}
    >
      {meta.label}
    </span>
  );
}

// ── Section card (inside popup) ───────────────────────────────────────────────

function SectionCard({
  section, index, selected, onToggle,
}: {
  section: ExtractedSection; index: number; selected: boolean; onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = LANG_META[section.language];
  const charCount = section.end - section.start;

  return (
    <div
      onClick={onToggle}
      style={{
        border: `1px solid ${selected ? meta.color : 'var(--border)'}`,
        background: selected ? meta.bg : 'var(--bg2)',
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      className="flex flex-col gap-2 p-3"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-xs font-mono font-semibold w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={{ background: selected ? meta.color : 'var(--bg3)', color: selected ? '#000' : 'var(--text2)' }}
        >
          {index}
        </span>
        <LangBadge lang={section.language} />
        <span className="text-xs" style={{ color: 'var(--text3)' }}>line {section.line}, col {section.col}</span>
        <span className="text-xs" style={{ color: 'var(--text3)' }}>·</span>
        <span className="text-xs" style={{ color: 'var(--text3)' }}>{charCount.toLocaleString()} chars ({fmtBytes(charCount)})</span>
        <span className="text-xs" style={{ color: 'var(--text3)' }}>·</span>
        <span className="text-xs" style={{ color: 'var(--text3)' }}>offset {section.start}–{section.end}</span>
        <div className="ml-auto flex-shrink-0">
          <div
            style={{
              width: 18, height: 18, borderRadius: 4,
              border: `2px solid ${selected ? meta.color : 'var(--border2)'}`,
              background: selected ? meta.color : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {selected && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>
      </div>

      <div
        className="text-xs font-mono leading-relaxed"
        style={{
          color: 'var(--text2)',
          whiteSpace: expanded ? 'pre-wrap' : 'nowrap',
          overflow: 'hidden',
          textOverflow: expanded ? 'clip' : 'ellipsis',
          maxHeight: expanded ? 240 : undefined,
          overflowY: expanded ? 'auto' : undefined,
          wordBreak: 'break-all',
        }}
      >
        {expanded ? section.content : preview(section.content)}
      </div>

      {section.content.length > 140 && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
          className="text-xs self-start"
          style={{ color: meta.color, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          {expanded ? '▲ collapse' : '▼ expand'}
        </button>
      )}
    </div>
  );
}

// ── Filter bar ────────────────────────────────────────────────────────────────

function FilterBar({
  active, available, onToggle,
}: {
  active: ExtractedSectionLanguage[];
  available: ExtractedSectionLanguage[];
  onToggle: (lang: ExtractedSectionLanguage) => void;
}) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {available.map((lang) => {
        const meta = LANG_META[lang];
        const on = active.includes(lang);
        return (
          <button
            key={lang}
            onClick={() => onToggle(lang)}
            className="text-xs font-mono font-semibold px-2 py-1 rounded transition-colors"
            style={{
              border: `1px solid ${on ? meta.color : 'var(--border)'}`,
              background: on ? meta.bg : 'var(--bg2)',
              color: on ? meta.color : 'var(--text3)',
              cursor: 'pointer',
            }}
          >
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Section picker popup ──────────────────────────────────────────────────────

export function SectionPickerPopup({
  sections,
  onConfirm,
  onClose,
}: {
  sections: ExtractedSection[];
  onConfirm: (picked: ExtractedSection[]) => void;
  onClose: () => void;
}) {
  const available = ALL_LANGS.filter((l) => sections.some((s) => s.language === l));
  const [filterLangs, setFilterLangs] = useState<ExtractedSectionLanguage[]>(available);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { searchRef.current?.focus(); }, []);

  const toggleLang = (lang: ExtractedSectionLanguage) =>
    setFilterLangs((prev) => prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]);

  const filtered = sections.filter((s) => {
    if (!filterLangs.includes(s.language)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return s.content.toLowerCase().includes(q) || s.language.includes(q);
    }
    return true;
  });

  // Only one section allowed at a time
  const toggleSection = (idx: number) =>
    setSelected((prev) => {
      if (prev.has(idx)) return new Set();
      return new Set([idx]);
    });

  const clearAll = () => setSelected(new Set());

  const picked = () => sections.filter((_, i) => selected.has(i));

  const hint = selected.size === 0 ? 'Select a section to extract' : '1 section selected';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="flex flex-col gap-3"
        style={{
          background: 'var(--bg1)',
          border: '1px solid var(--border2)',
          borderRadius: 12,
          width: 'min(680px, 96vw)',
          maxHeight: '82vh',
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <span className="font-semibold text-sm flex-1" style={{ color: 'var(--text)' }}>
            Choose sections to extract
          </span>
          <span className="text-xs" style={{ color: 'var(--text3)' }}>
            {sections.length} found · {selected.size} selected
          </span>
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded"
            style={{ color: 'var(--text3)', border: '1px solid var(--border)', background: 'var(--bg2)', cursor: 'pointer' }}
          >✕</button>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 px-4">
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sections…"
            className="text-sm rounded px-3 py-1.5 outline-none w-full"
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text3)' }}>Type:</span>
            <FilterBar active={filterLangs} available={available} onToggle={toggleLang} />
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearAll}
              className="text-xs px-2 py-1 rounded"
              style={{ color: 'var(--text2)', border: '1px solid var(--border)', background: 'var(--bg2)', cursor: 'pointer' }}
            >Clear</button>
          </div>
        </div>

        {/* Section list */}
        <div className="flex flex-col gap-2 overflow-y-auto px-4 pb-2" style={{ flex: 1 }}>
          {filtered.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: 'var(--text3)' }}>
              No sections match the current filter.
            </p>
          ) : (
            filtered.map((s) => {
              const globalIdx = sections.indexOf(s);
              return (
                <SectionCard
                  key={globalIdx}
                  section={s}
                  index={globalIdx + 1}
                  selected={selected.has(globalIdx)}
                  onToggle={() => toggleSection(globalIdx)}
                />
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--text3)' }}>{hint}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-sm px-4 py-1.5 rounded font-semibold transition-opacity"
              style={{
                background: 'var(--bg2)',
                color: 'var(--text2)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
              }}
            >← Back</button>
            <button
              onClick={() => { const p = picked(); if (p.length > 0) onConfirm(p); }}
              disabled={selected.size === 0}
              className="text-sm px-5 py-1.5 rounded font-semibold transition-opacity"
              style={{
                background: 'var(--primary)',
                color: '#000',
                border: 'none',
                opacity: selected.size === 0 ? 0.4 : 1,
                cursor: selected.size === 0 ? 'default' : 'pointer',
                boxShadow: selected.size > 0 ? '0 0 10px rgba(74,222,128,0.35)' : 'none',
              }}
            >Extract</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export function ExtractorPanel() {
  const { input, setInput, setActiveToolId, addOutput } = useDevboxStore();
  const [localInput, setLocalInput] = useState(input);
  const [sections, setSections] = useState<ExtractedSection[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  // Sync store → local on mount only
  useEffect(() => { setLocalInput(input); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-run extraction whenever input changes
  useEffect(() => {
    setSections(localInput.trim().length >= 2 ? extractSections(localInput) : []);
  }, [localInput]);

  const handleInputChange = (v: string) => {
    setLocalInput(v);
    setInput(v);
  };

  // User confirmed sections — put the extracted content into the output area,
  // keep the input unchanged, then exit the panel so the main view takes over.
  const handleConfirm = (picked: ExtractedSection[]) => {
    if (picked.length === 0) return;
    const joined = picked.map((s) => s.content).join('\n\n');
    addOutput({
      toolId: 'extract-sections',
      toolName: 'Extract Sections',
      result: { output: joined },
      timestamp: Date.now(),
    });
    setActiveToolId(null);
    setShowPopup(false);
  };

  // Summary pills
  const summary = ALL_LANGS
    .map((lang) => ({ lang, count: sections.filter((s) => s.language === lang).length }))
    .filter((x) => x.count > 0);

  return (
    <div className="flex flex-col gap-3 animate-fade-in" style={{ height: 'calc(100vh - 140px)' }}>

      {/* Detection bar + extract button */}
      <div className="flex items-center gap-3 flex-wrap">
        {summary.length > 0 ? (
          <div className="flex gap-1.5 flex-wrap flex-1">
            {summary.map(({ lang, count }) => {
              const meta = LANG_META[lang];
              return (
                <span
                  key={lang}
                  className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}44` }}
                >
                  {count} {meta.label}
                </span>
              );
            })}
            <span className="text-xs self-center" style={{ color: 'var(--text3)' }}>
              — {sections.length} section{sections.length !== 1 ? 's' : ''} detected
            </span>
          </div>
        ) : (
          <span className="text-xs flex-1" style={{ color: 'var(--text4)' }}>
            {localInput.trim().length > 1 ? 'No recognisable sections found.' : 'Waiting for input…'}
          </span>
        )}
        <button
          onClick={() => setShowPopup(true)}
          disabled={sections.length === 0}
          className="text-sm px-4 py-1.5 rounded font-medium transition-opacity"
          style={{
            background: sections.length > 0 ? 'var(--primary)' : 'var(--bg3)',
            color: sections.length > 0 ? '#000' : 'var(--text4)',
            border: 'none',
            cursor: sections.length > 0 ? 'pointer' : 'default',
            opacity: sections.length === 0 ? 0.5 : 1,
          }}
        >Extract →</button>
      </div>

      {/* Input textarea */}
      <div className="flex flex-col flex-1 overflow-hidden rounded-lg" style={{ border: '1px solid var(--border)' }}>
        <div
          className="flex items-center gap-3 px-3 py-2 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg1)' }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text3)' }}>
            Input text
          </span>
          <span className="text-xs" style={{ color: 'var(--text4)' }}>{localInput.length.toLocaleString()} chars</span>
        </div>
        <textarea
          value={localInput}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Paste any text containing JSON, XML, HTML, dates, URLs, emails or numbers…"
          className="code-input flex-1 w-full resize-none outline-none p-3 text-sm leading-relaxed"
          style={{ background: 'var(--bg1)', color: 'var(--text)', fontFamily: 'var(--font-mono, monospace)' }}
          spellCheck={false}
        />
      </div>

      {/* Popup */}
      {showPopup && (
        <SectionPickerPopup
          sections={sections}
          onConfirm={handleConfirm}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
