import { registerTool } from '../registry';

registerTool({
  id: 'uuid-generator',
  name: 'UUID Generator',
  category: 'Generation',
  description: 'Generate UUID v4 strings',
  keywords: ['uuid', 'guid', 'generate', 'random', 'id'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (_input, options) => {
    const count = typeof options?.count === 'number' ? Math.min(options.count, 1000) : 1;
    const uuids: string[] = [];
    for (let i = 0; i < count; i++) {
      uuids.push(crypto.randomUUID());
    }
    return { output: uuids.join('\n'), outputLanguage: 'text' };
  },
});

registerTool({
  id: 'hash-generator',
  name: 'Hash Generator',
  category: 'Generation',
  description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes',
  keywords: ['hash', 'sha', 'md5', 'sha256', 'sha512', 'checksum', 'digest'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: async (input) => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      const [sha1, sha256, sha512] = await Promise.all([
        crypto.subtle.digest('SHA-1', data),
        crypto.subtle.digest('SHA-256', data),
        crypto.subtle.digest('SHA-512', data),
      ]);

      const toHex = (buf: ArrayBuffer) =>
        Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

      // MD5 via simple implementation (Web Crypto doesn't support MD5)
      const md5 = await md5Hash(input);

      const lines = [
        `MD5:     ${md5}`,
        `SHA-1:   ${toHex(sha1)}`,
        `SHA-256: ${toHex(sha256)}`,
        `SHA-512: ${toHex(sha512)}`,
      ];
      return { output: lines.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Hash failed' };
    }
  },
});

// Minimal MD5 implementation (RFC 1321)
async function md5Hash(str: string): Promise<string> {
  function safeAdd(x: number, y: number) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function bitRotateLeft(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function md5blks(s: string): number[] {
    const l = s.length;
    const nblk = ((l + 8) >> 6) + 1;
    const blks: number[] = new Array(nblk * 16).fill(0);
    for (let i = 0; i < l; i++) blks[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8);
    blks[l >> 2] |= 0x80 << ((l % 4) * 8);
    blks[nblk * 16 - 2] = l * 8;
    return blks;
  }

  const x = md5blks(str);
  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const oa = a, ob = b, oc = c, od = d;
    a = md5ff(a,b,c,d,x[i],7,-680876936); d = md5ff(d,a,b,c,x[i+1],12,-389564586);
    c = md5ff(c,d,a,b,x[i+2],17,606105819); b = md5ff(b,c,d,a,x[i+3],22,-1044525330);
    a = md5ff(a,b,c,d,x[i+4],7,-176418897); d = md5ff(d,a,b,c,x[i+5],12,1200080426);
    c = md5ff(c,d,a,b,x[i+6],17,-1473231341); b = md5ff(b,c,d,a,x[i+7],22,-45705983);
    a = md5ff(a,b,c,d,x[i+8],7,1770035416); d = md5ff(d,a,b,c,x[i+9],12,-1958414417);
    c = md5ff(c,d,a,b,x[i+10],17,-42063); b = md5ff(b,c,d,a,x[i+11],22,-1990404162);
    a = md5ff(a,b,c,d,x[i+12],7,1804603682); d = md5ff(d,a,b,c,x[i+13],12,-40341101);
    c = md5ff(c,d,a,b,x[i+14],17,-1502002290); b = md5ff(b,c,d,a,x[i+15],22,1236535329);
    a = md5gg(a,b,c,d,x[i+1],5,-165796510); d = md5gg(d,a,b,c,x[i+6],9,-1069501632);
    c = md5gg(c,d,a,b,x[i+11],14,643717713); b = md5gg(b,c,d,a,x[i+0],20,-373897302);
    a = md5gg(a,b,c,d,x[i+5],5,-701558691); d = md5gg(d,a,b,c,x[i+10],9,38016083);
    c = md5gg(c,d,a,b,x[i+15],14,-660478335); b = md5gg(b,c,d,a,x[i+4],20,-405537848);
    a = md5gg(a,b,c,d,x[i+9],5,568446438); d = md5gg(d,a,b,c,x[i+14],9,-1019803690);
    c = md5gg(c,d,a,b,x[i+3],14,-187363961); b = md5gg(b,c,d,a,x[i+8],20,1163531501);
    a = md5gg(a,b,c,d,x[i+13],5,-1444681467); d = md5gg(d,a,b,c,x[i+2],9,-51403784);
    c = md5gg(c,d,a,b,x[i+7],14,1735328473); b = md5gg(b,c,d,a,x[i+12],20,-1926607734);
    a = md5hh(a,b,c,d,x[i+5],4,-378558); d = md5hh(d,a,b,c,x[i+8],11,-2022574463);
    c = md5hh(c,d,a,b,x[i+11],16,1839030562); b = md5hh(b,c,d,a,x[i+14],23,-35309556);
    a = md5hh(a,b,c,d,x[i+1],4,-1530992060); d = md5hh(d,a,b,c,x[i+4],11,1272893353);
    c = md5hh(c,d,a,b,x[i+7],16,-155497632); b = md5hh(b,c,d,a,x[i+10],23,-1094730640);
    a = md5hh(a,b,c,d,x[i+13],4,681279174); d = md5hh(d,a,b,c,x[i+0],11,-358537222);
    c = md5hh(c,d,a,b,x[i+3],16,-722521979); b = md5hh(b,c,d,a,x[i+6],23,76029189);
    a = md5hh(a,b,c,d,x[i+9],4,-640364487); d = md5hh(d,a,b,c,x[i+12],11,-421815835);
    c = md5hh(c,d,a,b,x[i+15],16,530742520); b = md5hh(b,c,d,a,x[i+2],23,-995338651);
    a = md5ii(a,b,c,d,x[i+0],6,-198630844); d = md5ii(d,a,b,c,x[i+7],10,1126891415);
    c = md5ii(c,d,a,b,x[i+14],15,-1416354905); b = md5ii(b,c,d,a,x[i+5],21,-57434055);
    a = md5ii(a,b,c,d,x[i+12],6,1700485571); d = md5ii(d,a,b,c,x[i+3],10,-1894986606);
    c = md5ii(c,d,a,b,x[i+10],15,-1051523); b = md5ii(b,c,d,a,x[i+1],21,-2054922799);
    a = md5ii(a,b,c,d,x[i+8],6,1873313359); d = md5ii(d,a,b,c,x[i+15],10,-30611744);
    c = md5ii(c,d,a,b,x[i+6],15,-1560198380); b = md5ii(b,c,d,a,x[i+13],21,1309151649);
    a = md5ii(a,b,c,d,x[i+4],6,-145523070); d = md5ii(d,a,b,c,x[i+11],10,-1120210379);
    c = md5ii(c,d,a,b,x[i+2],15,718787259); b = md5ii(b,c,d,a,x[i+9],21,-343485551);
    a = safeAdd(a, oa); b = safeAdd(b, ob); c = safeAdd(c, oc); d = safeAdd(d, od);
  }
  const toHex32 = (n: number) => {
    let s = '';
    for (let i = 0; i < 4; i++) s += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    return s;
  };
  return toHex32(a) + toHex32(b) + toHex32(c) + toHex32(d);
}

// ── Random String Generator ──────────────────────────────────────────────────

registerTool({
  id: 'random-string',
  name: 'Random String Generator',
  category: 'Generation',
  description: 'Generate random strings with configurable charset and length',
  keywords: ['random', 'string', 'generate', 'password', 'token', 'secret', 'alphanumeric'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (_input, options) => {
    const length = typeof options?.length === 'number' ? Math.min(Math.max(options.length, 1), 4096) : 32;
    const count = typeof options?.count === 'number' ? Math.min(Math.max(options.count, 1), 100) : 1;
    const charset = (options?.charset as string) || 'alphanumeric';

    const charsets: Record<string, string> = {
      alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      numeric: '0123456789',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      hex: '0123456789abcdef',
      symbols: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?',
    };

    const chars = charsets[charset] ?? charsets.alphanumeric;
    const results: string[] = [];

    for (let i = 0; i < count; i++) {
      const bytes = crypto.getRandomValues(new Uint8Array(length));
      results.push(Array.from(bytes, (b) => chars[b % chars.length]).join(''));
    }

    const lines = [
      `Charset:  ${charset} (${chars.length} chars)`,
      `Length:   ${length}`,
      `Count:    ${count}`,
      '',
      ...results,
    ];
    return { output: lines.join('\n'), outputLanguage: 'text' };
  },
});

const loremWords = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do',
  'eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim',
  'ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi',
  'aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit',
  'voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint',
  'occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt',
  'mollit','anim','id','est','laborum',
];

function generateLoremSentence(wordCount = 8): string {
  const words = Array.from({ length: wordCount }, (_, i) =>
    loremWords[(i + Math.floor(Math.random() * loremWords.length)) % loremWords.length]
  );
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

registerTool({
  id: 'lorem-ipsum',
  name: 'Lorem Ipsum Generator',
  category: 'Generation',
  description: 'Generate placeholder Lorem Ipsum text',
  keywords: ['lorem', 'ipsum', 'placeholder', 'text', 'generate', 'dummy'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (_input, options) => {
    const mode = (options?.mode as string) || 'paragraphs';
    const count = typeof options?.count === 'number' ? Math.min(options.count, 100) : 3;

    if (mode === 'words') {
      const words = Array.from(
        { length: count },
        (_, i) => loremWords[i % loremWords.length]
      );
      return { output: words.join(' '), outputLanguage: 'text' };
    }

    if (mode === 'sentences') {
      const sentences = Array.from({ length: count }, () => generateLoremSentence());
      return { output: sentences.join(' '), outputLanguage: 'text' };
    }

    // paragraphs (default)
    const paragraphs = Array.from({ length: count }, () => {
      const sentenceCount = 4 + Math.floor(Math.random() * 3);
      return Array.from({ length: sentenceCount }, () => generateLoremSentence()).join(' ');
    });
    return { output: paragraphs.join('\n\n'), outputLanguage: 'text' };
  },
});

// ── ULID Generator ────────────────────────────────────────────────────────────

function encodeUlid(timestampMs: number, randomBytes: Uint8Array): string {
  const CHARS = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const result = new Array(26);
  // 10 chars timestamp (48 bits)
  let ts = timestampMs;
  for (let i = 9; i >= 0; i--) { result[i] = CHARS[ts % 32]; ts = Math.floor(ts / 32); }
  // 16 chars random (80 bits from 10 bytes)
  let ri = 0;
  let buf = 0, bufBits = 0;
  for (let i = 10; i < 26; i++) {
    while (bufBits < 5) { buf = (buf << 8) | randomBytes[ri++]; bufBits += 8; }
    bufBits -= 5;
    result[i] = CHARS[(buf >> bufBits) & 0x1f];
  }
  return result.join('');
}

registerTool({
  id: 'ulid-generator',
  name: 'ULID Generator',
  category: 'Generation',
  description: 'Generate Universally Unique Lexicographically Sortable Identifiers (ULID)',
  keywords: ['ulid', 'uuid', 'generate', 'random', 'id', 'sortable', 'unique'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (_input, options) => {
    const count = typeof options?.count === 'number' ? Math.min(options.count, 1000) : 1;
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      const randBytes = crypto.getRandomValues(new Uint8Array(10));
      results.push(encodeUlid(Date.now(), randBytes));
    }
    return { output: results.join('\n'), outputLanguage: 'text' };
  },
});

registerTool({
  id: 'qr-code',
  name: 'QR Code Generator',
  category: 'Generation',
  description: 'Generate QR codes from URLs or any text',
  keywords: ['qr', 'qrcode', 'generate', 'barcode', 'url', 'scan'],
  outputExtension: 'png',
  detect: (input) => {
    const t = input.trim();
    if (/^https?:\/\//.test(t)) return 0.5;
    return 0;
  },
  execute: (input) => ({ output: input, outputLanguage: 'text' }),
});
