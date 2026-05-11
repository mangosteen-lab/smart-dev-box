'use client';

import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { runDetection } from '@/lib/tools';
import { getGeneratorPlugins, subscribeGenerators } from '@/lib/tools/plugin-registry';
import type { GeneratorOption, GeneratorPlugin } from '@/lib/tools/types';

// ── Clipboard ─────────────────────────────────────────────────────────────────

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
    <div style={{ border: '1px solid var(--border)', background: 'var(--bg3)', borderRadius: '4px' }}>
      <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: 'var(--border)', color: 'var(--text3)', fontSize: 'var(--fs-2xs)' }}>
        <span>Result</span>
        <div className="flex gap-2">
          <button
            onClick={() => { copyToClipboard(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            style={{ padding: '2px 7px', borderRadius: '3px', fontSize: 'var(--fs-2xs)', cursor: 'pointer', background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)', fontFamily: 'var(--font)' }}
          >{copied ? 'Copied!' : 'Copy'}</button>
          <button
            onClick={() => onUse(value)}
            style={{ padding: '2px 7px', borderRadius: '3px', fontSize: 'var(--fs-2xs)', cursor: 'pointer', fontWeight: 600, background: 'var(--green-bg)', border: '1px solid var(--green-dim)', color: 'var(--green)', fontFamily: 'var(--font)' }}
          >Use as input →</button>
        </div>
      </div>
      <pre style={{ padding: '10px 12px', fontSize: 'var(--fs-xs)', fontFamily: 'var(--font)', color: 'var(--text)', maxHeight: '180px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflow: 'auto' }}>
        {value}
      </pre>
    </div>
  );
}

// ── NumberInput ───────────────────────────────────────────────────────────────

function NumberInput({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const [raw, setRaw] = useState(String(value));
  const commit = (str: string) => {
    const n = parseInt(str, 10);
    const clamped = isNaN(n) ? min : Math.min(max, Math.max(min, n));
    setRaw(String(clamped));
    onChange(clamped);
  };
  return (
    <label className="flex items-center gap-1.5" style={{ fontSize: 'var(--fs-xs)', color: 'var(--text2)' }}>
      <span style={{ flexShrink: 0 }}>{label}</span>
      <input
        type="number" value={raw} min={min} max={max}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') commit((e.target as HTMLInputElement).value); }}
        style={{ width: '72px', padding: '3px 8px', borderRadius: '4px', fontSize: 'var(--fs-xs)', outline: 'none', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font)' }}
      />
    </label>
  );
}

// ── ToggleChip ────────────────────────────────────────────────────────────────

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        padding: '2px 8px', borderRadius: '3px', fontSize: 'var(--fs-2xs)', cursor: 'pointer', fontFamily: 'var(--font)',
        background: active ? 'var(--green-bg)' : 'var(--bg3)',
        border: `1px solid ${active ? 'var(--green-dim)' : 'var(--border)'}`,
        color: active ? 'var(--green)' : 'var(--text3)',
        fontWeight: active ? 600 : 400,
        transition: 'all .12s',
      }}
    >{label}</button>
  );
}

// ── GenerateButton ────────────────────────────────────────────────────────────

function GenerateButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        padding: '4px 12px', borderRadius: '4px', fontSize: 'var(--fs-xs)', fontWeight: 700, cursor: 'pointer',
        background: 'var(--green)', color: '#0a0a0a', border: 'none', fontFamily: 'var(--font)',
        transition: 'opacity .12s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      Generate
    </button>
  );
}

// ── Generation logic ──────────────────────────────────────────────────────────

function uuidv4Bytes(): Uint8Array {
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  return b;
}
function uuidBytesToHyphen(b: Uint8Array): string {
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}
type UuidFormat   = 'hyphens' | 'braces' | 'no-hyphens';
type UuidEncoding = 'none' | 'uppercase' | 'base64' | 'rfc7515' | 'urlencode';

function applyUuid(b: Uint8Array, fmt: UuidFormat, upper: boolean, quotes: boolean, enc: UuidEncoding): string {
  if (enc === 'base64') { const s = btoa(String.fromCharCode(...b)); return quotes ? `"${s}"` : s; }
  if (enc === 'rfc7515') { const s = btoa(String.fromCharCode(...b)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); return quotes ? `"${s}"` : s; }
  let s = uuidBytesToHyphen(b);
  if (upper) s = s.toUpperCase();
  if (fmt === 'braces') s = `{${s}}`;
  else if (fmt === 'no-hyphens') s = s.replace(/-/g, '');
  if (quotes) s = `"${s}"`;
  if (enc === 'urlencode') s = encodeURIComponent(s);
  return s;
}
function genUuids(count: number, fmt: UuidFormat, upper: boolean, quotes: boolean, enc: UuidEncoding): string {
  return Array.from({ length: count }, () => applyUuid(uuidv4Bytes(), fmt, upper, quotes, enc)).join('\n');
}

