# Self-hosted email implementation and verification — 2026-11-17

Internal engineering record. Public operator instructions are in `docs/deploy/email.md`.

## Behavior implemented

- Self-hosted email defaults off. Local password login remains available and users are not automatically marked email-verified.
- The backend publishes only `email_verification` and `password_recovery` capability flags. The portal reads those flags from the local API, hides the banner/recovery controls when unavailable, and distinguishes a configuration-check outage from disabled SMTP in Settings. SMTP credentials are never returned to the browser.
- Disabled resend and recovery endpoints return `503 email_unavailable` instead of claiming delivery. Existing one-use verification/reset links can still be consumed if email is later disabled.
- With SMTP configured, Settings provides a self-addressed test-email action. It is authenticated, uses the signed-in user's email rather than a caller-selected recipient, and uses the existing IP rate limiter when enabled. Success means the SMTP server accepted the message; network/auth/transport failures are reported as failures.
- Verification updates the user profile and notifies other open portal tabs so the banner disappears after verification. The token-less verification screen gives inbox instructions rather than falsely saying the link expired. Verification does not claim to grant roles or licensed features.
- Enabled SMTP requires a sender, valid host/port/security setting and a public HTTP(S) portal URL. `starttls`, `tls` and explicit trusted-relay `none` modes are supported. STARTTLS fails rather than downgrading; network operations have a ten-second deadline. Legacy `SMTP_USE_TLS` values remain compatible when explicit `SMTP_SECURITY` is absent. An unconfigured mailer no longer defaults to logging authentication email bodies.

## Provisioning

- PowerShell and shell installers ask whether to configure SMTP, default No. The enabled flow asks for the public portal URL, host, port, security, sender and optional username. Password input is hidden; unattended configuration can come from environment variables.
- New dotenv values are quoted to preserve literal `$`, quotes and backslashes. Existing-configuration preservation remains available. SMTP settings go to the local API only.
- All self-hosted Compose variants, marketing assets and public downloadable templates forward SMTP settings. New environment templates use explicit `SMTP_SECURITY=starttls`; Compose retains older explicit TLS settings when no new security mode is supplied.
- The Go CLI generates email-disabled defaults, forwards SMTP settings to its API service, accepts a complete custom `--env-file`, and reports optional-email status in `platform doctor` without printing secrets.
- The public email guide covers late configuration, container hostnames, public email-link URLs, transport selection, delivery testing and internal SMTP for isolated networks.

## Real local checks

Evidence and harnesses: `E:/project/naagmani-project/tmp/email-flow-20261117/`.

`runtime.cjs` / `results.json`: seven passing scenario groups:

1. SMTP-off capability flags, disabled resend/recovery errors and successful local login on portal 13501.
2. SMTP-enabled test email delivered through host Mailpit; unauthenticated test requests rejected.
3. Delivered verification link uses the local portal, verifies once, rejects reuse and updates the profile.
4. Password-reset delivery, token reuse rejection, old-password rejection, new-password login and restoration of test credentials; unknown-address responses remain generic.
5–7. The same test-email, verification and recovery flows passed on the air-gapped stack using a Mailpit relay inside its internal Docker network. External access to 1.1.1.1 remained unreachable afterward.

`failure.cjs` / `smtp-failure-results.json`: an unreachable SMTP port returned `502 email_delivery_failed` while local login worked. Restoring the relay restored successful test-mail delivery.

`run-installer.ps1`, `installer.log`, `installer-results.json`: a fresh isolated Windows installation answered all 16 SMTP-enabled configuration prompts and passed application health checks. Inspected the actual running API container to confirm a fixture password containing `$`, a quote and a backslash was preserved exactly. Compose's diagnostic JSON escapes `$` as `$$`; that display representation must not be mistaken for a runtime credential change.

The installer test uses local corrected API/portal overrides and staged registry dependency images, project `naagmani-email-installer-20261117`, portal `http://localhost:13504`. No existing installation volumes were removed.

Browser checks:

- Port 13501: unverified user has no verification banner with SMTP off; Settings explains optional email setup.
- Port 13504: recovery link appears at sign-in and the banner appears for an unverified user when SMTP is on.
- Clicked Resend, opened the actual delivered verification link in another tab, observed verification success and disappearance of the banner in the already-open dashboard.
- Clicked Settings' test-email button and observed SMTP-server acceptance.
- Screenshots: `output/playwright/self-hosted-email-disabled.png`, `self-hosted-email-configured.png`, `self-hosted-email-test-passed.png`.

## Automated verification

- Portal: 284/284 regression tests passed against the designated local integration API.
- Cloud: configuration, email, identity, HTTP handler and router packages passed. Includes invalid configuration, legacy transport compatibility, disabled-delivery capability checks and STARTTLS downgrade rejection.
- Go CLI: full `go test ./cmd` passed, including SMTP forwarding/secret-boundary coverage.
- Marketing: 3/3 generated-installer/Compose checks passed; PowerShell parser and Git Bash syntax checks passed.
- Public docs: 3/3 checks passed; 172 documents and 439 references audited.
- Final portal production Docker build passed including TypeScript; final API cross-build passed.

## Running state and limits

Final local portal image: `naagmani-portal-email:local`. The three earlier test stacks use `email-override.json` in addition to their licensing/network overrides. Their local API executable is mounted from `tmp/email-flow-20261117/cloud-final`. Keep these files and overrides together when recreating those test stacks.

SMTP delivery was tested with local Mailpit relays, including a relay confined to the isolated network. An external production SMTP provider, its real credentials, certificate chain and spam/inbox placement were not tested. Use the Settings delivery test after configuring the deployment's own relay.

Windows PowerShell installation ran end to end. Bash was checked for syntax and generated configuration; a Linux/macOS installation was not run. Go CLI configuration and tests were exercised; a separate full Go CLI installation was not run in this email task.

All changes are local source and test deployments. Public installer URLs and release images have not been published. Test inbox addresses and credentials are disposable local fixtures. No production mail or third-party customer message was sent.
