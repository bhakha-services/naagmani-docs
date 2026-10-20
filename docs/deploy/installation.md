# 1-Command Automated Installation Guide

Deploy the complete, production-grade **Naagmani AI Operating System** on any Linux server, macOS machine, or Windows host using our official 1-command automated installer.

The installer pulls official, pre-built multi-architecture container images (`linux/amd64` and `linux/arm64`) directly from the **GitHub Container Registry (GHCR)**, automatically provisions cryptographically secure secrets, sets up isolated internal database networks, and boots the entire stack in under 60 seconds.

---

## 1. Quick Start Installation

Choose the command matching your operating system:

### Option A: Linux & macOS (Recommended)

Using `curl`:
```bash
curl -fsSL https://naagmani.com/install.sh | bash
```

Or using `wget`:
```bash
wget -qO- https://naagmani.com/install.sh | bash
```

### Option B: Windows (PowerShell)

Open PowerShell (Run as Administrator or as standard user with Docker Desktop running):
```powershell
iwr -useb https://naagmani.com/install.ps1 | iex
```

Or using the short alias `irm`:
```powershell
irm https://naagmani.com/install.ps1 | iex
```

---

## 2. What the 1-Command Installer Does

When you run the command above, the script performs the following end-to-end tasks completely autonomously:

```text
       1. SYSTEM CHECK
       Verify Docker Engine & Docker Compose v2 presence
             ↓
       2. CREDENTIAL GENERATION
       Generate cryptographically randomized 256-bit encryption keys,
       session secrets, and unique PostgreSQL passwords
             ↓
       3. SCHEMA INITIALIZATION
       Generate init-databases.sql for dual-database provisioning
       (naagmani Data Plane & naagmani_selfhosted Control Plane)
             ↓
       4. MULTI-ARCH IMAGE PULL
       Pull pre-built images directly from GHCR (ghcr.io/bhakha-services/*)
             ↓
       5. SERVICE ORCHESTRATION
       Launch PostgreSQL (pgvector), Redis 7, OS Gateway,
       Cloud Control Plane, and Developer Portal
             ↓
       6. HEALTH VERIFICATION
       Poll /v1/health and /health endpoints until the cluster is live
             ↓
       READY TO USE!
       Display cluster endpoints and initial administrator credentials
```

---

## 3. System Prerequisites

| Resource | Minimum Requirement | Recommended Production |
|---|---|---|
| **Operating System** | Ubuntu 22.04+ / Debian 12 / RHEL 9 / macOS / Windows 11 | Ubuntu 24.04 LTS |
| **CPU Architecture** | `x86_64` (`amd64`) or `aarch64` (`arm64`) | `amd64` or `arm64` |
| **vCPU** | 2 Physical / vCPU Cores | 4+ Cores |
| **System Memory** | 4 GB RAM | 8 GB+ RAM |
| **Disk Storage** | 20 GB Free SSD Space | 50 GB+ NVMe SSD |
| **Docker Engine** | Docker Engine `24.0+` or Docker Desktop | Latest Stable Docker |
| **Docker Compose** | Compose v2 (`docker compose version >= 2.20`) | Compose v2.29+ |

---

## 4. Default Service Ports & Endpoints

Once deployment completes, the following services will be available:

| Service | Host Port | Internal Port | Description & Health Check |
|---|---|---|---|
| **Developer & Admin Portal** | `3001` | `3000` | Web UI for workspace, model routing, and API key management (`http://localhost:3001`) |
| **Naagmani OS AI Gateway** | `9080` | `8080` | Ultra-fast Go proxy and plugin execution engine (`http://localhost:9080/v1/health`) |
| **Cloud Control Plane API** | `9081` | `8080` | Tenant isolation, RBAC, billing, and auth API (`http://localhost:9081/health`) |
| **PostgreSQL 16 + pgvector** | `5433` | `5432` | Internal relational and vector database |
| **Redis 7 (Alpine)** | `6379` | `6379` | Distributed cache and token bucket rate limiter |

> [!TIP]
> Ports `9080`, `9081`, `3001`, and `5433` were intentionally chosen to avoid common port collisions with existing local development servers (such as Next.js default `3000`, Traefik `8080`, or local Postgres `5432`).

---

## 5. Standalone GHCR Docker Compose (Alternative Method)

If you prefer not to pipe scripts into `bash`, you can download and run the standalone GHCR compose file directly:

```bash
# 1. Create target directory
mkdir -p ~/naagmani && cd ~/naagmani

# 2. Download the standalone GHCR compose file
curl -fsSL https://naagmani.com/docker-compose.yml -o docker-compose.yml

# 3. Create the database initialization file
cat << 'EOF' > init-databases.sql
SELECT 'CREATE DATABASE naagmani'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'naagmani')\gexec
EOF

# 4. Pull and launch containers
docker compose pull
docker compose up -d

# 5. Check cluster status
docker compose ps
```

---

## 6. Managing the Deployment

All configuration and container definitions are stored in `~/naagmani` (or `%USERPROFILE%\naagmani` on Windows).

### Check Container Status
```bash
cd ~/naagmani
docker compose ps
```

### View Live Streaming Logs
```bash
# Stream all logs
docker compose logs -f

# Stream specific service logs
docker compose logs -f os
docker compose logs -f cloud
docker compose logs -f developer
```

### Stop and Restart Services
```bash
# Stop all services
docker compose down

# Start services back up
docker compose up -d

# Restart a specific service
docker compose restart os
```

### Update to the Latest Release
```bash
cd ~/naagmani
docker compose pull
docker compose up -d
```

---

## 7. Troubleshooting & GHCR Notes

### Official Container Images
Official multi-arch container images are hosted on GitHub Container Registry (GHCR):
- `ghcr.io/bhakha-services/naagmani-os:latest`
- `ghcr.io/bhakha-services/naagmani-cloud:latest`
- `ghcr.io/bhakha-services/naagmani-developer:latest`

### Resetting Data and Clean Reinstall
If you wish to wipe the database and start completely fresh:
```bash
cd ~/naagmani
docker compose down -v
rm -f .env init-databases.sql docker-compose.yml
curl -fsSL https://naagmani.com/install.sh | bash
```

---

## Next Steps

- Access the **Developer Portal** at `http://localhost:3001`.
- Log in with your admin credentials printed at the end of the installation (or found inside `~/naagmani/.env`).
- Follow the [Quickstart Guide](/get-started/quickstart) to connect your AI providers (BYOK) and generate your first API key.
