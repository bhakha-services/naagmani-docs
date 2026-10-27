# Self-hosted ownership and offline licensing

The local control-plane and Developer Portal belong to the customer. Accounts
owns commercial purchase, renewal and signed-license download. Local portal users,
passwords, memberships, project roles, customer members, budgets and runtime
content are not a central Accounts user directory.

## Authentication

Set `NAAGMANI_DEPLOYMENT_MODE=self_hosted` on the local Cloud service and
`NEXT_PUBLIC_DEPLOYMENT_MODE=self_hosted` on the Developer Portal build/runtime.
Set the portal server's `CLOUD_API_URL=http://cloud:8080` (use the actual Compose
service name). Browser API URLs must be reachable from the user's browser; Docker
service names are not public browser hostnames. NEXT_PUBLIC values are compiled
at build time; changing only runtime environment does not rewrite browser bundles.

The self-hosted login screen uses local credentials and HttpOnly session cookies.
Refresh/logout use the local Cloud, not Accounts. For an HTTP intranet deployment,
local cookies are not marked Secure; use HTTPS for production protection.

The installation's operator has organization Owner/RBAC permissions, not vendor
Super Admin privileges. Accounts JWTs do not authenticate into local self-hosted
Cloud. Managed Cloud continues to use Accounts SSO. The old `is_system_admin`
API/storage name is a compatibility field, not permission to bypass customer isolation.

## Offline license

Obtain a signed license in Accounts from a connected workstation, using the local
installation ID, then transfer/import it locally. The supported artifact is a
signed **JSON envelope** containing `payload` and `signature`, not an arbitrary
JWT string. OS accepts `NAAGMANI_LICENSE_DATA` (inline signed JSON) or
`NAAGMANI_LICENSE_PATH` (container file path). Inline configuration takes precedence.

The default persistent import location is `license.json` inside OS's configured
data directory. Keep that directory on a persistent volume and preserve the
installation ID across restarts/redeployments. A signed license for a different
installation must be rejected.

Local license import verifies the signature and stale-version rules, saves the
valid artifact before applying it, and preserves the previous artifact/state on
failed import. Paid feature and limit reads check expiry locally without phone-home.
Importing a license is a local write operation; it is not a vendor request.

Actual access requires **license capability AND local RBAC permission**. The
one-organization limit is not imposed by this change. Expiry does not delete data.

## Network disclosure and limitations

Offline auth/license verification do not need Accounts connectivity. Image pulls,
remote AI providers, remote plugins and manually selected connect/update actions
can still need a network. Pre-stage images/artifacts and use local model providers
for an air-gapped deployment. Existing connected registration uses POST; do not
use it when runtime vendor egress is forbidden.

No new heartbeat or automatic 24-hour check-in is enabled by this implementation.
A future optional GET-only feed/check-in requires a separate privacy contract.
GET does not mean zero disclosure: source IP/time reach the recipient, and an
identified heartbeat necessarily discloses an installation reference. No offline
installation can receive urgent notices or immediate vendor revocation.

Do not expose local control-plane ports to the vendor or assume vendor Super Admin
has local authority. Managed fleet telemetry/commands are a separate product profile.
Full zero-egress certification requires the runtime smoke/packet-capture release
gate; local unit tests alone do not establish it.

## Production machine key and upgrades

OS production startup requires `NAAGMANI_SYSTEM_KEY` in the format `nm_live_`
followed by 48 random hexadecimal characters (24 random bytes). The local API
must use the identical key. The public installers generate it for a new install;
manual Compose setups must supply it explicitly. The known development zero key
is rejected. This is a machine service credential, not a local human Super Admin.

Back up the database, license and installation identity before upgrading. An old
installer configuration missing a secure key stops with an explanation instead
of silently rotating the key. Coordinate the replacement on OS and local API;
keep valid existing keys unchanged. Never put the private license signing seed
in either service, an installer, a container image or a public repository.

Configure `NAAGMANI_LICENSE_PUBLIC_KEY` explicitly for the license issuer. Legacy
keys are not added automatically. Before replacing trust, obtain the replacement
signed license, verify its installation ID and expiry, and stage its import with
the verifier upgrade. Keep the previous license until replacement acceptance is
verified. Do not restore a publicly known signing seed during rollback.
