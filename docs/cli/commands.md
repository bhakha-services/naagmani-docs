# CLI Commands Reference

Complete command reference for `naagmani` CLI (v2.0.0).

---

## Core Commands

| Command | Description |
| :--- | :--- |
| `naagmani init <name>` | Scaffold a new plugin, policy, or project configuration from templates. |
| `naagmani create <type>` | Interactive wizard to generate plugins, routes, or mock providers. |
| `naagmani dev` | Run local interactive development server with hot reload and stdio inspector. |
| `naagmani validate` | Validate `plugin.json` manifest against the `naagmani.plugin/v1` specification. |
| `naagmani build` | Build plugin binary or bundle assets as defined in manifest. |
| `naagmani package` | Bundle plugin directory into a `.tgz` distribution tarball. |
| `naagmani publish` | Publish packaged plugin to the Naagmani Plugin Registry. |
| `naagmani doctor` | Inspect host environment, installed compilers, network, and permissions. |
| `naagmani login` | Authenticate CLI with Naagmani Cloud. |
| `naagmani logout` | Clear local stored authentication tokens. |
| `naagmani whoami` | Display active user, organization, and project context. |
| `naagmani marketplace` | Search and explore available community & enterprise plugins. |
| `naagmani policy` | Manage and deploy routing, rate limit, and security policies. |
| `naagmani usage` | Query token consumption, latency, and cost summaries from the terminal. |
| `naagmani versions` | List published versions for a plugin. |
| `naagmani update` | Update installed plugins or CLI to the latest release. |
| `naagmani rollback` | Rollback active plugin version in an environment. |

---

## Command Details & Flags

### `naagmani init`
```bash
naagmani init <project-name> [flags]

Flags:
  -t, --template string    Template to use: node, go, python (default "node")
      --org string         Organization slug
```

### `naagmani dev`
```bash
naagmani dev [flags]

Flags:
  -p, --port int           Local port for mock API gateway (default 8080)
      --watch              Watch file changes and auto-reload (default true)
      --config string      Path to custom dev config file
```

### `naagmani validate`
```bash
naagmani validate [path] [flags]

Flags:
      --strict             Enable strict linting for performance and security best practices
```

### `naagmani publish`
```bash
naagmani publish [path] [flags]

Flags:
      --access string      Access visibility: public or private (default "private")
      --tag string         Distribution tag (default "latest")
```
