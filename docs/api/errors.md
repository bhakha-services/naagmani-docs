# Error Handling & Status Codes

The Naagmani Gateway adheres to standard HTTP status codes and returns structured JSON error payloads.

---

## Error Response Structure

All error payloads return the following standardized schema:

```json
{
  "error": {
    "message": "Human-readable explanation of the error.",
    "type": "invalid_request_error",
    "param": "model",
    "code": "model_not_found"
  }
}
```

---

## HTTP Status Codes

| Status Code | Error Type | Description |
| :--- | :--- | :--- |
| `400 Bad Request` | `invalid_request_error` | Malformed JSON, missing required fields, or invalid parameter values. |
| `401 Unauthorized` | `authentication_error` | Missing, invalid, or expired API key. |
| `403 Forbidden` | `permission_error` | API key lacks required scopes (e.g. attempting to publish a plugin without `plugins:write`). |
| `404 Not Found` | `not_found_error` | Requested model, alias, plugin, or route does not exist. |
| `429 Too Many Requests` | `rate_limit_error` / `quota_error` | Project rate limit exceeded or monthly spend cap reached. |
| `500 Internal Error` | `api_error` | Internal Naagmani Gateway unexpected error. |
| `502 Bad Gateway` | `provider_error` | Upstream provider (OpenAI/Anthropic/Gemini) returned an invalid response. |
| `503 Service Unavailable` | `provider_unavailable` | All configured upstream providers for the target alias are currently down. |
| `504 Gateway Timeout` | `timeout_error` | Upstream provider or active plugin hook exceeded timeout budget. |

---

## Error Codes Reference

| Error Code | Common Cause | Resolution |
| :--- | :--- | :--- |
| `invalid_api_key` | API key is missing or mistyped. | Verify `NAAGMANI_API_KEY` in environment variables. |
| `insufficient_quota` | Spend cap reached on project. | Increase budget cap in portal or wait for monthly cycle. |
| `model_not_found` | Model alias does not exist. | Query `/v1/models` to check available model identifiers. |
| `plugin_execution_failed` | A required plugin hook failed or threw an uncaught error. | Inspect plugin logs via CLI or developer portal. |
| `plugin_permission_denied` | Plugin attempted an un-granted capability (e.g. network call without permission). | Update `plugin.json` permissions or project policy. |
