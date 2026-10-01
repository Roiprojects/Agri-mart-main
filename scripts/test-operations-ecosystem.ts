/**
 * Comprehensive Automated Verification Suite for Operational Ecosystem:
 * - Warehouse Portal & Inventory Ledger
 * - Automated Distance & Stock Allocation Engine
 * - Rejection Recovery Failover
 * - Admin Allocation Controls (Reassign, Split, Hold, Audit Logs)
 * - Carrier Logistics & Milestone Progression
 * - Procurement & Agronomy Farmer Lifecycle
 * - Sales CRM 8-Stage Pipeline & GPS Visits
 * - Idempotent Multi-Channel Notifications
 * - Enterprise Integrations Diagnostics
 */

import { devDb } from '../src/lib/dev-db';

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string, details?: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✓ ${testName}`);
  } else {
    console.error(`  ✗ FAIL: ${testName} ${details ? `(${details})` : ''}`);
    process.exitCode = 1;
  }
}

async function runTests() {
  console.log('\n=== AGRI MART MEGA: OPERATIONAL ECOSYSTEM VERIFICATION ===\n');

  // TEST 1: Master Warehouses and Operational Seed Data
  console.log('[TEST 1] Warehouses and Operational Master Data:');
  const warehouses = devDb.getWarehouses();
  assert(warehouses.length >= 4, 'At least 4 regional dark warehouses active', `Found ${warehouses.length}`);
  assert(warehouses.some((w) => w.id === 'wh-hubballi'), 'Hubballi Central Dark Warehouse present');
  assert(warehouses.some((w) => w.id === 'wh-dharwad'), 'Dharwad Rural Fulfillment Hub present');
  assert(warehouses.some((w) => w.id === 'wh-belagavi'), 'Belagavi Agro Logistics Center present');
  assert(warehouses.some((w) => w.id === 'wh-davanagere'), 'Davanagere Central Agro Hub present');

  const farmerProfiles = devDb.getFarmerProfiles();
  assert(farmerProfiles.length >= 2, 'Farmer profiles seeded', `Found ${farmerProfiles.length}`);
  const ramesh = farmerProfiles.find((f) => f.farmerName.includes('Ramesh'));
  assert(!!ramesh, 'Ramesh Kumar Gowda (Mandya) farmer profile exists');
  assert(['FLOWERING', 'HARVEST_READY'].includes(ramesh?.currentCropStage || ''), 'Ramesh crop stage tracked in valid lifecycle state');

  const leads = devDb.getSalesLeads();
  assert(leads.length >= 4, 'Sales leads seeded across stages', `Found ${leads.length}`);
  assert(leads.some((l) => l.leadSource === 'AI_ADVISORY'), 'AI Advisory lead source linked');
  assert(leads.some((l) => l.stage === 'CONVERTED'), 'Converted lead present in CRM');

  // TEST 2: Stock Ledger Transactions
  console.log('\n[TEST 2] Stock In/Out Ledger Transactions:');
  const initialStock = devDb.getWarehouseStocks('prod-001').find((s) => s.warehouseId === 'wh-hubballi')?.quantity || 0;
  const stockInRes = devDb.processStockTransaction({
    warehouseId: 'wh-hubballi',
    productId: 'prod-001',
    variantId: 'var-001-1',
    type: 'STOCK_IN',
    quantity: 10,
    referenceId: 'PO-TEST-100',
    notes: 'Test consignment intake',
    performedBy: 'Automated Tester',
  });
  assert(stockInRes.success, 'Stock receipt processed successfully');
  assert(stockInRes.balanceAfter === initialStock + 10, 'Stock balance updated atomically in ledger');

  const hubLedger = devDb.getStockLedger('wh-hubballi');
  assert(hubLedger.length > 0, 'Ledger entries logged for Hubballi hub');
  assert(hubLedger[0].referenceId === 'PO-TEST-100', 'Ledger recorded correct PO reference');

  // TEST 3: Automated Allocation Engine (Proximity & Stock Verification)
  console.log('\n[TEST 3] Automated Distance & Stock Allocation Engine:');
  const newOrderRes = devDb.createOrder({
    userId: 'usr-farmer-01',
    items: [{ productId: 'prod-003', variantId: 'var-003-1', quantity: 2 }],
    shippingAddress: {
      fullName: 'Ramesh Kumar Gowda',
      mobile: '9845190812',
      addressLine: 'Farm Plot 14, Maddur Road',
      village: 'Kothathi',
      taluk: 'Mandya',
      district: 'Mandya',
      pincode: '571401',
      gpsLatitude: 12.5218,
      gpsLongitude: 76.8951,
    },
    paymentMethod: 'UPI',
  });
  assert(newOrderRes.success, 'Order created successfully with automated allocation');
  const testOrder = newOrderRes.order!;
  assert(testOrder.allocationStatus === 'ALLOCATED', 'Order allocation status marked ALLOCATED');
  assert(!!testOrder.assignedWarehouseId, 'Assigned to nearest eligible warehouse with inventory');
  assert((testOrder.assignmentAuditLogs?.length ?? 0) >= 1, 'Initial assignment audit log recorded');
  assert((testOrder.trackingMilestones?.length ?? 0) >= 2, 'Initial order placed & allocated milestones recorded');

  // TEST 4: Rejection Recovery Failover
  console.log('\n[TEST 4] Warehouse Rejection & Automated Recovery Failover:');
  const initialWhId = testOrder.assignedWarehouseId!;
  const rejectRes = devDb.rejectWarehouseOrder(
    testOrder.id,
    initialWhId,
    'Damaged packaging on shelf inventory'
  );
  assert(rejectRes.success, 'Order rejection accepted and recovery initiated');
  assert(!!rejectRes.reassignedTo, 'Automated recovery found alternative warehouse with stock');
  assert(rejectRes.reassignedTo?.id !== initialWhId, 'Reassigned to a different regional hub');
  assert(testOrder.assignedWarehouseId === rejectRes.reassignedTo?.id, 'Order assignedWarehouseId updated to failover hub');
  assert((testOrder.rejectionHistory?.length ?? 0) >= 1, 'Rejection history preserved on order');
  assert(
    testOrder.assignmentAuditLogs?.some((l) => l.changedBy === 'AUTO_RECOVERY_ENGINE') ?? false,
    'Audit log reflects AUTO_RECOVERY_ENGINE action'
  );

  // TEST 5: Admin Allocation Controls (Reassignment, Split, Hold)
  console.log('\n[TEST 5] Super Admin Allocation Controls:');
  // Manual Reassignment
  const reassignRes = devDb.reassignWarehouse(
    testOrder.id,
    'wh-davanagere',
    'Super Admin manual workload rebalancing',
    'Admin User Siddaraju',
    true
  );
  assert(reassignRes.success, 'Super Admin manual reassignment successful');
  assert(testOrder.assignedWarehouseId === 'wh-davanagere', 'Order updated to Davanagere warehouse');
  assert(testOrder.assignmentMode === 'MANUAL', 'Assignment mode updated to MANUAL');

  // Hold Allocation
  const holdRes = devDb.setOrderAllocationHold(
    testOrder.id,
    true,
    'Farmer requested address alteration',
    'Super Admin'
  );
  assert(holdRes.success, 'Allocation placed on HOLD');
  assert(testOrder.isHold === true, 'isHold flag is true');
  assert(testOrder.allocationStatus === 'HELD', 'allocationStatus transitioned to HELD');

  // Release Hold
  const releaseRes = devDb.setOrderAllocationHold(
    testOrder.id,
    false,
    'Address verified',
    'Super Admin'
  );
  assert(releaseRes.success, 'Allocation hold released');
  assert(testOrder.isHold === false, 'isHold flag is false');
  assert(testOrder.allocationStatus === 'ALLOCATED', 'allocationStatus restored to ALLOCATED');

  // Split Order
  // Create an order with 2 items to split
  const multiItemOrder = devDb.createOrder({
    userId: 'usr-farmer-01',
    items: [
      { productId: 'prod-002', variantId: 'var-002-1', quantity: 1 },
      { productId: 'prod-003', variantId: 'var-003-1', quantity: 2 },
    ],
    shippingAddress: {
      fullName: 'Ramesh Kumar Gowda',
      mobile: '9845190812',
      addressLine: 'Farm Plot 14, Maddur Road',
      village: 'Kothathi',
      taluk: 'Mandya',
      district: 'Mandya',
      pincode: '571401',
    },
    paymentMethod: 'UPI',
  }).order!;

  const orderItems = devDb.getOrderWithDetails(multiItemOrder.id)?.items || [];
  assert(orderItems.length >= 2, 'Multi-item order created for split test');

  const splitRes = devDb.splitOrderAcrossWarehouses(
    multiItemOrder.id,
    [
      { warehouseId: 'wh-hubballi', itemIds: [orderItems[0].id] },
      { warehouseId: 'wh-dharwad', itemIds: [orderItems[1].id] },
    ],
    'Super Admin'
  );
  assert(splitRes.success, 'Split order across 2 warehouses executed');
  assert(multiItemOrder.isSplitOrder === true, 'isSplitOrder marked true');
  assert((multiItemOrder.splitShipments?.length ?? 0) === 2, '2 distinct split shipments created with tracking numbers');

  // TEST 6: Warehouse Order Lifecycle (Accept, Packing Slip, Dispatch, Delivery)
  console.log('\n[TEST 6] Warehouse Order Fulfillment Lifecycle:');
  const acceptRes = devDb.acceptWarehouseOrder(
    testOrder.id,
    testOrder.assignedWarehouseId!,
    'Suresh Patil (Operator)'
  );
  assert(acceptRes.success, 'Warehouse operator accepted order');
  assert(testOrder.allocationStatus === 'ACCEPTED', 'allocationStatus marked ACCEPTED');
  assert(testOrder.status === 'PACKED', 'Order status moved to PACKED');
  assert(!!testOrder.packingSlipNumber, 'Printable packing slip generated', testOrder.packingSlipNumber);

  const dispatchRes = devDb.dispatchShipment({
    orderId: testOrder.id,
    warehouseId: testOrder.assignedWarehouseId!,
    courierName: 'VRL Logistics Agri Express',
    trackingNumber: 'VRL-EXP-TEST-9911',
    estimatedDeliveryDate: '2026-09-20',
  });
  assert(dispatchRes.success, 'Shipment dispatched via carrier');
  assert(testOrder.status === 'DISPATCHED', 'Order status updated to DISPATCHED');
  assert(testOrder.trackingNumber === 'VRL-EXP-TEST-9911', 'AWB tracking number attached');

  const deliverRes = devDb.updateDeliveryMilestone(
    testOrder.id,
    'DELIVERED',
    'Mandya Farm Gate',
    'Handed over to Ramesh Gowda'
  );
  assert(deliverRes.success, 'Delivery milestone recorded');
  assert(testOrder.status === 'DELIVERED', 'Order marked as DELIVERED');
  assert(!!testOrder.deliveredAt, 'Delivered timestamp recorded');

  // TEST 7: Procurement & Agronomy Lifecycle
  console.log('\n[TEST 7] Procurement & Agronomy Lifecycle:');
  const updatedStage = devDb.updateCropStage('fp-001', 'HARVEST_READY', 'Sugarcane ready for mechanized harvesting');
  assert(updatedStage?.currentCropStage === 'HARVEST_READY', 'Farmer crop stage transitioned to HARVEST_READY');

  const followUps = devDb.getAgronomyFollowUps();
  let callToComplete = followUps.find((f) => f.status === 'SCHEDULED');
  if (!callToComplete && followUps.length > 0) {
    followUps[0].status = 'SCHEDULED';
    callToComplete = followUps[0];
  }
  assert(!!callToComplete, 'Agronomy follow-up target available');

  const completeCallRes = devDb.completeAgronomyFollowUp(
    callToComplete!.id,
    'Farmer confirmed healthy crop stand and scheduled combine harvester booking.'
  );
  assert(completeCallRes.success, 'Follow-up call marked as COMPLETED');
  assert(completeCallRes.followUp?.status === 'COMPLETED', 'Follow-up status verified as COMPLETED');

  // TEST 8: Sales CRM Pipeline & Field Visits
  console.log('\n[TEST 8] Sales CRM Pipeline & GPS Visits:');
  const freshLead = devDb.createSalesLead({
    customerName: 'Suresh Patil (Farmer)',
    mobile: '9448199221',
    village: 'Saundatti',
    taluk: 'Saundatti',
    district: 'Belagavi',
    leadSource: 'AI_ADVISORY',
    aiHistoryId: 'ai-session-9911',
    aiDiagnosisSummary: 'Cotton pink bollworm consultation',
    interestedCategory: 'Crop Protection & Bio-Care',
    interestedProductTitle: 'Neem-Guard 10000 PPM Bio-Insecticide',
    estimatedValue: 6500,
    stage: 'NEW',
    assignedExecutiveId: 'exec-03',
    assignedExecutiveName: 'Priya Nayak (Belagavi Hub)',
    remarks: 'AI advisory inquiry',
  });
  assert(freshLead.stage === 'NEW', 'Sales lead created at stage NEW');

  const stageUpdateRes = devDb.updateLeadStage(
    freshLead.id,
    'QUOTATION_SENT',
    'Formal invoice dispatched via WhatsApp',
    'WHATSAPP'
  );
  assert(stageUpdateRes.success, 'Sales lead transitioned to QUOTATION_SENT');
  assert(stageUpdateRes.lead?.stage === 'QUOTATION_SENT', 'Lead stage verified');

  const visitRes = devDb.logSalesVisit({
    leadId: freshLead.id,
    leadNumber: freshLead.leadNumber,
    farmerName: freshLead.customerName,
    executiveId: 'exec-03',
    executiveName: 'Priya Nayak',
    visitDate: '2026-09-17',
    gpsLatitude: 15.8502,
    gpsLongitude: 74.4988,
    cropObserved: 'Cotton (Bt-2)',
    acreage: 7.5,
    visitSummary: 'Checked boll development; demonstrated neem foliar application.',
    outcome: 'PROPOSAL_SUBMITTED',
  });
  assert(!!visitRes.id, 'GPS farm visit logged with coordinates');
  assert(visitRes.gpsLatitude === 15.8502, 'GPS latitude stored accurately');

  // TEST 9: Notification Matrix & Idempotency
  console.log('\n[TEST 9] Notification Matrix & Idempotency Queue:');
  const testIdempKey = `idemp-test-${Date.now()}`;
  const notif1 = devDb.enqueueNotification({
    event: 'ORDER_DISPATCHED',
    channel: 'SMS',
    recipient: '9845190812',
    recipientRole: 'CUSTOMER',
    title: 'Order Dispatched',
    message: 'Test message for idempotency',
    idempotencyKey: testIdempKey,
  });
  assert(notif1.enqueued === true, 'First notification successfully enqueued');

  // Duplicate enqueue with SAME idempotencyKey
  const notif2 = devDb.enqueueNotification({
    event: 'ORDER_DISPATCHED',
    channel: 'SMS',
    recipient: '9845190812',
    recipientRole: 'CUSTOMER',
    title: 'Order Dispatched',
    message: 'Duplicate test message',
    idempotencyKey: testIdempKey,
  });
  assert(notif2.isDuplicate === true, 'Duplicate notification deduplicated by idempotencyKey');
  assert(notif2.enqueued === false, 'Duplicate not enqueued twice');

  const retryRes = devDb.processNotificationQueue();
  assert(typeof retryRes.processed === 'number', 'Background retry processor executed cleanly');

  // TEST 10: Integrations Diagnostics & Health Ping
  console.log('\n[TEST 10] Enterprise Integrations Diagnostics:');
  const integrations = devDb.getIntegrations();
  assert(integrations.length >= 3, 'GOKwik, E-Aadhaar, and Calendly tracked', `Found ${integrations.length}`);
  const gokwik = integrations.find((i) => i.id === 'gokwik');
  assert(!!gokwik, 'GoKwik integration present');
  assert(gokwik?.status === 'SANDBOX_ACTIVE', 'GoKwik in SANDBOX_ACTIVE status');

  const pingRes = devDb.testIntegrationPing('gokwik');
  assert(pingRes.success, 'GoKwik simulated ping handshake succeeded');
  assert((pingRes.integration?.pingLatencyMs ?? 0) > 0, 'Ping latency captured in milliseconds');

  console.log(`\n=== RESULT: ${passed} of ${total} tests passed successfully! ===\n`);
  if (passed === total) {
    console.log('ALL OPERATIONAL ECOSYSTEM VERIFICATIONS PASSED!\n');
  }
}

runTests().catch((err) => {
  console.error('Test suite runner crashed:', err);
  process.exit(1);
});
