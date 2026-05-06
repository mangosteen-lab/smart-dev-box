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
