# Rate Limiting & Concurrency Control

Naagmani provides edge-level rate limiting to protect upstream token quotas and prevent runaway bot abuse.

---

## Rate Limit Dimensions

Rate limits can be applied across several dimensions:

1. **Requests Per Minute (RPM)**: Limits total HTTP requests per client, IP, or API key.
2. **Tokens Per Minute (TPM)**: Tracks estimated and actual prompt/completion token consumption over a sliding window.
3. **Concurrent Sockets**: Restricts simultaneous active streaming connections per client to prevent thread pool exhaustion.

---

## Rate Limit Headers

When a request is processed, Naagmani returns standard RFC-compliant rate limit headers:

| Header | Description |
| :--- | :--- |
| `X-RateLimit-Limit-Requests` | Maximum allowed RPM for this key. |
| `X-RateLimit-Remaining-Requests` | Remaining allowed requests in the current window. |
| `X-RateLimit-Reset-Requests` | Seconds remaining until the RPM quota resets. |
| `X-RateLimit-Limit-Tokens` | Maximum allowed TPM. |
| `X-RateLimit-Remaining-Tokens` | Remaining token allowance. |

---

## Handling HTTP 429 Responses

If an application exceeds configured limits, Naagmani responds with `429 Too Many Requests`:

```json
{
  "error": {
    "message": "Rate limit exceeded. Try again in 2 seconds.",
    "type": "rate_limit_error",
    "param": null,
    "code": "rate_limit_exceeded"
  }
}
```
Client applications should observe the `Retry-After` header and apply exponential backoff.
