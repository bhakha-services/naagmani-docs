# Versions and upgrades

Record the image references and configuration used by your deployment. CLI, portal, gateway, control-plane API and plugin versions can differ; select a compatible released set rather than assuming source changes are already available in a container tag.

Check release information and command help for your installed version. Test a new version with your configured providers, policies, plugins and data before relying on it in production. Back up databases, configuration, encryption keys, installation identity and licenses before upgrades.

Image tag changes do not automatically reverse database migrations. See [backup and recovery](/deployment/upgrades), [installation](/deploy/installation) and [plugin publishing](/build/hdks/publishing).
