/**
 * Plugin registry — converts user-authored PluginDefinitions (stored as JSON
 * in localStorage via Zustand) into live registrations.
 *
 * Detector plugins  → registered as ToolDefinitions (detect + execute)
 * Generator plugins → stored in a separate in-memory map; read by GeneratorBar
 *
 * Code strings are compiled once with `new Function()` and wrapped in try/catch
 * so a buggy plugin can never crash the whole app.
 */

import { registerTool, unregisterTool } from './registry';
import type {
  DetectorPlugin,
  GeneratorPlugin,
  GeneratorOption,
  PluginBundle,
  PluginDefinition,
  ToolDefinition,
} from './types';

// ── Type guards ───────────────────────────────────────────────────────────────

export function isGeneratorPlugin(p: PluginDefinition): p is GeneratorPlugin {
  return p.type === 'generator';
}
export function isDetectorPlugin(p: PluginDefinition): p is DetectorPlugin {
  return p.type !== 'generator';
}

// ── Generator plugin registry ─────────────────────────────────────────────────

type GeneratorEntry = {
  plugin: GeneratorPlugin;
  generate: (options: Record<string, unknown>) => { output: string; outputLanguage?: string; error?: string };
};

/** Live compiled generator plugins keyed by id */
const generatorPlugins = new Map<string, GeneratorEntry>();

/** Subscribe to generator plugin changes (used by GeneratorBar) */
type GeneratorListener = () => void;
const generatorListeners = new Set<GeneratorListener>();

export function subscribeGenerators(fn: GeneratorListener): () => void {
  generatorListeners.add(fn);
  return () => generatorListeners.delete(fn);
}

/** Stable snapshot array — only replaced when the map changes */
let generatorPluginsSnapshot: GeneratorEntry[] = [];

function notifyGenerators() {
  generatorPluginsSnapshot = Array.from(generatorPlugins.values());
  for (const fn of generatorListeners) fn();
}

export function getGeneratorPlugins(): GeneratorEntry[] {
  return generatorPluginsSnapshot;
}

// ── Detector plugin registry ──────────────────────────────────────────────────

/** IDs of currently-loaded detector plugins, so we can unregister on reload. */
const loadedDetectorIds = new Set<string>();

// ── Compile ───────────────────────────────────────────────────────────────────

/**
 * Compile a DetectorPlugin into a ToolDefinition and register it.
 * Returns an error string if compilation fails, or null on success.
 */
export function compileDetectorPlugin(plugin: DetectorPlugin): string | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const detectFn = new Function('input', plugin.detectCode) as (input: string) => number;
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const executeFn = new Function('input', plugin.executeCode) as (input: string) => {
      output: string; outputLanguage?: string; error?: string;
    };

    const tool: ToolDefinition = {
      id: plugin.id,
      name: plugin.name,
      category: plugin.category,
      description: plugin.description,
      keywords: plugin.keywords,
      outputExtension: plugin.outputExtension,
      detect: (input) => { try { return detectFn(input); } catch { return 0; } },
      execute: (input) => {
        try { return executeFn(input); }
        catch (err) { return { output: '', error: err instanceof Error ? err.message : String(err) }; }
      },
    };

    registerTool(tool);
    loadedDetectorIds.add(plugin.id);
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

/**
 * Compile a GeneratorPlugin and store it in the generator map.
 * Returns an error string if compilation fails, or null on success.
 */
export function compileGeneratorPlugin(plugin: GeneratorPlugin): string | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const generateFn = new Function('options', plugin.generateCode) as (
      options: Record<string, unknown>
    ) => { output: string; outputLanguage?: string; error?: string };

    generatorPlugins.set(plugin.id, {
      plugin,
      generate: (opts) => {
        try { return generateFn(opts); }
        catch (err) { return { output: '', error: err instanceof Error ? err.message : String(err) }; }
      },
    });
    notifyGenerators();
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

/**
 * Compile any PluginDefinition (detector or generator).
 * Used by the editor's Save & Register button and by import validation.
 */
export function compilePlugin(plugin: PluginDefinition): string | null {
  return isGeneratorPlugin(plugin)
    ? compileGeneratorPlugin(plugin)
    : compileDetectorPlugin(plugin);
}

// ── Load / unload ─────────────────────────────────────────────────────────────

