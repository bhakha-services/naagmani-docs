# Plugin CLI workflows

The command namespace is singular: `naagmani plugin`. Check `naagmani plugin help` for the commands in your installed version.

## Create and validate

Place flags before the positional plugin name/directory for these commands:

```bash
naagmani plugin create --language node example-plugin
naagmani plugin validate ./example-plugin
naagmani plugin build --os linux --arch amd64 ./example-plugin
naagmani plugin package --os linux --arch amd64 ./example-plugin
```

Scaffolding supports Go, Node.js and Python. Validation checks the manifest; it is not a complete runtime/security test. Test your implementation using its language's test tooling and the actual gateway hook path.

## Publish

```bash
naagmani plugin publish ./example-plugin
```

This requires publisher permissions and control-plane credentials. Use [publishing](/build/hdks/publishing) for the supported flags. Do not use a gateway API key as an unrestricted publisher credential.

## Install from a catalog

The marketplace installer accepts the artifact name first, followed by its options:

```bash
naagmani marketplace install <artifact-name> --project <project-id> --env <environment-id>
```

Use real IDs and an artifact/version available to your organization. The portal's install form is another way to select the intended project/environment. The separate `plugin install`/`update` commands use desired-version management options; they do not accept the same flags as the marketplace installer.

## Inspect and maintain

Commands include `plugin list`, `versions`, `info`, `health`, `metrics`, `update` and `rollback`. Inspect their help before acting. Rollback/version selection does not guarantee compatibility with configuration or stored data.

See [plugin testing](/build/hdks/testing), [marketplace installation](/marketplace/installation) and [CLI authentication](/build/cli/authentication).
