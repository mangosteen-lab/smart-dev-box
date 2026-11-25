import { registerTool } from '../registry';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
  decompressFromBase64,
  decompressFromUTF16,
  decompress as lzDecompress,
} from 'lz-string';

// ── LZ-String helpers ─────────────────────────────────────────────────────────
// LZ-String has several output variants (URL-safe / Base64 / UTF-16 / raw) that
// are NOT interchangeable. We can't tell them apart reliably from the alphabet
// alone (they overlap heavily), so we attempt every variant and keep the result
// that decompresses to the longest run of plausible text.

type LzVariant = 'URL-safe' | 'Base64' | 'UTF-16' | 'raw';

const LZ_DECOMPRESSORS: [LzVariant, (s: string) => string | null][] = [
  ['URL-safe', decompressFromEncodedURIComponent],
  ['Base64', decompressFromBase64],
  ['UTF-16', decompressFromUTF16],
  ['raw', lzDecompress],
];

// For auto-detection we only consider the variants people actually paste into a
// text field (URL-safe and Base64). The UTF-16 and raw variants emit arbitrary
// high/control characters, and plain `decompress` returns a stray 1-char result
// for all sorts of non-LZ input — both are false-positive magnets. They stay
// available for manual execution below.
const LZ_DETECT_VARIANTS = new Set<LzVariant>(['URL-safe', 'Base64']);

/** True when `s` is mostly printable text (no U+FFFD, ≥90% printable/whitespace). */
function looksLikeText(s: string): boolean {
  if (!s || s.includes('�')) return false;
  const chars = [...s];
  let printable = 0;
  for (const ch of chars) {
    const c = ch.codePointAt(0)!;
    if (c === 9 || c === 10 || c === 13 || (c >= 32 && c !== 127)) printable++;
  }
  return printable / chars.length >= 0.9;
}

/**
 * Try LZ-String variants and return the longest valid-text decode, or null.
 * `detectOnly` restricts to the pasteable variants and requires a non-trivial
 * result so detection doesn't fire on ordinary Base64/text.
 */
function decompressLzAnyVariant(
  input: string,
  detectOnly = false,
): { text: string; variant: LzVariant } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  let best: { text: string; variant: LzVariant } | null = null;
  for (const [variant, fn] of LZ_DECOMPRESSORS) {
    if (detectOnly && !LZ_DETECT_VARIANTS.has(variant)) continue;
    let out: string | null = null;
    try { out = fn(trimmed); } catch { out = null; }
    if (!out || !looksLikeText(out)) continue;
    if (detectOnly && out.length < 3) continue;
    if (!best || out.length > best.text.length) best = { text: out, variant };
  }
  return best;
}

registerTool({
  id: 'base64-encode',
  name: 'Base64 Encode',
  category: 'Encoding / Decoding',
  description: 'Encode text to Base64',
  keywords: ['base64', 'encode', 'b64'],
  outputExtension: 'txt',
  detect: (input) => {
    // Offer encode for anything that isn't already Base64
    return detectBase64(input) > 0 ? 0 : 0.1;
  },
  execute: async (input) => {
    const { toBase64 } = await import('js-base64');
    return { output: toBase64(input), outputLanguage: 'text' };
  },
});

registerTool({
  id: 'base64-decode',
  name: 'Base64 Decode',
  category: 'Encoding / Decoding',
  description: 'Decode a Base64 string back to text',
  keywords: ['base64', 'decode', 'b64'],
  outputExtension: 'txt',
  detect: detectBase64,
  execute: async (input) => {
    try {
      const clean = input.trim().replace(/\s/g, '');
      // Validate base64 before decoding
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean)) {
        return { output: '', error: 'Invalid Base64 string: contains non-Base64 characters' };
      }
      const { fromBase64 } = await import('js-base64');
      const decoded = fromBase64(clean);
      return { output: decoded, outputLanguage: 'text' };
    } catch {
      return { output: '', error: 'Invalid Base64 string' };
    }
  },
});

registerTool({
  id: 'url-encode',
  name: 'URL Encode',
  category: 'Encoding / Decoding',
  description: 'Percent-encode a string for use in URLs',
  keywords: ['url', 'encode', 'percent', 'uri', 'percent encode', 'percent encoding', 'percent encoding javascript', 'encodeuricomponent online', 'encode url component', 'url percent encoding'],
  outputExtension: 'txt',
  detect: (input) => {
    const hasSpecial = /[^A-Za-z0-9\-_.~]/.test(input);
    const isEncoded = /%[0-9A-Fa-f]{2}/.test(input);
    return hasSpecial && !isEncoded ? 0.3 : 0;
  },
  execute: (input) => ({ output: encodeURIComponent(input), outputLanguage: 'text' }),
});

