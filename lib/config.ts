const isProd = process.env.NODE_ENV === 'production';

export const siteConfig = {
  name: 'Naagmani Documentation',
  shortName: 'Naagmani Docs',
  title: 'Naagmani Documentation — AI Runtime Platform & Gateway',
  description:
    'Official developer documentation, architectural guides, API references, CLI manuals, and Plugin SDK guides for Naagmani — The AI Runtime for your applications.',
  
  // Production URL fallback ensures crawlers, canonical links, and OG tags are always valid production URLs
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_DOCS_URL ||
    (isProd ? 'https://docs.naagmani.app' : 'http://localhost:3001')
  ).replace(/\/$/, ''),

  apiUrl: (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (isProd ? 'https://api.naagmani.app' : 'http://localhost:8081')
  ).replace(/\/$/, ''),

  developerPortalUrl: (
    process.env.NEXT_PUBLIC_DEVELOPER_PORTAL_URL ||
    (isProd ? 'https://developer.naagmani.app' : 'http://localhost:3000')
  ).replace(/\/$/, ''),

  githubUrl:
    process.env.NEXT_PUBLIC_GITHUB_REPO_URL ||
    'https://github.com/bhakha-services/naagmani-cli',

  ogImage: '/og-image.png',
  locale: 'en_US',
  author: 'Naagmani Team',
  creator: 'Naagmani Team',
  publisher: 'Bhakha Services',
  twitterHandle: '@naagmani_ai',

  keywords: [
    'AI runtime',
    'AI infrastructure',
    'AI gateway',
    'AI API gateway',
    'LLM gateway',
    'LLM routing',
    'AI model routing',
    'AI provider routing',
    'AI developer platform',
    'AI API infrastructure',
    'AI plugins',
    'MCP gateway',
    'Model Context Protocol',
    'AI security',
    'AI firewall',
    'BYOK vault',
    'LLM observability',
    'AI usage tracking',
    'AI cost management',
    'AI FinOps metering',
    'OpenAI compatible API',
    'Polyglot plugin engine',
    'Naagmani CLI',
    'Naagmani HDK',
  ],

  get domain() {
    try {
      return new URL(this.url).hostname;
    } catch {
      return 'docs.naagmani.app';
    }
  },
};
