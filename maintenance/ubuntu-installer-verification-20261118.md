# Ubuntu installer verification — 18 November 2026

Environment: Ubuntu 24.04 WSL 2, Docker Desktop engine 29.7.2, Compose 5.1.4. Isolated Compose projects and container-name overrides were used. Application images were the actual public GHCR `latest` images; application binaries were not substituted. The existing user installation was retained.

## Results

- Both public `curl -fsSL https://naagmani.com/install.sh | bash` and `wget -qO- https://naagmani.com/install.sh | bash` reproduced an occupied-port bug. A Redis port warning was captured into the port variable and written into `.env`, causing Compose parsing to fail. Public commands remain affected until the fixed script is published.
- Local source fix sends port diagnostics to stderr. Fresh interactive installation completed with SMTP disabled. All ten prompts were answered through a real controlling terminal.
- SMTP-enabled installation exercised all seventeen prompts, including the hidden password prompt. Literal dollar, single quote and backslash characters survived into the actual API container environment. Docker Desktop rejected one selected test database host port; retry used port 25432 without replacing the database volume.
- Both stacks passed gateway/API/portal health, local owner login, HttpOnly cookie and session checks. SMTP message delivery was not tested in this run.
- `status`, `doctor`, `restart`, and online `update` ran in Ubuntu. Installed local CLI `help`, `status`, and `doctor` passed. Doctor now resolves PostgreSQL/Redis by Compose service, does not rewrite custom ports based on an obsolete frontend assumption, and returns failure when checks fail. Update waits for application health before success.
- `docker save` exported all five image references to a 300851712-byte archive; `docker load` imported them. `docker compose config --quiet` and `docker compose up -d --pull never` ran. On a Docker internal network, all three application health checks and owner login passed from within the installation; external HTTPS was confirmed blocked. Internal networks suppress host port publication, so these isolated checks used the portal container. The test network was then restored by recreating only test containers, retaining volumes.
- `NAAGMANI_SKIP_PULL=true` update passed using staged images after restoration. The local CLI can be staged with `NAAGMANI_NO_PATH_UPDATE=true` without editing global PATH or shell profiles.
- Shell syntax, occupied/free port regression checks, three existing installer Compose-contract tests, and Git whitespace checks passed.

## Limits

This is Ubuntu/WSL validation, not a native macOS or ARM run. Docker package installation on a clean host, destructive uninstall, credential-changing reconfiguration, SMTP delivery, model inference and paid-license issuance were not certified by this run. Windows installer repair has separate evidence. No source changes from this run were pushed or publicly deployed.

## Uninstall/reinstall follow-up

The user clarified that the failure followed menu option 7 with Yes to every question. The old wizard asked whether to **preserve** volumes and then separately whether to delete the configuration directory. Yes to both orphaned retained database data from its matching credentials, explaining the reinstall failure.

Shell and PowerShell now ask explicitly whether to permanently delete data, default No. Preserving data also preserves the configuration directory; only explicit data deletion enables the directory-removal question. Failed Compose removal retains configuration. Directory deletion rejects the home directory and filesystem root.

On the isolated Ubuntu test project, real menu option 7 with all Yes removed containers, both volumes and the installation directory. Fresh interactive installation then passed health, owner login and session checks. A separate preserve-data uninstall retained configuration; staged-image update resumed it, and health/login/session passed again. Windows PowerShell 5 regression tests covered retention, full removal and failed Compose removal; no real user installation was uninstalled. Public documentation was updated. These source changes remain unpublished.

## Actual legacy Ubuntu upgrade follow-up

The user subsequently reproduced an update failure in `/home/i-linux/naagmani`. Logs showed the old generic database variables being ignored, causing connection attempts to localhost inside the API container. The shell updater now backs up and migrates scoped database/cache settings, a missing random machine credential, local deployment mode, private API routing and optional SMTP fields. Existing database URLs, secrets, custom settings, ports and volumes are retained. A new regression test verifies preservation and idempotency.

This actual installation shared the Docker project and Postgres volume with the Windows installation. Its old Ubuntu environment had a different database password. The matching credential from the existing Windows configuration was verified against Postgres over the service network and restored only into Ubuntu connection configuration; no database role password was changed. A private SQL backup and configuration backups were saved inside the Ubuntu installation before repair. Database preflight uses `-h postgres`, because loopback connections can use a trust rule and incorrectly pass with a mismatched password.

The repaired actual installation passed all doctor checks, existing owner login, HttpOnly/session checks, and API-to-OS entitlement authentication. A complete online image-pull update with the patched local installer also passed. The fixed script was staged as `/home/i-linux/naagmani/install.sh`; the public URL remains unchanged pending explicit push/deployment authorization. Actual portal is now localhost:3001, API:9081 and OS:9080, following the user's Ubuntu configuration. The prior port 4001 described above belonged to the Windows configuration before the user's Ubuntu update replaced the shared project's containers.

Private test configurations and raw logs are under `tmp/ubuntu-installer-verification-20261117` in the local workspace, outside public documentation. The two test portals are localhost ports 13601 and 13602. The user's existing portal remains on port 4001.
