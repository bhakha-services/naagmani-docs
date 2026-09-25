# Authentication & Headers

Naagmani authenticates API calls using Bearer tokens passed via the standard `Authorization` header.

---

## Supported Token Formats

```http
Authorization: Bearer <TOKEN>
```

| Token Prefix | Token Type | Target Surface | Permissions |
| :--- | :--- | :--- | :--- |
| **`nsk_live_...`** | Project API Key | Gateway Data Plane (`:8080`) | Model Inference, Streaming, Embeddings |
| **`nst_live_...`** | Project Service Token | Gateway Data Plane (`:8080`) | Scoped by Capability Matrix |
| **`usr_sess_...`** | User Session Token | Control Plane API (`:8081`) | RBAC Scoped Org & Project Management |

---

## Error Handling

If a token is invalid, missing, or expired:

```json
{
  "code": "invalid_api_key",
  "message": "The provided API key is invalid or has been revoked.",
  "request_id": "req_01J8F0A2B3C4D5E6F7G8H9J0K1"
}
```

---

## Next Steps

- Execute chat inference: [Chat Completions API](chat-completions.md)
- Issue service tokens: [Service Tokens API](service-tokens.md)
