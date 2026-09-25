const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const docsDir = path.resolve('docs');

// Helper to write a doc
function writeDoc(relPath, content) {
  const fullPath = path.join(docsDir, relPath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`Updated: ${relPath}`);
}

console.log('Writing comprehensive documentation pages...');
