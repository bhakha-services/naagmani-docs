# Plugin Permissions & Sandbox

Naagmani employs a principle of least-privilege security model. Plugins operate in constrained sub-processes and must explicitly declare the system capabilities they require in their `plugin.json` manifest.

---

## Permission Scopes

| Permission | Category | Description |
| :--- | :--- | :--- |
| `env:read` | Environment | Allows reading specific host environment variables passed in configuration. |
| `network:outbound` | Network | Allows making outbound TCP/HTTP connections (e.g. to vector databases, remote APIs). |
| `filesystem:read` | Storage | Allows reading static local files bundled with the plugin. |
| `filesystem:write` | Storage | Allows writing ephemeral cache files to a sandboxed temporary directory. |
| `mcp:bridge` | MCP Protocol | Allows connecting to and brokering Model Context Protocol (MCP) server endpoints. |

---

## Declaring Permissions in `plugin.json`

```json
{
  "name": "rag-vector-retriever",
  "version": "1.0.0",
  "permissions": [
    "network:outbound",
    "env:read"
  ]
}
```

---

## Runtime Enforcement

1. **Static Validation**: The Naagmani CLI checks declared permissions during `naagmani validate` and `naagmani package`.
2. **Installation Verification**: When installing or enabling a plugin via the Naagmani Portal or CLI, administrators are prompted to review and approve the requested permissions.
3. **Execution Sandbox**: On supported platforms (Linux/Docker/Kubernetes), child processes are sandboxed using cgroups, seccomp filters, and restricted network namespaces according to granted permissions.
