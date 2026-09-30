const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const docsDir = path.resolve(__dirname, '../docs');

function writeDoc(relPath, content) {
  const fullPath = path.join(docsDir, relPath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`[Concepts] Updated: ${relPath}`);
}

// 1. Organizations
writeDoc('concepts/organizations.md', `
# Organizations & Tenancy

In Naagmani, the **Organization** represents the highest-level entity in the tenant hierarchy. It serves as the administrative, billing, and governance container for an enterprise or development team.

\`\`\`mermaid
graph TD
    Org["Organization (Acme Corp)"]
    Org --> P1["Project: E-Commerce Search"]
    Org --> P2["Project: Internal Copilot"]
    Org --> Mem["Team Members (Roles & RBAC)"]
    Org --> Bgt["Organization Budget Cap ($5,000/mo)"]
    Org --> Vault["BYOK Encrypted Credential Vault"]
\`\`\`

---

## Key Responsibilities of an Organization

1. **Billing & Budget Authority**: Governs the root spending limit for all underlying projects and members. Project and Member limits can never exceed the Organization's limit.
2. **Team & Membership Access**: Manage user accounts with strict Role-Based Access Control (RBAC):
   - **Owner**: Full administrative control, billing ownership, and destructive action permissions.
   - **Admin**: Project creation, member invitations, credential management, and routing policy configuration.
   - **Member**: Access to assigned projects, playgrounds, and issued service tokens.
3. **Bring-Your-Own-Key (BYOK) Vault**: Store root provider API keys (OpenAI, Anthropic, Gemini, DeepSeek) centrally with AES-256-GCM encryption.
4. **Audit Trail**: Aggregated compliance logging capturing every authentication event, key creation, member role change, and high-level routing operation.

---

## Managing in the Developer Portal

Organizations can be managed directly in the **Developer Portal**:
- **Switch Organizations**: Use the top-left Organization dropdown selector in the navigation bar.
- **Organization Settings**: Navigate to [{{DEVELOPER_PORTAL_URL}}/settings]({{DEVELOPER_PORTAL_URL}}/settings) to update organization name, billing details, and view subscription tier.
- **Members Directory**: Manage engineers and permissions at [{{DEVELOPER_PORTAL_URL}}/members]({{DEVELOPER_PORTAL_URL}}/members).

---

## Next Steps

- Learn about project boundaries: [Projects & Workloads](projects.md)
- Configure team members: [Members & Access Control](../developer-portal/members.md)
`);

// 2. Projects
writeDoc('concepts/projects.md', `
# Projects & Workloads

A **Project** is an isolated workspace within an Organization dedicated to a specific application, microservice, or AI initiative.

\`\`\`mermaid
graph TD
    Project["Project: Customer Support AI"]
    Project --> Env1["Development Environment"]
    Project --> Env2["Staging Environment"]
    Project --> Env3["Production Environment"]
    Project --> Agents["Autonomous Agents"]
    Project --> Tools["Registered Tools & MCP Servers"]
    Project --> ST["Project Service Tokens"]
\`\`\`

---

## Why Use Projects?

Projects enforce strict resource and credential isolation between different workloads:
- **Credential Segregation**: API Keys and Service Tokens created in *Project A* cannot access models or resources in *Project B*.
- **Autonomous Agents**: Agents, prompt templates, skills, and MCP tools are scoped to the project.
- **Budget Allocation**: Assign specific monthly budgets to individual projects to prevent runaway costs from affecting other teams.

---

## Project Structure

Every Project contains:
- **Environments**: \`Development\`, \`Staging\`, and \`Production\` isolation stages.
- **Service Tokens**: Machine-to-machine credentials scoped to the project.
- **Routing Policies**: Custom fallback cascades and latency/cost optimization rules.
- **Agent Ecosystem**: Autonomous agents, tools, skills, and MCP server integrations.

---

## Managing in the Developer Portal

1. Navigate to the **Projects** list at [{{DEVELOPER_PORTAL_URL}}/projects]({{DEVELOPER_PORTAL_URL}}/projects).
2. Click **+ Create Project** to initialize a new workspace.
3. Select any project to view its dedicated dashboard, service tokens, agents, and analytics.

---

## Next Steps

- Understand environment boundaries: [Environments & Isolation](environments.md)
- Issue project credentials: [Project Service Tokens](project-service-tokens.md)
`);

