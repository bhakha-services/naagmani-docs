# Plugin Manifest Specification (`plugin.json`)

The `plugin.json` manifest is the single source of truth describing a Naagmani plugin's identity, language runtime, entrypoint executable, lifecycle hooks, security permissions, and configuration schema.

The manifest is validated by Naagmani OS at startup and by the CLI during `naagmani plugin validate`.

---

## Complete Canonical Manifest Example

```json
{
  "name": "ai-guardrail-filter",
  "version": "1.0.0",
  "api_version": "v1",
  "description": "Enterprise prompt inspection and PII redaction filter",
  "author": "Acme Security Team",
  "runtime": {
    "language": "go",
    "command": "./bin/ai-guardrail-filter",
    "args": ["--mode=strict"],
    "env": {
      "LOG_LEVEL": "info"
    }
  },
  "priority": 10,
  "failure_policy": "fail_close",
  "timeout_ms": 500,
  "hooks": [
    "request.before",
    "response.before"
  ],
  "permissions": [
    "request.read",
    "request.modify",
    "response.read",
    "response.modify"
  ],
  "capabilities": [
    "privacy.pii",
    "security.firewall"
  ],
  "dependencies": [],
  "config_schema": {
    "type": "object",
    "properties": {
      "mask_character": {
        "type": "string",
        "default": "*"
      },
      "custom_keywords": {
        "type": "array",
        "items": { "type": "string" }
      }
    }
  }
}
```

---

## Field Specifications

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | **Yes** | Unique alphanumeric plugin slug (lowercase, dashes allowed: `^[a-z0-9-_]+$`). |
| `version` | `string` | **Yes** | Semantic version string adhering to SemVer 2.0 (e.g. `1.0.0`). |
| `api_version` | `string` | **Yes** | Plugin protocol version targeted by this plugin. Must be strictly `"v1"`. |
| `description` | `string` | No | Human-readable explanation of plugin behavior. |
| `author` | `string` | No | Author or organization name. |
| `runtime` | `object` | **Yes** | Execution launch configuration for the plugin subprocess. |
| `runtime.language` | `string` | **Yes** | Runtime environment: `"go"`, `"node"`, or `"python"`. |
| `runtime.command` | `string` | **Yes** | Executable path (e.g. `./bin/my-plugin`, `node`, `python`). |
| `runtime.args` | `array[string]`| No | Command-line arguments passed to the executable upon process launch. |
| `runtime.env` | `object` | No | Static environment variables passed to the subprocess. |
| `priority` | `integer` | No | Execution order among plugins subscribing to the same hook (default: `100`). Lower values run earlier (e.g., priority `10` executes before `100`). |
| `failure_policy` | `string` | No | Policy if the plugin crashes or times out: `"fail_close"` (default: aborts request with HTTP 502/503) or `"fail_open"` (logs failure and continues). |
| `timeout_ms` | `integer` | No | Maximum execution timeout per hook invocation in milliseconds (default: `500`). |
| `hooks` | `array[string]`| **Yes** | Pipeline hooks subscribed to by the plugin. |
| `permissions` | `array[string]`| **Yes** | Required security permissions granted by the OS. |
| `capabilities` | `array[string]`| No | Security or functional capabilities provided by this plugin (e.g. `privacy.pii`). |
| `dependencies` | `array[object]`| No | List of prerequisite plugins required by this plugin. |
| `config_schema` | `object` | No | JSON Schema describing tenant-configurable options entered in the Developer Portal. |

---

## Valid Pipeline Hooks

Naagmani OS supports six lifecycle hooks:

```text
Inbound HTTP Request
       │
       ▼
[request.before]    ◄── Inspect, mutate, or block inbound client requests
       │
[request.after]     ◄── Read-only inspection immediately before routing
       │
  (Smart Router)
       │
[provider.before]   ◄── Outbound provider network dispatch boundary
       │
  (External LLM)
       │
[provider.after]    ◄── Inbound provider response network boundary
       │
[response.before]   ◄── Inspect, mutate, or block responses before client delivery
       │
       ▼
Outbound Client Response
       │
       ▼
[response.after]    ◄── Asynchronous post-delivery telemetry, cost & audit logging
```

1. **`request.before`**: Primary request hook. Allows `continue`, `modify` (rewriting messages, models, or headers), or `block` (aborting the request with HTTP 403).
2. **`request.after`**: Read-only hook dispatched immediately before smart router candidate dispatch.
3. **`provider.before`**: Intercepts the provider call at the network boundary.
4. **`provider.after`**: Intercepts the raw provider response before parsing.
5. **`response.before`**: Intercepts the completion response before sending to the client. Allows `continue`, `modify` (sanitizing output), or `block`.
6. **`response.after`**: Asynchronous post-response hook. Handlers perform audit logging, usage accounting, and custom metrics collection without delaying the client HTTP response.

---

## CLI Validation

Before packaging or publishing, always validate your `plugin.json`:

```bash
naagmani plugin validate .
```

The CLI verifies:
- Name and SemVer compliance.
- `api_version: "v1"` requirement.
- Supported `runtime.language` (`go`, `node`, `python`).
- Declared hooks are recognized.
- Declared permissions match hook operations.
- Valid `failure_policy` (`fail_close` or `fail_open`).
