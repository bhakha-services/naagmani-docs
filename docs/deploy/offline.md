# Offline and air-gapped setup

Self-hosted login and signed-license verification can operate without Accounts connectivity. Inference also requires reachable model providers; use local model services when external network access is prohibited. Plugins may have their own network or package dependencies.

## Prepare on a connected machine

1. Obtain the release's Compose configuration, environment template and database initialization files. The [manual deployment guide](/deploy/docker-compose) links all three downloadable templates and lists the required credentials.
2. Pull all application and dependency images referenced by that Compose configuration, for the target CPU architecture.
3. Export the images with `docker save` and transfer the archive and configuration files using your organization's approved method.
4. If paid features are needed, obtain a signed JSON license for the target installation ID and the issuer's verification public key. Never transfer a private signing key to the installation.

For example, after pulling the exact references used by your configuration:

```bash
docker save -o naagmani-images.tar \
  ghcr.io/bhakha-services/naagmani-os:latest \
  ghcr.io/bhakha-services/naagmani-cloud:latest \
  ghcr.io/bhakha-services/naagmani-developer:latest \
  pgvector/pgvector:pg16 redis:7-alpine
```

Replace `latest` with the released references you have selected. An image archive contains images for the architecture you pulled; it is not automatically a multi-architecture bundle.

## Start offline

On the target machine:

```bash
docker load -i naagmani-images.tar
docker compose config --quiet
docker compose up -d --pull never
docker compose ps
```

Use the prepared self-hosted configuration with unique local credentials. If using a pre-downloaded installer script, `NAAGMANI_SKIP_PULL=true` tells the shell/PowerShell installer to use local images. It does not supply missing scripts, images, Docker packages or optional CLI downloads. Stage those artifacts before disconnecting.

Set this variable before running the staged script:

```powershell
# Windows PowerShell
$env:NAAGMANI_SKIP_PULL = "true"
& .\install.ps1
```

```bash
# Linux or macOS
NAAGMANI_SKIP_PULL=true bash ./install.sh
```

The image references in the configuration must match the loaded images. A missing image with `--pull never` is an installation error; loading a different tag does not satisfy it.

## Apply an offline license

Use the local portal's **License & Sync** page to import the signed JSON license for this installation. Alternatively, mount the file and configure `NAAGMANI_LICENSE_PATH` to its path inside the OS container. `NAAGMANI_LICENSE_DATA` accepts inline signed JSON and takes precedence over the file setting.

The OS verifies the signature, installation binding and expiry. Persist its data directory. Keep the host clock accurate. Do not assume a fixed grace period after expiry; paid access is evaluated locally from the signed license.

## Verify isolation

Check local login, provider requests, license state and restart behavior with external egress blocked. Disable connected registration and use local plugin/model dependencies. There is no automatic `NAAGMANI_AIR_GAPPED` switch that replaces firewall enforcement.

Email verification and password recovery are disabled unless [SMTP is explicitly configured](/deploy/email). An approved internal SMTP relay can operate within the isolated network.

See [self-hosted operation](/deployment/self-hosted-boundaries) and [licensing](/licensing/overview).
