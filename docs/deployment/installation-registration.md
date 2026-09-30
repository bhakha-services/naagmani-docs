# Installation Registration & Cloud Binding

This guide describes how to register, bind, and manage self-hosted **Naagmani AI OS** installations with Naagmani Cloud.

---

## 1. Overview

Installation registration binds a deployed self-hosted instance (identified by its immutable `installation_id`) to an Organization in Naagmani Cloud.

### Benefits of Registration:
- **Commercial License Synchronization**: Automatically pushes renewed Ed25519 licenses to the VPS.
- **Centralized Health Monitoring**: View runtime health and platform version across your entire server fleet.
- **Developer Portal Integration**: Single-pane-of-glass management under your organization settings.

---

## 2. Command Line Registration

Run the registration command from your installation host:

```bash
naagmani platform register \
  --cloud-url https://cloud.naagmani.ai \
  --org-id org_01JTESTORG123 \
  --token <your-service-token-or-api-key>
```

### CLI Options:

| Option | Default | Description |
|---|---|---|
| `--dir` | `.` | Path to installation directory |
| `--cloud-url` | `{{API_BASE_URL}}` | Naagmani Cloud API endpoint |
| `--org-id` | Prompted | Target Organization ID |
| `--token` | `""` | Scoped Service Token or API Key |
| `--edition` | `free` | Desired commercial tier (`free`, `pro`, `enterprise`) |

---

## 3. Organization Tenancy & Anti-Rebinding Security

- **Single Organization Binding**: An `installation_id` belongs strictly to one organization.
- **Conflict Protection**: Attempting to register an already-bound `installation_id` to a different organization will fail with `409 Conflict`.
- **Idempotency**: Re-running registration against the same organization is non-destructive and synchronizes the latest license envelope.

---

## 4. Verifying Registration & License Status

Check active registration and cryptographic entitlement status:

```bash
naagmani platform license status
```

JSON output for scripting:
```bash
naagmani platform license status --json
```
