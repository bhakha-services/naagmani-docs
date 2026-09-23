import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/search-private', '/_next/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
