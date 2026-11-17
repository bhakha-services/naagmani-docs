# CLI commands

Run `naagmani help` and the relevant command's help for the flags supported by your installed version.

| Command | Purpose |
| --- | --- |
| `naagmani version` | Show CLI version |
| `naagmani doctor` | Check development/runtime prerequisites |
| `naagmani login`, `logout`, `whoami` | Local login, local credential removal and identity inspection |
| `naagmani init` | Create project configuration |
| `naagmani config` | Inspect or update CLI configuration |
| `naagmani platform help` | List platform lifecycle commands |
| `naagmani plugin help` | List plugin development and lifecycle commands |
| `naagmani marketplace help` | List catalog search and installation commands |

## Platform operations

The platform command includes `install`, `start`, `stop`, `restart`, `status`, `logs`, `doctor`, `update`, `rollback`, `recovery`, `backup`, `restore`, `uninstall`, `register` and `license`.

```bash
naagmani platform help
naagmani platform status --dir ./naagmani --json
naagmani platform logs --dir ./naagmani --service os -f
```

Platform subcommands act on their own installation configuration. Do not mix CLI-generated and shell-generated state files without checking compatibility. Back up before updates or recovery. Container recreation and database restore can interrupt service; zero downtime is not guaranteed.

## Plugins

Supported plugin commands include `create`, `validate`, `dev`, `build`, `package`, `publish`, `install`, `list`, `versions`, `update`, `rollback`, `info`, `health` and `metrics`.

```bash
naagmani plugin create --language go example-plugin
naagmani plugin validate .
```

Language choices for scaffolding are `go`, `node` and `python`. Publishing and catalog operations require a reachable service and permissions; local build/validation are separate from publication.

See [CLI installation](/build/cli/installation), [authentication](/build/cli/authentication) and [plugin development](/build/hdks/development).
