'use client';

import { useMemo, useState } from 'react';
import { getToolById } from '@/lib/tools';
import type { ToolResult } from '@/lib/tools/types';

type ArticleToolPanelProps = {
  toolId: string;
  title: string;
};

const ACTION_GROUPS: Record<string, string[]> = {
  'base64-decode': ['base64-decode', 'base64-encode'],
  'base64-encode': ['base64-encode', 'base64-decode'],
  'jwt-inspector': ['jwt-inspector', 'jwt-encoder'],
  'jwt-encoder': ['jwt-encoder', 'jwt-inspector'],
  'url-decode': ['url-decode', 'url-encode', 'url-parser'],
  'url-encode': ['url-encode', 'url-decode', 'url-parser'],
  'url-parser': ['url-parser', 'url-decode', 'url-encode'],
  'html-decode': ['html-decode', 'html-encode'],
  'html-encode': ['html-encode', 'html-decode'],
  'hex-to-ascii': ['hex-to-ascii', 'ascii-to-hex'],
  'ascii-to-hex': ['ascii-to-hex', 'hex-to-ascii'],
  'base32-decode': ['base32-decode', 'base32-encode'],
  'base32-encode': ['base32-encode', 'base32-decode'],
  'lz-string-decompress': ['lz-string-decompress', 'lz-string-compress'],
  'lz-string-compress': ['lz-string-compress', 'lz-string-decompress'],
  'backslash-unescape': ['backslash-unescape', 'backslash-escape'],
  'backslash-escape': ['backslash-escape', 'backslash-unescape'],
  'json-to-yaml': ['json-to-yaml', 'yaml-to-json'],
  'yaml-to-json': ['yaml-to-json', 'json-to-yaml'],
  'json-to-xml': ['json-to-xml', 'xml-to-json'],
  'xml-to-json': ['xml-to-json', 'json-to-xml'],
  'json-escape': ['json-escape', 'json-unescape'],
  'json-unescape': ['json-unescape', 'json-escape'],
  'seconds-to-hms': ['seconds-to-hms', 'hms-to-seconds'],
  'hms-to-seconds': ['hms-to-seconds', 'seconds-to-hms'],
  'decimal-to-roman': ['decimal-to-roman', 'roman-to-decimal'],
  'roman-to-decimal': ['roman-to-decimal', 'decimal-to-roman'],
  'xml-formatter': ['xml-formatter', 'xml-minify'],
  'xml-minify': ['xml-minify', 'xml-formatter'],
  'css-beautifier': ['css-beautifier', 'css-minify'],
  'css-minify': ['css-minify', 'css-beautifier'],
  'js-beautifier': ['js-beautifier', 'js-minifier', 'js-validate'],
  'js-minifier': ['js-minifier', 'js-beautifier', 'js-validate'],
  'js-validate': ['js-validate', 'js-beautifier', 'js-minifier'],
};

const UNSUPPORTED_ARTICLE_TOOL_IDS = new Set([
  'qr-code',
  'hmac-generator',
  'regex-tester',
  'uuid-generator',
  'ulid-generator',
  'random-string',
  'random-password',
  'lorem-ipsum',
  'random-number',
  'random-ip',
  'random-mac',
  'nanoid-generator',
]);

const ALLOW_EMPTY_INPUT = new Set(['http-status-reference']);

function getArticleActions(toolId: string) {
  const ids = ACTION_GROUPS[toolId] ?? [toolId];
  return ids
    .filter((id) => !UNSUPPORTED_ARTICLE_TOOL_IDS.has(id))
    .map((id) => {
      const tool = getToolById(id);
      return tool ? { id, name: tool.name } : null;
    })
    .filter(Boolean) as Array<{ id: string; name: string }>;
}

function getPlaceholder(toolName: string) {
  if (/Base64 Decode/i.test(toolName)) return 'Paste Base64 here...';
  if (/Base64 Encode/i.test(toolName)) return 'Paste text to encode...';
  if (/JWT Encoder/i.test(toolName)) return 'Paste a JSON payload here...';
  if (/JWT/i.test(toolName)) return 'Paste a JWT token here...';
  if (/JSON/i.test(toolName)) return 'Paste JSON here...';
  if (/YAML/i.test(toolName)) return 'Paste YAML here...';
  if (/XML/i.test(toolName)) return 'Paste XML here...';
  if (/URL/i.test(toolName)) return 'Paste a URL or URL-encoded text here...';
  if (/HTML/i.test(toolName)) return 'Paste HTML here...';
  if (/CSS/i.test(toolName)) return 'Paste CSS here...';
  if (/SQL/i.test(toolName)) return 'Paste SQL here...';
  return 'Paste input here...';
}

