# Install marketplace artifacts

Open **Marketplace** in the portal, choose an artifact offered by your deployment and inspect its details before installation. Select the intended organization, project and environment in the install workflow.

## Before enabling

Review publisher/version details, the manifest, requested permissions/capabilities, dependencies and required entitlements. An available catalog entry is not proof of a security scan or safe code. Run only extensions you trust.

Installation scope and runtime authorization are separate: installing an artifact does not grant a user extra permissions or ensure every hook will execute. Confirm the extension is assigned/enabled for the intended environment and inspect its runtime status.

For offline installations, pre-stage packages and dependencies. Catalog access, downloads and remote plugin services may require network connectivity.

For CLI-based installation, use the supported singular `naagmani plugin` or `naagmani marketplace` commands described in [CLI workflows](/build/cli/plugins). See [discovery](/marketplace/discover), [plugin lifecycle](/build/hdks/lifecycle) and [security boundaries](/security/isolation).
