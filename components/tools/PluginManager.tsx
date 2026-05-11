'use client';

import { useRef, useState, useCallback } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { compilePlugin, exportPluginsAsFile, loadPlugins, parsePluginBundle } from '@/lib/tools/plugin-registry';
import { runDetection } from '@/lib/tools';
import type { Category, PluginDefinition } from '@/lib/tools/types';

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

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

interface EditorState {
  id: string;
  name: string;
  category: Category;
  description: string;
  keywordsRaw: string;
  outputExtension: string;
  detectCode: string;
  executeCode: string;
}

function toEditorState(p: PluginDefinition): EditorState {
  return { ...p, outputExtension: p.outputExtension ?? 'txt', keywordsRaw: p.keywords.join(', ') };
}

function fromEditorState(e: EditorState): PluginDefinition {
  return {
    id: e.id,
    name: e.name,
    category: e.category,
    description: e.description,
    keywords: e.keywordsRaw.split(',').map((k) => k.trim()).filter(Boolean),
    outputExtension: e.outputExtension || 'txt',
    detectCode: e.detectCode,
    executeCode: e.executeCode,
    updatedAt: new Date().toISOString(),
  };
}

interface PluginManagerProps { onClose: () => void; }

export function PluginManager({ onClose }: PluginManagerProps) {
  const { userPlugins, savePlugin, deletePlugin, setDetectionResults, input } = useDevboxStore();
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Import state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importErrors, setImportErrors] = useState<Record<string, string>>({});
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const reloadAndDetect = useCallback((plugins: PluginDefinition[]) => {
    loadPlugins(plugins);
    if (input.trim()) setDetectionResults(runDetection(input));
  }, [input, setDetectionResults]);

  const openNew = () => {
    setEditor({
      id: '', name: '', category: 'Inspection', description: '',
      keywordsRaw: '', outputExtension: 'txt',
      detectCode: DETECT_PLACEHOLDER, executeCode: EXECUTE_PLACEHOLDER,
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

  // ── Export ────────────────────────────────────────────────────────────────

  const handleExportOne = (p: PluginDefinition) => exportPluginsAsFile([p]);

  const handleExportAll = () => exportPluginsAsFile(userPlugins, 'smartdevbox-plugins');

  // ── Import ────────────────────────────────────────────────────────────────

  const processImport = useCallback((raw: string) => {
    setImportErrors({});
    setImportSuccess(null);
    const result = parsePluginBundle(raw);
    if (result.fatalError) {
      setImportErrors({ '': result.fatalError });
      return;
    }
    if (result.imported.length === 0) {
      setImportErrors(Object.keys(result.errors).length ? result.errors : { '': 'No valid plugins found in file.' });
      return;
    }
    // Merge: existing plugins win on ID clash (user must delete manually to replace)
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
    // Reset so same file can be re-imported
    e.target.value = '';
  };

  const field = (key: keyof EditorState, value: string) =>
    setEditor((e) => e ? { ...e, [key]: value } : e);

  // ── Styles ────────────────────────────────────────────────────────────────

  const overlay: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
  const modal: React.CSSProperties = {
    background: 'var(--bg1)', border: '1px solid var(--border)',
    borderRadius: '8px', width: '90vw', maxWidth: '880px',
    maxHeight: '90vh', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
  };
  const hdr: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '12px 16px', borderBottom: '1px solid var(--border)',
    background: 'var(--bg)', flexShrink: 0,
  };
  const body: React.CSSProperties = { flex: 1, overflowY: 'auto', padding: '16px' };
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal}>

        {/* ── Header ── */}
        <div style={hdr}>
          {view === 'edit' && (
            <button style={btnGhost} onClick={() => setView('list')}>← Back</button>
          )}
          <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'var(--green-dim)', letterSpacing: '0.08em' }}>
            {view === 'list'
              ? 'PLUGIN MANAGER'
              : editor?.id ? `EDIT · ${editor.name || editor.id}` : 'NEW PLUGIN'}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 'var(--fs-2xs)', color: 'var(--text4)' }}>
            User-defined tools · stored locally
          </span>
          <button style={{ ...btnGhost, padding: '4px 8px', marginLeft: '8px' }} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* ── Body ── */}
        <div style={body}>

          {/* ════════════ LIST VIEW ════════════ */}
          {view === 'list' && (
            <>
              {/* Toolbar row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <button style={btnPrimary} onClick={openNew}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  New Plugin
                </button>

                {/* Import from file */}
                <button style={btnGhost} onClick={() => fileInputRef.current?.click()}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Import .json
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  style={{ display: 'none' }}
                  onChange={handleFileImport}
                />

                {/* Export all */}
                {userPlugins.length > 0 && (
                  <button style={btnGhost} onClick={handleExportAll}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export all ({userPlugins.length})
                  </button>
                )}

                <span style={{ marginLeft: 'auto', fontSize: 'var(--fs-2xs)', color: 'var(--text4)' }}>
                  Share plugins as <code style={{ color: 'var(--text3)' }}>.plugin.json</code> files
                </span>
              </div>

              {/* Import feedback */}
              {importSuccess && (
                <div style={{ ...alertSuccess, marginBottom: '10px' }}>{importSuccess}</div>
              )}
              {Object.keys(importErrors).length > 0 && (
                <div style={{ ...alertError, marginBottom: '10px' }}>
                  {Object.entries(importErrors).map(([id, msg]) => (
                    <div key={id}>{id ? <><strong>{id}:</strong> {msg}</> : msg}</div>
                  ))}
                </div>
              )}

              {/* Plugin list */}
              {userPlugins.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text4)', fontSize: 'var(--fs-xs)' }}>
                  No plugins yet.{' '}
                  <button style={{ ...btnGhost, display: 'inline-flex' }} onClick={openNew}>Create one</button>
                  {' '}or{' '}
                  <button style={{ ...btnGhost, display: 'inline-flex' }} onClick={() => fileInputRef.current?.click()}>import a .json file</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {userPlugins.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 14px', background: 'var(--bg2)',
                        border: '1px solid var(--border)', borderRadius: '6px',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700, fontSize: 'var(--fs-xs)', color: 'var(--text1)' }}>{p.name}</span>
                          <span style={{
                            fontSize: 'var(--fs-2xs)', color: 'var(--text4)',
                            border: '1px solid var(--border)', borderRadius: '3px',
                            padding: '1px 6px', background: 'var(--bg)',
                          }}>{p.category}</span>
                          <code style={{ fontSize: 'var(--fs-2xs)', color: 'var(--green-dim)' }}>{p.id}</code>
                        </div>
                        {p.description && (
                          <div style={{ fontSize: 'var(--fs-2xs)', color: 'var(--text3)', marginTop: '2px' }}>{p.description}</div>
                        )}
                      </div>

                      {/* Per-plugin actions */}
                      <button style={btnGhost} title="Export this plugin as .plugin.json" onClick={() => handleExportOne(p)}>
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

          {/* ════════════ EDIT VIEW ════════════ */}
          {view === 'edit' && editor && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Row 1: id + name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>
                    Tool ID{' '}
                    <span style={{ color: 'var(--text4)', textTransform: 'none', fontWeight: 400 }}>(auto from name)</span>
                  </label>
                  <input
                    style={inputStyle}
                    value={editor.id}
                    placeholder="e.g. chat-aba-path-parser"
                    onChange={(e) => field('id', e.target.value)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Display Name *</label>
                  <input
                    style={inputStyle}
                    value={editor.name}
                    placeholder="e.g. ChatABA Path Parser"
                    onChange={(e) => {
                      const name = e.target.value;
                      setEditor((prev) => prev ? { ...prev, name, id: prev.id || slugify(name) } : prev);
                    }}
                  />
                </div>
              </div>

              {/* Row 2: category + outputExtension */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={editor.category}
                    onChange={(e) => field('category', e.target.value as Category)}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Output Extension</label>
                  <input style={inputStyle} value={editor.outputExtension} placeholder="txt"
                    onChange={(e) => field('outputExtension', e.target.value)} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <input style={inputStyle} value={editor.description}
                  placeholder="One-line description of what this tool does"
                  onChange={(e) => field('description', e.target.value)} />
              </div>

              {/* Keywords */}
              <div>
                <label style={labelStyle}>Keywords <span style={{ textTransform: 'none', fontWeight: 400 }}>(comma-separated)</span></label>
                <input style={inputStyle} value={editor.keywordsRaw}
                  placeholder="e.g. chataba, unc, path, share"
                  onChange={(e) => field('keywordsRaw', e.target.value)} />
              </div>

              {/* detect code */}
              <div>
                <label style={labelStyle}>
                  detect(input) → number
                  <span style={{ marginLeft: '8px', color: 'var(--text4)', textTransform: 'none', fontWeight: 400 }}>
                    function body · return confidence 0–1
                  </span>
                </label>
                <textarea style={{ ...textareaStyle, minHeight: '120px' }} value={editor.detectCode}
                  spellCheck={false} onChange={(e) => field('detectCode', e.target.value)} />
              </div>

              {/* execute code */}
              <div>
                <label style={labelStyle}>
                  execute(input) → {'{ output, outputLanguage?, error? }'}
                  <span style={{ marginLeft: '8px', color: 'var(--text4)', textTransform: 'none', fontWeight: 400 }}>
                    function body · return result object
                  </span>
                </label>
                <textarea style={{ ...textareaStyle, minHeight: '150px' }} value={editor.executeCode}
                  spellCheck={false} onChange={(e) => field('executeCode', e.target.value)} />
              </div>

              {/* Feedback */}
              {compileError && <div style={alertError}>{compileError}</div>}
              {saved && !compileError && <div style={alertSuccess}>Plugin saved and registered.</div>}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', paddingTop: '4px' }}>
                <button style={btnGhost} onClick={() => setView('list')}>Cancel</button>
                <button style={btnPrimary} onClick={handleSave}>Save &amp; Register</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
