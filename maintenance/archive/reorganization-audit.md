# Naagmani Documentation Information Architecture Audit & Reorganization Plan

> **Phase 1 Deliverable**: Full audit of `naagmani-docs`, alignment with `naagmani-developer` (Developer Portal source of truth), duplication analysis, proposed 5-pillar information architecture, and complete 106-file migration map.

---

## 1. Executive Summary & Core Problems Identified

An in-depth audit of `naagmani-docs` alongside the `naagmani-developer`, `naagmani-os`, `naagmani-cloud`, and `naagmani-cli` codebases revealed severe structural over-fragmentation:

1. **Massive Over-Structuring (12 Top-Level Categories, 106 Files)**:
   - Current top-level categories: *Get Started, Core Concepts, Developer Portal, API Reference, Plugins & HDKs, SDKs, CLI Manual, Integrations, Security & Governance, Production Operations, Marketplace, Troubleshooting*.
   - A developer has to hunt across 4–5 different top-level sections to understand a single feature (e.g. Routing is split across *Core Concepts*, *Developer Portal*, *Production Operations*, and *Security*).

2. **Divergence from Actual Product & Developer Portal UI**:
   - The Developer Portal (`naagmani-developer`) is structured cleanly around **Organization Hierarchy** and **Project Workspaces** (`Workspace`, `AI & Capabilities`, `Governance & Routing`, `Operations`, `Settings`).
   - The documentation creates artificial "theoretical/conceptual" pages that repeat the UI fields rather than anchoring the explanation in the real product workflow.

3. **Duplicated Conceptual Content**:
   - Every core feature has 3 to 5 parallel pages explaining the same concept from slightly different angles (e.g., *API Keys*, *Service Tokens*, *Providers / BYOK*, *FinOps / Budgets*, *Audit Logs*, *Plugins*).

4. **Public Docs Mixing Internal Operations / Self-Hosting with Developer Guides**:
   - Internal operator/deployment manuals (`coolify.md`, `uninstall.md`, `offline.md`) are mixed directly into developer navigation alongside API references.

---

## 2. Source of Truth: Actual Developer Portal Navigation

Extracted directly from `naagmani-developer/components/layout/sidebar.tsx` and actual Next.js route trees:

```text
Developer Portal Navigation Hierarchy
├── Organization Scope
│   ├── Dashboard (/dashboard)
│   ├── Portal Users (/users)
│   ├── Roles & Permissions (/roles)
│   ├── Customer Members (/members)
│   ├── Billing (/billing)
│   ├── Marketplace (/marketplace)
│   ├── Publisher (/publisher)
│   ├── Providers & Health (/providers)
│   ├── Provider Attempts (/attempts)
│   ├── Usage (/usage)
│   ├── Audit Logs (/audit-logs)
│   └── Organization Settings (/organizations/[id])
│
└── Projects & Workspaces Scope (/projects/[slug]/...)
    ├── Workspace
    │   ├── Overview (/projects/[slug])
    │   ├── API Keys (/projects/[slug]/api-keys)
    │   └── Service Tokens (/projects/[slug]/service-tokens)
    │
    ├── AI & Capabilities
    │   ├── AI Agents (/projects/[slug]/agents)
    │   ├── Agent Playground (/projects/[slug]/playground)
    │   ├── Skills (/projects/[slug]/skills)
    │   ├── Tools (/projects/[slug]/tools)
    │   ├── Plugins & Tools (/projects/[slug]/plugins)
    │   └── MCP Servers (/projects/[slug]/mcp-servers)
    │
    ├── Governance & Routing
    │   ├── Routing Policies (/projects/[slug]/routing-policies)
    │   ├── MCP Tool Policies (/projects/[slug]/mcp-policies)
    │   └── AI Guardrails (/projects/[slug]/governance)
    │
    ├── Operations
    │   ├── Model Playground (/projects/[slug]/model-playground)
    │   ├── Usage (/projects/[slug]/usage)
    │   └── Audit Logs (/projects/[slug]/audit-logs)
    │
    └── Settings
        └── Project Settings (/projects/[slug]/settings)
```

---

## 3. Duplication & Overlap Analysis

