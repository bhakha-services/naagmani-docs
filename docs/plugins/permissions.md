# Permissions & Security Model

To protect sensitive tenant data and model credentials, Naagmani enforces a strict **Least-Privilege Security Sandbox** for all plugins.

---

## Permission Scopes

Plugins must declare all required permissions in their `plugin.json` manifest. Any attempt to read or mutate unpermitted fields will be blocked by the Gateway kernel.

| Scope | Description | Risk Level |
| :--- | :--- | :--- |
| **`request:read_body`** | Read incoming prompt messages and request arguments. | Medium |
| **`request:mutate_body`** | Modify or rewrite prompt messages, temperature, and parameters. | High |
| **`request:read_headers`** | Inspect inbound HTTP request headers. | Low |
| **`response:read_body`** | Inspect generated model responses and tool outputs. | Medium |
| **`response:mutate_body`**| Modify generated output before it reaches the client. | High |
| **`vault:read_secrets`** | Request decrypted project credentials (restricted to certified plugins). | Critical |
| **`telemetry:emit`** | Append custom metrics and trace tags to Attempt Telemetry. | Low |

---

## Secret Isolation

Plugins **never** have direct access to provider API keys (e.g. your master OpenAI or Anthropic credentials). The Gateway decrypts vault credentials internally and dispatches requests directly to upstream endpoints.

---

## Next Steps

- [Building a Plugin: Step-by-Step](/docs/plugins/development)
- [Testing & Validation](/docs/plugins/testing)
