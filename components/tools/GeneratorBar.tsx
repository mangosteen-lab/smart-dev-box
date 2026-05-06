'use client';

import { useState, useRef, useEffect, useMemo, useSyncExternalStore } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { runDetection } from '@/lib/tools';
import { getGeneratorPlugins, subscribeGenerators } from '@/lib/tools/plugin-registry';
import type { GeneratorOption } from '@/lib/tools/types';
import { generateRegexFromSample } from '@/lib/tools/inspection';

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
    <div data-testid="generator-result" style={{ border: '1px solid var(--border)', background: 'var(--bg3)', borderRadius: '4px', marginTop: '2px' }}>
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
      <pre data-testid="generator-result-value" style={{ padding: '8px 12px', fontSize: 'var(--fs-xs)', fontFamily: 'var(--font)', color: 'var(--text)', maxHeight: '160px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', overflow: 'auto' }}>
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

// ── Detail panel: Smart Regex Builder ────────────────────────────────────────

type RegexMode =
  | 'exact'
  | 'alpha'
  | 'number'
  | 'whitespace'
  | 'any'
  | 'dateIso'
  | 'dateFlexible'
  | 'time'
  | 'email'
  | 'url'
  | 'ipv4'
  | 'uuid'
  | 'hex'
  | 'javaClass'
  | 'logLevel'
  | 'httpMethod'
  | 'httpStatus'
  | 'isoTimestamp'
  | 'semver'
  | 'booleanLiteral'
  | 'domain'
  | 'filePath'
  | 'uppercase'
  | 'hashtag'
  | 'quoted'
  | 'bracketed'
  | 'custom';

type RegexGroupMode = 'none' | 'capture' | 'named';

interface RegexRule {
  id: string;
  sourceSegmentId?: string;
  start: number;
  end: number;
  text: string;
  mode: RegexMode;
  label: string;
  regex: string;
  groupMode: RegexGroupMode;
  name: string;
  optional: boolean;
  enabled: boolean;
}

interface RegexSuggestion {
  mode: RegexMode;
  label: string;
  regex: string;
  meaning: string;
}

interface RegexCandidate extends RegexSuggestion {
  id: string;
  start: number;
  end: number;
  text: string;
  layer: 'semantic' | 'context';
  color: string;
}

type SplitStrategyId = 'structure' | 'details' | 'semantic' | 'clause';

type RegexInputIntentId = 'log' | 'json' | 'http' | 'stack' | 'config' | 'sql' | 'url' | 'engineering' | 'text' | 'empty';

interface RegexInputIntent {
  id: RegexInputIntentId;
  label: string;
}

interface RegexSegment extends RegexSuggestion {
  id: string;
  start: number;
  end: number;
  text: string;
  strategy: SplitStrategyId;
  color: string;
  muted?: boolean;
}

interface SplitStrategy {
  id: SplitStrategyId;
  label: string;
  description: string;
  color: string;
  defaultEnabled: boolean;
}

const enumAlternatives = ['INFO', 'WARN', 'ERROR', 'DEBUG', 'TRACE'];
const httpMethodAlternatives = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
const LOG_LEVEL_SOURCE = '(?:TRACE|Trace|trace|DEBUG|Debug|debug|INFO|Info|info|WARN|Warn|warn|WARNING|Warning|warning|ERROR|Error|error|FATAL|Fatal|fatal|CRITICAL|Critical|critical|NOTICE|Notice|notice)';
const CANDIDATE_COLORS: Record<RegexCandidate['layer'], string> = {
  semantic: 'rgba(34,197,94,0.72)',
  context: 'rgba(234,179,8,0.74)',
};
const STRUCTURE_COLORS = {
  timestamp: 'rgba(56,189,248,0.82)',
  metadata: 'rgba(251,191,36,0.82)',
  message: 'rgba(167,139,250,0.82)',
  primary: 'rgba(74,222,128,0.82)',
  secondary: 'rgba(244,114,182,0.82)',
};
const SPLIT_STRATEGIES: SplitStrategy[] = [
  {
    id: 'structure',
    label: 'Intent structure',
    description: 'First pass: major regions inferred from the input intent',
    color: 'rgba(251,191,36,0.82)',
    defaultEnabled: true,
  },
  {
    id: 'details',
    label: 'Fields & details',
    description: 'Second pass: metadata fields, attributes, and references',
    color: 'rgba(56,189,248,0.78)',
    defaultEnabled: true,
  },
  {
    id: 'semantic',
    label: 'Engineering patterns',
    description: 'Known values such as timestamps, IPs, IDs, URLs, and source locations',
    color: 'rgba(74,222,128,0.78)',
    defaultEnabled: true,
  },
  {
    id: 'clause',
    label: 'Message clauses',
    description: 'Readable prose and message phrases split at natural boundaries',
    color: 'rgba(167,139,250,0.78)',
    defaultEnabled: false,
  },
];

function escapeRegexPart(value: string): string {
  return value.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}

function guessGroupName(text: string, mode: RegexMode): string {
  if (mode === 'dateIso' || mode === 'dateFlexible') return 'date';
  if (mode === 'time') return 'time';
  if (mode === 'email') return 'email';
  if (mode === 'url') return 'url';
  if (mode === 'ipv4') return 'ip';
  if (mode === 'uuid') return 'uuid';
  if (mode === 'hex') return 'hex';
  if (mode === 'javaClass') return 'className';
  if (mode === 'logLevel') return 'level';
  if (mode === 'httpMethod') return 'method';
  if (mode === 'httpStatus') return 'status';
  if (mode === 'isoTimestamp') return 'timestamp';
  if (mode === 'semver') return 'version';
  if (mode === 'booleanLiteral') return 'flag';
  if (mode === 'domain') return 'domain';
  if (mode === 'filePath') return 'path';
  if (mode === 'number') return 'number';
  if (mode === 'alpha') return 'text';
  if (mode === 'uppercase') return 'level';
  if (mode === 'hashtag') return 'tag';
  if (mode === 'quoted') return 'value';
  if (mode === 'bracketed') return 'section';
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const candidate = cleaned.slice(0, 24) || 'value';
  return /^[a-z_]/.test(candidate) ? candidate : `value_${candidate}`;
}

function modeRegex(mode: RegexMode, text: string, strictness: number): string {
  switch (mode) {
    case 'exact':
      return escapeRegexPart(text);
    case 'alpha':
      return strictness === 0 ? escapeRegexPart(text) : '[A-Za-z]+';
    case 'number':
      return strictness === 0 ? escapeRegexPart(text) : strictness === 1 ? '\\d+' : '\\d+(?:\\.\\d+)?';
    case 'whitespace':
      return strictness === 0 ? escapeRegexPart(text) : strictness === 1 ? '\\s+' : '\\s*';
    case 'any':
      return strictness === 0 ? '.+' : '.*?';
    case 'dateIso':
      return strictness === 0 ? escapeRegexPart(text) : '\\d{4}-\\d{2}-\\d{2}';
    case 'dateFlexible':
      return strictness === 0 ? escapeRegexPart(text) : strictness === 1 ? '\\d{4}[-/]\\d{2}[-/]\\d{2}' : '\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}';
    case 'time':
      return strictness === 0 ? escapeRegexPart(text) : strictness === 1 ? '\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{3})?' : '\\d{1,2}:\\d{2}(?::\\d{2})?(?:\\.\\d+)?';
    case 'email':
      return strictness === 0 ? escapeRegexPart(text) : '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}';
    case 'url':
      return strictness === 0 ? escapeRegexPart(text) : 'https?:\\/\\/[^\\s]+';
    case 'ipv4':
      return strictness === 0 ? escapeRegexPart(text) : strictness === 1 ? '(?:\\d{1,3}\\.){3}\\d{1,3}' : '(?:(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)';
    case 'uuid':
      return strictness === 0 ? escapeRegexPart(text) : '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}';
    case 'hex':
      return strictness === 0 ? escapeRegexPart(text) : text.startsWith('0x') || text.startsWith('0X') ? '0x[0-9a-fA-F]+' : '[0-9a-fA-F]+';
    case 'javaClass':
      return strictness === 0
        ? escapeRegexPart(text)
        : text.startsWith('[') && text.endsWith(']')
          ? '\\[(?:[A-Za-z_$][\\w$]*\\.)+[A-Za-z_$][\\w$]*\\]'
          : '(?:[A-Za-z_$][\\w$]*\\.)+[A-Za-z_$][\\w$]*';
    case 'logLevel':
      return strictness === 0 ? escapeRegexPart(text) : LOG_LEVEL_SOURCE;
    case 'httpMethod':
      return strictness === 0 ? escapeRegexPart(text) : `(?:${httpMethodAlternatives.join('|')})`;
    case 'httpStatus':
      return strictness === 0 ? escapeRegexPart(text) : '[1-5]\\d{2}';
    case 'isoTimestamp':
      return strictness === 0 ? escapeRegexPart(text) : '\\d{4}-\\d{2}-\\d{2}[T\\s]\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:?\\d{2})?';
    case 'semver':
      return strictness === 0 ? escapeRegexPart(text) : '\\d+\\.\\d+\\.\\d+(?:[-+][0-9A-Za-z.-]+)?';
    case 'booleanLiteral':
      return strictness === 0 ? escapeRegexPart(text) : '(?:true|false|null)';
    case 'domain':
      return strictness === 0 ? escapeRegexPart(text) : '(?:[A-Za-z0-9-]+\\.)+[A-Za-z]{2,}';
    case 'filePath':
      return strictness === 0 ? escapeRegexPart(text) : '(?:\\.?\\.?\\/|\\/)?(?:[A-Za-z0-9._-]+\\/)*[A-Za-z0-9._-]+';
    case 'uppercase':
      return strictness === 0 ? escapeRegexPart(text) : strictness === 1 ? '[A-Z]+' : `(?:${enumAlternatives.join('|')})`;
    case 'hashtag':
      return strictness === 0 ? escapeRegexPart(text) : '#[A-Za-z0-9_]+';
    case 'quoted':
      return strictness === 0 ? escapeRegexPart(text) : "['\"][^'\"]*['\"]";
    case 'bracketed':
      return strictness === 0 ? escapeRegexPart(text) : '\\[[^\\]]+\\]';
    case 'custom':
      return text;
    default:
      return escapeRegexPart(text);
  }
}