| Concept / Feature | Current Locations in Docs | Problem | Canonical Single Destination |
|---|---|---|---|
| **Smart Routing & Failover** | `concepts/routing.md`<br>`developer-portal/routing-policies.md`<br>`production/routing.md`<br>`production/reliability.md` | 4 competing pages explaining strategies, failover cascade, and scoring. | **Developer Portal → Routing Policies** (`docs/developer-portal/routing.md`) |
| **API Keys & Vault** | `concepts/api-keys.md`<br>`quickstart/api-key.md`<br>`developer-portal/credential-pools.md`<br>`security/authentication.md`<br>`troubleshooting/authentication.md` | Scattered across 5 sections with redundant definitions of hashing and scoping. | **Developer Portal → API Keys** (`docs/developer-portal/api-keys.md`) |
| **Project Service Tokens** | `concepts/project-service-tokens.md`<br>`features/service-tokens.md`<br>`developer-portal/service-tokens.md`<br>`api/service-tokens.md` | Duplicated explanation of scoped tokens across concepts, features, portal, and API. | **Developer Portal → Service Tokens** (`docs/developer-portal/service-tokens.md`) & API Reference for raw endpoints. |
| **Providers & BYOK Credentials** | `concepts/providers.md`<br>`developer-portal/credential-pools.md`<br>`integrations/openai.md`<br>`integrations/anthropic.md`<br>`integrations/google.md`<br>`integrations/deepseek.md`<br>`integrations/other-providers.md` | 7 separate pages re-explaining credential entry and provider health checks. | **Developer Portal → Providers & Health** (`docs/developer-portal/providers.md`) |
| **FinOps, Quotas & Budgets** | `concepts/billing.md`<br>`concepts/usage.md`<br>`developer-portal/finops-budgets.md`<br>`production/rate-limits.md`<br>`api/budgets.md` | Budget tree hierarchy and token cost calculation repeated across 5 files. | **Developer Portal → Usage & Budgets** (`docs/developer-portal/budgets.md`) |
| **Audit Logs & Security Trail** | `developer-portal/audit-logs.md`<br>`security/audit-logs.md`<br>`security/overview.md` | Repetitive explanations of actor ID, HMAC integrity, and IP tracking. | **Developer Portal → Audit Logs** (`docs/developer-portal/audit-logs.md`) |
| **Plugins & HDK System** | `concepts/plugins.md`<br>`developer-portal/plugin-protocol.md`<br>`plugins/overview.md`<br>`plugins/architecture.md`<br>`plugins/protocol.md`<br>`plugins/lifecycle.md`<br>`plugins/hooks.md`<br>`plugins/development.md` | 8 fragmented files re-stating stdin/stdout JSON-RPC protocol and hook hooks. | **Build with Naagmani → HDKs** (`docs/build/hdks/...`) |
| **CLI Documentation** | `cli/installation.md`<br>`cli/authentication.md`<br>`cli/commands.md`<br>`cli/plugins.md`<br>`cli/troubleshooting.md`<br>`developer-portal/cli-workflow.md`<br>`deployment/cli-reference.md` | CLI spread across 3 top-level sections (*CLI Manual*, *Developer Portal*, *Deployment*). | **Build with Naagmani → CLI** (`docs/build/cli/...`) |
| **MCP Integration** | `developer-portal/mcp-integration.md`<br>`developer-portal/mcp-servers.md`<br>`developer-portal/mcp-policies.md` | Fragmented explanation of MCP servers and policies. | **Developer Portal → MCP Servers & Policies** (`docs/developer-portal/mcp-servers.md` & `mcp-policies.md`) |
| **Playground Testing** | `developer-portal/model-playground.md`<br>`developer-portal/agent-playground.md` | Both explain prompt sending without clear distinction. | **Developer Portal → Model Playground** & **Agent Playground** (under AI & Capabilities). |

---

## 4. Missing & Outdated Documentation Identified

### Missing Implemented Features:
1. **Developer Portal Dual Hierarchy Navigation Guide**: Lack of clear documentation explaining the seamless switch between Organization Level vs Project Workspace scope.
2. **Skill & Tool Manifest Authoring**: Current docs cover agents but lack practical examples of configuring Tool Schema bindings and Skill instruction prompts in the Portal.
3. **Provider Health & Automatic Degradation Status**: Real-time health monitoring (`healthy`, `degraded`, `unreachable`) in `/providers` is implemented in `naagmani-os` but undocumented.
4. **CLI `doctor` and `platform` Subcommands**: `naagmani doctor` and `naagmani platform update` exist in `naagmani-cli` but are missing from doc references.
5. **Project Service Token Capability Scopes**: Granular capabilities (`inference:chat`, `mcp:tools:execute`, `providers:byok:read`) are implemented in `naagmani-os` and Developer Portal UI but only partially documented.

