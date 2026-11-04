const fs = require('fs');
const path = require('path');

function getFiles(dir, ext = '.tsx') {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, ext));
    } else if (file.endsWith(ext)) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getFiles(path.join(__dirname, '../src'));
console.log(`Auditing ${files.length} TSX files for checkboxes and form fields...\n`);

let totalCheckboxes = 0;
let missingOnChange = [];
let missingChecked = [];
let dummyOnClick = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, i) => {
    if (line.includes('onClick={() => {}}') || line.includes('onClick={() => { }}')) {
      dummyOnClick.push({ file: path.relative(path.join(__dirname, '..'), file), line: i + 1, text: line.trim() });
    }

    if (line.includes('type="checkbox"') || line.includes("type='checkbox'")) {
      totalCheckboxes++;
      // Check surrounding lines (up to 10 lines) for onChange and checked
      const start = Math.max(0, i - 5);
      const end = Math.min(lines.length, i + 8);
      const chunk = lines.slice(start, end).join(' ');

      if (!chunk.includes('onChange') && !chunk.includes('readOnly') && !chunk.includes('disabled')) {
        missingOnChange.push({ file: path.relative(path.join(__dirname, '..'), file), line: i + 1, text: line.trim() });
      }
      if (!chunk.includes('checked=') && !chunk.includes('defaultChecked=')) {
        missingChecked.push({ file: path.relative(path.join(__dirname, '..'), file), line: i + 1, text: line.trim() });
      }
    }
  });
});

console.log(`Total Checkboxes found: ${totalCheckboxes}`);
console.log(`Missing onChange: ${missingOnChange.length}`);
missingOnChange.forEach(m => console.log(`  - ${m.file}:${m.line} -> ${m.text}`));

console.log(`\nMissing checked: ${missingChecked.length}`);
missingChecked.forEach(m => console.log(`  - ${m.file}:${m.line} -> ${m.text}`));

console.log(`\nDummy onClick: ${dummyOnClick.length}`);
dummyOnClick.forEach(d => console.log(`  - ${d.file}:${d.line} -> ${d.text}`));
