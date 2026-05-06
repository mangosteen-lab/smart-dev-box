'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { runDetection, executeTool } from '@/lib/tools';

// Ensure tools are registered when this component loads
import '@/lib/tools';

const PLACEHOLDER = `Paste anything here — JSON, Base64, XML, timestamps, JWT tokens, URLs...

Or just describe what you want in the command bar below.`;

export function UniversalInput() {
  const { input, setInput, setDetectionResults, addOutput, activeToolId, setIsAiLoading, aiEnabled } =
    useDevboxStore();
  const [command, setCommand] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inputBytes = new TextEncoder().encode(input).length;
  const isLarge = inputBytes > 1_048_576;

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const results = runDetection(value);
        setDetectionResults(results);
      }, 300);
    },
    [setInput, setDetectionResults]
  );

  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (activeToolId && input.trim()) {
          const result = await executeTool(activeToolId, input);
          addOutput({
            toolId: activeToolId,
            toolName: activeToolId,
            result,
            timestamp: Date.now(),
          });
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeToolId, input, addOutput]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handleInputChange(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleRunCommand = async () => {
    if (!command.trim() || !aiEnabled) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, userCommand: command }),
      });
      const data = await res.json();
      if (data.toolId) {
        const effectiveInput = data.correctedInput || input;
        if (data.correctedInput) setInput(data.correctedInput);
        useDevboxStore.getState().setActiveToolId(data.toolId);
        const result = await executeTool(data.toolId, effectiveInput);
        addOutput({
          toolId: data.toolId,
          toolName: data.toolId,
          result: { ...result, aiAssisted: true },
          timestamp: Date.now(),
          aiAssisted: true,
        });
      }
    } catch {
      // silently fail
    } finally {
      setIsAiLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-3">
      {/* Large input warning */}
      {isLarge && (
        <div
          className="px-4 py-2.5 rounded-lg flex items-center gap-2"
          style={{
            background: 'var(--warning-muted)',
            color: 'var(--warning)',
            border: '1px solid rgba(245,158,11,0.25)',
            fontSize: '13px',
          }}
        >
          <span>⚠</span>
          Large input ({(inputBytes / 1024 / 1024).toFixed(1)}MB) — performance may be affected
        </div>
      )}

      {/* Main textarea card */}
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-150"
        style={{
          border: isDragging
            ? '2px solid var(--primary)'
            : isFocused
            ? '2px solid var(--primary)'
            : '2px solid var(--border)',
          background: 'var(--surface-2)',
          boxShadow: isFocused ? '0 0 0 4px var(--primary-glow)' : 'var(--shadow-sm)',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={PLACEHOLDER}
          className="code-input w-full resize-none leading-relaxed outline-none px-4 pt-4 pb-3"
          style={{
            color: 'var(--input-text)',
            background: 'transparent',
            fontSize: '14px',
            minHeight: '200px',
            maxHeight: '440px',
          }}
          spellCheck={false}
        />
        {isDragging && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 font-medium"
            style={{ background: 'rgba(99,102,241,0.08)', color: 'var(--primary)', fontSize: '15px' }}
          >
            <span style={{ fontSize: '28px' }}>↓</span>
            Drop file to load
          </div>
        )}
        {/* Footer bar */}
        <div
          className="flex items-center justify-between px-4 py-2 border-t"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--muted)', fontSize: '12px' }}
        >
          <div className="flex items-center gap-3">
            <span>{input.length.toLocaleString()} chars</span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span>{(inputBytes / 1024).toFixed(1)} KB</span>
          </div>
          {activeToolId && (
            <span
              className="px-2.5 py-0.5 rounded-md font-medium"
              style={{
                background: 'var(--primary-muted)',
                color: 'var(--primary)',
                fontSize: '11px',
              }}
            >
              ⌘↵ to run
            </span>
          )}
        </div>
      </div>

      {/* AI command bar */}
      {aiEnabled && (
        <div
          className="flex gap-2 rounded-xl overflow-hidden"
          style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            className="flex items-center px-3.5 shrink-0"
            style={{ color: 'var(--accent)', fontSize: '16px' }}
          >
            ✦
          </div>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunCommand()}
            placeholder='Describe what you want, e.g. "format this as JSON" or "decode base64"'
            className="flex-1 py-3 outline-none bg-transparent"
            style={{ color: 'var(--foreground)', fontSize: '14px' }}
          />
          <button
            onClick={handleRunCommand}
            className="font-semibold shrink-0 transition-all hover:opacity-90 m-1.5 px-5 py-2 rounded-lg"
            style={{
              background: 'var(--gradient-brand)',
              color: 'white',
              boxShadow: '0 2px 8px var(--primary-glow)',
              fontSize: '13px',
            }}
          >
            Run AI
          </button>
        </div>
      )}
    </div>
  );
}
