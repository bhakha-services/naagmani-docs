# API Authentication

All requests to the Naagmani Gateway require authentication using an API key scoped to your Project and Environment.

---

## Authentication Methods

### 1. HTTP Bearer Token (Recommended)

Include the `Authorization` header containing `Bearer <YOUR_API_KEY>` in every request:

```http
POST /v1/chat/completions HTTP/1.1
Host: api.naagmani.com
Authorization: Bearer NAAGMANI_API_KEY
Content-Type: application/json
```

### 2. Custom Header

Alternatively, you can provide the API key using the `X-API-Key` header:

```http
POST /v1/chat/completions HTTP/1.1
Host: api.naagmani.com
X-API-Key: NAAGMANI_API_KEY
Content-Type: application/json
```

---

## Example Requests

### cURL

```bash
curl -X POST https://api.naagmani.com/v1/models \
  -H "Authorization: Bearer NAAGMANI_API_KEY"
```

### Node.js (Fetch)

```javascript
const response = await fetch("https://api.naagmani.com/v1/models", {
  headers: {
    "Authorization": `Bearer ${process.env.NAAGMANI_API_KEY}`
  }
});
const data = await response.json();
console.log(data);
```

### Python (Requests)

```python
import os
import requests

response = requests.get(
    "https://api.naagmani.com/v1/models",
    headers={"Authorization": f"Bearer {os.getenv('NAAGMANI_API_KEY')}"}
)
print(response.json())
```

---

## Authentication Errors

If authentication fails, the gateway returns an HTTP `401 Unauthorized` response:

```json
{
  "error": {
    "message": "Invalid API key provided. Please verify your NAAGMANI_API_KEY.",
    "type": "invalid_request_error",
    "param": null,
    "code": "invalid_api_key"
  }
}
```

Common causes:
- Missing `Authorization` or `X-API-Key` header.
- Revoked or expired API key.
- Mismatched environment (e.g. attempting to use `nmn_test_` against an enterprise private VPC endpoint configured strictly for live keys).
