import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_WAREHOUSES,
  SEED_RENTAL_PRODUCTS,
  SEED_DEALERS,
  SEED_JOB_CARDS,
  SEED_LEADS,
  SEED_PROCUREMENT_BATCHES,
  ProductType,
  WarehouseType,
  RentalProductType,
  DealerType,
  JobCardType,
  LeadType,
  ProcurementBatchType,
} from './seed-data';

export type {
  ProductType,
  WarehouseType,
  RentalProductType,
  DealerType,
  JobCardType,
  LeadType,
  ProcurementBatchType,
};

export interface OrderType {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerMobile: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  discountAmount: number;
  deliveryFee: number;
  status:
    | 'PLACED'
    | 'CONFIRMED'
    | 'PACKED'
    | 'DISPATCHED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  assignedWarehouseId?: string;
  assignedWarehouseName?: string;
  assignmentMode: 'AUTO' | 'MANUAL';
  shippingAddress: {
    address: string;
    district: string;
    state: string;
    pincode: string;
    gpsLatitude?: number;
    gpsLongitude?: number;
  };
  trackingNumber?: string;
  courierName?: string;
  createdAt: string;
}

export interface RentalBookingType {
  id: string;
  bookingNumber: string;
  rentalProductId: string;
  productTitle: string;
  customerName: string;
  customerMobile: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalDays: number;
  totalRent: number;
  securityDeposit: number;
  status: 'CONFIRMED' | 'ACTIVE' | 'RETURNED' | 'CANCELLED';
  createdAt: string;
}

export interface ServiceBookingType {
  id: string;
  requestNumber: string;
  userId: string;
  customerName: string;
  customerMobile: string;
  serviceId: string;
  serviceName: string;
  serviceType?: string;
  district?: string;
  village?: string;
  address?: string;
  pincode?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  farmAcreage?: number;
  cropType?: string;
  preferredDate: string;
  timeSlot?: string;
  preferredTime?: string;
  status: 'REQUESTED' | 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedOperatorName?: string;
  assignedProviderName?: string;
  assignedOperatorMobile?: string;
  estimatedCost?: number;
  advancePaid?: number;
  notes?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface FarmerProfileType {
  id: string;
  name: string;
  fullName?: string;
  mobile: string;
  alternateMobile?: string;
  email?: string;
  date?: string;
  state: string;
  district: string;
  taluk: string;
  villagePanchayat: string;
  village?: string;
  address: string;
  pincode: string;
  surveyNumber?: string;
  vleFpoNumber?: string;
  acreage: number | string;
  totalAcreage?: number;
  cultivatedAcreage?: number;
  jobWorkLocation?: string;
  distanceFromVle?: string;
  irrigationType: string;
  farmOperations?: string[];
  cropName: string;
  cropCycleDays: string | number;
  currentCropStage: number;
  popAttached?: boolean;
  sownDate: string;
  soilPrepDate?: string;
  manuringDate?: string;
  irrigationSchedule?: string;
  weedingSchedule?: string;
  sprayingSchedule?: string;
  maintenanceSchedule?: string;
  harvestingSchedule?: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
  };
  soilType?: string;
  primaryWaterSource?: string;
  primaryCrop?: string;
  secondaryCrop?: string;
  cropSeason?: string;
  sowingMonth?: string;
  machineryOwned?: string[];
  interestedServices?: string[];
  preferredLanguage?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  updatedAt?: string;
}

export interface CRMLeadType {
  id: string;
  leadNumber: string;
  farmerName: string;
  customerName: string;
  name?: string;
  mobile: string;
  village: string;
  district: string;
  location: string;
  crop: string;
  acreage: number;
  interestedProduct: string;
  interestedItem: string;
  stage: string;
  status: string;
  dealValue: number;
  assignedTo: string;
  assignedAgentName: string;
  source: string;
  lastFollowUp: string;
  nextFollowUp: string;
  followUpDate: string;
  notes: string;
  aiRecommendationSummary?: string;
}

export interface NotificationRecordType {
  id: string;
  channel: 'SMS' | 'EMAIL' | 'PUSH' | 'WHATSAPP';
  recipient: string;
  event: string;
  message: string;
  status: string;
  sentAt: string;
}

class InMemoryStore {
  categories = [...SEED_CATEGORIES];
  products: ProductType[] = [...SEED_PRODUCTS];
  warehouses: WarehouseType[] = [...SEED_WAREHOUSES];
  rentalProducts: RentalProductType[] = [...SEED_RENTAL_PRODUCTS];
  dealers: DealerType[] = [...SEED_DEALERS];
  jobCards: JobCardType[] = [...SEED_JOB_CARDS];
  leads: CRMLeadType[] = SEED_LEADS.map((l) => ({
    ...l,
    customerName: l.farmerName,
    name: l.farmerName,
    location: `${l.village}, ${l.district}`,
    interestedItem: l.interestedProduct,
    status: l.stage,
    assignedAgentName: l.assignedTo,
    followUpDate: l.nextFollowUp,
    aiRecommendationSummary: 'AI advisory matched: High weed count in early vegetative phase. Recommended 7HP Power Weeder + Neem-Guard bio spray.',
  }));
  procurementBatches: ProcurementBatchType[] = [...SEED_PROCUREMENT_BATCHES];

