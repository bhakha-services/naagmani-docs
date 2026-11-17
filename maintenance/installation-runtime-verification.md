# Local installation runtime verification — 2026-11-17

Internal verification record, not a public product capability claim.

Host: Windows, Docker Desktop Linux containers. All installations used separate Compose projects and volumes. Existing user stacks were not removed. Evidence and harnesses are in `E:/project/naagmani-project/tmp/install-verification-20261117/`.

## Published installer finding

Downloaded and executed the actual `https://naagmani.com/install.ps1`, SHA-256 `0C4AE304D071EBFF99C6C11D7192DD6883843B22B9FF722A2E766B8ADFB8AA53`. Its generated configuration used obsolete database variables. OS and local API attempted PostgreSQL at localhost:5432 and failed. This published installer did not pass installation.

Fixed marketing installer sources (`public/install.ps1`, `public/install.sh`, `public/docker-compose.yml`) to supply the scoped database/cache variables, runtime self-hosted portal mode and explicit access-token lifetime. Removed a private license signing seed from generated self-hosted configuration. Installers now require gateway, API and portal health before reporting success.

These are local source fixes. The public installer URLs have not been republished by this test.

## Corrected Windows installer

Ran the corrected PowerShell installer from scratch with actual registry images and all nine configuration prompts answered by a harness. Project `naagmani-install-fixed-20261117`; portal `http://localhost:13501`. Gateway/API/portal health and local owner login with HttpOnly session cookies passed. See `connected-fixed-installer.log`, `prompt-checks-fixed.json`, `connected-results.json`.

Also ran a fresh corrected installer with `NAAGMANI_SKIP_PULL=true` and staged local images: project `naagmani-offline-installer-20261117`, portal `http://localhost:13503`. All nine prompts and installer health checks passed. This staged-installer test used a normal Docker bridge; the no-egress test below was separate.

## Air-gapped workflow

Executed `docker save` for all five image references documented in the offline guide and `docker load` on the resulting 300,874,752-byte archive. Used the downloadable Compose, environment and initialization templates. Started with `--pull never` and an override setting `pull_policy: never` and the shared network to `internal: true`.

Project `naagmani-air-verify-20261117` had no external route; an HTTP request to 1.1.1.1 failed with network unreachable. Internal service requests worked. Docker Desktop did not expose usable host ports for this internal network, so the client probes ran inside the developer container.

Nine checks passed (`air-results.json`): OS health, API health, portal page, local owner login, session resolution, refresh-cookie-only recovery, signed license acceptance, tampered license rejection, and logout revocation. Signed license used an ephemeral test issuer and custom installation identity; no private issuer key was installed. After restarting OS/API/portal, local login and the active license entitlement still passed (`air-post-restart.cjs`).

## Scope and limits

The tested login uses the self-hosted local provider without Accounts connectivity. The host itself remained connected; isolation was enforced on the application Docker network. No real local model provider or inference workload was exercised in this installation test. Windows PowerShell installation ran end to end; Bash passed syntax and generated-Compose checks but was not executed as a Linux/macOS installation.

Marketing regression command `npm run test:installers`: three generated-configuration checks passed, covering PowerShell, Bash and standalone Compose. Preserve test environment files privately because they contain generated installation secrets.

## Follow-up: blank dashboard in the user's browser

Reproduced an invalid-session blank dashboard in the existing in-app browser at port 13501; a fresh browser could sign in normally. Cookie presence redirected the self-hosted login page to the dashboard even when refresh was rejected. The local refresh rejection branch did not clear the invalid cookies.

Fixed local refresh rejection to delete invalid session/refresh cookies (400/401 only; outages preserve cookies), allowed the self-hosted login page to validate the session itself, and replaced the empty unauthenticated dashboard with a visible sign-in recovery link. Six self-hosted proxy/session tests and 19 route/session lifecycle tests passed. Production Docker build passed including TypeScript.

Replaced only the port-13501 developer container using local image `naagmani-portal-session-recovery:local` and `connected-fixed/portal-recovery.json`. The user's existing tab then recovered to the login page; signing in displayed its populated dashboard, Default Project and connected runtime. Database and dependency containers were retained. This is a local custom image, not a newly published GHCR release.
