# How Naagmani Works

Naagmani operates as a high-performance **Control Plane & Data Plane architecture**, providing a centralized gateway between your client applications and upstream AI infrastructure.

---

## The Mental Model

At its simplest, Naagmani replaces direct third-party API calls with an intelligent, governed proxy layer:

```mermaid
graph TD
    App["Client Application / SDK"] -->|1. Request with Naagmani Key| Gateway["Naagmani Gateway (Data Plane)"]
    Gateway -->|2. Check Policies & Limits| ControlPlane["Control Plane & Vault"]
    Gateway -->|3. Route & Execute| Providers["Upstream AI Providers (OpenAI, Claude, DeepSeek)"]
    Providers -->|4. Return Response / Stream| Gateway
    Gateway -->|5. Audit & Meter Usage| Gateway
    Gateway -->|6. OpenAI-Compatible SSE / JSON| App
```

---

## Architectural Planes: Control vs Data Plane

Naagmani strictly separates configuration management from real-time request processing to guarantee sub-millisecond overhead and high availability:

```mermaid
graph TB
    subgraph ClientLayer["1. Developer & Client Layer"]
        SDK["Naagmani SDKs (Node.js, Python, Go)"]
        CLI["Naagmani CLI (naagmani)"]
        Portal["Developer Portal (Next.js :3000)"]
    end

    subgraph ControlPlane["2. Control Plane (:8081)"]
        AuthSvc["Auth & Tenant Service"]
        OrgSvc["Organization & Project Hierarchy"]
        VaultSvc["AES-256 BYOK Vault"]
        FinOpsSvc["FinOps & Budget Ledger"]
    end

    subgraph DataPlane["3. Naagmani OS Gateway Data Plane (:8080)"]
        Proxy["OpenAI-Compatible Ingress Proxy"]
        Guard["AI Guardrail & DLP Engine"]
        Router["Smart Routing & Failover Engine"]
        MCPGw["Model Context Protocol (MCP) Gateway"]
        AttemptLog["Provider Attempt Telemetry Engine"]
    end

    subgraph UpstreamProviders["4. Upstream AI Execution"]
        CloudLLM["Cloud Providers (OpenAI, Anthropic, Gemini, DeepSeek)"]
        LocalLLM["Private Models (vLLM, Ollama)"]
        MCPServers["External MCP Servers"]
    end

    ClientLayer --> ControlPlane
    ClientLayer --> DataPlane
    ControlPlane <-->|Reconciliation & Cache Sync| DataPlane
    DataPlane --> UpstreamProviders
```

### 1. Control Plane (`naagmani-cloud` :8081)
- Manages organizations, projects, environments, and team member roles.
- Encrypts and manages upstream credentials in the BYOK vault.
- Maintains billing subscriptions, price books, quotas, and budget ledgers.
- Emits configuration snapshots and updates to the active gateway data plane.

### 2. Data Plane Gateway (`naagmani-os` :8080)
- Exposes standard OpenAI-compatible endpoints (`/v1/chat/completions`, `/v1/embeddings`, `/v1/responses`).
- Performs sub-millisecond authentication and rate limit verification against Redis memory caches.
- Executes the **Smart Routing cascade**, dynamically selecting the healthiest, lowest-cost, or lowest-latency model candidate.
- Runs **AI Guardrails** (prompt injection detection, PII masking).
- Logs **Provider Attempts** telemetry capturing latency, upstream status codes, token usage, and retry hops.

---

## The Request Lifecycle

When your application sends an AI inference request:

```mermaid
sequenceDiagram
    autonumber
    actor App as Client Application
    participant GW as Naagmani Gateway (:8080)
    participant CP as Control Plane / Cache
    participant P1 as Primary Provider (DeepSeek)
    participant P2 as Fallback Provider (OpenAI)

    App->>GW: POST /v1/chat/completions (Bearer nsk_live_..., model="smart")
    GW->>CP: Validate Token, Scopes & Budget Quota
    CP-->>GW: Context OK (Org: Acme, Project: ChatBot, Env: Prod)
    GW->>GW: Resolve "smart" Policy -> Candidates [DeepSeek, OpenAI]
    GW->>P1: Attempt #1 Dispatch (deepseek-chat)
    P1-->>GW: HTTP 503 Service Unavailable / Rate Limit
    Note over GW: Attempt #1 Failed (503) -> Trigger Automated Failover
    GW->>P2: Attempt #2 Dispatch (gpt-4o)
    P2-->>GW: HTTP 200 OK + Stream Chunks
    GW-->>App: Forward OpenAI-compatible SSE Stream
    GW->>CP: Record Telemetry: Attempt #1 (Failed, 120ms) + Attempt #2 (Success, 850ms)
```

1. **Authentication & Ingress**: The gateway verifies the Bearer token (API Key or Project Service Token) and resolves the target Project and Environment.
2. **Budget & Rate Limit Check**: Token buckets and monthly spend limits are checked in-memory.
3. **Policy Resolution**: Virtual model aliases (e.g., `smart`) are mapped to active candidate lists.
4. **Upstream Dispatch & Failover**: The request is routed to Candidate #1. If it encounters a timeout, 429, or 5xx server error, the gateway seamlessly fails over to Candidate #2 without client disconnection.
5. **Telemetry & Metering**: Both attempts are recorded with exact latency, token counts, and upstream response metadata.

---

## Canonical Resource Hierarchy

Naagmani organizes all resources into a clean 3-tier structure:

```mermaid
graph TD
    Org["Organization (Acme Corp)"] --> P1["Project A (Customer Support)"]
    Org --> P2["Project B (Internal Search)"]
    P1 --> E1["Environment: test"]
    P1 --> E2["Environment: production"]
    E2 --> Keys["API Keys & Service Tokens"]
    E2 --> Routing["Routing Policies"]
    E2 --> Agents["AI Agents & Tools"]
```

- **Organization**: Top-level tenant container owning billing, user roles, customer members, and global provider credentials (BYOK).
- **Project**: Isolated workspace container for a specific application, service, or team.
- **Environment**: Strict runtime isolation boundary (e.g. `test`, `production`) owning scoped credentials, routing rules, agents, and usage telemetry.

---

## Next Steps

- Get started with your first project: [Quickstart Guide](file:///e:/project/naagmani-project/naagmani-docs/docs/get-started/quickstart.md)
- Learn how to send inference requests: [Make Your First AI Request](file:///e:/project/naagmani-project/naagmani-docs/docs/get-started/first-request.md)
- Explore the Developer Portal: [Developer Portal Overview](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/overview.md)
