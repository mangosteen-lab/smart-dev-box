import { registerTool } from '../registry';
import { normalizeSingleQuoteJson } from '../formatting';

// ── JSON → CSV ───────────────────────────────────────────────────────────────

function jsonToDelimited(input: string, delimiter: string): string {
  const parsed = JSON.parse(input);
  const rows: unknown[][] = [];
  let headers: string[];

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) return '';
    if (typeof parsed[0] === 'object' && parsed[0] !== null) {
      headers = Object.keys(parsed[0]);
      rows.push(headers);
      for (const row of parsed) {
        rows.push(headers.map((h) => (row as Record<string, unknown>)[h] ?? ''));
      }
    } else {
      // Flat array of primitives
      headers = ['value'];
      rows.push(headers);
      for (const v of parsed) rows.push([v]);
    }
  } else if (typeof parsed === 'object' && parsed !== null) {
    headers = ['key', 'value'];
    rows.push(headers);
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      rows.push([k, typeof v === 'object' ? JSON.stringify(v) : v]);
    }
  } else {
    throw new Error('Input must be a JSON array or object');
  }

  return rows
    .map((row) =>
      row
        .map((cell) => {
          const s = String(cell ?? '');
          // Quote cells that contain delimiter, quotes, or newlines
          if (s.includes(delimiter) || s.includes('"') || s.includes('\n')) {
            return '"' + s.replace(/"/g, '""') + '"';
          }
          return s;
        })
        .join(delimiter)
    )
    .join('\n');
}

function detectJson(input: string): number {
  const t = input.trim();
  if ((t.startsWith('[') || t.startsWith('{')) && (t.endsWith(']') || t.endsWith('}'))) {
    try { JSON.parse(t); return 0.7; } catch { /* fall through */ }
    if (normalizeSingleQuoteJson(t) !== null) return 0.65;
  }
  return 0;
}

