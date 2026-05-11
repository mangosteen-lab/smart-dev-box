'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { compilePlugin, exportPluginsAsFile, loadPlugins, parsePluginBundle } from '@/lib/tools/plugin-registry';
import { runDetection } from '@/lib/tools';
import type { Category, GeneratorOption, GeneratorOptionType, PluginDefinition, StorePlugin } from '@/lib/tools/types';

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  'Encoding / Decoding',
  'Formatting',
  'Conversion',
  'Generation',
  'Inspection',
  'Text',
];

const DETECT_PLACEHOLDER = `// Return a confidence score 0–1.
// Higher = more likely this tool handles the input.
const t = input.trim();
return 0;`;

const EXECUTE_PLACEHOLDER = `// Return { output, outputLanguage?, error? }
// 'output' is the string shown in the output panel.
return { output: input, outputLanguage: 'text' };`;

const GENERATE_PLACEHOLDER = `// Receives 'options' object — keys match your defined options.
// Return { output, outputLanguage?, error? }
// Example: return { output: options.prefix + '-' + Date.now(), outputLanguage: 'text' };
return { output: 'hello from plugin', outputLanguage: 'text' };`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

type PluginType = 'detector' | 'generator';

interface EditorState {
  pluginType: PluginType;
  id: string;
  name: string;
  category: Category;
  description: string;
  // Detector fields
  keywordsRaw: string;
  outputExtension: string;
  detectCode: string;
  executeCode: string;
  // Generator fields
  generateCode: string;
  options: GeneratorOption[];
}

function toEditorState(p: PluginDefinition): EditorState {
  if (p.type === 'generator') {
    return {
      pluginType: 'generator',
      id: p.id, name: p.name, category: 'Generation',
      description: p.description,
      keywordsRaw: '', outputExtension: p.outputExtension ?? '',
      detectCode: DETECT_PLACEHOLDER, executeCode: EXECUTE_PLACEHOLDER,
      generateCode: p.generateCode,
      options: p.options,
    };
  }
  return {
    pluginType: 'detector',
    id: p.id, name: p.name, category: p.category,
    description: p.description,
    keywordsRaw: (p.keywords ?? []).join(', '),
    outputExtension: p.outputExtension ?? 'txt',
    detectCode: p.detectCode, executeCode: p.executeCode,
    generateCode: GENERATE_PLACEHOLDER, options: [],
  };
}

function fromEditorState(e: EditorState): PluginDefinition {
  if (e.pluginType === 'generator') {
    return {
      type: 'generator',
      id: e.id, name: e.name, description: e.description,
      outputExtension: e.outputExtension || undefined,
      generateCode: e.generateCode,
      options: e.options,
      updatedAt: new Date().toISOString(),
    };
  }
  return {
    id: e.id, name: e.name, category: e.category,
    description: e.description,
    keywords: e.keywordsRaw.split(',').map((k) => k.trim()).filter(Boolean),
    outputExtension: e.outputExtension || 'txt',
    detectCode: e.detectCode, executeCode: e.executeCode,
    updatedAt: new Date().toISOString(),
  };
}

// ── Option builder helpers ────────────────────────────────────────────────────

function defaultOption(type: GeneratorOptionType): GeneratorOption {
  if (type === 'text') return { type: 'text', key: '', label: '', defaultValue: '', placeholder: '' };
  if (type === 'number') return { type: 'number', key: '', label: '', defaultValue: 1, min: 1, max: 100 };
  if (type === 'select') return { type: 'select', key: '', label: '', defaultValue: '', choices: [] };
  return { type: 'toggle', key: '', label: '', defaultValue: false };
}

// ── Shared style tokens ───────────────────────────────────────────────────────

