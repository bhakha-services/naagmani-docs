# Foundational Concepts

Before diving into quickstarts and configuration, review the foundational terms used throughout the Naagmani documentation:

---

## Multi-Tenancy Hierarchy

1. **Organization (`org_...`)**: The root enterprise boundary. Billing, member accounts, global compliance policies, and plugin entitlements are defined at the organization level.
2. **Project (`proj_...`)**: A distinct product, service, or team workspace within an organization (e.g. `customer-support-bot`, `internal-search`).
3. **Environment (`env_...`)**: An isolated deployment tier within a project (e.g. `development`, `staging`, `production`). API keys and provider credentials are scoped to specific environments.

---

## Core Runtime Concepts

- **Naagmani API Key (`nm_live_...` / `nm_test_...`)**: The bearer token used by client applications to authenticate against Naagmani OS. Scoped to a specific project and environment.
- **BYOK (Bring Your Own Key)**: Provider credentials (e.g. OpenAI API keys, Anthropic auth tokens) configured securely in Naagmani to allow direct upstream provider billing without markups.
- **Upstream Provider**: The external LLM hosting vendor (e.g. OpenAI, Anthropic, Google, Azure, Mistral, self-hosted vLLM).
- **Virtual Model / Alias**: A logical model name (e.g. `gpt-4o`, `smart-router`, `fast-eval`) that can map to multiple weighted or prioritized provider backends.
- **Hook Pipeline**: Lifecycle execution checkpoints (`request.before`, `request.after`, `response.before`, `response.after`) where plugins intercept, inspect, modify, or block traffic.

---

## Next Steps

- Generate your first key: [Quickstart Guide](../quickstart/overview.md)
- Learn more about projects: [Organizations and Projects](../concepts/organizations.md)
