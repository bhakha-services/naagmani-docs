# CLI Commands Reference

Complete command matrix for the `naagmani` command-line interface.

---

## Core Command Categories

### `naagmani auth`
Manage authentication credentials and active sessions.
- `naagmani auth login`: Browser-based OAuth2 login.
- `naagmani auth logout`: Clear cached session credentials.
- `naagmani auth status`: Display active identity and token TTL.

---

### `naagmani projects`
Manage projects and environment namespaces.
- `naagmani projects list`: List all projects in active organization.
- `naagmani projects create <name>`: Provision a new project.
- `naagmani projects switch <project_id>`: Set default project context.

---

### `naagmani tokens`
Generate and revoke Project Service Tokens.
- `naagmani tokens create --name <name> --capabilities <list> --ttl <sec>`: Generate a new PST.
- `naagmani tokens list`: Show all active service tokens.
- `naagmani tokens revoke <token_id>`: Instantly revoke token credentials.

---

### `naagmani attempts`
Query execution traces and downstream model cascades.
- `naagmani attempts list --limit 20`: Fetch recent request attempts.
- `naagmani attempts inspect <attempt_id>`: Display detailed hop timings, TTFT, and sanitized error payloads.

---

### `naagmani proxy`
Start a local reverse proxy for development testing.
- `naagmani proxy --port 8080`: Spin up a local gateway connected to the remote control plane.

---

## Global Flags

| Flag | Shorthand | Description |
| :--- | :--- | :--- |
| **`--json`** | `-j` | Output all responses in machine-readable JSON format. |
| **`--config`** | `-c` | Path to custom YAML configuration file. |
| **`--verbose`** | `-v` | Enable debug logs and HTTP payload traces. |

---

## Next Steps

- [Plugin Management with CLI](/docs/cli/plugins)
- [CLI Diagnostics](/docs/cli/troubleshooting)