function encodeUlid(ms: number, rand: Uint8Array): string {
  const C = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const r = new Array(26);
  let ts = ms;
  for (let i = 9; i >= 0; i--) { r[i] = C[ts % 32]; ts = Math.floor(ts / 32); }
  let ri = 0, buf = 0, bits = 0;
  for (let i = 10; i < 26; i++) {
    while (bits < 5) { buf = (buf << 8) | rand[ri++]; bits += 8; }
    bits -= 5; r[i] = C[(buf >> bits) & 0x1f];
  }
  return r.join('');
}
function genUlids(count: number): string {
  return Array.from({ length: count }, () => encodeUlid(Date.now(), crypto.getRandomValues(new Uint8Array(10)))).join('\n');
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
function genRandomStrings(length: number, count: number, charset: string): string {
  const chars = CHARSETS_MAP[charset] ?? CHARSETS_MAP.alphanumeric;
  return Array.from({ length: count }, () => {
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(bytes, (b) => chars[b % chars.length]).join('');
  }).join('\n');
}

const LOREM_WORDS = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum'];
function loremSentence(): string {
  const wc = 7 + Math.floor(Math.random() * 6);
  const words = Array.from({ length: wc }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}
function genLorem(mode: string, count: number): string {
  if (mode === 'words') return Array.from({ length: count }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]).join(' ');
  if (mode === 'sentences') return Array.from({ length: count }, loremSentence).join(' ');
  return Array.from({ length: count }, () => Array.from({ length: 4 + Math.floor(Math.random() * 3) }, loremSentence).join(' ')).join('\n\n');
}

function sha1(str: string): string {
  function rotl(n: number, s: number) { return (n << s) | (n >>> (32 - s)); }
  function toHex32(n: number) { let s = ''; for (let i = 28; i >= 0; i -= 4) s += '0123456789abcdef'[(n >>> i) & 0xf]; return s; }
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) { const c = str.charCodeAt(i); if (c < 128) bytes.push(c); else if (c < 2048) bytes.push((c>>6)|192,(c&63)|128); else bytes.push((c>>12)|224,((c>>6)&63)|128,(c&63)|128); }
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 56; i >= 0; i -= 8) bytes.push((bitLen / Math.pow(2, i)) & 0xff);
  let h0=0x67452301,h1=0xefcdab89,h2=0x98badcfe,h3=0x10325476,h4=0xc3d2e1f0;
  for (let i = 0; i < bytes.length; i += 64) {
    const w: number[] = [];
    for (let j=0;j<16;j++) w[j]=(bytes[i+j*4]<<24)|(bytes[i+j*4+1]<<16)|(bytes[i+j*4+2]<<8)|bytes[i+j*4+3];
    for (let j=16;j<80;j++) w[j]=rotl(w[j-3]^w[j-8]^w[j-14]^w[j-16],1);
    let [a,b,c,d,e]=[h0,h1,h2,h3,h4];
    for (let j=0;j<80;j++) { let f,k; if(j<20){f=(b&c)|(~b&d);k=0x5a827999;}else if(j<40){f=b^c^d;k=0x6ed9eba1;}else if(j<60){f=(b&c)|(b&d)|(c&d);k=0x8f1bbcdc;}else{f=b^c^d;k=0xca62c1d6;} const t=(rotl(a,5)+f+e+k+w[j])|0; e=d;d=c;c=rotl(b,30);b=a;a=t; }
    h0=(h0+a)|0;h1=(h1+b)|0;h2=(h2+c)|0;h3=(h3+d)|0;h4=(h4+e)|0;
  }
  return toHex32(h0)+toHex32(h1)+toHex32(h2)+toHex32(h3)+toHex32(h4);
}
function sha256(str: string): string {
  const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const bytes: number[] = [];
  for (let i=0;i<str.length;i++){const c=str.charCodeAt(i);if(c<128)bytes.push(c);else if(c<2048)bytes.push((c>>6)|192,(c&63)|128);else bytes.push((c>>12)|224,((c>>6)&63)|128,(c&63)|128);}
  const bitLen=bytes.length*8; bytes.push(0x80);
  while(bytes.length%64!==56)bytes.push(0);
  for(let i=56;i>=0;i-=8)bytes.push((bitLen/Math.pow(2,i))&0xff);
  let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const rotr=(x:number,n:number)=>(x>>>n)|(x<<(32-n));
  for(let i=0;i<bytes.length;i+=64){
    const w:number[]=[];
    for(let j=0;j<16;j++)w[j]=(bytes[i+j*4]<<24)|(bytes[i+j*4+1]<<16)|(bytes[i+j*4+2]<<8)|bytes[i+j*4+3];
    for(let j=16;j<64;j++){const s0=rotr(w[j-15],7)^rotr(w[j-15],18)^(w[j-15]>>>3);const s1=rotr(w[j-2],17)^rotr(w[j-2],19)^(w[j-2]>>>10);w[j]=(w[j-16]+s0+w[j-7]+s1)|0;}
    let [a,b,c,d,e,f,g,hh]=h;
    for(let j=0;j<64;j++){const S1=rotr(e,6)^rotr(e,11)^rotr(e,25);const ch=(e&f)^(~e&g);const t1=(hh+S1+ch+K[j]+w[j])|0;const S0=rotr(a,2)^rotr(a,13)^rotr(a,22);const maj=(a&b)^(a&c)^(b&c);const t2=(S0+maj)|0;hh=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;}
    h=[h[0]+a,h[1]+b,h[2]+c,h[3]+d,h[4]+e,h[5]+f,h[6]+g,h[7]+hh].map(x=>x|0);
  }
  return h.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('');
}
function genHashes(text: string): string {
  return [`SHA-1:   ${sha1(text)}`, `SHA-256: ${sha256(text)}`].join('\n');
}

