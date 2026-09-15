# Sending Your First Request

Naagmani OS implements the standard **OpenAI Chat Completions API format** (`/v1/chat/completions`). Any application or SDK that supports custom OpenAI `baseURL` endpoints will work seamlessly.

---

## 1. Using `curl`

```bash
curl -X POST "http://localhost:8080/v1/chat/completions" \
  -H "Authorization: Bearer $NAAGMANI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Explain quantum computing in one sentence."
      }
    ]
  }'
```

### Example Response
```json
{
  "id": "chatcmpl-01j8xyz987",
  "object": "chat.completion",
  "created": 1726400000,
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Quantum computing leverages the principles of superposition and entanglement to perform complex computations exponentially faster than classical computers."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 26,
    "total_tokens": 50
  }
}
```

---

## 2. Using Python (Official OpenAI SDK)

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key=os.environ.get("NAAGMANI_API_KEY"),
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "Hello Naagmani Gateway!"}
    ],
)

print(response.choices[0].message.content)
```

---

## 3. Using Node.js / TypeScript (Official OpenAI SDK)

```typescript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://localhost:8080/v1",
  apiKey: process.env.NAAGMANI_API_KEY,
});

async function main() {
  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: "Hello from TypeScript!" }],
  });

  console.log(completion.choices[0].message.content);
}

main();
```

---

## 4. Using Go

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
	payload := map[string]any{
		"model": "gpt-4o",
		"messages": []map[string]string{
			{"role": "user", "content": "Hello from Go!"},
		},
	}
	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", "http://localhost:8080/v1/chat/completions", bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+os.Getenv("NAAGMANI_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	fmt.Println(string(respBody))
}
```

---

## Next Steps

- Stream tokens in real time: [Streaming Guide](streaming.md)
- Learn about model routing: [Routing Concepts](../concepts/routing.md)
