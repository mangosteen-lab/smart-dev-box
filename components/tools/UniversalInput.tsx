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

  // Keyboard shortcut: Cmd/Ctrl+Enter to run active tool
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

  // Drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      handleInputChange(text);
    };
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
    <div className="flex flex-col gap-2">
      {/* Large input warning */}
      {isLarge && (
        <div
          className="text-xs px-3 py-1.5 rounded"
          style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.3)' }}
        >
          Large input ({(inputBytes / 1024 / 1024).toFixed(1)}MB) — performance may be affected
        </div>
      )}

      {/* Main textarea */}
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          border: isDragging
            ? '2px solid var(--primary)'
            : '1px solid var(--border)',
          background: 'var(--surface)',
          transition: 'border-color 0.15s',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={PLACEHOLDER}
          className="code-input w-full resize-none text-sm leading-relaxed outline-none bg-transparent p-3"
          style={{
            color: 'var(--foreground)',
            minHeight: '180px',
            maxHeight: '400px',
          }}
          spellCheck={false}
        />
        {isDragging && (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm font-medium"
            style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--primary)' }}
          >
            Drop file to load
          </div>
        )}
        <div
          className="flex items-center justify-between px-3 py-1.5 border-t text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
        >
          <span>{input.length.toLocaleString()} chars</span>
          <span>{(inputBytes / 1024).toFixed(1)} KB</span>
        </div>
      </div>

      {/* AI command bar */}
      {aiEnabled && (
        <div className="flex gap-2">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunCommand()}
            placeholder='Describe what you want, e.g. "format this as JSON" or "decode base64"'
            className="flex-1 text-sm px-3 py-1.5 rounded outline-none"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
            }}
          />
          <button
            onClick={handleRunCommand}
            className="text-xs px-3 py-1.5 rounded font-medium"
            style={{ background: 'var(--primary)', color: 'white' }}
          >
            Run
          </button>
        </div>
      )}
    </div>
  );
}
