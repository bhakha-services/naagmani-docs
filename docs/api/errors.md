# Errors & Status Codes

Naagmani returns clear, structured JSON errors with standard HTTP status codes and machine-readable error codes.

---

## Standard Error Schema

```json
{
  "code": "invalid_request",
  "message": "Detailed human-readable explanation of why the request failed.",
  "request_id": "req_01J8F0A2B3C4D5E6F7G8H9J0K1"
}
```

---

## HTTP Status Codes & Error Codes

| HTTP Status | Error Code | Description & Mitigation |
| :---: | :--- | :--- |
| **`400`** | `invalid_request` | Malformed JSON payload, unknown model alias without a routing policy, or budget constraint violation. |
| **`401`** | `invalid_api_key` | Provided API Key or Service Token is invalid, revoked, or expired. |
| **`403`** | `permission_denied` | Token lacks the required capability in its capability matrix, or license is required for feature (e.g., `model: "auto"`). |
| **`404`** | `not_found` | The requested project, member, or resource does not exist. |
| **`429`** | `quota_exceeded` | Tenant or member has exceeded their configured monthly/daily spending cap. |
| **`502`** | `upstream_failure` | All primary and fallback providers in the routing policy candidate list failed. |
| **`504`** | `upstream_timeout` | Upstream model adapter timed out waiting for provider response. |

---

## Model Resolution Errors (`400 Bad Request`)

Naagmani enforces strict, deterministic model matching. Unconfigured model names or typos will **not** silently fall back to random providers.

### Example: Unconfigured Model Name
```json
{
  "code": "invalid_request",
  "message": "Model 'smart' is not supported or no matching routing policy found. Please configure a routing policy or enable the provider in your credentials.",
  "request_id": "req_01J8F0A2B3C4D5E6F7G8H9J0K1"
}
```

### How to Resolve:
1. **Direct Provider Model**: Request a valid model configured on your active providers (e.g. `deepseek-chat`, `gpt-4o`, `claude-3-5-sonnet-20241022`).
2. **Routing Policy Alias**: Create a Virtual Alias routing policy in the Developer Portal named `smart` (matching the `model` parameter) and assign target providers.
3. **Autonomous AI Engine**: Use `"model": "auto"` (requires an active Enterprise license).

