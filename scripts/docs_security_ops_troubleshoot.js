const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..', 'docs');

const files = {
  // ==========================================
  // INTEGRATIONS
  // ==========================================
  'integrations/openai.md': `# OpenAI Integration Guide

Naagmani provides seamless, native proxying and intelligent fallback routing for all official OpenAI models, including \`gpt-4o\`, \`gpt-4o-mini\`, \`o1\`, \`o1-mini\`, and \`text-embedding-3-large\`.

---

## Configuration

1. Open **Credential Pools** in the Developer Portal: [http://localhost:3000/credentials](http://localhost:3000/credentials)
2. Click **Add Provider Credential**.
3. Select **OpenAI**, input your \`sk-proj-...\` API key, and configure rate limits or priority weighting.

\`\`\`json
{
  "provider": "openai",
  "api_key": "sk-proj-...",
  "base_url": "https://api.openai.com/v1",
  "weight": 100,
  "max_rpm": 5000
}
\`\`\`

---

## Supported Features

- **Chat Completions & Reasoning Tokens**: Full support for reasoning effort parameters in \`o1\` series models.
- **Function / Tool Calling**: Schema-validated JSON tool invocations.
- **Server-Sent Events (SSE)**: Byte-level chunk forwarding with sub-millisecond overhead.
- **Embeddings**: High-throughput vectorized outputs.

---

## Example Invocations

\`\`\`bash
curl -X POST http://localhost:8080/v1/chat/completions \\
  -H "Authorization: Bearer nst_live_9b2d8819..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Explain vector indexing."}],
    "temperature": 0.7
  }'
\`\`\`

---

## Next Steps

- [Anthropic Claude Integration](/docs/integrations/anthropic)
- [Smart Routing & Cascading](/docs/concepts/routing)
`,

  'integrations/anthropic.md': `# Anthropic Claude Integration

Naagmani transparently bridges OpenAI-compatible client payloads with Anthropic's native Messages API for \`claude-3-5-sonnet-20241022\`, \`claude-3-5-haiku-20241022\`, and \`claude-3-opus-20240229\`.

---

## Automatic Protocol Translation

When a client sends a standard OpenAI JSON body with \`model: "claude-3-5-sonnet-20241022"\`, Naagmani automatically:
1. Extracts \`system\` messages and maps them to Anthropic's top-level \`system\` parameter.
2. Converts \`tools\` definitions into Anthropic tool schemas.
3. Translates \`tool_calls\` and \`tool_results\` into native blocks.
4. Normalizes streaming SSE events into OpenAI-compatible delta chunks.

---

## Credential Setup

Add your \`sk-ant-...\` key in the Portal:
- **Credential Pools**: [http://localhost:3000/credentials](http://localhost:3000/credentials)

---

## Next Steps

- [Google Gemini Integration](/docs/integrations/google)
- [DeepSeek Integration](/docs/integrations/deepseek)
`,

  'integrations/google.md': `# Google Gemini Integration

Connect Google Vertex AI or Google AI Studio Gemini models (\`gemini-1.5-pro\`, \`gemini-1.5-flash\`, \`gemini-2.0-flash\`) through Naagmani's unified endpoint.

---

## Configuration Options

- **Google AI Studio (API Key)**: Pass your Gemini API Key directly into Credential Pools.
- **Google Cloud Vertex AI (Service Account)**: Provide your GCP Service Account JSON key for enterprise VPC peering and strict data locality.

---

## Massive Context Windows (Up to 2M Tokens)

Naagmani streams multi-megabyte prompt payloads directly to Google endpoints with adaptive chunk buffering and zero memory bloat.

---

## Next Steps

- [DeepSeek Integration](/docs/integrations/deepseek)
- [Self-Hosted LLMs (Ollama & vLLM)](/docs/integrations/other-providers)
`,

  'integrations/deepseek.md': `# DeepSeek Integration

Naagmani provides first-class support for DeepSeek's open reasoning and general-purpose models, including \`deepseek-chat\` (V3) and \`deepseek-reasoner\` (R1).

---

## Key Capabilities

- **Chain-of-Thought Streaming**: Dedicated extraction of \`reasoning_content\` blocks alongside final answers.
- **Ultra-Cost Effective Routing**: Route high-volume classification and summary workloads to DeepSeek with automatic fallback to OpenAI or Anthropic upon upstream timeouts.

---

## Setup in Developer Portal

1. Obtain your API Key from the DeepSeek Open Platform.
2. Store the key in [http://localhost:3000/credentials](http://localhost:3000/credentials).
3. Set your routing policy to prefer \`deepseek-chat\` as primary.

---

## Next Steps

- [Self-Hosted LLMs](/docs/integrations/other-providers)
- [Provider Attempt Telemetry](/docs/concepts/providers)
`,

  'integrations/other-providers.md': `# Self-Hosted Models (Ollama, vLLM & LocalAI)

In addition to managed cloud providers, Naagmani allows you to route traffic to self-hosted, air-gapped, or on-premises model servers.

---

## Supported Local Runtimes

- **vLLM**: High-throughput GPU inference engine.
- **Ollama**: Lightweight local model runner.
- **TGI (Text Generation Inference)**: Hugging Face serving engine.
- **LocalAI**: Drop-in OpenAI alternative.

---

## Configuring a Custom Endpoint

In **Credential Pools** ([http://localhost:3000/credentials](http://localhost:3000/credentials)), select **Custom / Self-Hosted**:

\`\`\`json
{
  "provider": "custom_openai",
  "base_url": "http://gpu-cluster.internal:8000/v1",
  "auth_header": "Bearer internal-cluster-secret",
  "models": ["llama-3.3-70b-instruct", "mistral-large-2411"]
}
\`\`\`

---

## Next Steps

- [Security Architecture](/docs/security/overview)
- [High Availability & Failover](/docs/production/reliability)
`,

  // ==========================================
  // SECURITY & GOVERNANCE
  // ==========================================
  'security/overview.md': `# Security & Governance Architecture

Security is the core architectural pillar of Naagmani. Designed for multi-tenant enterprise deployments, Naagmani guarantees absolute credential isolation, least-privilege token access, end-to-end payload encryption, and immutable audit logs.

\`\`\`mermaid
flowchart TD
    subgraph SecurityPerimeter ["Naagmani Security Perimeter"]
        direction TB
        A[Client Request] --> B[TLS 1.3 Termination & WAF]
        B --> C[Project Service Token Authenticator]
        C --> D[RBAC / Cap Enforcement]
        D --> E[Multi-Tenant Context Isolation]
        E --> F[AES-256 Vault Decryption]
        F --> G[PII / DLP Guardrails]
        G --> H[Audited Upstream Dispatch]
    end
\`\`\`

---

## Security Highlights

1. **Hardware-Grade Cryptographic Vault**: Provider API keys and connection secrets are encrypted using AES-256-GCM with envelope encryption.
2. **Short-Lived Service Tokens**: Granular capabilities and automatic TTL expiration.
3. **Zero-Trust Network Model**: Master keys never leak to client code or plugin daemons.
4. **Comprehensive Audit Logs**: Every administrative configuration change and credential retrieval event is permanently journaled.

---

## Next Steps

- [Authentication & BYOK Model](/docs/security/authentication)
- [Role-Based Access Control (RBAC)](/docs/security/authorization)
- [Tenant Isolation & Sandboxing](/docs/security/isolation)
`,

  'security/authentication.md': `# Authentication & BYOK Security

Naagmani separates authentication into two distinct operational planes:

1. **Management / Control Plane**: OAuth2 SSO (Google, GitHub, SAML/OIDC) and Personal Access Tokens for portal users.
2. **Inference / Data Plane**: Project Service Tokens (\`nst_live_...\`) for microservices, background jobs, and agents.

---

## Bring-Your-Own-Key (BYOK) Security Vault

When you register provider API keys in Naagmani:
- Keys are encrypted in memory prior to database persistence.
- Database records store only ciphertext and cryptographic hashes for indexing.
- Key material is decrypted exclusively inside the Data Plane memory enclave during an active provider dispatch and wiped immediately after socket transmission.

---

## Next Steps

- [Role-Based Access Control](/docs/security/authorization)
- [Data Protection & DLP](/docs/security/data-protection)
`,

  'security/authorization.md': `# Role-Based Access Control (RBAC)

Access to organizations, projects, and resources is governed by strict, hierarchical RBAC policies.

---

## Organization Roles

| Role | Permissions |
| :--- | :--- |
| **Owner** | Full administrative rights, organization billing, member management, and workspace deletion. |
| **Admin** | Manage projects, credentials, guardrails, and members. Cannot delete the organization. |
| **Member** | Create and run models, view logs, deploy plugins, and configure project settings. |
| **Viewer** | Read-only access to metrics, logs, and playgrounds. Cannot generate tokens or alter configurations. |

---

## Managing Roles in Portal

Assign roles directly in the Developer Portal:
- **Members**: [http://localhost:3000/members](http://localhost:3000/members)

---

## Next Steps

- [Tenant & Sandbox Isolation](/docs/security/isolation)
- [Security Audit Logs](/docs/security/audit-logs)
`,

  'security/isolation.md': `# Tenant & Sandbox Isolation

To guarantee security in multi-tenant environments, Naagmani enforces strict isolation across multiple layers:

---

## Isolation Dimensions

1. **Organization Isolation**: Logical and cryptographic boundaries preventing cross-tenant data leaks.
2. **Project & Environment Namespaces**: Distinct credential pools and token lifecycles between \`development\`, \`staging\`, and \`production\`.
3. **Plugin Process Sandboxing**: Separate OS process trees with limited system calls and no shared memory.

---

## Next Steps

- [Data Protection & DLP](/docs/security/data-protection)
- [Audit Trail & Compliance](/docs/security/audit-logs)
`,

  'security/data-protection.md': `# Data Protection & DLP

Protecting proprietary enterprise data, user privacy, and compliance integrity is built directly into Naagmani's data pipeline.

---

## Zero Data Retention (ZDR)

Naagmani does **not** persist request prompt contents or generated completions to persistent disk unless explicitly enabled via audit tap configurations. All payload transformations occur purely in-memory.

---

## PII Masking & Guardrail Filters

- Mask Social Security Numbers, phone numbers, and email addresses.
- Redact database connection strings, JWT tokens, and private RSA keys before external model transmission.

Configure guardrails in the Portal:
- **AI Guardrails**: [http://localhost:3000/guardrails](http://localhost:3000/guardrails)

---

## Next Steps

- [Security Audit Logs](/docs/security/audit-logs)
- [Production Operations Overview](/docs/production/overview)
`,

  'security/audit-logs.md': `# Security Audit Logs & Compliance

Every critical action performed across the Naagmani ecosystem is immutably logged for compliance audits (SOC 2, ISO 27001, HIPAA).

---

## Logged Event Types

- **Authentication Events**: Logins, SSO token exchanges, failed password attempts.
- **Credential Mutations**: Key additions, rotations, and revocations.
- **Budget Changes**: Modification of organization, project, or member limits.
- **Plugin Deployments**: Activation, version upgrades, and security rule changes.

---

## Developer Portal Audit Log Viewer

Inspect historical audit records with full actor attribution:
- **Audit Logs**: [http://localhost:3000/audit-logs](http://localhost:3000/audit-logs)

---

## Next Steps

- [Production Operations Overview](/docs/production/overview)
- [High Availability & Failover](/docs/production/reliability)
`,

  // ==========================================
  // PRODUCTION OPERATIONS
  // ==========================================
  'production/overview.md': `# Production Operations Overview

Deploying Naagmani in mission-critical, enterprise production environments requires robust high-availability, rate limiting, comprehensive observability, and scalable infrastructure.

---

## Key Production Capabilities

- **Zero-Downtime Hot Upgrades**: Hot-reload routing policies and credentials without dropping active HTTP/SSE connections.
- **Distributed Rate Limiting**: Redis-backed token bucket algorithm for cluster-wide enforcement.
- **Multi-Region Active-Active**: Deploy across multiple geographic regions with global latency routing.

---

## Next Steps

- [High Availability & Failover](/docs/production/reliability)
- [Rate Limiting & Quotas](/docs/production/rate-limits)
- [Observability & Prometheus Metrics](/docs/production/observability)
`,

  'production/reliability.md': `# High Availability & Failover

Naagmani ensures 99.99% uptime for AI workloads by automatically managing provider outages, rate-limit 429s, and network degradation.

\`\`\`mermaid
flowchart TD
    A[Client Request] --> B[Naagmani Active Gateway]
    B --> C{Primary: OpenAI}
    C -->|200 OK| D[Fast Return]
    C -->|503 Outage / 429 Limit| E[Automated Failover]
    E --> F{Secondary: Anthropic Claude}
    F -->|200 OK| D
    F -->|Timeout| G{Tertiary: Google Gemini}
    G -->|200 OK| D
\`\`\`

---

## Smart Retry Strategies

1. **Exponential Backoff with Jitter**: Prevents thundering herd problems on upstream recovery.
2. **Circuit Breaker Pattern**: Temporarily halts traffic to failing providers to avoid latency cascades.
3. **Attempt Telemetry Tracking**: Logs every hop for automated SLA reporting.

---

## Next Steps

- [Rate Limiting & Quotas](/docs/production/rate-limits)
- [Traffic Routing Strategies](/docs/production/routing)
`,

  'production/rate-limits.md': `# Rate Limiting & Quotas

Protect upstream provider quotas and prevent noisy-neighbor congestion across internal teams.

---

## Rate Limiting Algorithms

1. **Token Bucket Algorithm**: Allows smooth bursts while maintaining steady sustained throughput.
2. **Concurrency Limiter**: Restricts maximum concurrent in-flight requests per project or member.

---

## Configuration

Set rate limits directly per credential in **Credential Pools** ([http://localhost:3000/credentials](http://localhost:3000/credentials)) or per token in **Project Service Tokens** ([http://localhost:3000/service-tokens](http://localhost:3000/service-tokens)).

---

## Next Steps

- [Observability & Metrics](/docs/production/observability)
- [Scaling & Concurrency](/docs/production/scaling)
`,

  'production/routing.md': `# Traffic Routing Strategies

Naagmani supports versatile routing policies tailored to specific organizational goals.

---

## Routing Modes

| Strategy | Description | Best For |
| :--- | :--- | :--- |
| **Lowest Cost** | Automatically selects the cheapest model capable of handling the prompt context. | Batch processing, ETL classification. |
| **Lowest Latency** | Dispatches to the provider with the fastest recent TTFT (Time To First Token). | Real-time chat, autocomplete. |
| **Priority Fallback** | Tries primary provider first, cascading sequentially down fallback list. | Enterprise reliability. |
| **Weighted Round-Robin** | Distributes load proportionately across multiple keys or providers (e.g. 70/30 split). | Canary testing, A/B model evaluations. |

Configure policies in the Portal:
- **Routing Policies**: [http://localhost:3000/routing-policies](http://localhost:3000/routing-policies)

---

## Next Steps

- [Observability & Metrics](/docs/production/observability)
`,

  'production/observability.md': `# Observability & Prometheus Metrics

Gain deep visibility into latency, token usage, error rates, and provider performance.

---

## Metrics Export (Prometheus)

Naagmani exposes standard Prometheus metrics at \`:8081/metrics\`:

\`\`\`text
# TYPE naagmani_http_requests_total counter
naagmani_http_requests_total{status="200",provider="openai",model="gpt-4o"} 14209
naagmani_http_requests_total{status="429",provider="openai",model="gpt-4o"} 12

# TYPE naagmani_ttft_seconds histogram
naagmani_ttft_seconds_bucket{le="0.25",provider="anthropic"} 8400
naagmani_ttft_seconds_bucket{le="0.5",provider="anthropic"} 12100
\`\`\`

---

## Grafana Dashboards

Pre-built dashboards are provided in the official repository under \`/deploy/grafana/\` for instant monitoring of:
- Gateway Throughput & P99 Latency
- Provider Cascade Failures
- Real-Time Budget Burn Rate

---

## Next Steps

- [Scaling & Concurrency](/docs/production/scaling)
- [Marketplace Overview](/docs/marketplace/overview)
`,

  'production/scaling.md': `# Scaling & Concurrency

Architecting Naagmani clusters for hundreds of thousands of concurrent AI streams.

---

## Horizontal Scaling Architecture

Because the Data Plane Gateway is completely **stateless**, you can scale horizontally behind any standard Layer 4/Layer 7 Load Balancer (AWS ALB, NGINX, Cloudflare, Envoy).

\`\`\`mermaid
flowchart TD
    LB[Cloud Load Balancer] --> GW1[Naagmani Gateway Pod 1]
    LB --> GW2[Naagmani Gateway Pod 2]
    LB --> GW3[Naagmani Gateway Pod 3]
    
    GW1 --> Redis[(Redis Cluster: Rate Limits & Locks)]
    GW2 --> Redis
    GW3 --> Redis

    GW1 --> DB[(PostgreSQL / Control Plane)]
    GW2 --> DB
    GW3 --> DB
\`\`\`

---

## Performance Tuning Checklist

1. **OS File Descriptors**: Increase \`ulimit -n 65535\` for high-concurrency SSE connections.
2. **Keep-Alive Pooling**: Enable HTTP/2 connection reuse to upstream LLM providers.
3. **Memory Limits**: Allocate 512MB RAM per 10,000 active concurrent connections.

---

## Next Steps

- [Marketplace Overview](/docs/marketplace/overview)
- [Troubleshooting Common Errors](/docs/troubleshooting/common-errors)
`,

  // ==========================================
  // MARKETPLACE
  // ==========================================
  'marketplace/overview.md': `# Naagmani Marketplace Overview

The **Naagmani Marketplace** is the central discovery catalog for pre-built plugins, specialized AI skills, MCP tool servers, and enterprise guardrails.

---

## Key Categories

1. **Security & DLP**: PII masking, prompt injection defense, compliance sanitizers.
2. **MCP Tool Integrations**: GitHub, Jira, PostgreSQL, Slack, Kubernetes connectors.
3. **Observability & FinOps**: Datadog exporters, Slack cost alert bots.
4. **Agent Skills**: Document summarizers, code reviewers, SQL query generators.

---

## Discover Plugins in Portal

Browse the catalog directly in the Developer Portal:
- **Marketplace**: [http://localhost:3000/plugins](http://localhost:3000/plugins)

---

## Next Steps

- [Installing Plugins](/docs/marketplace/installing-plugins)
- [Publishing to Marketplace](/docs/marketplace/publishing)
`,

  'marketplace/installing-plugins.md': `# Installing Plugins from Marketplace

Adding pre-built capabilities to your Naagmani project takes just one click or a single CLI command.

---

## 1. Installation via Developer Portal

1. Navigate to **Plugins & Marketplace**: [http://localhost:3000/plugins](http://localhost:3000/plugins)
2. Locate your desired plugin (e.g., *PII Redaction Guardrail*).
3. Click **Install to Project**.
4. Select the target Environment (\`production\`, \`staging\`, or \`development\`).
5. Configure custom parameters in the auto-generated JSON schema form.
6. Click **Save & Activate**.

---

## 2. Installation via CLI

\`\`\`bash
naagmani plugins install com.company.pii-guard --env production
\`\`\`

---

## Next Steps

- [Publishing Your Own Plugins](/docs/marketplace/publishing)
- [Plugin Visibility & Scopes](/docs/marketplace/plugin-visibility)
`,

  'marketplace/publishing.md': `# Publishing to the Marketplace

Share your custom plugins and integrations with your organization or the broader global AI developer community.

---

## Publishing Workflow

1. **Develop and Test**: Ensure your plugin passes unit tests and manifest validation.
2. **Package**: Build the multi-platform binary archive.
3. **Publish**: Push to the registry with the desired visibility flag.

\`\`\`bash
naagmani plugins publish ./dist/my-guard-1.0.0.tar.gz \\
  --scope organization \\
  --visibility private
\`\`\`

---

## Review & Certification

Public plugins submitted to the Global Marketplace undergo automated security scanning and sandboxed vulnerability checks prior to public listing.

---

## Next Steps

- [Plugin Visibility & Scopes](/docs/marketplace/plugin-visibility)
- [Troubleshooting Common Errors](/docs/troubleshooting/common-errors)
`,

  'marketplace/plugin-visibility.md': `# Plugin Visibility & Trust Scopes

Control who can discover, install, and execute your published plugins.

---

## Visibility Levels

| Scope | Visibility | Access Permissions |
| :--- | :--- | :--- |
| **Private (Project)** | Only accessible within the specific project where it was created. | Project Members |
| **Organization** | Accessible across all projects and environments within your company. | Organization Members |
| **Verified Public** | Listed publicly on the Naagmani Global Marketplace for all developers. | Global Community |

---

## Next Steps

- [Troubleshooting Guide](/docs/troubleshooting/common-errors)
`,

  // ==========================================
  // TROUBLESHOOTING
  // ==========================================
  'troubleshooting/common-errors.md': `# Common Errors Guide

Quick diagnosis and resolution steps for frequent HTTP status codes and operational errors.

---

## 1. \`401 Unauthorized / invalid_token\`
- **Symptom:** API requests return \`{"code": "unauthorized", "message": "invalid service token"}\`.
- **Diagnosis:** The token secret is mistyped, revoked, or has passed its expiration TTL.
- **Resolution:** Check active tokens in [http://localhost:3000/service-tokens](http://localhost:3000/service-tokens) or generate a new token.

---

## 2. \`400 Bad Request / member budget exceeds parent\`
- **Symptom:** Attempting to update a member budget fails with \`"member monthly budget exceeds parent organization monthly budget"\`.
- **Diagnosis:** FinOps budget hierarchy enforcement blocks child budgets from exceeding parent organization ceilings.
- **Resolution:** Increase the parent organization budget first in [http://localhost:3000/finops](http://localhost:3000/finops) before increasing the member limit.

---

## 3. \`429 Too Many Requests / budget_exceeded\`
- **Symptom:** Requests are blocked with code \`budget_exceeded\`.
- **Diagnosis:** The project or member has hit their hard monthly spending cap.
- **Resolution:** Increase the budget limit in the Developer Portal or wait for the monthly billing cycle reset.

---

## 4. \`502 Bad Gateway / provider_unreachable\`
- **Symptom:** Upstream AI provider is timing out or returning 5xx.
- **Diagnosis:** Outage on the provider side.
- **Resolution:** Configure automated secondary and tertiary fallback routes in [http://localhost:3000/routing-policies](http://localhost:3000/routing-policies).

---

## Next Steps

- [Authentication Troubleshooting](/docs/troubleshooting/authentication)
- [Plugin Debugging](/docs/troubleshooting/plugins)
- [CLI Diagnostics](/docs/troubleshooting/cli)
`,

  'troubleshooting/authentication.md': `# Authentication Troubleshooting

In-depth guide to resolving SSO, JWT token, and Project Service Token authentication issues.

---

## 1. Service Token Prefix Validation
All Project Service Tokens must start with the \`nst_live_\` prefix:
- **Valid:** \`nst_live_9b2d88194488...\`
- **Invalid:** \`sk-...\` or \`bearer_...\`

---

## 2. Inspecting Token Metadata via API
Verify token capabilities and expiration:

\`\`\`bash
curl http://localhost:8081/v1/organizations/{org_id}/service-tokens \\
  -H "Authorization: Bearer <ADMIN_SESSION_TOKEN>"
\`\`\`

---

## Next Steps

- [Plugin Debugging](/docs/troubleshooting/plugins)
- [CLI Diagnostics](/docs/troubleshooting/cli)
`,

  'troubleshooting/plugins.md': `# Plugin Debugging & Diagnostics

Techniques for diagnosing crashing, timing out, or misbehaving plugins.

---

## 1. Inspecting Plugin Crash Logs
When a plugin worker crashes, the Gateway logs the stack trace to the system audit trail:
- Check **Audit Logs**: [http://localhost:3000/audit-logs](http://localhost:3000/audit-logs)

---

## 2. Testing Locally with Verbose Tracing

\`\`\`bash
naagmani plugins test ./my-plugin --verbose --hook pre_route
\`\`\`

---

## 3. Timeout Adjustments
If your plugin performs heavy remote HTTP lookups or embedding calculations, increase \`timeout_ms\` in your \`plugin.json\` to prevent premature \`fail-close\` aborts.

---

## Next Steps

- [CLI Diagnostics](/docs/troubleshooting/cli)
- [Common Errors Guide](/docs/troubleshooting/common-errors)
`,

  'troubleshooting/cli.md': `# CLI Diagnostics

Troubleshooting local command execution, network connectivity, and configuration issues.

---

## 1. Resetting Cached CLI Credentials

If your session is corrupted:
\`\`\`bash
rm -rf ~/.naagmani/credentials.json
naagmani auth login
\`\`\`

---

## 2. Debugging HTTP Payloads

Add the \`--verbose\` flag to any CLI command to display raw request and response headers:

\`\`\`bash
naagmani projects list --verbose
\`\`\`

---

## Next Steps

- [Common Errors Guide](/docs/troubleshooting/common-errors)
- [Return to Quickstart](/docs/quickstart/overview)
`,
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(baseDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`[OK] Written ${relPath}`);
}

console.log('Finished writing Integrations, Security, Production, Marketplace, and Troubleshooting documentation!');