function classifyRegexSegment(text: string, strictness: number): { label: string; regex: string } {
  if (/^\s+$/.test(text)) return { label: 'Whitespace', regex: modeRegex('whitespace', text, strictness) };
  if (/^\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/.test(text)) return { label: 'Log timestamp', regex: modeRegex('isoTimestamp', text, strictness) };
  if (/^\[[A-Z][A-Z0-9_ -]*:[^\]]+\]$/.test(text)) return { label: 'Bracketed field', regex: '\\[[A-Z][A-Z0-9_ -]*:[^\\]]+\\]' };
  if (new RegExp(`^\\[${LOG_LEVEL_SOURCE}\\]$`).test(text)) return { label: 'Bracketed log level', regex: `\\[${LOG_LEVEL_SOURCE}\\]` };
  if (/^\[0x[0-9a-fA-F]+\]$/.test(text)) return { label: 'Bracketed hex code', regex: '\\[0x[0-9a-fA-F]+\\]' };
  if (/^\[[A-Za-z0-9_.$-]+\.(?:cpp|c|cc|h|hpp|java|js|ts|tsx|py|go|rb|php):\d+\]$/.test(text)) return { label: 'Source location', regex: '\\[[A-Za-z0-9_.$-]+\\.(?:cpp|c|cc|h|hpp|java|js|ts|tsx|py|go|rb|php):\\d+\\]' };
  if (/^\[[A-Za-z][A-Za-z0-9_ .-]+\]$/.test(text)) return { label: 'Bracketed label', regex: '\\[[A-Za-z][A-Za-z0-9_ .-]+\\]' };
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return { label: 'Date ISO', regex: modeRegex('dateIso', text, strictness) };
  if (/^\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?$/.test(text)) return { label: 'Time', regex: modeRegex('time', text, strictness) };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return { label: 'Email', regex: modeRegex('email', text, strictness) };
  if (/^https?:\/\/\S+$/i.test(text)) return { label: 'URL', regex: modeRegex('url', text, strictness) };
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(text)) return { label: 'IPv4 address', regex: modeRegex('ipv4', text, strictness) };
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)) return { label: 'UUID', regex: modeRegex('uuid', text, strictness) };
  if (/^(?:0x)?[0-9a-f]+$/i.test(text) && /[a-f]/i.test(text)) return { label: 'Hex value', regex: modeRegex('hex', text, strictness) };
  if (/^(?:[A-Za-z_$][\w$]*\.)+[A-Za-z_$][\w$]*$/.test(text) || /^\[(?:[A-Za-z_$][\w$]*\.)+[A-Za-z_$][\w$]*\]$/.test(text)) return { label: 'Java class name', regex: modeRegex('javaClass', text, strictness) };
  if (/^(?:TRACE|DEBUG|INFO|WARN|WARNING|ERROR|FATAL|CRITICAL|NOTICE)$/i.test(text)) return { label: 'Log level', regex: modeRegex('logLevel', text, strictness) };
  if (/^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/i.test(text)) return { label: 'HTTP method', regex: modeRegex('httpMethod', text, strictness) };
  if (/^[1-5]\d{2}$/.test(text)) return { label: 'HTTP status', regex: modeRegex('httpStatus', text, strictness) };
  if (/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(text)) return { label: 'SemVer', regex: modeRegex('semver', text, strictness) };
  if (/^(?:true|false|null)$/i.test(text)) return { label: 'Boolean/null', regex: modeRegex('booleanLiteral', text, strictness) };
  if (/^(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/.test(text)) return { label: 'Domain', regex: modeRegex('domain', text, strictness) };
  if (/^(?:\.{0,2}\/|\/)?(?:[A-Za-z0-9._-]+\/)+[A-Za-z0-9._-]+$/.test(text)) return { label: 'File path', regex: modeRegex('filePath', text, strictness) };
  if (/^[A-Z]+$/.test(text)) return { label: 'Uppercase word', regex: modeRegex('uppercase', text, strictness) };
  if (/^#\w+$/.test(text)) return { label: 'Hashtag', regex: modeRegex('hashtag', text, strictness) };
  if (/^['"].*['"]$/.test(text)) return { label: 'Quoted string', regex: modeRegex('quoted', text, strictness) };
  if (/^\[[^\]]+\]$/.test(text)) return { label: 'Bracketed value', regex: modeRegex('bracketed', text, strictness) };
  if (/^\d+$/.test(text)) return { label: 'Number', regex: modeRegex('number', text, strictness) };
  if (/^[A-Za-z]+$/.test(text)) return { label: 'Alpha', regex: modeRegex('alpha', text, strictness) };
  if (/^\/[^\s]+$/.test(text)) return { label: 'URL path', regex: '\\/[^\\s]+' };
  if (/^[A-Za-z0-9_]+$/.test(text)) return { label: 'Word', regex: '[A-Za-z0-9_]+' };
  return { label: 'Exact', regex: escapeRegexPart(text) };
}

function compositeSuggestionsFor(text: string, strictness: number): RegexSuggestion[] {
  const tokens = text.match(/\s+|\S+/g) ?? [];
  if (tokens.length <= 1) return [];

  const parts = tokens.map((token) => classifyRegexSegment(token, strictness));
  const label = parts.map((part) => part.label).join(' + ');
  const regex = parts.map((part) => part.regex).join('');
  const suggestions: RegexSuggestion[] = [
    {
      mode: 'custom',
      label,
      regex,
      meaning: 'match this selected sequence by recognizing each part',
    },
  ];

  const trimmed = text.trim();
  if (trimmed && trimmed !== text) {
    const inner = classifyRegexSegment(trimmed, strictness);
    suggestions.push({
      mode: 'custom',
      label: `Optional whitespace + ${inner.label}`,
      regex: `\\s*${inner.regex}\\s*`,
      meaning: 'allow optional padding around the selected value',
    });
  }

  return suggestions;
}

function suggestionsFor(text: string, strictness: number) {
  const suggestions: RegexSuggestion[] = [
    { mode: 'exact', label: 'Exact', regex: modeRegex('exact', text, strictness), meaning: 'match this exact value' },
    ...compositeSuggestionsFor(text, strictness),
  ];

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    suggestions.push(
      { mode: 'dateIso', label: 'Date ISO', regex: modeRegex('dateIso', text, strictness), meaning: 'match ISO dates' },
      { mode: 'dateFlexible', label: 'Flexible date', regex: modeRegex('dateFlexible', text, strictness), meaning: 'allow - or / separators' }
    );
  }
  if (/^\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?$/.test(text)) {
    suggestions.push({ mode: 'time', label: 'Time', regex: modeRegex('time', text, strictness), meaning: 'match similar time values' });
  }
  if (/^\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/.test(text)) {
    suggestions.push({ mode: 'isoTimestamp', label: 'Log timestamp', regex: modeRegex('isoTimestamp', text, strictness), meaning: 'match API and application log timestamps' });
  }
  if (/^\[[A-Z][A-Z0-9_ -]*:[^\]]+\]$/.test(text)) {
    suggestions.push({ mode: 'custom', label: 'Bracketed field', regex: '\\[[A-Z][A-Z0-9_ -]*:[^\\]]+\\]', meaning: 'match metadata fields like [HOST:value] or [PID:8712]' });
  }
  if (new RegExp(`^\\[${LOG_LEVEL_SOURCE}\\]$`).test(text)) {
    suggestions.push({ mode: 'custom', label: 'Bracketed log level', regex: `\\[${LOG_LEVEL_SOURCE}\\]`, meaning: 'match severity inside square brackets' });
  }
  if (/^\[0x[0-9a-fA-F]+\]$/.test(text)) {
    suggestions.push({ mode: 'custom', label: 'Bracketed hex code', regex: '\\[0x[0-9a-fA-F]+\\]', meaning: 'match bracketed error or HRESULT code' });
  }
  if (/^\[[A-Za-z0-9_.$-]+\.(?:cpp|c|cc|h|hpp|java|js|ts|tsx|py|go|rb|php):\d+\]$/.test(text)) {
    suggestions.push({ mode: 'custom', label: 'Source location', regex: '\\[[A-Za-z0-9_.$-]+\\.(?:cpp|c|cc|h|hpp|java|js|ts|tsx|py|go|rb|php):\\d+\\]', meaning: 'match source file and line number inside brackets' });
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
    suggestions.push({ mode: 'email', label: 'Email', regex: modeRegex('email', text, strictness), meaning: 'match email addresses' });
  }
  if (/^https?:\/\/\S+$/i.test(text)) {
    suggestions.push({ mode: 'url', label: 'URL', regex: modeRegex('url', text, strictness), meaning: 'match HTTP URLs' });
  }
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(text)) {
    suggestions.push({ mode: 'ipv4', label: 'IPv4 address', regex: modeRegex('ipv4', text, strictness), meaning: 'match IPv4 addresses' });
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)) {
    suggestions.push({ mode: 'uuid', label: 'UUID', regex: modeRegex('uuid', text, strictness), meaning: 'match standard UUID values' });
  }
  if (/^(?:0x)?[0-9a-f]+$/i.test(text) && /[a-f]/i.test(text)) {
    suggestions.push({ mode: 'hex', label: 'Hex value', regex: modeRegex('hex', text, strictness), meaning: 'match hexadecimal values' });
  }
  if (/^(?:[A-Za-z_$][\w$]*\.)+[A-Za-z_$][\w$]*$/.test(text) || /^\[(?:[A-Za-z_$][\w$]*\.)+[A-Za-z_$][\w$]*\]$/.test(text)) {
    suggestions.push({ mode: 'javaClass', label: 'Java class name', regex: modeRegex('javaClass', text, strictness), meaning: 'match dotted package/class names' });
  }
  if (/^(?:TRACE|DEBUG|INFO|WARN|WARNING|ERROR|FATAL|CRITICAL|NOTICE)$/i.test(text)) {
    suggestions.push({ mode: 'logLevel', label: 'Log level', regex: modeRegex('logLevel', text, strictness), meaning: 'match common application log levels' });
  }
  if (/^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/i.test(text)) {
    suggestions.push({ mode: 'httpMethod', label: 'HTTP method', regex: modeRegex('httpMethod', text, strictness), meaning: 'match common HTTP verbs' });
  }
  if (/^[1-5]\d{2}$/.test(text)) {
    suggestions.push({ mode: 'httpStatus', label: 'HTTP status', regex: modeRegex('httpStatus', text, strictness), meaning: 'match HTTP response status codes' });
  }
  if (/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(text)) {
    suggestions.push({ mode: 'semver', label: 'SemVer', regex: modeRegex('semver', text, strictness), meaning: 'match semantic version strings' });
  }
  if (/^(?:true|false|null)$/i.test(text)) {
    suggestions.push({ mode: 'booleanLiteral', label: 'Boolean/null', regex: modeRegex('booleanLiteral', text, strictness), meaning: 'match JSON-style boolean or null values' });
  }
  if (/^(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/.test(text)) {
    suggestions.push({ mode: 'domain', label: 'Domain', regex: modeRegex('domain', text, strictness), meaning: 'match hostnames and domains' });
  }
  if (/^(?:\.{0,2}\/|\/)?(?:[A-Za-z0-9._-]+\/)+[A-Za-z0-9._-]+$/.test(text)) {
    suggestions.push({ mode: 'filePath', label: 'File path', regex: modeRegex('filePath', text, strictness), meaning: 'match Unix-style file or route paths' });
  }
  if (/^[A-Z]+$/.test(text)) {
    suggestions.push({ mode: 'uppercase', label: 'Uppercase word', regex: modeRegex('uppercase', text, strictness), meaning: 'match log levels or enum-like tokens' });
  }
  if (/^#\w+$/.test(text)) {
    suggestions.push({ mode: 'hashtag', label: 'Hashtag', regex: modeRegex('hashtag', text, strictness), meaning: 'match hashtag tokens' });
  }
  if (/^['"].*['"]$/.test(text)) {
    suggestions.push({ mode: 'quoted', label: 'Quoted string', regex: modeRegex('quoted', text, strictness), meaning: 'match quoted values' });
  }
  if (/^\[[^\]]+\]$/.test(text)) {
    suggestions.push({ mode: 'bracketed', label: 'Bracketed value', regex: modeRegex('bracketed', text, strictness), meaning: 'match text inside square brackets' });
  }
  if (/^[A-Za-z]+$/.test(text)) suggestions.push({ mode: 'alpha', label: 'Alpha', regex: modeRegex('alpha', text, strictness), meaning: 'match letters' });
  if (/^\d+$/.test(text)) suggestions.push({ mode: 'number', label: 'Number', regex: modeRegex('number', text, strictness), meaning: 'match numeric values' });
  if (/^\s+$/.test(text)) suggestions.push({ mode: 'whitespace', label: 'Whitespace', regex: modeRegex('whitespace', text, strictness), meaning: 'match spacing' });
  suggestions.push({ mode: 'any', label: 'Any', regex: modeRegex('any', text, strictness), meaning: 'match any text here' });
  return suggestions.filter((suggestion, index, all) => all.findIndex((item) => item.regex === suggestion.regex && item.label === suggestion.label) === index);
}

