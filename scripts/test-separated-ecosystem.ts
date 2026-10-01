import http from 'http';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const BACKEND_PORT = 3001;
const FRONTEND_PORT = 3000;
const REVALIDATION_SECRET = 'agrimart_secret_reval_2026';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function requestJson(url: string, options: any = {}): Promise<any> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function waitForServer(url: string, timeoutMs = 30000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return true;
    } catch {
      // Wait and retry
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function runTests() {
  console.log('===============================================================');
  console.log('  AGRI MART MEGA: DECOUPLED ARCHITECTURE VERIFICATION TEST     ');
  console.log('===============================================================\n');

  // TEST 1: Decoupling and Isolation Audit
  console.log('[1/6] Auditing Decoupled Boundaries...');
  const frontendFiles = fs.readdirSync('apps/frontend/src', { recursive: true }) as string[];
  const badServerFiles = frontendFiles.filter((f) => {
    const full = path.join('apps/frontend/src', f);
    if (fs.statSync(full).isFile() && (f.endsWith('.ts') || f.endsWith('.tsx'))) {
      const content = fs.readFileSync(full, 'utf8');
      return content.includes('@/lib/dev-db') || content.includes('@/lib/prisma') || content.includes('@prisma/client');
    }
    return false;
  });
  assert(badServerFiles.length === 0, 'Frontend src has ZERO direct dev-db/Prisma database imports');

  const frontendEnv = fs.readFileSync('apps/frontend/.env', 'utf8');
  assert(!frontendEnv.includes('DATABASE_URL'), 'Frontend .env has ZERO database connection strings or server secrets');
  assert(frontendEnv.includes('NEXT_PUBLIC_BACKEND_URL=http://localhost:3001'), 'Frontend .env targets Backend on Port 3001');

  const backendEnv = fs.readFileSync('apps/backend/.env', 'utf8');
  assert(backendEnv.includes('PORT=3001'), 'Backend .env is configured for Port 3001');
  assert(backendEnv.includes('FRONTEND_URL=http://localhost:3000'), 'Backend .env references Frontend Port 3000');

  // TEST 2: Start Backend Server
  console.log('\n[2/6] Launching Backend Server on Port 3001...');
  const backendProc = spawn('cmd.exe', ['/c', 'npm run start'], {
    cwd: path.resolve('apps/backend'),
    stdio: 'ignore',
    shell: true,
  });

  const backendReady = await waitForServer('http://localhost:3001/api/products');
  assert(backendReady, 'Backend server started and listening on http://localhost:3001');

  if (!backendReady) {
    console.error('Fatal: Backend server failed to start within timeout');
    backendProc.kill();
    process.exit(1);
  }

  // TEST 3: Query Public Endpoints on Backend
  console.log('\n[3/6] Testing Backend API Endpoints...');
  const prodRes = await requestJson('http://localhost:3001/api/products');
  assert(prodRes.ok && prodRes.data.success && prodRes.data.data.length > 0, `GET /api/products returns ${prodRes.data?.data?.length || 0} items`);

  const catRes = await requestJson('http://localhost:3001/api/categories');
  assert(catRes.ok && catRes.data.success && catRes.data.data.length > 0, `GET /api/categories returns ${catRes.data?.data?.length || 0} categories`);

  const rentRes = await requestJson('http://localhost:3001/api/rentals');
  assert(rentRes.ok && rentRes.data.success && rentRes.data.data.length > 0, `GET /api/rentals returns ${rentRes.data?.data?.length || 0} rental machines`);

  const slugRes = await requestJson('http://localhost:3001/api/products/agripro-7hp-heavy-duty-power-weeder');
  assert(slugRes.ok && slugRes.data.success && slugRes.data.data.sku === 'AGP-PW-7HP', 'GET /api/products/[slug] returns full product details');

  // TEST 4: Secure Cart Revalidation (Price Tampering Defense)
  console.log('\n[4/6] Testing Secure Cart Revalidation & Price Tampering Guard...');
  const cartTamperPayload = {
    items: [
      {
        productId: 'prod-001',
        quantity: 2,
        // Client maliciously attempts to set unit price to 1 rupee
        unitPrice: 1,
      },
    ],
  };

  const revalRes = await requestJson('http://localhost:3001/api/cart/revalidate', {
    method: 'POST',
    body: JSON.stringify(cartTamperPayload),
  });

  assert(revalRes.ok && revalRes.data.isValid === true, 'Cart revalidation endpoint responded successfully');
  const recalibratedItem = revalRes.data.items[0];
  assert(recalibratedItem.unitPrice === 36500, `Authoritative backend corrected price to ₹${recalibratedItem.unitPrice} (ignored malicious client price)`);
  assert(recalibratedItem.inStock === true, `Stock availability verified: ${recalibratedItem.availableStock} in stock`);

  // TEST 5: Order Placement & Warehouse Allocation
  console.log('\n[5/6] Testing Order Creation & Automatic Warehouse Allocation...');
  const createOrderPayload = {
    customerName: 'Suresh Patil',
    customerMobile: '+91 98450 11223',
    items: [
      {
        productId: 'prod-001',
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Suresh Patil',
      mobile: '+91 98450 11223',
      addressLine: 'APMC Yard Road, Farm Plot 14',
      village: 'Kothathi',
      taluk: 'Mandya',
      district: 'Mandya',
      state: 'Karnataka',
      pincode: '571401',
    },
    paymentMethod: 'UPI',
  };

  const orderRes = await requestJson('http://localhost:3001/api/checkout/create-order', {
    method: 'POST',
    body: JSON.stringify(createOrderPayload),
  });

  assert(orderRes.ok && orderRes.data.success === true, `Order created with ID ${orderRes.data.orderId}`);
  assert(orderRes.data.orderNumber && (orderRes.data.orderNumber.startsWith('AGM-') || orderRes.data.orderNumber.startsWith('ORD-')), `Assigned order number: ${orderRes.data.orderNumber}`);

  // TEST 6: Revalidation Webhook Protocol
  console.log('\n[6/6] Testing Frontend Cache Revalidation Webhook...');
  // Launch Frontend Server
  const frontendProc = spawn('cmd.exe', ['/c', 'npm run start'], {
    cwd: path.resolve('apps/frontend'),
    stdio: 'ignore',
    shell: true,
  });

  const frontendReady = await waitForServer('http://localhost:3000/');
  assert(frontendReady, 'Frontend server started and listening on http://localhost:3000');

  if (frontendReady) {
    // 6a: Reject unauthorized revalidation
    const unauthReval = await requestJson('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ secret: 'wrong_secret', tags: ['products'] }),
    });
    assert(unauthReval.status === 401, 'Frontend /api/revalidate rejects unauthorized requests (401)');

    // 6b: Accept authorized revalidation
    const authReval = await requestJson('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({
        secret: REVALIDATION_SECRET,
        event: 'PRODUCT_PRICE_CHANGED',
        paths: ['/shop', '/products'],
        tags: ['products', 'catalogue'],
      }),
    });
    assert(authReval.ok && authReval.data.revalidated === true, 'Frontend /api/revalidate successfully executes on-demand cache revalidation');

    frontendProc.kill();
  }

  // Cleanup
  backendProc.kill();

  console.log('\n===============================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
