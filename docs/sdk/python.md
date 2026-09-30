# Python SDK Reference

The **Naagmani Python SDK** (`naagmani`) offers native async/sync clients, Pydantic v2 schemas, LangChain integration adapters, and full streaming support.

---

## Installation

```bash
pip install naagmani
```

---

## 1. Synchronous Completion

```python
import os
from naagmani import Naagmani

client = Naagmani(
    api_key=os.getenv("NAAGMANI_API_KEY", "nst_live_9b2d8819..."),
    base_url="{{GATEWAY_URL}}/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a senior Python performance specialist."},
        {"role": "user", "content": "Explain Python 3.13 free-threading (GIL removal)."}
    ],
    temperature=0.7
)

print(response.choices[0].message.content)
print(f"Usage: {response.usage.total_tokens} tokens")
```

---

## 2. Asynchronous Streaming

```python
import asyncio
from naagmani import AsyncNaagmani

async def main():
    aclient = AsyncNaagmani(api_key="nst_live_9b2d8819...", base_url="{{GATEWAY_URL}}/v1")
    
    stream = await aclient.chat.completions.create(
        model="claude-3-5-sonnet-20241022",
        messages=[{"role": "user", "content": "Write a FastAPI CRUD endpoint."}],
        stream=True
    )
    
    async for chunk in stream:
        delta = chunk.choices[0].delta.content or ""
        print(delta, end="", flush=True)

asyncio.run(main())
```

---

## 3. LangChain & LlamaIndex Integration

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4o",
    openai_api_key="nst_live_9b2d8819...",
    openai_api_base="{{GATEWAY_URL}}/v1"
)

response = llm.invoke("Summarize the benefits of AI API gateways.")
print(response.content)
```

---

## Next Steps

- [CLI Manual](/docs/cli/installation)
- [API Reference Overview](/docs/api/overview)
