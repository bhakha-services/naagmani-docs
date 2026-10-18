import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const navFile = path.join(rootDir, 'lib', 'navigation.ts');

console.log('================================================================================');
console.log('🔍 NAAGMANI DOCUMENTATION QUALITY GATE & LINK INTEGRITY AUDIT');
console.log('================================================================================\n');

let totalErrors = 0;
let totalCheckedFiles = 0;
let totalCheckedLinks = 0;
let totalCheckedNavItems = 0;

// Helper to check if a doc path exists
function resolveDocTarget(targetPath, sourceFile) {
  // Clean off anchors and query params
  const cleanTarget = targetPath.split('#')[0].split('?')[0].trim();
  if (!cleanTarget) return true; // Just an anchor on same page

  let candidate = '';
  if (cleanTarget.startsWith('/docs/')) {
    const rel = cleanTarget.replace('/docs/', '');
    candidate = path.join(docsDir, rel);
  } else if (cleanTarget.startsWith('/')) {
    const rel = cleanTarget.replace(/^\//, '');
    const docCandidate = path.join(docsDir, rel);
    if (
      fs.existsSync(docCandidate) ||
      fs.existsSync(docCandidate + '.md') ||
      fs.existsSync(docCandidate + '.mdx') ||
      fs.existsSync(path.join(docCandidate, 'index.md')) ||
      fs.existsSync(path.join(docCandidate, 'index.mdx'))
    ) {
      candidate = docCandidate;
    } else {
      const appPage = path.join(rootDir, 'app', cleanTarget, 'page.tsx');
      if (fs.existsSync(appPage)) return true;
      candidate = docCandidate;
    }
  } else if (cleanTarget.startsWith('file:///')) {
    // Local workspace link: strip scheme and normalize
    let localPath = cleanTarget.replace('file:///', '');
    // Handle Windows drive paths like e:/... or E:/...
    localPath = decodeURIComponent(localPath);
    return fs.existsSync(localPath);
  } else {
    // Relative link
    const sourceDir = path.dirname(sourceFile);
    candidate = path.resolve(sourceDir, cleanTarget);
  }

  // Check candidate variations: exact, .md, .mdx, /index.md
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return true;
  if (fs.existsSync(candidate + '.md')) return true;
  if (fs.existsSync(candidate + '.mdx')) return true;
  if (fs.existsSync(path.join(candidate, 'index.md'))) return true;
  if (fs.existsSync(path.join(candidate, 'index.mdx'))) return true;

  return false;
}

// 1. Navigation Consistency Audit
console.log('--- 1. AUDITING NAVIGATION SIDEBAR ENTRIES ---');
if (fs.existsSync(navFile)) {
  const navContent = fs.readFileSync(navFile, 'utf8');
  const hrefRegex = /href:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = hrefRegex.exec(navContent)) !== null) {
    const href = match[1];
    totalCheckedNavItems++;
    if (!resolveDocTarget(href, navFile)) {
      console.error(`❌ Broken Navigation Entry: ${href}`);
      totalErrors++;
    }
  }
  console.log(`✓ Audited ${totalCheckedNavItems} navigation items.\n`);
} else {
  console.error(`❌ Navigation file not found at: ${navFile}`);
  totalErrors++;
}

// 2. Recursive Markdown & MDX Audit
console.log('--- 2. AUDITING MARKDOWN FILES, FRONTMATTER & LINKS ---');
function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const docFiles = walkDir(docsDir);

for (const filePath of docFiles) {
  totalCheckedFiles++;
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(rootDir, filePath);

  // Check unclosed code fences
  const codeBlockMatches = content.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    console.error(`❌ Unmatched code fence in: ${relPath}`);
    totalErrors++;
  }

  // Check markdown links: [text](link)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const rawTarget = match[2].trim();
    totalCheckedLinks++;

    // Skip external http, https, mailto, anchor, and portal template variables
    if (
      rawTarget.startsWith('http://') ||
      rawTarget.startsWith('https://') ||
      rawTarget.startsWith('mailto:') ||
      rawTarget.startsWith('#') ||
      rawTarget.startsWith('{{')
    ) {
      continue;
    }


    if (!resolveDocTarget(rawTarget, filePath)) {
      console.error(`❌ Broken internal link in ${relPath}: [${match[1]}] -> ${rawTarget}`);
      totalErrors++;
    }
  }
}

console.log(`✓ Audited ${totalCheckedFiles} markdown documents.`);
console.log(`✓ Verified ${totalCheckedLinks} link references.`);

console.log('\n================================================================================');
if (totalErrors === 0) {
  console.log('🎉 DOCUMENTATION QUALITY AUDIT PASSED: ZERO BROKEN LINKS OR NAVIGATION ERRORS!');
  console.log('================================================================================');
  process.exit(0);
} else {
  console.error(`💥 DOCUMENTATION AUDIT FAILED: ${totalErrors} ERRORS DETECTED!`);
  console.log('================================================================================');
  process.exit(1);
}
