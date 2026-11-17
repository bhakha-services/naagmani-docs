import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../lib/env-urls.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
const siteConfig = { developerPortalUrl: 'https://portal.example.com', apiUrl: 'https://api.example.com', gatewayUrl: 'https://gateway.example.com', url: 'https://docs.example.com' };
vm.runInNewContext(compiled, { exports, require: () => ({ siteConfig }) });
const replace = exports.replaceEnvUrls;

test('installation commands preserve local portal, gateway and API ports', () => {
  const text = 'Portal http://localhost:3001; curl http://localhost:8080/v1/health; curl http://localhost:8081/health';
  assert.equal(replace(text), text);
});
test('explicit placeholders resolve to their documented services', () => {
  assert.equal(replace('{{DEVELOPER_PORTAL_URL}} {{API_BASE_URL}} {{CLOUD_URL}} {{GATEWAY_URL}} {{DOCS_URL}}'), 'https://portal.example.com https://api.example.com https://api.example.com https://gateway.example.com https://docs.example.com');
});
test('operator-supplied URLs and callback examples are not rewritten', () => {
  const text = 'http://localhost:3000/auth/callback https://private.example.com http://localhost:3002';
  assert.equal(replace(text), text);
});
