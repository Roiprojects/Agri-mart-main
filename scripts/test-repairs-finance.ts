import { devDb } from '../src/lib/dev-db';

async function runRepairsAndFinanceVerification() {
  console.log('\n========================================================');
  console.log('  AGRI MART MEGA: REPAIR & FINANCE MODULE TEST SUITE');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: any, testName: string, detail?: string) {
    if (Boolean(condition)) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // TEST SUITE 1: CUSTOMER EQUIPMENT REGISTRY & WARRANTY
  // ----------------------------------------------------
  console.log('--- SUITE 1: Equipment Registry & Warranty ---');
  const equipments = devDb.getCustomerEquipments();
  assert(equipments.length >= 4, 'Equipment registry contains baseline seed equipment', `Found ${equipments.length}`);

  const weeder = devDb.getCustomerEquipmentBySerial('AP7001-2025-9482');
  assert(!!weeder, 'Found equipment by serial number AP7001-2025-9482');
  assert(weeder?.category === 'Power Weeder', 'Equipment category is Power Weeder');
  assert(weeder?.powerType === '4-Stroke Petrol', 'Equipment power type is 4-Stroke Petrol');
  assert(weeder?.warrantyStatus === 'AMC_COVERED', 'Equipment warranty status is AMC_COVERED');
  assert(!!weeder?.amcDetails?.contractNumber, 'Equipment has active AMC contract number');

  // Register new equipment
  const newSerial = `TST-EQ-${Date.now().toString().slice(-4)}`;
  const savedEq = devDb.saveCustomerEquipment({
    serialNumber: newSerial,
    modelName: 'KisanKraft 5HP Diesel Tiller',
    category: 'Power Tiller',
    brand: 'KisanKraft',
    engineMotorNumber: 'ENG-DSL-5HP-99',
    powerType: 'Diesel Engine',
    usageHours: 15,
    customerName: 'Shankarappa Desai',
    customerMobile: '+91 98860 99881',
    customerVillage: 'Kittur, Belagavi',
  });
  assert(savedEq.serialNumber === newSerial, 'New customer equipment registered with serial number');
  assert(savedEq.warrantyStatus === 'IN_WARRANTY', 'New equipment default warranty is IN_WARRANTY');

  // ----------------------------------------------------
  // TEST SUITE 2: JOB CARD CREATION & 9-STAGE LIFECYCLE
  // ----------------------------------------------------
  console.log('\n--- SUITE 2: Job Card Creation & 9-Stage Pipeline ---');
  const initialJobCards = devDb.getJobCards();
  assert(initialJobCards.length >= 8, 'Job card repository contains seed job cards');

  // 2.1 Create Job Card (Intake Stage 1: PRODUCT_RECEIVED)
  const createdJc = devDb.createJobCard({
    customerName: 'Shankarappa Desai',
    customerMobile: '+91 98860 99881',
    customerVillage: 'Kittur, Belagavi',
    equipmentModel: 'KisanKraft 5HP Diesel Tiller',
    serialNumber: newSerial,
    category: 'Power Tiller',
    powerType: 'Diesel Engine',
    usageHours: 15,
    complaints: ['Engine surging at full throttle', 'Tiller blade loose on hex axle'],
    accessoriesReceived: ['Extra Shear Pin Set', 'Tiller Transport Wheel'],
    fuelOrBatteryLevel: '80% Diesel',
    expectedDeliveryDate: '2026-03-25',
    customerSignatureAtIntake: 'SIG-INTAKE-SD-9988',
  });

  assert(!!createdJc.jobCardNumber, `Job card created with formal number: ${createdJc.jobCardNumber}`);
  assert(createdJc.status === 'PRODUCT_RECEIVED', 'Job card initial stage is PRODUCT_RECEIVED');
  assert(!!createdJc.stageTimestamps.PRODUCT_RECEIVED, 'Timestamp logged for PRODUCT_RECEIVED stage');
  assert(createdJc.complaints.length === 2, 'Multiple complaints logged accurately');
  assert(createdJc.accessoriesReceived.length === 2, 'Accessories received recorded');

  // 2.2 Stage 2: INSPECTION
  const adv1 = devDb.advanceRepairStage(createdJc.id, 'INSPECTION');
  assert(adv1.success && adv1.jobCard?.status === 'INSPECTION', 'Advanced to Stage 2: INSPECTION');
  assert(!!adv1.jobCard?.stageTimestamps.INSPECTION, 'Timestamp logged for INSPECTION stage');

  // 2.3 Stage 3: ESTIMATE GENERATION
  const updatedDiag = devDb.updateDiagnosisAndEstimates(createdJc.id, {
    diagnosisNotes: 'Diesel injector nozzle carbon encrusted. Tiller axle retaining cotter pin fractured.',
    rootCauseCategory: 'High particulate diesel fuel and stone impact',
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

  assert(updatedDiag.estimate.partsSubtotal === 180, 'Estimate parts subtotal calculated');
  assert(updatedDiag.estimate.labourSubtotal === 350, 'Estimate labour subtotal calculated');
  assert(updatedDiag.estimate.estimatedTax === 95, 'Estimate 18% GST calculated (180+350)*0.18 = 95');
  assert(updatedDiag.estimate.estimatedTotal === 595, 'Estimate total with discount calculated (180+350+95-30 = 595)');

  // Advance to ESTIMATE
  const adv2 = devDb.advanceRepairStage(createdJc.id, 'ESTIMATE');
  assert(adv2.success && adv2.jobCard?.status === 'ESTIMATE', 'Advanced to Stage 3: ESTIMATE');

  // 2.4 Test Stage Validation: Cannot advance to REPAIR before estimate approval
  const invalidAdvance = devDb.advanceRepairStage(createdJc.id, 'REPAIR');
  assert(
    !invalidAdvance.success && invalidAdvance.message.includes('Customer Approval'),
    'Stage guard enforced: Cannot proceed to REPAIR without Customer Estimate Approval'
  );

  // 2.5 Stage 4: CUSTOMER_APPROVAL (Partial Approval Test)
  const approvedJc = devDb.updateEstimateDecision(createdJc.id, 'APPROVED', {
    customerSignature: 'SIG-DIGITAL-SD-OK',
  });
  assert(approvedJc.estimate.status === 'APPROVED', 'Customer estimate approved');
  assert(approvedJc.status === 'CUSTOMER_APPROVAL', 'Job card status transitioned to CUSTOMER_APPROVAL');
  assert(!!approvedJc.estimate.approvalDate, 'Customer approval timestamp logged');

  // 2.6 Technician & Bay Assignment
  const assignedJc = devDb.assignTechnicianAndBay(
    createdJc.id,
    'tech-01',
    'Raju Hadapad',
    'Bay 1 - Power Tillers',
    2.0
  );
  assert(assignedJc.assignedTechnicianName === 'Raju Hadapad', 'Technician assigned');
  assert(assignedJc.serviceBayNumber === 'Bay 1 - Power Tillers', 'Service bay assigned');

  // 2.7 Stage 5: REPAIR (Triggers automatic parts inventory deduction)
  const plugBefore = devDb.getSpareParts().find((p) => p.partNumber === 'SP-PLUG-NGK')?.stockQuantity || 0;
  const adv3 = devDb.advanceRepairStage(createdJc.id, 'REPAIR');
  assert(adv3.success && adv3.jobCard?.status === 'REPAIR', 'Advanced to Stage 5: REPAIR');
  const plugAfter = devDb.getSpareParts().find((p) => p.partNumber === 'SP-PLUG-NGK')?.stockQuantity || 0;
  assert(plugAfter === plugBefore - 1, 'Spare parts stock auto-deducted upon entering REPAIR stage');

  // 2.8 Stage 6: QUALITY_CHECK
  const adv4 = devDb.advanceRepairStage(createdJc.id, 'QUALITY_CHECK');
  assert(adv4.success && adv4.jobCard?.status === 'QUALITY_CHECK', 'Advanced to Stage 6: QUALITY_CHECK');

  // 2.9 Test Stage Validation: Cannot advance to BILLING before Quality Check pass
  const invalidBill = devDb.advanceRepairStage(createdJc.id, 'BILLING');
  assert(
    !invalidBill.success && invalidBill.message.includes('Quality Inspector Sign-Off'),
    'Stage guard enforced: Cannot proceed to BILLING without Quality Inspector Sign-Off'
  );

  // Certify Quality Check
  const qcPassed = devDb.completeQualityInspection(createdJc.id, {
    testRunPassed: true,
    fuelBatteryChecked: true,
    bladeAlignmentChecked: true,
    sprayPressureChecked: true,
    leakageCheckPassed: true,
    cleaningVerified: true,
    inspectorNotes: 'Test bed run certified at full engine throttle. Output shaft true.',
    inspectorName: 'S. Kulkarni',
    isPassed: true,
  });
  assert(qcPassed.qualityCheck.isPassed, 'Quality Inspector sign-off completed');
  assert(qcPassed.status === 'CLEANING', 'QC Pass automatically advanced job card to Stage 7: CLEANING');

  // 2.10 Stage 8: BILLING (GST Tax Workshop Invoice)
  const invoicedJc = devDb.generateJobCardInvoice(createdJc.id, {
    discountAmount: 25,
    paymentMode: 'UPI',
    paymentStatus: 'PAID',
    transactionRef: 'UPI-SBI-2026-991823',
  });
  assert(invoicedJc.status === 'BILLING', 'Advanced to Stage 8: BILLING');
  assert(!!invoicedJc.invoice?.invoiceNumber, `Invoice generated: ${invoicedJc.invoice?.invoiceNumber}`);
  assert(invoicedJc.invoice?.cgstAmount === invoicedJc.invoice?.sgstAmount, 'CGST 9% and SGST 9% split equally');
  assert(invoicedJc.invoice?.paymentStatus === 'PAID', 'Payment status marked as PAID via UPI');

  // 2.11 Stage 9: DELIVERED (Handover & Next-Service Scheduling)
  const deliveredJc = devDb.completeDelivery(createdJc.id, {
    deliveredTo: 'Shankarappa Desai (In Person)',
    customerSignature: 'SIG-DELIV-SD-ACK',
    nextServiceDueDays: 90,
  });
  assert(deliveredJc.status === 'DELIVERED', 'Advanced to Stage 9: DELIVERED');
  assert(deliveredJc.delivery?.warrantyTermsGiven === true, 'Warranty terms documented to farmer');
  assert(!!deliveredJc.delivery?.nextServiceDueDate, 'Next service due date calculated (90 days)');
  assert(deliveredJc.nextServiceReminder?.reminderSent === false, 'Next service reminder queued in notification matrix');

  // ----------------------------------------------------
  // TEST SUITE 3: SPARE PARTS INVENTORY & LEDGER
  // ----------------------------------------------------
  console.log('\n--- SUITE 3: Spare Parts Inventory & Ledger ---');
  const parts = devDb.getSpareParts();
  assert(parts.length >= 8, 'Spare parts inventory catalog loaded');

  const lowStockParts = parts.filter((p) => p.stockQuantity <= p.reorderLevel);
  assert(lowStockParts.length >= 1, 'Low stock threshold detection active (found items below reorder limit)');

  // Record Stock In Transaction
  const carbPart = parts.find((p) => p.partNumber === 'SP-CARB-7HP');
  const carbBefore = carbPart?.stockQuantity || 0;
  const stockTx = devDb.recordSparePartTransaction({
    partId: carbPart!.id,
    partNumber: carbPart!.partNumber,
    partName: carbPart!.name,
    transactionType: 'STOCK_IN',
    quantity: 10,
    sourceLocation: 'Supplier: Keihin Fuel Systems',
    destinationLocation: 'Hubballi Store Rack B-02',
    reason: 'Replenishment for power weeder spring season',
    loggedBy: 'Service Store Manager Ramesh',
  });
  assert(stockTx.quantity === 10, 'Stock-In transaction recorded in ledger');
  const carbAfter = devDb.getSpareParts().find((p) => p.partNumber === 'SP-CARB-7HP')?.stockQuantity || 0;
  assert(carbAfter === carbBefore + 10, 'Spare part inventory quantity increased by 10');

  // Inter-hub Transfer
  const transferTx = devDb.transferSpareParts(
    carbPart!.id,
    2,
    'Hubballi Store Rack B-02',
    'Belagavi Machinery Hub',
    'Urgent field repair request',
    'Store Supervisor Anand'
  );
  assert(transferTx.transactionType === 'INTER_TRANSFER', 'Inter-hub transfer recorded');

  // ----------------------------------------------------
  // TEST SUITE 4: CONFIGURABLE LABOUR CATALOGUE
  // ----------------------------------------------------
  console.log('\n--- SUITE 4: Configurable Labour Catalogue ---');
  const catalogue = devDb.getLabourCatalogue();
  assert(catalogue.length >= 6, 'Standard labour operations catalogue loaded');

  const genOp = catalogue.find((l) => l.operationCode === 'LBR-GEN-01');
  assert(typeof genOp?.baseRatePerHour === 'number' && genOp.baseRatePerHour >= 300, 'Standard hourly rate configured');

  // Update operation
  const updatedOp = devDb.updateLabourOperation(genOp!.id, {
    baseRatePerHour: 380,
  });
  assert(updatedOp.baseRatePerHour === 380, 'Labour operation hourly rate updated dynamically');
  assert(updatedOp.standardCharge === 380, 'Standard charge recalculated based on standard hours');

  // ----------------------------------------------------
  // TEST SUITE 5: WARRANTY CLAIMS & HQ ESCALATION
  // ----------------------------------------------------
  console.log('\n--- SUITE 5: Warranty Claims & HQ Escalation ---');
  const claims = devDb.getWarrantyClaims();
  assert(claims.length >= 2, 'Warranty claims loaded');

  // Create warranty claim
  const claim = devDb.createWarrantyClaim({
    jobCardId: createdJc.id,
    jobCardNumber: createdJc.jobCardNumber,
    dealerId: 'dlr-01',
    dealerName: 'Patil Kisan Seva Kendra',
    equipmentSerial: newSerial,
    equipmentModel: 'KisanKraft 5HP Diesel Tiller',
    claimAmount: 6500,
    failureDescription: 'Diesel fuel injection pump seized due to internal manufacturing plunger scoring',
    partsReplaced: ['DIESEL-INJ-PUMP-5HP'],
    status: 'SUBMITTED',
    isEscalatedToHQ: false,
  });
  assert(!!claim.claimNumber, `Warranty claim created: ${claim.claimNumber}`);

  // Escalate to HQ because claim > ₹5,000 threshold
  const escalatedClaim = devDb.escalateWarrantyClaimToHQ(
    claim.id,
    'Injection pump seizure exceeds dealer approval limit of ₹5,000. Requesting Central HQ factory warranty authorization.',
    'Workshop Manager (Patil Kendra)'
  );
  assert(escalatedClaim.status === 'ESCALATED_TO_HQ', 'Claim status is ESCALATED_TO_HQ');
  assert(escalatedClaim.isEscalatedToHQ === true, 'isEscalatedToHQ flag set to true');

  // HQ Approval
  const approvedClaim = devDb.resolveWarrantyClaim(
    claim.id,
    'APPROVED',
    'Factory metallurgical report confirms sub-surface plunger porosity. 100% warranty credit authorized.',
    'Central Warranty Board Bangalore'
  );
  assert(approvedClaim.status === 'APPROVED', 'Warranty claim approved by Central HQ');
  assert(!!approvedClaim.settlementDate, 'Warranty settlement timestamp recorded');

  // ----------------------------------------------------
  // TEST SUITE 6: FINANCE COMMISSIONS & REFUND CLAWBACKS
  // ----------------------------------------------------
  console.log('\n--- SUITE 6: Finance Commissions & Refund Clawbacks ---');
  const targets = devDb.calculateDealerCommissions('2026-03');
  assert(targets.length >= 5, 'Commission calculated for all network dealers');

  const dealer1 = devDb.getDealerProfileById('dlr-01');
  assert(!!dealer1, 'Found dealer profile dlr-01 (Patil Kisan Seva Kendra)');
  assert(dealer1?.tier === 'PLATINUM', 'Dealer contract tier is PLATINUM');
  assert(dealer1?.bankDetails.maskedAccountNumber.includes('••••'), 'Bank details are masked for data privacy');

  // Verify Net Delivered Sales Formula: Gross - Refunds - Cancelled
  const expectedNet = dealer1!.mtdGrossSales - dealer1!.mtdRefundedSales - dealer1!.mtdCancelledSales;
  assert(
    dealer1!.mtdDeliveredSales === expectedNet,
    `Net Delivered Sales strictly equals Gross (₹${dealer1!.mtdGrossSales}) - Refunds (₹${dealer1!.mtdRefundedSales}) - Cancelled (₹${dealer1!.mtdCancelledSales}) = ₹${expectedNet}`
  );

  // Verify Clawback Deduction
  assert(dealer1!.clawbackDeductions > 0, 'Refund clawback deduction recorded for returned products from prior cycle');
  const targetRec1 = targets.find((t) => t.dealerId === 'dlr-01');
  assert(
    targetRec1?.refundClawback === dealer1!.clawbackDeductions,
    'Clawback deducted from gross commission in target reconciliation'
  );

  // Update Target
  const updatedDealer = devDb.updateDealerTarget('dlr-01', 2200000, 'Finance Controller S. Hegde');
  assert(updatedDealer.monthlyTarget === 2200000, 'Dealer monthly sales target updated');

  // ----------------------------------------------------
  // TEST SUITE 7: FINANCE PAYOUT VOUCHERS & BANK DISCLAIMER
  // ----------------------------------------------------
  console.log('\n--- SUITE 7: Payout Vouchers & Bank Disclaimer ---');
  const vouchersBefore = devDb.getPayoutRecords().length;

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
    'Crucial bank disclaimer verified: Recording payout does not imply bank transfer execution'
  );

  // Finance Approval
  const approvedVoucher = devDb.approvePayoutVoucher(voucher.id, 'Finance Controller S. Hegde', 'SBI-CMS-BATCH-2026-9901');
  assert(approvedVoucher.status === 'FINANCE_APPROVED', 'Payout voucher approved by Finance Controller');
  assert(approvedVoucher.bankBatchReference === 'SBI-CMS-BATCH-2026-9901', 'Bank batch allocation logged');

  // Mark External Settlement
  const settledVoucher = devDb.markPayoutExternallySettled(voucher.id, 'SBI-CMS-BATCH-2026-9901');
  assert(settledVoucher.status === 'EXTERNALLY_SETTLED', 'Payout marked as EXTERNALLY_SETTLED after confirmed bank RTGS');
  assert(!!settledVoucher.settledAt, 'Bank settlement timestamp recorded');

  // Verify Audit Log
  const auditLogs = devDb.getFinanceAuditLogs();
  const voucherAudit = auditLogs.find((l) => l.entityId === voucher.id);
  assert(!!voucherAudit, 'Financial audit log generated for payout voucher operations');

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n========================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runRepairsAndFinanceVerification().catch((err) => {
  console.error('Fatal test runner failure:', err);
  process.exit(1);
});
