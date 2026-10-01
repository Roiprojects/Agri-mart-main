const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(full);
    }
  });
  return results;
}

const files = getFiles('apps/frontend/src');
const badImports = [];
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const match = content.match(/from\s+['"]@\/lib\/(dev-db|store|catalogue-service|prisma|warehouse-assignment|commission-calculator|notification-service)['"]/);
  if (match) {
    badImports.push({ file: f, imported: match[1] });
  }
});

console.log('Files in apps/frontend with prohibited server imports:', badImports);
