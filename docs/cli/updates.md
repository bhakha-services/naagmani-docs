# Platform Updates & Rolling Upgrades

This guide describes how the Naagmani Platform update lifecycle works, how updates are discovered via Developer Portal notifications, and how to execute safe, zero-downtime upgrades using the CLI.

---

## 1. How Updates are Discovered

Whenever a new container release of Naagmani (OS Kernel, Cloud Control Plane, or Developer Portal) is compiled and published to the GitHub Container Registry (`ghcr.io/bhakha-services/*`), the platform notifies operators through two synchronized channels:

1. **Developer Portal Notification Center (🔔)**:
   - An unread announcement badge appears in the top navigation header.
   - Clicking the bell opens release highlights, changelogs, and breaking change advisories.
2. **Header Update Pill**:
   - An animated update pill (e.g. `🚀 Update Available: v1.0.1`) appears in the top header.
   - Clicking it opens an interactive modal with version diffs, database migration safety ratings, and the exact copyable terminal command.
3. **CLI Automated Check**:
   - Automated CI/CD pipelines and operators can inspect update readiness anytime from the terminal.

---

## 2. Checking for Updates via CLI

To inspect available updates, schema migration requirements, and compatibility without making any changes:

```bash
naagmani platform update check
```

### Sample Output:
```text
================================================================================
🔍 Naagmani Platform Update Check
================================================================================
Current Installed Version: v1.0.0
Target Release Version:    v1.0.1
Release Channel:           stable
Compatibility Verdict:     UPGRADE_ALLOWED
Architecture Supported:    true (windows/amd64)
License Entitlement:      true
Migrations Required:       true (Safety: REVERSIBLE)

✓ Upgrade available! To execute update:
  naagmani platform update --version v1.0.1
================================================================================
```

### JSON Mode for Automation
```bash
naagmani platform update check --json
```

---

## 3. Applying an Update

To perform an automated, zero-downtime rolling update:

```bash
naagmani platform update --version v1.0.1
```

### What Happens Automatically (10-Stage Upgrade Engine):
1. **Preflight Verification**: Validates Docker daemon, disk space, and memory.
2. **Pre-Upgrade Snapshot Backup**: Automatically creates a timestamped SQL dump of both `naagmani` and `naagmani_cloud` databases into `./backups/`.
3. **Container Pull**: Fetches the verified release images from GHCR:
   - `ghcr.io/bhakha-services/naagmani-os:v1.0.1`
   - `ghcr.io/bhakha-services/naagmani-cloud:v1.0.1`
   - `ghcr.io/bhakha-services/naagmani-developer:v1.0.1`
4. **Database Migrations**: Applies required forward-compatible or reversible migrations.
5. **Rolling Deployment**: Restarts service containers in deterministic dependency order.
6. **Health Checking**: Runs automated readiness probes against `/v1/health` for 60 seconds.
7. **Commit State**: Durable platform state is updated in `.naagmani/platform_state.json`.

---

## 4. Rollback & History

If an upgrade fails readiness checks or if you need to revert to a previous release for any operational reason:

### View Update History
```bash
naagmani platform update history
```

### Revert to Previous Release
```bash
naagmani platform rollback
```
This restores the previous container versions and re-applies the pre-upgrade database snapshot if migrations were classified as reversible.

---

## 5. System Announcements & Admin Broadcasts

System administrators can also broadcast announcements and maintenance schedules to all connected Developer Portals directly from the Admin Portal:

1. Navigate to **Commercial Admin ➔ System Announcements** (`/admin/announcements`).
2. Click **+ New Broadcast**.
3. Choose a template (e.g. *Platform Release Update*, *Scheduled Maintenance*, or *Security Patch*).
4. Click **Broadcast to Portals**. The notification instantly appears in the notification bell for all operators.
