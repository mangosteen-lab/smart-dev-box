import { registerTool } from '../registry';

// Helper: detect if the input is multi-word text (not code, not JSON)
function isPlainText(input: string): number {
  const t = input.trim();
  if (!t || t.length < 2) return 0;
  // Exclude JSON/XML/code-like inputs
  if (t.startsWith('{') || t.startsWith('[') || t.startsWith('<')) return 0;
  return 0.3;
}

// ── Case conversion functions (exported for use in CaseConverterPanel) ─────────

export type CaseVariant =
  | 'lowercase'
  | 'uppercase'
  | 'title-case'
  | 'camel-case'
  | 'pascal-case'
  | 'snake-case'
  | 'kebab-case'
  | 'constant-case';

export const CASE_VARIANTS: { id: CaseVariant; label: string }[] = [
  { id: 'lowercase',     label: 'lowercase'      },
  { id: 'uppercase',     label: 'UPPERCASE'       },
  { id: 'title-case',    label: 'Title Case'      },
  { id: 'camel-case',    label: 'camelCase'       },
  { id: 'pascal-case',   label: 'PascalCase'      },
  { id: 'snake-case',    label: 'snake_case'      },
  { id: 'kebab-case',    label: 'kebab-case'      },
  { id: 'constant-case', label: 'CONSTANT_CASE'   },
];

export function convertCase(input: string, variant: CaseVariant): string {
  switch (variant) {
    case 'lowercase':
      return input.toLowerCase();
    case 'uppercase':
      return input.toUpperCase();
    case 'title-case':
      return input.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    case 'camel-case': {
      const words = input.trim().split(/[\s_\-]+/);
      return words
        .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
    }
    case 'pascal-case':
      return input.trim().split(/[\s_\-]+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
    case 'snake-case':
      return input.trim()
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s\-]+/g, '_')
        .toLowerCase();
    case 'kebab-case':
      return input.trim()
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
    case 'constant-case':
      return input.trim()
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s\-]+/g, '_')
        .toUpperCase();
  }
}

// ── Single unified tool (opens the Case Converter panel) ──────────────────────

registerTool({
  id: 'text-case',
  name: 'Case Converter',
  category: 'Text',
  description: 'Convert text case: lowercase, UPPERCASE, Title Case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE',
  keywords: ['case', 'convert', 'lowercase', 'uppercase', 'title', 'camel', 'pascal', 'snake', 'kebab', 'constant', 'text'],
  outputExtension: 'txt',
  detect: isPlainText,
  execute: (input, options) => {
    const variant = (options?.variant as CaseVariant) ?? 'lowercase';
    return { output: convertCase(input, variant), outputLanguage: 'text' };
  },
});

// ── Line Sort / Dedupe ────────────────────────────────────────────────────────

registerTool({
  id: 'line-sort',
  name: 'Line Sort',
  category: 'Text',
  description: 'Sort lines alphabetically (ascending or descending)',
  keywords: ['sort', 'lines', 'alphabetical', 'order', 'text'],
  outputExtension: 'txt',
  detect: (input) => {
    const lines = input.trim().split('\n');
    return lines.length >= 3 ? 0.1 : 0;
  },
  execute: (input, options) => {
    const lines = input.split('\n');
    const desc = options?.order === 'desc';
    const sorted = [...lines].sort((a, b) =>
      desc ? b.localeCompare(a) : a.localeCompare(b)
    );
    return { output: sorted.join('\n'), outputLanguage: 'text' };
  },
});