// 3. Environments
writeDoc('concepts/environments.md', `
# Environments & Isolation

An **Environment** is a deployment stage within a Project. Naagmani provides native support for multi-stage lifecycle environments (typically \`Development\`, \`Staging\`, and \`Production\`).

\`\`\`mermaid
graph LR
    subgraph Dev["Development"]
        DevToken["nsk_test_..."] --> DevModel["gpt-4o-mini (Cost Optimized)"]
    end
    subgraph Staging["Staging"]
        StageToken["nst_stage_..."] --> StageModel["claude-3-5-sonnet (Testing)"]
    end
    subgraph Prod["Production"]
        ProdToken["nst_live_..."] --> ProdModel["gpt-4o + Fallback Cascade"]
    end
\`\`\`

---

## Environment Isolation Guarantees

1. **Secret & Key Isolation**: Service tokens issued for \`Development\` are strictly rejected in \`Production\`.
2. **Dedicated Routing Rules**: Use inexpensive, fast models in Development while enforcing strict high-availability fallback cascades in Production.
3. **Telemetry & Quota Tagging**: Usage analytics and audit logs are tagged by environment, enabling clean cost breakdown across pre-production and production infrastructure.

---

## Managing Environments

- In the Developer Portal, environments are selectable from the project navigation sidebar.
- When generating **Project Service Tokens** or **API Keys**, you must explicitly bind the credential to its target environment.

---

## Next Steps

- Learn about API keys: [API Keys & Vault](api-keys.md)
- Learn about service tokens: [Project Service Tokens](project-service-tokens.md)
`);

// 4. API Keys
writeDoc('concepts/api-keys.md', `
# API Keys & Vault Security

Naagmani uses **API Keys** to authenticate incoming traffic from client applications, SDKs, and backend services to the Gateway Data Plane.

---

## Key Architecture & Vaulting

\`\`\`mermaid
graph TD
    User["Client App"] -->|Bearer nsk_live_...| GW["Naagmani Gateway"]
    GW -->|Lookup SHA-256 Hash| HashStore["In-Memory Cache / Redis"]
    GW -->|Decrypt Upstream Provider Key| Vault["AES-256-GCM Key Vault"]
    GW -->|Forward Upstream Request| Provider["OpenAI / Anthropic"]
\`\`\`

### 1. Zero Secret Storage
When an API key (\`nsk_live_...\`) is generated:
- The full key is displayed **once** to the user and never stored in plain text.
- Naagmani computes a cryptographic **SHA-256 hash** of the token for fast database lookup and verification.

### 2. Provider Key Masking
Client applications never need upstream OpenAI, Anthropic, or Gemini API keys. The gateway securely injects the vaulted provider credentials on the fly, eliminating secret leakage risks in frontend builds.

---

## Key Lifecycle Management

- **Create Key**: Generate keys with human-readable names and environment tags.
- **Revoke Key**: Instantly revoke keys from the Developer Portal. Revocation takes effect across all gateway instances in under 1 second.
- **Audit Logging**: Every key creation, modification, and revocation is recorded in the immutable compliance audit log.

---

## Next Steps

- Learn about scoped machine tokens: [Project Service Tokens](project-service-tokens.md)
- Manage keys in the UI: [Developer Portal API Keys](../quickstart/api-key.md)
`);

