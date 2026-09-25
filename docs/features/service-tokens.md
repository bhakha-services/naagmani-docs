# Project Service Tokens

Project Service Tokens (PST) provide secure, long-lived machine-to-machine (M2M) credentials designed specifically for autonomous AI agents, CI/CD pipelines, background microservices, and backend servers.

Unlike personal API keys, service tokens are decoupled from individual team members and strictly bound to designated project environments with granular capability scopes and optional rate limits.

---

## Why Use Project Service Tokens?

When deploying AI applications to production or setting up automated pipelines, using personal user API keys introduces operational and security risks. Project Service Tokens solve these challenges:

| Feature | Personal API Keys | Project Service Tokens |
| :--- | :--- | :--- |
| **Account Coupling** | Bound to individual user accounts; revokes when an employee offboards. | **Independent machine identity**; persists across team changes. |
| **Environment Isolation** | Often reused across Test and Production. | **Strictly pinned** to a specific environment (`Production` or `Test`). |
| **Permission Scope** | Full user account permissions (broad access). | **Granular capability scopes** (`inference.execute`, `models.read`, `members.read`, etc.). |
| **Rate Limiting & Abuse** | Tied to personal account tiers. | **Configurable Requests Per Minute (RPM)** limits per token. |
| **Budget & Spending** | Direct user spend tracking. | **Hierarchical spending attribution** (attributable to members via `X-Naagmani-Member-ID`). |
| **Credential Rotation** | Hard cutover causing immediate downtime during rotation. | **Zero-downtime rotation** with dual-authentication grace periods (1–72 hours). |
| **Audit & Visibility** | Obscures automated traffic as personal user actions. | **Dedicated audit trail** and public identifiers for observability. |

---

## Token Anatomy & Security

Every Project Service Token is generated with 192 bits of cryptographic entropy (`crypto/rand`) and stored exclusively as a SHA-256 hash at rest. Plaintext secrets are displayed strictly once upon creation.

```
nm_st_ + [10-character Base32 Public ID] + _ + [48-character Hex Secret]
```

**Example:**
```
nm_st_VAK8CS0FJP_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678
```

- **Prefix (`nm_st_`)**: Standardized prefix that allows secret detection scanners (TruffleHog, GitHub Secret Scanning, GitLab) to automatically detect leaked credentials in code repositories.
- **Public ID (`VAK8CS0FJP`)**: Safe Crockford Base32 identifier for dashboards, logs, and telemetry without revealing secret material.
- **Masked Format (`nm_st_VAK8CS0FJP_****...5678`)**: Display format used in dashboard tables and application logs.

---

## Granular Capability Scopes

Enforce the principle of least privilege by granting only the exact capabilities your workload requires:

| Capability | Category | Description | Allowed Operations |
| :--- | :--- | :--- | :--- |
| `inference.execute` | **Runtime** | Authorizes executing chat completions and streaming inference. | `POST /v1/chat/completions` |
| `models.read` | **Catalog** | Allows querying and discovering available models and provider capabilities. | `GET /v1/models` |
| `usage.read` | **FinOps** | Grants read access to project-level usage telemetry and spend analytics. | `GET /v1/usage/analytics` |
| `provider.use` | **Routing** | Authorizes routing traffic through configured BYOK upstream credentials. | AI Gateway Routing |
| `members.read` | **Directory** | Grants read access to organization/project directory and member profiles. | `GET /v1/organizations/{orgID}/members` |
| `members.write` | **Directory** | Authorizes creating, updating, and managing member profiles and quotas. | `POST / PATCH / DELETE /v1/organizations/{orgID}/members` |

---

## Spending Budget & Member Attribution Architecture

Naagmani enforces a clean separation between **Authentication & Machine Identity** and **Financial Spending Limits**:

