# Optional email for self-hosted installations

Self-hosted local login does not require SMTP or a vendor Accounts connection. Email verification and email-based password recovery are optional. They are hidden when email delivery is not configured; users are not automatically marked verified.

## Configure during installation

The shell and PowerShell installers offer **Configure optional SMTP email verification and recovery?**, defaulting to **No**. If enabled, provide the public portal URL, SMTP host, port, transport security, sender address and optional authentication. SMTP passwords are entered without echo. For unattended installation, set the same environment variables before running the installer.

Existing configuration is retained when you choose to keep it. To enable email later, edit the installation's `.env` and recreate the local API container. You do not need to delete volumes, recreate users or reinstall the database.

## Environment variables

```dotenv
EMAIL_ENABLED=true
PORTAL_BASE_URL=https://portal.example.com
EMAIL_FROM=portal@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURITY=starttls
SMTP_USERNAME=portal@example.com
SMTP_PASSWORD='replace-with-your-smtp-password'
```

| Setting | Meaning |
| --- | --- |
| `EMAIL_ENABLED` | Defaults to `false`; explicitly enable outbound email |
| `PORTAL_BASE_URL` | Browser-accessible portal base URL used in verification and recovery links; use your real HTTPS hostname for remote users |
| `EMAIL_FROM` | Sender authorized by your mail provider; required when email is enabled |
| `SMTP_HOST` | SMTP hostname reachable from the local API container |
| `SMTP_PORT` | Usually `587` for STARTTLS or `465` for implicit TLS |
| `SMTP_SECURITY` | `starttls` requires a TLS upgrade; `tls` starts with TLS; `none` is for an explicitly trusted internal relay |
| `SMTP_USERNAME`, `SMTP_PASSWORD` | Optional relay authentication; store privately on the installation host |

`SMTP_SECURITY` takes precedence over the legacy `SMTP_USE_TLS` setting. Legacy `SMTP_USE_TLS=true` means implicit TLS, not STARTTLS. Prefer the explicit security setting for new configurations. TLS verification remains enabled; STARTTLS does not fall back to plaintext when the server rejects it.

Use single-quoted dotenv values for passwords containing `$`. Keep the `.env` file private and out of source control. The portal receives capability flags, not SMTP credentials.

Inside a container, `localhost` is that container. For Docker Desktop host relays use the appropriate host address, such as `host.docker.internal`. For a relay in the same Compose network use its service name.

## Apply and test

For the shell/PowerShell installer and the downloadable Compose templates, run from the installation directory:

```bash
docker compose up -d --no-deps cloud
docker compose logs --tail 50 cloud
```

Reload the portal, open **Settings → Installation email delivery**, and select **Send test email to my account**. It sends only to the signed-in account's address. A successful test means the SMTP server accepted the message; confirm inbox delivery too. A delivery failure is reported as a failure.

For an unverified local user, the verification banner appears when SMTP is configured. Use **Resend Email**, then open the one-use link in the delivered message. **Forgot password?** appears on local sign-in only when email recovery is available. Already issued verification/reset tokens remain usable independently of whether SMTP is later disabled.

Verification tokens expire after 24 hours; password-reset tokens expire after one hour. Signing in remains local. Requests for unknown addresses do not disclose whether an account exists.

## Go CLI installations

`naagmani platform install` generates email-disabled defaults and forwards these SMTP variables to the local API. Use `--env-file` with a complete installation environment file to preconfigure email; a custom file must include the rest of the required installation configuration, not just the SMTP fragment above. Retain existing keys and credentials when updating.

`naagmani platform doctor --dir <installation-directory>` reports whether email is disabled, incomplete or configured. Its configured status is not an SMTP delivery test. In CLI-generated Compose, the local API service is named `naagmani-cloud`; recreate that service after changing the environment.

## Air-gapped deployments

Leave email disabled unless an approved internal SMTP relay is available. An internal relay can provide verification and recovery without vendor connectivity. Firewall isolation is still required. Without email, use your installation operator's account-recovery procedure; the portal does not send recovery mail or pretend that an email was delivered.
