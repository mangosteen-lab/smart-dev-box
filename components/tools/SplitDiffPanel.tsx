'use client';

import { useState, useCallback, useRef } from 'react';
import { executeTool, runDetection, getAllTools } from '@/lib/tools';
import * as Diff from 'diff';

// ── Inline syntax highlighted output ─────────────────────────────────────────

function PlainOutput({ code }: { code: string; language?: string }) {
  return (
    <pre
      className="text-xs whitespace-pre-wrap overflow-auto leading-relaxed flex-1"
      style={{
        color: 'var(--foreground)',
        fontFamily: 'var(--font-mono, monospace)',
        margin: 0,
        padding: '10px',
      }}
    >
      {code}
    </pre>
  );
}

// ── DiffView ──────────────────────────────────────────────────────────────────

function DiffView({ left, right }: { left: string; right: string }) {
  const changes = Diff.diffLines(left, right);
  return (
    <pre
      className="text-xs overflow-auto leading-relaxed w-full"
      style={{ fontFamily: 'monospace', margin: 0, padding: '12px' }}
    >
      {changes.map((part, i) => (
        <span
          key={i}
          style={{
            background: part.added
              ? 'rgba(34,197,94,0.15)'
              : part.removed
              ? 'rgba(239,68,68,0.15)'
              : 'transparent',
            color: part.added
              ? 'var(--success)'
              : part.removed
              ? 'var(--error)'
              : 'var(--muted)',
            display: 'block',
          }}
        >
          {part.value
            .split('\n')
            .filter(Boolean)
            .map((line, j) => (
              <span key={j} style={{ display: 'block' }}>
                {part.added ? '+ ' : part.removed ? '- ' : '  '}
                {line}
              </span>
            ))}
        </span>
      ))}
    </pre>
  );
}

// ── Single pane: input + auto-detect + format + output ───────────────────────

interface PaneState {
  input: string;
  output: string;
  outputLanguage?: string;
  error?: string;
  detectedTools: Array<{ toolId: string; toolName: string; confidence: number }>;
  activeToolId: string | null;
  isRunning: boolean;
}

