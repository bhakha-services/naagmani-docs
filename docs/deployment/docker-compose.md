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

The fastest and most reliable way to install Naagmani is via our 1-command installers:

### Linux / macOS:
```bash
# Using curl:
<<<<<<< HEAD
curl -fsSL https://naagmani.com/install.sh | bash

# Or using wget:
wget -qO- https://naagmani.com/install.sh | bash
=======
curl -fsSL https://raw.githubusercontent.com/bhakha-services/naagmani/main/install.sh | bash

# Or using wget:
wget -qO- https://raw.githubusercontent.com/bhakha-services/naagmani/main/install.sh | bash
>>>>>>> 0325ea36bb3c190d8e9a036bf163445d7f42bf55
```

### Windows (PowerShell):
```powershell
<<<<<<< HEAD
iwr -useb https://naagmani.com/install.ps1 | iex
=======
iwr -useb https://raw.githubusercontent.com/bhakha-services/naagmani/main/install.ps1 | iex
>>>>>>> 0325ea36bb3c190d8e9a036bf163445d7f42bf55
```

### Via CLI:
```bash
# Execute idempotent platform installer
npx naagmani platform install
```

The installer will automatically:
1. Verify system prerequisites, Docker Engine, and ports (`3001`, `9080`, `9081`).
2. Generate cryptographically strong secrets for BYOK encryption (`AES-256-GCM`), session cookies, and PostgreSQL passwords.
3. Pull official prebuilt multi-arch container images from `ghcr.io/bhakha-services/*`.
4. Initialize `naagmani` (Data Plane) and `naagmani_selfhosted` (Control Plane) databases with `pgvector` enabled.
5. Launch containers and verify all service health probes.
6. Print access credentials and Developer Portal URL (`http://localhost:3001`).

---

## 3. Manual Docker Compose Deployment

If you prefer manual configuration without running the installer script:

### Step 1: Prepare Directory & Environment

```bash
mkdir -p ~/naagmani && cd ~/naagmani
curl -fsSL https://naagmani.com/docker-compose.yml -o docker-compose.yml
cat << 'EOF' > init-databases.sql
SELECT 'CREATE DATABASE naagmani'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'naagmani')\gexec
EOF
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
| **Zero-Downtime Update** | `naagmani platform update --version v1.0.1` |
| **Rollback Update** | `naagmani platform rollback` |
| **Stop Platform** | `naagmani platform stop` |
| **Restart Platform** | `naagmani platform restart` |

---

## 5. Security Invariants
- **Database & Cache Isolation**: PostgreSQL and Redis are attached strictly to the internal container bridge network (`naagmani-network`). Ports `5432` and `6379` are **never** exposed to the public internet.
- **Air-Gapped Operation**: Naagmani OS executes offline with Ed25519 signature validation without making phone-home licensing calls.
