import { registerTool } from '../registry';

export const REGEX_GENERATOR_LANGUAGES = [
  'javascript',
  'python',
  'java',
  'csharp',
  'cpp',
  'go',
  'ruby',
  'grep',
  'php',
] as const;

export type RegexGeneratorLanguage = typeof REGEX_GENERATOR_LANGUAGES[number] | 'all';

export interface RegexGeneratorOptions {
  language?: RegexGeneratorLanguage;
  matchWholeLine?: boolean;
  caseInsensitive?: boolean;
  dotAll?: boolean;
  multiline?: boolean;
  lowerCaseClasses?: boolean;
}

const REGEX_META = /[\\^$.*+?()[\]{}|]/g;

function escapeRegexLiteral(value: string): string {
  return value.replace(REGEX_META, '\\$&');
}

function escapeForDoubleQuotedString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

function escapeForSingleQuotedShell(value: string): string {
  return value.replace(/'/g, "'\"'\"'");
}

function escapeForRegexLiteral(value: string): string {
  return value.replace(/\//g, '\\/');
}

function toPosixExtendedRegex(pattern: string): string {
  return pattern
    .replace(/\(\?:/g, '(')
    .replace(/\(\?<([A-Za-z_][A-Za-z0-9_]*)>/g, '(')
    .replace(/\\s/g, '[[:space:]]')
    .replace(/\\d/g, '[0-9]')
    .replace(/\\w/g, '[A-Za-z0-9_]');
}

function quantifier(count: number): string {
  return count === 1 ? '' : `{${count}}`;
}

function classifyChar(char: string): 'digit' | 'lower' | 'upper' | 'alpha' | 'space' | 'other' {
  if (/[0-9]/.test(char)) return 'digit';
  if (/[a-z]/.test(char)) return 'lower';
  if (/[A-Z]/.test(char)) return 'upper';
  if (/[A-Za-z]/.test(char)) return 'alpha';
  if (/\s/.test(char)) return 'space';
  return 'other';
}

function classForRun(run: string, lowerCaseClasses: boolean): string {
  if (/^\d+$/.test(run)) return `\\d${quantifier(run.length)}`;
  if (/^[a-z]+$/.test(run)) return `[a-z]${quantifier(run.length)}`;
  if (/^[A-Z]+$/.test(run)) return lowerCaseClasses ? `[a-z]${quantifier(run.length)}` : `[A-Z]${quantifier(run.length)}`;
  if (/^[A-Za-z]+$/.test(run)) return lowerCaseClasses ? `[a-z]${quantifier(run.length)}` : `[A-Za-z]${quantifier(run.length)}`;
  if (/^\s+$/.test(run)) return run.length === 1 ? `\\s` : `\\s+`;
  return escapeRegexLiteral(run);
}

function detectWholeSamplePattern(sample: string, lowerCaseClasses: boolean): string | null {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sample)) {
    return lowerCaseClasses
      ? '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}'
      : '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}';
  }
  if (/^https?:\/\/\S+$/i.test(sample)) return 'https?:\\/\\/[^\\s]+';
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sample)) {
    return '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}';
  }
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(sample)) {
    return '(?:\\d{1,3}\\.){3}\\d{1,3}';
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(sample)) return '\\d{4}-\\d{2}-\\d{2}';
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(sample)) {
    return '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{3})?Z';
  }
  return null;
}

function buildShapePattern(sample: string, lowerCaseClasses = false): string {
  const known = detectWholeSamplePattern(sample, lowerCaseClasses);
  if (known) return known;

  const parts: string[] = [];
  let run = '';
  let runType: ReturnType<typeof classifyChar> | null = null;

  for (const char of sample) {
    const type = classifyChar(char);
    const compatible =
      runType === type ||
      (runType === 'alpha' && (type === 'lower' || type === 'upper' || type === 'alpha'));

    if (run && !compatible) {
      parts.push(classForRun(run, lowerCaseClasses));
      run = '';
    }

    run += char;
    runType = type === 'lower' || type === 'upper' ? 'alpha' : type;
  }

  if (run) parts.push(classForRun(run, lowerCaseClasses));
  return parts.join('');
}

function flagsFor(options: RegexGeneratorOptions): string {
  return [
    options.caseInsensitive ? 'i' : '',
    options.dotAll ? 's' : '',
    options.multiline ? 'm' : '',
  ].join('');
}

function withAnchors(pattern: string, matchWholeLine = true): string {
  return matchWholeLine ? `^${pattern}$` : pattern;
}