function findRegexCandidates(sample: string, strictness: number): RegexCandidate[] {
  const candidates: RegexCandidate[] = [];
  const seen = new Set<string>();

  const add = (
    layer: RegexCandidate['layer'],
    start: number,
    end: number,
    suggestion: RegexSuggestion
  ) => {
    if (end <= start) return;
    const text = sample.slice(start, end);
    if (text.length < 2 && !/^\s+$/.test(text)) return;
    if (/^\s$/.test(text)) return;
    const key = `${layer}:${start}:${end}:${suggestion.label}:${suggestion.regex}`;
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push({
      ...suggestion,
      id: key,
      start,
      end,
      text,
      layer,
      color: CANDIDATE_COLORS[layer],
    });
  };

  const scan = (
    layer: RegexCandidate['layer'],
    regex: RegExp,
    mode: RegexMode,
    label: string,
    meaning: string
  ) => {
    for (const match of sample.matchAll(regex)) {
      if (match.index === undefined) continue;
      const text = match[0];
      if (!text || text.length < 2) continue;
      add(layer, match.index, match.index + text.length, {
        mode,
        label,
        regex: modeRegex(mode, text, strictness),
        meaning,
      });
    }
  };

  scan('semantic', /\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?/g, 'isoTimestamp', 'Log timestamp', 'API and application log timestamp');
  scan('semantic', /\d{4}-\d{2}-\d{2}/g, 'dateIso', 'Date ISO', 'calendar date');
  scan('semantic', /\b\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?\b/g, 'time', 'Time', 'clock time');
  scan('semantic', /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, 'ipv4', 'IPv4 address', 'network address');
  scan('semantic', /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi, 'uuid', 'UUID', 'standard UUID');
  scan('semantic', /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, 'email', 'Email', 'email address');
  scan('semantic', /https?:\/\/[^\s]+/gi, 'url', 'URL', 'HTTP URL');
  scan('semantic', /\b(?:TRACE|DEBUG|INFO|WARN|WARNING|ERROR|FATAL|CRITICAL|NOTICE)\b/gi, 'logLevel', 'Log level', 'application log severity');
  scan('semantic', /\b(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/gi, 'httpMethod', 'HTTP method', 'HTTP request method');
  scan('semantic', /\b[1-5]\d{2}\b/g, 'httpStatus', 'HTTP status', 'response status code');
  scan('semantic', /\b\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?\b/g, 'semver', 'SemVer', 'semantic version');
  scan('semantic', /\b(?:true|false|null)\b/gi, 'booleanLiteral', 'Boolean/null', 'JSON literal');
  scan('semantic', /\b(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}\b/g, 'domain', 'Domain', 'hostname or domain');
  for (const match of sample.matchAll(/\[[^\]]+\]/g)) {
    if (match.index === undefined) continue;
    const text = match[0];
    const inner = text.slice(1, -1);
    let suggestion: RegexSuggestion;
    if (/^[A-Z][A-Z0-9_ -]*:.+$/.test(inner)) {
      suggestion = { mode: 'custom', label: 'Bracketed field', regex: '\\[[A-Z][A-Z0-9_ -]*:[^\\]]+\\]', meaning: 'metadata field inside square brackets' };
    } else if (new RegExp(`^${LOG_LEVEL_SOURCE}$`).test(inner)) {
      suggestion = { mode: 'custom', label: 'Bracketed log level', regex: `\\[${LOG_LEVEL_SOURCE}\\]`, meaning: 'severity inside square brackets' };
    } else if (/^0x[0-9a-fA-F]+$/.test(inner)) {
      suggestion = { mode: 'custom', label: 'Bracketed hex code', regex: '\\[0x[0-9a-fA-F]+\\]', meaning: 'error or HRESULT code inside brackets' };
    } else if (/^[A-Za-z0-9_.$-]+\.(?:cpp|c|cc|h|hpp|java|js|ts|tsx|py|go|rb|php):\d+$/.test(inner)) {
      suggestion = { mode: 'custom', label: 'Source location', regex: '\\[[A-Za-z0-9_.$-]+\\.(?:cpp|c|cc|h|hpp|java|js|ts|tsx|py|go|rb|php):\\d+\\]', meaning: 'source file and line number' };
    } else if (/^(?:[A-Za-z_$][\w$]*\.)+[A-Za-z_$][\w$]*$/.test(inner)) {
      suggestion = { mode: 'javaClass', label: 'Bracketed Java class', regex: modeRegex('javaClass', text, strictness), meaning: 'class name inside brackets' };
    } else {
      suggestion = { mode: 'bracketed', label: 'Bracketed label', regex: '\\[[^\\]]+\\]', meaning: 'single square-bracketed section' };
    }
    add('semantic', match.index, match.index + text.length, suggestion);
  }
  scan('semantic', /(?:[A-Za-z_$][\w$]*\.)+[A-Za-z_$][\w$]*/g, 'javaClass', 'Java class name', 'dotted package/class name');
  scan('semantic', /#[A-Za-z0-9_]+/g, 'hashtag', 'Hashtag', 'tag token');
  scan('semantic', /'[^']*'|"[^"]*"/g, 'quoted', 'Quoted string', 'quoted value');
  scan('semantic', /(?:\.{0,2}\/|\/)(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+/g, 'filePath', 'File path', 'Unix-style path');

  const semanticCandidates = candidates.filter((candidate) => candidate.layer === 'semantic');
  for (const candidate of semanticCandidates) {
    let start = candidate.start;
    let end = candidate.end;
    while (start > 0 && /\s/.test(sample[start - 1])) start -= 1;
    while (end < sample.length && /\s/.test(sample[end])) end += 1;
    if (start !== candidate.start || end !== candidate.end) {
      const text = sample.slice(start, end);
      const composite = compositeSuggestionsFor(text, strictness)[0];
      if (composite) add('context', start, end, composite);
    }
  }

  for (const match of sample.matchAll(/\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?\s+(?:(?:TRACE|DEBUG|INFO|WARN|WARNING|ERROR|FATAL|CRITICAL|NOTICE)|(?:\[[^\]]+\]))(?:\s*\[[^\]]+\])*/gi)) {
    if (match.index === undefined) continue;
    const text = match[0];
    const composite = compositeSuggestionsFor(text, strictness)[0];
    if (composite) {
      add('context', match.index, match.index + text.length, {
        ...composite,
        label: 'Log prefix',
        meaning: 'timestamp and bracketed metadata prefix',
      });
    }
  }

  for (const match of sample.matchAll(/(?:\[[^\]]+\]){2,}/g)) {
    if (match.index === undefined) continue;
    const text = match[0];
    add('context', match.index, match.index + text.length, {
      mode: 'custom',
      label: 'Bracketed metadata sequence',
      regex: '(?:\\[[^\\]]+\\])+',
      meaning: 'one or more adjacent bracketed metadata fields',
    });
  }

  const semantic: RegexCandidate[] = [];
  for (const candidate of candidates
    .filter((item) => item.layer === 'semantic')
    .sort((a, b) => (b.end - b.start) - (a.end - a.start) || a.start - b.start)) {
    const overlaps = semantic.some((kept) => candidate.start < kept.end && candidate.end > kept.start);
    if (!overlaps) semantic.push(candidate);
  }

  return [
    ...semantic.sort((a, b) => a.start - b.start || b.end - a.end),
    ...candidates.filter((item) => item.layer === 'context').sort((a, b) => a.start - b.start || b.end - a.end),
  ];
}

