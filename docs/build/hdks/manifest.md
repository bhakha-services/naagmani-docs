# Plugin Manifest (plugin.json)

The `plugin.json` manifest is the single source of truth describing an HDK plugin's identity, entrypoint, required execution hooks, permissions, and configuration schema.

---

## Example `plugin.json`

```json
{
  "name": "pii-redactor-plugin",
  "version": "1.0.0",
  "description": "Redacts Social Security Numbers and Credit Cards from prompt payloads",
  "author": "Acme Security Team",
  "license": "Apache-2.0",
  "protocol_version": 1,
  "entrypoint": {
    "command": "./bin/pii-redactor",
    "args": ["--mode=strict"]
  },
  "hooks": [
    "pre_route",
    "post_response"
  ],
  "permissions": {
    "network": ["https://auth.internal.acme.com"],
    "filesystem": ["read"]
  },
  "config_schema": {
    "type": "object",
    "properties": {
      "mask_character": {
        "type": "string",
        "default": "*"
      },
      "custom_patterns": {
        "type": "array",
        "items": { "type": "string" }
      }
    }
  }
}
```

---

## Manifest Field Specifications

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Unique alphanumeric slug (e.g. `auth-validator`, `dlp-masker`). |
| `version` | `string` | Semantic version string (e.g. `1.0.0`). |
| `protocol_version` | `integer` | Naagmani IPC wire protocol version (must be `1`). |
| `entrypoint` | `object` | Executable binary path and launch arguments. |
| `hooks` | `array[string]` | Declared execution phases: `pre_route`, `pre_model_call`, `post_model_call`, `post_response`, `on_error`. |
| `permissions` | `object` | Declared security grants (`network` allowlist, `filesystem` access). |
| `config_schema` | `object` | JSON Schema for environment variables configured in the Developer Portal. |

---

## Related Documentation

- [Wire Protocol v1](file:///e:/project/naagmani-project/naagmani-docs/docs/build/hdks/protocol.md)
- [Plugin Lifecycle & Hooks](file:///e:/project/naagmani-project/naagmani-docs/docs/build/hdks/lifecycle.md)