// 5. Project Service Tokens (Comprehensive Canonical Guide)
writeDoc('concepts/project-service-tokens.md', `
# Project Service Tokens (PST)

**Project Service Tokens** are high-security, machine-to-machine credentials engineered for backend services, automated CI/CD pipelines, background worker processes, and autonomous agent swarms.

Unlike standard API keys, Project Service Tokens provide fine-grained **capability matrices**, **time-to-live (TTL) expirations**, **environment scoping**, and **human member attribution**.

\`\`\`mermaid
graph TD
    subgraph PST["Project Service Token (nst_live_...)"]
        Cap["Capability Matrix (inference:chat, tools:execute)"]
        Env["Environment Scope (Production)"]
        TTL["TTL Expiration (e.g. 30 Days)"]
        Attribution["Member Attribution (User: Rahul)"]
    end

    PST --> GW["Naagmani Gateway Engine"]
    GW --> Authorize{"Capabilities & Quota OK?"}
    Authorize -->|Yes| Upstream["Execute AI Inference / MCP Tools"]
    Authorize -->|No| Reject["HTTP 403 Forbidden"]
\`\`\`

---

## Core Features & Guarantees

### 1. Fine-Grained Capability Matrix
Every Project Service Token specifies an explicit list of allowed capabilities. Requests attempting actions outside the capability scope are rejected at the gateway:

| Capability | Allowed Operations |
| :--- | :--- |
| \`inference:chat\` | Standard and streaming chat completions (\`/v1/chat/completions\`). |
| \`inference:embeddings\` | Vector embeddings generation (\`/v1/embeddings\`). |
| \`models:read\` | Model catalog listing and provider capability discovery. |
| \`tools:execute\` | Invoking registered HTTP/gRPC tools and functions. |
| \`mcp:access\` | Connecting to Model Context Protocol (MCP) servers and tools. |
| \`skills:read\` | Reading agent prompts, skills, and templates. |

---

### 2. Time-To-Live (TTL) & Expiration Lifecycles
Tokens can be configured with strict expiration policies to satisfy enterprise security compliance:
- **Preset Durations**: 7 days, 30 days, 90 days, 365 days.
- **Custom Expiration**: Any ISO 8601 RFC3339 timestamp.
- **Never Expire**: Long-lived background infrastructure tokens (100 years).

Expired tokens are automatically rejected with \`HTTP 401 Unauthorized: token_expired\`.

---

### 3. Member Attribution for FinOps & Audit
In enterprise environments, service tokens can be attributed to a specific **Team Member**:
- Usage incurred by the token counts directly towards the individual member's spending cap.
- Security audit logs show both the service token identity and the responsible engineer.

---

### 4. Instant Revocation
If a token is compromised, clicking **Revoke** in the Developer Portal immediately invalidates the token across all gateway data planes with sub-second propagation.

---

## Using Service Tokens

Pass your token in the standard HTTP \`Authorization\` header:

\`\`\`bash
curl -X POST "{{GATEWAY_URL}}/v1/chat/completions" \\
  -H "Authorization: Bearer nst_live_9f8a2b1c3d4e..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello via Service Token!"}]
  }'
\`\`\`

---

## Next Steps

- Portal management guide: [Developer Portal Service Tokens](../developer-portal/service-tokens.md)
- API endpoint documentation: [Service Tokens API Reference](../api/service-tokens.md)
`);

// 6. Providers
writeDoc('concepts/providers.md', `
# Model Providers & Adapters

Naagmani provides native adapters for all leading commercial model providers as well as self-hosted open-source inference runtimes.

\`\`\`mermaid
graph LR
    GW["Naagmani Gateway"] --> OAI["OpenAI (GPT-4o, o3-mini)"]
    GW --> Anth["Anthropic (Claude 3.5 Sonnet, Haiku)"]
    GW --> Gem["Google Gemini (2.5 Flash, Pro)"]
    GW --> DS["DeepSeek (V3, R1)"]
    GW --> Self["Self-Hosted (vLLM, Ollama, TGI)"]
\`\`\`

---

## Supported Providers

| Provider | Supported Models | Protocol Capabilities |
| :--- | :--- | :--- |
| **OpenAI** | \`gpt-4o\`, \`gpt-4o-mini\`, \`o1\`, \`o3-mini\`, \`text-embedding-3-small\` | Chat, Streaming SSE, Tool Calling, Vision, JSON Schema |
| **Anthropic** | \`claude-3-5-sonnet-20241022\`, \`claude-3-5-haiku-20241022\`, \`claude-3-opus\` | Chat, Streaming SSE, Tool Calling, Vision |
| **Google Gemini** | \`gemini-2.5-flash\`, \`gemini-2.5-pro\`, \`gemini-1.5-flash\` | Chat, Streaming SSE, Tool Calling, Multimodal |
| **DeepSeek** | \`deepseek-chat\` (V3), \`deepseek-reasoner\` (R1) | Chat, Reasoning Streams, Low Cost Inference |
| **Self-Hosted** | Any HuggingFace model hosted via **vLLM**, **Ollama**, or **TGI** | OpenAI-compatible endpoint translation |

---

## Universal Protocol Normalization

Every provider utilizes different parameter formats, role definitions, and error schemas. Naagmani's gateway engine normalizes:
- Message roles (\`system\`, \`user\`, \`assistant\`, \`tool\`).
- Function and tool call schemas.
- Server-Sent Events (SSE) delta structures.
- Upstream HTTP error codes and overload responses.

---

## Next Steps

- Learn about model aliases: [Models & Virtual Aliases](models.md)
- Configure provider keys: [BYOK & Credential Pools](../developer-portal/credential-pools.md)
`);

