'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useDevboxStore } from '@/store/devbox';
import { runDetection } from '@/lib/tools';
import { loadPlugins } from '@/lib/tools/plugin-registry';
import { UniversalInput } from '@/components/tools/UniversalInput';
import { DetectionBar } from '@/components/tools/DetectionBar';
import { ResizablePanels } from '@/components/ResizablePanels';

// Lazily loaded — these are not needed for initial paint
const ToolSidebar  = dynamic(() => import('@/components/tools/ToolSidebar').then(m => ({ default: m.ToolSidebar })), { ssr: false });
const OutputPanel  = dynamic(() => import('@/components/tools/OutputPanel').then(m => ({ default: m.OutputPanel })), { ssr: false });
const GeneratorBar = dynamic(() => import('@/components/tools/GeneratorBar').then(m => ({ default: m.GeneratorBar })), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/CommandPalette').then(m => ({ default: m.CommandPalette })), { ssr: false });
const PluginManager = dynamic(() => import('@/components/tools/PluginManager').then(m => ({ default: m.PluginManager })), { ssr: false });

// Lazily loaded — only fetched when the panel is first activated
const JwtEncoderPanel    = dynamic(() => import('@/components/tools/JwtEncoderPanel').then(m => ({ default: m.JwtEncoderPanel })), { ssr: false });
const MarkdownPreviewPanel = dynamic(() => import('@/components/tools/MarkdownPreviewPanel').then(m => ({ default: m.MarkdownPreviewPanel })), { ssr: false });
const HtmlPreviewPanel   = dynamic(() => import('@/components/tools/HtmlPreviewPanel').then(m => ({ default: m.HtmlPreviewPanel })), { ssr: false });
const QrCodePanel        = dynamic(() => import('@/components/tools/QrCodePanel').then(m => ({ default: m.QrCodePanel })), { ssr: false });
const ExtractorPanel     = dynamic(() => import('@/components/tools/ExtractorPanel').then(m => ({ default: m.ExtractorPanel })), { ssr: false });
const SplitDiffPanel     = dynamic(() => import('@/components/tools/SplitDiffPanel').then(m => ({ default: m.SplitDiffPanel })), { ssr: false });
const CaseConverterPanel = dynamic(() => import('@/components/tools/CaseConverterPanel').then(m => ({ default: m.CaseConverterPanel })), { ssr: false });
const CUSTOM_PANELS: Record<string, { title: string; badge?: string; component: () => React.ReactNode }> = {
  'jwt-encoder': {
    title: 'JWT Encoder',
    badge: 'HMAC · HS256 / HS384 / HS512',
    component: () => <JwtEncoderPanel />,
  },
  'markdown-preview': {
    title: 'Markdown Preview',
    badge: 'Live render',
    component: () => <MarkdownPreviewPanel />,
  },
  'html-preview': {
    title: 'HTML Preview',
    badge: 'Sandboxed iframe',
    component: () => <HtmlPreviewPanel />,
  },
  'qr-code': {
    title: 'QR Code Generator',
    badge: 'PNG export',
    component: () => <QrCodePanel />,
  },
  'extract-sections': {
    title: 'Extract Sections',
    badge: 'JSON · XML · HTML · DATE · URL · EMAIL',
    component: () => <ExtractorPanel />,
  },
};

export default function DevboxApp() {
  const { setAiEnabled, activeToolId, setActiveToolId, input, outputs, setInput, setDetectionResults, userPlugins } = useDevboxStore();
  const [splitMode, setSplitMode] = useState(false);
  const [pluginManagerOpen, setPluginManagerOpen] = useState(false);
  const [splitSnapshot, setSplitSnapshot] = useState<{
    input: string;
    output: string;
    outputLanguage?: string;
    toolId?: string | null;
  } | null>(null);
  // Preserve both pane inputs across view switches
  const splitPaneInputs = useRef<{ left: string; right: string }>({ left: '', right: '' });
  const [lastRun, setLastRun] = useState<string>('—');

  // Register all tools after hydration — keeps the initial JS bundle small.
  // After registration, re-run detection in case the user already typed input.
  useEffect(() => {
    import('@/lib/tools').then(() => {
      // Load user plugins on top of built-in tools
      loadPlugins(useDevboxStore.getState().userPlugins);
      const currentInput = useDevboxStore.getState().input;
      if (currentInput.trim()) {
        setDetectionResults(runDetection(currentInput));
      }
    });
  }, [setDetectionResults]);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((d) => setAiEnabled(d.aiEnabled))
      .catch(() => setAiEnabled(false));
  }, [setAiEnabled]);

  // Update last run time when outputs change
  useEffect(() => {
    if (outputs.length > 0) {
      setLastRun(new Date(outputs[outputs.length - 1].timestamp).toLocaleTimeString());
    }
  }, [outputs]);

  const handleEnterSplit = () => {
    const latestOutput = outputs.length > 0 ? outputs[outputs.length - 1] : null;
    // Seed left pane with current single-view input (right keeps whatever was last there)
    splitPaneInputs.current.left = input;
    setSplitSnapshot({
      input,
      output: latestOutput?.result.output ?? '',
      outputLanguage: latestOutput?.result.outputLanguage,
      toolId: latestOutput?.toolId ?? activeToolId,
    });
    setSplitMode(true);
  };

  const customPanel = activeToolId ? CUSTOM_PANELS[activeToolId] ?? null : null;

  return (
    <div className="flex w-full h-full overflow-hidden">
      <CommandPalette />
      <ToolSidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ minWidth: 0 }}>

        {/* Toolbar */}
        <div
          className="flex items-center shrink-0 flex-wrap"
          style={{
            gap: '6px',
            padding: '7px 12px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg1)',
          }}
        >
          <GeneratorBar />
          {/* Plugin Manager button */}
          <button
            onClick={() => setPluginManagerOpen(true)}
            title="Manage user-defined plugin tools"
            className="flex items-center"
            style={{
              gap: '6px',
              fontSize: 'var(--fs-xs)',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text3)',
              padding: '4px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'var(--font)',
              transition: 'color .12s, border-color .12s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = 'var(--text1)';
              el.style.borderColor = 'var(--text3)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = 'var(--text3)';
              el.style.borderColor = 'var(--border)';
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            Plugins{userPlugins.length > 0 && (
              <span style={{
                background: 'var(--green-bg)', border: '1px solid var(--green-dim)',
                color: 'var(--green)', borderRadius: '10px',
                padding: '0 6px', fontSize: 'var(--fs-2xs)', fontWeight: 700,
              }}>{userPlugins.length}</span>
            )}
          </button>
          {/* Dual view — desktop only; hidden when a custom panel manages its own dual view */}
          {!customPanel && <button
            data-onboard-split
            onClick={() => {
              if (splitMode) {
                // Restore left pane input back to the single-view editor
                setInput(splitPaneInputs.current.left);
                setDetectionResults(runDetection(splitPaneInputs.current.left));
                setSplitMode(false);
              } else {
                handleEnterSplit();
              }
            }}
            className="hidden md:flex items-center"
            style={{
              marginLeft: 'auto',
              gap: '6px',
              fontSize: 'var(--fs-xs)',
              background: 'var(--green-bg)',
              border: '1px solid var(--green-dim)',
              color: 'var(--green)',
              padding: '4px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'var(--font)',
              fontWeight: 600,
              transition: 'background .12s, border-color .12s, box-shadow .12s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(74,222,128,0.12)';
              el.style.borderColor = 'var(--green)';
              el.style.boxShadow = '0 0 8px var(--primary-glow)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'var(--green-bg)';
              el.style.borderColor = 'var(--green-dim)';
              el.style.boxShadow = 'none';
            }}
          >
            {splitMode ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                </svg>
                Single view
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <line x1="12" y1="3" x2="12" y2="21"/>
                </svg>
                Dual view
              </>
            )}
          </button>}
        </div>

        {/* Workspace — desktop: fixed height flex column; mobile: scrollable */}
        <div
          className="flex-1 overflow-y-auto md:overflow-hidden"
          style={{ padding: '10px', gap: '8px', display: 'flex', flexDirection: 'column' }}
        >
          {customPanel ? (
            <section className="flex flex-col gap-3 animate-fade-in flex-1 overflow-hidden">
              {/* Panel header */}
              <div
                className="flex items-center"
                style={{
                  gap: '8px',
                  padding: '6px 10px',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--bg1)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
              >
                <button
                  onClick={() => setActiveToolId(null)}
                  title="Back"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    fontSize: 'var(--fs-xs)', fontWeight: 600,
                    color: 'var(--text2)',
                    background: 'var(--bg2)',
                    border: '1px solid var(--border2)',
                    cursor: 'pointer', padding: '4px 10px', borderRadius: '5px',
                    transition: 'background .12s, border-color .12s, color .12s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'var(--bg3)';
                    el.style.borderColor = 'var(--text3)';
                    el.style.color = 'var(--text)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'var(--bg2)';
                    el.style.borderColor = 'var(--border2)';
                    el.style.color = 'var(--text2)';
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Back
                </button>
                <div style={{ width: '1px', height: '14px', background: 'var(--border)', flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--fs-2xs)', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--green-dim)' }}>
                  {customPanel.title.toUpperCase()}
                </span>
                {customPanel.badge && (
                  <span
                    style={{
                      fontSize: 'var(--fs-2xs)',
                      color: 'var(--text3)',
                      border: '1px solid var(--border)',
                      borderRadius: '3px',
                      padding: '1px 6px',
                      background: 'var(--bg2)',
                    }}
                  >
                    {customPanel.badge}
                  </span>
                )}
              </div>
              {customPanel.component()}
            </section>
          ) : splitMode ? (
            <section className="flex flex-col gap-3 animate-fade-in flex-1 overflow-hidden">
              <SplitDiffPanel
                onClose={() => setSplitMode(false)}
                initialInput={splitPaneInputs.current.left || splitSnapshot?.input}
                initialOutput={splitSnapshot?.output}
                initialOutputLanguage={splitSnapshot?.outputLanguage}
                initialToolId={splitSnapshot?.toolId}
                initialInputRight={splitPaneInputs.current.right || undefined}
                onPaneChange={(l, r) => { splitPaneInputs.current = { left: l, right: r }; }}
              />
            </section>
          ) : (
            <ResizablePanels
              initialTopFlex={1.3}
              minTopPx={140}
              minBottomPx={120}
              className="animate-fade-in"
              top={
                /* Input pane */
                <div
                  data-onboard-input
                  className="flex flex-col"
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    background: 'var(--bg1)',
                    overflow: 'hidden',
                    height: '100%',
                  }}
                >
                  {/* Pane header */}
                  <div
                    className="flex items-center shrink-0 flex-wrap"
                    style={{
                      gap: '8px',
                      padding: '6px 10px',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text4)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 17 10 11 4 5"/>
                      <line x1="12" y1="19" x2="20" y2="19"/>
                    </svg>
                    <span style={{ fontSize: 'var(--fs-2xs)', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--green-dim)' }}>input</span>
                    <div className="flex items-center flex-wrap" data-onboard-detection style={{ marginLeft: 'auto', gap: '10px' }}>
                      <button
                        onClick={() => setActiveToolId('extract-sections')}
                        title="Extract embedded sections from input"
                        style={{
                          fontSize: 'var(--fs-2xs)', padding: '5px 12px', borderRadius: '4px',
                          border: '1px solid rgba(74,222,128,0.3)',
                          color: 'var(--green)',
                          background: activeToolId === 'extract-sections' ? 'var(--green-bg)' : 'rgba(74,222,128,0.12)',
                          cursor: 'pointer', fontFamily: 'var(--font)',
                          transition: 'all .12s', minHeight: '30px', whiteSpace: 'nowrap',
                          fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: '6px',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                        </svg>
                        Extract
                      </button>
                      <DetectionBar />
                    </div>
                  </div>
                  {/* Pane body */}
                  <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                    <UniversalInput />
                  </div>
                </div>
              }
              bottom={
                /* Output pane */
                <div
                  data-onboard-output
                  className="flex flex-col"
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    background: 'var(--bg1)',
                    overflow: 'hidden',
                    height: '100%',
                  }}
                >
                  {/* Pane header */}
                  <div
                    className="flex items-center shrink-0"
                    style={{
                      gap: '8px',
                      padding: '6px 10px',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text4)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 17 10 11 4 5"/>
                      <line x1="12" y1="19" x2="20" y2="19"/>
                    </svg>
                    <span style={{ fontSize: 'var(--fs-2xs)', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text3)' }}>output</span>
                  </div>
                  {/* Pane body */}
                  <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
                    <OutputPanel />
                  </div>
                </div>
              }
            />
          )}
        </div>

        {/* Status bar */}
        <div
          className="flex items-center shrink-0 flex-wrap"
          style={{
            gap: '8px',
            padding: '4px 14px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg)',
          }}
        >
          <StatusPill on>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            ready
          </StatusPill>
          <StatusDivider />
          <StatusPill>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5"/>
              <line x1="12" y1="19" x2="20" y2="19"/>
            </svg>
            {activeToolId ?? 'no tool selected'}
          </StatusPill>
          <StatusDivider className="hidden md:block" />
          <StatusPill className="hidden md:flex">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            ⌘↵ run
          </StatusPill>
          <StatusDivider className="hidden md:block" />
          <StatusPill className="hidden md:flex">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            ⌘K search
          </StatusPill>
          <StatusDivider />
          <StatusPill>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            last run: {lastRun}
          </StatusPill>
          <StatusDivider className="hidden md:block" />
          <a
            href="mailto:support@smartdevbox.com"
            className="hidden md:flex items-center"
            style={{ gap: '5px', fontSize: 'var(--fs-2xs)', color: 'var(--text4)', textDecoration: 'none', transition: 'color .12s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text2)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text4)'; }}
            title="Contact us or report an issue"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            support@smartdevbox.com
          </a>
          <StatusDivider className="hidden md:block" />
          <span className="hidden md:flex items-center" style={{ gap: '4px', fontSize: 'var(--fs-2xs)', color: 'var(--green-dim)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            100% client-side · no data sent
          </span>
        </div>

      </div>

      {/* Plugin Manager modal */}
      {pluginManagerOpen && <PluginManager onClose={() => setPluginManagerOpen(false)} />}

      {/* Case Converter modal */}
      {activeToolId === 'text-case' && (
        <CaseConverterPanel onClose={() => setActiveToolId(null)} />
      )}
    </div>
  );
}

function StatusPill({ children, on, className }: { children: React.ReactNode; on?: boolean; className?: string }) {
  return (
    <div
      className={`flex items-center ${className ?? ''}`}
      style={{ gap: '5px', fontSize: 'var(--fs-2xs)', color: on ? 'var(--green-dim)' : 'var(--text4)' }}
    >
      {children}
    </div>
  );
}

function StatusDivider({ className }: { className?: string }) {
  return <div className={className} style={{ width: '1px', height: '12px', background: 'var(--border)' }} />;
}
