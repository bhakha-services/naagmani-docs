# Package and publish plugins

Validate and test the plugin before packaging it. Use the CLI's supported options and a target OS/architecture compatible with the runtime.

## Local package

```bash
naagmani plugin validate .
naagmani plugin package --os linux --arch amd64 --out dist .
```

This builds a package and checksum. Review the resulting manifest and contents. The current parser requires flags before the positional directory for this command.

## Publish

Publishing requires a reachable control plane and an authorized publisher identity. Configure the endpoint, token and organization using the supported CLI configuration, then run:

```bash
naagmani plugin publish .
```

Supported publish flags include `--cloud-url`, `--token`, `--org-id`, `--os`, `--arch` and `--release-notes`, placed before the directory. The current CLI does not implement `--visibility` as a publish flag.

Catalog publication, review, release authorization and artifact integrity are separate checks. Do not assume a package upload receives hardware-backed certification, automatic malware scanning or universal public publication. Follow the publisher workflow offered by your deployment and verify the artifact's available status before installation.

See [publisher portal](/marketplace/publishing), [installation](/marketplace/installation) and [CLI workflows](/build/cli/plugins).
