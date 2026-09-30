# Embeddings API

Generate high-dimensional vector representations for semantic search, RAG retrieval, and clustering.

**Endpoint**: `POST /v1/embeddings`  
**Surface**: Gateway Data Plane (`:8080`)

---

## Request Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| **`model`** | `string` | Yes | Embedding model (e.g. `text-embedding-3-small`, `text-embedding-3-large`). |
| **`input`** | `string` / `array` | Yes | Input text or array of strings to embed. |
| **`dimensions`** | `integer` | No | Desired vector dimensions (supported models only). |

---

## Example cURL Request

```bash
curl -X POST "{{GATEWAY_URL}}/v1/embeddings" \
  -H "Authorization: Bearer nsk_live_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "text-embedding-3-small",
    "input": "Naagmani AI Operating System"
  }'
```

---

## Response Example

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [-0.00692, -0.00533, 0.01254, "... 1536 floats"]
    }
  ],
  "model": "text-embedding-3-small",
  "usage": {
    "prompt_tokens": 5,
    "total_tokens": 5
  }
}
```
