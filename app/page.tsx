'use client';

import '@/lib/tools'; // register all tools
import { useEffect } from 'react';
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
  const { setAiEnabled, activeToolId } = useDevboxStore();

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((d) => setAiEnabled(d.aiEnabled))
      .catch(() => setAiEnabled(false));
  }, [setAiEnabled]);

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
        ) : (
          <>
            <section className="flex flex-col gap-2">
              <GeneratorBar />
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