registerTool({
  id: 'json-to-csv',
  name: 'JSON → CSV',
  category: 'Conversion',
  description: 'Convert a JSON array of objects to CSV format',
  keywords: ['json', 'csv', 'convert', 'table', 'comma', 'spreadsheet'],
  outputExtension: 'csv',
  detect: detectJson,
  execute: (input) => {
    try {
      return { output: jsonToDelimited(input.trim(), ','), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Conversion failed' };
    }
  },
});

registerTool({
  id: 'json-to-tsv',
  name: 'JSON → TSV',
  category: 'Conversion',
  description: 'Convert a JSON array of objects to TSV (tab-separated values) format',
  keywords: ['json', 'tsv', 'convert', 'table', 'tab', 'spreadsheet'],
  outputExtension: 'tsv',
  detect: detectJson,
  execute: (input) => {
    try {
      return { output: jsonToDelimited(input.trim(), '\t'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Conversion failed' };
    }
  },
});

registerTool({
  id: 'json-to-yaml',
  name: 'JSON → YAML',
  category: 'Conversion',
  description: 'Convert JSON to YAML format',
  keywords: ['json', 'yaml', 'yml', 'convert'],
  outputExtension: 'yaml',
  detect: detectJson,
  execute: (input) => {
    try {
      const parsed = JSON.parse(input.trim());
      return { output: toYaml(parsed, 0), outputLanguage: 'yaml' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Conversion failed' };
    }
  },
});

function toYaml(value: unknown, indent: number): string {
  const pad = '  '.repeat(indent);
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    // Quote strings that need it
    if (/[\n:#{}&*!,\[\]|>'"%@`]/.test(value) || value.trim() !== value || value === '') {
      return '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
    }
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return value
      .map((item) => {
        const rendered = toYaml(item, indent + 1);
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          // Object in array: first key on same line as dash
          const lines = rendered.split('\n');
          return pad + '- ' + lines[0].trimStart() + (lines.length > 1 ? '\n' + lines.slice(1).join('\n') : '');
        }
        return pad + '- ' + rendered;
      })
      .join('\n');
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    return keys
      .map((k) => {
        const v = obj[k];
        if (typeof v === 'object' && v !== null) {
          return pad + k + ':\n' + toYaml(v, indent + 1);
        }
        return pad + k + ': ' + toYaml(v, indent + 1);
      })
      .join('\n');
  }
  return String(value);
}

// ── Date Formatter ────────────────────────────────────────────────────────────

const DATE_LOCALES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'ko-KR', label: 'Korean' },
  { code: 'de-DE', label: 'German' },
  { code: 'fr-FR', label: 'French' },
  { code: 'es-ES', label: 'Spanish' },
  { code: 'pt-BR', label: 'Portuguese (Brazil)' },
  { code: 'ar-SA', label: 'Arabic' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ru-RU', label: 'Russian' },
];

registerTool({
  id: 'date-formatter',
  name: 'Date Formatter',
  category: 'Conversion',
  description: 'Format a date/timestamp in multiple locales and styles',
  keywords: ['date', 'format', 'locale', 'time', 'i18n', 'internationalization', 'timestamp'],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    if (/^\d{10}$/.test(t) || /^\d{13}$/.test(t)) return 0.5;
    if (!isNaN(Date.parse(t)) && /\d{4}/.test(t)) return 0.6;
    return 0;
  },
  execute: (input) => {
    const t = input.trim();
    let date: Date;
    if (/^\d{10}$/.test(t)) date = new Date(parseInt(t) * 1000);
    else if (/^\d{13}$/.test(t)) date = new Date(parseInt(t));
    else date = new Date(t);

    if (isNaN(date.getTime())) return { output: '', error: 'Could not parse date/time' };

    const styles: Intl.DateTimeFormatOptions[] = [
      { dateStyle: 'full', timeStyle: 'long' },
      { dateStyle: 'long' },
      { dateStyle: 'medium' },
      { dateStyle: 'short' },
    ];

    const lines: string[] = [`Input:    ${t}`, `ISO 8601: ${date.toISOString()}`, `UTC:      ${date.toUTCString()}`, ''];

    for (const locale of DATE_LOCALES) {
      const formatted = styles.map((s) => {
        try { return new Intl.DateTimeFormat(locale.code, s).format(date); } catch { return ''; }
      }).filter(Boolean).join('  |  ');
      lines.push(`${locale.label.padEnd(26)} ${formatted}`);
    }

    return { output: lines.join('\n'), outputLanguage: 'text' };
  },
});

registerTool({
  id: 'unix-timestamp',
  name: 'Unix Timestamp',
  category: 'Conversion',
  description: 'Convert between Unix timestamps and human-readable dates',
  keywords: ['timestamp', 'unix', 'epoch', 'date', 'time', 'convert'],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    // Looks like a Unix timestamp (10 or 13 digits)
    if (/^\d{10}$/.test(t) || /^\d{13}$/.test(t)) return 0.9;
    // Looks like a date string
    if (!isNaN(Date.parse(t)) && /\d{4}/.test(t)) return 0.7;
    return 0;
  },
  execute: (input) => {
    const t = input.trim();
    // Detect if input is a timestamp or a date string
    if (/^\d{10}$/.test(t) || /^\d{13}$/.test(t)) {
      const ms = t.length === 13 ? parseInt(t) : parseInt(t) * 1000;
      const d = new Date(ms);
      if (isNaN(d.getTime())) return { output: '', error: 'Invalid timestamp' };
      const lines = [
        `Input:      ${t} (${t.length === 13 ? 'milliseconds' : 'seconds'})`,
        `UTC:        ${d.toUTCString()}`,
        `ISO 8601:   ${d.toISOString()}`,
        `Local:      ${d.toLocaleString()}`,
        `Unix (s):   ${Math.floor(ms / 1000)}`,
        `Unix (ms):  ${ms}`,
      ];
      return { output: lines.join('\n'), outputLanguage: 'text' };
    }
    // Parse as date string
    const d = new Date(t);
    if (isNaN(d.getTime())) return { output: '', error: 'Could not parse date/time string' };
    const sec = Math.floor(d.getTime() / 1000);
    const lines = [
      `Input:      ${t}`,
      `UTC:        ${d.toUTCString()}`,
      `ISO 8601:   ${d.toISOString()}`,
      `Unix (s):   ${sec}`,
      `Unix (ms):  ${d.getTime()}`,
    ];
    return { output: lines.join('\n'), outputLanguage: 'text' };
  },
});

