import { registerTool } from '../registry';

// Helper: detect if the input is multi-word text (not code, not JSON)
function isPlainText(input: string): number {
  const t = input.trim();
  if (!t || t.length < 2) return 0;
  // Exclude JSON/XML/code-like inputs
  if (t.startsWith('{') || t.startsWith('[') || t.startsWith('<')) return 0;
  return 0.3;
}

registerTool({
  id: 'lowercase',
  name: 'Lowercase',
  category: 'Text',
  description: 'Convert text to lowercase',
  keywords: ['lowercase', 'lower', 'case', 'convert', 'text'],
  outputExtension: 'txt',
  detect: isPlainText,
  execute: (input) => ({
    output: input.toLowerCase(),
    outputLanguage: 'text',
  }),
});

registerTool({
  id: 'uppercase',
  name: 'Uppercase',
  category: 'Text',
  description: 'Convert text to UPPERCASE',
  keywords: ['uppercase', 'upper', 'case', 'convert', 'text'],
  outputExtension: 'txt',
  detect: isPlainText,
  execute: (input) => ({
    output: input.toUpperCase(),
    outputLanguage: 'text',
  }),
});

registerTool({
  id: 'title-case',
  name: 'Title Case',
  category: 'Text',
  description: 'Convert text to Title Case',
  keywords: ['title', 'case', 'convert', 'text', 'capitalize'],
  outputExtension: 'txt',
  detect: isPlainText,
  execute: (input) => ({
    output: input.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
    outputLanguage: 'text',
  }),
});

registerTool({
  id: 'camel-case',
  name: 'camelCase',
  category: 'Text',
  description: 'Convert text to camelCase',
  keywords: ['camel', 'case', 'camelcase', 'convert', 'text'],
  outputExtension: 'txt',
  detect: isPlainText,
  execute: (input) => {
    const words = input.trim().split(/[\s_\-]+/);
    const result = words
      .map((w, i) =>
        i === 0
          ? w.toLowerCase()
          : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      )
      .join('');
    return { output: result, outputLanguage: 'text' };
  },
});

registerTool({
  id: 'pascal-case',
  name: 'PascalCase',
  category: 'Text',
  description: 'Convert text to PascalCase',
  keywords: ['pascal', 'case', 'pascalcase', 'convert', 'text'],
  outputExtension: 'txt',
  detect: isPlainText,
  execute: (input) => {
    const words = input.trim().split(/[\s_\-]+/);
    const result = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
    return { output: result, outputLanguage: 'text' };
  },
});

registerTool({
  id: 'snake-case',
  name: 'snake_case',
  category: 'Text',
  description: 'Convert text to snake_case',
  keywords: ['snake', 'case', 'snake_case', 'convert', 'text'],
  outputExtension: 'txt',
  detect: isPlainText,
  execute: (input) => {
    const result = input
      .trim()
      // Insert underscore between camelCase boundaries
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      // Replace spaces/hyphens with underscore
      .replace(/[\s\-]+/g, '_')
      .toLowerCase();
    return { output: result, outputLanguage: 'text' };
  },
});

registerTool({
  id: 'kebab-case',
  name: 'kebab-case',
  category: 'Text',
  description: 'Convert text to kebab-case',
  keywords: ['kebab', 'case', 'kebab-case', 'convert', 'text', 'slug'],
  outputExtension: 'txt',
  detect: isPlainText,
  execute: (input) => {
    const result = input
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
    return { output: result, outputLanguage: 'text' };
  },
});

