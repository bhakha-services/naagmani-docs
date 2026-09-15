# Streaming Responses

Naagmani OS supports real-time token streaming using standard **Server-Sent Events (SSE)**.

---

## 1. Using `curl`

Pass `"stream": true` in the JSON request body:

```bash
curl -N -X POST "http://localhost:8080/v1/chat/completions" \
  -H "Authorization: Bearer $NAAGMANI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "stream": true,
    "messages": [
      {"role": "user", "content": "Write a 3-line haiku about artificial intelligence."}
    ]
  }'
```

### Stream Event Output
```text
data: {"id":"chatcmpl-01j8xyz987","object":"chat.completion.chunk","created":1726400000,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":"Silicon"},"finish_reason":null}]}

data: {"id":"chatcmpl-01j8xyz987","object":"chat.completion.chunk","created":1726400000,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":" minds awake,"},"finish_reason":null}]}

data: [DONE]
```

---

## 2. Using Python Streaming

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key=os.environ.get("NAAGMANI_API_KEY"),
)

stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Tell me a short story."}],
    stream=True,
)

for chunk in stream:
    content = chunk.choices[0].delta.content or ""
    print(content, end="", flush=True)
print()
```

---

## 3. Using TypeScript Streaming

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:8080/v1",
  apiKey: process.env.NAAGMANI_API_KEY,
});

async function main() {
  const stream = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: "Tell me a short story." }],
    stream: true,
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
  process.stdout.write("\n");
}

main();
```

---

## Next Steps

- Explore foundational platform concepts: [Organizations & Projects](../concepts/organizations.md)
- Learn how plugins intercept streaming requests: [Plugin Protocol](../plugins/protocol.md)