// ── Individual popover bodies ─────────────────────────────────────────────────

function UuidBody({ onUse }: { onUse: (v: string) => void }) {
  const [count, setCount]   = useState(1);
  const [fmt, setFmt]       = useState<UuidFormat>('hyphens');
  const [upper, setUpper]   = useState(false);
  const [quotes, setQuotes] = useState(false);
  const [enc, setEnc]       = useState<UuidEncoding>('none');
  const [result, setResult] = useState('');
  const encDisabled = enc === 'base64' || enc === 'rfc7515';
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <NumberInput label="Count" value={count} min={1} max={1000} onChange={setCount} />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>Format</span>
        <div className="flex flex-wrap gap-1.5">
          <ToggleChip label="Hyphens"    active={fmt==='hyphens'}    onClick={() => setFmt('hyphens')} />
          <ToggleChip label="{} Braces"  active={fmt==='braces'}     onClick={() => setFmt('braces')} />
          <ToggleChip label="No hyphens" active={fmt==='no-hyphens'} onClick={() => setFmt('no-hyphens')} />
          <ToggleChip label="Uppercase"  active={upper && !encDisabled} onClick={() => { if (!encDisabled) setUpper(u => !u); }} />
          <ToggleChip label={'"" Quotes'} active={quotes}            onClick={() => setQuotes(q => !q)} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>Encoding</span>
        <div className="flex flex-wrap gap-1.5">
          <ToggleChip label="None"       active={enc==='none'}      onClick={() => setEnc('none')} />
          <ToggleChip label="Base64"     active={enc==='base64'}    onClick={() => { setEnc('base64'); setUpper(false); }} />
          <ToggleChip label="RFC 7515"   active={enc==='rfc7515'}   onClick={() => { setEnc('rfc7515'); setUpper(false); }} />
          <ToggleChip label="URL Encode" active={enc==='urlencode'} onClick={() => setEnc('urlencode')} />
        </div>
      </div>
      <GenerateButton onClick={() => setResult(genUuids(count, fmt, upper, quotes, enc))} />
      {result && <ResultBox value={result} onUse={onUse} />}
    </div>
  );
}

function UlidBody({ onUse }: { onUse: (v: string) => void }) {
  const [count, setCount] = useState(1);
  const [result, setResult] = useState('');
  return (
    <div className="flex flex-col gap-3">
      <NumberInput label="Count" value={count} min={1} max={1000} onChange={setCount} />
      <GenerateButton onClick={() => setResult(genUlids(count))} />
      {result && <ResultBox value={result} onUse={onUse} />}
    </div>
  );
}

