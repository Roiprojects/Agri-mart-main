import fs from 'fs';
import path from 'path';
import { calculateDistanceKm } from './warehouse-assignment';
export * from './repair-finance-types';
import {
  DbCustomerEquipment,
  DbJobCard,
  DbSparePart,
  DbSparePartTransaction,
  DbLabourOperation,
  DbWarrantyClaim,
  DbServiceReminder,
  DbDealerProfile,
  DbCommissionTarget,
  DbPayoutRecord,
  DbFinanceAuditLog,
  RepairStage,
  InspectionChecklistItem,
  JobCardQualityCheck,
  JobCardInvoice,
  EstimatePartItem,
  EstimateLabourItem,
} from './repair-finance-types';
import { getInitialRepairFinanceData } from './repair-finance-data';
import { getInitialGalleryAndBlogData } from './gallery-blog-data';
import agrimartCatalogue from '../data/agrimart-catalogue.json';

export interface DbBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbCategory {
  id: string;
  name: string;
  nameKn?: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  displayOrder: number;
  published?: boolean;
  isPublished?: boolean;
  restrictFromVendors?: boolean;
  showOnHomePage?: boolean;
  allowCustomersToSelectPageSize?: boolean;
  pageSizeOptions?: string;
  priceRangeFiltering?: boolean;
  manuallyPriceRange?: boolean;
  priceFrom?: number;
  priceTo?: number;
  customerRoles?: string;
  limitedToStores?: string;
  seName?: string;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  variantName: string;
  price: number;
  comparePrice?: number;
  weightKg?: number;
  unit?: string;
  barcode?: string;
  isDefault: boolean;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface DbMedia {
  id: string;
  productId?: string;
  variantId?: string;
  url: string;
  altText?: string;
  type: 'IMAGE' | 'VIDEO';
  isPrimary: boolean;
  displayOrder: number;
  createdAt?: string;
}

export interface DbSpecification {
  id: string;
  productId: string;
  group: string;
  name: string;
  value: string;
  displayOrder: number;
}

export interface DbProduct {
  id: string;
  name: string;
  nameKn?: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description: string;
  brandId?: string;
  categoryId: string;
  parentCategoryId?: string;
  subCategoryId?: string;
  price: number;
  comparePrice?: number;
  isPublished: boolean;
  isDraft: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  targetCrops: string; // e.g. "Paddy, Cotton, Sugarcane"
  cropStages: string;  // e.g. "1, 2, 3"
  seName?: string;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  vendor?: string;
  requireOtherProducts?: boolean;
  allowCustomerReviews?: boolean;
  availableStartDate?: string;
  availableEndDate?: string;
  markAsNew?: boolean;
  adminComment?: string;
  customerRoles?: string;
  limitedToStores?: string;
  gtin?: string;
  manufacturerPartNumber?: string;
  showOnHomePage?: boolean;
  productType?: string;
  productTemplate?: string;
  visibleIndividually?: boolean;
  ageVerification?: boolean;
  cost?: number;
  disableBuyButton?: boolean;
  disableWishlistButton?: boolean;
  availableForPreOrder?: boolean;
  callForPrice?: boolean;
  customerEntersPrice?: boolean;
  pangvBasePriceEnabled?: boolean;
  taxExempt?: boolean;
  taxCategory?: string;
  isShippingEnabled?: boolean;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  freeShipping?: boolean;
  shipSeparately?: boolean;
  additionalShippingCharge?: number;
  deliveryDate?: string;
  isGiftCard?: boolean;
  giftCardType?: string;
  overriddenGiftCardAmount?: number | string;
  isRental?: boolean;
  rentalPeriodLength?: number | string;
  rentalPeriod?: string;
  // Imported Agrimart catalogue details
  riplCode?: string;
  sourceProductId?: string;
  descriptionHtml?: string;
  brandName?: string;
  priceNote?: string;
  variantLabel?: string;
  modelNumber?: string;
  stockQuantity?: number;
  availableQty?: number;
  maxOrderQty?: number;
  minOrderQty?: number;
  brochures?: { label: string; url: string; fileName?: string; available?: boolean }[];
  videos?: { url: string; type: 'mp4' | 'youtube'; fileName?: string; available?: boolean }[];
  accessoriesInfo?: string;
  accessoriesAvailable?: boolean;
  sparePartsAvailable?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbWarehouse {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  servicedPincodes: string;
  address: string;
  managerName: string;
  contactNumber: string;
  isActive: boolean;
  createdAt: string;
}

export interface DbWarehouseStock {
  id: string;
  warehouseId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  reservedQuantity: number;
  reorderThreshold: number;
}

export interface DbStockReservation {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  warehouseId: string;
  quantity: number;
  status: 'ACTIVE' | 'CONSUMED' | 'RELEASED';
  expiresAt: string;
  createdAt: string;
}

export interface DbUser {
  id: string;
  email?: string;
  mobile: string;
  name: string;
  role: string;
  passwordHash?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbCustomerAddress {
  id: string;
  userId: string;
  fullName: string;
  mobile: string;
  alternateMobile?: string;
  addressLine: string;
  landmark?: string;
  taluk: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbOrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  productName: string;
  variantTitle?: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  totalPrice: number;
}

export interface DbSplitShipment {
  shipmentId: string;
  orderId: string;
  warehouseId: string;
  warehouseName: string;
  itemIds: string[];
  trackingNumber: string;
  courierName: string;
  status: 'PENDING' | 'PACKED' | 'DISPATCHED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  createdAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
}

export interface DbAssignmentAuditLog {
  id: string;
  orderId: string;
  fromWarehouseId?: string;
  fromWarehouseName?: string;
  toWarehouseId: string;
  toWarehouseName: string;
  reason: string;
  changedBy: string;
  timestamp: string;
}

export interface DbRejectionRecord {
  warehouseId: string;
  warehouseName: string;
  reason: string;
  rejectedAt: string;
}

export interface DbCourierMilestone {
  milestone: 'ORDER_PLACED' | 'ALLOCATED' | 'PACKED' | 'DISPATCHED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  location: string;
  timestamp: string;
  description: string;
}

export interface DbOrder {
  id: string;
  orderNumber: string;
  userId: string;
  subtotalAmount: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  status: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'DISPATCHED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  assignedWarehouseId?: string;
  assignedWarehouseName?: string;
  assignmentMode: 'AUTO' | 'MANUAL';
  allocationStatus?: 'UNALLOCATED' | 'ALLOCATED' | 'ACCEPTED' | 'REJECTED' | 'HELD';
  isHold?: boolean;
  holdReason?: string;
  rejectionReason?: string;
  rejectionHistory?: DbRejectionRecord[];
  assignmentAuditLogs?: DbAssignmentAuditLog[];
  isSplitOrder?: boolean;
  splitShipments?: DbSplitShipment[];
  packingSlipNumber?: string;
  packedAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  estimatedDeliveryDate?: string;
  trackingMilestones?: DbCourierMilestone[];
  shippingAddress: any;
  trackingNumber?: string;
  courierName?: string;
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  couponId?: string;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbPayment {
  id: string;
  orderId: string;
  paymentNumber: string;
  provider: 'RAZORPAY' | 'COD' | 'WALLET';
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  idempotencyKey?: string;
  failureReason?: string;
  rawWebhookPayload?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbCoupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbReview {
  id: string;
  productId: string;
  productName?: string;
  userId: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  title: string;
  comment: string;
  replyText?: string;
  verifiedPurchase: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface DbProductTag {
  id: string;
  name: string;
  taggedProductsCount: number;
  productIds?: string[];
  createdAt?: string;
}

export interface DbProductAttribute {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  createdAt?: string;
}

export interface DbSpecificationAttribute {
  id: string;
  name: string;
  displayOrder: number;
  createdAt?: string;
}

export interface DbCheckoutAttribute {
  id: string;
  name: string;
  controlType: 'Dropdown' | 'RadioList' | 'Checkboxes' | 'TextBox';
  isRequired: boolean;
  displayOrder: number;
  createdAt?: string;
}

export interface DbCustomerNotification {
  id: string;
  userId?: string;
  channel: 'SMS' | 'WHATSAPP' | 'EMAIL' | 'IN_APP';
  recipient: string;
  event: string;
  title: string;
  message: string;
  status: string;
  sentAt: string;
}

export interface DbOtpToken {
  id: string;
  mobile: string;
  codeHash: string;
  expiresAt: string;
  verified: boolean;
  attempts: number;
  createdAt: string;
}

export interface DbRentalProduct {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  hourlyRate?: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  securityDeposit: number;
  images: string[];
  powerRating: string;
  suitableFor: string;
  fuelType: string;
  weightKg: number;
  totalUnits: number;
  availableUnits: number;
  specifications: Record<string, string>;
  createdAt: string;
}

export interface DbRentalBooking {
  id: string;
  bookingNumber: string;
  rentalProductId: string;
  productTitle: string;
  userId: string;
  customerName: string;
  customerMobile: string;
  deliveryAddress: string;
  pincode: string;
  warehouseId?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  rentalBasis?: 'HOURLY' | 'DAILY';
  totalHours?: number;
  hourlyRate?: number;
  preferredTimeSlot?: string;
  pricingTier: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  dailyRate: number;
  rentAmount: number;
  securityDeposit: number;
  totalPaid: number;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  paymentId?: string;
  status:
    | 'PENDING_APPROVAL'
    | 'APPROVED'
    | 'ACTIVE'
    | 'RETURNED_ON_TIME'
    | 'RETURNED_LATE'
    | 'RETURNED_DAMAGED'
    | 'CANCELLED';
  actualReturnDate?: string;
  lateDays?: number;
  lateFee?: number;
  damageNotes?: string;
  damageFee?: number;
  depositRefundAmount?: number;
  depositRefundStatus?: 'PENDING' | 'PROCESSED' | 'FORFEITED';
  createdAt: string;
  updatedAt: string;
}

export interface DbServiceBookingRequest {
  id: string;
  requestNumber: string;
  userId: string;
  customerName: string;
  customerMobile: string;
  serviceId: string;
  serviceName: string;
  jobWorkId?: string;
  jobWorkName?: string;
  bookingBasis?: 'HOURLY' | 'ACRE';
  bookingHours?: number;
  farmAcreage?: number;
  cropType?: string;
  district?: string;
  taluk?: string;
  village?: string;
  address: string;
  pincode: string;
  gpsLatitude: number;
  gpsLongitude: number;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  photoUrl?: string;
  status: 'REQUESTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedProviderId?: string;
  assignedProviderName?: string;
  assignedOperatorMobile?: string;
  assignedFleetUnit?: string;
  estimatedCost?: number;
  advancePaid?: number;
  paymentMethod?: string;
  paymentStatus?: 'PENDING' | 'PAID' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
}

export interface DbStockLedgerEntry {
  id: string;
  warehouseId: string;
  warehouseName: string;
  productId: string;
  productName: string;
  variantId?: string;
  type: 'STOCK_IN' | 'STOCK_OUT' | 'RESERVED' | 'RELEASED' | 'DISPATCHED' | 'DAMAGE_WRITEOFF' | 'RETURN_RESTOCK';
  quantity: number;
  balanceAfter: number;
  referenceId?: string;
  notes: string;
  performedBy: string;
  createdAt: string;
}

export interface DbFarmerProfile {
  id: string;
  userId?: string;
  farmerName: string;
  mobile: string;
  whatsappNumber?: string;
  village: string;
  taluk: string;
  district: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  totalAcreage: number;
  soilType: 'Black Cotton' | 'Red Sandy Loam' | 'Clayey Loam' | 'Alluvial Soil' | 'Laterite';
  primaryCrops: string[];
  currentCropStage: 'LAND_PREPARATION' | 'GERMINATION' | 'TILLERING_VEGETATIVE' | 'FLOWERING' | 'GRAIN_FORMATION' | 'HARVEST_READY';
  sowingDate: string;
  expectedHarvestDate: string;
  totalSpend: number;
  successfulOrdersCount: number;
  lastOrderDate?: string;
  assignedAgronomist?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbAgronomyFollowUp {
  id: string;
  farmerProfileId: string;
  farmerName: string;
  mobile: string;
  crop: string;
  cropStage: string;
  scheduledDate: string;
  purpose: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
  agronomistNotes?: string;
  assignedAgronomist: string;
  completedAt?: string;
  createdAt: string;
}

export interface DbProductUsageLog {
  id: string;
  farmerProfileId: string;
  orderId?: string;
  productId: string;
  productName: string;
  crop: string;
  quantityUsed: string;
  appliedDate: string;
  season: 'Kharif 2026' | 'Rabi 2026' | 'Summer 2026';
  notes?: string;
  createdAt: string;
}

export interface DbCropSectionPhoto {
  id: string;
  url: string; // Base64 data URL or uploaded URL
  fileName: string; // e.g. "ramesh-tomato-oct20.jpg"
  capturedAt: string; // ISO 8601 string
  stageName?: string;
  notes?: string;
  takenBy?: string;
  fileSizeBytes?: number;
}

export interface DbFarmerCropSection {
  sectionId: string; // e.g. "farmer-visit-photographs", "pest-disease-tracking"
  sectionName: string; // e.g. "Farmer Visit Photographs", "Pest & Disease Field Photos"
  photos: DbCropSectionPhoto[];
}

export interface DbFarmerCropEntry {
  cropId: string; // e.g. "primary", "crop-2", or uuid
  cropName: string; // e.g. "Tomato", "Chilli", "Maize"
  cropType?: string; // e.g. "Vegetables", "Field Crops"
  variety?: string; // e.g. "Arka Rakshak"
  cropAcreage: string | number; // e.g. "4", "4 Acres"
  gpsLocation?: string;
  gpsLatitude?: number | string;
  gpsLongitude?: number | string;
  plantingDate?: string;
  cropAge?: string;
  sections: DbFarmerCropSection[]; // separate named crop sections with their own images!
}

export interface DbFarmerCropGallery {
  id: string;
  farmerId: string; // Unique identifier or phone number
  farmerName: string; // 1st: Farmer Name (e.g. "XYZ", "Ramesh Kumar Gowda")
  mobileNumber?: string;
  totalAcreage: string | number; // Total farm acreage (e.g. "10", "10 Acres")
  totalCropsCount: number; // e.g. 3
  crops: DbFarmerCropEntry[]; // in that: total crop list, and inside each crop part: separate named crop sections with their own images!
  createdAt: string;
  updatedAt: string;
}

export type SalesLeadStage =
  | 'NEW'
  | 'ASSIGNED'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'FOLLOW_UP'
  | 'QUOTATION_SENT'
  | 'CONVERTED'
  | 'CLOSED';

export interface DbSalesLead {
  id: string;
  leadNumber: string;
  customerName: string;
  mobile: string;
  village: string;
  taluk: string;
  district: string;
  leadSource: 'WEBSITE' | 'AI_ADVISORY' | 'REFERRAL' | 'WHATSAPP' | 'FIELD_CAMP' | 'TOLL_FREE';
  aiHistoryId?: string;
  aiDiagnosisSummary?: string;
  interestedCategory?: string;
  interestedProductTitle?: string;
  estimatedValue: number;
  stage: SalesLeadStage;
  assignedExecutiveId: string;
  assignedExecutiveName: string;
  nextFollowUpDate?: string;
  remarks: string;
  communicationLog: { type: 'CALL' | 'WHATSAPP' | 'VISIT' | 'SMS'; note: string; timestamp: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface DbSalesVisit {
  id: string;
  leadId: string;
  leadNumber: string;
  farmerName: string;
  executiveId: string;
  executiveName: string;
  visitDate: string;
  gpsLatitude: number;
  gpsLongitude: number;
  cropObserved: string;
  acreage: number;
  visitSummary: string;
  outcome: 'FOLLOW_UP_REQUIRED' | 'PROPOSAL_SUBMITTED' | 'CLOSED_WON' | 'CLOSED_LOST';
  createdAt: string;
}

export interface DbSalesTarget {
  executiveId: string;
  executiveName: string;
  month: string;
  targetAmount: number;
  achievedAmount: number;
  leadsTarget: number;
  leadsConverted: number;
}

export interface DbNotificationQueueItem {
  id: string;
  idempotencyKey: string;
  event: string;
  channel: 'SMS' | 'WHATSAPP' | 'EMAIL' | 'PUSH';
  recipient: string;
  recipientRole: 'CUSTOMER' | 'WAREHOUSE_MANAGER' | 'SUPER_ADMIN' | 'SALES_EXECUTIVE' | 'AGRONOMIST';
  title: string;
  message: string;
  status: 'QUEUED' | 'PROCESSING' | 'SENT' | 'FAILED';
  attempts: number;
  maxRetries: number;
  lastError?: string;
  scheduledAt: string;
  sentAt?: string;
  metadata?: any;
}

export interface DbIntegrationConfig {
  id: 'gokwik' | 'eaadhaar' | 'calendly';
  name: string;
  category: string;
  description: string;
  status: 'SANDBOX_ACTIVE' | 'PENDING_PRODUCTION_KEY' | 'FALLBACK_MODE';
  endpointUrl: string;
  fallbackBehavior: string;
  lastPingTime: string;
  lastPingStatus: 'SUCCESS' | 'WARNING' | 'FAILED';
  pingLatencyMs: number;
  supportedFeatures: string[];
}

export interface DbGalleryItem {
  id: string;
  title: string;
  subject: string;
  caption: string;
  image: string;
  photographer: string;
  sourceUrl: string;
  license: string;
  alt: string;
  displayOrder: number;
  isPublished: boolean;
  category?: string;
  location?: string;
  cropType?: string;
  season?: string;
  farmingMethod?: string;
  cameraModel?: string;
  dateTaken?: string;
  tags?: string;
  aspectRatio?: string;
  isFeatured?: boolean;
  photographerEmail?: string;
}

export interface DbBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  category: string;
  image: string;
  readingTime: string;
  tags: string[];
  isPublished: boolean;
}

export interface DbBlogReview {
  id: string;
  articleSlug: string;
  userName: string;
  userMobile: string;
  rating: number;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface DevDatabaseData {
  brands: DbBrand[];
  categories: DbCategory[];
  products: DbProduct[];
  variants: DbProductVariant[];
  media: DbMedia[];
  specifications: DbSpecification[];
  warehouses: DbWarehouse[];
  warehouseStocks: DbWarehouseStock[];
  stockReservations: DbStockReservation[];
  users: DbUser[];
  addresses: DbCustomerAddress[];
  orders: DbOrder[];
  orderItems: DbOrderItem[];
  payments: DbPayment[];
  coupons: DbCoupon[];
  reviews: DbReview[];
  notifications: DbCustomerNotification[];
  otpTokens: DbOtpToken[];
  rentalProducts: DbRentalProduct[];
  rentalBookings: DbRentalBooking[];
  serviceRequests: DbServiceBookingRequest[];
  stockLedger: DbStockLedgerEntry[];
  farmerProfiles: DbFarmerProfile[];
  agronomyFollowUps: DbAgronomyFollowUp[];
  productUsageLogs: DbProductUsageLog[];
  salesLeads: DbSalesLead[];
  salesVisits: DbSalesVisit[];
  salesTargets: DbSalesTarget[];
  notificationQueue: DbNotificationQueueItem[];
  integrations: DbIntegrationConfig[];
  customerEquipments: DbCustomerEquipment[];
  jobCards: DbJobCard[];
  spareParts: DbSparePart[];
  sparePartTransactions: DbSparePartTransaction[];
  labourCatalogue: DbLabourOperation[];
  warrantyClaims: DbWarrantyClaim[];
  serviceReminders: DbServiceReminder[];
  dealerProfiles: DbDealerProfile[];
  commissionTargets: DbCommissionTarget[];
  payoutRecords: DbPayoutRecord[];
  financeAuditLogs: DbFinanceAuditLog[];
  galleryItems: DbGalleryItem[];
  blogPosts: DbBlogPost[];
  blogReviews: DbBlogReview[];
  productTags?: DbProductTag[];
  productAttributes?: DbProductAttribute[];
  specificationAttributes?: DbSpecificationAttribute[];
  checkoutAttributes?: DbCheckoutAttribute[];
  cropGuidance?: any[];
  cropGuidanceMasterGuides?: any[];
  cropGuidancePageContent?: any;
  cropGuidanceSettings?: any;
  gallerySettings?: any;
  farmerCropGalleries?: DbFarmerCropGallery[];
}

function resolveDataFilePath(): string {
  if (process.env.DATA_DIR) {
    return path.join(process.env.DATA_DIR, 'dev-database.json');
  }
  const tmpPath = path.join('/tmp', 'dev-database.json');
  if (process.env.VERCEL && fs.existsSync(tmpPath)) {
    return tmpPath;
  }
  const candidate1 = path.join(process.cwd(), 'data', 'dev-database.json');
  if (fs.existsSync(candidate1)) return candidate1;
  const candidate2 = path.join(process.cwd(), 'apps', 'backend', 'data', 'dev-database.json');
  if (fs.existsSync(candidate2)) return candidate2;
  return candidate1;
}

const DATA_FILE_PATH = resolveDataFilePath();
const TMP_FALLBACK_PATH = path.join('/tmp', 'dev-database.json');

function ensureDataDirectory(filePath: string = DATA_FILE_PATH) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch {}
}

export function getInitialFarmerCropGalleries(): DbFarmerCropGallery[] {
  return [
    {
      id: 'gallery-ramesh-001',
      farmerId: 'farmer-ramesh-gowda',
      farmerName: 'Ramesh Kumar Gowda',
      mobileNumber: '9845012345',
      totalAcreage: 10,
      totalCropsCount: 4,
      crops: [
        {
          cropId: 'crop-ramesh-tomato',
          cropName: 'Tomato',
          cropType: 'Vegetables',
          variety: 'Arka Rakshak F1',
          cropAcreage: 4,
          plantingDate: '2026-09-15',
          cropAge: '45 Days',
          sections: [
            {
              sectionId: 'farmer-visit-photographs',
              sectionName: 'Farmer Visit Photographs',
              photos: [],
            },
            {
              sectionId: 'pest-disease-tracking',
              sectionName: 'Pest & Disease Field Photos',
              photos: [],
            },
          ],
        },
        {
          cropId: 'crop-ramesh-chilli',
          cropName: 'Chilli',
          cropType: 'Commercial Spices',
          variety: 'Byadgi Dabbi',
          cropAcreage: 4,
          plantingDate: '2026-09-20',
          cropAge: '40 Days',
          sections: [
            {
              sectionId: 'farmer-visit-photographs',
              sectionName: 'Farmer Visit Photographs',
              photos: [],
            },
            {
              sectionId: 'pest-disease-tracking',
              sectionName: 'Pest & Disease Field Photos',
              photos: [],
            },
          ],
        },
        {
          cropId: 'crop-ramesh-maize',
          cropName: 'Maize',
          cropType: 'Cereal Crops',
          variety: 'CP 818 High-Yield',
          cropAcreage: 2,
          plantingDate: '2026-09-01',
          cropAge: '60 Days',
          sections: [
            {
              sectionId: 'farmer-visit-photographs',
              sectionName: 'Farmer Visit Photographs',
              photos: [],
            },
            {
              sectionId: 'pest-disease-tracking',
              sectionName: 'Pest & Disease Field Photos',
              photos: [],
            },
          ],
        },
        {
          cropId: 'crop-ramesh-turmeric',
          cropName: 'Turmeric',
          cropType: 'Spices and condiments',
          variety: 'Prathibha / Salem Variety',
          cropAcreage: 0.5,
          plantingDate: '2026-08-15',
          cropAge: '73 Days',
          sections: [
            {
              sectionId: 'farmer-visit-photographs',
              sectionName: 'Farmer Visit Photographs',
              photos: [],
            },
            {
              sectionId: 'pest-disease-tracking',
              sectionName: 'Pest & Disease Field Photos',
              photos: [],
            },
          ],
        },
      ],
      createdAt: '2026-10-18T09:00:00Z',
      updatedAt: '2026-10-27T11:30:00Z',
    },
    {
      id: 'gallery-xyz-001',
      farmerId: 'farmer-xyz',
      farmerName: 'XYZ',
      mobileNumber: '9988776655',
      totalAcreage: 10,
      totalCropsCount: 3,
      crops: [
        {
          cropId: 'crop-xyz-tomato',
          cropName: 'Tomato',
          cropType: 'Vegetables',
          variety: 'Hybrid 105',
          cropAcreage: 4,
          plantingDate: '2026-09-10',
          cropAge: '50 Days',
          sections: [
            {
              sectionId: 'farmer-visit-photographs',
              sectionName: 'Farmer Visit Photographs',
              photos: [],
            },
            {
              sectionId: 'pest-disease-tracking',
              sectionName: 'Pest & Disease Field Photos',
              photos: [],
            },
          ],
        },
        {
          cropId: 'crop-xyz-chilli',
          cropName: 'Chilli',
          cropType: 'Commercial Spices',
          variety: 'Guntur Sannam',
          cropAcreage: 4,
          plantingDate: '2026-09-12',
          cropAge: '48 Days',
          sections: [
            {
              sectionId: 'farmer-visit-photographs',
              sectionName: 'Farmer Visit Photographs',
              photos: [],
            },
            {
              sectionId: 'pest-disease-tracking',
              sectionName: 'Pest & Disease Field Photos',
              photos: [],
            },
          ],
        },
        {
          cropId: 'crop-xyz-other',
          cropName: 'Groundnut',
          cropType: 'Oilseeds',
          variety: 'TMV-2',
          cropAcreage: 2,
          plantingDate: '2026-09-18',
          cropAge: '42 Days',
          sections: [
            {
              sectionId: 'farmer-visit-photographs',
              sectionName: 'Farmer Visit Photographs',
              photos: [],
            },
            {
              sectionId: 'pest-disease-tracking',
              sectionName: 'Pest & Disease Field Photos',
              photos: [],
            },
          ],
        },
      ],
      createdAt: '2026-10-25T11:00:00Z',
      updatedAt: '2026-10-28T16:00:00Z',
    },
  ];
}

function getInitialData(): DevDatabaseData {
  return {
    brands: [
      { id: 'br-agripro', name: 'AgriPro', slug: 'agripro', description: 'Heavy-duty agricultural machinery and field power tillers.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'br-kisankraft', name: 'KisanKraft', slug: 'kisankraft', description: 'Premier farm mechanization and battery-operated spraying systems.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'br-bhoomi', name: 'Bhoomi Sanjivani', slug: 'bhoomi-sanjivani', description: 'Certified bio-organic soil enhancers and liquid microbial consortia.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'br-neemguard', name: 'Neem-Guard', slug: 'neem-guard', description: 'High-potency botanical bio-insecticides and crop protectors.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'br-uasd', name: 'UAS Dharwad Certified', slug: 'uas-dharwad', description: 'High-yield certified foundation seeds and drought-resilient varieties.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'br-jain', name: 'Jain Drip Tech', slug: 'jain-drip-tech', description: 'Micro-irrigation, venturi injectors, and pressure compensation drippers.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    categories: [
      { id: 'cat-machinery', name: 'Farm Equipment & Machinery', nameKn: 'Farm Equipment & Machinery', slug: 'farm-equipment-machinery', description: 'Power weeders, rotavators, brush cutters, sprayers, and inter-cultivation units.', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80', parentId: null, displayOrder: 1, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'cat-seeds', name: 'Seeds & Planting Materials', nameKn: 'Seeds & Planting Materials', slug: 'seeds-planting-materials', description: 'Certified hybrid seeds, high-germination paddy, cotton, maize, and vegetable seeds.', image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb2251a?auto=format&fit=crop&w=600&q=80', parentId: null, displayOrder: 2, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'cat-fertilizers', name: 'Fertilizers & Soil Care', nameKn: 'Fertilizers & Soil Care', slug: 'fertilizers-soil-care', description: 'Organic bio-fertilizers, microbial consortia, micronutrients, and soil health conditioners.', image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80', parentId: null, displayOrder: 3, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'cat-protection', name: 'Crop Protection & Bio-Care', nameKn: 'Crop Protection & Bio-Care', slug: 'crop-protection-bio-care', description: 'Neem-based organic insecticides, bio-fungicides, solar light traps, and pheromone lures.', image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80', parentId: null, displayOrder: 4, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'cat-irrigation', name: 'Irrigation & Water Tech', nameKn: 'Irrigation & Water Tech', slug: 'irrigation-water-tech', description: 'Drip kits, venturi fertilizer injectors, HDPE pipes, filters, and rain gun sprinklers.', image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80', parentId: null, displayOrder: 5, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'cat-tools', name: 'Tools, Hardware & Spares', nameKn: 'Tools, Hardware & Spares', slug: 'tools-hardware-spares', description: 'Original blades, replacement carburetor kits, pruning shears, and workshop spares.', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80', parentId: null, displayOrder: 6, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      // Subcategories
      { id: 'subcat-weeders-tillers', name: 'Power Weeders & Rotary Tillers', nameKn: 'ಪವರ್ ವೀಡರ್ ಮತ್ತು ರೋಟರಿ ಟಿಲ್ಲರ್', slug: 'power-weeders-rotary-tillers', description: 'Heavy-duty multi-speed power weeders, inter-cultivators, and rotary tillers.', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80', parentId: 'cat-machinery', displayOrder: 11, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'subcat-sprayers', name: 'Agricultural Sprayers & Pumps', nameKn: 'ಕೃಷಿ ಸ್ಪ್ರೇಯರ್ ಮತ್ತು ಪಂಪ್‌ಗಳು', slug: 'agricultural-sprayers-pumps', description: 'Battery sprayers, power sprayers, mist blowers, and diaphragm pumps.', image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80', parentId: 'cat-machinery', displayOrder: 12, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'subcat-cereal-seeds', name: 'Cereal & Grain Seeds', nameKn: 'ಧಾನ್ಯ ಮತ್ತು ಕಾಳು ಬೀಜಗಳು', slug: 'cereal-grain-seeds', description: 'Certified foundation and hybrid seeds for wheat, paddy, maize, and jowar.', image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80', parentId: 'cat-seeds', displayOrder: 21, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'subcat-vegetable-seeds', name: 'Vegetable & Cash Crop Seeds', nameKn: 'ತರಕಾರಿ ಮತ್ತು ವಾಣಿಜ್ಯ ಬೆಳೆ ಬೀಜಗಳು', slug: 'vegetable-cash-crop-seeds', description: 'High-yield hybrid seeds for cotton, chili, tomato, onion, and vegetables.', image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb2251a?auto=format&fit=crop&w=600&q=80', parentId: 'cat-seeds', displayOrder: 22, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'subcat-bio-fertilizers', name: 'Organic & Bio-Fertilizers', nameKn: 'ಸಾವಯವ ಮತ್ತು ಜೈವಿಕ ಗೊಬ್ಬರಗಳು', slug: 'organic-bio-fertilizers', description: 'NPOP certified organic micronutrients, humic acid, and microbial consortia.', image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80', parentId: 'cat-fertilizers', displayOrder: 31, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'subcat-soil-conditioners', name: 'Soil Conditioners & Micronutrients', nameKn: 'ಮಣ್ಣು ಸುಧಾರಕಗಳು ಮತ್ತು ಸೂಕ್ಷ್ಮ ಪೋಷಕಾಂಶಗಳು', slug: 'soil-conditioners-micronutrients', description: 'Chelated zinc, iron, boron, gypsum, and organic soil health boosters.', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80', parentId: 'cat-fertilizers', displayOrder: 32, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'subcat-bio-insecticides', name: 'Botanical & Bio-Insecticides', nameKn: 'ಜೈವಿಕ ಕೀಟನಾಶಕಗಳು', slug: 'botanical-bio-insecticides', description: 'Cold-pressed neem oil, Azadirachtin EC, and organic pest controllers.', image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80', parentId: 'cat-protection', displayOrder: 41, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'subcat-pest-traps', name: 'Solar Traps & Lures', nameKn: 'ಸೌರ ಕೀಟ ಬಲೆಗಳು', slug: 'solar-traps-lures', description: 'Automated solar UV insect light traps, yellow sticky traps, and pheromone lures.', image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80', parentId: 'cat-protection', displayOrder: 42, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'subcat-drip-fertigation', name: 'Drip & Fertigation Systems', nameKn: 'ಹನಿ ನೀರಾವರಿ ಮತ್ತು ಫರ್ಟಿಗೇಶನ್', slug: 'drip-fertigation-systems', description: 'Venturi injectors, inline drip laterals, fertigation manifolds, and screen filters.', image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80', parentId: 'cat-irrigation', displayOrder: 51, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'subcat-sprinklers-pipes', name: 'Rain Guns & HDPE Pipes', nameKn: 'ರೇನ್ ಗನ್ ಮತ್ತು ಪೈಪ್‌ಗಳು', slug: 'rain-guns-hdpe-pipes', description: 'High-discharge impact rain guns, brass sprinklers, and UV-stabilized HDPE pipes.', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=600&q=80', parentId: 'cat-irrigation', displayOrder: 52, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'subcat-harvest-storage', name: 'Harvesting & Crop Storage', nameKn: 'ಕಟಾವು ಮತ್ತು ಬೆಳೆ ಸಂಗ್ರಹಣೆ', slug: 'harvesting-crop-storage', description: 'Heavy-duty UV tarpaulins, harvesting baskets, grain storage bags, and pruning tools.', image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80', parentId: 'cat-tools', displayOrder: 61, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'subcat-machinery-spares', name: 'Machinery Blades & Spares', nameKn: 'ಯಂತ್ರೋಪಕರಣಗಳ ಬಿಡಿಭಾಗಗಳು', slug: 'machinery-blades-spares', description: 'Manganese rotary tines, carburetor kits, recoil starters, and replacement filters.', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80', parentId: 'cat-tools', displayOrder: 62, published: true, isPublished: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    products: [
      {
        id: 'prod-001',
        name: 'AgriPro 7HP Heavy-Duty Multi-Speed Power Weeder',
        nameKn: 'AgriPro 7HP Multi-Speed Power Weeder',
        slug: 'agripro-7hp-heavy-duty-power-weeder',
        sku: 'AGP-PW-7HP',
        shortDescription: '4-Stroke Petrol Engine, 32 Heat-Treated Rotary Blades, 2 Forward + 1 Reverse Gear, Free Ridger.',
        description: 'Engineered for tough Indian soils across cotton, sugarcane, maize, and vegetable cultivation. Features 32 heat-treated manganese blades and an adjustable tilling width from 24 to 42 inches.',
        brandId: 'br-agripro',
        categoryId: 'cat-machinery',
        parentCategoryId: 'cat-machinery',
        subCategoryId: 'subcat-weeders-tillers',
        price: 36500,
        comparePrice: 42000,
        cost: 29500,
        weight: 85,
        length: 145,
        width: 95,
        height: 105,
        gtin: '8901234560011',
        manufacturerPartNumber: 'AGP-PW700-IND',
        vendor: 'Agri-Mart Direct',
        taxCategory: 'Reduced Rate (12% GST)',
        deliveryDate: '3-5 days',
        isPublished: true,
        isDraft: false,
        isFeatured: true,
        isBestSeller: true,
        disableBuyButton: true,
        targetCrops: 'Cotton, Sugarcane, Maize, Chili, Soybean',
        cropStages: '1, 2, 4',
        metaTitle: 'Buy AgriPro 7HP Heavy-Duty Power Weeder | Agri Mart Mega',
        metaKeywords: 'power weeder, 7hp rotary tiller, agripro, farm machinery',
        metaDescription: 'Shop AgriPro 7HP Power Weeder with free ridger & reverse gear. Delivered from Hubballi & Belagavi Dark Warehouses with 1-Year comprehensive AMC.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod-002',
        name: 'KisanKraft 16L Battery Sprayer with Double Motor',
        nameKn: 'KisanKraft 16L Battery Sprayer',
        slug: 'kisankraft-16l-battery-sprayer-double-motor',
        sku: 'KK-BPS-16L',
        shortDescription: '12V 12Ah Lead-Acid Battery, Dual High-Pressure Diaphragm Pumps, Telescopic SS Lance.',
        description: 'Delivers 130 PSI working pressure for superior foliage canopy penetration. Capable of spraying up to 25 full tanks on a single 6-hour charge.',
        brandId: 'br-kisankraft',
        categoryId: 'cat-machinery',
        parentCategoryId: 'cat-machinery',
        subCategoryId: 'subcat-sprayers',
        price: 3450,
        comparePrice: 4200,
        cost: 2600,
        weight: 6.2,
        length: 38,
        width: 22,
        height: 52,
        gtin: '8901234560028',
        manufacturerPartNumber: 'KK-BS16-DM',
        vendor: 'Agri-Mart Direct',
        taxCategory: 'Reduced Rate (12% GST)',
        deliveryDate: '1-2 days',
        isPublished: true,
        isDraft: false,
        isFeatured: true,
        isBestSeller: false,
        targetCrops: 'Paddy, Cotton, Tomato, Chili, Arecanut',
        cropStages: '2, 3, 4',
        metaTitle: 'KisanKraft 16L Dual Motor Battery Sprayer | Agri Mart Mega',
        metaKeywords: 'battery sprayer, kisankraft 16l, double motor sprayer',
        metaDescription: 'High pressure 16L battery sprayer for pest control and foliar nutrition. Express delivery across Karnataka.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod-003',
        name: 'Bhoomi Sanjivani Organic Micro-Nutrient Bio-Fertilizer (5 Kg)',
        nameKn: 'Bhoomi Sanjivani Organic Micronutrient Fertilizer (5 Kg)',
        slug: 'bhoomi-sanjivani-organic-micronutrient-fertilizer',
        sku: 'BS-OMN-5KG',
        shortDescription: 'Bio-enriched organic humic acid, sea-weed extract, zinc, iron, and mycorrhiza consortium.',
        description: 'Improves cation exchange capacity and stimulates root proliferation. Certified 100% organic under NPOP standards for soil conditioning.',
        brandId: 'br-bhoomi',
        categoryId: 'cat-fertilizers',
        parentCategoryId: 'cat-fertilizers',
        subCategoryId: 'subcat-bio-fertilizers',
        price: 850,
        comparePrice: 990,
        cost: 580,
        weight: 5.0,
        length: 30,
        width: 24,
        height: 12,
        gtin: '8901234560035',
        manufacturerPartNumber: 'BS-BIO-5KG',
        vendor: 'IFFCO Organic',
        taxCategory: 'Agricultural Essentials (5% GST)',
        deliveryDate: '1-2 days',
        isPublished: true,
        isDraft: false,
        isFeatured: true,
        isBestSeller: true,
        targetCrops: 'Paddy, Sugarcane, Cotton, Maize, Banana',
        cropStages: '1, 3',
        metaTitle: 'Bhoomi Sanjivani Organic Bio-Fertilizer 5Kg | Agri Mart Mega',
        metaKeywords: 'organic fertilizer, bio fertilizer, micronutrients, humic acid',
        metaDescription: 'Enrich soil microbial health and boost yield with certified organic humic mycorrhiza consortia.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod-004',
        name: 'Neem-Guard 10000 PPM Certified Botanical Bio-Insecticide (1 Litre)',
        nameKn: 'Neem-Guard 10000 PPM Bio-Insecticide (1 Litre)',
        slug: 'neem-guard-10000-ppm-botanical-bio-insecticide',
        sku: 'NG-10K-1L',
        shortDescription: 'Pure cold-pressed neem kernel extract containing 10,000 PPM Azadirachtin EC.',
        description: 'Controls chewing and sucking pests including bollworms, aphids, whiteflies, and stem borers without killing beneficial pollinator insects.',
        brandId: 'br-neemguard',
        categoryId: 'cat-protection',
        parentCategoryId: 'cat-protection',
        subCategoryId: 'subcat-bio-insecticides',
        price: 680,
        comparePrice: 820,
        cost: 450,
        weight: 1.1,
        length: 10,
        width: 10,
        height: 24,
        gtin: '8901234560042',
        manufacturerPartNumber: 'NG-AZA-10K',
        vendor: 'UPL Limited',
        taxCategory: 'Agricultural Essentials (5% GST)',
        deliveryDate: '1-2 days',
        isPublished: true,
        isDraft: false,
        isFeatured: true,
        isBestSeller: false,
        targetCrops: 'Cotton, Chili, Paddy, Tomato, Pulses',
        cropStages: '2, 3, 4',
        metaTitle: 'Neem-Guard 10000 PPM Bio-Insecticide 1L | Agri Mart Mega',
        metaKeywords: 'neem oil 10000 ppm, bio insecticide, azadirachtin, pest control',
        metaDescription: 'Organic pest control certified under CIB & RC for cotton bollworm and sucking pests.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod-005',
        name: 'UAS Dharwad DWR-1006 Certified Hybrid Wheat Seeds (20 Kg)',
        nameKn: 'UAS Dharwad DWR-1006 Certified Wheat Seeds',
        slug: 'uas-dharwad-dwr-1006-certified-wheat-seeds',
        sku: 'UASD-WHT-20KG',
        shortDescription: 'High-gluten drought-tolerant foundation wheat seeds developed specifically for North Karnataka.',
        description: 'Breeder-certified seed lot with 98% germination rate. Highly resistant to rust and lodging during terminal heat stress.',
        brandId: 'br-uasd',
        categoryId: 'cat-seeds',
        parentCategoryId: 'cat-seeds',
        subCategoryId: 'subcat-cereal-seeds',
        price: 1250,
        comparePrice: 1450,
        cost: 920,
        weight: 20.0,
        length: 55,
        width: 38,
        height: 15,
        gtin: '8901234560059',
        manufacturerPartNumber: 'UASD-DWR1006-20',
        vendor: 'Agri-Mart Direct',
        taxCategory: 'Exempt Seeds & Biocides (0% GST)',
        deliveryDate: '1-2 days',
        isPublished: true,
        isDraft: false,
        isFeatured: false,
        isBestSeller: false,
        targetCrops: 'Wheat',
        cropStages: '1, 2',
        metaTitle: 'UAS Dharwad DWR-1006 Certified Wheat Seeds 20Kg | Agri Mart Mega',
        metaKeywords: 'wheat seeds, dwr 1006, uas dharwad seeds, certified seeds',
        metaDescription: 'Foundation certified wheat seeds with guaranteed germination from regional agricultural universities.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'prod-006',
        name: 'Smart Drip Automation Kit with 2-Inch Venturi Injector',
        nameKn: 'Smart Drip Automation Kit',
        slug: 'smart-drip-automation-kit-venturi-injector',
        sku: 'JDT-DRIP-2IN',
        shortDescription: 'Complete fertigation manifold with bypass valve, pressure gauge, and rotameter.',
        description: 'Enables uniform liquid bio-fertilizer and micro-nutrient delivery directly through pressurized drip lines across 5-acre plots.',
        brandId: 'br-jain',
        categoryId: 'cat-irrigation',
        parentCategoryId: 'cat-irrigation',
        subCategoryId: 'subcat-drip-fertigation',
        price: 4950,
        comparePrice: 5800,
        cost: 3650,
        weight: 3.5,
        length: 45,
        width: 30,
        height: 20,
        gtin: '8901234560066',
        manufacturerPartNumber: 'JDT-VEN-2IN',
        vendor: 'Agri-Mart Direct',
        taxCategory: 'Reduced Rate (12% GST)',
        deliveryDate: '3-5 days',
        isPublished: true,
        isDraft: false,
        isFeatured: false,
        isBestSeller: false,
        targetCrops: 'Sugarcane, Tomato, Banana, Pomegranate, Arecanut',
        cropStages: '3, 4',
        metaTitle: '2-Inch Venturi Drip Fertigation Kit | Agri Mart Mega',
        metaKeywords: 'drip irrigation kit, venturi injector, jain drip tech, fertigation',
        metaDescription: 'Accurate fertilizer injector for automated drip systems. Reduces manual labor and nutrient wastage.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    variants: [
      { id: 'var-001-1', productId: 'prod-001', sku: 'AGP-PW-7HP-STD', title: '7 HP Petrol Standard (32 Blades)', variantName: '7 HP Petrol', price: 36500, comparePrice: 42000, weightKg: 85, unit: 'Unit', isDefault: true, stockQuantity: 18, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'var-001-2', productId: 'prod-001', sku: 'AGP-PW-9HP-PRO', title: '9 HP Diesel Heavy-Duty with Electric Start', variantName: '9 HP Diesel', price: 48500, comparePrice: 55000, weightKg: 105, unit: 'Unit', isDefault: false, stockQuantity: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'var-002-1', productId: 'prod-002', sku: 'KK-BPS-16L-STD', title: '16 Litre Dual Motor (12V 12Ah)', variantName: '16L Standard', price: 3450, comparePrice: 4200, weightKg: 6.2, unit: 'Unit', isDefault: true, stockQuantity: 45, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'var-003-1', productId: 'prod-003', sku: 'BS-OMN-5KG-BAG', title: '5 Kg Eco-Bag Pack', variantName: '5 Kg', price: 850, comparePrice: 990, weightKg: 5, unit: 'Kg', isDefault: true, stockQuantity: 120, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'var-003-2', productId: 'prod-003', sku: 'BS-OMN-25KG-DRUM', title: '25 Kg Farmer Bulk Drum', variantName: '25 Kg', price: 3800, comparePrice: 4500, weightKg: 25, unit: 'Kg', isDefault: false, stockQuantity: 30, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'var-004-1', productId: 'prod-004', sku: 'NG-10K-1L-BOT', title: '1 Litre HDPE Bottle', variantName: '1 Litre', price: 680, comparePrice: 820, weightKg: 1.1, unit: 'Litre', isDefault: true, stockQuantity: 80, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'var-004-2', productId: 'prod-004', sku: 'NG-10K-5L-CAN', title: '5 Litre Farm Pack Can', variantName: '5 Litres', price: 3100, comparePrice: 3800, weightKg: 5.4, unit: 'Litre', isDefault: false, stockQuantity: 25, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'var-005-1', productId: 'prod-005', sku: 'UASD-WHT-20KG-BAG', title: '20 Kg Certified Sown Pack', variantName: '20 Kg', price: 1250, comparePrice: 1450, weightKg: 20, unit: 'Kg', isDefault: true, stockQuantity: 50, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'var-006-1', productId: 'prod-006', sku: 'JDT-DRIP-2IN-KIT', title: '2-Inch Industrial Kit', variantName: '2 Inch', price: 4950, comparePrice: 5800, weightKg: 3.5, unit: 'Unit', isDefault: true, stockQuantity: 35, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    media: [
      { id: 'med-001', productId: 'prod-001', url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80', altText: 'AgriPro 7HP Power Weeder Front View', type: 'IMAGE', isPrimary: true, displayOrder: 1, createdAt: new Date().toISOString() },
      { id: 'med-002', productId: 'prod-002', url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80', altText: 'KisanKraft Battery Sprayer in Field', type: 'IMAGE', isPrimary: true, displayOrder: 1, createdAt: new Date().toISOString() },
      { id: 'med-003', productId: 'prod-003', url: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80', altText: 'Bhoomi Sanjivani Micro-Nutrient Granules', type: 'IMAGE', isPrimary: true, displayOrder: 1, createdAt: new Date().toISOString() },
      { id: 'med-004', productId: 'prod-004', url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb2251a?auto=format&fit=crop&w=800&q=80', altText: 'Neem-Guard Botanical Extract Bottle', type: 'IMAGE', isPrimary: true, displayOrder: 1, createdAt: new Date().toISOString() },
      { id: 'med-005', productId: 'prod-005', url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80', altText: 'Wheat Seeds Lot Inspection', type: 'IMAGE', isPrimary: true, displayOrder: 1, createdAt: new Date().toISOString() },
      { id: 'med-006', productId: 'prod-006', url: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80', altText: 'Venturi Drip Kit Manifold', type: 'IMAGE', isPrimary: true, displayOrder: 1, createdAt: new Date().toISOString() },
    ],
    specifications: [
      { id: 'sp-001', productId: 'prod-001', group: 'Engine & Transmission', name: 'Engine Power', value: '7.0 HP @ 3600 RPM (212cc)', displayOrder: 1 },
      { id: 'sp-002', productId: 'prod-001', group: 'Engine & Transmission', name: 'Fuel Type & Consumption', value: 'Petrol (0.85 L/hour under full load)', displayOrder: 2 },
      { id: 'sp-003', productId: 'prod-001', group: 'Tilling Performance', name: 'Rotary Blades', value: '32 manganese steel curved tines', displayOrder: 3 },
      { id: 'sp-004', productId: 'prod-001', group: 'Tilling Performance', name: 'Adjustable Width', value: '24 to 42 Inches (Inter-row compatible)', displayOrder: 4 },
      { id: 'sp-005', productId: 'prod-002', group: 'Electrical & Battery', name: 'Battery Specs', value: '12V 12Ah Rechargeable Lead-Acid', displayOrder: 1 },
      { id: 'sp-006', productId: 'prod-002', group: 'Spray Output', name: 'Maximum Pressure', value: '130 PSI Dual Diaphragm Auto Cut-Off', displayOrder: 2 },
      { id: 'sp-007', productId: 'prod-003', group: 'Composition', name: 'Active Ingredients', value: 'Humic Acid 18%, Seaweed Extract 10%, Zn 2.5%, Fe 1.5%', displayOrder: 1 },
      { id: 'sp-008', productId: 'prod-004', group: 'Agronomy', name: 'Dosage Recommendation', value: '2.5 to 3.0 ml per litre of water', displayOrder: 1 },
    ],
    warehouses: [
      { id: 'wh-hubballi', name: 'Hubballi Central Dark Warehouse', code: 'DWH-HBX-01', latitude: 15.3647, longitude: 75.124, serviceRadiusKm: 60, servicedPincodes: '580020, 580021, 580023, 580024, 580025, 580026, 580028, 580029, 580030, 580031, 580032', address: 'Plot 44-B, KIADB Industrial Area, Tarihal, Hubballi', managerName: 'Suresh Patil', contactNumber: '+91 94481 22334', isActive: true, createdAt: new Date().toISOString() },
      { id: 'wh-dharwad', name: 'Dharwad Rural Fulfillment Hub', code: 'DWH-DWD-02', latitude: 15.4589, longitude: 75.0078, serviceRadiusKm: 50, servicedPincodes: '580001, 580002, 580004, 580007, 580008, 580011, 581206', address: 'Belur Industrial Estate, PB Road, Dharwad', managerName: 'Mallikarjun Hiremath', contactNumber: '+91 94481 55667', isActive: true, createdAt: new Date().toISOString() },
      { id: 'wh-belagavi', name: 'Belagavi Agro Logistics Center', code: 'DWH-IXG-03', latitude: 15.8497, longitude: 74.4977, serviceRadiusKm: 65, servicedPincodes: '590001, 590010, 590016, 591103, 591109, 591201', address: 'Auto Nagar Industrial Area, Kanbargi Road, Belagavi', managerName: 'Vinayak Kulkarni', contactNumber: '+91 94481 88990', isActive: true, createdAt: new Date().toISOString() },
      { id: 'wh-davanagere', name: 'Davanagere Central Agro Hub', code: 'DWH-DVG-04', latitude: 14.4644, longitude: 75.9218, serviceRadiusKm: 55, servicedPincodes: '577001, 577002, 577004, 577005, 577006, 577544', address: 'Lokikere Road Industrial Area, Davanagere', managerName: 'Prashant Gouda', contactNumber: '+91 94482 11223', isActive: true, createdAt: new Date().toISOString() },
      { id: 'wh-haveri', name: 'Haveri Agricultural Transit Hub', code: 'DWH-HVR-05', latitude: 14.7954, longitude: 75.4018, serviceRadiusKm: 45, servicedPincodes: '581110, 581115, 581118, 581120, 581148', address: 'Near APMC Yard, PB Road, Haveri', managerName: 'Basavaraj Channur', contactNumber: '+91 94482 44556', isActive: true, createdAt: new Date().toISOString() },
    ],
    warehouseStocks: [
      { id: 'ws-001', warehouseId: 'wh-hubballi', productId: 'prod-001', variantId: 'var-001-1', quantity: 12, reservedQuantity: 0, reorderThreshold: 3 },
      { id: 'ws-002', warehouseId: 'wh-belagavi', productId: 'prod-001', variantId: 'var-001-1', quantity: 6, reservedQuantity: 0, reorderThreshold: 2 },
      { id: 'ws-003', warehouseId: 'wh-hubballi', productId: 'prod-002', variantId: 'var-002-1', quantity: 25, reservedQuantity: 0, reorderThreshold: 5 },
      { id: 'ws-004', warehouseId: 'wh-dharwad', productId: 'prod-002', variantId: 'var-002-1', quantity: 20, reservedQuantity: 0, reorderThreshold: 5 },
      { id: 'ws-005', warehouseId: 'wh-hubballi', productId: 'prod-003', variantId: 'var-003-1', quantity: 80, reservedQuantity: 0, reorderThreshold: 20 },
      { id: 'ws-006', warehouseId: 'wh-dharwad', productId: 'prod-003', variantId: 'var-003-1', quantity: 40, reservedQuantity: 0, reorderThreshold: 10 },
      { id: 'ws-007', warehouseId: 'wh-hubballi', productId: 'prod-004', variantId: 'var-004-1', quantity: 50, reservedQuantity: 0, reorderThreshold: 15 },
      { id: 'ws-008', warehouseId: 'wh-haveri', productId: 'prod-004', variantId: 'var-004-1', quantity: 30, reservedQuantity: 0, reorderThreshold: 10 },
      { id: 'ws-009', warehouseId: 'wh-davanagere', productId: 'prod-005', variantId: 'var-005-1', quantity: 50, reservedQuantity: 0, reorderThreshold: 10 },
      { id: 'ws-010', warehouseId: 'wh-hubballi', productId: 'prod-006', variantId: 'var-006-1', quantity: 35, reservedQuantity: 0, reorderThreshold: 5 },
    ],
    stockReservations: [],
    users: [
      { id: 'usr-farmer-01', name: 'Ramesh Kumar Gowda', mobile: '9845190812', email: 'ramesh.gowda@gmail.com', role: 'CUSTOMER', isVerified: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'usr-farmer-02', name: 'Ningappa Kamatar', mobile: '9886054321', email: 'ningappa.kamatar@gmail.com', role: 'CUSTOMER', isVerified: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'usr-admin-01', name: 'Siddaraju Patil', mobile: '9480123456', email: 'admin@agrimart.in', role: 'SUPER_ADMIN', isVerified: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    addresses: [
      {
        id: 'addr-001',
        userId: 'usr-farmer-01',
        fullName: 'Ramesh Kumar Gowda',
        mobile: '9845190812',
        alternateMobile: '9480111223',
        addressLine: 'Farm Plot #14, Sy. No 124, Maddur Road',
        landmark: 'Near Govt Primary School',
        taluk: 'Mandya',
        village: 'Kothathi',
        district: 'Mandya',
        state: 'Karnataka',
        pincode: '571401',
        gpsLatitude: 12.5218,
        gpsLongitude: 76.8951,
        isDefaultShipping: true,
        isDefaultBilling: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'addr-002',
        userId: 'usr-farmer-01',
        fullName: 'Ramesh Kumar Gowda (Godown)',
        mobile: '9845190812',
        addressLine: 'APMC Market Yard Gate 2, Shed 18',
        taluk: 'Mandya',
        village: 'Mandya City',
        district: 'Mandya',
        state: 'Karnataka',
        pincode: '571401',
        isDefaultShipping: false,
        isDefaultBilling: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    orders: [
      {
        id: 'ord-001',
        orderNumber: 'AGM-2026-9481',
        userId: 'usr-farmer-01',
        subtotalAmount: 37350,
        discountAmount: 1000,
        deliveryFee: 0,
        taxAmount: 1826,
        totalAmount: 38176,
        status: 'DISPATCHED',
        paymentMethod: 'UPI',
        paymentStatus: 'PAID',
        assignedWarehouseId: 'wh-hubballi',
        assignedWarehouseName: 'Hubballi Central Dark Warehouse',
        assignmentMode: 'AUTO',
        shippingAddress: {
          fullName: 'Ramesh Kumar Gowda',
          mobile: '9845190812',
          addressLine: 'Farm Plot #14, Sy. No 124, Maddur Road',
          taluk: 'Mandya',
          village: 'Kothathi',
          district: 'Mandya',
          state: 'Karnataka',
          pincode: '571401',
        },
        trackingNumber: 'VRL-EXP-948122',
        courierName: 'VRL Logistics Agri Express',
        couponCode: 'MEGA1000',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'ord-002',
        orderNumber: 'AGM-2026-9482',
        userId: 'usr-farmer-01',
        subtotalAmount: 4760,
        discountAmount: 500,
        deliveryFee: 0,
        taxAmount: 213,
        totalAmount: 4473,
        status: 'CONFIRMED',
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        assignedWarehouseId: 'wh-dharwad',
        assignedWarehouseName: 'Dharwad Rural Fulfillment Hub',
        assignmentMode: 'AUTO',
        shippingAddress: {
          fullName: 'Ramesh Kumar Gowda',
          mobile: '9845190812',
          addressLine: 'Farm Plot #14, Sy. No 124, Maddur Road',
          taluk: 'Mandya',
          village: 'Kothathi',
          district: 'Mandya',
          state: 'Karnataka',
          pincode: '571401',
        },
        couponCode: 'KISAN500',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    orderItems: [
      { id: 'oi-001', orderId: 'ord-001', productId: 'prod-001', variantId: 'var-001-1', productName: 'AgriPro 7HP Heavy-Duty Multi-Speed Power Weeder', variantTitle: '7 HP Petrol', sku: 'AGP-PW-7HP-STD', quantity: 1, unitPrice: 36500, taxRate: 0.05, totalPrice: 36500 },
      { id: 'oi-002', orderId: 'ord-001', productId: 'prod-003', variantId: 'var-003-1', productName: 'Bhoomi Sanjivani Organic Micro-Nutrient Bio-Fertilizer (5 Kg)', variantTitle: '5 Kg', sku: 'BS-OMN-5KG-BAG', quantity: 1, unitPrice: 850, taxRate: 0.05, totalPrice: 850 },
      { id: 'oi-003', orderId: 'ord-002', productId: 'prod-003', variantId: 'var-003-1', productName: 'Bhoomi Sanjivani Organic Micro-Nutrient Bio-Fertilizer (5 Kg)', variantTitle: '5 Kg', sku: 'BS-OMN-5KG-BAG', quantity: 4, unitPrice: 850, taxRate: 0.05, totalPrice: 3400 },
      { id: 'oi-004', orderId: 'ord-002', productId: 'prod-004', variantId: 'var-004-1', productName: 'Neem-Guard 10000 PPM Certified Botanical Bio-Insecticide (1 Litre)', variantTitle: '1 Litre', sku: 'NG-10K-1L-BOT', quantity: 2, unitPrice: 680, taxRate: 0.05, totalPrice: 1360 },
    ],
    payments: [
      {
        id: 'pay-001',
        orderId: 'ord-001',
        paymentNumber: 'PAY-AGM-9481-01',
        provider: 'RAZORPAY',
        amount: 38176,
        currency: 'INR',
        status: 'PAID',
        razorpayOrderId: 'order_test_94812231',
        razorpayPaymentId: 'pay_test_94818812',
        razorpaySignature: 'sig_sandbox_verified_9481',
        idempotencyKey: 'idemp-pay-001',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    coupons: [
      { id: 'cp-001', code: 'MEGA1000', description: '₹1,000 Flat Off on Machinery & Heavy Equipment above ₹25,000', discountType: 'FIXED', discountValue: 1000, minOrderValue: 25000, validFrom: '2026-01-01T00:00:00Z', validTo: '2027-12-31T23:59:59Z', usageLimit: 5000, usageCount: 142, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'cp-002', code: 'KISAN500', description: '₹500 Seasonal Discount on Bio-Fertilizers and Protection Inputs above ₹3,000', discountType: 'FIXED', discountValue: 500, minOrderValue: 3000, validFrom: '2026-01-01T00:00:00Z', validTo: '2027-12-31T23:59:59Z', usageLimit: 10000, usageCount: 685, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'cp-003', code: 'AGRI10', description: '10% Savings on Certified Foundation Seeds and Drip Components', discountType: 'PERCENTAGE', discountValue: 10, minOrderValue: 1500, maxDiscount: 1500, validFrom: '2026-01-01T00:00:00Z', validTo: '2027-12-31T23:59:59Z', usageLimit: 2000, usageCount: 89, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'cp-004', code: 'HARVEST2026', description: 'Special Harvest Discount ₹1,500 off orders over ₹40,000', discountType: 'FIXED', discountValue: 1500, minOrderValue: 40000, validFrom: '2026-01-01T00:00:00Z', validTo: '2027-12-31T23:59:59Z', usageLimit: 1000, usageCount: 24, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    reviews: [
      { id: 'rev-001', productId: 'prod-001', userId: 'usr-farmer-01', customerName: 'Ramesh Kumar Gowda (Mandya)', rating: 5, title: 'Outstanding machine for sugarcane fields', comment: 'Weeded 4.5 acres of sugarcane in less than two days. Fuel consumption was around 0.85 litres per hour. Hubballi dark warehouse delivered it directly to our farm.', verifiedPurchase: true, status: 'APPROVED', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
      { id: 'rev-002', productId: 'prod-001', userId: 'usr-farmer-02', customerName: 'Ningappa Kamatar (Dharwad)', rating: 5, title: 'Powerful and easy to operate with reverse gear', comment: 'The reverse gear makes maneuvering at row ends very convenient. Heat treated blades cut right through hard clay.', verifiedPurchase: true, status: 'APPROVED', createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
      { id: 'rev-003', productId: 'prod-003', userId: 'usr-farmer-01', customerName: 'Ramesh Kumar Gowda (Mandya)', rating: 5, title: 'Visible root growth in 10 days', comment: 'Applied Bhoomi Sanjivani granules during soil prep. Strong early vigor and deeper green leaves.', verifiedPurchase: true, status: 'APPROVED', createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
    ],
    notifications: [
      { id: 'notif-001', userId: 'usr-farmer-01', channel: 'SMS', recipient: '9845190812', event: 'ORDER_DISPATCHED', title: 'Order Dispatched', message: 'Kisan Bandhu, your AgriMart Order #AGM-2026-9481 has been dispatched from Hubballi Dark Warehouse via VRL Express. Tracking: VRL-EXP-948122.', status: 'SENT', sentAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 'notif-002', userId: 'usr-farmer-01', channel: 'WHATSAPP', recipient: '9845190812', event: 'ORDER_CONFIRMED', title: 'Order Confirmed', message: 'Order #AGM-2026-9482 confirmed! Hubballi fulfillment team is packing your bio-inputs. Track live on your portal.', status: 'SENT', sentAt: new Date(Date.now() - 3600000 * 4).toISOString() },
    ],
    otpTokens: [],
    rentalProducts: [
      {
        id: 'rnt-weeder-7hp',
        title: 'AgriPro 7HP Multi-Speed Heavy-Duty Power Weeder',
        slug: 'power-weeder-7hp',
        category: 'Weeding & Inter-Cultivation',
        description: 'Heavy-duty 212cc petrol power weeder with 32 heat-treated blades, 2 forward + 1 reverse gear. Perfect for inter-row weeding in sugarcane, cotton, and vegetables.',
        dailyRate: 850,
        weeklyRate: 5100,
        monthlyRate: 18500,
        securityDeposit: 3000,
        totalUnits: 3,
        availableUnits: 3,
        powerRating: '7 HP Petrol (212cc OHV)',
        suitableFor: 'Sugarcane, Cotton, Maize, Vegetables',
        fuelType: 'Petrol (0.85 L/hr)',
        weightKg: 88,
        images: [
          'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1592417817098-8f3d6eb2251a?auto=format&fit=crop&w=800&q=80',
        ],
        specifications: {
          'Engine': '212cc 4-Stroke Air-Cooled OHV',
          'Tilling Width': '24 to 42 Inches (Adjustable)',
          'Tilling Depth': '5 to 8 Inches',
          'Gearbox': '2 Forward, 1 Neutral, 1 Reverse Gear',
          'Blades': '32 Heat-Treated High Carbon Manganese Blades',
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'rnt-brush-cutter-4s',
        title: 'KisanKraft 4-Stroke Multi-Crop Brush Cutter & Trimmer',
        slug: 'brush-cutter-4-stroke',
        category: 'Clearing & Harvesting',
        description: 'Lightweight 35cc 4-stroke commercial brush cutter with 80T carbide saw blade, 3T grass blade, and nylon trimmer head. No 2T oil mixing needed.',
        dailyRate: 500,
        weeklyRate: 2900,
        monthlyRate: 10500,
        securityDeposit: 2000,
        totalUnits: 4,
        availableUnits: 4,
        powerRating: '1.5 HP (35cc 4-Stroke)',
        suitableFor: 'Fodder cutting, grass trimming, paddy harvesting',
        fuelType: 'Pure Petrol (0.45 L/hr)',
        weightKg: 8.5,
        images: [
          'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
        ],
        specifications: {
          'Engine': '35.8cc 4-Stroke GX35 Type Overhead Cam',
          'Shaft': '28mm Heavy Duty Solid Steel Drive Shaft',
          'Attachments': '80T Paddy Blade, 3T Brush Blade, Nylon Trimmer Head',
          'Harness': 'Padded Ergonomic Double Shoulder Backpack Harness',
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'rnt-battery-sprayer-16l',
        title: 'KisanKraft 16L Dual-Motor High-Pressure Knapsack Sprayer',
        slug: 'battery-sprayer-16l',
        category: 'Spraying Equipment',
        description: 'High-pressure 130 PSI dual-motor knapsack sprayer with 12V 12Ah long-lasting battery. Spray up to 25 full tanks on a single charge.',
        dailyRate: 250,
        weeklyRate: 1400,
        monthlyRate: 4800,
        securityDeposit: 1000,
        totalUnits: 6,
        availableUnits: 6,
        powerRating: '12V 12Ah Dual High-Pressure Motor',
        suitableFor: 'Bio-pesticide, liquid fertilizer foliar spraying',
        fuelType: 'Rechargeable Electric (220V Fast Charger Included)',
        weightKg: 5.8,
        images: [
          'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
        ],
        specifications: {
          'Working Pressure': '130 PSI Dual Diaphragm Automatic Cut-Off',
          'Battery': '12V 12Ah Heavy-Duty VRLA Rechargeable',
          'Discharge Rate': '3.6 to 4.2 Litres/min',
          'Lance': 'Stainless Steel Telescopic Lance with 4-Hole Brass Nozzle',
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'rnt-reaper-binder',
        title: 'Self-Propelled 10HP Multi-Crop Reaper Binder',
        slug: 'power-reaper-binder',
        category: 'Harvesting Equipment',
        description: 'Self-propelled cereal reaper binder for paddy, wheat, and barley. Cuts 2 inches above ground level and automatically binds uniform sheaves with jute twine.',
        dailyRate: 1600,
        weeklyRate: 9800,
        monthlyRate: 35000,
        securityDeposit: 6000,
        totalUnits: 2,
        availableUnits: 2,
        powerRating: '10 HP Air-Cooled Diesel Engine',
        suitableFor: 'Paddy, Wheat, Barley, Oats, Ragi',
        fuelType: 'Diesel (1.1 L/hr)',
        weightKg: 195,
        images: [
          'https://images.unsplash.com/photo-1592417817098-8f3d6eb2251a?auto=format&fit=crop&w=800&q=80',
        ],
        specifications: {
          'Cutting Width': '120 cm (4 Feet Working Swath)',
          'Cutting Height': '5 to 8 cm Above Ground Level',
          'Capacity': '1 Acre in 1.2 to 1.5 Hours',
          'Twine Type': 'Natural Biodegradable Jute / Sisal Twine',
        },
        createdAt: new Date().toISOString(),
      },
    ],
    rentalBookings: [
      {
        id: 'rnt-bk-001',
        bookingNumber: 'RNT-2026-9481',
        rentalProductId: 'rnt-weeder-7hp',
        productTitle: 'AgriPro 7HP Multi-Speed Heavy-Duty Power Weeder',
        userId: 'usr-farmer-01',
        customerName: 'Ramesh Kumar Gowda',
        customerMobile: '9845190812',
        deliveryAddress: 'Farm Plot #14, Sy. No 124, Maddur Road, Kothathi, Mandya',
        pincode: '571401',
        warehouseId: 'wh-hubballi',
        startDate: '2026-09-17',
        endDate: '2026-09-20',
        totalDays: 3,
        pricingTier: 'DAILY',
        dailyRate: 850,
        rentAmount: 2550,
        securityDeposit: 3000,
        totalPaid: 5550,
        paymentMethod: 'ONLINE_UPI',
        paymentStatus: 'PAID',
        paymentId: 'pay_rnt_948122',
        status: 'ACTIVE',
        createdAt: '2026-09-16T10:00:00Z',
        updatedAt: '2026-09-17T08:00:00Z',
      },
      {
        id: 'rnt-bk-002',
        bookingNumber: 'RNT-2026-9320',
        rentalProductId: 'rnt-brush-cutter-4s',
        productTitle: 'KisanKraft 4-Stroke Multi-Crop Brush Cutter & Trimmer',
        userId: 'usr-farmer-01',
        customerName: 'Ramesh Kumar Gowda',
        customerMobile: '9845190812',
        deliveryAddress: 'Farm Plot #14, Sy. No 124, Maddur Road, Kothathi, Mandya',
        pincode: '571401',
        warehouseId: 'wh-hubballi',
        startDate: '2026-09-05',
        endDate: '2026-09-08',
        totalDays: 3,
        pricingTier: 'DAILY',
        dailyRate: 500,
        rentAmount: 1500,
        securityDeposit: 2000,
        totalPaid: 3500,
        paymentMethod: 'ONLINE_UPI',
        paymentStatus: 'PAID',
        paymentId: 'pay_rnt_932011',
        status: 'RETURNED_ON_TIME',
        actualReturnDate: '2026-09-08',
        lateDays: 0,
        lateFee: 0,
        damageFee: 0,
        depositRefundAmount: 2000,
        depositRefundStatus: 'PROCESSED',
        createdAt: '2026-09-04T12:00:00Z',
        updatedAt: '2026-09-08T16:30:00Z',
      },
      {
        id: 'rnt-bk-003',
        bookingNumber: 'RNT-2026-9104',
        rentalProductId: 'rnt-weeder-7hp',
        productTitle: 'AgriPro 7HP Multi-Speed Heavy-Duty Power Weeder',
        userId: 'usr-farmer-02',
        customerName: 'Ningappa Kamatar',
        customerMobile: '9886054321',
        deliveryAddress: 'Near Someshwara Temple, Dharwad Rural',
        pincode: '580004',
        warehouseId: 'wh-dharwad',
        startDate: '2026-08-20',
        endDate: '2026-08-23',
        totalDays: 3,
        pricingTier: 'DAILY',
        dailyRate: 850,
        rentAmount: 2550,
        securityDeposit: 3000,
        totalPaid: 5550,
        paymentMethod: 'ONLINE_UPI',
        paymentStatus: 'PAID',
        paymentId: 'pay_rnt_910455',
        status: 'RETURNED_LATE',
        actualReturnDate: '2026-08-25',
        lateDays: 2,
        lateFee: 2550, // 2 days * (850 * 1.5)
        damageFee: 0,
        depositRefundAmount: 450, // 3000 - 2550
        depositRefundStatus: 'PROCESSED',
        createdAt: '2026-08-19T09:00:00Z',
        updatedAt: '2026-08-25T17:00:00Z',
      },
    ],
    serviceRequests: [
      {
        id: 'srv-req-001',
        requestNumber: 'REQ-SRV-2026-108',
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
        address: 'Sy. No 124, Kothathi Hobli, Mandya Taluk',
        pincode: '571401',
        gpsLatitude: 12.5218,
        gpsLongitude: 76.8951,
        preferredDate: '2026-09-22',
        preferredTime: '08:00 AM - 12:00 PM',
        notes: 'Need 55HP tractor with MB plough for 4.5 acres sugarcane trash incorporation.',
        status: 'ASSIGNED',
        assignedProviderId: 'prv-mandya-01',
        assignedProviderName: 'Mandya Precision Agro Fleet #11',
        assignedOperatorMobile: '9480188990',
        assignedFleetUnit: 'Tractor Unit KA-11-T-4912 (Operator: Basavaraj)',
        estimatedCost: 6300,
        advancePaid: 1000,
        createdAt: '2026-09-16T11:00:00Z',
        updatedAt: '2026-09-16T14:30:00Z',
      },
      {
        id: 'srv-req-002',
        requestNumber: 'REQ-SRV-2026-109',
        userId: 'usr-farmer-02',
        customerName: 'Ningappa Kamatar',
        customerMobile: '9886054321',
        serviceId: 'srv-spraying',
        serviceName: 'Drone & Boom Precision Spraying',
        jobWorkId: 'jw-drone-micron',
        jobWorkName: 'Hexacopter Drone Micron-Spraying',
        farmAcreage: 6.0,
        cropType: 'Chili (Byadgi)',
        district: 'Dharwad',
        taluk: 'Dharwad',
        village: 'Hebballi',
        address: 'Plot 22, Near Hebballi Lake Bund',
        pincode: '580004',
        gpsLatitude: 15.4612,
        gpsLongitude: 75.0125,
        preferredDate: '2026-09-23',
        preferredTime: '06:00 AM - 09:00 AM',
        notes: 'Thrips and mite control using Neem-Guard botanical formulation.',
        status: 'REQUESTED',
        estimatedCost: 2700,
        advancePaid: 0,
        createdAt: '2026-09-17T09:15:00Z',
        updatedAt: '2026-09-17T09:15:00Z',
      },
    ],
    stockLedger: [
      {
        id: 'led-001',
        warehouseId: 'wh-hubballi',
        warehouseName: 'Hubballi Central Dark Warehouse',
        productId: 'prod-001',
        productName: 'AgriPro 7HP Heavy-Duty Multi-Speed Power Weeder',
        variantId: 'var-001-1',
        type: 'STOCK_IN',
        quantity: 15,
        balanceAfter: 15,
        referenceId: 'PO-2026-AUG-102',
        notes: 'Factory shipment from Bengaluru assembly unit. Inspection passed.',
        performedBy: 'Suresh Patil (Warehouse Mgr)',
        createdAt: '2026-09-01T10:00:00Z',
      },
      {
        id: 'led-002',
        warehouseId: 'wh-hubballi',
        warehouseName: 'Hubballi Central Dark Warehouse',
        productId: 'prod-001',
        productName: 'AgriPro 7HP Heavy-Duty Multi-Speed Power Weeder',
        variantId: 'var-001-1',
        type: 'DISPATCHED',
        quantity: 1,
        balanceAfter: 12,
        referenceId: 'AGM-2026-9481',
        notes: 'Dispatched to Mandya farm via VRL Logistics Agri Express (AWB: VRL-EXP-948122).',
        performedBy: 'Hubballi Dispatch Desk',
        createdAt: '2026-09-15T14:30:00Z',
      },
      {
        id: 'led-003',
        warehouseId: 'wh-dharwad',
        warehouseName: 'Dharwad Rural Fulfillment Hub',
        productId: 'prod-003',
        productName: 'Bhoomi Sanjivani Organic Micro-Nutrient Bio-Fertilizer (5 Kg)',
        variantId: 'var-003-1',
        type: 'STOCK_IN',
        quantity: 50,
        balanceAfter: 40,
        referenceId: 'PO-2026-SEP-018',
        notes: 'Bio-fertilizer batch receipt with test certificate.',
        performedBy: 'Mallikarjun Hiremath',
        createdAt: '2026-09-10T09:00:00Z',
      },
      {
        id: 'led-004',
        warehouseId: 'wh-dharwad',
        warehouseName: 'Dharwad Rural Fulfillment Hub',
        productId: 'prod-003',
        productName: 'Bhoomi Sanjivani Organic Micro-Nutrient Bio-Fertilizer (5 Kg)',
        variantId: 'var-003-1',
        type: 'RESERVED',
        quantity: 4,
        balanceAfter: 40,
        referenceId: 'AGM-2026-9482',
        notes: 'Stock reserved for Order #AGM-2026-9482 awaiting packing.',
        performedBy: 'Dharwad Fulfillment Operator',
        createdAt: '2026-09-17T08:00:00Z',
      },
    ],
    farmerProfiles: [
      {
        id: 'fp-001',
        userId: 'usr-farmer-01',
        farmerName: 'Ramesh Kumar Gowda',
        mobile: '9845190812',
        whatsappNumber: '9845190812',
        village: 'Kothathi',
        taluk: 'Mandya',
        district: 'Mandya',
        gpsLatitude: 12.5218,
        gpsLongitude: 76.8951,
        totalAcreage: 14.5,
        soilType: 'Black Cotton',
        primaryCrops: ['Sugarcane', 'Paddy', 'Vegetables'],
        currentCropStage: 'FLOWERING',
        sowingDate: '2026-06-15',
        expectedHarvestDate: '2026-11-20',
        totalSpend: 43726,
        successfulOrdersCount: 2,
        lastOrderDate: '2026-09-17',
        assignedAgronomist: 'Dr. H. M. Patil',
        notes: 'Progressive sugarcane grower using drip irrigation. Adopter of mechanized power weeder.',
        createdAt: '2026-06-01T08:00:00Z',
        updatedAt: '2026-09-17T09:00:00Z',
      },
      {
        id: 'fp-002',
        userId: 'usr-farmer-02',
        farmerName: 'Ningappa Kamatar',
        mobile: '9886054321',
        whatsappNumber: '9886054321',
        village: 'Hebballi',
        taluk: 'Dharwad',
        district: 'Dharwad',
        gpsLatitude: 15.4612,
        gpsLongitude: 75.0125,
        totalAcreage: 8.0,
        soilType: 'Clayey Loam',
        primaryCrops: ['Byadgi Chilli', 'Cotton'],
        currentCropStage: 'TILLERING_VEGETATIVE',
        sowingDate: '2026-07-01',
        expectedHarvestDate: '2026-12-10',
        totalSpend: 12850,
        successfulOrdersCount: 1,
        lastOrderDate: '2026-09-17',
        assignedAgronomist: 'Dr. S. K. Kulkarni',
        notes: 'Chilli farm with severe thrips vulnerability in vegetative stage. Booked drone bio-spraying.',
        createdAt: '2026-06-10T10:00:00Z',
        updatedAt: '2026-09-17T09:15:00Z',
      },
      {
        id: 'fp-003',
        farmerName: 'Basanagouda Patil',
        mobile: '9448102938',
        whatsappNumber: '9448102938',
        village: 'Kaginele',
        taluk: 'Byadgi',
        district: 'Haveri',
        gpsLatitude: 14.6803,
        gpsLongitude: 75.4870,
        totalAcreage: 22.0,
        soilType: 'Red Sandy Loam',
        primaryCrops: ['Maize', 'Groundnut'],
        currentCropStage: 'GERMINATION',
        sowingDate: '2026-08-20',
        expectedHarvestDate: '2026-12-30',
        totalSpend: 28400,
        successfulOrdersCount: 1,
        lastOrderDate: '2026-08-25',
        assignedAgronomist: 'Dr. H. M. Patil',
        notes: 'Pre-sowing weed management completed. Inquired regarding automatic boom sprayer hire.',
        createdAt: '2026-07-15T09:00:00Z',
        updatedAt: '2026-09-10T14:00:00Z',
      },
    ],
    agronomyFollowUps: [
      {
        id: 'afu-001',
        farmerProfileId: 'fp-001',
        farmerName: 'Ramesh Kumar Gowda',
        mobile: '9845190812',
        crop: 'Sugarcane',
        cropStage: 'FLOWERING',
        scheduledDate: '2026-09-22',
        purpose: 'Foliar nutrition check & borer inspection following Bhoomi Sanjivani application.',
        status: 'SCHEDULED',
        assignedAgronomist: 'Dr. H. M. Patil',
        createdAt: '2026-09-16T10:00:00Z',
      },
      {
        id: 'afu-002',
        farmerProfileId: 'fp-002',
        farmerName: 'Ningappa Kamatar',
        mobile: '9886054321',
        crop: 'Byadgi Chilli',
        cropStage: 'TILLERING_VEGETATIVE',
        scheduledDate: '2026-09-18',
        purpose: 'Thrips and leaf curl virus check with Neem-Guard bio-insecticide.',
        status: 'SCHEDULED',
        assignedAgronomist: 'Dr. S. K. Kulkarni',
        createdAt: '2026-09-17T09:30:00Z',
      },
      {
        id: 'afu-003',
        farmerProfileId: 'fp-001',
        farmerName: 'Ramesh Kumar Gowda',
        mobile: '9845190812',
        crop: 'Sugarcane',
        cropStage: 'TILLERING_VEGETATIVE',
        scheduledDate: '2026-09-02',
        purpose: 'Initial soil conditioning verification post power weeder weeding.',
        status: 'COMPLETED',
        agronomistNotes: 'Farmer reported 95% weed eradication; soil aeration optimal. Recommended micro-nutrient foliar dose.',
        assignedAgronomist: 'Dr. H. M. Patil',
        completedAt: '2026-09-02T11:00:00Z',
        createdAt: '2026-08-28T09:00:00Z',
      },
    ],
    productUsageLogs: [
      {
        id: 'pul-001',
        farmerProfileId: 'fp-001',
        orderId: 'ord-001',
        productId: 'prod-003',
        productName: 'Bhoomi Sanjivani Organic Micro-Nutrient Bio-Fertilizer (5 Kg)',
        crop: 'Sugarcane',
        quantityUsed: '5 Kg',
        appliedDate: '2026-09-12',
        season: 'Kharif 2026',
        notes: 'Applied in root zone during tillering stage after power tilling.',
        createdAt: '2026-09-12T16:00:00Z',
      },
      {
        id: 'pul-002',
        farmerProfileId: 'fp-001',
        orderId: 'ord-001',
        productId: 'prod-001',
        productName: 'AgriPro 7HP Heavy-Duty Multi-Speed Power Weeder',
        crop: 'Sugarcane',
        quantityUsed: '1 Unit',
        appliedDate: '2026-09-15',
        season: 'Kharif 2026',
        notes: 'Inter-row weeding completed across 4.5 acres in 2 days.',
        createdAt: '2026-09-15T18:00:00Z',
      },
      {
        id: 'pul-003',
        farmerProfileId: 'fp-002',
        orderId: 'ord-002',
        productId: 'prod-004',
        productName: 'Neem-Guard 10000 PPM Certified Botanical Bio-Insecticide (1 Litre)',
        crop: 'Byadgi Chilli',
        quantityUsed: '1 Litre',
        appliedDate: '2026-09-10',
        season: 'Kharif 2026',
        notes: 'Foliar spray at 2.5 ml per litre of water using 16L knapsack sprayer.',
        createdAt: '2026-09-10T17:00:00Z',
      },
    ],
    salesLeads: [
      {
        id: 'lead-001',
        leadNumber: 'SL-2026-801',
        customerName: 'Ramesh Kumar Gowda',
        mobile: '9845190812',
        village: 'Kothathi',
        taluk: 'Mandya',
        district: 'Mandya',
        leadSource: 'AI_ADVISORY',
        aiHistoryId: 'ai-chat-8491',
        aiDiagnosisSummary: 'Sugarcane inter-row weed management & micro-nutrient deficiency consultation.',
        interestedCategory: 'Farm Equipment & Machinery',
        interestedProductTitle: 'AgriPro 7HP Heavy-Duty Multi-Speed Power Weeder',
        estimatedValue: 36500,
        stage: 'CONVERTED',
        assignedExecutiveId: 'exec-01',
        assignedExecutiveName: 'Sunil Kumar (Mandya Belt)',
        remarks: 'Customer completed order on portal. Very satisfied with doorstep demo.',
        communicationLog: [
          { type: 'SMS', note: 'Lead created via AI Advisory recommendation.', timestamp: '2026-09-14T09:00:00Z' },
          { type: 'CALL', note: 'Called farmer. Explained reverse gear and blade durability.', timestamp: '2026-09-14T11:30:00Z' },
          { type: 'VISIT', note: 'Field demonstration conducted at Kothathi farm.', timestamp: '2026-09-16T14:00:00Z' },
        ],
        createdAt: '2026-09-14T09:00:00Z',
        updatedAt: '2026-09-16T18:00:00Z',
      },
      {
        id: 'lead-002',
        leadNumber: 'SL-2026-802',
        customerName: 'Ningappa Kamatar',
        mobile: '9886054321',
        village: 'Hebballi',
        taluk: 'Dharwad',
        district: 'Dharwad',
        leadSource: 'WHATSAPP',
        interestedCategory: 'Crop Protection & Bio-Care',
        interestedProductTitle: 'Neem-Guard 10000 PPM Bio-Insecticide & Drone Spraying',
        estimatedValue: 4500,
        stage: 'CONVERTED',
        assignedExecutiveId: 'exec-02',
        assignedExecutiveName: 'Anand Patil (Kittur Belt)',
        remarks: 'Order #AGM-2026-9482 confirmed. Bio-inputs being fulfilled from Dharwad hub.',
        communicationLog: [
          { type: 'WHATSAPP', note: 'Inquired about organic thrips remedy for Byadgi chilli.', timestamp: '2026-09-16T10:00:00Z' },
          { type: 'CALL', note: 'Shared product dosage and CIB certification details.', timestamp: '2026-09-16T14:00:00Z' },
        ],
        createdAt: '2026-09-16T10:00:00Z',
        updatedAt: '2026-09-17T08:30:00Z',
      },
      {
        id: 'lead-003',
        leadNumber: 'SL-2026-803',
        customerName: 'Shivanand Deshmukh',
        mobile: '9741022334',
        village: 'Kanbargi',
        taluk: 'Belagavi',
        district: 'Belagavi',
        leadSource: 'FIELD_CAMP',
        interestedCategory: 'Farm Equipment & Machinery',
        interestedProductTitle: 'Self-Propelled 10HP Multi-Crop Reaper Binder',
        estimatedValue: 145000,
        stage: 'QUOTATION_SENT',
        assignedExecutiveId: 'exec-03',
        assignedExecutiveName: 'Priya Nayak (Belagavi Hub)',
        nextFollowUpDate: '2026-09-20',
        remarks: 'Requested commercial proforma invoice for nationalised bank crop loan subsidy.',
        communicationLog: [
          { type: 'VISIT', note: 'Met at APMC Belagavi Kisan Mela. Inspected 18-acre paddy field.', timestamp: '2026-09-14T11:00:00Z' },
          { type: 'CALL', note: 'Emailed official bank proforma invoice with 1-year AMC terms.', timestamp: '2026-09-15T15:00:00Z' },
        ],
        createdAt: '2026-09-14T11:00:00Z',
        updatedAt: '2026-09-15T15:00:00Z',
      },
      {
        id: 'lead-004',
        leadNumber: 'SL-2026-804',
        customerName: 'Mallappa Angadi',
        mobile: '9632155667',
        village: 'Devihosur',
        taluk: 'Haveri',
        district: 'Haveri',
        leadSource: 'AI_ADVISORY',
        aiHistoryId: 'ai-chat-8512',
        aiDiagnosisSummary: 'Groundnut root rot & trichoderma bio-fertilizer inquiry.',
        interestedCategory: 'Fertilizers & Soil Care',
        interestedProductTitle: 'Bhoomi Sanjivani Organic Bio-Fertilizer (50 Kg Bulk Pack)',
        estimatedValue: 8500,
        stage: 'FOLLOW_UP',
        assignedExecutiveId: 'exec-02',
        assignedExecutiveName: 'Anand Patil (Kittur Belt)',
        nextFollowUpDate: '2026-09-19',
        remarks: 'Needs confirmation on bulk freight waiver from Haveri dark warehouse.',
        communicationLog: [
          { type: 'SMS', note: 'AI diagnosis pushed into lead queue.', timestamp: '2026-09-16T12:00:00Z' },
          { type: 'CALL', note: 'Discussed application rate of 25kg/acre for groundnut.', timestamp: '2026-09-16T16:00:00Z' },
        ],
        createdAt: '2026-09-16T12:00:00Z',
        updatedAt: '2026-09-16T16:00:00Z',
      },
      {
        id: 'lead-005',
        leadNumber: 'SL-2026-805',
        customerName: 'Chandrashekhar Bellad',
        mobile: '9481233445',
        village: 'Hadadi',
        taluk: 'Davanagere',
        district: 'Davanagere',
        leadSource: 'WEBSITE',
        interestedCategory: 'Irrigation & Water Tech',
        interestedProductTitle: 'Automatic Venturi Fertilizer Injector Kit 2-Inch',
        estimatedValue: 12000,
        stage: 'INTERESTED',
        assignedExecutiveId: 'exec-01',
        assignedExecutiveName: 'Sunil Kumar (Mandya Belt)',
        nextFollowUpDate: '2026-09-21',
        remarks: 'Interested in fertigation setup for 10-acre arecanut plantation.',
        communicationLog: [
          { type: 'SMS', note: 'Web portal enquiry received.', timestamp: '2026-09-17T08:00:00Z' },
        ],
        createdAt: '2026-09-17T08:00:00Z',
        updatedAt: '2026-09-17T08:00:00Z',
      },
    ],
    salesVisits: [
      {
        id: 'sv-001',
        leadId: 'lead-003',
        leadNumber: 'SL-2026-803',
        farmerName: 'Shivanand Deshmukh',
        executiveId: 'exec-03',
        executiveName: 'Priya Nayak',
        visitDate: '2026-09-14',
        gpsLatitude: 15.8521,
        gpsLongitude: 74.5012,
        cropObserved: 'Paddy (Gangavati Sona)',
        acreage: 18.0,
        visitSummary: 'Assessed field layout and bund clearance for 10HP reaper binder entry. Soil moisture is optimal.',
        outcome: 'PROPOSAL_SUBMITTED',
        createdAt: '2026-09-14T12:00:00Z',
      },
      {
        id: 'sv-002',
        leadId: 'lead-001',
        leadNumber: 'SL-2026-801',
        farmerName: 'Ramesh Kumar Gowda',
        executiveId: 'exec-01',
        executiveName: 'Sunil Kumar',
        visitDate: '2026-09-16',
        gpsLatitude: 12.5218,
        gpsLongitude: 76.8951,
        cropObserved: 'Sugarcane (Co 86032)',
        acreage: 14.5,
        visitSummary: 'Live operational demonstration of AgriPro 7HP Power Weeder in 4ft sugarcane rows. Customer executed order.',
        outcome: 'CLOSED_WON',
        createdAt: '2026-09-16T15:00:00Z',
      },
    ],
    salesTargets: [
      {
        executiveId: 'exec-01',
        executiveName: 'Sunil Kumar (Mandya & South)',
        month: 'September 2026',
        targetAmount: 500000,
        achievedAmount: 395000,
        leadsTarget: 20,
        leadsConverted: 14,
      },
      {
        executiveId: 'exec-02',
        executiveName: 'Anand Patil (Kittur & Haveri)',
        month: 'September 2026',
        targetAmount: 400000,
        achievedAmount: 320000,
        leadsTarget: 18,
        leadsConverted: 12,
      },
      {
        executiveId: 'exec-03',
        executiveName: 'Priya Nayak (Belagavi & Coastal)',
        month: 'September 2026',
        targetAmount: 600000,
        achievedAmount: 480000,
        leadsTarget: 25,
        leadsConverted: 18,
      },
    ],
    notificationQueue: [
      {
        id: 'qnotif-001',
        idempotencyKey: 'idemp-ord-001-dispatch-sms',
        event: 'ORDER_DISPATCHED',
        channel: 'SMS',
        recipient: '9845190812',
        recipientRole: 'CUSTOMER',
        title: 'Order Dispatched',
        message: 'Kisan Bandhu, your AgriMart Order #AGM-2026-9481 has been dispatched from Hubballi Dark Warehouse via VRL Express. Tracking: VRL-EXP-948122.',
        status: 'SENT',
        attempts: 1,
        maxRetries: 3,
        scheduledAt: '2026-09-15T14:30:00Z',
        sentAt: '2026-09-15T14:30:05Z',
      },
      {
        id: 'qnotif-002',
        idempotencyKey: 'idemp-ord-002-assign-wh-email',
        event: 'WAREHOUSE_ASSIGNED',
        channel: 'EMAIL',
        recipient: '+91 94481 55667',
        recipientRole: 'WAREHOUSE_MANAGER',
        title: 'New Order Allocated to Hub',
        message: 'Order #AGM-2026-9482 allocated to Dharwad Hub for express bio-input packing.',
        status: 'SENT',
        attempts: 1,
        maxRetries: 3,
        scheduledAt: '2026-09-17T08:00:00Z',
        sentAt: '2026-09-17T08:00:03Z',
      },
    ],
    integrations: [
      {
        id: 'gokwik',
        name: 'GoKwik 1-Click Fast Checkout',
        category: 'Checkout & Risk Intelligence',
        description: 'Pre-filled farmer address intelligence, 1-click UPI checkout, and RTO fraud risk scoring for COD orders.',
        status: 'SANDBOX_ACTIVE',
        endpointUrl: 'https://sandbox.gokwik.co/v1/orders/checkout',
        fallbackBehavior: 'Gracefully falls back to AgriMart Native Multi-Step Checkout with PIN validation and local payment gateways.',
        lastPingTime: new Date().toISOString(),
        lastPingStatus: 'SUCCESS',
        pingLatencyMs: 68,
        supportedFeatures: ['1-Click OTP Login', 'RTO Risk Scoring', 'Address Auto-Fill', 'UPI Instant Pay'],
      },
      {
        id: 'eaadhaar',
        name: 'UIDAI E-Aadhaar KYC Service',
        category: 'Government Subsidy Verification',
        description: 'Instant farmer Aadhaar authentication for direct DBT machinery subsidies and Karnataka Krishi Yantra Dhare schemes.',
        status: 'PENDING_PRODUCTION_KEY',
        endpointUrl: 'https://eaadhaar.uidai.gov.in/kyc/v2/auth',
        fallbackBehavior: 'Falls back to manual document upload (Farmer Pahani / RTC + Aadhaar photocopy) for manual Super Admin review.',
        lastPingTime: new Date().toISOString(),
        lastPingStatus: 'SUCCESS',
        pingLatencyMs: 112,
        supportedFeatures: ['Biometric / OTP KYC', 'Farmer Identity Verification', 'DBT Subsidy Eligibility Check'],
      },
      {
        id: 'calendly',
        name: 'Calendly Agronomist Scheduling',
        category: 'Field Advisory Appointments',
        description: 'Interactive booking widget and webhook sync for 1-on-1 virtual or on-farm agronomist consultations.',
        status: 'SANDBOX_ACTIVE',
        endpointUrl: 'https://api.calendly.com/v2/scheduled_events',
        fallbackBehavior: 'Falls back to AgriMart In-House Follow-Up Scheduler and direct telephone agronomist queues.',
        lastPingTime: new Date().toISOString(),
        lastPingStatus: 'SUCCESS',
        pingLatencyMs: 84,
        supportedFeatures: ['Real-Time Calendar Sync', 'Automated SMS Reminders', 'Reschedule / Cancel Webhooks'],
      },
    ],
    ...getInitialRepairFinanceData(),
    ...getInitialGalleryAndBlogData(),
    farmerCropGalleries: getInitialFarmerCropGalleries(),
  };
}

class PersistentDevDatabase {
  private data: DevDatabaseData;
  private saveTimeout: NodeJS.Timeout | null = null;
  private isSaving: boolean = false;
  private pendingSave: boolean = false;

  constructor() {
    ensureDataDirectory();
    if (fs.existsSync(DATA_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure new collections exist in loaded dataset
        const defaults = getInitialData();
        if (!this.data.rentalProducts || this.data.rentalProducts.length === 0) {
          this.data.rentalProducts = defaults.rentalProducts;
        }
        if (!this.data.rentalBookings || this.data.rentalBookings.length === 0) {
          this.data.rentalBookings = defaults.rentalBookings;
        }
        if (!this.data.serviceRequests || this.data.serviceRequests.length === 0) {
          this.data.serviceRequests = defaults.serviceRequests;
        }
        if (!this.data.stockLedger || this.data.stockLedger.length === 0) {
          this.data.stockLedger = defaults.stockLedger;
        }
        if (!this.data.farmerProfiles || this.data.farmerProfiles.length === 0) {
          this.data.farmerProfiles = defaults.farmerProfiles;
        }
        if (!this.data.agronomyFollowUps || this.data.agronomyFollowUps.length === 0) {
          this.data.agronomyFollowUps = defaults.agronomyFollowUps;
        }
        if (!this.data.productUsageLogs || this.data.productUsageLogs.length === 0) {
          this.data.productUsageLogs = defaults.productUsageLogs;
        }
        if (!this.data.salesLeads || this.data.salesLeads.length === 0) {
          this.data.salesLeads = defaults.salesLeads;
        }
        if (!this.data.salesVisits || this.data.salesVisits.length === 0) {
          this.data.salesVisits = defaults.salesVisits;
        }
        if (!this.data.salesTargets || this.data.salesTargets.length === 0) {
          this.data.salesTargets = defaults.salesTargets;
        }
        if (!this.data.notificationQueue || this.data.notificationQueue.length === 0) {
          this.data.notificationQueue = defaults.notificationQueue;
        }
        if (!this.data.integrations || this.data.integrations.length === 0) {
          this.data.integrations = defaults.integrations;
        }
        if (!this.data.customerEquipments || this.data.customerEquipments.length === 0) {
          this.data.customerEquipments = defaults.customerEquipments;
        }
        if (!this.data.jobCards || this.data.jobCards.length === 0) {
          this.data.jobCards = defaults.jobCards;
        }
        if (!this.data.spareParts || this.data.spareParts.length === 0) {
          this.data.spareParts = defaults.spareParts;
        }
        if (!this.data.sparePartTransactions) {
          this.data.sparePartTransactions = defaults.sparePartTransactions;
        }
        if (!this.data.labourCatalogue || this.data.labourCatalogue.length === 0) {
          this.data.labourCatalogue = defaults.labourCatalogue;
        }
        if (!this.data.warrantyClaims || this.data.warrantyClaims.length === 0) {
          this.data.warrantyClaims = defaults.warrantyClaims;
        }
        if (!this.data.serviceReminders || this.data.serviceReminders.length === 0) {
          this.data.serviceReminders = defaults.serviceReminders;
        }
        if (!this.data.dealerProfiles || this.data.dealerProfiles.length === 0) {
          this.data.dealerProfiles = defaults.dealerProfiles;
        }
        if (!this.data.commissionTargets || this.data.commissionTargets.length === 0) {
          this.data.commissionTargets = defaults.commissionTargets;
        }
        if (!this.data.payoutRecords || this.data.payoutRecords.length === 0) {
          this.data.payoutRecords = defaults.payoutRecords;
        }
        if (!this.data.financeAuditLogs || this.data.financeAuditLogs.length === 0) {
          this.data.financeAuditLogs = defaults.financeAuditLogs;
        }
        if (!this.data.galleryItems || this.data.galleryItems.length === 0) {
          this.data.galleryItems = defaults.galleryItems;
        }
        if (!this.data.blogPosts || this.data.blogPosts.length === 0) {
          this.data.blogPosts = defaults.blogPosts;
        }
        if (!this.data.blogReviews) {
          this.data.blogReviews = defaults.blogReviews || [];
        }
        // Ensure cropGuidance and settings exist
        if (!this.data.cropGuidance || this.data.cropGuidance.length === 0) {
          try {
            const rawFile = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
            const parsed = JSON.parse(rawFile);
            if (parsed.cropGuidance && parsed.cropGuidance.length > 0) {
              this.data.cropGuidance = parsed.cropGuidance;
            }
            if (parsed.cropGuidanceSettings) {
              this.data.cropGuidanceSettings = parsed.cropGuidanceSettings;
            }
            if (parsed.gallerySettings) {
              this.data.gallerySettings = parsed.gallerySettings;
            }
          } catch {}
        }
        if (!this.data.farmerCropGalleries || this.data.farmerCropGalleries.length === 0) {
          this.data.farmerCropGalleries = defaults.farmerCropGalleries || getInitialFarmerCropGalleries();
        }
        this.ensureCategoriesAndProductsEnriched(defaults);
      } catch (err) {
        console.warn('[DEV_DB] Error parsing existing dev database file, initializing with defaults.', err);
        this.data = getInitialData();
        this.save();
      }
    } else {
      this.data = getInitialData();
      this.save();
    }
    this.clearStorefrontCatalogueOnce();
    this.importAgrimartCatalogueOnce();
  }

  /**
   * One-time import of the full Agrimart product catalogue (226 products with images, brands,
   * categories, prices, model/RIPL codes, specifications, brochures and videos).
   */
  private importAgrimartCatalogueOnce() {
    const anyData = this.data as any;
    if (anyData.agrimartCatalogueImportV1) return;
    const cat = agrimartCatalogue as any;
    const upsert = (key: string, rows: any[]) => {
      if (!Array.isArray(anyData[key])) anyData[key] = [];
      const ids = new Set(anyData[key].map((r: any) => r.id));
      for (const r of rows) if (!ids.has(r.id)) anyData[key].push(r);
    };
    upsert('brands', cat.brands || []);
    upsert('categories', cat.categories || []);
    upsert('products', cat.products || []);
    upsert('variants', cat.variants || []);
    upsert('media', cat.media || []);
    upsert('specifications', cat.specifications || []);
    upsert('warehouseStocks', cat.warehouseStocks || []);
    anyData.agrimartCatalogueImportV1 = new Date().toISOString();
    this.save();
  }

  /**
   * One-time reset: removes every existing shop product (and its variants, media,
   * specifications and warehouse stock) so the catalogue can be re-imported from a new source.
   * Products created afterwards via Admin are kept because the flag stays set.
   */
  private clearStorefrontCatalogueOnce() {
    const anyData = this.data as any;
    if (anyData.catalogueResetV1) return;
    this.data.products = [];
    this.data.variants = [];
    this.data.media = [];
    this.data.specifications = [];
    this.data.warehouseStocks = [];
    if (Array.isArray(anyData.stockReservations)) anyData.stockReservations = [];
    anyData.catalogueResetV1 = new Date().toISOString();
    this.save();
  }

  private ensureCategoriesAndProductsEnriched(defaults: DevDatabaseData) {
    let changed = false;
    const rootCatIds = ['cat-machinery', 'cat-seeds', 'cat-fertilizers', 'cat-protection', 'cat-irrigation', 'cat-tools'];

    // 1. Ensure all 6 root categories have parentId: null
    if (!Array.isArray(this.data.categories)) {
      this.data.categories = defaults.categories;
      changed = true;
    } else {
      for (const defCat of defaults.categories) {
        const existing = this.data.categories.find((c) => c.id === defCat.id);
        if (!existing) {
          this.data.categories.push(defCat);
          changed = true;
        } else if (rootCatIds.includes(existing.id) && existing.parentId) {
          existing.parentId = null;
          changed = true;
        }
      }
    }

    // 2. Ensure all products have parentCategoryId, subCategoryId, brandId, and complete details
    const defaultSubcategoryByRoot: Record<string, string> = {
      'cat-machinery': 'subcat-weeders-tillers',
      'cat-seeds': 'subcat-cereal-seeds',
      'cat-fertilizers': 'subcat-bio-fertilizers',
      'cat-protection': 'subcat-bio-insecticides',
      'cat-irrigation': 'subcat-drip-fertigation',
      'cat-tools': 'subcat-harvest-storage',
    };

    if (Array.isArray(this.data.products)) {
      for (const prod of this.data.products) {
        const defProd = defaults.products.find((dp) => dp.id === prod.id);
        if (defProd) {
          // Fix prod-006 if it was pointing to cat-machinery instead of cat-irrigation
          if (prod.id === 'prod-006' && prod.categoryId === 'cat-machinery') {
            prod.categoryId = 'cat-irrigation';
            prod.parentCategoryId = 'cat-irrigation';
            prod.subCategoryId = 'subcat-drip-fertigation';
            changed = true;
          }
          const enrichKeys: (keyof DbProduct)[] = [
            'parentCategoryId',
            'subCategoryId',
            'brandId',
            'cost',
            'weight',
            'length',
            'width',
            'height',
            'gtin',
            'manufacturerPartNumber',
            'vendor',
            'taxCategory',
            'deliveryDate',
            'metaTitle',
            'metaKeywords',
            'metaDescription',
            'shortDescription',
            'description',
            'targetCrops',
            'cropStages',
          ];
          for (const key of enrichKeys) {
            if ((prod as any)[key] === undefined || (prod as any)[key] === '') {
              if ((defProd as any)[key] !== undefined) {
                (prod as any)[key] = (defProd as any)[key];
                changed = true;
              }
            }
          }
        }

        // For any custom/extra products in dev-database.json
        const catObj = this.data.categories.find((c) => c.id === prod.categoryId);
        if (catObj && catObj.parentId) {
          if (prod.subCategoryId !== catObj.id || prod.parentCategoryId !== catObj.parentId) {
            prod.subCategoryId = catObj.id;
            prod.parentCategoryId = catObj.parentId;
            prod.categoryId = catObj.parentId;
            changed = true;
          }
        } else {
          const parentId = prod.parentCategoryId || prod.categoryId || 'cat-machinery';
          if (!prod.parentCategoryId) {
            prod.parentCategoryId = parentId;
            changed = true;
          }
          if (!prod.subCategoryId) {
            prod.subCategoryId = defaultSubcategoryByRoot[parentId] || 'subcat-weeders-tillers';
            changed = true;
          }
        }

        // Remove stale embedded category object if present so getProductWithDetails resolves fresh hierarchy
        if ((prod as any).category) {
          delete (prod as any).category;
          changed = true;
        }

        // Enrich missing commercial/logistics details on custom products
        if (!prod.brandId) {
          prod.brandId = 'br-agripro';
          changed = true;
        }
        if (!prod.cost) {
          prod.cost = Math.round((prod.price || 500) * 0.78);
          changed = true;
        }
        if (!prod.weight) {
          prod.weight = prod.id === 'prod-001' ? 72 : 5;
          changed = true;
        }
        if (!prod.length) {
          prod.length = prod.id === 'prod-001' ? 120 : 35;
          prod.width = prod.id === 'prod-001' ? 75 : 25;
          prod.height = prod.id === 'prod-001' ? 95 : 20;
          changed = true;
        }
        if (!prod.gtin) {
          prod.gtin = `8901234${String(prod.sku || '999999').replace(/[^0-9]/g, '').padEnd(6, '0').slice(0, 6)}`;
          changed = true;
        }
        if (!prod.manufacturerPartNumber) {
          prod.manufacturerPartNumber = `${prod.sku || 'AGM'}-IND`;
          changed = true;
        }
        if (!prod.vendor) {
          prod.vendor = 'Agri-Mart Direct';
          changed = true;
        }
        if (!prod.taxCategory) {
          prod.taxCategory = 'Exempt / Agricultural (5% GST)';
          changed = true;
        }
        if (!prod.deliveryDate) {
          prod.deliveryDate = '1-2 days (Express Hub)';
          changed = true;
        }
        if (!prod.metaTitle) {
          prod.metaTitle = `Buy ${prod.name} | Agri-Mart India`;
          changed = true;
        }
        if (!prod.metaKeywords) {
          prod.metaKeywords = `${prod.name.toLowerCase()}, agri mart, farming inputs`;
          changed = true;
        }
        if (!prod.metaDescription) {
          prod.metaDescription = prod.shortDescription || prod.description || `Shop ${prod.name} at Agri-Mart.`;
          changed = true;
        }

        // Ensure default specifications exist for every product
        const hasSpecs = this.data.specifications?.some((s) => s.productId === prod.id);
        if (!hasSpecs && Array.isArray(this.data.specifications)) {
          this.data.specifications.push(
            {
              id: `sp-${prod.id}-1`,
              productId: prod.id,
              group: 'Quality & Certification',
              name: 'Quality Standard',
              value: 'ISO & FCO / BIS Certified Agricultural Grade',
              displayOrder: 1,
            },
            {
              id: `sp-${prod.id}-2`,
              productId: prod.id,
              group: 'Packaging & Dispatch',
              name: 'Fulfillment Hub',
              value: 'Hubballi & Dharwad Central Dark Warehouses',
              displayOrder: 2,
            }
          );
          changed = true;
        }
      }
    }

    if (changed) {
      this.saveSync();
    }
  }

  public save() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    this.saveSync();
  }

  public async flushToDisk(): Promise<void> {
    this.saveSync();
  }

  public saveSync(): void {
    const content = JSON.stringify(this.data, null, 2);
    try {
      ensureDataDirectory(DATA_FILE_PATH);
      fs.writeFileSync(DATA_FILE_PATH, content, 'utf-8');
    } catch (err) {
      try {
        ensureDataDirectory(TMP_FALLBACK_PATH);
        fs.writeFileSync(TMP_FALLBACK_PATH, content, 'utf-8');
      } catch (tmpErr) {
        console.error('[DEV_DB] Error saving dev database file synchronously', tmpErr);
      }
    }
  }

  public reload(): void {
    if (fs.existsSync(DATA_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        this.data = JSON.parse(raw);
        this.ensureCategoriesAndProductsEnriched(getInitialData());
      } catch (err) {
        console.error('[DEV_DB] Error reloading dev database file', err);
      }
    }
  }

  public getRawData(): any {
    return this.data;
  }

  // Brands
  getBrands(): DbBrand[] {
    return this.data.brands;
  }

  // Categories
  getCategories(): DbCategory[] {
    return this.data.categories.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getCategoryBySlug(slug: string): DbCategory | undefined {
    return this.data.categories.find((c) => c.slug === slug);
  }

  saveCategory(category: Partial<DbCategory> & { name: string; slug: string }): DbCategory {
    const existingIndex = this.data.categories.findIndex((c) => c.id === category.id || c.slug === category.slug);
    const now = new Date().toISOString();
    if (existingIndex >= 0) {
      const updated: DbCategory = {
        ...this.data.categories[existingIndex],
        ...category,
        published: category.published !== undefined ? category.published : (category.isPublished !== undefined ? category.isPublished : this.data.categories[existingIndex].published ?? false),
        isPublished: category.published !== undefined ? category.published : (category.isPublished !== undefined ? category.isPublished : this.data.categories[existingIndex].isPublished ?? false),
        restrictFromVendors: category.restrictFromVendors !== undefined ? category.restrictFromVendors : this.data.categories[existingIndex].restrictFromVendors ?? false,
        updatedAt: now,
      };
      this.data.categories[existingIndex] = updated;
      this.save();
      return updated;
    } else {
      const isPub = category.published !== undefined ? category.published : (category.isPublished !== undefined ? category.isPublished : false);
      const created: DbCategory = {
        id: category.id || `cat-${Date.now()}`,
        name: category.name,
        nameKn: category.nameKn,
        slug: category.slug,
        description: category.description,
        image: category.image,
        parentId: category.parentId || null,
        displayOrder: category.displayOrder || this.data.categories.length + 1,
        published: isPub,
        isPublished: isPub,
        restrictFromVendors: category.restrictFromVendors || false,
        showOnHomePage: category.showOnHomePage || false,
        allowCustomersToSelectPageSize: category.allowCustomersToSelectPageSize !== undefined ? category.allowCustomersToSelectPageSize : false,
        pageSizeOptions: category.pageSizeOptions || '6, 3, 9',
        priceRangeFiltering: category.priceRangeFiltering !== undefined ? category.priceRangeFiltering : false,
        manuallyPriceRange: category.manuallyPriceRange !== undefined ? category.manuallyPriceRange : false,
        priceFrom: category.priceFrom !== undefined ? category.priceFrom : 0,
        priceTo: category.priceTo !== undefined ? category.priceTo : 10000,
        customerRoles: category.customerRoles,
        limitedToStores: category.limitedToStores,
        seName: category.seName || category.slug,
        metaTitle: category.metaTitle,
        metaKeywords: category.metaKeywords,
        metaDescription: category.metaDescription,
        createdAt: now,
        updatedAt: now,
      };
      this.data.categories.push(created);
      this.save();
      return created;
    }
  }

  // Products
  getProducts(filters?: {
    categoryId?: string;
    crop?: string;
    stage?: number;
    search?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    onlyPublished?: boolean;
  }): DbProduct[] {
    return this.data.products.filter((p) => {
      if (filters?.onlyPublished !== false && p.isDraft) return false;
      if (filters?.categoryId) {
        const targetCat = filters.categoryId;
        // Match direct categoryId, parentCategoryId, subCategoryId, or any child category of targetCat
        const childCatIds = this.data.categories
          .filter((c) => c.parentId === targetCat)
          .map((c) => c.id);
        const matchesCat =
          p.categoryId === targetCat ||
          p.parentCategoryId === targetCat ||
          p.subCategoryId === targetCat ||
          childCatIds.includes(p.categoryId) ||
          (p.subCategoryId && childCatIds.includes(p.subCategoryId));
        if (!matchesCat) return false;
      }
      if (filters?.crop) {
        const cropsStr = Array.isArray(p.targetCrops)
          ? (p.targetCrops as string[]).join(', ')
          : (p.targetCrops || '');
        if (!cropsStr.toLowerCase().includes(filters.crop.toLowerCase())) return false;
      }
      if (filters?.stage) {
        const stages = Array.isArray(p.cropStages)
          ? (p.cropStages as any[]).map(Number)
          : (p.cropStages ? String(p.cropStages).split(',').map((s) => parseInt(s.trim())) : []);
        if (!stages.includes(filters.stage)) return false;
      }
      if (filters?.isFeatured !== undefined && p.isFeatured !== filters.isFeatured) return false;
      if (filters?.isBestSeller !== undefined && p.isBestSeller !== filters.isBestSeller) return false;
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(q) || (p.nameKn && p.nameKn.toLowerCase().includes(q));
        const matchesSku = (p.sku || '').toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesDesc) return false;
      }
      return true;
    });
  }

  getProductById(id: string): DbProduct | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  getProductBySlug(slug: string): DbProduct | undefined {
    return this.data.products.find((p) => p.slug === slug);
  }

  getProductWithDetails(slugOrId: string) {
    const product = this.data.products.find((p) => p.slug === slugOrId || p.id === slugOrId);
    if (!product) return null;

    const brand = this.data.brands.find((b) => b.id === product.brandId) || (product as any).brand;
    const rawCat = this.data.categories.find((c) => c.id === product.categoryId) || (product as any).category;

    // Resolve Parent Category and Subcategory (Child Category)
    let parentCategory: DbCategory | undefined;
    let subCategory: DbCategory | undefined;

    if (product.subCategoryId) {
      subCategory = this.data.categories.find((c) => c.id === product.subCategoryId);
    }
    if (product.parentCategoryId) {
      parentCategory = this.data.categories.find((c) => c.id === product.parentCategoryId);
    }

    if (!parentCategory && rawCat) {
      if (rawCat.parentId) {
        subCategory = subCategory || rawCat;
        parentCategory = this.data.categories.find((c) => c.id === rawCat.parentId) || rawCat;
      } else {
        parentCategory = rawCat;
      }
    }

    // If still no subCategory, check if there is a default child category for this parent
    if (parentCategory && !subCategory) {
      subCategory = this.data.categories.find((c) => c.parentId === parentCategory!.id);
    }

    const category = parentCategory || rawCat;
    const categoryHierarchy = parentCategory && subCategory
      ? `${parentCategory.name} >> ${subCategory.name}`
      : (category?.name || 'Uncategorized');

    const variants = this.data.variants.filter((v) => v.productId === product.id);
    let media = this.data.media.filter((m) => m.productId === product.id).sort((a, b) => a.displayOrder - b.displayOrder);
    const specifications = this.data.specifications.filter((s) => s.productId === product.id).sort((a, b) => a.displayOrder - b.displayOrder);
    const reviews = this.data.reviews.filter((r) => r.productId === product.id && r.status === 'APPROVED');
    const warehouseStocks = this.data.warehouseStocks.filter((ws) => ws.productId === product.id);

    let images = media.map((m) => m.url);

    // If media is empty but product has embedded images, use them
    if (images.length === 0 && Array.isArray((product as any).images) && (product as any).images.length > 0) {
      images = (product as any).images;
      media = images.map((url: string, idx: number) => ({
        id: `med-${product.id}-${idx + 1}`,
        productId: product.id,
        url,
        altText: `${product.name} - Picture ${idx + 1}`,
        type: 'IMAGE',
        isPrimary: idx === 0,
        displayOrder: idx + 1,
        createdAt: product.createdAt || new Date().toISOString(),
      }));
    }

    // Default fallback if still empty
    if (images.length === 0) {
      const fallbackUrl = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80';
      images = [fallbackUrl];
      media = [{
        id: `med-${product.id}-default`,
        productId: product.id,
        url: fallbackUrl,
        altText: product.name,
        type: 'IMAGE',
        isPrimary: true,
        displayOrder: 1,
        createdAt: new Date().toISOString(),
      }];
    }

    const stockQuantity =
      (product as any).stockQuantity !== undefined
        ? Number((product as any).stockQuantity) || 0
        : variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);

    return {
      ...product,
      stockQuantity,
      parentCategoryId: parentCategory?.id || product.parentCategoryId || product.categoryId,
      subCategoryId: subCategory?.id || product.subCategoryId || '',
      brand,
      category,
      parentCategory,
      subCategory,
      categoryHierarchy,
      variants,
      media,
      images,
      specifications,
      reviews,
      warehouseStocks,
    };
  }

  saveProduct(product: Partial<DbProduct> & { name: string; sku: string }): DbProduct {
    let existingIndex = product.id
      ? this.data.products.findIndex((p) => p.id === product.id)
      : -1;
    if (existingIndex === -1 && product.sku) {
      existingIndex = this.data.products.findIndex((p) => p.sku === product.sku);
    }

    const now = new Date().toISOString();
    const slug =
      product.seName ||
      product.slug ||
      (product.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // Resolve parentCategoryId and subCategoryId if categoryId is a child category
    let resolvedCategoryId = product.categoryId || product.parentCategoryId || 'cat-machinery';
    let resolvedParentCategoryId = product.parentCategoryId || resolvedCategoryId;
    let resolvedSubCategoryId = product.subCategoryId;

    const catObj = this.data.categories.find((c) => c.id === resolvedCategoryId);
    if (catObj && catObj.parentId) {
      resolvedSubCategoryId = resolvedSubCategoryId || catObj.id;
      resolvedParentCategoryId = catObj.parentId;
    }

    if (existingIndex >= 0) {
      const prev = this.data.products[existingIndex];
      const updated: DbProduct = {
        ...prev,
        ...product,
        id: prev.id,
        name: product.name !== undefined ? product.name : prev.name,
        sku: product.sku !== undefined ? product.sku : prev.sku,
        price: product.price !== undefined ? Number(product.price) || 0 : prev.price,
        comparePrice:
          product.comparePrice !== undefined
            ? Number(product.comparePrice) || 0
            : prev.comparePrice,
        cost: product.cost !== undefined ? Number(product.cost) || 0 : prev.cost,
        weight: product.weight !== undefined ? Number(product.weight) || 0 : prev.weight,
        length: product.length !== undefined ? Number(product.length) || 0 : prev.length,
        width: product.width !== undefined ? Number(product.width) || 0 : prev.width,
        height: product.height !== undefined ? Number(product.height) || 0 : prev.height,
        categoryId: resolvedParentCategoryId,
        parentCategoryId: resolvedParentCategoryId,
        subCategoryId:
          resolvedSubCategoryId !== undefined ? resolvedSubCategoryId : prev.subCategoryId,
        slug: product.seName || prev.slug || slug,
        seName: product.seName || prev.seName || prev.slug || slug,
        metaKeywords:
          product.metaKeywords !== undefined ? product.metaKeywords : prev.metaKeywords,
        isPublished:
          product.isPublished !== undefined ? Boolean(product.isPublished) : prev.isPublished,
        updatedAt: now,
      };

      if ((product as any).stockQuantity !== undefined) {
        (updated as any).stockQuantity = Math.max(0, Number((product as any).stockQuantity) || 0);
      }

      this.data.products[existingIndex] = updated;

      const pVars = this.data.variants.filter((v) => v.productId === updated.id);
      if (pVars.length > 0) {
        if ((product as any).stockQuantity !== undefined) {
          const targetStock = Math.max(0, Number((product as any).stockQuantity) || 0);
          pVars[0].stockQuantity = targetStock;
          for (let i = 1; i < pVars.length; i++) {
            pVars[i].stockQuantity = 0;
          }
        }
        if (updated.price !== undefined) {
          pVars[0].price = updated.price;
        }
        if (updated.comparePrice !== undefined) {
          pVars[0].comparePrice = updated.comparePrice;
        }
      } else if ((product as any).stockQuantity !== undefined) {
        const targetStock = Math.max(0, Number((product as any).stockQuantity) || 0);
        this.data.variants.push({
          id: `var-${updated.id}-1`,
          productId: updated.id,
          sku: `${updated.sku}-DEF`,
          title: 'Standard Pack',
          variantName: 'Standard',
          price: updated.price,
          comparePrice: updated.comparePrice,
          isDefault: true,
          stockQuantity: targetStock,
          createdAt: now,
          updatedAt: now,
        });
      }

      if ((product as any).stockQuantity !== undefined) {
        const targetStock = Math.max(0, Number((product as any).stockQuantity) || 0);
        const whStocks = this.data.warehouseStocks.filter((ws) => ws.productId === updated.id);
        if (whStocks.length > 0) {
          whStocks[0].quantity = targetStock;
        }
      }

      // Synchronize images with media collection
      if (Array.isArray((product as any).images)) {
        this.data.media = this.data.media.filter((m) => m.productId !== updated.id);
        (product as any).images.forEach((imgUrl: string, idx: number) => {
          if (imgUrl && typeof imgUrl === 'string' && imgUrl.trim()) {
            this.data.media.push({
              id: `med-${updated.id}-${idx + 1}-${Date.now()}`,
              productId: updated.id,
              url: imgUrl.trim(),
              altText: `${updated.name} - Picture ${idx + 1}`,
              type: 'IMAGE',
              isPrimary: idx === 0,
              displayOrder: idx + 1,
              createdAt: now,
            });
          }
        });
      }

      this.save();
      return updated;
    } else {
      const created: DbProduct = {
        ...product,
        id: product.id || `prod-${Date.now()}`,
        name: product.name,
        nameKn: product.nameKn,
        slug: product.seName || slug,
        seName: product.seName || slug,
        sku: product.sku,
        shortDescription: product.shortDescription,
        description: product.description || '',
        brandId: product.brandId,
        categoryId: resolvedParentCategoryId,
        parentCategoryId: resolvedParentCategoryId,
        subCategoryId: resolvedSubCategoryId || '',
        price: product.price || 0,
        comparePrice: product.comparePrice,
        isPublished: product.isPublished !== undefined ? product.isPublished : false,
        isDraft: product.isDraft || false,
        isFeatured: product.isFeatured || false,
        isBestSeller: product.isBestSeller || false,
        targetCrops: product.targetCrops || 'Paddy, Cotton, Sugarcane',
        cropStages: product.cropStages || '1, 2, 3',
        metaTitle: product.metaTitle,
        metaKeywords: product.metaKeywords,
        metaDescription: product.metaDescription,
        ogImage: product.ogImage,
        canonicalUrl: product.canonicalUrl,
        vendor: product.vendor,
        requireOtherProducts: product.requireOtherProducts,
        allowCustomerReviews: product.allowCustomerReviews,
        availableStartDate: product.availableStartDate,
        availableEndDate: product.availableEndDate,
        markAsNew: product.markAsNew,
        adminComment: product.adminComment,
        customerRoles: product.customerRoles,
        limitedToStores: product.limitedToStores,
        gtin: product.gtin,
        manufacturerPartNumber: product.manufacturerPartNumber,
        showOnHomePage: product.showOnHomePage,
        productType: product.productType,
        productTemplate: product.productTemplate,
        visibleIndividually: product.visibleIndividually,
        ageVerification: product.ageVerification,
        cost: product.cost,
        disableBuyButton: product.disableBuyButton,
        disableWishlistButton: product.disableWishlistButton,
        availableForPreOrder: product.availableForPreOrder,
        callForPrice: product.callForPrice,
        customerEntersPrice: product.customerEntersPrice,
        pangvBasePriceEnabled: product.pangvBasePriceEnabled,
        taxExempt: product.taxExempt,
        taxCategory: product.taxCategory,
        isShippingEnabled: product.isShippingEnabled,
        weight: product.weight,
        length: product.length,
        width: product.width,
        height: product.height,
        freeShipping: product.freeShipping,
        shipSeparately: product.shipSeparately,
        additionalShippingCharge: product.additionalShippingCharge,
        deliveryDate: product.deliveryDate,
        isGiftCard: product.isGiftCard,
        giftCardType: product.giftCardType,
        overriddenGiftCardAmount: product.overriddenGiftCardAmount,
        isRental: product.isRental,
        rentalPeriodLength: product.rentalPeriodLength,
        rentalPeriod: product.rentalPeriod,
        createdAt: now,
        updatedAt: now,
      };
      this.data.products.push(created);

      // Create a default variant if none exists
      const defaultVar: DbProductVariant = {
        id: `var-${created.id}-1`,
        productId: created.id,
        sku: `${created.sku}-DEF`,
        title: 'Standard Pack',
        variantName: 'Standard',
        price: created.price,
        comparePrice: created.comparePrice,
        isDefault: true,
        stockQuantity: 25,
        createdAt: now,
        updatedAt: now,
      };
      this.data.variants.push(defaultVar);

      // Associate initial warehouse stock
      this.data.warehouseStocks.push({
        id: `ws-${Date.now()}`,
        warehouseId: 'wh-hubballi',
        productId: created.id,
        variantId: defaultVar.id,
        quantity: 25,
        reservedQuantity: 0,
        reorderThreshold: 5,
      });

      // Synchronize images with media collection
      if (Array.isArray((product as any).images)) {
        (product as any).images.forEach((imgUrl: string, idx: number) => {
          if (imgUrl && typeof imgUrl === 'string' && imgUrl.trim()) {
            this.data.media.push({
              id: `med-${created.id}-${idx + 1}-${Date.now()}`,
              productId: created.id,
              url: imgUrl.trim(),
              altText: `${created.name} - Picture ${idx + 1}`,
              type: 'IMAGE',
              isPrimary: idx === 0,
              displayOrder: idx + 1,
              createdAt: now,
            });
          }
        });
      }

      this.save();
      return created;
    }
  }

  updateProductMedia(productId: string, imageUrls: string[]): DbMedia[] {
    const product = this.getProductById(productId);
    if (!product) return [];
    const now = new Date().toISOString();
    this.data.media = this.data.media.filter((m) => m.productId !== productId);
    const newMedia: DbMedia[] = [];
    imageUrls.forEach((url, idx) => {
      if (url && typeof url === 'string' && url.trim()) {
        const item: DbMedia = {
          id: `med-${productId}-${idx + 1}-${Date.now()}`,
          productId,
          url: url.trim(),
          altText: `${product.name} - Picture ${idx + 1}`,
          type: 'IMAGE',
          isPrimary: idx === 0,
          displayOrder: idx + 1,
          createdAt: now,
        };
        this.data.media.push(item);
        newMedia.push(item);
      }
    });
    this.save();
    return newMedia;
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    this.data.variants = this.data.variants.filter((v) => v.productId !== id);
    this.data.specifications = this.data.specifications.filter((s) => s.productId !== id);
    this.data.media = this.data.media.filter((m) => m.productId !== id);
    this.save();
    return this.data.products.length < initialLen;
  }

  // Variants
  getVariantsByProductId(productId: string): DbProductVariant[] {
    return this.data.variants.filter((v) => v.productId === productId);
  }

  // Warehouses & Stock
  getWarehouses(): DbWarehouse[] {
    return this.data.warehouses;
  }

  getWarehouseStocks(productId: string) {
    return this.data.warehouseStocks.filter((ws) => ws.productId === productId);
  }

  // Reserve Stock atomically to prevent overselling
  reserveStock(orderId: string, items: { productId: string; variantId?: string; quantity: number }[], warehouseId: string): boolean {
    for (const item of items) {
      const stock = this.data.warehouseStocks.find(
        (ws) => ws.warehouseId === warehouseId && ws.productId === item.productId && (!item.variantId || ws.variantId === item.variantId)
      );
      if (!stock || stock.quantity - stock.reservedQuantity < item.quantity) {
        return false; // Insufficient stock in this warehouse
      }
    }

    // Apply reservations
    for (const item of items) {
      const stock = this.data.warehouseStocks.find(
        (ws) => ws.warehouseId === warehouseId && ws.productId === item.productId && (!item.variantId || ws.variantId === item.variantId)
      )!;
      stock.reservedQuantity += item.quantity;

      this.data.stockReservations.push({
        id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        orderId,
        productId: item.productId,
        variantId: item.variantId,
        warehouseId,
        quantity: item.quantity,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 1800000).toISOString(), // 30 min reservation expiry
        createdAt: new Date().toISOString(),
      });
    }

    this.save();
    return true;
  }

  // Release reservation upon order cancellation
  releaseStock(orderId: string) {
    const reservations = this.data.stockReservations.filter((r) => r.orderId === orderId && r.status === 'ACTIVE');
    for (const res of reservations) {
      const stock = this.data.warehouseStocks.find(
        (ws) => ws.warehouseId === res.warehouseId && ws.productId === res.productId && (!res.variantId || ws.variantId === res.variantId)
      );
      if (stock) {
        stock.reservedQuantity = Math.max(0, stock.reservedQuantity - res.quantity);
      }
      res.status = 'RELEASED';
    }
    this.save();
  }

  // Coupons
  getCoupons(): DbCoupon[] {
    return this.data.coupons;
  }

  validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string; coupon?: DbCoupon } {
    const coupon = this.data.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or inactive coupon code.' };
    }

    const now = new Date();
    if (new Date(coupon.validFrom) > now || new Date(coupon.validTo) < now) {
      return { valid: false, discount: 0, message: 'Coupon has expired.' };
    }

    if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'Coupon usage limit has been reached.' };
    }

    if (subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for coupon ${coupon.code}.`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'FIXED') {
      discount = coupon.discountValue;
    } else {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }

    return {
      valid: true,
      discount,
      message: `Coupon ${coupon.code} applied successfully!`,
      coupon,
    };
  }

  saveCoupon(coupon: Partial<DbCoupon> & { code: string; discountValue: number }): DbCoupon {
    const existingIndex = this.data.coupons.findIndex((c) => c.id === coupon.id || c.code === coupon.code);
    const now = new Date().toISOString();
    if (existingIndex >= 0) {
      const updated: DbCoupon = {
        ...this.data.coupons[existingIndex],
        ...coupon,
        updatedAt: now,
      };
      this.data.coupons[existingIndex] = updated;
      this.save();
      return updated;
    } else {
      const created: DbCoupon = {
        id: coupon.id || `cp-${Date.now()}`,
        code: coupon.code.toUpperCase(),
        description: coupon.description || '',
        discountType: coupon.discountType || 'FIXED',
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue || 0,
        maxDiscount: coupon.maxDiscount,
        validFrom: coupon.validFrom || now,
        validTo: coupon.validTo || new Date(Date.now() + 86400000 * 365).toISOString(),
        usageLimit: coupon.usageLimit || 1000,
        usageCount: 0,
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
        createdAt: now,
        updatedAt: now,
      };
      this.data.coupons.push(created);
      this.save();
      return created;
    }
  }

  // Users & Addresses
  getUserByMobile(mobile: string): DbUser | undefined {
    const cleanMobile = mobile.replace(/[^0-9]/g, '').slice(-10);
    return this.data.users.find((u) => u.mobile.replace(/[^0-9]/g, '').slice(-10) === cleanMobile);
  }

  getUserById(id: string): DbUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  saveUser(user: Partial<DbUser> & { mobile: string; name: string }): DbUser {
    const cleanMobile = user.mobile.replace(/[^0-9]/g, '').slice(-10);
    const existingIndex = this.data.users.findIndex((u) => u.id === user.id || u.mobile.replace(/[^0-9]/g, '').slice(-10) === cleanMobile);
    const now = new Date().toISOString();
    if (existingIndex >= 0) {
      const updated: DbUser = {
        ...this.data.users[existingIndex],
        ...user,
        mobile: cleanMobile,
        updatedAt: now,
      };
      this.data.users[existingIndex] = updated;
      this.save();
      return updated;
    } else {
      const created: DbUser = {
        id: user.id || `usr-${Date.now()}`,
        name: user.name,
        mobile: cleanMobile,
        email: user.email,
        role: user.role || 'CUSTOMER',
        isVerified: user.isVerified || false,
        createdAt: now,
        updatedAt: now,
      };
      this.data.users.push(created);
      this.save();
      return created;
    }
  }

  getCustomerAddresses(userId: string): DbCustomerAddress[] {
    return this.data.addresses.filter((a) => a.userId === userId);
  }

  saveCustomerAddress(address: Partial<DbCustomerAddress> & { userId: string; fullName: string; addressLine: string; pincode: string }): DbCustomerAddress {
    const existingIndex = this.data.addresses.findIndex((a) => a.id === address.id);
    const now = new Date().toISOString();

    if (address.isDefaultShipping) {
      // Unset previous defaults
      this.data.addresses.forEach((a) => {
        if (a.userId === address.userId) a.isDefaultShipping = false;
      });
    }

    if (existingIndex >= 0) {
      const updated: DbCustomerAddress = {
        ...this.data.addresses[existingIndex],
        ...address,
        updatedAt: now,
      };
      this.data.addresses[existingIndex] = updated;
      this.save();
      return updated;
    } else {
      const created: DbCustomerAddress = {
        id: address.id || `addr-${Date.now()}`,
        userId: address.userId,
        fullName: address.fullName,
        mobile: address.mobile || '',
        alternateMobile: address.alternateMobile,
        addressLine: address.addressLine,
        landmark: address.landmark,
        taluk: address.taluk || '',
        village: address.village || '',
        district: address.district || 'Karnataka',
        state: address.state || 'Karnataka',
        pincode: address.pincode,
        gpsLatitude: address.gpsLatitude,
        gpsLongitude: address.gpsLongitude,
        isDefaultShipping: address.isDefaultShipping !== undefined ? address.isDefaultShipping : this.getCustomerAddresses(address.userId).length === 0,
        isDefaultBilling: address.isDefaultBilling || false,
        createdAt: now,
        updatedAt: now,
      };
      this.data.addresses.push(created);
      this.save();
      return created;
    }
  }

  deleteCustomerAddress(id: string, userId: string): boolean {
    const initialLen = this.data.addresses.length;
    this.data.addresses = this.data.addresses.filter((a) => !(a.id === id && a.userId === userId));
    this.save();
    return this.data.addresses.length < initialLen;
  }

  // OTP Management (with developer transparency)
  createOtp(mobile: string, code: string): DbOtpToken {
    const cleanMobile = mobile.replace(/[^0-9]/g, '').slice(-10);
    // Invalidate previous OTPs for this mobile
    this.data.otpTokens = this.data.otpTokens.filter((t) => t.mobile !== cleanMobile);
    const token: DbOtpToken = {
      id: `otp-${Date.now()}`,
      mobile: cleanMobile,
      codeHash: code, // Stored in plain/hash for dev verification
      expiresAt: new Date(Date.now() + 600000).toISOString(), // 10 min
      verified: false,
      attempts: 0,
      createdAt: new Date().toISOString(),
    };
    this.data.otpTokens.push(token);
    this.save();
    return token;
  }

  verifyOtp(mobile: string, code: string): { success: boolean; message: string; user?: DbUser } {
    const cleanMobile = mobile.replace(/[^0-9]/g, '').slice(-10);
    const token = this.data.otpTokens.find((t) => t.mobile === cleanMobile && !t.verified);
    if (!token) {
      return { success: false, message: 'No active OTP request found. Please request a new OTP.' };
    }

    if (new Date(token.expiresAt) < new Date()) {
      return { success: false, message: 'OTP has expired. Please request a new OTP.' };
    }

    if (token.codeHash !== code && code !== '123456') { // Allow 123456 as sandbox universal test code
      token.attempts += 1;
      this.save();
      return { success: false, message: 'Incorrect OTP entered. Please try again.' };
    }

    token.verified = true;
    let user = this.getUserByMobile(cleanMobile);
    if (!user) {
      user = this.saveUser({
        name: 'Farmer ' + cleanMobile.slice(-4),
        mobile: cleanMobile,
        role: 'CUSTOMER',
        isVerified: true,
      });
    } else {
      user.isVerified = true;
      this.save();
    }

    this.save();
    return { success: true, message: 'OTP verified successfully.', user };
  }

  // Orders
  getOrders(userId?: string): DbOrder[] {
    if (userId) {
      return this.data.orders.filter((o) => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return this.data.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderWithDetails(orderId: string) {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;
    const items = this.data.orderItems.filter((i) => i.orderId === order.id);
    const payments = this.data.payments.filter((p) => p.orderId === order.id);
    const user = this.data.users.find((u) => u.id === order.userId);
    const warehouse = this.data.warehouses.find((w) => w.id === order.assignedWarehouseId);

    return {
      ...order,
      items,
      payments,
      user,
      warehouse,
    };
  }

  createOrder(orderData: {
    userId: string;
    items: { productId: string; variantId?: string; quantity: number; name?: string; price?: number }[];
    shippingAddress: any;
    paymentMethod: string;
    couponCode?: string;
    notes?: string;
  }): { success: boolean; order?: DbOrder; message: string; paymentRequired?: boolean } {
    // 0. Resolve or create customer from shippingAddress so orders belong to the actual shopper
    let resolvedUserId = orderData.userId || 'usr-guest';
    if (orderData.shippingAddress?.mobile && orderData.shippingAddress?.fullName) {
      const savedUser = this.saveUser({
        name: orderData.shippingAddress.fullName,
        mobile: orderData.shippingAddress.mobile,
        role: 'CUSTOMER',
        isVerified: true,
      });
      resolvedUserId = savedUser.id;
    }

    // 1. Calculate totals on server
    let subtotal = 0;
    let tax = 0;
    const orderItemsToCreate: Omit<DbOrderItem, 'id' | 'orderId'>[] = [];

    for (const item of orderData.items) {
      const product = this.getProductById(item.productId) || this.getProductBySlug(item.productId);
      const variant = product
        ? (item.variantId
            ? this.data.variants.find((v) => v.id === item.variantId)
            : this.data.variants.find((v) => v.productId === product.id && v.isDefault))
        : undefined;
      const unitPrice = variant ? variant.price : product ? product.price : (item.price || 500);
      const itemTotal = unitPrice * item.quantity;
      const itemTax = Math.round(itemTotal * 0.05); // 5% Agri GST

      subtotal += itemTotal;
      tax += itemTax;

      orderItemsToCreate.push({
        productId: product ? product.id : item.productId,
        variantId: variant?.id,
        productName: product ? product.name : (item.name || 'Agri Input Product'),
        variantTitle: variant?.title || 'Standard',
        sku: variant?.sku || product?.sku || `SKU-${item.productId}`,
        quantity: item.quantity,
        unitPrice,
        taxRate: 0.05,
        totalPrice: itemTotal,
      });
    }

    // 2. Validate Coupon
    let discount = 0;
    let couponId: string | undefined;
    if (orderData.couponCode) {
      const couponRes = this.validateCoupon(orderData.couponCode, subtotal);
      if (couponRes.valid) {
        discount = couponRes.discount;
        couponId = couponRes.coupon?.id;
        if (couponRes.coupon) {
          couponRes.coupon.usageCount += 1;
        }
      }
    }

    // 3. Shipping fee calculation
    const deliveryFee = subtotal >= 10000 ? 0 : 250;
    const totalAmount = Math.max(0, subtotal - discount + deliveryFee + tax);

    // 4. Automated Warehouse Allocation (Proximity & Stock Verification)
    const optimal = this.findOptimalWarehouseForOrder(
      orderData.shippingAddress || {},
      orderData.items
    );

    let assignedWarehouse = optimal?.warehouse || this.data.warehouses[0];
    const allocationStatus: DbOrder['allocationStatus'] = 'ALLOCATED';
    const isHold = false;
    const holdReason = undefined;

    // 5. Reserve Stock (best-effort if stock record exists)
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `AGM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    this.reserveStock(orderId, orderData.items, assignedWarehouse.id);

    // 6. Create Order with Full Operational Metadata
    const newOrder: DbOrder = {
      id: orderId,
      orderNumber,
      userId: resolvedUserId,
      subtotalAmount: subtotal,
      discountAmount: discount,
      deliveryFee,
      taxAmount: tax,
      totalAmount,
      status: 'CONFIRMED',
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
      assignedWarehouseId: assignedWarehouse.id,
      assignedWarehouseName: assignedWarehouse.name,
      assignmentMode: 'AUTO',
      allocationStatus,
      isHold,
      holdReason,
      shippingAddress: orderData.shippingAddress,
      trackingNumber: `AGM-TRK-${orderNumber.split('-')[2]}`,
      courierName: 'VRL Logistics Agri Express',
      couponId,
      couponCode: orderData.couponCode,
      notes: orderData.notes,
      assignmentAuditLogs: [
        {
          id: `audit-${Date.now()}`,
          orderId,
          toWarehouseId: assignedWarehouse.id,
          toWarehouseName: assignedWarehouse.name,
          reason: isHold
            ? 'Stock insufficient across hubs - flagged for Admin Hold'
            : `Auto-allocated by GPS/PIN distance (${optimal?.distanceKm ?? 25} km) & confirmed stock`,
          changedBy: 'SYSTEM_ALLOCATOR',
          timestamp: new Date().toISOString(),
        },
      ],
      trackingMilestones: [
        {
          milestone: 'ORDER_PLACED',
          location: orderData.shippingAddress?.district || 'Karnataka',
          timestamp: new Date().toISOString(),
          description: `Order confirmed via ${orderData.paymentMethod}. Total: ₹${totalAmount.toLocaleString('en-IN')}`,
        },
        {
          milestone: 'ALLOCATED',
          location: assignedWarehouse.name,
          timestamp: new Date().toISOString(),
          description: isHold
            ? 'Order allocation pending admin stock review'
            : `Assigned to ${assignedWarehouse.name} for express rural dispatch`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.orders.unshift(newOrder);

    // 7. Create Order Items
    for (const oi of orderItemsToCreate) {
      this.data.orderItems.push({
        id: `oi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        orderId,
        ...oi,
      });
    }

    // 8. Idempotent Notifications
    this.enqueueNotification({
      event: 'ORDER_CONFIRMED',
      channel: 'SMS',
      recipient: orderData.shippingAddress?.mobile || 'Customer',
      recipientRole: 'CUSTOMER',
      title: 'Order Confirmed',
      message: `Namaskara! Order #${orderNumber} for ₹${totalAmount.toLocaleString('en-IN')} confirmed. Routing via ${assignedWarehouse.name}.`,
      idempotencyKey: `ord-confirm-sms-${orderId}`,
    });

    if (assignedWarehouse.contactNumber) {
      this.enqueueNotification({
        event: 'WAREHOUSE_ASSIGNED',
        channel: 'EMAIL',
        recipient: assignedWarehouse.contactNumber,
        recipientRole: 'WAREHOUSE_MANAGER',
        title: 'New Order Allocated',
        message: `Order #${orderNumber} assigned to ${assignedWarehouse.name} (${orderData.items.length} items). Please inspect and pack.`,
        idempotencyKey: `ord-assign-wh-${orderId}`,
      });
    }

    this.save();
    return {
      success: true,
      order: newOrder,
      message: `Order #${orderNumber} placed successfully!`,
      paymentRequired: orderData.paymentMethod !== 'COD',
    };
  }

  cancelOrder(orderId: string, userId: string, reason: string): { success: boolean; message: string } {
    const order = this.data.orders.find((o) => (o.id === orderId || o.orderNumber === orderId) && (o.userId === userId || userId === 'admin'));
    if (!order) {
      return { success: false, message: 'Order not found or unauthorized.' };
    }

    if (order.status !== 'PLACED' && order.status !== 'CONFIRMED') {
      return { success: false, message: `Cannot cancel an order in '${order.status}' state.` };
    }

    order.status = 'CANCELLED';
    order.cancellationReason = reason;
    order.cancelledAt = new Date().toISOString();

    // Release stock reservation
    this.releaseStock(order.id);

    // Log notification
    this.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: order.userId,
      channel: 'SMS',
      recipient: order.shippingAddress?.mobile || 'Customer',
      event: 'ORDER_CANCELLED',
      title: 'Order Cancelled',
      message: `Order #${order.orderNumber} has been cancelled. Reserved items have been returned to warehouse inventory.`,
      status: 'SENT',
      sentAt: new Date().toISOString(),
    });

    this.save();
    return { success: true, message: `Order #${order.orderNumber} has been cancelled successfully.` };
  }

  // Payments & Idempotent Webhook
  recordPayment(paymentData: {
    orderId: string;
    amount: number;
    provider: 'RAZORPAY' | 'COD' | 'WALLET';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    idempotencyKey?: string;
    status: 'PAID' | 'FAILED' | 'PENDING';
    rawWebhookPayload?: string;
  }): { success: boolean; payment: DbPayment; isDuplicate: boolean } {
    // Idempotency check: if transaction or idempotencyKey was already processed
    if (paymentData.idempotencyKey) {
      const existing = this.data.payments.find((p) => p.idempotencyKey === paymentData.idempotencyKey);
      if (existing) {
        return { success: true, payment: existing, isDuplicate: true };
      }
    }

    if (paymentData.razorpayPaymentId) {
      const existing = this.data.payments.find((p) => p.razorpayPaymentId === paymentData.razorpayPaymentId);
      if (existing) {
        return { success: true, payment: existing, isDuplicate: true };
      }
    }

    const payment: DbPayment = {
      id: `pay-${Date.now()}`,
      orderId: paymentData.orderId,
      paymentNumber: `PAY-AGM-${Date.now().toString().slice(-6)}`,
      provider: paymentData.provider,
      amount: paymentData.amount,
      currency: 'INR',
      status: paymentData.status,
      razorpayOrderId: paymentData.razorpayOrderId,
      razorpayPaymentId: paymentData.razorpayPaymentId,
      razorpaySignature: paymentData.razorpaySignature,
      idempotencyKey: paymentData.idempotencyKey,
      rawWebhookPayload: paymentData.rawWebhookPayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.payments.push(payment);

    // Update corresponding order payment status
    const order = this.data.orders.find((o) => o.id === paymentData.orderId);
    if (order && paymentData.status === 'PAID') {
      order.paymentStatus = 'PAID';
      order.status = 'CONFIRMED';
      order.updatedAt = new Date().toISOString();
    }

    this.save();
    return { success: true, payment, isDuplicate: false };
  }

  // Reviews
  getProductReviews(productId: string): DbReview[] {
    return this.data.reviews.filter((r) => r.productId === productId && r.status === 'APPROVED');
  }

  addReview(review: Omit<DbReview, 'id' | 'createdAt'>): DbReview {
    const newReview: DbReview = {
      id: `rev-${Date.now()}`,
      ...review,
      createdAt: new Date().toISOString(),
    };
    this.data.reviews.unshift(newReview);
    this.save();
    return newReview;
  }

  // Customer Notifications
  getCustomerNotifications(userId: string): DbCustomerNotification[] {
    return this.data.notifications.filter((n) => !n.userId || n.userId === userId);
  }

  // --------------------------------------------------
  // RENTALS MODULE METHODS
  // --------------------------------------------------
  getRentalProducts(): DbRentalProduct[] {
    return this.data.rentalProducts || [];
  }

  getRentalProductBySlug(slug: string): DbRentalProduct | undefined {
    const list = this.data.rentalProducts || [];
    const exact = list.find((r) => r.slug === slug);
    if (exact) return exact;
    const aliasMap: Record<string, string> = {
      'rent-7hp-power-weeder-ridger': 'power-weeder-7hp',
      'rent-self-propelled-paddy-reaper': 'power-reaper-binder',
      'rent-tractor-boom-sprayer': 'battery-sprayer-16l',
    };
    if (aliasMap[slug]) return list.find((r) => r.slug === aliasMap[slug]);
    return undefined;
  }

  getRentalProductById(id: string): DbRentalProduct | undefined {
    const list = this.data.rentalProducts || [];
    const exact = list.find((r) => r.id === id);
    if (exact) return exact;
    const idAliasMap: Record<string, string> = {
      'rent-001': 'rnt-weeder-7hp',
      'rent-002': 'rnt-reaper-binder',
      'rent-003': 'rnt-battery-sprayer-16l',
    };
    if (idAliasMap[id]) return list.find((r) => r.id === idAliasMap[id]);
    return undefined;
  }

  checkRentalAvailability(
    rentalProductId: string,
    startDate: string,
    endDate: string
  ): {
    isAvailable: boolean;
    totalUnits: number;
    activeBookingsCount: number;
    remainingUnits: number;
    conflictingBookings: { bookingNumber: string; startDate: string; endDate: string }[];
  } {
    const product = this.getRentalProductById(rentalProductId) || this.getRentalProductBySlug(rentalProductId);
    const totalUnits = product ? product.totalUnits : 1;

    // Filter active bookings that overlap with requested range
    const overlapping = (this.data.rentalBookings || []).filter((b) => {
      if (b.rentalProductId !== (product?.id || rentalProductId)) return false;
      if (!['PENDING_APPROVAL', 'APPROVED', 'ACTIVE'].includes(b.status)) return false;
      // Overlap condition: start1 <= end2 && end1 >= start2
      return b.startDate <= endDate && b.endDate >= startDate;
    });

    const activeCount = overlapping.length;
    const remaining = Math.max(0, totalUnits - activeCount);

    return {
      isAvailable: remaining > 0,
      totalUnits,
      activeBookingsCount: activeCount,
      remainingUnits: remaining,
      conflictingBookings: overlapping.map((o) => ({
        bookingNumber: o.bookingNumber,
        startDate: o.startDate,
        endDate: o.endDate,
      })),
    };
  }

  createRentalBooking(
    bookingData: Omit<
      DbRentalBooking,
      'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'
    >
  ): {
    success: boolean;
    booking?: DbRentalBooking;
    error?: string;
    remainingUnits?: number;
  } {
    // 1. Enforce Capacity Conflict Check
    const availability = this.checkRentalAvailability(
      bookingData.rentalProductId,
      bookingData.startDate,
      bookingData.endDate
    );

    if (!availability.isAvailable) {
      return {
        success: false,
        error: `AVAILABILITY_CONFLICT: All ${availability.totalUnits} unit(s) of this equipment are fully reserved between ${bookingData.startDate} and ${bookingData.endDate}. Please choose alternative dates.`,
        remainingUnits: 0,
      };
    }

    const bookingId = `rnt-bk-${Date.now()}`;
    const bookingNumber = `RNT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: DbRentalBooking = {
      id: bookingId,
      bookingNumber,
      rentalProductId: bookingData.rentalProductId,
      productTitle: bookingData.productTitle,
      userId: bookingData.userId,
      customerName: bookingData.customerName,
      customerMobile: bookingData.customerMobile,
      deliveryAddress: bookingData.deliveryAddress,
      pincode: bookingData.pincode,
      warehouseId: bookingData.warehouseId || 'wh-hubballi',
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      totalDays: bookingData.totalDays,
      rentalBasis: bookingData.rentalBasis || (bookingData.pricingTier === 'HOURLY' ? 'HOURLY' : 'DAILY'),
      totalHours: bookingData.totalHours,
      hourlyRate: bookingData.hourlyRate,
      preferredTimeSlot: bookingData.preferredTimeSlot,
      pricingTier: bookingData.pricingTier,
      dailyRate: bookingData.dailyRate,
      rentAmount: bookingData.rentAmount,
      securityDeposit: bookingData.securityDeposit,
      totalPaid: bookingData.totalPaid,
      paymentMethod: bookingData.paymentMethod,
      paymentStatus: bookingData.paymentStatus,
      paymentId: bookingData.paymentId,
      status: bookingData.status || 'PENDING_APPROVAL',
      depositRefundStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!this.data.rentalBookings) this.data.rentalBookings = [];
    this.data.rentalBookings.unshift(newBooking);

    // Log notification
    if (!this.data.notifications) this.data.notifications = [];
    this.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: bookingData.userId,
      channel: 'SMS',
      recipient: bookingData.customerMobile,
      event: 'RENTAL_BOOKED',
      title: 'Rental Request Received',
      message: `Namaskara! Rental booking #${bookingNumber} for ${bookingData.productTitle} received. Security deposit ₹${bookingData.securityDeposit.toLocaleString('en-IN')} held securely. Dark warehouse coordinator will verify dispatch.`,
      status: 'SENT',
      sentAt: new Date().toISOString(),
    });

    this.save();
    return {
      success: true,
      booking: newBooking,
      remainingUnits: availability.remainingUnits - 1,
    };
  }

  getRentalBookings(filter?: { userId?: string; status?: string }): DbRentalBooking[] {
    let list = this.data.rentalBookings || [];
    if (filter?.userId && filter.userId !== 'admin') {
      list = list.filter((b) => b.userId === filter.userId);
    }
    if (filter?.status) {
      list = list.filter((b) => b.status === filter.status);
    }
    return list;
  }

  getRentalBookingById(id: string): DbRentalBooking | undefined {
    return (this.data.rentalBookings || []).find(
      (b) => b.id === id || b.bookingNumber === id
    );
  }

  updateRentalStatus(
    bookingId: string,
    status: DbRentalBooking['status']
  ): DbRentalBooking | null {
    const booking = this.getRentalBookingById(bookingId);
    if (!booking) return null;
    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    this.save();
    return booking;
  }

  updateRentalBooking(
    bookingId: string,
    updates: Partial<DbRentalBooking>
  ): DbRentalBooking | null {
    const booking = this.getRentalBookingById(bookingId);
    if (!booking) return null;
    Object.assign(booking, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return booking;
  }

  processRentalReturn(
    bookingId: string,
    params: {
      actualReturnDate: string;
      condition: 'ON_TIME' | 'LATE' | 'DAMAGED';
      damageNotes?: string;
      damageCharge?: number;
    }
  ): DbRentalBooking | null {
    const booking = this.getRentalBookingById(bookingId);
    if (!booking) return null;

    booking.actualReturnDate = params.actualReturnDate;
    booking.damageNotes = params.damageNotes || '';

    // Calculate Late Days
    const scheduledEnd = new Date(booking.endDate).getTime();
    const actualReturn = new Date(params.actualReturnDate).getTime();
    const diffDays = Math.ceil((actualReturn - scheduledEnd) / (1000 * 3600 * 24));
    const lateDays = Math.max(0, diffDays);
    booking.lateDays = lateDays;

    // Configurable Late Fee Policy: lateDays * (dailyRate * 1.5)
    const lateFee = lateDays > 0 ? Math.round(lateDays * (booking.dailyRate * 1.5)) : 0;
    booking.lateFee = lateFee;

    // Damage Fee Policy: inspection assessment
    const damageFee = params.damageCharge || 0;
    booking.damageFee = damageFee;

    const totalDeductions = lateFee + damageFee;
    const netRefund = Math.max(0, booking.securityDeposit - totalDeductions);
    booking.depositRefundAmount = netRefund;

    if (netRefund > 0) {
      booking.depositRefundStatus = 'PROCESSED';
    } else if (totalDeductions >= booking.securityDeposit) {
      booking.depositRefundStatus = 'FORFEITED';
    }

    // Set Final Return Status
    if (damageFee > 0 || params.condition === 'DAMAGED') {
      booking.status = 'RETURNED_DAMAGED';
    } else if (lateDays > 0 || params.condition === 'LATE') {
      booking.status = 'RETURNED_LATE';
    } else {
      booking.status = 'RETURNED_ON_TIME';
    }

    booking.updatedAt = new Date().toISOString();

    // Log customer settlement notification
    this.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: booking.userId,
      channel: 'SMS',
      recipient: booking.customerMobile,
      event: 'RENTAL_RETURN_SETTLED',
      title: 'Rental Return & Deposit Settled',
      message: `AgriMart Rental #${booking.bookingNumber} return processed. Late Fee: ₹${lateFee}, Damage Fee: ₹${damageFee}. Net Refundable Deposit: ₹${netRefund.toLocaleString('en-IN')} initiated to your account.`,
      status: 'SENT',
      sentAt: new Date().toISOString(),
    });

    this.save();
    return booking;
  }

  // --------------------------------------------------
  // SERVICES MODULE METHODS
  // --------------------------------------------------
  getServiceRequests(filter?: { userId?: string; status?: string }): DbServiceBookingRequest[] {
    let list = this.data.serviceRequests || [];
    if (filter?.userId && filter.userId !== 'admin') {
      list = list.filter((s) => s.userId === filter.userId);
    }
    if (filter?.status) {
      list = list.filter((s) => s.status === filter.status);
    }
    return list;
  }

  getServiceRequestById(id: string): DbServiceBookingRequest | undefined {
    return (this.data.serviceRequests || []).find(
      (s) => s.id === id || s.requestNumber === id
    );
  }

  createServiceRequest(
    requestData: Omit<
      DbServiceBookingRequest,
      'id' | 'requestNumber' | 'createdAt' | 'updatedAt'
    >
  ): DbServiceBookingRequest {
    const id = `srv-req-${Date.now()}`;
    const requestNumber = `REQ-SRV-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newRequest: DbServiceBookingRequest = {
      id,
      requestNumber,
      userId: requestData.userId,
      customerName: requestData.customerName,
      customerMobile: requestData.customerMobile,
      serviceId: requestData.serviceId,
      serviceName: requestData.serviceName,
      jobWorkId: requestData.jobWorkId,
      jobWorkName: requestData.jobWorkName,
      bookingBasis: requestData.bookingBasis || 'ACRE',
      bookingHours: requestData.bookingHours,
      farmAcreage: requestData.farmAcreage,
      cropType: requestData.cropType,
      district: requestData.district,
      taluk: requestData.taluk,
      village: requestData.village,
      address: requestData.address,
      pincode: requestData.pincode,
      gpsLatitude: requestData.gpsLatitude,
      gpsLongitude: requestData.gpsLongitude,
      preferredDate: requestData.preferredDate,
      preferredTime: requestData.preferredTime,
      notes: requestData.notes,
      photoUrl: requestData.photoUrl,
      status: 'REQUESTED',
      estimatedCost: requestData.estimatedCost || 0,
      advancePaid: requestData.advancePaid || 0,
      paymentMethod: requestData.paymentMethod || 'UPI',
      paymentStatus: requestData.paymentStatus || (requestData.paymentMethod === 'COD' ? 'PENDING' : 'PAID'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!this.data.serviceRequests) this.data.serviceRequests = [];
    this.data.serviceRequests.unshift(newRequest);

    // Customer acknowledgement notification
    if (!this.data.notifications) this.data.notifications = [];
    this.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: requestData.userId,
      channel: 'SMS',
      recipient: requestData.customerMobile,
      event: 'SERVICE_REQUESTED',
      title: 'Service Request Dispatched',
      message: `Namaskara! Service request #${requestNumber} for ${requestData.serviceName} received with GPS coordinates (${requestData.gpsLatitude}, ${requestData.gpsLongitude}). Super Admin is assigning the nearest verified operator.`,
      status: 'SENT',
      sentAt: new Date().toISOString(),
    });

    this.save();
    return newRequest;
  }

  assignServiceProvider(
    requestId: string,
    params: {
      providerId: string;
      providerName: string;
      operatorMobile: string;
      fleetUnit?: string;
    }
  ): DbServiceBookingRequest | null {
    const req = this.getServiceRequestById(requestId);
    if (!req) return null;

    req.assignedProviderId = params.providerId;
    req.assignedProviderName = params.providerName;
    req.assignedOperatorMobile = params.operatorMobile;
    req.assignedFleetUnit = params.fleetUnit || 'Standard Agricultural Unit';
    req.status = 'ASSIGNED';
    req.updatedAt = new Date().toISOString();

    // Customer notification
    this.data.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: req.userId,
      channel: 'SMS',
      recipient: req.customerMobile,
      event: 'SERVICE_OPERATOR_ASSIGNED',
      title: 'Service Operator Assigned',
      message: `Verified operator assigned for Request #${req.requestNumber}! Provider: ${params.providerName} (${params.operatorMobile}). Unit: ${req.assignedFleetUnit}. Scheduled: ${req.preferredDate} (${req.preferredTime}).`,
      status: 'SENT',
      sentAt: new Date().toISOString(),
    });

    this.save();
    return req;
  }

  updateServiceRequestStatus(
    requestId: string,
    status: DbServiceBookingRequest['status']
  ): DbServiceBookingRequest | null {
    const req = this.getServiceRequestById(requestId);
    if (!req) return null;
    req.status = status;
    req.updatedAt = new Date().toISOString();
    this.save();
    return req;
  }

  updateServiceRequest(
    requestId: string,
    updates: Partial<DbServiceBookingRequest>
  ): DbServiceBookingRequest | null {
    const req = this.getServiceRequestById(requestId);
    if (!req) return null;
    Object.assign(req, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return req;
  }
  // --------------------------------------------------
  // WAREHOUSE OPERATIONS & STOCK LEDGER
  // --------------------------------------------------
  getStockLedger(warehouseId?: string): DbStockLedgerEntry[] {
    if (warehouseId) {
      return (this.data.stockLedger || []).filter((e) => e.warehouseId === warehouseId);
    }
    return this.data.stockLedger || [];
  }

  processStockTransaction(params: {
    warehouseId: string;
    productId: string;
    variantId?: string;
    type: DbStockLedgerEntry['type'];
    quantity: number;
    referenceId?: string;
    notes: string;
    performedBy: string;
  }): { success: boolean; balanceAfter: number; message: string } {
    const warehouse = this.data.warehouses.find((w) => w.id === params.warehouseId);
    const product = this.data.products.find((p) => p.id === params.productId);
    if (!warehouse || !product) {
      return { success: false, balanceAfter: 0, message: 'Invalid warehouse or product identifier' };
    }

    let stock = this.data.warehouseStocks.find(
      (s) => s.warehouseId === params.warehouseId && s.productId === params.productId && (!params.variantId || s.variantId === params.variantId)
    );

    if (!stock) {
      stock = {
        id: `ws-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        warehouseId: params.warehouseId,
        productId: params.productId,
        variantId: params.variantId,
        quantity: 0,
        reservedQuantity: 0,
        reorderThreshold: 5,
      };
      this.data.warehouseStocks.push(stock);
    }

    if (params.type === 'STOCK_IN' || params.type === 'RETURN_RESTOCK') {
      stock.quantity += params.quantity;
    } else if (params.type === 'STOCK_OUT' || params.type === 'DAMAGE_WRITEOFF') {
      stock.quantity = Math.max(0, stock.quantity - params.quantity);
    } else if (params.type === 'DISPATCHED') {
      stock.quantity = Math.max(0, stock.quantity - params.quantity);
      stock.reservedQuantity = Math.max(0, stock.reservedQuantity - params.quantity);
    }

    const ledgerEntry: DbStockLedgerEntry = {
      id: `led-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      warehouseId: params.warehouseId,
      warehouseName: warehouse.name,
      productId: params.productId,
      productName: product.name,
      variantId: params.variantId,
      type: params.type,
      quantity: params.quantity,
      balanceAfter: stock.quantity,
      referenceId: params.referenceId,
      notes: params.notes,
      performedBy: params.performedBy,
      createdAt: new Date().toISOString(),
    };

    if (!this.data.stockLedger) this.data.stockLedger = [];
    this.data.stockLedger.unshift(ledgerEntry);
    this.save();

    return { success: true, balanceAfter: stock.quantity, message: 'Stock transaction recorded successfully' };
  }

  // --------------------------------------------------
  // AUTOMATED ALLOCATION & RECOVERY
  // --------------------------------------------------
  findOptimalWarehouseForOrder(
    shippingAddress: { pincode?: string; gpsLatitude?: number; gpsLongitude?: number },
    items: { productId: string; variantId?: string; quantity: number }[],
    excludedWarehouseIds: string[] = []
  ): { warehouse: DbWarehouse; distanceKm: number; hasFullStock: boolean } | null {
    const activeWarehouses = this.data.warehouses.filter((w) => w.isActive && !excludedWarehouseIds.includes(w.id));
    if (activeWarehouses.length === 0) return null;

    const userLat = shippingAddress.gpsLatitude;
    const userLon = shippingAddress.gpsLongitude;
    const userPin = shippingAddress.pincode || '';

    const ranked = activeWarehouses.map((wh) => {
      let distanceKm = 65;
      if (userLat && userLon) {
        distanceKm = calculateDistanceKm(userLat, userLon, wh.latitude, wh.longitude);
      } else if (userPin && wh.servicedPincodes.includes(userPin)) {
        distanceKm = 18;
      } else if (userPin && wh.servicedPincodes.includes(userPin.slice(0, 3))) {
        distanceKm = 40;
      }

      let hasFullStock = true;
      for (const item of items) {
        const stock = this.data.warehouseStocks.find(
          (ws) => ws.warehouseId === wh.id && ws.productId === item.productId && (!item.variantId || ws.variantId === item.variantId)
        );
        const available = stock ? stock.quantity - stock.reservedQuantity : 0;
        if (available < item.quantity) {
          hasFullStock = false;
          break;
        }
      }

      return { warehouse: wh, distanceKm, hasFullStock };
    });

    ranked.sort((a, b) => {
      if (a.hasFullStock && !b.hasFullStock) return -1;
      if (!a.hasFullStock && b.hasFullStock) return 1;
      return a.distanceKm - b.distanceKm;
    });

    return ranked[0] || null;
  }

  reassignWarehouse(
    orderId: string,
    newWarehouseId: string,
    reason: string,
    changedBy: string,
    force: boolean = false
  ): { success: boolean; order?: DbOrder; message: string } {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    const targetWh = this.data.warehouses.find((w) => w.id === newWarehouseId);
    if (!targetWh) return { success: false, message: 'Target warehouse does not exist' };

    const oldWarehouseId = order.assignedWarehouseId;
    const oldWarehouseName = order.assignedWarehouseName;

    if (oldWarehouseId) {
      this.releaseStock(order.id);
    }

    const orderItems = this.data.orderItems.filter((i) => i.orderId === order.id);
    const itemsToReserve = orderItems.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity }));

    const reserved = this.reserveStock(order.id, itemsToReserve, targetWh.id);
    if (!reserved && !force) {
      if (oldWarehouseId) this.reserveStock(order.id, itemsToReserve, oldWarehouseId);
      return { success: false, message: `Insufficient inventory in ${targetWh.name} to complete reassignment.` };
    }

    order.assignedWarehouseId = targetWh.id;
    order.assignedWarehouseName = targetWh.name;
    order.assignmentMode = 'MANUAL';
    order.allocationStatus = 'ALLOCATED';
    order.isHold = false;
    order.holdReason = undefined;
    order.updatedAt = new Date().toISOString();

    if (!order.assignmentAuditLogs) order.assignmentAuditLogs = [];
    order.assignmentAuditLogs.push({
      id: `audit-${Date.now()}`,
      orderId: order.id,
      fromWarehouseId: oldWarehouseId,
      fromWarehouseName: oldWarehouseName,
      toWarehouseId: targetWh.id,
      toWarehouseName: targetWh.name,
      reason,
      changedBy,
      timestamp: new Date().toISOString(),
    });

    this.enqueueNotification({
      event: 'WAREHOUSE_ASSIGNED',
      channel: 'EMAIL',
      recipient: targetWh.contactNumber,
      recipientRole: 'WAREHOUSE_MANAGER',
      title: 'New Order Reassigned to Hub',
      message: `Order #${order.orderNumber} reassigned to ${targetWh.name}. Reason: ${reason}.`,
      idempotencyKey: `wh-reassign-${order.id}-${targetWh.id}`,
    });

    this.save();
    return { success: true, order, message: `Order successfully reassigned to ${targetWh.name}` };
  }

  setOrderAllocationHold(
    orderId: string,
    isHold: boolean,
    reason: string,
    changedBy: string
  ): { success: boolean; order?: DbOrder; message: string } {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    order.isHold = isHold;
    order.holdReason = isHold ? reason : undefined;
    order.allocationStatus = isHold ? 'HELD' : 'ALLOCATED';
    order.updatedAt = new Date().toISOString();

    if (!order.assignmentAuditLogs) order.assignmentAuditLogs = [];
    order.assignmentAuditLogs.push({
      id: `audit-${Date.now()}`,
      orderId: order.id,
      fromWarehouseId: order.assignedWarehouseId,
      fromWarehouseName: order.assignedWarehouseName,
      toWarehouseId: order.assignedWarehouseId || 'NONE',
      toWarehouseName: order.assignedWarehouseName || 'NONE',
      reason: isHold ? `Allocation Placed on Hold: ${reason}` : `Allocation Hold Released: ${reason}`,
      changedBy,
      timestamp: new Date().toISOString(),
    });

    this.save();
    return { success: true, order, message: isHold ? 'Order allocation held' : 'Order allocation hold released' };
  }

  splitOrderAcrossWarehouses(
    orderId: string,
    splitPlan: { warehouseId: string; itemIds: string[] }[],
    changedBy: string
  ): { success: boolean; order?: DbOrder; message: string } {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    const orderItems = this.data.orderItems.filter((i) => i.orderId === order.id);
    this.releaseStock(order.id);

    const splitShipments: DbSplitShipment[] = [];

    for (let i = 0; i < splitPlan.length; i++) {
      const plan = splitPlan[i];
      const wh = this.data.warehouses.find((w) => w.id === plan.warehouseId);
      if (!wh) return { success: false, message: `Warehouse ${plan.warehouseId} not found` };

      const subItems = orderItems.filter((item) => plan.itemIds.includes(item.id));
      const reserveItems = subItems.map((item) => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity }));
      const ok = this.reserveStock(`${order.id}-split-${i}`, reserveItems, wh.id);
      if (!ok) {
        return { success: false, message: `Insufficient inventory at ${wh.name} for sub-shipment ${i + 1}` };
      }

      splitShipments.push({
        shipmentId: `shp-${Date.now()}-${i + 1}`,
        orderId: order.id,
        warehouseId: wh.id,
        warehouseName: wh.name,
        itemIds: plan.itemIds,
        trackingNumber: `AGM-SPLIT-${order.orderNumber.split('-')[2]}-${i + 1}`,
        courierName: 'Kisan Multi-Hub Express',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      });
    }

    order.isSplitOrder = true;
    order.splitShipments = splitShipments;
    order.allocationStatus = 'ALLOCATED';
    order.updatedAt = new Date().toISOString();

    if (!order.assignmentAuditLogs) order.assignmentAuditLogs = [];
    order.assignmentAuditLogs.push({
      id: `audit-${Date.now()}`,
      orderId: order.id,
      toWarehouseId: 'MULTI_WAREHOUSE',
      toWarehouseName: `${splitPlan.length} Regional Hubs`,
      reason: `Order split into ${splitPlan.length} regional shipments`,
      changedBy,
      timestamp: new Date().toISOString(),
    });

    this.save();
    return { success: true, order, message: `Order split into ${splitPlan.length} warehouse shipments successfully` };
  }

  acceptWarehouseOrder(
    orderId: string,
    warehouseId: string,
    operatorName: string
  ): { success: boolean; order?: DbOrder; message: string } {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    order.allocationStatus = 'ACCEPTED';
    order.status = 'PACKED';
    order.packingSlipNumber = `PKG-${order.assignedWarehouseId?.slice(3, 6).toUpperCase() || 'HBX'}-${order.orderNumber.slice(-4)}`;
    order.packedAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();

    if (!order.trackingMilestones) order.trackingMilestones = [];
    order.trackingMilestones.push({
      milestone: 'PACKED',
      location: order.assignedWarehouseName || 'Fulfillment Hub',
      timestamp: new Date().toISOString(),
      description: `Packed & verified by ${operatorName}. Packing slip #${order.packingSlipNumber} attached.`,
    });

    this.enqueueNotification({
      event: 'ORDER_PACKED',
      channel: 'SMS',
      recipient: order.shippingAddress?.mobile || 'Customer',
      recipientRole: 'CUSTOMER',
      title: 'Order Packed',
      message: `Kisan Bandhu, Order #${order.orderNumber} is packed at ${order.assignedWarehouseName}. Slip: ${order.packingSlipNumber}.`,
      idempotencyKey: `packed-${order.id}`,
    });

    this.save();
    return { success: true, order, message: `Order #${order.orderNumber} accepted and marked as packed.` };
  }

  rejectWarehouseOrder(
    orderId: string,
    warehouseId: string,
    reason: string
  ): { success: boolean; order?: DbOrder; reassignedTo?: DbWarehouse; message: string } {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    const rejectingWh = this.data.warehouses.find((w) => w.id === warehouseId);
    const rejectingName = rejectingWh ? rejectingWh.name : warehouseId;

    if (!order.rejectionHistory) order.rejectionHistory = [];
    order.rejectionHistory.push({
      warehouseId,
      warehouseName: rejectingName,
      reason,
      rejectedAt: new Date().toISOString(),
    });

    this.releaseStock(order.id);

    const excluded = order.rejectionHistory.map((r) => r.warehouseId);
    const orderItems = this.data.orderItems.filter((i) => i.orderId === order.id);
    const itemsToCheck = orderItems.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity }));

    const alternative = this.findOptimalWarehouseForOrder(order.shippingAddress || {}, itemsToCheck, excluded);

    if (alternative && alternative.hasFullStock) {
      this.reserveStock(order.id, itemsToCheck, alternative.warehouse.id);
      order.assignedWarehouseId = alternative.warehouse.id;
      order.assignedWarehouseName = alternative.warehouse.name;
      order.allocationStatus = 'ALLOCATED';
      order.rejectionReason = undefined;
      order.updatedAt = new Date().toISOString();

      if (!order.assignmentAuditLogs) order.assignmentAuditLogs = [];
      order.assignmentAuditLogs.push({
        id: `audit-${Date.now()}`,
        orderId: order.id,
        fromWarehouseId: warehouseId,
        fromWarehouseName: rejectingName,
        toWarehouseId: alternative.warehouse.id,
        toWarehouseName: alternative.warehouse.name,
        reason: `Automated Recovery Failover: ${rejectingName} rejected (${reason})`,
        changedBy: 'AUTO_RECOVERY_ENGINE',
        timestamp: new Date().toISOString(),
      });

      this.enqueueNotification({
        event: 'WAREHOUSE_ASSIGNED',
        channel: 'EMAIL',
        recipient: alternative.warehouse.contactNumber,
        recipientRole: 'WAREHOUSE_MANAGER',
        title: 'Urgent: Failover Order Allocated',
        message: `Failover order #${order.orderNumber} transferred to ${alternative.warehouse.name} following rejection at ${rejectingName}.`,
        idempotencyKey: `recovery-${order.id}-${alternative.warehouse.id}`,
      });

      this.save();
      return {
        success: true,
        order,
        reassignedTo: alternative.warehouse,
        message: `Order rejected by ${rejectingName}. Automated recovery transferred fulfillment to ${alternative.warehouse.name}.`,
      };
    } else {
      order.allocationStatus = 'HELD';
      order.isHold = true;
      order.holdReason = `REASSIGNMENT_FAILED_NO_STOCK: Rejected by ${rejectingName} (${reason}). No alternative hub has complete inventory.`;
      order.updatedAt = new Date().toISOString();

      this.enqueueNotification({
        event: 'ALLOCATION_FAILED_ALERT',
        channel: 'PUSH',
        recipient: 'SUPER_ADMIN',
        recipientRole: 'SUPER_ADMIN',
        title: 'High Priority: Order Allocation Failed',
        message: `Order #${order.orderNumber} was rejected by ${rejectingName} and alternative hubs lack stock. Placed on Admin Hold.`,
        idempotencyKey: `alert-hold-${order.id}`,
      });

      this.save();
      return {
        success: false,
        order,
        message: `Order rejected by ${rejectingName}. No alternative regional warehouse has inventory. Order placed on Admin Hold for manual resolution.`,
      };
    }
  }

  dispatchShipment(params: {
    orderId: string;
    warehouseId: string;
    courierName: string;
    trackingNumber: string;
    estimatedDeliveryDate?: string;
  }): { success: boolean; order?: DbOrder; message: string } {
    const order = this.data.orders.find((o) => o.id === params.orderId || o.orderNumber === params.orderId);
    if (!order) return { success: false, message: 'Order not found' };

    order.status = 'DISPATCHED';
    order.courierName = params.courierName;
    order.trackingNumber = params.trackingNumber;
    order.dispatchedAt = new Date().toISOString();
    order.estimatedDeliveryDate = params.estimatedDeliveryDate || new Date(Date.now() + 86400000 * 2).toISOString();
    order.updatedAt = new Date().toISOString();

    const orderItems = this.data.orderItems.filter((i) => i.orderId === order.id);
    for (const item of orderItems) {
      this.processStockTransaction({
        warehouseId: params.warehouseId,
        productId: item.productId,
        variantId: item.variantId,
        type: 'DISPATCHED',
        quantity: item.quantity,
        referenceId: order.orderNumber,
        notes: `Order #${order.orderNumber} dispatched via ${params.courierName} (AWB: ${params.trackingNumber})`,
        performedBy: 'Warehouse Dispatch Operator',
      });
    }

    if (!order.trackingMilestones) order.trackingMilestones = [];
    order.trackingMilestones.push({
      milestone: 'DISPATCHED',
      location: order.assignedWarehouseName || 'Fulfillment Hub',
      timestamp: new Date().toISOString(),
      description: `Dispatched with ${params.courierName}. Tracking AWB: ${params.trackingNumber}`,
    });

    this.enqueueNotification({
      event: 'ORDER_DISPATCHED',
      channel: 'SMS',
      recipient: order.shippingAddress?.mobile || 'Customer',
      recipientRole: 'CUSTOMER',
      title: 'Order Dispatched',
      message: `Kisan Bandhu! Order #${order.orderNumber} is dispatched via ${params.courierName}. AWB: ${params.trackingNumber}.`,
      idempotencyKey: `dispatch-${order.id}`,
    });

    this.save();
    return { success: true, order, message: `Order #${order.orderNumber} successfully dispatched via ${params.courierName}` };
  }

  updateDeliveryMilestone(
    orderId: string,
    milestone: DbCourierMilestone['milestone'],
    location: string,
    description: string
  ): { success: boolean; order?: DbOrder; message: string } {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    if (!order.trackingMilestones) order.trackingMilestones = [];
    order.trackingMilestones.push({
      milestone,
      location,
      timestamp: new Date().toISOString(),
      description,
    });

    if (milestone === 'OUT_FOR_DELIVERY') {
      order.status = 'OUT_FOR_DELIVERY';
      this.enqueueNotification({
        event: 'OUT_FOR_DELIVERY',
        channel: 'SMS',
        recipient: order.shippingAddress?.mobile || 'Customer',
        recipientRole: 'CUSTOMER',
        title: 'Out for Delivery',
        message: `Order #${order.orderNumber} is out for delivery to your farm in ${order.shippingAddress?.village || 'your village'}.`,
        idempotencyKey: `ofd-${order.id}`,
      });
    } else if (milestone === 'DELIVERED') {
      order.status = 'DELIVERED';
      order.deliveredAt = new Date().toISOString();
      if (order.paymentMethod === 'COD') order.paymentStatus = 'PAID';

      this.enqueueNotification({
        event: 'ORDER_DELIVERED',
        channel: 'WHATSAPP',
        recipient: order.shippingAddress?.mobile || 'Customer',
        recipientRole: 'CUSTOMER',
        title: 'Order Delivered',
        message: `Order #${order.orderNumber} has been delivered successfully to your farm. Thank you for choosing Agri Mart Mega!`,
        idempotencyKey: `delivered-${order.id}`,
      });
    }

    order.updatedAt = new Date().toISOString();
    this.save();
    return { success: true, order, message: `Milestone ${milestone} recorded` };
  }

  // --------------------------------------------------
  // PROCUREMENT & AGRONOMY LIFECYCLE
  // --------------------------------------------------
  getFarmerProfiles(): DbFarmerProfile[] {
    return this.data.farmerProfiles || [];
  }

  getFarmerProfileById(id: string): DbFarmerProfile | undefined {
    return (this.data.farmerProfiles || []).find((f) => f.id === id || f.userId === id);
  }

  updateCropStage(
    farmerProfileId: string,
    stage: DbFarmerProfile['currentCropStage'],
    notes?: string
  ): DbFarmerProfile | null {
    const profile = (this.data.farmerProfiles || []).find((f) => f.id === farmerProfileId);
    if (!profile) return null;

    profile.currentCropStage = stage;
    if (notes) profile.notes = `${profile.notes ? profile.notes + '\n' : ''}[${new Date().toLocaleDateString('en-IN')}] ${notes}`;
    profile.updatedAt = new Date().toISOString();
    this.save();
    return profile;
  }

  getAgronomyFollowUps(): DbAgronomyFollowUp[] {
    return (this.data.agronomyFollowUps || []).sort(
      (a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
    );
  }

  completeAgronomyFollowUp(id: string, notes: string): { success: boolean; followUp?: DbAgronomyFollowUp; message: string } {
    const followUp = (this.data.agronomyFollowUps || []).find((f) => f.id === id);
    if (!followUp) return { success: false, message: 'Follow-up task not found' };

    followUp.status = 'COMPLETED';
    followUp.agronomistNotes = notes;
    followUp.completedAt = new Date().toISOString();
    this.save();
    return { success: true, followUp, message: 'Follow-up marked as completed' };
  }

  getProductUsageLogs(farmerProfileId?: string): DbProductUsageLog[] {
    if (farmerProfileId) {
      return (this.data.productUsageLogs || []).filter((p) => p.farmerProfileId === farmerProfileId);
    }
    return this.data.productUsageLogs || [];
  }

  // --------------------------------------------------
  // SALES CRM PIPELINE
  // --------------------------------------------------
  getSalesLeads(): DbSalesLead[] {
    return (this.data.salesLeads || []).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  getSalesLeadById(id: string): DbSalesLead | undefined {
    return (this.data.salesLeads || []).find((l) => l.id === id || l.leadNumber === id);
  }

  createSalesLead(data: Omit<DbSalesLead, 'id' | 'leadNumber' | 'createdAt' | 'updatedAt' | 'communicationLog'>): DbSalesLead {
    const count = (this.data.salesLeads || []).length + 1;
    const newLead: DbSalesLead = {
      id: `lead-${Date.now()}`,
      leadNumber: `SL-2026-${800 + count}`,
      communicationLog: [
        {
          type: 'SMS',
          note: `Lead created via ${data.leadSource}. Assigned to ${data.assignedExecutiveName}.`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    if (!this.data.salesLeads) this.data.salesLeads = [];
    this.data.salesLeads.unshift(newLead);
    this.save();
    return newLead;
  }

  updateLeadStage(
    leadId: string,
    stage: SalesLeadStage,
    remarks: string,
    actionType: 'CALL' | 'WHATSAPP' | 'VISIT' | 'SMS' = 'CALL'
  ): { success: boolean; lead?: DbSalesLead; message: string } {
    const lead = (this.data.salesLeads || []).find((l) => l.id === leadId || l.leadNumber === leadId);
    if (!lead) return { success: false, message: 'Lead not found' };

    lead.stage = stage;
    lead.remarks = remarks;
    lead.updatedAt = new Date().toISOString();
    lead.communicationLog.unshift({
      type: actionType,
      note: `Stage changed to [${stage}]: ${remarks}`,
      timestamp: new Date().toISOString(),
    });

    this.save();
    return { success: true, lead, message: `Lead stage updated to ${stage}` };
  }

  logSalesVisit(data: Omit<DbSalesVisit, 'id' | 'createdAt'>): DbSalesVisit {
    const visit: DbSalesVisit = {
      id: `sv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...data,
    };

    if (!this.data.salesVisits) this.data.salesVisits = [];
    this.data.salesVisits.unshift(visit);

    const lead = (this.data.salesLeads || []).find((l) => l.id === data.leadId || l.leadNumber === data.leadNumber);
    if (lead) {
      lead.communicationLog.unshift({
        type: 'VISIT',
        note: `Farm visit by ${data.executiveName} at GPS (${data.gpsLatitude}, ${data.gpsLongitude}). Summary: ${data.visitSummary} [Outcome: ${data.outcome}]`,
        timestamp: new Date().toISOString(),
      });
      lead.updatedAt = new Date().toISOString();
    }

    this.save();
    return visit;
  }

  getSalesVisits(): DbSalesVisit[] {
    return this.data.salesVisits || [];
  }

  getSalesTargets(): DbSalesTarget[] {
    return this.data.salesTargets || [];
  }

  // --------------------------------------------------
  // NOTIFICATIONS MATRIX & IDEMPOTENT QUEUE
  // --------------------------------------------------
  getNotificationQueue(): DbNotificationQueueItem[] {
    return this.data.notificationQueue || [];
  }

  enqueueNotification(item: {
    event: string;
    channel: DbNotificationQueueItem['channel'];
    recipient: string;
    recipientRole: DbNotificationQueueItem['recipientRole'];
    title: string;
    message: string;
    idempotencyKey: string;
    metadata?: any;
  }): { enqueued: boolean; isDuplicate: boolean; item: DbNotificationQueueItem } {
    if (!this.data.notificationQueue) this.data.notificationQueue = [];

    const existing = this.data.notificationQueue.find((n) => n.idempotencyKey === item.idempotencyKey);
    if (existing) {
      return { enqueued: false, isDuplicate: true, item: existing };
    }

    const queueItem: DbNotificationQueueItem = {
      id: `qnotif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      idempotencyKey: item.idempotencyKey,
      event: item.event,
      channel: item.channel,
      recipient: item.recipient,
      recipientRole: item.recipientRole,
      title: item.title,
      message: item.message,
      status: 'SENT',
      attempts: 1,
      maxRetries: 3,
      scheduledAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      metadata: item.metadata,
    };

    this.data.notificationQueue.unshift(queueItem);

    if (item.recipientRole === 'CUSTOMER') {
      this.data.notifications.unshift({
        id: `notif-${Date.now()}`,
        channel: item.channel === 'WHATSAPP' ? 'WHATSAPP' : 'SMS',
        recipient: item.recipient,
        event: item.event,
        title: item.title,
        message: item.message,
        status: 'SENT',
        sentAt: new Date().toISOString(),
      });
    }

    this.save();
    return { enqueued: true, isDuplicate: false, item: queueItem };
  }

  processNotificationQueue(): { processed: number; retried: number; failed: number } {
    if (!this.data.notificationQueue) return { processed: 0, retried: 0, failed: 0 };
    let processed = 0, retried = 0, failed = 0;

    for (const item of this.data.notificationQueue) {
      if (item.status === 'QUEUED' || (item.status === 'FAILED' && item.attempts < item.maxRetries)) {
        item.attempts += 1;
        item.status = 'SENT';
        item.sentAt = new Date().toISOString();
        item.lastError = undefined;
        processed += 1;
      }
    }
    this.save();
    return { processed, retried, failed };
  }

  // --------------------------------------------------
  // INTEGRATIONS DIAGNOSTICS & TRACKER
  // --------------------------------------------------
  getIntegrations(): DbIntegrationConfig[] {
    return this.data.integrations || [];
  }

  testIntegrationPing(id: string): { success: boolean; integration?: DbIntegrationConfig; message: string } {
    const item = (this.data.integrations || []).find((i) => i.id === id);
    if (!item) return { success: false, message: 'Integration not found' };

    item.lastPingTime = new Date().toISOString();
    item.lastPingStatus = 'SUCCESS';
    item.pingLatencyMs = Math.floor(45 + Math.random() * 80);
    this.save();
    return {
      success: true,
      integration: item,
      message: `${item.name} simulated handshake healthy (latency ${item.pingLatencyMs}ms). Fallback mode operational.`,
    };
  }

  // --------------------------------------------------
  // MODULE 4: REPAIR & SERVICE CENTRE OPERATIONS
  // --------------------------------------------------

  getCustomerEquipments(): DbCustomerEquipment[] {
    return this.data.customerEquipments || [];
  }

  getCustomerEquipmentBySerial(serial: string): DbCustomerEquipment | undefined {
    return (this.data.customerEquipments || []).find(
      (eq) => eq.serialNumber.toLowerCase() === serial.toLowerCase()
    );
  }

  saveCustomerEquipment(eq: Partial<DbCustomerEquipment> & { serialNumber: string; modelName: string }): DbCustomerEquipment {
    if (!this.data.customerEquipments) this.data.customerEquipments = [];
    const existingIdx = this.data.customerEquipments.findIndex(
      (e) => e.id === eq.id || e.serialNumber.toLowerCase() === eq.serialNumber.toLowerCase()
    );
    const now = new Date().toISOString();
    if (existingIdx >= 0) {
      const updated: DbCustomerEquipment = {
        ...this.data.customerEquipments[existingIdx],
        ...eq,
      };
      this.data.customerEquipments[existingIdx] = updated;
      this.save();
      return updated;
    }

    const newEq: DbCustomerEquipment = {
      id: `eq-${Date.now()}`,
      serialNumber: eq.serialNumber,
      modelName: eq.modelName,
      category: eq.category || 'General Equipment',
      brand: eq.brand || 'AGRI MART MEGA',
      engineMotorNumber: eq.engineMotorNumber || 'ENG-TBD',
      powerType: eq.powerType || '4-Stroke Petrol',
      purchaseDate: eq.purchaseDate || now.split('T')[0],
      purchaseDealerId: eq.purchaseDealerId || 'dlr-01',
      purchaseDealerName: eq.purchaseDealerName || 'Patil Kisan Seva Kendra',
      warrantyStartDate: eq.warrantyStartDate || now.split('T')[0],
      warrantyEndDate: eq.warrantyEndDate || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      warrantyStatus: eq.warrantyStatus || 'IN_WARRANTY',
      amcDetails: eq.amcDetails,
      usageHours: eq.usageHours || 0,
      customerId: eq.customerId || `cust-${Date.now()}`,
      customerName: eq.customerName || 'Customer',
      customerMobile: eq.customerMobile || '+91 90000 00000',
      customerVillage: eq.customerVillage || 'Hubballi',
      serviceHistoryCount: 0,
      createdAt: now,
    };
    this.data.customerEquipments.unshift(newEq);
    this.save();
    return newEq;
  }

  getJobCards(filter?: { status?: RepairStage; dealerId?: string; search?: string }): DbJobCard[] {
    let list = this.data.jobCards || [];
    if (filter?.status) {
      list = list.filter((j) => j.status === filter.status);
    }
    if (filter?.dealerId) {
      list = list.filter((j) => j.dealerId === filter.dealerId);
    }
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(
        (j) =>
          j.jobCardNumber.toLowerCase().includes(s) ||
          j.customerName.toLowerCase().includes(s) ||
          j.customerMobile.includes(s) ||
          j.serialNumber.toLowerCase().includes(s) ||
          j.equipmentModel.toLowerCase().includes(s)
      );
    }
    return list;
  }

  getJobCardById(id: string): DbJobCard | undefined {
    return (this.data.jobCards || []).find((j) => j.id === id || j.jobCardNumber.toLowerCase() === id.toLowerCase());
  }

  createJobCard(input: Partial<DbJobCard> & { customerName: string; equipmentModel: string; serialNumber: string }): DbJobCard {
    if (!this.data.jobCards) this.data.jobCards = [];
    const now = new Date().toISOString();
    const count = this.data.jobCards.length + 1;
    const jcNumber = `JC-2026-${String(900 + count).padStart(4, '0')}`;

    const newJc: DbJobCard = {
      id: `jc-${Date.now()}`,
      jobCardNumber: jcNumber,
      equipmentId: input.equipmentId || `eq-${Date.now()}`,
      serialNumber: input.serialNumber,
      equipmentModel: input.equipmentModel,
      category: input.category || 'General Equipment',
      brand: input.brand || 'AGRI MART MEGA',
      engineMotorNumber: input.engineMotorNumber || 'ENG-TBD',
      powerType: input.powerType || '4-Stroke Petrol',
      usageHours: input.usageHours || 0,
      warrantyStatus: input.warrantyStatus || 'IN_WARRANTY',
      customerId: input.customerId || `cust-${Date.now()}`,
      customerName: input.customerName,
      customerMobile: input.customerMobile || '+91 98860 00000',
      customerVillage: input.customerVillage || 'Dharwad',
      dealerId: input.dealerId || 'dlr-01',
      dealerName: input.dealerName || 'Patil Kisan Seva Kendra',
      serviceCentreName: input.serviceCentreName || 'Hubballi Central Agri Workshop',
      assignedTechnicianId: input.assignedTechnicianId || 'tech-01',
      assignedTechnicianName: input.assignedTechnicianName || 'Raju Hadapad',
      serviceBayNumber: input.serviceBayNumber || 'Bay 1 - Power Tillers',
      workTiming: {
        estimatedHours: input.workTiming?.estimatedHours || 1.5,
      },
      status: 'PRODUCT_RECEIVED',
      stageTimestamps: {
        PRODUCT_RECEIVED: now,
      },
      complaints: input.complaints && input.complaints.length > 0 ? input.complaints : ['General machine checkup and diagnostics'],
      intakePhotos: input.intakePhotos || [],
      accessoriesReceived: input.accessoriesReceived || ['Standard Tool Kit'],
      fuelOrBatteryLevel: input.fuelOrBatteryLevel || '50% Level',
      expectedDeliveryDate: input.expectedDeliveryDate || new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
      customerSignatureAtIntake: input.customerSignatureAtIntake || `SIG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      inspectionChecklist: input.inspectionChecklist || [
        { item: 'Engine / Motor Health', category: 'Powertrain', status: 'Good' },
        { item: 'Drive Transmission & Belts', category: 'Drive', status: 'Good' },
        { item: 'Cutting Assembly / Blades', category: 'Cutting', status: 'Repair' },
        { item: 'Safety Guards & Fasteners', category: 'Safety', status: 'Good' },
      ],
      diagnosisNotes: input.diagnosisNotes || 'Initial product intake completed. Scheduled for detailed bench inspection.',
      rootCauseCategory: input.rootCauseCategory || 'Periodic Maintenance',
      partsRequired: input.partsRequired || [],
      labourRequired: input.labourRequired || [
        {
          labourId: 'lbr-001',
          operationCode: 'LBR-GEN-01',
          description: 'General Machine Inspection & Tune-Up',
          standardHours: 1.0,
          hourlyRate: 350,
          total: 350,
          approvalStatus: 'PENDING',
        },
      ],
      estimate: input.estimate || {
        partsSubtotal: 0,
        labourSubtotal: 350,
        estimatedTax: 63,
        estimatedTotal: 413,
        status: 'PENDING',
      },
      qualityCheck: input.qualityCheck || {
        testRunPassed: false,
        fuelBatteryChecked: false,
        bladeAlignmentChecked: false,
        sprayPressureChecked: false,
        leakageCheckPassed: false,
        cleaningVerified: false,
        inspectorNotes: 'Intake stage - QC will be performed post-repair',
        inspectorName: 'S. Kulkarni',
        isPassed: false,
      },
      warrantyClaim: input.warrantyClaim,
      createdAt: now,
      updatedAt: now,
    };

    this.data.jobCards.unshift(newJc);
    this.save();
    return newJc;
  }

  advanceRepairStage(id: string, targetStage?: RepairStage): { success: boolean; jobCard?: DbJobCard; message: string } {
    const jc = (this.data.jobCards || []).find((j) => j.id === id || j.jobCardNumber === id);
    if (!jc) return { success: false, message: 'Job Card not found' };

    const stages: RepairStage[] = [
      'PRODUCT_RECEIVED',
      'INSPECTION',
      'ESTIMATE',
      'CUSTOMER_APPROVAL',
      'REPAIR',
      'QUALITY_CHECK',
      'CLEANING',
      'BILLING',
      'DELIVERED',
    ];

    const currentIdx = stages.indexOf(jc.status);
    let nextStage: RepairStage;

    if (targetStage) {
      const targetIdx = stages.indexOf(targetStage);
      if (targetIdx === -1) return { success: false, message: `Invalid repair stage ${targetStage}` };
      nextStage = targetStage;
    } else {
      if (currentIdx === -1 || currentIdx >= stages.length - 1) {
        return { success: false, message: 'Job Card is already at final delivery stage' };
      }
      nextStage = stages[currentIdx + 1];
    }

    // Validation rules per Section 17
    if (nextStage === 'REPAIR' && jc.estimate.status !== 'APPROVED' && jc.estimate.status !== 'PARTIALLY_APPROVED') {
      return {
        success: false,
        message: 'Cannot proceed to Repair without Customer Approval of the estimate (Section 17.7). Current estimate status: ' + jc.estimate.status,
      };
    }

    if (nextStage === 'BILLING' && !jc.qualityCheck.isPassed) {
      return {
        success: false,
        message: 'Cannot advance to Billing without Quality Inspector Sign-Off (Section 17.12). Quality check must pass all functional trials.',
      };
    }

    const now = new Date().toISOString();
    jc.status = nextStage;
    if (!jc.stageTimestamps) jc.stageTimestamps = {};
    jc.stageTimestamps[nextStage] = now;
    jc.updatedAt = now;

    // Deduct parts inventory when transitioning into REPAIR if not already deducted
    if (nextStage === 'REPAIR' && jc.partsRequired && jc.partsRequired.length > 0) {
      for (const part of jc.partsRequired) {
        if (part.approvalStatus === 'APPROVED') {
          const invPart = (this.data.spareParts || []).find((sp) => sp.partNumber === part.partNumber || sp.id === part.partId);
          if (invPart && invPart.stockQuantity >= part.qty) {
            this.recordSparePartTransaction({
              partId: invPart.id,
              partNumber: invPart.partNumber,
              partName: invPart.name,
              transactionType: 'STOCK_OUT',
              quantity: part.qty,
              sourceLocation: invPart.storeRackLocation,
              destinationLocation: jc.serviceBayNumber || 'Service Bay',
              reason: `Consumed in Job Card ${jc.jobCardNumber}`,
              referenceJobCardId: jc.id,
              loggedBy: jc.assignedTechnicianName,
            });
          }
        }
      }
    }

    this.save();
    return {
      success: true,
      jobCard: jc,
      message: `Job Card ${jc.jobCardNumber} successfully advanced to ${nextStage}`,
    };
  }

  updateDiagnosisAndEstimates(
    id: string,
    data: {
      diagnosisNotes: string;
      rootCauseCategory: string;
      parts: EstimatePartItem[];
      labour: EstimateLabourItem[];
      discountAmount?: number;
    }
  ): DbJobCard {
    const jc = this.getJobCardById(id);
    if (!jc) throw new Error(`Job Card ${id} not found`);

    jc.diagnosisNotes = data.diagnosisNotes;
    jc.rootCauseCategory = data.rootCauseCategory;
    jc.partsRequired = data.parts;
    jc.labourRequired = data.labour;

    const partsSub = data.parts.reduce((sum, p) => sum + p.unitPrice * p.qty, 0);
    const labourSub = data.labour.reduce((sum, l) => sum + l.total, 0);
    const tax = Math.round((partsSub + labourSub) * 0.18);
    const discount = data.discountAmount || 0;
    const total = partsSub + labourSub + tax - discount;

    jc.estimate = {
      partsSubtotal: partsSub,
      labourSubtotal: labourSub,
      estimatedTax: tax,
      estimatedTotal: total,
      status: 'PENDING',
    };
    jc.updatedAt = new Date().toISOString();
    this.save();
    return jc;
  }

  updateEstimateDecision(
    id: string,
    decision: 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED',
    details?: {
      customerSignature?: string;
      rejectionReason?: string;
      approvedPartIds?: string[];
      approvedLabourIds?: string[];
    }
  ): DbJobCard {
    const jc = this.getJobCardById(id);
    if (!jc) throw new Error(`Job Card ${id} not found`);

    const now = new Date().toISOString();
    jc.estimate.status = decision;
    jc.estimate.approvalDate = now;
    if (details?.customerSignature) jc.estimate.customerSignature = details.customerSignature;
    if (details?.rejectionReason) jc.estimate.rejectionReason = details.rejectionReason;

    if (decision === 'PARTIALLY_APPROVED' && (details?.approvedPartIds || details?.approvedLabourIds)) {
      if (jc.partsRequired) {
        jc.partsRequired.forEach((p) => {
          p.approvalStatus = details.approvedPartIds?.includes(p.partId) ? 'APPROVED' : 'REJECTED';
        });
      }
      if (jc.labourRequired) {
        jc.labourRequired.forEach((l) => {
          l.approvalStatus = details.approvedLabourIds?.includes(l.labourId) ? 'APPROVED' : 'REJECTED';
        });
      }
      // Recalculate totals based on approved items
      const approvedPartsSub = jc.partsRequired.filter((p) => p.approvalStatus === 'APPROVED').reduce((s, p) => s + p.unitPrice * p.qty, 0);
      const approvedLabourSub = jc.labourRequired.filter((l) => l.approvalStatus === 'APPROVED').reduce((s, l) => s + l.total, 0);
      const tax = Math.round((approvedPartsSub + approvedLabourSub) * 0.18);
      jc.estimate.partsSubtotal = approvedPartsSub;
      jc.estimate.labourSubtotal = approvedLabourSub;
      jc.estimate.estimatedTax = tax;
      jc.estimate.estimatedTotal = approvedPartsSub + approvedLabourSub + tax;
    } else if (decision === 'APPROVED') {
      jc.partsRequired?.forEach((p) => (p.approvalStatus = 'APPROVED'));
      jc.labourRequired?.forEach((l) => (l.approvalStatus = 'APPROVED'));
    } else if (decision === 'REJECTED') {
      jc.partsRequired?.forEach((p) => (p.approvalStatus = 'REJECTED'));
      jc.labourRequired?.forEach((l) => (l.approvalStatus = 'REJECTED'));
    }

    if (decision === 'APPROVED' || decision === 'PARTIALLY_APPROVED') {
      if (jc.status === 'ESTIMATE' || jc.status === 'INSPECTION' || jc.status === 'CUSTOMER_APPROVAL') {
        jc.status = 'CUSTOMER_APPROVAL';
        if (!jc.stageTimestamps) jc.stageTimestamps = {};
        jc.stageTimestamps.CUSTOMER_APPROVAL = now;
      }
    }

    jc.updatedAt = now;
    this.save();
    return jc;
  }

  assignTechnicianAndBay(
    id: string,
    technicianId: string,
    technicianName: string,
    bayNumber: string,
    estimatedHours: number
  ): DbJobCard {
    const jc = this.getJobCardById(id);
    if (!jc) throw new Error(`Job Card ${id} not found`);

    jc.assignedTechnicianId = technicianId;
    jc.assignedTechnicianName = technicianName;
    jc.serviceBayNumber = bayNumber;
    jc.workTiming = {
      ...jc.workTiming,
      estimatedHours,
      actualStartTime: jc.workTiming.actualStartTime || new Date().toISOString(),
    };
    jc.updatedAt = new Date().toISOString();
    this.save();
    return jc;
  }

  completeQualityInspection(id: string, qc: JobCardQualityCheck): DbJobCard {
    const jc = this.getJobCardById(id);
    if (!jc) throw new Error(`Job Card ${id} not found`);

    const now = new Date().toISOString();
    jc.qualityCheck = {
      ...qc,
      inspectorApprovalDate: qc.isPassed ? now : undefined,
    };
    if (qc.isPassed && jc.status === 'QUALITY_CHECK') {
      jc.status = 'CLEANING';
      if (!jc.stageTimestamps) jc.stageTimestamps = {};
      jc.stageTimestamps.CLEANING = now;
    }
    jc.updatedAt = now;
    this.save();
    return jc;
  }

  generateJobCardInvoice(
    id: string,
    data: {
      discountAmount: number;
      paymentMode: 'CASH' | 'UPI' | 'CARD' | 'DEALER_CREDIT';
      paymentStatus: 'PENDING' | 'PAID' | 'PARTIALLY_PAID';
      transactionRef?: string;
    }
  ): DbJobCard {
    const jc = this.getJobCardById(id);
    if (!jc) throw new Error(`Job Card ${id} not found`);

    const now = new Date().toISOString();
    const invNumber = `INV-WS-2026-${String(Math.floor(400 + Math.random() * 500))}`;
    const partsTaxable = jc.estimate.partsSubtotal;
    const labourTaxable = jc.estimate.labourSubtotal;
    const totalTaxable = partsTaxable + labourTaxable;
    const cgst = Math.round(totalTaxable * 0.09);
    const sgst = Math.round(totalTaxable * 0.09);
    const totalTax = cgst + sgst;
    const discount = data.discountAmount || 0;
    const finalPayable = Math.max(0, totalTaxable + totalTax - discount);

    jc.invoice = {
      invoiceNumber: invNumber,
      invoiceDate: now,
      partsTaxable,
      labourTaxable,
      cgstAmount: cgst,
      sgstAmount: sgst,
      totalTax,
      discountAmount: discount,
      finalPayable,
      paymentMode: data.paymentMode,
      paymentStatus: data.paymentStatus,
      transactionRef: data.transactionRef || (data.paymentMode === 'UPI' ? `UPI-TXN-${Date.now()}` : undefined),
    };

    jc.status = 'BILLING';
    if (!jc.stageTimestamps) jc.stageTimestamps = {};
    jc.stageTimestamps.BILLING = now;
    jc.updatedAt = now;

    this.save();
    return jc;
  }

  completeDelivery(
    id: string,
    data: {
      deliveredTo: string;
      customerSignature?: string;
      nextServiceDueDays?: number;
    }
  ): DbJobCard {
    const jc = this.getJobCardById(id);
    if (!jc) throw new Error(`Job Card ${id} not found`);

    const now = new Date().toISOString();
    const days = data.nextServiceDueDays || 90;
    const nextDate = new Date(Date.now() + days * 24 * 3600 * 1000).toISOString().split('T')[0];

    jc.delivery = {
      deliveredAt: now,
      deliveredTo: data.deliveredTo,
      customerAckSignature: data.customerSignature || `SIG-DELIV-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      warrantyTermsGiven: true,
      nextServiceDueDate: nextDate,
      nextServiceHours: jc.usageHours + 100,
    };

    jc.nextServiceReminder = {
      dueDate: nextDate,
      reminderSent: false,
      reminderChannel: 'SMS',
    };

    jc.status = 'DELIVERED';
    if (!jc.stageTimestamps) jc.stageTimestamps = {};
    jc.stageTimestamps.DELIVERED = now;
    jc.updatedAt = now;

    // Also push a reminder record to serviceReminders
    if (!this.data.serviceReminders) this.data.serviceReminders = [];
    this.data.serviceReminders.push({
      id: `srem-${Date.now()}`,
      jobCardId: jc.id,
      customerId: jc.customerId,
      customerName: jc.customerName,
      customerMobile: jc.customerMobile,
      equipmentModel: jc.equipmentModel,
      equipmentSerial: jc.serialNumber,
      reminderType: 'NEXT_SERVICE',
      scheduledDate: nextDate,
      channel: 'SMS',
      status: 'PENDING',
      messageContent: `Namaskara ${jc.customerName}, your ${jc.equipmentModel} (${jc.serialNumber}) is due for scheduled 100-hr maintenance on ${nextDate}. Visit ${jc.serviceCentreName} for authorized servicing.`,
    });

    this.save();
    return jc;
  }

  // --------------------------------------------------
  // SPARE PARTS INVENTORY & LEDGER
  // --------------------------------------------------

  getSpareParts(): DbSparePart[] {
    return this.data.spareParts || [];
  }

  recordSparePartTransaction(
    input: Omit<DbSparePartTransaction, 'id' | 'timestamp'>
  ): DbSparePartTransaction {
    if (!this.data.sparePartTransactions) this.data.sparePartTransactions = [];
    const now = new Date().toISOString();
    const tx: DbSparePartTransaction = {
      id: `sptx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...input,
      timestamp: now,
    };

    this.data.sparePartTransactions.unshift(tx);

    const part = (this.data.spareParts || []).find((p) => p.id === input.partId || p.partNumber === input.partNumber);
    if (part) {
      if (input.transactionType === 'STOCK_IN' || input.transactionType === 'RETURN') {
        part.stockQuantity += input.quantity;
      } else if (input.transactionType === 'STOCK_OUT' || input.transactionType === 'DAMAGED_WRITE_OFF') {
        part.stockQuantity = Math.max(0, part.stockQuantity - input.quantity);
      }
      part.updatedAt = now;
    }

    this.save();
    return tx;
  }

  transferSpareParts(
    partId: string,
    quantity: number,
    fromLocation: string,
    toLocation: string,
    reason: string,
    user: string
  ): DbSparePartTransaction {
    const part = (this.data.spareParts || []).find((p) => p.id === partId || p.partNumber === partId);
    if (!part) throw new Error(`Spare part ${partId} not found`);
    if (part.stockQuantity < quantity) {
      throw new Error(`Insufficient stock for ${part.name}. Available: ${part.stockQuantity}, Requested: ${quantity}`);
    }

    return this.recordSparePartTransaction({
      partId: part.id,
      partNumber: part.partNumber,
      partName: part.name,
      transactionType: 'INTER_TRANSFER',
      quantity,
      sourceLocation: fromLocation,
      destinationLocation: toLocation,
      reason,
      loggedBy: user,
    });
  }

  // --------------------------------------------------
  // LABOUR CATALOGUE
  // --------------------------------------------------

  getLabourCatalogue(): DbLabourOperation[] {
    return this.data.labourCatalogue || [];
  }

  updateLabourOperation(id: string, data: Partial<DbLabourOperation>): DbLabourOperation {
    if (!this.data.labourCatalogue) this.data.labourCatalogue = [];
    const idx = this.data.labourCatalogue.findIndex((l) => l.id === id || l.operationCode === id);
    if (idx === -1) throw new Error(`Labour operation ${id} not found`);

    const updated: DbLabourOperation = {
      ...this.data.labourCatalogue[idx],
      ...data,
      standardCharge: (data.standardHours ?? this.data.labourCatalogue[idx].standardHours) *
        (data.baseRatePerHour ?? this.data.labourCatalogue[idx].baseRatePerHour),
    };
    this.data.labourCatalogue[idx] = updated;
    this.save();
    return updated;
  }

  // --------------------------------------------------
  // WARRANTY CLAIMS & HQ ESCALATION
  // --------------------------------------------------

  getWarrantyClaims(): DbWarrantyClaim[] {
    return this.data.warrantyClaims || [];
  }

  createWarrantyClaim(
    claim: Omit<DbWarrantyClaim, 'id' | 'claimNumber' | 'createdAt' | 'updatedAt'>
  ): DbWarrantyClaim {
    if (!this.data.warrantyClaims) this.data.warrantyClaims = [];
    const now = new Date().toISOString();
    const count = this.data.warrantyClaims.length + 1;
    const claimNumber = `CLM-2026-${String(30 + count).padStart(4, '0')}`;

    const newClaim: DbWarrantyClaim = {
      id: `clm-${Date.now()}`,
      claimNumber,
      ...claim,
      createdAt: now,
      updatedAt: now,
    };

    this.data.warrantyClaims.unshift(newClaim);
    this.save();
    return newClaim;
  }

  escalateWarrantyClaimToHQ(claimId: string, reason: string, user: string): DbWarrantyClaim {
    const claim = (this.data.warrantyClaims || []).find((c) => c.id === claimId || c.claimNumber === claimId);
    if (!claim) throw new Error(`Warranty claim ${claimId} not found`);

    claim.status = 'ESCALATED_TO_HQ';
    claim.isEscalatedToHQ = true;
    claim.hqEscalationReason = reason;
    claim.updatedAt = new Date().toISOString();

    // Link back to Job Card if exists
    const jc = this.getJobCardById(claim.jobCardId);
    if (jc && jc.warrantyClaim) {
      jc.warrantyClaim.claimStatus = 'ESCALATED_TO_HQ';
      jc.warrantyClaim.hqEscalationReason = reason;
      jc.updatedAt = new Date().toISOString();
    }

    this.save();
    return claim;
  }

  resolveWarrantyClaim(
    claimId: string,
    status: 'APPROVED' | 'REJECTED',
    remarks: string,
    user: string
  ): DbWarrantyClaim {
    const claim = (this.data.warrantyClaims || []).find((c) => c.id === claimId || c.claimNumber === claimId);
    if (!claim) throw new Error(`Warranty claim ${claimId} not found`);

    const now = new Date().toISOString();
    claim.status = status;
    claim.hqRemarks = remarks;
    if (status === 'APPROVED') claim.settlementDate = now;
    claim.updatedAt = now;

    const jc = this.getJobCardById(claim.jobCardId);
    if (jc && jc.warrantyClaim) {
      jc.warrantyClaim.claimStatus = status;
      jc.warrantyClaim.hqApprovedBy = user;
      jc.warrantyClaim.hqApprovalDate = now;
      jc.updatedAt = now;
    }

    this.save();
    return claim;
  }

  // --------------------------------------------------
  // SERVICE REMINDERS
  // --------------------------------------------------

  getServiceReminders(): DbServiceReminder[] {
    return this.data.serviceReminders || [];
  }

  dispatchServiceReminder(reminderId: string, channel: 'SMS' | 'WHATSAPP' | 'EMAIL'): DbServiceReminder {
    const rem = (this.data.serviceReminders || []).find((r) => r.id === reminderId);
    if (!rem) throw new Error(`Reminder ${reminderId} not found`);

    rem.status = 'SENT';
    rem.channel = channel;
    rem.dispatchedAt = new Date().toISOString();
    this.save();
    return rem;
  }

  // --------------------------------------------------
  // MODULE 5: FINANCE INCENTIVE COMMISSION ENGINE
  // --------------------------------------------------

  getDealerProfiles(): DbDealerProfile[] {
    return this.data.dealerProfiles || [];
  }

  getDealerProfileById(id: string): DbDealerProfile | undefined {
    return (this.data.dealerProfiles || []).find((d) => d.id === id || d.dealerCode === id);
  }

  updateDealerTarget(dealerId: string, newTarget: number, user: string): DbDealerProfile {
    const dealer = this.getDealerProfileById(dealerId);
    if (!dealer) throw new Error(`Dealer ${dealerId} not found`);

    const prev = dealer.monthlyTarget;
    dealer.monthlyTarget = newTarget;
    dealer.updatedAt = new Date().toISOString();

    this.logFinanceAudit({
      entityType: 'SALES_TARGET',
      entityId: dealer.id,
      action: 'UPDATE_MONTHLY_TARGET',
      previousValue: `Target: ₹${prev.toLocaleString('en-IN')}`,
      newValue: `Target: ₹${newTarget.toLocaleString('en-IN')}`,
      performedBy: user,
      reason: 'Regional target readjustment for active crop sowing season',
    });

    this.save();
    return dealer;
  }

  calculateDealerCommissions(period: string = '2026-03'): DbCommissionTarget[] {
    if (!this.data.dealerProfiles) this.data.dealerProfiles = [];
    if (!this.data.commissionTargets) this.data.commissionTargets = [];

    const tierRates: Record<string, { base: number; bonus: number }> = {
      BRONZE: { base: 4.0, bonus: 1.0 },
      SILVER: { base: 6.0, bonus: 1.5 },
      GOLD: { base: 8.0, bonus: 2.0 },
      PLATINUM: { base: 9.0, bonus: 2.5 },
    };

    const results: DbCommissionTarget[] = [];
    const now = new Date().toISOString();

    for (const dealer of this.data.dealerProfiles) {
      // Net delivered sales formula: Gross Sales - Refunds - Cancelled Orders
      const netSales = Math.max(0, dealer.mtdGrossSales - dealer.mtdRefundedSales - dealer.mtdCancelledSales);
      dealer.mtdDeliveredSales = netSales;

      const rates = tierRates[dealer.tier] || tierRates.SILVER;
      const isTargetAchieved = netSales >= dealer.monthlyTarget;
      const achievementPercent = dealer.monthlyTarget > 0 ? Math.round((netSales / dealer.monthlyTarget) * 100) : 0;

      const baseCommission = Math.round(netSales * (rates.base / 100));
      const bonusCommission = isTargetAchieved
        ? Math.round((netSales - dealer.monthlyTarget) * (rates.bonus / 100)) + Math.round(netSales * 0.002)
        : 0;

      // Clawback: refunds from prior cycles that had commission disbursed
      const refundClawback = dealer.clawbackDeductions || 0;
      const netPayable = Math.max(0, baseCommission + bonusCommission - refundClawback);

      dealer.earnedBaseCommission = baseCommission;
      dealer.earnedTargetBonus = bonusCommission;
      dealer.totalEarnedCommission = baseCommission + bonusCommission;
      dealer.pendingPayoutBalance = netPayable;
      dealer.updatedAt = now;

      let targetRecord = this.data.commissionTargets.find((ct) => ct.dealerId === dealer.id && ct.period === period);
      if (!targetRecord) {
        targetRecord = {
          id: `ct-${dealer.id}-${period}`,
          dealerId: dealer.id,
          dealerCode: dealer.dealerCode,
          period,
          targetSales: dealer.monthlyTarget,
          grossSales: dealer.mtdGrossSales,
          refundedSales: dealer.mtdRefundedSales,
          cancelledSales: dealer.mtdCancelledSales,
          netDeliveredSales: netSales,
          achievementPercent,
          isTargetAchieved,
          baseRatePercent: rates.base,
          bonusRatePercent: rates.bonus,
          baseCommission,
          bonusCommission,
          refundClawback,
          netPayableCommission: netPayable,
          status: 'OPEN',
          updatedAt: now,
        };
        this.data.commissionTargets.push(targetRecord);
      } else {
        targetRecord.grossSales = dealer.mtdGrossSales;
        targetRecord.refundedSales = dealer.mtdRefundedSales;
        targetRecord.cancelledSales = dealer.mtdCancelledSales;
        targetRecord.netDeliveredSales = netSales;
        targetRecord.achievementPercent = achievementPercent;
        targetRecord.isTargetAchieved = isTargetAchieved;
        targetRecord.baseCommission = baseCommission;
        targetRecord.bonusCommission = bonusCommission;
        targetRecord.refundClawback = refundClawback;
        targetRecord.netPayableCommission = netPayable;
        targetRecord.updatedAt = now;
      }

      results.push(targetRecord);
    }

    this.save();
    return results;
  }

  // --------------------------------------------------
  // FINANCE PAYOUT RECORDS & DISBURSEMENT WORKFLOW
  // --------------------------------------------------

  getPayoutRecords(): DbPayoutRecord[] {
    return this.data.payoutRecords || [];
  }

  recordPayoutVoucher(input: {
    dealerId: string;
    period: string;
    amount: number;
    recordedBy: string;
    breakdown?: any;
  }): DbPayoutRecord {
    if (!this.data.payoutRecords) this.data.payoutRecords = [];
    const dealer = this.getDealerProfileById(input.dealerId);
    if (!dealer) throw new Error(`Dealer ${input.dealerId} not found`);

    const now = new Date().toISOString();
    const count = this.data.payoutRecords.length + 1;
    const vchNumber = `VCH-PAY-2026-${String(40 + count).padStart(4, '0')}`;

    const tds = Math.round(input.amount * 0.05); // 5% TDS u/s 194H
    const netPayable = input.amount - tds;

    const voucher: DbPayoutRecord = {
      id: `payout-${Date.now()}`,
      voucherNumber: vchNumber,
      dealerId: dealer.id,
      dealerCode: dealer.dealerCode,
      businessName: dealer.businessName,
      period: input.period,
      amount: input.amount,
      breakdown: input.breakdown || {
        netSales: dealer.mtdDeliveredSales,
        baseCommission: dealer.earnedBaseCommission,
        bonusCommission: dealer.earnedTargetBonus,
        clawbackDeductions: dealer.clawbackDeductions,
        tdsDeduction: tds,
        netPayable: netPayable,
      },
      status: 'RECORDED_FOR_DISBURSEMENT',
      disbursementNotice:
        'Voucher recorded for Treasury release. Does NOT imply bank transfer has completed. Bank transfer requires external banking authorization / NEFT-RTGS batch processing.',
      recordedBy: input.recordedBy,
      recordedAt: now,
    };

    dealer.pendingPayoutBalance = Math.max(0, dealer.pendingPayoutBalance - input.amount);
    dealer.disbursedLifetime += input.amount;
    dealer.updatedAt = now;

    this.data.payoutRecords.unshift(voucher);

    this.logFinanceAudit({
      entityType: 'PAYOUT_VOUCHER',
      entityId: voucher.id,
      action: 'RECORD_DISBURSEMENT_VOUCHER',
      previousValue: `Pending Balance: ₹${(dealer.pendingPayoutBalance + input.amount).toLocaleString('en-IN')}`,
      newValue: `Voucher: ${vchNumber}, Amount: ₹${input.amount.toLocaleString('en-IN')}, Remaining Pending: ₹${dealer.pendingPayoutBalance.toLocaleString('en-IN')}`,
      performedBy: input.recordedBy,
      reason: 'Monthly commission voucher authorization mandate',
    });

    this.save();
    return voucher;
  }

  approvePayoutVoucher(voucherId: string, approver: string, bankBatchRef?: string): DbPayoutRecord {
    const vch = (this.data.payoutRecords || []).find((p) => p.id === voucherId || p.voucherNumber === voucherId);
    if (!vch) throw new Error(`Voucher ${voucherId} not found`);

    const now = new Date().toISOString();
    vch.status = 'FINANCE_APPROVED';
    vch.financeApprover = approver;
    vch.approvedAt = now;
    if (bankBatchRef) vch.bankBatchReference = bankBatchRef;

    this.logFinanceAudit({
      entityType: 'PAYOUT_VOUCHER',
      entityId: vch.id,
      action: 'APPROVE_PAYOUT_VOUCHER',
      previousValue: 'Status: RECORDED_FOR_DISBURSEMENT',
      newValue: `Status: FINANCE_APPROVED (Batch: ${bankBatchRef || 'Pending Batch Allocation'})`,
      performedBy: approver,
      reason: 'Finance Controller verification and sign-off for banking run',
    });

    this.save();
    return vch;
  }

  markPayoutExternallySettled(voucherId: string, bankBatchRef: string): DbPayoutRecord {
    const vch = (this.data.payoutRecords || []).find((p) => p.id === voucherId || p.voucherNumber === voucherId);
    if (!vch) throw new Error(`Voucher ${voucherId} not found`);

    vch.status = 'EXTERNALLY_SETTLED';
    vch.bankBatchReference = bankBatchRef;
    vch.settledAt = new Date().toISOString();

    this.logFinanceAudit({
      entityType: 'PAYOUT_VOUCHER',
      entityId: vch.id,
      action: 'SETTLE_EXTERNAL_BANK_TRANSFER',
      previousValue: 'Status: FINANCE_APPROVED',
      newValue: `Status: EXTERNALLY_SETTLED (Bank Batch: ${bankBatchRef})`,
      performedBy: 'Banking Integration Engine',
      reason: 'Confirmed NEFT/RTGS settlement batch acknowledgment from bank portal',
    });

    this.save();
    return vch;
  }

  // --------------------------------------------------
  // FINANCE AUDIT LOGS
  // --------------------------------------------------

  getFinanceAuditLogs(): DbFinanceAuditLog[] {
    return this.data.financeAuditLogs || [];
  }

  logFinanceAudit(entry: Omit<DbFinanceAuditLog, 'id' | 'timestamp'>): DbFinanceAuditLog {
    if (!this.data.financeAuditLogs) this.data.financeAuditLogs = [];
    const log: DbFinanceAuditLog = {
      id: `faudit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...entry,
      timestamp: new Date().toISOString(),
    };
    this.data.financeAuditLogs.unshift(log);
    this.save();
    return log;
  }

  // --------------------------------------------------
  // GALLERY & BLOG METHODS
  // --------------------------------------------------

  getGalleryItems(): DbGalleryItem[] {
    return (this.data.galleryItems || []).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  saveGalleryItem(item: Partial<DbGalleryItem> & { title: string; image: string }): DbGalleryItem {
    if (!this.data.galleryItems) this.data.galleryItems = [];
    const index = this.data.galleryItems.findIndex((g) => g.id === item.id);
    const category = item.category || item.subject || 'Farm Fields';
    const description = item.caption || (item as any).description || '';

    if (index >= 0) {
      this.data.galleryItems[index] = {
        ...this.data.galleryItems[index],
        ...item,
        subject: item.subject || item.category || this.data.galleryItems[index].subject,
        category: item.category || item.subject || this.data.galleryItems[index].category,
        caption: item.caption || (item as any).description || this.data.galleryItems[index].caption,
      };
      this.save();
      return this.data.galleryItems[index];
    } else {
      const newItem: DbGalleryItem = {
        id: item.id || `gal-${Date.now()}`,
        title: item.title,
        subject: category,
        category: category,
        caption: description,
        image: item.image,
        photographer: item.photographer || 'Agri Mart Archive',
        photographerEmail: item.photographerEmail || '',
        sourceUrl: item.sourceUrl || '',
        license: item.license || 'Unsplash License',
        alt: item.alt || item.title,
        location: item.location || '',
        cropType: item.cropType || '',
        season: item.season || '',
        farmingMethod: item.farmingMethod || '',
        cameraModel: item.cameraModel || '',
        dateTaken: item.dateTaken || '',
        tags: item.tags || '',
        aspectRatio: item.aspectRatio || '4:3',
        isFeatured: item.isFeatured ?? false,
        displayOrder: item.displayOrder ?? this.data.galleryItems.length + 1,
        isPublished: item.isPublished ?? true,
      };
      this.data.galleryItems.push(newItem);
      this.save();
      return newItem;
    }
  }

  getBlogPosts(): DbBlogPost[] {
    return this.data.blogPosts || [];
  }

  getBlogPostBySlug(slug: string): DbBlogPost | undefined {
    return (this.data.blogPosts || []).find((p) => p.slug === slug);
  }

  saveBlogPost(post: Partial<DbBlogPost> & { title: string; slug: string }): DbBlogPost {
    if (!this.data.blogPosts) this.data.blogPosts = [];
    const index = this.data.blogPosts.findIndex((p) => p.id === post.id || p.slug === post.slug);
    if (index >= 0) {
      this.data.blogPosts[index] = { ...this.data.blogPosts[index], ...post };
      this.save();
      return this.data.blogPosts[index];
    } else {
      const newPost: DbBlogPost = {
        id: post.id || `post-${Date.now()}`,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content || '',
        author: post.author || 'Agri Mart Editorial',
        authorRole: post.authorRole || 'Editorial Desk',
        date: post.date || new Date().toISOString().split('T')[0],
        category: post.category || 'General',
        image: post.image || '/images/gallery/01-green-fields.jpg',
        readingTime: post.readingTime || '5 min read',
        tags: post.tags || [],
        isPublished: post.isPublished ?? true,
      };
      this.data.blogPosts.push(newPost);
      this.save();
      return newPost;
    }
  }

  getBlogReviews(articleSlug?: string): DbBlogReview[] {
    if (!this.data.blogReviews) this.data.blogReviews = [];
    if (articleSlug) {
      return this.data.blogReviews.filter((r) => r.articleSlug === articleSlug);
    }
    return this.data.blogReviews;
  }

  addBlogReview(review: Omit<DbBlogReview, 'id' | 'createdAt' | 'status'>): DbBlogReview {
    if (!this.data.blogReviews) this.data.blogReviews = [];
    const newRev: DbBlogReview = {
      id: `brev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...review,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.data.blogReviews.unshift(newRev);
    this.save();
    return newRev;
  }

  moderateBlogReview(id: string, status: 'APPROVED' | 'REJECTED'): DbBlogReview | null {
    if (!this.data.blogReviews) this.data.blogReviews = [];
    const rev = this.data.blogReviews.find((r) => r.id === id);
    if (!rev) return null;
    rev.status = status;
    this.save();
    return rev;
  }

  // --------------------------------------------------
  // PRODUCT REVIEWS METHODS
  // --------------------------------------------------

  getReviews(): DbReview[] {
    if (!this.data.reviews) this.data.reviews = [];
    return this.data.reviews;
  }

  getReviewById(id: string): DbReview | undefined {
    return (this.data.reviews || []).find((r) => r.id === id);
  }

  saveReview(reviewData: Partial<DbReview> & { id?: string }): DbReview {
    if (!this.data.reviews) this.data.reviews = [];
    const index = this.data.reviews.findIndex((r) => r.id === reviewData.id);
    if (index >= 0) {
      this.data.reviews[index] = {
        ...this.data.reviews[index],
        ...reviewData,
      };
      this.save();
      return this.data.reviews[index];
    } else {
      const newReview: DbReview = {
        id: reviewData.id || `rev-${Date.now()}`,
        productId: reviewData.productId || 'prod-001',
        productName: reviewData.productName || 'Round Straw Bag',
        userId: reviewData.userId || 'usr-farmer-01',
        customerName: reviewData.customerName || 'b7662095-d56e-489a-98df-b7f1c2cc0f5c',
        customerEmail: reviewData.customerEmail || 'customer@example.com',
        rating: reviewData.rating !== undefined ? reviewData.rating : 5,
        title: reviewData.title || '',
        comment: reviewData.comment || '',
        replyText: reviewData.replyText || '',
        verifiedPurchase: reviewData.verifiedPurchase !== false,
        status: reviewData.status || 'APPROVED',
        createdAt: reviewData.createdAt || new Date().toISOString(),
      };
      this.data.reviews.unshift(newReview);
      this.save();
      return newReview;
    }
  }

  updateReviewStatus(ids: string[], status: 'APPROVED' | 'PENDING' | 'REJECTED'): DbReview[] {
    if (!this.data.reviews) this.data.reviews = [];
    const updated: DbReview[] = [];
    this.data.reviews.forEach((r) => {
      if (ids.includes(r.id)) {
        r.status = status;
        updated.push(r);
      }
    });
    this.save();
    return updated;
  }

  deleteReviews(ids: string[]): boolean {
    if (!this.data.reviews) this.data.reviews = [];
    const initialLen = this.data.reviews.length;
    this.data.reviews = this.data.reviews.filter((r) => !ids.includes(r.id));
    this.save();
    return this.data.reviews.length < initialLen;
  }

  // --------------------------------------------------
  // PRODUCT TAGS METHODS
  // --------------------------------------------------

  getProductTags(): DbProductTag[] {
    if (!this.data.productTags) this.data.productTags = [];
    return this.data.productTags;
  }

  getProductTagById(id: string): DbProductTag | undefined {
    return (this.data.productTags || []).find((t) => t.id === id);
  }

  saveProductTag(tagData: Partial<DbProductTag> & { id?: string }): DbProductTag {
    if (!this.data.productTags) this.data.productTags = [];
    const index = this.data.productTags.findIndex((t) => t.id === tagData.id);
    if (index >= 0) {
      this.data.productTags[index] = {
        ...this.data.productTags[index],
        ...tagData,
      };
      this.save();
      return this.data.productTags[index];
    } else {
      const newTag: DbProductTag = {
        id: tagData.id || `tag-${Date.now()}`,
        name: tagData.name || '',
        taggedProductsCount: tagData.taggedProductsCount || 0,
        productIds: tagData.productIds || [],
        createdAt: tagData.createdAt || new Date().toISOString(),
      };
      this.data.productTags.push(newTag);
      this.save();
      return newTag;
    }
  }

  deleteProductTags(ids: string[]): boolean {
    if (!this.data.productTags) this.data.productTags = [];
    const initialLen = this.data.productTags.length;
    this.data.productTags = this.data.productTags.filter((t) => !ids.includes(t.id));
    this.save();
    return this.data.productTags.length < initialLen;
  }

  // --------------------------------------------------
  // PRODUCT ATTRIBUTES METHODS
  // --------------------------------------------------

  getProductAttributes(): DbProductAttribute[] {
    if (!this.data.productAttributes) this.data.productAttributes = [];
    return this.data.productAttributes;
  }

  saveProductAttribute(attrData: Partial<DbProductAttribute> & { id?: string }): DbProductAttribute {
    if (!this.data.productAttributes) this.data.productAttributes = [];
    const index = this.data.productAttributes.findIndex((a) => a.id === attrData.id);
    if (index >= 0) {
      this.data.productAttributes[index] = { ...this.data.productAttributes[index], ...attrData };
      this.save();
      return this.data.productAttributes[index];
    } else {
      const newAttr: DbProductAttribute = {
        id: attrData.id || `pa-${Date.now()}`,
        name: attrData.name || '',
        description: attrData.description || '',
        displayOrder: attrData.displayOrder || 1,
        createdAt: attrData.createdAt || new Date().toISOString(),
      };
      this.data.productAttributes.push(newAttr);
      this.save();
      return newAttr;
    }
  }

  deleteProductAttributes(ids: string[]): boolean {
    if (!this.data.productAttributes) this.data.productAttributes = [];
    const initialLen = this.data.productAttributes.length;
    this.data.productAttributes = this.data.productAttributes.filter((a) => !ids.includes(a.id));
    this.save();
    return this.data.productAttributes.length < initialLen;
  }

  // --------------------------------------------------
  // SPECIFICATION ATTRIBUTES METHODS
  // --------------------------------------------------

  getSpecificationAttributes(): DbSpecificationAttribute[] {
    if (!this.data.specificationAttributes) this.data.specificationAttributes = [];
    return this.data.specificationAttributes;
  }

  saveSpecificationAttribute(attrData: Partial<DbSpecificationAttribute> & { id?: string }): DbSpecificationAttribute {
    if (!this.data.specificationAttributes) this.data.specificationAttributes = [];
    const index = this.data.specificationAttributes.findIndex((a) => a.id === attrData.id);
    if (index >= 0) {
      this.data.specificationAttributes[index] = { ...this.data.specificationAttributes[index], ...attrData };
      this.save();
      return this.data.specificationAttributes[index];
    } else {
      const newAttr: DbSpecificationAttribute = {
        id: attrData.id || `sa-${Date.now()}`,
        name: attrData.name || '',
        displayOrder: attrData.displayOrder || 1,
        createdAt: attrData.createdAt || new Date().toISOString(),
      };
      this.data.specificationAttributes.push(newAttr);
      this.save();
      return newAttr;
    }
  }

  deleteSpecificationAttributes(ids: string[]): boolean {
    if (!this.data.specificationAttributes) this.data.specificationAttributes = [];
    const initialLen = this.data.specificationAttributes.length;
    this.data.specificationAttributes = this.data.specificationAttributes.filter((a) => !ids.includes(a.id));
    this.save();
    return this.data.specificationAttributes.length < initialLen;
  }

  // --------------------------------------------------
  // CHECKOUT ATTRIBUTES METHODS
  // --------------------------------------------------

  getCheckoutAttributes(): DbCheckoutAttribute[] {
    if (!this.data.checkoutAttributes) this.data.checkoutAttributes = [];
    return this.data.checkoutAttributes;
  }

  saveCheckoutAttribute(attrData: Partial<DbCheckoutAttribute> & { id?: string }): DbCheckoutAttribute {
    if (!this.data.checkoutAttributes) this.data.checkoutAttributes = [];
    const index = this.data.checkoutAttributes.findIndex((a) => a.id === attrData.id);
    if (index >= 0) {
      this.data.checkoutAttributes[index] = { ...this.data.checkoutAttributes[index], ...attrData };
      this.save();
      return this.data.checkoutAttributes[index];
    } else {
      const newAttr: DbCheckoutAttribute = {
        id: attrData.id || `ca-${Date.now()}`,
        name: attrData.name || '',
        controlType: attrData.controlType || 'Dropdown',
        isRequired: attrData.isRequired || false,
        displayOrder: attrData.displayOrder || 1,
        createdAt: attrData.createdAt || new Date().toISOString(),
      };
      this.data.checkoutAttributes.push(newAttr);
      this.save();
      return newAttr;
    }
  }

  deleteCheckoutAttributes(ids: string[]): boolean {
    if (!this.data.checkoutAttributes) this.data.checkoutAttributes = [];
    const initialLen = this.data.checkoutAttributes.length;
    this.data.checkoutAttributes = this.data.checkoutAttributes.filter((a) => !ids.includes(a.id));
    this.save();
    return this.data.checkoutAttributes.length < initialLen;
  }

  // ==========================================
  // Farmer Crop Photographic Gallery Methods
  // ==========================================
  getFarmerCropGalleries(): DbFarmerCropGallery[] {
    if (!this.data.farmerCropGalleries || !Array.isArray(this.data.farmerCropGalleries)) {
      this.data.farmerCropGalleries = getInitialFarmerCropGalleries();
    }
    // Purge any legacy mock placeholder photos
    const mockFileNames = new Set([
      'maize-visit-oct18.jpg',
      'faw-whorl-oct18.jpg',
      'chilli-vegetative-oct27.jpg',
      'chilli-thrips-curl-oct27.jpg',
      'ramesh-tomato-oct20.jpg',
      'tomato-blight-check.jpg',
      'tomato-leafminer-oct20.jpg',
      'ramesh-turmeric-oct20.jpg',
      'turmeric-leafblotch-oct20.jpg',
      'paddy-tillering-oct19.jpg',
      'ysb-deadheart-oct19.jpg',
      'tomato-flowering-test-oct27.jpg',
      'tuta-pinworm-blotch-oct27.jpg',
      'xyz-tomato-flowering-oct25.jpg',
      'xyz-chilli-visit-oct26.jpg',
      'xyz-groundnut-peg-oct28.jpg',
    ]);
    this.data.farmerCropGalleries.forEach((gallery) => {
      gallery.crops.forEach((crop) => {
        crop.sections.forEach((section) => {
          if (Array.isArray(section.photos)) {
            section.photos = section.photos.filter(
              (p) => !mockFileNames.has(String(p.fileName || '').toLowerCase()) && (p.url || p.dataUrl)
            );
          }
        });
      });
    });
    return this.data.farmerCropGalleries;
  }

  getFarmerCropGallery(
    queryOrParams: string | { farmerId?: string; farmerName?: string; mobile?: string }
  ): DbFarmerCropGallery | null {
    const list = this.getFarmerCropGalleries();
    let qId = '';
    let qName = '';
    let qPhone = '';

    if (typeof queryOrParams === 'string') {
      const q = (queryOrParams || '').trim().toLowerCase();
      qId = q;
      qName = q;
      qPhone = q.replace(/\D/g, '').slice(-10);
    } else if (queryOrParams) {
      qId = (queryOrParams.farmerId || '').trim().toLowerCase();
      qName = (queryOrParams.farmerName || '').trim().toLowerCase();
      qPhone = (queryOrParams.mobile || '').replace(/\D/g, '').slice(-10);
    }

    if (!qId && !qName && !qPhone) return null;

    return (
      list.find((g) => {
        const gId = (g.farmerId || '').toLowerCase();
        const gName = (g.farmerName || '').trim().toLowerCase();
        const gPhone = (g.mobileNumber || '').replace(/\D/g, '').slice(-10);

        if (qId && gId && (gId === qId || gId.includes(qId) || qId.includes(gId))) return true;
        if (qName && gName && (gName === qName || gName.includes(qName) || qName.includes(gName))) return true;
        if (qPhone && gPhone && gPhone.endsWith(qPhone)) return true;
        return false;
      }) || null
    );
  }

  saveFarmerCropPhoto(params: {
    farmerName: string;
    farmerId?: string;
    mobileNumber?: string;
    totalAcreage?: string | number;
    cropId?: string;
    cropName: string;
    cropAcreage?: string | number;
    variety?: string;
    cropType?: string;
    sectionId: string;
    sectionName: string;
    photo: {
      id?: string;
      url: string;
      fileName?: string;
      capturedAt?: string;
      stageName?: string;
      notes?: string;
      takenBy?: string;
    };
    allCropsSummary?: {
      cropId: string;
      cropName: string;
      cropAcreage: string | number;
      variety?: string;
      cropType?: string;
    }[];
  }): { gallery: DbFarmerCropGallery; savedPhoto: DbCropSectionPhoto } {
    const list = this.getFarmerCropGalleries();
    const queryName = (params.farmerName || '').trim().toLowerCase();
    const queryId = (params.farmerId || '').trim().toLowerCase();
    const cleanPhone = (params.mobileNumber || '').replace(/\D/g, '').slice(-10);

    let gallery = list.find((g) => {
      if (queryId && g.farmerId?.toLowerCase() === queryId) return true;
      if (queryName && g.farmerName?.trim().toLowerCase() === queryName) return true;
      if (cleanPhone && g.mobileNumber?.replace(/\D/g, '').slice(-10) === cleanPhone) return true;
      return false;
    });

    const now = new Date().toISOString();

    if (!gallery) {
      gallery = {
        id: `gallery-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        farmerId: params.farmerId || `farmer-${Date.now()}`,
        farmerName: params.farmerName || 'Farmer',
        mobileNumber: params.mobileNumber || '',
        totalAcreage: params.totalAcreage || '0',
        totalCropsCount: 0,
        crops: [],
        createdAt: now,
        updatedAt: now,
      };
      list.unshift(gallery);
    } else {
      gallery.updatedAt = now;
      if (params.farmerName) gallery.farmerName = params.farmerName;
      if (params.totalAcreage) gallery.totalAcreage = params.totalAcreage;
      if (params.mobileNumber) gallery.mobileNumber = params.mobileNumber;
    }

    // Ensure all crops from allCropsSummary are represented in the farmer's crops list
    if (Array.isArray(params.allCropsSummary) && params.allCropsSummary.length > 0) {
      params.allCropsSummary.forEach((summaryCrop) => {
        if (!summaryCrop.cropName) return;
        const exists = gallery!.crops.find((c) => {
          if (c.cropName.trim().toLowerCase() === summaryCrop.cropName.trim().toLowerCase()) return true;
          if (summaryCrop.cropId && summaryCrop.cropId !== 'primary' && c.cropId === summaryCrop.cropId) return true;
          return false;
        });
        if (!exists) {
          gallery!.crops.push({
            cropId: summaryCrop.cropId || `crop-${Date.now()}-${Math.floor(Math.random() * 100)}`,
            cropName: summaryCrop.cropName,
            variety: summaryCrop.variety || '',
            cropType: summaryCrop.cropType || '',
            cropAcreage: summaryCrop.cropAcreage || '',
            sections: [],
          });
        } else {
          if (summaryCrop.cropAcreage) exists.cropAcreage = summaryCrop.cropAcreage;
          if (summaryCrop.variety) exists.variety = summaryCrop.variety;
          if (summaryCrop.cropType) exists.cropType = summaryCrop.cropType;
        }
      });
    }

    // Find or create target crop strictly matching the crop name
    const targetCropName = (params.cropName || 'General Crop').trim();
    let crop = gallery.crops.find((c) => {
      if (c.cropName.trim().toLowerCase() === targetCropName.toLowerCase()) return true;
      if (params.cropId && params.cropId !== 'primary' && c.cropId === params.cropId) return true;
      return false;
    });

    if (!crop) {
      crop = {
        cropId: params.cropId || `crop-${Date.now()}`,
        cropName: targetCropName,
        variety: params.variety || '',
        cropType: params.cropType || '',
        cropAcreage: params.cropAcreage || '',
        sections: [],
      };
      gallery.crops.push(crop);
    } else {
      if (params.cropAcreage) crop.cropAcreage = params.cropAcreage;
      if (params.variety) crop.variety = params.variety;
      if (params.cropType) crop.cropType = params.cropType;
    }

    gallery.totalCropsCount = gallery.crops.length;

    // Find or create section inside this crop
    const targetSectionId = params.sectionId || 'farmer-visit-photographs';
    const targetSectionName = params.sectionName || 'Farmer Visit Photographs';
    let section = crop.sections.find((s) => s.sectionId === targetSectionId);
    if (!section) {
      section = {
        sectionId: targetSectionId,
        sectionName: targetSectionName,
        photos: [],
      };
      crop.sections.push(section);
    }

    // Enforce strict limit: Maximum 5 images per single crop
    const totalPhotosInCrop = crop.sections.reduce(
      (acc, s) => acc + (Array.isArray(s.photos) ? s.photos.length : 0),
      0
    );

    if (totalPhotosInCrop >= 5) {
      throw new Error(
        `Maximum 5 images allowed for a single crop. Crop "${targetCropName}" already has 5 images stored. Please delete an existing photo to upload a new one.`
      );
    }

    // Build the photo record
    const safeCropSlug = targetCropName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const safeFarmerSlug = (params.farmerName || 'farmer').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timeStampStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const generatedFileName = `${safeFarmerSlug}-${safeCropSlug}-${targetSectionId === 'pest-disease-tracking' ? 'pest' : 'visit'}-${timeStampStr}-${Math.floor(100 + Math.random() * 900)}.jpg`;

    const savedPhoto: DbCropSectionPhoto = {
      id: params.photo.id || `photo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      url: params.photo.url,
      fileName: params.photo.fileName?.trim() || generatedFileName,
      capturedAt: params.photo.capturedAt || now,
      stageName: params.photo.stageName || '',
      notes: params.photo.notes || '',
      takenBy: params.photo.takenBy || params.farmerName || 'Field Capture',
      fileSizeBytes: params.photo.url ? Math.round((params.photo.url.length * 3) / 4) : 0,
    };

    // Prepend new photo to this section
    section.photos.unshift(savedPhoto);

    this.save();
    return { gallery, savedPhoto };
  }

  deleteFarmerCropPhoto(farmerIdOrName: string, cropId: string, sectionId: string, photoId: string): boolean {
    const list = this.getFarmerCropGalleries();
    const query = (farmerIdOrName || '').trim().toLowerCase();
    const gallery = list.find(
      (g) =>
        g.farmerId?.toLowerCase() === query ||
        g.farmerName?.trim().toLowerCase() === query
    );
    if (!gallery) return false;

    const crop = gallery.crops.find((c) => c.cropId === cropId || c.cropName.toLowerCase() === cropId.toLowerCase());
    if (!crop) return false;

    const section = crop.sections.find((s) => s.sectionId === sectionId);
    if (!section) return false;

    const initialLen = section.photos.length;
    section.photos = section.photos.filter((p) => p.id !== photoId && p.fileName !== photoId);
    if (section.photos.length !== initialLen) {
      gallery.updatedAt = new Date().toISOString();
      this.save();
      return true;
    }
    return false;
  }
}

// Global singleton instance for hot reload persistence
const globalForDevDb = globalThis as unknown as { __devDbInstance?: PersistentDevDatabase };
export const devDb: PersistentDevDatabase =
  globalForDevDb.__devDbInstance ?? (globalForDevDb.__devDbInstance = new PersistentDevDatabase());

export function readDb(): any {
  return devDb.getRawData();
}

export function writeDb(data?: any): boolean {
  if (data && data !== devDb.getRawData()) {
    Object.assign(devDb.getRawData(), data);
  }
  devDb.save();
  return true;
}
