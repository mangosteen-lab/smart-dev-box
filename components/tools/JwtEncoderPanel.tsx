'use client';

import { useState, useCallback } from 'react';
import { useDevboxStore } from '@/store/devbox';

const DEFAULT_HEADER = JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2);
const DEFAULT_PAYLOAD = JSON.stringify(
  {
    sub: '1234567890',
    name: 'John Doe',
    iat: Math.floor(Date.now() / 1000),
  },
  null,
  2
);

type Algorithm = 'HS256' | 'HS384' | 'HS512';

// ── Pure-JS SHA-2 + HMAC (works without Web Crypto / secure context) ─────────

// 32-bit right-rotate
const rotr32 = (x: number, n: number) => (x >>> n) | (x << (32 - n));

// SHA-256
function sha256(msgBytes: Uint8Array): Uint8Array {
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
  let h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];

  const msg = padSha(msgBytes, 64, 8);
  for (let i = 0; i < msg.length; i += 64) {
    const w = new Array(64);
    for (let j = 0; j < 16; j++) w[j] = (msg[i+j*4]<<24)|(msg[i+j*4+1]<<16)|(msg[i+j*4+2]<<8)|msg[i+j*4+3];
    for (let j = 16; j < 64; j++) {
      const s0 = rotr32(w[j-15],7)^rotr32(w[j-15],18)^(w[j-15]>>>3);
      const s1 = rotr32(w[j-2],17)^rotr32(w[j-2],19)^(w[j-2]>>>10);
      w[j] = (w[j-16]+s0+w[j-7]+s1)|0;
    }
    let [a,b,c,d,e,f,g,hh] = h;
    for (let j = 0; j < 64; j++) {
      const S1 = rotr32(e,6)^rotr32(e,11)^rotr32(e,25);
      const ch = (e&f)^(~e&g);
      const t1 = (hh+S1+ch+K[j]+w[j])|0;
      const S0 = rotr32(a,2)^rotr32(a,13)^rotr32(a,22);
      const maj = (a&b)^(a&c)^(b&c);
      const t2 = (S0+maj)|0;
      hh=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
    }
    h = [(h[0]+a)|0,(h[1]+b)|0,(h[2]+c)|0,(h[3]+d)|0,(h[4]+e)|0,(h[5]+f)|0,(h[6]+g)|0,(h[7]+hh)|0];
  }
  return u32sToBytes(h);
}

// 64-bit word helpers (stored as [hi,lo] pairs of 32-bit ints)
type W64 = [number, number];
const add64 = (a: W64, b: W64): W64 => {
  const lo = (a[1] + b[1]) >>> 0;
  const carry = lo < (a[1] >>> 0) ? 1 : 0;
  return [((a[0] + b[0] + carry) >>> 0), lo];
};
const rotr64 = (x: W64, n: number): W64 =>
  n < 32
    ? [((x[0] >>> n) | (x[1] << (32 - n))) >>> 0, ((x[1] >>> n) | (x[0] << (32 - n))) >>> 0]
    : [((x[1] >>> (n - 32)) | (x[0] << (64 - n))) >>> 0, ((x[0] >>> (n - 32)) | (x[1] << (64 - n))) >>> 0];
const shr64 = (x: W64, n: number): W64 => n < 32 ? [(x[0] >>> n) >>> 0, ((x[1] >>> n) | (x[0] << (32 - n))) >>> 0] : [(x[0] >>> (n - 32)) >>> 0, 0];
const xor64 = (a: W64, b: W64): W64 => [(a[0] ^ b[0]) >>> 0, (a[1] ^ b[1]) >>> 0];
const and64 = (a: W64, b: W64): W64 => [(a[0] & b[0]) >>> 0, (a[1] & b[1]) >>> 0];
const not64 = (a: W64): W64 => [(~a[0]) >>> 0, (~a[1]) >>> 0];

