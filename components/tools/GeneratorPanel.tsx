'use client';

import { useState } from 'react';
import { useDevboxStore } from '@/store/devbox';

// ── Clipboard helper ──────────────────────────────────────────────────────────

function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text);
  } else {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

// ── ResultBox ─────────────────────────────────────────────────────────────────

function ResultBox({ value, onUse }: { value: string; onUse: (v: string) => void }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="rounded mt-3" style={{ border: '1px solid var(--border)', background: 'var(--surface-2)' }}>
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b text-xs"
        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
      >
        <span>Result</span>
        <div className="flex gap-2">
          <button
            onClick={() => { copyToClipboard(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="px-2 py-0.5 rounded text-xs hover:opacity-80 transition-opacity"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={() => onUse(value)}
            className="px-2 py-0.5 rounded text-xs hover:opacity-80 transition-opacity font-medium"
            style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: 'var(--primary)' }}
            title="Send to paste area to apply further tools"
          >
            Use as input →
          </button>
        </div>
      </div>
      <pre
        className="p-3 text-xs font-mono overflow-auto"
        style={{ color: 'var(--foreground)', maxHeight: '260px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
      >
        {value}
      </pre>
    </div>
  );
}

// ── NumberInput — free typing, clamp only on blur / Enter ─────────────────────

function NumberInput({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const [raw, setRaw] = useState(String(value));

  const commit = (str: string) => {
    const n = parseInt(str, 10);
    const clamped = isNaN(n) ? min : Math.min(max, Math.max(min, n));
    setRaw(String(clamped));
    onChange(clamped);
  };

  return (
    <label className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
      <span className="shrink-0">{label}</span>
      <input
        type="number"
        value={raw}
        min={min}
        max={max}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') commit((e.target as HTMLInputElement).value); }}
        className="w-24 px-2 py-1 rounded text-xs outline-none"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
      />
    </label>
  );
}

// ── Generate button ───────────────────────────────────────────────────────────

function GenerateButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-4 py-1.5 rounded text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      style={{ background: 'var(--primary)', color: '#fff' }}
    >
      {loading ? 'Generating…' : 'Generate'}
    </button>
  );
}

// ── Generation logic (inlined — no registry dependency) ───────────────────────

function uuidv4Bytes(): Uint8Array {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant bits
  return bytes;
}

function uuidBytesToHyphen(bytes: Uint8Array): string {
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

export type UuidFormat   = 'hyphens' | 'braces' | 'no-hyphens';
export type UuidEncoding = 'none' | 'uppercase' | 'base64' | 'rfc7515' | 'urlencode';

function applyUuidFormat(bytes: Uint8Array, format: UuidFormat, uppercase: boolean, quotes: boolean, encoding: UuidEncoding): string {
  if (encoding === 'base64') {
    const b64 = btoa(String.fromCharCode(...bytes));
    return quotes ? `"${b64}"` : b64;
  }
  if (encoding === 'rfc7515') {
    // URL-safe base64, no padding
    const b64 = btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return quotes ? `"${b64}"` : b64;
  }

  let str = uuidBytesToHyphen(bytes);
  if (uppercase) str = str.toUpperCase();
  if (format === 'braces') str = `{${str}}`;
  else if (format === 'no-hyphens') str = str.replace(/-/g, '');
  if (quotes) str = `"${str}"`;
  if (encoding === 'urlencode') str = encodeURIComponent(str);
  return str;
}

function generateUuids(count: number, format: UuidFormat, uppercase: boolean, quotes: boolean, encoding: UuidEncoding): string {
  const results: string[] = [];
  for (let i = 0; i < count; i++) results.push(applyUuidFormat(uuidv4Bytes(), format, uppercase, quotes, encoding));
  return results.join('\n');
}

function encodeUlid(timestampMs: number, randomBytes: Uint8Array): string {
  const CHARS = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const result = new Array(26);
  let ts = timestampMs;
  for (let i = 9; i >= 0; i--) { result[i] = CHARS[ts % 32]; ts = Math.floor(ts / 32); }
  let ri = 0, buf = 0, bufBits = 0;
  for (let i = 10; i < 26; i++) {
    while (bufBits < 5) { buf = (buf << 8) | randomBytes[ri++]; bufBits += 8; }
    bufBits -= 5;
    result[i] = CHARS[(buf >> bufBits) & 0x1f];
  }
  return result.join('');
}

function generateUlids(count: number): string {
  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    results.push(encodeUlid(Date.now(), crypto.getRandomValues(new Uint8Array(10))));
  }
  return results.join('\n');
}

const CHARSETS_MAP: Record<string, string> = {
  alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  numeric: '0123456789',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  hex: '0123456789abcdef',
  symbols: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?',
};

function generateRandomValues(length: number, count: number, charset: string): string {
  const chars = CHARSETS_MAP[charset] ?? CHARSETS_MAP.alphanumeric;
  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    results.push(Array.from(bytes, (b) => chars[b % chars.length]).join(''));
  }
  return results.join('\n');
}

const LOREM_WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do',
  'eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim',
  'ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi',
  'aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit',
  'voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint',
  'occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt',
  'mollit','anim','id','est','laborum',
];

