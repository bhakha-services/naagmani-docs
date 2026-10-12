# Project Service Tokens

**Project Service Tokens** are scoped, machine-to-machine authentication credentials designed for backend microservices, daemon jobs, automated CI/CD pipelines, and **B2B Partner Gateways** requiring strict capability boundaries and granular budget guardrails.

- **Portal Location**: `Projects > [Your Project] > Workspace > Service Tokens` (`/projects/[slug]/service-tokens`)
- **Control Plane API**: `/v1/projects/{projectId}/service-tokens`
- **Partner Services Gateway**: `/v1/services/tokens`

---

## What is a Project Service Token?

Unlike personal API keys, a **Project Service Token** (`nm_st_...`) binds a machine workload to an explicit **Capability Allowlist** and environment. Even if the credential is leaked, an attacker cannot perform actions outside the token's explicit capability boundaries.

```mermaid
graph TD
    Service["Backend Microservice (e.g. Partner Server)"]
    Service -->|Uses 'nm_st_VAK8CS0FJP_...'| Gateway["Naagmani Gateway"]
    Gateway -->|Inspects Scopes| Authz["Capability & Route Evaluator"]
    Authz -->|'inference.execute' -> ALLOW| RunInference["Execute Model Call"]
    Authz -->|'/v1/services/*' -> ALLOW| PartnerGateway["Provision / Manage Child Keys"]
    Authz -->|'billing.write' -> DENY| BlockAdmin["Block Administrative Mutation (HTTP 403)"]
```

### Token Anatomy & Security
Every Project Service Token is generated with 192 bits of cryptographic entropy (`crypto/rand`) and stored strictly as a SHA-256 hash at rest. Plaintext secrets are displayed strictly once upon generation:

```
nm_st_ + [10-char Base32 Public ID] + _ + [48-char Hex Secret]
```

**Example:**
```
nm_st_VAK8CS0FJP_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678
```

- **Prefix (`nm_st_`)**: Standard prefix recognized by GitHub Secret Scanning, TruffleHog, and GitLab.
- **Public ID (`VAK8CS0FJP`)**: Safe Crockford Base32 identifier for dashboards, logs, and telemetry without revealing secret material.
- **Masked Format (`nm_st_VAK8CS0FJP_****...5678`)**: Display format used in dashboard tables and application logs.

---

## Canonical Capability Allowlist

Capabilities in Naagmani follow a strict dot-notation standard verified by the gateway runtime:

| Canonical Capability | Category | Description | Permitted Endpoints |
|---|---|---|---|
| `inference.execute` | Runtime | Permission to dispatch model inference and streaming completions. | `POST /v1/chat/completions`<br>`POST /v1/embeddings`<br>`POST /v1/responses` |
| `models.read` | Catalog | Permission to list active models, virtual aliases, and provider candidate statuses. | `GET /v1/models`<br>`GET /v1/models/{id}` |
| `usage.read` | FinOps | Permission to read token consumption metrics, latency telemetry, and attempt logs. | `GET /v1/usage`<br>`GET /v1/attempts` |
| `provider.use` | Routing | Permission to utilize organization-level BYOK provider credentials. | Gateway Provider Resolution |
| `members.read` | Directory | Permission to query external customer member profiles, quotas, and metadata. | `GET /v1/organizations/{orgID}/members` |
| `members.write` | Directory | Permission to create, update, or revoke customer member identities. | `POST /v1/organizations/{orgID}/members`<br>`DELETE /v1/organizations/{orgID}/members/{id}` |

> [!IMPORTANT]
> Wildcard capabilities (e.g. `*` or `inference.*`) are rejected by Naagmani's validation engine to enforce strict least-privilege compliance.

---

## Creating a Service Token in Developer Portal

1. In your active project workspace, navigate to **Workspace > Service Tokens**.
2. Click **Create Service Token**.
3. Configure the machine credential:
   - **Token Name**: A descriptive label (e.g., `zomato-backend-prod`, `ci-runner`).
   - **Environment**: Select `Test` or `Production`.
   - **Capabilities**: Select the exact permissions required (`inference.execute`, `models.read`, `usage.read`).
   - **Expiration / TTL**: Preset options (`30 Days`, `90 Days`, `365 Days`, or `Never Expire` for daemons).
   - **Requests Per Minute (RPM)** *(Optional)*: Dedicated rate-limiting throttle.
4. Click **Create Token** and copy the secret (`nm_st_...`) immediately.

---

## B2B Partner Services Gateway (`/v1/services/*`)

The **Partner Services Gateway** enables third-party backend systems (such as Zomato, enterprise SaaS platforms, or internal partner bots) holding a Master Service Token (`nm_st_...`) to programmatically provision, track, and revoke **Child User Tokens** (`nm_live_...`) for their employees or end-users with assigned monthly budgets, rate limits, and model whitelists.

