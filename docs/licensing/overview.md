# Self-hosted licensing

A self-hosted installation uses a signed JSON license to enable paid capabilities and limits. Local login is independent of license issuance: users authenticate against their installation, not the vendor Accounts service.

## Obtain and import a license

1. Find the local installation ID in the portal's **License & Sync** page.
2. On a connected workstation, obtain the signed license for that installation ID from your billing account or administrator. Download issued files in [Accounts → Billing → Node Licenses](https://accounts.naagmani.com/billing?tab=licenses).
3. Import the JSON file through the local portal, or mount it in the OS container and configure `NAAGMANI_LICENSE_PATH`.
4. Check the local status for edition, enabled features, limits and expiry.

The artifact is a JSON envelope with `payload` and `signature`. The OS verifies its Ed25519 signature using the issuer's public key, checks installation binding and evaluates expiry. A payload object by itself, a subscription receipt or an arbitrary JWT is not a valid license.

## Persistence and renewal

Keep the OS data directory on persistent storage. Preserve installation identity, the verification public key and the accepted license across restarts. Import a renewed signed artifact before the existing one expires.

The portal's **Refresh Status** action reads the local verifier; it does not download a renewal or pair your installation with Accounts. Subscription renewal and local license import are separate steps. An isolated gateway cannot immediately learn about a remote revocation; enforce your offline renewal and revocation procedures accordingly.

Without an active paid license, the runtime uses its Free capabilities and limits. Do not assume a fixed 14-day grace period. Expiry restricts capabilities; it does not itself delete customer data. Applicable user permissions are still required even when a feature is licensed.

See [offline licensing](/licensing/air-gapped), [entitlements](/licensing/entitlements) and [connected registration](/licensing/connected).
