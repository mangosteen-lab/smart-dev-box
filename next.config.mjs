/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow server components to read env vars
  env: {
    NEXT_PUBLIC_AI_ENABLED: process.env.OPENAI_API_KEY ? 'true' : 'false',
  },
  // Suppress warnings for optional peer deps from tool libraries
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
