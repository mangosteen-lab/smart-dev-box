'use client';

import '@/lib/tools'; // register all tools
import { useEffect, useState } from 'react';
import { useDevboxStore } from '@/store/devbox';
import { ToolSidebar } from '@/components/tools/ToolSidebar';
import { UniversalInput } from '@/components/tools/UniversalInput';
import { DetectionBar } from '@/components/tools/DetectionBar';
import { OutputPanel } from '@/components/tools/OutputPanel';
import { JwtEncoderPanel } from '@/components/tools/JwtEncoderPanel';
import { MarkdownPreviewPanel } from '@/components/tools/MarkdownPreviewPanel';
import { HtmlPreviewPanel } from '@/components/tools/HtmlPreviewPanel';
import { QrCodePanel } from '@/components/tools/QrCodePanel';
import { GeneratorBar } from '@/components/tools/GeneratorBar';
import { SplitDiffPanel } from '@/components/tools/SplitDiffPanel';

const CUSTOM_PANELS: Record<string, { title: string; badge?: string; component: React.ReactNode }> = {
  'jwt-encoder': {
    title: 'JWT Encoder',
    badge: 'HMAC · HS256 / HS384 / HS512',
    component: <JwtEncoderPanel />,
  },
  'markdown-preview': {
    title: 'Markdown Preview',
    badge: 'Live render',
    component: <MarkdownPreviewPanel />,
  },
  'html-preview': {
    title: 'HTML Preview',
    badge: 'Sandboxed iframe',
    component: <HtmlPreviewPanel />,
  },
  'qr-code': {
    title: 'QR Code Generator',
    badge: 'PNG export',
    component: <QrCodePanel />,
  },
};

export default function Home() {
  const { setAiEnabled, activeToolId, input, outputs } = useDevboxStore();
  const [splitMode, setSplitMode] = useState(false);
  const [splitSnapshot, setSplitSnapshot] = useState<{
    input: string;
    output: string;
    outputLanguage?: string;
    toolId?: string | null;
  } | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((d) => setAiEnabled(d.aiEnabled))
      .catch(() => setAiEnabled(false));
  }, [setAiEnabled]);

  const handleEnterSplit = () => {
    const latestOutput = outputs.length > 0 ? outputs[outputs.length - 1] : null;
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
      <ToolSidebar />

      <div
        className="flex-1 overflow-y-auto flex flex-col gap-4"
        style={{ minWidth: 0, padding: '20px 24px' }}
      >
        {customPanel ? (
          <section className="flex flex-col gap-3 animate-fade-in">
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--primary-muted)', color: 'var(--primary)', fontSize: '15px' }}
                >
                  ⚙
                </div>
                <h2 style={{ color: 'var(--foreground)', fontSize: '16px', fontWeight: 700 }}>
                  {customPanel.title}
                </h2>
                {customPanel.badge && (
                  <span
                    className="px-2.5 py-1 rounded-full font-mono"
                    style={{
                      background: 'var(--surface-3)',
                      color: 'var(--muted)',
                      border: '1px solid var(--border)',
                      fontSize: '12px',
                    }}
                  >
                    {customPanel.badge}
                  </span>
                )}
              </div>
            </div>
            {customPanel.component}
          </section>
        ) : splitMode ? (
          <section className="flex flex-col gap-3 animate-fade-in">
            <SplitDiffPanel
              onClose={() => setSplitMode(false)}
              initialInput={splitSnapshot?.input}
              initialOutput={splitSnapshot?.output}
              initialOutputLanguage={splitSnapshot?.outputLanguage}
              initialToolId={splitSnapshot?.toolId}
            />
          </section>
        ) : (
          <>
            {/* Input section */}
            <section className="flex flex-col gap-3">
              {/* Generator bar + split toggle */}
              <div className="flex items-center justify-between gap-3">
                <GeneratorBar />
                <button
                  onClick={() => handleEnterSplit()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shrink-0 transition-all hover:opacity-90 active:scale-95"
                  style={{
                    background: 'var(--gradient-brand)',
                    color: 'white',
                    border: 'none',
                    fontSize: '13px',
                    boxShadow: '0 2px 10px var(--primary-glow)',
                    letterSpacing: '0.01em',
                  }}
                >
                  <span style={{ fontSize: '15px', lineHeight: 1 }}>⇔</span>
                  Split view
                </button>
              </div>

              <UniversalInput />
              <DetectionBar />
            </section>

            {/* Output section */}
            <section>
              <OutputPanel />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