1. **Hierarchical Spending Budgets**: Financial daily/monthly spend limits are owned strictly by the entity hierarchy:
   $$\text{Organization Budget} \longrightarrow \text{Project Budget} \longrightarrow \text{Member Budget}$$
   Budgets evaluate in the organization's account billing currency (managed centrally in the Billing module).
2. **PST Role**: A Project Service Token does not independently hold a currency spending budget. Instead, its spend consumes the parent Project and Organization budget.
3. **Member Attribution**: Workloads operating through a service token can attribute spend to an individual directory member by passing the `X-Naagmani-Member-ID` HTTP header:
   ```http
   X-Naagmani-Member-ID: mbr_23255f47-29a9-41df-8495-3a6edca814c8
   ```
4. **Token Rate Limiting (RPM)**: You can configure an explicit `requests_per_minute` (RPM) cap on the token to protect downstream LLM providers and background microservices from runaway loops or script errors.

---

## How to Create and Manage Tokens

### Method 1: Using the Developer Portal (Recommended)

1. Log in to your **Naagmani Developer Portal**.
2. Select your Organization and target **Project**.
3. In the sidebar, navigate to **Project Settings → Service Tokens**.
4. Click **Create Service Token** and configure:
   - **Token Name**: A recognizable label (e.g. `github-actions-ci`, `eval-agent-prod`).
   - **Environment**: Select `Production` or `Test`.
   - **Capabilities**: Select the required permissions (`Chat Inference`, `Model Discovery`, `Usage Read`, `Provider Use`, `Directory Read`, `Directory Write`).
   - **Requests Per Minute (RPM)**: Optional rate-limit cap (leave blank for unlimited).
   - **Expiration Policy (TTL)**:
     - Preset options: `30 Days`, `60 Days`, `90 Days` (Default), `180 Days`, `365 Days (1 Year)`
     - **Never**: For standing production microservices and background daemons (`expires_in_days: 0`).
     - **Custom Duration**: Enter any custom lifetime in days (e.g. `7`, `14`, `45`, `120`).
5. Click **Generate Service Token** and copy the secret immediately to your secret manager (GitHub Secrets, AWS Secrets Manager, HashiCorp Vault).

---

### Method 2: Programmatically via Management API

Administrators can automate service token provisioning via the Management REST API:

```bash
curl -X POST https://api.naagmani.com/v1/projects/YOUR_PROJECT_ID/service-tokens \
  -H "Authorization: Bearer $ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "github-actions-ci",
    "description": "Token for automated regression evaluation",
    "environment_id": "YOUR_ENVIRONMENT_ID",
    "capabilities": ["models.read", "inference.execute", "members.read"],
    "requests_per_minute": 120,
    "expires_in_days": 90
  }'
```

---

## Using Service Tokens in Your Code

Pass your Project Service Token as a Bearer token in the standard HTTP `Authorization` header, or configure it directly in your favorite AI SDK.

### Python (OpenAI SDK Compatible)

```python
from openai import OpenAI

# Initialize client with Naagmani Gateway and Service Token
client = OpenAI(
    base_url="https://api.naagmani.com/v1",
    api_key="nm_st_VAK8CS0FJP_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678",
    default_headers={
        # Optional: attribute spend to a specific member
        "X-Naagmani-Member-ID": "mbr_23255f47-29a9-41df-8495-3a6edca814c8"
    }
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful CI evaluation agent."},
        {"role": "user", "content": "Analyze test report logs."}
    ],
    temperature=0.2
)

print(response.choices[0].message.content)
```

### TypeScript / Node.js

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.naagmani.com/v1",
  apiKey: process.env.NAAGMANI_SERVICE_TOKEN, // nm_st_VAK8CS0FJP_...
  defaultHeaders: {
    // Optional: attribute spend to a specific member
    "X-Naagmani-Member-ID": "mbr_23255f47-29a9-41df-8495-3a6edca814c8"
  }
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: "Hello from background worker!" }],
  });

  console.log(completion.choices[0].message.content);
}

