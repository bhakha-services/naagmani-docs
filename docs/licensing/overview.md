# Licensing Architecture & Lifecycle

This document defines the cryptographic licensing architecture, data models, state machines, and operational lifecycle for **Naagmani AI OS**.

---

## 1. Core Principles & Domain Separation

The Naagmani platform enforces strict domain separation across commercial and operational models:

```text
Organization (Tenant Boundary)
    │
    ├──── Installations (Deployed Runtimes with stable installation_id)
    │       ├──── Self-Hosted VPS
    │       └──── Air-Gapped Bastion
    │
    ├──── Licenses (Ed25519 Cryptographically Signed Rights)
    │
    ├──── Subscriptions (Commercial Agreement & Billing)
    │
    └──── Projects & Environments
```

- **Installation**: A deployed runtime environment identified by a persistent UUID (`installation_id`).
- **License**: An immutable, versioned, Ed25519 digitally signed envelope (`SignedLicense`) issued by the License Authority.
- **Entitlement**: Capabilities and numerical quotas granted to the runtime.
- **Subscription**: The commercial billing contract between customer and Naagmani Cloud.

---

## 2. Cryptographic Envelope (`Ed25519`)

Licenses are signed using **Ed25519** over a canonicalized JSON payload (`CanonicalPayloadV2`).

### License Schema
```json
{
  "version": 2,
  "type": "naagmani-license",
  "license_id": "lic_01JXYZ9999",
  "installation_id": "inst_01JABC1234",
  "customer_id": "org_acme_corp",
  "edition": "enterprise",
  "features": [
    "router",
    "byok",
    "plugin_runtime",
    "advanced_routing",
    "enterprise_rbac",
    "audit_logs",
    "mcp_enterprise"
  ],
  "feature_values": {
    "audit_retention_days": 365,
    "max_custom_plugins": -1,
    "max_mcp_servers": 100
  },
  "issued_at": "2026-09-27T00:00:00Z",
  "expires_at": "2027-09-27T00:00:00Z"
}
```

### Signature Verification Flow
```text
License Envelope (JSON)
       │
       ├─► CanonicalizePayload(payload) ──► UTF-8 Bytes
       │                                         │
       └─► Base64Decode(signature) ─────────────┼─► ed25519.Verify(pubKey, bytes, sig)
                                                 │
                                                 ▼
                                     [ PASS: Active Entitlements ]
                                     [ FAIL: Fallback DefaultFree ]
```

> [!IMPORTANT]
> The Ed25519 private signing key lives exclusively inside Naagmani Cloud License Authority. Customer runtimes store only the public key verification material.

---

## 3. License Lifecycle State Machine

```text
       DRAFT
         ↓
       ISSUED
         ↓
       ACTIVE
         ↓ (Expiration reached)
       GRACE (14-day operational warning)
         ↓ (Grace elapsed)
       EXPIRED ──► Fallback to DefaultFree (Core inference preserved)
```

- **ACTIVE**: All licensed enterprise capabilities enabled.
- **GRACE**: Active for 14 days after `expires_at` with operational warnings in Developer Portal and CLI. Workloads continue unhindered.
- **EXPIRED**: Reverts to `DefaultFree` tier (`router`, `byok`, `plugin_runtime`). Customer data and credentials remain 100% intact.
- **REVOKED**: For connected instances, immediate deactivation with recorded audit event.

---

## 4. DefaultFree Tier Fallback

When no commercial license is configured, or if signature verification fails, the runtime activates the default open-source capabilities without failing or halting inference:

| Feature | DefaultFree | Pro | Enterprise |
|---|---|---|---|
| **Core AI Router** | Enabled | Enabled | Enabled |
| **BYOK Encryption** | Enabled | Enabled | Enabled |
| **Community Plugins** | Enabled | Enabled | Enabled |
| **Advanced Routing Policies** | Disabled | Enabled | Enabled |
| **Enterprise RBAC & Roles** | Disabled | Disabled | Enabled |
| **Audit Log Export & Retention** | 7 Days | 30 Days | 365+ Days |
| **Model Context Protocol (MCP)** | 3 Servers | 20 Servers | Unlimited |