function sha512core(msgBytes: Uint8Array, truncLen: number): Uint8Array {
  // Initial hash values for SHA-512 / SHA-384
  const H512: W64[] = [
    [0x6a09e667,0xf3bcc908],[0xbb67ae85,0x84caa73b],[0x3c6ef372,0xfe94f82b],[0xa54ff53a,0x5f1d36f1],
    [0x510e527f,0xade682d1],[0x9b05688c,0x2b3e6c1f],[0x1f83d9ab,0xfb41bd6b],[0x5be0cd19,0x137e2179],
  ];
  const H384: W64[] = [
    [0xcbbb9d5d,0xc1059ed8],[0x629a292a,0x367cd507],[0x9159015a,0x3070dd17],[0x152fecd8,0xf70e5939],
    [0x67332667,0xffc00b31],[0x8eb44a87,0x68581511],[0xdb0c2e0d,0x64f98fa7],[0x47b5481d,0xbefa4fa4],
  ];
  const K512: W64[] = [
    [0x428a2f98,0xd728ae22],[0x71374491,0x23ef65cd],[0xb5c0fbcf,0xec4d3b2f],[0xe9b5dba5,0x8189dbbc],
    [0x3956c25b,0xf348b538],[0x59f111f1,0xb605d019],[0x923f82a4,0xaf194f9b],[0xab1c5ed5,0xda6d8118],
    [0xd807aa98,0xa3030242],[0x12835b01,0x45706fbe],[0x243185be,0x4ee4b28c],[0x550c7dc3,0xd5ffb4e2],
    [0x72be5d74,0xf27b896f],[0x80deb1fe,0x3b1696b1],[0x9bdc06a7,0x25c71235],[0xc19bf174,0xcf692694],
    [0xe49b69c1,0x9ef14ad2],[0xefbe4786,0x384f25e3],[0x0fc19dc6,0x8b8cd5b5],[0x240ca1cc,0x77ac9c65],
    [0x2de92c6f,0x592b0275],[0x4a7484aa,0x6ea6e483],[0x5cb0a9dc,0xbd41fbd4],[0x76f988da,0x831153b5],
    [0x983e5152,0xee66dfab],[0xa831c66d,0x2db43210],[0xb00327c8,0x98fb213f],[0xbf597fc7,0xbeef0ee4],
    [0xc6e00bf3,0x3da88fc2],[0xd5a79147,0x930aa725],[0x06ca6351,0xe003826f],[0x14292967,0x0a0e6e70],
    [0x27b70a85,0x46d22ffc],[0x2e1b2138,0x5c26c926],[0x4d2c6dfc,0x5ac42aed],[0x53380d13,0x9d95b3df],
    [0x650a7354,0x8baf63de],[0x766a0abb,0x3c77b2a8],[0x81c2c92e,0x47edaee6],[0x92722c85,0x1482353b],
    [0xa2bfe8a1,0x4cf10364],[0xa81a664b,0xbc423001],[0xc24b8b70,0xd0f89791],[0xc76c51a3,0x0654be30],
    [0xd192e819,0xd6ef5218],[0xd6990624,0x5565a910],[0xf40e3585,0x5771202a],[0x106aa070,0x32bbd1b8],
    [0x19a4c116,0xb8d2d0c8],[0x1e376c08,0x5141ab53],[0x2748774c,0xdf8eeb99],[0x34b0bcb5,0xe19b48a8],
    [0x391c0cb3,0xc5c95a63],[0x4ed8aa4a,0xe3418acb],[0x5b9cca4f,0x7763e373],[0x682e6ff3,0xd6b2b8a3],
    [0x748f82ee,0x5defb2fc],[0x78a5636f,0x43172f60],[0x84c87814,0xa1f0ab72],[0x8cc70208,0x1a6439ec],
    [0x90befffa,0x23631e28],[0xa4506ceb,0xde82bde9],[0xbef9a3f7,0xb2c67915],[0xc67178f2,0xe372532b],
    [0xca273ece,0xea26619c],[0xd186b8c7,0x21c0c207],[0xeada7dd6,0xcde0eb1e],[0xf57d4f7f,0xee6ed178],
    [0x06f067aa,0x72176fba],[0x0a637dc5,0xa2c898a6],[0x113f9804,0xbef90dae],[0x1b710b35,0x131c471b],
    [0x28db77f5,0x23047d84],[0x32caab7b,0x40c72493],[0x3c9ebe0a,0x15c9bebc],[0x431d67c4,0x9c100d4c],
    [0x4cc5d4be,0xcb3e42b6],[0x597f299c,0xfc657e2a],[0x5fcb6fab,0x3ad6faec],[0x6c44198c,0x4a475817],
  ];

  const h: W64[] = (truncLen === 48 ? H384 : H512).map((v) => [...v] as W64);
  const msg = padSha(msgBytes, 128, 16);

  for (let i = 0; i < msg.length; i += 128) {
    const w: W64[] = new Array(80);
    for (let j = 0; j < 16; j++) {
      w[j] = [
        (msg[i+j*8]<<24)|(msg[i+j*8+1]<<16)|(msg[i+j*8+2]<<8)|msg[i+j*8+3],
        (msg[i+j*8+4]<<24)|(msg[i+j*8+5]<<16)|(msg[i+j*8+6]<<8)|msg[i+j*8+7],
      ] as W64;
    }
    for (let j = 16; j < 80; j++) {
      const s0 = xor64(xor64(rotr64(w[j-15],1), rotr64(w[j-15],8)), shr64(w[j-15],7));
      const s1 = xor64(xor64(rotr64(w[j-2],19), rotr64(w[j-2],61)), shr64(w[j-2],6));
      w[j] = add64(add64(add64(w[j-16], s0), w[j-7]), s1);
    }
    let [a,b,c,d,e,f,g,hh] = h.map((v) => [...v] as W64);
    for (let j = 0; j < 80; j++) {
      const S1 = xor64(xor64(rotr64(e,14), rotr64(e,18)), rotr64(e,41));
      const ch = xor64(and64(e,f), and64(not64(e),g));
      const t1 = add64(add64(add64(add64(hh,S1),ch),K512[j]),w[j]);
      const S0 = xor64(xor64(rotr64(a,28), rotr64(a,34)), rotr64(a,39));
      const maj = xor64(xor64(and64(a,b),and64(a,c)),and64(b,c));
      const t2 = add64(S0, maj);
      hh=g; g=f; f=e; e=add64(d,t1); d=c; c=b; b=a; a=add64(t1,t2);
    }
    const hvals = [a,b,c,d,e,f,g,hh];
    for (let j = 0; j < 8; j++) h[j] = add64(h[j], hvals[j]);
  }
  return u32sToBytes(h.slice(0, truncLen / 4).flatMap((v) => v));
}