const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 1000,
  background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const modal: React.CSSProperties = {
  background: 'var(--bg1)', border: '1px solid var(--border)',
  borderRadius: '8px', width: '92vw', maxWidth: '920px',
  maxHeight: '90vh', display: 'flex', flexDirection: 'column',
  overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
};
const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)',
  borderRadius: '4px', color: 'var(--text1)', padding: '6px 10px',
  fontSize: 'var(--fs-xs)', fontFamily: 'var(--font)',
};
const textareaStyle: React.CSSProperties = {
  ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.5,
};
const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '4px',
  fontSize: 'var(--fs-2xs)', color: 'var(--text3)', fontWeight: 600,
  letterSpacing: '0.06em', textTransform: 'uppercase',
};
const btnPrimary: React.CSSProperties = {
  padding: '6px 16px', background: 'var(--green-bg)', border: '1px solid var(--green-dim)',
  color: 'var(--green)', borderRadius: '4px', cursor: 'pointer',
  fontSize: 'var(--fs-xs)', fontFamily: 'var(--font)', fontWeight: 600,
  display: 'inline-flex', alignItems: 'center', gap: '5px',
};
const btnGhost: React.CSSProperties = {
  padding: '6px 12px', background: 'transparent', border: '1px solid var(--border)',
  color: 'var(--text3)', borderRadius: '4px', cursor: 'pointer',
  fontSize: 'var(--fs-xs)', fontFamily: 'var(--font)',
  display: 'inline-flex', alignItems: 'center', gap: '5px',
};
const btnDanger: React.CSSProperties = {
  ...btnGhost, border: '1px solid rgba(248,113,113,0.3)', color: 'rgba(248,113,113,0.8)',
};
const alertError: React.CSSProperties = {
  padding: '8px 12px', background: 'rgba(248,113,113,0.08)',
  border: '1px solid rgba(248,113,113,0.3)', borderRadius: '4px',
  color: 'rgba(248,113,113,0.9)', fontSize: 'var(--fs-xs)', fontFamily: 'monospace',
};
const alertSuccess: React.CSSProperties = {
  padding: '8px 12px', background: 'var(--green-bg)',
  border: '1px solid var(--green-dim)', borderRadius: '4px',
  color: 'var(--green)', fontSize: 'var(--fs-xs)',
};
const badge = (bg: string, color: string): React.CSSProperties => ({
  fontSize: 'var(--fs-2xs)', borderRadius: '3px', padding: '1px 6px',
  background: bg, color, border: `1px solid ${color}33`,
});

// ── Component ─────────────────────────────────────────────────────────────────

type Tab = 'mine' | 'store';
type EditView = 'list' | 'edit';

interface PluginManagerProps { onClose: () => void; }

