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
          { title: 'Documentation & Standards', href: '/docs/introduction/standards' },
        ],
      },
      {
        title: 'Quickstart',
        items: [
          { title: 'Quickstart Overview', href: '/docs/quickstart/overview' },
          { title: 'Creating API Keys', href: '/docs/quickstart/api-key' },
          { title: 'Sending First Request', href: '/docs/quickstart/first-request' },
          { title: 'Streaming Responses', href: '/docs/quickstart/streaming' },
          { title: 'Execution Trace & Telemetry', href: '/docs/quickstart/provider-attempts', badge: 'New' },
        ],
      },
    ],
  },
  {
    title: 'CORE CONCEPTS',
    items: [
      { title: 'Organizations & Hierarchy', href: '/docs/concepts/organizations' },
      { title: 'Projects & Workloads', href: '/docs/concepts/projects' },
      { title: 'Environments & Isolation', href: '/docs/concepts/environments' },
      { title: 'API Keys & Vault', href: '/docs/concepts/api-keys' },
      { title: 'Project Service Tokens', href: '/docs/concepts/project-service-tokens', badge: 'New' },
      { title: 'Model Providers & Adapters', href: '/docs/concepts/providers' },
      { title: 'Models & Virtual Aliases', href: '/docs/concepts/models' },
      { title: 'Smart Model Routing', href: '/docs/concepts/routing' },
      { title: 'Usage & Token Metering', href: '/docs/concepts/usage' },
      { title: 'FinOps & Budget Hierarchy', href: '/docs/concepts/billing' },
      { title: 'Plugin System & Lifecycle', href: '/docs/concepts/plugins' },
    ],
  },
  {
    title: 'DEVELOPER PORTAL',
    items: [
      { title: 'Portal Overview & Navigation', href: '/docs/developer-portal/overview' },
      { title: 'Members & Access Control', href: '/docs/developer-portal/members', badge: 'Updated' },
      { title: 'Project Service Tokens', href: '/docs/developer-portal/service-tokens', badge: 'New' },
      { title: 'Autonomous Agents & Assistants', href: '/docs/developer-portal/agents', badge: 'New' },
      { title: 'Agent Playground', href: '/docs/developer-portal/agent-playground', badge: 'New' },
      { title: 'Skills & Orchestration', href: '/docs/developer-portal/skills', badge: 'New' },
      { title: 'Tools & Working Flow', href: '/docs/developer-portal/tools', badge: 'New' },
      { title: 'MCP Servers & Transports', href: '/docs/developer-portal/mcp-servers', badge: 'New' },
      { title: 'MCP Tool Policies', href: '/docs/developer-portal/mcp-policies', badge: 'New' },
      { title: 'AI Guardrails & Governance', href: '/docs/developer-portal/guardrails', badge: 'New' },
      { title: 'Model Playground', href: '/docs/developer-portal/model-playground', badge: 'New' },
      { title: 'BYOK & Credential Pools', href: '/docs/developer-portal/credential-pools' },
      { title: 'Smart Routing Policies', href: '/docs/developer-portal/routing-policies', badge: 'New' },
      { title: 'Provider Attempt Accounting', href: '/docs/developer-portal/attempts', badge: 'New' },
      { title: 'FinOps & Budget Controls', href: '/docs/developer-portal/finops-budgets' },
      { title: 'Security Audit Logs', href: '/docs/developer-portal/audit-logs' },
      { title: 'CLI Developer Guide', href: '/docs/developer-portal/cli-workflow' },
    ],
  },
  {
    title: 'API REFERENCE',
    items: [
      { title: 'API Overview & Standards', href: '/docs/api/overview' },
      { title: 'Authentication & Headers', href: '/docs/api/authentication' },
      { title: 'Chat Completions', href: '/docs/api/chat-completions', badge: 'v1' },
      { title: 'Streaming (SSE)', href: '/docs/api/streaming' },
      { title: 'Embeddings', href: '/docs/api/embeddings' },
      { title: 'Project Service Tokens API', href: '/docs/api/service-tokens', badge: 'New' },
      { title: 'Provider Attempts API', href: '/docs/api/attempts', badge: 'New' },
      { title: 'FinOps & Budgets API', href: '/docs/api/budgets', badge: 'New' },
      { title: 'Responses & Payload Formats', href: '/docs/api/responses' },
      { title: 'Errors & Status Codes', href: '/docs/api/errors' },
    ],
  },
  {
    title: 'PLUGINS & HDKs',
    items: [
      { title: 'Plugin Overview', href: '/docs/plugins/overview' },
      { title: 'Architecture & Isolation', href: '/docs/plugins/architecture' },
      { title: 'Plugin Manifest (plugin.json)', href: '/docs/plugins/manifest' },
      { title: 'Wire Protocol (v1)', href: '/docs/plugins/protocol' },
      { title: 'Plugin Lifecycle', href: '/docs/plugins/lifecycle' },
      { title: 'Execution Hooks', href: '/docs/plugins/hooks' },
      { title: 'Permissions & Security', href: '/docs/plugins/permissions' },
      { title: 'Plugin Development Guide', href: '/docs/plugins/development' },
      { title: 'Testing & Validation', href: '/docs/plugins/testing' },
      { title: 'Packaging & Publishing', href: '/docs/plugins/publishing' },
    ],
  },
  {
    title: 'SDKs',
    items: [
      { title: 'Go SDK & HDK', href: '/docs/sdk/go' },
      { title: 'Node.js / TypeScript SDK', href: '/docs/sdk/node' },
      { title: 'Python SDK', href: '/docs/sdk/python' },
    ],
  },
  {
    title: 'CLI MANUAL',
    items: [
      { title: 'Installation & Setup', href: '/docs/cli/installation' },
      { title: 'Authentication', href: '/docs/cli/authentication' },
      { title: 'Commands Reference', href: '/docs/cli/commands' },
      { title: 'Plugin Management', href: '/docs/cli/plugins' },
      { title: 'Diagnostics & Troubleshooting', href: '/docs/cli/troubleshooting' },
    ],
  },
  {
    title: 'INTEGRATIONS',
    items: [
      { title: 'OpenAI Integration', href: '/docs/integrations/openai' },
      { title: 'Anthropic Claude', href: '/docs/integrations/anthropic' },
      { title: 'Google Gemini', href: '/docs/integrations/google' },
      { title: 'DeepSeek', href: '/docs/integrations/deepseek' },
      { title: 'Self-Hosted (Ollama & vLLM)', href: '/docs/integrations/other-providers' },
    ],
  },
  {
    title: 'SECURITY & GOVERNANCE',
    items: [
      { title: 'Security Architecture', href: '/docs/security/overview' },
      { title: 'Authentication & BYOK', href: '/docs/security/authentication' },
      { title: 'Authorization & RBAC', href: '/docs/security/authorization' },
      { title: 'Tenant & Sandbox Isolation', href: '/docs/security/isolation' },
      { title: 'Data Protection & DLP', href: '/docs/security/data-protection' },
      { title: 'Audit Trail & Compliance', href: '/docs/security/audit-logs' },
    ],
  },
  {
    title: 'PRODUCTION OPERATIONS',
    items: [
      { title: 'Production Overview', href: '/docs/production/overview' },
      { title: 'High Availability & Failover', href: '/docs/production/reliability' },
      { title: 'Rate Limiting & Quotas', href: '/docs/production/rate-limits' },
      { title: 'Traffic Routing Strategies', href: '/docs/production/routing' },
      { title: 'Observability & Metrics', href: '/docs/production/observability' },
      { title: 'Scaling & Concurrency', href: '/docs/production/scaling' },
    ],
  },
  {
    title: 'MARKETPLACE',
    items: [
      { title: 'Marketplace Overview', href: '/docs/marketplace/overview' },
      { title: 'Installing Plugins', href: '/docs/marketplace/installing-plugins' },
      { title: 'Publishing to Marketplace', href: '/docs/marketplace/publishing' },
      { title: 'Visibility & Trust Scopes', href: '/docs/marketplace/plugin-visibility' },
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