function loremSentence(): string {
  const wc = 7 + Math.floor(Math.random() * 6);
  const words = Array.from({ length: wc }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function generateLorem(mode: string, count: number): string {
  if (mode === 'words') {
    return Array.from({ length: count }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]).join(' ');
  }
  if (mode === 'sentences') {
    return Array.from({ length: count }, loremSentence).join(' ');
  }
  // paragraphs
  return Array.from({ length: count }, () =>
    Array.from({ length: 4 + Math.floor(Math.random() * 3) }, loremSentence).join(' ')
  ).join('\n\n');
}

// ── Pure-JS SHA implementations (no crypto.subtle — works on HTTP) ────────────

function sha1(str: string): string {
  function rotl(n: number, s: number) { return (n << s) | (n >>> (32 - s)); }
  function toHex32(n: number) {
    let s = '';
    for (let i = 28; i >= 0; i -= 4) s += '0123456789abcdef'[(n >>> i) & 0xf];
    return s;
  }
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c < 128) { bytes.push(c); }
    else if (c < 2048) { bytes.push((c >> 6) | 192, (c & 63) | 128); }
    else { bytes.push((c >> 12) | 224, ((c >> 6) & 63) | 128, (c & 63) | 128); }
  }
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 56; i >= 0; i -= 8) bytes.push((bitLen / Math.pow(2, i)) & 0xff);
  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0;
  for (let i = 0; i < bytes.length; i += 64) {
    const w: number[] = [];
    for (let j = 0; j < 16; j++)
      w[j] = (bytes[i+j*4] << 24) | (bytes[i+j*4+1] << 16) | (bytes[i+j*4+2] << 8) | bytes[i+j*4+3];
    for (let j = 16; j < 80; j++) w[j] = rotl(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
    let [a, b, c, d, e] = [h0, h1, h2, h3, h4];
    for (let j = 0; j < 80; j++) {
      let f, k;
      if (j < 20)      { f = (b & c) | (~b & d); k = 0x5a827999; }
      else if (j < 40) { f = b ^ c ^ d;           k = 0x6ed9eba1; }
      else if (j < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8f1bbcdc; }
      else             { f = b ^ c ^ d;           k = 0xca62c1d6; }
      const temp = (rotl(a, 5) + f + e + k + w[j]) | 0;
      e = d; d = c; c = rotl(b, 30); b = a; a = temp;
    }
    h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0; h4 = (h4 + e) | 0;
  }
  return toHex32(h0) + toHex32(h1) + toHex32(h2) + toHex32(h3) + toHex32(h4);
}