function snippetForLanguage(language: RegexGeneratorLanguage, pattern: string, flags: string): string {
  const hasI = flags.includes('i');
  const hasS = flags.includes('s');
  const hasM = flags.includes('m');
  const inlineFlags = flags ? `(?${flags})` : '';
  const inlinePattern = `${inlineFlags}${pattern}`;

  switch (language) {
    case 'javascript':
      return `const regex = /${escapeForRegexLiteral(pattern)}/${flags};`;
    case 'python': {
      const pyFlags = [
        hasI ? 're.IGNORECASE' : '',
        hasS ? 're.DOTALL' : '',
        hasM ? 're.MULTILINE' : '',
      ].filter(Boolean).join(' | ') || '0';
      return `import re\nregex = re.compile(r"${pattern}", ${pyFlags})`;
    }
    case 'java': {
      const javaFlags = [
        hasI ? 'Pattern.CASE_INSENSITIVE' : '',
        hasS ? 'Pattern.DOTALL' : '',
        hasM ? 'Pattern.MULTILINE' : '',
      ].filter(Boolean).join(' | ');
      return `Pattern regex = Pattern.compile("${escapeForDoubleQuotedString(pattern)}"${javaFlags ? `, ${javaFlags}` : ''});`;
    }
    case 'csharp': {
      const csFlags = [
        hasI ? 'RegexOptions.IgnoreCase' : '',
        hasS ? 'RegexOptions.Singleline' : '',
        hasM ? 'RegexOptions.Multiline' : '',
      ].filter(Boolean).join(' | ') || 'RegexOptions.None';
      return `var regex = new Regex(@"${pattern.replace(/"/g, '""')}", ${csFlags});`;
    }
    case 'cpp':
      return `std::regex regex(R"(${inlinePattern})"${hasI ? ', std::regex::icase' : ''});`;
    case 'go':
      return `re := regexp.MustCompile(\`${inlinePattern}\`)`;
    case 'ruby':
      return `regex = /${escapeForRegexLiteral(pattern)}/${flags}`;
    case 'grep':
      return `grep -E${hasI ? ' -i' : ''} '${escapeForSingleQuotedShell(toPosixExtendedRegex(pattern))}' file.txt`;
    case 'php':
      return `$regex = '/${escapeForRegexLiteral(pattern)}/${flags}';`;
    default:
      return pattern;
  }
}

export function generateRegexFromSample(input: string, options: RegexGeneratorOptions = {}) {
  const sample = input.length > 1000 ? input.slice(0, 1000) : input;
  const shapePattern = withAnchors(
    buildShapePattern(sample, options.lowerCaseClasses),
    options.matchWholeLine !== false
  );
  const exactPattern = withAnchors(escapeRegexLiteral(sample), options.matchWholeLine !== false);
  const flags = flagsFor(options);
  const snippets = buildRegexLanguageSnippets(shapePattern, options);

  return {
    pattern: shapePattern,
    exactPattern,
    flags,
    truncated: input.length > sample.length,
    snippets,
  };
}

export function buildRegexLanguageSnippets(pattern: string, options: RegexGeneratorOptions = {}) {
  const flags = flagsFor(options);
  const language = options.language ?? 'all';
  const languages = language === 'all' ? REGEX_GENERATOR_LANGUAGES : [language];

  return Object.fromEntries(
    languages.map((lang) => [lang, snippetForLanguage(lang, pattern, flags)])
  ) as Record<string, string>;
}

function formatRegexGeneratorOutput(input: string, options: RegexGeneratorOptions = {}): string {
  const generated = generateRegexFromSample(input, options);
  const snippetEntries = Object.entries(generated.snippets);

  return [
    'Regex Generator',
    '===============',
    '',
    ...(generated.truncated ? ['Note: input was shortened to 1000 characters before generation.', ''] : []),
    `Recommended pattern: ${generated.pattern}`,
    `Exact literal fallback: ${generated.exactPattern}`,
    `Flags: ${generated.flags || '(none)'}`,
    '',
    'Language snippets',
    '-----------------',
    ...snippetEntries.flatMap(([language, snippet]) => [
      '',
      `${language}:`,
      snippet,
    ]),
    '',
    'Notes',
    '-----',
    '- Generated from one sample, so review the pattern before production use.',
    '- The recommended pattern generalizes obvious numbers, letters, dates, URLs, emails, UUIDs, and IP addresses.',
    '- The exact literal fallback matches only the sample text shape exactly.',
  ].join('\n');
}

