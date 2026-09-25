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
| **`400`** | `invalid_request` | Malformed JSON payload or hierarchy budget constraint violation. |
| **`401`** | `invalid_api_key` | Provided API Key or Service Token is invalid, revoked, or expired. |
| **`403`** | `permission_denied` | Token lacks the required capability in its capability matrix. |
| **`404`** | `not_found` | The requested project, member, or model resource does not exist. |
| **`429`** | `quota_exceeded` | Tenant or member has exceeded their configured monthly/daily spending cap. |
| **`502`** | `upstream_failure` | All primary and fallback providers in the routing policy failed. |
| **`504`** | `upstream_timeout` | Upstream model adapter timed out waiting for provider response. |