function EditorPane({
  label,
  state,
  onChange,
  onRun,
}: {
  label: string;
  state: PaneState;
  onChange: (value: string) => void;
  onRun: (toolId: string) => void;
}) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInput = useCallback(
    (value: string) => {
      onChange(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        // detection is handled by parent via onChange
      }, 300);
    },
    [onChange]
  );

  const significant = state.detectedTools.filter((r) => r.confidence >= 0.3);

  const textareaStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: 'var(--foreground)',
    fontFamily: 'var(--font-mono, monospace)',
    fontSize: '12px',
    resize: 'none',
    outline: 'none',
    width: '100%',
    flex: 1,
    padding: '10px',
    minHeight: '160px',
  };

  return (
    <div
      className="flex flex-col flex-1 min-w-0 rounded-lg overflow-hidden"
      style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
    >
      {/* Pane header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
      >
        <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>
          {label}
        </span>
        {state.input.trim() && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {state.input.length.toLocaleString()} chars
          </span>
        )}
      </div>

      {/* Input area */}
      <textarea
        value={state.input}
        onChange={(e) => handleInput(e.target.value)}
        placeholder={`Paste text here…`}
        style={textareaStyle}
        spellCheck={false}
      />

      {/* Detection / format bar */}
      {state.input.trim() && (
        <div
          className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-t shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          {significant.length === 0 ? (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              No format detected
            </span>
          ) : (
            <>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>
                Format:
              </span>
              {significant.slice(0, 4).map((r) => (
                <button
                  key={r.toolId}
                  onClick={() => onRun(r.toolId)}
                  disabled={state.isRunning}
                  className="text-xs px-2.5 py-0.5 rounded-full transition-opacity hover:opacity-80 disabled:opacity-40"
                  style={{
                    background:
                      state.activeToolId === r.toolId
                        ? 'var(--primary)'
                        : 'rgba(59,130,246,0.12)',
                    color:
                      state.activeToolId === r.toolId ? '#fff' : 'var(--primary)',
                    border: '1px solid rgba(59,130,246,0.3)',
                  }}
                >
                  {r.toolName}
                  {state.activeToolId !== r.toolId && (
                    <span style={{ opacity: 0.65 }}>
                      {' '}
                      {Math.round(r.confidence * 100)}%
                    </span>
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Output area */}
      {(state.output || state.error) && (
        <div
          className="flex flex-col border-t"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-2)', maxHeight: '200px', overflow: 'auto' }}
        >
          <div
            className="flex items-center justify-between px-3 py-1.5 shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
              Output
              {state.activeToolId && (
                <span style={{ color: 'var(--primary)', marginLeft: 4 }}>
                  · {getAllTools().find((t) => t.id === state.activeToolId)?.name ?? state.activeToolId}
                </span>
              )}
            </span>
            {state.output && (
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(state.output).catch(() => {});
                }}
                className="text-xs px-2 py-0.5 rounded"
                style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
              >
                Copy
              </button>
            )}
          </div>
          {state.error ? (
            <p className="text-xs p-3" style={{ color: 'var(--error)' }}>
              {state.error}
            </p>
          ) : (
            <PlainOutput code={state.output} language={state.outputLanguage} />
          )}
        </div>
      )}
    </div>
  );
}

// ── Main SplitDiffPanel ───────────────────────────────────────────────────────

const emptyPane = (): PaneState => ({
  input: '',
  output: '',
  outputLanguage: undefined,
  error: undefined,
  detectedTools: [],
  activeToolId: null,
  isRunning: false,
});

function makePane(input: string, output: string, outputLanguage?: string, activeToolId?: string | null): PaneState {
  const detectionResults = runDetection(input);
  const detectedTools = detectionResults
    .filter((r) => r.confidence >= 0.1)
    .map((r) => ({ toolId: r.toolId, toolName: r.toolName, confidence: r.confidence }));
  return {
    input,
    output,
    outputLanguage,
    error: undefined,
    detectedTools,
    activeToolId: activeToolId ?? null,
    isRunning: false,
  };
}

export function SplitDiffPanel({
  onClose,
  initialInput,
  initialOutput,
  initialOutputLanguage,
  initialToolId,
}: {
  onClose: () => void;
  initialInput?: string;
  initialOutput?: string;
  initialOutputLanguage?: string;
  initialToolId?: string | null;
}) {
  const [left, setLeft] = useState<PaneState>(() =>
    initialInput
      ? makePane(initialInput, initialOutput ?? '', initialOutputLanguage, initialToolId)
      : emptyPane()
  );
  const [right, setRight] = useState<PaneState>(emptyPane());
  const [diffVisible, setDiffVisible] = useState(false);

  // Update pane input + run detection
  const handleChange = useCallback(
    (side: 'left' | 'right', value: string) => {
      const detectionResults = runDetection(value);
      const detectedTools = detectionResults
        .filter((r) => r.confidence >= 0.1)
        .map((r) => ({ toolId: r.toolId, toolName: r.toolName, confidence: r.confidence }));

      if (side === 'left') {
        setLeft((p) => ({ ...p, input: value, detectedTools, output: '', error: undefined, activeToolId: null }));
      } else {
        setRight((p) => ({ ...p, input: value, detectedTools, output: '', error: undefined, activeToolId: null }));
      }
      setDiffVisible(false);
    },
    []
  );

  // Run a tool on a pane
  const handleRun = useCallback(async (side: 'left' | 'right', toolId: string) => {
    const pane = side === 'left' ? left : right;
    const setter = side === 'left' ? setLeft : setRight;

    setter((p) => ({ ...p, isRunning: true, activeToolId: toolId }));
    try {
      const result = await executeTool(toolId, pane.input);
      setter((p) => ({
        ...p,
        isRunning: false,
        output: result.output ?? '',
        outputLanguage: result.outputLanguage,
        error: result.error,
      }));
    } catch (e: unknown) {
      setter((p) => ({
        ...p,
        isRunning: false,
        error: e instanceof Error ? e.message : 'Unknown error',
      }));
    }
    setDiffVisible(false);
  }, [left, right]);

  // Determine what to diff: prefer formatted output, fall back to raw input
  const leftText = left.output || left.input;
  const rightText = right.output || right.input;
  const canDiff = !!(leftText.trim() || rightText.trim());

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between shrink-0">
        <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
          Split &amp; Diff
        </span>
        <button
          onClick={onClose}
          className="text-xs px-2.5 py-1 rounded hover:opacity-70"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          ✕ Close
        </button>
      </div>

      {/* Two panes side by side */}
      <div className="flex gap-3" style={{ minHeight: 0 }}>
        <EditorPane
          label="Left"
          state={left}
          onChange={(v) => handleChange('left', v)}
          onRun={(id) => handleRun('left', id)}
        />
        <EditorPane
          label="Right"
          state={right}
          onChange={(v) => handleChange('right', v)}
          onRun={(id) => handleRun('right', id)}
        />
      </div>

      {/* Diff action row */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setDiffVisible((v) => !v)}
          disabled={!canDiff}
          className="text-xs px-4 py-1.5 rounded font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
          style={{ background: 'var(--primary)', color: '#fff' }}
        >
          {diffVisible ? 'Hide Diff' : 'Compare Diff'}
        </button>
        {diffVisible && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            Comparing {left.output ? 'formatted' : 'raw'} left vs {right.output ? 'formatted' : 'raw'} right
          </span>
        )}
      </div>

      {/* Diff result */}
      {diffVisible && (
        <div
          className="rounded-lg overflow-auto"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            maxHeight: '320px',
          }}
        >
          {leftText.trim() === '' && rightText.trim() === '' ? (
            <p className="text-xs p-4" style={{ color: 'var(--muted)' }}>
              Both panes are empty.
            </p>
          ) : (
            <DiffView left={leftText} right={rightText} />
          )}
        </div>
      )}
    </div>
  );
}