function sha256(str: string): string {
  const K = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
  ];
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c < 128) { bytes.push(c); }
    else if (c < 2048) { bytes.push((c >> 6) | 192, (c & 63) | 128); }
    else { bytes.push((c >> 12) | 224, ((c >> 6) & 63) | 128, (c & 63) | 128); }
  }
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 56; i >= 0; i -= 8) bytes.push((bitLen / Math.pow(2, i)) & 0xff);
  let h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));
  for (let i = 0; i < bytes.length; i += 64) {
    const w: number[] = [];
    for (let j = 0; j < 16; j++)
      w[j] = (bytes[i+j*4] << 24) | (bytes[i+j*4+1] << 16) | (bytes[i+j*4+2] << 8) | bytes[i+j*4+3];
    for (let j = 16; j < 64; j++) {
      const s0 = rotr(w[j-15],7) ^ rotr(w[j-15],18) ^ (w[j-15] >>> 3);
      const s1 = rotr(w[j-2],17) ^ rotr(w[j-2],19)  ^ (w[j-2] >>> 10);
      w[j] = (w[j-16] + s0 + w[j-7] + s1) | 0;
    }
    let [a,b,c,d,e,f,g,hh] = h;
    for (let j = 0; j < 64; j++) {
      const S1 = rotr(e,6) ^ rotr(e,11) ^ rotr(e,25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K[j] + w[j]) | 0;
      const S0 = rotr(a,2) ^ rotr(a,13) ^ rotr(a,22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) | 0;
      hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    h = [h[0]+a,h[1]+b,h[2]+c,h[3]+d,h[4]+e,h[5]+f,h[6]+g,h[7]+hh].map(x => x | 0);
  }
  return h.map(x => (x >>> 0).toString(16).padStart(8,'0')).join('');
}

function generateHashes(text: string): string {
  return [
    `SHA-1:   ${sha1(text)}`,
    `SHA-256: ${sha256(text)}`,
  ].join('\n');
}

// ── Toggle chip ───────────────────────────────────────────────────────────────

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1 rounded text-xs transition-colors"
      style={{
        background: active ? 'rgba(59,130,246,0.18)' : 'var(--surface-2)',
        border: `1px solid ${active ? 'rgba(59,130,246,0.5)' : 'var(--border)'}`,
        color: active ? 'var(--primary)' : 'var(--muted)',
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}

// ── Individual generator sections ─────────────────────────────────────────────

function UuidSection({ onUse }: { onUse: (v: string) => void }) {
  const [count, setCount]       = useState(1);
  const [format, setFormat]     = useState<UuidFormat>('hyphens');
  const [uppercase, setUppercase] = useState(false);
  const [quotes, setQuotes]     = useState(false);
  const [encoding, setEncoding] = useState<UuidEncoding>('none');
  const [result, setResult]     = useState('');

  const run = () => setResult(generateUuids(count, format, uppercase, quotes, encoding));

  const encodingDisabled = encoding !== 'none';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <NumberInput label="Count" value={count} min={1} max={1000} onChange={setCount} />
      </div>

      {/* Format */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Format</span>
        <div className="flex flex-wrap gap-2">
          <ToggleChip label="Hyphens"    active={format === 'hyphens'}    onClick={() => setFormat('hyphens')} />
          <ToggleChip label="{} Braces"  active={format === 'braces'}     onClick={() => setFormat('braces')} />
          <ToggleChip label="No hyphens" active={format === 'no-hyphens'} onClick={() => setFormat('no-hyphens')} />
          <ToggleChip label="Uppercase"  active={uppercase && !encodingDisabled} onClick={() => !encodingDisabled && setUppercase(u => !u)} />
          <ToggleChip label={'"" Quotes'} active={quotes}                 onClick={() => setQuotes(q => !q)} />
        </div>
      </div>

      {/* Encoding */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Encoding</span>
        <div className="flex flex-wrap gap-2">
          <ToggleChip label="None"       active={encoding === 'none'}      onClick={() => setEncoding('none')} />
          <ToggleChip label="Base64"     active={encoding === 'base64'}    onClick={() => { setEncoding('base64'); setUppercase(false); }} />
          <ToggleChip label="RFC 7515"   active={encoding === 'rfc7515'}   onClick={() => { setEncoding('rfc7515'); setUppercase(false); }} />
          <ToggleChip label="URL Encode" active={encoding === 'urlencode'} onClick={() => setEncoding('urlencode')} />
        </div>
      </div>

      <div>
        <GenerateButton onClick={run} loading={false} />
      </div>
      {result && <ResultBox value={result} onUse={onUse} />}
    </div>
  );
}

function UlidSection({ onUse }: { onUse: (v: string) => void }) {
  const [count, setCount] = useState(1);
  const [result, setResult] = useState('');

  const run = () => setResult(generateUlids(count));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 flex-wrap">
        <NumberInput label="Count" value={count} min={1} max={1000} onChange={setCount} />
        <GenerateButton onClick={run} loading={false} />
      </div>
      {result && <ResultBox value={result} onUse={onUse} />}
    </div>
  );
}

const CHARSETS = ['alphanumeric', 'alpha', 'numeric', 'lowercase', 'uppercase', 'hex', 'symbols'] as const;
type Charset = typeof CHARSETS[number];

function RandomTextSection({ onUse }: { onUse: (v: string) => void }) {
  const [length, setLength] = useState(32);
  const [count, setCount] = useState(1);
  const [charset, setCharset] = useState<Charset>('alphanumeric');
  const [result, setResult] = useState('');

  const run = () => setResult(generateRandomValues(length, count, charset));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3 items-center">
        <NumberInput label="Length" value={length} min={1} max={4096} onChange={setLength} />
        <NumberInput label="Count" value={count} min={1} max={100} onChange={setCount} />
        <label className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
          <span>Charset</span>
          <select
            value={charset}
            onChange={(e) => setCharset(e.target.value as Charset)}
            className="px-2 py-1 rounded text-xs outline-none"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            {CHARSETS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <GenerateButton onClick={run} loading={false} />
      </div>
      {result && <ResultBox value={result} onUse={onUse} />}
    </div>
  );
}

const LOREM_MODES = ['paragraphs', 'sentences', 'words'] as const;
type LoremMode = typeof LOREM_MODES[number];

function LoremIpsumSection({ onUse }: { onUse: (v: string) => void }) {
  const [mode, setMode] = useState<LoremMode>('paragraphs');
  const [count, setCount] = useState(3);
  const [result, setResult] = useState('');

  const run = () => setResult(generateLorem(mode, count));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
          <span>Mode</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as LoremMode)}
            className="px-2 py-1 rounded text-xs outline-none"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            {LOREM_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <NumberInput label="Count" value={count} min={1} max={100} onChange={setCount} />
        <GenerateButton onClick={run} loading={false} />
      </div>
      {result && <ResultBox value={result} onUse={onUse} />}
    </div>
  );
}