export function PluginManager({ onClose }: PluginManagerProps) {
  const { userPlugins, savePlugin, deletePlugin, setDetectionResults, input,
          pluginStoreUrls, addPluginStoreUrl, removePluginStoreUrl } = useDevboxStore();
  const [tab, setTab] = useState<Tab>('mine');

  // ── "My Plugins" tab state ─────────────────────────────────────────────────
  const [view, setView] = useState<EditView>('list');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importErrors, setImportErrors] = useState<Record<string, string>>({});
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // ── "Store" tab state ──────────────────────────────────────────────────────
  const [storePlugins, setStorePlugins] = useState<StorePlugin[]>([]);
  const [storeQuery, setStoreQuery] = useState('');
  const [storeLoading, setStoreLoading] = useState(false);
  const [storeError, setStoreError] = useState<string | null>(null);
  const [installing, setInstalling] = useState<string | null>(null);
  const [installed, setInstalled] = useState<Set<string>>(new Set());
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storeFetched = useRef(false);
  // null = official hub; string = custom URL
  const [activeStoreUrl, setActiveStoreUrl] = useState<string | null>(null);
  const [addUrlInput, setAddUrlInput] = useState('');
  const [addUrlError, setAddUrlError] = useState<string | null>(null);

  // ── Shared helpers ─────────────────────────────────────────────────────────

  const reloadAndDetect = useCallback((plugins: PluginDefinition[]) => {
    loadPlugins(plugins);
    if (input.trim()) setDetectionResults(runDetection(input));
  }, [input, setDetectionResults]);

  // ── "My Plugins" handlers ──────────────────────────────────────────────────

  const openNew = () => {
    setEditor({
      pluginType: 'detector',
      id: '', name: '', category: 'Inspection', description: '',
      keywordsRaw: '', outputExtension: 'txt',
      detectCode: DETECT_PLACEHOLDER, executeCode: EXECUTE_PLACEHOLDER,
      generateCode: GENERATE_PLACEHOLDER, options: [],
    });
    setCompileError(null);
    setSaved(false);
    setView('edit');
  };

  const openEdit = (p: PluginDefinition) => {
    setEditor(toEditorState(p));
    setCompileError(null);
    setSaved(false);
    setView('edit');
  };

  const handleSave = useCallback(() => {
    if (!editor) return;
    const id = editor.id.trim() || slugify(editor.name);
    const plugin = fromEditorState({ ...editor, id });
    if (!plugin.id) { setCompileError('Plugin ID is required.'); return; }
    if (!plugin.name) { setCompileError('Plugin name is required.'); return; }
    const err = compilePlugin(plugin);
    if (err) { setCompileError(err); return; }
    savePlugin(plugin);
    reloadAndDetect([...userPlugins.filter((p) => p.id !== plugin.id), plugin]);
    setCompileError(null);
    setSaved(true);
    setTimeout(() => setView('list'), 600);
  }, [editor, userPlugins, savePlugin, reloadAndDetect]);
  const handleDelete = (id: string) => {
    deletePlugin(id);
    reloadAndDetect(userPlugins.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const handleExportOne = (p: PluginDefinition) => exportPluginsAsFile([p]);
  const handleExportAll = () => exportPluginsAsFile(userPlugins, 'smartdevbox-plugins');

  const processImport = useCallback((raw: string) => {
    setImportErrors({});
    setImportSuccess(null);
    const result = parsePluginBundle(raw);
    if (result.fatalError) { setImportErrors({ '': result.fatalError }); return; }
    if (result.imported.length === 0) {
      setImportErrors(Object.keys(result.errors).length ? result.errors : { '': 'No valid plugins found in file.' });
      return;
    }
    const existingIds = new Set(userPlugins.map((p) => p.id));
    const newPlugins = result.imported.filter((p) => !existingIds.has(p.id));
    const skipped = result.imported.length - newPlugins.length;
    newPlugins.forEach(savePlugin);
    reloadAndDetect([...userPlugins, ...newPlugins]);
    const parts = [`Imported ${newPlugins.length} plugin${newPlugins.length !== 1 ? 's' : ''}.`];
    if (skipped > 0) parts.push(`${skipped} skipped (ID already exists).`);
    if (Object.keys(result.errors).length) parts.push(`${Object.keys(result.errors).length} failed to compile.`);
    setImportSuccess(parts.join(' '));
    if (Object.keys(result.errors).length) setImportErrors(result.errors);
  }, [userPlugins, savePlugin, reloadAndDetect]);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => processImport(ev.target?.result as string);
    reader.readAsText(file);
    e.target.value = '';
  };

  // ── "Store" handlers ───────────────────────────────────────────────────────

  useEffect(() => {
    setInstalled(new Set(userPlugins.map((p) => p.id)));
  }, [userPlugins]);

  const fetchStore = useCallback(async (q: string, sourceUrl: string | null) => {
    setStoreLoading(true);
    setStoreError(null);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (sourceUrl) params.set('url', sourceUrl);
      const url = `/api/plugins${params.toString() ? `?${params}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to load plugins');
      setStorePlugins(data.plugins ?? []);
    } catch (e: unknown) {
      setStoreError((e as Error).message);
    } finally {
      setStoreLoading(false);
    }
  }, []);

  // Fetch store lazily — only when the Store tab is first opened
  useEffect(() => {
    if (tab === 'store' && !storeFetched.current) {
      storeFetched.current = true;
      fetchStore('', activeStoreUrl);
    }
  }, [tab, fetchStore, activeStoreUrl]);

  // Re-fetch when the active source changes
  useEffect(() => {
    if (tab === 'store') {
      setStoreQuery('');
      fetchStore('', activeStoreUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStoreUrl]);

  const handleStoreSearch = (q: string) => {
    setStoreQuery(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchStore(q, activeStoreUrl), 350);
  };

  const handleInstall = (plugin: StorePlugin) => {
    setInstalling(plugin.id);
    if (!userPlugins.some((p) => p.id === plugin.id)) {
      savePlugin(plugin);
      loadPlugins([...useDevboxStore.getState().userPlugins]);
      if (input.trim()) setDetectionResults(runDetection(input));
    }
    setInstalled((prev) => new Set([...prev, plugin.id]));
    setInstalling(null);
  };

  const handleAddUrl = () => {
    const url = addUrlInput.trim();
    if (!url) { setAddUrlError('Please enter a URL.'); return; }
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Must be http or https');
    } catch {
      setAddUrlError('Invalid URL — must start with https://');
      return;
    }
    if (pluginStoreUrls.includes(url)) {
      setAddUrlError('This source is already added.');
      return;
    }
    addPluginStoreUrl(url);
    setAddUrlInput('');
    setAddUrlError(null);
    // Switch to the newly added source immediately
    setActiveStoreUrl(url);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  // When in edit view, hide the tab bar and show a back-to-list header instead
  const showTabs = view === 'list';

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '0 16px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg)', flexShrink: 0, minHeight: '44px',
        }}>
          {/* Back button (edit view only) */}
          {!showTabs && (
            <button style={{ ...btnGhost, padding: '4px 10px' }} onClick={() => setView('list')}>← Back</button>
          )}

          {/* Tab bar */}
          {showTabs && (
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, height: '44px' }}>
              {([['mine', 'My Plugins'], ['store', 'Store']] as [Tab, string][]).map(([t, label]) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: tab === t ? '2px solid var(--green)' : '2px solid transparent',
                    color: tab === t ? 'var(--green-dim)' : 'var(--text3)',
                    fontFamily: 'var(--font)',
                    fontSize: 'var(--fs-xs)',
                    fontWeight: tab === t ? 700 : 400,
                    letterSpacing: '0.06em',
                    padding: '0 16px',
                    cursor: 'pointer',
                    transition: 'color .12s, border-color .12s',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  {label}
                  {t === 'mine' && userPlugins.length > 0 && (
                    <span style={{
                      background: 'var(--green-bg)', border: '1px solid var(--green-dim)',
                      color: 'var(--green)', borderRadius: '10px',
                      padding: '0 6px', fontSize: 'var(--fs-2xs)', fontWeight: 700,
                    }}>{userPlugins.length}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Edit-view title */}
          {!showTabs && (
            <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'var(--green-dim)', letterSpacing: '0.08em' }}>
              {editor?.id ? `EDIT · ${editor.name || editor.id}` : 'NEW PLUGIN'}
            </span>
          )}

          <span style={{ marginLeft: 'auto' }} />

          {/* Store: submit link */}
          {showTabs && tab === 'store' && (
            <a
              href="https://github.com/mongosteen-lab/smart-dev-box-plugin"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...btnGhost, textDecoration: 'none', fontSize: 'var(--fs-xs)' }}
            >
              + Submit a Plugin
            </a>
          )}

          <button style={{ ...btnGhost, padding: '4px 8px' }} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

          {/* ══════════════ TAB: MY PLUGINS ══════════════ */}
          {tab === 'mine' && (

            <>
              {/* ── List view ── */}
              {view === 'list' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <button style={btnPrimary} onClick={openNew}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      New Plugin
                    </button>
                    <button style={btnGhost} onClick={() => fileInputRef.current?.click()}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Import .json
                    </button>
                    <input ref={fileInputRef} type="file" accept=".json,application/json" style={{ display: 'none' }} onChange={handleFileImport} />
                    {userPlugins.length > 0 && (
                      <button style={btnGhost} onClick={handleExportAll}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Export all ({userPlugins.length})
                      </button>
                    )}
                    <span style={{ marginLeft: 'auto', fontSize: 'var(--fs-2xs)', color: 'var(--text4)' }}>
                      Stored locally · share as <code style={{ color: 'var(--text3)' }}>.plugin.json</code>
                    </span>
                  </div>

                  {importSuccess && <div style={{ ...alertSuccess, marginBottom: '10px' }}>{importSuccess}</div>}
                  {Object.keys(importErrors).length > 0 && (
                    <div style={{ ...alertError, marginBottom: '10px' }}>
                      {Object.entries(importErrors).map(([id, msg]) => (
                        <div key={id}>{id ? <><strong>{id}:</strong> {msg}</> : msg}</div>
                      ))}
                    </div>
                  )}

                  {userPlugins.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text4)', fontSize: 'var(--fs-xs)' }}>
                      No plugins yet.{' '}
                      <button style={{ ...btnGhost, display: 'inline-flex' }} onClick={openNew}>Create one</button>
                      {' '}or{' '}
                      <button style={{ ...btnGhost, display: 'inline-flex' }} onClick={() => fileInputRef.current?.click()}>import a .json file</button>
                      {' '}or browse the{' '}
                      <button style={{ ...btnGhost, display: 'inline-flex' }} onClick={() => setTab('store')}>Store</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {userPlugins.map((p) => (
                        <div key={p.id} style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '10px 14px', background: 'var(--bg2)',
                          border: '1px solid var(--border)', borderRadius: '6px',
                        }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 700, fontSize: 'var(--fs-xs)', color: 'var(--text1)' }}>{p.name}</span>
                              {p.type === 'generator'
                                ? <span style={badge('rgba(99,102,241,0.15)', 'rgba(165,180,252,0.9)')}>generator</span>
                                : <span style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)', border: '1px solid var(--border)', borderRadius: '3px', padding: '1px 6px', background: 'var(--bg)' }}>{p.category}</span>
                              }
                              <code style={{ fontSize: 'var(--fs-2xs)', color: 'var(--green-dim)' }}>{p.id}</code>
                            </div>
                            {p.description && (
                              <div style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text3)', marginTop: '2px' }}>{p.description}</div>
                            )}
                          </div>
                          <button style={btnGhost} title="Export as .plugin.json" onClick={() => handleExportOne(p)}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export
                          </button>
                          <button style={btnGhost} onClick={() => openEdit(p)}>Edit</button>
                          {deleteConfirm === p.id ? (
                            <>
                              <button style={btnDanger} onClick={() => handleDelete(p.id)}>Confirm</button>
                              <button style={btnGhost} onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            </>
                          ) : (
                            <button style={btnDanger} onClick={() => setDeleteConfirm(p.id)}>Delete</button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ── Edit view ── */}
              {view === 'edit' && editor && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                  {/* Plugin type toggle */}
                  <div>
                    <label style={labelStyle}>Plugin Type</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {(['detector', 'generator'] as PluginType[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => setEditor((e) => e ? { ...e, pluginType: t } : e)}
                          style={{
                            padding: '5px 16px', borderRadius: '4px', cursor: 'pointer',
                            fontSize: 'var(--fs-xs)', fontFamily: 'var(--font)', fontWeight: 600,
                            background: editor.pluginType === t
                              ? (t === 'generator' ? 'rgba(99,102,241,0.15)' : 'var(--green-bg)')
                              : 'var(--bg2)',
                            border: `1px solid ${editor.pluginType === t
                              ? (t === 'generator' ? 'rgba(165,180,252,0.4)' : 'var(--green-dim)')
                              : 'var(--border)'}`,
                            color: editor.pluginType === t
                              ? (t === 'generator' ? 'rgba(165,180,252,0.9)' : 'var(--green)')
                              : 'var(--text3)',
                          }}
                        >
                          {t === 'detector' ? 'Detector' : 'Generator'}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)', marginTop: '4px' }}>
                      {editor.pluginType === 'detector'
                        ? 'Detector plugins auto-detect and transform input in the main panel.'
                        : 'Generator plugins appear in the Generate bar and produce output on demand.'}
                    </div>
                  </div>

                  {/* Common fields: ID + Name */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={labelStyle}>Tool ID <span style={{ color: 'var(--text4)', textTransform: 'none', fontWeight: 400 }}>(auto from name)</span></label>
                      <input style={inputStyle} value={editor.id} placeholder="e.g. chat-aba-path-parser"
                        onChange={(e) => setEditor((prev) => prev ? { ...prev, id: e.target.value } : prev)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Display Name *</label>
                      <input style={inputStyle} value={editor.name} placeholder="e.g. ChatABA Path Parser"
                        onChange={(e) => {
                          const name = e.target.value;
                          setEditor((prev) => prev ? { ...prev, name, id: prev.id || slugify(name) } : prev);
                        }} />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={labelStyle}>Description</label>
                    <input style={inputStyle} value={editor.description}
                      placeholder="One-line description of what this plugin does"
                      onChange={(e) => setEditor((prev) => prev ? { ...prev, description: e.target.value } : prev)} />
                  </div>

                  {/* ── Detector-only fields ── */}
                  {editor.pluginType === 'detector' && (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={labelStyle}>Category</label>
                          <select style={{ ...inputStyle, cursor: 'pointer' }} value={editor.category}
                            onChange={(e) => setEditor((prev) => prev ? { ...prev, category: e.target.value as Category } : prev)}>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Output Extension</label>
                          <input style={inputStyle} value={editor.outputExtension} placeholder="txt"
                            onChange={(e) => setEditor((prev) => prev ? { ...prev, outputExtension: e.target.value } : prev)} />
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle}>Keywords <span style={{ textTransform: 'none', fontWeight: 400 }}>(comma-separated)</span></label>
                        <input style={inputStyle} value={editor.keywordsRaw}
                          placeholder="e.g. chataba, unc, path, share"
                          onChange={(e) => setEditor((prev) => prev ? { ...prev, keywordsRaw: e.target.value } : prev)} />
                      </div>

                      <div>
                        <label style={labelStyle}>
                          detect(input) → number
                          <span style={{ marginLeft: '8px', color: 'var(--text4)', textTransform: 'none', fontWeight: 400 }}>
                            function body · return confidence 0–1
                          </span>
                        </label>
                        <textarea style={{ ...textareaStyle, minHeight: '120px' }} value={editor.detectCode}
                          spellCheck={false} onChange={(e) => setEditor((prev) => prev ? { ...prev, detectCode: e.target.value } : prev)} />
                      </div>

                      <div>
                        <label style={labelStyle}>
                          execute(input) → {'{ output, outputLanguage?, error? }'}
                          <span style={{ marginLeft: '8px', color: 'var(--text4)', textTransform: 'none', fontWeight: 400 }}>
                            function body · return result object
                          </span>
                        </label>
                        <textarea style={{ ...textareaStyle, minHeight: '150px' }} value={editor.executeCode}
                          spellCheck={false} onChange={(e) => setEditor((prev) => prev ? { ...prev, executeCode: e.target.value } : prev)} />
                      </div>
                    </>
                  )}

                  {/* ── Generator-only fields ── */}
                  {editor.pluginType === 'generator' && (
                    <>
                      <div>
                        <label style={labelStyle}>Output Extension <span style={{ textTransform: 'none', fontWeight: 400, color: 'var(--text4)' }}>(optional)</span></label>
                        <input style={{ ...inputStyle, maxWidth: '160px' }} value={editor.outputExtension} placeholder="txt"
                          onChange={(e) => setEditor((prev) => prev ? { ...prev, outputExtension: e.target.value } : prev)} />
                      </div>

                      {/* Options schema builder */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <label style={{ ...labelStyle, marginBottom: 0 }}>Options</label>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {(['text', 'number', 'select', 'toggle'] as GeneratorOptionType[]).map((t) => (
                              <button
                                key={t}
                                style={{ ...btnGhost, padding: '2px 8px', fontSize: 'var(--fs-2xs)' }}
                                onClick={() => setEditor((prev) => prev ? { ...prev, options: [...prev.options, defaultOption(t)] } : prev)}
                              >
                                + {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        {editor.options.length === 0 && (
                          <div style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text4)', padding: '8px 0' }}>
                            No options — your generateCode will receive an empty options object. Add options to let users configure the generator.
                          </div>
                        )}

                        {editor.options.map((opt, i) => (
                          <div key={i} style={{
                            padding: '10px 12px', background: 'var(--bg2)', border: '1px solid var(--border)',
                            borderRadius: '5px', marginBottom: '6px', display: 'flex', flexDirection: 'column', gap: '8px',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ ...badge('var(--bg3)', 'var(--text3)'), fontSize: 'var(--fs-2xs)' }}>{opt.type}</span>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flex: 1 }}>
                                <input
                                  style={{ ...inputStyle, fontSize: '12px' }}
                                  placeholder="key (e.g. count)"
                                  value={opt.key}
                                  onChange={(e) => setEditor((prev) => {
                                    if (!prev) return prev;
                                    const opts = [...prev.options];
                                    opts[i] = { ...opts[i], key: e.target.value } as GeneratorOption;
                                    return { ...prev, options: opts };
                                  })}
                                />
                                <input
                                  style={{ ...inputStyle, fontSize: '12px' }}
                                  placeholder="label (shown to user)"
                                  value={opt.label}
                                  onChange={(e) => setEditor((prev) => {
                                    if (!prev) return prev;
                                    const opts = [...prev.options];
                                    opts[i] = { ...opts[i], label: e.target.value } as GeneratorOption;
                                    return { ...prev, options: opts };
                                  })}
                                />
                              </div>
                              <button
                                style={{ ...btnDanger, padding: '2px 8px', fontSize: 'var(--fs-2xs)', flexShrink: 0 }}
                                onClick={() => setEditor((prev) => prev ? { ...prev, options: prev.options.filter((_, j) => j !== i) } : prev)}
                              >Remove</button>
                            </div>

                            {/* Type-specific extra fields */}
                            {opt.type === 'number' && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                {(['min', 'max', 'defaultValue'] as const).map((field) => (
                                  <label key={field} style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text3)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    {field}
                                    <input
                                      type="number"
                                      style={{ ...inputStyle, fontSize: '12px' }}
                                      value={(opt as typeof opt & Record<string, number>)[field]}
                                      onChange={(e) => setEditor((prev) => {
                                        if (!prev) return prev;
                                        const opts = [...prev.options];
                                        opts[i] = { ...opts[i], [field]: Number(e.target.value) } as GeneratorOption;
                                        return { ...prev, options: opts };
                                      })}
                                    />
                                  </label>
                                ))}
                              </div>
                            )}

                            {opt.type === 'text' && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {(['defaultValue', 'placeholder'] as const).map((field) => (
                                  <label key={field} style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text3)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    {field}
                                    <input
                                      style={{ ...inputStyle, fontSize: '12px' }}
                                      value={(opt as typeof opt & Record<string, string>)[field] ?? ''}
                                      onChange={(e) => setEditor((prev) => {
                                        if (!prev) return prev;
                                        const opts = [...prev.options];
                                        opts[i] = { ...opts[i], [field]: e.target.value } as GeneratorOption;
                                        return { ...prev, options: opts };
                                      })}
                                    />
                                  </label>
                                ))}
                              </div>
                            )}

                            {opt.type === 'select' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text3)' }}>
                                  Choices (comma-separated) &amp; default value
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                                  <input
                                    style={{ ...inputStyle, fontSize: '12px' }}
                                    placeholder="option1, option2, option3"
                                    value={opt.choices.join(', ')}
                                    onChange={(e) => setEditor((prev) => {
                                      if (!prev) return prev;
                                      const opts = [...prev.options];
                                      const choices = e.target.value.split(',').map((c) => c.trim()).filter(Boolean);
                                      opts[i] = { ...opts[i], choices } as GeneratorOption;
                                      return { ...prev, options: opts };
                                    })}
                                  />
                                  <input
                                    style={{ ...inputStyle, fontSize: '12px' }}
                                    placeholder="defaultValue"
                                    value={opt.defaultValue}
                                    onChange={(e) => setEditor((prev) => {
                                      if (!prev) return prev;
                                      const opts = [...prev.options];
                                      opts[i] = { ...opts[i], defaultValue: e.target.value } as GeneratorOption;
                                      return { ...prev, options: opts };
                                    })}
                                  />
                                </div>
                              </div>
                            )}

                            {opt.type === 'toggle' && (
                              <label style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                Default:
                                <input
                                  type="checkbox"
                                  checked={opt.defaultValue}
                                  style={{ accentColor: 'var(--green)', cursor: 'pointer' }}
                                  onChange={(e) => setEditor((prev) => {
                                    if (!prev) return prev;
                                    const opts = [...prev.options];
                                    opts[i] = { ...opts[i], defaultValue: e.target.checked } as GeneratorOption;
                                    return { ...prev, options: opts };
                                  })}
                                />
                              </label>
                            )}
                          </div>
                        ))}
                      </div>

                      <div>
                        <label style={labelStyle}>
                          generate(options) → {'{ output, outputLanguage?, error? }'}
                          <span style={{ marginLeft: '8px', color: 'var(--text4)', textTransform: 'none', fontWeight: 400 }}>
                            function body · receives options object
                          </span>
                        </label>
                        <textarea style={{ ...textareaStyle, minHeight: '160px' }} value={editor.generateCode}
                          spellCheck={false} onChange={(e) => setEditor((prev) => prev ? { ...prev, generateCode: e.target.value } : prev)} />
                      </div>
                    </>
                  )}

                  {compileError && <div style={alertError}>{compileError}</div>}
                  {saved && !compileError && <div style={alertSuccess}>Plugin saved and registered.</div>}

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '4px' }}>
                    <button style={btnGhost} onClick={() => setView('list')}>Cancel</button>
                    <button style={btnPrimary} onClick={handleSave}>Save &amp; Register</button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ══════════════ TAB: STORE ══════════════ */}
          {tab === 'store' && (
            <>
              {/* ── Source selector ── */}
              <div style={{
                marginBottom: '14px', padding: '10px 14px',
                background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '6px',
                display: 'flex', flexDirection: 'column', gap: '8px',
              }}>
                <div style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text3)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Plugin Source
                </div>

                {/* Official source */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="storeSource"
                    checked={activeStoreUrl === null}
                    onChange={() => setActiveStoreUrl(null)}
                    style={{ accentColor: 'var(--green)', cursor: 'pointer' }}
                  />
                  <a
                    href="https://github.com/mongosteen-lab/smart-dev-box-plugin"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontSize: 'var(--fs-xs)',
                      color: activeStoreUrl === null ? 'var(--green-dim)' : 'var(--text3)',
                      textDecoration: 'none',
                      borderBottom: `1px solid ${activeStoreUrl === null ? 'var(--green-dim)' : 'var(--text4)'}`,
                      transition: 'color .12s',
                    }}
                  >
                    Official Hub
                  </a>
                  <span style={{
                    fontSize: 'var(--fs-2xs)', borderRadius: '3px', padding: '1px 6px',
                    background: 'var(--green-bg)', color: 'var(--green)', border: '1px solid var(--green-dim)33',
                    marginLeft: '2px',
                  }}>official</span>
                </label>

                {/* User-added sources */}
                {pluginStoreUrls.map((url) => (
                  <div key={url} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flex: 1, minWidth: 0 }}>
                      <input
                        type="radio"
                        name="storeSource"
                        checked={activeStoreUrl === url}
                        onChange={() => setActiveStoreUrl(url)}
                        style={{ accentColor: 'var(--green)', cursor: 'pointer', flexShrink: 0 }}
                      />
                      <span style={{
                        fontSize: 'var(--fs-2xs)', color: activeStoreUrl === url ? 'var(--text1)' : 'var(--text3)',
                        fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }} title={url}>{url}</span>
                    </label>
                    <button
                      style={{ ...btnDanger, padding: '2px 8px', fontSize: 'var(--fs-2xs)', flexShrink: 0 }}
                      title="Remove this source"
                      onClick={() => {
                        if (activeStoreUrl === url) setActiveStoreUrl(null);
                        removePluginStoreUrl(url);
                      }}
                    >Remove</button>
                  </div>
                ))}

                {/* Add source input */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                  <input
                    style={{ ...inputStyle, flex: 1, fontSize: 'var(--fs-xs)' }}
                    type="url"
                    placeholder="https://example.com/my-plugins/index.json"
                    value={addUrlInput}
                    onChange={(e) => { setAddUrlInput(e.target.value); setAddUrlError(null); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                  />
                  <button style={{ ...btnGhost, flexShrink: 0 }} onClick={handleAddUrl}>
                    Add source
                  </button>
                </div>
                {addUrlError && (
                  <div style={{ fontSize: 'var(--fs-2xs)', color: 'rgba(248,113,113,0.9)' }}>{addUrlError}</div>
                )}
              </div>

              {/* ── Search bar ── */}
              <div style={{ marginBottom: '14px' }}>
                <input
                  style={{ ...inputStyle, width: 'auto', minWidth: '260px', maxWidth: '400px' }}
                  type="search"
                  placeholder="Search plugins…"
                  value={storeQuery}
                  onChange={(e) => handleStoreSearch(e.target.value)}
                />
              </div>

              {storeError && (
                <div style={{ ...alertError, marginBottom: '12px' }}>{storeError}</div>
              )}

              {storeLoading && (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text4)', fontSize: 'var(--fs-xs)' }}>
                  Loading…
                </div>
              )}

              {!storeLoading && storePlugins.length === 0 && !storeError && (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text4)', fontSize: 'var(--fs-xs)' }}>
                  {storeQuery
                    ? `No plugins match "${storeQuery}".`
                    : 'No plugins in this source yet.'}
                </div>
              )}

              {!storeLoading && storePlugins.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {storePlugins.map((p) => {
                    const isInstalled = installed.has(p.id);
                    return (
                      <div key={p.id} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                        padding: '12px 14px', background: 'var(--bg2)',
                        border: '1px solid var(--border)', borderRadius: '6px',
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                            <span style={{ fontWeight: 700, fontSize: 'var(--fs-xs)', color: 'var(--text1)' }}>{p.name}</span>
                            {p.type === 'generator'
                              ? <span style={badge('rgba(99,102,241,0.15)', 'rgba(165,180,252,0.9)')}>generator</span>
                              : <span style={badge('var(--bg)', 'var(--text3)')}>{p.category}</span>
                            }
                            <code style={{ fontSize: 'var(--fs-2xs)', color: 'var(--green-dim)' }}>{p.id}</code>
                            {isInstalled && <span style={badge('var(--green-bg)', 'var(--green)')}>installed</span>}
                          </div>
                          {p.description && (
                            <div style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text3)', marginBottom: '4px' }}>{p.description}</div>
                          )}
                          <div style={{ display: 'flex', gap: '10px', fontSize: 'var(--fs-2xs)', color: 'var(--text4)' }}>
                            <span>{p.downloads ?? 0} installs</span>
                            <span>updated {new Date(p.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div style={{ flexShrink: 0 }}>
                          <button
                            style={isInstalled ? btnGhost : btnPrimary}
                            onClick={() => !isInstalled && handleInstall(p)}
                            disabled={installing === p.id || isInstalled}
                          >
                            {isInstalled ? 'Installed' : installing === p.id ? 'Installing…' : 'Install'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
