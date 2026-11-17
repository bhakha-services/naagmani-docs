# Self-hosted operation and network boundaries

A self-hosted installation runs its own portal, control-plane API, OS gateway, PostgreSQL and Redis. These services do not need the vendor Accounts service to authenticate local users or refresh their local sessions.

## Identity and access

Local users sign in with installation credentials. The initial owner manages the local organization through RBAC. That role is separate from vendor platform administration. Hosted deployments use Accounts login; their tokens are not local installation credentials.

Portal refresh credentials are stored in HttpOnly cookies. Access credentials are short-lived and can be renewed while a valid refresh session remains. Use HTTPS for browser access and configure email delivery if users need password-reset or verification messages.

## Licenses

Paid capabilities depend on a signed JSON license bound to your installation ID. The OS verifies it locally using the issuer's public key. Importing a license does not require an inbound vendor connection. Preserve the OS data volume, installation identity and verification key across restarts.

License capability and local user permission are both required for an operation. Expiry can restrict paid capabilities without deleting stored customer data. Renew and import the replacement before expiry.

## Network-dependent operations

Container downloads, updates, remote model providers, remote plugins and explicitly selected registration/sync operations may require network access. Local login and offline signature checks do not make the entire deployment zero-egress.

For an air-gapped deployment, pre-stage artifacts, use local providers, restrict egress and verify behavior in your environment. Offline installations cannot receive immediate vendor notices or revocation updates.

## Credentials and backups

Generate unique database credentials, encryption keys, session secrets and a private API-to-OS machine credential. Keep machine credentials separate from application API keys. Retain encryption keys with protected backups; losing a key can make encrypted data unreadable.

Before upgrading, back up databases, configuration, installation identity and licenses. Use compatible images and configuration from the same release.

See [installation](/deploy/installation), [offline setup](/deploy/offline) and [authentication](/security/authentication).