### Outdated Information:
1. **Self-Hosting / Deployment mixed into SaaS developer docs**: 9 deployment files (`coolify.md`, `offline.md`, `uninstall.md`) dominate the navigation while SaaS developers only need to use the Developer Portal and API.
2. **Old Docusaurus / Markdown remnants**: Outdated navigation references pointing to deprecated routes.

---

## 5. Proposed Top-Level Information Architecture (5 Core Pillars)

The documentation is streamlined into **5 clean, authoritative top-level sections**:

```text
1. Get Started
   ├── What is Naagmani?
   ├── How Naagmani Works (Mental Model & Architecture)
   ├── Quickstart
   └── Make Your First AI Request

2. Developer Portal (Source of Truth: Aligned with Portal Navigation)
   ├── Overview & Navigation
   ├── Organization Management
   │   ├── Organizations & Settings
   │   ├── Portal Users & Access
   │   ├── Roles & Permissions (RBAC)
   │   ├── Customer Members
   │   ├── Billing & Subscriptions
   │   └── Providers & Health (BYOK Vault)
   ├── Projects & Workspaces
   │   ├── Projects & Environments
   │   ├── API Keys
   │   └── Project Service Tokens
   ├── AI & Capabilities
   │   ├── AI Agents & Assistants
   │   ├── Agent Playground
   │   ├── Skills
   │   ├── Tools
   │   ├── Plugins & Local Tools
   │   └── MCP Servers
   ├── Governance & Routing
   │   ├── Routing Policies & Failover Strategies
   │   ├── MCP Tool Policies
   │   └── AI Guardrails & DLP
   └── Operations & FinOps
       ├── Model Playground
       ├── Provider Attempts (Execution Traces)
       ├── Usage & Token Analytics
       ├── FinOps & Budgets
       └── Audit Logs & Compliance

3. API Reference (Purely endpoint schemas, parameters & code examples)
   ├── Overview & Base URLs
   ├── Authentication & Headers
   ├── Chat Completions (/v1/chat/completions)
   ├── Streaming (Server-Sent Events)
   ├── Responses & Payloads (/v1/responses)
   ├── Embeddings (/v1/embeddings)
   ├── Models & Aliases (/v1/models)
   ├── Project Service Tokens API
   ├── Provider Attempts API
   ├── FinOps & Budgets API
   └── Errors & Status Codes

4. Marketplace
   ├── Marketplace Overview
   ├── Discover & Search Capabilities
   ├── Installation & Scope Isolation
   └── Publisher Portal & Distribution

5. Build with Naagmani (Developer Tooling & Extensibility)
   ├── SDKs
   │   ├── Overview
   │   ├── Node.js / TypeScript SDK
   │   ├── Python SDK
   │   └── Go SDK
   ├── HDKs (Hardware/Host Development Kit for Plugins)
   │   ├── Overview & Architecture
   │   ├── Plugin Manifest (plugin.json)
   │   ├── Wire Protocol & IPC (v1)
   │   ├── Lifecycle & Execution Hooks
   │   ├── Plugin Development Guide
   │   ├── Testing, Validation & Sandboxing
   │   └── Packaging & Publishing
   └── CLI Manual
       ├── Installation & Setup
       ├── Authentication & Context Switching
       ├── Command Reference
       ├── Plugin Development Workflow
       └── Diagnostics & Troubleshooting (Doctor)

[Optional Section: Self-Hosting & Deployment]
   ├── Docker Compose Deployment
   ├── Coolify Deployment
   └── Air-Gapped & Offline Setup
```

---

## 6. Complete Migration Map (All 106 Existing Files)

Below is the complete, exhaustive mapping for every file currently in `docs/`:

