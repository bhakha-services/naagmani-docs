# CLI Command Reference

Exhaustive reference for all commands supported by the `naagmani` CLI tool.

---

## 1. Core Commands

### `naagmani doctor`
Diagnoses system prerequisites, runtime dependencies (Docker, Node, Go, Python), and network connectivity to Naagmani Cloud and Gateway endpoints.
```bash
naagmani doctor
```

### `naagmani version`
Prints the CLI version and build metadata.
```bash
naagmani version
# Output: naagmani CLI v1.0.0
```

### `naagmani whoami`
Displays the active authenticated user, organization, project, and environment context.
```bash
naagmani whoami
```

---

## 2. Platform Lifecycle & Self-Hosting

### `naagmani platform install`
Deploys the complete Naagmani platform stack on Docker/Compose.
```bash
naagmani platform install
```

### `naagmani platform status`
Inspects health status, container uptimes, and port mappings across platform containers.
```bash
naagmani platform status --json
```

### `naagmani platform logs`
Streams real-time container logs.
```bash
naagmani platform logs -f --service os
# Services: os | cloud | portal | postgres | redis
```

### `naagmani platform update`
Executes an automated in-place platform update with preflight database snapshot backup.
```bash
naagmani platform update
```

### `naagmani platform rollback`
Reverts to the previous known-good platform version.
```bash
naagmani platform rollback
```

### `naagmani platform backup` / `restore`
Creates or restores full snapshot backups of PostgreSQL database states.
```bash
naagmani platform backup --output ./backup-2026.sql
naagmani platform restore --input ./backup-2026.sql
```

---

## 3. Plugin Development & HDK

### `naagmani plugin create <name>`
Scaffolds a new plugin project.
```bash
naagmani plugin create dlp-filter --language go
# Options: --language go|node|python
```

### `naagmani plugin validate [dir]`
Validates `plugin.json` manifest against protocol rules and permission schemas.
```bash
naagmani plugin validate .
```

### `naagmani plugin dev [dir]`
Builds and dynamically links a plugin to the local running OS gateway for live testing.
```bash
naagmani plugin dev .
```

### `naagmani plugin package [dir]`
Compiles binaries and builds the distribution `.tar.gz` archive with SHA-256 checksum.
```bash
naagmani plugin package .
```

### `naagmani plugin publish [dir]`
Publishes a release version to Naagmani Cloud or Organization catalog.
```bash
naagmani plugin publish . --visibility organization
```

### `naagmani plugin list` / `versions`
Lists published or installed versions for a plugin.
```bash
naagmani plugin versions dlp-filter
```

---

## 4. Marketplace Commands

### `naagmani marketplace search <query>`
Searches the marketplace catalog by keyword or category.
```bash
naagmani marketplace search "postgres"
```

### `naagmani marketplace install <name>`
Installs a marketplace plugin into the active project and environment.
```bash
naagmani marketplace install postgres-mcp-connector
```

---

## 5. Enterprise Governance & Policy

### `naagmani policy list`
Lists all active routing and guardrail policies.
```bash
naagmani policy list
```

### `naagmani policy simulate <name>`
Simulates dynamic routing candidate selection for a given input payload without sending real upstream requests.
```bash
naagmani policy simulate smart --input "Hello"
```

---

## Exit Codes for CI/CD

| Code | Constant | Meaning |
|---|---|---|
| `0` | `ExitSuccess` | Command completed successfully. |
| `1` | `ExitInvalidArg` | Invalid flags, missing parameters, or usage error. |
| `2` | `ExitAuthError` | Authentication failure or unauthorized session. |
| `3` | `ExitValError` | Manifest, schema, or policy validation failure. |
| `4` | `ExitNetError` | Network connectivity failure or Cloud API unreachable. |

---

## Related Documentation

- [CLI Installation](file:///e:/project/naagmani-project/naagmani-docs/docs/build/cli/installation.md)
- [CLI Diagnostics](file:///e:/project/naagmani-project/naagmani-docs/docs/build/cli/troubleshooting.md)
