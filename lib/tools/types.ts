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
  /** If 'base64', `output` is a base64-encoded binary payload (e.g. docx, zip) */
  outputEncoding?: 'base64';
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
 * A single runtime option field shown in a generator plugin's popover panel.
 * The user fills these in before clicking Generate.
 */
export type GeneratorOptionType = 'text' | 'number' | 'select' | 'toggle';

export interface GeneratorOptionBase {
  /** Unique key — passed as `options.<key>` into generateCode */
  key: string;
  /** Label shown above/beside the field */
  label: string;
  type: GeneratorOptionType;
}
export interface GeneratorOptionText extends GeneratorOptionBase {
  type: 'text';
  defaultValue: string;
  placeholder?: string;
}
export interface GeneratorOptionNumber extends GeneratorOptionBase {
  type: 'number';
  defaultValue: number;
  min: number;
  max: number;
}
export interface GeneratorOptionSelect extends GeneratorOptionBase {
  type: 'select';
  defaultValue: string;
  choices: string[];
}
export interface GeneratorOptionToggle extends GeneratorOptionBase {
  type: 'toggle';
  defaultValue: boolean;
}

export type GeneratorOption =
  | GeneratorOptionText
  | GeneratorOptionNumber
  | GeneratorOptionSelect
  | GeneratorOptionToggle;

/**
 * A user-authored generator plugin.
 * Shown in the GeneratorBar alongside the built-in generators.
 * `generateCode` — body of `(options: Record<string, unknown>) => { output, outputLanguage?, error? }`
 */
export interface GeneratorPlugin {
  type: 'generator';
  id: string;
  name: string;
  description: string;
  /** Declarative option fields rendered in the popover at runtime */
  options: GeneratorOption[];
  /** JS function body — receives `options` object, must return { output, outputLanguage?, error? } */
  generateCode: string;
  /** File extension hint for downloads */
  outputExtension?: string;
  /** ISO timestamp of last save */
  updatedAt: string;
}

/**
 * A user-authored plugin stored as plain JSON (no live function references).
 * `detectCode`  — body of `(input: string) => number`
 * `executeCode` — body of `(input: string) => { output: string; outputLanguage?: string; error?: string }`
 */
export interface DetectorPlugin {
  type?: 'detector';   // optional for backward-compat — absence means detector
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

/** Union of all plugin kinds */
export type PluginDefinition = DetectorPlugin | GeneratorPlugin;

/**
 * A plugin that has been published to the Plugin Hub.
 * Extends PluginDefinition with store-specific metadata.
 */
export type StorePlugin = PluginDefinition & {
  /** Username of the publisher — empty string when auth is disabled */
  author: string;
  /** ISO timestamp of first publish */
  publishedAt: string;
  /** Total installs / downloads */
  downloads: number;
};

/**
 * The portable file format for sharing plugins (single file = one or many plugins).
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
