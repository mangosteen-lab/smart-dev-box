'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { runDetection, executeTool } from '@/lib/tools';

import '@/lib/tools';

const PLACEHOLDER = `Paste anything here — JSON, Base64, XML, timestamps, JWT tokens, UUIDs, URLs…`;

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/bmp', 'image/gif', 'image/tiff'];

/** Run Tesseract OCR on an image File/Blob. Returns extracted text. */
async function runOCR(
  imageSource: File | Blob,
  onProgress: (pct: number) => void
): Promise<string> {
  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng', 1, {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text') onProgress(Math.round(m.progress * 100));
    },
  });
  const url = URL.createObjectURL(imageSource);
  try {
    const { data } = await worker.recognize(url);
    return data.text.trim();
  } finally {
    URL.revokeObjectURL(url);
    await worker.terminate();
  }
}

// Rotating example snippets shown in empty state
const EXAMPLES: { label: string; hint: string; value: string }[] = [
  {
    label: 'JSON',
    hint: 'Format / inspect',
    value: '{"user":{"id":42,"name":"Ada Lovelace","roles":["admin","editor"],"active":true}}',
  },
  {
    label: 'Base64',
    hint: 'Decode',
    value: 'SGVsbG8gZnJvbSBTbWFydERldkJveA==',
  },
  {
    label: 'JWT',
    hint: 'Inspect claims',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  },
  {
    label: 'URL',
    hint: 'Parse & inspect',
    value: 'https://api.example.com/v2/users?page=1&limit=20&sort=created_at#results',
  },
  {
    label: 'Timestamp',
    hint: 'Convert to date',
    value: '1716825600',
  },
  {
    label: 'UUID',
    hint: 'Inspect',
    value: '550e8400-e29b-41d4-a716-446655440000',
  },
  {
    label: 'SQL',
    hint: 'Format',
    value: 'SELECT u.id,u.name,COUNT(o.id) AS orders FROM users u LEFT JOIN orders o ON o.user_id=u.id WHERE u.active=1 GROUP BY u.id ORDER BY orders DESC LIMIT 10',
  },
  {
    label: 'XML',
    hint: 'Format',
    value: '<catalog><book id="1"><title>Design Patterns</title><author>GoF</author><price>49.99</price></book></catalog>',
  },
];

