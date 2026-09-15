# Product Architecture

The Naagmani platform consists of four primary decoupled architectural layers:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Client Applications (Web, Mobile, Microservices, Agents) │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON-RPC / SSE
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Naagmani OS (High-Performance Runtime Gateway)           │
│  • Request Ingress & Authentication                         │
│  • Plugin Interception Pipeline (Pre- & Post-Processing)    │
│  • Smart Router & Health Evaluator                          │
│  • BYOK Vault & Provider Adapters                           │
└──────────────┬───────────────────────────────┬──────────────┘
               │ JSON-RPC stdio                │ Policy & Config Sync
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│ 3. Plugin Runtime Subprocess │ │ 4. Naagmani Cloud Control  │
│  • Go / Node.js / Python     │ │    Plane                   │
│  • Speaks naagmani.plugin/v1 │ │  • Multi-tenant Identity   │
│  • DLP, MCP, Firewall, RAG   │ │  • Billing & Entitlements  │
└──────────────────────────────┘ └────────────────────────────┘
```

---

## Architectural Components

### 1. Naagmani OS Runtime Gateway
The native, low-latency execution kernel responsible for handling client inference requests:
- **Unified Proxy**: Exposes `/v1/chat/completions`, `/v1/embeddings`, and `/v1/responses`.
- **BYOK Credential Vault**: Injects decrypted provider credentials into outbound requests without exposing them to the client or plugin subprocesses.
- **Failover & Router Engine**: Evaluates model availability, latency, and costs to dynamically select the best upstream provider endpoint.

### 2. Plugin Execution Sandbox
Plugins execute in isolated subprocesses communicating over standard `stdio` via the frozen `naagmani.plugin/v1` protocol.
- **Isolation**: A crashed or misbehaving plugin cannot take down the gateway.
- **Language Independence**: Developers build plugins using official HDKs for Go, Node.js/TypeScript, and Python.

### 3. Naagmani Cloud Control Plane
Manages organization multi-tenancy, projects, environments, team permissions, commercial plugin entitlements, and aggregated FinOps billing metrics.

---

## Next Steps

- Review the data models: [Core Concepts](concepts.md)
- Start sending traffic: [Quickstart Guide](../quickstart/overview.md)
