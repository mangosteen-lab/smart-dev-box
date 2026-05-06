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
        className="flex items-center gap-2 text-xs px-3 py-1.5 rounded"
        style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}
      >
        <span>Unrecognized input — select a tool from the sidebar</span>
      </div>
    );
  }

  const primary = significant[0];
  const secondary = significant.slice(1, 4);
  const overflow = significant.slice(4);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Detected label */}
      <span className="text-xs" style={{ color: 'var(--muted)' }}>
        Detected:
      </span>

      {/* Primary action chip */}
      <button
        onClick={() => runTool(primary.toolId)}
        className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium transition-opacity hover:opacity-80"
        style={{
          background: activeToolId === primary.toolId ? 'var(--primary)' : 'rgba(59,130,246,0.15)',
          color: activeToolId === primary.toolId ? 'white' : 'var(--primary)',
          border: '1px solid rgba(59,130,246,0.3)',
        }}
      >
        {primary.toolName}
        <span style={{ opacity: 0.7 }}>{Math.round(primary.confidence * 100)}%</span>
      </button>

      {/* Secondary chips */}
      {secondary.map((r) => (
        <button
          key={r.toolId}
          onClick={() => runTool(r.toolId)}
          className="text-xs px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
          style={{
            background: activeToolId === r.toolId ? 'var(--surface-2)' : 'transparent',
            color: 'var(--muted)',
            border: '1px solid var(--border)',
          }}
        >
          {r.toolName}
        </button>
      ))}

      {/* Overflow */}
      {overflow.length > 0 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          +{overflow.length} more
        </button>
      )}

      {showAll &&
        overflow.map((r) => (
          <button
            key={r.toolId}
            onClick={() => { runTool(r.toolId); setShowAll(false); }}
            className="text-xs px-2.5 py-1 rounded-full transition-opacity hover:opacity-80"
            style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            {r.toolName}
          </button>
        ))}
    </div>
  );
}
