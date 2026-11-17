# Install the CLI

The CLI manages local platform operations and supported API workflows. It is separate from the five-service platform itself.

## npm distribution

With Node.js 18 or later, install the package named `naagmani`:

```bash
npm install -g naagmani
naagmani version
naagmani help
```

You can also invoke it without a global installation:

```bash
npx naagmani version
```

The npm launcher obtains the platform-specific CLI binary; the first run can require network access. Use a released package version available for your operating system and architecture.

The shell and PowerShell commands at `https://naagmani.com/install.sh` and `https://naagmani.com/install.ps1` install the platform and may offer CLI setup; they are not CLI-only installers. See [platform installation](/deploy/installation).

## Local platform installer

```bash
naagmani platform install --dir ./naagmani
```

The CLI installer differs from the interactive shell scripts: its portal port defaults to `3000` and control-plane port to `8081`. Use `--port-portal` and `--port-cloud` to override them. The shell script offers portal `3001` by default.

Supported install options include `--dir`, `--version`, `--channel`, `--env-file`, `--manifest`, `--dry-run`, `--no-start` and `--force`. Check the help of your installed CLI version before using flags. Supply a complete secure environment when using `--env-file`; it replaces generated environment content rather than merging individual values.

Do not assume that manifest presence guarantees image signatures or digests have been enforced. Select released image versions, review the generated configuration and verify service health.

See [authentication](/build/cli/authentication) and [commands](/build/cli/commands).
