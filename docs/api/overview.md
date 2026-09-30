# API Overview & Standards

The Naagmani API suite is split into two primary surfaces:

1. **Gateway Data Plane API (`:8080`)**: Ultra-high-throughput, OpenAI-compatible AI inference proxy handling chat completions, embeddings, streaming SSE, and tool calling.
2. **Control Plane Management API (`:8081`)**: RESTful JSON API for managing Organizations, Projects, Service Tokens, Members, Budgets, and Telemetry.

---

## Base URLs

| Surface | Local Environment | Production Hosted |
| :--- | :--- | :--- |
| **Gateway Data Plane** | `{{GATEWAY_URL}}` | `https://gateway.naagmani.app` |
| **Control Plane API** | `{{API_BASE_URL}}` | `https://api.naagmani.app` |

---

## Standard Headers

Every API request requires standard headers:

```http
Authorization: Bearer <YOUR_API_KEY_OR_SERVICE_TOKEN>
Content-Type: application/json
X-Request-ID: req_01J8F0A2B3C4D5E6F7G8H9J0K1 (Optional client tracing ID)
```

---

## Next Steps

- Authentication details: [Authentication & Headers](authentication.md)
- Chat completions spec: [Chat Completions API](chat-completions.md)
