# Make Your First AI Request

Naagmani provides a drop-in **OpenAI-compatible REST API** on port `8080`. Any OpenAI SDK, LangChain client, LlamaIndex agent, or raw HTTP client can target Naagmani simply by updating the `baseURL` and `apiKey`.

---

## 1. Using cURL

Send a basic chat completion request via terminal:

```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer nak_test_your_api_key_here" \
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "system", "content": "You are a helpful engineering assistant."},
      {"role": "user", "content": "Explain how Naagmani smart routing works in two sentences."}
    ],
    "temperature": 0.7
  }'
```

### Example Response:

```json
{
  "id": "chatcmpl-01J9H2X9F8E7D6C5B4A3210001",
  "object": "chat.completion",
  "created": 1728345600,
  "model": "deepseek-chat",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Naagmani smart routing dynamically evaluates multiple upstream AI providers based on latency, cost, or priority scoring. It automatically cascades requests across healthy candidate models to ensure zero downtime."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 28,
    "completion_tokens": 34,
    "total_tokens": 62
  }
}
```

---

## 2. Using the OpenAI Node.js / TypeScript SDK

Initialize the standard `openai` package with Naagmani's base URL:

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NAAGMANI_API_KEY || 'nak_test_your_api_key_here',
  baseURL: 'http://localhost:8080/v1',
});

async function main() {
  const completion = await client.chat.completions.create({
    model: 'gpt-4o', // Or any virtual alias like 'smart'
    messages: [
      { role: 'user', content: 'What are the benefits of decoupling AI providers?' }
    ],
  });

  console.log(completion.choices[0].message.content);
}

main();
```

---

## 3. Using the OpenAI Python SDK

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("NAAGMANI_API_KEY", "nak_test_your_api_key_here"),
    base_url="http://localhost:8080/v1"
)

response = client.chat.completions.create(
    model="claude-3-5-sonnet",
    messages=[
        {"role": "system", "content": "You are a precise technical writer."},
        {"role": "user", "content": "Summarize the 3 core benefits of API gateways for LLMs."}
    ]
)

print(response.choices[0].message.content)
```

---

## 4. Real-Time Streaming (Server-Sent Events)

Pass `"stream": true` to stream token chunks in real time:

```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer nak_test_your_api_key_here" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Count from 1 to 5 slowly."}],
    "stream": true
  }'
```

```text
data: {"id":"chatcmpl-01...","choices":[{"delta":{"content":"1"}}]}
data: {"id":"chatcmpl-01...","choices":[{"delta":{"content":", 2"}}]}
data: {"id":"chatcmpl-01...","choices":[{"delta":{"content":", 3"}}]}
data: {"id":"chatcmpl-01...","choices":[{"delta":{"content":", 4"}}]}
data: {"id":"chatcmpl-01...","choices":[{"delta":{"content":", 5"}}]}
data: [DONE]
```

---

## Inspecting Telemetry in Developer Portal

Every request you send is automatically captured:
1. Open the Developer Portal and navigate to **Provider Attempts** (`/attempts`) or **Project Usage** (`/projects/customer-copilot/usage`).
2. You will see the live trace: upstream provider name, response latency (TTFT), token consumption, and cost accounting.

---

## Next Steps

- Explore [Smart Routing Policies](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/governance-routing/routing.md) to set up multi-model fallback cascades.
- Review the complete [Chat Completions API Reference](file:///e:/project/naagmani-project/naagmani-docs/docs/api/chat-completions.md).
