# CLI troubleshooting

Run `naagmani help` or `naagmani platform help` to confirm the commands supported by your installed version. Plugin commands use the singular `plugin` namespace.

Check `NAAGMANI_CLOUD_URL` and `NAAGMANI_OS_URL` when targeting a custom installation. Use a credential accepted by the endpoint. For local password login, see [CLI authentication](/build/cli/authentication); the current login command is not an Accounts browser/device flow.

Use `naagmani logout` to remove stored CLI credentials rather than deleting arbitrary configuration files. Back up configuration before changing it.

See [CLI diagnostics](/build/cli/troubleshooting) and [platform troubleshooting](/deployment/troubleshooting).
