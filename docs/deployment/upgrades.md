# Platform Upgrades, Migrations & Recovery

## Overview

Naagmani features an automated, deterministic **12-stage platform upgrade engine** designed for high-availability production deployments across Docker Compose and Coolify.

Platform upgrades decouple **WHAT** is being upgraded (canonical signed `release.yaml` release manifest) from **HOW** it is deployed (swappable `DeploymentBackend` adapters).

---

## 1. Upgrade Lifecycle State Machine

```text
[ IDLE ]
   │
   ▼
[ CHECKING ] ──────── (Validate compatibility matrix & release signatures)
   │
   ▼
[ RESOLVING ] ─────── (Resolve target release version & image digests)
   │
   ▼
[ PREFLIGHT ] ─────── (Verify CPU, RAM, Disk, Port availability & Docker status)
   │
   ▼
[ BACKING_UP ] ────── (Snapshot PostgreSQL databases + config + state metadata)
   │
   ▼
[ STAGING ] ───────── (Pre-pull image layers / unpack offline bundle)
   │
   ▼
[ MIGRATING ] ─────── (Apply classified schema migrations)
   │
   ▼
[ DEPLOYING ] ─────── (Rolling zero-downtime container recreation)
   │
   ▼
[ HEALTH_CHECKING ] ─ (Probe OS /v1/health & Cloud /health endpoints)
   │
   ├── (Probes Failed) ──► [ ROLLING_BACK ] ──► [ ROLLED_BACK ] (Restore previous version)
   │
   ▼ (Probes Passed)
[ VERIFYING ] ─────── (Validate licensing & plugin sandbox integrity)
   │
   ▼
[ COMMITTING ] ────── (Persist platform_state.json & update_history.json)
   │
   ▼
[ COMPLETED ]
```

---

## 2. CLI Platform Commands

### Check Available Upgrades
```bash
naagmani platform update check [--channel stable|beta] [--json]
```

### Execute Platform Upgrade
```bash
naagmani platform update [--version v2.1.0] [--channel stable]
```

### Inspect Upgrade History
```bash
naagmani platform update history [--json]
```

### Recover from Interrupted Upgrade
If a power failure, kernel panic, or container daemon crash interrupts an in-progress upgrade:
```bash
naagmani platform recovery [--force-rollback]
```

### Manual Rollback
```bash
naagmani platform rollback [--version v2.0.0]
```

---

## 3. Database Migration Strategy & Safety

Database schema changes in Naagmani releases are strictly classified:

| Classification | Behavior | Rollback Procedure |
| :--- | :--- | :--- |
| **`FORWARD_COMPATIBLE`** | Expand/contract dual-read schema changes. | Instant container rollback; older software can read newer schema. |
| **`REVERSIBLE`** | Additive columns or non-destructive tables. | Automated container rollback; down-migrations applied if needed. |
| **`IRREVERSIBLE`** | Destructive column/table drops or breaking transformations. | Requires verified pre-upgrade snapshot. Rollback requires `naagmani platform restore`. |

---

## 4. Air-Gapped / Offline Upgrades

For disconnected enterprise installations:
1. Download official signed release bundle `naagmani-release-<version>.tar.gz`.
2. Transfer archive to target server via secure bastion.
3. Run offline upgrade:
```bash
naagmani platform update --offline /path/to/naagmani-release-v2.1.0.tar.gz
```
4. The updater validates the internal `release.sig` with the local trusted public key before staging container layers.
