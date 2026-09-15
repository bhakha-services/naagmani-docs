# Python HDK (`naagmani-hdk`)

The Python HDK provides standard Pythonic decorators, Pydantic type validation, and standard I/O serving for creating Naagmani plugins.

---

## Installation

```bash
pip install naagmani-hdk
```

---

## Quick Example

```python
from naagmani_hdk import Plugin, HookContext, HookResult

plugin = Plugin(name="python-rag-plugin", version="0.1.0")

@plugin.hook("pre_prompt")
def on_pre_prompt(context: HookContext, payload: dict) -> HookResult:
    context.logger.info(f"Received request in environment: {context.environment}")
    
    # Retrieve supplementary context from vector store / internal database
    retrieved_context = "System Reference Doc: All refunds require manager approval."
    
    messages = payload.get("messages", [])
    messages.insert(0, {
        "role": "system",
        "content": f"Context for answer:\n{retrieved_context}"
    })
    
    return HookResult(
        status="ok",
        action="modify",
        payload={"messages": messages}
    )

if __name__ == "__main__":
    plugin.serve()
```

---

## Features

- **Pydantic Validation**: Automatic schema parsing and validation of JSON-RPC payloads.
- **Fast Startup**: Minimal external dependencies to keep worker spawn time under 50ms.
- **Stderr Logging**: Integrated Python logging mapped safely to `stderr`.
