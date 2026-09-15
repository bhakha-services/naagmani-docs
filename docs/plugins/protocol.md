# Plugin Protocol (`naagmani.plugin/v1`)

The **Naagmani Plugin Protocol** is the official JSON-RPC 2.0 communication standard between the Naagmani host runtime and plugin processes.

The canonical protocol definition and JSON Schema reside in the public [`naagmani-plugins`](https://github.com/bhakha-services/naagmani-plugins) repository under `spec/plugin-v1/`.

---

## Wire Format

- **Framing**: UTF-8 encoded, newline-delimited (`\n`) JSON-RPC 2.0.
- **Transport**: Host writes to Plugin `stdin`; Plugin writes to Host `stdout`.
- **Logs**: Plugin writes diagnostic messages to `stderr`.

---

## RPC Methods

| Method | Initiator | Description |
| :--- | :--- | :--- |
| `initialize` | Host -> Plugin | Handshake negotiation. Passes host metadata and configuration to plugin. |
| `execute_hook` | Host -> Plugin | Dispatches a lifecycle hook (e.g. `pre_prompt`, `post_generation`). |
| `ping` | Host -> Plugin | Health check and liveness probe. |
| `shutdown` | Host -> Plugin | Graceful termination signal before process teardown. |

---

## RPC Message Payloads

### 1. `initialize`

#### Request (Host -> Plugin):
```json
{
  "jsonrpc": "2.0",
  "id": "init-1",
  "method": "initialize",
  "params": {
    "protocol_version": "naagmani.plugin/v1",
    "host": {
      "name": "naagmani-core",
      "version": "2.0.0"
    },
    "config": {
      "mask_emails": true,
      "redaction_pattern": "[CONFIDENTIAL]"
    }
  }
}
```

#### Response (Plugin -> Host):
```json
{
  "jsonrpc": "2.0",
  "id": "init-1",
  "result": {
    "protocol_version": "naagmani.plugin/v1",
    "plugin": {
      "name": "enterprise-dlp-sanitizer",
      "version": "1.0.0"
    },
    "capabilities": {
      "hooks": ["pre_prompt", "post_generation"],
      "streaming": false
    }
  }
}
```

---

### 2. `execute_hook`

#### Request (Host -> Plugin):
```json
{
  "jsonrpc": "2.0",
  "id": "hook-42",
  "method": "execute_hook",
  "params": {
    "hook": "pre_prompt",
    "context": {
      "request_id": "req_87asdf87a6sd",
      "environment": "production",
      "model": "gpt-4o"
    },
    "payload": {
      "messages": [
        {
          "role": "user",
          "content": "My email is user@example.com. Please summarize this document."
        }
      ]
    }
  }
}
```

#### Response (Plugin -> Host):
```json
{
  "jsonrpc": "2.0",
  "id": "hook-42",
  "result": {
    "status": "ok",
    "action": "modify",
    "payload": {
      "messages": [
        {
          "role": "user",
          "content": "My email is [CONFIDENTIAL]. Please summarize this document."
        }
      ]
    },
    "metadata": {
      "redactions_count": 1
    }
  }
}
```

---

### 3. `execute_hook` Rejection (Aborting Request)

If a security plugin detects a critical violation (e.g. prompt injection or disallowed data exfiltration), it can reject the request:

```json
{
  "jsonrpc": "2.0",
  "id": "hook-43",
  "result": {
    "status": "reject",
    "action": "abort",
    "error": {
      "code": "PROMPT_INJECTION_DETECTED",
      "message": "The input was blocked by enterprise security policy."
    }
  }
}
```
