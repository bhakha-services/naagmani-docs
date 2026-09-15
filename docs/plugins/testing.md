# Plugin Testing & Validation

Testing your plugin locally before deployment ensures schema conformance, hook performance, and rock-solid error handling.

---

## 1. Schema Validation

The Naagmani CLI provides built-in validation against the canonical `naagmani.plugin/v1` specification:

```bash
naagmani validate
```

The validator checks:
- `plugin.json` structure against JSON Schema.
- Executable entry point existence and binary execution permissions.
- Declared hooks consistency.
- Requested permissions formatting.

---

## 2. Interactive Local Dev Mode

Run your plugin in live development mode with hot-reloading:

```bash
naagmani dev
```

In dev mode, the CLI:
1. Spawns your plugin process.
2. Performs the `initialize` handshake.
3. Provides an interactive prompt to dispatch synthetic `execute_hook` payloads (`pre_prompt`, `post_generation`).
4. Prints standard output JSON-RPC messages and standard error logs side-by-side.

---

## 3. Unit & Integration Testing

Because plugins communicate over standard I/O via JSON-RPC, you can test hook logic using standard unit test frameworks (e.g. `go test`, `jest`, `pytest`).

### Python Pytest Example

```python
import pytest
from my_plugin import handle_pre_prompt
from naagmani_hdk import HookContext

def test_pre_prompt_redaction():
    context = HookContext(request_id="test-1", environment="test")
    payload = {"messages": [{"role": "user", "content": "Here is SECRET_KEY"}]}
    
    result = handle_pre_prompt(context, payload)
    assert result.status == "ok"
    assert result.payload["messages"][0]["content"] == "Here is [MASKED]"
```
