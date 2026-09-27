# One-Command Installation Guide

This guide walks through deploying the **Naagmani AI OS** on a clean Linux VPS or on-premises server using the production-grade one-command installer.

---

## 1. Quick Start

Run the following command on your target host:

```bash
npx naagmani platform install
```

Or using the globally installed CLI:

```bash
naagmani platform install --dir /opt/naagmani
```

The installer runs fully autonomously: it validates hardware and system dependencies, provisions cryptographic secrets, pulls official multi-architecture images (`linux/amd64`, `linux/arm64`), starts isolated background containers, evaluates dependency-aware health probes, and bootstraps the developer platform.

---

## 2. System Prerequisites

The preflight engine verifies all requirements prior to allocating resources or writing files:

| Resource | Minimum Requirement | Recommended |
|---|---|---|
| **Operating System** | Linux (Ubuntu 20.04+, Debian 11+, RHEL 9+, Rocky 9+, Alpine 3.18+) | Ubuntu 22.04 / 24.04 LTS |
| **Architecture** | `x86_64` (amd64) or `aarch64` (arm64) | `x86_64` or `arm64` |
| **CPU** | 2 Physical / vCPU cores | 4+ Cores |
| **RAM** | 4 GB Total System Memory | 8 GB+ RAM |
| **Disk Space** | 20 GB Free Disk Space | 50 GB+ SSD / NVMe |
| **Docker Engine** | Docker Engine `20.10.0+` (or `24.0.0+` recommended) | Docker `27.x+` |
| **Docker Compose** | Compose v2 (`docker compose version >= 2.0`) | Compose v2.29+ |
| **Network Ports** | `3000` (Portal) and `8081` (Cloud API) free | Configurable via CLI flags |

---

## 3. Installation Flow & State Machine

The installer follows a strict, deterministic, and idempotent state machine:

```text
       INIT
         ↓
     PREFLIGHT
         ↓
  DIRECTORY_READY
         ↓
   SECRETS_READY  <--- Cryptographic key generation (AES-256 BYOK, sessions)
         ↓
   CONFIG_READY   <--- .env & docker-compose.production.yml generation
         ↓
 RELEASE_RESOLVED <--- release.yaml validation & digest verification
         ↓
   IMAGES_READY   <--- ghcr.io multi-arch image pull
         ↓
 SERVICES_STARTED <--- Dependency-aware startup (PostgreSQL -> Redis -> Apps)
         ↓
 HEALTH_CHECKING  <--- Exponential backoff health verification
         ↓
   BOOTSTRAPPING  <--- Organization & default workspace initialization
         ↓
 LICENSE_RESOLVED <--- Ed25519 license verification & free-tier fallback
         ↓
       READY
```

### Process Locking
An atomic lock file (`.naagmani/install.lock`) is created at `INIT` containing the process ID (PID), host name, and start timestamp. If another installation is detected, the command terminates cleanly. In the event of an ungraceful crash, the lock file detects dead PIDs and automatically cleans stale locks.

---

## 4. Advanced Installation Options

Customize the installation using command-line flags:

```bash
# Custom directory, release channel, and custom external ports
naagmani platform install \
  --dir /opt/naagmani \
  --version v2.0.0 \
  --channel stable \
  --port-portal 80 \
  --port-cloud 8081 \
  --env-file /etc/naagmani/custom.env

# Dry-run validation only (no files written, no containers started)
naagmani platform install --dry-run

# Reconcile or force reinstall over an existing deployment
naagmani platform install --force
```

### Installation Flags

| Flag | Type | Default | Description |
|---|---|---|---|
| `--dir` | string | `.` | Target directory for platform configuration and persistent metadata |
| `--version` | string | `v2.0.0` | Exact platform version tag to deploy |
| `--channel` | string | `stable` | Release channel (`stable`, `beta`, `nightly`) |
| `--port-portal` | int | `3000` | Host port exposed for Developer Portal UI |
| `--port-cloud` | int | `8081` | Host port exposed for Naagmani Cloud Control Plane |
| `--env-file` | string | `""` | Optional external `.env` file template to merge |
| `--dry-run` | bool | `false` | Run preflight diagnostics without writing files or starting containers |
| `--force` | bool | `false` | Bypass non-critical preflight failures and overwrite existing lockfiles |
| `--no-start` | bool | `false` | Download configuration and images without starting Docker containers |

---

## 5. Persistent Installation State

All runtime metadata and persistent state are isolated under the `.naagmani` directory:

```text
/opt/naagmani/
├── .env                              # Production environment variables (0600)
├── docker-compose.production.yml     # Production Docker Compose specification
├── release.yaml                      # Release manifest with component digests
├── backups/                          # Snapshot database dumps
└── .naagmani/
    ├── installation_id               # Unique UUIDv4 installation identifier (inst_xxx)
    ├── install_state.json            # Machine-readable installation state machine file
    ├── platform_state.json           # Platform runtime status and active release info
    ├── install.lock                  # Process concurrency lock
    └── install.log                   # Detailed lifecycle execution log
```

---

## 6. Accessing the Platform

Once the installation reaches the `READY` state, access your platform endpoints:

- **Developer Portal UI**: `http://<your-server-ip>:3000`
- **Cloud Control Plane**: `http://<your-server-ip>:8081`
- **System Health Check**: `http://<your-server-ip>:8081/health`

Authenticate using the generated one-time bootstrap token displayed upon completion, or link your self-hosted instance to Naagmani Cloud.