registerTool({
  id: 'line-dedupe',
  name: 'Line Dedupe',
  category: 'Text',
  description: 'Remove duplicate lines from text',
  keywords: ['dedupe', 'duplicate', 'lines', 'unique', 'text', 'remove'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input, options) => {
    const lines = input.split('\n');
    const caseSensitive = options?.caseSensitive !== false;
    const seen = new Set<string>();
    const result = lines.filter((line) => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const removed = lines.length - result.length;
    return {
      output: result.join('\n'),
      outputLanguage: 'text',
    };
    void removed;
  },
});

registerTool({
  id: 'line-reverse',
  name: 'Line Reverse',
  category: 'Text',
  description: 'Reverse the order of lines',
  keywords: ['reverse', 'lines', 'flip', 'text', 'order'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input) => ({
    output: input.split('\n').reverse().join('\n'),
    outputLanguage: 'text',
  }),
});

// ── Text Statistics ───────────────────────────────────────────────────────────

registerTool({
  id: 'word-count',
  name: 'Word Count',
  category: 'Text',
  description: 'Count words, characters, lines, sentences, and paragraphs in text',
  keywords: ['word', 'count', 'char', 'line', 'statistics', 'stats', 'info', 'length'],
  outputExtension: 'txt',
  detect: isPlainText,
  execute: (input) => {
    const chars = input.length;
    const charsNoSpace = input.replace(/\s/g, '').length;
    const words = input.trim() === '' ? 0 : input.trim().split(/\s+/).length;
    const lines = input.split('\n').length;
    const sentences = (input.match(/[.!?]+/g) || []).length;
    const paragraphs = input.trim() === '' ? 0 : input.trim().split(/\n\s*\n/).length;
    const avgWordLen = words > 0
      ? (input.trim().split(/\s+/).reduce((s, w) => s + w.replace(/[^a-zA-Z]/g, '').length, 0) / words).toFixed(1)
      : '0';
    const lines_arr = [
      `Characters (with spaces):    ${chars}`,
      `Characters (no spaces):      ${charsNoSpace}`,
      `Words:                       ${words}`,
      `Lines:                       ${lines}`,
      `Sentences:                   ${sentences}`,
      `Paragraphs:                  ${paragraphs}`,
      `Average word length:         ${avgWordLen}`,
    ];
    return { output: lines_arr.join('\n'), outputLanguage: 'text' };
  },
});

// ── Text Reverse (characters) ─────────────────────────────────────────────────

registerTool({
  id: 'text-reverse',
  name: 'Text Reverse',
  category: 'Text',
  description: 'Reverse all characters in the text',
  keywords: ['reverse', 'text', 'string', 'flip', 'backward'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input) => ({
    output: [...input].reverse().join(''),
    outputLanguage: 'text',
  }),
});

// ── Text Trim ─────────────────────────────────────────────────────────────────

registerTool({
  id: 'text-trim',
  name: 'Text Trim',
  category: 'Text',
  description: 'Trim leading and trailing whitespace from each line',
  keywords: ['trim', 'whitespace', 'strip', 'spaces', 'text'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input) => ({
    output: input.split('\n').map((l) => l.trim()).join('\n'),
    outputLanguage: 'text',
  }),
});

// ── Remove Empty Lines ────────────────────────────────────────────────────────

registerTool({
  id: 'remove-empty-lines',
  name: 'Remove Empty Lines',
  category: 'Text',
  description: 'Remove all blank/empty lines from the text',
  keywords: ['empty', 'blank', 'lines', 'remove', 'delete', 'clean'],
  outputExtension: 'txt',
  detect: (input) => {
    const lines = input.split('\n');
    const emptyCount = lines.filter((l) => l.trim() === '').length;
    return emptyCount > 0 && lines.length > 2 ? 0.1 : 0;
  },
  execute: (input) => ({
    output: input.split('\n').filter((l) => l.trim() !== '').join('\n'),
    outputLanguage: 'text',
  }),
});

// ── Number Lines ──────────────────────────────────────────────────────────────

registerTool({
  id: 'number-lines',
  name: 'Number Lines',
  category: 'Text',
  description: 'Add line numbers to the beginning of each line',
  keywords: ['number', 'lines', 'prefix', 'enumerate', 'text'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input, options) => {
    const start = typeof options?.start === 'number' ? options.start : 1;
    const lines = input.split('\n');
    const pad = String(lines.length + start - 1).length;
    const numbered = lines.map((l, i) => `${String(i + start).padStart(pad, ' ')}: ${l}`);
    return { output: numbered.join('\n'), outputLanguage: 'text' };
  },
});

// ── Prefix / Suffix Lines ─────────────────────────────────────────────────────

registerTool({
  id: 'prefix-lines',
  name: 'Prefix Lines',
  category: 'Text',
  description: 'Add a prefix string to the beginning of each line',
  keywords: ['prefix', 'prepend', 'lines', 'add', 'text'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input, options) => {
    const prefix = typeof options?.prefix === 'string' ? options.prefix : '> ';
    return {
      output: input.split('\n').map((l) => prefix + l).join('\n'),
      outputLanguage: 'text',
    };
  },
});

registerTool({
  id: 'suffix-lines',
  name: 'Suffix Lines',
  category: 'Text',
  description: 'Add a suffix string to the end of each line',
  keywords: ['suffix', 'append', 'lines', 'add', 'text'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input, options) => {
    const suffix = typeof options?.suffix === 'string' ? options.suffix : ',';
    return {
      output: input.split('\n').map((l) => l + suffix).join('\n'),
      outputLanguage: 'text',
    };
  },
});

// ── Join Lines ────────────────────────────────────────────────────────────────

registerTool({
  id: 'join-lines',
  name: 'Join Lines',
  category: 'Text',
  description: 'Join multiple lines into a single line with a separator',
  keywords: ['join', 'lines', 'merge', 'collapse', 'text', 'separator'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input, options) => {
    const sep = typeof options?.separator === 'string' ? options.separator : ' ';
    return {
      output: input.split('\n').join(sep),
      outputLanguage: 'text',
    };
  },
});

// ── Extract Emails / URLs / Numbers ──────────────────────────────────────────

registerTool({
  id: 'extract-emails',
  name: 'Extract Emails',
  category: 'Text',
  description: 'Extract all email addresses from the text',
  keywords: ['email', 'extract', 'find', 'address', 'text'],
  outputExtension: 'txt',
  detect: (input) => /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/.test(input) ? 0.85 : 0,
  execute: (input) => {
    const matches = input.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || [];
    const unique = [...new Set(matches)];
    return {
      output: unique.length > 0
        ? `Found ${unique.length} email(s):\n\n${unique.join('\n')}`
        : 'No email addresses found.',
      outputLanguage: 'text',
    };
  },
});

registerTool({
  id: 'extract-urls',
  name: 'Extract URLs',
  category: 'Text',
  description: 'Extract all URLs from the text',
  keywords: ['url', 'link', 'extract', 'find', 'http', 'text'],
  outputExtension: 'txt',
  detect: (input) => /https?:\/\/[^\s]+/.test(input) ? 0.8 : 0,
  execute: (input) => {
    const matches = input.match(/https?:\/\/[^\s"'<>)]+/g) || [];
    const unique = [...new Set(matches)];
    return {
      output: unique.length > 0
        ? `Found ${unique.length} URL(s):\n\n${unique.join('\n')}`
        : 'No URLs found.',
      outputLanguage: 'text',
    };
  },
});

registerTool({
  id: 'extract-numbers',
  name: 'Extract Numbers',
  category: 'Text',
  description: 'Extract all numbers (integers and decimals) from the text',
  keywords: ['numbers', 'extract', 'find', 'digits', 'text'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input) => {
    const matches = input.match(/-?\d+(?:\.\d+)?/g) || [];
    return {
      output: matches.length > 0
        ? `Found ${matches.length} number(s):\n\n${matches.join('\n')}`
        : 'No numbers found.',
      outputLanguage: 'text',
    };
  },
});

// ── Extract Sections ──────────────────────────────────────────────────────────

export type ExtractedSectionLanguage = 'json' | 'xml' | 'html' | 'date' | 'url' | 'email';

export interface ExtractedSection {
  language: ExtractedSectionLanguage;
  content: string;
  start: number;   // byte offset in original input
  end: number;
  line: number;    // 1-based line where the section starts
  col: number;     // 1-based column where the section starts
}

/**
 * Scan `input` for all embedded JSON objects/arrays, XML/HTML elements,
 * ISO dates, URLs, emails and numbers.  Returns every hit with full position
 * metadata so the UI can show format · line · col · length.
 * Each language group is de-nested: only the outermost span is kept when one
 * span fully contains another of the same type.
 */
export function extractSections(input: string): ExtractedSection[] {
  // ── helpers ─────────────────────────────────────────────────────────────────
  interface RawSpan { start: number; end: number; content: string; language: ExtractedSectionLanguage }

  // Build a lookup: character index → { line, col } (both 1-based)
  const lineColOf = (() => {
    const cache = new Map<number, { line: number; col: number }>();
    return (idx: number) => {
      if (cache.has(idx)) return cache.get(idx)!;
      let line = 1, col = 1;
      for (let i = 0; i < idx && i < input.length; i++) {
        if (input[i] === '\n') { line++; col = 1; } else { col++; }
      }
      const result = { line, col };
      cache.set(idx, result);
      return result;
    };
  })();

  // Keep only outermost spans within a group (same language)
  const keepOutermost = (spans: RawSpan[]): RawSpan[] =>
    spans.filter((s) =>
      !spans.some(
        (o) => o !== s && o.start <= s.start && o.end >= s.end && (o.end - o.start) > (s.end - s.start),
      ),
    );

  const all: RawSpan[] = [];

  // ── JSON objects & arrays ───────────────────────────────────────────────────
  for (const [open, close] of [['{', '}'], ['[', ']']] as const) {
    let depth = 0, start = -1, inStr = false, esc = false;
    for (let i = 0; i < input.length; i++) {
      const ch = input[i];
      if (esc)            { esc = false; continue; }
      if (ch === '\\' && inStr) { esc = true; continue; }
      if (ch === '"')     { inStr = !inStr; continue; }
      if (inStr)          continue;
      if (ch === open)    { if (depth === 0) start = i; depth++; }
      else if (ch === close) {
        depth--;
        if (depth === 0 && start !== -1) {
          const candidate = input.slice(start, i + 1);
          try {
            JSON.parse(candidate);
            if (candidate.length > 2)
              all.push({ start, end: i + 1, content: candidate, language: 'json' });
          } catch { /* not valid JSON */ }
          start = -1;
        }
      }
    }
  }

  // ── XML / HTML elements ─────────────────────────────────────────────────────
  // HTML: void elements that never have a closing tag
  const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  const openTagRe = /<([A-Za-z][A-Za-z0-9_:.-]*)(\s[^>]*)?(\/)?>/g;
  let m: RegExpExecArray | null;
  while ((m = openTagRe.exec(input)) !== null) {
    if (m[3]) continue; // self-closing — skip
    const tag = m[1].toLowerCase();
    if (VOID.has(tag)) continue;
    const blockStart = m.index;
    const isHtml = /^(html|head|body|div|span|p|a|ul|ol|li|table|tr|td|th|thead|tbody|form|input|button|select|option|textarea|h[1-6]|header|footer|nav|main|section|article|aside|img|script|style|link|meta|title)$/i.test(m[1]);
    const lang: ExtractedSectionLanguage = isHtml ? 'html' : 'xml';
    // Balance open/close tags
    const openRe  = new RegExp(`<${m[1]}(\\s[^>]*)?>`, 'gi');
    const closeRe = new RegExp(`</${m[1]}>`, 'gi');
    openRe.lastIndex  = m.index + m[0].length;
    closeRe.lastIndex = m.index + m[0].length;
    let depth = 1, blockEnd = -1;
    while (depth > 0) {
      const nOpen  = openRe.exec(input);
      const nClose = closeRe.exec(input);
      if (!nClose) break;
      if (nOpen && nOpen.index < nClose.index) {
        depth++;
        openRe.lastIndex  = nOpen.index + nOpen[0].length;
        closeRe.lastIndex = nOpen.index + nOpen[0].length;
      } else {
        depth--;
        if (depth === 0) blockEnd = nClose.index + nClose[0].length;
        openRe.lastIndex  = nClose.index + nClose[0].length;
        closeRe.lastIndex = nClose.index + nClose[0].length;
      }
    }
    if (blockEnd > blockStart) {
      const content = input.slice(blockStart, blockEnd).trim();
      if (content.length > 3)
        all.push({ start: blockStart, end: blockEnd, content, language: lang });
      openTagRe.lastIndex = blockEnd;
    }
  }

  // ── Dates ───────────────────────────────────────────────────────────────────
  // Covers ISO 8601, RFC 2822, common US/EU named-month, ordinal, 12/24h time,
  // timezone abbreviations/offsets, and unix timestamps (10/13 digits).
  const datePatterns: RegExp[] = [
    // ISO 8601: 2024-01-15, 2024-01-15T13:00:00Z, 2024-01-15T13:00:00+05:30, etc.
    /\b\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?\b/g,

    // Named month, day-first (ordinal or plain), 4-digit year, optional 12/24h time + tz
    // e.g. "May 18th, 2026 12:01 AM PDT"  "January 1st 2024"  "Mar. 5, 2023 14:30:00"
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}(?:[,\s]+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?(?:\s+[A-Z][A-Za-z]{1,4}|[+-]\d{2}:?\d{2})?)?\b/gi,

    // Day-first named month: "18th May 2026"  "1 January 2024 09:00 AM"
    /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}(?:[,\s]+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?(?:\s+[A-Z][A-Za-z]{1,4}|[+-]\d{2}:?\d{2})?)?\b/gi,

    // RFC 2822: "Mon, 18 May 2026 12:01:00 -0700"  (weekday optional)
    /\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s+\d{2}:\d{2}(?::\d{2})?(?:\s+[+-]\d{4}|\s+[A-Z]{2,5})?\b/gi,

    // US slash/dash: MM/DD/YYYY or MM-DD-YYYY (with optional time)
    /\b(?:0?[1-9]|1[0-2])[\/\-](?:0?[1-9]|[12]\d|3[01])[\/\-](?:\d{2}|\d{4})(?:\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?(?:\s+[A-Z][A-Za-z]{1,4}|[+-]\d{2}:?\d{2})?)?\b/g,

    // EU slash/dash/dot: DD/MM/YYYY or DD.MM.YYYY (with optional time)
    /\b(?:0?[1-9]|[12]\d|3[01])[\/\-.](?:0?[1-9]|1[0-2])[\/\-.](?:\d{2}|\d{4})(?:\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?(?:\s+[A-Z][A-Za-z]{1,4}|[+-]\d{2}:?\d{2})?)?\b/g,

    // Time-only with date context: standalone "12:01 AM PDT" won't match (needs 4-digit year nearby)
    // YYYY/MM/DD (Asian-style with slashes)
    /\b\d{4}\/(?:0[1-9]|1[0-2])\/(?:0[1-9]|[12]\d|3[01])(?:\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?(?:\s+[A-Z][A-Za-z]{1,4}|[+-]\d{2}:?\d{2})?)?\b/g,

    // Unix epoch: 10-digit (seconds) or 13-digit (milliseconds)
    /\b1[3-9]\d{8}(?:\d{3})?\b/g,
  ];
  for (const re of datePatterns) {
    re.lastIndex = 0;
    let dm: RegExpExecArray | null;
    while ((dm = re.exec(input)) !== null) {
      const content = dm[0];
      // Basic sanity: reject if it clearly doesn't parse as a date
      if (content.length < 4) continue;
      all.push({ start: dm.index, end: dm.index + content.length, content, language: 'date' });
    }
  }

  // ── URLs ────────────────────────────────────────────────────────────────────
  const urlRe = /https?:\/\/[^\s<>"')\]]+/g;
  let um: RegExpExecArray | null;
  while ((um = urlRe.exec(input)) !== null) {
    all.push({ start: um.index, end: um.index + um[0].length, content: um[0], language: 'url' });
  }

  // ── Emails ──────────────────────────────────────────────────────────────────
  const emailRe = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  let em: RegExpExecArray | null;
  while ((em = emailRe.exec(input)) !== null) {
    all.push({ start: em.index, end: em.index + em[0].length, content: em[0], language: 'email' });
  }

  // ── De-nest per language, deduplicate, sort ──────────────────────────────────
  const langs: ExtractedSectionLanguage[] = ['json', 'xml', 'html', 'date', 'url', 'email'];
  const filtered: RawSpan[] = [];
  for (const lang of langs) {
    filtered.push(...keepOutermost(all.filter((s) => s.language === lang)));
  }

  // Deduplicate by start+end position
  const seen = new Set<string>();
  const unique = filtered.filter((s) => {
    const key = `${s.start}:${s.end}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  unique.sort((a, b) => a.start - b.start);

  return unique.map((s) => {
    const { line, col } = lineColOf(s.start);
    return { language: s.language, content: s.content, start: s.start, end: s.end, line, col };
  });
}

registerTool({
  id: 'extract-sections',
  name: 'Extract Sections',
  category: 'Text',
  description: 'Find and extract embedded JSON, XML, HTML, dates, URLs and emails from mixed text',
  keywords: ['extract', 'json', 'xml', 'html', 'date', 'url', 'email', 'find', 'sections', 'mixed', 'parse'],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    if (t.length < 10) return 0;
    const scores = [
      /[\[{][\s\S]{2,}[\]}]/.test(t) ? 0.5 : 0,
      /<[A-Za-z][^>]*>[\s\S]*?<\/[A-Za-z]/.test(t) ? 0.5 : 0,
      /\d{4}-\d{2}-\d{2}/.test(t) ? 0.3 : 0,
      /https?:\/\//.test(t) ? 0.3 : 0,
    ];
    const best = Math.max(...scores);
    // Only suggest if there's also surrounding text, not purely structured
    if (best > 0) {
      const stripped = t.replace(/<[^>]+>|[\[{][^}\]]*[\]}]/g, '').trim();
      if (stripped.length > 10) return Math.min(best + 0.2, 0.82);
      return best * 0.6;
    }
    return 0;
  },
  execute: (input) => {
    const sections = extractSections(input);
    if (sections.length === 0)
      return { output: 'No recognisable sections found.', outputLanguage: 'text' };
    const lines = sections.map((s) =>
      `[${s.language.toUpperCase()}] line ${s.line}, col ${s.col} · ${s.end - s.start} chars\n` +
      `${s.content.slice(0, 120)}${s.content.length > 120 ? '…' : ''}`,
    );
    return { output: `Found ${sections.length} section(s):\n\n${lines.join('\n\n---\n\n')}`, outputLanguage: 'text' };
  },
});

// ── Invert Case ───────────────────────────────────────────────────────────────

registerTool({
  id: 'invert-case',
  name: 'Invert Case',
  category: 'Text',
  description: 'Invert the case of each character (upper→lower, lower→upper)',
  keywords: ['invert', 'toggle', 'case', 'swap', 'text'],
  outputExtension: 'txt',
  detect: () => 0,
  execute: (input) => ({
    output: input.split('').map((c) =>
      c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
    ).join(''),
    outputLanguage: 'text',
  }),
});

// ── Terminal Paste Cleaner ────────────────────────────────────────────────────
//
// Text copied from a terminal often comes with artifacts that show up as
// "an empty line after every line" in an editor:
//   - CRLF / stray CR line endings, which some editors count as two breaks
//   - rows padded with spaces to the terminal width, which soft-wrap into a
//     blank-looking line whenever the editor is narrower than the terminal
//   - an actual blank line inserted between every line by some terminal/tmux setups
// Plus ANSI colour codes and the left margin that TUIs draw.

// eslint-disable-next-line no-control-regex
const ANSI_RE = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]/g;

export function cleanTerminalPaste(input: string): string {
  let lines = input
    .replace(ANSI_RE, '')
    .replace(/\r+\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t ]+$/, ''));

  // Undo "blank line after every line": when nearly all line breaks are doubled,
  // a run of k blank lines was originally floor(k / 2) blank lines.
  const nonBlank = lines.filter((l) => l !== '').length;
  let followedByBlank = 0;
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i] !== '' && lines[i + 1] === '') followedByBlank++;
  }
  if (nonBlank >= 2 && followedByBlank >= Math.max(1, (nonBlank - 1) * 0.8)) {
    const out: string[] = [];
    let run = 0;
    for (const line of [...lines, '\u0000']) {
      if (line === '') { run++; continue; }
      if (out.length > 0) for (let k = 0; k < Math.floor(run / 2); k++) out.push('');
      run = 0;
      if (line !== '\u0000') out.push(line);
    }
    lines = out;
  }

  // Remove the shared left margin.
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^[ \t]*/)![0].length);
  const margin = indents.length ? Math.min(...indents) : 0;
  if (margin > 0) lines = lines.map((l) => l.slice(margin));

  while (lines.length && lines[0] === '') lines.shift();
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n');
}

registerTool({
  id: 'terminal-paste-cleaner',
  name: 'Terminal Paste Cleaner',
  category: 'Text',
  description: 'Fix text copied from a terminal: remove doubled blank lines, width padding, CRLF, ANSI colours and left margin',
  keywords: ['terminal', 'paste', 'clean', 'blank lines', 'empty lines', 'trailing spaces', 'crlf', 'ansi', 'console', 'copy'],
  outputExtension: 'txt',
  detect: (input) => {
    if (!input.includes('\n')) return 0;
    if (/\x1b\[/.test(input) || /\r/.test(input)) return 0.65;
    const lines = input.split('\n');
    const padded = lines.filter((l) => /\S {20,}$/.test(l) || /^ {20,}$/.test(l)).length;
    return padded >= Math.max(2, lines.length * 0.5) ? 0.65 : 0;
  },
  execute: (input) => ({ output: cleanTerminalPaste(input), outputLanguage: 'text' }),
});