// 7. Models
writeDoc('concepts/models.md', `
# Models & Virtual Aliases

Naagmani allows engineering teams to decouple application code from specific underlying model strings using **Virtual Model Aliases**.

---

## What is a Virtual Model Alias?

Instead of hardcoding \`gpt-4o\` or \`claude-3-5-sonnet-20241022\` into your backend repositories, your applications request virtual tier aliases:

\`\`\`mermaid
graph LR
    App["Application Code"] -->|model: smart-tier| Router["Naagmani Router"]
    Router -->|Rule: Primary| C35["Claude 3.5 Sonnet"]
    Router -->|Rule: Fallback| G4O["OpenAI GPT-4o"]
\`\`\`

### Common Alias Patterns:
- **\`smart-tier\`**: Resolves to state-of-the-art reasoning models (e.g., Claude 3.5 Sonnet $\\rightarrow$ GPT-4o).
- **\`fast-tier\`**: Resolves to ultra-low-latency, lightweight models (e.g., Gemini 2.5 Flash $\\rightarrow$ GPT-4o-mini).
- **\`cheap-tier\`**: Resolves to high-throughput, cost-efficient models (e.g., DeepSeek V3).

---

## Benefits of Virtual Aliases

1. **Instant Model Upgrades**: When a new model version is released (e.g. GPT-5), update the alias target in the Developer Portal with zero application downtime or deployments.
2. **Zero Code Refactoring**: Switch primary providers across hundreds of microservices instantly.
3. **Environment-Specific Routing**: Route \`smart-tier\` to an inexpensive model in Development and the premier flagship model in Production.

---

## Next Steps

- Configure routing rules: [Smart Model Routing](routing.md)
- Test models interactively: [Model Playground](../developer-portal/model-playground.md)
`);

// 8. Routing
writeDoc('concepts/routing.md', `
# Smart Model Routing & Fallbacks

Naagmani's **Smart Model Router** ensures that every inference request is executed with the optimal balance of availability, latency, and cost.

\`\`\`mermaid
graph TD
    Req["Incoming Inference Request"] --> Policy["Routing Policy Evaluation"]
    Policy --> Strat{"Strategy"}
    Strat -->|Lowest Cost| CostRoute["Route to Lowest $/Token Provider"]
    Strat -->|Lowest Latency| LatRoute["Route to Fastest Responsive Provider"]
    Strat -->|Priority Cascade| PriRoute["Dispatch Primary -> Fallback 1 -> Fallback 2"]
\`\`\`

---

## Routing Strategies

### 1. Priority Fallback Cascade
Specifies an ordered list of providers and models. If the primary provider fails (HTTP 5xx, 429 Rate Limit, 529 Overload), Naagmani automatically dispatches to the secondary provider within milliseconds.

### 2. Lowest Cost Optimization
Dynamically compares estimated token costs across capable providers and dispatches to the cheapest available provider satisfying your minimum model tier.

### 3. Lowest Latency Optimization
Monitors real-time Time to First Token (TTFT) and adapter roundtrip times, sending traffic to the lowest-latency responsive provider.

---

## Circuit Breakers & Health Probing

To avoid sending traffic to degraded providers:
- **Circuit Breaker**: Automatically trips if a provider exceeds an error threshold (e.g., 5 consecutive failures), temporarily pausing dispatches for a cooldown window.
- **Background Health Probes**: Sends lightweight synthetic requests every 30 seconds to verify recovery before restoring production traffic.

---

## Next Steps

- Inspect routing telemetry: [Provider Attempts](../quickstart/provider-attempts.md)
- Configure visual policies: [Smart Routing Policies](../developer-portal/routing-policies.md)
`);

