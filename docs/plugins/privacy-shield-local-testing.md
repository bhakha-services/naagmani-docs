# Privacy Shield Local Testing & Publishing Guide

This guide provides a complete, step-by-step tutorial for building, packaging, signing (development-only), locally publishing, installing, and executing the **Naagmani Privacy Shield Plugin** in a local development environment.

---

## 1. Prerequisites

Before starting, ensure your local workstation has the required runtimes and tools:

| Component | Minimum Version | Purpose |
| :--- | :--- | :--- |
| **Python** | 3.11+ | Privacy Shield plugin execution environment |
| **Go** | 1.22+ | Naagmani OS Kernel & Naagmani Cloud Control Plane |
| **Node.js** | 18+ (LTS) | Naagmani Developer Portal UI & TypeScript SDK |
| **Docker & Docker Compose** | 24+ | Local PostgreSQL (pgvector) and Redis instances |
| **Naagmani CLI (`naagmani`)** | v1.0+ | Plugin validation, packaging, and local deployment |

Install Python dependencies for Privacy Shield:

```bash
cd naagmani-plugins/plugins/naagmani-privacy-shield
python -m pip install -r requirements.txt
```

---

## 2. Environment Variables

Configure your local shell for the test environment. Only `test` and `production` tiers are permitted by the Kernel Security Boundary; local testing must use `test`.

```bash
# General Platform Configuration
export NAAGMANI_ENV="test"
export NAAGMANI_LOG_LEVEL="debug"
export NAAGMANI_LOG_FORMAT="text"

# Network & Ports
export NAAGMANI_SERVER_HOST="127.0.0.1"
export NAAGMANI_SERVER_PORT="8080"
export NAAGMANI_CLOUD_PORT="8081"

# Infrastructure Services
export DATABASE_URL="postgres://postgres:postgrespassword@localhost:5433/naagmani_cloud?sslmode=disable"
export REDIS_ADDR="localhost:6379"

# Plugin Resolution
export NAAGMANI_PLUGINS_DIR="$(pwd)/naagmani-plugins/plugins"
export NAAGMANI_PRIVACY_SHIELD_DIR="$(pwd)/naagmani-plugins/plugins/naagmani-privacy-shield"
```

On Windows (PowerShell):

```powershell
$Env:NAAGMANI_ENV = "test"
$Env:NAAGMANI_LOG_LEVEL = "debug"
$Env:NAAGMANI_LOG_FORMAT = "text"
$Env:NAAGMANI_SERVER_PORT = "8080"
$Env:NAAGMANI_CLOUD_PORT = "8081"
$Env:DATABASE_URL = "postgres://postgres:postgrespassword@localhost:5433/naagmani_cloud?sslmode=disable"
$Env:REDIS_ADDR = "localhost:6379"
```

---

## 3. Platform Startup Sequence

### Automated Single-Script Startup

You can launch and validate the entire local environment using the orchestrator script:

**macOS / Linux:**
```bash
./scripts/local-dev-privacy-shield.sh
```

**Windows (PowerShell):**
```powershell
.\scripts\local-dev-privacy-shield.ps1 -RunIntegrationTests
```

### Manual Service Startup

To start the services individually across separate terminal sessions:

```bash
# Terminal 1: Infrastructure
docker compose up -d postgres redis

# Terminal 2: Naagmani Cloud Control Plane
cd naagmani/naagmani-cloud
go run cmd/cloud/main.go

# Terminal 3: Naagmani OS Daemon
cd naagmani/naagmani-os
go run cmd/naagmani/main.go

# Terminal 4: Developer Portal
cd naagmani/naagmani-developer
npm run dev
```

---

## 4. Build, Validate & Package Privacy Shield

### Validate the Manifest Schema

Verify the `plugin.json` manifest syntax, hook declarations (`provider.before`, `provider.after`), capabilities (`privacy.pii`), and fail-closed policy:

```bash
cd naagmani-plugins/plugins/naagmani-privacy-shield
naagmani plugin validate .
# Output:
# [OK] Manifest 'naagmani-privacy-shield' v1.0.0 is valid.
```

### Run Unit Tests

```bash
python -m pytest tests/ -v
# Output:
# 17 passed in 6.2s
```

### Build Deterministic Distribution Tarball

```bash
naagmani plugin package . -o dist/naagmani-privacy-shield-1.0.0.tar.gz
```

Verify the computed SHA-256 checksum:

```bash
sha256sum dist/naagmani-privacy-shield-1.0.0.tar.gz
```

---

## 5. Development Signing & Local Publishing

Naagmani OS enforces cryptographic package verification for official security plugins. For local development, use the official development signing keypair:

- **Public Key:** `a658ab97ec0472fa7bd54ed579783e9a7296c272e7d69cb27e23db9603b65f07`
- **Security Boundary Constraint:** This development key is pre-enrolled into the OS `TrustStore` for the `test` environment only. It is **permanently excluded** from `production` trust stores.

### Publish to Local Marketplace

