export type RepairStage =
  | 'PRODUCT_RECEIVED'
  | 'INSPECTION'
  | 'ESTIMATE'
  | 'CUSTOMER_APPROVAL'
  | 'REPAIR'
  | 'QUALITY_CHECK'
  | 'CLEANING'
  | 'BILLING'
  | 'DELIVERED';

export type WarrantyStatus = 'IN_WARRANTY' | 'OUT_OF_WARRANTY' | 'EXPIRED' | 'AMC_COVERED';

export type PowerType =
  | '2-Stroke Petrol'
  | '4-Stroke Petrol'
  | 'Diesel Engine'
  | '12V Battery Electric'
  | '220V Electric Motor';

export interface DbCustomerEquipment {
  id: string;
  serialNumber: string;
  modelName: string;
  category: string;
  brand: string;
  engineMotorNumber: string;
  powerType: PowerType;
  purchaseDate: string;
  purchaseDealerId: string;
  purchaseDealerName: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyStatus: WarrantyStatus;
  amcDetails?: {
    contractNumber: string;
    validUntil: string;
    coverageType: string;
  };
  usageHours: number;
  customerId: string;
  customerName: string;
  customerMobile: string;
  customerVillage: string;
  serviceHistoryCount: number;
  createdAt: string;
}

export interface InspectionChecklistItem {
  item: string;
  category: string;
  status: 'Good' | 'Repair' | 'Replace' | 'N/A';
  notes?: string;
}

