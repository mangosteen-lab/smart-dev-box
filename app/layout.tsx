import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'DevBox — All-in-one developer tools',
  description:
    'One page, one input, all the developer tools you need. Base64, JSON, XML, timestamps, and more — powered by AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="flex flex-col" style={{ minHeight: '100vh' }}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 flex overflow-hidden">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