type SegmentSeed = Pick<RegexSuggestion, 'mode' | 'label' | 'regex' | 'meaning'> & {
  start: number;
  end: number;
  color?: string;
};

function segmentFromSeed(
  sample: string,
  strategy: SplitStrategyId,
  seed: SegmentSeed,
  index: number,
  muted = false
): RegexSegment {
  const config = SPLIT_STRATEGIES.find((item) => item.id === strategy)!;
  return {
    ...seed,
    id: `${strategy}:${seed.start}:${seed.end}:${seed.label}:${index}`,
    text: sample.slice(seed.start, seed.end),
    strategy,
    color: seed.color ?? config.color,
    muted,
  };
}

function fallbackSegment(
  sample: string,
  strategy: SplitStrategyId,
  start: number,
  end: number,
  strictness: number,
  fallbackLabel: string,
  index: number
): RegexSegment {
  const text = sample.slice(start, end);
  const whitespace = /^\s+$/.test(text);
  return segmentFromSeed(
    sample,
    strategy,
    {
      start,
      end,
      mode: whitespace ? 'whitespace' : 'exact',
      label: whitespace ? 'Spacing' : fallbackLabel,
      regex: modeRegex(whitespace ? 'whitespace' : 'exact', text, strictness),
      meaning: whitespace ? 'separator spacing' : `unclassified ${fallbackLabel.toLowerCase()}`,
    },
    index,
    true
  );
}

function partitionStrategy(
  sample: string,
  strategy: SplitStrategyId,
  seeds: SegmentSeed[],
  strictness: number,
  fallbackLabel: string
): RegexSegment[] {
  if (!sample) return [];

  const selected: SegmentSeed[] = [];
  for (const seed of seeds
    .filter((item) => item.end > item.start)
    .sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start))) {
    if (selected.some((kept) => seed.start < kept.end && seed.end > kept.start)) continue;
    selected.push(seed);
  }

  const segments: RegexSegment[] = [];
  let cursor = 0;
  let index = 0;
  for (const seed of selected.sort((a, b) => a.start - b.start)) {
    if (seed.start > cursor) {
      segments.push(fallbackSegment(sample, strategy, cursor, seed.start, strictness, fallbackLabel, index++));
    }
    segments.push(segmentFromSeed(sample, strategy, seed, index++));
    cursor = seed.end;
  }
  if (cursor < sample.length) {
    segments.push(fallbackSegment(sample, strategy, cursor, sample.length, strictness, fallbackLabel, index));
  }
  return segments;
}

function directSegments(
  sample: string,
  strategy: SplitStrategyId,
  regex: RegExp,
  strictness: number,
  labelFor: (text: string) => string
): RegexSegment[] {
  const segments: RegexSegment[] = [];
  let index = 0;
  for (const match of sample.matchAll(regex)) {
    if (match.index === undefined || !match[0]) continue;
    const text = match[0];
    const label = labelFor(text);
    const whitespace = /^\s+$/.test(text);
    const numeric = /^\d+(?:\.\d+)?$/.test(text);
    const mode: RegexMode = whitespace ? 'whitespace' : numeric ? 'number' : 'exact';
    segments.push(segmentFromSeed(sample, strategy, {
      start: match.index,
      end: match.index + text.length,
      mode,
      label,
      regex: modeRegex(mode, text, strictness),
      meaning: `${label.toLowerCase()} segment`,
    }, index++, whitespace));
  }
  return segments;
}

function wholeInputSeed(sample: string, label: string, meaning: string, color = STRUCTURE_COLORS.primary): SegmentSeed[] {
  const start = sample.search(/\S/);
  if (start < 0) return [];
  const end = sample.trimEnd().length;
  return [{
    start,
    end,
    mode: 'custom',
    label,
    regex: '[\\s\\S]+',
    meaning,
    color,
  }];
}

