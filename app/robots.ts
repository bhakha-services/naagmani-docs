import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/search-private', '/_next/'],
    },
    sitemap: 'https://docs.naagmani.app/sitemap.xml',
  };
}
