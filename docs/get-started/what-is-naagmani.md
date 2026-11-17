# What is Naagmani?

Naagmani is an AI gateway and management platform. Applications send inference requests to the gateway; operators use the Developer Portal to configure providers, projects, credentials, routing and access.

## Implemented capabilities

- **Inference:** OpenAI-compatible chat completions, streaming and a Responses endpoint. Supported fields depend on the endpoint, adapter and selected model.
- **Providers:** adapters for OpenAI, Anthropic, Gemini and DeepSeek, plus compatible endpoints configured for self-hosted models.
- **Routing:** direct model selection and configured routing policies, including priority, failover, weighted, cost and latency strategies.
- **Application credentials:** API keys and Project Service Tokens with project/environment context and applicable permissions.
- **Administration:** organizations, projects, environments, portal users, RBAC and project access assignments.
- **Operations:** provider health, request/attempt records, usage and budget controls.
- **Extensions:** plugin lifecycle hooks, tools, skills, agents and MCP integration. Protection and execution behavior depend on enabled plugins, permissions and entitlements.

## Deployment choices

A self-hosted installation runs local authentication and stores its configuration in its own services. The hosted portal signs users in through Accounts. Provider connectivity, licenses and enabled extensions determine which operations are available.

Naagmani does not guarantee a fixed installation time, failover latency, uninterrupted service or regulatory certification. Size and configure the deployment for your workload.

Start with [installation](/deploy/installation), [quickstart](/get-started/quickstart), [API overview](/api/overview) or [plugin development](/build/hdks/development).
