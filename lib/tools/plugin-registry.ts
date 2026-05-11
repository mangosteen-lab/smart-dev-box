/**
 * Plugin registry — converts user-authored PluginDefinitions (stored as JSON
 * in localStorage via Zustand) into live ToolDefinitions and registers them.
 *
 * Each plugin's detectCode / executeCode is compiled once with `new Function()`
 * and wrapped in try/catch so a buggy plugin can never crash the whole app.
 */

import { registerTool, unregisterTool } from './registry';
import type { PluginBundle, PluginDefinition, ToolDefinition } from './types';

/** IDs of currently-loaded plugins, so we can unregister on reload. */
const loadedPluginIds = new Set<string>();

/**
 * Compile a PluginDefinition into a ToolDefinition and register it.
 * Returns an error string if compilation fails, or null on success.
 */
export function compilePlugin(plugin: PluginDefinition): string | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const detectFn = new Function('input', plugin.detectCode) as (input: string) => number;
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const executeFn = new Function('input', plugin.executeCode) as (input: string) => { output: string; outputLanguage?: string; error?: string };

    const tool: ToolDefinition = {
      id: plugin.id,
      name: plugin.name,
      category: plugin.category,
      description: plugin.description,
      keywords: plugin.keywords,
      outputExtension: plugin.outputExtension,
      detect: (input) => {
        try { return detectFn(input); }
        catch { return 0; }
      },
      execute: (input) => {
        try { return executeFn(input); }
        catch (err) {
          return { output: '', error: err instanceof Error ? err.message : String(err) };
        }
      },
    };

    registerTool(tool);
    loadedPluginIds.add(plugin.id);
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

/** Load (or reload) a full list of plugins, unregistering stale ones first. */
export function loadPlugins(plugins: PluginDefinition[]): void {
  // Unregister plugins that are no longer in the list
  for (const id of loadedPluginIds) {
    if (!plugins.find((p) => p.id === id)) {
      unregisterTool(id);
      loadedPluginIds.delete(id);
    }
  }

  for (const plugin of plugins) {
    // Always re-register (handles edits)
    if (loadedPluginIds.has(plugin.id)) {
      unregisterTool(plugin.id);
      loadedPluginIds.delete(plugin.id);
    }
    compilePlugin(plugin);
  }
}

// ── Export ────────────────────────────────────────────────────────────────────

/**
 * Serialise one or more plugins into a PluginBundle JSON string and trigger a
 * browser file download.  Filename for a single plugin: `<id>.plugin.json`.
 * Filename for a pack: `smartdevbox-plugins.json`.
 */
export function exportPluginsAsFile(plugins: PluginDefinition[], packName?: string): void {
  const isSingle = plugins.length === 1 && !packName;
  const bundle: PluginBundle = isSingle
    ? { schemaVersion: '1.0', plugin: plugins[0] }
    : { schemaVersion: '1.0', plugins };

  const json = JSON.stringify(bundle, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = isSingle ? `${plugins[0].id}.plugin.json` : `${packName ?? 'smartdevbox-plugins'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Import ────────────────────────────────────────────────────────────────────

export interface ImportResult {
  imported: PluginDefinition[];
  /** Per-plugin compile errors keyed by plugin id */
  errors: Record<string, string>;
  /** Top-level parse / schema errors */
  fatalError?: string;
}

/**
 * Parse and validate a raw JSON string as a PluginBundle.
 * Validates required fields on every plugin before attempting to compile.
 * Does NOT register — call loadPlugins() with the returned `imported` list.
 */
export function parsePluginBundle(raw: string): ImportResult {
  let bundle: unknown;
  try {
    bundle = JSON.parse(raw);
  } catch {
    return { imported: [], errors: {}, fatalError: 'Invalid JSON — could not parse file.' };
  }

  if (typeof bundle !== 'object' || bundle === null) {
    return { imported: [], errors: {}, fatalError: 'File must be a JSON object.' };
  }

  const b = bundle as Record<string, unknown>;
  if (b.schemaVersion !== '1.0') {
    return { imported: [], errors: {}, fatalError: `Unsupported schemaVersion "${b.schemaVersion}". Expected "1.0".` };
  }

  // Normalise single / pack format into a flat list
  const candidates: unknown[] = [];
  if (b.plugin) candidates.push(b.plugin);
  if (Array.isArray(b.plugins)) candidates.push(...b.plugins);

  if (candidates.length === 0) {
    return { imported: [], errors: {}, fatalError: 'Bundle contains no plugins (need "plugin" or "plugins" field).' };
  }

  const imported: PluginDefinition[] = [];
  const errors: Record<string, string> = {};

  for (const candidate of candidates) {
    if (typeof candidate !== 'object' || candidate === null) { errors['?'] = 'Plugin entry is not an object.'; continue; }
    const p = candidate as Record<string, unknown>;
    const id = typeof p.id === 'string' ? p.id : undefined;
    const label = id ?? '(unknown)';

    const missing = (['id', 'name', 'category', 'detectCode', 'executeCode'] as const)
      .filter((k) => typeof p[k] !== 'string');
    if (missing.length > 0) {
      errors[label] = `Missing required fields: ${missing.join(', ')}`;
      continue;
    }

    const plugin: PluginDefinition = {
      id: p.id as string,
      name: p.name as string,
      category: p.category as PluginDefinition['category'],
      description: typeof p.description === 'string' ? p.description : '',
      keywords: Array.isArray(p.keywords) ? (p.keywords as string[]) : [],
      outputExtension: typeof p.outputExtension === 'string' ? p.outputExtension : 'txt',
      detectCode: p.detectCode as string,
      executeCode: p.executeCode as string,
      updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : new Date().toISOString(),
    };

    // Dry-run compile to catch syntax errors before saving
    const err = compilePlugin(plugin);
    if (err) {
      errors[plugin.id] = err;
      // Clean up the registration attempt on failure
      unregisterTool(plugin.id);
      loadedPluginIds.delete(plugin.id);
    } else {
      imported.push(plugin);
    }
  }

  return { imported, errors };
}
