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
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
        style={{ minWidth: 0 }}
      >
        {customPanel ? (
          <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1 shrink-0">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                {customPanel.title}
              </h2>
              {customPanel.badge && (
                <span className="text-xs px-2 py-0.5 rounded font-mono"
                  style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
                  {customPanel.badge}
                </span>
              )}
            </div>
            {customPanel.component}
          </section>
        ) : splitMode ? (
          <section className="flex flex-col gap-2">
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
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <GeneratorBar />
                <button
                  onClick={() => handleEnterSplit()}
                  className="text-xs px-3 py-1.5 rounded font-medium shrink-0 hover:opacity-80 transition-opacity"
                  style={{
                    background: 'var(--surface)',
                    color: 'var(--muted)',
                    border: '1px solid var(--border)',
                  }}
                >
                  ⇔ Split
                </button>
              </div>
              <UniversalInput />
              <DetectionBar />
            </section>
            <section>
              <OutputPanel />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
