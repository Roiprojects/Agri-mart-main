const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  let matches = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      matches = matches.concat(searchDir(full));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const text = fs.readFileSync(full, 'utf8');
      const lines = text.split('\n');
      lines.forEach((line, idx) => {
        if (line.match(/portalsDropdown|RoleSwitcher|OPERATIONAL PORTALS|["'\/](warehouse|procurement|repairs|finance|sales|admin)["'\/]/i) || line.includes('Portals')) {
          matches.push({ file: full, line: idx + 1, content: line.trim() });
        }
      });
    }
  });
  return matches;
}

const found = searchDir('apps/frontend/src');
console.log('Matches count:', found.length);
found.forEach(m => {
  console.log(m.file + ':' + m.line + ' -> ' + m.content.slice(0, 100));
});
