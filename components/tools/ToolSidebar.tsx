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

export function ToolSidebar() {
  const { sidebarOpen, toggleSidebar, activeToolId, setActiveToolId, addOutput, input } =
    useDevboxStore();
  const [search, setSearch] = useState('');

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

  return (
    <aside
      className="flex flex-col shrink-0 border-r overflow-hidden transition-all duration-200"
      style={{
        width: sidebarOpen ? '220px' : '44px',
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center h-10 w-full border-b text-sm font-bold shrink-0 hover:opacity-80"
        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {sidebarOpen ? '◀' : '▶'}
      </button>

      {sidebarOpen ? (
        <>
          {/* Search */}
          <div className="p-2 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools..."
              className="w-full text-xs px-2 py-1.5 rounded outline-none"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
              }}
            />
          </div>

          {/* Tool list */}
          <div className="overflow-y-auto flex-1">
            {filteredTools ? (
              <div className="p-2">
                {filteredTools.length === 0 ? (
                  <p className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>
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
              CATEGORY_ORDER.filter((cat) => toolsByCategory[cat]?.length > 0).map((cat) => (
                <div key={cat} className="mb-1">
                  <div
                    className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--muted)' }}
                  >
                    {CATEGORY_ICONS[cat]} {cat}
                  </div>
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
              ))
            )}
          </div>
        </>
      ) : (
        /* Collapsed icon rail */
        <div className="overflow-y-auto flex-1 flex flex-col items-center py-2 gap-1">
          {CATEGORY_ORDER.filter((cat) => toolsByCategory[cat]?.length > 0).map((cat) => (
            <button
              key={cat}
              onClick={toggleSidebar}
              className="w-8 h-8 rounded flex items-center justify-center text-sm"
              style={{ color: 'var(--muted)' }}
              title={cat}
            >
              {CATEGORY_ICONS[cat]}
            </button>
          ))}
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
      className="w-full text-left px-3 py-1.5 text-xs rounded transition-colors hover:opacity-80"
      style={{
        background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
        color: isActive ? 'var(--primary)' : 'var(--foreground)',
      }}
    >
      {name}
    </button>
  );
}
