# Wire Protocol v1 Specification (`naagmani.plugin/v1`)

The **Naagmani Wire Protocol v1** specifies the asynchronous, high-throughput communication format between the Naagmani OS kernel and sandboxed plugin worker processes.

- **Protocol Version**: `naagmani.plugin/v1`
- **Framing**: Single-line JSON-RPC 2.0 objects terminated by newline (`\n`)
- **Transport**: Standard I/O (`stdin` / `stdout`) pipes or Unix Domain Sockets

---

## Stream Separation Rules

To prevent communication deadlocks and stream corruption:

1. **`stdout` (STRICT PROTOCOL ONLY)**: Reserved **strictly** for single-line JSON-RPC 2.0 response objects followed by `\n`. Plugins must NEVER write debug strings, console prints, or error traces to `stdout`.
2. **`stderr` (DIAGNOSTIC LOGGING)**: Reserved for human-readable logging and debug traces. Naagmani OS captures `stderr` output in real time and multiplexes it into OS structured logs with the plugin name and timestamp.
3. **`stdin` (INBOUND COMMANDS)**: Dedicated pipe receiving JSON-RPC requests from the OS kernel.

---

## Core JSON-RPC 2.0 Methods

### 1. `plugin.register` (Registration Handshake)
Sent by Naagmani OS immediately after spawning the plugin subprocess. The plugin must respond with its capabilities to establish synchronization before traffic can flow.

#### Inbound Request (OS -> Plugin)
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "plugin.register",
  "params": {
    "plugin_name": "ai-guardrail-filter",
    "plugin_version": "1.0.0",
    "api_version": "v1",
    "protocol_version": "naagmani.plugin/v1",
    "config": {
      "mask_character": "*"
    },
    "permissions": ["request.read", "request.modify"]
  }
}
```

#### Outbound Response (Plugin -> OS)
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "status": "ready",
    "protocol_version": "naagmani.plugin/v1",
    "capabilities": ["request.read", "request.modify"],
    "message": "plugin initialized successfully"
  }
}
```

---

### 2. `plugin.health` (Health Probe)
Periodically polled by Naagmani OS to ensure worker process responsiveness and memory sanity.

#### Inbound Request (OS -> Plugin)
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "plugin.health",
  "params": {}
}
```

#### Outbound Response (Plugin -> OS)
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "status": "healthy",
    "uptime_ms": 45210,
    "message": "plugin operating normally"
  }
}
```

---

### 3. `plugin.hook.invoke` (Hook Execution)
Dispatched by the OS whenever an active inference request or response reaches a registered pipeline hook.

#### Inbound Request (OS -> Plugin)
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "plugin.hook.invoke",
  "params": {
    "hook": "request.before",
    "context": {
      "hook": "request.before",
      "request_id": "req_01j7abc12345",
      "tenant": {
        "organization_id": "org_987654",
        "project_id": "proj_123456",
        "environment_id": "production"
      },
      "metadata": {
        "client_ip": "10.0.4.15"
      }
    },
    "request": {
      "model": "smart",
      "messages": [
        {
          "role": "user",
          "content": "Analyze patient record for John Doe SSN 000-12-3456."
        }
      ]
    }
  }
}
```

#### Outbound Response (Plugin -> OS)

A plugin returns one of three decisions:

##### Option A: Continue (Unmodified)
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "decision": "continue"
  }
}
```

##### Option B: Modify Payload
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "decision": "modify",
    "modified_request": {
      "model": "smart",
      "messages": [
        {
          "role": "user",
          "content": "Analyze patient record for John Doe SSN [REDACTED]."
        }
      ]
    }
  }
}
```

##### Option C: Block Request (HTTP 403)
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "decision": "block",
    "block_reason": "Prompt contains prohibited social security number"
  }
}
```

---

### 4. `plugin.shutdown` (Graceful Termination)
Sent by Naagmani OS before terminating the process during system shutdown, deployment rollback, or plugin reconfiguration.

#### Inbound Request (OS -> Plugin)
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "plugin.shutdown",
  "params": {
    "reason": "host_shutdown",
    "grace_period_ms": 3000
  }
}
```

#### Outbound Response (Plugin -> OS)
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "status": "terminating"
  }
}
```

---

## Standard Protocol Error Codes

When a hook invocation fails, the plugin returns a standard JSON-RPC 2.0 error object:

| Code | Constant | Meaning |
|---|---|---|
| `-32600` | `InvalidRequest` | Malformed JSON-RPC request frame. |
| `-32601` | `MethodNotFound` | Method name is unrecognized by the plugin. |
| `-32602` | `InvalidParams` | Parameter structure or missing required fields. |
| `-32000` | `HookError` | Internal handler exception occurred during processing. |
| `-32001` | `Timeout` | Operation exceeded plugin-internal timeout threshold. |
| `-32002` | `Blocked` | Explicit request block decision. |