registerTool({
  id: 'constant-case',
  name: 'CONSTANT_CASE',
  category: 'Text',
  description: 'Convert text to CONSTANT_CASE',
  keywords: ['constant', 'case', 'screaming', 'snake', 'convert', 'text'],
  outputExtension: 'txt',
  detect: isPlainText,
  execute: (input) => {
    const result = input
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s\-]+/g, '_')
      .toUpperCase();
    return { output: result, outputLanguage: 'text' };
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

// ── Extract Sections (XML / JSON / SQL) ───────────────────────────────────────

/**
 * Shared extraction logic used by both the tool's detect/execute and the
 * ExtractorPanel component (which imports this helper directly).
 */
export interface ExtractedSection {
  language: 'json' | 'xml' | 'sql';
  content: string;
  index: number; // 1-based position among all sections
}

export function extractSections(input: string): ExtractedSection[] {
  // Represents a raw candidate span before language tagging
  interface Span { start: number; end: number; content: string; language: ExtractedSection['language'] }

  // Remove spans that are fully contained within another span of the same language.
  // This ensures we keep only the outermost (largest) matches.
  const keepOutermost = (spans: Span[]): Span[] => {
    return spans.filter((s) =>
      !spans.some(
        (other) =>
          other !== s &&
          other.start <= s.start &&
          other.end >= s.end &&
          (other.end - other.start) > (s.end - s.start),
      ),
    );
  };

  const allSpans: Span[] = [];

  // ── XML ──────────────────────────────────────────────────────────────────────
  // Walk the input character-by-character to find the outermost XML root elements.
  // Strategy: find each top-level opening tag, then scan forward for its matching
  // closing tag at depth 0. This naturally gives the largest possible XML block.
  const xmlOpenRe = /<([A-Za-z_][A-Za-z0-9_:.-]*)(\s[^>]*)?(\/)?>/g;
  let xm: RegExpExecArray | null;
  while ((xm = xmlOpenRe.exec(input)) !== null) {
    if (xm[3]) continue; // self-closing tag — skip
    const tagName = xm[1];
    const blockStart = xm.index;
    // Scan forward finding matching close tag, tracking depth
    const openRe = new RegExp(`<${tagName}(\\s[^>]*)?>`, 'g');
    const closeRe = new RegExp(`</${tagName}>`, 'g');
    openRe.lastIndex = xm.index + xm[0].length;
    closeRe.lastIndex = xm.index + xm[0].length;
    let depth = 1;
    let blockEnd = -1;
    while (depth > 0) {
      const nextOpen = openRe.exec(input);
      const nextClose = closeRe.exec(input);
      if (!nextClose) break; // unbalanced
      if (nextOpen && nextOpen.index < nextClose.index) {
        depth++;
        openRe.lastIndex = nextOpen.index + nextOpen[0].length;
        closeRe.lastIndex = nextOpen.index + nextOpen[0].length;
      } else {
        depth--;
        if (depth === 0) blockEnd = nextClose.index + nextClose[0].length;
        openRe.lastIndex = nextClose.index + nextClose[0].length;
        closeRe.lastIndex = nextClose.index + nextClose[0].length;
      }
    }
    if (blockEnd > blockStart) {
      const content = input.slice(blockStart, blockEnd).trim();
      if (content.length > 5) {
        allSpans.push({ start: blockStart, end: blockEnd, content, language: 'xml' });
        // Skip past this entire block so we don't re-enter nested tags
        xmlOpenRe.lastIndex = blockEnd;
      }
    }
  }

  // ── JSON ─────────────────────────────────────────────────────────────────────
  // Walk the string once, recording every top-level balanced { } and [ ] span,
  // then keep only those that are valid JSON. Inner spans are filtered out by
  // keepOutermost — so {"a":{"b":1}} yields only the outer object.
  const jsonRawSpans: Span[] = [];
  for (const [open, close] of [['{', '}'], ['[', ']']] as const) {
    let depth = 0;
    let start = -1;
    let inString = false;
    let escape = false;
    for (let i = 0; i < input.length; i++) {
      const ch = input[i];
      if (escape) { escape = false; continue; }
      if (ch === '\\' && inString) { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === open) {
        if (depth === 0) start = i;
        depth++;
      } else if (ch === close) {
        depth--;
        if (depth === 0 && start !== -1) {
          const candidate = input.slice(start, i + 1);
          try {
            JSON.parse(candidate);
            if (candidate.length > 2) {
              jsonRawSpans.push({ start, end: i + 1, content: candidate, language: 'json' });
            }
          } catch { /* not valid JSON */ }
          start = -1;
        }
      }
    }
  }
  allSpans.push(...jsonRawSpans);

  // ── SQL ───────────────────────────────────────────────────────────────────────
  // Match each SQL keyword and extend greedily to the next semicolon (or end of
  // string), so multi-clause statements are captured whole.
  const sqlKeywords = /\b(SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+(?:TABLE|INDEX|VIEW|DATABASE)|DROP\s+(?:TABLE|INDEX|VIEW|DATABASE)|ALTER\s+TABLE)\b/gi;
  let sm: RegExpExecArray | null;
  while ((sm = sqlKeywords.exec(input)) !== null) {
    const blockStart = sm.index;
    // Extend to the next semicolon; if none found, take to end of string
    const semiPos = input.indexOf(';', blockStart);
    const blockEnd = semiPos !== -1 ? semiPos + 1 : input.length;
    const content = input.slice(blockStart, blockEnd).trim();
    if (content.length > 5) {
      allSpans.push({ start: blockStart, end: blockEnd, content, language: 'sql' });
      // Advance past this block so overlapping SQL keywords aren't double-matched
      sqlKeywords.lastIndex = blockEnd;
    }
  }

  // ── Post-processing ───────────────────────────────────────────────────────────
  // For each language separately, discard spans that are contained inside a larger
  // same-language span (keeps only the outermost / biggest blocks).
  const languages: ExtractedSection['language'][] = ['xml', 'json', 'sql'];
  const filtered: Span[] = [];
  for (const lang of languages) {
    const group = allSpans.filter((s) => s.language === lang);
    filtered.push(...keepOutermost(group));
  }

  // Deduplicate by content then sort by position in the original input
  const seen = new Set<string>();
  const unique = filtered.filter((s) => {
    const key = `${s.language}:${s.content}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  unique.sort((a, b) => a.start - b.start);

  return unique.map((s, i) => ({ language: s.language, content: s.content, index: i + 1 }));
}

registerTool({
  id: 'extract-sections',
  name: 'Extract Sections',
  category: 'Text',
  description: 'Extract all XML, JSON, and SQL sections from mixed text for individual inspection',
  keywords: ['extract', 'xml', 'json', 'sql', 'sections', 'parse', 'find', 'mixed', 'log', 'text'],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    if (t.length < 10) return 0;
    const hasXml = /<[A-Za-z_][^>]*>[\s\S]*?<\/[A-Za-z_]/.test(t);
    const hasJson = /[\[{][\s\S]*?[\]}]/.test(t);
    const hasSql = /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i.test(t);
    const typeCount = (hasXml ? 1 : 0) + (hasJson ? 1 : 0) + (hasSql ? 1 : 0);
    // Boost confidence if input is clearly mixed (multiple types or has surrounding prose)
    if (typeCount >= 2) return 0.82;
    if (typeCount === 1) {
      // Only suggest if there's also surrounding plain text (not purely structured)
      const surroundingText = t.replace(/<[\s\S]*?>|[\[{][\s\S]*?[\]}]/g, '').trim();
      if (surroundingText.length > 20) return 0.72;
    }
    return 0;
  },
  execute: (input) => {
    const sections = extractSections(input);
    if (sections.length === 0) {
      return { output: 'No XML, JSON, or SQL sections found.', outputLanguage: 'text' };
    }
    const summary = sections
      .map((s) => `[${s.index}] ${s.language.toUpperCase()} (${s.content.length} chars)\n${s.content.slice(0, 120)}${s.content.length > 120 ? '…' : ''}`)
      .join('\n\n---\n\n');
    return {
      output: `Found ${sections.length} section(s):\n\n${summary}`,
      outputLanguage: 'text',
    };
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
