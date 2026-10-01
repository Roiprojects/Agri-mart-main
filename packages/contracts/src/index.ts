/**
 * AGRI MART MEGA - SHARED CONTRACTS PACKAGE
 * Pure TypeScript interfaces, DTOs, and validation contracts.
 * ZERO database connections, ZERO server secrets.
 */

// ---------------------------------------------------------------------------
// 1. GENERIC API ENVELOPES
// ---------------------------------------------------------------------------
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// 2. PRODUCT & CATALOGUE CONTRACTS
// ---------------------------------------------------------------------------
export interface ProductVariantContract {
  id: string;
  sku: string;
  name: string;
  packagingSize: string;
  price: number;
  comparePrice?: number;
  stockQuantity: number;
  isAvailable: boolean;
}

export interface ProductSpecificationContract {
  label: string;
  value: string;
}

export interface ProductContract {
  id: string;
  slug: string;
  sku: string;
  name: string;
  nameKn?: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  price: number;
  comparePrice?: number;
  images: string[];
  description: string;
  descriptionKn?: string;
  specifications: Record<string, string>;
  targetCrops: string[];
  stockQuantity: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  variants?: ProductVariantContract[];
  warranty?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryContract {
  id: string;
  slug: string;
  name: string;
  nameKn?: string;
  description: string;
  imageUrl?: string;
  productCount: number;
  featured?: boolean;
}

// ---------------------------------------------------------------------------
// 3. CART & CHECKOUT CONTRACTS
// ---------------------------------------------------------------------------
export interface CartItemContract {
  productId: string;
  variantId?: string;
  title: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface CartValidationRequest {
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  couponCode?: string;
  pincode?: string;
}

export interface CartValidationResponse {
  isValid: boolean;
  items: (CartItemContract & { inStock: boolean; availableStock: number; priceChanged: boolean })[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  warnings?: string[];
}

export type CartRevalidationRequest = CartValidationRequest;
export type CartRevalidationResponse = CartValidationResponse;
export type CartCalculationRequest = CartValidationRequest;
export type CartCalculationResponse = CartValidationResponse;

export interface CreateOrderRequest {
  customerName: string;
  customerMobile: string;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  shippingAddress: ShippingAddressContract;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  totalAmount?: number;
  razorpayOrderId?: string;
  message?: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  orderId?: string;
  paymentStatus?: PaymentStatus;
  message?: string;
}

// ---------------------------------------------------------------------------
// 4. ORDER & FULFILLMENT CONTRACTS
// ---------------------------------------------------------------------------
export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'ALLOCATED'
  | 'PACKED'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'UPI' | 'CARD' | 'NETBANKING' | 'COD';

export interface ShippingAddressContract {
  fullName: string;
  mobile: string;
  alternateMobile?: string;
  addressLine: string;
  village: string;
  taluk: string;
  district: string;
  state?: string;
  pincode: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
}

export interface TrackingMilestoneContract {
  milestone: string;
  location?: string;
  timestamp: string;
  description: string;
}

export interface OrderContract {
  id: string;
  orderNumber: string;
  userId: string;
  customerName?: string;
  customerMobile?: string;
  items: CartItemContract[];
  subtotalAmount: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  shippingAddress: ShippingAddressContract;
  assignedWarehouseId?: string;
  assignedWarehouseName?: string;
  trackingNumber?: string;
  courierName?: string;
  trackingMilestones: TrackingMilestoneContract[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// 5. EQUIPMENT RENTAL CONTRACTS
// ---------------------------------------------------------------------------
export type RentalStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'ACTIVE'
  | 'RETURNED_ON_TIME'
  | 'RETURNED_LATE'
  | 'RETURNED_DAMAGED'
  | 'CANCELLED';

export interface RentalProductContract {
  id: string;
  slug: string;
  title: string;
  titleKn?: string;
  category: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  securityDeposit: number;
  totalUnits: number;
  availableUnits: number;
  imageUrl: string;
  specifications: Record<string, string>;
  operatorIncluded?: boolean;
}

export interface RentalBookingContract {
  id: string;
  bookingNumber: string;
  rentalProductId: string;
  productTitle: string;
  userId: string;
  customerName: string;
  customerMobile: string;
  deliveryAddress: string;
  pincode: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  rentAmount: number;
  securityDeposit: number;
  totalPaid: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: RentalStatus;
  depositRefundStatus: 'PENDING' | 'PROCESSED' | 'FORFEITED';
  depositRefundAmount?: number;
  damageCharge?: number;
  lateFee?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RentalAvailabilityContract {
  isAvailable: boolean;
  totalUnits: number;
  activeBookingsCount: number;
  remainingUnits: number;
  conflictingBookings: { bookingNumber: string; startDate: string; endDate: string }[];
}

// ---------------------------------------------------------------------------
// 6. AGRICULTURAL SERVICES CONTRACTS
// ---------------------------------------------------------------------------
export type ServiceBookingStatus = 'REQUESTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ServiceJobWorkContract {
  id: string;
  name: string;
  nameKn?: string;
  ratePerAcre: number;
  estimatedHoursPerAcre: number;
}

export interface ServiceOfferingContract {
  id: string;
  slug: string;
  name: string;
  nameKn?: string;
  category: string;
  description: string;
  imageUrl: string;
  jobWorks: ServiceJobWorkContract[];
}

export interface ServiceBookingRequestContract {
  id: string;
  requestNumber: string;
  userId: string;
  customerName: string;
  customerMobile: string;
  serviceId: string;
  serviceName: string;
  jobWorkId?: string;
  jobWorkName?: string;
  farmAcreage: number;
  cropType: string;
  district: string;
  taluk: string;
  village: string;
  address: string;
  pincode: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  preferredDate: string;
  preferredTime: string;
  status: ServiceBookingStatus;
  estimatedCost: number;
  assignedProviderId?: string;
  assignedProviderName?: string;
  assignedOperatorMobile?: string;
  assignedFleetUnit?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// 7. REPAIR & WORKSHOP CONTRACTS
// ---------------------------------------------------------------------------
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

export interface CustomerEquipmentContract {
  id: string;
  serialNumber: string;
  modelName: string;
  category: string;
  brand: string;
  engineMotorNumber?: string;
  powerType: string;
  usageHours: number;
  customerName: string;
  customerMobile: string;
  customerVillage: string;
  warrantyStatus: 'IN_WARRANTY' | 'OUT_OF_WARRANTY' | 'AMC_COVERED' | 'EXPIRED';
}

export interface JobCardContract {
  id: string;
  jobCardNumber: string;
  customerName: string;
  customerMobile: string;
  customerVillage: string;
  equipmentModel: string;
  serialNumber: string;
  category: string;
  powerType: string;
  usageHours: number;
  status: RepairStage;
  complaints: string[];
  accessoriesReceived: string[];
  fuelOrBatteryLevel: string;
  expectedDeliveryDate: string;
  assignedTechnicianName?: string;
  serviceBayNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// 8. DEALER & FINANCE CONTRACTS
// ---------------------------------------------------------------------------
export type DealerTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface DealerCommissionContract {
  dealerId: string;
  dealerCode: string;
  dealerName: string;
  tier: DealerTier;
  grossSales: number;
  refundedSales: number;
  cancelledSales: number;
  netDeliveredSales: number;
  baseCommissionRate: number;
  baseCommission: number;
  bonusCommission: number;
  clawbackDeductions: number;
  netPayableCommission: number;
}

export interface PayoutVoucherContract {
  id: string;
  voucherNumber: string;
  dealerId: string;
  dealerName: string;
  period: string;
  amount: number;
  status: 'RECORDED_FOR_DISBURSEMENT' | 'FINANCE_APPROVED' | 'EXTERNALLY_SETTLED';
  disbursementNotice: string;
  bankBatchReference?: string;
  settledAt?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// 9. REVALIDATION & LIVE SYNCHRONIZATION CONTRACTS
// ---------------------------------------------------------------------------
export type SyncEventType =
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_PRICE_CHANGED'
  | 'STOCK_CHANGED'
  | 'CATEGORY_UPDATED'
  | 'BANNER_PUBLISHED'
  | 'ORDER_STATUS_CHANGED'
  | 'RENTAL_STATUS_CHANGED'
  | 'SERVICE_STATUS_CHANGED';

export interface RevalidationWebhookPayload {
  secret: string;
  event: SyncEventType;
  entityId?: string;
  paths?: string[];
  tags?: string[];
  timestamp: string;
}

export interface LiveSyncEvent {
  id: string;
  event: SyncEventType;
  entityId?: string;
  payload?: any;
  timestamp: string;
}
