# Application API keys

Open **Projects → your project → Workspace → API Keys** to create an application credential for the selected environment. A key is separate from your portal session, upstream provider credentials and the API-to-OS machine credential.

## Format and scope

Application keys use the `nm_live_` prefix. Test/production scope comes from the key's configured environment, not a `nm_live_` or `nm_live_` prefix. Keep the entire key secret. Store it server-side and send it as `Authorization: Bearer <key>` to supported gateway endpoints.

## Create and use

1. Select the project and environment.
2. Create a named key with the scopes, limits and optional member attribution offered by the form.
3. Copy the secret at creation time and store it in your secret manager.
4. Use the gateway URL for inference; a key does not grant unrestricted management access.
5. Revoke credentials you no longer need and verify rejection against your deployed gateway. No fixed cross-instance revocation latency is promised.

Keys are stored as hashes rather than recoverable plaintext. If the secret is lost, issue a replacement and revoke the old key.

For machine capability allowlists and partner token operations, see [Project Service Tokens](/developer-portal/projects/service-tokens). See [application authentication](/api/authentication) and [first request](/get-started/first-request).
