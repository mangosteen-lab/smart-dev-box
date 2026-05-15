import type { MetadataRoute } from 'next';

const BASE_URL = 'https://smartdevbox.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date('2025-05-01'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/features/tools`,
      lastModified: new Date('2025-05-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/features/auto-detection`,
      lastModified: new Date('2025-05-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/features/smart-extract`,
      lastModified: new Date('2025-05-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/features/compare`,
      lastModified: new Date('2025-05-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/features/plugins`,
      lastModified: new Date('2025-05-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/features/privacy`,
      lastModified: new Date('2025-05-01'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
