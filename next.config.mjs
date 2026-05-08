/** @type {import('next').NextConfig} */
const nextConfig = {
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