registerTool({
  id: 'url-decode',
  name: 'URL Decode',
  category: 'Encoding / Decoding',
  description: 'Decode a percent-encoded URL string',
  keywords: ['url', 'decode', 'percent', 'uri'],
  outputExtension: 'txt',
  detect: (input) => {
    const hasEncoded = /%[0-9A-Fa-f]{2}/.test(input);
    return hasEncoded ? 0.9 : 0;
  },
  execute: (input) => {
    try {
      return { output: decodeURIComponent(input), outputLanguage: 'text' };
    } catch {
      return { output: '', error: 'Invalid percent-encoded string' };
    }
  },
});

registerTool({
  id: 'jwt-inspector',
  name: 'JWT Inspector',
  category: 'Encoding / Decoding',
  description: 'Decode and inspect a JWT token (header + payload)',
  keywords: ['jwt', 'token', 'bearer', 'auth', 'decode'],
  outputExtension: 'json',
  detect: (input) => {
    const parts = input.trim().split('.');
    return parts.length === 3 ? 0.95 : 0;
  },
  execute: async (input) => {
    try {
      const parts = input.trim().split('.');
      if (parts.length !== 3) throw new Error('Not a valid JWT (expected 3 parts)');
      const { fromBase64 } = await import('js-base64');
      const decode = (b64: string) =>
        JSON.parse(fromBase64(b64.replace(/-/g, '+').replace(/_/g, '/')));
      const header = decode(parts[0]);
      const payload = decode(parts[1]);
      const result = {
        header,
        payload,
        signature: parts[2] + ' (not verified)',
      };
      return { output: JSON.stringify(result, null, 2), outputLanguage: 'json' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Invalid JWT' };
    }
  },
});

registerTool({
  id: 'jwt-encoder',
  name: 'JWT Encoder',
  category: 'Encoding / Decoding',
  description: 'Create a signed JWT token (HS256 / HS384 / HS512) — opens dedicated editor',
  keywords: ['jwt', 'token', 'bearer', 'auth', 'encode', 'sign', 'hmac', 'hs256'],
  outputExtension: 'txt',
  // Never auto-detect — this tool has its own dedicated UI and is always invoked manually
  detect: () => 0,
  execute: async (input, options) => {
    try {
      const algorithm = (options?.algorithm as string) || 'HS256';
      const secret = (options?.secret as string) || 'your-256-bit-secret';

      const algoMap: Record<string, { name: string; hash: string }> = {
        HS256: { name: 'HMAC', hash: 'SHA-256' },
        HS384: { name: 'HMAC', hash: 'SHA-384' },
        HS512: { name: 'HMAC', hash: 'SHA-512' },
      };
      const algo = algoMap[algorithm];
      if (!algo) return { output: '', error: `Unsupported algorithm: ${algorithm}. Use HS256, HS384, or HS512.` };

      // Parse payload
      let payload: Record<string, unknown>;
      try {
        payload = JSON.parse(input.trim());
      } catch {
        return { output: '', error: 'Input must be a valid JSON object (the JWT payload)' };
      }
      if (typeof payload !== 'object' || Array.isArray(payload) || payload === null) {
        return { output: '', error: 'Payload must be a JSON object' };
      }

      // Add iat if not present
      if (!('iat' in payload)) {
        payload = { ...payload, iat: Math.floor(Date.now() / 1000) };
      }

      const base64UrlEncode = (obj: unknown) =>
        btoa(JSON.stringify(obj))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

      const header = { alg: algorithm, typ: 'JWT' };
      const headerEncoded = base64UrlEncode(header);
      const payloadEncoded = base64UrlEncode(payload);
      const signingInput = `${headerEncoded}.${payloadEncoded}`;

      // Sign with Web Crypto (fallback — prefer the dedicated JWT Encoder panel)
      if (typeof crypto === 'undefined' || !crypto.subtle) {
        return { output: '', error: 'Web Crypto API unavailable. Use the JWT Encoder tool in the sidebar for full signing support.' };
      }
      const keyData = new TextEncoder().encode(secret);
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: algo.name, hash: algo.hash },
        false,
        ['sign']
      );
      const signatureBuffer = await crypto.subtle.sign(
        algo.name,
        cryptoKey,
        new TextEncoder().encode(signingInput)
      );
      const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const token = `${signingInput}.${signature}`;

      const lines = [
        `Algorithm: ${algorithm}`,
        `Secret:    ${secret}`,
        '',
        '── Token ──────────────────────────────────────────────────────────────',
        token,
        '',
        '── Header ─────────────────────────────────────────────────────────────',
        JSON.stringify(header, null, 2),
        '',
        '── Payload ────────────────────────────────────────────────────────────',
        JSON.stringify(payload, null, 2),
      ];

      return { output: lines.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'JWT encoding failed' };
    }
  },
});

