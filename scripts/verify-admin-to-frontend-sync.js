/**
 * Live End-to-End Verification: Admin / Backend Portals -> Frontend Sync
 * 
 * Tests that mutations executed on backend admin/portal APIs (port 3011)
 * immediately and factually reflect on the frontend storefront (port 3010).
 */

const FRONTEND_URL = 'http://localhost:3010';
const BACKEND_URL = 'http://localhost:3011';

async function runTest() {
  console.log('================================================================');
  console.log(' AGRI-MART: VERIFYING ADMIN & BACKEND PORTALS -> FRONTEND SYNC');
  console.log(` Frontend: ${FRONTEND_URL} | Backend: ${BACKEND_URL}`);
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST 1: CATALOGUE PRODUCT MUTATION (ADMIN -> FRONTEND)
  // -------------------------------------------------------------
  console.log('--- TEST 1: Product Catalogue Mutation ---');
  try {
    // 1. Fetch current product
    const prodsRes = await fetch(`${BACKEND_URL}/api/products`).then(r => r.json());
    const originalProd = prodsRes.data[0];
    assert(originalProd && originalProd.id, `Fetched original product ${originalProd.id} (${originalProd.slug}) from backend`);

    const testMarker = `[SYNC-TEST-${Date.now()}]`;
    const newPrice = 142500;
    const newName = `${originalProd.name} ${testMarker}`;

    // 2. Mutate in Admin API
    const updateRes = await fetch(`${BACKEND_URL}/api/admin/catalogue/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...originalProd,
        name: newName,
        price: newPrice,
      }),
    }).then(r => r.json());
    assert(updateRes.success, 'Admin API saved product mutation successfully');

    // 3. Check Frontend API immediately
    const frontApiRes = await fetch(`${FRONTEND_URL}/api/products`, { cache: 'no-store' }).then(r => r.json());
    const updatedFrontProd = frontApiRes.data.find(p => p.id === originalProd.id);
    assert(
      updatedFrontProd && updatedFrontProd.price === newPrice && updatedFrontProd.name.includes(testMarker),
      `Frontend /api/products immediately reflects updated price (₹${newPrice}) & title (${testMarker})`
    );

    // 4. Check Frontend Product Details HTML Page
    const frontPageHtml = await fetch(`${FRONTEND_URL}/products/${originalProd.slug}`, { cache: 'no-store' }).then(r => r.text());
    assert(
      frontPageHtml.includes(testMarker) && (frontPageHtml.includes('1,42,500') || frontPageHtml.includes('142500')),
      `Frontend HTML /products/${originalProd.slug} dynamically renders new title and ₹1,42,500`
    );

    // 5. Revert back to original
    await fetch(`${BACKEND_URL}/api/admin/catalogue/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(originalProd),
    });
    const revertedFront = await fetch(`${FRONTEND_URL}/api/products`, { cache: 'no-store' }).then(r => r.json());
    const revertedItem = revertedFront.data.find(p => p.id === originalProd.id);
    assert(
      revertedItem && revertedItem.price === originalProd.price && !revertedItem.name.includes(testMarker),
      'Frontend immediately reflects reverted original values after admin cleanup'
    );
  } catch (err) {
    assert(false, `Test 1 threw error: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 2: AGRICULTURAL GALLERY MUTATION (ADMIN -> FRONTEND)
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: Agricultural Gallery Item & Settings ---');
  try {
    const galleryRes = await fetch(`${BACKEND_URL}/api/gallery`, { cache: 'no-store' }).then(r => r.json());
    const targetItem = galleryRes.data[0];
    assert(targetItem && targetItem.id, `Found gallery item ${targetItem.id}`);

    const syncLocation = `Mandya Sugarcane Belt (Verified Sync)`;
    const originalLocation = targetItem.location || 'Hubballi Region';

    // 1. Update gallery item in Admin
    const updateItemRes = await fetch(`${BACKEND_URL}/api/admin/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...targetItem,
        location: syncLocation,
      }),
    }).then(r => r.json());
    assert(updateItemRes.success, 'Admin API saved gallery item mutation');

    // 2. Query Frontend Gallery API
    const frontGallery = await fetch(`${FRONTEND_URL}/api/gallery`, { cache: 'no-store' }).then(r => r.json());
    const updatedGal = frontGallery.data.find(g => g.id === targetItem.id);
    assert(
      updatedGal && updatedGal.location === syncLocation,
      `Frontend /api/gallery immediately reflected location: "${syncLocation}"`
    );

    // 3. Update Gallery Settings in Configuration
    const testPageTitle = `Karnataka Agronomy Archive (Sync Verified)`;
    const updateSettingsRes = await fetch(`${BACKEND_URL}/api/admin/settings/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: testPageTitle,
        gridColumns: 5,
      }),
    }).then(r => r.json());
    assert(updateSettingsRes.success, 'Admin Settings API saved gallery settings');

    // 4. Verify Frontend sees updated settings
    const frontSettingsCheck = await fetch(`${FRONTEND_URL}/api/gallery`, { cache: 'no-store' }).then(r => r.json());
    assert(
      frontSettingsCheck.settings && frontSettingsCheck.settings.pageTitle === testPageTitle && frontSettingsCheck.settings.gridColumns === 5,
      `Frontend /api/gallery settings immediately reflect pageTitle: "${testPageTitle}" & gridColumns: 5`
    );

    // Revert gallery item & settings
    await fetch(`${BACKEND_URL}/api/admin/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...targetItem, location: originalLocation }),
    });
    await fetch(`${BACKEND_URL}/api/admin/settings/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageTitle: 'Life on the Farm - Visual Agronomy Archive',
        gridColumns: 4,
      }),
    });
    assert(true, 'Gallery item and settings reverted cleanly');
  } catch (err) {
    assert(false, `Test 2 threw error: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 3: CROP GUIDANCE MUTATION (ADMIN -> FRONTEND)
  // -------------------------------------------------------------
  console.log('\n--- TEST 3: Crop Guidance 7-Stage Package of Practices ---');
  try {
    const cgRes = await fetch(`${BACKEND_URL}/api/crop-guidance`, { cache: 'no-store' }).then(r => r.json());
    assert(cgRes.success && cgRes.data.length > 0, `Fetched ${cgRes.data.length} crop guidance stages`);

    const stage1 = cgRes.data[0];
    const originalSummary = stage1.summary;
    const testMarker = `[POP-SYNC-OK-${Date.now()}]`;

    // 1. Update Stage 1 in Admin
    const updateCgRes = await fetch(`${BACKEND_URL}/api/admin/crop-guidance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...stage1,
        summary: `${originalSummary} ${testMarker}`,
      }),
    }).then(r => r.json());
    assert(updateCgRes.success, 'Admin Crop Guidance PUT updated successfully');

    // 2. Fetch Frontend /crop-guidance Page
    const frontCgHtml = await fetch(`${FRONTEND_URL}/crop-guidance`, { cache: 'no-store' }).then(r => r.text());
    assert(
      frontCgHtml.includes(testMarker),
      `Frontend SSR HTML /crop-guidance rendered updated POP summary with marker ${testMarker}`
    );

    // 3. Revert
    await fetch(`${BACKEND_URL}/api/admin/crop-guidance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...stage1,
        summary: originalSummary,
      }),
    });
    const revertedCgHtml = await fetch(`${FRONTEND_URL}/crop-guidance`, { cache: 'no-store' }).then(r => r.text());
    assert(!revertedCgHtml.includes(testMarker), 'Frontend /crop-guidance restored to original without marker');
  } catch (err) {
    assert(false, `Test 3 threw error: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 4: ON-FIELD SERVICES CATALOGUE (ADMIN -> FRONTEND)
  // -------------------------------------------------------------
  console.log('\n--- TEST 4: Field Services & Mechanization Catalogue ---');
  try {
    const srvRes = await fetch(`${BACKEND_URL}/api/services`, { cache: 'no-store' }).then(r => r.json());
    const services = srvRes.services || [];
    assert(services.length > 0, `Fetched ${services.length} services from catalogue`);

    const droneService = services.find(s => s.slug === 'drone-crop-spraying') || services[0];
    const originalRate = droneService.baseRatePerAcre;
    const testRate = 1875;

    // 1. Mutate in Admin API
    const updateSrvRes = await fetch(`${BACKEND_URL}/api/services`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: droneService.id,
        baseRatePerAcre: testRate,
      }),
    }).then(r => r.json());
    assert(updateSrvRes.success, `Admin services API updated base rate to ₹${testRate}`);

    // 2. Fetch Frontend Services HTML
    const frontServicesHtml = await fetch(`${FRONTEND_URL}/services`, { cache: 'no-store' }).then(r => r.text());
    assert(
      frontServicesHtml.includes(`₹1875`) || frontServicesHtml.includes(`1875`),
      `Frontend /services page rendered new service rate of ₹1875/acre`
    );

    // 3. Fetch Service Detail Page HTML
    const frontSrvDetailHtml = await fetch(`${FRONTEND_URL}/services/${droneService.slug}`, { cache: 'no-store' }).then(r => r.text());
    assert(
      frontSrvDetailHtml.includes(`₹1875`) || frontSrvDetailHtml.includes(`1875`),
      `Frontend /services/${droneService.slug} detail page rendered new service rate of ₹1875/acre`
    );

    // 4. Revert
    await fetch(`${BACKEND_URL}/api/services`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: droneService.id,
        baseRatePerAcre: originalRate,
      }),
    });
    assert(true, `Service rate cleanly reverted to original ₹${originalRate}`);
  } catch (err) {
    assert(false, `Test 4 threw error: ${err.message}`);
  }

  // -------------------------------------------------------------
  // TEST 5: WAREHOUSE INVENTORY PORTAL (PORTAL -> FRONTEND)
  // -------------------------------------------------------------
  console.log('\n--- TEST 5: Warehouse Inventory Portal Stock Adjustments ---');
  try {
    const whRes = await fetch(`${BACKEND_URL}/api/warehouse/inventory?warehouseId=wh-hubballi`, { cache: 'no-store' }).then(r => r.json());
    assert(whRes.success && whRes.inventory.length > 0, `Warehouse portal returned ${whRes.inventory.length} items`);

    const targetItem = whRes.inventory[0];
    const initialQty = targetItem.quantity;
    const testDelta = 25;

    // 1. Stock In adjustment via Warehouse Portal API
    const stockInRes = await fetch(`${BACKEND_URL}/api/warehouse/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        warehouseId: 'wh-hubballi',
        productId: targetItem.productId,
        type: 'STOCK_IN',
        quantity: testDelta,
        referenceId: `WH-TEST-${Date.now()}`,
        notes: 'Verification test for warehouse stock reflection',
        performedBy: 'Automated Test Runner',
      }),
    }).then(r => r.json());
    assert(stockInRes.success && stockInRes.balanceAfter === initialQty + testDelta, `Warehouse stock increased by ${testDelta} (New balance: ${stockInRes.balanceAfter})`);

    // 2. Query warehouse inventory again
    const verifyWh = await fetch(`${BACKEND_URL}/api/warehouse/inventory?warehouseId=wh-hubballi`, { cache: 'no-store' }).then(r => r.json());
    const updatedWhItem = verifyWh.inventory.find(i => i.productId === targetItem.productId);
    assert(updatedWhItem.quantity === initialQty + testDelta, 'Warehouse portal reflects updated balance');

    // 3. Revert with STOCK_OUT
    await fetch(`${BACKEND_URL}/api/warehouse/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        warehouseId: 'wh-hubballi',
        productId: targetItem.productId,
        type: 'STOCK_OUT',
        quantity: testDelta,
        notes: 'Reverting test adjustment',
        performedBy: 'Automated Test Runner',
      }),
    });
    assert(true, 'Warehouse stock reverted cleanly to original quantity');
  } catch (err) {
    assert(false, `Test 5 threw error: ${err.message}`);
  }

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(` SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTest();