const CHARSETS = ['alphanumeric','alpha','numeric','lowercase','uppercase','hex','symbols'] as const;
type Charset = typeof CHARSETS[number];

function RandomStringBody({ onUse }: { onUse: (v: string) => void }) {
  const [length, setLength] = useState(32);
  const [count, setCount]   = useState(1);
  const [charset, setCharset] = useState<Charset>('alphanumeric');
  const [result, setResult]   = useState('');
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3 items-center">
        <NumberInput label="Length" value={length} min={1} max={4096} onChange={setLength} />
        <NumberInput label="Count"  value={count}  min={1} max={100}  onChange={setCount} />
        <label className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
          Charset
          <select value={charset} onChange={(e) => setCharset(e.target.value as Charset)}
            style={{ padding: '3px 6px', borderRadius: '4px', fontSize: 'var(--fs-xs)', outline: 'none', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font)' }}>
            {CHARSETS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>
      <GenerateButton onClick={() => setResult(genRandomStrings(length, count, charset))} />
      {result && <ResultBox value={result} onUse={onUse} />}
    </div>
  );
}

const LOREM_MODES = ['paragraphs','sentences','words'] as const;
type LoremMode = typeof LOREM_MODES[number];

function LoremBody({ onUse }: { onUse: (v: string) => void }) {
  const [mode, setMode]   = useState<LoremMode>('paragraphs');
  const [count, setCount] = useState(3);
  const [result, setResult] = useState('');
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
          Mode
          <select value={mode} onChange={(e) => setMode(e.target.value as LoremMode)}
            style={{ padding: '3px 6px', borderRadius: '4px', fontSize: 'var(--fs-xs)', outline: 'none', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font)' }}>
            {LOREM_MODES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <NumberInput label="Count" value={count} min={1} max={100} onChange={setCount} />
      </div>
      <GenerateButton onClick={() => setResult(genLorem(mode, count))} />
      {result && <ResultBox value={result} onUse={onUse} />}
    </div>
  );
}

function HashBody({ onUse }: { onUse: (v: string) => void }) {
  const [text, setText]     = useState('');
  const [result, setResult] = useState('');
  return (
    <div className="flex flex-col gap-3">
      <textarea value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to hash…" rows={3}
        style={{ width: '100%', padding: '8px 10px', borderRadius: '4px', fontSize: 'var(--fs-xs)', fontFamily: 'var(--font)', outline: 'none', resize: 'none', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
      <GenerateButton onClick={() => { if (text.trim()) setResult(genHashes(text)); }} />
      {result && <ResultBox value={result} onUse={onUse} />}
    </div>
  );
}

// ── Plugin generator body ─────────────────────────────────────────────────────

function PluginGeneratorBody({
  options,
  generate,
  onUse,
}: {
  options: GeneratorOption[];
  generate: (opts: Record<string, unknown>) => { output: string; outputLanguage?: string; error?: string };
  onUse: (v: string) => void;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {};
    for (const opt of options) init[opt.key] = opt.defaultValue;
    return init;
  });
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = () => {
    const res = generate(values);
    if (res.error) { setError(res.error); setResult(''); }
    else { setResult(res.output); setError(''); }
  };

  const set = (key: string, value: unknown) => setValues(prev => ({ ...prev, [key]: value }));

  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => {
        if (opt.type === 'text') {
          return (
            <label key={opt.key} className="flex flex-col gap-1" style={{ fontSize: 'var(--fs-xs)', color: 'var(--text2)' }}>
              <span>{opt.label}</span>
              <input
                type="text"
                value={String(values[opt.key] ?? '')}
                placeholder={(opt as GeneratorOption & { placeholder?: string }).placeholder ?? ''}
                onChange={(e) => set(opt.key, e.target.value)}
                style={{ padding: '4px 8px', borderRadius: '4px', fontSize: 'var(--fs-xs)', outline: 'none', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font)' }}
              />
            </label>
          );
        }
        if (opt.type === 'number') {
          return (
            <NumberInput
              key={opt.key}
              label={opt.label}
              value={Number(values[opt.key] ?? opt.defaultValue)}
              min={opt.min}
              max={opt.max}
              onChange={(n) => set(opt.key, n)}
            />
          );
        }
        if (opt.type === 'select') {
          return (
            <label key={opt.key} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text2)' }}>
              {opt.label}
              <select
                value={String(values[opt.key] ?? opt.defaultValue)}
                onChange={(e) => set(opt.key, e.target.value)}
                style={{ padding: '3px 6px', borderRadius: '4px', fontSize: 'var(--fs-xs)', outline: 'none', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font)' }}
              >
                {opt.choices.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          );
        }
        if (opt.type === 'toggle') {
          return (
            <ToggleChip
              key={opt.key}
              label={opt.label}
              active={Boolean(values[opt.key] ?? opt.defaultValue)}
              onClick={() => set(opt.key, !values[opt.key])}
            />
          );
        }
        return null;
      })}
      <GenerateButton onClick={handleGenerate} />
      {error && <div style={{ fontSize: 'var(--fs-xs)', color: 'rgba(248,113,113,0.9)', fontFamily: 'monospace' }}>{error}</div>}
      {result && <ResultBox value={result} onUse={onUse} />}
    </div>
  );
}

// ── Generator definitions ─────────────────────────────────────────────────────

const GENERATORS = [
  { id: 'uuid',   label: 'UUID',          body: UuidBody },
  { id: 'ulid',   label: 'ULID',          body: UlidBody },
  { id: 'random', label: 'Random String', body: RandomStringBody },
  { id: 'lorem',  label: 'Lorem Ipsum',   body: LoremBody },
  { id: 'hash',   label: 'Hash',          body: HashBody },
] as const;

type GeneratorId = typeof GENERATORS[number]['id'];

// ── Popover wrapper ───────────────────────────────────────────────────────────

function Popover({ id, label, open, onToggle, onUse, Body }: {
  id: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  onUse: (v: string) => void;
  Body: (props: { onUse: (v: string) => void }) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onToggle]);

  return (
    <div ref={ref} className="relative">
      {/* Chip button */}
      <button
        onClick={onToggle}
        className="flex items-center"
        style={{
          gap: '5px',
          fontSize: 'var(--fs-xs)',
          background: open ? 'var(--green-bg)' : 'var(--bg2)',
          border: `1px solid ${open ? 'var(--green)' : 'var(--border)'}`,
          color: open ? 'var(--green)' : 'var(--text2)',
          padding: '4px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: 'var(--font)',
          transition: 'color .12s, border-color .12s',
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; if (!open) { el.style.borderColor = 'var(--green)'; el.style.color = 'var(--green)'; }}}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; if (!open) { el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text2)'; }}}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        {label}
        <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)', marginLeft: '2px' }}>{open ? '▲' : '▾'}</span>
      </button>

      {/* Popover panel */}
      {open && (
        <div
          className="absolute top-full left-0 z-40 p-4"
          style={{
            marginTop: '4px',
            background: 'var(--bg2)',
            border: '1px solid var(--border2)',
            borderRadius: '6px',
            boxShadow: 'var(--shadow-lg)',
            width: id === 'uuid' ? '380px' : id === 'random' ? '360px' : '300px',
            minWidth: '260px',
          }}
        >
          <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, marginBottom: '12px', color: 'var(--text2)', letterSpacing: '0.04em' }}>{label} Generator</div>
          <Body onUse={onUse} />
        </div>
      )}
    </div>
  );
}

