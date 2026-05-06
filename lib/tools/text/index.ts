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
