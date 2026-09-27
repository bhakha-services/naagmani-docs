# Connected Self-Hosted Licensing

This document details how connected self-hosted **Naagmani AI OS** installations interact with Naagmani Cloud for automated registration, licensing, telemetry, and renewal.

---

## 1. Connected Architecture

Connected self-hosted deployments communicate with Naagmani Cloud exclusively via **outbound HTTPS**:

```text
Customer VPS / Installation
        │
        │ HTTPS Outbound (POST /v1/installations/register)
        ▼
Naagmani Cloud (Control Plane)
        │
        ▼
[ Organization Binding & Signed License Envelope ]
```

> [!NOTE]
> No customer firewall rule or inbound open port is ever required for Naagmani Cloud to reach your installation.

---

## 2. Registering an Installation

Connect your local installation to Naagmani Cloud with one command:

```bash
naagmani platform register \
  --cloud-url https://cloud.naagmani.ai \
  --org-id org_your_company \
  --token <your-service-token-or-api-key>
```

### Registration Behavior:
1. **Tenancy Verification**: Validates that `os_installation_id` belongs to your organization.
2. **License Delivery**: Naagmani Cloud issues the latest signed Ed25519 license envelope.
3. **Environment Update**: The CLI persists `.naagmani/license.json` and updates `.env` (`NAAGMANI_LICENSE_KEY`).
4. **Audit Logging**: Emits `installation.registered` audit event.

---

## 3. Automated Heartbeat

Connected instances periodically transmit a lightweight operational heartbeat:

```bash
POST /v1/installations/:id/heartbeat
```

### Heartbeat Payload:
```json
{
  "os_installation_id": "inst_01JXYZ1234",
  "platform_version": "v2.0.0",
  "status": "healthy",
  "timestamp": "2026-09-27T12:00:00Z"
}
```

> [!CAUTION]
> Heartbeats never contain prompts, model outputs, database contents, BYOK keys, or user credentials. Only system liveness and platform version are transmitted.

---

## 4. License Renewal

When a subscription is renewed in Naagmani Cloud:
1. Cloud issues a new signed license envelope with an extended `expires_at`.
2. The installation automatically downloads the envelope during periodic sync or via CLI:
   ```bash
   naagmani platform register --cloud-url https://cloud.naagmani.ai --org-id org_your_company
   naagmani platform restart
   ```
