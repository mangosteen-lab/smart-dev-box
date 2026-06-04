import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  weight: '100 900',
  variable: '--font-mono',
  display: 'swap',
  preload: true,
});

const BASE_URL = 'https://smartdevbox.com';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#0f1117' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  colorScheme: 'dark light',
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'SmartDevBox — Paste anything. We figure out the rest.',
    template: '%s | SmartDevBox',
  },
  description:
    'SmartDevBox is a free, AI-powered developer toolbox. Paste Base64, JSON, JWT tokens, XML, SQL, URLs, Unix timestamps, X.509 certificates, cron expressions, hex strings, color codes and 80+ other formats — auto-detected and processed instantly in the browser. No sign-up required.',
  keywords: [
    'developer tools',
    'dev toolbox',
    'online developer tools',
    'base64 decoder',
    'base64 encode decode online',
    'json formatter',
    'json pretty print',
    'json validator',
    'jwt decoder',
    'jwt inspector',
    'jwt token decoder online',
    'xml formatter',
    'sql formatter',
    'url encoder decoder',
    'url parser',
    'hash generator',
    'sha256 hash online',
    'md5 hash generator',
    'uuid generator',
    'ulid generator',
    'unix timestamp converter',
    'epoch time converter',
    'color converter hex rgb hsl',
    'number base converter binary hex',
    'json to csv',
    'json to yaml',
    'csv to json',
    'cron expression parser',
    'x509 certificate decoder',
    'pem certificate viewer',
    'regex tester',
    'jsonpath evaluator',
    'random password generator',
    'qr code generator',
    'SmartDevBox',
  ],
  authors: [{ name: 'SmartDevBox' }],
  creator: 'SmartDevBox',
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'SmartDevBox',
    title: 'SmartDevBox — Paste anything. We figure out the rest.',
    description:
      'Free AI-powered developer toolbox. Auto-detects and processes Base64, JSON, JWT, XML, SQL, timestamps, URLs and 80+ formats instantly.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'SmartDevBox — Developer Toolbox',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartDevBox — Paste anything. We figure out the rest.',
    description:
      'Free AI-powered developer toolbox. Auto-detects and processes Base64, JSON, JWT, XML, SQL, timestamps, URLs and 80+ formats instantly.',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={geistMono.variable}>
      <head>
        {/* Preconnect to Google Analytics to reduce DNS/TLS latency */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      {/* Google Analytics — loaded after page is interactive */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-6Q9YWVQLYN" strategy="lazyOnload" />
      <Script id="gtag-init" strategy="lazyOnload">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-6Q9YWVQLYN');
      `}</Script>
      <body className="flex flex-col" style={{ minHeight: '100vh' }}>
        {/* Set data-theme before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=JSON.parse(localStorage.getItem('devbox-storage')||'{}');var dark=s.state&&s.state.isDark!==undefined?s.state.isDark:true;document.documentElement.setAttribute('data-theme',dark?'dark':'light');}catch(e){}})();`,
          }}
        />
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 flex overflow-hidden">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