Upload the signed artifact to your local Naagmani Cloud instance:

```bash
curl -X POST "http://localhost:8081/v1/plugins/publish" \
  -H "Authorization: Bearer <DEVELOPER_SESSION_TOKEN>" \
  -F "name=naagmani-privacy-shield" \
  -F "version=1.0.0" \
  -F "display_name=Naagmani Privacy Shield" \
  -F "description=Local PII anonymization and reversible tokenization shield" \
  -F "artifact=@dist/naagmani-privacy-shield-1.0.0.tar.gz" \
  -F "signature=$(jq -r .signature dist/artifact_manifest.json)" \
  -F "signature_payload=$(jq -c .canonical_payload dist/artifact_manifest.json)"
```

---

## 6. Install, Assign & Enable in Test Environment

### Step 1: Install into Organization

```bash
curl -X POST "http://localhost:8081/v1/plugins/installations" \
  -H "Authorization: Bearer <DEVELOPER_SESSION_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "plugin_name": "naagmani-privacy-shield",
    "plugin_version": "1.0.0",
    "project_id": "proj_billing_test",
    "environment_id": "test",
    "auto_enable": true
  }'
```

### Step 2: Verify OS Reconciler Status

Check that Naagmani OS pulled the desired state, verified the cryptographic signature, started the child process via `launcher.bat` (or `launcher`), and verified health:

```bash
curl -X GET "http://localhost:8080/v1/plugins/status?name=naagmani-privacy-shield"
# Response:
# {
#   "name": "naagmani-privacy-shield",
#   "version": "1.0.0",
#   "state": "running",
#   "capabilities": ["privacy.pii"],
#   "health": "healthy"
# }
```

---

## 7. Real AI Gateway Request Verification

Send a real chat completion request through the Naagmani Gateway to observe PII tokenization and response restoration:

```bash
curl -X POST "http://localhost:8080/v1/chat/completions" \
  -H "Authorization: Bearer <PROJECT_SERVICE_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "My name is Rahul Sharma. My phone number is 9876543210 and my email is rahul@example.com."
      }
    ]
  }'
```

### Expected Behavior

1. **At Provider Boundary (`provider.before`):**
   The outbound payload sent to the external LLM provider is rewritten:
   ```text
   My name is [PERSON_737b5dedce69b38e71016de436a7e1dc]. My phone number is [PHONE_NUMBER_3a3aa75ced1e694cc200910e9b5276b5] and my email is [EMAIL_ADDRESS_9681693f190c03d1d09ed85d362d3308].
   ```
   **Zero plaintext PII is delivered to the provider.**

2. **At Kernel Vault:**
   The reversible token mappings are stored in the local cryptographic Vault using AES-256-GCM envelope encryption keyed to the authenticated Organization, Project, and Session ID.

3. **At Response Delivery (`provider.after`):**
   When the provider returns an assistant response containing placeholders, the Security Boundary verifies caller authorization and restores the plaintext before delivering to the client:
   ```text
   Order confirmed for Rahul Sharma at rahul@example.com and phone 9876543210.
   ```

---

## 8. Failure & Security Invariants Verification

| Scenario | Trigger | Expected Security Outcome |
| :--- | :--- | :--- |
| **Plugin Failure** | Process killed or terminated | **Fail-Closed:** Protected requests return `SECURITY_POLICY_BLOCKED`. Provider is never called. |
| **Vault Outage** | KMS or Redis storage offline | **Fail-Closed:** Request rejected immediately. Plaintext is never leaked. |
| **Tenant Isolation** | Second project attempts mapping lookup | **Access Denied:** Vault AAD and project context mismatch fails closed. |
| **Unassigned Project** | Project without explicit installation | **Fail-Closed:** Mandatory security requirement blocks provider dispatch. |
| **Streaming Output** | Token split across chunk boundaries | **Buffer Restoration:** Delimiter-bounded parser reassembles tokens across SSE chunks without leaking placeholders. |

---

## 9. Troubleshooting

### Problem: `Python child process terminated during handshake`
- Verify that `launcher.bat` (Windows) or `launcher` (Linux) has execution permissions.
- Ensure `PYTHONPATH` includes the plugin's `vendor/` and `site-packages/` directories.

### Problem: `cryptographic signature verification failed`
- Confirm that `NAAGMANI_ENV` is set to `test`.
- Verify that `dist/artifact_manifest.json` matches the SHA-256 checksum of your artifact tarball.

### Problem: `Presidio SpaCy model not found`
- Verify that `vendor/en_core_web_sm/en_core_web_sm-3.8.0` exists, or install the SpaCy English package via `python -m spacy download en_core_web_sm`.

---

## 10. Cleanup Instructions

When testing is complete, tear down the background containers and reset the local runtime:

```bash
# Stop Docker infrastructure
docker compose down

# Clean temporary plugin builds
cd naagmani-plugins/plugins/naagmani-privacy-shield
rm -rf dist/ build/ *.egg-info
```