function HashSection({ onUse }: { onUse: (v: string) => void }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  const run = () => {
    if (!text.trim()) return;
    setResult(generateHashes(text));
  };

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to hash…"
        rows={3}
        className="w-full px-3 py-2 rounded text-xs font-mono outline-none resize-none"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
      />
      <div>
        <GenerateButton onClick={run} loading={false} />
      </div>
      {result && <ResultBox value={result} onUse={onUse} />}
    </div>
  );
}

// ── Tool metadata map ─────────────────────────────────────────────────────────

const TOOL_META: Record<string, {
  title: string;
  description: string;
  section: (props: { onUse: (v: string) => void }) => React.ReactNode;
}> = {
  'uuid-generator':  { title: 'UUID Generator',          description: 'Generate UUID v4 strings',                               section: UuidSection },
  'ulid-generator':  { title: 'ULID Generator',          description: 'Universally Unique Lexicographically Sortable Identifiers', section: UlidSection },
  'random-string':   { title: 'Random String Generator', description: 'Generate random strings with configurable charset and length', section: RandomTextSection },
  'lorem-ipsum':     { title: 'Lorem Ipsum Generator',   description: 'Generate placeholder text',                              section: LoremIpsumSection },
  'hash-generator':  { title: 'Hash Generator',          description: 'Generate SHA-1, SHA-256 and SHA-512 hashes',            section: HashSection },
};

// ── Main panel ────────────────────────────────────────────────────────────────

export function GeneratorPanel({ toolId, onClose }: { toolId: string; onClose?: () => void }) {
  const { setInput } = useDevboxStore();

  const meta = TOOL_META[toolId];

  const handleUse = (value: string) => {
    setInput(value);
    onClose?.();
  };

  if (!meta) return null;

  const Section = meta.section;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{meta.title}</div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{meta.description}</div>
      </div>
      <Section onUse={handleUse} />
    </div>
  );
}
