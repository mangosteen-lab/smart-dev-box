import { registerTool } from '../registry';
import { normalizeSingleQuoteJson } from '../utils';
registerTool({
  id: 'json-formatter',
  name: 'JSON Formatter',
  category: 'Formatting',
  description: 'Pretty-print and validate JSON with configurable indentation',
  keywords: ['json', 'format', 'pretty', 'beautify', 'lint'],
  outputExtension: 'json',
  detect: (input) => {
    const t = input.trim();
    if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
      try { JSON.parse(t); return 0.95; } catch { /* fall through */ }
      // Single-quoted JSON
      if (normalizeSingleQuoteJson(t) !== null) return 0.9;
      return 0.6;
    }
    return 0;
  },
  execute: (input, options) => {
    try {
      const indent = typeof options?.indent === 'number' ? options.indent : 2;
      const t = input.trim();
      let toParse = t;
      // Try to normalize single-quoted JSON before parsing
      const normalized = normalizeSingleQuoteJson(t);
      if (normalized !== null) toParse = normalized;
      const parsed = JSON.parse(toParse);
      return { output: JSON.stringify(parsed, null, indent), outputLanguage: 'json' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Invalid JSON' };
    }
  },
});

registerTool({
  id: 'xml-formatter',
  name: 'XML Formatter',
  category: 'Formatting',
  description: 'Pretty-print and validate XML',
  keywords: ['xml', 'format', 'pretty', 'beautify', 'html'],
  outputExtension: 'xml',
  detect: (input) => {
    const t = input.trim();
    return t.startsWith('<') && t.includes('>') ? 0.85 : 0;
  },
  execute: (input) => {
    try {
      const output = formatXml(input);
      return { output, outputLanguage: 'xml' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Invalid XML' };
    }
  },
});

function formatXml(xml: string): string {
  let formatted = '';
  let indent = 0;
  const tab = '  ';
  // Collapse whitespace between tags, then split into one node per line
  const nodes = xml.replace(/>\s*</g, '>\n<').split('\n').map(n => n.trim()).filter(Boolean);

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    // Closing tag — decrease indent before printing
    if (/^<\/\w/.test(node)) indent -= 1;

    // Peek ahead: if this is a bare open tag and the very next node is its matching close tag,
    // collapse them into a single <tag></tag> line (handles whitespace-only / empty elements)
    const openTagMatch = node.match(/^<(\w[^>]*)>$/);
    if (openTagMatch) {
      const tagName = openTagMatch[1].split(/[\s/]/)[0];
      const next = nodes[i + 1];
      if (next === `</${tagName}>`) {
        formatted += tab.repeat(Math.max(0, indent)) + `<${openTagMatch[1]}></${tagName}>\n`;
        i += 1; // consume the close tag
        continue;
      }
    }

    formatted += tab.repeat(Math.max(0, indent)) + node + '\n';

    // Increase indent only for a pure opening tag (no self-close, no inline close tag on same line)
    const isOpenTag   = /^<[^/?!][^>]*>/.test(node);
    const isSelfClose = /\/>$/.test(node) || /^<[?!]/.test(node);
    const hasCloseTag = /<\/\w/.test(node);
    if (isOpenTag && !isSelfClose && !hasCloseTag) {
      indent += 1;
    }
  }
  return formatted.trim();
}

registerTool({
  id: 'sql-formatter',
  name: 'SQL Formatter',
  category: 'Formatting',
  description: 'Format and beautify SQL queries',
  keywords: ['sql', 'format', 'query', 'database', 'beautify'],
  outputExtension: 'sql',
  detect: (input) => {
    const upper = input.toUpperCase();
    const keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER'];
    const matches = keywords.filter((k) => upper.includes(k)).length;
    return matches >= 1 ? 0.7 : 0;
  },
  execute: async (input, options) => {
    const { format } = await import('sql-formatter');
    const forced = typeof options?.dialect === 'string' ? (options.dialect as SqlDialect) : undefined;
    const candidates = forced ? [forced] : sqlDialectCandidates(input);
    let firstError: unknown;
    for (const language of candidates) {
      try {
        return { output: format(input, { language, tabWidth: 2 }), outputLanguage: 'sql' };
      } catch (err) {
        firstError ??= err;
      }
    }
    const msg = firstError instanceof Error ? firstError.message : 'SQL format failed';
    return { output: '', error: `${msg} (tried dialects: ${candidates.join(', ')})` };
  },
});

type SqlDialect =
  | 'sql' | 'postgresql' | 'mysql' | 'mariadb' | 'tsql' | 'plsql'
  | 'bigquery' | 'sqlite' | 'snowflake' | 'redshift' | 'spark' | 'trino';

