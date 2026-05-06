import { registerTool } from '../registry';

registerTool({
  id: 'regex-tester',
  name: 'Regex Tester',
  category: 'Inspection',
  description: 'Test a regular expression against input text and list matches',
  keywords: ['regex', 'regexp', 'pattern', 'match', 'test', 'regular expression'],
  outputExtension: 'txt',
  detect: (input) => {
    // Detect if input looks like a regex pattern on its own
    return /^\/.*\/[gimsuy]*$/.test(input.trim()) ? 0.7 : 0;
  },
  execute: (input, options) => {
    try {
      const pattern = (options?.pattern as string) || '';
      const flags = (options?.flags as string) || 'g';
      if (!pattern) {
        return { output: '', error: 'No regex pattern provided. Use the pattern option.' };
      }
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const matches: Array<{ match: string; index: number; groups?: Record<string, string> }> = [];
      let m: RegExpExecArray | null;
      while ((m = regex.exec(input)) !== null) {
        matches.push({ match: m[0], index: m.index, groups: m.groups });
        if (!flags.includes('g')) break;
      }
      if (matches.length === 0) {
        return { output: 'No matches found.', outputLanguage: 'text' };
      }
      const lines = matches.map(
        (m, i) => `Match ${i + 1}: "${m.match}" at index ${m.index}` +
          (m.groups ? `\n  Groups: ${JSON.stringify(m.groups)}` : '')
      );
      return { output: `${matches.length} match(es):\n\n${lines.join('\n')}`, outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Regex error' };
    }
  },
});

registerTool({
  id: 'jsonpath-evaluator',
  name: 'JSONPath Evaluator',
  category: 'Inspection',
  description: 'Evaluate a JSONPath expression against JSON input',
  keywords: ['jsonpath', 'json', 'query', 'path', 'jq'],
  outputExtension: 'json',
  detect: (input) => {
    const t = input.trim();
    if ((t.startsWith('{') || t.startsWith('[')) ) {
      try { JSON.parse(t); return 0.4; } catch { return 0; }
    }
    return 0;
  },
  execute: async (input, options) => {
    try {
      const path = (options?.path as string) || '$';
      const { JSONPath } = await import('jsonpath-plus');
      const json = JSON.parse(input);
      const result = JSONPath({ path, json });
      if (!result || result.length === 0) {
        return { output: '[]', outputLanguage: 'json' };
      }
      return { output: JSON.stringify(result, null, 2), outputLanguage: 'json' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'JSONPath evaluation failed' };
    }
  },
});

// ── String Inspector ──────────────────────────────────────────────────────────

registerTool({
  id: 'string-inspector',
  name: 'String Inspector',
  category: 'Inspection',
  description: 'Detailed character, word, line, and byte statistics for any string',
  keywords: ['string', 'inspect', 'count', 'chars', 'words', 'lines', 'bytes', 'statistics'],
  outputExtension: 'txt',
  detect: (input) => input.trim().length > 0 ? 0.1 : 0,
  execute: (input) => {
    const lines = input.split('\n');
    const words = input.trim() === '' ? 0 : input.trim().split(/\s+/).length;
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s/g, '').length;
    const bytes = new TextEncoder().encode(input).length;
    const sentences = (input.match(/[.!?]+/g) || []).length;
    const paragraphs = input.split(/\n\s*\n/).filter((p) => p.trim()).length;

    // Unicode breakdown
    const asciiCount = (input.match(/[\x00-\x7F]/g) || []).length;
    const unicodeCount = chars - asciiCount;

    // Most frequent words
    const wordFreq: Record<string, number> = {};
    input.toLowerCase().match(/\b[a-z]{2,}\b/g)?.forEach((w) => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
    const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const out = [
      `Characters:          ${chars.toLocaleString()}`,
      `Characters (no sp):  ${charsNoSpaces.toLocaleString()}`,
      `Words:               ${words.toLocaleString()}`,
      `Lines:               ${lines.length.toLocaleString()}`,
      `Sentences:           ${sentences.toLocaleString()}`,
      `Paragraphs:          ${paragraphs.toLocaleString()}`,
      `Bytes (UTF-8):       ${bytes.toLocaleString()}`,
      ``,
      `ASCII chars:         ${asciiCount.toLocaleString()}`,
      `Non-ASCII chars:     ${unicodeCount.toLocaleString()}`,
      `Unique chars:        ${new Set(input).size.toLocaleString()}`,
      ``,
      ...(topWords.length > 0 ? [`Top words:`, ...topWords.map(([w, n]) => `  "${w}" × ${n}`)] : []),
    ];
    return { output: out.join('\n'), outputLanguage: 'text' };
  },
});

// ── Cron Job Parser ───────────────────────────────────────────────────────────

const CRON_FIELDS = ['minute', 'hour', 'day of month', 'month', 'day of week'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function describeCronField(val: string, field: number): string {
  if (val === '*') return `every ${CRON_FIELDS[field]}`;
  if (val.startsWith('*/')) return `every ${val.slice(2)} ${CRON_FIELDS[field]}s`;
  if (val.includes('-')) {
    const [a, b] = val.split('-');
    if (field === 3) return `from ${MONTHS[+a - 1]} to ${MONTHS[+b - 1]}`;
    if (field === 4) return `from ${DAYS[+a]} to ${DAYS[+b]}`;
    return `from ${a} to ${b}`;
  }
  if (val.includes(',')) {
    const parts = val.split(',');
    if (field === 3) return parts.map((p) => MONTHS[+p - 1] ?? p).join(', ');
    if (field === 4) return parts.map((p) => DAYS[+p] ?? p).join(', ');
    return parts.join(', ');
  }
  if (field === 3) return MONTHS[+val - 1] ?? val;
  if (field === 4) return DAYS[+val] ?? val;
  return val;
}

function nextCronRuns(parts: string[], count = 5): string[] {
  // Simple next-run calculator for common patterns
  const results: string[] = [];
  const now = new Date();
  let d = new Date(now.getTime() + 60000);
  d.setSeconds(0, 0);
  let attempts = 0;
  while (results.length < count && attempts < 100000) {
    attempts++;
    const min = d.getMinutes(), hr = d.getHours(), dom = d.getDate();
    const mon = d.getMonth() + 1, dow = d.getDay();
    const match = (val: string, n: number) => {
      if (val === '*') return true;
      if (val.startsWith('*/')) return n % +val.slice(2) === 0;
      if (val.includes(',')) return val.split(',').map(Number).includes(n);
      if (val.includes('-')) { const [a, b] = val.split('-').map(Number); return n >= a && n <= b; }
      return +val === n;
    };
    if (match(parts[0], min) && match(parts[1], hr) && match(parts[2], dom) && match(parts[3], mon) && match(parts[4], dow)) {
      results.push(d.toLocaleString());
    }
    d = new Date(d.getTime() + 60000);
  }
  return results;
}

registerTool({
  id: 'cron-parser',
  name: 'Cron Job Parser',
  category: 'Inspection',
  description: 'Parse and explain a cron expression with next scheduled runs',
  keywords: ['cron', 'schedule', 'job', 'parse', 'expression', 'interval'],
  outputExtension: 'txt',
  detect: (input) => {
    const parts = input.trim().split(/\s+/);
    return parts.length === 5 && parts.every((p) => /^[\d*/,\-]+$/.test(p)) ? 0.9 : 0;
  },
  execute: (input) => {
    try {
      const parts = input.trim().split(/\s+/);
      if (parts.length !== 5) return { output: '', error: 'Cron expression must have exactly 5 fields: minute hour day month weekday' };

      const labels = CRON_FIELDS;
      const desc = parts.map((p, i) => `  ${labels[i].padEnd(14)} ${p.padEnd(10)} → ${describeCronField(p, i)}`);

      const nextRuns = nextCronRuns(parts);

      const out = [
        `Expression:  ${parts.join(' ')}`,
        ``,
        `Field breakdown:`,
        ...desc,
        ``,
        `Next ${nextRuns.length} runs:`,
        ...nextRuns.map((r, i) => `  ${i + 1}. ${r}`),
      ];
      return { output: out.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Cron parse failed' };
    }
  },
});

// ── Certificate Decoder (X.509) ───────────────────────────────────────────────

registerTool({
  id: 'cert-decoder',
  name: 'Certificate Decoder (X.509)',
  category: 'Inspection',
  description: 'Decode and inspect a PEM-encoded X.509 certificate',
  keywords: ['certificate', 'x509', 'pem', 'ssl', 'tls', 'cert', 'decode', 'openssl'],
  outputExtension: 'txt',
  detect: (input) => input.trim().startsWith('-----BEGIN CERTIFICATE-----') ? 0.98 : 0,
  execute: (input) => {
    try {
      const pem = input.trim();
      if (!pem.startsWith('-----BEGIN CERTIFICATE-----'))
        return { output: '', error: 'Input must be a PEM-encoded certificate (starts with -----BEGIN CERTIFICATE-----)' };

      // Extract base64 body
      const b64 = pem
        .replace(/-----BEGIN CERTIFICATE-----/, '')
        .replace(/-----END CERTIFICATE-----/, '')
        .replace(/\s/g, '');

      // Decode DER bytes
      const der = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

      // Minimal ASN.1 DER reader
      function readLen(buf: Uint8Array, pos: number): [number, number] {
        if (buf[pos] < 0x80) return [buf[pos], pos + 1];
        const numBytes = buf[pos] & 0x7f;
        let len = 0;
        for (let i = 0; i < numBytes; i++) len = (len << 8) | buf[pos + 1 + i];
        return [len, pos + 1 + numBytes];
      }

      function readOid(buf: Uint8Array): string {
        const first = buf[0];
        const parts = [Math.floor(first / 40), first % 40];
        let val = 0;
        for (let i = 1; i < buf.length; i++) {
          val = (val << 7) | (buf[i] & 0x7f);
          if (!(buf[i] & 0x80)) { parts.push(val); val = 0; }
        }
        return parts.join('.');
      }

      const OID_NAMES: Record<string, string> = {
        '2.5.4.3': 'CN', '2.5.4.6': 'C', '2.5.4.7': 'L', '2.5.4.8': 'ST',
        '2.5.4.10': 'O', '2.5.4.11': 'OU',
        '1.2.840.113549.1.1.11': 'SHA256WithRSAEncryption',
        '1.2.840.113549.1.1.5': 'SHA1WithRSAEncryption',
        '1.2.840.113549.1.1.13': 'SHA512WithRSAEncryption',
        '1.2.840.10045.4.3.2': 'ECDSAWithSHA256',
        '2.5.29.17': 'subjectAltName',
      };

      function parseSeq(buf: Uint8Array, pos: number): Array<{ tag: number; value: Uint8Array }> {
        const items = [];
        while (pos < buf.length) {
          const tag = buf[pos++];
          const [len, newPos] = readLen(buf, pos);
          pos = newPos;
          items.push({ tag, value: buf.slice(pos, pos + len) });
          pos += len;
        }
        return items;
      }

      // Top-level: SEQUENCE
      let pos = 0;
      if (der[pos++] !== 0x30) throw new Error('Not a valid DER certificate');
      const [, bodyStart] = readLen(der, pos);
      const body = der.slice(bodyStart);

      // tbsCertificate is first element
      let p = 0;
      if (body[p++] !== 0x30) throw new Error('Expected tbsCertificate SEQUENCE');
      const [tbsLen, tbsStart] = readLen(body, p);
      const tbs = body.slice(tbsStart, tbsStart + tbsLen);

      const fields = parseSeq(tbs, 0);
      let idx = 0;

      // Version (optional, context [0])
      let version = 'v1';
      if (fields[idx]?.tag === 0xa0) {
        const vBytes = fields[idx].value;
        if (vBytes[0] === 0x02) version = `v${vBytes[vBytes.length - 1] + 1}`;
        idx++;
      }

      // Serial number
      const serial = fields[idx++];
      const serialHex = Array.from(serial.value).map((b) => b.toString(16).padStart(2, '0')).join(':');

      // Signature algorithm
      const sigAlgSeq = fields[idx++];
      const sigAlgItems = parseSeq(sigAlgSeq.value, 0);
      const sigAlgOid = sigAlgItems[0]?.tag === 0x06 ? readOid(sigAlgItems[0].value) : '';
      const sigAlgName = OID_NAMES[sigAlgOid] || sigAlgOid;

      // Issuer
      function parseDN(buf: Uint8Array): string {
        const parts: string[] = [];
        let p = 0;
        while (p < buf.length) {
          const setTag = buf[p++]; if (setTag !== 0x31) { p += buf[p]; p++; continue; }
          const [setLen, setPos] = readLen(buf, p); p = setPos;
          const setEnd = p + setLen;
          while (p < setEnd) {
            if (buf[p++] !== 0x30) break;
            const [seqLen, seqPos] = readLen(buf, p); p = seqPos;
            const seqEnd = p + seqLen;
            if (buf[p++] !== 0x06) break;
            const [oidLen, oidPos] = readLen(buf, p); p = oidPos;
            const oid = readOid(buf.slice(p, p + oidLen)); p += oidLen;
            const valTag = buf[p++];
            const [valLen, valPos] = readLen(buf, p); p = valPos;
            void valTag;
            const valStr = new TextDecoder().decode(buf.slice(p, p + valLen)); p += valLen;
            const attrName = OID_NAMES[oid] || oid;
            parts.push(`${attrName}=${valStr}`);
            p = seqEnd;
          }
          p = setEnd;
        }
        return parts.join(', ');
      }

      const issuerField = fields[idx++];
      const issuer = parseDN(issuerField.value);

      // Validity
      const validitySeq = fields[idx++];
      const validityItems = parseSeq(validitySeq.value, 0);
      const parseTime = (buf: Uint8Array) => new TextDecoder().decode(buf);
      const notBefore = parseTime(validityItems[0]?.value ?? new Uint8Array());
      const notAfter = parseTime(validityItems[1]?.value ?? new Uint8Array());

      // Subject
      const subjectField = fields[idx++];
      const subject = parseDN(subjectField.value);

      const out = [
        `Version:       ${version}`,
        `Serial:        ${serialHex}`,
        `Algorithm:     ${sigAlgName}`,
        ``,
        `Subject:       ${subject}`,
        `Issuer:        ${issuer}`,
        ``,
        `Not Before:    ${notBefore}`,
        `Not After:     ${notAfter}`,
        ``,
        `PEM size:      ${b64.length} chars (~${(der.length / 1024).toFixed(1)} KB)`,
      ];
      return { output: out.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Certificate decode failed' };
    }
  },
});

registerTool({
  id: 'html-preview',
  name: 'HTML Preview',
  category: 'Inspection',
  description: 'Live preview HTML in a sandboxed iframe with split source view',
  keywords: ['html', 'preview', 'render', 'browser', 'live'],
  outputExtension: 'html',
  detect: (input) => {
    const t = input.trim();
    return /<(!DOCTYPE|html|body|head|div|p|span|h[1-6])\b/i.test(t) ? 0.85 : 0;
  },
  execute: (input) => ({ output: input, outputLanguage: 'html' }),
});