function getResultText(result: ToolResult | null) {
  if (!result || result.outputEncoding === 'base64') return '';
  return result.output;
}

function getDetectedActionId(
  value: string,
  actions: Array<{ id: string; name: string }>,
  fallbackToolId: string,
) {
  if (!value.trim()) return fallbackToolId;

  let best: { id: string; confidence: number } | null = null;
  for (const action of actions) {
    try {
      const confidence = getToolById(action.id)?.detect(value) ?? 0;
      if (confidence > 0 && (!best || confidence > best.confidence)) {
        best = { id: action.id, confidence };
      }
    } catch {
      // Keep typing resilient if one detector rejects an intermediate value.
    }
  }
  if (best) return best.id;

  const hasBase64Pair = actions.some((action) => action.id === 'base64-decode')
    && actions.some((action) => action.id === 'base64-encode');
  if (hasBase64Pair) return 'base64-encode';

  return fallbackToolId;
}

export function ArticleToolPanel({ toolId, title }: ArticleToolPanelProps) {
  const actions = useMemo(() => getArticleActions(toolId), [toolId]);
  const [activeToolId, setActiveToolId] = useState(toolId);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ToolResult | null>(null);
  const [copied, setCopied] = useState(false);

  if (actions.length === 0) return null;

  const activeTool = actions.find((action) => action.id === activeToolId) ?? actions[0];
  const activeToolName = activeTool.name;
  const hasOutput = Boolean(result?.output || result?.error);

  const runTool = async (nextToolId = activeTool.id) => {
    const nextTool = getToolById(nextToolId);
    if (!nextTool) {
      setResult({ output: '', error: `Unknown tool: ${nextToolId}` });
      return;
    }

    setActiveToolId(nextToolId);
    setCopied(false);

    if (!input.trim() && !ALLOW_EMPTY_INPUT.has(nextToolId)) {
      setResult({ output: '', error: 'Paste input first.' });
      return;
    }

    try {
      setResult(await nextTool.execute(input));
    } catch (err) {
      setResult({
        output: '',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    setActiveToolId(getDetectedActionId(value, actions, toolId));
    setResult(null);
    setCopied(false);
  };

  const copyOutput = async () => {
    const text = getResultText(result);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <section className="article-tool-panel" data-testid="article-tool-panel" aria-label={title}>
      <div className="article-tool-header">
        <div className="article-tool-title">
          <span className="article-tool-dot" />
          <span>{activeToolName}</span>
        </div>
        <div className="article-tool-actions" role="group" aria-label="Tool actions">
          {actions.map((action) => {
            const selected = action.id === activeTool.id;
            return (
              <button
                key={action.id}
                type="button"
                className="article-tool-action"
                aria-pressed={selected}
                onClick={() => runTool(action.id)}
              >
                {action.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="article-tool-grid">
        <label className="article-tool-pane">
          <span className="article-tool-pane-label">input</span>
          <textarea
            data-testid="article-tool-input"
            value={input}
            onChange={(event) => handleInputChange(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                event.preventDefault();
                runTool();
              }
            }}
            placeholder={getPlaceholder(activeToolName)}
            spellCheck={false}
          />
        </label>

        <div className="article-tool-pane article-tool-output-pane">
          <div className="article-tool-output-header">
            <span className="article-tool-pane-label">output</span>
            <div className="article-tool-output-actions">
              <button
                type="button"
                className="article-tool-copy"
                onClick={copyOutput}
                disabled={!getResultText(result)}
              >
                {copied ? 'copied' : 'copy'}
              </button>
            </div>
          </div>

          <div
            className={`article-tool-output ${result?.error ? 'is-error' : ''}`}
            data-testid="article-tool-output"
            aria-live="polite"
          >
            {!hasOutput && (
              <span className="article-tool-empty">
                {activeToolName} output appears here.
              </span>
            )}
            {result?.error && <span>{result.error}</span>}
            {result && !result.error && result.outputEncoding === 'base64' && (
              <span>Binary output generated.</span>
            )}
            {result && !result.error && result.outputEncoding !== 'base64' && (
              <pre>{result.output}</pre>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