registerTool({
  id: 'regex-tester',
  name: 'Regex Tester',
  category: 'Inspection',
  description: 'Test a regular expression against input text and list matches',
  keywords: ['regex', 'regexp', 'pattern', 'match', 'test', 'regular expression', 'regex tester online', 'regex check', 'online regex tester', 'test regex online', 'javascript test regex online', 'check regex online', 'regular expressions test online', 'validate regular expression', 'regex interpreter', 'online regex'],
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
  id: 'regex-generator',
  name: 'Regex Generator',
  category: 'Generation',
  description: 'Generate a starter regular expression and language snippets from sample text',
  keywords: [
    'regex generator',
    'regular expression generator',
    'generate regex from string',
    'regex from sample',
    'create regex',
    'java regex generator',
    'python regex generator',
    'javascript regex generator',
    'grep regex generator',
  ],
  outputExtension: 'txt',
  detect: (input) => input.trim().length >= 3 ? 0.2 : 0,
  execute: (input, options) => {
    if (!input.trim()) return { output: '', error: undefined };
    return {
      output: formatRegexGeneratorOutput(input.trim(), options as RegexGeneratorOptions),
      outputLanguage: 'text',
    };
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
  keywords: ['certificate', 'x509', 'pem', 'ssl', 'tls', 'cert', 'decode', 'openssl', 'certificate decoder', 'ssl decoder', 'ssl certificate decoder', 'cert decoder', 'ssl certificate decode', 'x509 decoder', 'ssl decode', 'decoding certificate', 'decode ssl online', 'tls cert decoder', 'decode base64 certificate', 'online certificate decoder', 'cert decode', 'decode cert', 'decode ssl', 'ssl cert decoder', 'cer decode', 'crt decoder', 'decode certificate', 'certificate viewer', 'read cert', 'ssl certificate decrypt'],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    if (t.startsWith('-----BEGIN CERTIFICATE-----')) return 0.98;
    // Raw base64 that looks like a DER certificate (starts with MII after decoding SEQUENCE tag)
    if (/^[A-Za-z0-9+/\r\n]+=*$/.test(t) && t.length > 100) return 0.4;
    return 0;
  },
  execute: (input) => {
    try {
      let pem = input.trim();

      // Accept raw base64 without PEM headers — wrap it
      if (!pem.startsWith('-----BEGIN CERTIFICATE-----')) {
        // Strip whitespace/newlines from base64
        const b64only = pem.replace(/\s/g, '');
        if (/^[A-Za-z0-9+/]+=*$/.test(b64only) && b64only.length > 50) {
          pem = `-----BEGIN CERTIFICATE-----\n${b64only}\n-----END CERTIFICATE-----`;
        } else {
          return { output: '', error: 'Input must be a PEM-encoded certificate (starts with -----BEGIN CERTIFICATE-----) or a raw Base64-encoded DER certificate.' };
        }
      }

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

// ── JSON Schema Validator ─────────────────────────────────────────────────────

/**
 * Minimal JSON Schema validator supporting:
 * type, required, properties, items, minimum/maximum, minLength/maxLength,
 * pattern, enum, additionalProperties, allOf/anyOf/oneOf/not
 */
function validateJsonSchema(
  data: unknown,
  schema: Record<string, unknown>,
  path = '$'
): string[] {
  const errors: string[] = [];

  // type
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actualType =
      data === null ? 'null' :
      Array.isArray(data) ? 'array' :
      typeof data;
    if (!types.includes(actualType)) {
      errors.push(`${path}: expected type ${types.join('|')}, got ${actualType}`);
      return errors; // can't validate further
    }
  }

  // enum
  if (Array.isArray(schema.enum)) {
    const match = schema.enum.some((v) => JSON.stringify(v) === JSON.stringify(data));
    if (!match) errors.push(`${path}: must be one of ${JSON.stringify(schema.enum)}`);
  }

  // const
  if ('const' in schema) {
    if (JSON.stringify(schema.const) !== JSON.stringify(data))
      errors.push(`${path}: must equal ${JSON.stringify(schema.const)}`);
  }

  if (typeof data === 'string') {
    if (typeof schema.minLength === 'number' && data.length < schema.minLength)
      errors.push(`${path}: length ${data.length} < minLength ${schema.minLength}`);
    if (typeof schema.maxLength === 'number' && data.length > schema.maxLength)
      errors.push(`${path}: length ${data.length} > maxLength ${schema.maxLength}`);
    if (schema.pattern) {
      try {
        if (!new RegExp(schema.pattern as string).test(data))
          errors.push(`${path}: does not match pattern /${schema.pattern}/`);
      } catch { /* ignore bad regex */ }
    }
    if (schema.format) {
      const fmt = schema.format as string;
      if (fmt === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data))
        errors.push(`${path}: not a valid email`);
      if (fmt === 'uri' && !/^https?:\/\//.test(data))
        errors.push(`${path}: not a valid URI`);
      if ((fmt === 'date' || fmt === 'date-time') && isNaN(Date.parse(data)))
        errors.push(`${path}: not a valid ${fmt}`);
      if (fmt === 'uuid' && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data))
        errors.push(`${path}: not a valid UUID`);
    }
  }

  if (typeof data === 'number') {
    if (typeof schema.minimum === 'number' && data < schema.minimum)
      errors.push(`${path}: ${data} < minimum ${schema.minimum}`);
    if (typeof schema.maximum === 'number' && data > schema.maximum)
      errors.push(`${path}: ${data} > maximum ${schema.maximum}`);
    if (typeof schema.exclusiveMinimum === 'number' && data <= schema.exclusiveMinimum)
      errors.push(`${path}: ${data} <= exclusiveMinimum ${schema.exclusiveMinimum}`);
    if (typeof schema.exclusiveMaximum === 'number' && data >= schema.exclusiveMaximum)
      errors.push(`${path}: ${data} >= exclusiveMaximum ${schema.exclusiveMaximum}`);
    if (typeof schema.multipleOf === 'number' && data % schema.multipleOf !== 0)
      errors.push(`${path}: ${data} is not a multiple of ${schema.multipleOf}`);
  }

  if (Array.isArray(data)) {
    if (typeof schema.minItems === 'number' && data.length < schema.minItems)
      errors.push(`${path}: array length ${data.length} < minItems ${schema.minItems}`);
    if (typeof schema.maxItems === 'number' && data.length > schema.maxItems)
      errors.push(`${path}: array length ${data.length} > maxItems ${schema.maxItems}`);
    if (schema.items && typeof schema.items === 'object' && !Array.isArray(schema.items)) {
      data.forEach((item, i) => {
        errors.push(...validateJsonSchema(item, schema.items as Record<string, unknown>, `${path}[${i}]`));
      });
    }
    if (schema.uniqueItems) {
      const seen = new Set(data.map((v) => JSON.stringify(v)));
      if (seen.size !== data.length) errors.push(`${path}: items must be unique`);
    }
  }

  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(schema.required)) {
      for (const key of schema.required as string[]) {
        if (!(key in obj)) errors.push(`${path}: missing required property "${key}"`);
      }
    }
    if (schema.properties && typeof schema.properties === 'object') {
      for (const [key, subSchema] of Object.entries(schema.properties as Record<string, unknown>)) {
        if (key in obj) {
          errors.push(...validateJsonSchema(obj[key], subSchema as Record<string, unknown>, `${path}.${key}`));
        }
      }
    }
    if (schema.additionalProperties === false && schema.properties) {
      const allowed = new Set(Object.keys(schema.properties as object));
      for (const key of Object.keys(obj)) {
        if (!allowed.has(key)) errors.push(`${path}: additional property "${key}" not allowed`);
      }
    }
    if (typeof schema.minProperties === 'number' && Object.keys(obj).length < schema.minProperties)
      errors.push(`${path}: property count ${Object.keys(obj).length} < minProperties ${schema.minProperties}`);
    if (typeof schema.maxProperties === 'number' && Object.keys(obj).length > schema.maxProperties)
      errors.push(`${path}: property count ${Object.keys(obj).length} > maxProperties ${schema.maxProperties}`);
  }

  // allOf / anyOf / oneOf / not
  if (Array.isArray(schema.allOf)) {
    for (const sub of schema.allOf as Record<string, unknown>[]) {
      errors.push(...validateJsonSchema(data, sub, path));
    }
  }
  if (Array.isArray(schema.anyOf)) {
    const anyErrors = (schema.anyOf as Record<string, unknown>[]).map((sub) => validateJsonSchema(data, sub, path));
    if (anyErrors.every((e) => e.length > 0))
      errors.push(`${path}: does not match any of the anyOf schemas`);
  }
  if (Array.isArray(schema.oneOf)) {
    const passing = (schema.oneOf as Record<string, unknown>[]).filter((sub) => validateJsonSchema(data, sub, path).length === 0);
    if (passing.length !== 1)
      errors.push(`${path}: must match exactly one of the oneOf schemas (matched ${passing.length})`);
  }
  if (schema.not) {
    const notErrors = validateJsonSchema(data, schema.not as Record<string, unknown>, path);
    if (notErrors.length === 0) errors.push(`${path}: must not match the "not" schema`);
  }

  return errors;
}

