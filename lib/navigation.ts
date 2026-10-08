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
    items: [
      { title: 'What is Naagmani?', href: '/docs/get-started/what-is-naagmani' },
      { title: 'How Naagmani Works', href: '/docs/get-started/how-it-works' },
      { title: 'Quickstart Guide', href: '/docs/get-started/quickstart' },
      { title: 'Make Your First AI Request', href: '/docs/get-started/first-request' },
    ],
  },
  {
    title: 'DEVELOPER PORTAL',
    items: [
      { title: 'Overview & Dual Scopes', href: '/docs/developer-portal/overview' },
    ],
    groups: [
      {
        title: 'Organization Management',
        items: [
          { title: 'Organizations & Hierarchy', href: '/docs/developer-portal/organization/organizations' },
          { title: 'Portal Users & Access', href: '/docs/developer-portal/organization/users' },
          { title: 'Roles & Permissions (RBAC)', href: '/docs/developer-portal/organization/roles' },
          { title: 'Customer Members', href: '/docs/developer-portal/organization/members' },
          { title: 'Billing & Subscriptions', href: '/docs/developer-portal/organization/billing' },
          { title: 'Providers & Health (BYOK)', href: '/docs/developer-portal/organization/providers', badge: 'Core' },
        ],
      },
      {
        title: 'Projects & Workspaces',
        items: [
          { title: 'Projects & Environments', href: '/docs/developer-portal/projects/projects' },
          { title: 'API Keys & Vault', href: '/docs/developer-portal/projects/api-keys' },
          { title: 'Project Service Tokens', href: '/docs/developer-portal/projects/service-tokens', badge: 'New' },
        ],
      },
      {
        title: 'AI & Capabilities',
        items: [
          { title: 'AI Agents & Assistants', href: '/docs/developer-portal/capabilities/agents' },
          { title: 'Agent Playground', href: '/docs/developer-portal/capabilities/agent-playground' },
          { title: 'Skills', href: '/docs/developer-portal/capabilities/skills' },
          { title: 'Tools Registry', href: '/docs/developer-portal/capabilities/tools' },
          { title: 'Plugins & Local Tools', href: '/docs/developer-portal/capabilities/plugins' },
          { title: 'MCP Servers & Transports', href: '/docs/developer-portal/capabilities/mcp-servers' },
        ],
      },
      {
        title: 'Governance & Routing',
        items: [
          { title: 'Smart Routing Policies', href: '/docs/developer-portal/governance-routing/routing', badge: 'Core' },
          { title: 'MCP Tool Policies', href: '/docs/developer-portal/governance-routing/mcp-policies' },
          { title: 'AI Guardrails & DLP', href: '/docs/developer-portal/governance-routing/guardrails' },
        ],
      },
      {
        title: 'Operations & FinOps',
        items: [
          { title: 'Model Playground', href: '/docs/developer-portal/operations/model-playground' },
          { title: 'Provider Attempts', href: '/docs/developer-portal/operations/attempts', badge: 'New' },
          { title: 'Usage & Token Analytics', href: '/docs/developer-portal/operations/usage' },
          { title: 'FinOps & Budget Controls', href: '/docs/developer-portal/operations/budgets' },
          { title: 'Security Audit Logs', href: '/docs/developer-portal/operations/audit-logs' },
          { title: 'Project Settings', href: '/docs/developer-portal/operations/settings' },
        ],
      },
    ],
  },
  {
    title: 'API REFERENCE',
    items: [
      { title: 'API Overview & Standards', href: '/docs/api/overview' },
      { title: 'Authentication & Headers', href: '/docs/api/authentication' },
      { title: 'Chat Completions', href: '/docs/api/chat-completions', badge: 'v1' },
      { title: 'Streaming (SSE)', href: '/docs/api/streaming' },
      { title: 'Responses API', href: '/docs/api/responses' },
      { title: 'Embeddings API', href: '/docs/api/embeddings' },
      { title: 'Models & Aliases API', href: '/docs/api/models' },
      { title: 'Project Service Tokens API', href: '/docs/api/service-tokens' },
      { title: 'Provider Attempts API', href: '/docs/api/attempts' },
      { title: 'FinOps & Budgets API', href: '/docs/api/budgets' },
      { title: 'Errors & Status Codes', href: '/docs/api/errors' },
    ],
  },
  {
    title: 'MARKETPLACE',
    items: [
      { title: 'Marketplace Overview', href: '/docs/marketplace/overview' },
      { title: 'Discover & Search', href: '/docs/marketplace/discover' },
      { title: 'Installation & Scope', href: '/docs/marketplace/installation' },
      { title: 'Publisher Portal', href: '/docs/marketplace/publishing' },
    ],
  },
  {
    title: 'BUILD WITH NAAGMANI',
    groups: [
      {
        title: 'SDKs',
        items: [
          { title: 'SDK Overview & Libraries', href: '/docs/build/sdks/overview' },
          { title: 'Node.js & TypeScript SDK', href: '/docs/build/sdks/node' },
          { title: 'Python SDK', href: '/docs/build/sdks/python' },
          { title: 'Go SDK', href: '/docs/build/sdks/go' },
        ],
      },
      {
        title: 'HDKs (Plugin Development)',
        items: [
          { title: 'HDK Overview & Architecture', href: '/docs/build/hdks/overview' },
          { title: 'Plugin Manifest (plugin.json)', href: '/docs/build/hdks/manifest' },
          { title: 'Wire Protocol v1', href: '/docs/build/hdks/protocol' },
          { title: 'Plugin Lifecycle & Hooks', href: '/docs/build/hdks/lifecycle' },
          { title: 'Building Plugins Tutorial', href: '/docs/build/hdks/development' },
          { title: 'Testing & Validation', href: '/docs/build/hdks/testing' },
          { title: 'Packaging & Publishing', href: '/docs/build/hdks/publishing' },
        ],
      },
      {
        title: 'CLI Manual',
        items: [
          { title: 'CLI Installation & Setup', href: '/docs/build/cli/installation' },
          { title: 'Authentication & Context', href: '/docs/build/cli/authentication' },
          { title: 'Command Reference', href: '/docs/build/cli/commands' },
          { title: 'Plugin Management Workflow', href: '/docs/build/cli/plugins' },
          { title: 'Diagnostics & Troubleshooting', href: '/docs/build/cli/troubleshooting' },
        ],
      },
    ],
  },
  {
    title: 'DEPLOYMENT & SELF-HOSTING',
    items: [
      { title: 'Docker Compose Deployment', href: '/docs/deploy/docker-compose' },
      { title: 'Coolify Deployment', href: '/docs/deploy/coolify' },
      { title: 'Air-Gapped & Offline Setup', href: '/docs/deploy/offline' },
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
