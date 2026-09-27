# Coolify PaaS Deployment Guide

This guide details deploying the **Naagmani Enterprise AI Operating System** into **Coolify** using official prebuilt OCI container images.

---

## 1. Overview & Architecture

When running under Coolify, Naagmani runs as a managed Docker Compose Stack:
- **Automatic Traefik Routing & SSL**: Coolify automatically manages Let's Encrypt certificates and reverse-proxies requests for `portal.yourdomain.com` (to `naagmani-developer:3000`) and `api.yourdomain.com` (to `naagmani-cloud:8080`).
- **Private Data Plane**: PostgreSQL, Redis, and `naagmani-os` communicate exclusively over the internal bridge network (`naagmani-network`).

---

## 2. Step-by-Step Coolify Onboarding

### Step 1: Create a New Service in Coolify
1. In the Coolify Dashboard, navigate to your Project and click **+ New Resource**.
2. Select **Docker Compose Stack** (Empty Service).
3. Name your stack: `naagmani-production`.

### Step 2: Paste the Stack Manifest
Copy the contents of [`deploy/coolify/docker-compose.coolify.yml`](https://github.com/bhakha-services/naagmani/blob/main/deploy/coolify/docker-compose.coolify.yml) into the Docker Compose configuration editor.

### Step 3: Configure Environment Variables
In the **Environment Variables** tab of your Coolify service, configure:

```ini
# --- Release Version ---
NAAGMANI_VERSION=v2.0.0

# --- Public Domains ---
APP_URL_PORTAL=https://portal.yourdomain.com
APP_URL_API=https://api.yourdomain.com

# --- Core Security Secrets (Generate using Coolify random generator or openssl) ---
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_postgres_password
NAAGMANI_ENCRYPTION_KEY=64_character_hex_encryption_key_for_byok
NAAGMANI_SESSION_SECRET=64_character_hex_session_secret_key

# --- Billing Mode ---
PAYMENT_GATEWAY=mock
```

### Step 4: Deploy the Stack
1. Click **Deploy**.
2. Coolify will pull images from `ghcr.io/bhakha-services/*`, mount the named volumes for PostgreSQL and OS identity, apply healthchecks, and configure SSL certificates.
3. Once all services report **Healthy**, navigate to `https://portal.yourdomain.com` to complete initial admin setup.

---

## 3. Upgrading Naagmani in Coolify

To update your Naagmani instance to a new release:
1. Update `NAAGMANI_VERSION` in your Coolify Environment Variables (e.g. `v2.0.1`).
2. Click **Redeploy**.
3. Coolify pulls the new image tags and rolls out containers while preserving persistent volumes.
