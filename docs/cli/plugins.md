# CLI Plugin Management

Manage installed plugins, test harnesses, and marketplace discovery directly from the terminal.

---

## Searching Plugins

Search public marketplace plugins or internal private enterprise registry:

```bash
naagmani marketplace search "dlp"
```

Output:
```text
NAME                     VERSION   AUTHOR             VISIBILITY   DESCRIPTION
dlp-sanitizer            1.0.0     naagmani-official  public       Masks PII, credit cards, emails
ai-firewall              1.2.0     naagmani-official  public       Prompt injection defense
internal-rag-bridge      0.4.1     acme-corp          private      Acme enterprise knowledge RAG
```

---

## Installing & Registering Plugins

Install a plugin into your project:

```bash
naagmani marketplace install dlp-sanitizer@1.0.0
```

---

## Inspecting Plugin Versions & History

```bash
naagmani versions dlp-sanitizer
```

---

## Rolling Back a Version

In case of runtime anomalies:

```bash
naagmani rollback dlp-sanitizer@0.9.8 --env production
```
