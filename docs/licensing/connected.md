# Connected registration and license renewal

Self-hosted installations can authenticate users and validate an already imported license without a vendor connection. Connected registration is an explicit management operation, separate from local login.

Registration associates an installation reference with an organization on the selected control plane. Use it only when that endpoint is reachable and your deployment supports the required management authorization. Do not assume a gateway API key or a Project Service Token can perform human organization-administration operations.

The existence of registration and heartbeat API endpoints does not establish an automatic background heartbeat, remote management agreement or license renewal schedule for every self-hosted installation. Configure only the connected behavior you intend to use.

For renewal, obtain the new signed JSON license from Accounts and import it locally. Do not assume that renewing a subscription automatically replaces an offline installation's artifact. Check the local installation ID and expiry after import.

Registration/telemetry can disclose installation identifiers, version and configuration metadata in addition to network source information. Review the configured operation's payload; it is not a zero-disclosure connection.

See [license import](/licensing/overview), [offline licensing](/licensing/air-gapped) and [network boundaries](/deployment/self-hosted-boundaries).
