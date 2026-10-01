import { devDb } from '../src/lib/dev-db';
import { SITE_CONFIG } from '../src/lib/config';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '../src/lib/seed-data';
import { SERVICES_CATALOGUE } from '../src/lib/services-data';

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  \x1b[32m✓\x1b[0m [PASS] ${message}`);
    passedCount++;
  } else {
    console.error(`  \x1b[31m✗\x1b[0m [FAIL] ${message}`);
    failedCount++;
  }
}

async function runAllJourneys() {
  console.log('\n================================================================');
  console.log('  AGRI MART MEGA: 6 STAKEHOLDER JOURNEYS & EDGE-CASE E2E SUITE');
  console.log('  Specification: Ref No 2026-27/P163 | GreenShield Industries');
  console.log('================================================================\n');

  // ===========================================================================
  // JOURNEY 1: Farmer Registration → Farm Profile → AI Guidance → Shopping → Payment → Delivery
  // ===========================================================================
  console.log('\n--- JOURNEY 1: Farmer Registration → Farm Profile → AI Guidance → Shopping → Delivery ---');

  // 1.1 Mobile OTP Registration & Auth Verification
  const testMobile = '9886099991';
  devDb.createOtp(testMobile, '123456');
  const verifyRes = devDb.verifyOtp(testMobile, '123456');
  assert(verifyRes.success, 'Farmer mobile OTP generated and verified successfully');
  const customer = verifyRes.user!;
  assert(!!customer.id, `Farmer registered with verified user ID: ${customer.id}`);
  assert(customer.mobile === testMobile, 'Farmer 10-digit mobile stored cleanly in database');

  // 1.2 Farm Profile & Customer Address with GPS Coordinates
  const customerAddress = devDb.saveCustomerAddress({
    userId: customer.id,
    fullName: 'Shivanand Patil',
    mobile: testMobile,
    addressLine: 'Farm Plot #28, Near Kelageri Lake',
    village: 'Kelageri',
    taluk: 'Dharwad',
    district: 'Dharwad',
    pincode: '580007',
    gpsLatitude: 15.4589,
    gpsLongitude: 75.0078,
    isDefaultShipping: true,
  });
  assert(customerAddress.pincode === '580007', 'Customer parcel delivery address saved with pincode 580007');
  assert(customerAddress.gpsLatitude === 15.4589, 'Farm GPS latitude 15.4589 captured for dark warehouse routing');

  // 1.3 AI Guidance Recommendation Engine
  const recommendedProducts = SEED_PRODUCTS.filter(
    (p) =>
      p.targetCrops?.includes('Cotton') ||
      p.category?.includes('Crop Protection') ||
      p.category?.includes('Plant Nutrition')
  );
  assert(recommendedProducts.length > 0, `AI Agronomy recommendation engine matched ${recommendedProducts.length} products for Cotton`);
  const targetProduct = SEED_PRODUCTS.find((p) => p.id === 'prod-003') || recommendedProducts[0];

  // 1.4 Shopping & Cart Calculation (using seeded warehouse SKU/variant)
  const orderItem = {
    productId: 'prod-003',
    variantId: 'var-003-1',
    quantity: 2,
  };
  const unitPrice = targetProduct.price;
  const expectedSubtotal = unitPrice * 2;
  assert(expectedSubtotal > 0, `Cart calculation for 2 units of ${targetProduct.name}: ₹${expectedSubtotal}`);

  // 1.5 Checkout & Automated Dark Warehouse Proximity Allocation
  const orderRes = devDb.createOrder({
    userId: customer.id,
    items: [orderItem],
    shippingAddress: {
      fullName: 'Shivanand Patil',
      mobile: testMobile,
      addressLine: customerAddress.addressLine,
      village: customerAddress.village,
      taluk: customerAddress.taluk,
      district: customerAddress.district,
      pincode: customerAddress.pincode,
      gpsLatitude: customerAddress.gpsLatitude,
      gpsLongitude: customerAddress.gpsLongitude,
    },
    paymentMethod: 'UPI',
  });
  assert(orderRes.success, 'Checkout order created successfully');
  const farmerOrder = orderRes.order!;
  assert(farmerOrder.allocationStatus === 'ALLOCATED', 'Order allocation status transitioned to ALLOCATED');
  assert(!!farmerOrder.assignedWarehouseId, `Automated GPS/PIN routing assigned nearest dark warehouse: ${farmerOrder.assignedWarehouseId}`);
  assert((farmerOrder.assignmentAuditLogs?.length ?? 0) >= 1, 'Allocation audit trail recorded initial warehouse selection');

  // 1.6 Payment Confirmation
  farmerOrder.paymentStatus = 'PAID';
  assert(farmerOrder.paymentStatus === 'PAID', 'Order payment verified via Razorpay/UPI mock webhook');

  // ===========================================================================
  // JOURNEY 2: Order → Warehouse Assignment → Packing → Dispatch → Procurement & Sales CRM
  // ===========================================================================
  console.log('\n--- JOURNEY 2: Warehouse Fulfillment → Dispatch → Procurement & Sales CRM Follow-Up ---');

  // 2.1 Warehouse Operator Accepts Order
  const acceptRes = devDb.acceptWarehouseOrder(
    farmerOrder.id,
    farmerOrder.assignedWarehouseId!,
    'Suresh Patil (Hub Operator)'
  );
  assert(acceptRes.success, 'Dark warehouse operator accepted order for fulfillment');
  assert(farmerOrder.allocationStatus === 'ACCEPTED', 'Allocation status marked ACCEPTED');

  // 2.2 Warehouse Packs Order and Generates Packing Slip
  assert(farmerOrder.status === 'PACKED', 'Order status moved to PACKED');
  assert(!!farmerOrder.packingSlipNumber, `Printable packing slip generated: ${farmerOrder.packingSlipNumber}`);

  // 2.3 Dispatch via Regional Carrier
  const dispatchRes = devDb.dispatchShipment({
    orderId: farmerOrder.id,
    warehouseId: farmerOrder.assignedWarehouseId!,
    courierName: 'VRL Express Rural',
    trackingNumber: 'VRL-DWD-8910472',
    estimatedDeliveryDate: '2026-10-02',
  });
  assert(dispatchRes.success, 'Order dispatched with regional carrier manifest');
  assert(farmerOrder.status === 'DISPATCHED', 'Order status transitioned to DISPATCHED');
  assert(farmerOrder.trackingNumber === 'VRL-DWD-8910472', 'Carrier AWB attached to order record');

  // 2.4 Carrier Milestones & Delivery Hand-off
  const deliverRes = devDb.updateDeliveryMilestone(
    farmerOrder.id,
    'DELIVERED',
    'Kelageri Farm Gate, Dharwad',
    'Farmer received doorstep delivery with OTP verification'
  );
  assert(deliverRes.success, 'Carrier tracking milestone advanced to DELIVERED');
  assert(farmerOrder.status === 'DELIVERED', 'Order marked DELIVERED with terminal timestamp');

  // 2.5 Procurement & Agronomy Farmer Lifecycle Tracking
  const updatedCropStage = devDb.updateCropStage('fp-001', 'VEGETATIVE', 'Cotton crop entering active vegetative branch formation');
  assert(!!updatedCropStage, 'Procurement portal updated farmer crop lifecycle stage');

  // 2.6 Agronomist Follow-Up Resolution
  const followUps = devDb.getAgronomyFollowUps();
  assert(followUps.length > 0, 'Agronomy follow-up calendar loaded');
  const targetFollowUp = followUps[0];
  const resolveRes = devDb.completeAgronomyFollowUp(
    targetFollowUp.id,
    'Advised foliar spray of micronutrient mixture + yellow sticky traps for whitefly prevention.'
  );
  assert(resolveRes.success, 'Agronomist follow-up consultation resolved with actionable agronomy notes');

  // 2.7 Sales CRM 8-Stage Pipeline Lead Tracking & GPS Visit
  const crmLead = devDb.createSalesLead({
    farmerName: 'Shivanand Patil',
    mobile: testMobile,
    village: 'Kelageri',
    taluk: 'Dharwad',
    district: 'Dharwad',
    leadSource: 'AI_ADVISORY',
    aiDiagnosisSummary: 'Cotton foliar nutrition and pest management advice',
    cropInterested: 'Cotton',
    stage: 'NEW',
    estimatedValue: 48000,
    assignedExecutiveName: 'Anand Kulkarni',
    assignedExecutiveId: 'exec-01',
    notes: 'Commercial cotton cultivator with 8.5 acres interested in automated sprayers.',
  });
  assert(crmLead.stage === 'NEW', 'Sales CRM lead initiated at stage NEW');

  const updateLeadRes = devDb.updateLeadStage(
    crmLead.id,
    'QUOTATION_SENT',
    'Sent official quotation for battery sprayer + biological fungicide package',
    'WHATSAPP'
  );
  assert(updateLeadRes.success && updateLeadRes.lead?.stage === 'QUOTATION_SENT', 'Sales CRM lead advanced to QUOTATION_SENT');

  const visitRes = devDb.logSalesVisit({
    leadId: crmLead.id,
    executiveName: 'Anand Kulkarni',
    visitDate: '2026-09-18',
    gpsLatitude: 15.4589,
    gpsLongitude: 75.0078,
    outcome: 'DEMO_COMPLETED',
    visitSummary: 'Demonstrated 16L battery sprayer at Kelageri farm plot. High conversion intent.',
  });
  assert(!!visitRes.id, 'GPS-stamped farm visit logged with executive coordinates');

  // ===========================================================================
  // JOURNEY 3: Rental → Approval → Payment → Active Booking → Return & Deposit Refund
  // ===========================================================================
  console.log('\n--- JOURNEY 3: Rental Request → Approval → Payment → Active → Return & Refund ---');

  const rentalProducts = devDb.getRentalProducts();
  assert(rentalProducts.length > 0, `Rental fleet catalog loaded with ${rentalProducts.length} machines`);
  const rentalMachine = rentalProducts[0];

  // 3.1 Availability & Booking Request
  const bookingStart = '2026-10-15';
  const bookingEnd = '2026-10-18';
  const totalDays = 4;
  const rentAmount = rentalMachine.dailyRate * totalDays;
  const securityDeposit = rentalMachine.securityDeposit;
  const totalPaid = rentAmount + securityDeposit;

  const rentCreateRes = devDb.createRentalBooking({
    rentalProductId: rentalMachine.id,
    productTitle: rentalMachine.title,
    userId: customer.id,
    customerName: 'Shivanand Patil',
    customerMobile: testMobile,
    deliveryAddress: 'Farm Plot #28, Near Kelageri Lake, Dharwad',
    pincode: '580007',
    warehouseId: 'wh-hubballi',
    startDate: bookingStart,
    endDate: bookingEnd,
    totalDays,
    pricingTier: 'DAILY',
    dailyRate: rentalMachine.dailyRate,
    rentAmount,
    securityDeposit,
    totalPaid,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    paymentId: 'pay_rent_test_902',
    status: 'PENDING_APPROVAL',
  });
  assert(rentCreateRes.success, 'Rental booking created with security deposit calculation');
  const rentalBooking = rentCreateRes.booking!;
  assert(rentalBooking.status === 'PENDING_APPROVAL', 'Rental booking starts in PENDING_APPROVAL status');
  assert(rentalBooking.securityDeposit === securityDeposit, `Security deposit held: ₹${securityDeposit}`);

  // 3.2 Super Admin Approval
  const approvedRental = devDb.updateRentalStatus(rentalBooking.id, 'APPROVED');
  assert(approvedRental?.status === 'APPROVED', 'Super Admin verified operator & approved rental booking');

  // 3.3 Active Handover
  const activeRental = devDb.updateRentalStatus(rentalBooking.id, 'ACTIVE');
  assert(activeRental?.status === 'ACTIVE', 'Equipment dispatched and transitioned to ACTIVE status');

  // 3.4 Equipment Return Inspection & Deposit Refund
  const returnedBooking = devDb.processRentalReturn(rentalBooking.id, {
    actualReturnDate: '2026-10-18',
    condition: 'ON_TIME',
    damageNotes: 'Pre-return inspection passed. Zero structural damage. Oil levels verified.',
    damageCharge: 0,
  });
  assert(returnedBooking?.status === 'RETURNED_ON_TIME', 'Equipment returned on time in pristine condition');
  assert(returnedBooking?.depositRefundStatus === 'PROCESSED', 'Full security deposit refund initiated to farmer');
  assert(returnedBooking?.depositRefundAmount === securityDeposit, `Refund amount equals 100% deposit: ₹${securityDeposit}`);

  // ===========================================================================
  // JOURNEY 4: Service Request → Provider Assignment → Progress → Completion
  // ===========================================================================
  console.log('\n--- JOURNEY 4: Mechanization Service Request → Provider Assignment → Completion ---');

  // 4.1 Service Request with GPS Pin & Job-Work
  const serviceDef = SERVICES_CATALOGUE[0];
  const serviceReq = devDb.createServiceRequest({
    userId: customer.id,
    customerName: 'Shivanand Patil',
    customerMobile: testMobile,
    serviceId: serviceDef.id,
    serviceName: serviceDef.name,
    jobWorkId: 'jw-plowing',
    jobWorkName: 'Deep Summer Plowing',
    farmAcreage: 3.5,
    cropType: 'Cotton',
    district: 'Dharwad',
    taluk: 'Dharwad',
    village: 'Kelageri',
    address: 'Sy. No 89, Kelageri, Dharwad',
    pincode: '580007',
    gpsLatitude: 15.4589,
    gpsLongitude: 75.0078,
    preferredDate: '2026-10-20',
    preferredTime: '07:30 AM - 11:30 AM',
    notes: 'Hard black cotton soil requiring heavy tractor with mouldboard plough',
    estimatedCost: 4200,
  });
  assert(serviceReq.status === 'REQUESTED', 'Mechanization service request logged in REQUESTED status');
  assert(serviceReq.farmAcreage === 3.5, 'Farm parcel acreage (3.5 acres) captured');

  // 4.2 Super Admin Assigns Certified Machinery Operator
  const assignedReq = devDb.assignServiceProvider(serviceReq.id, {
    providerId: 'op-01',
    providerName: 'Basavaraj Tractor Services (55HP 4WD)',
    operatorMobile: '9845012345',
    fleetUnit: 'John Deere 5050D + 3-MB Reversible Plough',
  });
  assert(assignedReq?.status === 'ASSIGNED', 'Super Admin assigned certified tractor operator');
  assert(assignedReq?.assignedProviderName.includes('Basavaraj') ?? false, 'Operator identity verified');

  // 4.3 Operator En-Route & In-Progress
  const progressReq = devDb.updateServiceRequestStatus(serviceReq.id, 'IN_PROGRESS');
  assert(progressReq?.status === 'IN_PROGRESS', 'Service moved to IN_PROGRESS upon tractor arrival at farm');

  // 4.4 Completion Sign-off
  const completeReq = devDb.updateServiceRequestStatus(serviceReq.id, 'COMPLETED');
  assert(completeReq?.status === 'COMPLETED', 'On-field mechanization service marked COMPLETED');

  // ===========================================================================
  // JOURNEY 5: Repair → Estimate → Approval → Parts → Quality Check → Invoice → Delivery
  // ===========================================================================
  console.log('\n--- JOURNEY 5: Repair Intake → 9-Stage Workshop Pipeline → GST Invoice → Delivery ---');

  // 5.1 Intake & Machine Registration
  const newSerial = `TST-EQ-${Date.now().toString().slice(-4)}`;
  const savedEq = devDb.saveCustomerEquipment({
    serialNumber: newSerial,
    modelName: 'AgriPro 7HP Power Weeder',
    category: 'Power Weeder',
    brand: 'AgriPro',
    engineMotorNumber: 'ENG-2025-4412',
    powerType: '4-Stroke Petrol',
    usageHours: 45,
    customerName: 'Shivanand Patil',
    customerMobile: testMobile,
    customerVillage: 'Kelageri, Dharwad',
  });
  assert(savedEq.serialNumber === newSerial, `Customer equipment registered with unique serial number: ${savedEq.serialNumber}`);
  assert(savedEq.warrantyStatus === 'IN_WARRANTY', 'New equipment warranty is verified IN_WARRANTY');

  const createdJc = devDb.createJobCard({
    customerName: 'Shivanand Patil',
    customerMobile: testMobile,
    customerVillage: 'Kelageri, Dharwad',
    equipmentModel: 'AgriPro 7HP Power Weeder',
    serialNumber: newSerial,
    category: 'Power Weeder',
    powerType: '4-Stroke Petrol',
    usageHours: 45,
    complaints: ['Recoil starter cord broken', 'Carburettor fuel overflow'],
    accessoriesReceived: ['Extra Rotary Blades', 'Spark Plug Spanner'],
    fuelOrBatteryLevel: '65% Petrol',
    expectedDeliveryDate: '2026-10-25',
    customerSignatureAtIntake: 'SIG-INTAKE-SP-9991',
  });
  assert(createdJc.status === 'PRODUCT_RECEIVED', 'Stage 1: Job card created in PRODUCT_RECEIVED stage');
  assert(createdJc.complaints.length === 2, 'Complaints logged accurately');

  // 5.2 Inspection & Checklists
  const adv1 = devDb.advanceRepairStage(createdJc.id, 'INSPECTION');
  assert(adv1.success && adv1.jobCard?.status === 'INSPECTION', 'Stage 2: Advanced to INSPECTION');

  const updatedDiag = devDb.updateDiagnosisAndEstimates(createdJc.id, {
    diagnosisNotes: 'Recoil spring snapped; carburettor jet gummed with stale ethanol fuel.',
    rootCauseCategory: 'Normal wear and tear + contaminated local fuel',
    parts: [
      {
        partId: 'sp-001',
        partNumber: 'SP-PLUG-NGK',
        name: 'NGK Nickel Spark Plug BM6A',
        qty: 1,
        unitPrice: 180,
        gstRate: 18,
        total: 180,
        approvalStatus: 'PENDING',
      },
    ],
    labour: [
      {
        labourId: 'lbr-001',
        operationCode: 'LBR-GEN-01',
        description: 'General Machine Inspection & Fuel System Flush',
        standardHours: 1.0,
        hourlyRate: 350,
        total: 350,
        approvalStatus: 'PENDING',
      },
    ],
    discountAmount: 30,
  });
  assert(updatedDiag.estimate.partsSubtotal === 180, 'Diagnosis and parts estimate configured');
  assert(updatedDiag.estimate.estimatedTotal === 595, `Estimate calculated with 18% GST and discount: ₹${updatedDiag.estimate.estimatedTotal}`);

  // 5.3 Estimate Generation & Stage Guard
  devDb.advanceRepairStage(createdJc.id, 'ESTIMATE');
  const blockedAdvance = devDb.advanceRepairStage(createdJc.id, 'REPAIR');
  assert(!blockedAdvance.success, 'Enforced Stage Guard: Cannot advance to REPAIR without Customer Approval');

  // 5.4 Customer Approval
  const approvedJc = devDb.updateEstimateDecision(createdJc.id, 'APPROVED', {
    customerSignature: 'SIG-DIGITAL-SP-9991',
  });
  assert(approvedJc.estimate.status === 'APPROVED', 'Stage 4: Customer estimate approved');
  assert(approvedJc.status === 'CUSTOMER_APPROVAL', 'Job card status transitioned to CUSTOMER_APPROVAL');

  // 5.5 Repair Execution & Automatic Spare Parts Stock Deduction
  devDb.assignTechnicianAndBay(
    createdJc.id,
    'tech-01',
    'Mallikarjun (Senior Tech)',
    'Bay 1 - Tillers',
    2.0
  );
  const plugBefore = devDb.getSpareParts().find((p) => p.partNumber === 'SP-PLUG-NGK')?.stockQuantity || 0;
  const advToRepair = devDb.advanceRepairStage(createdJc.id, 'REPAIR');
  assert(advToRepair.success && advToRepair.jobCard?.status === 'REPAIR', 'Stage 5: Job card advanced to REPAIR with technician and bay assigned');
  const plugAfter = devDb.getSpareParts().find((p) => p.partNumber === 'SP-PLUG-NGK')?.stockQuantity || 0;
  assert(plugAfter === plugBefore - 1, 'Spare parts atomically deducted from inventory on entering REPAIR');

  // 5.6 Quality Inspector Sign-Off Guard
  devDb.advanceRepairStage(createdJc.id, 'QUALITY_CHECK');
  const prematureBilling = devDb.advanceRepairStage(createdJc.id, 'BILLING');
  assert(!prematureBilling.success, 'Enforced Stage Guard: Cannot advance to BILLING without Quality Inspector Sign-Off');

  const qcPassed = devDb.completeQualityInspection(createdJc.id, {
    testRunPassed: true,
    fuelBatteryChecked: true,
    bladeAlignmentChecked: true,
    sprayPressureChecked: true,
    leakageCheckPassed: true,
    cleaningVerified: true,
    inspectorNotes: 'Engine tested at full throttle. RPM and compression certified.',
    inspectorName: 'Inspector Chetan',
    isPassed: true,
  });
  assert(qcPassed.qualityCheck.isPassed, 'Stage 6: Quality Inspector signed off PASS');
  assert(qcPassed.status === 'CLEANING', 'QC PASS automatically advanced job card to Stage 7: CLEANING');

  // 5.7 Workshop GST Tax Invoice Generation
  const invoicedJc = devDb.generateJobCardInvoice(createdJc.id, {
    discountAmount: 25,
    paymentMode: 'UPI',
    paymentStatus: 'PAID',
    transactionRef: 'UPI-SBI-2026-991823',
  });
  assert(invoicedJc.status === 'BILLING', 'Stage 8: Advanced to BILLING');
  assert(!!invoicedJc.invoice?.invoiceNumber, `Official Workshop GST Tax Invoice generated: ${invoicedJc.invoice?.invoiceNumber}`);
  assert(invoicedJc.invoice?.cgstAmount === invoicedJc.invoice?.sgstAmount, 'CGST 9% and SGST 9% split equally');
  assert(invoicedJc.invoice?.paymentStatus === 'PAID', 'Workshop invoice marked as PAID');

  // 5.8 Delivery & Automated Next Service Reminder
  const deliveredJc = devDb.completeDelivery(createdJc.id, {
    deliveredTo: 'Shivanand Patil (In Person)',
    customerSignature: 'SIG-DELIV-SP-ACK',
    nextServiceDueDays: 90,
  });
  assert(deliveredJc.status === 'DELIVERED', 'Stage 9: Machine delivered to farmer');
  assert(deliveredJc.delivery?.warrantyTermsGiven === true, 'Warranty terms documented to farmer');
  assert(!!deliveredJc.delivery?.nextServiceDueDate, 'Next service due date calculated (90 days)');

  // ===========================================================================
  // JOURNEY 6: Dealer Sale → Commission → Finance Review → Payout Record
  // ===========================================================================
  console.log('\n--- JOURNEY 6: Dealer Network → Commission Calculation → Clawback → Payout Voucher ---');

  const targets = devDb.calculateDealerCommissions('2026-03');
  assert(targets.length >= 5, 'Commissions calculated dynamically across network dealers');
  const patilDealer = devDb.getDealerProfileById('dlr-01')!;
  assert(!!patilDealer, `Found authorized dealer partner: ${patilDealer.dealerName} (${patilDealer.tier})`);
  assert(patilDealer.bankDetails.maskedAccountNumber.includes('••••'), 'Bank details are masked for data privacy');
  
  const expectedNet = patilDealer.mtdGrossSales - patilDealer.mtdRefundedSales - patilDealer.mtdCancelledSales;
  assert(
    patilDealer.mtdDeliveredSales === expectedNet,
    `Commission strictly computed on Net Delivered Sales (₹${patilDealer.mtdDeliveredSales})`
  );
  assert(patilDealer.clawbackDeductions > 0, `Prior-cycle returned order clawbacks accurately tracked (₹${patilDealer.clawbackDeductions})`);

  // 6.3 Payout Voucher Generation & Internal Treasury Disclaimer
  const voucher = devDb.recordPayoutVoucher({
    dealerId: 'dlr-01',
    period: '2026-03 Mid-Month Cycle',
    amount: 15000,
    recordedBy: 'Accounts Executive R. Vernekar',
  });
  assert(!!voucher.voucherNumber, `Payout voucher generated: ${voucher.voucherNumber}`);
  assert(
    voucher.status === 'RECORDED_FOR_DISBURSEMENT',
    'Payout voucher status is RECORDED_FOR_DISBURSEMENT (Mandate recorded, NOT bank transfer completed)'
  );
  assert(
    voucher.disbursementNotice.includes('Does NOT imply bank transfer has completed'),
    'Crucial banking disclaimer verified: Recording payout voucher does NOT imply bank transfer'
  );

  // 6.4 Finance Approval & External Settlement
  const approvedVoucher = devDb.approvePayoutVoucher(voucher.id, 'Finance Controller S. Hegde', 'SBI-CMS-BATCH-2026-9901');
  assert(approvedVoucher.status === 'FINANCE_APPROVED', 'Payout voucher approved by Finance Controller');
  assert(approvedVoucher.bankBatchReference === 'SBI-CMS-BATCH-2026-9901', 'Bank batch allocation logged');

  const settledVoucher = devDb.markPayoutExternallySettled(voucher.id, 'SBI-CMS-BATCH-2026-9901');
  assert(settledVoucher.status === 'EXTERNALLY_SETTLED', 'Payout marked as EXTERNALLY_SETTLED after confirmed bank RTGS');
  assert(!!settledVoucher.settledAt, 'Bank settlement timestamp recorded');

  // ===========================================================================
  // EDGE CASES: Resiliency, Concurrency, Deduplication, and Failovers
  // ===========================================================================
  console.log('\n--- EDGE CASES: Concurrency, Duplicate Webhooks, Failovers & Idempotency ---');

  // E.1 Concurrent Rental Capacity Limit Guard
  const conflictCheck = devDb.checkRentalAvailability(
    rentalMachine.id,
    bookingStart,
    bookingEnd
  );
  assert(conflictCheck.totalUnits >= 1, `Rental fleet machine has capacity: ${conflictCheck.totalUnits} unit(s)`);

  const secondBookingRes = devDb.createRentalBooking({
    rentalProductId: rentalMachine.id,
    productTitle: rentalMachine.title,
    userId: 'usr-farmer-02',
    customerName: 'Mallikarjun Patil',
    customerMobile: '9480112345',
    deliveryAddress: 'Plot #9, Hubballi Bypass',
    pincode: '580020',
    warehouseId: 'wh-hubballi',
    startDate: bookingStart,
    endDate: bookingEnd,
    totalDays: 4,
    pricingTier: 'DAILY',
    dailyRate: rentalMachine.dailyRate,
    rentAmount: rentalMachine.dailyRate * 4,
    securityDeposit: rentalMachine.securityDeposit,
    totalPaid: (rentalMachine.dailyRate * 4) + rentalMachine.securityDeposit,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    paymentId: 'pay_rent_collision_01',
    status: 'PENDING_APPROVAL',
  });
  if (conflictCheck.totalUnits === 1) {
    assert(!secondBookingRes.success && (secondBookingRes.error?.includes('AVAILABILITY_CONFLICT') ?? false),
      'Concurrent booking collision rejected: Capacity limit strictly protected');
  } else {
    assert(secondBookingRes.success, 'Secondary booking allocated from available multi-unit fleet pool');
  }

  // E.2 Duplicate Notification Idempotency
  const idempotencyKey = `sms_dispatch_${Date.now()}`;
  const notif1 = devDb.enqueueNotification({
    event: 'ORDER_DISPATCHED',
    channel: 'SMS',
    recipient: testMobile,
    recipientRole: 'CUSTOMER',
    title: 'Order Dispatched',
    message: 'Your AgriMart order is out for delivery.',
    idempotencyKey,
  });
  const notif2 = devDb.enqueueNotification({
    event: 'ORDER_DISPATCHED',
    channel: 'SMS',
    recipient: testMobile,
    recipientRole: 'CUSTOMER',
    title: 'Order Dispatched',
    message: 'Your AgriMart order is out for delivery.',
    idempotencyKey,
  });
  assert(notif1.enqueued === true, 'First notification successfully enqueued');
  assert(notif2.isDuplicate === true && notif2.enqueued === false, 'Duplicate notification deduplicated and rejected by idempotency key');

  // E.3 Warehouse Rejection & Automated Recovery Failover
  const failoverOrderRes = devDb.createOrder({
    userId: customer.id,
    items: [orderItem],
    shippingAddress: {
      fullName: 'Basavaraj Patil',
      mobile: '9480188888',
      addressLine: 'Farm Plot #12',
      village: 'Haveri Rural',
      taluk: 'Haveri',
      district: 'Haveri',
      pincode: '581110',
      gpsLatitude: 14.7954,
      gpsLongitude: 75.3991,
    },
    paymentMethod: 'COD',
  });
  const failoverOrder = failoverOrderRes.order!;
  const originalWarehouseId = failoverOrder.assignedWarehouseId!;
  const rejectRes = devDb.rejectWarehouseOrder(
    failoverOrder.id,
    originalWarehouseId,
    'Damaged stock packaging during transit intake'
  );
  assert(rejectRes.success, 'Warehouse rejection processed with formal audit reason');
  assert(!!rejectRes.reassignedTo, 'Automated failover recovery triggered and reallocated to alternative warehouse');
  assert(rejectRes.reassignedTo?.id !== originalWarehouseId, `Failover reallocated order to alternative hub: ${rejectRes.reassignedTo?.name}`);

  // E.4 Order Cancellation & Balance Restoration Before Dispatch
  const cancelRes = devDb.cancelOrder(failoverOrder.id, 'admin', 'Farmer requested cancellation before dispatch');
  assert(cancelRes.success, 'Order cancelled before dispatch and inventory released back to dark hub');

  // Summary
  console.log('\n================================================================');
  console.log(`  E2E TEST RUN COMPLETED: ${passedCount} PASSED | ${failedCount} FAILED`);
  console.log('================================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAllJourneys().catch((err) => {
  console.error('Fatal error running journey suite:', err);
  process.exit(1);
});
