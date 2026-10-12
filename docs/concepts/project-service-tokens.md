# Project Service Tokens (PST)

**Project Service Tokens** are high-security, machine-to-machine credentials engineered for backend services, automated CI/CD pipelines, background worker processes, and autonomous agent swarms.

Unlike standard API keys, Project Service Tokens provide fine-grained **capability matrices**, **time-to-live (TTL) expirations**, **environment scoping**, and **human member attribution**.

```mermaid
graph TD
    subgraph PST["Project Service Token (nm_st_...)"]
        Cap["Capability Matrix (inference.execute, models.read)"]
        Env["Environment Scope (Production)"]
        TTL["TTL Expiration (e.g. 30 Days)"]
        Attribution["Member Attribution (User: Rahul)"]
    end

    PST --> GW["Naagmani Gateway Engine"]
    Authorize{"Capabilities & Quota OK?"}
    GW --> Authorize
    Authorize -->|Yes| Upstream["Execute AI Inference / MCP Tools"]
    Authorize -->|No| Reject["HTTP 403 Forbidden"]
```

---

## Core Features & Guarantees

### 1. Fine-Grained Capability Matrix
Every Project Service Token specifies an explicit list of allowed capabilities. Requests attempting actions outside the capability scope are rejected at the gateway:

| Capability | Category | Allowed Operations |
| :--- | :--- | :--- |
| `services.tokens.create` | Services Gateway | Provision child customer API keys (`nm_live_...`) with budgets and rate limits. |
| `services.tokens.read` | Services Gateway | List and inspect provisioned child tokens. |
| `services.tokens.revoke` | Services Gateway | Immediately invalidate provisioned child tokens. |
| `services.usage.read` | Observability | Inspect member token consumption and real-time monthly spend telemetry. |
| `inference.execute` | AI Workloads | Standard and streaming chat completions (`/v1/chat/completions`). |

---

### 2. Time-To-Live (TTL) & Expiration Lifecycles
Tokens can be configured with strict expiration policies to satisfy enterprise security compliance:
- **Preset Durations**: 7 days, 30 days, 90 days, 365 days.
- **Custom Expiration**: Any ISO 8601 RFC3339 timestamp.
- **Never Expire**: Long-lived background infrastructure tokens (100 years).

Expired tokens are automatically rejected with `HTTP 401 Unauthorized: token_expired`.

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

Pass your token in the standard HTTP `Authorization` header:

```bash
curl -X POST "{{GATEWAY_URL}}/v1/chat/completions" \
  -H "Authorization: Bearer nm_st_VAK8CS0FJP_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello via Service Token!"}]
  }'
```

---

## Next Steps

- Developer Portal Guide & Partner Gateway API: [Project Service Tokens Guide](../developer-portal/projects/service-tokens.md)
- Portal management guide: [Developer Portal Service Tokens](../developer-portal/projects/service-tokens.md)
- API endpoint documentation: [Service Tokens API Reference](../api/service-tokens.md)
