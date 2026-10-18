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
        source: '/',
        destination: '/get-started/what-is-naagmani',
        permanent: false,
      },
      {
        source: '/docs',
        destination: '/get-started/what-is-naagmani',
        permanent: true,
      },
      {
        source: '/docs/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/get-started',
        destination: '/get-started/what-is-naagmani',
        permanent: true,
      },
      {
        source: '/concepts',
        destination: '/concepts/organizations',
        permanent: true,
      },
      {
        source: '/developer-portal',
        destination: '/developer-portal/overview',
        permanent: true,
      },
      {
        source: '/api',
        destination: '/api/overview',
        permanent: true,
      },
      {
        source: '/marketplace',
        destination: '/marketplace/overview',
        permanent: true,
      },
      {
        source: '/build',
        destination: '/build/sdks/overview',
        permanent: true,
      },
      {
        source: '/deploy',
        destination: '/deploy/docker-compose',
        permanent: true,
      },
      {
        source: '/features/smart-routing',
        destination: '/developer-portal/operations/attempts',
        permanent: false,
      },
      {
        source: '/features/service-tokens',
        destination: '/developer-portal/projects/service-tokens',
        permanent: false,
      },
    ];
  },
};

export default withMDX(nextConfig);
