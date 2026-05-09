'use client';

import { useState } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { getAllTools, getToolsByCategory, executeTool } from '@/lib/tools';
import type { Category } from '@/lib/tools/types';

const CATEGORY_ORDER: Category[] = [
  'Encoding / Decoding',
  'Formatting',
  'Conversion',
  'Text',
  'Inspection',
];

// Map categories to the reference's color scheme
const CATEGORY_COLORS: Record<Category, { color: string; dim: string }> = {
  'Encoding / Decoding': { color: 'var(--green)',  dim: 'var(--green-dim)' },
  'Formatting':          { color: 'var(--purple)', dim: 'var(--purple-dim)' },
  'Conversion':          { color: 'var(--amber)',  dim: 'var(--amber-dim)' },
  'Generation':          { color: 'var(--amber)',  dim: 'var(--amber-dim)' },
  'Text':                { color: 'var(--blue)',   dim: 'var(--blue-dim)' },
  'Inspection':          { color: 'var(--blue)',   dim: 'var(--blue-dim)' },
};

// Collapse a tool name to a short abbreviation for mini-mode
function toolAbbr(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.map((w) => w[0]).join('').toUpperCase().slice(0, 3);
}

export function ToolSidebar() {
  const {
    activeToolId, setActiveToolId, addOutput, input,
    mobileSidebarOpen, setMobileSidebarOpen,
    sidebarMini, toggleSidebarMini,
    recentToolIds, pinnedToolIds, addRecentTool, togglePinnedTool,
  } = useDevboxStore();
  const [search, setSearch] = useState('');
  const [expandedCats, setExpandedCats] = useState<Set<Category>>(new Set(CATEGORY_ORDER));

  const toolsByCategory = getToolsByCategory();
  const allTools = getAllTools();

  const filteredTools = search.trim()
    ? allTools.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase()) ||
          t.keywords.some((k) => k.includes(search.toLowerCase()))
      )
    : null;

  const handleToolClick = async (toolId: string) => {
    setActiveToolId(toolId);
    addRecentTool(toolId);
    setMobileSidebarOpen(false);
    if (input.trim()) {
      const tool = allTools.find((t) => t.id === toolId);
      const result = await executeTool(toolId, input);
      addOutput({ toolId, toolName: tool?.name ?? toolId, result, timestamp: Date.now() });
    }
  };

  const toggleCat = (cat: Category) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // Pinned & recent tool objects (deduped, in order)
  const pinnedTools = pinnedToolIds.map((id) => allTools.find((t) => t.id === id)).filter(Boolean) as typeof allTools;
  const recentTools = recentToolIds
    .filter((id) => !pinnedToolIds.includes(id))
    .map((id) => allTools.find((t) => t.id === id))
    .filter(Boolean) as typeof allTools;

  /* ─── MINI (icon-only) sidebar ─── */
  if (sidebarMini) {
    return (
      <aside
        className="hidden md:flex flex-col shrink-0 overflow-hidden"
        style={{
          width: '48px',
          height: '100%',
          background: 'var(--bg)',
          borderRight: '1px solid var(--border)',
          alignItems: 'center',
          paddingTop: '6px',
          gap: '2px',
        }}
      >
        {/* Expand button */}
        <button
          onClick={toggleSidebarMini}
          title="Expand sidebar"
          style={{
            width: '34px', height: '34px', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: '1px solid transparent',
            color: 'var(--text3)', cursor: 'pointer',
            marginBottom: '6px',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg2)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>
          </svg>
        </button>
        {/* Categories as icon dots */}
        {CATEGORY_ORDER.map((cat) => {
          const { color } = CATEGORY_COLORS[cat];
          const tools = toolsByCategory[cat] ?? [];
          const hasActive = tools.some((t) => t.id === activeToolId);
          return (
            <div
              key={cat}
              title={cat}
              style={{
                width: '34px', height: '34px', borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: hasActive ? 'var(--bg2)' : 'none',
                cursor: 'default',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'block' }} />
            </div>
          );
        })}
        {/* Active tool abbr */}
        {activeToolId && (
          <div
            title={activeToolId}
            style={{
              marginTop: 'auto', marginBottom: '8px',
              width: '34px', height: '34px', borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--green-bg)', border: '1px solid var(--green-dim)',
              fontSize: 'var(--fs-2xs)', color: 'var(--green)', fontWeight: 700, letterSpacing: '0.04em',
            }}
          >
            {toolAbbr(allTools.find((t) => t.id === activeToolId)?.name ?? activeToolId)}
          </div>
        )}
      </aside>
    );
  }

  /* ─── FULL sidebar ─── */
  const sidebarContent = (
    <aside
      className="flex flex-col shrink-0 overflow-hidden"
      style={{
        width: '200px',
        height: '100%',
        background: 'var(--bg)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Search + collapse toggle */}
      <div
        className="flex items-center shrink-0"
        style={{
          margin: '10px 8px 6px',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          padding: '6px 9px',
          gap: '7px',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools…"
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            fontSize: 'var(--fs-xs)',
            color: 'var(--text2)',
            fontFamily: 'var(--font)',
            width: '100%',
          }}
        />
        {/* Collapse to mini */}
        <button
          onClick={toggleSidebarMini}
          title="Collapse sidebar"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text4)', padding: '0 2px', lineHeight: 1, flexShrink: 0 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="15" y1="18" x2="9" y2="12"/><line x1="9" y1="12" x2="15" y2="6"/>
          </svg>
        </button>
      </div>

      {/* ⌘K hint */}
      <div
        style={{
          margin: '0 8px 8px',
          padding: '5px 9px',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: 'var(--fs-2xs)', color: 'var(--text4)',
          cursor: 'default',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span>⌘K for quick search</span>
      </div>

      {/* Tool list */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: '16px', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>

        {/* Pinned section */}
        {pinnedTools.length > 0 && !filteredTools && (
          <div>
            <div style={{ padding: '8px 10px 4px', fontSize: 'var(--fs-2xs)', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--amber-dim)' }}>
              ★ pinned
            </div>
            {pinnedTools.map((tool) => (
              <ToolItem
                key={tool.id}
                name={tool.name}
                isActive={activeToolId === tool.id}
                isPinned={true}
                onClick={() => handleToolClick(tool.id)}
                onPin={() => togglePinnedTool(tool.id)}
                dataAttr={tool.id === 'json-format' ? { 'data-onboard-json-format': '' } : undefined}
              />
            ))}
          </div>
        )}

        {/* Recent section */}
        {recentTools.length > 0 && !filteredTools && (
          <div>
            <div style={{ padding: '8px 10px 4px', fontSize: 'var(--fs-2xs)', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text4)' }}>
              ↺ recent
            </div>
            {recentTools.slice(0, 5).map((tool) => (
              <ToolItem
                key={tool.id}
                name={tool.name}
                isActive={activeToolId === tool.id}
                isPinned={false}
                onClick={() => handleToolClick(tool.id)}
                onPin={() => togglePinnedTool(tool.id)}
                dataAttr={tool.id === 'json-format' ? { 'data-onboard-json-format': '' } : undefined}
              />
            ))}
          </div>
        )}

        {filteredTools ? (
          filteredTools.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: 'var(--fs-xs)', padding: '16px 10px' }}>
              No tools found
            </p>
          ) : (
            filteredTools.map((tool) => (
              <ToolItem
                key={tool.id}
                name={tool.name}
                isActive={activeToolId === tool.id}
                isPinned={pinnedToolIds.includes(tool.id)}
                onClick={() => handleToolClick(tool.id)}
                onPin={() => togglePinnedTool(tool.id)}
                dataAttr={tool.id === 'json-format' ? { 'data-onboard-json-format': '' } : undefined}
              />
            ))
          )
        ) : (
          CATEGORY_ORDER.filter((cat) => toolsByCategory[cat]?.length > 0).map((cat) => {
            const isExpanded = expandedCats.has(cat);
            const { color, dim } = CATEGORY_COLORS[cat];
            return (
              <div key={cat}>
                {/* Category header */}
                <button
                  onClick={() => toggleCat(cat)}
                  className="w-full flex items-center"
                  style={{
                    gap: '7px',
                    padding: '10px 10px 5px',
                    fontSize: 'var(--fs-2xs)',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: dim,
                    cursor: 'pointer',
                    userSelect: 'none',
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font)',
                    minHeight: '44px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
                  {cat.toLowerCase()}
                  <span style={{ marginLeft: 'auto', opacity: 0.5, fontSize: 'var(--fs-2xs)' }}>{isExpanded ? '▾' : '▸'}</span>
                </button>
                {isExpanded && toolsByCategory[cat].map((tool) => (
                  <ToolItem
                    key={tool.id}
                    name={tool.name}
                    isActive={activeToolId === tool.id}
                    isPinned={pinnedToolIds.includes(tool.id)}
                    onClick={() => handleToolClick(tool.id)}
                    onPin={() => togglePinnedTool(tool.id)}
                    dataAttr={tool.id === 'json-format' ? { 'data-onboard-json-format': '' } : undefined}
                  />
                ))}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on md+ */}
      <div className="hidden md:flex h-full">
        {sidebarContent}
      </div>

      {/* Mobile drawer overlay */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
          }}
        >
          {/* Backdrop */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
            }}
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Drawer panel */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', height: '100%' }}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

function ToolItem({
  name, isActive, isPinned, onClick, onPin, dataAttr,
}: {
  name: string;
  isActive: boolean;
  isPinned: boolean;
  onClick: () => void;
  onPin: () => void;
  dataAttr?: Record<string, string>;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onClick}
        {...(dataAttr ?? {})}
        style={{
          flex: 1,
          textAlign: 'left',
          padding: '8px 10px 8px 23px',
          fontSize: 'var(--fs-xs)',
          color: isActive ? 'var(--green)' : 'var(--text3)',
          background: isActive ? 'var(--green-bg)' : hovered ? 'var(--bg2)' : 'transparent',
          borderLeft: isActive ? '2px solid var(--green)' : '2px solid transparent',
          borderRight: 'none',
          borderTop: 'none',
          borderBottom: 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'color 0.12s, background 0.12s',
          minHeight: '40px',
          cursor: 'pointer',
          fontFamily: 'var(--font)',
        }}
      >
        {name}
      </button>
      {/* Pin button — shows on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onPin(); }}
        title={isPinned ? 'Unpin' : 'Pin'}
        style={{
          position: 'absolute', right: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: isPinned ? 'var(--amber)' : 'var(--text4)',
          opacity: hovered || isPinned ? 1 : 0,
          fontSize: '11px', lineHeight: 1, padding: '2px 4px',
          transition: 'opacity .1s, color .1s',
        }}
      >
        {isPinned ? '★' : '☆'}
      </button>
    </div>
  );
}
