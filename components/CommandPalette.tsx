'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { getAllTools, executeTool } from '@/lib/tools';
import type { ToolDefinition } from '@/lib/tools/types';

export function CommandPalette() {
  const {
    input,
    activeToolId,
    addOutput,
    setActiveToolId,
    addRecentTool,
    setMobileSidebarOpen,
    commandPaletteOpen: open,
    setCommandPaletteOpen,
    toggleCommandPalette,
    pinnedToolIds,
    recentToolIds,
    togglePinnedTool,
  } = useDevboxStore();
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Open on ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      if (e.key === 'Escape') setCommandPaletteOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setCommandPaletteOpen, toggleCommandPalette]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlighted(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const allTools = getAllTools();

  const filtered: ToolDefinition[] = query.trim()
    ? allTools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.keywords.some((k) => k.includes(query.toLowerCase()))
      )
    : allTools;

  // Build display list: pinned first (when no query), then recent, then rest
  const displayTools: (ToolDefinition & { _section?: string })[] = query.trim()
    ? filtered
    : (() => {
        const pinned = allTools.filter((t) => pinnedToolIds.includes(t.id));
        const recent = allTools.filter((t) => recentToolIds.includes(t.id) && !pinnedToolIds.includes(t.id));
        const rest = allTools.filter((t) => !pinnedToolIds.includes(t.id) && !recentToolIds.includes(t.id));
        return [
          ...pinned.map((t) => ({ ...t, _section: 'pinned' })),
          ...recent.map((t) => ({ ...t, _section: 'recent' })),
          ...rest.map((t) => ({ ...t, _section: undefined })),
        ];
      })();

  const runTool = useCallback(async (toolId: string) => {
    setActiveToolId(toolId);
    addRecentTool(toolId);
    setMobileSidebarOpen(false);
    setCommandPaletteOpen(false);
    if (input.trim()) {
      const tool = allTools.find((t) => t.id === toolId);
      const result = await executeTool(toolId, input);
      addOutput({ toolId, toolName: tool?.name ?? toolId, result, timestamp: Date.now() });
    }
  }, [input, allTools, setActiveToolId, addRecentTool, setMobileSidebarOpen, setCommandPaletteOpen, addOutput]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted((h) => Math.min(h + 1, displayTools.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)); }
    if (e.key === 'Enter') {
      const t = displayTools[highlighted];
      if (t) runTool(t.id);
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${highlighted}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlighted]);

  if (!open) return null;

  let lastSection: string | undefined = undefined;

  return (
    <div
      data-testid="command-palette"
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '15vh',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(2px)',
      }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) setCommandPaletteOpen(false); }}
    >
      <div
        style={{
          width: '100%', maxWidth: '560px', margin: '0 16px',
          background: 'var(--bg1)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          maxHeight: '60vh',
        }}
      >
        {/* Search input row */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 14px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            data-testid="command-palette-search"
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setHighlighted(0); }}
            onKeyDown={handleKey}
            placeholder="Search tools…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 'var(--fs-sm)',
              color: 'var(--text)',
              fontFamily: 'var(--font)',
            }}
          />
          <kbd
            style={{
              fontSize: 'var(--fs-2xs)', color: 'var(--text4)',
              border: '1px solid var(--border)', borderRadius: '3px',
              padding: '1px 5px', background: 'var(--bg2)',
            }}
          >esc</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ overflowY: 'auto', flex: 1 }}>
          {displayTools.length === 0 && (
            <p style={{ color: 'var(--text4)', fontSize: 'var(--fs-xs)', padding: '20px 16px' }}>No tools found</p>
          )}
          {displayTools.map((tool, idx) => {
            const isFirst = tool._section !== lastSection;
            if (isFirst) lastSection = tool._section;
            const isActive = activeToolId === tool.id;
            const isPinned = pinnedToolIds.includes(tool.id);
            return (
              <div key={tool.id}>
                {/* Section label */}
                {isFirst && tool._section && (
                  <div style={{ padding: '8px 14px 2px', fontSize: 'var(--fs-2xs)', color: 'var(--text4)', letterSpacing: '0.08em', fontWeight: 700, userSelect: 'none' }}>
                    {tool._section === 'pinned' ? '★ PINNED' : '↺ RECENT'}
                  </div>
                )}
                <div
                  data-idx={idx}
                  onMouseEnter={() => setHighlighted(idx)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 14px',
                    background: highlighted === idx ? 'var(--bg2)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => runTool(tool.id)}
                >
                  {/* Category dot */}
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                    background: isActive ? 'var(--green)' : 'var(--text4)',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--fs-xs)', color: isActive ? 'var(--green)' : 'var(--text2)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tool.name}
                    </div>
                    <div style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tool.description}
                    </div>
                  </div>
                  <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)', flexShrink: 0 }}>{tool.category}</span>
                  {/* Pin button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePinnedTool(tool.id); }}
                    title={isPinned ? 'Unpin' : 'Pin'}
                    style={{
                      flexShrink: 0,
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: isPinned ? 'var(--amber)' : 'var(--text4)',
                      fontSize: '13px', lineHeight: 1, padding: '2px 4px',
                      transition: 'color .1s',
                    }}
                  >
                    {isPinned ? '★' : '☆'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        <div
          style={{
            display: 'flex', gap: '14px', alignItems: 'center',
            padding: '7px 14px',
            borderTop: '1px solid var(--border)',
            fontSize: 'var(--fs-2xs)', color: 'var(--text4)',
          }}
        >
          <span><kbd style={{ border: '1px solid var(--border)', borderRadius: '3px', padding: '1px 4px', background: 'var(--bg2)' }}>↑↓</kbd> navigate</span>
          <span><kbd style={{ border: '1px solid var(--border)', borderRadius: '3px', padding: '1px 4px', background: 'var(--bg2)' }}>↵</kbd> run</span>
          <span><kbd style={{ border: '1px solid var(--border)', borderRadius: '3px', padding: '1px 4px', background: 'var(--bg2)' }}>☆</kbd> pin</span>
          <span style={{ marginLeft: 'auto' }}>⌘K to toggle</span>
        </div>
      </div>
    </div>
  );
}
