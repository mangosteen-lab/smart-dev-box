'use client';

import { useState, useCallback, useRef } from 'react';
import { executeTool, runDetection, getAllTools } from '@/lib/tools';
import { extractSections, type ExtractedSection } from '@/lib/tools/text';
import { SectionPickerPopup } from '@/components/tools/ExtractorPanel';
import { ResizablePanels } from '@/components/ResizablePanels';
import * as Diff from 'diff';

// ── Numeric detection & logic operators ──────────────────────────────────────

/** Returns the integer value of the input if it is a plain integer, binary, hex, or octal literal; otherwise null. */
function parseNumericInput(input: string): bigint | null {
  const t = input.trim();
  if (!t) return null;
  try {
    if (/^0b[01]+$/i.test(t)) return BigInt(t);
    if (/^0x[0-9a-f]+$/i.test(t)) return BigInt(t);
    if (/^0o[0-7]+$/i.test(t)) return BigInt(t);
    if (/^-?\d+$/.test(t)) return BigInt(t);
  } catch {
    return null;
  }
  return null;
}

type LogicOp = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'XNOR';

const LOGIC_OPS: { op: LogicOp; symbol: string; title: string }[] = [
  { op: 'AND',  symbol: '&',   title: 'Bitwise AND' },
  { op: 'OR',   symbol: '|',   title: 'Bitwise OR' },
  { op: 'XOR',  symbol: '^',   title: 'Bitwise XOR' },
  { op: 'NAND', symbol: '~&',  title: 'Bitwise NAND' },
  { op: 'NOR',  symbol: '~|',  title: 'Bitwise NOR' },
  { op: 'XNOR', symbol: '~^',  title: 'Bitwise XNOR' },
];

function applyLogicOp(a: bigint, b: bigint, op: LogicOp): bigint {
  switch (op) {
    case 'AND':  return a & b;
    case 'OR':   return a | b;
    case 'XOR':  return a ^ b;
    // For NAND/NOR/XNOR we return the two's-complement of the inner op.
    // Since BigInt has arbitrary precision we mask to the bit-width of the wider operand.
    case 'NAND': return ~(a & b);
    case 'NOR':  return ~(a | b);
    case 'XNOR': return ~(a ^ b);
  }
}

/** Format result in decimal, hex, binary */
function formatLogicResult(val: bigint, a: bigint, b: bigint): string {
  // For display, mask to the bit-width of the larger input so NAND/NOR/XNOR don't produce huge negative numbers.
  const bitWidth = Math.max(a.toString(2).replace('-', '').length, b.toString(2).replace('-', '').length, 1);
  const mask = (BigInt(1) << BigInt(bitWidth)) - BigInt(1);
  const masked = val < BigInt(0) ? val & mask : val;
  return [
    `Dec: ${masked}`,
    `Hex: 0x${masked.toString(16).toUpperCase()}`,
    `Bin: 0b${masked.toString(2)}`,
  ].join('   ');
}

// ── Logic operator bar ────────────────────────────────────────────────────────

