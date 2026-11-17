# Offline licensing

Obtain a signed JSON license from Accounts on a connected workstation, bound to the target installation ID. Transfer it and the issuer's public verification key through your approved process. The private signing key must remain with the issuer.

On the isolated installation, import the artifact using the local **License & Sync** page. For file-based startup configuration, mount the license and set `NAAGMANI_LICENSE_PATH` to its OS-container path. `NAAGMANI_LICENSE_DATA` accepts inline JSON and takes precedence.

The OS performs the actual signature, installation-ID and expiry checks. Keep its data volume and identity persistent, and maintain an accurate host clock. There is no fixed 14-day grace guarantee.

The CLI's `platform license verify` command inspects the JSON envelope; do not treat that output as cryptographic acceptance by the runtime. Local OS acceptance and reported entitlement state are authoritative. Older CLI activation/registration workflows may write a different environment field; use the supported local import or runtime configuration above.

Offline licenses do not make remote model services available without a network. See [offline deployment](/deploy/offline) and [licensing overview](/licensing/overview).
