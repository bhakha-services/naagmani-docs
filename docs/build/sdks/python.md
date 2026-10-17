# Python SDK

Official Python library for integrating Naagmani into Python 3.9+ applications, FastAPI microservices, LangChain/LlamaIndex agents, and AI data pipelines.

---

## Installation & Requirements

- **Supported Python Versions**: Python 3.9, 3.10, 3.11, 3.12, 3.13
- **Package**: `naagmani-sdk`

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
    base_url=os.environ.get("NAAGMANI_GATEWAY_URL", "http://localhost:8080/v1"),
    project_id=os.environ.get("NAAGMANI_PROJECT_ID"),
    environment="production", # "test" or "production"
    timeout=30.0,
)

response = client.chat.completions.create(
    model="smart",
    messages=[
        {"role": "system", "content": "You are an enterprise AI assistant."},
        {"role": "user", "content": "What are the benefits of multi-model routing?"}
    ],
    temperature=0.7,
)

print(response.choices[0].message.content)
```

---

## Asynchronous Client (FastAPI & AsyncIO)

```python
import asyncio
import os
from naagmani import AsyncNaagmani

async def main():
    client = AsyncNaagmani(
        api_key=os.environ.get("NAAGMANI_API_KEY"),
        base_url=os.environ.get("NAAGMANI_GATEWAY_URL", "http://localhost:8080/v1"),
    )
    
    stream = await client.chat.completions.create(
        model="deepseek-chat",
        messages=[{"role": "user", "content": "Write a Python quicksort implementation."}],
        stream=True
    )
    
    async for chunk in stream:
        content = chunk.choices[0].delta.content or ""
        print(content, end="", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
```

---

## Error Handling & Exceptions

```python
from naagmani import (
    NaagmaniError,
    AuthenticationError,
    RateLimitError,
    QuotaExceededError,
    APIConnectionError,
)

try:
    response = client.chat.completions.create(model="smart", messages=[...])
except AuthenticationError as e:
    print(f"Authentication failed: {e}")
except RateLimitError as e:
    print(f"Rate limit exceeded. Retry after: {e.retry_after}")
except QuotaExceededError as e:
    print(f"Project spend limit reached: {e}")
except APIConnectionError as e:
    print(f"Network error communicating with gateway: {e}")
except NaagmaniError as e:
    print(f"API Error ({e.status_code}): {e.message}")
```

---

## OpenAI Python Client Alternative

Because Naagmani adheres to OpenAI specifications, you can use the official `openai` library directly:

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("NAAGMANI_API_KEY"),
    base_url="http://localhost:8080/v1",
    default_headers={
        "X-Project-Id": os.environ.get("NAAGMANI_PROJECT_ID"),
        "X-Environment": "production",
    }
)
```

---

## Related Documentation

- [Chat Completions API](file:///e:/project/naagmani-project/naagmani-docs/docs/api/chat-completions.md)
- [Smart Routing Policies](file:///e:/project/naagmani-project/naagmani-docs/docs/developer-portal/governance-routing/routing.md)
- [HDK Plugin Development in Python](file:///e:/project/naagmani-project/naagmani-docs/docs/build/hdks/development.md)

