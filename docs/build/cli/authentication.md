# CLI authentication and context

Portal login and CLI authentication are different flows. Self-hosted portal users authenticate locally; hosted portal users authenticate through Accounts.

## Local CLI password login

The CLI's current `login` command calls the selected control-plane API's local password-login endpoint. It requires explicit email and password arguments:

```bash
naagmani login --cloud-url http://localhost:8081 --email local-user@example.com --password '<local-password>'
naagmani whoami
```

Use this only with a self-hosted API that supports local password login. Passwords passed on command lines can appear in shell history or process listings. The current command is not an Accounts browser/device authorization flow and should not be used as a hosted SSO login instruction.

## Environment configuration

| Variable | Purpose |
| --- | --- |
| `NAAGMANI_CLOUD_URL` | Control-plane base URL |
| `NAAGMANI_OS_URL` | Gateway base URL |
| `NAAGMANI_TOKEN` | Credential for a supported authenticated API workflow |
| `NAAGMANI_API_KEY` | Application API key for endpoints that accept it |
| `NAAGMANI_ORG_ID` | Organization context |
| `NAAGMANI_PROJECT_ID` | Project context |
| `NAAGMANI_ENVIRONMENT` | Environment context |

A gateway API key or Project Service Token is not a portal session and does not grant arbitrary organization administration. Use a credential accepted by the endpoint and limited to the required scope. Keep automation credentials in a secret manager.

The CLI stores local configuration in `~/.naagmani/config.json`. To remove stored authentication:

```bash
naagmani logout
```

This clears local CLI credentials; do not treat it as proof that every remote token or browser session has been revoked.

See [application authentication](/api/authentication) and [CLI commands](/build/cli/commands).