main();
```

### cURL

```bash
curl -X POST https://api.naagmani.com/v1/chat/completions \
  -H "Authorization: Bearer nm_st_VAK8CS0FJP_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678" \
  -H "X-Naagmani-Member-ID: mbr_23255f47-29a9-41df-8495-3a6edca814c8" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "Run automated evaluation suite"}
    ]
  }'
```

---

## Zero-Downtime Token Rotation

To maintain high availability when updating credentials across distributed systems, Naagmani supports **grace-period rotation**.

```
[Active Token A] ──► Trigger Rotation ──► [Token A: Expiring (Dual-Auth Window)] ──► Expired
                                     └──► [Token B: Active (Successor)]
```

1. Initiate rotation via Dashboard or API, setting a grace period (e.g. `24` hours).
2. Naagmani generates successor **Token B** and sets **Token A** to `expiring`.
3. **Both tokens authenticate successfully** during the grace period window.
4. Deploy Token B across your microservices and CI/CD variables.
5. Once the grace period expires (or when you explicitly revoke Token A), Token A is automatically retired with zero service interruption.

---

## Complete Management API Reference

### 1. Create Service Token
Generates a new token. Returns the raw secret once.

- **Endpoint**: `POST /v1/projects/{projectId}/service-tokens`
- **Auth**: Organization Admin or Project Admin

```bash
curl -X POST https://api.naagmani.com/v1/projects/YOUR_PROJECT_ID/service-tokens \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ci-runner",
    "environment_id": "YOUR_ENV_ID",
    "capabilities": ["models.read", "inference.execute", "members.read"],
    "requests_per_minute": 120,
    "expires_in_days": 90
  }'
```

#### Request Fields

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | Yes | Human-readable identifier for the token. |
| `environment_id` | UUID | Yes | Target environment (`Production` or `Test`). |
| `capabilities` | string[] | Yes | Array of capability strings (`inference.execute`, `models.read`, `usage.read`, `provider.use`, `members.read`, `members.write`). |
| `requests_per_minute` | integer | No | Rate limit throttle for this token (null / omitted for unlimited). |
| `expires_in_days` | integer | No | Lifetime in days (`0` for never expire, or positive integer like `30`, `60`, `90`). |
| `ttl_seconds` | integer | No | Alternative lifetime in seconds. |
| `expires_at` | string | No | Explicit ISO 8601 / RFC3339 timestamp. |

#### Response (`201 Created`)
```json
{
  "token": "nm_st_VAK8CS0FJP_8f14e45c7b39a2d04e5f61728394a5b6c7d8e9f012345678",
  "service_token": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "public_id": "VAK8CS0FJP",
    "name": "ci-runner",
    "organization_id": "123e4567-e89b-12d3-a456-426614174000",
    "project_id": "f7cf337c-2c9a-4631-8957-9dbfe602cc17",
    "environment_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "token_prefix": "nm_st_",
    "masked_identifier": "nm_st_VAK8CS0FJP_****...5678",
    "status": "active",
    "capabilities": ["models.read", "inference.execute", "members.read"],
    "requests_per_minute": 120,
    "expires_at": "2026-12-23T16:30:00Z",
    "created_at": "2026-09-24T16:30:00Z"
  }
}
```

---

### 2. List Service Tokens
Lists metadata for all service tokens in a project.

- **Endpoint**: `GET /v1/projects/{projectId}/service-tokens`
- **Query Parameters**:
  - `environment_id` *(optional)*: Filter by environment UUID.
  - `limit` *(optional)*: Page size (default: 50, max: 100).
  - `offset` *(optional)*: Page offset (default: 0).

```bash
curl -X GET "https://api.naagmani.com/v1/projects/YOUR_PROJECT_ID/service-tokens?limit=50&offset=0" \
  -H "Authorization: Bearer $USER_TOKEN"
