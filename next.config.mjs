import os from 'node:os';

// `make dev` binds to 0.0.0.0 for remote access. Next 16 blocks dev assets
// (/_next/*, HMR) for any origin other than localhost, which leaves the page
// un-hydrated, so allow this machine's hostname and IPs plus any extra hosts
// listed in DEV_ALLOWED_ORIGINS (comma-separated, wildcards like *.corp.com ok).
// Only affects `next dev`.
// Setting the list drops Next's implicit 127.0.0.1, which Playwright/CI use.
const devOrigins = [
  'localhost',
  '127.0.0.1',
  os.hostname(),
  ...Object.values(os.networkInterfaces())
    .flat()
    .filter((iface) => iface && iface.family === 'IPv4' && !iface.internal)
    .map((iface) => iface.address),
  ...(process.env.DEV_ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: devOrigins,

  // Allow server components to read env vars
  env: {
    NEXT_PUBLIC_AI_ENABLED: process.env.OPENAI_API_KEY ? 'true' : 'false',
  },

  // Compress responses
  compress: true,

  // Optimise package imports — Next.js will tree-shake these barrels and only
  // bundle the specific exports that are actually used.
  experimental: {
    optimizePackageImports: [
      'shiki',
      '@shikijs/core',
      'js-base64',
      'diff',
      'he',
      'prettier',
      'qrcode',
      'jsonpath-plus',
      'sql-formatter',
    ],
  },

  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    return config;
  },
};

export default nextConfig;

