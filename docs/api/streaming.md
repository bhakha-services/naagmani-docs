# Streaming (SSE) API

Stream tokens back in real time over standard Server-Sent Events (SSE).

**Endpoint**: `POST /v1/chat/completions`  
**Required Payload Field**: `"stream": true`

---

## Event Stream Protocol

Each chunk is returned as a UTF-8 text block prefixed with `data: `:

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"id":"chatcmpl_1","object":"chat.completion.chunk","created":1790355262,"model":"gpt-4o","choices":[{"index":0,"delta":{"role":"assistant","content":""},"finish_reason":null}]}

data: {"id":"chatcmpl_1","object":"chat.completion.chunk","created":1790355262,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl_1","object":"chat.completion.chunk","created":1790355262,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":" World!"},"finish_reason":null}]}

data: {"id":"chatcmpl_1","object":"chat.completion.chunk","created":1790355262,"model":"gpt-4o","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

---

## Next Steps

- Embeddings spec: [Embeddings API](embeddings.md)
- Telemetry reference: [Provider Attempts API](attempts.md)
