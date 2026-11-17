# Responses & Payload Formats

The examples below show the supported chat-completion response format. Optional fields and values depend on the selected model, adapter and execution path.

---

## Non-Streaming Chat Completion

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
        "content": "Hello! How can I assist you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 9,
    "total_tokens": 21
  }
}
```
