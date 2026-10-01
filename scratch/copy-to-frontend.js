const fs = require('fs');
const path = require('path');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy components
console.log('Copying components...');
copyDirRecursive('src/components', 'apps/frontend/src/components');

// 2. Copy customer routes from src/app
console.log('Copying customer app routes...');
const customerRoutes = [
  'about',
  'account',
  'ai-advisory',
  'blog',
  'cart',
  'categories',
  'checkout',
  'contact',
  'crop-guidance',
  'dealers',
  'design-system',
  'faq',
  'login',
  'order-success',
  'privacy-policy',
  'products',
  'rentals',
  'services',
  'shipping-policy',
  'shop',
  'terms'
];

customerRoutes.forEach(r => {
  const src = path.join('src/app', r);
  const dest = path.join('apps/frontend/src/app', r);
  if (fs.existsSync(src)) {
    copyDirRecursive(src, dest);
    console.log(`Copied ${r}`);
  }
});

// Copy root app files
const rootAppFiles = [
  'globals.css',
  'layout.tsx',
  'page.tsx',
  'not-found.tsx',
  'robots.ts',
  'sitemap.ts'
];

rootAppFiles.forEach(f => {
  const src = path.join('src/app', f);
  const dest = path.join('apps/frontend/src/app', f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied app file ${f}`);
  }
});

// 3. Copy shared client lib files
console.log('Copying client libs...');
const libFiles = [
  'config.ts',
  'seed-data.ts',
  'services-data.ts',
  'ai-recommendation.ts'
];

if (!fs.existsSync('apps/frontend/src/lib')) {
  fs.mkdirSync('apps/frontend/src/lib', { recursive: true });
}

libFiles.forEach(f => {
  const src = path.join('src/lib', f);
  const dest = path.join('apps/frontend/src/lib', f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied lib file ${f}`);
  }
});

console.log('Done copying files to apps/frontend!');