function padSha(bytes: Uint8Array, blockSize: number, lenBytes: number): Uint8Array {
  const bitLen = bytes.length * 8;
  const padLen = ((bytes.length + 1 + lenBytes + blockSize - 1) & ~(blockSize - 1)) - bytes.length;
  const out = new Uint8Array(bytes.length + padLen);
  out.set(bytes);
  out[bytes.length] = 0x80;
  // Write bit length as big-endian in the last lenBytes bytes
  let bl = bitLen;
  for (let i = out.length - 1; i >= out.length - lenBytes && bl > 0; i--) {
    out[i] = bl & 0xff;
    bl = Math.floor(bl / 256);
  }
  return out;
}

function u32sToBytes(words: number[]): Uint8Array {
  const out = new Uint8Array(words.length * 4);
  for (let i = 0; i < words.length; i++) {
    out[i*4]   = (words[i] >>> 24) & 0xff;
    out[i*4+1] = (words[i] >>> 16) & 0xff;
    out[i*4+2] = (words[i] >>> 8)  & 0xff;
    out[i*4+3] =  words[i]         & 0xff;
  }
  return out;
}

function hmac(hashFn: (b: Uint8Array) => Uint8Array, blockSize: number, keyBytes: Uint8Array, msgBytes: Uint8Array): Uint8Array {
  const key = keyBytes.length > blockSize ? hashFn(keyBytes) : keyBytes;
  const k = new Uint8Array(blockSize);
  k.set(key);
  const ipad = k.map((b) => b ^ 0x36);
  const opad = k.map((b) => b ^ 0x5c);
  const inner = new Uint8Array(ipad.length + msgBytes.length);
  inner.set(ipad); inner.set(msgBytes, ipad.length);
  const innerHash = hashFn(inner);
  const outer = new Uint8Array(opad.length + innerHash.length);
  outer.set(opad); outer.set(innerHash, opad.length);
  return hashFn(outer);
}

