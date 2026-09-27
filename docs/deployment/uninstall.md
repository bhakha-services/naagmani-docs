# Uninstall & Teardown Guide

This guide describes how to safely stop, uninstall, or purge **Naagmani AI OS** deployments.

---

## 1. Standard Uninstall (Non-Destructive)

By default, running `platform uninstall` stops and removes all running platform containers and networks while **preserving all persistent data volumes, databases, encryption keys, and installation identity**.

```bash
naagmani platform uninstall
```

Custom directory:
```bash
naagmani platform uninstall --dir /opt/naagmani
```

### What Standard Uninstall Does:
- Gracefully stops `naagmani-os`, `naagmani-cloud`, `naagmani-developer`, `naagmani-postgres`, and `naagmani-redis`
- Removes the application containers and internal Docker bridge network (`naagmani-network`)
- **Preserves:**
  - PostgreSQL database data (`naagmani-postgres-data`)
  - OS local state & plugins (`naagmani-os-data`)
  - Configuration files (`.env`, `docker-compose.production.yml`)
  - Installation identity (`.naagmani/installation_id`)
  - Database backups (`backups/`)

### Reinstalling After Standard Uninstall:
Running `naagmani platform install` after a standard uninstall will seamlessly attach to existing database volumes, preserve existing cryptographic keys, retain the same installation identity, and restore service.

---

## 2. Complete Purge (Destructive)

If you wish to completely wipe the installation, remove all database records, erase cryptographic keys, and clear installation identity:

```bash
naagmani platform uninstall --purge-data
```

### Interactive Protection
To prevent accidental data loss, the CLI requires explicit confirmation before executing destructive operations:

```text
================================================================================
⚠️  WARNING: PERMANENT DATA PURGE REQUESTED
================================================================================
This operation will permanently destroy:
  - PostgreSQL database volumes (naagmani-postgres-data)
  - OS runtime data and plugin storage (naagmani-os-data)
  - Local configuration files (.env)
  - Installation identity and history (.naagmani/)

To confirm permanent deletion, type 'DELETE' and press enter: DELETE
```

### Non-Interactive Purge (CI / Automated Environments)
In automated test pipelines, provide the `--yes` or `-y` flag alongside `--purge-data`:

```bash
naagmani platform uninstall --dir /opt/naagmani --purge-data -y
```

---

## 3. Fresh Installation After Purge

After a successful data purge, running:
```bash
naagmani platform install --dir /opt/naagmani
```
will generate a brand-new unique `installation_id`, create fresh cryptographic secrets (AES-256 keys, session secrets), and initialize clean PostgreSQL schemas from scratch.
