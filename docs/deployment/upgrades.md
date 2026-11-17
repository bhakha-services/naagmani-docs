# Backups, upgrades and recovery

Back up before changing platform images or database schemas. A single-node Compose update can interrupt requests and may require recovery; it is not a zero-downtime guarantee.

## Preserve

- Both platform databases and any persistent plugin/model data.
- Environment/Compose configuration and encryption keys.
- OS data volume, installation identity, accepted license and verification key.
- The exact image references and configuration of the working deployment.

Protect backups as sensitive data. A database dump without its required encryption keys may not be sufficient to restore encrypted content.

## Update

Use the update procedure that belongs to your installation method and release. For an installer-generated Compose stack, review the target images and configuration, then pull and recreate services from the installation directory:

```bash
docker compose pull
docker compose up -d
docker compose ps
docker compose logs --tail 100 os cloud developer
```

Test login, provider connectivity, inference, licenses and data persistence after the update. Do not remove named volumes when preserving data.

CLI-managed installations also expose update, history, recovery, rollback, backup and restore commands. Use `naagmani platform help` and your installed command's help. Do not assume an automatic rollback can undo every schema change, that manifests are cryptographically signed, or that switching image tags restores database state.

For offline updates, stage all required images and configuration before disconnecting. See [offline setup](/deploy/offline).
