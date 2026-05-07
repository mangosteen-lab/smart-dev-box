'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { runDetection, executeTool } from '@/lib/tools';

import '@/lib/tools';

const PLACEHOLDER = `Paste anything here — JSON, Base64, XML, timestamps, JWT tokens, UUIDs, URLs...`;

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

  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (activeToolId && input.trim()) {
          const result = await executeTool(activeToolId, input);
          addOutput({ toolId: activeToolId, toolName: activeToolId, result, timestamp: Date.now() });
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
    if (file.size > 1024 * 1024) {
      alert(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Please upload a file smaller than 1 MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => handleInputChange(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(input);
  };

  const handleClear = () => {
    setInput('');
    setDetectionResults([]);
  };

  const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      alert(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Please upload a file smaller than 1 MB.`);
      e.target.value = '';
      return;
    }
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
    <div className="flex flex-col h-full">
      {isLarge && (
        <div
          style={{
            margin: '8px 10px 0',
            padding: '6px 10px',
            background: 'var(--warning-muted)',
            color: 'var(--amber)',
            border: '1px solid rgba(251,191,36,0.25)',
            borderRadius: '4px',
            fontSize: 'var(--fs-xs)',
          }}
        >
          ⚠ Large input ({(inputBytes / 1024 / 1024).toFixed(1)} MB) — performance may be affected
        </div>
      )}

      {/* Textarea */}
      <div
        className="relative flex-1"
        style={{
          border: isDragging ? '1px solid var(--green)' : 'none',
          background: isDragging ? 'rgba(74,222,128,0.04)' : 'transparent',
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
          className="w-full h-full resize-none outline-none"
          style={{
            color: 'var(--text)',
            background: 'transparent',
            fontSize: 'var(--fs-xs)',
            fontFamily: 'var(--font)',
            lineHeight: '1.7',
            caretColor: 'var(--green)',
            padding: '14px',
          }}
          spellCheck={false}
        />
        {isDragging && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ color: 'var(--green)', fontSize: 'var(--fs-sm)', pointerEvents: 'none' }}
          >
            <span style={{ fontSize: '24px' }}>↓</span>
            Drop file to load
          </div>
        )}
      </div>

      {/* Hints bar */}
      <div
        className="flex items-center flex-wrap shrink-0"
        style={{
          gap: '12px',
          padding: '5px 10px',
          borderTop: '1px solid #111',
          fontSize: 'var(--fs-2xs)',
          color: 'var(--text4)',
        }}
      >
        <span className="flex items-center" style={{ gap: '4px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          format auto-detected
        </span>
        <span className="flex items-center" style={{ gap: '4px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          click chip to transform
        </span>
        <span className="flex items-center" style={{ gap: '4px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
          </svg>
          ⌘↵ re-run tool
        </span>
        <span className="flex items-center" style={{ gap: '4px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          drop file to load
        </span>
        {/* Actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span style={{ color: 'var(--text4)', fontSize: 'var(--fs-2xs)', paddingRight: '6px' }}>
            {input.length.toLocaleString()} chars &nbsp;·&nbsp; {(inputBytes / 1024).toFixed(1)} KB
          </span>
          <button onClick={handleCopy} style={{ color: 'var(--text3)', background: 'none', border: '1px solid transparent', borderRadius: '5px', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 'var(--fs-xs)', display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--bg2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'none'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            copy
          </button>
          <button onClick={handleClear} style={{ color: 'var(--text3)', background: 'none', border: '1px solid transparent', borderRadius: '5px', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 'var(--fs-xs)', display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--bg2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'none'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            clear
          </button>
          <label style={{ color: 'var(--text3)', background: 'none', border: '1px solid transparent', borderRadius: '5px', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 'var(--fs-xs)', display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--bg2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'none'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            upload
            <input type="file" style={{ display: 'none' }} onChange={handleFileLoad} />
          </label>
        </div>
      </div>

      {/* AI command bar */}
      {aiEnabled && (
        <div
          className="flex shrink-0"
          style={{
            borderTop: '1px solid var(--border)',
            background: 'var(--bg2)',
          }}
        >
          <div className="flex items-center px-3" style={{ color: 'var(--purple)', fontSize: 'var(--fs-md)' }}>✦</div>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunCommand()}
            placeholder='Ask AI — e.g. "format as JSON" or "decode this base64"'
            className="flex-1 py-2 outline-none"
            style={{
              background: 'transparent',
              color: 'var(--text)',
              fontSize: 'var(--fs-xs)',
              fontFamily: 'var(--font)',
            }}
          />
          <button
            onClick={handleRunCommand}
            style={{
              margin: '5px 6px',
              padding: '3px 12px',
              background: 'var(--purple-dim)',
              color: 'var(--purple)',
              border: '1px solid rgba(167,139,250,0.3)',
              borderRadius: '4px',
              fontSize: 'var(--fs-xs)',
              fontFamily: 'var(--font)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Run AI
          </button>
        </div>
      )}
    </div>
  );
}
