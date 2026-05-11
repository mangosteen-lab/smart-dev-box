export type Category =
  | 'Encoding / Decoding'
  | 'Formatting'
  | 'Conversion'
  | 'Generation'
  | 'Inspection'
  | 'Text';

export interface ToolDefinition {
  id: string;
  name: string;
  category: Category;
  description: string;
  /** Returns a confidence score 0–1 indicating how likely this input is meant for this tool */
  detect: (input: string) => number;
  /** Executes the tool and returns the result */
  execute: (input: string, options?: Record<string, unknown>) => ToolResult | Promise<ToolResult>;
  keywords: string[];
  /** File extension hint for downloads, e.g. "json", "txt" */
  outputExtension?: string;
}

export interface ToolResult {
  output: string;
  /** Language hint for syntax highlighting (e.g. "json", "xml", "sql") */
  outputLanguage?: string;
  error?: string;
  /** If true, indicates AI was involved in routing or correction */
  aiAssisted?: boolean;
}

export interface DetectionResult {
  toolId: string;
  toolName: string;
  confidence: number;
}

export interface ToolOutput {
  toolId: string;
  toolName: string;
  result: ToolResult;
  timestamp: number;
  aiAssisted?: boolean;
}

/**
 * A user-authored plugin stored as plain JSON (no live function references).
 * `detectCode`  — body of `(input: string) => number`
 * `executeCode` — body of `(input: string) => { output: string; outputLanguage?: string; error?: string }`
 */
export interface PluginDefinition {
  /** Must be unique; user-defined, e.g. "my-chat-aba-parser" */
  id: string;
  name: string;
  category: Category;
  description: string;
  keywords: string[];
  outputExtension?: string;
  /** JS function body — receives `input` string, must return a number 0–1 */
  detectCode: string;
  /** JS function body — receives `input` string, must return { output, outputLanguage?, error? } */
  executeCode: string;
  /** ISO timestamp of last save */
  updatedAt: string;
}

/**
 * A plugin that has been published to the Plugin Store (KV-backed).
 * Extends PluginDefinition with store-specific metadata.
 */
export interface StorePlugin extends PluginDefinition {
  /** Username of the publisher — empty string when auth is disabled */
  author: string;
  /** ISO timestamp of first publish */
  publishedAt: string;
  /** ISO timestamp of last update */
  updatedAt: string;
  /** Total installs / downloads */
  downloads: number;
}

/**
 * The portable file format for sharing plugins (single file = one or many plugins).
 * Intended for community repos like smartdevbox-plugins.
 *
 * File extension convention: `.plugin.json`
 * Single plugin : { schemaVersion, plugin }
 * Plugin pack   : { schemaVersion, plugins }
 */
export interface PluginBundle {
  /** Semver string — allows future format migrations */
  schemaVersion: '1.0';
  /** Human-readable description of this bundle / pack */
  description?: string;
  /** Author or repo URL */
  author?: string;
  /** Single plugin (mutually exclusive with `plugins`) */
  plugin?: PluginDefinition;
  /** Multiple plugins in one file */
  plugins?: PluginDefinition[];
}