registerTool({
  id: 'json-schema-validator',
  name: 'JSON Schema Validator',
  category: 'Inspection',
  description: 'Validate JSON data against a JSON Schema (Draft-07 compatible: type, required, properties, format, enum, allOf/anyOf/oneOf, …)',
  keywords: [
    'json schema', 'validate', 'schema', 'draft-07', 'jsonschema', 'api contract',
    'openapi', 'swagger', 'validation', 'json validator', 'schema validator',
    'validate json schema', 'json schema checker', 'api validation', 'json schema lint',
  ],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    if (!t.startsWith('{')) return 0;
    try {
      const obj = JSON.parse(t);
      // Looks like a JSON Schema if it has $schema, type, or properties keys
      if (obj.$schema || obj.type || obj.properties || obj.required) return 0.5;
    } catch { /* not JSON */ }
    return 0;
  },
  execute: (input, options) => {
    try {
      const schema = (options?.schema as string) || '';
      let dataObj: unknown;
      let schemaObj: Record<string, unknown>;

      // If schema option is provided: input = data, option = schema
      if (schema) {
        try { dataObj = JSON.parse(input.trim()); }
        catch { return { output: '', error: 'Data input is not valid JSON.' }; }
        try { schemaObj = JSON.parse(schema); }
        catch { return { output: '', error: 'Schema option is not valid JSON.' }; }
      } else {
        // Try to find schema + data in a single JSON object with keys "schema" and "data"
        try {
          const combined = JSON.parse(input.trim());
          if (combined && typeof combined === 'object' && 'schema' in combined && 'data' in combined) {
            schemaObj = combined.schema;
            dataObj = combined.data;
          } else {
            return { output: '', error: 'Provide { "schema": {...}, "data": {...} } or use the schema option field.' };
          }
        } catch {
          return { output: '', error: 'Input must be valid JSON. Provide { "schema": {...}, "data": {...} } or use the schema option.' };
        }
      }

      const errors = validateJsonSchema(dataObj, schemaObj);

      if (errors.length === 0) {
        return {
          output: `✓ Valid — data matches the schema.\n\nData:\n${JSON.stringify(dataObj, null, 2)}`,
          outputLanguage: 'text',
        };
      }

      const lines = [
        `✗ Invalid — ${errors.length} error${errors.length > 1 ? 's' : ''} found:`,
        '',
        ...errors.map((e, i) => `  ${i + 1}. ${e}`),
      ];
      return { output: lines.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Validation failed' };
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

// ── MongoDB ObjectID Decoder ──────────────────────────────────────────────────

registerTool({
  id: 'mongodb-objectid',
  name: 'MongoDB ObjectID Decoder',
  category: 'Inspection',
  description: 'Decode a MongoDB ObjectID: extract timestamp, machine ID, process ID, and counter',
  keywords: [
    'mongodb', 'objectid', 'object id', 'bson', 'mongo', 'decode', 'timestamp',
    'nodejs', 'mongoose', 'objectid decoder', 'mongo objectid', 'bson objectid',
    'mongodb id', 'decode objectid', 'objectid timestamp', 'mongodb id decoder',
  ],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    return /^[0-9a-f]{24}$/i.test(t) ? 0.92 : 0;
  },
  execute: (input) => {
    try {
      const t = input.trim().toLowerCase();
      if (!/^[0-9a-f]{24}$/.test(t)) {
        return { output: '', error: 'MongoDB ObjectID must be exactly 24 hexadecimal characters.' };
      }

      // 4 bytes: Unix timestamp (big-endian)
      const timestampHex = t.slice(0, 8);
      const timestamp = parseInt(timestampHex, 16);
      const date = new Date(timestamp * 1000);

      // 5 bytes: random (machine + process, in newer format just random)
      const randomHex = t.slice(8, 18);

      // 3 bytes: counter (big-endian)
      const counterHex = t.slice(18, 24);
      const counter = parseInt(counterHex, 16);

      // Age
      const ageMs = Date.now() - timestamp * 1000;
      const ageDays = Math.floor(ageMs / 86400000);
      const ageStr = ageMs < 0 ? 'future' :
        ageDays === 0 ? 'today' :
        ageDays === 1 ? 'yesterday' :
        ageDays < 30 ? `${ageDays} days ago` :
        ageDays < 365 ? `${Math.floor(ageDays / 30)} months ago` :
        `${(ageDays / 365).toFixed(1)} years ago`;

      const lines = [
        `ObjectID:    ${t}`,
        '',
        `Timestamp:   ${timestampHex} → ${timestamp} (Unix)`,
        `Created:     ${date.toISOString()}`,
        `             ${date.toLocaleString()} (${ageStr})`,
        '',
        `Random:      ${randomHex} (5 bytes, machine/process entropy)`,
        `Counter:     ${counterHex} → ${counter}`,
      ];

      return { output: lines.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'ObjectID decode failed' };
    }
  },
});

// ── ULID Inspector ────────────────────────────────────────────────────────────

registerTool({
  id: 'ulid-inspector',
  name: 'ULID Inspector',
  category: 'Inspection',
  description: 'Decode a ULID: extract the embedded timestamp and random component',
  keywords: [
    'ulid', 'decode', 'inspect', 'timestamp', 'id', 'sortable', 'unique',
    'ulid decoder', 'ulid timestamp', 'ulid inspect', 'decode ulid',
  ],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim().toUpperCase();
    return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(t) ? 0.93 : 0;
  },
  execute: (input) => {
    try {
      const t = input.trim().toUpperCase();
      if (!/^[0-9A-HJKMNP-TV-Z]{26}$/.test(t)) {
        return { output: '', error: 'ULID must be exactly 26 Crockford Base32 characters.' };
      }

      const CHARS = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

      // First 10 chars = 50-bit timestamp
      let ts = 0;
      for (let i = 0; i < 10; i++) {
        ts = ts * 32 + CHARS.indexOf(t[i]);
      }

      const date = new Date(ts);
      const ageMs = Date.now() - ts;
      const ageDays = Math.floor(ageMs / 86400000);
      const ageStr = ageMs < 0 ? 'future' :
        ageDays === 0 ? 'today' :
        ageDays === 1 ? 'yesterday' :
        ageDays < 30 ? `${ageDays} days ago` :
        ageDays < 365 ? `${Math.floor(ageDays / 30)} months ago` :
        `${(ageDays / 365).toFixed(1)} years ago`;

      const randomPart = t.slice(10);

      const lines = [
        `ULID:        ${t}`,
        '',
        `Timestamp:   ${t.slice(0, 10)} → ${ts} ms`,
        `Created:     ${date.toISOString()}`,
        `             ${date.toLocaleString()} (${ageStr})`,
        '',
        `Random:      ${randomPart} (80 bits of randomness)`,
      ];

      return { output: lines.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'ULID decode failed' };
    }
  },
});

// ── Semver Calculator ─────────────────────────────────────────────────────────

function parseSemver(v: string): [number, number, number, string] | null {
  const m = v.trim().replace(/^v/, '').match(/^(\d+)\.(\d+)\.(\d+)(.*)$/);
  if (!m) return null;
  return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), m[4]];
}

