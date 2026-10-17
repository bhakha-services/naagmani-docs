# Request Logs API Reference

The Request Logs API allows authorized portal users to inspect unified telemetry, lifecycle stages, and payload snapshots for all inference requests dispatched through Naagmani OS.

---

## 1. List Request Logs

Retrieve paginated inference request records for an organization.

```http
GET /v1/organizations/{organizationId}/request-logs
```

### Request Headers

| Header | Type | Description |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <token>` | User session bearer token. Requires `audit.read` scope. |

### Query Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `project_id` | string | No | Filter by specific project UUID. |
| `environment_id` | string | No | Filter by environment UUID. |
| `api_key_id` | string | No | Filter by API key UUID. |
| `model` | string | No | Filter by model identifier. |
| `date_from` | string | No | RFC 3339 start timestamp. |
| `date_to` | string | No | RFC 3339 end timestamp. |
| `page` | integer | No | Page number (default: 1). |
| `per_page` | integer | No | Items per page (default: 25, max: 100). |

---

## 2. Get Request Log Details

Retrieve complete details for a single request log entry, including execution trace and plugin transformation summaries.

```http
GET /v1/organizations/{organizationId}/request-logs/{recordId}
```

### Response Example (`redacted_payload` policy)

```json
{
  "id": "rl_01JAZ981XBC42",
  "request_id": "req_881920",
  "organization_id": "org_7109283",
  "project_id": "proj_119028",
  "environment_id": "env_test_01",
  "api_key_name": "Development API Key",
  "key_prefix": "nm_live_8192",
  "provider_name": "openai",
  "model": "gpt-4o",
  "method": "POST",
  "path": "/v1/chat/completions",
  "status_code": 200,
  "success": true,
  "duration_ms": 482,
  "provider_duration_ms": 412,
  "input_tokens": 128,
  "output_tokens": 42,
  "total_tokens": 170,
  "payload_logging_policy": "redacted_payload",
  "is_encrypted": false,
  "truncated": false,
  "request_body": "{\"model\":\"gpt-4o\",\"messages\":[{\"role\":\"user\",\"content\":\"Contact me at [PHONE_1]\"}]}",
  "response_body": "{\"id\":\"chatcmpl-123\",\"model\":\"gpt-4o\",\"choices\":[{\"message\":{\"role\":\"assistant\",\"content\":\"I have noted your phone number.\"}}]}",
  "provider_request_body": "{\"model\":\"gpt-4o\",\"messages\":[{\"role\":\"user\",\"content\":\"Contact me at [PHONE_1]\"}]}",
  "provider_response_body": "{\"id\":\"chatcmpl-123\",\"model\":\"gpt-4o\",\"choices\":[{\"message\":{\"role\":\"assistant\",\"content\":\"I have noted your phone number.\"}}]}",
  "execution_trace": [
    {
      "stage": "ingress_received",
      "timestamp": "2026-10-17T12:00:00.000Z",
      "duration_ms": 0,
      "status": "success",
      "modification_summary": "HTTP POST /v1/chat/completions received"
    },
    {
      "stage": "auth_evaluated",
      "timestamp": "2026-10-17T12:00:00.005Z",
      "status": "success",
      "modification_summary": "auth_type=api_key principal=usr_102"
    },
    {
      "stage": "policy_resolved",
      "timestamp": "2026-10-17T12:00:00.006Z",
      "status": "success",
      "modification_summary": "effective_policy=redacted_payload"
    },
    {
      "stage": "plugin_provider_before",
      "timestamp": "2026-10-17T12:00:00.025Z",
      "duration_ms": 19,
      "plugin_name": "Privacy Shield",
      "hook": "provider.before",
      "status": "success",
      "decision": "modify",
      "modification_summary": "PII tokenized: phone masked (9876543210 -> [PHONE_1])"
    },
    {
      "stage": "provider_dispatched",
      "timestamp": "2026-10-17T12:00:00.030Z",
      "status": "success",
      "modification_summary": "sanitized request dispatched to provider (model=gpt-4o, messages=1)"
    },
    {
      "stage": "provider_response_received",
      "timestamp": "2026-10-17T12:00:00.442Z",
      "status": "success"
    },
    {
      "stage": "plugin_provider_after",
      "timestamp": "2026-10-17T12:00:00.448Z",
      "plugin_name": "Kernel Vault",
      "hook": "provider.after",
      "status": "success",
      "modification_summary": "re-identified 1 token placeholder(s) from vault"
    },
    {
      "stage": "client_response_ready",
      "timestamp": "2026-10-17T12:00:00.480Z",
      "status": "success"
    },
    {
      "stage": "metering_completed",
      "timestamp": "2026-10-17T12:00:00.482Z",
      "duration_ms": 482,
      "status": "success",
      "modification_summary": "duration_ms=482 input_tokens=128 output_tokens=42 status_code=200"
    }
  ],
  "plugin_transformations": [
    {
      "plugin_name": "Privacy Shield",
      "hook": "provider.before",
      "duration_ms": 19,
      "decision": "modify",
      "modified": true,
      "changed_fields": ["messages[0].content"],
      "diff_summary": "PII tokenized: phone masked (9876543210 -> [PHONE_1])",
      "before_snapshot": "{\"messages\":[{\"role\":\"user\",\"content\":\"Contact me at [REDACTED_PHONE]\"}]}",
      "after_snapshot": "{\"messages\":[{\"role\":\"user\",\"content\":\"Contact me at [PHONE_1]\"}]}"
    }
  ],
  "created_at": "2026-10-17T12:00:00.000Z"
}
```

---

## 3. Audited Privileged Payload Reveal

Decrypt an encrypted payload snapshot for audit and compliance inspection.

```http
POST /v1/organizations/{organizationId}/request-logs/{recordId}/reveal
```

### Request Headers

| Header | Type | Description |
| :--- | :--- | :--- |
| `Authorization` | `Bearer <token>` | User bearer token. Requires `audit.payload_reveal` permission. |
| `Content-Type` | `application/json` | |

### Request Body

```json
{
  "reason": "Investigating PII tokenization discrepancy for security incident SEC-1082"
}
```

### Constraints & Security Invariants

- **Mandatory Justification**: `reason` must be a non-empty string stating the business purpose.
- **Audit Logging**: Emits an immutable audit event to the Organization Audit Trail recording the caller's email/ID, timestamp, and justification reason.
- **Envelope Decryption**: The OS Daemon invokes KMS to decrypt the DEK, then decrypts the AES-256-GCM ciphertext in memory.
- **Secret Scrubbing**: Even upon privileged reveal, API keys, Bearer tokens, cookies, passwords, and private keys remain masked (`[REDACTED]`).