- **Authentication**: `Authorization: Bearer nm_st_<public_id>_<secret>` (Master Service Token)
- **Child Token Format**: Standard Naagmani API Key (`nm_live_` + 48 hex characters).
- **Identity Architecture**: Automatically provisions and links end-users to **Customer / Member** identities (`member_id`) without duplicating user tables.

```mermaid
graph TD
    PartnerBackend["Partner Server (Holds nm_st_...)"]
    PartnerGateway["/v1/services/tokens Gateway"]
    MemberDB["Customer Member Profile (Budget & Spend)"]
    ChildKey["Child API Key (nm_live_..., RPM & Allowed Models)"]
    EndUserApp["End-User App (Uses nm_live_...)"]
    ChatAPI["POST /v1/chat/completions"]

    PartnerBackend -->|POST /v1/services/tokens| PartnerGateway
    PartnerGateway -->|Upsert Profile| MemberDB
    PartnerGateway -->|Mint standard API Key| ChildKey
    EndUserApp -->|Authorization: Bearer nm_live_...| ChatAPI
    ChatAPI -->|Enforce Budget & RPM| ChildKey
```

---

### 1. Provision Child User Token
Provisions an end-user or employee, binds them to a member profile, and issues a standard `nm_live_...` API key with fine-grained budget, RPM, and model governance.

- **Endpoint**: `POST /v1/services/tokens`
- **Auth**: Master Service Token (`Authorization: Bearer nm_st_...`)

```bash
curl -X POST https://api.naagmani.com/v1/services/tokens \
  -H "Authorization: Bearer nm_st_VAK8CS0FJP_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678" \
  -H "Content-Type: application/json" \
  -d '{
    "external_user_id": "zomato_emp_101",
    "name": "Rahul Sharma",
    "email": "rahul.sharma@zomato.com",
    "department": "customer_support",
    "monthly_budget_usd": 15.00,
    "requests_per_minute": 30,
    "allowed_models": ["gpt-4o-mini", "claude-3-haiku"],
    "expires_in_days": 30,
    "metadata": {
      "tier": "gold",
      "location": "gurugram"
    }
  }'
```

#### Request Fields

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `external_user_id` | string | **Yes** | Unique partner-side identifier for the employee or user (e.g. `zomato_emp_101`). |
| `name` | string | No | Display name of the user/employee. Defaults to `external_user_id`. |
| `email` | string | No | Email address for directory record. Defaults to synthetic partner email. |
| `department` | string | No | Department or cost center tag (e.g. `customer_support`, `engineering`). |
| `monthly_budget_usd` | float | No | Hard monthly spending cap in USD (e.g. `15.00`). Checked on each inference request. |
| `requests_per_minute` | integer | No | Requests-per-minute (RPM) rate-limiting ceiling for this key. |
| `allowed_models` | string[] | No | Whitelist of allowed model identifiers. Unapproved models return `403 Forbidden`. |
| `expires_in_days` | integer | No | Token lifetime in days (defaults to `30`). |
| `metadata` | object | No | Key-value pairs for partner-specific metadata. |

#### Response (`201 Created`)
```json
{
  "api_key": "nm_live_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678",
  "id": "c39a2d04-4e5f-4172-8394-a5b6c7d8e9f0",
  "key_prefix": "nm_live_",
  "masked_identifier": "nm_live_8f14...5678",
  "member_id": "mbr_23255f47-29a9-41df-8495-3a6edca814c8",
  "external_user_id": "zomato_emp_101",
  "name": "Rahul Sharma",
  "department": "customer_support",
  "status": "active",
  "monthly_budget_usd": 15.00,
  "requests_per_minute": 30,
  "allowed_models": ["gpt-4o-mini", "claude-3-haiku"],
  "expires_at": "2026-11-10T18:00:00Z",
  "created_at": "2026-10-11T18:00:00Z"
}
```
*(The raw key `nm_live_...` is returned strictly once upon generation. Only the SHA-256 hash is persisted at rest).*

---

### 2. List Provisioned Child Tokens
Lists all active or historical tokens provisioned under the caller's Master Service Token.

- **Endpoint**: `GET /v1/services/tokens`
- **Auth**: Master Service Token (`Authorization: Bearer nm_st_...`)
- **Query Parameters**:
  - `status` *(optional)*: Filter by status (`active`, `revoked`, `all`).
  - `search` *(optional)*: Search by user name or `external_user_id`.
  - `limit` *(optional)*: Page size (default: 50, max: 100).
  - `offset` *(optional)*: Pagination offset.

```bash
curl -X GET "https://api.naagmani.com/v1/services/tokens?status=active&limit=50&offset=0" \
  -H "Authorization: Bearer nm_st_VAK8CS0FJP_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678"
```

