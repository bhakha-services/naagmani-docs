# Air-Gapped & Offline Deployment Guide

This document defines the operational model and procedure for installing and running **Naagmani AI OS** in air-gapped, isolated, or restricted network environments.

---

## 1. Offline vs. Online Capabilities

Naagmani is engineered with an **offline-first core architecture**.

### What Works Fully Offline
- **Core AI Execution & Routing**: Inference pipeline, plugin execution, request interception, prompt firewall, and caching.
- **Local Data Planes**: PostgreSQL (`naagmani` and `naagmani_cloud`), vector embeddings (`pgvector`), and Redis message broker.
- **Developer Portal UI**: Full dashboard, playground, tracing UI, and analytics.
- **Ed25519 Cryptographic Licensing**: Signed license files (`license.jwt`) verify offline without requiring phone-home connections.
- **Plugin Runtime**: Locally loaded plugins (`naagmani.plugin/v1`) execute without outbound Internet.

### What Requires Connectivity (or Pre-staging)
- **Image Downloading**: Initial OCI container images from GitHub Container Registry (`ghcr.io`).
- **Remote Marketplace**: Browsing or installing public community plugins from the global registry.
- **Cloud Federation**: Remote organization synchronization or managed telemetry.

---

## 2. Air-Gapped Installation Procedure

### Step 1: Export OCI Container Images (Connected Host)
On a machine with Internet access and Docker installed, pull and export the official multi-architecture platform images:

```bash
# Set version tag
export VERSION="v2.0.0"

# Pull official release images
docker pull ghcr.io/bhakha-services/naagmani-os:${VERSION}
docker pull ghcr.io/bhakha-services/naagmani-cloud:${VERSION}
docker pull ghcr.io/bhakha-services/naagmani-developer:${VERSION}
docker pull pgvector/pgvector:pg16
docker pull redis:7-alpine

# Save to tar archive
docker save -o naagmani-images-${VERSION}.tar \
  ghcr.io/bhakha-services/naagmani-os:${VERSION} \
  ghcr.io/bhakha-services/naagmani-cloud:${VERSION} \
  ghcr.io/bhakha-services/naagmani-developer:${VERSION} \
  pgvector/pgvector:pg16 \
  redis:7-alpine
```

---

### Step 2: Transfer Artifacts to Air-Gapped Server
Copy the following files via USB drive, secure bastion, or approved optical media:
1. `naagmani-images-v2.0.0.tar`
2. `naagmani-cli` standalone binary (or npm package)
3. `release.yaml`
4. Customer Ed25519 offline license file (`license.jwt`)

---

### Step 3: Load Container Images
On the air-gapped server, load the OCI images into the local Docker daemon:

```bash
docker load -i naagmani-images-v2.0.0.tar
```

Verify images are available locally:
```bash
docker images | grep -E "naagmani|pgvector|redis"
```

---

### Step 4: Execute Installer in Air-Gapped Mode
Run the platform installer. The preflight engine detects the absence of GHCR connectivity, reports a non-fatal warning, and proceeds using the preloaded local images:

```bash
./naagmani platform install --dir /opt/naagmani --version v2.0.0
```

---

### Step 5: Activate Offline Ed25519 License
Place your cryptographic license key into the environment configuration:

```bash
# Add license JWT to .env
echo "NAAGMANI_LICENSE_KEY=\"eyJhbGciOiJFZERTQSI...\"" >> /opt/naagmani/.env

# Restart platform containers to apply license
./naagmani platform restart --dir /opt/naagmani
```

The platform verifies the Ed25519 signature against the bundled public key and activates all licensed enterprise capabilities offline.
