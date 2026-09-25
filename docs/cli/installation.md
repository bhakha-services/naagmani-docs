# CLI Installation & Setup

The **Naagmani CLI** (`naagmani`) is the unified command-line tool for developers to interact with projects, inspect attempt telemetry, test plugins locally, and manage cloud resources.

---

## Installation Methods

### Homebrew (macOS / Linux)
```bash
brew install naagmani/tap/naagmani
```

### Standalone Binary (Linux / macOS / Windows)

#### Linux / macOS (curl)
```bash
curl -fsSL https://get.naagmani.app/install.sh | bash
```

#### Windows (PowerShell)
```powershell
irm https://get.naagmani.app/install.ps1 | iex
```

### Via Go
```bash
go install github.com/naagmani/naagmani-cli/cmd/naagmani@latest
```

---

## Verify Installation

```bash
naagmani version
# Output:
# naagmani version 1.4.2 (built 2026-09-25)
# OS/Arch: darwin/arm64
```

---

## Shell Autocompletion

Enable tab autocompletion for your shell:

```bash
# Bash
naagmani completion bash > /etc/bash_completion.d/naagmani

# Zsh
naagmani completion zsh > "${fpath[1]}/_naagmani"

# Fish
naagmani completion fish > ~/.config/fish/completions/naagmani.fish
```

---

## Next Steps

- [CLI Authentication & Contexts](/docs/cli/authentication)
- [Commands Reference](/docs/cli/commands)