/** Load (or reload) a full list of plugins, unregistering stale ones first. */
export function loadPlugins(plugins: PluginDefinition[]): void {
  const incomingIds = new Set(plugins.map((p) => p.id));

  // Unregister detector plugins no longer in the list
  for (const id of loadedDetectorIds) {
    if (!incomingIds.has(id)) {
      unregisterTool(id);
      loadedDetectorIds.delete(id);
    }
  }

  // Remove generator plugins no longer in the list
  let generatorChanged = false;
  for (const id of generatorPlugins.keys()) {
    if (!incomingIds.has(id)) {
      generatorPlugins.delete(id);
      generatorChanged = true;
    }
  }

  for (const plugin of plugins) {
    if (isGeneratorPlugin(plugin)) {
      generatorPlugins.delete(plugin.id); // always re-compile
      compileGeneratorPlugin(plugin);
    } else {
      if (loadedDetectorIds.has(plugin.id)) {
        unregisterTool(plugin.id);
        loadedDetectorIds.delete(plugin.id);
      }
      compileDetectorPlugin(plugin);
    }
  }

  if (generatorChanged) notifyGenerators();
}

// ── Export ────────────────────────────────────────────────────────────────────

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
  errors: Record<string, string>;
  fatalError?: string;
}

export function parsePluginBundle(raw: string): ImportResult {
  let bundle: unknown;
  try { bundle = JSON.parse(raw); }
  catch { return { imported: [], errors: {}, fatalError: 'Invalid JSON — could not parse file.' }; }

  if (typeof bundle !== 'object' || bundle === null)
    return { imported: [], errors: {}, fatalError: 'File must be a JSON object.' };

  const b = bundle as Record<string, unknown>;
  if (b.schemaVersion !== '1.0')
    return { imported: [], errors: {}, fatalError: `Unsupported schemaVersion "${b.schemaVersion}". Expected "1.0".` };

  const candidates: unknown[] = [];
  if (b.plugin) candidates.push(b.plugin);
  if (Array.isArray(b.plugins)) candidates.push(...b.plugins);

  if (candidates.length === 0)
    return { imported: [], errors: {}, fatalError: 'Bundle contains no plugins (need "plugin" or "plugins" field).' };

  const imported: PluginDefinition[] = [];
  const errors: Record<string, string> = {};

  for (const candidate of candidates) {
    if (typeof candidate !== 'object' || candidate === null) { errors['?'] = 'Plugin entry is not an object.'; continue; }
    const p = candidate as Record<string, unknown>;
    const id = typeof p.id === 'string' ? p.id : undefined;
    const label = id ?? '(unknown)';

    // ── Generator plugin ──
    if (p.type === 'generator') {
      const missing = (['id', 'name', 'generateCode'] as const).filter((k) => typeof p[k] !== 'string');
      if (missing.length > 0) { errors[label] = `Missing required fields: ${missing.join(', ')}`; continue; }

      const plugin: GeneratorPlugin = {
        type: 'generator',
        id: p.id as string,
        name: p.name as string,
        description: typeof p.description === 'string' ? p.description : '',
        options: Array.isArray(p.options) ? (p.options as GeneratorOption[]) : [],
        generateCode: p.generateCode as string,
        outputExtension: typeof p.outputExtension === 'string' ? p.outputExtension : undefined,
        updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : new Date().toISOString(),
      };

      const err = compileGeneratorPlugin(plugin);
      if (err) {
        errors[plugin.id] = err;
        generatorPlugins.delete(plugin.id);
      } else {
        imported.push(plugin);
      }
      continue;
    }

    // ── Detector plugin ──
    const missing = (['id', 'name', 'category', 'detectCode', 'executeCode'] as const)
      .filter((k) => typeof p[k] !== 'string');
    if (missing.length > 0) { errors[label] = `Missing required fields: ${missing.join(', ')}`; continue; }

    const plugin: DetectorPlugin = {
      id: p.id as string,
      name: p.name as string,
      category: p.category as DetectorPlugin['category'],
      description: typeof p.description === 'string' ? p.description : '',
      keywords: Array.isArray(p.keywords) ? (p.keywords as string[]) : [],
      outputExtension: typeof p.outputExtension === 'string' ? p.outputExtension : 'txt',
      detectCode: p.detectCode as string,
      executeCode: p.executeCode as string,
      updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : new Date().toISOString(),
    };

    const err = compileDetectorPlugin(plugin);
    if (err) {
      errors[plugin.id] = err;
      unregisterTool(plugin.id);
      loadedDetectorIds.delete(plugin.id);
    } else {
      imported.push(plugin);
    }
  }

  return { imported, errors };
}
