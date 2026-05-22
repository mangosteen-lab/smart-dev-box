'use client';

import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { runDetection } from '@/lib/tools';
import { getGeneratorPlugins, subscribeGenerators } from '@/lib/tools/plugin-registry';
import type { GeneratorOption } from '@/lib/tools/types';

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

// ── Shared primitive inputs ───────────────────────────────────────────────────

function NumberInput({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const [raw, setRaw] = useState(String(value));
  useEffect(() => { setRaw(String(value)); }, [value]);
  const commit = (str: string) => {
    const n = parseInt(str, 10);
    const clamped = isNaN(n) ? min : Math.min(max, Math.max(min, n));
    setRaw(String(clamped));
    onChange(clamped);
  };
  return (
    <label className="flex items-center gap-1.5" style={{ fontSize: 'var(--fs-xs)', color: 'var(--text2)' }}>
      <span style={{ flexShrink: 0, minWidth: '48px' }}>{label}</span>
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

// ── ResultBox ─────────────────────────────────────────────────────────────────

function ResultBox({ value, onUse }: { value: string; onUse: (v: string) => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--bg3)', borderRadius: '4px', marginTop: '2px' }}>
      <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: '1px solid var(--border)', color: 'var(--text3)', fontSize: 'var(--fs-2xs)' }}>
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
      <pre style={{ padding: '8px 12px', fontSize: 'var(--fs-xs)', fontFamily: 'var(--font)', color: 'var(--text)', maxHeight: '160px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflow: 'auto' }}>
        {value}
      </pre>
    </div>
  );
}

// ── GeneratorOption renderer (generic) ────────────────────────────────────────

type OptionValues = Record<string, unknown>;

function OptionField({ opt, value, onChange }: {
  opt: GeneratorOption;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (opt.type === 'number') {
    return (
      <NumberInput
        label={opt.label}
        value={Number(value ?? opt.defaultValue)}
        min={opt.min}
        max={opt.max}
        onChange={onChange}
      />
    );
  }
  if (opt.type === 'text') {
    return (
      <label className="flex flex-col gap-1" style={{ fontSize: 'var(--fs-xs)', color: 'var(--text2)' }}>
        <span>{opt.label}</span>
        <input
          type="text"
          value={String(value ?? opt.defaultValue ?? '')}
          placeholder={(opt as GeneratorOption & { placeholder?: string }).placeholder ?? ''}
          onChange={(e) => onChange(e.target.value)}
          style={{ padding: '4px 8px', borderRadius: '4px', fontSize: 'var(--fs-xs)', outline: 'none', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font)' }}
        />
      </label>
    );
  }
  if (opt.type === 'select') {
    return (
      <label className="flex items-center gap-1.5" style={{ fontSize: 'var(--fs-xs)', color: 'var(--text2)' }}>
        <span style={{ flexShrink: 0, minWidth: '48px' }}>{opt.label}</span>
        <select
          value={String(value ?? opt.defaultValue)}
          onChange={(e) => onChange(e.target.value)}
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
        label={opt.label}
        active={Boolean(value ?? opt.defaultValue)}
        onClick={() => onChange(!(value ?? opt.defaultValue))}
      />
    );
  }
  return null;
}

// ── Generator definition type ─────────────────────────────────────────────────

interface GeneratorDef {
  id: string;
  label: string;
  description?: string;
  options: GeneratorOption[];
  /** Called with option values; returns output string or throws */
  generate: (values: OptionValues) => Promise<string> | string;
}

// ── Generation logic (kept inline for zero-dep) ───────────────────────────────

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

const LOREM_WORDS = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum'];
function loremSentence(): string {
  const wc = 7 + Math.floor(Math.random() * 6);
  const words = Array.from({ length: wc }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

// ── Built-in generator definitions ───────────────────────────────────────────

interface GeneratorGroup {
  label: string;
  generators: GeneratorDef[];
}

function buildBuiltinGroups(): GeneratorGroup[] {
  return [
    {
      label: 'IDs & Tokens',
      generators: [
        // UUID is rendered as a custom card (see below), so not here
        {
          id: 'ulid',
          label: 'ULID',
          description: 'Universally Unique Lexicographically Sortable Identifier',
          options: [
            { key: 'count', label: 'Count', type: 'number', defaultValue: 1, min: 1, max: 1000 },
          ],
          generate: (v) => {
            const count = Number(v.count ?? 1);
            return Array.from({ length: count }, () => encodeUlid(Date.now(), crypto.getRandomValues(new Uint8Array(10)))).join('\n');
          },
        },
        {
          id: 'nanoid',
          label: 'Nano ID',
          description: 'Compact URL-safe unique ID (popular in JS/TS)',
          options: [
            { key: 'size',     label: 'Size',     type: 'number', defaultValue: 21,  min: 1, max: 256 },
            { key: 'count',    label: 'Count',    type: 'number', defaultValue: 1,   min: 1, max: 1000 },
            { key: 'alphabet', label: 'Alphabet', type: 'text',   defaultValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-', placeholder: 'custom alphabet…' },
          ],
          generate: (v) => {
            const size     = Number(v.size ?? 21);
            const count    = Number(v.count ?? 1);
            const alphabet = (v.alphabet as string) || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
            const results: string[] = [];
            for (let i = 0; i < count; i++) {
              const bytes = crypto.getRandomValues(new Uint8Array(size));
              results.push(Array.from(bytes, (b) => alphabet[b % alphabet.length]).join(''));
            }
            return [`Size: ${size}  |  Alphabet: ${alphabet.length} chars`, '', ...results].join('\n');
          },
        },
        {
          id: 'random-string',
          label: 'Random String',
          description: 'Cryptographically random string with configurable charset',
          options: [
            { key: 'length',  label: 'Length',  type: 'number', defaultValue: 32, min: 1, max: 4096 },
            { key: 'count',   label: 'Count',   type: 'number', defaultValue: 1,  min: 1, max: 100 },
            { key: 'charset', label: 'Charset', type: 'select', defaultValue: 'alphanumeric', choices: ['alphanumeric','alpha','numeric','lowercase','uppercase','hex','symbols'] },
          ],
          generate: (v) => {
            const CHARSETS_MAP: Record<string, string> = {
              alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
              alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
              numeric: '0123456789',
              lowercase: 'abcdefghijklmnopqrstuvwxyz',
              uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
              hex: '0123456789abcdef',
              symbols: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?',
            };
            const length  = Number(v.length ?? 32);
            const count   = Number(v.count ?? 1);
            const chars   = CHARSETS_MAP[String(v.charset ?? 'alphanumeric')] ?? CHARSETS_MAP.alphanumeric;
            return Array.from({ length: count }, () => {
              const bytes = crypto.getRandomValues(new Uint8Array(length));
              return Array.from(bytes, (b) => chars[b % chars.length]).join('');
            }).join('\n');
          },
        },
      ],
    },
    {
      label: 'Security',
      generators: [
        {
          id: 'hmac',
          label: 'HMAC',
          description: 'HMAC-SHA-256/384/512 for API signing & webhook verification',
          options: [
            { key: 'message',   label: 'Message',   type: 'text', defaultValue: '', placeholder: 'message to sign…' },
            { key: 'secret',    label: 'Secret',    type: 'text', defaultValue: '', placeholder: 'secret key…' },
            { key: 'algorithm', label: 'Algorithm', type: 'select', defaultValue: 'SHA-256', choices: ['SHA-256', 'SHA-384', 'SHA-512'] },
          ],
          generate: async (v) => {
            const message   = String(v.message ?? '');
            const secret    = String(v.secret ?? '');
            const algorithm = String(v.algorithm ?? 'SHA-256') as 'SHA-256' | 'SHA-384' | 'SHA-512';
            if (!secret) throw new Error('Secret key is required');
            if (!message.trim()) throw new Error('Message is required');

            const keyData   = new TextEncoder().encode(secret);
            const msgData   = new TextEncoder().encode(message);
            const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: algorithm }, false, ['sign']);
            const sig       = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
            const bytes     = new Uint8Array(sig);
            const hex       = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
            const b64       = btoa(String.fromCharCode(...bytes));
            const b64url    = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

            return [
              `Algorithm:  HMAC-${algorithm}`,
              `Message:    ${message.slice(0, 60)}${message.length > 60 ? '…' : ''}`,
              `Secret:     ${'*'.repeat(Math.min(secret.length, 8))}`,
              '',
              `Hex:        ${hex}`,
              `Base64:     ${b64}`,
              `Base64URL:  ${b64url}`,
            ].join('\n');
          },
        },
        {
          id: 'totp',
          label: 'TOTP',
          description: 'Time-based One-Time Password (RFC 6238 / Google Authenticator)',
          options: [
            { key: 'secret', label: 'Secret (Base32)', type: 'text', defaultValue: '', placeholder: 'JBSWY3DPEHPK3PXP' },
            { key: 'digits', label: 'Digits', type: 'select', defaultValue: '6', choices: ['6', '7', '8'] },
            { key: 'period', label: 'Period (s)', type: 'number', defaultValue: 30, min: 15, max: 120 },
          ],
          generate: async (v) => {
            const secretB32 = String(v.secret ?? '').toUpperCase().replace(/\s/g, '');
            const digits    = Number(v.digits ?? 6);
            const period    = Number(v.period ?? 30);

            if (!secretB32) throw new Error('Base32 secret is required');

            // Decode Base32
            const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
            let bits = 0, value = 0;
            const bytes: number[] = [];
            for (const ch of secretB32) {
              const idx = ALPHA.indexOf(ch);
              if (idx === -1) continue;
              value = (value << 5) | idx;
              bits += 5;
              if (bits >= 8) { bits -= 8; bytes.push((value >> bits) & 0xff); }
            }
            const keyBytes = new Uint8Array(bytes);

            const totpFor = async (ts: number): Promise<string> => {
              const counter = Math.floor(ts / period);
              const msg = new ArrayBuffer(8);
              const view = new DataView(msg);
              view.setUint32(4, counter, false);
              const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
              const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, msg));
              const offset = sig[19] & 0x0f;
              const code = ((sig[offset] & 0x7f) << 24 | sig[offset+1] << 16 | sig[offset+2] << 8 | sig[offset+3]) % Math.pow(10, digits);
              return String(code).padStart(digits, '0');
            };

            const now = Math.floor(Date.now() / 1000);
            const remaining = period - (now % period);
            const [prev, curr, next] = await Promise.all([
              totpFor(now - period),
              totpFor(now),
              totpFor(now + period),
            ]);

            return [
              `Current:   ${curr}  (${remaining}s remaining)`,
              `Previous:  ${prev}`,
              `Next:      ${next}`,
              '',
              `Period: ${period}s  |  Digits: ${digits}`,
            ].join('\n');
          },
        },
        {
          id: 'password',
          label: 'Password',
          description: 'Secure random password with configurable character classes',
          options: [
            { key: 'length',  label: 'Length',   type: 'number',  defaultValue: 20,   min: 4,  max: 256 },
            { key: 'count',   label: 'Count',    type: 'number',  defaultValue: 1,    min: 1,  max: 100 },
            { key: 'upper',   label: 'A-Z',      type: 'toggle',  defaultValue: true },
            { key: 'lower',   label: 'a-z',      type: 'toggle',  defaultValue: true },
            { key: 'digits',  label: '0-9',      type: 'toggle',  defaultValue: true },
            { key: 'symbols', label: 'Symbols',  type: 'toggle',  defaultValue: true },
          ],
          generate: (v) => {
            const length  = Number(v.length ?? 20);
            const count   = Number(v.count ?? 1);
            let chars = '';
            if (v.upper   !== false) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (v.lower   !== false) chars += 'abcdefghijklmnopqrstuvwxyz';
            if (v.digits  !== false) chars += '0123456789';
            if (v.symbols !== false) chars += '!@#$%^&*()-_=+[]{}|;:,.<>?';
            if (!chars) chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const results = Array.from({ length: count }, () => {
              const bytes = crypto.getRandomValues(new Uint8Array(length));
              return Array.from(bytes, (b) => chars[b % chars.length]).join('');
            });
            return [`Length: ${length}  |  Charset: ${chars.length} chars`, '', ...results].join('\n');
          },
        },
      ],
    },
    {
      label: 'Numbers',
      generators: [
        {
          id: 'random-number',
          label: 'Random Number',
          description: 'Random integer or decimal in a custom range',
          options: [
            { key: 'min',      label: 'Min',      type: 'number', defaultValue: 1,   min: -999999999, max: 999999999 },
            { key: 'max',      label: 'Max',      type: 'number', defaultValue: 100, min: -999999999, max: 999999999 },
            { key: 'count',    label: 'Count',    type: 'number', defaultValue: 1,   min: 1, max: 1000 },
            { key: 'decimals', label: 'Decimals', type: 'number', defaultValue: 0,   min: 0, max: 10 },
          ],
          generate: (v) => {
            const min      = Number(v.min ?? 1);
            const max      = Number(v.max ?? 100);
            const count    = Number(v.count ?? 1);
            const decimals = Number(v.decimals ?? 0);
            if (min > max) throw new Error('min must be ≤ max');
            const results = Array.from({ length: count }, () => {
              const val = min + Math.random() * (max - min);
              return decimals > 0 ? val.toFixed(decimals) : String(Math.floor(val));
            });
            return [`Range: ${min} – ${max}`, '', ...results].join('\n');
          },
        },
      ],
    },
    {
      label: 'Text',
      generators: [
        {
          id: 'lorem',
          label: 'Lorem Ipsum',
          description: 'Classic placeholder text',
          options: [
            { key: 'mode',  label: 'Mode',  type: 'select', defaultValue: 'paragraphs', choices: ['paragraphs', 'sentences', 'words'] },
            { key: 'count', label: 'Count', type: 'number', defaultValue: 3, min: 1, max: 100 },
          ],
          generate: (v) => {
            const mode  = String(v.mode ?? 'paragraphs');
            const count = Number(v.count ?? 3);
            if (mode === 'words') return Array.from({ length: count }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]).join(' ');
            if (mode === 'sentences') return Array.from({ length: count }, loremSentence).join(' ');
            return Array.from({ length: count }, () => Array.from({ length: 4 + Math.floor(Math.random() * 3) }, loremSentence).join(' ')).join('\n\n');
          },
        },
        {
          id: 'hash',
          label: 'Hash (SHA)',
          description: 'SHA-1 / SHA-256 / SHA-512 digest of any text',
          options: [
            { key: 'text', label: 'Text to hash', type: 'text', defaultValue: '', placeholder: 'Enter text…' },
          ],
          generate: async (v) => {
            const text = String(v.text ?? '');
            if (!text.trim()) throw new Error('Text is required');
            const encoder = new TextEncoder();
            const data    = encoder.encode(text);
            const [sha1, sha256, sha512] = await Promise.all([
              crypto.subtle.digest('SHA-1',   data),
              crypto.subtle.digest('SHA-256', data),
              crypto.subtle.digest('SHA-512', data),
            ]);
            const toHex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
            return [
              `SHA-1:   ${toHex(sha1)}`,
              `SHA-256: ${toHex(sha256)}`,
              `SHA-512: ${toHex(sha512)}`,
            ].join('\n');
          },
        },
      ],
    },
    {
      label: 'Network',
      generators: [
        {
          id: 'random-ip',
          label: 'Random IPv4',
          description: 'Random IPv4 address',
          options: [
            { key: 'count', label: 'Count', type: 'number', defaultValue: 1, min: 1, max: 1000 },
          ],
          generate: (v) => {
            const count = Number(v.count ?? 1);
            return Array.from({ length: count }, () => {
              const b = crypto.getRandomValues(new Uint8Array(4));
              return Array.from(b).join('.');
            }).join('\n');
          },
        },
        {
          id: 'random-mac',
          label: 'Random MAC',
          description: 'Random locally administered MAC address',
          options: [
            { key: 'count', label: 'Count', type: 'number', defaultValue: 1, min: 1, max: 1000 },
          ],
          generate: (v) => {
            const count = Number(v.count ?? 1);
            return Array.from({ length: count }, () => {
              const b = crypto.getRandomValues(new Uint8Array(6));
              b[0] = (b[0] & 0xfe) | 0x02;
              return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join(':');
            }).join('\n');
          },
        },
      ],
    },
  ];
}

// ── Master list item ──────────────────────────────────────────────────────────

function ListItem({
  label,
  description,
  selected,
  onClick,
}: {
  id: string;
  label: string;
  description?: string;
  group: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '8px 12px',
        borderRadius: '5px',
        cursor: 'pointer',
        border: 'none',
        fontFamily: 'var(--font)',
        background: selected ? 'var(--green-bg)' : 'transparent',
        outline: selected ? '1px solid var(--green-dim)' : 'none',
        transition: 'background .1s',
      }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'var(--bg3)'; }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <div style={{
        fontSize: 'var(--fs-xs)',
        fontWeight: selected ? 700 : 500,
        color: selected ? 'var(--green)' : 'var(--text)',
        marginBottom: description ? '2px' : 0,
      }}>
        {label}
      </div>
      {description && (
        <div style={{
          fontSize: 'var(--fs-2xs)',
          color: selected ? 'var(--green)' : 'var(--text3)',
          opacity: selected ? 0.85 : 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {description}
        </div>
      )}
    </button>
  );
}

// ── Detail panel: UUID (custom toggles) ───────────────────────────────────────

function UuidDetail({ onUse }: { onUse: (v: string) => void }) {
  const [count, setCount]   = useState(1);
  const [fmt, setFmt]       = useState<UuidFormat>('hyphens');
  const [upper, setUpper]   = useState(false);
  const [quotes, setQuotes] = useState(false);
  const [enc, setEnc]       = useState<UuidEncoding>('none');
  const [result, setResult] = useState('');
  const encDisabled = enc === 'base64' || enc === 'rfc7515';

  return (
    <div className="flex flex-col gap-3">
      <NumberInput label="Count" value={count} min={1} max={1000} onChange={setCount} />
      <div className="flex flex-col gap-1">
        <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text3)' }}>Format</span>
        <div className="flex flex-wrap gap-1">
          <ToggleChip label="Hyphens"    active={fmt==='hyphens'}    onClick={() => setFmt('hyphens')} />
          <ToggleChip label="{} Braces"  active={fmt==='braces'}     onClick={() => setFmt('braces')} />
          <ToggleChip label="No hyphens" active={fmt==='no-hyphens'} onClick={() => setFmt('no-hyphens')} />
          <ToggleChip label="Uppercase"  active={upper && !encDisabled} onClick={() => { if (!encDisabled) setUpper(u => !u); }} />
          <ToggleChip label={'"Quotes"'} active={quotes}             onClick={() => setQuotes(q => !q)} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text3)' }}>Encoding</span>
        <div className="flex flex-wrap gap-1">
          <ToggleChip label="None"       active={enc==='none'}      onClick={() => setEnc('none')} />
          <ToggleChip label="Base64"     active={enc==='base64'}    onClick={() => { setEnc('base64'); setUpper(false); }} />
          <ToggleChip label="RFC 7515"   active={enc==='rfc7515'}   onClick={() => { setEnc('rfc7515'); setUpper(false); }} />
          <ToggleChip label="URL Encode" active={enc==='urlencode'} onClick={() => setEnc('urlencode')} />
        </div>
      </div>
      <button
        onClick={() => setResult(Array.from({ length: count }, () => applyUuid(uuidv4Bytes(), fmt, upper, quotes, enc)).join('\n'))}
        style={{ padding: '6px 18px', borderRadius: '4px', fontSize: 'var(--fs-xs)', fontWeight: 700, cursor: 'pointer', background: 'var(--green)', color: '#0a0a0a', border: 'none', fontFamily: 'var(--font)', alignSelf: 'flex-start' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >Generate</button>
      {result && <ResultBox value={result} onUse={onUse} />}
    </div>
  );
}

// ── Detail panel: generic (driven by GeneratorDef) ────────────────────────────

function GenericDetail({ def, onUse }: { def: GeneratorDef; onUse: (v: string) => void }) {
  const [values, setValues] = useState<OptionValues>(() => {
    const init: OptionValues = {};
    for (const opt of def.options) init[opt.key] = opt.defaultValue;
    return init;
  });
  const [result, setResult]   = useState('');
  const [error, setError]     = useState('');
  const [busy, setBusy]       = useState(false);

  // Reset state when the selected generator changes
  useEffect(() => {
    const init: OptionValues = {};
    for (const opt of def.options) init[opt.key] = opt.defaultValue;
    setValues(init);
    setResult('');
    setError('');
  }, [def.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key: string, value: unknown) => setValues(prev => ({ ...prev, [key]: value }));

  const handleGenerate = async () => {
    setBusy(true);
    setError('');
    setResult('');
    try {
      const out = await def.generate(values);
      setResult(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {def.options.map((opt) => (
        <OptionField key={opt.key} opt={opt} value={values[opt.key]} onChange={(v) => set(opt.key, v)} />
      ))}
      <button
        onClick={handleGenerate}
        disabled={busy}
        style={{
          padding: '6px 18px', borderRadius: '4px', fontSize: 'var(--fs-xs)', fontWeight: 700,
          cursor: busy ? 'default' : 'pointer',
          background: busy ? 'var(--bg3)' : 'var(--green)',
          color: busy ? 'var(--text3)' : '#0a0a0a',
          border: 'none', fontFamily: 'var(--font)', alignSelf: 'flex-start',
          transition: 'opacity .12s',
        }}
        onMouseEnter={e => { if (!busy) (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
      >
        {busy ? 'Generating…' : 'Generate'}
      </button>
      {error && <div style={{ fontSize: 'var(--fs-xs)', color: 'rgba(248,113,113,0.9)', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{error}</div>}
      {result && <ResultBox value={result} onUse={onUse} />}
    </div>
  );
}

// ── Generator Hub (master-detail) ─────────────────────────────────────────────

// Flat entry used by the list + search
interface FlatEntry {
  id: string;
  label: string;
  description?: string;
  group: string;
  /** 'uuid' → custom; otherwise a GeneratorDef id */
  kind: 'uuid' | 'generic';
  def?: GeneratorDef;
}

function buildFlatList(pluginGenerators: ReturnType<typeof getGeneratorPlugins>): FlatEntry[] {
  const entries: FlatEntry[] = [];

  // UUID first
  entries.push({ id: 'uuid', label: 'UUID v4', description: 'Cryptographically random UUID', group: 'IDs & Tokens', kind: 'uuid' });

  // Built-in groups
  for (const group of buildBuiltinGroups()) {
    for (const gen of group.generators) {
      entries.push({ id: gen.id, label: gen.label, description: gen.description, group: group.label, kind: 'generic', def: gen });
    }
  }

  // Plugins
  for (const { plugin, generate: pluginGenerate } of pluginGenerators) {
    const def: GeneratorDef = {
      id: plugin.id,
      label: plugin.name,
      description: plugin.description,
      options: plugin.options,
      generate: (values) => {
        const res = pluginGenerate(values);
        if (res.error) throw new Error(res.error);
        return res.output;
      },
    };
    entries.push({ id: plugin.id, label: plugin.name, description: plugin.description, group: 'Plugins', kind: 'generic', def });
  }

  return entries;
}

function matches(entry: FlatEntry, q: string): boolean {
  const lq = q.toLowerCase();
  return (
    entry.label.toLowerCase().includes(lq) ||
    (entry.description?.toLowerCase().includes(lq) ?? false) ||
    entry.group.toLowerCase().includes(lq)
  );
}

function GeneratorHub({ onUse }: { onUse: (v: string) => void }) {
  const pluginGenerators = useSyncExternalStore(subscribeGenerators, getGeneratorPlugins, () => []);
  const allEntries = buildFlatList(pluginGenerators);

  const [query, setQuery]       = useState('');
  const [selectedId, setSelectedId] = useState<string>(allEntries[0]?.id ?? '');
  const searchRef = useRef<HTMLInputElement>(null);

  // Focus search on mount
  useEffect(() => { searchRef.current?.focus(); }, []);

  const filtered = query.trim() ? allEntries.filter(e => matches(e, query.trim())) : allEntries;

  // If selection is no longer in filtered list, reset to first
  useEffect(() => {
    if (filtered.length > 0 && !filtered.find(e => e.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = allEntries.find(e => e.id === selectedId) ?? filtered[0];

  // Group the filtered list for display
  const groups: { label: string; entries: FlatEntry[] }[] = [];
  for (const entry of filtered) {
    const last = groups[groups.length - 1];
    if (last && last.label === entry.group) {
      last.entries.push(entry);
    } else {
      groups.push({ label: entry.group, entries: [entry] });
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = filtered.findIndex(en => en.id === selectedId);
      const next = e.key === 'ArrowDown'
        ? Math.min(idx + 1, filtered.length - 1)
        : Math.max(idx - 1, 0);
      setSelectedId(filtered[next].id);
    }
  };

  const HUB_HEIGHT = 440;
  const LIST_WIDTH = 220;

  return (
    <div style={{ display: 'flex', height: `${HUB_HEIGHT}px` }}>
      {/* ── Left: search + list ── */}
      <div style={{
        width: `${LIST_WIDTH}px`,
        flexShrink: 0,
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Search box */}
        <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: '8px', color: 'var(--text3)', pointerEvents: 'none', flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search generators…"
              style={{
                width: '100%',
                padding: '5px 8px 5px 28px',
                borderRadius: '4px',
                fontSize: 'var(--fs-xs)',
                outline: 'none',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontFamily: 'var(--font)',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ position: 'absolute', right: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: '13px', lineHeight: 1, padding: 0 }}
              >✕</button>
            )}
          </div>
        </div>

        {/* Scrollable list */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '6px 6px' }}>
          {filtered.length === 0 && (
            <div style={{ padding: '16px 10px', fontSize: 'var(--fs-xs)', color: 'var(--text3)', textAlign: 'center' }}>
              No generators match
            </div>
          )}
          {groups.map(group => (
            <div key={group.label}>
              <div style={{
                fontSize: 'var(--fs-2xs)',
                fontWeight: 700,
                color: 'var(--text3)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '8px 6px 4px',
              }}>
                {group.label}
              </div>
              {group.entries.map(entry => (
                <ListItem
                  key={entry.id}
                  id={entry.id}
                  label={entry.label}
                  description={entry.description}
                  group={entry.group}
                  selected={selectedId === entry.id}
                  onClick={() => setSelectedId(entry.id)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Footer: count */}
        <div style={{ padding: '6px 12px', borderTop: '1px solid var(--border)', fontSize: 'var(--fs-2xs)', color: 'var(--text4)' }}>
          {filtered.length} generator{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── Right: detail panel ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', minWidth: 0 }}>
        {selected ? (
          <>
            {/* Header */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                {selected.label}
              </div>
              {selected.description && (
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', lineHeight: 1.5 }}>
                  {selected.description}
                </div>
              )}
              <div style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {selected.group}
              </div>
            </div>

            {/* Options + generate */}
            {selected.kind === 'uuid'
              ? <UuidDetail onUse={onUse} />
              : selected.def && <GenericDetail def={selected.def} onUse={onUse} />
            }
          </>
        ) : (
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text3)', paddingTop: '20px' }}>
            Select a generator from the list.
          </div>
        )}
      </div>
    </div>
  );
}

// ── GeneratorBar ──────────────────────────────────────────────────────────────

export function GeneratorBar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { setInput, setDetectionResults } = useDevboxStore();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleUse = (value: string) => {
    setInput(value);
    setDetectionResults(runDetection(value));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center"
        style={{
          gap: '6px',
          fontSize: 'var(--fs-xs)',
          background: open ? 'var(--green-bg)' : 'var(--bg2)',
          border: `1px solid ${open ? 'var(--green)' : 'var(--border)'}`,
          color: open ? 'var(--green)' : 'var(--text2)',
          padding: '4px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: 'var(--font)',
          transition: 'color .12s, border-color .12s, background .12s',
          fontWeight: open ? 600 : 400,
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; if (!open) { el.style.borderColor = 'var(--green)'; el.style.color = 'var(--green)'; }}}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; if (!open) { el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text2)'; }}}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        Generate
        <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)', marginLeft: '2px' }}>{open ? '▲' : '▾'}</span>
      </button>

      {/* Dropdown hub */}
      {open && (
        <div
          className="absolute top-full left-0 z-40"
          style={{
            marginTop: '4px',
            background: 'var(--bg1)',
            border: '1px solid var(--border2)',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-lg)',
            width: 'min(680px, 92vw)',
            minWidth: '420px',
            overflow: 'hidden',
          }}
          onMouseDown={e => e.stopPropagation()}
        >
          {/* Hub header */}
          <div
            className="flex items-center justify-between"
            style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}
          >
            <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'var(--text2)', letterSpacing: '0.02em' }}>Generator Hub</span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: '15px', lineHeight: 1, padding: '2px 4px', fontFamily: 'var(--font)' }}
            >✕</button>
          </div>
          <GeneratorHub onUse={(v) => { handleUse(v); setOpen(false); }} />
        </div>
      )}
    </div>
  );
}
