# Authentication and provider credentials

Naagmani separates human portal sessions, application credentials and upstream provider credentials.

| Credential | Used for |
| --- | --- |
| Self-hosted local account | Sign in to that installation's portal and management API |
| Hosted Accounts session | Sign in to the hosted portal through OIDC with PKCE |
| Application API key | Authenticate supported gateway operations within its configured scope |
| Project Service Token | Authorize explicit machine capabilities within a project/environment |
| Provider credential | Allow the gateway to call the selected upstream AI provider |

A self-hosted installation does not depend on Accounts for local login or session refresh. Tokens from the hosted Accounts authority do not authenticate into local self-hosted APIs.

## Portal sessions

Current access credentials default to 15 minutes. Refresh credentials last 30 days and rotate on use; renewal is rolling rather than a fixed maximum login lifetime. Configuration and released versions can override these defaults. A valid refresh session allows short-lived access credentials to be renewed without asking for a password each time.

Refresh credentials use HttpOnly cookies. Access tokens can also be held in browser memory for authenticated API calls. Use HTTPS and protect the browser application against script injection. Logout revokes the session/refresh authority and clears local cookies.

Accounts OIDC login does not imply support for arbitrary enterprise SAML providers, Google/GitHub social sign-in or Personal Access Tokens. Use only identity options offered by your deployment.

## Provider credential handling

Provider credentials are encrypted before persistence. The gateway must decrypt them to authenticate upstream requests. Protect encryption keys, configuration, database access and backups. This is encryption at rest, not a zero-knowledge or hardware-enclave guarantee.

Never use provider keys, portal passwords or private API-to-OS machine credentials as application gateway keys. See [API authentication](/api/authentication) and [data protection](/security/data-protection).