function buildIntentStructureSeeds(sample: string, intent: RegexInputIntent, strictness: number): SegmentSeed[] {
  const start = sample.search(/\S/);
  if (start < 0) return [];
  const trimmedEnd = sample.trimEnd().length;

  if (intent.id === 'log') {
    const seeds: SegmentSeed[] = [];
    const timestamp = sample.slice(start).match(/^\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?/);
    let cursor = start;
    if (timestamp) {
      const end = start + timestamp[0].length;
      seeds.push({
        start,
        end,
        mode: 'isoTimestamp',
        label: 'Timestamp',
        regex: modeRegex('isoTimestamp', timestamp[0], strictness),
        meaning: 'top-level event timestamp',
        color: STRUCTURE_COLORS.timestamp,
      });
      cursor = end;
    }

    while (cursor < sample.length && /\s/.test(sample[cursor])) cursor += 1;
    const metadata = sample.slice(cursor).match(/^(?:\[[^\]\r\n]+\])+/);
    if (metadata) {
      const end = cursor + metadata[0].length;
      seeds.push({
        start: cursor,
        end,
        mode: 'custom',
        label: 'Metadata',
        regex: '(?:\\[[^\\]]+\\])+',
        meaning: 'top-level bracketed metadata region',
        color: STRUCTURE_COLORS.metadata,
      });
      cursor = end;
    } else {
      const severity = sample.slice(cursor).match(/^(?:TRACE|DEBUG|INFO|WARN|WARNING|ERROR|FATAL|CRITICAL|NOTICE)\b/i);
      if (severity) {
        const end = cursor + severity[0].length;
        seeds.push({
          start: cursor,
          end,
          mode: 'logLevel',
          label: 'Metadata',
          regex: modeRegex('logLevel', severity[0], strictness),
          meaning: 'top-level event severity metadata',
          color: STRUCTURE_COLORS.metadata,
        });
        cursor = end;
      }
    }

    while (cursor < sample.length && /\s/.test(sample[cursor])) cursor += 1;
    if (cursor < trimmedEnd) {
      seeds.push({
        start: cursor,
        end: trimmedEnd,
        mode: 'custom',
        label: 'Message',
        regex: '.+',
        meaning: 'top-level human-readable event message',
        color: STRUCTURE_COLORS.message,
      });
    }
    return seeds;
  }

  if (intent.id === 'http') {
    const firstLineEnd = sample.indexOf('\n', start);
    const requestEnd = firstLineEnd < 0 ? trimmedEnd : firstLineEnd;
    const requestLine = sample.slice(start, requestEnd);
    const request = requestLine.match(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\S+)\s+(HTTP\/\d(?:\.\d)?)/i);
    if (request) {
      const methodStart = start;
      const targetStart = methodStart + request[1].length + request[0].slice(request[1].length).search(/\S/);
      const versionStart = targetStart + request[2].length + request[0].slice(targetStart - start + request[2].length).search(/\S/);
      const seeds: SegmentSeed[] = [
        {
          start: methodStart,
          end: methodStart + request[1].length,
          mode: 'httpMethod',
          label: 'Method',
          regex: modeRegex('httpMethod', request[1], strictness),
          meaning: 'HTTP request method',
          color: STRUCTURE_COLORS.primary,
        },
        {
          start: targetStart,
          end: targetStart + request[2].length,
          mode: 'custom',
          label: 'Request target',
          regex: '\\S+',
          meaning: 'HTTP path or absolute request URL',
          color: STRUCTURE_COLORS.secondary,
        },
        {
          start: versionStart,
          end: versionStart + request[3].length,
          mode: 'custom',
          label: 'Protocol',
          regex: 'HTTP\\/\\d(?:\\.\\d)?',
          meaning: 'HTTP protocol version',
          color: STRUCTURE_COLORS.timestamp,
        },
      ];
      if (firstLineEnd >= 0 && firstLineEnd + 1 < trimmedEnd) {
        seeds.push({
          start: firstLineEnd + 1,
          end: trimmedEnd,
          mode: 'custom',
          label: 'Headers / body',
          regex: '[\\s\\S]+',
          meaning: 'HTTP headers and optional body',
          color: STRUCTURE_COLORS.metadata,
        });
      }
      return seeds;
    }
    const response = requestLine.match(/^(HTTP\/\d(?:\.\d)?)\s+([1-5]\d{2})(?:\s+(.+))?/i);
    if (response) {
      const statusStart = start + response[1].length + response[0].slice(response[1].length).search(/\S/);
      const seeds: SegmentSeed[] = [
        {
          start,
          end: start + response[1].length,
          mode: 'custom',
          label: 'Protocol',
          regex: 'HTTP\\/\\d(?:\\.\\d)?',
          meaning: 'HTTP protocol version',
          color: STRUCTURE_COLORS.timestamp,
        },
        {
          start: statusStart,
          end: statusStart + response[2].length,
          mode: 'httpStatus',
          label: 'Status',
          regex: modeRegex('httpStatus', response[2], strictness),
          meaning: 'HTTP response status',
          color: STRUCTURE_COLORS.primary,
        },
      ];
      if (response[3]) {
        const reasonStart = requestLine.indexOf(response[3], statusStart - start + response[2].length);
        seeds.push({
          start: start + reasonStart,
          end: start + reasonStart + response[3].length,
          mode: 'custom',
          label: 'Reason',
          regex: '.+',
          meaning: 'HTTP response reason phrase',
          color: STRUCTURE_COLORS.message,
        });
      }
      if (firstLineEnd >= 0 && firstLineEnd + 1 < trimmedEnd) {
        seeds.push({
          start: firstLineEnd + 1,
          end: trimmedEnd,
          mode: 'custom',
          label: 'Headers / body',
          regex: '[\\s\\S]+',
          meaning: 'HTTP headers and optional body',
          color: STRUCTURE_COLORS.metadata,
        });
      }
      return seeds;
    }
    return wholeInputSeed(sample, 'HTTP exchange', 'HTTP request or response content');
  }

  if (intent.id === 'stack') {
    const firstLineEnd = sample.indexOf('\n', start);
    if (firstLineEnd >= 0) {
      return [
        {
          start,
          end: firstLineEnd,
          mode: 'custom',
          label: 'Exception',
          regex: '.+',
          meaning: 'exception or error summary',
          color: STRUCTURE_COLORS.message,
        },
        {
          start: firstLineEnd + 1,
          end: trimmedEnd,
          mode: 'custom',
          label: 'Stack frames',
          regex: '[\\s\\S]+',
          meaning: 'stack trace frames',
          color: STRUCTURE_COLORS.metadata,
        },
      ];
    }
  }

  if (intent.id === 'sql') {
    const verb = sample.slice(start).match(/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH|MERGE)\b/i);
    if (verb) {
      return [
        {
          start,
          end: start + verb[0].length,
          mode: 'custom',
          label: 'SQL operation',
          regex: '(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH|MERGE)',
          meaning: 'top-level SQL statement operation',
          color: STRUCTURE_COLORS.primary,
        },
        {
          start: start + verb[0].length,
          end: trimmedEnd,
          mode: 'custom',
          label: 'Query body',
          regex: '[\\s\\S]+',
          meaning: 'SQL query body',
          color: STRUCTURE_COLORS.secondary,
        },
      ];
    }
  }

  const labels: Record<Exclude<RegexInputIntentId, 'log' | 'http' | 'stack' | 'sql' | 'empty'>, [string, string]> = {
    json: ['JSON document', 'structured JSON document'],
    config: ['Configuration', 'configuration or telemetry fields'],
    url: ['URL', 'URL and its components'],
    engineering: ['Engineering message', 'engineering-oriented text or diagnostic message'],
    text: ['Text message', 'general text content'],
  };
  const [label, meaning] = labels[intent.id as keyof typeof labels] ?? labels.text;
  return wholeInputSeed(sample, label, meaning);
}

