export interface ProductType {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  categoryId: string;
  price: number;
  comparePrice: number;
  brand: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  targetCrops: string[];
  cropStages: number[];
  isBestSeller: boolean;
  isFeatured: boolean;
  disableBuyButton?: boolean;
  disableWishlistButton?: boolean;
  callForPrice?: boolean;
  availableForPreOrder?: boolean;
  dosage?: string;
  warranty?: string;
}

export interface WarehouseType {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  servicedPincodes: string[];
  address: string;
  district: string;
  managerName: string;
  contactNumber: string;
  isActive: boolean;
}

export interface RentalProductType {
  id: string;
  title: string;
  slug: string;
  category: string;
  hourlyRate?: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  securityDeposit: number;
  images: string[];
  description: string;
  powerRating: string;
  fuelType: string;
  suitableFor: string;
  isAvailable: boolean;
}

export interface DealerType {
  id: string;
  dealerCode: string;
  businessName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  region: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  gstin: string;
  currentSales: number;
  targetSales: number;
  earnedCommission: number;
  pendingPayout: number;
  totalJobCards: number;
}

export interface JobCardType {
  id: string;
  jobCardNumber: string;
  equipmentModel: string;
  serialNumber: string;
  category: string;
  customerName: string;
  customerMobile: string;
  customerVillage: string;
  dealerId: string;
  dealerName: string;
  technicianName: string;
  status:
    | 'PRODUCT_RECEIVED'
    | 'INSPECTION'
    | 'ESTIMATE'
    | 'CUSTOMER_APPROVAL'
    | 'REPAIR'
    | 'QUALITY_CHECK'
    | 'CLEANING'
    | 'BILLING'
    | 'DELIVERED';
  complaints: string[];
  inspectionChecklist: { item: string; status: 'Good' | 'Repair' | 'Replace' | 'N/A' }[];
  diagnosisNotes: string;
  estimatedHours: number;
  estimatedLaborCost: number;
  estimatedPartsCost: number;
  finalTotal: number;
  partsUsed: { partNumber: string; name: string; qty: number; price: number }[];
  invoiceNumber?: string;
  paymentStatus: 'PENDING' | 'PAID';
  warrantyStatus: 'IN_WARRANTY' | 'OUT_OF_WARRANTY' | 'AMC_COVERED';
  createdAt: string;
}

export interface LeadType {
  id: string;
  leadNumber: string;
  farmerName: string;
  mobile: string;
  village: string;
  district: string;
  crop: string;
  acreage: number;
  interestedProduct: string;
  stage:
    | 'NEW_INQUIRY'
    | 'CONTACTED'
    | 'NEED_ANALYSIS'
    | 'DEMO_SCHEDULED'
    | 'QUOTATION_SENT'
    | 'NEGOTIATION'
    | 'WON'
    | 'LOST';
  dealValue: number;
  assignedTo: string;
  source: string;
  lastFollowUp: string;
  nextFollowUp: string;
  notes: string;
}

export interface ProcurementBatchType {
  id: string;
  batchNumber: string;
  farmerName: string;
  farmerMobile: string;
  village: string;
  cropName: string;
  variety: string;
  acreage: number;
  currentStage: number; // 1 to 7
  stageName: string;
  sowingDate: string;
  expectedHarvestDate: string;
  estimatedYieldKg: number;
  agreedPricePerKg: number;
  qualityGrade?: 'A' | 'B' | 'C';
  status: 'ACTIVE' | 'INSPECTED' | 'HARVESTED' | 'RECEIVED' | 'CANCELLED';
  supervisorName: string;
}

export const SEED_CATEGORIES = [
  {
    id: 'cat-machinery',
    name: 'Farm Equipment & Machinery',
    slug: 'farm-equipment-machinery',
    description: 'Power weeders, brush cutters, sprayers, tillers & harvesters',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cat-seeds',
    name: 'Seeds & Planting Materials',
    slug: 'seeds-planting-materials',
    description: 'High-yield hybrid certified paddy, cotton, maize, chili & pulses',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cat-fertilizers',
    name: 'Fertilizers & Soil Care',
    slug: 'fertilizers-soil-care',
    description: 'Bio-fertilizers, organic manures, water soluble NPK & micronutrients',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cat-protection',
    name: 'Crop Protection & Green Care',
    slug: 'crop-protection-green-care',
    description: 'Neem-based eco pest control, fungicides, bio-insecticides & weedicides',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cat-irrigation',
    name: 'Irrigation & Smart Water Tools',
    slug: 'irrigation-smart-water-tools',
    description: 'Drip lines, micro sprinklers, HDPE pipes, filters & solar pump spares',
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cat-spares',
    name: 'Spare Parts & Workshop Accessories',
    slug: 'spare-parts-accessories',
    description: 'Genuine engine components, blades, spark plugs, carburetors & seals',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  },
];

