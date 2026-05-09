'use client';

import { useState } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { executeTool, getAllTools } from '@/lib/tools';

export function DetectionBar() {
  const { detectionResults, input, activeToolId, setActiveToolId, addOutput, onboardingStep, advanceOnboardingStep } = useDevboxStore();
  const [showAll, setShowAll] = useState(false);

  if (!input.trim()) return null;

  const runTool = async (toolId: string, isPrimary = false) => {
    setActiveToolId(toolId);
    const result = await executeTool(toolId, input);
    const toolName = getAllTools().find((t) => t.id === toolId)?.name ?? toolId;
    addOutput({ toolId, toolName, result, timestamp: Date.now() });
    // Step 2 (index 1): advance when the primary recommended tool is run
    if (isPrimary && onboardingStep === 1) advanceOnboardingStep();
  };

  const significant = detectionResults.filter((r) => r.confidence >= 0.3);

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
    <div className="flex flex-wrap items-center" style={{ gap: '5px' }}>
      <span style={{ color: 'var(--text3)', fontSize: 'var(--fs-2xs)' }}>detected:</span>

      {/* Primary chip — tool name as the action, matching original style */}
      <button
        onClick={() => runTool(primary.toolId, true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: 'var(--fs-2xs)', padding: '5px 10px', borderRadius: '3px',
          border: `1px solid ${activeToolId === primary.toolId ? 'var(--green)' : 'var(--green-dim)'}`,
          color: activeToolId === primary.toolId ? 'var(--green)' : '#4ade80cc',
          background: activeToolId === primary.toolId ? 'var(--green-bg)' : 'transparent',
          cursor: 'pointer', fontFamily: 'var(--font)',
          transition: 'all .12s', minHeight: '28px',
        }}
      >
        ▶ {primary.toolName}
        <span style={{ opacity: 0.6 }}>
          {Math.round(primary.confidence * 100)}%
        </span>
      </button>

      {/* Secondary action chips */}
      {secondary.map((r) => (
        <button
          key={r.toolId}
          onClick={() => runTool(r.toolId)}
          style={{
            fontSize: 'var(--fs-2xs)', padding: '5px 9px', borderRadius: '3px',
            border: '1px solid var(--border)',
            color: activeToolId === r.toolId ? 'var(--text2)' : 'var(--text3)',
            background: activeToolId === r.toolId ? 'var(--bg3)' : 'transparent',
            cursor: 'pointer', fontFamily: 'var(--font)',
            transition: 'all .12s', minHeight: '28px',
          }}
        >
          {r.toolName}
          <span style={{ opacity: 0.4, marginLeft: '4px' }}>
            {Math.round(r.confidence * 100)}%
          </span>
        </button>
      ))}

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
