# Project Service Tokens (PST)

**Project Service Tokens** are high-security, machine-to-machine credentials engineered for backend services, automated CI/CD pipelines, background worker processes, and autonomous agent swarms.

Unlike standard API keys, Project Service Tokens provide fine-grained **capability matrices**, **time-to-live (TTL) expirations**, **environment scoping**, and **human member attribution**.

```mermaid
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
```

---

## Core Features & Guarantees

### 1. Fine-Grained Capability Matrix
Every Project Service Token specifies an explicit list of allowed capabilities. Requests attempting actions outside the capability scope are rejected at the gateway:

| Capability | Allowed Operations |
| :--- | :--- |
| `inference:chat` | Standard and streaming chat completions (`/v1/chat/completions`). |
| `inference:embeddings` | Vector embeddings generation (`/v1/embeddings`). |
| `models:read` | Model catalog listing and provider capability discovery. |
| `tools:execute` | Invoking registered HTTP/gRPC tools and functions. |
| `mcp:access` | Connecting to Model Context Protocol (MCP) servers and tools. |
| `skills:read` | Reading agent prompts, skills, and templates. |

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
curl -X POST "http://localhost:8080/v1/chat/completions" \
  -H "Authorization: Bearer nst_live_9f8a2b1c3d4e..." \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello via Service Token!"}]
  }'
```

---

## Next Steps

- Portal management guide: [Developer Portal Service Tokens](../developer-portal/service-tokens.md)
- API endpoint documentation: [Service Tokens API Reference](../api/service-tokens.md)
