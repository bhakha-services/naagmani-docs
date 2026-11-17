# Self-hosted licensing and billing verification — 2026-11-17

Internal test record. All writes used local disposable Accounts and installation databases. No production subscription, live payment gateway, production signing key or production customer was modified.

## Result

Accounts issuance → account-owned license inventory → browser download → self-hosted browser upload → local verification passed. Both the connected and network-isolated installations accepted Accounts-issued artifacts. Local expiry, renewal, restart persistence, signature checks, installation binding, authentication and stale-artifact rejection passed.

Automatic Accounts pairing and background license download are **not implemented** by this self-hosted deployment. The previous screen advertised them, called an unauthenticated vendor endpoint, fell back to local registration, and could report success without receiving a signed artifact. That misleading flow was replaced with the working Accounts download/import process. Refresh Status reads the local verifier and is labeled accordingly.

## Fixed findings

| Finding | Change |
| --- | --- |
| Billing and connection links pointed at `console.naagmani.com/connect` or used `tab=license` | Node licenses open Accounts `/billing?tab=licenses`; published default is `https://accounts.naagmani.com`. Its public billing page returned HTTP 200 during the read-only probe. |
| Distributed image links relied on baked local Accounts URLs | `/api/billing/config` resolves `ACCOUNTS_WEB_URL` at runtime; Compose/installers pass it explicitly. Distributed Docker default points to Accounts. |
| Invalid cloud sync could claim success and remember that claim in localStorage | Removed unsupported pairing/local-registration fallback and query-parameter activation. Only the OS apply response produces activation success. |
| Entitlement fetch errors and stale installation edition could display active paid features | No synthetic active entitlement fallback; UI reports actual verifier state and clears unavailable state. |
| Self-hosted links sent a local organization ID as an Accounts billing account | Self-hosted links let Accounts resolve the signed-in owner's billing account. |
| Login lost the requested Node Licenses tab | Accounts retains `/billing?tab=licenses` through `return_to`. Browser sign-in returned to the correct tab. |
| Subscription-bound paid artifacts appeared as Standard licenses | Accounts recognizes signed billing-account/subscription metadata and displays Paid license. |

The signed artifact, signature and key selector remain unchanged on export. Private signing keys remain in the issuer service; gateways received only a disposable test issuer's public verification key.

## Local interfaces and evidence

- Connected portal: `http://localhost:13501/billing`.
- Disposable Accounts: `http://localhost:13303/billing?tab=licenses`; API `http://localhost:19383`.
- No-egress Compose project: `naagmani-air-verify-20261117`. Its `internal: true` network has no default route; a request to 1.1.1.1 failed with network unreachable after the final restart. Client probes ran inside its developer container because Docker Desktop did not expose usable host ports on that internal network.
- Harnesses and JSON evidence: `E:/project/naagmani-project/tmp/licensing-flow-20261117/`.
- Screenshots: `output/playwright/accounts-issued-licenses.png`, `output/playwright/self-hosted-verified-license.png`.
- Test credentials are in `fixture-private.json`; retain that file privately. Signed fixtures are `connected-license-renewed.json` and `air-license-renewed.json`.

## Runtime checks — 19 passing scenario groups

`prepare.cjs` / `accounts-results.json` (6): new Accounts customer and one owned billing account; unpaid provisioning rejection; settled-payment fixture provisioning with subscription-bound expiry and idempotency; independent air-gapped test issuance; owned inventory and forbidden customer minting/cross-account access; cancel-at-period-end and reactivation without changing validity.

`runtime.cjs` / `runtime-results.json` (8): connected paid license acceptance; Accounts-issued air-gapped license acceptance; both installations reject wrong-installation, malformed and tampered artifacts while retaining the current license; expired artifact rejection; actual five-second offline expiry with paid capability removal without restart; offline renewal and typed-limit restoration; subscription-aware paid extension with matching subscription expiry and idempotency; revocation inventory status without affecting another installation.

`persistence.cjs` / `persistence-results.json` (5): connected and air-gapped renewals survive OS/API/portal restart; both reject unauthenticated import; offline verifier rejects replay of an older unexpired artifact after renewal.

Browser: signed in to the disposable Accounts customer, downloaded its active `.lic` file, uploaded that exact file on port 13501 and observed “Signed license verified and activated locally.” Verified Accounts link destination, sign-in return to Node Licenses, Paid license labeling, matching IDs and expiries.

## Automated checks

- Developer Portal: **283/283** tests passed against the designated integration API `http://127.0.0.1:19481`, with `NEXT_PUBLIC_DEPLOYMENT_MODE=cloud` and private mode unset so each mode-specific test can configure its own mode. Initial default test invocation used an unavailable API/default self-hosted mode; rerunning with the intended test environment resolved those setup failures.
- Accounts web: **4/4** license export/label/return-link tests passed.
- Accounts API Go packages: license, fulfillment, HTTP billing transport and subscription passed. HTTP signer tests require loopback access; the first sandboxed attempt could not synchronize keys, and the rerun with loopback access passed.
- OS entitlement Go package passed, covering signatures, expiry, persistence and rollback protection.
- Marketing installer configuration checks: **3/3** passed.
- Public documentation checks: **3/3** passed; 171 documents and 437 link references checked.
- Developer Portal and Accounts web production Docker builds passed including TypeScript.

Local images `naagmani-portal-licensing:local` and rebuilt `naagmani-local-billing-accountsweb:current` are running. Installation overrides are `tmp/install-verification-20261117/{connected-fixed,air-gapped}/licensing-override.json`; retain them when recreating the test stacks. Changes have not been published to GHCR or public installer URLs.

## Limits

Paid provisioning used a deliberately inserted **mock settled payment** in the disposable database; it did not run Cashfree/Razorpay checkout, recurring payment, bank settlement or a live card charge. Those provider flows are not certified by these tests.

An isolated verifier cannot learn about remote revocation immediately. Accounts inventory records revocation, but offline enforcement remains bounded by the signed artifact's validity and the operator's offline renewal/revocation procedure. Likewise, changing a subscription remotely does not replace an already imported artifact. The UI and public documentation now describe these boundaries explicitly.