registerTool({
  id: 'color-converter',
  name: 'Color Converter',
  category: 'Conversion',
  description: 'Convert colors between HEX, RGB, HSL, and HSV',
  keywords: ['color', 'hex', 'rgb', 'hsl', 'hsv', 'convert'],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(t)) return 0.95;
    if (/^rgb\s*\(/i.test(t)) return 0.9;
    if (/^hsl\s*\(/i.test(t)) return 0.9;
    return 0;
  },
  execute: (input) => {
    try {
      const t = input.trim();
      let r: number, g: number, b: number;

      if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(t)) {
        let hex = t.slice(1);
        if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      } else if (/^rgb\s*\(/i.test(t)) {
        const m = t.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
        if (!m) throw new Error('Invalid RGB format');
        [r, g, b] = [+m[1], +m[2], +m[3]];
      } else if (/^hsl\s*\(/i.test(t)) {
        const m = t.match(/hsl\s*\(\s*(\d+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)/i);
        if (!m) throw new Error('Invalid HSL format');
        [r, g, b] = hslToRgb(+m[1], +m[2] / 100, +m[3] / 100);
      } else {
        throw new Error('Unrecognized color format');
      }

      const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
      const [h, s, l] = rgbToHsl(r, g, b);
      const [, sv, v] = rgbToHsv(r, g, b);

      const lines = [
        `HEX:  ${hex}`,
        `RGB:  rgb(${r}, ${g}, ${b})`,
        `HSL:  hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
        `HSV:  hsv(${Math.round(h)}, ${Math.round(sv * 100)}%, ${Math.round(v * 100)}%)`,
      ];
      return { output: lines.join('\n'), outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Color parse failed' };
    }
  },
});

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
  }
  return [h * 60, s, max];
}

registerTool({
  id: 'number-base-converter',
  name: 'Number Base Converter',
  category: 'Conversion',
  description: 'Convert integers between binary, octal, decimal, and hexadecimal',
  keywords: ['binary', 'octal', 'hex', 'decimal', 'base', 'convert', 'number'],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    if (/^0b[01]+$/i.test(t)) return 0.95;
    if (/^0x[0-9a-f]+$/i.test(t)) return 0.95;
    if (/^0o[0-7]+$/i.test(t)) return 0.95;
    if (/^-?\d+$/.test(t) && t.length <= 21) return 0.4;
    return 0;
  },
  execute: (input) => {
    const t = input.trim();
    let n: number;
    if (/^0b[01]+$/i.test(t)) n = parseInt(t.slice(2), 2);
    else if (/^0x[0-9a-f]+$/i.test(t)) n = parseInt(t.slice(2), 16);
    else if (/^0o[0-7]+$/i.test(t)) n = parseInt(t.slice(2), 8);
    else if (/^-?\d+$/.test(t)) n = parseInt(t, 10);
    else return { output: '', error: 'Unrecognized number format' };

    if (isNaN(n)) return { output: '', error: 'Invalid number' };

    const lines = [
      `Decimal:     ${n}`,
      `Binary:      0b${n.toString(2)}`,
      `Octal:       0o${n.toString(8)}`,
      `Hexadecimal: 0x${n.toString(16).toUpperCase()}`,
    ];
    return { output: lines.join('\n'), outputLanguage: 'text' };
  },
});

// ── YAML → JSON ───────────────────────────────────────────────────────────────

// Minimal YAML parser (handles common cases: mappings, sequences, scalars, comments)
function parseYaml(yaml: string): unknown {
  const lines = yaml.split('\n').filter((l) => !/^\s*#/.test(l));

  function parseValue(val: string): unknown {
    const v = val.trim();
    if (v === 'true' || v === 'yes') return true;
    if (v === 'false' || v === 'no') return false;
    if (v === 'null' || v === '~' || v === '') return null;
    if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(v)) return Number(v);
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      return v.slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    return v;
  }

  function getIndent(line: string) { return line.match(/^(\s*)/)?.[1].length ?? 0; }

  function parseBlock(lineArr: string[], start: number, baseIndent: number): [unknown, number] {
    let i = start;
    // skip blanks
    while (i < lineArr.length && lineArr[i].trim() === '') i++;
    if (i >= lineArr.length) return [null, i];

    const firstLine = lineArr[i];
    const indent = getIndent(firstLine);
    if (indent < baseIndent) return [null, i];

    // Sequence
    if (firstLine.trimStart().startsWith('- ') || firstLine.trim() === '-') {
      const arr: unknown[] = [];
      while (i < lineArr.length) {
        const line = lineArr[i];
        if (line.trim() === '') { i++; continue; }
        if (getIndent(line) < indent) break;
        if (!line.trimStart().startsWith('- ')) break;
        const rest = line.trimStart().slice(2);
        if (rest.trim() === '') {
          // block item
          const [val, next] = parseBlock(lineArr, i + 1, indent + 2);
          arr.push(val); i = next;
        } else if (rest.includes(': ') || rest.match(/^[\w-]+:\s*$/)) {
          // inline mapping or nested
          const [val, next] = parseBlock([rest, ...lineArr.slice(i + 1).map(l => l.slice(indent + 2))], 0, 0);
          arr.push(val); i = next + i + 1;
          // re-parse properly
          const subLines = [rest];
          let j = i;
          while (j < lineArr.length && (lineArr[j].trim() === '' || getIndent(lineArr[j]) > indent + 1)) {
            subLines.push(lineArr[j].slice(indent + 2)); j++;
          }
          arr.pop();
          arr.push(parseBlock(subLines, 0, 0)[0]);
          i = j;
        } else {
          arr.push(parseValue(rest)); i++;
        }
      }
      return [arr, i];
    }

    // Mapping
    const obj: Record<string, unknown> = {};
    while (i < lineArr.length) {
      const line = lineArr[i];
      if (line.trim() === '') { i++; continue; }
      if (getIndent(line) < indent) break;
      const m = line.match(/^(\s*)([\w.\-/@ ]+?):\s*(.*)/);
      if (!m) { i++; continue; }
      const key = m[2].trim();
      const inline = m[3].trim();
      if (inline === '' || inline.startsWith('#')) {
        // block value
        const [val, next] = parseBlock(lineArr, i + 1, indent + 2);
        obj[key] = val ?? null; i = next;
      } else if (inline.startsWith('[') || inline.startsWith('{')) {
        try { obj[key] = JSON.parse(inline.replace(/'/g, '"')); } catch { obj[key] = inline; }
        i++;
      } else {
        obj[key] = parseValue(inline); i++;
      }
    }
    return [obj, i];
  }

  const nonEmpty = lines.filter((l) => l.trim() !== '');
  if (nonEmpty.length === 0) return null;
  return parseBlock(lines, 0, 0)[0];
}

registerTool({
  id: 'yaml-to-json',
  name: 'YAML → JSON',
  category: 'Conversion',
  description: 'Convert YAML to JSON format',
  keywords: ['yaml', 'yml', 'json', 'convert'],
  outputExtension: 'json',
  detect: (input) => {
    const t = input.trim();
    if (t.startsWith('{') || t.startsWith('[')) return 0;
    if (/^[\w.\-]+:\s/m.test(t) && !t.includes('SELECT') && !t.includes('<')) return 0.7;
    return 0;
  },
  execute: (input) => {
    try {
      const parsed = parseYaml(input);
      return { output: JSON.stringify(parsed, null, 2), outputLanguage: 'json' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'YAML parse failed' };
    }
  },
});

// ── CSV → JSON ────────────────────────────────────────────────────────────────

function parseCsv(input: string, delimiter = ','): string[][] {
  const rows: string[][] = [];
  let field = '', row: string[] = [], inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"' && input[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { field += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === delimiter) { row.push(field); field = ''; }
      else if (ch === '\n' || (ch === '\r' && input[i + 1] === '\n')) {
        if (ch === '\r') i++;
        row.push(field); rows.push(row); row = []; field = '';
      } else { field += ch; }
    }
  }
  row.push(field);
  if (row.some((f) => f !== '')) rows.push(row);
  return rows;
}

registerTool({
  id: 'csv-to-json',
  name: 'CSV → JSON',
  category: 'Conversion',
  description: 'Convert CSV data to a JSON array of objects',
  keywords: ['csv', 'json', 'convert', 'table', 'spreadsheet'],
  outputExtension: 'json',
  detect: (input) => {
    const lines = input.trim().split('\n');
    if (lines.length < 2) return 0;
    const commas = (lines[0].match(/,/g) || []).length;
    return commas >= 1 && lines.every((l) => (l.match(/,/g) || []).length >= commas - 1) ? 0.75 : 0;
  },
  execute: (input, options) => {
    try {
      const delimiter = (options?.delimiter as string) || ',';
      const rows = parseCsv(input.trim(), delimiter);
      if (rows.length < 2) return { output: '[]', outputLanguage: 'json' };
      const headers = rows[0];
      const result = rows.slice(1).map((row) => {
        const obj: Record<string, string | number | boolean | null> = {};
        headers.forEach((h, i) => {
          const v = row[i]?.trim() ?? '';
          if (v === '') obj[h] = null;
          else if (!isNaN(Number(v)) && v !== '') obj[h] = Number(v);
          else if (v === 'true') obj[h] = true;
          else if (v === 'false') obj[h] = false;
          else obj[h] = v;
        });
        return obj;
      });
      return { output: JSON.stringify(result, null, 2), outputLanguage: 'json' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'CSV parse failed' };
    }
  },
});

// ── HTML → JSX ────────────────────────────────────────────────────────────────

registerTool({
  id: 'html-to-jsx',
  name: 'HTML → JSX',
  category: 'Conversion',
  description: 'Convert HTML markup to JSX (React-compatible)',
  keywords: ['html', 'jsx', 'react', 'convert', 'component'],
  outputExtension: 'jsx',
  detect: (input) => {
    const t = input.trim();
    return /<[a-z][\s\S]*>/i.test(t) ? 0.6 : 0;
  },
  execute: (input) => {
    try {
      let out = input;
      // Attributes
      out = out.replace(/\bclass=/g, 'className=');
      out = out.replace(/\bfor=/g, 'htmlFor=');
      out = out.replace(/\btabindex=/g, 'tabIndex=');
      out = out.replace(/\breadonly\b/g, 'readOnly');
      out = out.replace(/\bautofocus\b/g, 'autoFocus');
      out = out.replace(/\bnovalidate\b/g, 'noValidate');
      out = out.replace(/\bautocomplete=/g, 'autoComplete=');
      out = out.replace(/\benctype=/g, 'encType=');
      out = out.replace(/\bcrossorigin=/g, 'crossOrigin=');
      // Self-closing void elements
      const voidTags = ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'];
      for (const tag of voidTags) {
        out = out.replace(new RegExp(`<(${tag})(\\s[^>]*)?>(?!</)`, 'gi'), (_, t, attrs) => `<${t}${attrs || ''} />`);
      }
      // Inline styles: style="color: red" → style={{ color: 'red' }}
      out = out.replace(/style="([^"]*)"/g, (_match, styles: string) => {
        const obj = styles.split(';').filter(Boolean).map((s) => {
          const [prop, ...val] = s.split(':');
          const camel = prop.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
          return `${camel}: '${val.join(':').trim()}'`;
        }).join(', ');
        return `style={{ ${obj} }}`;
      });
      // Comments
      out = out.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
      return { output: out, outputLanguage: 'jsx' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Conversion failed' };
    }
  },
});

// ── JSON Escape / Unescape ────────────────────────────────────────────────────

registerTool({
  id: 'json-escape',
  name: 'JSON Escape',
  category: 'Conversion',
  description: 'Escape a string so it can be safely embedded inside a JSON value',
  keywords: ['json', 'escape', 'encode', 'string', 'serialize'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input) => ({
    output: JSON.stringify(input).slice(1, -1),
    outputLanguage: 'text',
  }),
});

registerTool({
  id: 'json-unescape',
  name: 'JSON Unescape',
  category: 'Conversion',
  description: 'Unescape a JSON-escaped string back to normal text',
  keywords: ['json', 'unescape', 'decode', 'string', 'deserialize'],
  outputExtension: 'txt',
  detect: (input) => /\\["\\/bfnrtu]/.test(input) ? 0.7 : 0,
  execute: (input) => {
    try {
      return { output: JSON.parse(`"${input}"`), outputLanguage: 'text' };
    } catch {
      return { output: '', error: 'Invalid JSON-escaped string' };
    }
  },
});

// ── XML ↔ JSON ────────────────────────────────────────────────────────────────

function xmlToJson(xml: string): unknown {
  // Simple recursive XML-to-JSON parser (handles attributes and text nodes)
  const parseNode = (node: Element): unknown => {
    const obj: Record<string, unknown> = {};
    // Attributes
    for (const attr of Array.from(node.attributes)) {
      obj[`@${attr.name}`] = attr.value;
    }
    let text = '';
    const children: Record<string, unknown[]> = {};
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 3) {
        text += child.nodeValue ?? '';
      } else if (child.nodeType === 1) {
        const el = child as Element;
        if (!children[el.tagName]) children[el.tagName] = [];
        children[el.tagName].push(parseNode(el));
      }
    }
    const trimmedText = text.trim();
    const hasChildren = Object.keys(children).length > 0;
    const hasAttrs = Object.keys(obj).length > 0;
    if (!hasChildren && !hasAttrs) return trimmedText || null;
    if (trimmedText) obj['#text'] = trimmedText;
    for (const [tag, nodes] of Object.entries(children)) {
      obj[tag] = nodes.length === 1 ? nodes[0] : nodes;
    }
    return obj;
  };

  if (typeof DOMParser === 'undefined') {
    throw new Error('DOMParser not available in this environment');
  }
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) throw new Error('XML parse error: ' + (parseError.textContent?.split('\n')[0] ?? 'invalid XML'));
  const root = doc.documentElement;
  return { [root.tagName]: parseNode(root) };
}

registerTool({
  id: 'xml-to-json',
  name: 'XML → JSON',
  category: 'Conversion',
  description: 'Convert XML to JSON format',
  keywords: ['xml', 'json', 'convert', 'parse'],
  outputExtension: 'json',
  detect: (input) => {
    const t = input.trim();
    if (t.startsWith('<') && t.includes('</')) return 0.8;
    return 0;
  },
  execute: (input) => {
    try {
      const result = xmlToJson(input.trim());
      return { output: JSON.stringify(result, null, 2), outputLanguage: 'json' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'XML parse failed' };
    }
  },
});

function jsonToXml(value: unknown, tagName: string, indent: number): string {
  const pad = '  '.repeat(indent);
  if (value === null || value === undefined) return `${pad}<${tagName}/>`;
  if (typeof value !== 'object') return `${pad}<${tagName}>${String(value)}</${tagName}>`;
  if (Array.isArray(value)) {
    return value.map((item) => jsonToXml(item, tagName, indent)).join('\n');
  }
  const obj = value as Record<string, unknown>;
  const attrs = Object.entries(obj)
    .filter(([k]) => k.startsWith('@'))
    .map(([k, v]) => ` ${k.slice(1)}="${v}"`)
    .join('');
  const children = Object.entries(obj).filter(([k]) => !k.startsWith('@'));
  if (children.length === 0) return `${pad}<${tagName}${attrs}/>`;
  if (children.length === 1 && children[0][0] === '#text') {
    return `${pad}<${tagName}${attrs}>${children[0][1]}</${tagName}>`;
  }
  const inner = children
    .flatMap(([k, v]) => {
      if (k === '#text') return [`${pad}  ${v}`];
      if (Array.isArray(v)) return (v as unknown[]).map((item) => jsonToXml(item, k, indent + 1));
      return [jsonToXml(v, k, indent + 1)];
    })
    .join('\n');
  return `${pad}<${tagName}${attrs}>\n${inner}\n${pad}</${tagName}>`;
}

registerTool({
  id: 'json-to-xml',
  name: 'JSON → XML',
  category: 'Conversion',
  description: 'Convert JSON to XML format',
  keywords: ['json', 'xml', 'convert', 'serialize'],
  outputExtension: 'xml',
  detect: detectJson,
  execute: (input) => {
    try {
      const parsed = JSON.parse(input.trim());
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        const keys = Object.keys(parsed);
        if (keys.length === 1) {
          xml += jsonToXml((parsed as Record<string, unknown>)[keys[0]], keys[0], 0);
        } else {
          xml += jsonToXml(parsed, 'root', 0);
        }
      } else {
        xml += jsonToXml(parsed, 'root', 0);
      }
      return { output: xml, outputLanguage: 'xml' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Conversion failed' };
    }
  },
});

// ── Markdown → HTML ───────────────────────────────────────────────────────────

registerTool({
  id: 'markdown-to-html',
  name: 'Markdown → HTML',
  category: 'Conversion',
  description: 'Convert Markdown text to HTML',
  keywords: ['markdown', 'md', 'html', 'convert', 'render'],
  outputExtension: 'html',
  detect: (input) => {
    const t = input.trim();
    const hasMarkdown = /^#{1,6} /m.test(t) || /\*\*/.test(t) || /\[.+\]\(.+\)/.test(t) || /^[-*] /m.test(t) || /^```/.test(t);
    return hasMarkdown ? 0.65 : 0;
  },
  execute: (input) => {
    // Lightweight Markdown-to-HTML converter
    let html = input
      // Headings
      .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
      .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // Code blocks
      .replace(/```[\w]*\n([\s\S]*?)```/gm, '<pre><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/__([^_]+)__/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
      // Blockquote
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      // Unordered list items
      .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
      // Ordered list items
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      // Horizontal rule
      .replace(/^---+$/gm, '<hr />')
      // Paragraphs (double newline)
      .replace(/\n\n(?!<[hlu]|<pre|<block)/g, '</p>\n<p>')
      .replace(/\n(?!<)/g, '<br />\n');

    html = `<p>${html}</p>`;
    // Clean up: wrap consecutive <li> in <ul>
    html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (m) => `<ul>\n${m}</ul>\n`);
    return { output: html, outputLanguage: 'html' };
  },
});

// ── HTML → Plain Text (Strip HTML) ───────────────────────────────────────────

registerTool({
  id: 'html-to-text',
  name: 'HTML → Text',
  category: 'Conversion',
  description: 'Strip HTML tags and extract plain text content',
  keywords: ['html', 'text', 'strip', 'plain', 'convert', 'extract'],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    return /<[a-z][\s\S]*>/i.test(t) ? 0.7 : 0;
  },
  execute: (input) => {
    try {
      const text = input
        // Replace block elements with newlines
        .replace(/<\/?(p|div|br|h[1-6]|li|tr|td|th|blockquote|pre|section|article|header|footer)[^>]*>/gi, '\n')
        // Remove all remaining tags
        .replace(/<[^>]+>/g, '')
        // Decode common HTML entities
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
        // Collapse multiple blank lines
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      return { output: text, outputLanguage: 'text' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Conversion failed' };
    }
  },
});

// ── Seconds ↔ H:M:S ───────────────────────────────────────────────────────────

registerTool({
  id: 'seconds-to-hms',
  name: 'Seconds → H:M:S',
  category: 'Conversion',
  description: 'Convert a number of seconds to hours:minutes:seconds format',
  keywords: ['seconds', 'time', 'hms', 'hours', 'minutes', 'convert', 'duration'],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    return /^\d+$/.test(t) && parseInt(t) >= 60 ? 0.3 : 0;
  },
  execute: (input) => {
    const t = input.trim();
    const totalSeconds = parseInt(t);
    if (isNaN(totalSeconds) || totalSeconds < 0) return { output: '', error: 'Input must be a non-negative integer (seconds)' };
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const hms = `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const human = [
      h > 0 ? `${h} hour${h !== 1 ? 's' : ''}` : '',
      m > 0 ? `${m} minute${m !== 1 ? 's' : ''}` : '',
      s > 0 ? `${s} second${s !== 1 ? 's' : ''}` : '',
    ].filter(Boolean).join(', ') || '0 seconds';
    const lines = [
      `Input:   ${totalSeconds} seconds`,
      `H:M:S:   ${hms}`,
      `Human:   ${human}`,
      `Days:    ${(totalSeconds / 86400).toFixed(4)}`,
    ];
    return { output: lines.join('\n'), outputLanguage: 'text' };
  },
});

registerTool({
  id: 'hms-to-seconds',
  name: 'H:M:S → Seconds',
  category: 'Conversion',
  description: 'Convert hours:minutes:seconds to total seconds',
  keywords: ['hms', 'hours', 'minutes', 'seconds', 'time', 'convert', 'duration'],
  outputExtension: 'txt',
  detect: (input) => /^\d+:\d{2}:\d{2}$/.test(input.trim()) ? 0.9 : 0,
  execute: (input) => {
    const t = input.trim();
    const match = t.match(/^(\d+):(\d{2}):(\d{2})$/);
    if (!match) return { output: '', error: 'Input must be in H:M:S format (e.g. 1:23:45)' };
    const [, hh, mm, ss] = match.map(Number);
    if (mm >= 60 || ss >= 60) return { output: '', error: 'Minutes and seconds must be 0-59' };
    const total = hh * 3600 + mm * 60 + ss;
    const lines = [
      `Input:   ${t}`,
      `Seconds: ${total}`,
      `Minutes: ${(total / 60).toFixed(4)}`,
      `Hours:   ${(total / 3600).toFixed(4)}`,
    ];
    return { output: lines.join('\n'), outputLanguage: 'text' };
  },
});

// ── Roman Numerals ────────────────────────────────────────────────────────────

registerTool({
  id: 'decimal-to-roman',
  name: 'Decimal → Roman',
  category: 'Conversion',
  description: 'Convert a decimal integer to Roman numerals',
  keywords: ['roman', 'numeral', 'decimal', 'convert', 'number'],
  outputExtension: 'txt',
  detect: (input) => {
    const n = parseInt(input.trim());
    return !isNaN(n) && n >= 1 && n <= 3999 && /^\d+$/.test(input.trim()) ? 0.2 : 0;
  },
  execute: (input) => {
    const n = parseInt(input.trim());
    if (isNaN(n) || n < 1 || n > 3999) return { output: '', error: 'Input must be an integer between 1 and 3999' };
    const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
    const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
    let num = n, result = '';
    for (let i = 0; i < vals.length; i++) {
      while (num >= vals[i]) { result += syms[i]; num -= vals[i]; }
    }
    return { output: result, outputLanguage: 'text' };
  },
});

registerTool({
  id: 'roman-to-decimal',
  name: 'Roman → Decimal',
  category: 'Conversion',
  description: 'Convert Roman numerals to a decimal integer',
  keywords: ['roman', 'numeral', 'decimal', 'convert', 'number'],
  outputExtension: 'txt',
  detect: (input) => /^[IVXLCDM]+$/i.test(input.trim()) && input.trim().length <= 15 ? 0.7 : 0,
  execute: (input) => {
    const t = input.trim().toUpperCase();
    if (!/^[IVXLCDM]+$/.test(t)) return { output: '', error: 'Input must contain only Roman numeral characters (I, V, X, L, C, D, M)' };
    const map: Record<string, number> = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
    let result = 0;
    for (let i = 0; i < t.length; i++) {
      const curr = map[t[i]];
      const next = map[t[i+1]];
      if (next && curr < next) result -= curr;
      else result += curr;
    }
    return { output: String(result), outputLanguage: 'text' };
  },
});

// ── UUID ↔ Hex UUID ──────────────────────────────────────────────────────────

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// 32 hex chars, no dashes
const HEX_UUID_RE = /^[0-9a-f]{32}$/i;

function uuidToHex(uuid: string): string {
  return uuid.replace(/-/g, '').toLowerCase();
}

function hexToUuid(hex: string): string {
  const h = hex.toLowerCase();
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

registerTool({
  id: 'uuid-hex-converter',
  name: 'UUID ↔ Hex',
  category: 'Conversion',
  description: 'Convert between standard UUID format (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) and plain 32-char hex',
  keywords: ['uuid', 'guid', 'hex', 'convert'],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    if (UUID_RE.test(t)) return 0.97;
    if (HEX_UUID_RE.test(t)) return 0.97;
    return 0;
  },
  execute: (input) => {
    const t = input.trim();
    if (UUID_RE.test(t)) {
      const hex = uuidToHex(t);
      return {
        output: `UUID:    ${t}\nHex:     ${hex}`,
        outputLanguage: 'text',
      };
    }
    if (HEX_UUID_RE.test(t)) {
      const uuid = hexToUuid(t);
      return {
        output: `Hex:     ${t.toLowerCase()}\nUUID:    ${uuid}`,
        outputLanguage: 'text',
      };
    }
    return { output: '', error: 'Input must be a standard UUID or a 32-character hex string' };
  },
});
