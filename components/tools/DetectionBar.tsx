'use client';

import { useState } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { executeTool, getAllTools } from '@/lib/tools';

// Color map for format-specific chip styling
const FORMAT_COLORS: Record<string, { color: string; border: string; bg: string }> = {
  json:      { color: 'var(--blue)',   border: 'var(--blue-dim)',   bg: 'rgba(96,165,250,0.10)' },
  base64:    { color: 'var(--green)',  border: 'var(--green-dim)',  bg: 'var(--green-bg)' },
  jwt:       { color: 'var(--purple)', border: 'var(--purple-dim)', bg: 'rgba(167,139,250,0.10)' },
  xml:       { color: 'var(--amber)',  border: 'var(--amber-dim)',  bg: 'rgba(251,191,36,0.10)' },
  url:       { color: 'var(--blue)',   border: 'var(--blue-dim)',   bg: 'rgba(96,165,250,0.10)' },
  sql:       { color: 'var(--purple)', border: 'var(--purple-dim)', bg: 'rgba(167,139,250,0.10)' },
  timestamp: { color: 'var(--amber)',  border: 'var(--amber-dim)',  bg: 'rgba(251,191,36,0.10)' },
  uuid:      { color: 'var(--green)',  border: 'var(--green-dim)',  bg: 'var(--green-bg)' },
};

function getChipColors(toolId: string) {
  const key = Object.keys(FORMAT_COLORS).find(k => toolId.toLowerCase().includes(k));
  return key ? FORMAT_COLORS[key] : { color: 'var(--green)', border: 'var(--green-dim)', bg: 'transparent' };
}

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

  const significant = detectionResults.filter((r) => r.confidence >= 0.3 && r.toolId !== 'extract-sections');

  if (significant.length === 0) {
    return (
      <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)' }}>
        unrecognized — pick a tool
      </span>
    );
  }

  const primary = significant[0];
  const secondary = significant.slice(1, 4);
  const overflow = significant.slice(4);

  return (
    <div className="flex flex-wrap items-center" style={{ gap: '6px' }}>
      <span style={{ color: 'var(--text3)', fontSize: 'var(--fs-2xs)', fontWeight: 600 }}>Detected:</span>

      {/* Primary chip — larger, color-coded with pulse animation */}
      <button
        onClick={() => runTool(primary.toolId)}
        className="chip-pulse"
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: 'var(--fs-xs)', padding: '6px 14px', borderRadius: '5px',
          border: `1px solid ${activeToolId === primary.toolId ? getChipColors(primary.toolId).color : getChipColors(primary.toolId).border}`,
          color: getChipColors(primary.toolId).color,
          background: getChipColors(primary.toolId).bg,
          cursor: 'pointer', fontFamily: 'var(--font)',
          transition: 'all .15s', minHeight: '32px',
          fontWeight: 600,
          boxShadow: activeToolId === primary.toolId ? `0 0 10px ${getChipColors(primary.toolId).bg}` : 'none',
        }}
      >
        ▶ {primary.toolName}
        <span style={{
          opacity: 0.7,
          fontSize: 'var(--fs-2xs)',
          background: 'rgba(255,255,255,0.08)',
          padding: '1px 6px',
          borderRadius: '3px',
        }}>
          {Math.round(primary.confidence * 100)}%
        </span>
      </button>

      {/* Secondary action chips — color-coded */}
      {secondary.map((r) => {
        const colors = getChipColors(r.toolId);
        return (
          <button
            key={r.toolId}
            onClick={() => runTool(r.toolId)}
            style={{
              fontSize: 'var(--fs-2xs)', padding: '5px 11px', borderRadius: '4px',
              border: `1px solid ${activeToolId === r.toolId ? colors.color : 'var(--border)'}`,
              color: activeToolId === r.toolId ? colors.color : 'var(--text3)',
              background: activeToolId === r.toolId ? colors.bg : 'transparent',
              cursor: 'pointer', fontFamily: 'var(--font)',
              transition: 'all .15s', minHeight: '30px',
              fontWeight: 500,
            }}
          >
            {r.toolName}
            <span style={{ opacity: 0.4, marginLeft: '4px', fontSize: 'var(--fs-2xs)' }}>
              {Math.round(r.confidence * 100)}%
            </span>
          </button>
        );
      })}

      {overflow.length > 0 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            fontSize: 'var(--fs-2xs)', padding: '5px 9px', borderRadius: '3px',
            color: 'var(--text3)', border: '1px solid var(--border)',
            background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)',
            minHeight: '28px',
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
            style={{
              fontSize: 'var(--fs-2xs)', padding: '5px 9px', borderRadius: '3px',
              color: 'var(--text3)', border: '1px solid var(--border)',
              background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)',
              minHeight: '28px',
            }}
          >
            {r.toolName}
          </button>
        ))}
    </div>
  );
}