function LogicOpBar({
  leftVal,
  rightVal,
}: {
  leftVal: bigint;
  rightVal: bigint;
}) {
  const [activeOp, setActiveOp] = useState<LogicOp | null>(null);

  const result = activeOp !== null ? applyLogicOp(leftVal, rightVal, activeOp) : null;

  return (
    <div
      className="rounded-lg px-4 py-3 flex flex-col gap-2 shrink-0"
      style={{ border: '1px solid var(--border)', background: 'var(--surface-2)' }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>
          Logic:
        </span>
        {LOGIC_OPS.map(({ op, symbol, title }) => (
          <button
            key={op}
            title={title}
            onClick={() => setActiveOp((prev) => (prev === op ? null : op))}
            className="text-xs px-3 py-1 rounded-full font-mono font-semibold transition-opacity hover:opacity-90"
            style={{
              background: activeOp === op ? 'var(--primary)' : 'rgba(59,130,246,0.10)',
              color: activeOp === op ? '#fff' : 'var(--primary)',
              border: '1px solid rgba(59,130,246,0.3)',
            }}
          >
            {op} <span style={{ opacity: 0.7 }}>({symbol})</span>
          </button>
        ))}
      </div>
      {result !== null && activeOp !== null && (
        <div
          className="text-xs font-mono px-3 py-1.5 rounded"
          style={{
            background: 'var(--surface)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          }}
        >
          <span style={{ color: 'var(--muted)' }}>{activeOp}({leftVal.toString()}, {rightVal.toString()}) = </span>
          {formatLogicResult(result, leftVal, rightVal)}
        </div>
      )}
    </div>
  );
}

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

// ── JSON / XML order-independent normalisation ────────────────────────────────

/** Recursively sort object keys so that key-order differences don't produce false diffs. */
function sortJsonKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJsonKeys);
  }
  if (value !== null && typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as object).sort()) {
      sorted[key] = sortJsonKeys((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

/** Attempt to parse text as JSON, sort its keys, and re-serialise. Returns null on failure. */
function normalizeJson(text: string): string | null {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(sortJsonKeys(parsed), null, 2);
  } catch {
    return null;
  }
}

/** Sort XML element attributes alphabetically and sort child elements by tag+text. */
function sortXmlNode(node: Element): void {
  // Sort attributes
  const attrs = Array.from(node.attributes).sort((a, b) => a.name.localeCompare(b.name));
  // Re-apply in sorted order by removing all then adding back
  attrs.forEach((attr) => node.removeAttribute(attr.name));
  attrs.forEach((attr) => node.setAttribute(attr.name, attr.value));

  // Recurse into children first
  const children = Array.from(node.children);
  children.forEach(sortXmlNode);

  // Sort child *element* nodes (preserve text nodes in-place is hard via DOM;
  // we sort element children by their serialised form for consistency)
  if (children.length > 1) {
    const sorted = [...children].sort((a, b) =>
      (a.tagName + a.textContent).localeCompare(b.tagName + b.textContent)
    );
    // Re-insert in sorted order
    sorted.forEach((child) => node.appendChild(child));
  }
}

/** Attempt to parse text as XML, sort attributes/children, and re-serialise. Returns null on failure. */
function normalizeXml(text: string): string | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'application/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) return null;
    if (doc.documentElement) sortXmlNode(doc.documentElement);
    const serialiser = new XMLSerializer();
    // Pretty-print by inserting newlines/indentation
    const raw = serialiser.serializeToString(doc);
    return prettyPrintXml(raw);
  } catch {
    return null;
  }
}

