# Models & Virtual Aliases API

Query available upstream foundation models, registered provider models, and active virtual routing policy aliases.

---

## List Models

`GET /v1/models`

Retrieve a list of all active models and routing policy aliases available to the authenticated project and environment.

### Authentication
`Authorization: Bearer <NAAGMANI_API_KEY_OR_SERVICE_TOKEN>`

### Request Headers
| Header | Type | Description |
|---|---|---|
| `Authorization` | `string` | **Required**. `Bearer nak_...` or `Bearer nsk_...`. |
| `X-Environment-ID` | `string` | *Optional*. Environment override (`test` or `production`). |

### Response Schema (`200 OK`)

```json
{
  "object": "list",
  "data": [
    {
      "id": "smart",
      "object": "model",
      "created": 1728345600,
      "owned_by": "naagmani-routing-policy",
      "permission": [],
      "root": "smart",
      "parent": null
    },
    {
      "id": "deepseek-chat",
      "object": "model",
      "created": 1728345600,
      "owned_by": "deepseek",
      "permission": [],
      "root": "deepseek-chat",
      "parent": null
    },
    {
      "id": "gpt-4o",
      "object": "model",
      "created": 1728345600,
      "owned_by": "openai",
      "permission": [],
      "root": "gpt-4o",
      "parent": null
    },
    {
      "id": "claude-3-5-sonnet",
      "object": "model",
      "created": 1728345600,
      "owned_by": "anthropic",
      "permission": [],
      "root": "claude-3-5-sonnet",
      "parent": null
    }
  ]
}
```

---

## Retrieve a Specific Model

`GET /v1/models/{model}`

Retrieve metadata for a specific model or virtual policy alias.

### Example Request

```bash
curl -X GET http://localhost:8080/v1/models/smart \
  -H "Authorization: Bearer nak_live_your_key_here"
```

### Response Schema (`200 OK`)

```json
{
  "id": "smart",
  "object": "model",
  "created": 1728345600,
  "owned_by": "naagmani-routing-policy"
}
```

---

## Related Documentation

- [Smart Routing Policies](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/governance-routing/routing.md)
- [Chat Completions API](file:///e:/project/naagmani-project/naagmani-docs/docs/api/chat-completions.md)
