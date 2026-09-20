# API Keys

API keys authenticate programmatic requests to the Naagmani Gateway and CLI tools. Every API key in Naagmani is scoped to a specific project and environment.

---

## Overview

Naagmani uses scoped API keys with distinct prefixes to provide clear visibility into environment targets and prevent accidental cross-environment execution.

### Key Prefix Format

| Prefix | Environment | Purpose |
| :--- | :--- | :--- |
| `nmn_live_` | Production (`production`) | Production workloads and live consumer traffic. |
| `nmn_test_` | Test (`test`) | Testing, local development, and CI/CD pipelines. |

> [!IMPORTANT]
> API keys are shown **only once** upon generation in the Naagmani Developer Portal. Store them securely in an environment variable management tool or secret store.

---

## Authentication Mechanism

Include your API key in the `Authorization` header as a Bearer token:

```http
Authorization: Bearer nmn_live_xxxxxxxxxxxxxxxxxxxxxxxx
```

Alternatively, the header `X-API-Key` is supported:

```http
X-API-Key: nmn_live_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Key Scopes & Permissions

Naagmani API keys can be provisioned with granular access controls:

| Scope | Description |
| :--- | :--- |
| `inference` | Allows calling chat completions, responses, and embeddings endpoints. |
| `plugins:read` | Allows querying installed plugins and executing plugin-assisted routes. |
| `plugins:write` | Allows uploading, registering, and configuring plugin manifests (typically CLI usage). |
| `usage:read` | Allows querying usage metrics and telemetry endpoints. |
| `admin` | Full administrative access to the project and its resources. |

---

## Managing API Keys

### Via Naagmani Developer Portal

1. Navigate to **Projects** > Select your Project > **API Keys**.
2. Click **Create API Key**.
3. Specify a descriptive label (e.g., `ci-testing-runner`, `backend-api-prod`).
4. Select the target environment (`production` or `test`).
5. Choose required permission scopes.
6. Copy and store the generated key.

### Key Rotation & Revocation

- **Immediate Revocation**: Deleting a key in the portal revokes authorization across all gateway edge nodes within 30 seconds.
- **Zero-Downtime Rotation**:
  1. Generate a new API key with identical scopes.
  2. Deploy the new key to your application environments.
  3. Verify traffic on the new key via Naagmani metrics.
  4. Revoke the old API key.

---

## Best Practices

1. **Environment Separation**: Never use a `nmn_live_` key in automated test suites or local development.
2. **Secret Management**: Inject keys via environment variables (e.g., `NAAGMANI_API_KEY`) rather than hardcoding.
3. **Least Privilege**: Grant only the scopes necessary for each microservice or pipeline.
4. **Regular Rotation**: Rotate API keys periodically (e.g., every 90 days) using zero-downtime rotation.
