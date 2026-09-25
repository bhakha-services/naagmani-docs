# Product Architecture

Naagmani is architected as a high-throughput, decoupled platform split cleanly across a **Control Plane**, a **Data Plane Gateway**, and an **Observability & Management Suite**.

```mermaid
graph TB
    subgraph ClientLayer["Developer & Client Layer"]
        SDK["Naagmani SDKs (Go, TypeScript, Python)"]
        CLI["Naagmani CLI (naagmani)"]
        Portal["Developer Portal (Port 3000)"]
    end

    subgraph ControlPlane["Naagmani Control Plane (Port 8081)"]
        AuthSvc["Auth & Tenant Service"]
        OrgSvc["Organization & Project Hierarchy"]
        TokenSvc["Service Token & Vault Manager"]
        AuditSvc["Audit Logger & Event Store"]
        FinOpsSvc["FinOps & Budget Ledger"]
    end

    subgraph DataPlane["Naagmani OS Gateway Data Plane (Port 8080)"]
        Proxy["OpenAI-Compatible Ingress Proxy"]
        Guard["Security & Guardrail Pipeline"]
        Router["Smart Routing & Failover Engine"]
        MCPGw["Model Context Protocol Gateway"]
        AttemptLog["Provider Attempt Telemetry Engine"]
    end

    subgraph UpstreamProviders["Upstream AI Execution"]
        CloudLLM["Cloud Providers (OpenAI, Anthropic, Gemini, DeepSeek)"]
        LocalLLM["Private Models (vLLM, Ollama, TGI)"]
        MCPServers["External MCP Servers (Filesystem, SQL, GitHub)"]
    end

    ClientLayer --> ControlPlane
    ClientLayer --> DataPlane
    ControlPlane <--> DataPlane
    DataPlane --> UpstreamProviders
```

---

## Architectural Planes

### 1. Data Plane Gateway (`naagmani-os`)
- **Port**: `8080` (Default Gateway Port)
- **Role**: Ultra-low-latency reverse proxy executing prompt translation, SSE streaming accumulation, routing failovers, guardrail filters, and MCP tool orchestration.
- **Performance**: Written in Go with sub-millisecond dispatch overhead.

### 2. Control Plane (`naagmani-cloud`)
- **Port**: `8081` (Cloud API Port)
- **Role**: Authoritative state management for Organizations, Projects, Environments, Members, BYOK Vault secrets, Service Token issuance, and FinOps budget ledgers.
- **Storage**: Backed by PostgreSQL and Redis for fast token validation and rate limiting.

### 3. Developer Portal (`naagmani-developer`)
- **Port**: `3000` (Web Console)
- **Role**: Premium web console for managing API keys, service tokens, routing policies, provider attempts trace inspector, and interactive playgrounds.

---

## Request Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor App as Client Application
    participant GW as Naagmani Gateway (:8080)
    participant CP as Control Plane (:8081)
    participant AI as Upstream Provider (Anthropic)
    participant Fallback as Fallback Provider (OpenAI)

    App->>GW: POST /v1/chat/completions (Bearer nsk_live_...)
    GW->>CP: Validate Token, Quota & Capabilities
    CP-->>GW: Token Valid (Org: Acme, Project: Copilot, Limit OK)
    GW->>AI: Dispatch Request (claude-3-5-sonnet)
    AI-->>GW: HTTP 529 Overloaded Error
    Note over GW: Attempt #1 Failed -> Trigger Cascade
    GW->>Fallback: Failover Dispatch (gpt-4o)
    Fallback-->>GW: HTTP 200 OK + Stream Chunks
    GW-->>App: Forward OpenAI-compatible SSE Stream
    GW->>CP: Record Provider Attempt #1 (Failed) & #2 (Succeeded) + Token COGS
```

---

## Next Steps

- Review core entities: [Foundational Concepts](concepts.md)
- Follow the hands-on tutorial: [Quickstart Guide](../quickstart/overview.md)
