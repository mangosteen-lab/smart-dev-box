import type { Category, DetectionResult, ToolDefinition, ToolResult } from './types';

const registry: Map<string, ToolDefinition> = new Map();

export function registerTool(tool: ToolDefinition) {
  registry.set(tool.id, tool);
}

export function unregisterTool(id: string) {
  registry.delete(id);
}

export function getToolById(id: string): ToolDefinition | undefined {
  return registry.get(id);
}

export function getAllTools(): ToolDefinition[] {
  return Array.from(registry.values());
}

export function getToolsByCategory(): Record<Category, ToolDefinition[]> {
  const result: Partial<Record<Category, ToolDefinition[]>> = {};
  for (const tool of registry.values()) {
    if (!result[tool.category]) result[tool.category] = [];
    result[tool.category]!.push(tool);
  }
  return result as Record<Category, ToolDefinition[]>;
}

export function runDetection(input: string): DetectionResult[] {
  if (!input.trim()) return [];
  const results: DetectionResult[] = [];
  for (const tool of registry.values()) {
    try {
      const confidence = tool.detect(input);
      if (confidence > 0) {
        results.push({ toolId: tool.id, toolName: tool.name, confidence });
      }
    } catch {
      // ignore errors from individual detectors
    }
  }
  return results.sort((a, b) => b.confidence - a.confidence);
}

const GENERATOR_TOOL_IDS = new Set([
  'uuid-generator',
  'ulid-generator',
  'random-string',
  'lorem-ipsum',
  'hash-generator',
  'qr-code',
  'hmac-generator',
  'totp-generator',
  'nanoid-generator',
]);

export async function executeTool(
  toolId: string,
  input: string,
  options?: Record<string, unknown>
): Promise<ToolResult> {
  const tool = registry.get(toolId);
  if (!tool) {
    return { output: '', error: `Unknown tool: ${toolId}` };
  }
  // Generator tools don't require input — skip the empty-input guard for them.
  if (!input.trim() && !GENERATOR_TOOL_IDS.has(toolId)) {
    return { output: '', error: undefined };
  }
  try {
    return await tool.execute(input, options);
  } catch (err) {
    return {
      output: '',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
