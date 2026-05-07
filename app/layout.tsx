import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SmartDevBox — Paste anything. We figure out the rest.',
  description:
    'Paste anything. We figure out the rest. Base64, JSON, XML, timestamps, JWT tokens and more — powered by AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={jetbrainsMono.variable}>
      <body className="flex flex-col" style={{ minHeight: '100vh' }}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 flex overflow-hidden">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
