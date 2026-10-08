# Discover & Search Capabilities

Browse, search, and inspect capability packages published to the Naagmani Marketplace catalog.

- **Portal Location**: `Organization > Marketplace` (`/marketplace`)

---

## Searching in Developer Portal

1. Navigate to **Organization > Marketplace** (`/marketplace`).
2. Filter by category:
   - **All Categories**
   - **Plugins & Pipeline Hooks**
   - **AI Agents & Assistants**
   - **Domain Skills**
   - **MCP Tools & Connectors**
3. Use the search bar to filter by keywords (e.g. `slack`, `dlp`, `postgres`, `github`).
4. Click on any card to view detailed metadata: author, version history, verified trust badge, declared permissions, and configuration options.

---

## Searching via Naagmani CLI

You can also search the catalog directly from your terminal:

```bash
naagmani marketplace search "postgres"
```

```text
Found 2 capabilities:
  • postgres-mcp-connector (v1.2.0) - Remote PostgreSQL MCP server connector with schema discovery
  • postgres-audit-logger (v0.9.1)  - Plugin hook that writes token usage events to PostgreSQL
```

---

## Related Documentation

- [Installation & Scope Isolation](file:///e:/project/naagmani-project/naagmani-docs/docs/marketplace/installation.md)
- [Publisher Portal](file:///e:/project/naagmani-project/naagmani-docs/docs/marketplace/publishing.md)
