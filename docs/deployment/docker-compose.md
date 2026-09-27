# Production Docker Compose Deployment Guide

This guide details deploying the **Naagmani Enterprise AI Operating System** on a clean Linux VPS or on-premises server using Docker and Docker Compose.

---

## 1. Prerequisites & Minimum Hardware

| Component | Minimum | Recommended Production |
|---|---|---|
| **Operating System** | Ubuntu 22.04+ / Debian 12 / RHEL 9 | Ubuntu 24.04 LTS |
| **CPU** | 2 vCPU cores | 4+ vCPU cores |
| **RAM** | 4 GB | 8 GB+ |
| **Disk** | 20 GB SSD | 50 GB+ NVMe |
| **Docker Engine** | Docker Engine 24.0+ | Latest Stable |
| **Docker Compose** | Compose v2.20+ (plugin) | Latest Compose v2 |

---

## 2. One-Command Automated Installation

The fastest way to install Naagmani is via the official CLI:

```bash
# Execute idempotent platform installer
npx naagmani platform install
```

The installer will automatically:
1. Verify system prerequisites, Docker Engine, and ports (`3000`, `8081`).
2. Generate cryptographically strong secrets for BYOK encryption (`AES-256-GCM`), session cookies, and PostgreSQL passwords.
3. Write `docker-compose.production.yml` and `.env`.
4. Pull official prebuilt multi-arch container images from `ghcr.io/bhakha-services/*`.
5. Initialize `naagmani` (Data Plane) and `naagmani_cloud` (Control Plane) databases with `pgvector` enabled.
6. Launch containers and verify all service health probes.
7. Print access credentials and Developer Portal URL.

---

## 3. Manual Docker Compose Deployment

If you prefer manual configuration:

### Step 1: Prepare Directory & Environment

```bash
mkdir -p /opt/naagmani && cd /opt/naagmani
curl -fsSL https://raw.githubusercontent.com/bhakha-services/naagmani/main/.env.production.example -o .env
curl -fsSL https://raw.githubusercontent.com/bhakha-services/naagmani/main/docker-compose.production.yml -o docker-compose.yml
mkdir -p scripts/postgres-init
curl -fsSL https://raw.githubusercontent.com/bhakha-services/naagmani/main/scripts/postgres-init/init-databases.sql -o scripts/postgres-init/init-databases.sql
```

### Step 2: Generate Secure Secrets

Edit `.env` and set:
```bash
# Generate 32-byte hex encryption key
NAAGMANI_ENCRYPTION_KEY=$(openssl rand -hex 32)

# Generate 32-byte session secret
NAAGMANI_SESSION_SECRET=$(openssl rand -hex 32)

# Generate database password
POSTGRES_PASSWORD=$(openssl rand -hex 16)
```

### Step 3: Launch Containers

```bash
# Pull official images
docker compose pull

# Launch in background
docker compose up -d
```

### Step 4: Verify Deployment

```bash
# Check container status
docker compose ps

# Check logs
docker compose logs -f
```

Access the Developer Portal at `http://<your-server-ip>:3000`.

---

## 4. Platform Management Commands

| Operation | Command |
|---|---|
| **Check Platform Status** | `naagmani platform status` |
| **Stream Service Logs** | `naagmani platform logs -f --service cloud` |
| **Backup Databases** | `naagmani platform backup --dest /backups` |
| **Zero-Downtime Update** | `naagmani platform update --version v2.0.1` |
| **Rollback Update** | `naagmani platform rollback` |
| **Stop Platform** | `naagmani platform stop` |
| **Restart Platform** | `naagmani platform restart` |

---

## 5. Security Invariants
- **Database & Cache Isolation**: PostgreSQL and Redis are attached strictly to the internal container bridge network (`naagmani-network`). Ports `5432` and `6379` are **never** exposed to the public internet.
- **Air-Gapped Operation**: Naagmani OS executes offline with Ed25519 signature validation without making phone-home licensing calls.