export function UniversalInput() {
  const { input, setInput, setDetectionResults, addOutput, activeToolId, setIsAiLoading, aiEnabled } =
    useDevboxStore();
  const [command, setCommand] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [exampleIdx, setExampleIdx] = useState(0);
  const [ocrProgress, setOcrProgress] = useState<number | null>(null); // null = idle, 0-100 = running
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rotate example hint every 3 seconds when input is empty
  useEffect(() => {
    if (input) return;
    const id = setInterval(() => setExampleIdx((i) => (i + 1) % EXAMPLES.length), 3000);
    return () => clearInterval(id);
  }, [input]);

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

  /** OCR an image file and feed extracted text into the input pipeline */
  const handleImageFile = useCallback(async (file: File | Blob) => {
    setOcrProgress(0);
    try {
      const text = await runOCR(file, setOcrProgress);
      if (text) handleInputChange(text);
    } catch {
      // silently fall back — user can still type manually
    } finally {
      setOcrProgress(null);
    }
  }, [handleInputChange]);

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

  // Intercept clipboard image pastes
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (IMAGE_TYPES.includes(item.type)) {
          const blob = item.getAsFile();
          if (blob) {
            e.preventDefault();
            handleImageFile(blob);
            return;
          }
        }
      }
    };
    window.addEventListener('paste', handler);
    return () => window.removeEventListener('paste', handler);
  }, [handleImageFile]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (IMAGE_TYPES.includes(file.type)) {
      handleImageFile(file);
      return;
    }
    if (file.size > 1024 * 1024) {
      alert(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Please upload a file smaller than 1 MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => handleInputChange(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleClear = () => {
    setInput('');
    setDetectionResults([]);
  };

  const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (IMAGE_TYPES.includes(file.type)) {
      handleImageFile(file);
      e.target.value = '';
      return;
    }
    if (file.size > 1024 * 1024) {
      alert(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Please upload a file smaller than 1 MB.`);
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => handleInputChange(ev.target?.result as string);
    reader.readAsText(file);
    e.target.value = '';
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
        className={`relative flex-1 ${isDragging ? 'drop-zone-active' : 'drop-zone-idle'}`}
        style={{
          borderRadius: '4px',
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
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{
              color: 'var(--green)',
              fontSize: 'var(--fs-sm)',
              pointerEvents: 'none',
              background: 'rgba(10,10,10,0.7)',
              backdropFilter: 'blur(2px)',
              borderRadius: '4px',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span style={{ fontWeight: 600 }}>Drop file or image to load</span>
            <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text3)' }}>Text files (max 1 MB) · Images (OCR)</span>
          </div>
        )}
        {/* OCR progress overlay */}
        {ocrProgress !== null && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{
              color: 'var(--green)',
              fontSize: 'var(--fs-sm)',
              background: 'rgba(10,10,10,0.82)',
              backdropFilter: 'blur(2px)',
              borderRadius: '4px',
              pointerEvents: 'none',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
            </svg>
            <span style={{ fontWeight: 600 }}>Reading image…</span>
            <div style={{ width: '160px', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${ocrProgress}%`, height: '100%', background: 'var(--green)', borderRadius: '2px', transition: 'width .2s' }} />
            </div>
            <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text3)' }}>{ocrProgress}%</span>
          </div>
        )}
        {/* Empty-state example snippets */}
        {!input && !isDragging && (
          <div
            className="absolute"
            style={{ bottom: '12px', left: '14px', right: '14px', pointerEvents: 'none' }}
          >
            {/* Prominent Try button */}
            <div style={{ pointerEvents: 'auto', marginBottom: '10px' }}>
              <button
                onClick={() => {
                  const sample = EXAMPLES[0]; // JSON
                  setInput(sample.value);
                  setDetectionResults(runDetection(sample.value));
                  textareaRef.current?.focus();
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 16px', borderRadius: '6px',
                  background: 'var(--green-bg)', border: '1px solid var(--green-dim)',
                  color: 'var(--green)', cursor: 'pointer', fontFamily: 'var(--font)',
                  fontSize: 'var(--fs-xs)', fontWeight: 600,
                  transition: 'all .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.background = 'rgba(74,222,128,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--green-dim)'; e.currentTarget.style.background = 'var(--green-bg)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Try with sample JSON
              </button>
            </div>
            <div style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)', marginBottom: '6px' }}>
              or try another format:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', pointerEvents: 'auto' }}>
              {EXAMPLES.map((ex, i) => (
                <button
                  key={ex.label}
                  onClick={() => {
                    setInput(ex.value);
                    setDetectionResults(runDetection(ex.value));
                    textareaRef.current?.focus();
                  }}
                  style={{
                    fontSize: 'var(--fs-2xs)',
                    padding: '3px 9px',
                    borderRadius: '3px',
                    border: `1px solid ${i === exampleIdx ? 'var(--green-dim)' : 'var(--border)'}`,
                    color: i === exampleIdx ? 'var(--green)' : 'var(--text3)',
                    background: i === exampleIdx ? 'var(--green-bg)' : 'var(--bg2)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font)',
                    transition: 'all .15s',
                  }}
                >
                  {ex.label}
                  <span style={{ opacity: 0.55, marginLeft: '4px' }}>— {ex.hint}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hints bar */}
      <div
        className="flex items-center flex-wrap shrink-0"
        style={{
          gap: '8px',
          padding: '5px 10px',
          borderTop: '1px solid #111',
          fontSize: 'var(--fs-2xs)',
          color: 'var(--text4)',
        }}
      >
        {/* Hints — hidden on mobile to save space */}
        <span className="hidden md:flex items-center" style={{ gap: '4px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
          format auto-detected
        </span>
        <span className="hidden md:flex items-center" style={{ gap: '4px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          click chip to transform
        </span>
        <span className="hidden md:flex items-center" style={{ gap: '4px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
          </svg>
          ⌘↵ re-run tool
        </span>
        <span className="hidden md:flex items-center" style={{ gap: '4px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          drop file or image to load
        </span>
        {/* Actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span style={{ color: inputBytes > 512_000 ? 'var(--amber)' : 'var(--text4)', fontSize: 'var(--fs-2xs)', paddingRight: '6px' }}>
            {input.length.toLocaleString()} chars &nbsp;·&nbsp; {inputBytes > 1_048_576 ? (inputBytes / 1024 / 1024).toFixed(1) + ' MB' : (inputBytes / 1024).toFixed(1) + ' KB'}
          </span>
          <button onClick={handleClear} style={{ color: 'var(--text3)', background: 'none', border: '1px solid transparent', borderRadius: '5px', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 'var(--fs-xs)', display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 10px', minHeight: '36px' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--bg2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'none'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            clear
          </button>
          <label style={{ color: 'var(--text3)', background: 'none', border: '1px solid transparent', borderRadius: '5px', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 'var(--fs-xs)', display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 10px', minHeight: '36px' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--bg2)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'none'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            upload
            <input type="file" style={{ display: 'none' }} accept="text/*,.json,.xml,.sql,.csv,.log,.md,.txt,image/*" onChange={handleFileLoad} />
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
