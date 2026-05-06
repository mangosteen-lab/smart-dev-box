'use client';

import { useState, useEffect, useRef } from 'react';
import { useDevboxStore } from '@/store/devbox';

export function QrCodePanel() {
  const { input, setInput } = useDevboxStore();
  const [text, setText] = useState(input || 'https://example.com');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync from universal input when it has content
  useEffect(() => {
    if (input.trim()) setText(input.trim());
  }, [input]);

  useEffect(() => {
    if (!text.trim()) { setDataUrl(null); return; }
    (async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        const url = await QRCode.toDataURL(text, {
          width: size,
          errorCorrectionLevel: errorLevel,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' },
        });
        setDataUrl(url);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'QR generation failed');
        setDataUrl(null);
      }
    })();
  }, [text, size, errorLevel]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Input */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
          Content
        </label>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setInput(e.target.value); }}
          rows={3}
          className="code-input w-full resize-none text-sm leading-relaxed outline-none p-3 rounded-lg"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          placeholder="URL, text, or any data..."
          spellCheck={false}
        />
      </div>

      {/* Options */}
      <div className="flex gap-4 flex-wrap items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Size
          </label>
          <div className="flex gap-1">
            {[128, 256, 512].map((s) => (
              <button key={s} onClick={() => setSize(s)}
                className="text-xs px-3 py-1.5 rounded font-mono"
                style={{
                  background: size === s ? 'var(--primary)' : 'var(--surface-2)',
                  color: size === s ? 'white' : 'var(--muted)',
                  border: '1px solid var(--border)',
                }}>
                {s}px
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Error Correction
          </label>
          <div className="flex gap-1">
            {(['L', 'M', 'Q', 'H'] as const).map((l) => (
              <button key={l} onClick={() => setErrorLevel(l)}
                className="text-xs px-3 py-1.5 rounded font-mono"
                style={{
                  background: errorLevel === l ? 'var(--primary)' : 'var(--surface-2)',
                  color: errorLevel === l ? 'white' : 'var(--muted)',
                  border: '1px solid var(--border)',
                }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output */}
      {error && (
        <p className="text-sm" style={{ color: 'var(--error)' }}>Error: {error}</p>
      )}
      {dataUrl && (
        <div className="flex flex-col gap-2 items-start">
          <div className="rounded-lg overflow-hidden p-4 bg-white inline-block"
            style={{ border: '1px solid var(--border)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt="QR Code" width={size} height={size} />
          </div>
          <button
            onClick={handleDownload}
            className="text-xs px-3 py-1.5 rounded font-medium"
            style={{ background: 'var(--primary)', color: 'white' }}
          >
            Download PNG
          </button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
