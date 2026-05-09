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

export function ToolSidebar() {
  const { activeToolId, setActiveToolId, addOutput, input, mobileSidebarOpen, setMobileSidebarOpen } = useDevboxStore();
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

  const sidebarContent = (
    <aside
      className="flex flex-col shrink-0 overflow-hidden"
      style={{
        width: '190px',
        height: '100%',
        background: 'var(--bg)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Search */}
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
          placeholder="Search tools..."
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
      </div>

      {/* Tool list */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: '16px', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
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
                onClick={() => handleToolClick(tool.id)}
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
                    onClick={() => handleToolClick(tool.id)}
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
  name, isActive, onClick, dataAttr,
}: {
  name: string;
  isActive: boolean;
  onClick: () => void;
  dataAttr?: Record<string, string>;
}) {
  return (
    <button
      onClick={onClick}
      {...(dataAttr ?? {})}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '8px 10px 8px 23px',
        fontSize: 'var(--fs-xs)',
        color: isActive ? 'var(--green)' : 'var(--text3)',
        background: isActive ? 'var(--green-bg)' : 'transparent',
        borderLeft: isActive ? '2px solid var(--green)' : '2px solid transparent',
        borderRight: 'none',
        borderTop: 'none',
        borderBottom: 'none',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        transition: 'color 0.12s, background 0.12s',
        minHeight: '40px',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.color = 'var(--text2)';
          (e.currentTarget as HTMLElement).style.background = 'var(--bg2)';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.color = 'var(--text3)';
          (e.currentTarget as HTMLElement).style.background = 'transparent';
        }
      }}
    >
      {name}
    </button>
  );
}
