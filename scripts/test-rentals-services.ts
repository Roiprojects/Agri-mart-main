import { devDb } from '../src/lib/dev-db';
import { SERVICES_CATALOGUE, getServiceById, getServiceBySlug } from '../src/lib/services-data';

function runTestSuite() {
  console.log('===============================================================');
  console.log('AGRI MART MEGA — RENTALS & SERVICES VERIFICATION SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST GROUP 1: Rental Equipment Catalogue & Inventory
  // -------------------------------------------------------------
  console.log('--- TEST GROUP 1: Rental Catalogue & Inventory ---');
  const products = devDb.getRentalProducts();
  assert(products.length >= 4, `Rental products seeded (found ${products.length} products)`);

  const weeder = devDb.getRentalProductBySlug('power-weeder-7hp');
  assert(!!weeder, 'Found 7HP Power Weeder by slug');
  assert(weeder?.totalUnits === 3, `Power Weeder has 3 regional units capacity (actual: ${weeder?.totalUnits})`);
  assert(weeder?.dailyRate === 850, `Power Weeder daily rate is ₹850 (actual: ${weeder?.dailyRate})`);
  assert(weeder?.securityDeposit === 3000, `Power Weeder deposit is ₹3,000 (actual: ${weeder?.securityDeposit})`);

  // -------------------------------------------------------------
  // TEST GROUP 2: Capacity Conflict & Overlap Prevention
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: Capacity Conflict & Overlap Prevention ---');
  // Power weeder has totalUnits = 3.
  // Let's test checking availability for date window 2026-10-01 to 2026-10-05
  const testStart = '2026-10-01';
  const testEnd = '2026-10-05';

  const availInitial = devDb.checkRentalAvailability(weeder!.id, testStart, testEnd);
  assert(availInitial.isAvailable === true, 'Initially all 3 units available for October dates');
  assert(availInitial.remainingUnits === 3, `3 units remaining initially (actual: ${availInitial.remainingUnits})`);

  // Book unit 1
  const bk1 = devDb.createRentalBooking({
    rentalProductId: weeder!.id,
    productTitle: weeder!.title,
    userId: 'usr-farmer-01',
    customerName: 'Test Farmer A',
    customerMobile: '9845190812',
    deliveryAddress: 'Mandya Farm',
    pincode: '571401',
    startDate: testStart,
    endDate: testEnd,
    totalDays: 5,
    pricingTier: 'DAILY',
    dailyRate: 850,
    rentAmount: 4250,
    securityDeposit: 3000,
    totalPaid: 7250,
    paymentMethod: 'ONLINE_UPI',
    paymentStatus: 'PAID',
    status: 'APPROVED',
  });
  assert(bk1.success === true, 'Successfully reserved Unit 1');

  // Book unit 2
  const bk2 = devDb.createRentalBooking({
    rentalProductId: weeder!.id,
    productTitle: weeder!.title,
    userId: 'usr-farmer-02',
    customerName: 'Test Farmer B',
    customerMobile: '9886054321',
    deliveryAddress: 'Dharwad Farm',
    pincode: '580004',
    startDate: testStart,
    endDate: testEnd,
    totalDays: 5,
    pricingTier: 'DAILY',
    dailyRate: 850,
    rentAmount: 4250,
    securityDeposit: 3000,
    totalPaid: 7250,
    paymentMethod: 'ONLINE_UPI',
    paymentStatus: 'PAID',
    status: 'APPROVED',
  });
  assert(bk2.success === true, 'Successfully reserved Unit 2');

  // Book unit 3
  const bk3 = devDb.createRentalBooking({
    rentalProductId: weeder!.id,
    productTitle: weeder!.title,
    userId: 'usr-farmer-03',
    customerName: 'Test Farmer C',
    customerMobile: '9480111223',
    deliveryAddress: 'Belagavi Farm',
    pincode: '591313',
    startDate: testStart,
    endDate: testEnd,
    totalDays: 5,
    pricingTier: 'DAILY',
    dailyRate: 850,
    rentAmount: 4250,
    securityDeposit: 3000,
    totalPaid: 7250,
    paymentMethod: 'ONLINE_UPI',
    paymentStatus: 'PAID',
    status: 'ACTIVE',
  });
  assert(bk3.success === true, 'Successfully reserved Unit 3 (Capacity now FULL at 3/3)');

  // Now attempt to book Unit 4 during overlapping dates (2026-10-02 to 2026-10-04)
  const bk4Conflict = devDb.createRentalBooking({
    rentalProductId: weeder!.id,
    productTitle: weeder!.title,
    userId: 'usr-farmer-04',
    customerName: 'Test Farmer D (Conflict Attempt)',
    customerMobile: '9999988888',
    deliveryAddress: 'Mysuru Farm',
    pincode: '570001',
    startDate: '2026-10-02',
    endDate: '2026-10-04',
    totalDays: 3,
    pricingTier: 'DAILY',
    dailyRate: 850,
    rentAmount: 2550,
    securityDeposit: 3000,
    totalPaid: 5550,
    paymentMethod: 'ONLINE_UPI',
    paymentStatus: 'PENDING',
    status: 'PENDING_APPROVAL',
  });
  assert(bk4Conflict.success === false, 'Overlapping booking beyond 3 units capacity is REJECTED');
  assert(
    !!bk4Conflict.error && bk4Conflict.error.includes('AVAILABILITY_CONFLICT'),
    `Correct error returned: ${bk4Conflict.error}`
  );

  // -------------------------------------------------------------
  // TEST GROUP 3: Return Conditions, Late Fees & Damage Deductions
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: Return Conditions & Deposit Settlements ---');
  // 1. On-Time Return of bk1
  const returnOnTime = devDb.processRentalReturn(bk1.booking!.id, {
    actualReturnDate: testEnd,
    condition: 'ON_TIME',
  });
  assert(returnOnTime?.status === 'RETURNED_ON_TIME', `Unit 1 marked RETURNED_ON_TIME (actual: ${returnOnTime?.status})`);
  assert(returnOnTime?.lateFee === 0, 'On-time return has 0 late fee');
  assert(returnOnTime?.depositRefundAmount === 3000, `Full ₹3,000 security deposit refunded on-time (actual: ₹${returnOnTime?.depositRefundAmount})`);
  assert(returnOnTime?.depositRefundStatus === 'PROCESSED', 'Deposit refund status PROCESSED');

  // 2. Late Return of bk2 (returned 2 days late: scheduled Oct 5, returned Oct 7)
  const returnLate = devDb.processRentalReturn(bk2.booking!.id, {
    actualReturnDate: '2026-10-07',
    condition: 'LATE',
  });
  assert(returnLate?.status === 'RETURNED_LATE', `Unit 2 marked RETURNED_LATE (actual: ${returnLate?.status})`);
  assert(returnLate?.lateDays === 2, `2 late days calculated (actual: ${returnLate?.lateDays})`);
  // Late fee: 2 * (850 * 1.5) = 2 * 1275 = 2550
  assert(returnLate?.lateFee === 2550, `Late fee ₹2,550 correctly computed: 2 days * (850 * 1.5) (actual: ₹${returnLate?.lateFee})`);
  // Refund: 3000 - 2550 = 450
  assert(returnLate?.depositRefundAmount === 450, `Net deposit refund ₹450 correctly computed: 3000 - 2550 (actual: ₹${returnLate?.depositRefundAmount})`);

  // 3. Damaged Return of bk3 (damage assessment fee: ₹1,200)
  const returnDamaged = devDb.processRentalReturn(bk3.booking!.id, {
    actualReturnDate: testEnd,
    condition: 'DAMAGED',
    damageNotes: 'Left rotary tiller tine broken, needs replacement.',
    damageCharge: 1200,
  });
  assert(returnDamaged?.status === 'RETURNED_DAMAGED', `Unit 3 marked RETURNED_DAMAGED (actual: ${returnDamaged?.status})`);
  assert(returnDamaged?.damageFee === 1200, `Damage fee ₹1,200 registered (actual: ₹${returnDamaged?.damageFee})`);
  // Net refund: 3000 - 1200 = 1800
  assert(returnDamaged?.depositRefundAmount === 1800, `Net refund ₹1,800: deposit 3000 - damage 1200 (actual: ₹${returnDamaged?.depositRefundAmount})`);

  // -------------------------------------------------------------
  // TEST GROUP 4: Services Catalogue & Job-Work Types
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Services Catalogue & Job-Work Sub-Types ---');
  assert(SERVICES_CATALOGUE.length === 10, `All 10 services documented in catalogue (actual: ${SERVICES_CATALOGUE.length})`);

  const tractorSrv = getServiceById('srv-tractor');
  assert(!!tractorSrv, 'Tractor service retrieved');
  assert(tractorSrv?.jobWorkTypes.length === 4, `Tractor has 4 job-work types (actual: ${tractorSrv?.jobWorkTypes.length})`);

  const laserLevel = tractorSrv?.jobWorkTypes.find((j) => j.id === 'jw-laser-level');
  assert(!!laserLevel, 'Found Laser Guided Precision Land Leveling job-work');
  assert(laserLevel?.rate === 1800, `Laser leveling rate is ₹1,800/acre (actual: ₹${laserLevel?.rate})`);

  const droneSrv = getServiceById('srv-spraying');
  assert(!!droneSrv, 'Drone spraying service retrieved');
  assert((droneSrv?.jobWorkTypes.length ?? 0) >= 2, `Drone spraying has sub-types (actual: ${droneSrv?.jobWorkTypes.length})`);

  // -------------------------------------------------------------
  // TEST GROUP 5: GPS Service Request Creation
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 5: GPS Service Request Creation ---');
  const testGpsReq = devDb.createServiceRequest({
    userId: 'usr-farmer-01',
    customerName: 'Ramesh Kumar Gowda',
    customerMobile: '9845190812',
    serviceId: 'srv-tractor',
    serviceName: 'Tractor Precision Ploughing & Land Preparation',
    jobWorkId: 'jw-mb-plough',
    jobWorkName: 'Mouldboard (MB) Deep Ploughing',
    farmAcreage: 4.5,
    cropType: 'Sugarcane',
    district: 'Mandya',
    taluk: 'Mandya',
    village: 'Kothathi',
    address: 'Plot #14, Sy. No 124, Kothathi Hobli',
    pincode: '571401',
    gpsLatitude: 12.5218,
    gpsLongitude: 76.8951,
    preferredDate: '2026-09-24',
    preferredTime: '08:00 AM - 12:00 PM',
    notes: 'Incorporating sugarcane trash for 4.5 acres.',
    photoUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b',
    estimatedCost: 6300, // 4.5 * 1400
    advancePaid: 0,
    status: 'REQUESTED',
  });

  assert(!!testGpsReq.id, 'Service request ID generated');
  assert(testGpsReq.requestNumber.startsWith('REQ-SRV-2026-'), `Request reference formatted: ${testGpsReq.requestNumber}`);
  assert(testGpsReq.gpsLatitude === 12.5218, `GPS latitude stored: ${testGpsReq.gpsLatitude}`);
  assert(testGpsReq.gpsLongitude === 76.8951, `GPS longitude stored: ${testGpsReq.gpsLongitude}`);
  assert(testGpsReq.status === 'REQUESTED', `Initial status is REQUESTED (actual: ${testGpsReq.status})`);

  // -------------------------------------------------------------
  // TEST GROUP 6: Super Admin Provider Assignment & Customer Notification
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 6: Super Admin Provider Assignment ---');
  const assigned = devDb.assignServiceProvider(testGpsReq.id, {
    providerId: 'prv-mandya-fleet-11',
    providerName: 'Mandya Precision Agro Fleet #11',
    operatorMobile: '9480188990',
    fleetUnit: 'Tractor Unit KA-11-T-4912 (Basavaraj)',
  });

  assert(assigned?.status === 'ASSIGNED', `Request status transitioned to ASSIGNED (actual: ${assigned?.status})`);
  assert(assigned?.assignedProviderName === 'Mandya Precision Agro Fleet #11', 'Assigned provider name stored');
  assert(assigned?.assignedOperatorMobile === '9480188990', 'Operator mobile stored');
  assert(assigned?.assignedFleetUnit === 'Tractor Unit KA-11-T-4912 (Basavaraj)', 'Fleet machinery unit ID stored');

  // Verify notification was logged
  const notifs = devDb.getCustomerNotifications('usr-farmer-01');
  const assignNotif = notifs.find((n) => n.event === 'SERVICE_OPERATOR_ASSIGNED');
  assert(!!assignNotif, 'SMS notification generated for customer upon provider assignment');
  assert(
    !!assignNotif && assignNotif.message.includes('Mandya Precision Agro Fleet #11'),
    'Notification mentions assigned provider'
  );

  console.log('\n===============================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
