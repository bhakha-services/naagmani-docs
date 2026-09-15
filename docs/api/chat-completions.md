# Chat Completions API

The `/v1/chat/completions` endpoint generates AI responses for multi-turn conversations, supporting streaming, tool/function calling, structured outputs, and plugin execution hooks.

---

## Endpoint Details

- **Method**: `POST`
- **Path**: `/v1/chat/completions`
- **Content-Type**: `application/json`

---

## Request Body Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `model` | `string` | **Yes** | — | Target model identifier or virtual alias (e.g., `gpt-4o`, `claude-3-7-sonnet-20250219`, `smart`). |
| `messages` | `array` | **Yes** | — | Array of message objects representing the conversation history. |
| `temperature` | `number` | No | `1.0` | Sampling temperature between `0.0` and `2.0`. |
| `max_tokens` | `integer` | No | null | Maximum tokens to generate in the completion. |
| `stream` | `boolean` | No | `false` | When true, returns tokens via Server-Sent Events (SSE). |
| `tools` | `array` | No | null | List of tools / functions the model may call. |
| `tool_choice` | `string` / `object` | No | `auto` | Controls which (if any) tool is called by the model. |
| `response_format` | `object` | No | null | Structured output configuration (e.g., `{ "type": "json_object" }` or JSON Schema). |
| `plugins` | `array` | No | `[]` | Optional list of plugin IDs to execute or override for this specific request. |

### Message Object Structure

| Field | Type | Description |
| :--- | :--- | :--- |
| `role` | `string` | `system`, `user`, `assistant`, or `tool`. |
| `content` | `string` or `array` | Text content or multimodal content parts (images, text blocks). |
| `name` | `string` | Optional participant name. |
| `tool_calls` | `array` | List of tool calls made by the model (when `role` is `assistant`). |
| `tool_call_id` | `string` | Identifier matching tool call being answered (when `role` is `tool`). |

---

## Examples

### 1. Basic Request (cURL)

```bash
curl -X POST https://api.naagmani.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer NAAGMANI_API_KEY" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "system", "content": "You are a concise technical architect."},
      {"role": "user", "content": "Explain microservices in one sentence."}
    ],
    "temperature": 0.5
  }'
```

### Response

```json
{
  "id": "chatcmpl_98a7sd8f97a8sd7f",
  "object": "chat.completion",
  "created": 1726401600,
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Microservices are an architectural style structuring an application as a collection of small, independently deployable, loosely coupled services organized around specific business capabilities."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 28,
    "total_tokens": 52
  }
}
```

---

### 2. Function / Tool Calling

```json
{
  "model": "smart",
  "messages": [
    {"role": "user", "content": "What is the stock price of AAPL?"}
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_stock_price",
        "description": "Get current stock price for a given ticker symbol",
        "parameters": {
          "type": "object",
          "properties": {
            "ticker": {
              "type": "string",
              "description": "Stock ticker symbol (e.g. AAPL, GOOG)"
            }
          },
          "required": ["ticker"]
        }
      }
    }
  ]
}
```
