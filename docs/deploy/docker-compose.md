# Docker Compose deployment

The self-hosted stack contains `postgres`, `redis`, `os`, `cloud` and `developer`. The service named `cloud` is your local control-plane API; it does not mean that your self-hosted users log in through the hosted Accounts service.

## Generate a working configuration

Use the [installation guide](/deploy/installation) to generate the Compose file, environment file and database initialization file together. Keep these files in the installation directory. A Compose file alone does not provision secure credentials or the database initialization file it mounts.

For a manual deployment, download these files together:

- [Self-hosted Compose template](/downloads/docker-compose.self-hosted.yml), saved as `docker-compose.yml`.
- [Environment template](/downloads/self-hosted.env.example), saved as `.env`.
- [Database initialization](/downloads/init-databases.sql), saved as `init-databases.sql` beside the Compose file.

These templates describe the current documented configuration. Match them to compatible released images.

For manual deployment, use the self-hosted Compose configuration supplied with the release you are deploying. Fill its required environment values before starting it. Do not reuse sample credentials or use a Compose template from a different release.

## Configuration checklist

| Value | Purpose |
| --- | --- |
| `POSTGRES_PASSWORD` | Unique database credential |
| `NAAGMANI_ENCRYPTION_KEY` | Encryption key; retain it across restarts and backups |
| `NAAGMANI_SESSION_SECRET` | Local authentication configuration |
| `NAAGMANI_SYSTEM_KEY` | Private machine credential shared by the local API and OS |
| `NAAGMANI_ADMIN_EMAIL`, `NAAGMANI_ADMIN_PASSWORD` | Initial local organization owner |
| `PORTAL_BASE_URL` | Browser-accessible portal URL |
| `CLOUD_API_URL` | Portal server's address for the local control-plane API |
| `ACCOUNTS_WEB_URL` | Accounts billing website used by portal links; defaults to `https://accounts.naagmani.com`, and can point to your local Accounts web service for testing |

A production machine credential has the format `nm_live_` followed by 48 random hexadecimal characters. The automated installer generates it. Never use this credential in application code or expose it to browsers.

For container-to-container traffic, use service names and internal ports, such as `http://cloud:8080` and `http://os:8080`. Browser-facing URLs must use a hostname the browser can reach. Self-hosted portal builds use the same-origin local API proxy; changing a public build-time variable alone does not rebuild a browser bundle.

## Ports

The shell and PowerShell installers initially offer portal `3001`, gateway `8080` and local API `8081`. Release Compose templates may default to gateway `9080` and local API `9081`. Your environment file and the actual port mappings are authoritative:

```bash
docker compose ps
```

PostgreSQL and Redis are platform dependencies, not public application APIs. Restrict any host ports published for them.

## Start and inspect

Run from the installation directory:

```bash
docker compose config --quiet
docker compose pull
docker compose up -d
docker compose ps
docker compose logs --tail 100 os cloud developer
```

Use image tags or digests that are actually available for your release and architecture. Image availability is separate from source-code support.

## Stop and update

```bash
docker compose stop
docker compose start
```

Back up before an update. Pulling new images and recreating containers can interrupt requests; a single-node Compose deployment does not promise zero downtime. Do not remove named volumes when you intend to preserve data.

See [upgrades and recovery](/deployment/upgrades) and [offline setup](/deploy/offline).
