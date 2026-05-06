import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SmartDevBox',
    short_name: 'SmartDevBox',
    description:
      'Free AI-powered developer toolbox. Paste Base64, JSON, JWT, XML, SQL, timestamps, URLs and 80+ formats — auto-detected and processed instantly in the browser.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1117',
    theme_color: '#0f1117',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['developer tools', 'utilities', 'productivity'],
    lang: 'en',
  };
}
