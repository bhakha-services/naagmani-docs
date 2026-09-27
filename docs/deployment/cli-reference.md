# Naagmani CLI Platform Reference

This document provides a complete command reference for `naagmani platform` subcommands.

---

## Command Overview

```bash
naagmani platform <command> [flags]
```

### Subcommands

| Command | Description |
|---|---|
| [`install`](#naagmani-platform-install) | Deploys fresh Naagmani platform stack on Docker (resumable & idempotent) |
| [`doctor`](#naagmani-platform-doctor) | Performs preflight and runtime diagnostic checks on host environment |
| [`start`](#naagmani-platform-start) | Starts existing platform containers |
| [`stop`](#naagmani-platform-stop) | Stops platform containers |
| [`restart`](#naagmani-platform-restart) | Restarts platform containers |
| [`status`](#naagmani-platform-status) | Queries health probes and container state (--json) |
| [`logs`](#naagmani-platform-logs) | Streams or tails logs across services (-f, --service) |
| [`update`](#naagmani-platform-update) | Automated zero-downtime update with backup |
| [`rollback`](#naagmani-platform-rollback) | Reverts containers to previous release |
| [`backup`](#naagmani-platform-backup) | Snapshots `naagmani` and `naagmani_cloud` DBs |
| [`restore`](#naagmani-platform-restore) | Restores databases from snapshot dump files |
| [`uninstall`](#naagmani-platform-uninstall) | Tears down platform stack (--purge-data) |

---

## Command Details

### `naagmani platform install`
Performs an idempotent, full-stack installation.

```bash
# Basic installation in current directory
naagmani platform install

# Custom installation directory and release version
naagmani platform install --dir /opt/naagmani --version v2.0.0 --port-portal 3000 --port-cloud 8081

# Preflight validation only
naagmani platform install --dry-run
```

**Flags:**
- `--dir <path>`: Target directory (default: `.`)
- `--version <tag>`: Release version (default: `v2.0.0`)
- `--channel <stable|beta>`: Release channel (default: `stable`)
- `--port-portal <int>`: Developer Portal port (default: `3000`)
- `--port-cloud <int>`: Cloud API port (default: `8081`)
- `--env-file <path>`: Custom `.env` template
- `--dry-run`: Validate prerequisites without starting containers
- `--no-start`: Generate configuration and pull images without starting

---

### `naagmani platform status`
Displays comprehensive operational telemetry.

```bash
naagmani platform status
naagmani platform status --json
```

**Flags:**
- `--dir <path>`: Installation directory
- `--json`: Output report in JSON format

---

### `naagmani platform logs`
Tails service logs.

```bash
# Follow logs for Cloud API
naagmani platform logs -f --service cloud

# Tail last 200 lines for all services
naagmani platform logs --tail 200
```

**Flags:**
- `-f`: Follow log stream
- `--service <os|cloud|portal|postgres|redis>`: Filter by specific service
- `--tail <n>`: Number of lines to show (default: `100`)

---

### `naagmani platform backup`
Creates timestamped PostgreSQL snapshots using `pg_dump -Fc`.

```bash
naagmani platform backup --dest /var/backups/naagmani
```

**Flags:**
- `--dest <path>`: Destination directory (default: `./backups`)

---

### `naagmani platform update`
Performs automated update with preflight backup.

```bash
# Check if updates are available
naagmani platform update --check-only

# Apply update to v2.0.1
naagmani platform update --version v2.0.1
```

**Flags:**
- `--version <tag>`: Target version
- `--check-only`: Check update availability without applying

---

### `naagmani platform doctor`
Executes comprehensive preflight system validation and runtime health checks.

```bash
naagmani platform doctor
```

**Checks Performed:**
- Host OS, architecture, CPU count, available RAM, and disk storage
- Docker Engine & Docker Compose versions and daemon responsiveness
- TCP Port accessibility (Developer Portal 3000, Cloud API 8081)
- Outbound registry connectivity (`ghcr.io`) and DNS resolution
- Container health probes across PostgreSQL, Redis, OS, Cloud, and Portal
- Installation identity and configuration integrity

---

### `naagmani platform uninstall`
Tears down platform containers and networks.

```bash
# Standard non-destructive uninstall (preserves data & identity)
naagmani platform uninstall

# Destructive purge (destroys data volumes, config, and installation ID)
naagmani platform uninstall --purge-data
```

**Flags:**
- `--dir <path>`: Installation directory (default: `.`)
- `--purge-data`: Permanently destroy PostgreSQL database volumes, OS data volumes, configuration, and installation identity (requires typing `DELETE` or passing `-y`)
- `-y`, `--yes`: Non-interactive confirmation for `--purge-data`
