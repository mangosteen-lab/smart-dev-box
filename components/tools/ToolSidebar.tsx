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

const CATEGORY_ICONS: Record<Category, string> = {
  'Encoding / Decoding': '🔐',
  'Formatting': '{}',
  'Conversion': '⇄',
  'Generation': '✦',
  'Text': 'Aa',
  'Inspection': '🔍',
};

const CATEGORY_COLORS: Record<Category, string> = {
  'Encoding / Decoding': '#6366f1',
  'Formatting': '#10b981',
  'Conversion': '#f59e0b',
  'Generation': '#8b5cf6',
  'Text': '#3b82f6',
  'Inspection': '#f43f5e',
};

export function ToolSidebar() {
  const { sidebarOpen, toggleSidebar, activeToolId, setActiveToolId, addOutput, input } =
    useDevboxStore();
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

  return (
    <aside
      className="flex flex-col shrink-0 overflow-hidden transition-all duration-200"
      style={{
        width: sidebarOpen ? '240px' : '52px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Header / Toggle */}
      <div
        className="flex items-center justify-between px-3 shrink-0"
        style={{
          height: '48px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {sidebarOpen && (
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Tools
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 ml-auto"
          style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)', fontSize: '13px' }}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </div>

      {sidebarOpen ? (
        <>
          {/* Search */}
          <div className="px-3 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--muted)', fontSize: '14px' }}
              >
                ⌕
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools..."
                className="w-full pl-8 pr-3 py-2 rounded-lg outline-none transition-colors"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>

          {/* Tool list */}
          <div className="overflow-y-auto flex-1 py-2">
            {filteredTools ? (
              <div className="px-2">
                {filteredTools.length === 0 ? (
                  <p className="text-center py-8" style={{ color: 'var(--muted)', fontSize: '13px' }}>
                    No tools found
                  </p>
                ) : (
                  filteredTools.map((tool) => (
                    <ToolItem
                      key={tool.id}
                      id={tool.id}
                      name={tool.name}
                      isActive={activeToolId === tool.id}
                      onClick={() => handleToolClick(tool.id)}
                    />
                  ))
                )}
              </div>
            ) : (
              CATEGORY_ORDER.filter((cat) => toolsByCategory[cat]?.length > 0).map((cat) => {
                const isExpanded = expandedCats.has(cat);
                const color = CATEGORY_COLORS[cat];
                return (
                  <div key={cat} className="mb-1">
                    {/* Category header */}
                    <button
                      onClick={() => toggleCat(cat)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 transition-colors hover:opacity-80"
                      style={{ color: 'var(--muted)' }}
                    >
                      <span
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                        style={{ background: `${color}1a`, color, fontSize: '13px' }}
                      >
                        {CATEGORY_ICONS[cat]}
                      </span>
                      <span
                        className="flex-1 text-left font-semibold uppercase tracking-wide"
                        style={{ fontSize: '11px', color: 'var(--muted)' }}
                      >
                        {cat}
                      </span>
                      <span style={{ fontSize: '11px', opacity: 0.6 }}>
                        {isExpanded ? '▾' : '▸'}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="px-2 pb-1">
                        {toolsByCategory[cat].map((tool) => (
                          <ToolItem
                            key={tool.id}
                            id={tool.id}
                            name={tool.name}
                            isActive={activeToolId === tool.id}
                            onClick={() => handleToolClick(tool.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        /* Collapsed icon rail */
        <div className="overflow-y-auto flex-1 flex flex-col items-center py-3 gap-2">
          {CATEGORY_ORDER.filter((cat) => toolsByCategory[cat]?.length > 0).map((cat) => {
            const color = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={toggleSidebar}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                style={{ background: `${color}1a`, color, fontSize: '15px' }}
                title={cat}
              >
                {CATEGORY_ICONS[cat]}
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}

function ToolItem({
  name, isActive, onClick,
}: {
  id: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded-lg transition-all hover:opacity-90 mb-0.5"
      style={{
        background: isActive ? 'var(--primary-muted)' : 'transparent',
        color: isActive ? 'var(--primary)' : 'var(--foreground)',
        borderLeft: isActive ? '2px solid var(--primary)' : '2px solid transparent',
        fontWeight: isActive ? 600 : 400,
        fontSize: '13px',
      }}
    >
      {name}
    </button>
  );
}
