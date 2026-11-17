# Deploy with Coolify

Run the self-hosted five-service stack as a Docker Compose resource. Local login remains inside the installation; a vendor Accounts service is not part of this stack.

## Prepare the stack

Use the [self-hosted Coolify Compose template](/downloads/docker-compose.coolify.yml) and [environment template](/downloads/self-hosted.env.example), matched to compatible released images. Supply its required passwords, encryption key, session secret and machine credential before deploying. Keep the same machine credential on the local API and OS. Do not use default passwords from older examples.

Create persistent storage for PostgreSQL and the OS data directory. Preserve installation identity and license files across redeployments. The database setup must create both databases referenced by the stack before the applications connect.

## Configure routes

| Service | Container port | Exposure |
| --- | --- | --- |
| `developer` | `3000` | Portal hostname over HTTPS |
| `cloud` | `8080` | Internal API; expose separately only when your clients need it |
| `os` | `8080` | Gateway hostname over HTTPS for application inference |
| `postgres` | `5432` | Private |
| `redis` | `6379` | Private |

Set `PORTAL_BASE_URL` to the external portal URL. Set the portal's `CLOUD_API_URL` to the local control-plane service address, normally `http://cloud:8080`. Set the local API's OS address to `http://os:8080`. Container service names are not public browser hostnames.

Configure your reverse proxy and trusted forwarded headers consistently. TLS termination and certificate management are responsibilities of your Coolify/proxy configuration; the application does not create public certificates itself.

## Verify

1. Check all five services and persistent volumes in Coolify.
2. Check gateway `GET /v1/health` and local API `GET /health`.
3. Open the portal hostname and sign in with the local owner credentials.
4. Add a provider and send a test request through the gateway.
5. Restart the stack and confirm login, configuration and installation identity are preserved.

For details, see [Compose configuration](/deploy/docker-compose), [installation](/deploy/installation) and [backups and upgrades](/deployment/upgrades).
