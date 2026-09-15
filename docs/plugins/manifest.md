# Plugin Manifest (`plugin.json`)

Every Naagmani plugin must include a root `plugin.json` manifest file defining its metadata, runtime entry points, hooks, configuration schema, and requested permissions.

---

## Schema Overview

Here is an annotated `plugin.json` example:

```json
{
  "$schema": "https://raw.githubusercontent.com/bhakha-services/naagmani-plugins/main/spec/plugin-v1/schema.json",
  "name": "enterprise-dlp-sanitizer",
  "version": "1.0.0",
  "description": "Enterprise Data Loss Prevention and PII sanitization plugin for Naagmani.",
  "author": "Security Engineering Team",
  "license": "Apache-2.0",
  "homepage": "https://github.com/example/enterprise-dlp",
  "repository": "https://github.com/example/enterprise-dlp.git",
  "runtime": {
    "type": "node",
    "entrypoint": "dist/index.js",
    "protocol_version": "naagmani.plugin/v1"
  },
  "hooks": [
    "pre_prompt",
    "post_generation",
    "on_error"
  ],
  "permissions": [
    "env:read",
    "network:outbound"
  ],
  "config_schema": {
    "type": "object",
    "properties": {
      "mask_emails": {
        "type": "boolean",
        "default": true
      },
      "mask_credit_cards": {
        "type": "boolean",
        "default": true
      },
      "redaction_pattern": {
        "type": "string",
        "default": "[REDACTED]"
      }
    },
    "required": ["mask_emails"]
  }
}
```

---

## Manifest Fields Reference

### Top-Level Metadata

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Yes** | Unique lowercase alphanumeric identifier (with hyphens). |
| `version` | `string` | **Yes** | Semantic version string (e.g. `1.0.0`). |
| `description` | `string` | **Yes** | Brief explanation of plugin functionality. |
| `author` | `string` | No | Author or organization name. |
| `license` | `string` | No | SPDX license identifier (e.g. `Apache-2.0`, `MIT`). |

---

### `runtime` Object

Defines how the Naagmani engine launches the plugin process:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | `string` | **Yes** | Runtime type: `binary` (Go/Rust/C++), `node` (Node.js/TypeScript), `python` (Python), or `docker`. |
| `entrypoint` | `string` | **Yes** | Relative path to the executable binary or main script (e.g. `bin/plugin`, `dist/index.js`, `plugin.py`). |
| `protocol_version` | `string` | **Yes** | Protocol specification version. Must be `naagmani.plugin/v1`. |

---

### `hooks` Array

List of lifecycle hook methods implemented by this plugin:
- `pre_prompt`
- `post_generation`
- `on_error`

---

### `permissions` Array

List of explicit security capabilities requested by the plugin:
- `env:read` — Read specified environment variables.
- `network:outbound` — Make outbound HTTP/TCP network requests.
- `filesystem:read` — Read files from plugin directory or designated paths.
- `filesystem:write` — Write to temporary scratch directories.
