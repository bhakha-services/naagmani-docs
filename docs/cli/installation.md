# CLI Installation & Setup

The **Naagmani CLI** (`naagmani`) is the unified command-line tool for developers to interact with projects, inspect attempt telemetry, test plugins locally, and manage cloud resources.

---

## Installation Methods

### 1-Command Installer (Linux / macOS / Windows)

#### Linux / macOS (curl)
```bash
curl -fsSL https://naagmani.com/install.sh | bash
```

#### Windows (PowerShell)
```powershell
irm https://naagmani.com/install.ps1 | iex
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

- [CLI Authentication & Contexts](/cli/authentication)
- [Commands Reference](/cli/commands)
