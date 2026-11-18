# Install Naagmani

The self-hosted installer runs five services: the Developer Portal, local control-plane API, OS gateway, PostgreSQL and Redis. Your installation authenticates local users itself; an Accounts login is not required for local access.

## Before you start

Have Docker running and Docker Compose available. Docker Desktop is needed on Windows and macOS. Allow enough CPU, memory and disk for the platform and your workloads; 4 GB RAM and 20 GB free disk are a starting point, not a capacity guarantee. Initial image downloads require network access.

## Run the installer

Linux or macOS:

```bash
curl -fsSL https://naagmani.com/install.sh | bash
```

Alternatively:

```bash
wget -qO- https://naagmani.com/install.sh | bash
```

Windows PowerShell, with Docker Desktop running:

```powershell
iwr -useb https://naagmani.com/install.ps1 | iex
```

These commands execute a downloaded script. To inspect it first, download the file and read it before running it. The scripts install the platform, not just the optional CLI.

## Installer prompts

The installer checks Docker access, offers supported setup or recovery actions, and asks for installation settings. Review the defaults before accepting them.

| Setting | Script default or behavior |
| --- | --- |
| Installation directory | A `naagmani` folder in your home directory; override with `NAAGMANI_INSTALL_DIR` |
| Local owner email | `admin@naagmani.local`; choose your own |
| Local owner password | Randomly generated; keep it securely |
| Developer Portal | Host port `3001` |
| OS gateway | Host port `8080` |
| Local control-plane API | Host port `8081` |
| PostgreSQL | Host port `5433` |
| Redis | Host port `6379` |
| Optional SMTP email | Disabled by default; opt in to configure verification and recovery mail |
| Existing configuration | The script asks whether to keep it; preserve secrets and data when upgrading |

Ports may change if you choose alternatives or the defaults are occupied. Use the endpoints printed at completion. A standalone Compose file or CLI installation can have different defaults.

The script creates configuration and database initialization files, generates credentials, pulls images, starts containers and checks service health. Download and startup time depend on the host and network.

## Sign in and check the installation

See [optional self-hosted email](/deploy/email) for SMTP setup, transport security, public email-link URLs and a delivery test. Email is optional for local login and can use an internal relay in an isolated deployment.

Open the portal URL printed by the installer. Use the local owner credentials chosen during installation. This owner manages your installation's organization; it is not a vendor platform administrator.

From the installation directory:

```bash
docker compose ps
docker compose logs --tail 100 os cloud developer
curl -fsS http://localhost:8080/v1/health
curl -fsS http://localhost:8081/health
```

Replace the sample ports with your configured values. A healthy gateway does not mean a model provider is configured: add provider credentials and a model before sending your first inference request.

## Production configuration

If an older installer starts containers that repeatedly report a PostgreSQL connection to `localhost:5432`, inspect the generated configuration. The current OS requires `DATABASE_URL_OS` and `REDIS_URL_OS`; the local API requires `DATABASE_URL_CLOUD` and `REDIS_URL_CLOUD`. Their container addresses should use the `postgres` and `redis` service names. Use the [current manual deployment templates](/deploy/docker-compose) with compatible images, retaining your existing credentials and volumes when repairing an installation.

- Use unique secrets. Keep the database, cache and machine credentials private.
- Put externally accessible services behind HTTPS. Restrict access to published database/cache ports using host networking and firewall rules.
- Use your server's actual hostname from remote browsers; `localhost` refers to the browser's machine.
- Back up database volumes, configuration, encryption keys, installation identity and any signed license before updates.
- Keep the same machine credential on the local API and OS. It is separate from application API keys and portal passwords.

## Uninstall and reinstall

Uninstall asks separately whether to permanently delete the installation database and storage. The default is **No**: containers stop, while data and the matching configuration remain together. Run the installer again to resume that installation with its existing accounts and credentials.

For a clean reinstall, explicitly confirm permanent data deletion, then confirm removal of the installation directory. This deletes local accounts, database contents and persisted installation data. Back up anything you need first. A fresh installation creates new credentials; it does not reset accounts inside a retained database.

Removing only the installation folder does not remove Docker volumes. If a database volume remains but its configuration is missing, restore its matching `.env` backup before continuing.

## Other installation paths

- [Docker Compose operations](/deploy/docker-compose)
- [Coolify deployment](/deploy/coolify)
- [Offline setup](/deploy/offline)
- [CLI installation](/build/cli/installation)
- [Configure a provider and make a request](/get-started/quickstart)
