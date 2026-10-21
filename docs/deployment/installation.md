# One-Command Installation Guide

This guide walks through deploying the **Naagmani AI OS** on a clean Linux VPS or on-premises server using the production-grade one-command installer.

---

## 1. Quick Start

### Shell & PowerShell 1-Command Automated Installers (Fastest)

#### Linux & macOS (via curl or wget):
```bash
# Using curl:
curl -fsSL https://naagmani.com/install.sh | bash

# Or using wget:
wget -qO- https://naagmani.com/install.sh | bash
```

#### Windows (PowerShell):
```powershell
iwr -useb https://naagmani.com/install.ps1 | iex
```

### CLI-Managed Installation
Alternatively, install via the official CLI:
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
  --version v1.0.1 \
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
| `--version` | string | `v1.0.1` | Exact platform version tag to deploy |
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

---

## 7. Lifecycle Management & Operations (`doctor`, `update`, `uninstall`)

The installer script (`install.sh` / `install.ps1`) acts not only as an initial bootstrapper, but as a complete **Stack Lifecycle Controller**.

Once installed, the installer automatically registers a native global CLI command: **`naagmani`**.

### Day-to-Day CLI Commands

You can execute lifecycle actions from any directory on your server:

```bash
# Diagnose health, check port bindings, verify database & auto-repair issues
naagmani doctor

# Pull latest GHCR images and restart stack with zero data loss
naagmani update

# Restart all containers
naagmani restart

# Inspect running container status and ports
naagmani status

# Stream live container logs in real time
naagmani logs

# Re-run the interactive configuration wizard (.env / ports / credentials)
naagmani reconfigure

# Safely stop containers and remove deployment (prompts to preserve data)
naagmani uninstall
```

*(On Windows PowerShell, use `.\naagmani.ps1 [command]` or `.\install.ps1 -Action [command]`)*

### Re-running the 1-Command Installer (Interactive Action Menu)

If you re-run the original installer command on an existing deployment:

```bash
curl -fsSL https://naagmani.com/install.sh | bash
```

The installer immediately detects the active `.env` configuration and presents an **Interactive Control Menu**:

```text
=================================================================
       Existing Naagmani AI OS Deployment Detected!              
=================================================================

  1) Update to latest container images & restart (Recommended)
  2) Run Doctor (diagnose health, ports, containers & API)
  3) Reconfigure ports, credentials & environment (.env)
  4) Restart all services
  5) Stream live container logs
  6) View container status
  7) Uninstall / Stop and remove deployment
  8) Exit without making changes

Select an action [1-8] [1]: 
```

Pressing `[Enter]` defaults to **Option 1 (Update)**, pulling latest container images and restarting services while keeping all persistent volumes intact.

### Remote One-Liner Execution

You can also target specific lifecycle actions directly via curl without opening the menu:

```bash
# Direct doctor diagnosis & auto-heal:
curl -fsSL https://naagmani.com/install.sh | bash -s -- doctor

# Direct stack update:
curl -fsSL https://naagmani.com/install.sh | bash -s -- update

# Direct stack uninstall:
curl -fsSL https://naagmani.com/install.sh | bash -s -- uninstall
```

