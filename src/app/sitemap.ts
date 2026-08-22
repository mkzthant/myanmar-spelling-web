import fs from 'fs';
import path from 'path';
import type { MetadataRoute } from 'next';

const BASE = 'https://mm-spelling.mnote.pp.ua';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const filePath = path.join(process.cwd(), 'public', 'spelling_data.json');
  const words: { id: number }[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  return [
    {
      url: `${BASE}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...words.map((w) => ({
      url: `${BASE}/word/${w.id}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ];
}