```

#### Response (`200 OK`)
```json
{
  "data": [
    {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "public_id": "VAK8CS0FJP",
      "name": "ci-runner",
      "status": "active",
      "masked_identifier": "nm_st_VAK8CS0FJP_****...5678",
      "capabilities": ["models.read", "inference.execute", "members.read"],
      "requests_per_minute": 120,
      "expires_at": "2026-12-23T16:30:00Z",
      "last_used_at": "2026-09-24T17:05:22Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

---

### 3. Get Service Token Details
Retrieves metadata for a single service token.

- **Endpoint**: `GET /v1/projects/{projectId}/service-tokens/{tokenId}`

```bash
curl -X GET https://api.naagmani.com/v1/projects/YOUR_PROJECT_ID/service-tokens/7c9e6679-7425-40de-944b-e07fc1f90ae7 \
  -H "Authorization: Bearer $USER_TOKEN"
```

---

### 4. Rotate Service Token
Rotates a token and generates a new secret.

- **Endpoint**: `POST /v1/projects/{projectId}/service-tokens/{tokenId}/rotate`
- **Request Body**:
  ```json
  {
    "grace_period_hours": 24
  }
  ```

```bash
curl -X POST https://api.naagmani.com/v1/projects/YOUR_PROJECT_ID/service-tokens/7c9e6679-7425-40de-944b-e07fc1f90ae7/rotate \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"grace_period_hours": 24}'
```

#### Response (`201 Created`)
```json
{
  "token": "nm_st_01J8K3M90B_7e28a49c1b34e56f7890123456789abcdef0123456789012",
  "service_token": {
    "id": "8d0f7780-8536-41ef-a55c-180fc2a01bf8",
    "public_id": "01J8K3M90B",
    "name": "ci-runner",
    "status": "active",
    "replaces_token_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
  }
}
```

---

### 5. Revoke Service Token
Immediately invalidates a compromised or obsolete token.

- **Endpoint**: `DELETE /v1/projects/{projectId}/service-tokens/{tokenId}?reason=pipeline_decommissioned`

```bash
curl -X DELETE "https://api.naagmani.com/v1/projects/YOUR_PROJECT_ID/service-tokens/7c9e6679-7425-40de-944b-e07fc1f90ae7?reason=pipeline_decommissioned" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## Best Practices

1. **One Token per Pipeline / Agent**: Create dedicated tokens for each workload (e.g. `eval-agent`, `staging-deployer`, `customer-support-bot`) to simplify auditing and rotation.
2. **Never Commit Secrets to Git**: Always store the `nm_st_...` plaintext secret in an environment variable or secrets manager.
3. **Use Environment Pinning**: Do not share tokens across environments. Ensure staging machines connect exclusively with tokens bound to the `Staging` environment.
4. **Leverage Grace Periods**: When rotating credentials in production, specify a grace window (e.g. 24–48 hours) to prevent pipeline interruption while deployment updates propagate.
5. **Set RPM Limits for Background Jobs**: Protect upstream AI providers and project budgets by assigning reasonable RPM limits to asynchronous workers.
6. **Pass Member ID for Multi-User Workloads**: When executing LLM requests on behalf of human users or specific internal directory members, pass the `X-Naagmani-Member-ID` header for accurate attribution and member-level budget enforcement.

---

## Reference Integration: Zomato AI Demo

The `demos/zomato-ai-demo` project demonstrates full lifecycle integration with Project Service Tokens:
- **Zero-Downtime Migration**: Seamless fallback between personal API keys (`nm_live_...`) and Project Service Tokens (`nm_st_...`).
- **Authorization Matrix**: Interactive UI test harness running 10 security validation scenarios including cross-project and capability isolation.
- **Token Management Console**: Embedded token creation, zero-downtime rotation, and revocation.
- **Detailed Specification**: See [project-service-tokens.md](../../project-service-tokens.md#13-zomato-ai-demo-integration) for architecture and run instructions.