// 9. Usage
writeDoc('concepts/usage.md', `
# Usage & Token Metering

Naagmani provides authoritative, real-time telemetry on every token consumed across your organization.

---

## Key Telemetry Metrics

\`\`\`mermaid
graph LR
    Req["Request"] --> TTFT["Time to First Token (TTFT)"]
    Req --> Duration["Total Adapter Duration"]
    Req --> Tokens["Prompt / Completion / Total Tokens"]
    Req --> Cost["COGS Provider Cost ($ USD)"]
\`\`\`

1. **Token Counts**: Prompt tokens, Completion tokens, and Total tokens parsed from provider payloads or computed via tokenizer accumulators.
2. **Time to First Token (TTFT)**: Crucial metric for user-facing streaming applications measuring the delay before the first token chunk arrives.
3. **Calculated COGS (Cost of Goods Sold)**: Real-time calculation of provider costs using published per-million token pricing models.
4. **Authoritative Usage Flag**: Distinguishes between provider-verified token counts and estimated streaming heuristics.

---

## Inspecting Telemetry

- **Usage Dashboard**: View aggregate trends, charts, and project breakdowns at [{{DEVELOPER_PORTAL_URL}}/usage]({{DEVELOPER_PORTAL_URL}}/usage).
- **Attempts Table**: Inspect granular per-request dispatch logs at [{{DEVELOPER_PORTAL_URL}}/attempts]({{DEVELOPER_PORTAL_URL}}/attempts).

---

## Next Steps

- Learn about spending budgets: [FinOps & Budget Hierarchy](billing.md)
- API Reference for attempts: [Provider Attempts API](../api/attempts.md)
`);

// 10. Billing & Budgets
writeDoc('concepts/billing.md', `
# FinOps & Budget Hierarchy

Naagmani features an authoritative **Hierarchical Budget Engine** that enforces spending controls across your organizational hierarchy.

---

## The 3-Tier Budget Hierarchy

\`\`\`mermaid
graph TD
    Org["1. Organization Budget ($5,000 / month)"]
    Org --> Proj["2. Project Budget ($1,000 / month)"]
    Proj --> Mem["3. Member / Service Token Budget ($200 / month)"]
\`\`\`

### Hierarchy Rules & Guarantees:
1. **Parent Cap Rule**: A child entity (Member or Project) **cannot** have a budget limit that exceeds its parent (Organization). Setting a Member budget to $30,000 when the Organization budget is $3,000 will be rejected with an immediate \`HTTP 400 Bad Request\`.
2. **Inheritance Flow**: If a Member or Project has no explicit budget set, workloads automatically inherit the parent Organization budget.
3. **Hard Ceiling Enforcement**: When an entity hits its budget threshold, inference requests are blocked with \`HTTP 429 Quota Exceeded\`, protecting your company from unexpected provider invoices.

---

## Daily vs Monthly Budget Limits

- **Monthly Budget**: Enforces aggregate limits over the monthly billing calendar.
- **Daily Budget**: Prevents sudden cost spikes from runaway recursive agent loops or load testing.

---

## Next Steps

- Manage budgets in Developer Portal: [FinOps & Budget Controls](../developer-portal/finops-budgets.md)
- Configure member budgets: [Members & Access Control](../developer-portal/members.md)
`);

// 11. Plugins
writeDoc('concepts/plugins.md', `
# Plugin System & Lifecycle

Naagmani's plugin engine allows developers to intercept, modify, and guard AI requests using an out-of-process, language-independent architecture (\`naagmani.plugin/v1\`).

\`\`\`mermaid
graph LR
    Client --> Hook1["Before Ingest Hook"]
    Hook1 --> Guard["Guardrails & DLP"]
    Guard --> Hook2["Before Dispatch Hook"]
    Hook2 --> LLM["Provider Inference"]
    LLM --> Hook3["After Complete Hook"]
    Hook3 --> Client
\`\`\`

---

## Key Capabilities

1. **Multi-Language SDKs**: Author plugins in **Go**, **TypeScript/Node.js**, or **Python**.
2. **Isolated Sandboxing**: Plugins run in isolated worker processes, ensuring custom code cannot crash the core gateway engine.
3. **Execution Hooks**:
   - \`before_ingest\`: Inspect incoming headers, validate custom tokens.
   - \`before_dispatch\`: Mask sensitive PII/DLP data, inject system context, RAG vector retrieval.
   - \`after_complete\`: Sanitize model responses, log analytics, trigger downstream webhooks.

---

## Next Steps

- Deep dive into plugin development: [Plugin Development Guide](../plugins/overview.md)
- Plugin manifest specification: [Plugin Manifest](../plugins/manifest.md)
`);

console.log('Finished writing Core Concepts documentation.');