function buildDetailSeeds(sample: string): SegmentSeed[] {
  const seeds: SegmentSeed[] = [];
  const add = (start: number, end: number, label: string, regex: string, meaning: string) => {
    seeds.push({ start, end, mode: 'custom', label, regex, meaning });
  };

  for (const match of sample.matchAll(/\[[^\]\r\n]+\]/g)) {
    if (match.index === undefined) continue;
    const inner = match[0].slice(1, -1);
    const keyValue = inner.match(/^([A-Za-z][A-Za-z0-9_ -]*):(.*)$/);
    if (keyValue) {
      const key = keyValue[1].trim();
      add(match.index, match.index + match[0].length, `Metadata ${key}`, `\\[${escapeRegexPart(key)}:[^\\]]+\\]`, `metadata field named ${key}`);
    } else if (new RegExp(`^${LOG_LEVEL_SOURCE}$`, 'i').test(inner)) {
      add(match.index, match.index + match[0].length, 'Severity', `\\[${LOG_LEVEL_SOURCE}\\]`, 'bracketed log severity');
    } else if (/^0x[0-9a-fA-F]+$/.test(inner)) {
      add(match.index, match.index + match[0].length, 'Error code', '\\[0x[0-9a-fA-F]+\\]', 'bracketed hexadecimal error code');
    } else if (/^[A-Za-z0-9_.$-]+\.(?:cpp|c|cc|h|hpp|java|js|ts|tsx|py|go|rb|php):\d+$/.test(inner)) {
      add(match.index, match.index + match[0].length, 'Source location', '\\[[A-Za-z0-9_.$-]+\\.(?:cpp|c|cc|h|hpp|java|js|ts|tsx|py|go|rb|php):\\d+\\]', 'source file and line number');
    } else if (/^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/.test(inner)) {
      add(match.index, match.index + match[0].length, 'Numeric range', '\\[\\s*-?\\d+(?:\\.\\d+)?\\s*,\\s*-?\\d+(?:\\.\\d+)?\\s*\\]', 'numeric range or bounds');
    } else {
      add(match.index, match.index + match[0].length, 'Metadata label', '\\[[^\\]]+\\]', 'bracketed metadata label');
    }
  }

  for (const match of sample.matchAll(/\b[A-Za-z_][\w.-]*=(?:"[^"]*"|'[^']*'|[^\s,;]+)/g)) {
    if (match.index === undefined) continue;
    const key = match[0].split('=', 1)[0];
    add(match.index, match.index + match[0].length, `Attribute ${key}`, `${escapeRegexPart(key)}=(?:"[^"]*"|'[^']*'|[^\\s,;]+)`, `key=value attribute named ${key}`);
  }

  for (const match of sample.matchAll(/"([^"\\]*(?:\\.[^"\\]*)*)"\s*:/g)) {
    if (match.index === undefined) continue;
    add(match.index, match.index + match[0].length, `JSON key ${match[1]}`, `"${escapeRegexPart(match[1])}"\\s*:`, `JSON property named ${match[1]}`);
  }

  for (const match of sample.matchAll(/^(?:[A-Za-z][\w-]*):[ \t]*.+$/gm)) {
    if (match.index === undefined) continue;
    const key = match[0].slice(0, match[0].indexOf(':'));
    add(match.index, match.index + match[0].length, `Header ${key}`, `${escapeRegexPart(key)}:[^\\r\\n]+`, `header or colon-delimited field named ${key}`);
  }

  for (const match of sample.matchAll(/\bobject\s+id\s+([0-9a-fA-F]{16,})\b/gi)) {
    if (match.index === undefined) continue;
    add(match.index, match.index + match[0].length, 'Object ID', 'object\\s+id\\s+[0-9a-fA-F]{16,}', 'object identifier reference');
  }

  const fieldLabels: Record<string, string> = {
    type: 'Property type',
    function: 'Function',
    status: 'Status',
    code: 'Code',
    path: 'Path',
    file: 'File',
    line: 'Line',
    'request id': 'Request ID',
    'trace id': 'Trace ID',
    'span id': 'Span ID',
  };
  for (const match of sample.matchAll(/\b(type|function|status|code|path|file|line|request id|trace id|span id)\s*:\s*([^,\r\n]+)/gi)) {
    if (match.index === undefined) continue;
    const key = match[1].toLowerCase();
    add(match.index, match.index + match[0].length, fieldLabels[key], `${escapeRegexPart(match[1])}\\s*:\\s*[^,\\r\\n]+`, `labeled engineering field ${match[1]}`);
  }

  for (const match of sample.matchAll(/^\s*at\s+.+$/gm)) {
    if (match.index === undefined) continue;
    add(match.index, match.index + match[0].length, 'Stack frame', '\\s*at\\s+[^\\r\\n]+', 'stack trace frame');
  }

  for (const match of sample.matchAll(/\b[A-Za-z_$][\w$]*(?:::[A-Za-z_$][\w$]*)+\b/g)) {
    if (match.index === undefined) continue;
    add(match.index, match.index + match[0].length, 'Function symbol', '[A-Za-z_$][\\w$]*(?:::[A-Za-z_$][\\w$]*)+', 'qualified function or method symbol');
  }

  for (const match of sample.matchAll(/\b(https?):\/\/([^\/\s?#]+)(\/[^?\s#]*)?(\?[^#\s]*)?(#[^\s]*)?/gi)) {
    if (match.index === undefined) continue;
    let cursor = match.index;
    add(cursor, cursor + match[1].length, 'URL scheme', 'https?', 'URL transport scheme');
    cursor += match[1].length + 3;
    add(cursor, cursor + match[2].length, 'URL host', '[^\\/\\s?#]+', 'URL hostname and optional port');
    cursor += match[2].length;
    if (match[3]) {
      add(cursor, cursor + match[3].length, 'URL path', '\\/[^?\\s#]*', 'URL path');
      cursor += match[3].length;
    }
    if (match[4]) {
      add(cursor, cursor + match[4].length, 'URL query', '\\?[^#\\s]*', 'URL query string');
      cursor += match[4].length;
    }
    if (match[5]) {
      add(cursor, cursor + match[5].length, 'URL fragment', '#[^\\s]*', 'URL fragment');
    }
  }

  return seeds;
}

function buildStrategySegments(
  sample: string,
  candidates: RegexCandidate[],
  strictness: number,
  intent: RegexInputIntent
): Record<SplitStrategyId, RegexSegment[]> {
  const semanticSeeds: SegmentSeed[] = candidates
    .filter((candidate) => candidate.layer === 'semantic')
    .map(({ start, end, mode, label, regex, meaning }) => ({ start, end, mode, label, regex, meaning }));
  const structureSeeds = buildIntentStructureSeeds(sample, intent, strictness);
  const detailSeeds = buildDetailSeeds(sample);

  return {
    structure: partitionStrategy(sample, 'structure', structureSeeds, strictness, 'Context'),
    details: partitionStrategy(sample, 'details', detailSeeds, strictness, 'Context'),
    semantic: partitionStrategy(sample, 'semantic', semanticSeeds, strictness, 'Other text'),
    clause: directSegments(
      sample,
      'clause',
      /[^,;|\n.!?]+(?:[,;|]+|\n+|[.!?]+|$)/g,
      strictness,
      (text) => /^[,;|\n.!?]+$/.test(text) ? 'Separator' : 'Clause'
    ),
  };
}

function detectRegexInputIntent(sample: string): RegexInputIntent {
  const trimmed = sample.trim();
  if (!trimmed) return { id: 'empty', label: 'Waiting for input' };
  if (/^\{[\s\S]*\}$|^\[[\s\S]*\]$/.test(trimmed)) {
    try {
      JSON.parse(trimmed);
      return { id: 'json', label: 'JSON document detected' };
    } catch {
      // Continue with structural detection.
    }
  }
  if (/\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/.test(trimmed) && (/\[[^\]]+\]/.test(trimmed) || /\b(?:INFO|WARN|ERROR|DEBUG|TRACE|FATAL)\b/i.test(trimmed))) {
    return { id: 'log', label: 'Structured log detected' };
  }
  if (/^(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+\S+\s+HTTP\/\d/i.test(trimmed) || /^HTTP\/\d(?:\.\d)?\s+[1-5]\d{2}\b/i.test(trimmed)) {
    return { id: 'http', label: 'HTTP exchange detected' };
  }
  if (/^(?:Traceback|Caused by:|[A-Za-z_$][\w.$]*(?:Exception|Error)\b)/m.test(trimmed) || /^\s*at\s+.+$/m.test(trimmed)) {
    return { id: 'stack', label: 'Stack trace detected' };
  }
  if (/^(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH|MERGE)\b/i.test(trimmed)) {
    return { id: 'sql', label: 'SQL statement detected' };
  }
  if (/^https?:\/\//i.test(trimmed)) return { id: 'url', label: 'URL detected' };
  if (/^(?:[A-Za-z_][\w.-]*\s*[:=]\s*.+)(?:\r?\n[A-Za-z_][\w.-]*\s*[:=]\s*.+)*$/m.test(trimmed)) {
    return { id: 'config', label: 'Configuration fields detected' };
  }
  if (/\b(?:object\s+id|request\s+id|trace\s+id|span\s+id)\b/i.test(trimmed) || /\b[A-Za-z_$][\w$]*::[A-Za-z_$][\w$]*\b/.test(trimmed) || /\b[A-Za-z0-9_.$-]+\.(?:cpp|c|cc|h|hpp|java|js|ts|tsx|py|go|rb|php):\d+\b/.test(trimmed)) {
    return { id: 'engineering', label: 'Engineering message detected' };
  }
  return { id: 'text', label: 'General text detected' };
}

function highlightedRanges(sample: string, segments: RegexSegment[]) {
  const boundaries = new Set<number>([0, sample.length]);
  segments.forEach((segment) => {
    boundaries.add(segment.start);
    boundaries.add(segment.end);
  });
  const points = [...boundaries].sort((a, b) => a - b);
  return points.slice(0, -1).map((start, index) => {
    const end = points[index + 1];
    const matches = segments.filter((segment) => segment.start <= start && segment.end >= end);
    return {
      start,
      end,
      text: sample.slice(start, end),
      segment: matches[matches.length - 1] ?? null,
      labels: matches.map((segment) => `${SPLIT_STRATEGIES.find((strategy) => strategy.id === segment.strategy)?.label}: ${segment.label}`),
    };
  });
}

function applyGroup(regex: string, rule: RegexRule): string {
  let inner = regex;
  if (rule.groupMode === 'capture') inner = `(${inner})`;
  if (rule.groupMode === 'named') inner = `(?<${rule.name || 'value'}>${inner})`;
  if (rule.optional) inner = `(?:${inner})?`;
  return inner;
}

function buildManualRegex(sample: string, rules: RegexRule[]): string {
  const ordered = rules
    .filter((rule) => rule.enabled)
    .sort((a, b) => a.start - b.start || a.end - b.end);

  if (ordered.length === 0) {
    return generateRegexFromSample(sample || 'sample').pattern;
  }

  let cursor = 0;
  const parts: string[] = ['^'];
  for (const rule of ordered) {
    if (rule.start > cursor) parts.push(escapeRegexPart(sample.slice(cursor, rule.start)));
    parts.push(applyGroup(rule.regex, rule));
    cursor = Math.max(cursor, rule.end);
  }
  if (cursor < sample.length) parts.push(escapeRegexPart(sample.slice(cursor)));
  parts.push('$');
  return parts.join('');
}

function extractMatches(sample: string, pattern: string): Record<string, string> | null {
  try {
    const regex = new RegExp(pattern);
    const match = regex.exec(sample);
    if (!match) return null;
    if (match.groups) return match.groups;
    return Object.fromEntries(match.slice(1).map((value, index) => [`group${index + 1}`, value]));
  } catch {
    return null;
  }
}

function SplitStrategyBoard({
  intent,
  enabled,
  strategySegments,
  selectedIds,
  focusedId,
  onToggle,
  onFocus,
  onSelect,
}: {
  intent: RegexInputIntent;
  enabled: Record<SplitStrategyId, boolean>;
  strategySegments: Record<SplitStrategyId, RegexSegment[]>;
  selectedIds: Set<string>;
  focusedId: string | null;
  onToggle: (strategy: SplitStrategyId) => void;
  onFocus: (segment: RegexSegment | null) => void;
  onSelect: (segment: RegexSegment) => void;
}) {
  return (
    <section data-testid="smart-split-strategies" className="regex-strategies">
      <div className="regex-section-heading">
        <div>
          <span className="regex-kicker">Intent-aware split</span>
          <p>Detected {intent.label.toLowerCase()}. Read the top-level structure first, then inspect its fields and patterns.</p>
        </div>
        <span className="regex-count">{Object.values(enabled).filter(Boolean).length} active</span>
      </div>

      <div className="regex-strategy-toggles">
        {SPLIT_STRATEGIES.map((strategy) => (
          <button
            key={strategy.id}
            type="button"
            data-testid={`split-strategy-toggle-${strategy.id}`}
            aria-pressed={enabled[strategy.id]}
            className={`regex-strategy-toggle${enabled[strategy.id] ? ' is-active' : ''}`}
            onClick={() => onToggle(strategy.id)}
          >
            <span className="regex-switch" aria-hidden="true"><span /></span>
            <span>
              <strong>{strategy.label}</strong>
              <small>{strategy.description}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="regex-strategy-list">
        {SPLIT_STRATEGIES.filter((strategy) => enabled[strategy.id]).map((strategy) => {
          const segments = strategySegments[strategy.id];
          const labels = [...new Set(segments.filter((segment) => !segment.muted).map((segment) => segment.label))];
          return (
            <article key={strategy.id} data-testid={`split-strategy-${strategy.id}`} className="regex-strategy-card">
              <div className="regex-strategy-card-head">
                <div>
                  <span className="regex-strategy-dot" style={{ background: strategy.color }} />
                  <strong>{strategy.label}</strong>
                </div>
                <span>{segments.length} segments</span>
              </div>
              <div className="regex-segment-bar" role="group" aria-label={`${strategy.label} segments`}>
                {segments.map((segment) => {
                  const selected = selectedIds.has(segment.id);
                  const focused = focusedId === segment.id;
                  return (
                    <button
                      key={segment.id}
                      type="button"
                      aria-label={`${strategy.label}: ${segment.label}: ${segment.text}`}
                      aria-pressed={selected}
                      onMouseEnter={() => onFocus(segment)}
                      onMouseLeave={() => onFocus(null)}
                      onFocus={() => onFocus(segment)}
                      onClick={() => onSelect(segment)}
                      title={`${segment.label}: ${segment.text}\n${segment.regex}`}
                      className={`regex-segment${segment.muted ? ' is-muted' : ''}${selected ? ' is-selected' : ''}${focused ? ' is-focused' : ''}`}
                      style={{
                        flexGrow: Math.max(segment.end - segment.start, 1),
                        background: segment.muted ? 'var(--bg3)' : segment.color,
                      }}
                    >
                      <span>{segment.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="regex-segment-legend">
                {labels.length === 0 ? (
                  <span>No recognized structure yet</span>
                ) : labels.slice(0, 8).map((label) => (
                  <span key={label}><i style={{ background: segments.find((segment) => segment.label === label)?.color ?? strategy.color }} />{label}</span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SelectedSegmentsPanel({
  sample,
  segments,
  onFocus,
  onRemove,
}: {
  sample: string;
  segments: RegexSegment[];
  onFocus: (segment: RegexSegment) => void;
  onRemove: (segment: RegexSegment) => void;
}) {
  const [copied, setCopied] = useState(false);
  const ranges = highlightedRanges(sample, segments);
  const selectedText = segments
    .slice()
    .sort((a, b) => a.start - b.start || a.strategy.localeCompare(b.strategy))
    .map((segment) => segment.text)
    .join('\n');

  return (
    <section className="regex-selection-workspace">
      <div className="regex-section-heading">
        <div>
          <span className="regex-kicker">Selected segments</span>
          <p>Select a parent region or one of its details. Choosing an overlapping segment replaces the previous rule.</p>
        </div>
        <button
          type="button"
          className="regex-secondary-action"
          disabled={segments.length === 0}
          onClick={() => {
            copyToClipboard(selectedText);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
        >
          {copied ? 'Copied' : 'Copy selected'}
        </button>
      </div>

      <div data-testid="regex-selected-segments" className="regex-selected-chips">
        {segments.length === 0 ? (
          <span className="regex-empty-copy">Click a colored segment above to select it and add its inferred rule.</span>
        ) : segments.map((segment) => {
          const strategy = SPLIT_STRATEGIES.find((item) => item.id === segment.strategy)!;
          return (
            <div key={segment.id} className="regex-selected-chip" style={{ borderColor: strategy.color }}>
              <button type="button" onClick={() => onFocus(segment)}>
                <span style={{ color: strategy.color }}>{strategy.label}</span>
                <strong>{segment.label}</strong>
                <code>{segment.text}</code>
              </button>
              <button type="button" aria-label={`Remove ${segment.label} selection`} onClick={() => onRemove(segment)}>×</button>
            </div>
          );
        })}
      </div>

      <div className="regex-highlighted-view">
        <div className="regex-highlighted-view-head">
          <span>Highlighted source</span>
          <small>{segments.length === 0 ? 'Select segments to focus the source' : `${segments.length} selected`}</small>
        </div>
        <pre data-testid="regex-highlighted-source">
          {ranges.map((range) => (
            <span
              key={`${range.start}-${range.end}`}
              title={range.labels.join('\n')}
              className={range.segment ? 'is-highlighted' : segments.length > 0 ? 'is-dimmed' : ''}
              style={range.segment ? { background: range.segment.color } : undefined}
            >
              {range.text}
            </span>
          ))}
        </pre>
      </div>
    </section>
  );
}

function RegexBuilderDetail({ onUse, fullPanel = false }: { onUse: (v: string) => void; fullPanel?: boolean }) {
  const initialInput = useDevboxStore((state) => state.input);
  const [sample, setSample] = useState(initialInput || "2020-03-12T13:34:56.123Z INFO [org.example.Class]: This is a #simple #logline containing a 'value'.");
  const [selection, setSelection] = useState<{ start: number; end: number; text: string } | null>(null);
  const [rules, setRules] = useState<RegexRule[]>([]);
  const [activeRuleId, setActiveRuleId] = useState<string | null>(null);
  const [focusedSegmentId, setFocusedSegmentId] = useState<string | null>(null);
  const [selectedSegmentIds, setSelectedSegmentIds] = useState<Set<string>>(() => new Set());
  const [enabledStrategies, setEnabledStrategies] = useState<Record<SplitStrategyId, boolean>>(() =>
    Object.fromEntries(SPLIT_STRATEGIES.map((strategy) => [strategy.id, strategy.defaultEnabled])) as Record<SplitStrategyId, boolean>
  );
  const [strictness, setStrictness] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const candidates = useMemo(() => findRegexCandidates(sample, strictness), [sample, strictness]);
  const inputIntent = useMemo(() => detectRegexInputIntent(sample), [sample]);
  const strategySegments = useMemo(() => buildStrategySegments(sample, candidates, strictness, inputIntent), [sample, candidates, strictness, inputIntent]);
  const allSegments = useMemo(() => Object.values(strategySegments).flat(), [strategySegments]);
  const focusedSegment = focusedSegmentId ? allSegments.find((segment) => segment.id === focusedSegmentId) ?? null : null;
  const selectedSegments = allSegments.filter((segment) => selectedSegmentIds.has(segment.id));
  const activeRule = activeRuleId ? rules.find((rule) => rule.id === activeRuleId) ?? null : null;
  const selectedText = selection?.text || activeRule?.text || focusedSegment?.text || '';
  const suggestions = selectedText ? suggestionsFor(selectedText, strictness) : [];
  const pattern = buildManualRegex(sample, rules);
  const extracted = extractMatches(sample, pattern);
  const testOk = extracted !== null;

  const readSelection = () => {
    const el = textareaRef.current;
    if (!el || el.selectionStart === el.selectionEnd) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    setSelection({ start, end, text: sample.slice(start, end) });
    setFocusedSegmentId(null);
  };

  const addRuleFromRange = (start: number, end: number, mode: RegexMode, regex: string, label: string, sourceSegmentId?: string) => {
    const text = sample.slice(start, end);
    const isComposite = mode === 'custom';
    const id = `${Date.now()}-${start}-${end}`;
    const rule: RegexRule = {
      id,
      sourceSegmentId,
      start,
      end,
      text,
      mode,
      label,
      regex,
      groupMode: mode === 'exact' || mode === 'whitespace' || isComposite ? 'none' : 'named',
      name: guessGroupName(text, mode),
      optional: false,
      enabled: true,
    };
    setRules((prev) => [...prev.filter((item) => item.end <= rule.start || item.start >= rule.end), rule].sort((a, b) => a.start - b.start));
    setActiveRuleId(id);
    setSelection({ start, end, text });
  };

  const addRule = (mode: RegexMode, regexOverride?: string, labelOverride?: string) => {
    if (!selection) return;
    const regex = regexOverride ?? modeRegex(mode, selection.text, strictness);
    const label = labelOverride ?? (mode === 'dateIso' ? 'date' : mode === 'dateFlexible' ? 'date' : mode);
    addRuleFromRange(selection.start, selection.end, mode, regex, label);
  };

  const selectSegment = (segment: RegexSegment) => {
    setFocusedSegmentId(segment.id);
    if (selectedSegmentIds.has(segment.id)) {
      setSelectedSegmentIds((prev) => {
        const next = new Set(prev);
        next.delete(segment.id);
        return next;
      });
      setRules((prev) => prev.filter((rule) => rule.sourceSegmentId !== segment.id));
      return;
    }
    setSelectedSegmentIds((prev) => {
      const next = new Set(
        [...prev].filter((id) => {
          const selected = allSegments.find((item) => item.id === id);
          return !selected || selected.end <= segment.start || selected.start >= segment.end;
        })
      );
      next.add(segment.id);
      return next;
    });
    addRuleFromRange(segment.start, segment.end, segment.mode, segment.regex, segment.label, segment.id);
  };

  const updateRule = (id: string, patch: Partial<RegexRule>) => {
    setRules((prev) => prev.map((rule) => rule.id === id ? { ...rule, ...patch } : rule));
  };

  const applySuggestion = (suggestion: RegexSuggestion) => {
    if (activeRule) {
      updateRule(activeRule.id, {
        mode: suggestion.mode,
        regex: suggestion.regex,
        label: suggestion.label,
        name: guessGroupName(activeRule.text, suggestion.mode),
      });
      return;
    }
    if (selection) {
      addRule(suggestion.mode, suggestion.regex, suggestion.label);
      return;
    }
    if (focusedSegment) {
      addRuleFromRange(focusedSegment.start, focusedSegment.end, suggestion.mode, suggestion.regex, suggestion.label);
    }
  };

  const quickModes: { mode: RegexMode; label: string }[] = [
    { mode: 'exact', label: 'Exact' },
    { mode: 'alpha', label: 'Alpha' },
    { mode: 'number', label: 'Number' },
    { mode: 'whitespace', label: 'Whitespace' },
    { mode: 'any', label: 'Any' },
    { mode: 'dateIso', label: 'Date' },
    { mode: 'email', label: 'Email' },
    { mode: 'url', label: 'URL' },
    { mode: 'ipv4', label: 'IP' },
    { mode: 'custom', label: 'Custom' },
  ];

  return (
    <div className={`regex-builder-workspace${fullPanel ? ' is-full-panel' : ''}`}>
      <header className="regex-builder-hero">
        <div>
          <span className="regex-kicker">Smart Regex workspace</span>
          <h2>Understand the text before writing the pattern.</h2>
          <p>Compare structural interpretations, select the spans that matter, then refine the generated regex.</p>
        </div>
        <div className="regex-hero-actions">
          <span className="regex-detection-badge"><i />{inputIntent.label}</span>
          <button type="button" className="regex-primary-action" onClick={() => onUse(pattern)}>Use regex as input</button>
        </div>
      </header>

      <section className="regex-input-zone">
        <div className="regex-section-heading">
          <div>
            <span className="regex-kicker">Input zone</span>
            <p>Paste real production text. Drag-select any span for manual match suggestions.</p>
          </div>
          <div className="regex-input-meta">
            <span>{sample.length} chars</span>
            {selection && <span>{selection.text.length} selected</span>}
          </div>
        </div>
        <textarea
          data-testid="regex-builder-sample"
          ref={textareaRef}
          value={sample}
          onChange={(event) => {
            setSample(event.target.value);
            setRules([]);
            setSelection(null);
            setActiveRuleId(null);
            setFocusedSegmentId(null);
            setSelectedSegmentIds(new Set());
          }}
          onMouseUp={readSelection}
          onKeyUp={readSelection}
          spellCheck={false}
          className="regex-source-input"
          style={{ minHeight: fullPanel ? '180px' : '140px' }}
        />
        {selection && (
          <div className="regex-quick-actions">
            <span>Match selection as</span>
            {suggestions.slice(0, 4).map((suggestion) => (
              <button key={`suggested-${suggestion.mode}-${suggestion.regex}`} type="button" onClick={() => addRule(suggestion.mode, suggestion.regex, suggestion.label)}>
                {suggestion.label}
              </button>
            ))}
            {quickModes.map(({ mode, label }) => (
              <button key={mode} type="button" className="is-muted" onClick={() => addRule(mode)}>{label}</button>
            ))}
          </div>
        )}
      </section>

      <SplitStrategyBoard
        intent={inputIntent}
        enabled={enabledStrategies}
        strategySegments={strategySegments}
        selectedIds={selectedSegmentIds}
        focusedId={focusedSegmentId}
        onToggle={(strategy) => setEnabledStrategies((prev) => ({ ...prev, [strategy]: !prev[strategy] }))}
        onFocus={(segment) => setFocusedSegmentId(segment?.id ?? null)}
        onSelect={selectSegment}
      />

      <SelectedSegmentsPanel
        sample={sample}
        segments={selectedSegments}
        onFocus={(segment) => {
          setFocusedSegmentId(segment.id);
          setSelection({ start: segment.start, end: segment.end, text: segment.text });
          setActiveRuleId(rules.find((rule) => rule.sourceSegmentId === segment.id)?.id ?? null);
        }}
        onRemove={(segment) => {
          setSelectedSegmentIds((prev) => {
            const next = new Set(prev);
            next.delete(segment.id);
            return next;
          });
          setRules((prev) => prev.filter((rule) => rule.sourceSegmentId !== segment.id));
        }}
      />

      <div className="regex-rule-grid">
        <section className="regex-rule-card">
          <div className="regex-section-heading">
            <div>
              <span className="regex-kicker">Regex timeline</span>
              <p>Non-overlapping rules build the full-line expression from left to right.</p>
            </div>
            <span className="regex-count">{rules.length} rules</span>
          </div>
          <div className="regex-rule-timeline">
            {rules.length === 0 ? (
              <span className="regex-empty-copy">Select a segment or manually select text to start building.</span>
            ) : rules.map((rule) => (
              <button
                key={rule.id}
                type="button"
                onClick={() => {
                  setActiveRuleId(rule.id);
                  setSelection({ start: rule.start, end: rule.end, text: rule.text });
                }}
                title={rule.regex}
                className={activeRuleId === rule.id ? 'is-active' : ''}
              >
                <small>{rule.label}</small>
                <code>{rule.groupMode === 'named' ? `${rule.name}: ` : ''}{rule.regex}{rule.optional ? '?' : ''}</code>
              </button>
            ))}
          </div>

          <div className="regex-rule-editor">
            <span className="regex-kicker">Focused rule</span>
            {activeRule ? (
              <>
                <code className="regex-focused-value">{activeRule.text}</code>
                <div className="regex-toggle-row">
                  {(['none', 'capture', 'named'] as RegexGroupMode[]).map((mode) => (
                    <ToggleChip key={mode} label={mode === 'none' ? 'No group' : mode === 'capture' ? 'Capture' : 'Named'} active={activeRule.groupMode === mode} onClick={() => updateRule(activeRule.id, { groupMode: mode })} />
                  ))}
                  <ToggleChip label="Optional" active={activeRule.optional} onClick={() => updateRule(activeRule.id, { optional: !activeRule.optional })} />
                  <ToggleChip label={activeRule.enabled ? 'Enabled' : 'Disabled'} active={activeRule.enabled} onClick={() => updateRule(activeRule.id, { enabled: !activeRule.enabled })} />
                </div>
                {activeRule.groupMode === 'named' && (
                  <input value={activeRule.name} onChange={(event) => updateRule(activeRule.id, { name: event.target.value.replace(/[^A-Za-z0-9_]/g, '') })} placeholder="Group name" />
                )}
                <input value={activeRule.regex} onChange={(event) => updateRule(activeRule.id, { regex: event.target.value, mode: 'custom' })} placeholder="Custom regex" />
                <button
                  type="button"
                  className="regex-delete-action"
                  onClick={() => {
                    setRules((prev) => prev.filter((rule) => rule.id !== activeRule.id));
                    setActiveRuleId(null);
                  }}
                >
                  Delete rule
                </button>
              </>
            ) : (
              <span className="regex-empty-copy">Select a timeline rule to edit its capture mode, name, or regex.</span>
            )}
          </div>
        </section>

        <section className="regex-rule-card">
          <div className="regex-section-heading">
            <div>
              <span className="regex-kicker">Match suggestions</span>
              <p>Suggestions adapt to the selected or focused source span.</p>
            </div>
            <label className="regex-strictness">
              <span>{['Exact', 'Balanced', 'Flexible'][strictness]}</span>
              <input type="range" min={0} max={2} step={1} value={strictness} onChange={(event) => setStrictness(Number(event.target.value))} />
            </label>
          </div>
          {selectedText ? (
            <>
              <code className="regex-focused-value">{selectedText}</code>
              <div className="regex-suggestion-list">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.mode}-${suggestion.regex}`}
                    type="button"
                    className={index === 1 ? 'is-best' : ''}
                    onClick={() => applySuggestion(suggestion)}
                  >
                    <span>{index === 1 ? 'Best suggestion' : suggestion.label}</span>
                    <strong>{suggestion.label}</strong>
                    <code>{suggestion.regex}</code>
                    <small>{suggestion.meaning}</small>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <span className="regex-empty-copy">Hover a segment or select source text to inspect match suggestions.</span>
          )}
        </section>
      </div>

      <section data-testid="regex-builder-output-card" className="regex-output-card">
        <div className="regex-section-heading">
          <div>
            <span className="regex-kicker">PCRE2 regex</span>
            <p className={testOk ? 'regex-status-ok' : 'regex-status-error'}>{testOk ? 'Pattern matches the sample' : 'Pattern does not match the sample'}</p>
          </div>
          <div className="regex-output-actions">
            <button type="button" onClick={() => copyToClipboard(pattern)}>Copy PCRE2</button>
          </div>
        </div>
        <code data-testid="regex-builder-output" className={testOk ? 'is-valid' : 'is-invalid'}>{pattern}</code>
      </section>

      <div className="regex-preview-grid">
        <section>
          <div className="regex-section-heading"><span className="regex-kicker">Match preview</span></div>
          <pre>{sample}</pre>
        </section>
        <section>
          <div className="regex-section-heading"><span className="regex-kicker">Extracted JSON</span></div>
          <pre>{JSON.stringify(extracted ?? {}, null, 2)}</pre>
        </section>
      </div>
    </div>
  );
}

export function SmartRegexBuilderPanel() {
  const { setInput, setDetectionResults } = useDevboxStore();

  const handleUse = (value: string) => {
    setInput(value);
    setDetectionResults(runDetection(value));
  };

  return (
    <div data-testid="smart-regex-panel" className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
      <RegexBuilderDetail onUse={handleUse} fullPanel />
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
  kind: 'uuid' | 'regex-builder' | 'generic';
  def?: GeneratorDef;
}

function buildFlatList(pluginGenerators: ReturnType<typeof getGeneratorPlugins>): FlatEntry[] {
  const entries: FlatEntry[] = [];

  // UUID first
  entries.push({ id: 'uuid', label: 'UUID v4', description: 'Cryptographically random UUID', group: 'IDs & Tokens', kind: 'uuid' });
  entries.push({
    id: 'smart-regex-builder',
    label: 'Smart Regex Builder',
    description: 'Select text, choose intent, generate a PCRE2 regex',
    group: 'Text',
    kind: 'regex-builder',
  });

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

  // Group the filtered list for display. Custom entries can appear before the
  // built-in group block, so merge by label instead of assuming adjacency.
  const groupMap = new Map<string, { label: string; entries: FlatEntry[] }>();
  for (const entry of filtered) {
    const group = groupMap.get(entry.group);
    if (group) group.entries.push(entry);
    else groupMap.set(entry.group, { label: entry.group, entries: [entry] });
  }
  const groups = Array.from(groupMap.values());

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

  const HUB_HEIGHT = 620;
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
              : selected.kind === 'regex-builder'
                ? <RegexBuilderDetail onUse={onUse} />
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
          data-testid="generator-hub"
          className="absolute top-full left-0 z-40"
          style={{
            marginTop: '4px',
            background: 'var(--bg1)',
            border: '1px solid var(--border2)',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-lg)',
            width: 'min(980px, 94vw)',
            minWidth: 'min(720px, 94vw)',
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