/** Dialect-specific syntax markers, checked against the SQL with strings and comments removed. */
const SQL_DIALECT_HINTS: [SqlDialect, RegExp[]][] = [
  ['postgresql', [/#>>?/, /->>?/, /::\s*[a-z_]/i, /\bILIKE\b/i, /\bDISTINCT\s+ON\b/i, /\bjsonb\b/i, /\$\d+/, /@>|<@/, /\bRETURNING\b/i, /\bSERIAL\b/i]],
  ['tsql', [/\bTOP\s*\(?\d/i, /\[[\w ]+\]\.\[?/, /\bNVARCHAR\b/i, /\bIDENTITY\s*\(/i, /^\s*GO\s*$/im, /@@?\w+/, /\bGETDATE\s*\(/i]],
  ['plsql', [/\bROWNUM\b/i, /\bNVL\s*\(/i, /\bFROM\s+DUAL\b/i, /\bVARCHAR2\b/i, /\bCONNECT\s+BY\b/i, /\bSYSDATE\b/i]],
  ['bigquery', [/`[\w-]+\.[\w-]+\.[\w-]+`/, /\bSTRUCT\s*</i, /\bSAFE_CAST\s*\(/i, /\bUNNEST\s*\(/i]],
  ['snowflake', [/\bLATERAL\s+FLATTEN\b/i, /\bVARIANT\b/i, /\bQUALIFY\b/i]],
  ['sqlite', [/\bAUTOINCREMENT\b/i, /\bPRAGMA\b/i]],
  ['mysql', [/`\w+`/, /\bAUTO_INCREMENT\b/i, /\bENGINE\s*=/i, /\bLIMIT\s+\d+\s*,\s*\d+/i]],
];

/** Fallback order when hints don't settle it. MySQL is last because it treats `#` as a comment. */
const SQL_FALLBACK_ORDER: SqlDialect[] = ['sql', 'postgresql', 'tsql', 'plsql', 'bigquery', 'snowflake', 'sqlite', 'mysql'];

/** Ranks dialects by how many of their markers appear in the input, then appends the fallbacks. */
export function sqlDialectCandidates(input: string): SqlDialect[] {
  const code = input
    .replace(/'(?:[^']|'')*'/g, "''")
    .replace(/--[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  const scored = SQL_DIALECT_HINTS
    .map(([dialect, patterns]) => ({ dialect, score: patterns.filter((p) => p.test(code)).length }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.dialect);
  return [...new Set([...scored, ...SQL_FALLBACK_ORDER])];
}

registerTool({
  id: 'css-beautifier',
  name: 'CSS Beautifier',
  category: 'Formatting',
  description: 'Format and beautify CSS',
  keywords: ['css', 'format', 'beautify', 'style', 'stylesheet'],
  outputExtension: 'css',
  detect: (input) => {
    return /[{};]/.test(input) && /:\s*[^;{]+;/.test(input) ? 0.75 : 0;
  },
  execute: async (input) => {
    try {
      const prettier = await import('prettier/standalone');
      const cssPlugin = await import('prettier/plugins/postcss');
      const output = await prettier.format(input, {
        parser: 'css',
        plugins: [cssPlugin],
        tabWidth: 2,
      });
      return { output, outputLanguage: 'css' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'CSS format failed' };
    }
  },
});

registerTool({
  id: 'html-beautifier',
  name: 'HTML Beautifier',
  category: 'Formatting',
  description: 'Format and beautify HTML markup',
  keywords: ['html', 'format', 'beautify', 'markup'],
  outputExtension: 'html',
  detect: (input) => {
    const t = input.trim();
    return /<html|<!DOCTYPE|<body|<div|<p\s|<span/i.test(t) ? 0.8 : 0;
  },
  execute: async (input) => {
    try {
      const prettier = await import('prettier/standalone');
      const htmlPlugin = await import('prettier/plugins/html');
      const output = await prettier.format(input, {
        parser: 'html',
        plugins: [htmlPlugin],
        tabWidth: 2,
      });
      return { output, outputLanguage: 'html' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'HTML format failed' };
    }
  },
});

// ── JS Beautify / Minify ──────────────────────────────────────────────────────

registerTool({
  id: 'js-beautifier',
  name: 'JS Beautifier',
  category: 'Formatting',
  description: 'Format and beautify JavaScript / TypeScript code',
  keywords: ['javascript', 'js', 'typescript', 'ts', 'format', 'beautify', 'prettier'],
  outputExtension: 'js',
  detect: (input) => {
    const t = input.trim();
    if (/\b(function|const|let|var|=>|import|export|class|return)\b/.test(t) && !t.startsWith('<')) return 0.6;
    return 0;
  },
  execute: async (input) => {
    try {
      const prettier = await import('prettier/standalone');
      const babelPlugin = await import('prettier/plugins/babel');
      const estreePlugin = await import('prettier/plugins/estree');
      const output = await prettier.format(input, {
        parser: 'babel',
        plugins: [babelPlugin, estreePlugin],
        tabWidth: 2,
        semi: true,
        singleQuote: true,
      });
      return { output, outputLanguage: 'javascript' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'JS format failed' };
    }
  },
});

registerTool({
  id: 'js-minifier',
  name: 'JS Minifier',
  category: 'Formatting',
  description: 'Minify JavaScript code by removing whitespace and comments',
  keywords: ['javascript', 'js', 'minify', 'compress', 'uglify'],
  outputExtension: 'min.js',
  detect: () => 0,
  execute: (input) => {
    try {
      // Simple minification: strip comments and collapse whitespace
      const out = input
        // Remove single-line comments (not inside strings)
        .replace(/\/\/[^\n]*/g, '')
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Collapse whitespace sequences to single space
        .replace(/\s+/g, ' ')
        // Remove spaces around operators and punctuation
        .replace(/\s*([{};,=+\-*/<>!&|?:()\[\]])\s*/g, '$1')
        .trim();
      return { output: out, outputLanguage: 'javascript' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Minification failed' };
    }
  },
});

registerTool({
  id: 'markdown-preview',
  name: 'Markdown Preview',
  category: 'Formatting',
  description: 'Live preview Markdown with split source and rendered view',
  keywords: ['markdown', 'md', 'preview', 'render', 'format'],
  outputExtension: 'md',
  detect: (input) => {
    const t = input.trim();
    const hasMarkdown = /^#{1,6} /m.test(t) || /\*\*/.test(t) || /\[.+\]\(.+\)/.test(t) || /^- /m.test(t) || /^```/.test(t);
    return hasMarkdown ? 0.75 : 0;
  },
  execute: (input) => ({ output: input, outputLanguage: 'markdown' }),
});

// ── JSON Validate ─────────────────────────────────────────────────────────────

registerTool({
  id: 'json-validate',
  name: 'JSON Validate',
  category: 'Formatting',
  description: 'Validate JSON and report errors with line/column information',
  keywords: ['json', 'validate', 'lint', 'check', 'verify', 'error'],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) return 0.6;
    return 0;
  },
  execute: (input) => {
    try {
      JSON.parse(input);
      const size = new TextEncoder().encode(input).length;
      return {
        output: `✓ Valid JSON\n\nSize: ${size} bytes\nLength: ${input.length} characters`,
        outputLanguage: 'text',
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON';
      return { output: `✗ Invalid JSON\n\n${msg}`, outputLanguage: 'text' };
    }
  },
});

// ── JS Validate ───────────────────────────────────────────────────────────────

registerTool({
  id: 'js-validate',
  name: 'JS Validate',
  category: 'Formatting',
  description: 'Validate JavaScript syntax and report errors',
  keywords: ['javascript', 'js', 'validate', 'syntax', 'lint', 'check', 'javascript validator', 'js validator', 'validate javascript syntax', 'validate javascript online', 'js checker', 'javascript code checker', 'syntax checker js', 'check javascript online', 'verify javascript online', 'javascript mistake finder', 'javascript validation online', 'syntax validator'],
  outputExtension: 'txt',
  detect: (input) => {
    const t = input.trim();
    if (/\b(function|const|let|var|=>|import|export|class|return)\b/.test(t) && !t.startsWith('<')) return 0.3;
    return 0;
  },
  execute: (input) => {
    try {
      // Use the Function constructor as a lightweight syntax check
      // eslint-disable-next-line no-new-func
      new Function(input);
      return {
        output: `✓ Valid JavaScript syntax\n\nSize: ${input.length} characters`,
        outputLanguage: 'text',
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Syntax error';
      return { output: `✗ JavaScript syntax error\n\n${msg}`, outputLanguage: 'text' };
    }
  },
});

// ── XML Minify ────────────────────────────────────────────────────────────────

registerTool({
  id: 'xml-minify',
  name: 'XML Minify',
  category: 'Formatting',
  description: 'Minify XML by removing whitespace between tags',
  keywords: ['xml', 'minify', 'compress', 'minimize', 'whitespace'],
  outputExtension: 'xml',
  detect: () => 0,
  execute: (input) => {
    try {
      const t = input.trim();
      if (!t.startsWith('<')) return { output: '', error: 'Input does not appear to be XML' };
      const minified = t
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .replace(/\n/g, '');
      return { output: minified, outputLanguage: 'xml' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'XML minify failed' };
    }
  },
});

// ── CSS Minify ────────────────────────────────────────────────────────────────

registerTool({
  id: 'css-minify',
  name: 'CSS Minify',
  category: 'Formatting',
  description: 'Minify CSS by removing whitespace and comments',
  keywords: ['css', 'minify', 'compress', 'minimize', 'stylesheet'],
  outputExtension: 'min.css',
  detect: () => 0,
  execute: (input) => {
    try {
      const minified = input
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Collapse whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around punctuation
        .replace(/\s*([{};:,>~+])\s*/g, '$1')
        // Remove last semicolon before closing brace
        .replace(/;}/g, '}')
        .trim();
      return { output: minified, outputLanguage: 'css' };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'CSS minify failed' };
    }
  },
});
