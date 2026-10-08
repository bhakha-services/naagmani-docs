# Project Service Tokens

**Project Service Tokens** are scoped, machine-to-machine authentication credentials designed for backend microservices, daemon jobs, and automated CI/CD pipelines requiring strict capability boundaries and zero-downtime key rotation.

- **Portal Location**: `Projects > [Your Project] > Workspace > Service Tokens` (`/projects/[slug]/service-tokens`)
- **API Endpoint**: `/v1/projects/{projectId}/service-tokens`

---

## What is a Project Service Token?

Unlike standard API keys, a **Project Service Token** (`nsk_...`) binds a machine workload to a granular **Capability Allowlist**. Even if the token is compromised, an attacker cannot perform actions outside the token's explicit capability boundaries.

```mermaid
graph TD
    Service["Backend Microservice (e.g. Ingestion Pipeline)"]
    Service -->|Uses 'nsk_live_...'| Gateway["Naagmani Gateway"]
    Gateway -->|Inspects Scopes| Authz["Capability Evaluator"]
    Authz -->|'inference.execute' -> ALLOW| RunInference["Execute Model Call"]
    Authz -->|'members.write' -> DENY| BlockAdmin["Block Member Mutation (HTTP 403)"]
```

---

## Canonical Capability Allowlist

Capabilities in Naagmani follow a strict dot-notation standard verified by the gateway runtime:

| Canonical Capability | Description | Permitted Endpoints |
|---|---|---|
| `inference.execute` | Permission to dispatch model inference and streaming requests. | `POST /v1/chat/completions`<br>`POST /v1/embeddings`<br>`POST /v1/responses` |
| `models.read` | Permission to list active models, virtual aliases, and candidate statuses. | `GET /v1/models`<br>`GET /v1/models/{id}` |
| `usage.read` | Permission to read token consumption metrics, latency telemetry, and attempt logs. | `GET /v1/usage`<br>`GET /v1/attempts` |
| `provider.use` | Permission to utilize organization-level BYOK provider credentials. | Gateway Provider Resolution |
| `members.read` | Permission to query external customer member quotas and metadata. | `GET /v1/members` |
| `members.write` | Permission to create, update, or revoke customer member identities. | `POST /v1/members`<br>`DELETE /v1/members/{id}` |

> [!IMPORTANT]
> Wildcard capabilities (e.g. `*` or `inference.*`) are rejected by Naagmani's validation engine to enforce strict least-privilege compliance.

---

## Zero-Downtime Token Rotation with Grace Periods

Rotating credentials in production without dropping active requests requires dual-key coexistence:

```mermaid
sequenceDiagram
    autonumber
    actor CI as CI/CD Automation
    participant Portal as Naagmani Control Plane
    participant GW as Active Gateway Instances

    CI->>Portal: POST /v1/projects/{id}/service-tokens/{id}/rotate (grace_period_hours=24)
    Portal-->>CI: Returns Successor Token (nsk_live_new...)
    Note over Portal,GW: Both Old (nsk_live_old) and New (nsk_live_new) are valid for 24 hours
    CI->>CI: Deploy new secret to microservices & restart pods
    Note over CI,GW: Traffic smoothly transitions to nsk_live_new
    Note over Portal,GW: 24h Grace Period Expires -> nsk_live_old automatically revoked
```

1. When you trigger **Rotate**, Naagmani generates a new successor token while keeping the old token active during a configurable **Grace Period** (e.g. 24 hours).
2. Your orchestration system rolls out the new token to all container pods.
3. Once the grace period elapses, the legacy token is automatically revoked.

---

## Creating a Service Token in Developer Portal

1. In your active project workspace, click **Workspace > Service Tokens**.
2. Click **Create Service Token**.
3. Configure:
   - **Token Name**: e.g., `Async Job Worker`.
   - **Environment**: Select `test` or `production`.
   - **Capabilities**: Check the exact permissions required (e.g., `inference.execute`, `models.read`).
   - **Expiration / TTL**: Set expiration days (e.g. 30 days, 180 days).
   - **Requests Per Minute (RPM)** *(Optional)*: Dedicated throttling cap.
4. Click **Create Token** and save the returned secret (`nsk_live_...`).

---

## Using Service Tokens via API

Service Tokens are passed as standard Bearer tokens in HTTP requests:

```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer nsk_live_8f7e6d5c4b3a2109..." \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hello from automated service"}]
  }'
```

---

## Related Documentation

- [API Keys & Vault](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/projects/api-keys.md)
- [Service Tokens API Reference](file:///e:/project/naagmani-project/naagmani-docs/docs/api/service-tokens.md)
