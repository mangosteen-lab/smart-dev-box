'use client';

import { useEffect, useCallback } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { CASE_VARIANTS, convertCase, type CaseVariant } from '@/lib/tools/text';
import { executeTool } from '@/lib/tools';

interface CaseConverterPanelProps {
  onClose: () => void;
}

export function CaseConverterPanel({ onClose }: CaseConverterPanelProps) {
  const { input, addOutput } = useDevboxStore();

  // Close on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSelect = async (variant: CaseVariant) => {
    const result = await executeTool('text-case', input, { variant });
    addOutput({
      toolId: 'text-case',
      toolName: 'Case Converter',
      result,
      timestamp: Date.now(),
    });
    onClose();
  };

  return (
    /* ── Backdrop ── */
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── Modal ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg1)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          width: '92vw',
          maxWidth: '560px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--green-dim)', textTransform: 'uppercase' }}>
              Case Converter
            </span>
            {input.trim() && (
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 'var(--fs-2xs)',
                  color: 'var(--text3)',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  maxWidth: '280px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={input}
              >
                {input.length > 48 ? input.slice(0, 48) + '…' : input}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            title="Close (Esc)"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text4)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'color .12s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text1)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text4)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Hint */}
        <div style={{ padding: '8px 16px 0', fontSize: 'var(--fs-2xs)', color: 'var(--text4)' }}>
          Click a format to apply it to the output.
        </div>

        {/* Variant list */}
        <div style={{ padding: '10px 16px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {CASE_VARIANTS.map(({ id, label }) => {
            const converted = input.trim() ? convertCase(input, id) : '';
            return (
              <button
                key={id}
                onClick={() => handleSelect(id as CaseVariant)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'border-color .1s, background .1s',
                  fontFamily: 'var(--font)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--green-dim)';
                  el.style.background = 'var(--green-bg)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border)';
                  el.style.background = 'var(--bg2)';
                }}
              >
                {/* Format label */}
                <span
                  style={{
                    flexShrink: 0,
                    width: '112px',
                    fontSize: 'var(--fs-2xs)',
                    fontWeight: 700,
                    color: 'var(--text3)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {label}
                </span>
                {/* Converted preview */}
                <span
                  style={{
                    flex: 1,
                    fontFamily: 'monospace',
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--text1)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={converted}
                >
                  {converted || <span style={{ color: 'var(--text4)', fontStyle: 'italic' }}>—</span>}
                </span>
                {/* Arrow hint */}
                <svg
                  width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="var(--text4)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
