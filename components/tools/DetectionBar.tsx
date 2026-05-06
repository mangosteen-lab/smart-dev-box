'use client';

import { useState } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { executeTool, getAllTools } from '@/lib/tools';

export function DetectionBar() {
  const { detectionResults, input, activeToolId, setActiveToolId, addOutput } = useDevboxStore();
  const [showAll, setShowAll] = useState(false);

  if (!input.trim()) return null;

  const runTool = async (toolId: string) => {
    setActiveToolId(toolId);
    const result = await executeTool(toolId, input);
    const toolName = getAllTools().find((t) => t.id === toolId)?.name ?? toolId;
    addOutput({ toolId, toolName, result, timestamp: Date.now() });
  };

  const significant = detectionResults.filter((r) => r.confidence >= 0.3);

  if (significant.length === 0) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
        style={{
          background: 'var(--surface-2)',
          color: 'var(--muted)',
          border: '1px solid var(--border)',
          fontSize: '13px',
        }}
      >
        <span style={{ opacity: 0.6 }}>○</span>
        Unrecognized input — select a tool from the sidebar
      </div>
    );
  }

  const primary = significant[0];
  const secondary = significant.slice(1, 4);
  const overflow = significant.slice(4);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Detected label */}
      <span style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 500 }}>
        Detected:
      </span>

      {/* Primary action chip */}
      <button
        onClick={() => runTool(primary.toolId)}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold transition-all hover:scale-105"
        style={{
          background: activeToolId === primary.toolId
            ? 'var(--gradient-brand)'
            : 'var(--primary-muted)',
          color: activeToolId === primary.toolId ? 'white' : 'var(--primary)',
          border: '1px solid rgba(99,102,241,0.3)',
          boxShadow: activeToolId === primary.toolId ? '0 2px 8px var(--primary-glow)' : 'none',
          fontSize: '13px',
        }}
      >
        <span style={{ fontSize: '11px' }}>▶</span>
        {primary.toolName}
        <span
          className="px-1.5 py-0.5 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.2)',
            fontSize: '11px',
            fontWeight: 700,
          }}
        >
          {Math.round(primary.confidence * 100)}%
        </span>
      </button>

      {/* Secondary chips */}
      {secondary.map((r) => (
        <button
          key={r.toolId}
          onClick={() => runTool(r.toolId)}
          className="px-3 py-1.5 rounded-full transition-all hover:opacity-80"
          style={{
            background: activeToolId === r.toolId ? 'var(--surface-3)' : 'var(--surface-2)',
            color: activeToolId === r.toolId ? 'var(--foreground)' : 'var(--muted)',
            border: '1px solid var(--border)',
            fontSize: '13px',
          }}
        >
          {r.toolName}
          <span style={{ opacity: 0.5, marginLeft: '5px', fontSize: '11px' }}>
            {Math.round(r.confidence * 100)}%
          </span>
        </button>
      ))}

      {overflow.length > 0 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
          style={{
            color: 'var(--muted)',
            border: '1px solid var(--border)',
            background: 'transparent',
            fontSize: '13px',
          }}
        >
          +{overflow.length} more
        </button>
      )}

      {showAll &&
        overflow.map((r) => (
          <button
            key={r.toolId}
            onClick={() => { runTool(r.toolId); setShowAll(false); }}
            className="px-3 py-1.5 rounded-full transition-all hover:opacity-80"
            style={{
              color: 'var(--muted)',
              border: '1px solid var(--border)',
              background: 'transparent',
              fontSize: '13px',
            }}
          >
            {r.toolName}
          </button>
        ))}
    </div>
  );
}