  rentals: RentalBookingType[] = [
    {
      id: 'rb-001',
      bookingNumber: 'RNT-2026-042',
      rentalProductId: 'rent-001',
      productTitle: '7HP Petrol Rotary Power Weeder with Ridger & Ditcher',
      customerName: 'Ramesh Kumar Gowda',
      customerMobile: '+91 98451 90812',
      startDate: '2026-09-17',
      endDate: '2026-09-20',
      dailyRate: 650,
      totalDays: 3,
      totalRent: 1950,
      securityDeposit: 3000,
      status: 'ACTIVE',
      createdAt: '2026-09-16T10:00:00Z',
    },
  ];

  orders: OrderType[] = [
    {
      id: 'ord-001',
      orderNumber: 'ORD-2026-9481',
      userId: 'usr-farmer-01',
      customerName: 'Ramesh Kumar Gowda',
      customerMobile: '+91 98451 90812',
      items: [
        {
          productId: 'prod-001',
          productName: 'AgriPro 7HP Heavy-Duty Multi-Speed Power Weeder',
          quantity: 1,
          price: 36500,
        },
        {
          productId: 'prod-008',
          productName: 'Hardened Rotary Tiller J-Blade Set',
          quantity: 1,
          price: 2400,
        },
      ],
      totalAmount: 38900,
      discountAmount: 1000,
      deliveryFee: 0,
      status: 'DISPATCHED',
      paymentMethod: 'UPI / Online Razorpay',
      paymentStatus: 'PAID',
      assignedWarehouseId: 'wh-hubballi',
      assignedWarehouseName: 'Hubballi Central Dark Warehouse',
      assignmentMode: 'AUTO',
      shippingAddress: {
        address: 'Farm Plot #14, Near Primary School',
        district: 'Mandya',
        state: 'Karnataka',
        pincode: '571401',
        gpsLatitude: 12.5218,
        gpsLongitude: 76.8951,
      },
      trackingNumber: 'VRL-EXP-948122',
      courierName: 'VRL Logistics Agri Express',
      createdAt: '2026-03-14T08:30:00Z',
    },
    {
      id: 'ord-002',
      orderNumber: 'ORD-2026-9482',
      userId: 'usr-farmer-02',
      customerName: 'Ningappa Kamatar',
      customerMobile: '+91 98860 54321',
      items: [
        {
          productId: 'prod-003',
          productName: 'Bhoomi Sanjivani Organic Micro-Nutrient Bio-Fertilizer (5 Kg)',
          quantity: 4,
          price: 850,
        },
        {
          productId: 'prod-004',
          productName: 'Neem-Guard 10000 PPM Certified Botanical Bio-Insecticide',
          quantity: 2,
          price: 680,
        },
      ],
      totalAmount: 4760,
      discountAmount: 200,
      deliveryFee: 0,
      status: 'PACKED',
      paymentMethod: 'Cash On Delivery',
      paymentStatus: 'PENDING',
      assignedWarehouseId: 'wh-dharwad',
      assignedWarehouseName: 'Dharwad Rural Fulfillment Hub',
      assignmentMode: 'AUTO',
      shippingAddress: {
        address: 'Main Bazaar Road, Hebballi Post',
        district: 'Dharwad',
        state: 'Karnataka',
        pincode: '580004',
        gpsLatitude: 15.4612,
        gpsLongitude: 75.0125,
      },
      createdAt: '2026-03-15T11:20:00Z',
    },
  ];

