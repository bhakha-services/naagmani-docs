# Chat Completions API

Execute standard or streaming chat completions across any foundational model with unified OpenAI wire compatibility.

**Endpoint**: `POST /v1/chat/completions`  
**Surface**: Gateway Data Plane (`:8080`)

---

## Request Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| **`model`** | `string` | Yes | Model ID (e.g. `gpt-4o`, `claude-3-5-sonnet-20241022`) or virtual alias (`smart-tier`). |
| **`messages`** | `array` | Yes | List of message objects (`role`: `system` | `user` | `assistant` | `tool`, `content`). |
| **`temperature`** | `number` | No | Sampling temperature between `0.0` and `2.0` (Default: `1.0`). |
| **`max_tokens`** | `integer` | No | Maximum tokens to generate in completion. |
| **`stream`** | `boolean` | No | Whether to stream back partial tokens via SSE (Default: `false`). |
| **`tools`** | `array` | No | List of JSON Schema tool definitions available to the model. |
| **`tool_choice`** | `string` / `object` | No | `auto`, `none`, `required`, or specific tool selection. |

---

## Example cURL Request

```bash
curl -X POST "http://localhost:8080/v1/chat/completions" \
  -H "Authorization: Bearer nsk_live_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      { "role": "system", "content": "You are a senior systems architect." },
      { "role": "user", "content": "Explain CAP theorem in 2 bullet points." }
    ],
    "temperature": 0.5,
    "max_tokens": 150
  }'
```

---

## Response Example (`HTTP 200 OK`)

```json
{
  "id": "chatcmpl_01J8F0A2B3C4D5E6F7G8H9J0K1",
  "object": "chat.completion",
  "created": 1790355262,
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "• Consistency: Every read receives the most recent write or an error.
• Availability: Every request receives a non-error response, without guarantee of latest data."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 32,
    "completion_tokens": 38,
    "total_tokens": 70
  }
}
```

---

## Next Steps

- Real-time streaming spec: [Streaming (SSE) API](streaming.md)
- Vector embeddings spec: [Embeddings API](embeddings.md)
