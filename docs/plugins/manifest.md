# Plugin Manifest (`plugin.json`)

Every Naagmani plugin must contain a root descriptor named `plugin.json`. This manifest defines the plugin's identity, entrypoint, required capabilities, and schema configuration.

---

## Full Manifest Schema

```json
{
  "$schema": "https://naagmani.app/schemas/v1/plugin.json",
  "id": "com.company.pii-guard",
  "name": "PII & Secret Guardrail",
  "version": "1.2.0",
  "description": "Scans prompts for API keys, passwords, and PII before dispatching to public models.",
  "author": {
    "name": "DevSecOps Team",
    "email": "security@company.com",
    "url": "https://company.com"
  },
  "runtime": {
    "type": "native",
    "entrypoint": "./bin/pii_guard",
    "env": {
      "LOG_LEVEL": "info"
    }
  },
  "hooks": [
    {
      "name": "pre_route",
      "priority": 100,
      "timeout_ms": 250,
      "on_failure": "fail-close"
    },
    {
      "name": "post_response",
      "priority": 50,
      "timeout_ms": 300,
      "on_failure": "fail-open"
    }
  ],
  "permissions": [
    "request:read_body",
    "request:mutate_body",
    "response:read_body",
    "telemetry:emit"
  ],
  "config_schema": {
    "type": "object",
    "properties": {
      "redact_ssn": {
        "type": "boolean",
        "default": true,
        "description": "Mask US Social Security Numbers"
      },
      "custom_regex_patterns": {
        "type": "array",
        "items": { "type": "string" },
        "description": "Additional regular expressions to redact"
      }
    },
    "required": ["redact_ssn"]
  }
}
```

---

## Key Fields Explained

### `id` (string, required)
Unique reverse-domain identifier (e.g., `com.example.analytics`).

### `runtime` (object, required)
- **`type`**: Execution runtime: `native` (compiled binary) or `wasm`.
- **`entrypoint`**: Relative path to the executable binary or Wasm artifact.

### `hooks` (array of objects)
Defines which execution stages the plugin intercepts:
- **`name`**: Target hook point (e.g., `pre_route`, `post_response`, `on_error`).
- **`priority`**: Execution order (higher numbers execute first, e.g. 100 before 50).
- **`timeout_ms`**: Maximum allowed processing latency before triggering the failure policy.
- **`on_failure`**: Either `fail-close` (reject request) or `fail-open` (bypass).

### `permissions` (array of strings)
Declares access limits for least-privilege enforcement. See [Permissions & Security](/docs/plugins/permissions).

---

## Validating Your Manifest

You can validate your `plugin.json` using the Naagmani CLI:

```bash
naagmani plugins validate ./my-plugin
# Output: [OK] plugin.json schema valid. 2 hooks declared. 0 security warnings.
```

---

## Next Steps

- [Wire Protocol (v1)](/docs/plugins/protocol)
- [Plugin Execution Hooks](/docs/plugins/hooks)