#### Response (`200 OK`)
```json
{
  "data": [
    {
      "id": "c39a2d04-4e5f-4172-8394-a5b6c7d8e9f0",
      "key_prefix": "nm_live_",
      "masked_identifier": "nm_live_8f14...5678",
      "member_id": "mbr_23255f47-29a9-41df-8495-3a6edca814c8",
      "external_user_id": "zomato_emp_101",
      "name": "Rahul Sharma",
      "department": "customer_support",
      "status": "active",
      "monthly_budget_usd": 15.00,
      "requests_per_minute": 30,
      "allowed_models": ["gpt-4o-mini", "claude-3-haiku"],
      "expires_at": "2026-11-10T18:00:00Z",
      "last_used_at": "2026-10-11T20:15:00Z",
      "created_at": "2026-10-11T18:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

---

### 3. Get Child Token Details
Retrieves metadata, governance limits, and status for a single provisioned key.

- **Endpoint**: `GET /v1/services/tokens/{tokenId}`
- **Auth**: Master Service Token (`Authorization: Bearer nm_st_...`)

```bash
curl -X GET https://api.naagmani.com/v1/services/tokens/c39a2d04-4e5f-4172-8394-a5b6c7d8e9f0 \
  -H "Authorization: Bearer nm_st_VAK8CS0FJP_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678"
```

---

### 4. Inspect Real-Time Usage & FinOps Telemetry
Returns aggregated consumption metrics, current calendar month spend, and remaining budget for a provisioned token.

- **Endpoint**: `GET /v1/services/tokens/{tokenId}/usage`
- **Auth**: Master Service Token (`Authorization: Bearer nm_st_...`)

```bash
curl -X GET https://api.naagmani.com/v1/services/tokens/c39a2d04-4e5f-4172-8394-a5b6c7d8e9f0/usage \
  -H "Authorization: Bearer nm_st_VAK8CS0FJP_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678"
```

#### Response (`200 OK`)
```json
{
  "token_id": "c39a2d04-4e5f-4172-8394-a5b6c7d8e9f0",
  "external_user_id": "zomato_emp_101",
  "monthly_budget_usd": 15.00,
  "current_month_spend_usd": 4.25,
  "remaining_budget_usd": 10.75,
  "total_requests": 142,
  "total_tokens": 850000,
  "last_used_at": "2026-10-11T20:15:00Z"
}
```

---

### 5. Revoke Child Token
Immediately invalidates a provisioned child key (e.g. employee offboarding, department change, or security alert).

- **Endpoint**: `DELETE /v1/services/tokens/{tokenId}?reason=employee_offboarded`
- **Auth**: Master Service Token (`Authorization: Bearer nm_st_...`)

```bash
curl -X DELETE "https://api.naagmani.com/v1/services/tokens/c39a2d04-4e5f-4172-8394-a5b6c7d8e9f0?reason=employee_offboarded" \
  -H "Authorization: Bearer nm_st_VAK8CS0FJP_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678"
```

#### Response (`200 OK`)
```json
{
  "status": "revoked"
}
```

---

### 6. End-User AI Usage (`POST /v1/chat/completions`)
The end-user or client application uses the minted child token just like a standard Naagmani API key.

```bash
curl -X POST https://api.naagmani.com/v1/chat/completions \
  -H "Authorization: Bearer nm_live_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "Assist customer with delivery tracking"}
    ]
  }'
```

- **Model Whitelist Enforcement**: If `allowed_models` was configured on the child token and the caller requests an unapproved model, the gateway returns `403 Forbidden: model not allowed for this key`.
- **Rate Limit Enforcement**: Throttled strictly at the provisioned `requests_per_minute` (RPM) ceiling.
- **Budget Guardrails**: Spend is tracked against `monthly_budget_usd`. If exhausted, requests return `429 Too Many Requests / 402 Payment Required: monthly budget limit reached`.

---

## Best Practices

1. **One Master Service Token per Partner Integration**: Create dedicated tokens with granular scopes for partner integrations (e.g. `zomato-backend-prod`).
2. **Never Commit Secrets to Git**: Always store `nm_st_...` master tokens and `nm_live_...` child tokens in environment variables or a secure secrets manager.
3. **Use Environment Pinning**: Do not share tokens across environments. Ensure test runners connect exclusively with tokens bound to the `Test` environment, and production services use `Production` tokens.
4. **Set RPM Limits for Provisioned Child Keys**: Protect upstream AI providers and project budgets by assigning reasonable RPM limits to individual employee tokens.
5. **Pass Member ID for Multi-User Workloads**: When executing LLM requests on behalf of human users or specific internal directory members, pass the `X-Naagmani-Member-ID` header for accurate attribution and member-level budget enforcement.

---

## Related Documentation

- [API Keys & Vault](/docs/developer-portal/projects/api-keys)
- [Project Service Tokens API Reference](/docs/api/service-tokens)
