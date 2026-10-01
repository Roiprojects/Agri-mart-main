const fs = require('fs');
const path = require('path');

function checkRoutes(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      checkRoutes(full);
    } else if (file === 'route.ts' || file === 'route.js') {
      const content = fs.readFileSync(full, 'utf8');
      const exports = content.match(/export\s+(const|let|var|function|type|interface|class)\s+([a-zA-Z0-9_]+)/g);
      if (exports) {
        exports.forEach(exp => {
          const name = exp.split(/\s+/).pop();
          if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'dynamic', 'revalidate', 'dynamicParams', 'fetchCache', 'runtime', 'preferredRegion', 'maxDuration'].includes(name)) {
            console.log(`Disallowed export in ${full}: ${exp}`);
          }
        });
      }
    }
  });
}

checkRoutes('apps/backend/src/app/api');
