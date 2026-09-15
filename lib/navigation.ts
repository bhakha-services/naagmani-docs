export interface NavItem {
  title: string;
  href: string;
  badge?: string;
  status?: 'available' | 'beta' | 'planned';
}

export interface NavSection {
  title: string;
  items?: NavItem[];
  groups?: {
    title: string;
    items: NavItem[];
  }[];
}

export const navigationData: NavSection[] = [
  {
    title: 'GET STARTED',
    groups: [
      {
        title: 'Introduction',
        items: [
          { title: 'What is Naagmani?', href: '/docs/introduction/what-is-naagmani' },
          { title: 'Why Naagmani?', href: '/docs/introduction/why-naagmani' },
          { title: 'Architecture Overview', href: '/docs/introduction/architecture' },
          { title: 'Foundational Concepts', href: '/docs/introduction/concepts' },
        ],
      },
      {
        title: 'Quickstart',
        items: [
          { title: 'Quickstart Overview', href: '/docs/quickstart/overview' },
          { title: 'Creating API Keys', href: '/docs/quickstart/api-key' },
          { title: 'Sending First Request', href: '/docs/quickstart/first-request' },
          { title: 'Streaming Responses', href: '/docs/quickstart/streaming' },
        ],
      },
    ],
  },
  {
    title: 'CONCEPTS',
    items: [
      { title: 'Organizations', href: '/docs/concepts/organizations' },
      { title: 'Projects', href: '/docs/concepts/projects' },
      { title: 'Environments', href: '/docs/concepts/environments' },
      { title: 'API Keys & Vault', href: '/docs/concepts/api-keys' },
      { title: 'Model Providers', href: '/docs/concepts/providers' },
      { title: 'Models & Virtual Aliases', href: '/docs/concepts/models' },
      { title: 'Smart Model Routing', href: '/docs/concepts/routing' },
      { title: 'Usage & Token Metering', href: '/docs/concepts/usage' },
      { title: 'FinOps & Billing', href: '/docs/concepts/billing' },
      { title: 'Plugin System', href: '/docs/concepts/plugins' },
    ],
  },
  {
    title: 'API REFERENCE',
    items: [
      { title: 'API Overview', href: '/docs/api/overview' },
      { title: 'Authentication', href: '/docs/api/authentication' },
      { title: 'Chat Completions', href: '/docs/api/chat-completions', badge: 'v1' },
      { title: 'Responses & Formats', href: '/docs/api/responses' },
      { title: 'Embeddings', href: '/docs/api/embeddings' },
      { title: 'Errors & Status Codes', href: '/docs/api/errors' },
    ],
  },
  {
    title: 'PLUGINS & HDKs',
    items: [
      { title: 'Plugin Overview', href: '/docs/plugins/overview' },
      { title: 'Architecture & Isolation', href: '/docs/plugins/architecture' },
      { title: 'Plugin Manifest', href: '/docs/plugins/manifest' },
      { title: 'Wire Protocol', href: '/docs/plugins/protocol' },
      { title: 'Plugin Lifecycle', href: '/docs/plugins/lifecycle' },
      { title: 'Execution Hooks', href: '/docs/plugins/hooks' },
      { title: 'Permissions & Security', href: '/docs/plugins/permissions' },
      { title: 'Plugin Development', href: '/docs/plugins/development' },
      { title: 'Testing Plugins', href: '/docs/plugins/testing' },
      { title: 'Publishing Plugins', href: '/docs/plugins/publishing' },
    ],
  },
  {
    title: 'SDKs',
    items: [
      { title: 'Go HDK', href: '/docs/sdk/go' },
      { title: 'Node.js / TypeScript HDK', href: '/docs/sdk/node' },
      { title: 'Python HDK', href: '/docs/sdk/python' },
    ],
  },
  {
    title: 'CLI MANUAL',
    items: [
      { title: 'Installation', href: '/docs/cli/installation' },
      { title: 'Authentication', href: '/docs/cli/authentication' },
      { title: 'Commands Reference', href: '/docs/cli/commands' },
      { title: 'Plugin Management', href: '/docs/cli/plugins' },
      { title: 'Troubleshooting & Diagnostics', href: '/docs/cli/troubleshooting' },
    ],
  },
  {
    title: 'INTEGRATIONS',
    items: [
      { title: 'OpenAI Integration', href: '/docs/integrations/openai' },
      { title: 'Anthropic Claude', href: '/docs/integrations/anthropic' },
      { title: 'Google Gemini', href: '/docs/integrations/google' },
      { title: 'DeepSeek', href: '/docs/integrations/deepseek' },
      { title: 'Other Providers (Ollama, vLLM)', href: '/docs/integrations/other-providers' },
    ],
  },
  {
    title: 'SECURITY & GOVERNANCE',
    items: [
      { title: 'Security Overview', href: '/docs/security/overview' },
      { title: 'Authentication & BYOK', href: '/docs/security/authentication' },
      { title: 'Authorization & RBAC', href: '/docs/security/authorization' },
      { title: 'Tenant & Sandbox Isolation', href: '/docs/security/isolation' },
      { title: 'Data Protection & DLP', href: '/docs/security/data-protection' },
    ],
  },
  {
    title: 'PRODUCTION OPERATIONS',
    items: [
      { title: 'Production Overview', href: '/docs/production/overview' },
      { title: 'High Availability & Failover', href: '/docs/production/reliability' },
      { title: 'Rate Limiting & Quotas', href: '/docs/production/rate-limits' },
      { title: 'Smart Traffic Routing', href: '/docs/production/routing' },
      { title: 'Observability & Metrics', href: '/docs/production/observability' },
      { title: 'Scaling & Benchmarks', href: '/docs/production/scaling' },
    ],
  },
  {
    title: 'MARKETPLACE',
    items: [
      { title: 'Marketplace Overview', href: '/docs/marketplace/overview' },
      { title: 'Installing Plugins', href: '/docs/marketplace/installing-plugins' },
      { title: 'Publishing to Marketplace', href: '/docs/marketplace/publishing' },
      { title: 'Plugin Visibility & Scope', href: '/docs/marketplace/plugin-visibility' },
    ],
  },
  {
    title: 'TROUBLESHOOTING',
    items: [
      { title: 'Common Errors Guide', href: '/docs/troubleshooting/common-errors' },
      { title: 'Authentication Troubleshooting', href: '/docs/troubleshooting/authentication' },
      { title: 'Plugin Debugging', href: '/docs/troubleshooting/plugins' },
      { title: 'CLI Diagnostics', href: '/docs/troubleshooting/cli' },
    ],
  },
];

// Flattened list of all pages for prev/next pager and search
export function getAllPages(): { title: string; href: string; section: string }[] {
  const pages: { title: string; href: string; section: string }[] = [];
  for (const section of navigationData) {
    if (section.items) {
      for (const item of section.items) {
        pages.push({ title: item.title, href: item.href, section: section.title });
      }
    }
    if (section.groups) {
      for (const group of section.groups) {
        for (const item of group.items) {
          pages.push({ title: item.title, href: item.href, section: `${section.title} / ${group.title}` });
        }
      }
    }
  }
  return pages;
}

export function getPager(currentHref: string) {
  const pages = getAllPages();
  const currentIndex = pages.findIndex((p) => p.href === currentHref);
  if (currentIndex === -1) return { prev: null, next: null };
  const prev = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const next = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;
  return { prev, next };
}
