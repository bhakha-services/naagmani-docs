import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/docs/features/smart-routing',
        destination: '/docs/developer-portal/operations/attempts',
        permanent: false,
      },
    ];
  },
};

export default withMDX(nextConfig);