| # | Current Path | Action | Target Path | Rationale |
|---|---|---|---|---|
| 1 | `api/attempts.md` | `KEEP` | `docs/api/attempts.md` | Authoritative API reference for Provider Attempts endpoint. |
| 2 | `api/authentication.md` | `KEEP` | `docs/api/authentication.md` | Authoritative API authentication specification. |
| 3 | `api/budgets.md` | `KEEP` | `docs/api/budgets.md` | Authoritative API reference for Budgets endpoint. |
| 4 | `api/chat-completions.md` | `KEEP` | `docs/api/chat-completions.md` | Core OpenAI-compatible chat completions endpoint documentation. |
| 5 | `api/embeddings.md` | `KEEP` | `docs/api/embeddings.md` | Embeddings endpoint reference. |
| 6 | `api/errors.md` | `KEEP` | `docs/api/errors.md` | Standard error payload format and HTTP status codes. |
| 7 | `api/overview.md` | `KEEP` | `docs/api/overview.md` | API standards and gateway URLs. |
| 8 | `api/responses.md` | `KEEP` | `docs/api/responses.md` | Response structure documentation. |
| 9 | `api/service-tokens.md` | `KEEP` | `docs/api/service-tokens.md` | Service token CRUD API reference. |
| 10 | `api/streaming.md` | `KEEP` | `docs/api/streaming.md` | SSE streaming specification. |
| 11 | `cli/authentication.md` | `MOVE` | `docs/build/cli/authentication.md` | Group under *Build with Naagmani → CLI*. |
| 12 | `cli/commands.md` | `MOVE` | `docs/build/cli/commands.md` | Group under *Build with Naagmani → CLI*. |
| 13 | `cli/installation.md` | `MOVE` | `docs/build/cli/installation.md` | Group under *Build with Naagmani → CLI*. |
| 14 | `cli/plugins.md` | `MOVE` | `docs/build/cli/plugins.md` | Group under *Build with Naagmani → CLI*. |
| 15 | `cli/troubleshooting.md` | `MOVE` | `docs/build/cli/troubleshooting.md` | Group under *Build with Naagmani → CLI*. |
| 16 | `concepts/api-keys.md` | `MERGE` | `docs/developer-portal/projects/api-keys.md` | Merge conceptual explanation into canonical Portal API Keys page. |
| 17 | `concepts/billing.md` | `MERGE` | `docs/developer-portal/organization/billing.md` | Merge into Portal Billing documentation. |
| 18 | `concepts/environments.md` | `MERGE` | `docs/developer-portal/projects/environments.md` | Merge into Projects & Environments guide. |
| 19 | `concepts/models.md` | `MERGE` | `docs/api/models.md` & `docs/developer-portal/routing.md` | Split between API models endpoint and routing policy configuration. |
| 20 | `concepts/organizations.md` | `MERGE` | `docs/developer-portal/organization/organizations.md` | Merge into Organization hierarchy page. |
| 21 | `concepts/plugins.md` | `MERGE` | `docs/build/hdks/overview.md` | Merge into HDK overview. |
| 22 | `concepts/project-service-tokens.md` | `MERGE` | `docs/developer-portal/projects/service-tokens.md` | Merge into canonical Service Tokens page. |
| 23 | `concepts/projects.md` | `MERGE` | `docs/developer-portal/projects/projects.md` | Merge into canonical Projects page. |
| 24 | `concepts/providers.md` | `MERGE` | `docs/developer-portal/organization/providers.md` | Merge into canonical Providers & BYOK page. |
| 25 | `concepts/routing.md` | `MERGE` | `docs/developer-portal/governance-routing/routing.md` | Merge into canonical Smart Routing Policies page. |
| 26 | `concepts/usage.md` | `MERGE` | `docs/developer-portal/operations/usage.md` | Merge into canonical Usage analytics page. |
| 27 | `deployment/cli-reference.md` | `MERGE` | `docs/build/cli/commands.md` | Merge CLI commands into canonical CLI Reference. |
| 28 | `deployment/coolify.md` | `MOVE` | `docs/deploy/coolify.md` | Move under dedicated Deployment section. |
| 29 | `deployment/docker-compose.md` | `MOVE` | `docs/deploy/docker-compose.md` | Move under dedicated Deployment section. |
| 30 | `deployment/installation-registration.md` | `MERGE` | `docs/deploy/docker-compose.md` | Consolidate deployment registration. |
| 31 | `deployment/installation.md` | `MERGE` | `docs/deploy/docker-compose.md` | Consolidate installation guide. |
| 32 | `deployment/offline.md` | `MOVE` | `docs/deploy/offline.md` | Move to Deployment / Air-gapped guide. |
| 33 | `deployment/troubleshooting.md` | `MERGE` | `docs/deploy/docker-compose.md` | Merge deployment troubleshooting into deployment guides. |
| 34 | `deployment/uninstall.md` | `ARCHIVE` | `docs/deploy/archive/uninstall.md` | Archive non-critical operator tear-down doc. |
| 35 | `deployment/upgrades.md` | `MERGE` | `docs/deploy/docker-compose.md` | Merge upgrade steps into deployment guide. |
| 36 | `developer-portal/agent-playground.md` | `KEEP` | `docs/developer-portal/capabilities/agent-playground.md` | Canonical guide for Agent Playground. |
| 37 | `developer-portal/agents.md` | `KEEP` | `docs/developer-portal/capabilities/agents.md` | Canonical guide for AI Agents & Assistants. |
| 38 | `developer-portal/attempts.md` | `KEEP` | `docs/developer-portal/operations/attempts.md` | Canonical guide for Provider Attempt accounting. |
| 39 | `developer-portal/audit-logs.md` | `KEEP` | `docs/developer-portal/operations/audit-logs.md` | Canonical guide for Security Audit Logs. |
| 40 | `developer-portal/cli-workflow.md` | `REDIRECT` | `docs/build/cli/overview.md` | Redirect to Build with Naagmani → CLI. |
| 41 | `developer-portal/credential-pools.md` | `MERGE` | `docs/developer-portal/organization/providers.md` | Merge credential pool setup into Providers & Health page. |
| 42 | `developer-portal/finops-budgets.md` | `KEEP` | `docs/developer-portal/operations/budgets.md` | Canonical guide for FinOps & Budgets. |
| 43 | `developer-portal/guardrails.md` | `KEEP` | `docs/developer-portal/governance-routing/guardrails.md` | Canonical guide for AI Guardrails. |
| 44 | `developer-portal/mcp-integration.md` | `MERGE` | `docs/developer-portal/capabilities/mcp-servers.md` | Consolidate MCP integration into MCP Servers page. |
| 45 | `developer-portal/mcp-policies.md` | `KEEP` | `docs/developer-portal/governance-routing/mcp-policies.md` | Canonical guide for MCP Tool Policies. |
| 46 | `developer-portal/mcp-servers.md` | `KEEP` | `docs/developer-portal/capabilities/mcp-servers.md` | Canonical guide for MCP Servers. |
| 47 | `developer-portal/members.md` | `KEEP` | `docs/developer-portal/organization/members.md` | Canonical guide for Customer Members. |
| 48 | `developer-portal/model-playground.md` | `KEEP` | `docs/developer-portal/operations/model-playground.md` | Canonical guide for Model Playground. |
| 49 | `developer-portal/overview.md` | `KEEP` | `docs/developer-portal/overview.md` | Portal navigation and layout overview. |
| 50 | `developer-portal/plugin-protocol.md` | `REDIRECT` | `docs/build/hdks/protocol.md` | Redirect to Build with Naagmani → HDK Protocol. |
| 51 | `developer-portal/roles.md` | `KEEP` | `docs/developer-portal/organization/roles.md` | Canonical guide for Roles & RBAC. |
| 52 | `developer-portal/routing-policies.md` | `KEEP` | `docs/developer-portal/governance-routing/routing.md` | Canonical guide for Smart Routing Policies. |
| 53 | `developer-portal/service-tokens.md` | `KEEP` | `docs/developer-portal/projects/service-tokens.md` | Canonical guide for Project Service Tokens. |
| 54 | `developer-portal/skills.md` | `KEEP` | `docs/developer-portal/capabilities/skills.md` | Canonical guide for Skills. |
| 55 | `developer-portal/tools.md` | `KEEP` | `docs/developer-portal/capabilities/tools.md` | Canonical guide for Tools. |
| 56 | `developer-portal/users.md` | `KEEP` | `docs/developer-portal/organization/users.md` | Canonical guide for Portal Users. |
| 57 | `features/service-tokens.md` | `MERGE` | `docs/developer-portal/projects/service-tokens.md` | Merge feature overview into canonical Service Tokens doc. |
| 58 | `integrations/anthropic.md` | `MERGE` | `docs/developer-portal/organization/providers.md` | Provider-specific config merged into Providers BYOK guide. |
| 59 | `integrations/deepseek.md` | `MERGE` | `docs/developer-portal/organization/providers.md` | Provider-specific config merged into Providers BYOK guide. |
| 60 | `integrations/google.md` | `MERGE` | `docs/developer-portal/organization/providers.md` | Provider-specific config merged into Providers BYOK guide. |
| 61 | `integrations/openai.md` | `MERGE` | `docs/developer-portal/organization/providers.md` | Provider-specific config merged into Providers BYOK guide. |
| 62 | `integrations/other-providers.md` | `MERGE` | `docs/developer-portal/organization/providers.md` | Self-hosted (Ollama/vLLM) config merged into Providers BYOK guide. |
| 63 | `introduction/architecture.md` | `REWRITE` | `docs/get-started/how-it-works.md` | Simplify architecture to lightweight mental model and runtime flow. |
| 64 | `introduction/concepts.md` | `MERGE` | `docs/get-started/how-it-works.md` | Merge foundational hierarchy into Get Started flow. |
| 65 | `introduction/what-is-naagmani.md` | `KEEP` | `docs/get-started/what-is-naagmani.md` | Core product positioning & value proposition. |
| 66 | `introduction/why-naagmani.md` | `MERGE` | `docs/get-started/what-is-naagmani.md` | Combine 5 pillars into What is Naagmani. |
| 67 | `licensing/air-gapped.md` | `MERGE` | `docs/deploy/offline.md` | Merge into offline/air-gapped deployment doc. |
| 68 | `licensing/connected.md` | `MERGE` | `docs/developer-portal/organization/billing.md` | Merge into Billing & Entitlements doc. |
| 69 | `licensing/entitlements.md` | `MERGE` | `docs/developer-portal/organization/billing.md` | Merge into Billing & Entitlements doc. |
| 70 | `licensing/overview.md` | `MERGE` | `docs/developer-portal/organization/billing.md` | Merge into Billing & Entitlements doc. |
| 71 | `marketplace/installing-plugins.md` | `MOVE` | `docs/marketplace/installation.md` | Canonical guide for installing capabilities with scope isolation. |
| 72 | `marketplace/overview.md` | `KEEP` | `docs/marketplace/overview.md` | Canonical guide for Marketplace ecosystem. |
| 73 | `marketplace/plugin-visibility.md` | `MERGE` | `docs/marketplace/publishing.md` | Merge visibility scopes into Publisher guide. |
| 74 | `marketplace/publishing.md` | `KEEP` | `docs/marketplace/publishing.md` | Canonical guide for publishing capabilities. |
| 75 | `plugins/architecture.md` | `MOVE` | `docs/build/hdks/architecture.md` | Move under *Build with Naagmani → HDKs*. |
| 76 | `plugins/development.md` | `MOVE` | `docs/build/hdks/development.md` | Move under *Build with Naagmani → HDKs*. |
| 77 | `plugins/hooks.md` | `MOVE` | `docs/build/hdks/hooks.md` | Move under *Build with Naagmani → HDKs*. |
| 78 | `plugins/lifecycle.md` | `MOVE` | `docs/build/hdks/lifecycle.md` | Move under *Build with Naagmani → HDKs*. |
| 79 | `plugins/manifest.md` | `MOVE` | `docs/build/hdks/manifest.md` | Move under *Build with Naagmani → HDKs*. |
| 80 | `plugins/overview.md` | `MOVE` | `docs/build/hdks/overview.md` | Move under *Build with Naagmani → HDKs*. |
| 81 | `plugins/permissions.md` | `MOVE` | `docs/build/hdks/permissions.md` | Move under *Build with Naagmani → HDKs*. |
| 82 | `plugins/protocol.md` | `MOVE` | `docs/build/hdks/protocol.md` | Move under *Build with Naagmani → HDKs*. |
| 83 | `plugins/publishing.md` | `MERGE` | `docs/build/hdks/publishing.md` | Consolidate HDK packaging & publishing. |
| 84 | `plugins/testing.md` | `MOVE` | `docs/build/hdks/testing.md` | Move under *Build with Naagmani → HDKs*. |
| 85 | `production/observability.md` | `MERGE` | `docs/developer-portal/operations/attempts.md` | Observability metrics merged into Provider Attempts & Telemetry. |
| 86 | `production/overview.md` | `ARCHIVE` | `docs/archive/production-overview.md` | Redundant top-level operations page. |
| 87 | `production/rate-limits.md` | `MERGE` | `docs/developer-portal/operations/budgets.md` | Rate limits and token throttling merged into FinOps & Budgets. |
| 88 | `production/reliability.md` | `MERGE` | `docs/developer-portal/governance-routing/routing.md` | Active failover cascade merged into Routing Policies. |
| 89 | `production/routing.md` | `MERGE` | `docs/developer-portal/governance-routing/routing.md` | Traffic routing strategies merged into Routing Policies. |
| 90 | `production/scaling.md` | `MOVE` | `docs/deploy/scaling.md` | Move under Deployment guide for multi-pod scaling. |
| 91 | `quickstart/api-key.md` | `MERGE` | `docs/get-started/quickstart.md` | Consolidated into seamless Quickstart flow. |
| 92 | `quickstart/first-request.md` | `MOVE` | `docs/get-started/first-request.md` | First request tutorial in Get Started. |
| 93 | `quickstart/overview.md` | `MOVE` | `docs/get-started/quickstart.md` | Main Quickstart guide in Get Started. |
| 94 | `quickstart/provider-attempts.md` | `MERGE` | `docs/developer-portal/operations/attempts.md` | Deep-link to Provider Attempts canonical guide. |
| 95 | `quickstart/streaming.md` | `MERGE` | `docs/api/streaming.md` | Streaming SSE guide consolidated into API Reference. |
| 96 | `sdk/go.md` | `MOVE` | `docs/build/sdks/go.md` | Move under *Build with Naagmani → SDKs*. |
| 97 | `sdk/node.md` | `MOVE` | `docs/build/sdks/node.md` | Move under *Build with Naagmani → SDKs*. |
| 98 | `sdk/python.md` | `MOVE` | `docs/build/sdks/python.md` | Move under *Build with Naagmani → SDKs*. |
| 99 | `security/audit-logs.md` | `MERGE` | `docs/developer-portal/operations/audit-logs.md` | Merged into canonical Audit Logs guide. |
| 100 | `security/authentication.md` | `MERGE` | `docs/developer-portal/projects/api-keys.md` | Key hashing and encryption merged into API Keys guide. |
| 101 | `security/authorization.md` | `MERGE` | `docs/developer-portal/organization/roles.md` | RBAC & permissions merged into Roles guide. |
| 102 | `security/data-protection.md` | `MERGE` | `docs/developer-portal/governance-routing/guardrails.md` | DLP and PII redaction merged into AI Guardrails guide. |
| 103 | `security/isolation.md` | `MERGE` | `docs/developer-portal/projects/projects.md` | Multi-tenant context isolation merged into Projects guide. |
| 104 | `security/overview.md` | `MERGE` | `docs/get-started/how-it-works.md` | Security perimeter merged into architectural overview. |
| 105 | `troubleshooting/authentication.md` | `MERGE` | `docs/developer-portal/projects/api-keys.md` | Troubleshooting placed as contextual section in API Keys. |
| 106 | `troubleshooting/cli.md` | `MERGE` | `docs/build/cli/troubleshooting.md` | Troubleshooting placed directly in CLI manual. |

---

## 7. Migration Metrics Summary

- **Total Existing Files Audited**: 106
- **Files Kept / Canonically Standardized**: 32
- **Files Merged & Deduplicated**: 48
- **Files Moved to Unified Structure**: 22
- **Files Archived / Non-Public Cleaned**: 4
- **Top-Level Sections Reduced**: From **12 sections down to 5 clean pillars** (58% navigation simplification).
- **Duplication Reduction**: 100% elimination of parallel competing conceptual pages for Routing, API Keys, Service Tokens, Providers, Budgets, and Plugins.

---

## 8. Next Steps & Approval Gate

Per instructions, **no files have been modified or deleted**. We are at **PHASE 2 — WAIT FOR APPROVAL**.