function hmacSign(algorithm: Algorithm, keyBytes: Uint8Array, msgBytes: Uint8Array): Uint8Array {
  if (algorithm === 'HS256') return hmac((b) => sha256(b), 64, keyBytes, msgBytes);
  if (algorithm === 'HS384') return hmac((b) => sha512core(b, 48), 128, keyBytes, msgBytes);
  return hmac((b) => sha512core(b, 64), 128, keyBytes, msgBytes);
}

// ─────────────────────────────────────────────────────────────────────────────

function base64UrlEncode(obj: unknown): string {
  return btoa(JSON.stringify(obj))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function buildJwt(
  headerJson: string,
  payloadJson: string,
  secret: string,
  algorithm: Algorithm
): string {
  const header = JSON.parse(headerJson);
  const payload = JSON.parse(payloadJson);

  const headerEncoded = base64UrlEncode(header);
  const payloadEncoded = base64UrlEncode(payload);
  const signingInput = `${headerEncoded}.${payloadEncoded}`;

  const keyBytes = new TextEncoder().encode(secret);
  const msgBytes = new TextEncoder().encode(signingInput);
  const sigBytes = hmacSign(algorithm, keyBytes, msgBytes);
  const signature = base64UrlEncodeBytes(sigBytes);

  return `${signingInput}.${signature}`;
}

function JsonEditor({
  label,
  value,
  onChange,
  error,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  error?: string | null;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
        {label}
      </label>
      <div
        className="rounded-lg overflow-hidden"
        style={{ border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}` }}
      >
        <textarea
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          readOnly={readOnly}
          spellCheck={false}
          className="code-input w-full resize-none text-sm leading-relaxed outline-none bg-transparent p-3"
          style={{
            color: 'var(--foreground)',
            minHeight: '120px',
            fontFamily: 'var(--font-mono, monospace)',
            background: readOnly ? 'var(--surface-2)' : 'var(--surface)',
          }}
        />
      </div>
      {error && (
        <p className="text-xs" style={{ color: 'var(--error)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function JwtEncoderPanel() {
  const { addOutput } = useDevboxStore();

  const [algorithm, setAlgorithm] = useState<Algorithm>('HS256');
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [secretVisible, setSecretVisible] = useState(false);
  const [headerJson, setHeaderJson] = useState(DEFAULT_HEADER);
  const [payloadJson, setPayloadJson] = useState(DEFAULT_PAYLOAD);

  const [headerError, setHeaderError] = useState<string | null>(null);
  const [payloadError, setPayloadError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync algorithm field in header JSON whenever algorithm selector changes
  const handleAlgorithmChange = (alg: Algorithm) => {
    setAlgorithm(alg);
    try {
      const h = JSON.parse(headerJson);
      h.alg = alg;
      setHeaderJson(JSON.stringify(h, null, 2));
      setHeaderError(null);
    } catch {
      // header is invalid JSON, leave it
    }
  };

  const validate = useCallback((): boolean => {
    let valid = true;
    try { JSON.parse(headerJson); setHeaderError(null); }
    catch (e) { setHeaderError((e as Error).message); valid = false; }
    try { JSON.parse(payloadJson); setPayloadError(null); }
    catch (e) { setPayloadError((e as Error).message); valid = false; }
    return valid;
  }, [headerJson, payloadJson]);

  const handleEncode = () => {
    if (!validate()) return;
    setIsLoading(true);
    setToken(null);
    try {
      const jwt = buildJwt(headerJson, payloadJson, secret, algorithm);
      setToken(jwt);
      addOutput({
        toolId: 'jwt-encoder',
        toolName: 'JWT Encoder',
        result: { output: jwt, outputLanguage: 'text' },
        timestamp: Date.now(),
      });
    } catch (err) {
      setToken(null);
      setHeaderError(err instanceof Error ? err.message : 'Encoding failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!token) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(token).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    } else {
      const el = document.createElement('textarea');
      el.value = token;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Colour-code the three JWT parts
  const tokenParts = token?.split('.');
  const TOKEN_COLORS = ['#60a5fa', '#34d399', '#f87171']; // blue, green, red

  return (
    <div className="flex flex-col gap-4">
      {/* Top controls row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Algorithm selector */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Algorithm
          </label>
          <div className="flex gap-1">
            {(['HS256', 'HS384', 'HS512'] as Algorithm[]).map((alg) => (
              <button
                key={alg}
                onClick={() => handleAlgorithmChange(alg)}
                className="text-xs px-3 py-1.5 rounded font-mono font-medium transition-colors"
                style={{
                  background: algorithm === alg ? 'var(--primary)' : 'var(--surface-2)',
                  color: algorithm === alg ? 'white' : 'var(--muted)',
                  border: '1px solid var(--border)',
                }}
              >
                {alg}
              </button>
            ))}
          </div>
        </div>

        {/* Secret */}
        <div className="flex flex-col gap-1 flex-1" style={{ minWidth: '200px' }}>
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
            Secret
          </label>
          <div className="flex gap-1">
            <div
              className="flex flex-1 items-center rounded overflow-hidden"
              style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
            >
              <input
                type={secretVisible ? 'text' : 'password'}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="flex-1 text-sm px-3 py-1.5 outline-none bg-transparent font-mono"
                style={{ color: 'var(--foreground)' }}
                placeholder="Enter secret key"
              />
              <button
                onClick={() => setSecretVisible((v) => !v)}
                className="px-2 text-xs"
                style={{ color: 'var(--muted)' }}
                title={secretVisible ? 'Hide secret' : 'Show secret'}
              >
                {secretVisible ? '🙈' : '👁'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Three panels: Header | Payload */}
      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <JsonEditor
          label="Header"
          value={headerJson}
          onChange={(v) => { setHeaderJson(v); setHeaderError(null); }}
          error={headerError}
        />
        <JsonEditor
          label="Payload"
          value={payloadJson}
          onChange={(v) => { setPayloadJson(v); setPayloadError(null); }}
          error={payloadError}
        />
      </div>

      {/* Encode button */}
      <button
        onClick={handleEncode}
        disabled={isLoading}
        className="self-start text-sm px-5 py-2 rounded font-medium transition-opacity"
        style={{
          background: 'var(--primary)',
          color: 'white',
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? 'Encoding…' : 'Encode & Sign'}
      </button>

      {/* Token output */}
      {token && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
              Signed Token
            </label>
            <button
              onClick={handleCopy}
              className="text-xs px-2 py-1 rounded transition-colors"
              style={{
                background: copied ? 'rgba(34,197,94,0.15)' : 'transparent',
                color: copied ? 'var(--success)' : 'var(--muted)',
                border: '1px solid var(--border)',
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div
            className="rounded-lg p-3 text-sm font-mono break-all leading-relaxed"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            {tokenParts?.map((part, i) => (
              <span key={i}>
                <span style={{ color: TOKEN_COLORS[i] }}>{part}</span>
                {i < 2 && <span style={{ color: 'var(--muted)' }}>.</span>}
              </span>
            ))}
          </div>

          {/* Decoded breakdown */}
          <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            {['Header', 'Payload', 'Signature'].map((label, i) => (
              <div key={label} className="flex flex-col gap-1">
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: TOKEN_COLORS[i] }}
                >
                  {label}
                </span>
                <div
                  className="rounded p-2 text-xs font-mono break-all"
                  style={{
                    background: 'var(--surface-2)',
                    border: `1px solid ${TOKEN_COLORS[i]}33`,
                    color: 'var(--foreground)',
                    minHeight: '48px',
                  }}
                >
                  {i === 2
                    ? tokenParts?.[2]
                    : (() => {
                        try {
                          const raw = tokenParts?.[i] ?? '';
                          const padded = raw + '='.repeat((4 - (raw.length % 4)) % 4);
                          return JSON.stringify(
                            JSON.parse(atob(padded.replace(/-/g, '+').replace(/_/g, '/'))),
                            null,
                            2
                          );
                        } catch {
                          return tokenParts?.[i] ?? '';
                        }
                      })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
