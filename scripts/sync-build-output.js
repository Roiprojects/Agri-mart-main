const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const src = path.join(rootDir, 'apps', 'backend', '.next');
const dest = path.join(rootDir, '.next');

if (fs.existsSync(src)) {
  console.log('[sync-build] Syncing build artifacts from apps/backend/.next to root .next ...');
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src);
  for (const entry of entries) {
    if (entry === 'cache') continue;
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    fs.cpSync(srcPath, destPath, { recursive: true, force: true });
  }
  console.log('[sync-build] Build artifacts successfully synced to root .next');
} else {
  console.warn('[sync-build] Warning: apps/backend/.next not found.');
}
