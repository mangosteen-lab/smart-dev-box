'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useDevboxStore } from '@/store/devbox';
import { runDetection } from '@/lib/tools';
import { ToolSidebar } from '@/components/tools/ToolSidebar';
import { UniversalInput } from '@/components/tools/UniversalInput';
import { DetectionBar } from '@/components/tools/DetectionBar';
import { OutputPanel } from '@/components/tools/OutputPanel';
import { GeneratorBar } from '@/components/tools/GeneratorBar';
import { OnboardingGuide } from '@/components/OnboardingGuide';

// Lazily loaded — only fetched when the panel is first activated
const JwtEncoderPanel    = dynamic(() => import('@/components/tools/JwtEncoderPanel').then(m => ({ default: m.JwtEncoderPanel })), { ssr: false });
const MarkdownPreviewPanel = dynamic(() => import('@/components/tools/MarkdownPreviewPanel').then(m => ({ default: m.MarkdownPreviewPanel })), { ssr: false });
const HtmlPreviewPanel   = dynamic(() => import('@/components/tools/HtmlPreviewPanel').then(m => ({ default: m.HtmlPreviewPanel })), { ssr: false });
const QrCodePanel        = dynamic(() => import('@/components/tools/QrCodePanel').then(m => ({ default: m.QrCodePanel })), { ssr: false });
const SplitDiffPanel     = dynamic(() => import('@/components/tools/SplitDiffPanel').then(m => ({ default: m.SplitDiffPanel })), { ssr: false });

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
};

export default function DevboxApp() {
  const { setAiEnabled, activeToolId, input, outputs, onboardingSplitInput, onboardingStep, advanceOnboardingStep, setInput, setDetectionResults } = useDevboxStore();
  const [splitMode, setSplitMode] = useState(false);
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
    // Step 4 (index 3): advance when split view is opened
    if (onboardingStep === 3) advanceOnboardingStep();
  };

  const customPanel = activeToolId ? CUSTOM_PANELS[activeToolId] ?? null : null;

  return (
    <div className="flex w-full h-full overflow-hidden">
      <OnboardingGuide />
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
          {/* Split view — desktop only */}
          <button
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
                Split view
              </>
            )}
          </button>
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
                initialInputRight={splitPaneInputs.current.right || onboardingSplitInput || undefined}
                onPaneChange={(l, r) => { splitPaneInputs.current = { left: l, right: r }; }}
              />
            </section>
          ) : (
            <>
              {/* Input pane */}
              <div
                data-onboard-input
                className="flex flex-col animate-fade-in"
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  background: 'var(--bg1)',
                  overflow: 'hidden',
                  flex: '1.3',
                  minHeight: '220px',
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
                    <DetectionBar />
                  </div>
                </div>
                {/* Pane body */}
                <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                  <UniversalInput />
                </div>
              </div>

              {/* Output pane */}
              <div
                data-onboard-output
                className="flex flex-col animate-fade-in"
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  background: 'var(--bg1)',
                  overflow: 'hidden',
                  flex: '1',
                  minHeight: '200px',
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
            </>
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
            ⌘↵ to run
          </StatusPill>
          <StatusDivider />
          <StatusPill>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            last run: {lastRun}
          </StatusPill>
        </div>

      </div>
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
