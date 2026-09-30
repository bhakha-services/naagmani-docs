const fs = require('fs');
const path = require('path');

const docsDir = path.resolve(__dirname, '..', 'docs');
const scriptsDir = path.resolve(__dirname);

function walkDir(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (entry.isFile()) {
      callback(fullPath);
    }
  }
}

function sanitizeContent(content) {
  let updated = content;

  // 1. Double bracket/parenthesis patterns like:
  // **Credential Pools** ([http://localhost:3000/credentials](http://localhost:3000/credentials))
  // -> [**Credential Pools**]({{DEVELOPER_PORTAL_URL}}/credentials)
  updated = updated.replace(
    /\*\*([A-Za-z0-9\s&]+)\*\*\s*\(\[http:\/\/localhost:3000(\/[a-zA-Z0-9_\-\/]+)\]\(http:\/\/localhost:3000\2\)\)/g,
    '[**$1**]({{DEVELOPER_PORTAL_URL}}$2)'
  );

  // When an administrator updates plugin settings in the Developer Portal ([http://localhost:3000/plugins](http://localhost:3000/plugins))
  updated = updated.replace(
    /\(\[http:\/\/localhost:3000(\/[a-zA-Z0-9_\-\/]+)\]\(http:\/\/localhost:3000\1\)\)/g,
    '([{{DEVELOPER_PORTAL_URL}}$1]({{DEVELOPER_PORTAL_URL}}$1))'
  );

  // 1. Navigate to **Providers** in the Developer Portal ([http://localhost:3000/providers](http://localhost:3000/providers))
  updated = updated.replace(
    /Navigate to \*\*([A-Za-z0-9\s&]+)\*\* in the Developer Portal \(\[http:\/\/localhost:3000(\/[a-zA-Z0-9_\-\/]+)\]\(http:\/\/localhost:3000\2\)\)/g,
    'Navigate to [**$1**]({{DEVELOPER_PORTAL_URL}}$2) in the Developer Portal'
  );

  // 2. Direct markdown links with http://localhost:3000
  // e.g. [http://localhost:3000/attempts](http://localhost:3000/attempts)
  updated = updated.replace(
    /\[http:\/\/localhost:3000(\/[^\]]*)\]\(http:\/\/localhost:3000\1\)/g,
    '[{{DEVELOPER_PORTAL_URL}}$1]({{DEVELOPER_PORTAL_URL}}$1)'
  );
  updated = updated.replace(
    /\[http:\/\/localhost:3000\]\(http:\/\/localhost:3000\)/g,
    '[{{DEVELOPER_PORTAL_URL}}]({{DEVELOPER_PORTAL_URL}})'
  );

  // 3. Any other [http://localhost:3000/path](...) or [Text](http://localhost:3000/path)
  updated = updated.replace(
    /\(http:\/\/localhost:3000(\/[^\)]*)\)/g,
    '({{DEVELOPER_PORTAL_URL}}$1)'
  );
  updated = updated.replace(
    /\(http:\/\/localhost:3000\)/g,
    '({{DEVELOPER_PORTAL_URL}})'
  );

  // 4. Quickstart overview local / hosted line
  updated = updated.replace(
    /\(Local:\s*`http:\/\/localhost:3000`,\s*Hosted:\s*`https:\/\/developer\.naagmani\.app`\)/g,
    '([{{DEVELOPER_PORTAL_URL}}]({{DEVELOPER_PORTAL_URL}}))'
  );
  updated = updated.replace(
    /at \[http:\/\/localhost:3000\]\(http:\/\/localhost:3000\) or \[https:\/\/developer\.naagmani\.app\]\(https:\/\/developer\.naagmani\.app\)/g,
    'at [{{DEVELOPER_PORTAL_URL}}]({{DEVELOPER_PORTAL_URL}})'
  );
  updated = updated.replace(
    /- \*\*Local Development URL\*\*:\s*\[http:\/\/localhost:3000\]\(http:\/\/localhost:3000\)\s*\n\s*- \*\*Production Hosted URL\*\*:\s*\[https:\/\/developer\.naagmani\.app\]\(https:\/\/developer\.naagmani\.app\)/g,
    '- **Developer Portal Console**: [{{DEVELOPER_PORTAL_URL}}]({{DEVELOPER_PORTAL_URL}})'
  );
  updated = updated.replace(
    /\(`http:\/\/localhost:3000` or Cloud\)/g,
    '([{{DEVELOPER_PORTAL_URL}}]({{DEVELOPER_PORTAL_URL}}))'
  );

  // 5. Gateway port 8080 replacements
  updated = updated.replace(
    /http:\/\/localhost:8080\/v1/g,
    '{{GATEWAY_URL}}/v1'
  );
  updated = updated.replace(
    /http:\/\/localhost:8080/g,
    '{{GATEWAY_URL}}'
  );

  // 6. API port 8081 replacements
  updated = updated.replace(
    /http:\/\/localhost:8081\/v1/g,
    '{{API_BASE_URL}}/v1'
  );
  updated = updated.replace(
    /http:\/\/localhost:8081/g,
    '{{API_BASE_URL}}'
  );

  // 7. Docs port 3001 replacements
  updated = updated.replace(
    /http:\/\/localhost:3001/g,
    '{{DOCS_URL}}'
  );

  // 8. Clean comments like `// or https://gateway.naagmani.app/v1` or `// or https://api.naagmani.app`
  updated = updated.replace(
    /\s*\/\/\s*or\s*https:\/\/gateway\.naagmani\.app\/v1/g,
    ''
  );
  updated = updated.replace(
    /\s*#\s*or\s*https:\/\/gateway\.naagmani\.app\/v1/g,
    ''
  );
  updated = updated.replace(
    /\s*#\s*or\s*https:\/\/api\.naagmani\.app/g,
    ''
  );

  // 9. Old domain cleanup if still lingering
  updated = updated.replace(
    /https:\/\/developer\.naagmani\.app/g,
    '{{DEVELOPER_PORTAL_URL}}'
  );

  return updated;
}

// Process all markdown files in docs/
let changedCount = 0;
walkDir(docsDir, (filePath) => {
  if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
    const original = fs.readFileSync(filePath, 'utf8');
    const updated = sanitizeContent(original);
    if (original !== updated) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`[Docs updated] ${path.relative(docsDir, filePath)}`);
      changedCount++;
    }
  }
});

// Process root project-service-tokens.md if exists
const rootDoc = path.resolve(__dirname, '..', 'project-service-tokens.md');
if (fs.existsSync(rootDoc)) {
  const original = fs.readFileSync(rootDoc, 'utf8');
  const updated = sanitizeContent(original);
  if (original !== updated) {
    fs.writeFileSync(rootDoc, updated, 'utf8');
    console.log('[Root doc updated] project-service-tokens.md');
  }
}

// Process scripts in scriptsDir
walkDir(scriptsDir, (filePath) => {
  if (filePath.endsWith('.js') && !filePath.endsWith('sanitize_env_urls.js')) {
    const original = fs.readFileSync(filePath, 'utf8');
    const updated = sanitizeContent(original);
    if (original !== updated) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`[Script updated] ${path.relative(scriptsDir, filePath)}`);
    }
  }
});

console.log(`Finished sanitization! Total docs updated: ${changedCount}`);