export interface EstimatePartItem {
  partId: string;
  partNumber: string;
  name: string;
  qty: number;
  unitPrice: number;
  gstRate: number; // e.g. 18
  total: number;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface EstimateLabourItem {
  labourId: string;
  operationCode: string;
  description: string;
  standardHours: number;
  hourlyRate: number;
  total: number;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface JobCardQualityCheck {
  testRunPassed: boolean;
  fuelBatteryChecked: boolean;
  bladeAlignmentChecked: boolean;
  sprayPressureChecked: boolean;
  leakageCheckPassed: boolean;
  cleaningVerified: boolean;
  inspectorNotes: string;
  inspectorName: string;
  inspectorApprovalDate?: string;
  isPassed: boolean;
}

export interface JobCardInvoice {
  invoiceNumber: string;
  invoiceDate: string;
  partsTaxable: number;
  labourTaxable: number;
  cgstAmount: number;
  sgstAmount: number;
  totalTax: number;
  discountAmount: number;
  finalPayable: number;
  paymentMode: 'CASH' | 'UPI' | 'CARD' | 'DEALER_CREDIT';
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIALLY_PAID';
  transactionRef?: string;
}

export interface DbJobCard {
  id: string;
  jobCardNumber: string;
  equipmentId: string;
  serialNumber: string;
  equipmentModel: string;
  category: string;
  brand: string;
  engineMotorNumber: string;
  powerType: PowerType;
  usageHours: number;
  warrantyStatus?: WarrantyStatus;

  customerId: string;
  customerName: string;
  customerMobile: string;
  customerVillage: string;

  dealerId: string;
  dealerName: string;
  serviceCentreName: string;

  assignedTechnicianId: string;
  assignedTechnicianName: string;
  serviceBayNumber: string; // e.g. "Bay 1 - Tillers"
  workTiming: {
    estimatedHours: number;
    actualStartTime?: string;
    actualEndTime?: string;
    durationMinutes?: number;
  };

  status: RepairStage;
  stageTimestamps: Partial<Record<RepairStage, string>>;

  complaints: string[];
  intakePhotos: string[];
  accessoriesReceived: string[];
  fuelOrBatteryLevel: string; // e.g. "75% Battery" or "Half Tank"
  expectedDeliveryDate: string;
  customerSignatureAtIntake: string; // Digital signature token or code

  inspectionChecklist: InspectionChecklistItem[];
  diagnosisNotes: string;
  rootCauseCategory: string;

  partsRequired: EstimatePartItem[];
  labourRequired: EstimateLabourItem[];

  estimate: {
    partsSubtotal: number;
    labourSubtotal: number;
    estimatedTax: number;
    estimatedTotal: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';
    approvalDate?: string;
    customerSignature?: string;
    rejectionReason?: string;
  };

  qualityCheck: JobCardQualityCheck;
  invoice?: JobCardInvoice;

  warrantyClaim?: {
    isWarrantyClaim: boolean;
    claimId?: string;
    claimStatus?: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'ESCALATED_TO_HQ';
    claimAmount?: number;
    partsCovered?: string[];
    failureType?: string;
    hqEscalationReason?: string;
    hqApprovedBy?: string;
    hqApprovalDate?: string;
  };

  delivery?: {
    deliveredAt?: string;
    deliveredTo: string;
    customerAckSignature?: string;
    warrantyTermsGiven: boolean;
    nextServiceDueDate: string;
    nextServiceHours: number;
  };

  nextServiceReminder?: {
    dueDate: string;
    reminderSent: boolean;
    reminderChannel?: 'SMS' | 'WHATSAPP' | 'EMAIL';
    reminderLog?: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface DbSparePart {
  id: string;
  partNumber: string;
  name: string;
  category: string;
  compatibleModels: string[];
  purchasePrice: number;
  sellingPrice: number; // MRP
  stockQuantity: number;
  reorderLevel: number;
  supplierName: string;
  storeRackLocation: string;
  warehouseId?: string;
  dealerId?: string;
  updatedAt: string;
}

export interface DbSparePartTransaction {
  id: string;
  partId: string;
  partNumber: string;
  partName: string;
  transactionType: 'STOCK_IN' | 'STOCK_OUT' | 'INTER_TRANSFER' | 'RETURN' | 'DAMAGED_WRITE_OFF';
  quantity: number;
  sourceLocation: string;
  destinationLocation: string;
  reason: string;
  referenceJobCardId?: string;
  loggedBy: string;
  timestamp: string;
}

export interface DbLabourOperation {
  id: string;
  operationCode: string;
  name: string;
  category: string;
  standardHours: number;
  baseRatePerHour: number;
  standardCharge: number;
  gstRate: number;
}

export interface DbWarrantyClaim {
  id: string;
  claimNumber: string;
  jobCardId: string;
  jobCardNumber: string;
  dealerId: string;
  dealerName: string;
  equipmentSerial: string;
  equipmentModel: string;
  claimAmount: number;
  failureDescription: string;
  partsReplaced: string[];
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'ESCALATED_TO_HQ';
  isEscalatedToHQ: boolean;
  hqEscalationReason?: string;
  hqRemarks?: string;
  settlementDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbServiceReminder {
  id: string;
  jobCardId: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  equipmentModel: string;
  equipmentSerial: string;
  reminderType: 'NEXT_SERVICE' | 'SEASONAL_MAINTENANCE' | 'WARRANTY_EXPIRY' | 'AMC_RENEWAL';
  scheduledDate: string;
  channel: 'SMS' | 'WHATSAPP' | 'EMAIL';
  status: 'PENDING' | 'SENT' | 'DISMISSED';
  dispatchedAt?: string;
  messageContent: string;
}

// ----------------------------------------------------
// FINANCE COMMISSION TYPES
// ----------------------------------------------------

export type DealerTierName = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface DealerTierConfig {
  tier: DealerTierName;
  baseRatePercent: number;
  bonusRatePercent: number;
  minMonthlyTarget: number;
}

export interface DbDealerProfile {
  id: string;
  dealerCode: string;
  businessName: string;
  proprietorName: string;
  contactPhone: string;
  email: string;
  region: string;
  district: string;
  tier: DealerTierName;
  gstin: string;
  pan: string;
  bankDetails: {
    bankName: string;
    branch: string;
    maskedAccountNumber: string; // e.g. "•••• •••• 8921"
    ifsc: string;
    accountHolderName: string;
  };
  monthlyTarget: number;
  // Current monthly sales reconciliation:
  mtdGrossSales: number;
  mtdRefundedSales: number;
  mtdCancelledSales: number;
  mtdDeliveredSales: number; // Gross - Refunds - Cancelled
  earnedBaseCommission: number;
  earnedTargetBonus: number;
  totalEarnedCommission: number;
  clawbackDeductions: number; // Deductions for refunds from previous paid cycles
  pendingPayoutBalance: number;
  disbursedLifetime: number;
  serviceCentreName: string;
  serviceRating: number;
  activeJobCardsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DbCommissionTarget {
  id: string;
  dealerId: string;
  dealerCode: string;
  period: string; // e.g. "2026-03"
  targetSales: number;
  grossSales: number;
  refundedSales: number;
  cancelledSales: number;
  netDeliveredSales: number;
  achievementPercent: number;
  isTargetAchieved: boolean;
  baseRatePercent: number;
  bonusRatePercent: number;
  baseCommission: number;
  bonusCommission: number;
  refundClawback: number;
  netPayableCommission: number;
  status: 'OPEN' | 'RECONCILED' | 'LOCKED';
  updatedAt: string;
}

export type PayoutStatus =
  | 'VOUCHER_DRAFT'
  | 'FINANCE_APPROVED'
  | 'RECORDED_FOR_DISBURSEMENT'
  | 'EXTERNALLY_SETTLED';

export interface DbPayoutRecord {
  id: string;
  voucherNumber: string;
  dealerId: string;
  dealerCode: string;
  businessName: string;
  period: string;
  amount: number;
  breakdown: {
    netSales: number;
    baseCommission: number;
    bonusCommission: number;
    clawbackDeductions: number;
    tdsDeduction: number; // 5% TDS u/s 194H
    netPayable: number;
  };
  status: PayoutStatus;
  disbursementNotice: string;
  bankBatchReference?: string;
  financeApprover?: string;
  approvedAt?: string;
  recordedBy: string;
  recordedAt: string;
  settledAt?: string;
}

export interface DbFinanceAuditLog {
  id: string;
  entityType: 'DEALER_TIER' | 'SALES_TARGET' | 'COMMISSION_CLAWBACK' | 'PAYOUT_VOUCHER' | 'COMMISSION_RATE';
  entityId: string;
  action: string;
  previousValue: string;
  newValue: string;
  performedBy: string;
  reason: string;
  timestamp: string;
}
