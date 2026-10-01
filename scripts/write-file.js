const fs = require('fs');
const path = require('path');
const [,, targetPath, b64] = process.argv;
fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, Buffer.from(b64, 'base64').toString('utf8'), 'utf8');
console.log('Wrote: ' + targetPath);
