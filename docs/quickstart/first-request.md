# Sending Your First Request

Now that you have an API key, let's execute your first AI completion through Naagmani.

---

## Code Examples

### 1. cURL

```bash
curl -X POST "{{GATEWAY_URL}}/v1/chat/completions" \
  -H "Authorization: Bearer nsk_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      { "role": "system", "content": "You are a helpful engineering assistant." },
      { "role": "user", "content": "Explain what an AI gateway runtime does in 2 sentences." }
    ],
    "temperature": 0.7
  }'
```

---

### 2. TypeScript / Node.js (Using OpenAI SDK)

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NAAGMANI_API_KEY || "nsk_live_YOUR_API_KEY",
  baseURL: "{{GATEWAY_URL}}/v1", // Point directly to Naagmani Gateway
});

async function main() {
  const completion = await client.chat.completions.create({
    model: "claude-3-5-sonnet-20241022", // Switch models seamlessly!
    messages: [
      { role: "system", content: "You are a helpful engineering assistant." },
      { role: "user", content: "Hello Naagmani! What models can I route to?" },
    ],
  });

  console.log("Response:", completion.choices[0].message.content);
  console.log("Tokens used:", completion.usage?.total_tokens);
}

main().catch(console.error);
```

---

### 3. Python (Using OpenAI SDK)

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("NAAGMANI_API_KEY", "nsk_live_YOUR_API_KEY"),
    base_url="{{GATEWAY_URL}}/v1"  # Point directly to Naagmani Gateway
)

response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {"role": "system", "content": "You are an AI platform architect."},
        {"role": "user", "content": "Why should applications use an AI gateway?"}
    ]
)

print("Response:", response.choices[0].message.content)
print("Usage:", response.usage)
```

---

### 4. Go

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func main() {
	payload := map[string]interface{}{
		"model": "gpt-4o",
		"messages": []map[string]string{
			{"role": "user", "content": "Explain Naagmani in one sentence."},
		},
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", "{{GATEWAY_URL}}/v1/chat/completions", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+os.Getenv("NAAGMANI_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	fmt.Println("Status:", resp.Status)
	fmt.Println("Response:", string(respBody))
}
```

---

## Expected Response Structure

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
        "content": "An AI gateway runtime sits between client applications and AI providers to manage model routing, credentials, and traffic governance."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 28,
    "completion_tokens": 24,
    "total_tokens": 52
  }
}
```

---

## Next Steps

- Stream tokens in real time: [Streaming Responses](streaming.md)
- Inspect execution latency & failovers: [Execution Trace Telemetry](provider-attempts.md)