function compareSemver(a: string, b: string): -1 | 0 | 1 {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  if (!pa || !pb) return 0;
  for (let i = 0; i < 3; i++) {
    if (pa[i] < pb[i]) return -1;
    if (pa[i] > pb[i]) return 1;
  }
  return 0;
}

function matchesSemverRange(version: string, range: string): boolean {
  const v = parseSemver(version);
  if (!v) return false;

  // Handle OR ranges (||)
  if (range.includes('||')) {
    return range.split('||').some((r) => matchesSemverRange(version, r.trim()));
  }

  // Handle AND ranges (space-separated)
  const parts = range.trim().split(/\s+/);
  return parts.every((part) => {
    // Caret: ^1.2.3 — compatible (same major)
    if (part.startsWith('^')) {
      const min = parseSemver(part.slice(1));
      if (!min) return false;
      const maxMajor = min[0] === 0 ? (min[1] === 0 ? [0, 0, min[2] + 1, ''] : [0, min[1] + 1, 0, '']) : [min[0] + 1, 0, 0, ''];
      return compareSemver(version, part.slice(1)) >= 0 &&
        compareSemver(version, maxMajor.slice(0, 3).join('.')) < 0;
    }
    // Tilde: ~1.2.3 — same minor
    if (part.startsWith('~')) {
      const min = parseSemver(part.slice(1));
      if (!min) return false;
      const maxVer = `${min[0]}.${min[1] + 1}.0`;
      return compareSemver(version, part.slice(1)) >= 0 && compareSemver(version, maxVer) < 0;
    }
    // Comparator operators
    if (part.startsWith('>=')) return compareSemver(version, part.slice(2)) >= 0;
    if (part.startsWith('>')) return compareSemver(version, part.slice(1)) > 0;
    if (part.startsWith('<=')) return compareSemver(version, part.slice(2)) <= 0;
    if (part.startsWith('<')) return compareSemver(version, part.slice(1)) < 0;
    if (part.startsWith('=')) return compareSemver(version, part.slice(1)) === 0;
    // Wildcard: 1.x or 1.*
    if (/[x*]/.test(part)) {
      const prefix = part.replace(/[x*.]+$/, '').replace(/\.$/, '');
      return version.startsWith(prefix);
    }
    // Exact
    return compareSemver(version, part) === 0;
  });
}