// Storefront catalogue is intentionally empty — products will be imported from the new source later.
export const SEED_PRODUCTS: ProductType[] = [];

// Sample-only data used by the internal design-system showcase (NOT shown in the shop).
export const DEMO_SAMPLE_PRODUCTS: ProductType[] = [
  {
    id: 'prod-001',
    name: 'AgriPro 7HP Heavy-Duty Multi-Speed Power Weeder (Petrol Engine)',
    slug: 'agripro-7hp-heavy-duty-power-weeder',
    sku: 'AGP-PW-7001',
    category: 'Farm Equipment & Machinery',
    categoryId: 'cat-machinery',
    price: 36500,
    comparePrice: 42000,
    brand: 'AgriPro',
    rating: 4.8,
    reviewsCount: 142,
    stock: 28,
    images: ['/images/gallery/08-farm-equipment.jpg', 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'],
    description:
      'Engineered for inter-cultivation, weeding, and soil aeration in cotton, sugarcane, maize, and vegetable fields. Features 2 forward and 1 reverse gear with heat-treated carbon steel rotary blades.',
    specifications: {
      'Engine Power': '7.0 HP 4-Stroke Air Cooled',
      'Displacement': '212 cc',
      'Tilling Width': '36 to 42 inches adjustable',
      'Tilling Depth': '5 to 8 inches',
      'Fuel Tank': '3.6 Liters',
      'Warranty': '1 Year Comprehensive + 1 Year AMC',
    },
    targetCrops: ['Cotton', 'Sugarcane', 'Maize', 'Chili', 'Soybean'],
    cropStages: [1, 2, 3],
    isBestSeller: true,
    isFeatured: true,
    disableBuyButton: true,
    warranty: '1 Year Manufacturer Warranty + 2 Free Dealer Services',
  },
  {
    id: 'prod-002',
    name: 'KisanKraft 16L 12V-12Ah Double Motor Battery Sprayer',
    slug: 'kisankraft-16l-battery-sprayer-double-motor',
    sku: 'KK-BS-1602',
    category: 'Farm Equipment & Machinery',
    categoryId: 'cat-machinery',
    price: 3850,
    comparePrice: 4800,
    brand: 'KisanKraft',
    rating: 4.7,
    reviewsCount: 230,
    stock: 85,
    images: ['/images/gallery/06-crop-spraying.jpg', 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80'],
    description:
      'Heavy-duty battery knapsack sprayer with double brass pump generating 110 PSI pressure. Includes telescopic stainless lance and 4 multi-pattern spray nozzles.',
    specifications: {
      'Tank Capacity': '16 Liters UV Stabilized',
      'Battery': '12V 12Ah Rechargeable Lead Acid',
      'Operating Pressure': '0.2 - 0.5 Mpa (Double Motor)',
      'Backup Time': '6-8 hours on full charge',
    },
    targetCrops: ['Paddy', 'Chili', 'Cotton', 'Pomegranate', 'Horticulture'],
    cropStages: [2, 3, 4, 5],
    isBestSeller: true,
    isFeatured: true,
    warranty: '6 Months Battery & Motor Warranty',
  },
  {
    id: 'prod-003',
    name: 'Bhoomi Sanjivani 100% Organic Micro-Nutrient Bio-Fertilizer (5 Kg)',
    slug: 'bhoomi-sanjivani-organic-micronutrient-fertilizer',
    sku: 'BS-OMF-5KG',
    category: 'Fertilizers & Soil Care',
    categoryId: 'cat-fertilizers',
    price: 850,
    comparePrice: 1100,
    brand: 'GreenCare Bio',
    rating: 4.9,
    reviewsCount: 310,
    stock: 450,
    images: ['/images/gallery/01-green-fields.jpg', 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80'],
    description:
      'Fortified with mycorrhiza, humic acid (65%), fulvic acid, and organic carbon. Revives degraded soils, enhances root elongation, and increases crop nutrient uptake efficiency by 35%.',
    specifications: {
      'Form': 'Granular micro-pellets',
      'Dosage': '5 Kg per acre soil application',
      'Organic Carbon': '> 14%',
      'Target Microbes': 'Glomus intraradices & Azotobacter',
    },
    targetCrops: ['All Crops', 'Paddy', 'Sugarcane', 'Cotton', 'Groundnut', 'Onion'],
    cropStages: [1, 2, 3],
    isBestSeller: true,
    isFeatured: true,
    dosage: '5 kg / acre during basal application or first top dressing',
  },
  {
    id: 'prod-004',
    name: 'Neem-Guard 10000 PPM Certified Botanical Bio-Insecticide (1 Liter)',
    slug: 'neem-guard-10000-ppm-botanical-insecticide',
    sku: 'NG-BIO-1L',
    category: 'Crop Protection & Green Care',
    categoryId: 'cat-protection',
    price: 680,
    comparePrice: 850,
    brand: 'GreenCare Bio',
    rating: 4.6,
    reviewsCount: 180,
    stock: 220,
    images: ['/images/gallery/02-farmer-working.jpg', 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80'],
    description:
      'Pure cold-pressed Azadirachtin 10,000 PPM repellent and insect growth regulator. Highly effective against aphids, thrips, whiteflies, bollworms, and leaf miners without killing honeybees.',
    specifications: {
      'Active Constituent': 'Azadirachtin 1.0% w/w (10,000 PPM)',
      'Pre-harvest Interval': '0 Days (Organic compliant)',
      'Dosage': '2.5 ml - 3 ml per Liter of water',
    },
    targetCrops: ['Cotton', 'Chili', 'Tomato', 'Brinjal', 'Paddy'],
    cropStages: [2, 3, 4, 5],
    isBestSeller: false,
    isFeatured: true,
    dosage: '30 ml per 15-liter knapsack pump',
  },
  {
    id: 'prod-005',
    name: 'Kaveri KMH-258 Super High-Yield Hybrid Corn Seeds (4 Kg Pack)',
    slug: 'kaveri-kmh-258-hybrid-corn-seeds',
    sku: 'KAV-SEED-258',
    category: 'Seeds & Planting Materials',
    categoryId: 'cat-seeds',
    price: 1250,
    comparePrice: 1450,
    brand: 'Kaveri Seeds',
    rating: 4.8,
    reviewsCount: 95,
    stock: 140,
    images: ['/images/gallery/04-seed-sowing.jpg', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'],
    description:
      'High-performing single cross hybrid maize. Excellent stay-green characteristics, lodging tolerance, orange flint kernels, and outstanding shelling percentage (83%).',
    specifications: {
      'Maturity': '105 - 115 days',
      'Seed Rate': '7 - 8 Kg per acre',
      'Cob Placement': 'Uniform medium height',
      'Average Yield': '32 - 38 Quintals / Acre',
    },
    targetCrops: ['Maize'],
    cropStages: [1, 2],
    isBestSeller: true,
    isFeatured: false,
    dosage: '1 seed per hill at 60cm x 20cm spacing',
  },
  {
    id: 'prod-006',
    name: 'Honda GX200 6.5HP 4-Stroke OHV Utility Engine (Original)',
    slug: 'honda-gx200-utility-petrol-engine',
    sku: 'HON-GX200-O',
    category: 'Farm Equipment & Machinery',
    categoryId: 'cat-machinery',
    price: 24500,
    comparePrice: 28000,
    brand: 'Honda',
    rating: 4.9,
    reviewsCount: 88,
    stock: 15,
    images: ['/images/gallery/03-tractor-soil.jpg', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
    description:
      'Legendary OHV commercial overhead valve engine with cast iron cylinder sleeve, dual element air cleaner, and low oil sensor alert. Prime mover for weeders, pumps, and generators.',
    specifications: {
      'Engine Type': '4-stroke OHV single cylinder',
      'Displacement': '196 cc',
      'Net Power Output': '5.5 HP (4.1 kW) @ 3600 rpm',
      'Starting System': 'Recoil pull starter',
    },
    targetCrops: ['General Farm Machinery'],
    cropStages: [1, 2, 3, 4, 5, 6, 7],
    isBestSeller: false,
    isFeatured: true,
    warranty: '2 Years Honda India Warranty',
  },
  {
    id: 'prod-007',
    name: 'Drip Master Inline Drip Irrigation Lateral Roll 16mm (400 Meters, Class II)',
    slug: 'drip-master-inline-lateral-roll-16mm',
    sku: 'DM-DRIP-16MM',
    category: 'Irrigation & Smart Water Tools',
    categoryId: 'cat-irrigation',
    price: 3200,
    comparePrice: 3900,
    brand: 'Jain Drip Tech',
    rating: 4.7,
    reviewsCount: 64,
    stock: 60,
    images: ['/images/gallery/05-irrigation.jpg', 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80'],
    description:
      'Virgin linear low-density polyethylene (LLDPE) pipe with cylindrical pressure-compensating emitters spaced at 40 cm. Delivers 2.4 Liters/Hour uniform flow rate.',
    specifications: {
      'Diameter': '16 mm Outer Diameter',
      'Emitter Spacing': '40 cm interval',
      'Discharge': '2.4 LPH @ 1.0 kg/cm²',
      'Coil Length': '400 meters',
    },
    targetCrops: ['Sugarcane', 'Cotton', 'Chili', 'Banana', 'Vegetables'],
    cropStages: [1, 2, 3, 4],
    isBestSeller: false,
    isFeatured: false,
    warranty: '3 Years UV degradation warranty',
  },
  {
    id: 'prod-008',
    name: 'Hardened Rotary Tiller J-Blade Set for Power Weeder (24 Pcs Set)',
    slug: 'hardened-rotary-tiller-j-blades-24pcs',
    sku: 'SP-BLADE-J24',
    category: 'Spare Parts & Workshop Accessories',
    categoryId: 'cat-spares',
    price: 2400,
    comparePrice: 3000,
    brand: 'AgriPro Spares',
    rating: 4.8,
    reviewsCount: 112,
    stock: 120,
    images: ['https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'],
    description:
      'Forged boron steel heat-treated J-curved curved blades. Universal bolt pattern fitting all 7HP - 9HP power weeders, ensuring superior soil chopping with zero bending.',
    specifications: {
      'Material': '65Mn Boron Spring Steel',
      'Hardness': '48 - 52 HRC',
      'Set Composition': '12 Left Hand + 12 Right Hand blades',
    },
    targetCrops: ['All Soils'],
    cropStages: [1, 2],
    isBestSeller: true,
    isFeatured: false,
    warranty: 'Replacement against structural fracture',
  },
];

export const SEED_WAREHOUSES: WarehouseType[] = [
  {
    id: 'wh-hubballi',
    name: 'Hubballi Central Dark Warehouse',
    code: 'WH-KA-01',
    latitude: 15.3647,
    longitude: 75.124,
    serviceRadiusKm: 65,
    servicedPincodes: ['580020', '580021', '580023', '580024', '580025', '580028', '580030', '580031', '580032'],
    address: 'Plot 44-A, KIADB Tarihal Industrial Area, Hubballi',
    district: 'Dharwad',
    managerName: 'Basavaraj Patil',
    contactNumber: '+91 94801 23450',
    isActive: true,
  },
  {
    id: 'wh-belagavi',
    name: 'Belagavi North Distribution Center',
    code: 'WH-KA-02',
    latitude: 15.8497,
    longitude: 74.4977,
    serviceRadiusKm: 55,
    servicedPincodes: ['590001', '590002', '590010', '590014', '590016', '591108', '591114', '591201'],
    address: 'Auto Nagar Phase-2, Near NH-48 Bypass, Belagavi',
    district: 'Belagavi',
    managerName: 'Suresh Kulkarni',
    contactNumber: '+91 94801 23451',
    isActive: true,
  },
  {
    id: 'wh-dharwad',
    name: 'Dharwad Rural Fulfillment Hub',
    code: 'WH-KA-03',
    latitude: 15.4589,
    longitude: 75.0078,
    serviceRadiusKm: 45,
    servicedPincodes: ['580001', '580004', '580007', '580008', '580011', '581206', '581207'],
    address: 'Near Agriculture University Main Gate, PB Road, Dharwad',
    district: 'Dharwad',
    managerName: 'Manjunath Angadi',
    contactNumber: '+91 94801 23452',
    isActive: true,
  },
  {
    id: 'wh-haveri',
    name: 'Haveri Agri Logistics Terminal',
    code: 'WH-KA-04',
    latitude: 14.7954,
    longitude: 75.3992,
    serviceRadiusKm: 60,
    servicedPincodes: ['581110', '581112', '581115', '581118', '581120', '581148'],
    address: 'APMC Yard Gate #2, Ranebennur Road, Haveri',
    district: 'Haveri',
    managerName: 'Girish Hiremath',
    contactNumber: '+91 94801 23453',
    isActive: true,
  },
];

export const SEED_RENTAL_PRODUCTS: RentalProductType[] = [
  {
    id: 'rnt-weeder-7hp',
    title: 'AgriPro 7HP Multi-Speed Heavy-Duty Power Weeder',
    slug: 'power-weeder-7hp',
    category: 'Power Weeder',
    hourlyRate: 120,
    dailyRate: 650,
    weeklyRate: 3800,
    monthlyRate: 12500,
    securityDeposit: 3000,
    images: ['https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80'],
    description: 'High-speed rotary tiller suitable for inter-row weeding in maize, cotton, and vegetables.',
    powerRating: '7.0 HP Petrol',
    fuelType: 'Petrol (Farmer provides fuel)',
    suitableFor: 'Weeding, earthing up, furrow making',
    isAvailable: true,
  },
  {
    id: 'rnt-reaper-binder',
    title: 'Self-Propelled 10HP Multi-Crop Reaper Binder',
    slug: 'power-reaper-binder',
    category: 'Reaper & Harvester',
    hourlyRate: 250,
    dailyRate: 1450,
    weeklyRate: 8500,
    monthlyRate: 28000,
    securityDeposit: 6000,
    images: ['https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80'],
    description: 'Harvests 1 acre in 60-90 minutes with neat windrow laying. Low grain loss (<1.5%).',
    powerRating: '10.0 HP Commercial Diesel',
    fuelType: 'Diesel',
    suitableFor: 'Paddy, Wheat, Soybean, Ragi',
    isAvailable: true,
  },
  {
    id: 'rnt-battery-sprayer-16l',
    title: 'KisanKraft 16L Dual-Motor High-Pressure Knapsack Sprayer',
    slug: 'battery-sprayer-16l',
    category: 'Sprayer Attachment',
    hourlyRate: 60,
    dailyRate: 350,
    weeklyRate: 2100,
    monthlyRate: 7000,
    securityDeposit: 1500,
    images: ['https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80'],
    description: 'Dual motor high-pressure knapsack sprayer for uniform pesticide & micronutrient foliar application.',
    powerRating: '12V 12Ah Dual Motor',
    fuelType: 'Rechargeable Battery',
    suitableFor: 'Field crops, Cotton, Sugarcane canopy',
    isAvailable: true,
  },
];

export const SEED_DEALERS: DealerType[] = [
  {
    id: 'dlr-01',
    dealerCode: 'DLR-HUB-01',
    businessName: 'Patil Kisan Seva Kendra',
    contactPerson: 'Anand Patil',
    mobile: '+91 98450 11223',
    email: 'patil.agri@agrimart.in',
    region: 'Hubballi Urban & Rural',
    tier: 'PLATINUM',
    gstin: '29AABCP1234F1Z1',
    currentSales: 1850000,
    targetSales: 2000000,
    earnedCommission: 148000,
    pendingPayout: 32000,
    totalJobCards: 64,
  },
  {
    id: 'dlr-02',
    dealerCode: 'DLR-DHW-02',
    businessName: 'Shri Basaveshwara Agro Agency',
    contactPerson: 'Mallikarjun Desai',
    mobile: '+91 98450 44556',
    email: 'desai.agro@agrimart.in',
    region: 'Dharwad District',
    tier: 'GOLD',
    gstin: '29BBDPS5678G2Z3',
    currentSales: 1220000,
    targetSales: 1500000,
    earnedCommission: 85400,
    pendingPayout: 18500,
    totalJobCards: 42,
  },
  {
    id: 'dlr-03',
    dealerCode: 'DLR-BEL-03',
    businessName: 'Maratha Agri Tech Solutions',
    contactPerson: 'Sunil Ghorpade',
    mobile: '+91 98450 77889',
    email: 'maratha.agri@agrimart.in',
    region: 'Belagavi South',
    tier: 'GOLD',
    gstin: '29CCEPG9012H3Z5',
    currentSales: 1080000,
    targetSales: 1200000,
    earnedCommission: 75600,
    pendingPayout: 21000,
    totalJobCards: 38,
  },
  {
    id: 'dlr-04',
    dealerCode: 'DLR-HAV-04',
    businessName: 'Ranebennur Farm Machinery & Spares',
    contactPerson: 'Prakash Byadgi',
    mobile: '+91 98450 99001',
    email: 'byadgi.spares@agrimart.in',
    region: 'Haveri / Byadgi',
    tier: 'SILVER',
    gstin: '29DDEPB3456J4Z7',
    currentSales: 640000,
    targetSales: 800000,
    earnedCommission: 38400,
    pendingPayout: 12000,
    totalJobCards: 26,
  },
  {
    id: 'dlr-05',
    dealerCode: 'DLR-GAD-05',
    businessName: 'Tontadarya Agro Traders',
    contactPerson: 'Veeranna Shettar',
    mobile: '+91 98450 22334',
    email: 'tontadarya.gadag@agrimart.in',
    region: 'Gadag District',
    tier: 'BRONZE',
    gstin: '29EEEPV7890K5Z9',
    currentSales: 320000,
    targetSales: 500000,
    earnedCommission: 16000,
    pendingPayout: 6000,
    totalJobCards: 14,
  },
];

export const SEED_JOB_CARDS: JobCardType[] = [
  {
    id: 'jc-001',
    jobCardNumber: 'JC-2026-0891',
    equipmentModel: 'AgriPro 7HP Power Weeder (Model AP-7001)',
    serialNumber: 'AP7001-2025-9482',
    category: 'Power Weeder',
    customerName: 'Kallappa Bellad',
    customerMobile: '+91 98860 12345',
    customerVillage: 'Kavalageri, Dharwad',
    dealerId: 'dlr-01',
    dealerName: 'Patil Kisan Seva Kendra',
    technicianName: 'Raju Hadapad (Certified Mechanic)',
    status: 'INSPECTION',
    complaints: ['Engine starting issue after winter idle', 'Heavy white smoke', 'Rotary blade slipping under load'],
    inspectionChecklist: [
      { item: 'Engine Oil Level & Viscosity', status: 'Replace' },
      { item: 'Spark Plug Gap & Carbon Fouling', status: 'Replace' },
      { item: 'Carburetor Jet Clogging', status: 'Repair' },
      { item: 'Transmission Belt Tension & Wear', status: 'Replace' },
      { item: 'Rotary Tiller Gearbox Oil', status: 'Good' },
    ],
    diagnosisNotes: 'Carburetor gummed with stale petrol. Drive V-belt has 35% slack. Spark plug fouled with carbon deposits.',
    estimatedHours: 2.5,
    estimatedLaborCost: 450,
    estimatedPartsCost: 1120,
    finalTotal: 1570,
    partsUsed: [
      { partNumber: 'SP-PLUG-NGK', name: 'NGK Nickel Spark Plug BM6A', qty: 1, price: 180 },
      { partNumber: 'SP-BELT-B42', name: 'Industrial V-Belt B-42 Cogged', qty: 1, price: 490 },
      { partNumber: 'SP-OIL-10W30', name: 'Castrol 4T Agri 10W-30 Oil (1L)', qty: 1, price: 450 },
    ],
    paymentStatus: 'PENDING',
    warrantyStatus: 'AMC_COVERED',
    createdAt: '2026-03-14T10:30:00Z',
  },
  {
    id: 'jc-002',
    jobCardNumber: 'JC-2026-0892',
    equipmentModel: 'KisanKraft 16L Double Motor Battery Sprayer',
    serialNumber: 'KK-16-2025-11029',
    category: 'Battery Sprayer',
    customerName: 'Ningappa Kamatar',
    customerMobile: '+91 98860 54321',
    customerVillage: 'Hebballi, Hubballi',
    dealerId: 'dlr-01',
    dealerName: 'Patil Kisan Seva Kendra',
    technicianName: 'Raju Hadapad',
    status: 'REPAIR',
    complaints: ['Pump not auto-stopping on trigger release', 'Pressure dropping rapidly'],
    inspectionChecklist: [
      { item: 'Diaphragm Pressure Micro-Switch', status: 'Replace' },
      { item: '12V Battery Voltage under load', status: 'Good' },
      { item: 'Suction Filter Mesh', status: 'Repair' },
    ],
    diagnosisNotes: 'Micro-switch cut-off contact burned. Cleaned chemical residues from strainer chamber.',
    estimatedHours: 1.0,
    estimatedLaborCost: 200,
    estimatedPartsCost: 380,
    finalTotal: 580,
    partsUsed: [{ partNumber: 'SP-SWITCH-110', name: 'Pressure Cut-Off Micro Switch 110PSI', qty: 1, price: 380 }],
    paymentStatus: 'PENDING',
    warrantyStatus: 'IN_WARRANTY',
    createdAt: '2026-03-15T09:15:00Z',
  },
  {
    id: 'jc-003',
    jobCardNumber: 'JC-2026-0888',
    equipmentModel: 'Honda GX200 6.5HP Utility Engine',
    serialNumber: 'HON-GX200-8841',
    category: 'Engine Unit',
    customerName: 'Yallappa Pujar',
    customerMobile: '+91 98860 77889',
    customerVillage: 'Gokak, Belagavi',
    dealerId: 'dlr-03',
    dealerName: 'Maratha Agri Tech Solutions',
    technicianName: 'Praveen Jadhav',
    status: 'BILLING',
    complaints: ['Recoil starter cord snapped', 'Engine stalls after 10 mins running'],
    inspectionChecklist: [
      { item: 'Recoil Pull Starter Assembly', status: 'Replace' },
      { item: 'Fuel Tank Filter & Petcock', status: 'Repair' },
      { item: 'Governor Arm Adjustment', status: 'Good' },
    ],
    diagnosisNotes: 'Recoil spring uncoiled and rope broken. Main fuel petcock blocked by rust dust.',
    estimatedHours: 2.0,
    estimatedLaborCost: 400,
    estimatedPartsCost: 1250,
    finalTotal: 1650,
    partsUsed: [
      { partNumber: 'HON-RECOIL-ASSY', name: 'Genuine Honda Recoil Starter Assy', qty: 1, price: 1100 },
      { partNumber: 'HON-PETCOCK-GASKET', name: 'Viton Fuel Bowl O-Ring & Screen', qty: 1, price: 150 },
    ],
    invoiceNumber: 'INV-WS-2026-0412',
    paymentStatus: 'PAID',
    warrantyStatus: 'OUT_OF_WARRANTY',
    createdAt: '2026-03-12T11:00:00Z',
  },
];

export const SEED_LEADS: LeadType[] = [
  {
    id: 'lead-101',
    leadNumber: 'LD-2026-0101',
    farmerName: 'Somanna Gowda',
    mobile: '+91 97410 11223',
    village: 'Annigeri',
    district: 'Dharwad',
    crop: 'Cotton & Bengal Gram',
    acreage: 8.5,
    interestedProduct: 'AgriPro 7HP Power Weeder',
    stage: 'DEMO_SCHEDULED',
    dealValue: 36500,
    assignedTo: 'Kiran K (Territory Manager Hubballi)',
    source: 'Website Onboarding Form',
    lastFollowUp: '2026-03-15',
    nextFollowUp: '2026-03-18',
    notes: 'Farmer requested on-field live weeding demo in his 4-acre cotton row plot.',
  },
  {
    id: 'lead-102',
    leadNumber: 'LD-2026-0102',
    farmerName: 'Ramesh Hugar',
    mobile: '+91 97410 33445',
    village: 'Saundatti',
    district: 'Belagavi',
    crop: 'Sugarcane',
    acreage: 12.0,
    interestedProduct: 'Drip Irrigation Automation & Fertilizer Injector',
    stage: 'QUOTATION_SENT',
    dealValue: 68000,
    assignedTo: 'Vikram Joshi (Belagavi Sales)',
    source: 'Dealer Referral (Maratha Agri)',
    lastFollowUp: '2026-03-14',
    nextFollowUp: '2026-03-19',
    notes: 'Sent PDF quote with 3-year warranty option. Customer awaiting government drip subsidy token.',
  },
  {
    id: 'lead-103',
    leadNumber: 'LD-2026-0103',
    farmerName: 'Chennappa Madar',
    mobile: '+91 97410 55667',
    village: 'Byadgi',
    district: 'Haveri',
    crop: 'Byadgi Chili & Maize',
    acreage: 5.0,
    interestedProduct: '16L Battery Sprayer + Neem-Guard 10000 PPM Combo',
    stage: 'WON',
    dealValue: 5200,
    assignedTo: 'Deepak Lamani',
    source: 'AI Advisory Quiz Recommendation',
    lastFollowUp: '2026-03-16',
    nextFollowUp: '2026-03-25',
    notes: 'Converted through AI recommendation. Order #ORD-2026-901 dispatched via Haveri Dark Warehouse.',
  },
];

export const SEED_PROCUREMENT_BATCHES: ProcurementBatchType[] = [
  {
    id: 'proc-001',
    batchNumber: 'PRC-COT-2026-01',
    farmerName: 'Kallappa Bellad',
    farmerMobile: '+91 98860 12345',
    village: 'Kavalageri, Dharwad',
    cropName: 'Bt Cotton (Long Staple)',
    variety: 'Kaveri Jadoo',
    acreage: 6.0,
    currentStage: 3, // Vegetative & Weeding
    stageName: '3. Vegetative & Active Weeding',
    sowingDate: '2025-12-10',
    expectedHarvestDate: '2026-04-15',
    estimatedYieldKg: 7200,
    agreedPricePerKg: 72.5,
    status: 'ACTIVE',
    supervisorName: 'Dr. Raghavendra (Field Agronomist)',
  },
  {
    id: 'proc-002',
    batchNumber: 'PRC-CHL-2026-04',
    farmerName: 'Basappa Talawar',
    farmerMobile: '+91 98860 99887',
    village: 'Heggeri, Haveri',
    cropName: 'Byadgi Red Chili',
    variety: 'Kaddi Special',
    acreage: 4.5,
    currentStage: 5, // Pod Formation
    stageName: '5. Flowering & Fruit Setting',
    sowingDate: '2025-11-20',
    expectedHarvestDate: '2026-03-30',
    estimatedYieldKg: 4500,
    agreedPricePerKg: 195.0,
    qualityGrade: 'A',
    status: 'ACTIVE',
    supervisorName: 'Dr. Raghavendra',
  },
  {
    id: 'proc-003',
    batchNumber: 'PRC-PAD-2026-08',
    farmerName: 'Ningappa Kamatar',
    farmerMobile: '+91 98860 54321',
    village: 'Hebballi, Hubballi',
    cropName: 'Sona Masoori Paddy',
    variety: 'BPT 5204',
    acreage: 8.0,
    currentStage: 6, // Harvest Ready
    stageName: '6. Maturity & Harvest Ready',
    sowingDate: '2025-10-15',
    expectedHarvestDate: '2026-03-22',
    estimatedYieldKg: 18000,
    agreedPricePerKg: 28.0,
    qualityGrade: 'A',
    status: 'INSPECTED',
    supervisorName: 'Shankar Naik (QC Inspector)',
  },
];

export interface BlogPostType {
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
}

export const SEED_BLOG_POSTS: BlogPostType[] = [
  {
    id: 'post-1',
    slug: 'power-weeder-inter-cultivation-cotton-sugarcane',
    title: 'Precision Inter-Cultivation in Cotton & Sugarcane Using 7HP Power Weeders',
    excerpt: 'How mechanized row tilling reduces weed competition by 85%, shatters hard crusts, and saves up to ₹4,500 per acre in manual weeding costs.',
    content: `Inter-cultivation is the single most critical intervention in wide-row crops such as Bt Cotton, Sugarcane, Maize, and Red Gram. Traditional bullock-drawn blade harrows or manual hand weeding are both labor-intensive and weather-dependent.

### Why Mechanical Weeding at Stage 3 Matters
Between 25 to 60 days after sowing (Crop Stage 3: Vegetative Phase), weeds vigorously compete with crops for moisture, nitrogen, and sunlight. 

1. **Root Aeration:** Rotary J-blades penetrate 5 to 8 inches, loosening compacted black cotton and red soils, promoting lateral feeder root expansion.
2. **Moisture Conservation:** Breaking the surface capillary action acts as a dust mulch, retarding evaporation during dry spells.
3. **Earthing Up:** By attaching a ridger accessory to the 7HP power weeder, soil is banked against plant bases, preventing crop lodging during gusty winds.

### Best Operating Practices
- **Moisture Window:** Operate 2 to 3 days after irrigation or rainfall when soil is friable ('vapsa' condition).
- **Engine Tuning:** Run the 212cc engine at 3,200 RPM in 1st forward gear for thorough weed pulverization without throwing clods into crop canopies.
- **Blade Inspection:** Check boron steel blade sharpness every 25 operating hours. Replace worn J-blades promptly to maintain uniform tilling depth.`,
    author: 'Dr. Raghavendra Kulkarni',
    authorRole: 'Senior Agronomist, UAS Dharwad Alumnus',
    date: '2026-03-10',
    category: 'Farm Mechanization',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
    readingTime: '5 min read',
    tags: ['Power Weeder', 'Cotton', 'Sugarcane', 'Mechanization', 'Stage 3'],
  },
  {
    id: 'post-2',
    slug: 'drone-precision-spraying-micron-canopy-penetration',
    title: 'Drone Micron-Spraying vs Knapsack Sprayers: Water & Chemical Savings Guide',
    excerpt: 'Comparative field study of 16-liter agricultural drones in Byadgi chili and paddy fields, demonstrating 90% water conservation and superior lower-leaf canopy coverage.',
    content: `Precision crop protection has entered a new era with GPS-guided agricultural drone technology. Farmers in Haveri and Belagavi districts face acute labor shortages during peak pest outbreaks such as thrips, whiteflies, and armyworms.

### The Problem with Conventional Knapsack Sprayers
- High Water Consumption: Manual knapsack sprayers require 150 to 200 Liters of water per acre.
- Inconsistent Pressure: Fatigue leads to pressure drops, resulting in large droplet sizes (>350 microns) that bounce off waxy leaves.
- Operator Exposure: Handheld lances cause direct operator exposure to concentrated chemical mists.

### The Drone Advantage
1. **Centrifugal Atomization:** Drones create uniform 100–150 micron droplets that adhere electrostatically to leaf undersides.
2. **Propeller Downwash:** The intense downward rotor wind opens the crop canopy, depositing bio-pesticides directly into lower foliage.
3. **Speed & Timeliness:** A 16-liter drone completes 1 acre in 10 to 12 minutes, allowing rapid containment before pest thresholds cross economic injury levels.`,
    author: 'Er. Suresh Patil',
    authorRole: 'Precision Agriculture Fleet Lead',
    date: '2026-03-12',
    category: 'Agri Tech & Drones',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
    readingTime: '6 min read',
    tags: ['Drone Spraying', 'Paddy', 'Chili', 'Pest Control', 'GPS Services'],
  },
  {
    id: 'post-3',
    slug: 'soil-organic-carbon-bio-fertilizer-mycorrhiza',
    title: 'Reviving Degraded Soil: The Critical Role of Mycorrhiza & Organic Bio-Consortia',
    excerpt: 'A practical guide for farmers to rebuild soil microbial biology, boost phosphorus uptake, and reduce reliance on synthetic chemical fertilizers.',
    content: `Decades of unbalanced chemical urea and DAP applications have depleted soil organic carbon across North and Central Karnataka, dropping below critical 0.4% levels in many taluks.

### Restoring Soil Biology with Bio-Consortia
Bio-fertilizers like Bhoomi Sanjivani introduce beneficial living microorganisms that transform insoluble minerals into bio-available forms:

1. **VAM (Vesicular Arbuscular Mycorrhiza):** Extends microscopic fungal hyphae far beyond root zones, increasing root surface contact by up to 400% for insoluble phosphorus and zinc uptake.
2. **Azotobacter & Azospirillum:** Fix atmospheric nitrogen naturally, saving up to 25% of synthetic nitrogen fertilizer costs.
3. **Phosphate Solubilizing Bacteria (PSB):** Secrete organic acids that dissolve fixed tricalcium phosphate in alkaline soils.

### Step-by-Step Basal Application Protocol
- Mix 5 kg of bio-micronutrient pellets with 100 kg of well-rotted farmyard manure (FYM) or vermicompost.
- Keep in shade for 48 hours to activate dormant spores.
- Apply along crop rows during basal land preparation or early top dressing before irrigation.`,
    author: 'Dr. Anita Joshi',
    authorRole: 'Chief Soil Scientist',
    date: '2026-03-14',
    category: 'Soil Care & Bio-Fertilizers',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
    readingTime: '4 min read',
    tags: ['Bio Fertilizer', 'Soil Health', 'NPK', 'Mycorrhiza', 'Stage 1'],
  },
];

