# Authentication troubleshooting

Check that the credential belongs to the API surface you are calling. Provider keys, local portal credentials, Accounts JWTs, application API keys and Project Service Tokens are different credentials.

- Local self-hosted users authenticate locally; Accounts JWTs are not local installation sessions.
- Application keys use nm_live_; Project Service Tokens use nm_st_. Copy the full issued secret rather than fabricating a key from its prefix.
- Check expiry, revocation, project/environment scope and required capabilities.
- Use the local portal or hosted Accounts flow to restore a human session. Do not use the CLI password command as an Accounts device-flow login.

See [authentication](/security/authentication), [application credentials](/api/authentication), [service-token management](/api/service-tokens) and [CLI authentication](/build/cli/authentication).