registerTool({
  id: 'semver-calculator',
  name: 'Semver Calculator',
  category: 'Inspection',
  description: 'Compare semantic versions, validate semver ranges (^1.2.3, ~1.2.3, >=1.0.0), and explain range syntax',
  keywords: [
    'semver', 'semantic versioning', 'version', 'npm', 'cargo', 'composer', 'compare',
    'range', 'caret', 'tilde', '^', '~', 'version range', 'semver calculator',
    'semver checker', 'version checker', 'npm version', 'semver compare',
  ],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    if (/^v?\d+\.\d+\.\d+/.test(t)) return 0.7;
    if (/[\^~>=<]/.test(t) && /\d+\.\d+/.test(t)) return 0.8;
    return 0;
  },
  execute: (input) => {
    try {
      const t = input.trim();
      const lines = t.split('\n').map((l) => l.trim()).filter(Boolean);

      // Two versions on separate lines: compare them
      if (lines.length >= 2) {
        const [a, b] = lines;
        const pa = parseSemver(a);
        const pb = parseSemver(b);

        if (pa && pb) {
          const cmp = compareSemver(a, b);
          const rel = cmp < 0 ? '<' : cmp > 0 ? '>' : '=';

          const out = [
            `Version A:  ${a}`,
            `Version B:  ${b}`,
            '',
            `Result:     ${a} ${rel} ${b}`,
            `            ${cmp < 0 ? 'A is older' : cmp > 0 ? 'A is newer' : 'They are equal'}`,
            '',
            `Breakdown:`,
            `  A  major=${pa[0]}  minor=${pa[1]}  patch=${pa[2]}${pa[3] ? `  pre-release=${pa[3]}` : ''}`,
            `  B  major=${pb[0]}  minor=${pb[1]}  patch=${pb[2]}${pb[3] ? `  pre-release=${pb[3]}` : ''}`,
          ];
          return { output: out.join('\n'), outputLanguage: 'text' };
        }

        // Second line is a range
        const [version, range] = lines;
        if (parseSemver(version)) {
          const matches = matchesSemverRange(version, range);
          const out = [
            `Version:    ${version}`,
            `Range:      ${range}`,
            '',
            `Result:     ${matches ? '✓ Satisfies the range' : '✗ Does NOT satisfy the range'}`,
          ];
          return { output: out.join('\n'), outputLanguage: 'text' };
        }
      }

      // Single version — inspect it
      const parsed = parseSemver(t);
      if (parsed) {
        const [major, minor, patch, pre] = parsed;
        const isStable = major >= 1 && !pre;
        const isBeta = /-(alpha|beta|rc|preview)/i.test(pre);

        const out = [
          `Version:     ${t.replace(/^v/, '')}`,
          '',
          `Major:       ${major}  (breaking changes)`,
          `Minor:       ${minor}  (new features, backward-compatible)`,
          `Patch:       ${patch}  (bug fixes)`,
          ...(pre ? [`Pre-release: ${pre}`] : []),
          '',
          `Stable:      ${isStable ? 'Yes' : 'No'}`,
          ...(isBeta ? ['Tag:         Beta/RC/Alpha'] : []),
          '',
          `npm ranges:`,
          `  Exact:     =${major}.${minor}.${patch}`,
          `  Caret:     ^${major}.${minor}.${patch}  (allows up to <${major + 1}.0.0)`,
          `  Tilde:     ~${major}.${minor}.${patch}  (allows up to <${major}.${minor + 1}.0)`,
          `  GTE:       >=${major}.${minor}.${patch}`,
        ];
        return { output: out.join('\n'), outputLanguage: 'text' };
      }

      // Single range — explain it
      const rangeExplanation: string[] = [`Range:       ${t}`, ''];
      if (t.startsWith('^')) rangeExplanation.push('Type:        Caret — compatible with version, allows minor and patch updates');
      else if (t.startsWith('~')) rangeExplanation.push('Type:        Tilde — approximately equivalent, allows patch updates only');
      else if (t.includes('||')) rangeExplanation.push('Type:        OR range — must satisfy any one of the alternatives');
      else if (t.includes(' ')) rangeExplanation.push('Type:        AND range — must satisfy all conditions');
      else rangeExplanation.push('Type:        Comparator range');

      return { output: rangeExplanation.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Semver calculation failed' };
    }
  },
});

