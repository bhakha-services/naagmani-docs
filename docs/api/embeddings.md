# Embeddings API

The `/v1/embeddings` endpoint generates high-dimensional vector embeddings for text inputs, supporting batching, dimension truncation, and provider-agnostic vector generation.

> [!NOTE]
> **Status: `PLANNED`**
> The `/v1/embeddings` route is currently scheduled for an upcoming release. The schema below represents the standard interface design.

---

## Endpoint Details

- **Method**: `POST`
- **Path**: `/v1/embeddings`
- **Content-Type**: `application/json`

---

## Request Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `model` | `string` | **Yes** | Target embedding model (e.g. `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-004`). |
| `input` | `string` or `array` | **Yes** | Input text string or array of strings to embed. |
| `dimensions` | `integer` | No | Optional dimensionality reduction for supported models (e.g. 512, 1536, 3072). |
| `encoding_format` | `string` | No | `float` (default) or `base64`. |

---

## Example Request (cURL)

```bash
curl -X POST https://api.naagmani.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer NAAGMANI_API_KEY" \
  -d '{
    "model": "text-embedding-3-small",
    "input": [
      "Naagmani is an AI Operating System and infrastructure platform.",
      "High-performance routing and plugin lifecycle execution."
    ]
  }'
```

### Example Response

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [-0.0069292834, -0.005336422, "...1534 more floats..."]
    },
    {
      "object": "embedding",
      "index": 1,
      "embedding": [0.012938472, -0.024928174, "...1534 more floats..."]
    }
  ],
  "model": "text-embedding-3-small",
  "usage": {
    "prompt_tokens": 22,
    "total_tokens": 22
  }
}
```