function prettyPrintXml(xml: string): string {
  let formatted = '';
  let indent = 0;
  const pad = (n: number) => '  '.repeat(n);
  // Split on tag boundaries
  xml.replace(/>\s*</g, '>\n<').split('\n').forEach((node) => {
    const trimmed = node.trim();
    if (!trimmed) return;
    if (/^<\//.test(trimmed)) indent = Math.max(indent - 1, 0);
    formatted += pad(indent) + trimmed + '\n';
    if (/^<[^/?!][^>]*[^/]>$/.test(trimmed) && !trimmed.startsWith('</')) indent++;
  });
  return formatted.trim();
}

/**
 * Detect whether text is JSON or XML and return a normalised (sorted) version
 * so that order-only differences don't produce false positives in the diff.
 * Falls back to the original text if detection/parsing fails.
 */
function normalizeForDiff(text: string): string {
  const t = text.trim();
  if (!t) return text;
  // Try JSON first
  if (t.startsWith('{') || t.startsWith('[')) {
    const normalised = normalizeJson(t);
    if (normalised !== null) return normalised;
  }
  // Try XML
  if (t.startsWith('<')) {
    const normalised = normalizeXml(t);
    if (normalised !== null) return normalised;
  }
  return text;
}

// ── DiffView (unified) ────────────────────────────────────────────────────────

function UnifiedDiffView({ left, right }: { left: string; right: string }) {
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

// ── DiffView (split / side-by-side) ───────────────────────────────────────────

function SplitDiffView({ left, right }: { left: string; right: string }) {
  const changes = Diff.diffLines(left, right);

  // Pair removed/added hunks that appear consecutively into side-by-side rows.
  type Row =
    | { kind: 'same'; text: string }
    | { kind: 'changed'; leftText: string; rightText: string }
    | { kind: 'removed'; text: string }
    | { kind: 'added'; text: string };

  const rows: Row[] = [];
  let i = 0;
  while (i < changes.length) {
    const part = changes[i];
    if (!part.added && !part.removed) {
      part.value.split('\n').filter(Boolean).forEach((line) => rows.push({ kind: 'same', text: line }));
      i++;
    } else if (part.removed) {
      const next = changes[i + 1];
      if (next?.added) {
        // Pair line-by-line within the hunk
        const leftLines = part.value.split('\n').filter(Boolean);
        const rightLines = next.value.split('\n').filter(Boolean);
        const len = Math.max(leftLines.length, rightLines.length);
        for (let k = 0; k < len; k++) {
          if (k < leftLines.length && k < rightLines.length) {
            rows.push({ kind: 'changed', leftText: leftLines[k], rightText: rightLines[k] });
          } else if (k < leftLines.length) {
            rows.push({ kind: 'removed', text: leftLines[k] });
          } else {
            rows.push({ kind: 'added', text: rightLines[k] });
          }
        }
        i += 2;
      } else {
        part.value.split('\n').filter(Boolean).forEach((line) => rows.push({ kind: 'removed', text: line }));
        i++;
      }
    } else {
      part.value.split('\n').filter(Boolean).forEach((line) => rows.push({ kind: 'added', text: line }));
      i++;
    }
  }

  const cellStyle = (bg: string, border: string): React.CSSProperties => ({
    flex: 1, minWidth: 0, padding: '0 10px',
    background: bg,
    borderLeft: border,
    fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.7,
    whiteSpace: 'pre-wrap', wordBreak: 'break-all',
    overflow: 'hidden',
  });

  return (
    <div style={{ overflow: 'auto', width: '100%' }}>
      {/* Column headers */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '4px 0' }}>
        <div style={{ flex: 1, minWidth: 0, paddingLeft: '28px', fontSize: '11px', fontWeight: 600, color: 'var(--muted)' }}>Left</div>
        <div style={{ width: '1px', background: 'var(--border)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0, paddingLeft: '28px', fontSize: '11px', fontWeight: 600, color: 'var(--muted)' }}>Right</div>
      </div>
      {rows.map((row, idx) => {
        if (row.kind === 'same') {
          return (
            <div key={idx} style={{ display: 'flex' }}>
              <div style={cellStyle('transparent', 'none')}>
                <span style={{ color: 'var(--muted)', marginRight: 6, userSelect: 'none' }}>  </span>{row.text}
              </div>
              <div style={{ width: '1px', background: 'var(--border)', flexShrink: 0 }} />
              <div style={cellStyle('transparent', 'none')}>
                <span style={{ color: 'var(--muted)', marginRight: 6, userSelect: 'none' }}>  </span>{row.text}
              </div>
            </div>
          );
        }
        if (row.kind === 'changed') {
          return (
            <div key={idx} style={{ display: 'flex' }}>
              <div style={cellStyle('rgba(239,68,68,0.12)', '3px solid rgba(239,68,68,0.5)')}>
                <span style={{ color: 'var(--error)', marginRight: 6, userSelect: 'none' }}>-</span>{row.leftText}
              </div>
              <div style={{ width: '1px', background: 'var(--border)', flexShrink: 0 }} />
              <div style={cellStyle('rgba(34,197,94,0.12)', '3px solid rgba(34,197,94,0.5)')}>
                <span style={{ color: 'var(--success)', marginRight: 6, userSelect: 'none' }}>+</span>{row.rightText}
              </div>
            </div>
          );
        }
        if (row.kind === 'removed') {
          return (
            <div key={idx} style={{ display: 'flex' }}>
              <div style={cellStyle('rgba(239,68,68,0.12)', '3px solid rgba(239,68,68,0.5)')}>
                <span style={{ color: 'var(--error)', marginRight: 6, userSelect: 'none' }}>-</span>{row.text}
              </div>
              <div style={{ width: '1px', background: 'var(--border)', flexShrink: 0 }} />
              <div style={cellStyle('transparent', 'none')} />
            </div>
          );
        }
        // added
        return (
          <div key={idx} style={{ display: 'flex' }}>
            <div style={cellStyle('transparent', 'none')} />
            <div style={{ width: '1px', background: 'var(--border)', flexShrink: 0 }} />
            <div style={cellStyle('rgba(34,197,94,0.12)', '3px solid rgba(34,197,94,0.5)')}>
              <span style={{ color: 'var(--success)', marginRight: 6, userSelect: 'none' }}>+</span>{row.text}
            </div>
          </div>
        );
      })}
    </div>
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
  onUseAsInput,
  onExtract,
  onboardTextarea,
  onboardRunButton,
}: {
  label: string;
  state: PaneState;
  onChange: (value: string) => void;
  onRun: (toolId: string) => void;
  onUseAsInput: (text: string) => void;
  onExtract?: () => void;
  onboardTextarea?: boolean;
  onboardRunButton?: boolean;
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

  const significant = state.detectedTools.filter((r) => r.confidence >= 0.3 && r.toolId !== 'extract-sections');

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
        <div className="flex items-center gap-2">
          {onExtract && state.input.trim() && (
            <button
              onClick={onExtract}
              title="Extract sections from this pane"
              className="text-xs px-2 py-0.5 rounded font-medium"
              style={{
                background: 'rgba(74,222,128,0.12)',
                color: 'var(--green)',
                border: '1px solid rgba(74,222,128,0.3)',
                cursor: 'pointer',
              }}
            >
              Extract
            </button>
          )}
          {state.input.trim() && (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {state.input.length.toLocaleString()} chars
            </span>
          )}
        </div>
      </div>

      {/* Input area */}
      <textarea
        {...(onboardTextarea ? { 'data-onboard-split-input': true } : {})}
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
                Detect:
              </span>
              {significant.slice(0, 4).map((r) => (
                <button
                  key={r.toolId}
                  {...(onboardRunButton && r === significant[0] ? { 'data-onboard-split-run': true } : {})}
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
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onUseAsInput(state.output)}
                  title="Use output as input and re-detect"
                  className="text-xs px-2 py-0.5 rounded flex items-center gap-1"
                  style={{
                    color: 'var(--green)',
                    border: '1px solid var(--green-dim)',
                    background: 'var(--green-bg)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font)',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                  use as input
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(state.output).catch(() => {});
                  }}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ color: 'var(--muted)', border: '1px solid var(--border)', cursor: 'pointer' }}
                >
                  Copy
                </button>
              </div>
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClose,
  initialInput,
  initialOutput,
  initialOutputLanguage,
  initialToolId,
  initialInputRight,
  onPaneChange,
}: {
  onClose?: () => void;
  initialInput?: string;
  initialOutput?: string;
  initialOutputLanguage?: string;
  initialToolId?: string | null;
  initialInputRight?: string;
  onPaneChange?: (leftInput: string, rightInput: string) => void;
}) {
  const [left, setLeft] = useState<PaneState>(() =>
    initialInput
      ? makePane(initialInput, initialOutput ?? '', initialOutputLanguage, initialToolId)
      : emptyPane()
  );
  const [right, setRight] = useState<PaneState>(() =>
    initialInputRight ? makePane(initialInputRight, '') : emptyPane()
  );
  const [diffVisible, setDiffVisible] = useState(false);
  const [diffMode, setDiffMode] = useState<'unified' | 'split'>('unified');

  // Extract popup state — which pane is being extracted
  const [extractPane, setExtractPane] = useState<'left' | 'right' | null>(null);
  const extractSectionsForPane = extractPane === 'left'
    ? extractSections(left.input)
    : extractPane === 'right'
    ? extractSections(right.input)
    : [];

  const handleExtractConfirm = useCallback((picked: ExtractedSection[]) => {
    if (!extractPane || picked.length === 0) return;
    const joined = picked.map((s) => s.content).join('\n\n');
    const setter = extractPane === 'left' ? setLeft : setRight;
    setter((p) => ({ ...p, output: joined, outputLanguage: undefined, error: undefined }));
    setExtractPane(null);
  }, [extractPane]);

  // Detect numeric inputs for logic operator bar
  const leftNumVal = parseNumericInput(left.input);
  const rightNumVal = parseNumericInput(right.input);
  const bothNumeric = leftNumVal !== null && rightNumVal !== null;

  // Update pane input + run detection
  const handleChange = useCallback(
    (side: 'left' | 'right', value: string) => {
      const detectionResults = runDetection(value);
      const detectedTools = detectionResults
        .filter((r) => r.confidence >= 0.1)
        .map((r) => ({ toolId: r.toolId, toolName: r.toolName, confidence: r.confidence }));

      if (side === 'left') {
        setLeft((p) => { onPaneChange?.(value, right.input); return { ...p, input: value, detectedTools, output: '', error: undefined, activeToolId: null }; });
      } else {
        setRight((p) => { onPaneChange?.(left.input, value); return { ...p, input: value, detectedTools, output: '', error: undefined, activeToolId: null }; });
      }
      setDiffVisible(false);
    },
    [left.input, right.input, onPaneChange]
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

  // Use output as new input for a pane
  const handleUseAsInput = useCallback((side: 'left' | 'right', text: string) => {
    const detectionResults = runDetection(text);
    const detectedTools = detectionResults
      .filter((r) => r.confidence >= 0.1)
      .map((r) => ({ toolId: r.toolId, toolName: r.toolName, confidence: r.confidence }));
    const newPane: PaneState = {
      input: text,
      output: '',
      outputLanguage: undefined,
      error: undefined,
      detectedTools,
      activeToolId: null,
      isRunning: false,
    };
    if (side === 'left') {
      setLeft(newPane);
      onPaneChange?.(text, right.input);
    } else {
      setRight(newPane);
      onPaneChange?.(left.input, text);
    }
    setDiffVisible(false);
  }, [left.input, right.input, onPaneChange]);

  // Determine what to diff: prefer formatted output, fall back to raw input
  const leftText = normalizeForDiff(left.output || left.input);
  const rightText = normalizeForDiff(right.output || right.input);
  const canDiff = !!(leftText.trim() || rightText.trim());

  return (
    <div className="flex flex-col gap-3 w-full" style={{ flex: 1, minHeight: 0 }}>
      {/* Header bar */}
      <div className="flex items-center shrink-0">
        <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
          Split &amp; Diff
        </span>
      </div>

      {/* Diff action row */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          data-onboard-split-diff
          onClick={() => {
            setDiffVisible((v) => !v);
          }}
          disabled={!canDiff}
          className="text-xs px-4 py-1.5 rounded font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity"
          style={{ background: 'var(--primary)', color: '#fff' }}
        >
          {diffVisible ? 'Hide Diff' : 'Compare Diff'}
        </button>

        {diffVisible && (
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
            <button
              onClick={() => setDiffMode('unified')}
              title="Unified diff"
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '11px', fontFamily: 'var(--font)', fontWeight: diffMode === 'unified' ? 700 : 400,
                color: diffMode === 'unified' ? 'var(--green)' : 'var(--muted)',
                background: diffMode === 'unified' ? 'var(--green-bg)' : 'none',
                border: 'none', cursor: 'pointer', padding: '4px 9px',
                transition: 'background .1s, color .1s',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
              </svg>
              Unified
            </button>
            <div style={{ width: '1px', background: 'var(--border)', alignSelf: 'stretch' }} />
            <button
              onClick={() => setDiffMode('split')}
              title="Split diff"
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '11px', fontFamily: 'var(--font)', fontWeight: diffMode === 'split' ? 700 : 400,
                color: diffMode === 'split' ? 'var(--green)' : 'var(--muted)',
                background: diffMode === 'split' ? 'var(--green-bg)' : 'none',
                border: 'none', cursor: 'pointer', padding: '4px 9px',
                transition: 'background .1s, color .1s',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>
              </svg>
              Split
            </button>
          </div>
        )}

        {diffVisible && (
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            Comparing {left.output ? 'formatted' : 'raw'} left vs {right.output ? 'formatted' : 'raw'} right
          </span>
        )}
      </div>

      {/* Panes + optional compare — resizable when diff is open */}
      {diffVisible ? (
        <ResizablePanels
          initialTopFlex={1.5}
          minTopPx={160}
          minBottomPx={80}
          top={
            <div className="flex flex-col h-full" style={{ gap: 12 }}>
              {/* Two panes side by side */}
              <div className="flex gap-3 flex-1" style={{ minHeight: 0 }}>
                <EditorPane
                  label="Left"
                  state={left}
                  onChange={(v) => handleChange('left', v)}
                  onRun={(id) => handleRun('left', id)}
                  onUseAsInput={(text) => handleUseAsInput('left', text)}
                  onExtract={() => setExtractPane('left')}
                />
                <EditorPane
                  label="Right"
                  state={right}
                  onChange={(v) => handleChange('right', v)}
                  onRun={(id) => handleRun('right', id)}
                  onUseAsInput={(text) => handleUseAsInput('right', text)}
                  onExtract={() => setExtractPane('right')}
                  onboardTextarea
                  onboardRunButton
                />
              </div>
              {/* Logic operator bar */}
              {bothNumeric && leftNumVal !== null && rightNumVal !== null && (
                <LogicOpBar leftVal={leftNumVal} rightVal={rightNumVal} />
              )}
            </div>
          }
          bottom={
            <div
              className="rounded-lg overflow-auto h-full"
              style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
            >
              {leftText.trim() === '' && rightText.trim() === '' ? (
                <p className="text-xs p-4" style={{ color: 'var(--muted)' }}>Both panes are empty.</p>
              ) : diffMode === 'unified' ? (
                <UnifiedDiffView left={leftText} right={rightText} />
              ) : (
                <SplitDiffView left={leftText} right={rightText} />
              )}
            </div>
          }
        />
      ) : (
        <div className="flex flex-col flex-1" style={{ gap: 12, minHeight: 0 }}>
          {/* Two panes side by side */}
          <div className="flex gap-3 flex-1" style={{ minHeight: 0 }}>
            <EditorPane
              label="Left"
              state={left}
              onChange={(v) => handleChange('left', v)}
              onRun={(id) => handleRun('left', id)}
              onUseAsInput={(text) => handleUseAsInput('left', text)}
              onExtract={() => setExtractPane('left')}
            />
            <EditorPane
              label="Right"
              state={right}
              onChange={(v) => handleChange('right', v)}
              onRun={(id) => handleRun('right', id)}
              onUseAsInput={(text) => handleUseAsInput('right', text)}
              onExtract={() => setExtractPane('right')}
              onboardTextarea
              onboardRunButton
            />
          </div>
          {/* Logic operator bar */}
          {bothNumeric && leftNumVal !== null && rightNumVal !== null && (
            <LogicOpBar leftVal={leftNumVal} rightVal={rightNumVal} />
          )}
        </div>
      )}

      {/* Section picker popup for pane extraction */}
      {extractPane !== null && extractSectionsForPane.length > 0 && (
        <SectionPickerPopup
          sections={extractSectionsForPane}
          onConfirm={handleExtractConfirm}
          onClose={() => setExtractPane(null)}
        />
      )}
    </div>
  );
}