  serviceBookings: ServiceBookingType[] = [
    {
      id: 'srv-001',
      requestNumber: 'SRV-2026-041',
      userId: 'usr-farmer-01',
      customerName: 'Ramesh Kumar Gowda',
      customerMobile: '+91 98451 90812',
      serviceId: 'srv-ploughing',
      serviceName: 'Tractor Precision Ploughing & Laser Land Leveling',
      serviceType: 'Machinery Service',
      district: 'Mandya',
      village: 'Kothathi',
      address: 'Sy. No 124, Kothathi Village',
      pincode: '571401',
      gpsLatitude: 12.5218,
      gpsLongitude: 76.8951,
      farmAcreage: 4.5,
      cropType: 'Sugarcane',
      preferredDate: '2026-09-20',
      timeSlot: 'Morning (07:00 AM - 11:00 AM)',
      preferredTime: '07:00 AM - 11:00 AM',
      status: 'ASSIGNED',
      assignedOperatorName: 'Basavaraj (Fleet Unit KA-11-T-4912)',
      assignedProviderName: 'Mandya Precision Agro Fleet #11',
      assignedOperatorMobile: '+91 94801 88990',
      estimatedCost: 5400,
      advancePaid: 1000,
      notes: 'Deep furrow laser leveling needed for drip installation.',
      createdAt: '2026-09-15T14:10:00Z',
    },
    {
      id: 'srv-002',
      requestNumber: 'SRV-2026-042',
      userId: 'usr-farmer-03',
      customerName: 'Shivanand Patil',
      customerMobile: '+91 98860 67890',
      serviceId: 'srv-drone-spray',
      serviceName: 'Agricultural Drone Micron-Spraying',
      serviceType: 'Precision Agri Tech',
      district: 'Haveri',
      village: 'Devihosur',
      address: 'Near Gram Panchayat Office',
      pincode: '581110',
      gpsLatitude: 14.8123,
      gpsLongitude: 75.412,
      farmAcreage: 8.0,
      cropType: 'Chili (Byadgi)',
      preferredDate: '2026-09-22',
      timeSlot: 'Evening (04:00 PM - 07:00 PM)',
      preferredTime: '04:00 PM - 07:00 PM',
      status: 'SUBMITTED',
      assignedProviderName: 'Haveri Drone Squadron #02',
      estimatedCost: 3600,
      advancePaid: 0,
      notes: 'Thrips and mite control using Neem-Guard 10000 PPM.',
      createdAt: '2026-09-16T16:45:00Z',
    },
  ];

  farmerProfiles: FarmerProfileType[] = [
    {
      id: 'prof-001',
      name: 'Ramesh Kumar Gowda',
      fullName: 'Ramesh Kumar Gowda',
      mobile: '+91 98451 90812',
      alternateMobile: '+91 94801 11223',
      email: 'ramesh.gowda@gmail.com',
      date: '2026-09-17',
      state: 'Karnataka',
      district: 'Mandya',
      taluk: 'Mandya',
      villagePanchayat: 'Kothathi',
      village: 'Kothathi',
      address: 'Sy. No 124, Kothathi Village, Maddur Road',
      pincode: '571401',
      surveyNumber: '124/2A & 124/3',
      vleFpoNumber: 'FPO-MND-2024-089',
      acreage: 4.5,
      totalAcreage: 4.5,
      cultivatedAcreage: 4.5,
      jobWorkLocation: 'Near Cauvery Canal Branch No. 4',
      distanceFromVle: '3.5 km',
      irrigationType: 'Drip',
      farmOperations: ['Soil Preparation', 'Wet Weeding', 'Spraying', 'Harvesting', 'Logistics'],
      cropName: 'Sugarcane (Co 86032)',
      cropCycleDays: '360',
      currentCropStage: 3,
      popAttached: true,
      sownDate: '2026-06-10',
      soilPrepDate: '2026-06-01',
      manuringDate: '2026-07-25',
      irrigationSchedule: 'Drip fertigation every 4 days',
      weedingSchedule: '2026-09-18 (Power Weeder pass)',
      sprayingSchedule: '2026-10-05 (Preventive borer spray)',
      maintenanceSchedule: 'Earthing up at 120 days',
      harvestingSchedule: '2027-05-15 (Targeting 60 t/ac)',
      gpsCoordinates: {
        latitude: 12.5218,
        longitude: 76.8951,
      },
      soilType: 'Red Loamy & Clay Mix',
      primaryWaterSource: 'Canal + Borewell',
      primaryCrop: 'Sugarcane (Co 86032)',
      secondaryCrop: 'Paddy',
      cropSeason: 'Kharif / Annual',
      sowingMonth: 'June',
      machineryOwned: ['Knapsack Manual Sprayer', 'Power Weeder 7HP'],
      interestedServices: [
        'Drone Spraying Service',
        'Laser Land Leveling',
        'Soil Fertility Testing',
      ],
      preferredLanguage: 'Kannada',
      bankAccountNumber: 'XXXX-XXXX-8921',
      ifscCode: 'SBIN0001234',
      updatedAt: '2026-09-17T09:00:00Z',
    },
  ];

  notifications: NotificationRecordType[] = [
    {
      id: 'notif-001',
      channel: 'SMS',
      recipient: '+91 98451 90812',
      event: 'ORDER_DISPATCHED',
      message: 'Kisan Bandhu, your AgriMart Order #ORD-2026-9481 has been dispatched from Hubballi Dark Warehouse via VRL Express.',
      status: 'DELIVERED',
      sentAt: '2026-09-16T10:15:00Z',
    },
  ];
}

// Global singleton instance
const globalForDataStore = global as unknown as { dataStore: InMemoryStore };
export const dataStore = globalForDataStore.dataStore || new InMemoryStore();
if (process.env.NODE_ENV !== 'production') globalForDataStore.dataStore = dataStore;
