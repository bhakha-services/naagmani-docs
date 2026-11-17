# Governance policies and privacy plugins

Open **Projects → your project → Governance** to manage project policy rules. Policies can match models, providers, plugins, capabilities, tools, environments and principals. Depending on the rule, they can allow/deny execution or constrain agent steps and tool calls.

## Manage a policy

1. Select the project and environment.
2. Create a named rule with a scope, priority, effect and matching criteria.
3. Save it with an account that has the required policy-management permission and entitlement.
4. Use policy simulation to inspect representative decisions before depending on the rule in production.

## Privacy and content inspection

PII detection, reversible tokenization, masking, prompt inspection and content moderation depend on specific plugins and their configured capabilities. Governance policy management does not itself install or enable a universal detector.

Inspect the plugin's manifest and documentation, configure it for your installation, and test both permitted and denied cases. Do not assume complete PII coverage or a built-in High/Medium/Low injection-sensitivity control.

See [plugins](/developer-portal/capabilities/plugins), [MCP policies](/developer-portal/governance-routing/mcp-policies), [data protection](/security/data-protection) and [audit logs](/security/audit-logs).
