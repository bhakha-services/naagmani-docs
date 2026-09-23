import { MetadataRoute } from 'next';
import { getAllDocSlugs } from '@/lib/docs';
import { siteConfig } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const slugs = getAllDocSlugs();

  const docEntries = slugs.map((slug) => ({
    url: `${baseUrl}/docs/${slug.join('/')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: slug.length === 1 ? 0.9 : 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...docEntries,
  ];
}
