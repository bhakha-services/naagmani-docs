const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..', 'docs');

function updateDoc(relPath, transform) {
  const fullPath = path.join(baseDir, relPath);
  if (fs.existsSync(fullPath)) {
    const original = fs.readFileSync(fullPath, 'utf8');
    const updated = transform(original);
    fs.writeFileSync(fullPath, updated, 'utf8');
    console.log(`[OK] Updated ${relPath}`);
  }
}

// 1. docs/concepts/environments.md
fs.writeFileSync(path.join(baseDir, 'concepts/environments.md'), `# Environments & Isolation

An **Environment** is an isolated deployment stage within a Project. Naagmani provides native two-tier environment isolation: **Test** and **Production**.

\`\`\`mermaid
graph LR
    subgraph Test["Test Environment (Sandbox)"]
        TestToken["nst_live_... (Test Env)"] --> TestModel["gpt-4o-mini / Synthetic Data"]
    end
    subgraph Prod["Production Environment"]
        ProdToken["nst_live_... (Prod Env)"] --> ProdModel["gpt-4o + Fallback Cascade"]
    end
\`\`\`

---

## Two-Tier Environment Architecture

Naagmani consolidates workloads into two distinct, cryptographically isolated tiers:

| Environment | Purpose | Credential Scope | Model Strategy |
| :--- | :--- | :--- | :--- |
| **Test** (\`test\`) | Local development, automated CI pipelines, and pre-release integration tests. | Sandboxed Test Service Tokens | Cost-effective models, mocks, and rate-limited test pools. |
| **Production** (\`production\`) | Live customer-facing applications and mission-critical production traffic. | Production Service Tokens | High-availability fallback cascades, dedicated credential pools, strict DLP. |

---

## Environment Isolation Guarantees

1. **Secret & Key Isolation**: Service tokens and credentials issued for the \`test\` environment are strictly rejected in \`production\`.
2. **Dedicated Routing Rules**: Use inexpensive, fast models in Test while enforcing strict high-availability fallback cascades and circuit breakers in Production.
3. **Telemetry & Quota Tagging**: Usage analytics, provider attempts, and audit logs are partitioned by environment, enabling clear cost segregation between testing and live operations.

---

## Managing Environments in the Developer Portal

- In the Developer Portal, the active environment is selectable from the top navigation and project sidebar.
- When generating **Project Service Tokens** or **API Keys**, you must explicitly bind the token to its target environment (\`Test\` or \`Production\`).

---

## Next Steps

- Learn about API keys: [API Keys & Vault](/docs/concepts/api-keys)
- Learn about service tokens: [Project Service Tokens](/docs/concepts/project-service-tokens)
`.trim() + '\n', 'utf8');

// 2. docs/concepts/projects.md
fs.writeFileSync(path.join(baseDir, 'concepts/projects.md'), `# Projects & Workloads

A **Project** is an isolated workspace within an Organization dedicated to a specific application, microservice, or AI initiative.

\`\`\`mermaid
graph TD
    Project["Project: Customer Support AI"]
    Project --> Env1["Test Environment"]
    Project --> Env2["Production Environment"]
    Project --> Agents["Autonomous Agents"]
    Project --> Tools["Registered Tools & MCP Servers"]
    Project --> ST["Project Service Tokens"]
\`\`\`

---

## Why Use Projects?

Projects enforce strict resource and credential isolation between different workloads:
- **Credential Segregation**: API Keys and Service Tokens created in *Project A* cannot access models or resources in *Project B*.
- **Autonomous Agents**: Agents, prompt templates, skills, and MCP tools are scoped to the project.
- **Budget Allocation**: Assign specific monthly budgets to individual projects to prevent runaway costs from affecting other teams.

---

## Project Structure

Every Project contains:
- **Environments**: Two-tier isolation stages (\`Test\` and \`Production\`).
- **Service Tokens**: Machine-to-machine credentials scoped to the project and environment.
- **Routing Policies**: Custom fallback cascades and latency/cost optimization rules.
- **Agent Ecosystem**: Autonomous agents, tools, skills, and MCP server integrations.

---

## Managing in the Developer Portal

1. Navigate to the **Projects** list at [http://localhost:3000/projects](http://localhost:3000/projects).
2. Click **+ Create Project** to initialize a new workspace.
3. Select any project to view its dedicated dashboard, service tokens, agents, and analytics.

---

## Next Steps

- Understand environment boundaries: [Environments & Isolation](/docs/concepts/environments)
- Issue project credentials: [Project Service Tokens](/docs/concepts/project-service-tokens)
`.trim() + '\n', 'utf8');

// 3. docs/introduction/what-is-naagmani.md
updateDoc('introduction/what-is-naagmani.md', (content) => {
  return content.replace(
    /3\. \*\*Environment\*\*: Deployment stages within a project \(e\.g\. \*Development\*, \*Staging\*, \*Production\*\)/g,
    '3. **Environment**: Deployment stages within a project (*Test* and *Production*)'
  );
});

// 4. docs/introduction/concepts.md
updateDoc('introduction/concepts.md', (content) => {
  return content
    .replace(/P1 --> E1\["Development Environment"\]\s+P1 --> E2\["Staging Environment"\]\s+P1 --> E3\["Production Environment"\]/g, 'P1 --> E1["Test Environment"]\n    P1 --> E2["Production Environment"]')
    .replace(/An execution boundary inside a project \(e\.g\. `Development`, `Staging`, `Production`\)/g, 'An execution boundary inside a project (`Test` and `Production`)');
});

// 5. docs/developer-portal/service-tokens.md
updateDoc('developer-portal/service-tokens.md', (content) => {
  return content.replace(/Select `Development`, `Staging`, or `Production`\./g, 'Select `Test` or `Production`.');
});

// 6. docs/security/isolation.md
updateDoc('security/isolation.md', (content) => {
  return content.replace(/between `development`, `staging`, and `production`\./g, 'between `test` and `production`.');
});

// 7. docs/marketplace/installing-plugins.md
updateDoc('marketplace/installing-plugins.md', (content) => {
  return content.replace(/Select the target Environment \(`production`, `staging`, or `development`\)\./g, 'Select the target Environment (`production` or `test`).');
});

// 8. docs/features/service-tokens.md
if (fs.existsSync(path.join(baseDir, 'features/service-tokens.md'))) {
  updateDoc('features/service-tokens.md', (content) => {
    return content.replace(/Development \/ Staging \/ Production/g, 'Test / Production');
  });
}

// 9. docs/concepts/models.md
updateDoc('concepts/models.md', (content) => {
  return content.replace(/Route `smart-tier` to an inexpensive model in Development and the premier flagship model in Production\./g, 'Route `smart-tier` to an inexpensive model in Test and the premier flagship model in Production.');
});

console.log('Finished updating environment tiers to Test & Production across all documentation!');
