# Python SDK

Official Python library for integrating Naagmani into Python 3.9+ applications, FastAPI microservices, and AI data pipelines.

---

## Installation

```bash
pip install naagmani-sdk
```

---

## Synchronous Client

```python
import os
from naagmani import Naagmani

client = Naagmani(
    api_key=os.environ.get("NAAGMANI_API_KEY"),
    base_url=os.environ.get("NAAGMANI_BASE_URL", "http://localhost:8080/v1")
)

response = client.chat.completions.create(
    model="smart",
    messages=[
        {"role": "system", "content": "You are an enterprise AI expert."},
        {"role": "user", "content": "What are the benefits of multi-model routing?"}
    ]
)

print(response.choices[0].message.content)
```

---

## Asynchronous Client (AsyncIO & FastAPI)

```python
import asyncio
from naagmani import AsyncNaagmani

async def main():
    async_client = AsyncNaagmani()
    
    stream = await async_client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": "Write a Python quicksort implementation."}],
        stream=True
    )
    
    async for chunk in stream:
        content = chunk.choices[0].delta.content or ""
        print(content, end="", flush=True)

asyncio.run(main())
```

---

## Related Documentation

- [Chat Completions API](file:///e:/project/naagmani-project/naagmani-docs/docs/api/chat-completions.md)
- [Smart Routing Policies](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/governance-routing/routing.md)