// ── .env File Parser ──────────────────────────────────────────────────────────

registerTool({
  id: 'dotenv-parser',
  name: '.env File Parser',
  category: 'Inspection',
  description: 'Parse and validate .env file format — extract key-value pairs, detect issues, show statistics',
  keywords: [
    'env', 'dotenv', '.env', 'environment', 'variables', 'parse', 'config',
    'docker', 'kubernetes', 'twelve-factor', 'environment variables', 'env file',
    'dotenv parser', 'parse env', '.env parser', 'env file parser', 'env vars',
  ],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    // .env files: lines of KEY=value or # comments, no spaces around =
    const lines = t.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
    if (lines.length === 0) return 0;
    const envLike = lines.filter((l) => /^[A-Z_][A-Z0-9_]*\s*=/.test(l.trim()));
    return envLike.length / lines.length >= 0.5 ? 0.88 : 0;
  },
  execute: (input) => {
    try {
      const lines = input.split('\n');
      const vars: Array<{ key: string; value: string; raw: string; lineNum: number }> = [];
      const warnings: string[] = [];
      let commentCount = 0;
      let blankCount = 0;

      for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const trimmed = raw.trim();
        const lineNum = i + 1;

        if (!trimmed) { blankCount++; continue; }
        if (trimmed.startsWith('#')) { commentCount++; continue; }

        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) {
          warnings.push(`Line ${lineNum}: no "=" found — "${trimmed.slice(0, 40)}"`);
          continue;
        }

        const key = trimmed.slice(0, eqIdx).trim();
        let value = trimmed.slice(eqIdx + 1).trim();

        // Validate key
        if (!/^[A-Za-z_][A-Za-z0-9_.]*$/.test(key)) {
          warnings.push(`Line ${lineNum}: key "${key}" contains unusual characters`);
        }
        if (key !== key.toUpperCase()) {
          warnings.push(`Line ${lineNum}: key "${key}" is not uppercase (convention)`);
        }

        // Strip quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }

        // Remove inline comment (unquoted # after value)
        const commentMatch = value.match(/(.*?)\s+#.*/);
        if (commentMatch) value = commentMatch[1];

        // Security warning for obvious secrets
        if (/password|secret|token|key|auth/i.test(key) && value.length < 8) {
          warnings.push(`Line ${lineNum}: "${key}" looks like a secret but has a short value`);
        }

        vars.push({ key, value, raw, lineNum });
      }

      // Check duplicates
      const seen = new Map<string, number>();
      for (const v of vars) {
        if (seen.has(v.key)) {
          warnings.push(`Line ${v.lineNum}: duplicate key "${v.key}" (first defined on line ${seen.get(v.key)})`);
        } else {
          seen.set(v.key, v.lineNum);
        }
      }

      const maxKeyLen = Math.max(...vars.map((v) => v.key.length), 0);

      const outLines: string[] = [
        `Variables:   ${vars.length}`,
        `Comments:    ${commentCount}`,
        `Blank lines: ${blankCount}`,
        ...(warnings.length > 0 ? [`Warnings:    ${warnings.length}`, ''] : ['']),
        ...(warnings.length > 0 ? ['Warnings:', ...warnings.map((w) => `  ⚠  ${w}`), ''] : []),
        'Parsed variables:',
        '',
        ...vars.map((v) => {
          const masked =
            /password|secret|token|key|auth/i.test(v.key) && v.value.length > 0
              ? v.value.slice(0, 2) + '*'.repeat(Math.max(0, v.value.length - 2))
              : v.value;
          return `  ${v.key.padEnd(maxKeyLen)}  =  ${masked}`;
        }),
      ];

      return { output: outLines.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : '.env parse failed' };
    }
  },
});