registerTool({
  id: 'html-encode',
  name: 'HTML Encode',
  category: 'Encoding / Decoding',
  description: 'Encode special characters to HTML entities',
  keywords: ['html', 'encode', 'entities', 'escape'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input) => {
    const map: Record<string, string> = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    };
    return { output: input.replace(/[&<>"']/g, (c) => map[c]), outputLanguage: 'text' };
  },
});

registerTool({
  id: 'html-decode',
  name: 'HTML Decode',
  category: 'Encoding / Decoding',
  description: 'Decode HTML entities back to characters',
  keywords: ['html', 'decode', 'entities', 'unescape'],
  outputExtension: 'txt',
  detect: (input) => {
    const hasEntities = /&(amp|lt|gt|quot|#39|apos);/.test(input);
    return hasEntities ? 0.85 : 0;
  },
  execute: (input) => {
    const map: Record<string, string> = {
      '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'",
    };
    const output = input.replace(/&(amp|lt|gt|quot|#39|apos);/g, (m) => map[m] ?? m);
    return { output, outputLanguage: 'text' };
  },
});

// ── Hex ↔ ASCII ───────────────────────────────────────────────────────────────

registerTool({
  id: 'hex-to-ascii',
  name: 'Hex → ASCII',
  category: 'Encoding / Decoding',
  description: 'Convert hexadecimal string to ASCII text',
  keywords: ['hex', 'ascii', 'decode', 'convert', 'hexadecimal'],
  outputExtension: 'txt',
  detect: (input) => {
    const clean = input.trim().replace(/\s+/g, '');
    return /^[0-9a-fA-F]+$/.test(clean) && clean.length % 2 === 0 && clean.length > 4 ? 0.8 : 0;
  },
  execute: (input) => {
    try {
      const clean = input.trim().replace(/\s+/g, '');
      if (!/^[0-9a-fA-F]+$/.test(clean) || clean.length % 2 !== 0)
        return { output: '', error: 'Input must be a valid even-length hex string' };
      let out = '';
      for (let i = 0; i < clean.length; i += 2)
        out += String.fromCharCode(parseInt(clean.slice(i, i + 2), 16));
      return { output: out, outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Conversion failed' };
    }
  },
});

registerTool({
  id: 'ascii-to-hex',
  name: 'ASCII → Hex',
  category: 'Encoding / Decoding',
  description: 'Convert ASCII text to hexadecimal string',
  keywords: ['ascii', 'hex', 'encode', 'convert', 'hexadecimal'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input) => {
    const hex = Array.from(input)
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(' ');
    return { output: hex, outputLanguage: 'text' };
  },
});

// ── Backslash Escape / Unescape ───────────────────────────────────────────────

registerTool({
  id: 'backslash-escape',
  name: 'Backslash Escape',
  category: 'Encoding / Decoding',
  description: 'Escape special characters with backslashes',
  keywords: ['backslash', 'escape', 'string', 'encode', 'newline'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input) => ({
    output: input
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'"),
    outputLanguage: 'text',
  }),
});

registerTool({
  id: 'backslash-unescape',
  name: 'Backslash Unescape',
  category: 'Encoding / Decoding',
  description: 'Unescape backslash-escaped characters',
  keywords: ['backslash', 'unescape', 'string', 'decode', 'newline'],
  outputExtension: 'txt',
  detect: (input) => /\\[nrt\\"']/.test(input) ? 0.7 : 0,
  execute: (input) => {
    try {
      const out = input
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, '\\');
      return { output: out, outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Unescape failed' };
    }
  },
});

// ── ROT13 / ROT47 ────────────────────────────────────────────────────────────

registerTool({
  id: 'rot13',
  name: 'ROT13',
  category: 'Encoding / Decoding',
  description: 'Encode/decode text using ROT13 cipher (rotate letters by 13)',
  keywords: ['rot13', 'cipher', 'encode', 'decode', 'rotate', 'caesar'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input) => ({
    output: input.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
    }),
    outputLanguage: 'text',
  }),
});

registerTool({
  id: 'rot47',
  name: 'ROT47',
  category: 'Encoding / Decoding',
  description: 'Encode/decode text using ROT47 cipher (rotate printable ASCII by 47)',
  keywords: ['rot47', 'cipher', 'encode', 'decode', 'rotate'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input) => ({
    output: input.replace(/[\x21-\x7E]/g, (c) =>
      String.fromCharCode(((c.charCodeAt(0) - 33 + 47) % 94) + 33)
    ),
    outputLanguage: 'text',
  }),
});

// ── Base32 Encode / Decode ────────────────────────────────────────────────────

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

registerTool({
  id: 'base32-encode',
  name: 'Base32 Encode',
  category: 'Encoding / Decoding',
  description: 'Encode text to Base32',
  keywords: ['base32', 'encode', 'b32'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input) => {
    const bytes = new TextEncoder().encode(input);
    let bits = 0, value = 0, output = '';
    for (const byte of bytes) {
      value = (value << 8) | byte;
      bits += 8;
      while (bits >= 5) {
        output += BASE32_CHARS[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }
    if (bits > 0) output += BASE32_CHARS[(value << (5 - bits)) & 31];
    while (output.length % 8) output += '=';
    return { output, outputLanguage: 'text' };
  },
});

registerTool({
  id: 'base32-decode',
  name: 'Base32 Decode',
  category: 'Encoding / Decoding',
  description: 'Decode a Base32 string back to text',
  keywords: ['base32', 'decode', 'b32'],
  outputExtension: 'txt',
  detect: (input) => {
    const clean = input.trim().replace(/=+$/, '').toUpperCase();
    return /^[A-Z2-7]+$/.test(clean) && clean.length > 4 && !(/^[A-Za-z0-9+/]+=*$/.test(input.trim())) ? 0.7 : 0;
  },
  execute: (input) => {
    try {
      const clean = input.trim().replace(/=+$/, '').toUpperCase();
      if (!/^[A-Z2-7]*$/.test(clean)) return { output: '', error: 'Invalid Base32 string' };
      const bytes: number[] = [];
      let bits = 0, value = 0;
      for (const ch of clean) {
        const idx = BASE32_CHARS.indexOf(ch);
        if (idx === -1) return { output: '', error: `Invalid Base32 character: ${ch}` };
        value = (value << 5) | idx;
        bits += 5;
        if (bits >= 8) { bytes.push((value >>> (bits - 8)) & 255); bits -= 8; }
      }
      return { output: new TextDecoder().decode(new Uint8Array(bytes)), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Base32 decode failed' };
    }
  },
});

// ── URL Parser ────────────────────────────────────────────────────────────────

registerTool({
  id: 'url-parser',
  name: 'URL Parser',
  category: 'Encoding / Decoding',
  description: 'Parse a URL into its components: protocol, host, path, query params, hash',
  keywords: ['url', 'parse', 'uri', 'query', 'protocol', 'hostname', 'path'],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    return /^https?:\/\/\S+/.test(t) ? 0.92 : /^(ftp|mailto|ws|wss):\/\//.test(t) ? 0.85 : 0;
  },
  execute: (input) => {
    try {
      const url = new URL(input.trim());
      const params: string[] = [];
      url.searchParams.forEach((v, k) => params.push(`  ${k} = ${v}`));
      const lines = [
        `Protocol:  ${url.protocol}`,
        `Host:      ${url.host}`,
        `Hostname:  ${url.hostname}`,
        `Port:      ${url.port || '(default)'}`,
        `Pathname:  ${url.pathname}`,
        `Search:    ${url.search || '(none)'}`,
        `Hash:      ${url.hash || '(none)'}`,
        `Origin:    ${url.origin}`,
        `Href:      ${url.href}`,
      ];
      if (params.length > 0) {
        lines.push('', 'Query Parameters:');
        lines.push(...params);
      }
      return { output: lines.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Invalid URL' };
    }
  },
});

// ── Base64 Image Encode/Decode ────────────────────────────────────────────────

registerTool({
  id: 'base64-image-decode',
  name: 'Base64 Image Decode',
  category: 'Encoding / Decoding',
  description: 'Decode a Base64 data URI and show image info',
  keywords: ['base64', 'image', 'decode', 'data uri', 'img'],
  outputExtension: 'txt',
  detect: (input) => /^data:image\/[a-z]+;base64,/.test(input.trim()) ? 0.95 : 0,
  execute: (input) => {
    const t = input.trim();
    const m = t.match(/^data:([^;]+);base64,(.+)$/);
    if (!m) return { output: '', error: 'Not a valid Base64 image data URI' };
    const mime = m[1];
    const data = m[2];
    const bytes = Math.floor(data.length * 3 / 4);
    const lines = [
      `MIME type:    ${mime}`,
      `Data length:  ${data.length} chars (~${(bytes / 1024).toFixed(1)} KB)`,
      ``,
      `HTML usage:`,
      `<img src="${t.slice(0, 60)}..." />`,
      ``,
      `CSS usage:`,
      `background-image: url("${t.slice(0, 60)}...");`,
    ];
    return { output: lines.join('\n'), outputLanguage: 'text' };
  },
});

// ── LZ-String Compress / Decompress ───────────────────────────────────────────

registerTool({
  id: 'lz-string-compress',
  name: 'LZ-String Compress',
  category: 'Encoding / Decoding',
  description: 'Compress text with LZ-String into a URL-safe (EncodedURIComponent) string',
  keywords: ['lz-string', 'lzstring', 'lz string', 'compress', 'compression', 'url', 'encodeduricomponent', 'lz'],
  outputExtension: 'txt',
  // Manual only — plain text is ambiguous, so never auto-suggest compression
  detect: () => 0,
  execute: (input) => {
    if (!input) return { output: '', outputLanguage: 'text' };
    try {
      return { output: compressToEncodedURIComponent(input), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'LZ-String compression failed' };
    }
  },
});

registerTool({
  id: 'lz-string-decompress',
  name: 'LZ-String Decompress',
  category: 'Encoding / Decoding',
  description: 'Decompress an LZ-String value (URL-safe, Base64, UTF-16, or raw) back to text',
  keywords: ['lz-string', 'lzstring', 'lz string', 'decompress', 'decompression', 'url', 'base64', 'utf16', 'lz'],
  outputExtension: 'txt',
  detect: (input) => {
    // Attempt an actual decompress across every variant — this is far more
    // reliable than an alphabet guess. Require a reasonably long input so we
    // don't fire on short Base64/text that happens to decode to a few chars.
    if (input.trim().length < 24) return 0;
    // High confidence when it fires: LZ-String Base64 output is also valid
    // plain Base64, so Base64 Decode (0.85) would otherwise win and hand back
    // binary garbage. A successful decompress to clean text is a much stronger
    // signal than "looks like Base64", so we rank above it.
    return decompressLzAnyVariant(input, true) ? 0.9 : 0;
  },
  execute: (input) => {
    if (!input) return { output: '', outputLanguage: 'text' };
    const result = decompressLzAnyVariant(input);
    if (!result) {
      return { output: '', error: 'Not a valid LZ-String value (tried URL-safe, Base64, UTF-16, and raw variants)' };
    }
    return { output: result.text, outputLanguage: 'text' };
  },
});

/**
 * Confidence that the input is Base64. Plain words such as "password" or
 * "select a from t" (once spaces are dropped) are valid Base64 by shape alone,
 * so also require no spaces inside a line and a decoded result that looks like
 * data: readable UTF-8 text scores high, binary only when the input carries
 * Base64-typical characters (digits, + / or = padding) and is reasonably long.
 */
export function detectBase64(input: string): number {
  const lines = input.trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0 || lines.some((l) => /\s/.test(l))) return 0;
  const clean = lines.join('');
  if (clean.length < 8 || clean.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(clean)) return 0;

  let bytes: Uint8Array;
  try {
    bytes = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
  } catch {
    return 0;
  }
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    const printable = [...text].filter((c) => /[\P{C}\t\n\r]/u.test(c)).length;
    if (text.length > 0 && printable / [...text].length >= 0.95) return 0.85;
  } catch {
    // not UTF-8: fall through to the binary check
  }
  return clean.length >= 24 && /[0-9+/=]/.test(clean) ? 0.5 : 0;
}
