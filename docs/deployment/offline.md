# Air-Gapped & Offline Deployment Guide

This document defines the operational model and procedure for installing and running **Naagmani AI OS** in air-gapped, isolated, or restricted network environments.

---

## 1. Offline vs. Online Capabilities

Naagmani is engineered with an **offline-first core architecture**.

### What Works Fully Offline
- **Core AI Execution & Routing**: Inference pipeline, plugin execution, request interception, prompt firewall, and caching.
- **Local Data Planes**: PostgreSQL (`naagmani` and `naagmani_cloud`), vector embeddings (`pgvector`), and Redis message broker.
- **Developer Portal UI**: Full dashboard, playground, tracing UI, and analytics.
- **Ed25519 Cryptographic Licensing**: Signed license files (`license.json`) verify offline without requiring phone-home connections.
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
export VERSION="v1.0.1"

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
1. `naagmani-images-v1.0.1.tar`
2. `naagmani-cli` standalone binary (or npm package)
3. `release.yaml`
4. Customer Ed25519 offline license file (`license.json`)

---

### Step 3: Load Container Images
On the air-gapped server, load the OCI images into the local Docker daemon:

```bash
docker load -i naagmani-images-v1.0.1.tar
```

Verify images are available locally:
```bash
docker images | grep -E "naagmani|pgvector|redis"
```

---

### Step 4: Execute Installer in Air-Gapped Mode
Run the platform installer. The preflight engine detects the absence of GHCR connectivity, reports a non-fatal warning, and proceeds using the preloaded local images:

```bash
./naagmani platform install --dir /opt/naagmani --version v1.0.1
```

---

### Step 5: Import the signed JSON license locally

Download the signed license from Accounts on a connected workstation and transfer
it to the local installation. Import the JSON envelope through the local license
page/API. OS verifies it without Accounts connectivity and persists successful
imports in its data volume for restart.

For a pre-staged file, set `NAAGMANI_LICENSE_PATH` to its container path and mount
it readably. Alternatively, `NAAGMANI_LICENSE_DATA` accepts the full signed JSON.
There is no `NAAGMANI_LICENSE_KEY` JWT configuration in this runtime.

See [Self-hosted boundaries](./self-hosted-boundaries.md) for local identity,
network disclosures, expiry and release-validation limitations. External AI
providers need their own connectivity; use local providers for air-gapped inference.