// ── GeneratorBar ──────────────────────────────────────────────────────────────

const EMPTY_GENERATORS = () => [] as ReturnType<typeof getGeneratorPlugins>;

export function GeneratorBar() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { setInput, setDetectionResults } = useDevboxStore();
  const pluginGenerators = useSyncExternalStore(subscribeGenerators, getGeneratorPlugins, EMPTY_GENERATORS);

  const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);

  const handleUse = (value: string) => {
    setInput(value);
    setDetectionResults(runDetection(value));
    setOpenId(null);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text3)', flexShrink: 0 }}>generate:</span>
      {GENERATORS.map(({ id, label, body: Body }) => (
        <Popover
          key={id}
          id={id}
          label={label}
          open={openId === id}
          onToggle={() => toggle(id)}
          onUse={handleUse}
          Body={Body}
        />
      ))}
      {pluginGenerators.map(({ plugin, generate }) => (
        <Popover
          key={plugin.id}
          id={plugin.id}
          label={plugin.name}
          open={openId === plugin.id}
          onToggle={() => toggle(plugin.id)}
          onUse={handleUse}
          Body={({ onUse }) => (
            <PluginGeneratorBody
              options={plugin.options}
              generate={generate}
              onUse={onUse}
            />
          )}
        />
      ))}
    </div>
  );
}
