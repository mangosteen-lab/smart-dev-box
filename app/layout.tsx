import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
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
    <html lang="en" suppressHydrationWarning className={jetbrainsMono.variable}>
      {/* Google Analytics */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-6Q9YWVQLYN" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">{`
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'SmartDevBox',
                url: BASE_URL,
                description:
                  'Free AI-powered developer toolbox. Paste Base64, JSON, JWT, XML, SQL, timestamps, URLs, certificates, cron expressions and 80+ other formats — auto-detected and processed instantly in the browser.',
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'Any',
                browserRequirements: 'Requires JavaScript. Works in any modern browser.',
                softwareVersion: '1.0',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                featureList: [
                  'Base64 encode and decode',
                  'JSON formatter and validator',
                  'JWT decoder — inspect header and payload without a secret',
                  'JWT encoder — create signed tokens with HS256, HS384, HS512',
                  'XML formatter and minifier',
                  'SQL formatter',
                  'URL encoder and decoder',
                  'URL parser — break a URL into protocol, host, path, query params',
                  'Hash generator — MD5, SHA-1, SHA-256, SHA-512',
                  'UUID v4 generator',
                  'ULID generator',
                  'Unix timestamp converter',
                  'Color converter — HEX, RGB, HSL, HSV',
                  'Number base converter — binary, octal, decimal, hex',
                  'JSON to CSV, TSV, YAML, XML converter',
                  'CSV to JSON converter',
                  'Cron expression parser',
                  'X.509 certificate decoder',
                  'Regex tester',
                  'AI-powered auto-detection of input format',
                ],
                creator: {
                  '@type': 'Organization',
                  name: 'SmartDevBox',
                  url: BASE_URL,
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'How do I decode a Base64 string online?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Paste your Base64 string into SmartDevBox at smartdevbox.com. It automatically detects Base64 encoding and decodes it instantly — no configuration needed.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do I decode a JWT token without a secret?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: "Paste your JWT token into SmartDevBox. The JWT Inspector tool decodes the header and payload and displays them as readable JSON. Note: this decodes but does not verify the signature — you don't need the secret to read the claims.",
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do I format or pretty-print JSON?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Paste your minified or unformatted JSON into SmartDevBox. The JSON Formatter tool detects it automatically and pretty-prints it with configurable indentation.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do I convert a Unix timestamp to a human-readable date?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Paste a Unix timestamp (e.g. 1700000000) into SmartDevBox. The Unix Timestamp converter detects it and shows the equivalent date and time in UTC and your local timezone.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do I convert JSON to CSV?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Paste a JSON array of objects into SmartDevBox and select the JSON → CSV tool. It converts your data to comma-separated format with headers derived from the JSON keys.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do I compute a SHA-256 hash online?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Use the Hash Generator tool on SmartDevBox. Paste any text and it computes MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously in the browser.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do I parse and understand a cron expression?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Paste your cron expression (e.g. "0 9 * * 1-5") into SmartDevBox. The Cron Job Parser explains it in plain English and shows the next scheduled run times.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do I decode an X.509 certificate online?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Paste a PEM-encoded certificate (beginning with -----BEGIN CERTIFICATE-----) into SmartDevBox. The Certificate Decoder extracts and displays the subject, issuer, validity dates, public key, and extensions.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Is SmartDevBox free to use?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes. SmartDevBox is completely free with no account or sign-up required. All tools run in the browser. An optional AI mode (for ambiguous input detection) can be enabled with your own OpenAI API key.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Does SmartDevBox send my data to a server?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'No. All tools run entirely in the browser using client-side JavaScript. Your data never leaves your machine unless you opt into the AI mode, which sends input to OpenAI for format detection.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is the best free online JSON formatter?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'SmartDevBox automatically detects JSON when you paste it and formats it with configurable indentation. It also validates JSON and reports syntax errors with precise line and column numbers — all in the browser, free, with no account required.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is the best free online Base64 decoder?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'SmartDevBox auto-detects Base64 strings — including standard and URL-safe variants, with or without padding — and decodes them instantly on paste. No button to click, no tool to select.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do I compare two JSON objects online?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Use the Split & Diff tool in SmartDevBox. Paste the first JSON in the left pane and the second in the right pane. Changes are highlighted line-by-line in real time.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Can I add my own tools to SmartDevBox?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes. SmartDevBox has a plugin system that lets developers register custom tools by providing a name, a detector function (returns a confidence score 0–1), and a transformer function. Custom tools appear in the sidebar alongside the 91 built-in tools and participate in auto-detection.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Does SmartDevBox work offline?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'SmartDevBox is a Progressive Web App (PWA). All 91 tools run entirely client-side with no server dependency. Once the page is loaded, the tools work without an internet connection. AI mode requires connectivity.',
                    },
                  },
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'SmartDevBox',
                    item: BASE_URL,
                  },
                ],
              },
            ]),
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
