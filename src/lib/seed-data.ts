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
  riplCode?: string;
  modelNumber?: string;
  descriptionHtml?: string;
  accessoriesInfo?: string;
  brochures?: Array<{ label: string; url: string; fileName: string; available?: boolean }>;
  videos?: Array<{ url: string; fileName?: string; type?: string; available?: boolean }>;
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
  {"id":"cat-am-blower-mistblower","name":"BLOWER - MISTBLOWER","slug":"blower-mistblower","description":"BLOWER - MISTBLOWER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_1919_1.jpg"},
  {"id":"cat-am-brush-cutter-weed-cutter","name":"BRUSH CUTTER - WEED CUTTER","slug":"brush-cutter-weed-cutter","description":"BRUSH CUTTER - WEED CUTTER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3526_1.jpg"},
  {"id":"cat-am-chaff-cutter-shredder","name":"CHAFF CUTTER / SHREDDER","slug":"chaff-cutter-shredder","description":"CHAFF CUTTER / SHREDDER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3554_1.jpg"},
  {"id":"cat-am-chain-saw","name":"CHAIN SAW","slug":"chain-saw","description":"CHAIN SAW — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3524_1.jpg"},
  {"id":"cat-am-earth-auger","name":"EARTH AUGER","slug":"earth-auger","description":"EARTH AUGER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3153_1.jpg"},
  {"id":"cat-am-engine","name":"ENGINE","slug":"engine","description":"ENGINE — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3598_1.jpg"},
  {"id":"cat-am-fogger-ulv-thermal","name":"FOGGER / ULV & THERMAL","slug":"fogger-ulv-thermal","description":"FOGGER / ULV & THERMAL — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_1750_1.jpg"},
  {"id":"cat-am-garden-tools-sprayers","name":"GARDEN TOOLS & SPRAYERS","slug":"garden-tools-sprayers","description":"GARDEN TOOLS & SPRAYERS — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3337_1.jpg"},
  {"id":"cat-am-harvester","name":"HARVESTER","slug":"harvester","description":"HARVESTER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3508_1.jpg"},
  {"id":"cat-am-hedgetrimmer","name":"HEDGETRIMMER","slug":"hedgetrimmer","description":"HEDGETRIMMER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3366_1.jpg"},
  {"id":"cat-am-intercultivator-power-weeder","name":"INTERCULTIVATOR / POWER WEEDER","slug":"intercultivator-power-weeder","description":"INTERCULTIVATOR / POWER WEEDER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3370_1.jpg"},
  {"id":"cat-am-irrigation","name":"IRRIGATION","slug":"irrigation","description":"IRRIGATION — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3018_1.jpg"},
  {"id":"cat-am-lawn-mower","name":"LAWN MOWER","slug":"lawn-mower","description":"LAWN MOWER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3289_1.jpg"},
  {"id":"cat-am-lubricants","name":"LUBRICANTS","slug":"lubricants","description":"LUBRICANTS — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3436_1.jpg"},
  {"id":"cat-am-manual-seeder","name":"MANUAL SEEDER","slug":"manual-seeder","description":"MANUAL SEEDER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3267_1.jpg"},
  {"id":"cat-am-mb-plough","name":"MB PLOUGH","slug":"mb-plough","description":"MB PLOUGH — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/default.jpg"},
  {"id":"cat-am-milking-machine","name":"MILKING MACHINE","slug":"milking-machine","description":"MILKING MACHINE — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/default.jpg"},
  {"id":"cat-am-power-cutter","name":"POWER CUTTER","slug":"power-cutter","description":"POWER CUTTER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_1837_1.jpg"},
  {"id":"cat-am-pressure-washer","name":"PRESSURE WASHER","slug":"pressure-washer","description":"PRESSURE WASHER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_996_1.jpg"},
  {"id":"cat-am-pruner","name":"PRUNER","slug":"pruner","description":"PRUNER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3358_1.jpg"},
  {"id":"cat-am-pumpset","name":"PUMPSET","slug":"pumpset","description":"PUMPSET — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3476_3.jpg"},
  {"id":"cat-am-reaper-harvester","name":"REAPER / HARVESTER","slug":"reaper-harvester","description":"REAPER / HARVESTER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3408_1.jpg"},
  {"id":"cat-am-rotavator","name":"ROTAVATOR","slug":"rotavator","description":"ROTAVATOR — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_2894_1.jpg"},
  {"id":"cat-am-sprayer","name":"SPRAYER","slug":"sprayer","description":"SPRAYER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_1646_2.jpg"},
  {"id":"cat-am-stubble-mower","name":"STUBBLE MOWER","slug":"stubble-mower","description":"STUBBLE MOWER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3550_1.jpg"},
  {"id":"cat-am-thresher","name":"THRESHER","slug":"thresher","description":"THRESHER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3418_1.jpg"},
  {"id":"cat-am-transporter","name":"TRANSPORTER","slug":"transporter","description":"TRANSPORTER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3117_1.jpg"},
  {"id":"cat-am-wood-chipper","name":"WOOD CHIPPER","slug":"wood-chipper","description":"WOOD CHIPPER — genuine power machinery and agricultural equipment from AGRIMATE, KASEI, OLEO MAC and more.","image":"/images/products/agrimart/product_3208_1.jpg"},
];

// Full Agrimart 226 Products Catalogue (Imported from Agrimart-backup)
export const SEED_PRODUCTS: ProductType[] = [
  {
    "id": "am-3018",
    "name": "AM - Deep Drip Irrigation Stakes (1 BOX OF 20 PIECES)",
    "slug": "am-deep-drip-irrigation-stakes-1-box-of-20-pieces-3018",
    "sku": "RIPL028696",
    "riplCode": "RIPL028696",
    "modelNumber": "DDP-Blue 19 inch",
    "category": "Irrigation",
    "categoryId": "cat-am-irrigation",
    "price": 1660,
    "comparePrice": 1660,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 6302,
    "images": [
      "/images/products/agrimart/product_3018_1.jpg"
    ],
    "description": "1 Box of 20 PCS.\nDeep watering for healthy root zone Conserves water upto 50% Helpful during drought - freezing temperature  Saving in Power consumption  Aerates roots & soil",
    "descriptionHtml": "<li><b>1 Box of 20 PCS. </b></li><li><b><br></b></li><li>Deep watering for healthy root zone</li><li>Conserves water upto 50%</li><li>Helpful during drought - freezing temperature </li><li>Saving in Power consumption </li><li>Aerates roots & soil </li>",
    "specifications": {
      "Irrigation": "DDP-Blue 19 inch",
      "RIPL Code": "RIPL028696",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View English",
        "url": "/agrimart-media/brochures/agrimate-deep-drip-irrigation-stakes-blue-ddp-blue-19-inch-ddp-blue-19-inch.pdf",
        "fileName": "agrimate-deep-drip-irrigation-stakes-blue-ddp-blue-19-inch-ddp-blue-19-inch.pdf",
        "available": true
      },
      {
        "label": "View Kannada",
        "url": "/agrimart-media/brochures/agrimate-deep-drip-irrigation-stakes-blue-ddp-blue-19-inch-ddp-blue-19-inch_2.pdf",
        "fileName": "agrimate-deep-drip-irrigation-stakes-blue-ddp-blue-19-inch-ddp-blue-19-inch_2.pdf",
        "available": true
      },
      {
        "label": "View Telugu",
        "url": "/agrimart-media/brochures/agrimate-deep-drip-irrigation-stakes-blue-ddp-blue-19-inch-ddp-blue-19-inch_3.pdf",
        "fileName": "agrimate-deep-drip-irrigation-stakes-blue-ddp-blue-19-inch-ddp-blue-19-inch_3.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3337",
    "name": "AM-22338",
    "slug": "am-22338-3337",
    "sku": "DBT24068",
    "riplCode": "DBT24068",
    "modelNumber": "DBT",
    "category": "Garden Tools",
    "categoryId": "cat-am-garden-tools",
    "price": 1795,
    "comparePrice": 1795,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3337_1.jpg"
    ],
    "description": "",
    "descriptionHtml": "<p><br></p>",
    "specifications": {
      "Garden Tools Model": "DBT",
      "RIPL Code": "DBT24068",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-22338-dbt.pdf",
        "fileName": "am-22338-dbt.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3267",
    "name": "AM-MVS-1P AGRIMATE MANUAL VERTICLE SEEDER",
    "slug": "am-mvs-1p-agrimate-manual-verticle-seeder-3267",
    "sku": "RIPL036747",
    "riplCode": "RIPL036747",
    "modelNumber": "AM-MVS-1P",
    "category": "Manual Seeder",
    "categoryId": "cat-am-manual-seeder",
    "price": 1840,
    "comparePrice": 1840,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 164,
    "images": [
      "/images/products/agrimart/product_3267_1.jpg",
      "/images/products/agrimart/product_3267_2.jpg"
    ],
    "description": "Model:  AM-MVS-1P    Type: Single Pin    Plant Spacing Depth:  3.5-7.8  CM     Number of Rollers: 6",
    "descriptionHtml": "<p>Model: AM-MVS-1P   Type: Single Pin    Plant Spacing Depth: 3.5-7.8 CM    Number of Rollers: 6<br></p>",
    "specifications": {
      "Manual Rotary Seeder": "AM-MVS-1P",
      "RIPL Code": "RIPL036747",
      "Brand": "AGRIMATE",
      "Model": "AM-MVS-1P Type: Single Pin Plant Spacing Depth: 3.5-7.8 CM Number of Rollers: 6"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-mvs-1p-agrimate-manual-verticle-seeder-am-mvs-1p.pdf",
        "fileName": "am-mvs-1p-agrimate-manual-verticle-seeder-am-mvs-1p.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3014",
    "name": "AM - Deep Drip Irrigation Stakes - BIEGE (1 Box of 20 PIECES)",
    "slug": "am-deep-drip-irrigation-stakes-biege-1-box-of-20-pieces-3014",
    "sku": "RIPL028697",
    "riplCode": "RIPL028697",
    "modelNumber": "DDP-Biege 19 inch",
    "category": "Irrigation",
    "categoryId": "cat-am-irrigation",
    "price": 1880,
    "comparePrice": 1880,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 7044,
    "images": [
      "/images/products/agrimart/product_3014_1.jpg"
    ],
    "description": "1 Box of 20 Pieces\n.\nDeep watering for healthy root zone Conserves water upto 50% Helpful during drought - freezing temperature  Saving in Power consumption  Aerates roots & soil",
    "descriptionHtml": "<ul><li></li><li>1 Box of 20 Pieces<br>. <br></li><li><b><br></b></li><li>Deep watering for healthy root zone</li><li>Conserves water upto 50%</li><li>Helpful during drought - freezing temperature </li><li>Saving in Power consumption </li><li>Aerates roots & soil </li></ul>",
    "specifications": {
      "Irrigation": "DDP-Biege 19 inch",
      "RIPL Code": "RIPL028697",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View English",
        "url": "/agrimart-media/brochures/agrimate-deep-drip-irrigation-stakes-biege-ddp-black-19-inch-ddp-biege-19-inch.pdf",
        "fileName": "agrimate-deep-drip-irrigation-stakes-biege-ddp-black-19-inch-ddp-biege-19-inch.pdf",
        "available": true
      },
      {
        "label": "View Kannada",
        "url": "/agrimart-media/brochures/agrimate-deep-drip-irrigation-stakes-biege-ddp-black-19-inch-ddp-biege-19-inch_2.pdf",
        "fileName": "agrimate-deep-drip-irrigation-stakes-biege-ddp-black-19-inch-ddp-biege-19-inch_2.pdf",
        "available": true
      },
      {
        "label": "View Telugu",
        "url": "/agrimart-media/brochures/agrimate-deep-drip-irrigation-stakes-biege-ddp-black-19-inch-ddp-biege-19-inch_3.pdf",
        "fileName": "agrimate-deep-drip-irrigation-stakes-biege-ddp-black-19-inch-ddp-biege-19-inch_3.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3269",
    "name": "AM-MVSF-2P -2IN 1 AGRIMATE Manual Verticle seeder cum Fertilizer",
    "slug": "am-mvsf-2p-2in-1-agrimate-manual-verticle-seeder-cum-fertilizer-3269",
    "sku": "RIPL036748",
    "riplCode": "RIPL036748",
    "modelNumber": "AM-MVSF-2P",
    "category": "Manual Seeder",
    "categoryId": "cat-am-manual-seeder",
    "price": 2040,
    "comparePrice": 2040,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 76,
    "images": [
      "/images/products/agrimart/product_3269_1.jpg",
      "/images/products/agrimart/product_3269_2.jpg"
    ],
    "description": "Model: AM-MVSF-2P-2 IN 1 Type: Double Pin Plant Spacing Depth: 3.5-7.8 CM Number of Rollers: 6",
    "descriptionHtml": "<p><b>Model:</b> AM-MVSF-2P-2 IN 1  <b> Type: </b>Double Pin    <b>Plant Spacing Depth:</b> 3.5-7.8 CM    <b>Number of Rollers: </b>6 <br></p>",
    "specifications": {
      "Manual Rotary Seeder": "AM-MVSF-2P",
      "RIPL Code": "RIPL036748",
      "Brand": "AGRIMATE",
      "Model": "AM-MVSF-2P-2 IN 1",
      "Type": "Double Pin",
      "Plant Spacing Depth": "3.5-7.8 CM",
      "Number of Rollers": "6"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-mvsf-2p-2in-1-agrimate-manual-verticle-seeder-cum-fertilizer-am-mvsf-2p.pdf",
        "fileName": "am-mvsf-2p-2in-1-agrimate-manual-verticle-seeder-cum-fertilizer-am-mvsf-2p.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-1646",
    "name": "AM CHAMPION - 16 LTRS - 12V / 8AH- BATTERY SPRAYER",
    "slug": "am-champion-16-ltrs-12v-8ah-battery-sprayer-1646",
    "sku": "RIPL026669",
    "riplCode": "RIPL026669",
    "modelNumber": "AM CHAMPION",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 2304,
    "comparePrice": 2304,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_1646_2.jpg",
      "/images/products/agrimart/product_1646_3.jpg",
      "/images/products/agrimart/product_1646_4.jpg"
    ],
    "description": "Capacity : 16L     Tank material : PP     Discharge : 7.5L/M     Working pressure  :  Upto 0.55 MPA    Battery : 12V/8AH",
    "descriptionHtml": "<p><b>Capacity</b> : 16L    <b>Tank material</b> : PP    <b>Discharge</b> : 7.5L/M    <b>Working pressure </b>:  Upto 0.55 MPA   <b>Battery</b> : 12V/8AH</p>",
    "specifications": {
      "Sprayer Model": "AM CHAMPION",
      "RIPL Code": "RIPL026669",
      "Brand": "AGRIMATE",
      "Capacity": "16L",
      "Tank material": "PP",
      "Discharge": "7.5L/M",
      "Working pressure": "Upto 0.55 MPA",
      "Battery": "12V/8AH"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/agrimate-battery-sprayer-am-champion-16-ltrs-12v-8ah-am-champion.pdf",
        "fileName": "agrimate-battery-sprayer-am-champion-16-ltrs-12v-8ah-am-champion.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/agrimate-battery-sprayer-am-champion-16-ltrs-12v-8ah-am-champion_2.pdf",
        "fileName": "agrimate-battery-sprayer-am-champion-16-ltrs-12v-8ah-am-champion_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Nozzle kit    2. Battery charger    3. Mask"
  },
  {
    "id": "am-1157",
    "name": "AM-16-CHAMPION-MANUAL SPRAYER",
    "slug": "am-16-champion-manual-sprayer-1157",
    "sku": "RIPL027210",
    "riplCode": "RIPL027210",
    "modelNumber": "AM16",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 2400,
    "comparePrice": 2400,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 96,
    "images": [
      "/images/products/agrimart/product_1157_1.jpg",
      "/images/products/agrimart/product_1157_2.jpg",
      "/images/products/agrimart/product_1157_3.jpg",
      "/images/products/agrimart/product_1157_4.jpg"
    ],
    "description": "Model: AM-16 CHAMPION Tank Capacity: 16Ltr Lance/Piston : SS Telescopic Lance Tank Material: PP Working Pressure: 50PSI Pump Discharge: 1 -1.5LPM",
    "descriptionHtml": "<p><b>Model:</b>AM-16 CHAMPION&nbsp; &nbsp;&nbsp;<b>Tank Capacity: </b>16Ltr&nbsp; &nbsp;<b>Lance/Piston</b>: SS Telescopic Lance&nbsp; &nbsp;&nbsp;<b>Tank Material: </b>PP&nbsp; &nbsp;<b>Working Pressure: </b>50PSI&nbsp; &nbsp;<b>Pump Discharge: </b>1 -1.5LPM</p>",
    "specifications": {
      "Sprayer Model": "AM16",
      "RIPL Code": "RIPL027210",
      "Brand": "AGRIMATE",
      "Model": "AM-16 CHAMPION",
      "Tank Capacity": "16Ltr",
      "Lance/Piston": "SS Telescopic Lance",
      "Tank Material": "PP",
      "Working Pressure": "50PSI",
      "Pump Discharge": "1 -1.5LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-16-champion-manual-sprayer.pdf",
        "fileName": "am-16-champion-manual-sprayer.pdf",
        "available": true
      },
      {
        "label": "View User Manual",
        "url": "/agrimart-media/brochures/agrimate-sprayer-am16-manual-champion-am16_2.pdf",
        "fileName": "agrimate-sprayer-am16-manual-champion-am16_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1157_1.mp4",
        "fileName": "product_1157_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Trigger    2.  4 Nozzles    3. Belt    4.  Delivery Hose  5 . SS Telescopic Lance"
  },
  {
    "id": "am-3295",
    "name": "AM-16-PRO-SS",
    "slug": "am-16-pro-ss-3295",
    "sku": "DBT24061",
    "riplCode": "DBT24061",
    "modelNumber": "DBT",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 2500,
    "comparePrice": 2500,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3295_1.jpg",
      "/images/products/agrimart/product_3295_2.jpg"
    ],
    "description": "Model:  AM 16 PRO SS     Capacity:  16Ltr     Working Pressure:  50 PSI    Lance:  SS Telescopic Lance      Tank Material:  PP  Pump Discharge : 1-1.5LPM",
    "descriptionHtml": "<p>Model: AM 16 PRO SS    Capacity: 16Ltr    Working Pressure: 50 PSI   Lance: SS Telescopic Lance    Tank Material: PP  <b>Pump</b> <b>Discharge</b>: 1-1.5LPM <br></p>",
    "specifications": {
      "Sprayer Model": "DBT",
      "RIPL Code": "DBT24061",
      "Brand": "AGRIMATE",
      "Discharge": "1-1.5LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-16-pro-ss-dbt.pdf",
        "fileName": "am-16-pro-ss-dbt.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Nozzles 2. Trigger 3. Belt 4 . Delivery Hose 5 . SS Telescopic lance"
  },
  {
    "id": "am-1891",
    "name": "AM16-PRO-SS - MANUAL SPRAYER",
    "slug": "am16-pro-ss-manual-sprayer-1891",
    "sku": "RIPL027076",
    "riplCode": "RIPL027076",
    "modelNumber": "AM16 PRO SS",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 2500,
    "comparePrice": 2500,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 7,
    "images": [
      "/images/products/agrimart/product_1891_1.jpg",
      "/images/products/agrimart/product_1891_2.jpg",
      "/images/products/agrimart/product_1891_3.jpg",
      "/images/products/agrimart/product_1891_4.jpg"
    ],
    "description": "Model:  AM 16 PRO SS     Capacity:  16L     Working Pressure:  50 PSI    Lance:  SS telescopic lance    Pump:  Steel pressure pump     Tank Material:  PP   Pump   Discharge : 1-1.5LPM",
    "descriptionHtml": "<p>Model: AM 16 PRO SS    Capacity: 16L    Working Pressure: 50 PSI   Lance: SS telescopic lance   Pump: Steel pressure pump    Tank Material: PP  Pump Discharge: 1-1.5LPM </p>",
    "specifications": {
      "Sprayer Model": "AM16 PRO SS",
      "RIPL Code": "RIPL027076",
      "Brand": "AGRIMATE",
      "Model": "AM 16 PRO SS Capacity: 16L Working Pressure: 50 PSI Lance: SS telescopic lance Pump: Steel pressure pump Tank Material: PP Pump Discharge : 1-1.5LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am16-pro-ss-manual-sprayer.pdf",
        "fileName": "am16-pro-ss-manual-sprayer.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am16-pro-ss-manual-sprayer-pro-ss-am16-pro-ss_2.pdf",
        "fileName": "am16-pro-ss-manual-sprayer-pro-ss-am16-pro-ss_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1891_1.mp4",
        "fileName": "product_1891_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1.  4.Nozzles   2.  Trigger    3.  Belt  4. Mask   5 . Delivery Hose   6 . SS Telescopic lance"
  },
  {
    "id": "am-2460",
    "name": "AM-Deep Drip Irrigation Stakes - Black / DDP (1 BOX OF 20 PIECES)",
    "slug": "am-deep-drip-irrigation-stakes-black-ddp-1-box-of-20-pieces-2460",
    "sku": "RIPL028161",
    "riplCode": "RIPL028161",
    "modelNumber": "DDP - Black 19 inch",
    "category": "Irrigation",
    "categoryId": "cat-am-irrigation",
    "price": 2600,
    "comparePrice": 2600,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 5861,
    "images": [
      "/images/products/agrimart/product_2460_2.jpg",
      "/images/products/agrimart/product_2460_4.jpg",
      "/images/products/agrimart/product_2460_5.jpg"
    ],
    "description": "1 Box of 20 Pieces\nDeep watering for healthy root zone Conserves water upto 50% Helpful during drought - freezing temperature  Saving in Power consumption  Aerates roots & soil",
    "descriptionHtml": "<ul><li><b>1 Box of 20 Pieces</b></li><li><b><br></b></li><li>Deep watering for healthy root zone</li><li>Conserves water upto 50%</li><li>Helpful during drought - freezing temperature </li><li>Saving in Power consumption </li><li>Aerates roots & soil </li></ul>",
    "specifications": {
      "Irrigation": "DDP - Black 19 inch",
      "RIPL Code": "RIPL028161",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View English",
        "url": "/agrimart-media/brochures/agrimate-deep-drip-irrigation-stakes-black-ddp-black-19-inch.pdf",
        "fileName": "agrimate-deep-drip-irrigation-stakes-black-ddp-black-19-inch.pdf",
        "available": true
      },
      {
        "label": "View Kannada",
        "url": "/agrimart-media/brochures/agrimate-deep-drip-irrigation-stakes-black-ddp-black-19-inch_2.pdf",
        "fileName": "agrimate-deep-drip-irrigation-stakes-black-ddp-black-19-inch_2.pdf",
        "available": true
      },
      {
        "label": "View Telugu",
        "url": "/agrimart-media/brochures/agrimate-deep-drip-irrigation-stakes-black-ddp-black-19-inch_3.pdf",
        "fileName": "agrimate-deep-drip-irrigation-stakes-black-ddp-black-19-inch_3.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3446",
    "name": "AM-BSSP-16-MS+ BATTERY SPRAYER",
    "slug": "am-bssp-16-ms-battery-sprayer-3446",
    "sku": "RIPL039000",
    "riplCode": "RIPL039000",
    "modelNumber": "AM-BSSP-16L",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 3780,
    "comparePrice": 3780,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 8,
    "images": [
      "/images/products/agrimart/product_3446_2.jpg"
    ],
    "description": "Model : AM-BSSP-16-MS+     Tank  Capacity : 16/18Ltr      Battery Power : 12V/8AH     Lance /Piston : SS Telescopic lance      Working Pressure : 90PSI     Pump Discharge : 3.6LPM    Tank Material : PP",
    "descriptionHtml": "<p>Model: AM-BSSP-16-MS+    <b>Tank </b>Capacity: 16/18Ltr    <b>Battery Power</b>: 12V/8AH   <b>Lance /Piston</b>: SS Telescopic lance     Working Pressure: 90PSI    Pump Discharge: 3.6LPM   Tank Material: PP </p>",
    "specifications": {
      "Sprayer Model": "AM-BSSP-16L",
      "RIPL Code": "RIPL039000",
      "Brand": "AGRIMATE",
      "Battery Power": "12V/8AH",
      "Lance /Piston": "SS Telescopic lance Working Pressure : 90PSI Pump Discharge : 3.6LPM Tank Material : PP"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-bssp-champion-12v8ah-16ltr-battery-sprayer-am-bssp-16l.pdf",
        "fileName": "am-bssp-champion-12v8ah-16ltr-battery-sprayer-am-bssp-16l.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Trigger    2.  Nozzles    3.  Battery    4.  Belt    5.  Delivery  Hose    6.  SS Telescopic Lance"
  },
  {
    "id": "am-3341",
    "name": "AM-BSSP-16MS+ 2 IN 1 MANUAL CUM BATTERY SPRAYER",
    "slug": "am-bssp-16ms-2-in-1-manual-cum-battery-sprayer-3341",
    "sku": "RIPL039001",
    "riplCode": "RIPL039001",
    "modelNumber": "AM-BSSP-16MS+ 2 IN 1",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 4180,
    "comparePrice": 4180,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3341_1.jpg",
      "/images/products/agrimart/product_3341_2.jpg"
    ],
    "description": "Model : AM-BSSP-16MS+ 2 IN 1    Tank Capacity : 16Ltr  Battery : 12V/8AH   Working Pressure : 90 PSI    Pump Discharge : 3.6LPM    Tank Material : PP    Lance/Piston : SS Telescopic Lance",
    "descriptionHtml": "<p><b>Model</b>: AM-BSSP-16MS+ 2 IN 1   <b>Tank Capacity</b>: 16Ltr  <b>Battery</b>: 12V/8AH  <b>Working Pressure</b>: 90 PSI   <b>Pump Discharge</b>: 3.6LPM   <b>Tank Material</b>: PP   <b>Lance/Piston</b>: SS Telescopic Lance<br></p><p> <o:p></o:p></p>",
    "specifications": {
      "Sprayer Model": "AM-BSSP-16MS+ 2 IN 1",
      "RIPL Code": "RIPL039001",
      "Brand": "AGRIMATE",
      "Model": "AM-BSSP-16MS+ 2 IN 1",
      "Tank Capacity": "16Ltr",
      "Battery": "12V/8AH",
      "Working Pressure": "90 PSI",
      "Pump Discharge": "3.6LPM",
      "Tank Material": "PP",
      "Lance/Piston": "SS Telescopic Lance"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-bssp-16ms-2-in-1-manual-cum-battery-sprayer.pdf",
        "fileName": "am-bssp-16ms-2-in-1-manual-cum-battery-sprayer.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-bssp-16ms-2-in-1-battery-sprayer-single-pump_2.pdf",
        "fileName": "am-bssp-16ms-2-in-1-battery-sprayer-single-pump_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . Trigger    2 . Nozzels    3 . Belt    4 . Charger    5 . Delivery Hose    6 . Lance"
  },
  {
    "id": "am-2112",
    "name": "AM-405E -Elite - Battery Sprayer -18 Ltr Double Pump",
    "slug": "am-405e-elite-battery-sprayer-18-ltr-double-pump-2112",
    "sku": "RIPL028442",
    "riplCode": "RIPL028442",
    "modelNumber": "AM405E",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 5222,
    "comparePrice": 5222,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_2112_1.jpg",
      "/images/products/agrimart/product_2112_2.jpg",
      "/images/products/agrimart/product_2112_3.jpg",
      "/images/products/agrimart/product_2112_4.jpg"
    ],
    "description": "",
    "descriptionHtml": "",
    "specifications": {
      "Sprayer Model": "AM405E",
      "RIPL Code": "RIPL028442",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/agrimate-battery-sprayer-am-405e-elite-18ltr-with-high-presssure-double-pump-12v-12ah-am405e_2.pdf",
        "fileName": "agrimate-battery-sprayer-am-405e-elite-18ltr-with-high-presssure-double-pump-12v-12ah-am405e_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2112_1.mp4",
        "fileName": "product_2112_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3343",
    "name": "AM-BSDP-20MS+ BATTERY SPRAYER WITH DOUBLE PUMP",
    "slug": "am-bsdp-20ms-battery-sprayer-with-double-pump-3343",
    "sku": "RIPL039002",
    "riplCode": "RIPL039002",
    "modelNumber": "AM-BSDP-20MS+",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 5798,
    "comparePrice": 5798,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 22,
    "images": [
      "/images/products/agrimart/product_3343_1.jpg",
      "/images/products/agrimart/product_3343_2.jpg",
      "/images/products/agrimart/product_3343_3.jpg",
      "/images/products/agrimart/product_3343_5.jpg"
    ],
    "description": "Model : AM-BSDP-20MS+    Tank   Capacity :20Ltr    Lance/Piston: SS Telescopic lance         Battery: 12V/14AH    Working Pressure :160PSI    Pump Discharge :7.5LPM    Tank Material : PP",
    "descriptionHtml": "<p><b>Model</b>: AM-BSDP-20MS+   <b>Tank</b> <b>Capacity</b>:20Ltr   <b>Lance/Piston: </b>SS Telescopic lance        <b>Battery:</b>12V/14AH   <b>Working Pressure</b>:160PSI   <b>Pump Discharge</b>:7.5LPM   <b>Tank Material</b>: PP <br></p>",
    "specifications": {
      "Sprayer Model": "AM-BSDP-20MS+",
      "RIPL Code": "RIPL039002",
      "Brand": "AGRIMATE",
      "Model": "AM-BSDP-20MS+",
      "Capacity": "20Ltr",
      "Lance/Piston": "SS Telescopic lance",
      "Battery": "12V/14AH",
      "Working Pressure": "160PSI",
      "Pump Discharge": "7.5LPM",
      "Tank Material": "PP"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-bsdp-20ms-battery-sprayer-with-double-pump.pdf",
        "fileName": "am-bsdp-20ms-battery-sprayer-with-double-pump.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-bsdp-20ms-battery-sprayer-double-pump-am-bsdp-20ms_2.pdf",
        "fileName": "am-bsdp-20ms-battery-sprayer-double-pump-am-bsdp-20ms_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3343_1.mp4",
        "fileName": "product_3343_1.mp4",
        "type": "mp4",
        "available": true
      },
      {
        "url": "/agrimart-media/videos/product_3343_2.mp4",
        "fileName": "product_3343_2.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1 . Trigger    2 . Nozzels    3 . Belt    4 . Charger    5 . Delivery Hose    6 . Lance-2Nos"
  },
  {
    "id": "am-2961",
    "name": "AM-PBS-14AH BATTERY SPRAYER - PORTABLE",
    "slug": "am-pbs-14ah-battery-sprayer-portable-2961",
    "sku": "RIPL026681",
    "riplCode": "RIPL026681",
    "modelNumber": "AM-PBS",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 5980,
    "comparePrice": 5980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 8,
    "images": [
      "/images/products/agrimart/product_2961_1.jpg",
      "/images/products/agrimart/product_2961_2.jpg",
      "/images/products/agrimart/product_2961_3.jpg",
      "/images/products/agrimart/product_2961_4.jpg"
    ],
    "description": "Battery: 12V/ 14AH      Brass Gun: 30 CM    Pump: 7.5ltr     Pressure: 160PSI      Charger: 1.7A",
    "descriptionHtml": "<p><b>Battery: </b>12V/ 14AH   <b>  Brass Gun: </b>30 CM <b>  Pump: </b>7.5ltr    <b>Pressure:</b> 160PSI  <b> </b> <b>Charger:</b> 1.7A </p>",
    "specifications": {
      "Sprayer Model": "AM-PBS",
      "RIPL Code": "RIPL026681",
      "Brand": "AGRIMATE",
      "Battery": "12V/ 14AH",
      "Brass Gun": "30 CM",
      "Pump": "7.5ltr",
      "Pressure": "160PSI",
      "Charger": "1.7A"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual",
        "url": "/agrimart-media/brochures/am-pbs-battery-sprayer-portable-am-pbs_2.pdf",
        "fileName": "am-pbs-battery-sprayer-portable-am-pbs_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2961_1.mp4",
        "fileName": "product_2961_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1 . Suction Hose 3Mtr    2. Delivery Hose 15Mtr    3. Strainer    4. Lance 1feet"
  },
  {
    "id": "am-3492",
    "name": "AM-405E 2 IN 1 MANUAL CUM BATTERY SPRAYER",
    "slug": "am-405e-2-in-1-manual-cum-battery-sprayer-3492",
    "sku": "RIPL037702",
    "riplCode": "RIPL037702",
    "modelNumber": "AM-405E 2 IN 1",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 6000,
    "comparePrice": 6000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 253,
    "images": [
      "/images/products/agrimart/product_3492_1.jpg",
      "/images/products/agrimart/product_3492_2.jpg",
      "/images/products/agrimart/product_3492_3.jpg",
      "/images/products/agrimart/product_3492_4.jpg",
      "/images/products/agrimart/product_3492_5.jpg"
    ],
    "description": "Model:  AM-405E-2 IN 1     TANK Capacity:  16Ltr     Working pressure:  90 PSI    Pump discharge:  3.6LPM     Battery:  12V/12AH    Lance/Piston:  SS Telescopic lance    Tank Material: PP",
    "descriptionHtml": "<p>Model:  AM-405E-2 IN 1    TANK Capacity: 16Ltr    Working pressure: 90 PSI   Pump discharge: 3.6LPM    Battery: 12V/12AH   Lance/Piston: SS Telescopic lance   <b>Tank</b> <b>Material:</b> PP</p>",
    "specifications": {
      "Sprayer Model": "AM-405E 2 IN 1",
      "RIPL Code": "RIPL037702",
      "Brand": "AGRIMATE",
      "Material": "PP"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-405e-2-in-1-am-405e-2-in-1-manual-cum-battery-sprayer.pdf",
        "fileName": "am-405e-2-in-1-am-405e-2-in-1-manual-cum-battery-sprayer.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Charger    2.  Nozzles    3. Belt    4. Trigger   5.  Delivery Hose    6.  SS Telescopic Lance    7 .LED"
  },
  {
    "id": "am-3299",
    "name": "AM-405E-2 IN 1 Batter Sprayer",
    "slug": "am-405e-2-in-1-batter-sprayer-3299",
    "sku": "DBT24063",
    "riplCode": "DBT24063",
    "modelNumber": "DBT",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 6000,
    "comparePrice": 6000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3299_1.jpg",
      "/images/products/agrimart/product_3299_2.jpg",
      "/images/products/agrimart/product_3299_3.jpg",
      "/images/products/agrimart/product_3299_4.jpg",
      "/images/products/agrimart/product_3299_5.jpg"
    ],
    "description": "Model:  AM-405E-2 IN 1     TANK Capacity:  16 Ltr     Working pressure:  90 PSI    Pump discharge:  3.6LPM     Battery:  12V/12AH    Lance/Pistion:  SS Telescopic lance    Tank Material: PP",
    "descriptionHtml": "<p>Model:  AM-405E-2 IN 1    TANK Capacity: 16 Ltr    Working pressure: 90 PSI   Pump discharge: 3.6LPM    Battery: 12V/12AH   Lance/Pistion: SS Telescopic lance   <b>Tank</b> <b>Material:</b> PP<br></p>",
    "specifications": {
      "Sprayer Model": "DBT",
      "RIPL Code": "DBT24063",
      "Brand": "AGRIMATE",
      "Material": "PP"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-405-e-2-in-1-dbt.pdf",
        "fileName": "am-405-e-2-in-1-dbt.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Battery     2.  Nozzles    3. Belt    4. Trigger   5. Delivery Hose    6. SS Telescopic Lance"
  },
  {
    "id": "am-3456",
    "name": "AM-BIG BOSS - BATTERY SPRAYER WITH DOUBLE MOTOR /DOUBLE LANCE",
    "slug": "am-big-boss-battery-sprayer-with-double-motor-double-lance-3456",
    "sku": "RIPL037701",
    "riplCode": "RIPL037701",
    "modelNumber": "AM-Big Boss-14AH",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 6290,
    "comparePrice": 6290,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 1,
    "images": [
      "/images/products/agrimart/product_3456_1.jpg"
    ],
    "description": "Model: AM-Big Boss   Tank Capacity:  20Ltr    Tank Material:  PP  Pump   Discharge:  7.5LPM    Working Pressure : 160 PSI  Battery:  12V/14AH  Lance/Piston:  SS Telescopic Lance",
    "descriptionHtml": "<p>Model: AM-Big Boss   Tank Capacity: 20Ltr   Tank Material: PP  <b>Pump</b> Discharge: 7.5LPM   Working Pressure :160 PSI  Battery: 12V/14AH  <b>Lance/Piston: </b>SS Telescopic Lance </p>",
    "specifications": {
      "Sprayer Model": "AM-Big Boss-14AH",
      "RIPL Code": "RIPL037701",
      "Brand": "AGRIMATE",
      "Lance/Piston": "SS Telescopic Lance"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-big-boss-battery-sprayer-with-double-motor-double-lance.pdf",
        "fileName": "am-big-boss-battery-sprayer-with-double-motor-double-lance.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Delivery Hose   2.  Nozzles   3.  Trigger   4.  Lance-2 Nos.   5.  Battery   6.  Belt   7.  Safety Articles"
  },
  {
    "id": "am-1645",
    "name": "AM-BIG BOSS-14AH BATTERY SPRAYER WITH DOUBLE MOTOR",
    "slug": "am-big-boss-14ah-battery-sprayer-with-double-motor-1645",
    "sku": "RIPL026670",
    "riplCode": "RIPL026670",
    "modelNumber": "AM BIGBOSS",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 6590,
    "comparePrice": 6590,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 911,
    "images": [
      "/images/products/agrimart/product_1645_1.jpg",
      "/images/products/agrimart/product_1645_3.jpg",
      "/images/products/agrimart/product_1645_4.jpg",
      "/images/products/agrimart/product_1645_5.jpg",
      "/images/products/agrimart/product_1645_6.jpg",
      "/images/products/agrimart/product_1645_7.jpg"
    ],
    "description": "Model: AM-BS-20 Big Boss    Tank Capacity: 20Ltr     Lance/ Piston : SS Telescopic Lance     Tank Material: PP     Battery:  12V/14AH     Working Pressure: 160 PSI     Discharge:  7.5LPM",
    "descriptionHtml": "<p><b>Model: </b>AM-BS-20 Big Boss   <b>Tank Capacity:</b> 20Ltr    Lance/ Piston: SS Telescopic Lance    <b>Tank Material:</b> PP    Battery: 12V/14AH    <b>Working Pressure: </b>160 PSI    Discharge: 7.5LPM </p>",
    "specifications": {
      "Sprayer Model": "AM BIGBOSS",
      "RIPL Code": "RIPL026670",
      "Brand": "AGRIMATE",
      "Model": "AM-BS-20 Big Boss",
      "Tank Capacity": "20Ltr Lance/ Piston : SS Telescopic Lance",
      "Tank Material": "PP Battery: 12V/14AH",
      "Working Pressure": "160 PSI Discharge: 7.5LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-bs-20-big-boss-battery-sprayer-with-double-motor.pdf",
        "fileName": "am-bs-20-big-boss-battery-sprayer-with-double-motor.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-bigboss-12v14ah-with-double-motor-agrimate-battery-sprayer_2.pdf",
        "fileName": "am-bigboss-12v14ah-with-double-motor-agrimate-battery-sprayer_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1645_1.mp4",
        "fileName": "product_1645_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1.  Delivery Hose    2. Nozzles    3. Trigger    4. Lance-2Nos    5.  Charger    6.  Belt"
  },
  {
    "id": "am-3506",
    "name": "AM-BS-20-BIG BOSS- HD BATTERY SPRAYER",
    "slug": "am-bs-20-big-boss-hd-battery-sprayer-3506",
    "sku": "RIPL038016",
    "riplCode": "RIPL038016",
    "modelNumber": "AM-BS-20-HD",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 6980,
    "comparePrice": 6980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3506_1.jpg",
      "/images/products/agrimart/product_3506_2.jpg",
      "/images/products/agrimart/product_3506_3.jpg"
    ],
    "description": "Model : AM-BS-20-BIGBOSS-HD    Tank Capacity : 20L     Tank Material : PP       Working Pressure : 160 PSI    Battery : 12V/16AH    Lance/ Piston : SS Lance      Pump Discharge : 8LPM",
    "descriptionHtml": "<p>Model: AM-BS-20-BIGBOSS-HD   Tank Capacity: 20L    Tank Material: PP      Working Pressure: 160 PSI   Battery: 12V/16AH   Lance/ Piston: SS Lance     <b>Pump Discharge</b>: 8LPM</p>",
    "specifications": {
      "Sprayer Model": "AM-BS-20-HD",
      "RIPL Code": "RIPL038016",
      "Brand": "AGRIMATE",
      "Pump Discharge": "8LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-bs-20-big-boss-hd-battery-sprayer-am-bs-20-hd.pdf",
        "fileName": "am-bs-20-big-boss-hd-battery-sprayer-am-bs-20-hd.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Trigger 2. Nozzles 3. Charger 4. Delivery Hose 5 . Lance -2Nos 6 . Belt"
  },
  {
    "id": "am-3570",
    "name": "AM-BSDP-20L-LBT - LITHIUM BATTERY SPRAYER",
    "slug": "am-bsdp-20l-lbt-lithium-battery-sprayer-3570",
    "sku": "RIPL038926",
    "riplCode": "RIPL038926",
    "modelNumber": "AM-BSDP-20L-LBT",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 6980,
    "comparePrice": 6980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3570_1.jpg",
      "/images/products/agrimart/product_3570_2.jpg"
    ],
    "description": "Model:  AM-BSDP-20L-LBT    Tank Capacity: 20 Ltr     Tank material: PP     Battery: 12V/14AH     Working pressure:  UPTO 150PSI    Pump Discharge: 7-9LPM     Lance Piston :  SS Telescopic lance",
    "descriptionHtml": "<p>Model: AM-BSDP-20L-LBT   Tank Capacity: 20Ltr   Tank material: PP    Battery: 12V/14AH    Working pressure: UPTO 150PSI   <b>Pump Discharge:</b> 7-9LPM    <b>Lance Piston</b>: SS Telescopic lance</p>",
    "specifications": {
      "Sprayer Model": "AM-BSDP-20L-LBT",
      "RIPL Code": "RIPL038926",
      "Brand": "AGRIMATE",
      "Pump Discharge": "7-9LPM",
      "Lance Piston": "SS Telescopic lance"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-bsdp-20l-lbt-lithium-battery-sprayer-am-bsdp-20l-lbt.pdf",
        "fileName": "am-bsdp-20l-lbt-lithium-battery-sprayer-am-bsdp-20l-lbt.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Trigger    2. Nozzles    3. Charger    4. Delivery Hose    5 .  Lance 2Nos    6 . Belt"
  },
  {
    "id": "am-3510",
    "name": "AM-22-16-MS+ HTP POWER SPRAYER",
    "slug": "am-22-16-ms-htp-power-sprayer-3510",
    "sku": "RIPL038028",
    "riplCode": "RIPL038028",
    "modelNumber": "AM-22-16- MS+",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 6980,
    "comparePrice": 6980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 400,
    "images": [
      "/images/products/agrimart/product_3510_3.jpg",
      "/images/products/agrimart/product_3510_4.jpg"
    ],
    "description": "Model:  AM-22-16-MS+    Power:  2-3 HP    RPM:  300-1000    Working Pressure:  0-40KG/CM 2",
    "descriptionHtml": "<p><b>Model: </b>AM-22-16-MS+    <b>Power: </b>2-3 HP    <b>RPM: </b>300-1000    <b>Working Pressure: </b>0-40KG/CM<sup>2</sup></p><p><o:p></o:p></p>",
    "specifications": {
      "Sprayer Model": "AM-22-16- MS+",
      "RIPL Code": "RIPL038028",
      "Brand": "AGRIMATE",
      "Model": "AM-22-16-MS+",
      "Power": "2-3 HP",
      "RPM": "300-1000",
      "Working Pressure": "0-40KG/CM 2"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-22-16-ms-htp-power-sprayer-am-22-16-ms.pdf",
        "fileName": "am-22-16-ms-htp-power-sprayer-am-22-16-ms.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-22-16-ms-htp-power-sprayer-am-22-16-ms_2.pdf",
        "fileName": "am-22-16-ms-htp-power-sprayer-am-22-16-ms_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . Overflow 3mtr    2 . Suction Hose 3mtr    3 . Strainer    4 . O-Ring kit"
  },
  {
    "id": "am-3436",
    "name": "OM PROSINT2EVO SYNTHETIC-2T-OIL 1 LTR x 12 CANS =1 BOX",
    "slug": "om-prosint2evo-synthetic-2t-oil-1-ltr-x-12-cans-1-box-3436",
    "sku": "RIPL037653",
    "riplCode": "RIPL037653",
    "modelNumber": "OM-PRO2T- OIL",
    "category": "Lubricants",
    "categoryId": "cat-am-lubricants",
    "price": 8388,
    "comparePrice": 8388,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 170,
    "images": [
      "/images/products/agrimart/product_3436_1.jpg",
      "/images/products/agrimart/product_3436_2.jpg"
    ],
    "description": "*Prosint2EVO-2T-Oil      *Synthetic Lubricant     * Origin Italy Made    * Ideal for 2Stroke Engines.",
    "descriptionHtml": "<p>*Prosint2EVO-2T-Oil      *Synthetic Lubricant     * Origin Italy Made    * Ideal for 2Stroke Engines.</p><p><br></p>",
    "specifications": {
      "Lubricants": "OM-PRO2T- OIL",
      "RIPL Code": "RIPL037653",
      "Brand": "OLEO MAC"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/om-prosint2evo-synthetic-2t-oil-1-ltr-x-12-cans-1-box-om-pro2t-oil.pdf",
        "fileName": "om-prosint2evo-synthetic-2t-oil-1-ltr-x-12-cans-1-box-om-pro2t-oil.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3436_1.mp4",
        "fileName": "product_3436_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3586",
    "name": "AGRIMATE GEAR OIL EP-90 API GL-4-1LTR CAN (BOX OF 20)",
    "slug": "agrimate-gear-oil-ep-90-api-gl-4-1ltr-can-box-of-20-3586",
    "sku": "RIPL039016",
    "riplCode": "RIPL039016",
    "modelNumber": "EP-90 API GL",
    "category": "Lubricants",
    "categoryId": "cat-am-lubricants",
    "price": 8700,
    "comparePrice": 8700,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 9,
    "images": [
      "/images/products/agrimart/product_3586_1.jpg",
      "/images/products/agrimart/product_3586_2.jpg"
    ],
    "description": "No Information Available.",
    "descriptionHtml": "No Information Available.",
    "specifications": {
      "Lubricants": "EP-90 API GL",
      "RIPL Code": "RIPL039016",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3512",
    "name": "AM-30-20-MS+ HTP POWER SPRAYER",
    "slug": "am-30-20-ms-htp-power-sprayer-3512",
    "sku": "RIPL038029",
    "riplCode": "RIPL038029",
    "modelNumber": "AM-30-20-MS+",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 8780,
    "comparePrice": 8780,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 305,
    "images": [
      "/images/products/agrimart/product_3512_3.jpg",
      "/images/products/agrimart/product_3512_4.jpg"
    ],
    "description": "Model: AM-30-20-MS+    Power: 3-5HP    RPM: 800-1200    Working Pressure: 10-40KG/CM2    Discharge: 22-40L/MIN",
    "descriptionHtml": "<p><b>Model:</b> AM-30-20-MS+    <b>Power:</b> 3-5HP <b>   RPM:</b> 800-1200   <b> Working Pressure:</b> 10-40KG/CM2    <b>Discharge: </b>22-40L/MIN</p>",
    "specifications": {
      "Sprayer Model": "AM-30-20-MS+",
      "RIPL Code": "RIPL038029",
      "Brand": "AGRIMATE",
      "Model": "AM-30-20-MS+",
      "Power": "3-5HP",
      "RPM": "800-1200",
      "Working Pressure": "10-40KG/CM2",
      "Discharge": "22-40L/MIN"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-30-20-ms-htp-power-sprayer-am-30-20-ms.pdf",
        "fileName": "am-30-20-ms-htp-power-sprayer-am-30-20-ms.pdf",
        "available": true
      },
      {
        "label": "View user manual cum part list",
        "url": "/agrimart-media/brochures/am-30-20-ms-htp-power-sprayer-am-30-20-ms_2.pdf",
        "fileName": "am-30-20-ms-htp-power-sprayer-am-30-20-ms_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . Overflow 3mtr    2 . Suction Hose 3mtr    3 . Strainer    4 . O-Ring kit"
  },
  {
    "id": "am-3524",
    "name": "AM-CS-6022K-NEO CHAIN SAW - 22 BAR",
    "slug": "am-cs-6022k-neo-chain-saw-22-bar-3524",
    "sku": "RIPL038173",
    "riplCode": "RIPL038173",
    "modelNumber": "AM-CS-6022K-NEO",
    "category": "Chain Saw",
    "categoryId": "cat-am-chain-saw",
    "price": 8980,
    "comparePrice": 8980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 234,
    "images": [
      "/images/products/agrimart/product_3524_1.jpg"
    ],
    "description": "Model : AM-CS-6022K-NEO    Displacement : 60CC    Power : 2.4kw    Fuel Tank   Capacity : 550ml    Guide Bar Size:  22\"    Chain pitch:  0.325",
    "descriptionHtml": "<p>Model: AM-CS-6022K-NEO   Displacement: 60CC   Power: 2.4kw   Fuel Tank Capacity: 550ml   Guide Bar Size: 22\"   Chain pitch: 0.325</p>",
    "specifications": {
      "Chain Saw Model": "AM-CS-6022K-NEO",
      "RIPL Code": "RIPL038173",
      "Brand": "AGRIMATE",
      "Model": "AM-CS-6022K-NEO Displacement : 60CC Power : 2.4kw Fuel Tank Capacity : 550ml Guide Bar Size: 22\" Chain pitch: 0.325"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-cs-6022k-neo-agrimate-chain-saw-22-bar-am-cs-6022k-neo.pdf",
        "fileName": "am-cs-6022k-neo-agrimate-chain-saw-22-bar-am-cs-6022k-neo.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-cs-6022k-neo-agrimate-chain-saw-22-bar-am-cs-6022k-neo_2.pdf",
        "fileName": "am-cs-6022k-neo-agrimate-chain-saw-22-bar-am-cs-6022k-neo_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "ToolKit"
  },
  {
    "id": "am-3582",
    "name": "AGRIMATE SEMI SYNTHETIC-4T ENGINE OIL 20W40 API SN-1LTR CAN (BOX OF 20)",
    "slug": "agrimate-semi-synthetic-4t-engine-oil-20w40-api-sn-1ltr-can-box-of-20-3582",
    "sku": "RIPL039018",
    "riplCode": "RIPL039018",
    "modelNumber": "20W40 API SN",
    "category": "Lubricants",
    "categoryId": "cat-am-lubricants",
    "price": 9000,
    "comparePrice": 9000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 2,
    "images": [
      "/images/products/agrimart/product_3582_1.jpg",
      "/images/products/agrimart/product_3582_2.jpg"
    ],
    "description": "No Information Available.",
    "descriptionHtml": "No Information Available.",
    "specifications": {
      "Lubricants": "20W40 API SN",
      "RIPL Code": "RIPL039018",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3347",
    "name": "AMLS-518-HTP POWER SPRAYER",
    "slug": "amls-518-htp-power-sprayer-3347",
    "sku": "RIPL017992",
    "riplCode": "RIPL017992",
    "modelNumber": "AMLS 518",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 9180,
    "comparePrice": 9180,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 237,
    "images": [
      "/images/products/agrimart/product_3347_1.jpg",
      "/images/products/agrimart/product_3347_2.jpg",
      "/images/products/agrimart/product_3347_3.jpg"
    ],
    "description": "Model: AMLS-518 RPM: 500-900 Flow : 6-10 LPM Working pressure: 20-35 Kg/Cm2 Piston Dia: 18mm Stroke: 16mm Suitable Engine: GX80",
    "descriptionHtml": "<p><b>Model:</b> AMLS-518&nbsp; &nbsp;&nbsp;<b>RPM:</b> 500-900&nbsp; &nbsp;<b>Flow : </b>6-10 LPM&nbsp; &nbsp;&nbsp;<b>Working pressure: </b>20-35 Kg/Cm2&nbsp; &nbsp;&nbsp;<b>&nbsp;Piston Dia: </b>18mm&nbsp; &nbsp;<b>Stroke: </b>16mm&nbsp; &nbsp;<b>Suitable Engine:</b> GX80</p>",
    "specifications": {
      "Sprayer Model": "AMLS 518",
      "RIPL Code": "RIPL017992",
      "Brand": "AGRIMATE",
      "Model": "AMLS-518",
      "RPM": "500-900",
      "Flow": "6-10 LPM",
      "Working pressure": "20-35 Kg/Cm2",
      "Piston Dia": "18mm",
      "Stroke": "16mm",
      "Suitable Engine": "GX80"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/amls-518-htp-power-sprayer.pdf",
        "fileName": "amls-518-htp-power-sprayer.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/amls-518-agrimate-htp-power-sprayer_2.pdf",
        "fileName": "amls-518-agrimate-htp-power-sprayer_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Suction Hose 5mtr 2. Overflow Hose 5mtr 3. Strainer 4. O ring Kit 5. User Manual"
  },
  {
    "id": "am-3263",
    "name": "AM-MRS-12P-PRO MANUAL ROTARY SEEDER",
    "slug": "am-mrs-12p-pro-manual-rotary-seeder-3263",
    "sku": "RIPL036743",
    "riplCode": "RIPL036743",
    "modelNumber": "AM-MRS-12P",
    "category": "Manual Seeder",
    "categoryId": "cat-am-manual-seeder",
    "price": 9560,
    "comparePrice": 9560,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 296,
    "images": [
      "/images/products/agrimart/product_3263_1.jpg"
    ],
    "description": "Model: AM-MRS-12P-PRO     Plant Spacing Range: 15-33 CM     Number of Pins: 12 nos",
    "descriptionHtml": "<p><b>Model:</b> AM-MRS-12P-PRO    <b> Plant Spacing Range: </b>15-33 CM    <b>Number of Pins: </b>12 nos</p>",
    "specifications": {
      "Manual Rotary Seeder": "AM-MRS-12P",
      "RIPL Code": "RIPL036743",
      "Brand": "AGRIMATE",
      "Model": "AM-MRS-12P-PRO",
      "Plant Spacing Range": "15-33 CM",
      "Number of Pins": "12 nos"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-mrs-12p-pro-manual-rotary-seeder-am-mrs-12p_2.pdf",
        "fileName": "am-mrs-12p-pro-manual-rotary-seeder-am-mrs-12p_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3576",
    "name": "OM PROSINT2 EVO SYNTHETIC-2T-OIL 500ML CAN (OIL 500 ML x 24 CANS =1 BOX)",
    "slug": "om-prosint2-evo-synthetic-2t-oil-500ml-can-oil-500-ml-x-24-cans-1-box-3576",
    "sku": "RIPL038941",
    "riplCode": "RIPL038941",
    "modelNumber": "OM-PRO2T- OIL",
    "category": "Lubricants",
    "categoryId": "cat-am-lubricants",
    "price": 9600,
    "comparePrice": 9600,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 54,
    "images": [
      "/images/products/agrimart/product_3576_1.jpg",
      "/images/products/agrimart/product_3576_2.jpg"
    ],
    "description": "*Prosint2EVO-2T-Oil      *Synthetic Lubricant     * Origin Italy Made    * Ideal for 2Stroke Engines.",
    "descriptionHtml": "<p>*Prosint2EVO-2T-Oil      *Synthetic Lubricant     * Origin Italy Made    * Ideal for 2Stroke Engines.</p><p><br></p>",
    "specifications": {
      "Lubricants": "OM-PRO2T- OIL",
      "RIPL Code": "RIPL038941",
      "Brand": "OLEO MAC"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View",
        "url": "/agrimart-media/brochures/om-prosint2-evo-synthetic-2t-oil-500ml-can-om-pro2t-oil.pdf",
        "fileName": "om-prosint2-evo-synthetic-2t-oil-500ml-can-om-pro2t-oil.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3588",
    "name": "AGRIMATE GEAR OIL EP-140 API GL-4-1LTR CAN (BOX OF 20)",
    "slug": "agrimate-gear-oil-ep-140-api-gl-4-1ltr-can-box-of-20-3588",
    "sku": "RIPL039017",
    "riplCode": "RIPL039017",
    "modelNumber": "EP-140 API GL",
    "category": "Lubricants",
    "categoryId": "cat-am-lubricants",
    "price": 9800,
    "comparePrice": 9800,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 24,
    "images": [
      "/images/products/agrimart/product_3588_2.jpg",
      "/images/products/agrimart/product_3588_3.jpg"
    ],
    "description": "No Information Available.",
    "descriptionHtml": "No Information Available.",
    "specifications": {
      "Lubricants": "EP-140 API GL",
      "RIPL Code": "RIPL039017",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3598",
    "name": "AM-170F-GE-212CC-DELITE WITH PULLEY-GASOLINE ENGINE FOR HTP SPRAYERS",
    "slug": "am-170f-ge-212cc-delite-with-pulley-gasoline-engine-for-htp-sprayers-3598",
    "sku": "RIPL039065",
    "riplCode": "RIPL039065",
    "modelNumber": "AM-170F-GE-212CC-DELITE",
    "category": "Engine",
    "categoryId": "cat-am-engine",
    "price": 9980,
    "comparePrice": 9980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 109,
    "images": [
      "/images/products/agrimart/product_3598_1.jpg"
    ],
    "description": "Model:  AM-170F-GE-212CC-DELITE    Fuel Tank Capacity : 3.10Ltr    Max Power: 3600RPM     Displacement: 212CC    Starting System: Recoil Starter",
    "descriptionHtml": "<p>Model: AM-170F-GE-212CC-DELITE   Fuel Tank Capacity: 3.10Ltr   Max Power: 3600RPM    Displacement:212CC   Starting System: Recoil Starter</p>",
    "specifications": {
      "Engines": "AM-170F-GE-212CC-DELITE",
      "RIPL Code": "RIPL039065",
      "Brand": "AGRIMATE",
      "Model": "AM-170F-GE-212CC-DELITE Fuel Tank Capacity : 3.10Ltr Max Power: 3600RPM Displacement: 212CC Starting System: Recoil Starter"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-170f-ge-212cc-delite-with-pulley-gasoline-engine-for-htp-sprayers-am-170f-ge-212cc-delite.pdf",
        "fileName": "am-170f-ge-212cc-delite-with-pulley-gasoline-engine-for-htp-sprayers-am-170f-ge-212cc-delite.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-170f-ge-212cc-delite-with-pulley-gasoline-engine-for-htp-sprayers-am-170f-ge-212cc-delite_2.pdf",
        "fileName": "am-170f-ge-212cc-delite-with-pulley-gasoline-engine-for-htp-sprayers-am-170f-ge-212cc-delite_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3526",
    "name": "AM-2052K-BC-2S-MS+ BRUSH CUTTER",
    "slug": "am-2052k-bc-2s-ms-brush-cutter-3526",
    "sku": "RIPL038175",
    "riplCode": "RIPL038175",
    "modelNumber": "AM-2052K-BC-2S-MS+",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 9980,
    "comparePrice": 9980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3526_1.jpg"
    ],
    "description": "Model: AM-2052K-BC-2S-MS+ Engine Type : 2 Stroke Displacement: 52CC Fuel Tank Capacity: 1.0L",
    "descriptionHtml": "<p><b>Model:&nbsp;</b>AM-2052K-BC-2S-MS+&nbsp; &nbsp; &nbsp;<b>Engine Type</b>: 2 Stroke&nbsp; &nbsp;<b>&nbsp; Displacement:</b>&nbsp;52CC&nbsp; &nbsp; &nbsp;<b>Fuel Tank Capacity: </b>1.0L</p><p><b></b></p><p><br></p>",
    "specifications": {
      "Weed Cutter Model": "AM-2052K-BC-2S-MS+",
      "RIPL Code": "RIPL038175",
      "Brand": "AGRIMATE",
      "Model": "AM-2052K-BC-2S-MS+",
      "Engine Type": "2 Stroke",
      "Displacement": "52CC",
      "Fuel Tank Capacity": "1.0L"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-2052k-bc-2s-ms-brush-cutter-am-2052k-bc-2s-ms.pdf",
        "fileName": "am-2052k-bc-2s-ms-brush-cutter-am-2052k-bc-2s-ms.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-2052k-bc-2s-ms-agrimate-brush-cutter-am-2052k-bc-2s-ms_2.pdf",
        "fileName": "am-2052k-bc-2s-ms-agrimate-brush-cutter-am-2052k-bc-2s-ms_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . Tap & Go    2 . Tool Kit    3 . Harness    4 . 2 Tooth Blade    5 . Oil Can"
  },
  {
    "id": "am-3502",
    "name": "AM-MRS-12PTP-SS-DELITE MANUAL ROTARY SEEDER - SS BODY WITH METAL BUCKLE",
    "slug": "am-mrs-12ptp-ss-delite-manual-rotary-seeder-ss-body-with-metal-buckle-3502",
    "sku": "RIPL038000",
    "riplCode": "RIPL038000",
    "modelNumber": "AM-MRS-12PTP",
    "category": "Manual Seeder",
    "categoryId": "cat-am-manual-seeder",
    "price": 10580,
    "comparePrice": 10580,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 36,
    "images": [
      "/images/products/agrimart/product_3502_1.jpg"
    ],
    "description": "Model: AM-MRS-12PTP-SS-DELITE    Handle: MS Crome plated    Body Material: SS steel    Pins: 12 nos.    Length of teeth: 3 inch    Quality: Premium",
    "descriptionHtml": "<p><b>Model: </b>AM-MRS-12PTP-SS-DELITE    <b>Handle:</b> MS Crome plated    <b>Body Material: </b>SS steel    <b>Pins:</b>12 nos.    <b>Length of teeth:</b>3 inch    <b>Quality:</b> Premium</p>",
    "specifications": {
      "Manual Rotary Seeder": "AM-MRS-12PTP",
      "RIPL Code": "RIPL038000",
      "Brand": "AGRIMATE",
      "Model": "AM-MRS-12PTP-SS-DELITE",
      "Handle": "MS Crome plated",
      "Body Material": "SS steel",
      "Pins": "12 nos.",
      "Length of teeth": "3 inch",
      "Quality": "Premium"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-mrs-12ptp-ss-delite-manual-rotary-seeder-ss-body-with-metal-buckle-am-mrs-12ptp.pdf",
        "fileName": "am-mrs-12ptp-ss-delite-manual-rotary-seeder-ss-body-with-metal-buckle-am-mrs-12ptp.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3500",
    "name": "AM-MRS-12PTP-ELITE MANUAL ROTARY SEEDER WITH METAL BUCKLE",
    "slug": "am-mrs-12ptp-elite-manual-rotary-seeder-with-metal-buckle-3500",
    "sku": "RIPL038001",
    "riplCode": "RIPL038001",
    "modelNumber": "AM-MRS-12PTP",
    "category": "Manual Seeder",
    "categoryId": "cat-am-manual-seeder",
    "price": 10580,
    "comparePrice": 10580,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 454,
    "images": [
      "/images/products/agrimart/product_3500_1.jpg",
      "/images/products/agrimart/product_3500_2.jpg"
    ],
    "description": "Model : AM-MRS-12PTP-Elite    Handle: MS Crome plated    Body Material: Poly carbonate    Pins: 12 nos.    Length of teeth: 3 inch    Quality: Premium",
    "descriptionHtml": "<p><b>Model</b>: AM-MRS-12PTP-Elite    <b>Handle:</b> MS Crome plated    <b>Body Material:</b> Poly carbonate   <b> Pins:</b>12 nos.    <b>Length of teeth:</b>3 inch    <b>Quality: </b>Premium</p>",
    "specifications": {
      "Manual Rotary Seeder": "AM-MRS-12PTP",
      "RIPL Code": "RIPL038001",
      "Brand": "AGRIMATE",
      "Model": "AM-MRS-12PTP-Elite",
      "Handle": "MS Crome plated",
      "Body Material": "Poly carbonate",
      "Pins": "12 nos.",
      "Length of teeth": "3 inch",
      "Quality": "Premium"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-mrs-12ptp-elite-manual-rotary-seeder-with-metal-buckle-am-mrs-12ptp.pdf",
        "fileName": "am-mrs-12ptp-elite-manual-rotary-seeder-with-metal-buckle-am-mrs-12ptp.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3600",
    "name": "OM PROSINT2 EVO SYNTHETIC-2T-OIL 1LTR CAN WITH TWIN MOUTH (1Ltr x 12Cans =1BOX)",
    "slug": "om-prosint2-evo-synthetic-2t-oil-1ltr-can-with-twin-mouth-1ltr-x-12cans-1box-3600",
    "sku": "RIPL039064",
    "riplCode": "RIPL039064",
    "modelNumber": "OM-PRO2T- OIL",
    "category": "Lubricants",
    "categoryId": "cat-am-lubricants",
    "price": 11760,
    "comparePrice": 11760,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 124,
    "images": [
      "/images/products/agrimart/product_3600_1.jpg",
      "/images/products/agrimart/product_3600_2.jpg",
      "/images/products/agrimart/product_3600_3.jpg"
    ],
    "description": "*Prosint2EVO-2T-Oil *Synthetic Lubricant * Origin Italy Made * Ideal for 2Stroke Engines.",
    "descriptionHtml": "<p>*Prosint2EVO-2T-Oil&nbsp; &nbsp; &nbsp; *Synthetic Lubricant&nbsp; &nbsp; &nbsp;* Origin Italy Made&nbsp; &nbsp; * Ideal for 2Stroke Engines.</p>",
    "specifications": {
      "Lubricants": "OM-PRO2T- OIL",
      "RIPL Code": "RIPL039064",
      "Brand": "OLEO MAC"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/om-prosint2-evo-synthetic-2t-oil-1ltr-can-with-twin-mouth-1ltr-x-12cans-1box-om-pro2t-oil.pdf",
        "fileName": "om-prosint2-evo-synthetic-2t-oil-1ltr-can-with-twin-mouth-1ltr-x-12cans-1box-om-pro2t-oil.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3528",
    "name": "AM-4035K-BC-4S-MS+ AGRIMATE BRUSH CUTTER",
    "slug": "am-4035k-bc-4s-ms-agrimate-brush-cutter-3528",
    "sku": "RIPL038174",
    "riplCode": "RIPL038174",
    "modelNumber": "AM-4035K-BC-4S-MS+",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 11980,
    "comparePrice": 11980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 208,
    "images": [
      "/images/products/agrimart/product_3528_1.jpg"
    ],
    "description": "Model:  AM-4035K-BC-4S-MS+      Engine type:  4 Stroke    Power : 9000rpm     Displacement:  35.8cc     Fuel tank capacity:  0.63L",
    "descriptionHtml": "<p><b>Model:</b> AM-4035K-BC-4S-MS+     <b>Engine type:</b> 4 Stroke   <b>Power</b>: 9000rpm    <b>Displacement: </b>35.8cc    <b>Fuel tank capacity: </b>0.63L</p>",
    "specifications": {
      "Weed Cutter Model": "AM-4035K-BC-4S-MS+",
      "RIPL Code": "RIPL038174",
      "Brand": "AGRIMATE",
      "Model": "AM-4035K-BC-4S-MS+",
      "Engine type": "4 Stroke",
      "Power": "9000rpm",
      "Displacement": "35.8cc",
      "Fuel tank capacity": "0.63L"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-4035k-bc-4s-ms-agrimate-brush-cutter-am-4035k-bc-4s-ms.pdf",
        "fileName": "am-4035k-bc-4s-ms-agrimate-brush-cutter-am-4035k-bc-4s-ms.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-4035k-bc-4s-ms-agrimate-brush-cutter-am-4035k-bc-4s-ms_2.pdf",
        "fileName": "am-4035k-bc-4s-ms-agrimate-brush-cutter-am-4035k-bc-4s-ms_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . Tap & Go    2 . Tool Kit    3 . Harness    4 . 2 Tooth Blade    5 . Oil Can"
  },
  {
    "id": "am-3480",
    "name": "AM-170F-GE-212CC GASOLINE ENGINE- MULTIPURPOSE",
    "slug": "am-170f-ge-212cc-gasoline-engine-multipurpose-3480",
    "sku": "RIPL037850",
    "riplCode": "RIPL037850",
    "modelNumber": "AM-170F-GE",
    "category": "Engine",
    "categoryId": "cat-am-engine",
    "price": 11980,
    "comparePrice": 11980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 251,
    "images": [
      "/images/products/agrimart/product_3480_1.jpg",
      "/images/products/agrimart/product_3480_2.jpg"
    ],
    "description": "Model: AM-170F-GE-212CC    Engine Type: Air Cooled/4Stroke    Max Power: 5.2kw/7HP/3600RPM    Displacement: 212CC    Starting System:  Recoil Starter",
    "descriptionHtml": "<p><b>Model:</b>AM-170F-GE-212CC   <b>Engine Type: </b>Air Cooled/4Stroke   <b>Max Power: </b>5.2kw/7HP/3600RPM   <b>Displacement:</b>212CC   <b>Starting System: </b>Recoil Starter </p>",
    "specifications": {
      "Engines": "AM-170F-GE",
      "RIPL Code": "RIPL037850",
      "Brand": "AGRIMATE",
      "Model": "AM-170F-GE-212CC",
      "Engine Type": "Air Cooled/4Stroke",
      "Max Power": "5.2kw/7HP/3600RPM",
      "Displacement": "212CC",
      "Starting System": "Recoil Starter"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-170f-ge-212cc-gasoline-engine-multipurpose-am-170f-ge.pdf",
        "fileName": "am-170f-ge-212cc-gasoline-engine-multipurpose-am-170f-ge.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-1750",
    "name": "CFS-207 ULV COLD FOG SPRAYER - BACKPACK",
    "slug": "cfs-207-ulv-cold-fog-sprayer-backpack-1750",
    "sku": "RIPL027082",
    "riplCode": "RIPL027082",
    "modelNumber": "AM-CFS-207 ULV",
    "category": "Fogger",
    "categoryId": "cat-am-fogger",
    "price": 11980,
    "comparePrice": 11980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 308,
    "images": [
      "/images/products/agrimart/product_1750_1.jpg",
      "/images/products/agrimart/product_1750_2.jpg",
      "/images/products/agrimart/product_1750_3.jpg"
    ],
    "description": "Tank capacity:  20L    Input Power:  110V- 220V    RPM:  7200    Flow rate:  0.3L/Min    Power:  2.2Kw    Droplet size:  5 to 20 microns",
    "descriptionHtml": "<p>Tank capacity: 20L   Input Power: 110V- 220V   RPM: 7200   Flow rate: 0.3L/Min   Power: 2.2Kw   Droplet size: 5 to 20 microns<br></p>",
    "specifications": {
      "Fogger Model": "AM-CFS-207 ULV",
      "RIPL Code": "RIPL027082",
      "Brand": "AGRIMATE",
      "Tank capacity": "20L Input Power: 110V- 220V RPM: 7200 Flow rate: 0.3L/Min Power: 2.2Kw Droplet size: 5 to 20 microns"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual cum Part list",
        "url": "/agrimart-media/brochures/agrimate-grease-pro-pump-for-knapsakportable-sprayers-all-models-am-cfs-207-ulv_2.pdf",
        "fileName": "agrimate-grease-pro-pump-for-knapsakportable-sprayers-all-models-am-cfs-207-ulv_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "Funnel"
  },
  {
    "id": "am-1720",
    "name": "SUPER 2000-GOLD-MINI FOG SPRAYER",
    "slug": "super-2000-gold-mini-fog-sprayer-1720",
    "sku": "RIPL026438",
    "riplCode": "RIPL026438",
    "modelNumber": "2000 GOLD",
    "category": "Fogger",
    "categoryId": "cat-am-fogger",
    "price": 12180,
    "comparePrice": 12180,
    "brand": "SUPER GOLD",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 571,
    "images": [
      "/images/products/agrimart/product_1720_1.jpg",
      "/images/products/agrimart/product_1720_2.jpg",
      "/images/products/agrimart/product_1720_3.jpg"
    ],
    "description": "Tank capacity:  2 Liter     Fuel:  Gas    Displacement : 20 CC    N et weight:  4 KG",
    "descriptionHtml": "<p>Tank capacity: 2 Liter    Fuel: Gas   Displacement: 20 CC   <b>N</b>et weight: 4 KG</p><p><br></p>",
    "specifications": {
      "Fogger Model": "2000 GOLD",
      "RIPL Code": "RIPL026438",
      "Brand": "SUPER GOLD",
      "Tank capacity": "2 Liter Fuel: Gas Displacement : 20 CC N et weight: 4 KG"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/2000-gold-agrimate-mini-fog-super-sprayer_2.pdf",
        "fileName": "2000-gold-agrimate-mini-fog-super-sprayer_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1720_1.mp4",
        "fileName": "product_1720_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Safety kit   2. Mask"
  },
  {
    "id": "am-1901",
    "name": "AMP-555 NEO-2S-AL PORTABLE POWER SPRAYER",
    "slug": "amp-555-neo-2s-al-portable-power-sprayer-1901",
    "sku": "RIPL027358",
    "riplCode": "RIPL027358",
    "modelNumber": "AMP 555 NEO 2S AL",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 12980,
    "comparePrice": 12980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 122,
    "images": [
      "/images/products/agrimart/product_1901_1.jpg",
      "/images/products/agrimart/product_1901_2.jpg",
      "/images/products/agrimart/product_1901_3.jpg"
    ],
    "description": "Engine : AX-25 Power: 7500 RPM Displacement: 25.6CC Working Pressure : 35 KG/CM2 Fuel tank capacity: 0.75 Ltr Flow discharge: 7.4 L/Min",
    "descriptionHtml": "<p>Engine: AX-25&nbsp; &nbsp;Power:&nbsp;7500 RPM&nbsp; &nbsp;Displacement:&nbsp;25.6CC&nbsp; &nbsp;Working Pressure:&nbsp;35 KG/CM2&nbsp; &nbsp;&nbsp;Fuel tank capacity:&nbsp;0.75 Ltr&nbsp; &nbsp;&nbsp;Flow discharge:&nbsp;7.4 L/Min<br></p>",
    "specifications": {
      "Sprayer Model": "AMP 555 NEO 2S AL",
      "RIPL Code": "RIPL027358",
      "Brand": "AGRIMATE",
      "Engine": "AX-25 Power: 7500 RPM Displacement: 25.6CC Working Pressure : 35 KG/CM2 Fuel tank capacity: 0.75 Ltr Flow discharge: 7.4 L/Min"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/amp-555-neo-2s-al-handy-power-sprayer.pdf",
        "fileName": "amp-555-neo-2s-al-handy-power-sprayer.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/amp-555-neo-2s-al-amp-555-neo-2s-al_2.pdf",
        "fileName": "amp-555-neo-2s-al-amp-555-neo-2s-al_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Lance 2. Delivery hose 5 Mtr 3. Suction hose 2.5 Mtr 4. Overflow hose 5. Filter 6. Can 7. Safety kit 8. Tool kit 9. O ring kit"
  },
  {
    "id": "am-3265",
    "name": "AM-MRSF-14P-PRO -2 IN 1 AGRIMATE Manual Rotary Seeder Cum Fertilizer",
    "slug": "am-mrsf-14p-pro-2-in-1-agrimate-manual-rotary-seeder-cum-fertilizer-3265",
    "sku": "RIPL036744",
    "riplCode": "RIPL036744",
    "modelNumber": "AM-MRSF-14P",
    "category": "Manual Seeder",
    "categoryId": "cat-am-manual-seeder",
    "price": 13000,
    "comparePrice": 13000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3265_1.jpg"
    ],
    "description": "Model:  AM-MRSF-14P-PRO-2 IN 1     Plant Spacing Range: 23 -35 CM     Number of Pins:  14 nos",
    "descriptionHtml": "<p>Model: AM-MRSF-14P-PRO-2 IN 1    Plant Spacing Range: 23-35 CM    Number of Pins: 14 nos<br></p>",
    "specifications": {
      "Manual Rotary Seeder": "AM-MRSF-14P",
      "RIPL Code": "RIPL036744",
      "Brand": "AGRIMATE",
      "Model": "AM-MRSF-14P-PRO-2 IN 1 Plant Spacing Range: 23 -35 CM Number of Pins: 14 nos"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-mrsf-14p-pro-2-in-1-agrimate-manual-rotary-seeder-cum-fertilizer_2.pdf",
        "fileName": "am-mrsf-14p-pro-2-in-1-agrimate-manual-rotary-seeder-cum-fertilizer_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-2031",
    "name": "AMLS-522-HTP POWER SPRAYER",
    "slug": "amls-522-htp-power-sprayer-2031",
    "sku": "RIPL017994",
    "riplCode": "RIPL017994",
    "modelNumber": "AMLS-522",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 13141,
    "comparePrice": 13141,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 844,
    "images": [
      "/images/products/agrimart/product_2031_1.jpg",
      "/images/products/agrimart/product_2031_2.jpg",
      "/images/products/agrimart/product_2031_3.jpg"
    ],
    "description": "Model: AMLS-522     Power : 500-900RPM      Flow:  10-15LPM    Working Pressure: 20-35Kgf/Cm2      Piston Dia: 22mm    Stroke : 16mm",
    "descriptionHtml": "<p><b>Model: </b>AMLS-522    Power<b>:</b> 500-900RPM     <b>Flow: </b>10-15LPM   <b>Working Pressure: </b>20-35Kgf/Cm2     <b>Piston Dia:</b> 22mm   <b>Stroke</b>: 16mm</p>",
    "specifications": {
      "Sprayer Model": "AMLS-522",
      "RIPL Code": "RIPL017994",
      "Brand": "AGRIMATE",
      "Model": "AMLS-522 Power",
      "Flow": "10-15LPM",
      "Working Pressure": "20-35Kgf/Cm2",
      "Piston Dia": "22mm",
      "Stroke": "16mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/amls-522-htp-power-sprayer.pdf",
        "fileName": "amls-522-htp-power-sprayer.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/amls-522-agrimate-htp-power-sprayer_2.pdf",
        "fileName": "amls-522-agrimate-htp-power-sprayer_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3522",
    "name": "AM-CS-6022K-PRO AGRIMATE CHAIN SAW - 22 BAR",
    "slug": "am-cs-6022k-pro-agrimate-chain-saw-22-bar-3522",
    "sku": "RIPL038172",
    "riplCode": "RIPL038172",
    "modelNumber": "AM-CS-6022K-PRO",
    "category": "Chain Saw",
    "categoryId": "cat-am-chain-saw",
    "price": 13980,
    "comparePrice": 13980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 462,
    "images": [
      "/images/products/agrimart/product_3522_1.jpg"
    ],
    "description": "Model : AM-CS-6022K-PRO    Displacement : 60CC    Power : 2.4kw    Fuel Tank Capacity : 550ml    Guide Bar Size:  22\"    Chain pitch:  0.325",
    "descriptionHtml": "<p><b>Model</b>: AM-CS-6022K-PRO   <b>Displacement</b>: 60CC   <b>Power</b>: 2.4kw   <b>Fuel Tank</b> <b>Capacity</b>: 550ml   <b>Guide Bar Size:</b> 22\"   <b>Chain pitch:</b> 0.325</p>",
    "specifications": {
      "Chain Saw Model": "AM-CS-6022K-PRO",
      "RIPL Code": "RIPL038172",
      "Brand": "AGRIMATE",
      "Model": "AM-CS-6022K-PRO",
      "Displacement": "60CC",
      "Power": "2.4kw",
      "Capacity": "550ml",
      "Guide Bar Size": "22\"",
      "Chain pitch": "0.325"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-cs-6022k-pro-agrimate-chain-saw-22-bar-am-cs-6022k-pro.pdf",
        "fileName": "am-cs-6022k-pro-agrimate-chain-saw-22-bar-am-cs-6022k-pro.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-cs-6022k-pro-agrimate-chain-saw-22_2.pdf",
        "fileName": "am-cs-6022k-pro-agrimate-chain-saw-22_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "ToolKit"
  },
  {
    "id": "am-1636",
    "name": "AM22-NT-HTP Power Sprayer",
    "slug": "am22-nt-htp-power-sprayer-1636",
    "sku": "RIPL005997",
    "riplCode": "RIPL005997",
    "modelNumber": "AM22 NT",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 14380,
    "comparePrice": 14380,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 456,
    "images": [
      "/images/products/agrimart/product_1636_1.jpg",
      "/images/products/agrimart/product_1636_2.jpg",
      "/images/products/agrimart/product_1636_3.jpg"
    ],
    "description": "Pump Model:  AM 22    Type: HTP PUMP SPRAYER    Power: 1.5-2.0HP    RPM: 300-1000\nWorking Pressure: 20-40KG/CM2    Discharge Volume: 6-18L/M    Suction Capacity: 18L/M",
    "descriptionHtml": "<p><b>Pump Model: </b>AM 22   <b>Type:</b> HTP PUMP SPRAYER   <b>Power:</b> 1.5-2.0HP   <b>RPM:</b> 300-1000<br><b>Working Pressure:</b> 20-40KG/CM2   <b>Discharge Volume:</b> 6-18L/M   <b>Suction Capacity:</b> 18L/M</p>",
    "specifications": {
      "Sprayer Model": "AM22 NT",
      "RIPL Code": "RIPL005997",
      "Brand": "AGRIMATE",
      "Pump Model": "AM 22",
      "Type": "HTP PUMP SPRAYER",
      "Power": "1.5-2.0HP",
      "RPM": "300-1000",
      "Working Pressure": "20-40KG/CM2",
      "Discharge Volume": "6-18L/M",
      "Suction Capacity": "18L/M"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am22-nt-agrimate-htp-sprayer_2.pdf",
        "fileName": "am22-nt-agrimate-htp-sprayer_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Suction hose 5 Mtrs    2. Overflow hose 5 Mtrs    3. Suction strainer    4. Repair kit"
  },
  {
    "id": "am-3153",
    "name": "AM-5300EA 2S MS+ DRILL Agrimate Earth Augur W/O BIT",
    "slug": "am-5300ea-2s-ms-drill-agrimate-earth-augur-w-o-bit-3153",
    "sku": "RIPL036530",
    "riplCode": "RIPL036530",
    "modelNumber": "AM-5300EA MS+",
    "category": "Earth Auger",
    "categoryId": "cat-am-earth-auger",
    "price": 14380,
    "comparePrice": 14380,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3153_1.jpg"
    ],
    "description": "Model: AM-5300EA-MS+    Engine type: Air-cooling 2 Stroke   Engine Power: 1.4Kw/ 6500 RPM/ 52 CC    Carburetor: Diaphragm Type    Fuel tank capacity: 1.0 Ltr   Suitable Bit: 6\"/ 8\"   bit is optional accessory not included in the price.",
    "descriptionHtml": "<p><b>Model:</b> AM-5300EA-MS+   <b>Engine type:</b> Air-cooling 2 Stroke  <b> Engine Power:</b> 1.4Kw/ 6500 RPM/ 52 CC   <b>Carburetor:</b> Diaphragm Type   <b>Fuel tank capacity:</b> 1.0 Ltr  </p><p><b>Suitable Bit:</b> 6\"/ 8\"  bit is optional accessory not included in the price.</p>",
    "specifications": {
      "Earth Auger Model": "AM-5300EA MS+",
      "RIPL Code": "RIPL036530",
      "Brand": "AGRIMATE",
      "Model": "AM-5300EA-MS+",
      "Engine type": "Air-cooling 2 Stroke",
      "Engine Power": "1.4Kw/ 6500 RPM/ 52 CC",
      "Carburetor": "Diaphragm Type",
      "Fuel tank capacity": "1.0 Ltr",
      "Suitable Bit": "6\"/ 8\" bit is optional accessory not included in the price."
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-5300ea-2s-ms-drill-agrimate-earth-augur-wo-bit-am-5300ea-ms.pdf",
        "fileName": "am-5300ea-2s-ms-drill-agrimate-earth-augur-wo-bit-am-5300ea-ms.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-5300ea-2s-ms-drill-agrimate-earth-augur-wo-bit-am-5300ea-ms_2.pdf",
        "fileName": "am-5300ea-2s-ms-drill-agrimate-earth-augur-wo-bit-am-5300ea-ms_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-2590",
    "name": "AM-CS-5922HC-22",
    "slug": "am-cs-5922hc-22-2590",
    "sku": "RIPL029389",
    "riplCode": "RIPL029389",
    "modelNumber": "AM-CS5922 HC",
    "category": "Chain Saw",
    "categoryId": "cat-am-chain-saw",
    "price": 14380,
    "comparePrice": 14380,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 71,
    "images": [
      "/images/products/agrimart/product_2590_1.jpg"
    ],
    "description": "Model: AM-CS-5922HC Power: 2.4 kW Displacement: 59CC Bar Length: 22 \"/55cm Fuel tank capacity: 560ml Chain Pitch: 0.325\"",
    "descriptionHtml": "<p>Model:&nbsp;AM-CS-5922HC&nbsp; &nbsp; &nbsp;Power:&nbsp;2.4 kW&nbsp; &nbsp;Displacement:&nbsp;59CC&nbsp;&nbsp;&nbsp;&nbsp;Bar Length:&nbsp;22 \"/55cm&nbsp; &nbsp;<b>Fuel tank capacity: </b>560ml&nbsp;&nbsp;<b>&nbsp;Chain&nbsp;Pitch:&nbsp;</b>0.325\"<b>&nbsp; &nbsp;</b><br></p>",
    "specifications": {
      "Chain Saw Model": "AM-CS5922 HC",
      "RIPL Code": "RIPL029389",
      "Brand": "AGRIMATE",
      "Fuel tank capacity": "560ml",
      "Chain Pitch": "0.325\""
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-cs-5922hc-22.pdf",
        "fileName": "am-cs-5922hc-22.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am-cs-5922hc-22_2.pdf",
        "fileName": "am-cs-5922hc-22_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2590_1.mp4",
        "fileName": "product_2590_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Mixing Can  2. Std. Tools   3. Safety Kit"
  },
  {
    "id": "am-3584",
    "name": "AGRIMATE SYNTHETIC-4T ENGINE OIL 20W40 API SN-1LTR CAN (BOX OF 20)",
    "slug": "agrimate-synthetic-4t-engine-oil-20w40-api-sn-1ltr-can-box-of-20-3584",
    "sku": "RIPL039019",
    "riplCode": "RIPL039019",
    "modelNumber": "20W40 API SN",
    "category": "Lubricants",
    "categoryId": "cat-am-lubricants",
    "price": 14400,
    "comparePrice": 14400,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 21,
    "images": [
      "/images/products/agrimart/product_3584_1.jpg",
      "/images/products/agrimart/product_3584_3.jpg"
    ],
    "description": "No Information Available.",
    "descriptionHtml": "No Information Available.",
    "specifications": {
      "Lubricants": "20W40 API SN",
      "RIPL Code": "RIPL039019",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3476",
    "name": "AM-WPS-30P-NT WATER PUMPSET W/O SUCTION AND DELIVERY HOSE",
    "slug": "am-wps-30p-nt-water-pumpset-w-o-suction-and-delivery-hose-3476",
    "sku": "RIPL037852",
    "riplCode": "RIPL037852",
    "modelNumber": "AM-WPS-NT",
    "category": "Pumpset",
    "categoryId": "cat-am-pumpset",
    "price": 14780,
    "comparePrice": 14780,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 174,
    "images": [
      "/images/products/agrimart/product_3476_3.jpg",
      "/images/products/agrimart/product_3476_4.jpg"
    ],
    "description": "Model :  AM-WPS-30P-212-NT     Engine:  AM-170-4S     Displacement:  212CC     Power: 3600RPM       Max .  Discharge:  70(m3/H)/15850GPH      Max.Delivery Head:  26Mtr    Max.Suction Head:  7Mtr     Pump- Suction/Delivery:  3” x 3” - Self Priming",
    "descriptionHtml": "<p>Model: AM-WPS-30P-212-NT    Engine: AM-170-4S    Displacement: 212CC    <b>Power: </b>3600RPM     Max. Discharge: 70(m3/H)/15850GPH     Max.Delivery Head: 26Mtr   Max.Suction Head: 7Mtr    <b>Pump- Suction/Delivery:</b> 3” x 3” - Self Priming</p>",
    "specifications": {
      "Water Pumpset": "AM-WPS-NT",
      "RIPL Code": "RIPL037852",
      "Brand": "AGRIMATE",
      "Power": "3600RPM Max . Discharge: 70(m3/H)/15850GPH Max.Delivery Head: 26Mtr Max.Suction Head: 7Mtr",
      "Pump- Suction/Delivery": "3” x 3” - Self Priming"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-wps-30p-nt-water-pumpset-wo-suction-and-delivery-hose-am-wps-nt.pdf",
        "fileName": "am-wps-30p-nt-water-pumpset-wo-suction-and-delivery-hose-am-wps-nt.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-wps-30p-nt-water-pumpset-wo-suction-and-delivery-hose-am-wps-nt_2.pdf",
        "fileName": "am-wps-30p-nt-water-pumpset-wo-suction-and-delivery-hose-am-wps-nt_2.pdf",
        "available": true
      },
      {
        "label": "View Engine User Manual",
        "url": "/agrimart-media/brochures/am-wps-30p-nt-water-pumpset-wo-suction-and-delivery-hose-am-wps-nt_3.pdf",
        "fileName": "am-wps-30p-nt-water-pumpset-wo-suction-and-delivery-hose-am-wps-nt_3.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3476_1.mp4",
        "fileName": "product_3476_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3440",
    "name": "AM-K435S-25TG-4S-PRO-25L Knapsack Power Sprayer- Brass Pump with Standard Accessories",
    "slug": "am-k435s-25tg-4s-pro-25l-knapsack-power-sprayer-brass-pump-with-standard-accessories-3440",
    "sku": "RIPL037675",
    "riplCode": "RIPL037675",
    "modelNumber": "AM-K435S-25TG",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 15380,
    "comparePrice": 15380,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3440_1.jpg",
      "/images/products/agrimart/product_3440_2.jpg"
    ],
    "description": "Model : AM-K435S-25TG    Engine:  AX-35    Engine Type:  4 stroke    Power : 6500 RPM    Displacement :35.8CC    Fuel Tank Capacity :0.75Ltr    Chemical Tank capacity:  25Ltr",
    "descriptionHtml": "<p>Model: AM-K435S-25TG   Engine: AX-35   Engine Type: 4 stroke   Power: 6500 RPM   Displacement:35.8CC   Fuel Tank Capacity:0.75Ltr   Chemical Tank capacity: 25Ltr</p>",
    "specifications": {
      "Sprayer Model": "AM-K435S-25TG",
      "RIPL Code": "RIPL037675",
      "Brand": "AGRIMATE",
      "Model": "AM-K435S-25TG Engine: AX-35 Engine Type: 4 stroke Power : 6500 RPM Displacement :35.8CC Fuel Tank Capacity :0.75Ltr Chemical Tank capacity: 25Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-k435s-25tg-4s-pro-25l-knapsack-power-sprayer-brass-pump-with-standard-accessories-am-k435s-25tg.pdf",
        "fileName": "am-k435s-25tg-4s-pro-25l-knapsack-power-sprayer-brass-pump-with-standard-accessories-am-k435s-25tg.pdf",
        "available": true
      },
      {
        "label": "View User Manual",
        "url": "/agrimart-media/brochures/am-k435s-25tg-4s-pro-25l-knapsack-power-sprayer-brass-pump-with-standard-accessories-am-k435s-25tg_2.pdf",
        "fileName": "am-k435s-25tg-4s-pro-25l-knapsack-power-sprayer-brass-pump-with-standard-accessories-am-k435s-25tg_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3440_1.mp4",
        "fileName": "product_3440_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1.  Hose Pipe    2.  Lance 2 nos    3.  Ball cock  4.  O ring kit    5.  Fuel Can  6.  Mask   7.  Tool Kit"
  },
  {
    "id": "am-1098",
    "name": "AMP-768 PRO-2S HANDY POWER SPRAYER",
    "slug": "amp-768-pro-2s-handy-power-sprayer-1098",
    "sku": "RIPL013023",
    "riplCode": "RIPL013023",
    "modelNumber": "AMP768 PRO",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 15500,
    "comparePrice": 15500,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 231,
    "images": [
      "/images/products/agrimart/product_1098_1.jpg"
    ],
    "description": "Model: AMP-768-2S      Power: 0.73KW/ 7500 RPM     Displacement: 25.6CC     Flow/Discharge: 7.4L/MIN    Fuel tank capacity: 0.60L    Working Pressure: 35 KG/CM2",
    "descriptionHtml": "<p><b>Model: </b>AMP-768-2S <b> </b>   <b>Power: </b>0.73KW/ 7500 RPM    <b>Displacement: </b>25.6CC    <b>Flow/Discharge: </b>7.4L/MIN   <b> Fuel tank capacity: </b>0.60L   <b>Working Pressure:</b> 35 KG/CM2</p>",
    "specifications": {
      "Sprayer Model": "AMP768 PRO",
      "RIPL Code": "RIPL013023",
      "Brand": "AGRIMATE",
      "Model": "AMP-768-2S",
      "Power": "0.73KW/ 7500 RPM",
      "Displacement": "25.6CC",
      "Flow/Discharge": "7.4L/MIN",
      "Fuel tank capacity": "0.60L",
      "Working Pressure": "35 KG/CM2"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/amp-768-pro-2s-handy-power-sprayer.pdf",
        "fileName": "amp-768-pro-2s-handy-power-sprayer.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Parts List",
        "url": "/agrimart-media/brochures/agrimate-power-sprayer-amp768-pro-portable-st-gun-wgc-nf-amp768-pro_2.pdf",
        "fileName": "agrimate-power-sprayer-amp768-pro-portable-st-gun-wgc-nf-amp768-pro_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1098_1.mp4",
        "fileName": "product_1098_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1.  Delivery Hose 5mtr     2.  Suction Hose 2.5mtr    3.  Lance   4.  Can     5.  Filter    6.  Overflow hose    7.  Safety kit      8.  O Ring Kit      9.  Tool kit"
  },
  {
    "id": "am-3594",
    "name": "AM-WP-15-152-NT GASOLINE WATER PUMPSET",
    "slug": "am-wp-15-152-nt-gasoline-water-pumpset-3594",
    "sku": "RIPL039066",
    "riplCode": "RIPL039066",
    "modelNumber": "AM-WP-15-152-NT",
    "category": "Pumpset",
    "categoryId": "cat-am-pumpset",
    "price": 15780,
    "comparePrice": 15780,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 46,
    "images": [
      "/images/products/agrimart/product_3594_1.jpg"
    ],
    "description": "Model : AM-WP-15-152-NT     Lift : 15 mtr     Inlet/Outlet Diameter : 40mm(1.5”)     Suction : 7mtr    Max. Discharge capacity : 15(m³/h)   Fuel tank capacity : 1.3L",
    "descriptionHtml": "<p><b>Model</b>: AM-WP-15-152-NT    <b>Lift</b>: 15 mtr    <b>Inlet/Outlet Diameter</b>: 40mm(1.5”)    <b>Suction</b>: 7mtr   <b>Max. Discharge capacity</b>: 15(m³/h)  <b> Fuel tank capacity</b>: 1.3L</p>",
    "specifications": {
      "Water Pumpset": "AM-WP-15-152-NT",
      "RIPL Code": "RIPL039066",
      "Brand": "AGRIMATE",
      "Model": "AM-WP-15-152-NT",
      "Lift": "15 mtr",
      "Inlet/Outlet Diameter": "40mm(1.5”)",
      "Suction": "7mtr",
      "Max. Discharge capacity": "15(m³/h)",
      "Fuel tank capacity": "1.3L"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-wp-15-152-nt-gasoline-water-pumpset-am-wp-15-152-nt.pdf",
        "fileName": "am-wp-15-152-nt-gasoline-water-pumpset-am-wp-15-152-nt.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-wp-15-152-nt-gasoline-water-pumpset-am-wp-15-152-nt_2.pdf",
        "fileName": "am-wp-15-152-nt-gasoline-water-pumpset-am-wp-15-152-nt_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3516",
    "name": "AM-K139F-4S-PRO KNAPSACK POWER SPRAYER",
    "slug": "am-k139f-4s-pro-knapsack-power-sprayer-3516",
    "sku": "RIPL038018",
    "riplCode": "RIPL038018",
    "modelNumber": "AM-K139F-4S-PRO",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 15780,
    "comparePrice": 15780,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3516_1.jpg"
    ],
    "description": "Model:  AM-K139F-4S-PRO    Engine:  AM-K139F    Engine Type:  4Stroke    Power:  1HP/3600RPM    Displacement:  31 CC    Working pressure:  3.5MPA    Flow Discharge:  7.4L/Min    Chemical Tank Capacity:  20Ltr",
    "descriptionHtml": "Model: AM-K139F-4S-PRO   Engine: AM-K139F   Engine Type: 4Stroke   Power: 1HP/3600RPM   Displacement: 31 CC   Working pressure: 3.5MPA   Flow Discharge: 7.4L/Min   Chemical Tank Capacity: 20Ltr",
    "specifications": {
      "Sprayer Model": "AM-K139F-4S-PRO",
      "RIPL Code": "RIPL038018",
      "Brand": "AGRIMATE",
      "Model": "AM-K139F-4S-PRO Engine: AM-K139F Engine Type: 4Stroke Power: 1HP/3600RPM Displacement: 31 CC Working pressure: 3.5MPA Flow Discharge: 7.4L/Min Chemical Tank Capacity: 20Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-k139f-4s-pro-knapsack-power-sprayer-am-k139f-4s-pro.pdf",
        "fileName": "am-k139f-4s-pro-knapsack-power-sprayer-am-k139f-4s-pro.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . Hose Pipe    2 . Lance\n3 . Ball Cock    4 . O Ring kit    5 .\nTool Kit    6 . Fuel Can    7 . Mask"
  },
  {
    "id": "am-3131",
    "name": "AM708-2S-AL-MS+ 20L KNAPSACK POWER SPRAYER",
    "slug": "am708-2s-al-ms-20l-knapsack-power-sprayer-3131",
    "sku": "RIPL036461",
    "riplCode": "RIPL036461",
    "modelNumber": "AM708-2S-MS+",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 15980,
    "comparePrice": 15980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 52,
    "images": [
      "/images/products/agrimart/product_3131_1.jpg",
      "/images/products/agrimart/product_3131_2.jpg",
      "/images/products/agrimart/product_3131_3.jpg"
    ],
    "description": "Model: AM-708-2S-MS+      Power: 7500RPM    Displacement: 25.6 CC    Working Pressure:  35KG/  CM 2      Flow Discharge:  7.4L/ Min    Chemical Tank Capacity: 20 Ltr         Fuel tank capacity: 0.8 Ltr",
    "descriptionHtml": "<p><b>Model: </b>AM-708-2S-MS+ <b> </b> Power: 7500RPM   <b>Displacement: </b>25.6 CC   Working Pressure: 35KG/ CM<sup>2</sup> <b>  </b>Flow Discharge: 7.4L/ Min   <b>Chemical Tank Capacity:</b> 20 Ltr        <b>Fuel tank capacity: </b>0.8 Ltr  </p><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"189\"><tbody><tr height=\"25\">\r\n  <td height=\"25\" width=\"189\"><br></td></tr></tbody></table>",
    "specifications": {
      "Sprayer Model": "AM708-2S-MS+",
      "RIPL Code": "RIPL036461",
      "Brand": "AGRIMATE",
      "Model": "AM-708-2S-MS+",
      "Displacement": "25.6 CC Working Pressure: 35KG/ CM 2",
      "Chemical Tank Capacity": "20 Ltr",
      "Fuel tank capacity": "0.8 Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am708-2s-al-ms-20l-knapsack-power-sprayer.pdf",
        "fileName": "am708-2s-al-ms-20l-knapsack-power-sprayer.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am708-2s-ms-agrimate-knapsack-power-sprayer-am708-2s-ms_2.pdf",
        "fileName": "am708-2s-ms-agrimate-knapsack-power-sprayer-am708-2s-ms_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3131_1.mp4",
        "fileName": "product_3131_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1.  Hose Pipe    2.  Lance     3.  Ball cock    4.  O ring kit    5.  Fuel Can    6.  Mask    7.  Tool Kit"
  },
  {
    "id": "am-3297",
    "name": "AM-708-2S KNAPSACK POWER SPRAYER",
    "slug": "am-708-2s-knapsack-power-sprayer-3297",
    "sku": "DBT24062",
    "riplCode": "DBT24062",
    "modelNumber": "DBT",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 15980,
    "comparePrice": 15980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3297_2.jpg"
    ],
    "description": "Model:  AM-708-2S       Power:  7000RPM    Displacement:  25.6CC    Working Pressure:  35KG/ CM 2     Discharge:  7.4L/Min    Chemical tank Capacity:  20Ltr    Fuel tank Capacity: 0.8Ltr",
    "descriptionHtml": "<p>Model: AM-708-2S     Power: 7000RPM   Displacement: 25.6CC   Working Pressure: 35KG/CM<sup>2    </sup>Discharge: 7.4L/Min   Chemical tank Capacity: 20Ltr   Fuel tank Capacity:0.8Ltr    </p>",
    "specifications": {
      "Sprayer Model": "DBT",
      "RIPL Code": "DBT24062",
      "Brand": "AGRIMATE",
      "Model": "AM-708-2S Power: 7000RPM Displacement: 25.6CC Working Pressure: 35KG/ CM 2 Discharge: 7.4L/Min Chemical tank Capacity: 20Ltr Fuel tank Capacity: 0.8Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-708-2s-knapsack-power-sprayer-dbt.pdf",
        "fileName": "am-708-2s-knapsack-power-sprayer-dbt.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Hose Pipe    2.  Lance    3.  Ball cock    4.  O ring kit    5.  Fuel Can    6.  Mask    7.  Tool Kit"
  },
  {
    "id": "am-3360",
    "name": "AM-708-2S NEO-KNAPSACK POWER SPRAYER",
    "slug": "am-708-2s-neo-knapsack-power-sprayer-3360",
    "sku": "RIPL022916",
    "riplCode": "RIPL022916",
    "modelNumber": "AM - 708 - Neo-2S",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 15980,
    "comparePrice": 15980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 2,
    "images": [
      "/images/products/agrimart/product_3360_1.jpg"
    ],
    "description": "Model:  AM-708-NEO-2S       Power:  7500RPM    Displacement:  25.6CC\nWorking Pressure:  35KG/CM 2    Discharge:  7.4L/Min\nChemical tank Capacity:  20Ltr    Fuel tank Capacity:  0.8Ltr",
    "descriptionHtml": "<p><b>Model: </b>AM-708-NEO-2S     <b>Power: </b>7500RPM  <b> Displacement: </b>25.6CC \r\n <b>Working Pressure: </b>35KG/CM<sup>2   </sup><b>Discharge: </b>7.4L/Min \r\n <b>Chemical tank Capacity: </b>20Ltr   <b>Fuel tank Capacity: </b>0.8Ltr﻿</p>",
    "specifications": {
      "Sprayer Model": "AM - 708 - Neo-2S",
      "RIPL Code": "RIPL022916",
      "Brand": "AGRIMATE",
      "Model": "AM-708-NEO-2S",
      "Power": "7500RPM",
      "Displacement": "25.6CC",
      "Working Pressure": "35KG/CM 2",
      "Discharge": "7.4L/Min",
      "Chemical tank Capacity": "20Ltr",
      "Fuel tank Capacity": "0.8Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-708-2s-neo-knapsack-power-sprayer.pdf",
        "fileName": "am-708-2s-neo-knapsack-power-sprayer.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am708-neo-2s-knapsack-agrimate-power-sprayer-am-708-neo-2s_2.pdf",
        "fileName": "am708-neo-2s-knapsack-agrimate-power-sprayer-am-708-neo-2s_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3360_1.mp4",
        "fileName": "product_3360_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Hose Pipe    2. Lance    3. Ball cock     4. O ring kit     5. Fuel Can     6. Mask     7. Tool Kit"
  },
  {
    "id": "am-996",
    "name": "FIVE STAR- HIGH PRESSURE WASHER",
    "slug": "five-star-high-pressure-washer-996",
    "sku": "RIPL005854",
    "riplCode": "RIPL005854",
    "modelNumber": "FIVE STAR",
    "category": "Pressure Washer",
    "categoryId": "cat-am-pressure-washer",
    "price": 15980,
    "comparePrice": 15980,
    "brand": "FIVE STAR",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 185,
    "images": [
      "/images/products/agrimart/product_996_1.jpg",
      "/images/products/agrimart/product_996_2.jpg",
      "/images/products/agrimart/product_996_3.jpg",
      "/images/products/agrimart/product_996_4.jpg"
    ],
    "description": "Motor Capacity:  1500W/AC Motor with 6 meter cable     Power Supply Voltage:  230V-50Hz    Max. Water Temperature:  50C    Delivery Hose: 8  mtr\nWorking Pressure :  9MPA(90Bar)    Working Flow Rate :  6 L/MIN    Max. Pressure Water Supply :  0.4MPA(4Bar)  Weight: 8 KG",
    "descriptionHtml": "<div><b>Motor Capacity: </b>1500W/AC Motor with 6 meter cable    <b>Power Supply Voltage: </b>230V-50Hz   <b>Max. Water Temperature:</b> 50C   <b>Delivery Hose: 8 </b>mtr<br>Working Pressure: 9MPA(90Bar)   Working Flow Rate: 6 L/MIN   Max. Pressure Water Supply: 0.4MPA(4Bar)  <b>Weight: </b>8 KG <br>",
    "specifications": {
      "Pressure Washer Model": "FIVE STAR",
      "RIPL Code": "RIPL005854",
      "Brand": "FIVE STAR",
      "Motor Capacity": "1500W/AC Motor with 6 meter cable",
      "Power Supply Voltage": "230V-50Hz",
      "Max. Water Temperature": "50C",
      "Delivery Hose": "8 mtr Working Pressure : 9MPA(90Bar) Working Flow Rate : 6 L/MIN Max. Pressure Water Supply : 0.4MPA(4Bar)",
      "Weight": "8 KG"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/agrimate-five-star-high-pressure-washer-five-star.pdf",
        "fileName": "agrimate-five-star-high-pressure-washer-five-star.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/agrimate-five-star-high-pressure-washer-five-star_2.pdf",
        "fileName": "agrimate-five-star-high-pressure-washer-five-star_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Connecting hose 8 M    2. Hose connectors   3. Spray gun   4. Shampoo bottle"
  },
  {
    "id": "am-3566",
    "name": "KZ-5918CS-PRO-2S CHAIN SAW",
    "slug": "kz-5918cs-pro-2s-chain-saw-3566",
    "sku": "RIPL036291",
    "riplCode": "RIPL036291",
    "modelNumber": "KZ-5918 CS-PRO",
    "category": "Chain Saw",
    "categoryId": "cat-am-chain-saw",
    "price": 15980,
    "comparePrice": 15980,
    "brand": "KASEI",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 17,
    "images": [
      "/images/products/agrimart/product_3566_1.jpg"
    ],
    "description": "Displacement: 54.5 CC      Power: 2.5KW/\n9000 RPM    Tank Capacity: 540ML    Oil Tank\nCapacity: 280ML   Guide Plate Length: 20\nInch    Chain Size: 0.325 Inch    Weight: 6.2\nKG",
    "descriptionHtml": "<p><b>Displacement: </b>54.5 CC     <b>Power:</b> 2.5KW/\r\n9000 RPM   <b>Tank Capacity:</b> 540ML   <b>Oil Tank\r\nCapacity:</b> 280ML  <b>Guide Plate</b> <b>Length:</b> 20\r\nInch   <b>Chain Size: </b>0.325 Inch   <b>Weight: </b>6.2\r\nKG<o:p></o:p></p>",
    "specifications": {
      "Chain Saw Model": "KZ-5918 CS-PRO",
      "RIPL Code": "RIPL036291",
      "Brand": "KASEI",
      "Displacement": "54.5 CC",
      "Power": "2.5KW/ 9000 RPM",
      "Tank Capacity": "540ML",
      "Oil Tank Capacity": "280ML",
      "Length": "20 Inch",
      "Chain Size": "0.325 Inch",
      "Weight": "6.2 KG"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/kz-5918cs-pro-2s-chain-saw-kz-5918cs-pro.pdf",
        "fileName": "kz-5918cs-pro-2s-chain-saw-kz-5918cs-pro.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/kz-5918-cs-pro-2s-wc-20-kz-5918-cs-pro_2.pdf",
        "fileName": "kz-5918-cs-pro-2s-wc-20-kz-5918-cs-pro_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3111",
    "name": "AM-400-BCH-4S-MS+ CROP HARVESTER",
    "slug": "am-400-bch-4s-ms-crop-harvester-3111",
    "sku": "RIPL036440",
    "riplCode": "RIPL036440",
    "modelNumber": "AM-400-BCH-4S-MS+",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 15980,
    "comparePrice": 15980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 560,
    "images": [
      "/images/products/agrimart/product_3111_1.jpg",
      "/images/products/agrimart/product_3111_2.jpg"
    ],
    "description": "Model: AM-400-BCH-4S-MS+    Engine Type: 4 Stroke    Displacement: 35.8 CC    Power:  6500 RPM",
    "descriptionHtml": "<p><b>Model: </b>AM-400-BCH-4S-MS+    <b>Engine Type: </b>4 Stroke    <b>Displacement: </b>35.8 CC    <b>Power: </b>6500 RPM </p>",
    "specifications": {
      "Weed Cutter Model": "AM-400-BCH-4S-MS+",
      "RIPL Code": "RIPL036440",
      "Brand": "AGRIMATE",
      "Model": "AM-400-BCH-4S-MS+",
      "Engine Type": "4 Stroke",
      "Displacement": "35.8 CC",
      "Power": "6500 RPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-400-bch-4s-ms-crop-harvester.pdf",
        "fileName": "am-400-bch-4s-ms-crop-harvester.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-400-bch-4s-ms-agrimate-crop-harvester-am-400-bch-4s-ms_2.pdf",
        "fileName": "am-400-bch-4s-ms-agrimate-crop-harvester-am-400-bch-4s-ms_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3111_1.mp4",
        "fileName": "product_3111_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Tap & go     2. 2 Tooth Blade     3. Circular Blade       4. Tool Kit     5. Harness"
  },
  {
    "id": "am-3474",
    "name": "AM-WPS-20P-212-NT WATER PUMPSET W/O SUCTION AND DELIVERY HOSE",
    "slug": "am-wps-20p-212-nt-water-pumpset-w-o-suction-and-delivery-hose-3474",
    "sku": "RIPL037851",
    "riplCode": "RIPL037851",
    "modelNumber": "AM-WPS-NT",
    "category": "Pumpset",
    "categoryId": "cat-am-pumpset",
    "price": 15980,
    "comparePrice": 15980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 47,
    "images": [
      "/images/products/agrimart/product_3474_2.jpg",
      "/images/products/agrimart/product_3474_3.jpg"
    ],
    "description": "Model:  AM-WPS-20P-212-NT    Engine:   AM-170-4S     Power:  3600RPM      Displacement : 212CC    Max . Discharge:  36(m3/H)     Max.Delivery Head:  26 Mtr   Max.Suction Head: 7Mtr    Pump-Suction/Delivery:  2”x2”-Self Priming",
    "descriptionHtml": "<p>Model: AM-WPS-20P-212-NT   Engine: AM-170-4S   Power: 3600RPM     <b>Displacement</b>: 212CC   <b>Max</b>. <b>Discharge: </b>36(m3/H)    <b>Max.Delivery Head: </b>26 Mtr  <b>Max.Suction Head: </b>7Mtr   <b>Pump-Suction/Delivery: </b>2”x2”-Self Priming</p>",
    "specifications": {
      "Water Pumpset": "AM-WPS-NT",
      "RIPL Code": "RIPL037851",
      "Brand": "AGRIMATE",
      "Displacement": "212CC Max . Discharge: 36(m3/H) Max.Delivery Head: 26 Mtr Max.Suction Head: 7Mtr",
      "Pump-Suction/Delivery": "2”x2”-Self Priming"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-wps-20p-nt-water-pumpset-wo-suction-and-delivery-hose-am-wps-nt.pdf",
        "fileName": "am-wps-20p-nt-water-pumpset-wo-suction-and-delivery-hose-am-wps-nt.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-wps-20p-nt-water-pumpset-wo-suction-and-delivery-hose-am-wps-nt_2.pdf",
        "fileName": "am-wps-20p-nt-water-pumpset-wo-suction-and-delivery-hose-am-wps-nt_2.pdf",
        "available": true
      },
      {
        "label": "View Engine User Manual",
        "url": "/agrimart-media/brochures/am-wps-20p-212-nt-water-pumpset-wo-suction-and-delivery-hose-am-wps-nt_3.pdf",
        "fileName": "am-wps-20p-212-nt-water-pumpset-wo-suction-and-delivery-hose-am-wps-nt_3.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3474_1.mp4",
        "fileName": "product_3474_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-2600",
    "name": "AM-243-2S-BC-NEO AGRIMATE WEED CUTTER",
    "slug": "am-243-2s-bc-neo-agrimate-weed-cutter-2600",
    "sku": "RIPL029392",
    "riplCode": "RIPL029392",
    "modelNumber": "AM 243 BC Neo",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 15990,
    "comparePrice": 15990,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_2600_1.jpg"
    ],
    "description": "Model:  AM 243 BC-NEO    Engine Type: 2 Stroke, Air-cooling    Displacement: 43 CC   Engine Power: 1.6 kW/ 1.6 HP/ 7000 RPM    Fuel Tank Capacity:  1.1 Ltr    Drive Shaft:  8mm    Tube size:  28mm    Diaphragm type:  Ruxing",
    "descriptionHtml": "<p><b>Model:</b> AM 243 BC-NEO   <b>Engine Type:</b> 2 Stroke, Air-cooling   <b>Displacement:</b> 43 CC  <b>Engine Power:</b> 1.6 kW/ 1.6 HP/ 7000 RPM   <b>Fuel Tank Capacity: </b> 1.1 Ltr   Drive Shaft: 8mm   Tube size: 28mm   Diaphragm type: Ruxing</p>",
    "specifications": {
      "Weed Cutter Model": "AM 243 BC Neo",
      "RIPL Code": "RIPL029392",
      "Brand": "AGRIMATE",
      "Model": "AM 243 BC-NEO",
      "Engine Type": "2 Stroke, Air-cooling",
      "Displacement": "43 CC",
      "Engine Power": "1.6 kW/ 1.6 HP/ 7000 RPM",
      "Fuel Tank Capacity": "1.1 Ltr Drive Shaft: 8mm Tube size: 28mm Diaphragm type: Ruxing"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/agrimate-243-brush-cutter-2-stroke-neo-am-243-bc-neo_2.pdf",
        "fileName": "agrimate-243-brush-cutter-2-stroke-neo-am-243-bc-neo_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Two tooth blade    2. Tap - n - Go    3. Std. Tools"
  },
  {
    "id": "am-3468",
    "name": "AM-4035HC-BPH-4S-PRO CROP HARVESTER / BRUSH CUTTER-BACKPACK",
    "slug": "am-4035hc-bph-4s-pro-crop-harvester-brush-cutter-backpack-3468",
    "sku": "RIPL037804",
    "riplCode": "RIPL037804",
    "modelNumber": "AM-4035HC-BPH-4S-PRO",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 16580,
    "comparePrice": 16580,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3468_1.jpg",
      "/images/products/agrimart/product_3468_2.jpg"
    ],
    "description": "Model:  AM-4035HC-BPH-4S PRO     Engine Type: GX-35/4Stroke      Power:  1kw/1.3HP    RPM:   7000RPM     Displacement:  35CC     Fuel Tank Capacity: 0.63Ltr",
    "descriptionHtml": "<p>Model: AM-4035HC-BPH-4S PRO    Engine Type: GX-35/4Stroke    Power: 1kw/1.3HP <b>   RPM:</b> 7000RPM    Displacement: 35CC    Fuel Tank Capacity: 0.63Ltr</p>",
    "specifications": {
      "Weed Cutter Model": "AM-4035HC-BPH-4S-PRO",
      "RIPL Code": "RIPL037804",
      "Brand": "AGRIMATE",
      "RPM": "7000RPM Displacement: 35CC Fuel Tank Capacity: 0.63Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-4035hc-bph-4s-pro-crop-harvester-brush-cutter-backpack-am-4035hc-bph-4s-pro.pdf",
        "fileName": "am-4035hc-bph-4s-pro-crop-harvester-brush-cutter-backpack-am-4035hc-bph-4s-pro.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-4035hc-bph-4s-pro-crop-harvester-brush-cutter-backpack-am-4035hc-bph-4s-pro_2.pdf",
        "fileName": "am-4035hc-bph-4s-pro-crop-harvester-brush-cutter-backpack-am-4035hc-bph-4s-pro_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . Tap & Go      2 . 2-Teeth Blade   3 . 80-Tooth Blade      4 .Reaper Attachment   5 .  Tools Kit    6 . Safety Articles"
  },
  {
    "id": "am-3149",
    "name": "AM-WP-20FX- WATER PUMP SET",
    "slug": "am-wp-20fx-water-pump-set-3149",
    "sku": "RIPL036539",
    "riplCode": "RIPL036539",
    "modelNumber": "AM-WP-20FX",
    "category": "Pumpset",
    "categoryId": "cat-am-pumpset",
    "price": 16580,
    "comparePrice": 16580,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 78,
    "images": [
      "/images/products/agrimart/product_3149_1.jpg"
    ],
    "description": "Model: AM-WP-20FX Engine: 168F-2 Power: 3600 RPM Max Head: 26Mtr Max. Discharge: 30(M 3 /H) Suction: 7Mtr",
    "descriptionHtml": "<p><b>Model: </b>AM-WP-20FX&nbsp;<b>&nbsp; &nbsp;Engine: </b>168F-2&nbsp; &nbsp;&nbsp;<b>Power: </b>3600 RPM&nbsp; &nbsp;<b>Max Head:</b> 26Mtr&nbsp; &nbsp; <b>Max.&nbsp;Discharge:</b> 30(M<sup>3</sup>/H)&nbsp;<b>&nbsp; &nbsp;Suction: </b>7Mtr&nbsp; &nbsp;<b>&nbsp;</b></p>",
    "specifications": {
      "Water Pumpset": "AM-WP-20FX",
      "RIPL Code": "RIPL036539",
      "Brand": "AGRIMATE",
      "Model": "AM-WP-20FX",
      "Engine": "168F-2",
      "Power": "3600 RPM",
      "Max Head": "26Mtr",
      "Max. Discharge": "30(M 3 /H)",
      "Suction": "7Mtr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-wp-20fx-water-pump-set-am-wp-20fx.pdf",
        "fileName": "am-wp-20fx-water-pump-set-am-wp-20fx.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-wp-20fx-agrimate-water-pump-set-am-wp-20fx_2.pdf",
        "fileName": "am-wp-20fx-agrimate-water-pump-set-am-wp-20fx_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-1106",
    "name": "AMP-139F-4S HANDY POWER SPRAYER",
    "slug": "amp-139f-4s-handy-power-sprayer-1106",
    "sku": "RIPL038947",
    "riplCode": "RIPL038947",
    "modelNumber": "AM-P139F-4S",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 16980,
    "comparePrice": 16980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_1106_1.jpg",
      "/images/products/agrimart/product_1106_2.jpg",
      "/images/products/agrimart/product_1106_3.jpg"
    ],
    "description": "Engine : AX-139F-4 stroke    Power:  6500 RPM    Displacement:  31 CC     Working Pressure : 25 KG/CM2     Fuel tank capacity:  0.65 Ltr   Engine Oil Capacity: 80Ml    Flow discharge:  7.4 LPM",
    "descriptionHtml": "<p>Engine: AX-139F-4 stroke   Power: 6500 RPM   Displacement: 31 CC    Working Pressure: 25 KG/CM2    Fuel tank capacity: 0.65 Ltr  <b> Engine Oil Capacity:</b> 80Ml   Flow discharge: 7.4 LPM<br></p>",
    "specifications": {
      "Sprayer Model": "AM-P139F-4S",
      "RIPL Code": "RIPL038947",
      "Brand": "AGRIMATE",
      "Engine Oil Capacity": "80Ml Flow discharge: 7.4 LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/amp-139f-4s-handy-power-sprayer.pdf",
        "fileName": "amp-139f-4s-handy-power-sprayer.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/agrimate-power-sprayer-am-p139f-4s-portable-am-p139f-4s_2.pdf",
        "fileName": "agrimate-power-sprayer-am-p139f-4s-portable-am-p139f-4s_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1106_1.mp4",
        "fileName": "product_1106_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1.  Lance    2.  Suction hose 2.5 Mtr    3 .   Overflow hose 4 .  Filter    5 .  Can    6 .   Safety kit   7 .   O ring kit    8 . Delivery Hose -15Mtrs"
  },
  {
    "id": "am-1644",
    "name": "AM30 AUTO-HTP Power Sprayer",
    "slug": "am30-auto-htp-power-sprayer-1644",
    "sku": "RIPL025675",
    "riplCode": "RIPL025675",
    "modelNumber": "AM30 AUTO",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 17180,
    "comparePrice": 17180,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 114,
    "images": [
      "/images/products/agrimart/product_1644_1.jpg",
      "/images/products/agrimart/product_1644_2.jpg",
      "/images/products/agrimart/product_1644_3.jpg"
    ],
    "description": "Plunger length: 140mm    Spraying pressure:  20-40 Kg    Suction volume : 20-42L/Min    Speed : 500-1200rpm     Mating power : 4.5- 5HP",
    "descriptionHtml": "<p><b>Plunger length:</b> 140mm   <b>Spraying pressure:</b> 20-40 Kg   <b>Suction volume</b>: 20-42L/Min   <b>Speed</b>: 500-1200rpm    <b>Mating power</b>: 4.5- 5HP</p>",
    "specifications": {
      "Sprayer Model": "AM30 AUTO",
      "RIPL Code": "RIPL025675",
      "Brand": "AGRIMATE",
      "Plunger length": "140mm",
      "Spraying pressure": "20-40 Kg",
      "Suction volume": "20-42L/Min",
      "Speed": "500-1200rpm",
      "Mating power": "4.5- 5HP"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/agrimate-htp-power-sprayer-am30-auto-9.pdf",
        "fileName": "agrimate-htp-power-sprayer-am30-auto-9.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/agrimate-htp-power-sprayer-am30-auto-9_2.pdf",
        "fileName": "agrimate-htp-power-sprayer-am30-auto-9_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Suction hose 5 Mtrs    2. Overflow hose 5 Mtrs   3. Suction strainer\n4. Standard tools    5. Repair kit"
  },
  {
    "id": "am-3009",
    "name": "AM-22FSK-NEW HTP POWER SPRAYER",
    "slug": "am-22fsk-new-htp-power-sprayer-3009",
    "sku": "RIPL035627",
    "riplCode": "RIPL035627",
    "modelNumber": "AM-22FSK",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 17380,
    "comparePrice": 17380,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 95,
    "images": [
      "/images/products/agrimart/product_3009_1.jpg",
      "/images/products/agrimart/product_3009_2.jpg"
    ],
    "description": "Pressure: 21-40Kg/CM2     RPM: 800-1200     Capacity:  14-22 Ltr    Power: 1.5-2.2HP",
    "descriptionHtml": "<p><b>Pressure:</b> 21-40Kg/CM2 <b>   RPM: </b>800-1200    <b>Capacity: </b>14-22 Ltr<b>   Power: </b>1.5-2.2HP<br></p>",
    "specifications": {
      "Sprayer Model": "AM-22FSK",
      "RIPL Code": "RIPL035627",
      "Brand": "AGRIMATE",
      "Pressure": "21-40Kg/CM2",
      "RPM": "800-1200",
      "Capacity": "14-22 Ltr",
      "Power": "1.5-2.2HP"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am-22fsk-htp-power-sprayer-with-std-accessories-am-22fsk_2.pdf",
        "fileName": "am-22fsk-htp-power-sprayer-with-std-accessories-am-22fsk_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . 4.5m Suction hose     2. Overflow hose     3. Engine V pulley 1No    4. 8.5mm*50Mtr delivery hose 2Nos     5. Engine V belt 2Nos"
  },
  {
    "id": "am-1923",
    "name": "AMLS-530-HTP POWER SPARYER",
    "slug": "amls-530-htp-power-sparyer-1923",
    "sku": "RIPL016265",
    "riplCode": "RIPL016265",
    "modelNumber": "AMLS530",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 17840,
    "comparePrice": 17840,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_1923_1.jpg",
      "/images/products/agrimart/product_1923_2.jpg",
      "/images/products/agrimart/product_1923_3.jpg",
      "/images/products/agrimart/product_1923_4.jpg"
    ],
    "description": "Model: AMLS-530     Speed: 500-900 RPM    Flow: 17-38LPM     Working pressure: 20-35kg/cm2       Piston Dia: 30mm   Suitable Engine: GX160    Stroke : 20mm",
    "descriptionHtml": "<p><b>Model: </b>AMLS-530<b>    Speed: </b>500-900 RPM <b>   Flow: </b>17-38LPM<b>    Working pressure:</b> 20-35kg/cm2<b>   </b><b>  Piston Dia:</b> 30mm <b>  Suitable Engine:</b> GX160    <b>Stroke</b>: 20mm</p>",
    "specifications": {
      "Sprayer Model": "AMLS530",
      "RIPL Code": "RIPL016265",
      "Brand": "AGRIMATE",
      "Model": "AMLS-530",
      "Speed": "500-900 RPM",
      "Flow": "17-38LPM",
      "Working pressure": "20-35kg/cm2",
      "Piston Dia": "30mm",
      "Suitable Engine": "GX160",
      "Stroke": "20mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/amls-530-htp-power-sparyer.pdf",
        "fileName": "amls-530-htp-power-sparyer.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/amls-530-agrimate-htp-power-sprayer_2.pdf",
        "fileName": "amls-530-agrimate-htp-power-sprayer_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Suction hose 5mtr 2. Overflow hose 5mtr 3. Strainer 4. O Ring kit"
  },
  {
    "id": "am-1653",
    "name": "TR91E-OM WEED CUTTER/ POWER WEEDER (WITHOUT CABLE) ELECTRIC",
    "slug": "tr91e-om-weed-cutter-power-weeder-without-cable-electric-1653",
    "sku": "RIPL010163",
    "riplCode": "RIPL010163",
    "modelNumber": "TR91E",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 17980,
    "comparePrice": 17980,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 3,
    "images": [
      "/images/products/agrimart/product_1653_1.jpg",
      "/images/products/agrimart/product_1653_2.jpg"
    ],
    "description": "Model: TR91 w/o Cable    Power : 2.1 HP  -1.6 kw     Displacement : 40.2 Cm3      Grip : Single    Weight : 9.5 kg",
    "descriptionHtml": "<p><b>Model: </b>TR91 w/o Cable <b>   Power : </b>2.1 HP -1.6 kw    <b>Displacement : </b>40.2 Cm3     <b>Grip : </b>Single   <b>Weight </b>: 9.5 kg</p>",
    "specifications": {
      "Weed Cutter Model": "TR91E",
      "RIPL Code": "RIPL010163",
      "Brand": "OLEO MAC",
      "Model": "TR91 w/o Cable",
      "Power": "2.1 HP -1.6 kw",
      "Displacement": "40.2 Cm3",
      "Grip": "Single",
      "Weight": "9.5 kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/tr91e-om-weed-cutter-power-weeder-without-cable-electric.pdf",
        "fileName": "tr91e-om-weed-cutter-power-weeder-without-cable-electric.pdf",
        "available": true
      },
      {
        "label": "View Manual Cum Part List",
        "url": "/agrimart-media/brochures/om-weed-cutterpower-weeder-tr91ewithout-cable-tr91e_2.pdf",
        "fileName": "om-weed-cutterpower-weeder-tr91ewithout-cable-tr91e_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Tap n Go 2. Tool kit 3 . Harness"
  },
  {
    "id": "am-3564",
    "name": "AM-K435HC-4S-PRO KNAPSACK POWER SPRAYER",
    "slug": "am-k435hc-4s-pro-knapsack-power-sprayer-3564",
    "sku": "RIPL038162",
    "riplCode": "RIPL038162",
    "modelNumber": "AM-K435HC-4S-PRO",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 17980,
    "comparePrice": 17980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3564_1.jpg"
    ],
    "description": "Model: AM-K435HC-4S-PRO     Power: 1 kw/1.3 HP     Displacement:  35 CC     Working Pressure:  25-30 kg/cm2     Flow/discharge:  8L/min     Chemical Tank Capacity:  20 Ltr    Fuel Tank Capacity:  0.55 Ltr",
    "descriptionHtml": "<p><b>Model:</b>AM-K435HC-4S-PRO    <b>Power: </b>1 kw/1.3 HP   <b> Displacement:</b> 35 CC    <b>Working Pressure:</b> 25-30 kg/cm2    <b>Flow/discharge: </b>8L/min    <b>Chemical Tank Capacity: </b>20 Ltr    Fuel <b>Tank Capacity: </b>0.55 Ltr</p>",
    "specifications": {
      "Sprayer Model": "AM-K435HC-4S-PRO",
      "RIPL Code": "RIPL038162",
      "Brand": "AGRIMATE",
      "Model": "AM-K435HC-4S-PRO",
      "Power": "1 kw/1.3 HP",
      "Displacement": "35 CC",
      "Working Pressure": "25-30 kg/cm2",
      "Flow/discharge": "8L/min",
      "Chemical Tank Capacity": "20 Ltr Fuel",
      "Tank Capacity": "0.55 Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-k435hc-4s-pro-knapsack-power-sprayer-am-k435hc-4s-pro.pdf",
        "fileName": "am-k435hc-4s-pro-knapsack-power-sprayer-am-k435hc-4s-pro.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Hose pipe    2. Lance    3. Ball cock    4. O Ring Kit    5. Tool Kit    6. Fuel Can    7. Mask"
  },
  {
    "id": "am-3090",
    "name": "AM-3000 BC-2S-WC-PRO BRUSH CUTTER",
    "slug": "am-3000-bc-2s-wc-pro-brush-cutter-3090",
    "sku": "RIPL036418",
    "riplCode": "RIPL036418",
    "modelNumber": "AM-3000-BC-2S-PRO",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 17980,
    "comparePrice": 17980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 237,
    "images": [
      "/images/products/agrimart/product_3090_1.jpg",
      "/images/products/agrimart/product_3090_2.jpg"
    ],
    "description": "Model: AM-3000-BC-2S-WC-PRO      Displacement: 26CC     Power: 7200RPM    Carburetor: Diaphragm     Fuel tank Capacity: 0.65Ltr     Tube size: 26mm    Shaft Diameter: 8mm",
    "descriptionHtml": "<p><b>Model:</b> AM-3000-BC-2S-WC-PRO     <b>Displacement: </b>26CC    <b>Power: </b>7200RPM   <b>Carburetor:</b> Diaphragm    <b>Fuel tank Capacity: </b>0.65Ltr    <b>Tube size:</b> 26mm   <b>Shaft Diameter:</b> 8mm </p>",
    "specifications": {
      "Weed Cutter Model": "AM-3000-BC-2S-PRO",
      "RIPL Code": "RIPL036418",
      "Brand": "AGRIMATE",
      "Model": "AM-3000-BC-2S-WC-PRO",
      "Displacement": "26CC",
      "Power": "7200RPM",
      "Carburetor": "Diaphragm",
      "Fuel tank Capacity": "0.65Ltr",
      "Tube size": "26mm",
      "Shaft Diameter": "8mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-3000-bc-2s-wc-pro-brush-cutter.pdf",
        "fileName": "am-3000-bc-2s-wc-pro-brush-cutter.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-3000-bc-2s-wc-pro-brush-cutter_2.pdf",
        "fileName": "am-3000-bc-2s-wc-pro-brush-cutter_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Tap & Go     2.   2 Tooth Blade     3. Tool Kit    4 . Safety Articles"
  },
  {
    "id": "am-1757",
    "name": "AM-K425HC-4S-PRO-KNAPSACK POWER SPRAYER",
    "slug": "am-k425hc-4s-pro-knapsack-power-sprayer-1757",
    "sku": "RIPL034710",
    "riplCode": "RIPL034710",
    "modelNumber": "AM-K425HC- 4S",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 17980,
    "comparePrice": 17980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 136,
    "images": [
      "/images/products/agrimart/product_1757_1.jpg"
    ],
    "description": "Model: AM-K425HC-4S-PRO    Engine: AX-25    Type:  4 Stroke        Power: 1 HP/ 0.72KW/7000RPM       Displacement: 25CC        Working Pressure:  25KG/CM2      Flow/Discharge:   7.4L/min    Chemical Tank Capacity: 20 Ltr     Fuel tank capacity: 0.55 Ltr    Pump: Aluminum",
    "descriptionHtml": "<p><b>﻿Model: </b>AM-K425HC-4S-PRO<b>  </b><b>Engine: </b>AX-25<b>   Type: </b>4 Stroke      <b>Power: </b>1 HP/0.72KW/7000RPM  <b>   </b><b>Displacement: </b>25CC<b> </b>    <b>Working Pressure: </b>25KG/CM2    <b>Flow/Discharge:  </b>7.4L/min   <b>Chemical Tank Capacity:</b> 20 Ltr    <b>Fuel tank capacity:</b> 0.55 Ltr   <b>Pump: </b>Aluminum </p>",
    "specifications": {
      "Sprayer Model": "AM-K425HC- 4S",
      "RIPL Code": "RIPL034710",
      "Brand": "AGRIMATE",
      "Model": "AM-K425HC-4S-PRO",
      "Engine": "AX-25",
      "Type": "4 Stroke",
      "Power": "1 HP/ 0.72KW/7000RPM",
      "Displacement": "25CC",
      "Working Pressure": "25KG/CM2",
      "Flow/Discharge": "7.4L/min",
      "Chemical Tank Capacity": "20 Ltr",
      "Fuel tank capacity": "0.55 Ltr",
      "Pump": "Aluminum"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-k425hc-4s-pro-knapsack-power-sprayer.pdf",
        "fileName": "am-k425hc-4s-pro-knapsack-power-sprayer.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-k425hc-4s-agrimate-power-sprayer-kanpsack-am-k425hc-4s_2.pdf",
        "fileName": "am-k425hc-4s-agrimate-power-sprayer-kanpsack-am-k425hc-4s_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1757_1.mp4",
        "fileName": "product_1757_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Hose Pipe    2 . Lance 2 No.   3. Ball cock    4. O Ring kit    5. Tool Kit    6 . Safety kit"
  },
  {
    "id": "am-1637",
    "name": "AM30-HTP Power Sprayer",
    "slug": "am30-htp-power-sprayer-1637",
    "sku": "RIPL006000",
    "riplCode": "RIPL006000",
    "modelNumber": "AM30",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 19500,
    "comparePrice": 19500,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 282,
    "images": [
      "/images/products/agrimart/product_1637_1.jpg",
      "/images/products/agrimart/product_1637_2.jpg",
      "/images/products/agrimart/product_1637_3.jpg"
    ],
    "description": "Type : HTP PUMP SPRAYER    POWER :  3.0-5.0HP    RPM : 300-800    Working Pressure :  20-50KG/CM2     Discharge Volume :  34 L/Min",
    "descriptionHtml": "<p><b>Type :</b> HTP PUMP SPRAYER   <b>POWER : </b>3.0-5.0HP   <b>RPM :</b> 300-800   <b>Working Pressure : </b>20-50KG/CM2    <b>Discharge Volume : </b>34 L/Min</p>",
    "specifications": {
      "Sprayer Model": "AM30",
      "RIPL Code": "RIPL006000",
      "Brand": "AGRIMATE",
      "Type": "HTP PUMP SPRAYER",
      "POWER": "3.0-5.0HP",
      "RPM": "300-800",
      "Working Pressure": "20-50KG/CM2",
      "Discharge Volume": "34 L/Min"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am30-agrimate-htp-sprayer_2.pdf",
        "fileName": "am30-agrimate-htp-sprayer_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Suction hose 4 Mtr    2. Overflow hose 4 Mtr    3. Suction strainer    4. O ring Kit"
  },
  {
    "id": "am-2005",
    "name": "AM-CFS-4000 COLD FOG SPAYER HAND HELD",
    "slug": "am-cfs-4000-cold-fog-spayer-hand-held-2005",
    "sku": "RIPL028025",
    "riplCode": "RIPL028025",
    "modelNumber": "AM CFS 4000",
    "category": "Fogger",
    "categoryId": "cat-am-fogger",
    "price": 19600,
    "comparePrice": 19600,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 79,
    "images": [
      "/images/products/agrimart/product_2005_1.jpg",
      "/images/products/agrimart/product_2005_2.jpg",
      "/images/products/agrimart/product_2005_3.jpg"
    ],
    "description": "Model: AM CFS - 4000    Capacity: 4L    Voltage : 110V    N.W / G.W: 3Kg / 3.86 Kg",
    "descriptionHtml": "<p><b>Model:</b> AM CFS - 4000    <b>Capacity:</b> 4L    <b>Voltage :</b> 110V    <b>N.W / G.W: </b>3Kg / 3.86 Kg</p>",
    "specifications": {
      "Fogger Model": "AM CFS 4000",
      "RIPL Code": "RIPL028025",
      "Brand": "AGRIMATE",
      "Model": "AM CFS - 4000",
      "Capacity": "4L",
      "Voltage": "110V",
      "N.W / G.W": "3Kg / 3.86 Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am-cfs-4000-am-cfs-4000_2.pdf",
        "fileName": "am-cfs-4000-am-cfs-4000_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2005_1.mp4",
        "fileName": "product_2005_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "Funnel"
  },
  {
    "id": "am-3007",
    "name": "AM-30FSK-HTP POWER SPRAYER",
    "slug": "am-30fsk-htp-power-sprayer-3007",
    "sku": "RIPL035626",
    "riplCode": "RIPL035626",
    "modelNumber": "AM-30FSK",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 19780,
    "comparePrice": 19780,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 33,
    "images": [
      "/images/products/agrimart/product_3007_1.jpg",
      "/images/products/agrimart/product_3007_2.jpg"
    ],
    "description": "Pressure: 21-40Kg/CM2     RPM: 800-1200    Capacity: 30-45 Ltr  Power: 2.5-3 HP",
    "descriptionHtml": "<p><b>Pressure:</b> 21-40Kg/CM2   <b> RPM:</b> 800-1200   <b>Capacity: </b>30-45 Ltr <b> Power: </b>2.5-3 HP<br></p>",
    "specifications": {
      "Sprayer Model": "AM-30FSK",
      "RIPL Code": "RIPL035626",
      "Brand": "AGRIMATE",
      "Pressure": "21-40Kg/CM2",
      "RPM": "800-1200",
      "Capacity": "30-45 Ltr",
      "Power": "2.5-3 HP"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am-30fsk-htp-agrimate-power-sprayer-with-std-accessories-am-30fsk_2.pdf",
        "fileName": "am-30fsk-htp-agrimate-power-sprayer-with-std-accessories-am-30fsk_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. 4.5m Suction hose     2. 4.5m Overflow hose     3. Engine V pulley 1No    4. 8.5mm*50Mtr delivery hose 2Nos  5.  Engine V belt 2Nos"
  },
  {
    "id": "am-3592",
    "name": "AM-WP-5065-212-NT GASOLINE WATER PUMP WITH CAST IRON PUMP",
    "slug": "am-wp-5065-212-nt-gasoline-water-pump-with-cast-iron-pump-3592",
    "sku": "RIPL039067",
    "riplCode": "RIPL039067",
    "modelNumber": "AM-WP-5065-212-NT",
    "category": "Pumpset",
    "categoryId": "cat-am-pumpset",
    "price": 19980,
    "comparePrice": 19980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 84,
    "images": [
      "/images/products/agrimart/product_3592_1.jpg"
    ],
    "description": "Model:  AM-WP-5065-212-NT     Power : 3600 RPM    Displacement: 212CC       Max. head: 3 5 Mtr      Pump Suction/Delivery : 2½\" x 2\"    Max. Discharge: 42 ( M 3 /HR)     Suction: 8  Mtr",
    "descriptionHtml": "<p>Model: AM-WP-5065-212-NT    Power: 3600 RPM   Displacement: 212CC    Max. head: 35 Mtr    <b>Pump Suction/Delivery</b>: 2½\" x 2\"   Max. Discharge: 42(M3/HR)    Suction: 8 Mtr  </p>",
    "specifications": {
      "Water Pumpset": "AM-WP-5065-212-NT",
      "RIPL Code": "RIPL039067",
      "Brand": "AGRIMATE",
      "Pump Suction/Delivery": "2½\" x 2\" Max. Discharge: 42 ( M 3 /HR) Suction: 8 Mtr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-wp-5065-212-nt-gasoline-water-pump-with-cast-iron-pump-am-wp-5065-212-nt.pdf",
        "fileName": "am-wp-5065-212-nt-gasoline-water-pump-with-cast-iron-pump-am-wp-5065-212-nt.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-wp-5065-212-nt-gasoline-water-pump-with-cast-iron-pump-am-wp-5065-212-nt_2.pdf",
        "fileName": "am-wp-5065-212-nt-gasoline-water-pump-with-cast-iron-pump-am-wp-5065-212-nt_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-382",
    "name": "KZ-5200 BC -PRO 2S - KASEI BRUSH CUTTER",
    "slug": "kz-5200-bc-pro-2s-kasei-brush-cutter-382",
    "sku": "RIPL019547",
    "riplCode": "RIPL019547",
    "modelNumber": "KZ-5200BC-PRO-2S",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 21264,
    "comparePrice": 21264,
    "brand": "KASEI",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_382_1.jpg",
      "/images/products/agrimart/product_382_2.jpg",
      "/images/products/agrimart/product_382_3.jpg"
    ],
    "description": "Displacement :  51.7cc    Type of Handle :  Double grip    Power Output - Max. 1.4kw / 1.9HP/9900 rpm    Fuel Tank Capacity :  1.3 L    Weight :  8.8 Kg",
    "descriptionHtml": "<p><b>Displacement : </b>51.7cc   <b>Type of Handle</b><b>: </b>Double grip   <b>Power Output</b> - Max. 1.4kw / 1.9HP/9900 rpm   <b>Fuel Tank Capacity</b><b>: </b>1.3 L   <b>Weight</b><b>: </b>8.8 Kg</p>",
    "specifications": {
      "Weed Cutter Model": "KZ-5200BC-PRO-2S",
      "RIPL Code": "RIPL019547",
      "Brand": "KASEI",
      "Displacement": "51.7cc",
      "Power Output": "Max. 1.4kw / 1.9HP/9900 rpm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Brochure",
        "url": "/agrimart-media/brochures/kasei-brush-cutter-kz-5200-bc-pro-2s-kz-5200bc-pro-2s.pdf",
        "fileName": "kasei-brush-cutter-kz-5200-bc-pro-2s-kz-5200bc-pro-2s.pdf",
        "available": true
      },
      {
        "label": "View User Manual",
        "url": "/agrimart-media/brochures/kasei-brush-cutter-kz-5200-bc-pro-2s-kz-5200bc-pro-2s_2.pdf",
        "fileName": "kasei-brush-cutter-kz-5200-bc-pro-2s-kz-5200bc-pro-2s_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Blade     2. Tap and go    3. Safety kit"
  },
  {
    "id": "am-1625",
    "name": "AM 708T-PRO-KNAPSACK AGRIMATE POWER SPRAYER Taiwan",
    "slug": "am-708t-pro-knapsack-agrimate-power-sprayer-taiwan-1625",
    "sku": "RIPL027120",
    "riplCode": "RIPL027120",
    "modelNumber": "AM708T",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 22320,
    "comparePrice": 22320,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 11,
    "images": [
      "/images/products/agrimart/product_1625_3.jpg",
      "/images/products/agrimart/product_1625_6.jpg",
      "/images/products/agrimart/product_1625_7.jpg"
    ],
    "description": "Model: AM-708T-Pro    Engine:  AX-34T    Type: 2 Stroke     Power:  0.75KW/ 7500RPM     Working Pressure: 35KG/ CM2     Exhaust capacity:  20 Ltr     Fuel tank capacity: 0.75 Ltr  Pump: Brass",
    "descriptionHtml": "<p> <b>Model: </b>AM-708T-Pro   <b>Engine:</b> AX-34T  <b>  Type:</b> 2 Stroke    Power:  0.75KW/ 7500RPM  <b>   Working Pressure: </b>35KG/ CM2<b>   </b>Exhaust capacity: 20 Ltr<b> </b><b>  Fuel tank capacity: </b>0.75 Ltr <b> Pump:</b> Brass </p>",
    "specifications": {
      "Sprayer Model": "AM708T",
      "RIPL Code": "RIPL027120",
      "Brand": "AGRIMATE",
      "Model": "AM-708T-Pro",
      "Engine": "AX-34T",
      "Type": "2 Stroke Power: 0.75KW/ 7500RPM",
      "Working Pressure": "35KG/ CM2",
      "Fuel tank capacity": "0.75 Ltr",
      "Pump": "Brass"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/agrimate-power-sprayer-am708t-knapsack-am708t_2.pdf",
        "fileName": "agrimate-power-sprayer-am708t-knapsack-am708t_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Hose pipe    2. Lance 2 Nos  3. Ball cock  4. O ring kit  5. Tool kit  6. Fuel Can Mask"
  },
  {
    "id": "am-3380",
    "name": "AM-WP5065-HHGE-GASOLINE 7HP AGRIMATE WATER PUMPSET",
    "slug": "am-wp5065-hhge-gasoline-7hp-agrimate-water-pumpset-3380",
    "sku": "RIPL037043",
    "riplCode": "RIPL037043",
    "modelNumber": "AM-WP5065-HHGE",
    "category": "Pumpset",
    "categoryId": "cat-am-pumpset",
    "price": 22380,
    "comparePrice": 22380,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3380_1.jpg",
      "/images/products/agrimart/product_3380_2.jpg"
    ],
    "description": "Model: AM-WP5065-HHGE     Engine :170FP     Displacement:  212CC      Max.  head: 65Mtr     Max. Discharge: 30( M 3 /HR)      Suction:  5Mtr",
    "descriptionHtml": "<p><b>Model: </b>AM-WP5065-HHGE    <b>Engine</b>:170FP    <b>Displacement:</b> 212CC <b>  </b> <b>Max. </b><b>head: </b>65Mtr   <b> Max. Discharge: </b>30(M3/HR)     Suction: 5Mtr  </p>",
    "specifications": {
      "Water Pumpset": "AM-WP5065-HHGE",
      "RIPL Code": "RIPL037043",
      "Brand": "AGRIMATE",
      "Model": "AM-WP5065-HHGE",
      "Engine": "170FP",
      "Displacement": "212CC",
      "head": "65Mtr",
      "Max. Discharge": "30( M 3 /HR) Suction: 5Mtr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-wp5065-hhge-gasoline-7hp-agrimate-water-pumpset-am-wp5065-hhge.pdf",
        "fileName": "am-wp5065-hhge-gasoline-7hp-agrimate-water-pumpset-am-wp5065-hhge.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-wp5065-hhge-gasoline-7hp-agrimate-water-pumpset-am-wp5065-hhge_2.pdf",
        "fileName": "am-wp5065-hhge-gasoline-7hp-agrimate-water-pumpset-am-wp5065-hhge_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3488",
    "name": "OM EMAK ENGINE K300H",
    "slug": "om-emak-engine-k300h-3488",
    "sku": "RIPL037954",
    "riplCode": "RIPL037954",
    "modelNumber": "OM-K300H",
    "category": "Engine",
    "categoryId": "cat-am-engine",
    "price": 22800,
    "comparePrice": 22800,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 13,
    "images": [
      "/images/products/agrimart/product_3488_1.jpg"
    ],
    "description": "Model  : K 300 H    Net Power :2.2 HP-1.65 kW/2900 rpm    Net Torque : 4.5 N.m/3450 rpm    BorexStroke : 48.6mmx 43 mm    Displacement : 79.77 cc    Starting : Recoil start    Fuel Capacity : 1.6 L     Oil capacity : 0.35 L    Dimension : 325x260x310 mm    Net Weight : 12.8 kg",
    "descriptionHtml": "<p><b>Model </b>: K 300 H    <b>Net Power</b> :2.2 HP-1.65 kW/2900 rpm    <b>Net Torque</b> : 4.5 N.m/3450 rpm   <b>BorexStroke</b> : 48.6mmx 43 mm    <b>Displacement</b> : 79.77 cc    <b>Starting</b> : Recoil start    <b>Fuel Capacity</b> : 1.6 L    <b>Oil capacity</b> : 0.35 L   <b> Dimension</b> : 325x260x310 mm    <b>Net Weight</b> : 12.8 kg</p>",
    "specifications": {
      "Engines": "OM-K300H",
      "RIPL Code": "RIPL037954",
      "Brand": "OLEO MAC",
      "Model": "K 300 H",
      "Net Power": "2.2 HP-1.65 kW/2900 rpm",
      "Net Torque": "4.5 N.m/3450 rpm",
      "BorexStroke": "48.6mmx 43 mm",
      "Displacement": "79.77 cc",
      "Starting": "Recoil start",
      "Fuel Capacity": "1.6 L",
      "Oil capacity": "0.35 L",
      "Dimension": "325x260x310 mm",
      "Net Weight": "12.8 kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/om-emak-engine-k300h-om-k300h.pdf",
        "fileName": "om-emak-engine-k300h-om-k300h.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3580",
    "name": "AM-212-2216K-HS HTP POWER SPRAYER",
    "slug": "am-212-2216k-hs-htp-power-sprayer-3580",
    "sku": "RIPL038998",
    "riplCode": "RIPL038998",
    "modelNumber": "AM-212-2216K-HS",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 22980,
    "comparePrice": 22980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 192,
    "images": [
      "/images/products/agrimart/product_3580_1.jpg",
      "/images/products/agrimart/product_3580_2.jpg"
    ],
    "description": "Model : AM-212-2216K-HS    Engine : 170F    Displacement : 212CC     Pump: AM 22    RPM : 300-1000    Working Pressure : 21-40kg/cm2    Discharge : 14-22LPM",
    "descriptionHtml": "<p>Model: AM-212-2216K-HS   Engine: 170F   Displacement: 212CC    Pump: AM 22   RPM: 300-1000   Working Pressure: 21-40kg/cm2   Discharge: 14-22LPM</p><p><br></p>",
    "specifications": {
      "Sprayer Model": "AM-212-2216K-HS",
      "RIPL Code": "RIPL038998",
      "Brand": "AGRIMATE",
      "Model": "AM-212-2216K-HS Engine : 170F Displacement : 212CC Pump: AM 22 RPM : 300-1000 Working Pressure : 21-40kg/cm2 Discharge : 14-22LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-212-2216k-hs-htp-power-sprayer-am-212-2216k-hs.pdf",
        "fileName": "am-212-2216k-hs-htp-power-sprayer-am-212-2216k-hs.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Overflow 3mtr.   2. Suction Hose 3mtr.    3 . O-Ring kit    4 . Strainer    5. Half Brass Gun 2nos"
  },
  {
    "id": "am-3392",
    "name": "AM-WP-80D-GE-GASOLINE WATER PUMPSET",
    "slug": "am-wp-80d-ge-gasoline-water-pumpset-3392",
    "sku": "RIPL037063",
    "riplCode": "RIPL037063",
    "modelNumber": "AM-WP-80D-GE",
    "category": "Pumpset",
    "categoryId": "cat-am-pumpset",
    "price": 23580,
    "comparePrice": 23580,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 400,
    "images": [
      "/images/products/agrimart/product_3392_1.jpg",
      "/images/products/agrimart/product_3392_2.jpg",
      "/images/products/agrimart/product_3392_3.jpg"
    ],
    "description": "Model: AM-WP-80D-GE Rated Power: 3600RPM Pump Size: 38MM X 38MM Head: 26 Mtr Max Discharge: 160Ltr/Min Discharge: 75Ltr/Min Max Total Head: 26Mtr Speed: 3600RPM",
    "descriptionHtml": "<p><b>Model:</b>AM-WP-80D-GE&nbsp; &nbsp;<b>Rated&nbsp;Power:</b>3600RPM&nbsp; &nbsp;<b>Pump Size:</b>38MM X 38MM&nbsp; &nbsp;<b>Head:</b> 26 Mtr&nbsp; &nbsp;<b>Max Discharge:</b>160Ltr/Min&nbsp; &nbsp;<b>Discharge:</b> 75Ltr/Min&nbsp; &nbsp;<b>Max Total Head:</b>26Mtr&nbsp; &nbsp;<b>Speed:&nbsp;</b>3600RPM</p>",
    "specifications": {
      "Water Pumpset": "AM-WP-80D-GE",
      "RIPL Code": "RIPL037063",
      "Brand": "AGRIMATE",
      "Model": "AM-WP-80D-GE",
      "Rated Power": "3600RPM",
      "Pump Size": "38MM X 38MM",
      "Head": "26 Mtr",
      "Max Discharge": "160Ltr/Min",
      "Discharge": "75Ltr/Min",
      "Max Total Head": "26Mtr",
      "Speed": "3600RPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-wp-80d-ge-gasoline-water-pumpset-am-wp-80d-ge.pdf",
        "fileName": "am-wp-80d-ge-gasoline-water-pumpset-am-wp-80d-ge.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3125",
    "name": "AM-21K HTP POWER SPRAYER WITH ENGINE",
    "slug": "am-21k-htp-power-sprayer-with-engine-3125",
    "sku": "RIPL027683",
    "riplCode": "RIPL027683",
    "modelNumber": "AM21K+AM152F ENGINE",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 23580,
    "comparePrice": 23580,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 89,
    "images": [
      "/images/products/agrimart/product_3125_1.jpg",
      "/images/products/agrimart/product_3125_2.jpg",
      "/images/products/agrimart/product_3125_3.jpg",
      "/images/products/agrimart/product_3125_4.jpg",
      "/images/products/agrimart/product_3125_5.jpg"
    ],
    "description": "Model: AM-21K    Engine Type: AM-152 4Stroke    Displacement: 98CC    Max Power:  3600rpm    Working Pressure: 10-15 KG/CM2   Discharge: 10-16LPM",
    "descriptionHtml": "<p><b>Model: </b>AM-21K   <b>Engine Type: </b>AM-152 4Stroke  <b>  Displacement:</b> 98CC   <b>Max Power:</b> 3600rpm   <b>Working Pressure:</b> 10-15 KG/CM2  <b> Discharge: </b>10-16LPM <b> </b><br></p>",
    "specifications": {
      "Sprayer Model": "AM21K+AM152F ENGINE",
      "RIPL Code": "RIPL027683",
      "Brand": "AGRIMATE",
      "Model": "AM-21K",
      "Engine Type": "AM-152 4Stroke",
      "Displacement": "98CC",
      "Max Power": "3600rpm",
      "Working Pressure": "10-15 KG/CM2",
      "Discharge": "10-16LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-21k-htp-power-sprayer-with-engine.pdf",
        "fileName": "am-21k-htp-power-sprayer-with-engine.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-21kam152f-engine-2-lance-without-delivery-hose-agrimate-htp-sprayer-am21kam152f-engine_2.pdf",
        "fileName": "am-21kam152f-engine-2-lance-without-delivery-hose-agrimate-htp-sprayer-am21kam152f-engine_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3125_1.mp4",
        "fileName": "product_3125_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1 . Suction hose 4.5 M    2. Overflow hose 4.5 M    3. Lance-3feet    4.  strainer    5. O Ring Kit"
  },
  {
    "id": "am-3333",
    "name": "AM-425T-4S Power Knapsack sprayer",
    "slug": "am-425t-4s-power-knapsack-sprayer-3333",
    "sku": "DBT24081",
    "riplCode": "DBT24081",
    "modelNumber": "DBT",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 23980,
    "comparePrice": 23980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3333_1.jpg"
    ],
    "description": "Model: AM-425T- 4S Power: 0.72kW/1HP/7000RPM Displacement: 25CC Working Pressure: 8-14 KG/CM2 Flow/Discharge: 8 L/Min Chemical tank capacity: 20L Fuel tank capacity: 0.60L",
    "descriptionHtml": "<p><b>&nbsp;Model:</b>&nbsp;&nbsp;AM-425T- 4S&nbsp; &nbsp;Power:&nbsp;0.72kW/1HP/7000RPM&nbsp;&nbsp;Displacement:&nbsp;25CC&nbsp;&nbsp;&nbsp;Working Pressure: 8-14&nbsp;KG/CM2&nbsp; &nbsp;Flow/Discharge:&nbsp;8&nbsp;&nbsp;L/Min&nbsp; &nbsp;&nbsp;Chemical tank capacity:&nbsp;20L&nbsp; &nbsp; Fuel tank capacity:&nbsp;0.60L</p>",
    "specifications": {
      "Sprayer Model": "DBT",
      "RIPL Code": "DBT24081",
      "Brand": "AGRIMATE",
      "Model": "AM-425T- 4S Power: 0.72kW/1HP/7000RPM Displacement: 25CC Working Pressure: 8-14 KG/CM2 Flow/Discharge: 8 L/Min Chemical tank capacity: 20L Fuel tank capacity: 0.60L"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-425t-4s-power-knapsack-sprayer-dbt.pdf",
        "fileName": "am-425t-4s-power-knapsack-sprayer-dbt.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Hose Pipe 2 . Lance 2 No. 3. Ball cock   4 . O Ring kit  5. Tool Kit   6. Safety kit"
  },
  {
    "id": "am-3214",
    "name": "AM-22K-MS+ - HTP POWER SPRAYER WITH ENGINE",
    "slug": "am-22k-ms-htp-power-sprayer-with-engine-3214",
    "sku": "RIPL036359",
    "riplCode": "RIPL036359",
    "modelNumber": "AM22K+AM168F ENGINE",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 23980,
    "comparePrice": 23980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3214_1.jpg",
      "/images/products/agrimart/product_3214_2.jpg",
      "/images/products/agrimart/product_3214_3.jpg",
      "/images/products/agrimart/product_3214_4.jpg"
    ],
    "description": "Model: AM-22K-MS+    Engine: 168F/4Stroke     Displacement: 163CC    Max. Power:  3600RPM      Pump: AM-22K    Discharge: 14-22LPM    Working Pressure: 21-40Kg/Cm 2",
    "descriptionHtml": "<p><b>Model: </b>AM-22K-MS+ <b>  Engine: </b>168F/4Stroke    <b>Displacement: </b>163CC   <b>Max. Power:</b> 3600RPM     <b> Pump: </b>AM-22K   <b>Discharge:</b> 14-22LPM   <b>Working Pressure: </b>21-40Kg/Cm<sup>2 </sup></p>",
    "specifications": {
      "Sprayer Model": "AM22K+AM168F ENGINE",
      "RIPL Code": "RIPL036359",
      "Brand": "AGRIMATE",
      "Model": "AM-22K-MS+",
      "Engine": "168F/4Stroke",
      "Displacement": "163CC",
      "Max. Power": "3600RPM",
      "Pump": "AM-22K",
      "Discharge": "14-22LPM",
      "Working Pressure": "21-40Kg/Cm 2"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-22k-ms-htp-power-sprayer-with-engine.pdf",
        "fileName": "am-22k-ms-htp-power-sprayer-with-engine.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-22k-ms-htp-power-sprayer-with-engine_2.pdf",
        "fileName": "am-22k-ms-htp-power-sprayer-with-engine_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Suction Hose-4.5Mtr     2. Overflow Hose-4.5Mtr     3. Strainer    4. O Ring kit    5. Lance-3 feet"
  },
  {
    "id": "am-3450",
    "name": "KZ-4000BC-2S-DELITE BRUSH CUTTER KASEI PLUS",
    "slug": "kz-4000bc-2s-delite-brush-cutter-kasei-plus-3450",
    "sku": "RIPL037692",
    "riplCode": "RIPL037692",
    "modelNumber": "KZ-4000BC-PRO-2S-Delite",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 23980,
    "comparePrice": 23980,
    "brand": "KASEI",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 99,
    "images": [
      "/images/products/agrimart/product_3450_1.jpg"
    ],
    "description": "Model : KZ-4000BC-PRO-2S    Type  : 2stroke    Displacement : 40.2CC  Start:  Recoil    Speed: 100 00 RPM    Fuel Tank Capacity : 0.7 Ltr    Weight : 7.1Kg",
    "descriptionHtml": "<p><b>Model</b>: KZ-4000BC-PRO-2S   <b>Type </b>: 2stroke   <b>Displacement</b>: 40.2CC  Start: Recoil   Speed: 10000 RPM   <b>Fuel Tank Capacity</b>: 0.7 Ltr   <b>Weight</b>: 7.1Kg</p>",
    "specifications": {
      "Weed Cutter Model": "KZ-4000BC-PRO-2S-Delite",
      "RIPL Code": "RIPL037692",
      "Brand": "KASEI",
      "Model": "KZ-4000BC-PRO-2S",
      "Type": "2stroke",
      "Displacement": "40.2CC Start: Recoil Speed: 100 00 RPM",
      "Fuel Tank Capacity": "0.7 Ltr",
      "Weight": "7.1Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/kz-4000bc-2s-delite-brush-cutter-kasei-plus-kz-4000bc-pro-2s-delite.pdf",
        "fileName": "kz-4000bc-2s-delite-brush-cutter-kasei-plus-kz-4000bc-pro-2s-delite.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/kz-4000bc-2s-delite-brush-cutter-kasei-plus-kz-4000bc-pro-2s-delite_2.pdf",
        "fileName": "kz-4000bc-2s-delite-brush-cutter-kasei-plus-kz-4000bc-pro-2s-delite_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 .Tap N Go     2 .Measuring Can    3 . Gloves    4 .Goggles     5 . 3Tooth blade    6 . Harness       7 .Tools kit     8 .Safety Articles"
  },
  {
    "id": "am-1763",
    "name": "AM-425T-PRO-4S-Knapsack Power Sprayer",
    "slug": "am-425t-pro-4s-knapsack-power-sprayer-1763",
    "sku": "RIPL017997",
    "riplCode": "RIPL017997",
    "modelNumber": "AM425T",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 23980,
    "comparePrice": 23980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 755,
    "images": [
      "/images/products/agrimart/product_1763_1.jpg",
      "/images/products/agrimart/product_1763_2.jpg",
      "/images/products/agrimart/product_1763_3.jpg",
      "/images/products/agrimart/product_1763_4.jpg"
    ],
    "description": "Model:   AM-425T- 4S    Power:  0.72kW/1HP/7000RPM   Displacement:  25CC    Working Pressure: 8-14   KG/CM2    Flow/Discharge:  8    L/Min     Chemical tank capacity:  20L     Fuel tank capacity:  0.60L",
    "descriptionHtml": "<p><b> Model:</b>  AM-425T- 4S   Power: 0.72kW/1HP/7000RPM  Displacement: 25CC   Working Pressure: 8-14 KG/CM2   Flow/Discharge: 8  L/Min    Chemical tank capacity: 20L    Fuel tank capacity: 0.60L</p>",
    "specifications": {
      "Sprayer Model": "AM425T",
      "RIPL Code": "RIPL017997",
      "Brand": "AGRIMATE",
      "Model": "AM-425T- 4S Power: 0.72kW/1HP/7000RPM Displacement: 25CC Working Pressure: 8-14 KG/CM2 Flow/Discharge: 8 L/Min Chemical tank capacity: 20L Fuel tank capacity: 0.60L"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-425t-pro-4s-knapsack-power-sprayer.pdf",
        "fileName": "am-425t-pro-4s-knapsack-power-sprayer.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/agrimate-power-sprayer-am425t-kanpsack-am425t_2.pdf",
        "fileName": "agrimate-power-sprayer-am425t-kanpsack-am425t_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1763_1.mp4",
        "fileName": "product_1763_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Hose Pipe 2 . Lance 2 No. 3. Ball cock 4 . O Ring kit  5. Tool Kit   6. Safety kit"
  },
  {
    "id": "am-3578",
    "name": "AM-212-3020K-HS HTP POWER SPRAYER",
    "slug": "am-212-3020k-hs-htp-power-sprayer-3578",
    "sku": "RIPL038999",
    "riplCode": "RIPL038999",
    "modelNumber": "AM-212-3020K-HS",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 23980,
    "comparePrice": 23980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 28,
    "images": [
      "/images/products/agrimart/product_3578_1.jpg",
      "/images/products/agrimart/product_3578_2.jpg"
    ],
    "description": "Model : AM-212-3020K-HS Engine : 170F Displacement : 212CC Pump: AM 30 RPM : 800-1200 Working Pressure : 21-40kg/cm2 Discharge : 30-45LPM",
    "descriptionHtml": "<p><b>Model</b>: AM-212-3020K-HS&nbsp; &nbsp;<b>Engine</b>: 170F&nbsp; &nbsp;<b>Displacement</b>: 212CC&nbsp; &nbsp; <b>Pump:&nbsp;</b>AM 30&nbsp; &nbsp;<b>RPM</b>: 800-1200&nbsp; &nbsp;<b>Working Pressure</b>: 21-40kg/cm2 &nbsp; <b>Discharge</b>: 30-45LPM</p><p><br></p>",
    "specifications": {
      "Sprayer Model": "AM-212-3020K-HS",
      "RIPL Code": "RIPL038999",
      "Brand": "AGRIMATE",
      "Model": "AM-212-3020K-HS",
      "Engine": "170F",
      "Displacement": "212CC",
      "Pump": "AM 30",
      "RPM": "800-1200",
      "Working Pressure": "21-40kg/cm2",
      "Discharge": "30-45LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-212-3020k-hs-htp-power-sprayer-am-212-3020k-hs.pdf",
        "fileName": "am-212-3020k-hs-htp-power-sprayer-am-212-3020k-hs.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Overflow 3mtr. 2. Suction Hose 3mtr. 3 . O-Ring kit 4 . Strainer 5. Half Brass Gun 2nos"
  },
  {
    "id": "am-3366",
    "name": "KZ-SLP750A- HEDGE TRIMMER GASOLINE",
    "slug": "kz-slp750a-hedge-trimmer-gasoline-3366",
    "sku": "RIPL036450",
    "riplCode": "RIPL036450",
    "modelNumber": "SLP750A",
    "category": "Hedge Trimmer",
    "categoryId": "cat-am-hedgetrimmer",
    "price": 23980,
    "comparePrice": 23980,
    "brand": "KASEI",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 21,
    "images": [
      "/images/products/agrimart/product_3366_1.jpg"
    ],
    "description": "Model: SLP750A-2 stroke- single cylinder     Cutting width: 750MM   Displacement: 25.6 CC    Max. Output: 0.65KW/ 7500 R/Min  Carburetor: Diaphragm    Fuel tank capacity: 1 Ltr  Start: Recoil & Hand Operated    Gross weight: 7.5 KG    New weight: 5.5 KG",
    "descriptionHtml": "<p><b>Model: </b>SLP750A-2 stroke- single cylinder   <b> Cutting width:</b> 750MM  <b> Displacement:</b> 25.6 CC   <b>Max. Output: </b>0.65KW/ 7500 R/Min  <b>Carburetor: </b>Diaphragm   <b>Fuel tank capacity: </b>1 Ltr  <b>Start: </b>Recoil & Hand Operated   <b>Gross weight:</b> 7.5 KG   <b>New weight: </b>5.5 KG  </p>",
    "specifications": {
      "Hedgetrimmer Model": "SLP750A",
      "RIPL Code": "RIPL036450",
      "Brand": "KASEI",
      "Model": "SLP750A-2 stroke- single cylinder",
      "Cutting width": "750MM",
      "Displacement": "25.6 CC",
      "Max. Output": "0.65KW/ 7500 R/Min",
      "Carburetor": "Diaphragm",
      "Fuel tank capacity": "1 Ltr",
      "Start": "Recoil & Hand Operated",
      "Gross weight": "7.5 KG",
      "New weight": "5.5 KG"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3216",
    "name": "AM-30K-MS+ - HTP POWER SPRAYER WITH ENGINE",
    "slug": "am-30k-ms-htp-power-sprayer-with-engine-3216",
    "sku": "RIPL036358",
    "riplCode": "RIPL036358",
    "modelNumber": "AM30K+AM168F ENGINE",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 25980,
    "comparePrice": 25980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 80,
    "images": [
      "/images/products/agrimart/product_3216_1.jpg",
      "/images/products/agrimart/product_3216_2.jpg",
      "/images/products/agrimart/product_3216_3.jpg",
      "/images/products/agrimart/product_3216_4.jpg"
    ],
    "description": "Model : AM-30K-MS+      Engine Type :   168F/4Stroke    Displacement :  163CC    Max  Power :  3600RPM       Pump :  AM-30K    Discharge :  30-45LPM    Working  Pressure :   21-40Kg/  Cm 2",
    "descriptionHtml": "<p><b>Model</b>: AM-30K-MS+    <b>Engine Type</b><b>:</b> 168F/4Stroke   <b>Displacement</b>: 163CC   <b>Max </b><b>Power</b>: 3600RPM     <b>Pump</b>: AM-30K   <b>Discharge</b>: 30-45LPM   <b>Working </b><b>Pressure</b><b>:</b> 21-40Kg/ Cm<sup>2</sup></p>",
    "specifications": {
      "Sprayer Model": "AM30K+AM168F ENGINE",
      "RIPL Code": "RIPL036358",
      "Brand": "AGRIMATE",
      "Model": "AM-30K-MS+",
      "Displacement": "163CC",
      "Power": "3600RPM",
      "Pump": "AM-30K",
      "Discharge": "30-45LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-30k-ms-htp-power-sprayer-with-engine.pdf",
        "fileName": "am-30k-ms-htp-power-sprayer-with-engine.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-30k-ms-htp-power-sprayer-with-engine_2.pdf",
        "fileName": "am-30k-ms-htp-power-sprayer-with-engine_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Suction Hose-4.5Mtr     2.  Overflow Hose-4.5Mtr     3.  Strainer    4.  O Ring kit     5.  Lance- 3 feet"
  },
  {
    "id": "am-2596",
    "name": "GSH 40 WITH 16",
    "slug": "gsh-40-with-16-2596",
    "sku": "RIPL026529",
    "riplCode": "RIPL026529",
    "modelNumber": "GS40",
    "category": "Chain Saw",
    "categoryId": "cat-am-chain-saw",
    "price": 26800,
    "comparePrice": 26800,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 168,
    "images": [
      "/images/products/agrimart/product_2596_1.jpg"
    ],
    "description": "Power/Displacement : 2.3 Hp/1.7kW/38.9cm     Bar Length  (Optional)  : 14\"-16\" / 35-41cm     Chain : Oregon 3/8\" * 0.050\"     Dry weight (Without bar & chain) : 4.5 Kg   Oil Pump : Aluminium, automatic, adjustable, zero flow rate at idle speed     Oil/fuel tank capacity :  0.22 L/0.32 L     Sound pressure/power level :  103.2/111.5 dB(A)   Lh/rh vibration level :  6.9/7.1 m/s²",
    "descriptionHtml": "<p><b>Power/Displacement : </b>2.3 Hp/1.7kW/38.9cm    <b>Bar Length </b>(Optional)<b> :</b> 14\"-16\" / 35-41cm    <b>Chain :</b> Oregon 3/8\" * 0.050\"    <b>Dry weight (Without bar & chain) :</b> 4.5 Kg  <b>Oil Pump : </b>Aluminium, automatic, adjustable, zero flow rate at idle speed    <b>Oil/fuel tank capacity : </b>0.22 L/0.32 L    <b>Sound pressure/power level : </b>103.2/111.5 dB(A)  <b>Lh/rh vibration level : </b>6.9/7.1 m/s²   </p>",
    "specifications": {
      "Chain Saw Model": "GS40",
      "RIPL Code": "RIPL026529",
      "Brand": "OLEO MAC",
      "Power/Displacement": "2.3 Hp/1.7kW/38.9cm",
      "Chain": "Oregon 3/8\" * 0.050\"",
      "Dry weight (Without bar & chain)": "4.5 Kg",
      "Oil Pump": "Aluminium, automatic, adjustable, zero flow rate at idle speed",
      "Oil/fuel tank capacity": "0.22 L/0.32 L",
      "Sound pressure/power level": "103.2/111.5 dB(A)",
      "Lh/rh vibration level": "6.9/7.1 m/s²"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/gsh-40-with-16.pdf",
        "fileName": "gsh-40-with-16.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Parts List",
        "url": "/agrimart-media/brochures/oleo-mac-chain-saw-gsh-40-16_2.pdf",
        "fileName": "oleo-mac-chain-saw-gsh-40-16_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2596_1.mp4",
        "fileName": "product_2596_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-1919",
    "name": "AM-MBD-5650 Turbo Mist Blower 4 in 1",
    "slug": "am-mbd-5650-turbo-mist-blower-4-in-1-1919",
    "sku": "RIPL027535",
    "riplCode": "RIPL027535",
    "modelNumber": "AM MBO 5650",
    "category": "Blower & Mist Blower",
    "categoryId": "cat-am-blower-mistblower",
    "price": 26990,
    "comparePrice": 26990,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 2,
    "images": [
      "/images/products/agrimart/product_1919_1.jpg",
      "/images/products/agrimart/product_1919_2.jpg",
      "/images/products/agrimart/product_1919_3.jpg"
    ],
    "description": "Engine: Single cylinder 2 stroke    Displacement: 56.5 cm3     Chemical tank Capacity: 14L     Fuel tank Capacity:   1.5 Ltr     Idle speed: 2.800 RPM    Engine power: 2.5kW/ 3.5HP      Air flow rate: 1060m3/h    Weight: 9.5Kg",
    "descriptionHtml": "<p><b>Engine:</b> Single cylinder 2 stroke    <b>Displacement:</b> 56.5 cm3    <b>Chemical tank Capacity: 14L</b>   <b>Fuel tank Capacity: </b> 1.5 Ltr    <b>Idle speed:</b> 2.800 RPM   <b>Engine power:</b> 2.5kW/ 3.5HP     <b>Air flow rate:</b> 1060m3/h    <b>Weight:</b> 9.5Kg</p>",
    "specifications": {
      "Blower Model": "AM MBO 5650",
      "RIPL Code": "RIPL027535",
      "Brand": "AGRIMATE",
      "Engine": "Single cylinder 2 stroke",
      "Displacement": "56.5 cm3",
      "Chemical tank Capacity": "14L",
      "Fuel tank Capacity": "1.5 Ltr",
      "Idle speed": "2.800 RPM",
      "Engine power": "2.5kW/ 3.5HP",
      "Air flow rate": "1060m3/h",
      "Weight": "9.5Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am-mbd-5650-agrimate-mist-blower-4-in-1-am-mbo-5650_2.pdf",
        "fileName": "am-mbd-5650-agrimate-mist-blower-4-in-1-am-mbo-5650_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1919_1.mp4",
        "fileName": "product_1919_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Turbo nozzle  2. Duster attachment  3. Cap free  4. Tool kit & Fuel can"
  },
  {
    "id": "am-181",
    "name": "KZ-2300HT-600-PRO-2S HEDGE TRIMMER",
    "slug": "kz-2300ht-600-pro-2s-hedge-trimmer-181",
    "sku": "RIPL036449",
    "riplCode": "RIPL036449",
    "modelNumber": "KZ-2300HT PRO-2S",
    "category": "Hedge Trimmer",
    "categoryId": "cat-am-hedgetrimmer",
    "price": 27380,
    "comparePrice": 27380,
    "brand": "KASEI",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 173,
    "images": [
      "/images/products/agrimart/product_181_1.jpg",
      "/images/products/agrimart/product_181_2.jpg",
      "/images/products/agrimart/product_181_3.jpg"
    ],
    "description": "Displacement: 22.5cc    Power Output - Max. 0.65kw / 0.8HP/ 7500 rpm    Fuel Tank Capacity: 0.5L    Blade Type: Double sided    Blade Total Length: 600mm     Weight: 5.5 Kg",
    "descriptionHtml": "<div><b>Displacement:</b> 22.5cc   <b>Power Output -</b> Max. 0.65kw / 0.8HP/ 7500 rpm   <b>Fuel Tank Capacity:</b> 0.5L   <b>Blade Type:</b> Double sided   <b>Blade Total Length:</b> 600mm    <b>Weight:</b> 5.5 Kg",
    "specifications": {
      "Hedgetrimmer Model": "KZ-2300HT PRO-2S",
      "RIPL Code": "RIPL036449",
      "Brand": "KASEI",
      "Displacement": "22.5cc",
      "Fuel Tank Capacity": "0.5L",
      "Blade Type": "Double sided",
      "Blade Total Length": "600mm",
      "Weight": "5.5 Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/kz-2300ht-600-pro-2s-kasei-hedge-trimmer-kz-2300ht-pro-2s.pdf",
        "fileName": "kz-2300ht-600-pro-2s-kasei-hedge-trimmer-kz-2300ht-pro-2s.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Parts List",
        "url": "/agrimart-media/brochures/kasei-hedge-trimmer-kz-2300-ht-pro-2s-kz-2300ht-pro-2s_2.pdf",
        "fileName": "kasei-hedge-trimmer-kz-2300-ht-pro-2s-kz-2300ht-pro-2s_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_181_1.mp4",
        "fileName": "product_181_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Fuel mixing can    2. Standard tools    3. Safety kit"
  },
  {
    "id": "am-3420",
    "name": "BCH 310T BRUSH CUTTER",
    "slug": "bch-310t-brush-cutter-3420",
    "sku": "RIPL037310",
    "riplCode": "RIPL037310",
    "modelNumber": "BCH 310T 4S",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 29808,
    "comparePrice": 29808,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 303,
    "images": [
      "/images/products/agrimart/product_3420_1.jpg",
      "/images/products/agrimart/product_3420_2.jpg",
      "/images/products/agrimart/product_3420_3.jpg"
    ],
    "description": "Power/Displacement :  1.0 HP - 0.75 kW/31 cm³  Cutting components  :  110 mm dia. Tap&Go EVO line head with 2.40 mm line - 255 mm dia. disc with 3 blades      Grip  : Handlebar    Tube Diameter  : 26 mm     Fuel Tank Capacity  : 0.80 L     Sound pressure/Power  Level :  93.9/111 dB(A)    Lh/Rh Vibration Level : 3.9/3.5 m/s²",
    "descriptionHtml": "<b>Power/Displacement : </b>1.0 HP - 0.75 kW/31 cm³  <b>Cutting components</b> : 110 mm dia. Tap&Go EVO line head with 2.40 mm line - 255 mm dia. disc with 3 blades    <b>Grip </b>: Handlebar    <b>Tube Diameter </b>: 26 mm    <b>Fuel Tank Capacity </b>: 0.80 L    <b>Sound pressure/Power </b><b>Level : </b>93.9/111 dB(A)   <b>Lh/Rh Vibration Level</b>: 3.9/3.5 m/s²",
    "specifications": {
      "Weed Cutter Model": "BCH 310T 4S",
      "RIPL Code": "RIPL037310",
      "Brand": "OLEO MAC",
      "Power/Displacement": "1.0 HP - 0.75 kW/31 cm³",
      "Cutting components": "110 mm dia. Tap&Go EVO line head with 2.40 mm line - 255 mm dia. disc with 3 blades",
      "Grip": "Handlebar",
      "Tube Diameter": "26 mm",
      "Fuel Tank Capacity": "0.80 L",
      "Level": "93.9/111 dB(A)",
      "Lh/Rh Vibration Level": "3.9/3.5 m/s²"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/bch-310t-brush-cutter-bch-310t-4s.pdf",
        "fileName": "bch-310t-brush-cutter-bch-310t-4s.pdf",
        "available": true
      },
      {
        "label": "View Diagram and Part list",
        "url": "/agrimart-media/brochures/bch-310t-brush-cutter-bch-310t-4s_2.pdf",
        "fileName": "bch-310t-brush-cutter-bch-310t-4s_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Blade    2.  Tap and go    3.  Tool kit"
  },
  {
    "id": "am-3113",
    "name": "AM-243-BCH-2S-MS+ CROP HARVESTER WITH REAPER ATTACHMENT",
    "slug": "am-243-bch-2s-ms-crop-harvester-with-reaper-attachment-3113",
    "sku": "RIPL036439",
    "riplCode": "RIPL036439",
    "modelNumber": "AM-243-BCH-MS+",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 29900,
    "comparePrice": 29900,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3113_1.jpg",
      "/images/products/agrimart/product_3113_2.jpg"
    ],
    "description": "Model: AM-243-BCH-MS+     Displacement : 43CC     Power:  6500RPM     Carburetor : Diaphragm      Fuel Tank Capacity : 1.0L",
    "descriptionHtml": "<p><b>Model: </b>AM-243-BCH-MS+    Displacement: 43CC    Power: 6500RPM    Carburetor: Diaphragm     <b>Fuel Tank Capacity</b>: 1.0L</p>",
    "specifications": {
      "Weed Cutter Model": "AM-243-BCH-MS+",
      "RIPL Code": "RIPL036439",
      "Brand": "AGRIMATE",
      "Model": "AM-243-BCH-MS+ Displacement : 43CC Power: 6500RPM Carburetor : Diaphragm",
      "Fuel Tank Capacity": "1.0L"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-243-bch-2s-ms-crop-harvester-with-reaper-attachment.pdf",
        "fileName": "am-243-bch-2s-ms-crop-harvester-with-reaper-attachment.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-243-bch-2s-ms-agrimate-crop-harvester-am-243-bch-ms_2.pdf",
        "fileName": "am-243-bch-2s-ms-agrimate-crop-harvester-am-243-bch-ms_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Tap & go     2. 2 Tooth Blade   3. Circular Blade  4.  Reaper Attachment      5.  Harness      6. Tool Kit"
  },
  {
    "id": "am-3084",
    "name": "AM-EPS-22MS+ HTP POWER SPRAYER WITH ELECTRIC MOTOR",
    "slug": "am-eps-22ms-htp-power-sprayer-with-electric-motor-3084",
    "sku": "RIPL036399",
    "riplCode": "RIPL036399",
    "modelNumber": "AM-EPS-22MS+",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 29980,
    "comparePrice": 29980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 136,
    "images": [
      "/images/products/agrimart/product_3084_1.jpg",
      "/images/products/agrimart/product_3084_2.jpg"
    ],
    "description": "Model: AM-EPS-22MS+    Speed: 500-900RPM    Discharge: 10-15LPM   Working pressure: 20-35kg/Cm 2    Piston Dia: 18MM   Motor: Single phase 1.5HP with Copper winding",
    "descriptionHtml": "<p><b>Model: </b>AM-EPS-22MS+   <b>Speed:</b> 500-900RPM <b>   Discharge: </b>10-15LPM<b>  Working pressure:</b> 20-35kg/Cm<sup>2    </sup><b>Piston Dia: </b>18MM  <b> Motor: </b>Single phase 1.5HP with Copper winding </p>",
    "specifications": {
      "Sprayer Model": "AM-EPS-22MS+",
      "RIPL Code": "RIPL036399",
      "Brand": "AGRIMATE",
      "Model": "AM-EPS-22MS+",
      "Speed": "500-900RPM",
      "Discharge": "10-15LPM",
      "Working pressure": "20-35kg/Cm 2",
      "Piston Dia": "18MM",
      "Motor": "Single phase 1.5HP with Copper winding"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-eps-22ms-electric-power-sprayer.pdf",
        "fileName": "am-eps-22ms-electric-power-sprayer.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-eps-22ms-new-electric-power-sprayer-50mtr-dhose-gun-15hp-motor-am-eps-22ms_2.pdf",
        "fileName": "am-eps-22ms-new-electric-power-sprayer-50mtr-dhose-gun-15hp-motor-am-eps-22ms_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Suction Hose -5Mtr    2. By pass Hose-5Mtr    3. Spray hose- 25Mtr   4. Spray Gun"
  },
  {
    "id": "am-3508",
    "name": "AM-2412-MTHP-2 in 1 TEA HARVESTER CUM PRUNER",
    "slug": "am-2412-mthp-2-in-1-tea-harvester-cum-pruner-3508",
    "sku": "RIPL038021",
    "riplCode": "RIPL038021",
    "modelNumber": "AM-2412-MTHP-2 in 1",
    "category": "Harvester",
    "categoryId": "cat-am-harvester",
    "price": 29980,
    "comparePrice": 29980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 55,
    "images": [
      "/images/products/agrimart/product_3508_1.jpg",
      "/images/products/agrimart/product_3508_2.jpg",
      "/images/products/agrimart/product_3508_3.jpg",
      "/images/products/agrimart/product_3508_4.jpg",
      "/images/products/agrimart/product_3508_5.jpg"
    ],
    "description": "Model : AM-2412-MTHP-2 in 1    Motor Power : 300W     Battery : 24V/12AH    Blade Length : 410mm    Blade RPM : 2000-3800 RPM    Wire Lenght : 2m     No. Of Teeths: Upper 14, Lower 13",
    "descriptionHtml": "<p><b>Model</b>: AM-2412-MTHP-2 in 1   <b>Motor Power</b>: 300W    <b>Battery</b>: 24V/12AH    <b>Blade Length </b>: 410mm    <b>Blade RPM</b>: 2000-3800 RPM   <b>Wire Lenght</b>: 2m    <b>No. Of Teeths: </b>Upper 14, Lower 13 <b>  </b> </p><p><br></p>",
    "specifications": {
      "Harvester Model": "AM-2412-MTHP-2 in 1",
      "RIPL Code": "RIPL038021",
      "Brand": "AGRIMATE",
      "Model": "AM-2412-MTHP-2 in 1",
      "Motor Power": "300W",
      "Battery": "24V/12AH",
      "Blade Length": "410mm",
      "Blade RPM": "2000-3800 RPM",
      "Wire Lenght": "2m",
      "No. Of Teeths": "Upper 14, Lower 13"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-2412-mthp-2-in-1-tea-harvester-cum-pruner-am-2412-mthp-2-in-1.pdf",
        "fileName": "am-2412-mthp-2-in-1-tea-harvester-cum-pruner-am-2412-mthp-2-in-1.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-2412-mthp-2-in-1-tea-harvester-cum-pruner-am-2412-mthp-2-in-1_2.pdf",
        "fileName": "am-2412-mthp-2-in-1-tea-harvester-cum-pruner-am-2412-mthp-2-in-1_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3508_1.mp4",
        "fileName": "product_3508_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1 . Pruner Blade    2 . Carry Bag    3 . Oil Can    4 . Tools"
  },
  {
    "id": "am-2",
    "name": "KZ-6300 BBP-PRO 2S-KASEI BLOWER PROFESSIONAL-BACKPACK",
    "slug": "kz-6300-bbp-pro-2s-kasei-blower-professional-backpack-2",
    "sku": "RIPL019627",
    "riplCode": "RIPL019627",
    "modelNumber": "KZ-6300 BBP -PRO 2S",
    "category": "Blower & Mist Blower",
    "categoryId": "cat-am-blower-mistblower",
    "price": 29980,
    "comparePrice": 29980,
    "brand": "KASEI",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 133,
    "images": [
      "/images/products/agrimart/product_2_1.jpg",
      "/images/products/agrimart/product_2_2.jpg",
      "/images/products/agrimart/product_2_3.jpg"
    ],
    "description": "Displacement:   63.3 CC      Power Output:  Max. 2.1kW/ 7700 rpm    Bore x Stroke: 48 x 35 MM    Weight: 11 Kg",
    "descriptionHtml": "<div><b>Displacement:  </b>63.3 CC     <b>Power Output:</b> Max. 2.1kW/ 7700 rpm <b>  Bore x Stroke: </b>48 x 35 MM   <b>Weight: </b>11 Kg",
    "specifications": {
      "Blower Model": "KZ-6300 BBP -PRO 2S",
      "RIPL Code": "RIPL019627",
      "Brand": "KASEI",
      "Displacement": "63.3 CC",
      "Power Output": "Max. 2.1kW/ 7700 rpm",
      "Bore x Stroke": "48 x 35 MM",
      "Weight": "11 Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/kz-6300-bbp-pro-2s-kasei-blower-professional-backpack-kz-6300-bbp-pro-2s.pdf",
        "fileName": "kz-6300-bbp-pro-2s-kasei-blower-professional-backpack-kz-6300-bbp-pro-2s.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Parts List",
        "url": "/agrimart-media/brochures/kasei-blower-kz-6300-bbp-pro-2s-kz-6300-bbp-pro-2s_2.pdf",
        "fileName": "kasei-blower-kz-6300-bbp-pro-2s-kz-6300-bbp-pro-2s_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2_1.mp4",
        "fileName": "product_2_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-138",
    "name": "GS35-WITH 14",
    "slug": "gs35-with-14-138",
    "sku": "RIPL015578",
    "riplCode": "RIPL015578",
    "modelNumber": "GS35",
    "category": "Chain Saw",
    "categoryId": "cat-am-chain-saw",
    "price": 29980,
    "comparePrice": 29980,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 6,
    "images": [
      "/images/products/agrimart/product_138_1.jpg",
      "/images/products/agrimart/product_138_2.jpg",
      "/images/products/agrimart/product_138_3.jpg"
    ],
    "description": "Power / Displacement: 2.0 HP - 1.5 kW/38.9 cm³    Bar length (nose): 35-41 cm, 14''-16'', (sprocket)    Chain (pitch x gauge): 3/8''x.050''     Oil Pump: A utomatic, zero flow rate at idle speed    Oil/fuel tank capacity: 0.26 L/0.36 L     Dry weight without bar and chain: 4.6 kg",
    "descriptionHtml": "<p><b>Power / Displacement: </b>2.0 HP - 1.5 kW/38.9 cm³   <b>Bar length (nose): </b>35-41 cm, 14''-16'', (sprocket)   <b>Chain (pitch x gauge): </b>3/8''x.050''    <b>Oil Pump: </b>Automatic, zero flow rate at idle speed   <b>Oil/fuel tank capacity: </b>0.26 L/0.36 L   <b>Dry weight without bar and chain: </b>4.6 kg</p>",
    "specifications": {
      "Chain Saw Model": "GS35",
      "RIPL Code": "RIPL015578",
      "Brand": "OLEO MAC",
      "Power / Displacement": "2.0 HP - 1.5 kW/38.9 cm³",
      "Bar length (nose)": "35-41 cm, 14''-16'', (sprocket)",
      "Chain (pitch x gauge)": "3/8''x.050''",
      "Oil Pump": "A utomatic, zero flow rate at idle speed",
      "Oil/fuel tank capacity": "0.26 L/0.36 L",
      "Dry weight without bar and chain": "4.6 kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Illustrated Part List",
        "url": "/agrimart-media/brochures/om-chain-saw-gs35-14_2.pdf",
        "fileName": "om-chain-saw-gs35-14_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_138_1.mp4",
        "fileName": "product_138_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1.  Bar Cover    2.  Bar    3. Chain    4.  Std Tools  5. Safety Articles"
  },
  {
    "id": "am-2053",
    "name": "GSH 51-18",
    "slug": "gsh-51-18-2053",
    "sku": "RIPL028396",
    "riplCode": "RIPL028396",
    "modelNumber": "GSH51",
    "category": "Chain Saw",
    "categoryId": "cat-am-chain-saw",
    "price": 29990,
    "comparePrice": 29990,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 63,
    "images": [
      "/images/products/agrimart/product_2053_1.jpg",
      "/images/products/agrimart/product_2053_2.jpg",
      "/images/products/agrimart/product_2053_3.jpg"
    ],
    "description": "Model: GSH 51     Power / Displacement:  3.0HP/ 2.2KW/ 50.9 cm ³    Bar Length(Nose): 41-46-51 cm/16\"-18\"-20\"(Sprocket-nose)    Chain(PitchxGauge): Oregon .325\"x .050\" (16\"-18\")- .325\"x .058\" (20\")    Oil pump: Adjustable/Automatic    Oil/  Fuel tank capacity: 0.27L/ 0.50 L    Sound Pressure/Power Level: 110/113 dB(A)    Lh/rh Vibration Level:  5.2/4.8 m/s2    Dry Weight without Bar and Chain: 5.4 Kg",
    "descriptionHtml": "<p>Model: GSH 51    Power / Displacement: 3.0HP/ 2.2KW/ 50.9 cm³    <b>Bar Length(Nose): </b>41-46-51 cm/16\"-18\"-20\"(Sprocket-nose)    <b>Chain(PitchxGauge):</b> Oregon .325\"x .050\" (16\"-18\")- .325\"x .058\" (20\")    <b>Oil pump:</b> Adjustable/Automatic   <b> Oil/</b><b> Fuel tank capacity:</b> 0.27L/ 0.50 L    <b>Sound Pressure/Power Level: </b>110/113 dB(A)    <b>Lh/rh Vibration Level: </b>5.2/4.8 m/s2    <b>Dry Weight without Bar and Chain: </b>5.4 Kg</p>",
    "specifications": {
      "Chain Saw Model": "GSH51",
      "RIPL Code": "RIPL028396",
      "Brand": "OLEO MAC",
      "Bar Length(Nose)": "41-46-51 cm/16\"-18\"-20\"(Sprocket-nose)",
      "Chain(PitchxGauge)": "Oregon .325\"x .050\" (16\"-18\")- .325\"x .058\" (20\")",
      "Oil pump": "Adjustable/Automatic",
      "Fuel tank capacity": "0.27L/ 0.50 L",
      "Sound Pressure/Power Level": "110/113 dB(A)",
      "Lh/rh Vibration Level": "5.2/4.8 m/s2",
      "Dry Weight without Bar and Chain": "5.4 Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/gsh-51-18.pdf",
        "fileName": "gsh-51-18.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Parts List",
        "url": "/agrimart-media/brochures/om-chain-saw-gsh51_2.pdf",
        "fileName": "om-chain-saw-gsh51_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2053_1.mp4",
        "fileName": "product_2053_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Bar Cover    2. Bar    3. Chain    4. Tools Kit"
  },
  {
    "id": "am-3030",
    "name": "AM-243-2S-BC-PRO BRUSH CUTTER",
    "slug": "am-243-2s-bc-pro-brush-cutter-3030",
    "sku": "RIPL035742",
    "riplCode": "RIPL035742",
    "modelNumber": "AM-243N-2S-BC-Pro",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 29990,
    "comparePrice": 29990,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 93,
    "images": [
      "/images/products/agrimart/product_3030_1.jpg",
      "/images/products/agrimart/product_3030_2.jpg"
    ],
    "description": "Model: AM-243-2S-BC-PRO Engine type: 2Stroke Displacement: 43CC Power: 3000-10000RPM Carburetor: Walbro Fuel tank capacity: 1.2Ltr",
    "descriptionHtml": "<p><b>Model:</b>&nbsp;AM-243-2S-BC-PRO&nbsp; &nbsp;<b>Engine type: </b>2Stroke&nbsp; &nbsp;<b>&nbsp;Displacement: </b>43CC&nbsp; &nbsp;<b>Power: </b>3000-10000RPM&nbsp;&nbsp;<b> Carburetor: </b>Walbro&nbsp;&nbsp;<b>Fuel tank capacity:</b> 1.2Ltr&nbsp;&nbsp;</p>",
    "specifications": {
      "Weed Cutter Model": "AM-243N-2S-BC-Pro",
      "RIPL Code": "RIPL035742",
      "Brand": "AGRIMATE",
      "Model": "AM-243-2S-BC-PRO",
      "Engine type": "2Stroke",
      "Displacement": "43CC",
      "Power": "3000-10000RPM",
      "Carburetor": "Walbro",
      "Fuel tank capacity": "1.2Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-243-2s-bc-pro-brush-cutter.pdf",
        "fileName": "am-243-2s-bc-pro-brush-cutter.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-243n-2s-bc-pro-power-weeder_2.pdf",
        "fileName": "am-243n-2s-bc-pro-power-weeder_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. 2 Tooth Blade 2. Tap n Go 3. Tools kit 4. Safety Articles"
  },
  {
    "id": "am-3184",
    "name": "AM-243-2S-BC-NEO Portable Crop Harvester With Reaper Attachment",
    "slug": "am-243-2s-bc-neo-portable-crop-harvester-with-reaper-attachment-3184",
    "sku": "RIPL036552",
    "riplCode": "RIPL036552",
    "modelNumber": "AM 243 BC Neo",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 29990,
    "comparePrice": 29990,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3184_1.jpg"
    ],
    "description": "Model: AM-243-BC-Neo  2 Stroke    Displacement: 43 CC    Power: 1.25kW/ 6500 RPM",
    "descriptionHtml": "<p><b>Model: </b>AM-243-BC-Neo  2 Stroke <b>  Displacement: </b>43 CC   <b> Power: </b>1.25kW/ 6500 RPM </p>",
    "specifications": {
      "Weed Cutter Model": "AM 243 BC Neo",
      "RIPL Code": "RIPL036552",
      "Brand": "AGRIMATE",
      "Model": "AM-243-BC-Neo 2 Stroke",
      "Displacement": "43 CC",
      "Power": "1.25kW/ 6500 RPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-243-2s-bc-neo-brush-cutter-with-reaper-attachment_2.pdf",
        "fileName": "am-243-2s-bc-neo-brush-cutter-with-reaper-attachment_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Tap & Go  2. 2 Tooth Blade   3. 80 feet Blade   4. Reaper attachment    5. Safety articles   6. Tool kit"
  },
  {
    "id": "am-2999",
    "name": "AM-EPS1-LS518-Electric Power Sprayer",
    "slug": "am-eps1-ls518-electric-power-sprayer-2999",
    "sku": "RIPL035730",
    "riplCode": "RIPL035730",
    "modelNumber": "AM-EPS1-LS518",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 30200,
    "comparePrice": 30200,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 73,
    "images": [
      "/images/products/agrimart/product_2999_1.jpg",
      "/images/products/agrimart/product_2999_2.jpg"
    ],
    "description": "Model:  AM EPS1-LS518    Motar: Single phase 1.5 HP with copper winding   Speed; 500-900rpm    Flow: 6-10L/ Min  Working pressure: 20-35 kgf/cm    Piston Dia: 18mm",
    "descriptionHtml": "<p><b>Model: </b> AM EPS1-LS518  <b>  Motar:</b> Single phase 1.5 HP with copper winding  <b> Speed;</b> 500-900rpm   <b>Flow: </b>6-10L/ Min  <b>Working pressure: </b>20-35 kgf/cm   <b>Piston Dia:</b> 18mm   </p>",
    "specifications": {
      "Sprayer Model": "AM-EPS1-LS518",
      "RIPL Code": "RIPL035730",
      "Brand": "AGRIMATE",
      "Model": "AM EPS1-LS518",
      "Motar": "Single phase 1.5 HP with copper winding",
      "Flow": "6-10L/ Min",
      "Working pressure": "20-35 kgf/cm",
      "Piston Dia": "18mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am-eps1-ls518-electric-power-sprayer-with-std-accessories-am-eps1-ls518_2.pdf",
        "fileName": "am-eps1-ls518-electric-power-sprayer-with-std-accessories-am-eps1-ls518_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2999_1.mp4",
        "fileName": "product_2999_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Suction hose 5mtr    2. By pass Hose 5mtr  3. Spray hose 8.5mm*50 mtr  4. Spray gun 2 feet"
  },
  {
    "id": "am-66",
    "name": "KZ-5000EA-2S-KASEI EARTH AUGER WITH BIT",
    "slug": "kz-5000ea-2s-kasei-earth-auger-with-bit-66",
    "sku": "RIPL026714",
    "riplCode": "RIPL026714",
    "modelNumber": "KZ-5000 EA -2S",
    "category": "Earth Auger",
    "categoryId": "cat-am-earth-auger",
    "price": 30580,
    "comparePrice": 30580,
    "brand": "KASEI",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_66_1.jpg",
      "/images/products/agrimart/product_66_2.jpg",
      "/images/products/agrimart/product_66_3.jpg"
    ],
    "description": "Reduction Rate: 37:1    Engine Type: Single cylinder cooling  2 cycle gasoline engine     Displacement: 50.8 CC    Fuel Tank Capacity:  0.9 L\nCarburetor: Diaphragm type    Starting Method: Recoil starter     Power/KW:  1.5KW/2HP     Net Weight: 9.5 Kg",
    "descriptionHtml": "<p><b>Reduction Rate: </b>37:1  <b>  Engine Type: </b>Single cylinder cooling  2 cycle gasoline engine    <b>Displacement:</b> 50.8 CC   Fuel Tank Capacity: 0.9 L<br><b>Carburetor:</b> Diaphragm type   <b>Starting Method: </b>Recoil starter<b>    Power/KW: </b>1.5KW/2HP    <b>Net Weight:</b> 9.5 Kg</p>",
    "specifications": {
      "Earth Auger Model": "KZ-5000 EA -2S",
      "RIPL Code": "RIPL026714",
      "Brand": "KASEI",
      "Reduction Rate": "37:1",
      "Engine Type": "Single cylinder cooling 2 cycle gasoline engine",
      "Displacement": "50.8 CC Fuel Tank Capacity: 0.9 L",
      "Carburetor": "Diaphragm type",
      "Starting Method": "Recoil starter",
      "Power/KW": "1.5KW/2HP",
      "Net Weight": "9.5 Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Illustrated Parts List",
        "url": "/agrimart-media/brochures/kasei-earth-auger-kz-5000-ea-2s-kz-5000-ea-2s_2.pdf",
        "fileName": "kasei-earth-auger-kz-5000-ea-2s-kz-5000-ea-2s_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Fuel mixing can    2. Standard tools    3. Safety kit"
  },
  {
    "id": "am-3486",
    "name": "OM EMAK ENGINE K900HR",
    "slug": "om-emak-engine-k900hr-3486",
    "sku": "RIPL037955",
    "riplCode": "RIPL037955",
    "modelNumber": "OM-K900HR",
    "category": "Engine",
    "categoryId": "cat-am-engine",
    "price": 30586,
    "comparePrice": 30586,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 26,
    "images": [
      "/images/products/agrimart/product_3486_1.jpg"
    ],
    "description": "Model  : K 900 H    Net Power :7.0 HP-5.2 kW/3600 rpm    Net Torque : 15.6 N.m/2600 rpm   BoreXStroke : 75mmx57mm   Displacement :252 cc      Starting : Recoil start    Fuel Capacity : 4.0 L     Oil capacity : 0.7 L    Dimension : 363x285x370 mm    Net Weight : 16.5 kg",
    "descriptionHtml": "<p><b>Model </b>: K 900 H    <b>Net Power</b> :7.0 HP-5.2 kW/3600 rpm    <b>Net Torque</b> : 15.6 N.m/2600 rpm  <b> BoreXStroke</b> : 75mmx57mm  <b> Displacement</b> :252 cc     <b>Starting</b> : Recoil start    <b>Fuel Capacity</b> : 4.0 L    <b>Oil capacity</b> : 0.7 L   <b> Dimension</b> : 363x285x370 mm    <b>Net Weight</b> : 16.5 kg</p>",
    "specifications": {
      "Engines": "OM-K900HR",
      "RIPL Code": "RIPL037955",
      "Brand": "OLEO MAC",
      "Model": "K 900 H",
      "Net Power": "7.0 HP-5.2 kW/3600 rpm",
      "Net Torque": "15.6 N.m/2600 rpm",
      "BoreXStroke": "75mmx57mm",
      "Displacement": "252 cc",
      "Starting": "Recoil start",
      "Fuel Capacity": "4.0 L",
      "Oil capacity": "0.7 L",
      "Dimension": "363x285x370 mm",
      "Net Weight": "16.5 kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/om-emak-engine-k900hr-om-k900hr.pdf",
        "fileName": "om-emak-engine-k900hr-om-k900hr.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-2051",
    "name": "GSH56-OLEO MAC CHAIN SAW",
    "slug": "gsh56-oleo-mac-chain-saw-2051",
    "sku": "RIPL028395",
    "riplCode": "RIPL028395",
    "modelNumber": "GSH56",
    "category": "Chain Saw",
    "categoryId": "cat-am-chain-saw",
    "price": 32340,
    "comparePrice": 32340,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 2,
    "images": [
      "/images/products/agrimart/product_2051_1.jpg",
      "/images/products/agrimart/product_2051_2.jpg",
      "/images/products/agrimart/product_2051_3.jpg"
    ],
    "description": "Power/Displacement :  3.5HP-2.6kW/54.5cm³    Bar length :  16\" 18” (Optional 20\" and 22\" bar)    Chain (pitch x gauge) : Oregon   .325” - 3/8”     Oil pump :  Automatic / Adjustable     Dry weight without bar and chain   :  5.4 Kg\nEasy Start, Wal brow, Oregon Bar and chain",
    "descriptionHtml": "<p>Power/Displacement : 3.5HP-2.6kW/54.5cm³   Bar length : 16\" 18” (Optional 20\" and 22\" bar)   Chain (pitch x gauge) : Oregon .325” - 3/8”    Oil pump : Automatic / Adjustable    Dry weight without bar and chain : 5.4 Kg<br></p><p><b>Easy Start, Wal brow, Oregon Bar and chain</b></p>",
    "specifications": {
      "Chain Saw Model": "GSH56",
      "RIPL Code": "RIPL028395",
      "Brand": "OLEO MAC",
      "Power/Displacement": "3.5HP-2.6kW/54.5cm³ Bar length : 16\" 18” (Optional 20\" and 22\" bar) Chain (pitch x gauge) : Oregon .325” - 3/8” Oil pump : Automatic / Adjustable Dry weight without bar and chain : 5.4 Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/gsh56-oleo-mac-chain-saw.pdf",
        "fileName": "gsh56-oleo-mac-chain-saw.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Parts List",
        "url": "/agrimart-media/brochures/om-chain-saw-gsh56_2.pdf",
        "fileName": "om-chain-saw-gsh56_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "https://www.youtube.com/embed/ngYXBXLIMQ0",
        "type": "youtube",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Bar Cover    2. Bar    3. Chain    4. Tools Kit"
  },
  {
    "id": "am-3309",
    "name": "GSH-56 Chain Saw",
    "slug": "gsh-56-chain-saw-3309",
    "sku": "DBT24069",
    "riplCode": "DBT24069",
    "modelNumber": "DBT",
    "category": "Chain Saw",
    "categoryId": "cat-am-chain-saw",
    "price": 32340,
    "comparePrice": 32340,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3309_1.jpg"
    ],
    "description": "Power/Displacement :  3.5 HP - 2.6 kW/54.5 cm³\nChain (pitch x gauge) :  Oregon .325” - 3/8”\nOil Pump :  A utomatic, Adjustable, Zero flow rate at idle speed\nOil/Fuel tank capacity :  0.27 L/0.5 L\nSound pressure/power level :  113/116 dB(A)\nLh/Rh vibration level :  7.2/7.0 m/s²",
    "descriptionHtml": "<p>Power/Displacement : 3.5 HP - 2.6 kW/54.5 cm³<br>Chain (pitch x gauge) : Oregon .325” - 3/8”<br>Oil Pump : Automatic, Adjustable, Zero flow rate at idle speed<br>Oil/Fuel tank capacity : 0.27 L/0.5 L<br>Sound pressure/power level : 113/116 dB(A)<br>Lh/Rh vibration level : 7.2/7.0 m/s²<br></p>",
    "specifications": {
      "Chain Saw Model": "DBT",
      "RIPL Code": "DBT24069",
      "Brand": "OLEO MAC",
      "Power/Displacement": "3.5 HP - 2.6 kW/54.5 cm³",
      "Chain (pitch x gauge)": "Oregon .325” - 3/8”",
      "Oil Pump": "A utomatic, Adjustable, Zero flow rate at idle speed",
      "Oil/Fuel tank capacity": "0.27 L/0.5 L",
      "Sound pressure/power level": "113/116 dB(A)",
      "Lh/Rh vibration level": "7.2/7.0 m/s²"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/gsh-56-chain-saw-dbt.pdf",
        "fileName": "gsh-56-chain-saw-dbt.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Bar Cover    2.  Bar    3.  Chain    4.  Std tools    5.  Safety articles"
  },
  {
    "id": "am-2822",
    "name": "KZ-5000 EA-PRO-2S WITH 6",
    "slug": "kz-5000-ea-pro-2s-with-6-2822",
    "sku": "RIPL033154",
    "riplCode": "RIPL033154",
    "modelNumber": "",
    "category": "Earth Auger",
    "categoryId": "cat-am-earth-auger",
    "price": 32980,
    "comparePrice": 32980,
    "brand": "KASEI",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 55,
    "images": [
      "/images/products/agrimart/product_2822_1.jpg",
      "/images/products/agrimart/product_2822_2.jpg",
      "/images/products/agrimart/product_2822_3.jpg"
    ],
    "description": "Model: 5000EA    Displacement: 50.8cc    Fuel Tank capacity: 0.9L    Carburetor: Diaphragm type    Start: Recoil   Power: 1.5kW/ 2HP    Net weight: 9.5Kg",
    "descriptionHtml": "<p><b>Model: </b>5000EA   <b>Displacement: </b>50.8cc   <b>Fuel Tank capacity: </b>0.9L   <b>Carburetor:</b> Diaphragm type   <b>Start:</b> Recoil   Power: 1.5kW/ 2HP   <b>Net weight:</b> 9.5Kg </p>",
    "specifications": {
      "RIPL Code": "RIPL033154",
      "Brand": "KASEI",
      "Model": "5000EA",
      "Displacement": "50.8cc",
      "Fuel Tank capacity": "0.9L",
      "Carburetor": "Diaphragm type",
      "Start": "Recoil Power: 1.5kW/ 2HP",
      "Net weight": "9.5Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View KZ LITERTAURE",
        "url": "/agrimart-media/brochures/kz-5000-ea-pro-2s-with-6.pdf",
        "fileName": "kz-5000-ea-pro-2s-with-6.pdf",
        "available": true
      },
      {
        "label": "View Manual Cum Part List",
        "url": "/agrimart-media/brochures/kz-5000ea-2s-with-6_2.pdf",
        "fileName": "kz-5000ea-2s-with-6_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2822_1.mp4",
        "fileName": "product_2822_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-2692",
    "name": "OM-GSH 56 -22 CHAINSAW",
    "slug": "om-gsh-56-22-chainsaw-2692",
    "sku": "RIPL029552",
    "riplCode": "RIPL029552",
    "modelNumber": "GSH56S",
    "category": "Chain Saw",
    "categoryId": "cat-am-chain-saw",
    "price": 33360,
    "comparePrice": 33360,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 12,
    "images": [
      "/images/products/agrimart/product_2692_1.jpg",
      "/images/products/agrimart/product_2692_2.jpg"
    ],
    "description": "Power/Displacement :  3.5 HP - 2.6 kW/54.5 cm³     Bar Length(Nose) : 20\"    Chain (pitch x gauge) :  3/8”*0.58\"   Oil Pump: A utomatic, Adjustable,    Oil/Fuel tank capacity :  0.26L/0.55L    Dry weight without bar and chain :5.1Kg",
    "descriptionHtml": "<p><b>Power/Displacement</b> : 3.5 HP - 2.6 kW/54.5 cm³    <b>Bar Length(Nose)</b>: 20\"   <b>Chain (pitch x gauge)</b> : 3/8”*0.58\"  <b>Oil Pump:</b> Automatic, Adjustable,   <b>Oil/Fuel tank capacity</b> : 0.26L/0.55L   <b>Dry weight without bar and chain</b>:5.1Kg<br></p>",
    "specifications": {
      "Chain Saw Model": "GSH56S",
      "RIPL Code": "RIPL029552",
      "Brand": "OLEO MAC",
      "Power/Displacement": "3.5 HP - 2.6 kW/54.5 cm³",
      "Bar Length(Nose)": "20\"",
      "Chain (pitch x gauge)": "3/8”*0.58\"",
      "Oil Pump": "A utomatic, Adjustable,",
      "Oil/Fuel tank capacity": "0.26L/0.55L",
      "Dry weight without bar and chain": "5.1Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Illustrated Parts List",
        "url": "/agrimart-media/brochures/oleo-mac-chain-saw-gsh-56-s-22-petrol-easy-start-gsh56s_2.pdf",
        "fileName": "oleo-mac-chain-saw-gsh-56-s-22-petrol-easy-start-gsh56s_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2692_1.mp4",
        "fileName": "product_2692_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Bar Cover 2. Bar 3. Chain 4. Tools Kit"
  },
  {
    "id": "am-1748",
    "name": "AAM-CFS-756 ULV-COLD FOG SPRAYER- MOBILE",
    "slug": "aam-cfs-756-ulv-cold-fog-sprayer-mobile-1748",
    "sku": "RIPL027083",
    "riplCode": "RIPL027083",
    "modelNumber": "AM-CFS-756 ULV",
    "category": "Fogger",
    "categoryId": "cat-am-fogger",
    "price": 33980,
    "comparePrice": 33980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 143,
    "images": [
      "/images/products/agrimart/product_1748_1.jpg",
      "/images/products/agrimart/product_1748_2.jpg",
      "/images/products/agrimart/product_1748_3.jpg"
    ],
    "description": "Tank capacity : 75L    Input power :  110V - 220V    Rpm:  9600    Flow rate : 2L/MIN    Power:  4.4KW    Gross weight : 20KG",
    "descriptionHtml": "<p>Tank capacity<b>: </b>75L   Input power<b>: </b>110V - 220V   Rpm: 9600   Flow rate<b>: </b>2L/MIN   Power: 4.4KW   Gross weight<b>: </b>20KG</p>",
    "specifications": {
      "Fogger Model": "AM-CFS-756 ULV",
      "RIPL Code": "RIPL027083",
      "Brand": "AGRIMATE",
      "Tank capacity": "75L Input power : 110V - 220V Rpm: 9600 Flow rate : 2L/MIN Power: 4.4KW Gross weight : 20KG"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/agrimate-cold-fog-sprayer-am-cfs-756-ulv-am-cfs-756-ulv_2.pdf",
        "fileName": "agrimate-cold-fog-sprayer-am-cfs-756-ulv-am-cfs-756-ulv_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-2603",
    "name": "AM-TH-V120- 60 Classic 2S TEA HARVESTER",
    "slug": "am-th-v120-60-classic-2s-tea-harvester-2603",
    "sku": "RIPL027049",
    "riplCode": "RIPL027049",
    "modelNumber": "AMTH-V120-60 CLASSIC",
    "category": "Harvester",
    "categoryId": "cat-am-harvester",
    "price": 33980,
    "comparePrice": 33980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 9,
    "images": [
      "/images/products/agrimart/product_2603_1.jpg"
    ],
    "description": "Engine power: 0.75HP    Displacement:  25.4CC   Engine transmission mode:  Automatic Configural clutch    Engine standard rotating rate: 7500 RPM     Clutch bonding rotating rate: 3700-3800   Starting: Recoil    Fuel mode: 2 stroke gasoline    Carburetor: Ruxing",
    "descriptionHtml": "<p><b>Engine power: </b>0.75HP   Displacement: 25.4CC  <b>Engine transmission mode:</b> Automatic Configural clutch   <b>Engine standard rotating rate: </b>7500 RPM    <b>Clutch bonding rotating rate: </b>3700-3800  <b>Starting:</b> Recoil   <b>Fuel mode:</b> 2 stroke gasoline    <b>Carburetor: </b>Ruxing</p>",
    "specifications": {
      "Harvester Model": "AMTH-V120-60 CLASSIC",
      "RIPL Code": "RIPL027049",
      "Brand": "AGRIMATE",
      "Engine power": "0.75HP Displacement: 25.4CC",
      "Engine transmission mode": "Automatic Configural clutch",
      "Engine standard rotating rate": "7500 RPM",
      "Clutch bonding rotating rate": "3700-3800",
      "Starting": "Recoil",
      "Fuel mode": "2 stroke gasoline",
      "Carburetor": "Ruxing"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual & Parts List",
        "url": "/agrimart-media/brochures/am-th-v120-60-classic-2-stroke-tea-harvester-with-standard-accessories-amth-v120-60-classic_2.pdf",
        "fileName": "am-th-v120-60-classic-2-stroke-tea-harvester-with-standard-accessories-amth-v120-60-classic_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Tea bags- 4 nos.   2. Spare blade- 1 set    3. Fly wheel- 1 no.   4. Spare fan cover- 1 set    5. Flexible cable    6. Grease gun    7. Oil can    8. Fuel mixing can    9. Standard tools    10. Funnel"
  },
  {
    "id": "am-2824",
    "name": "KZ-5000 EA-2S With 8",
    "slug": "kz-5000-ea-2s-with-8-2824",
    "sku": "RIPL033155",
    "riplCode": "RIPL033155",
    "modelNumber": "",
    "category": "Earth Auger",
    "categoryId": "cat-am-earth-auger",
    "price": 33980,
    "comparePrice": 33980,
    "brand": "KASEI",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 27,
    "images": [
      "/images/products/agrimart/product_2824_1.jpg"
    ],
    "description": "Model:  5000EA     Displacement:  50.8cc    Fuel Tank capacity:  0.9L    Carburetor:  Diaphragm type     Start:  Recoil   Power: 1.5kW/ 2HP     Net weight:  9.5Kg",
    "descriptionHtml": "<p>Model: 5000EA    Displacement: 50.8cc   Fuel Tank capacity: 0.9L   Carburetor: Diaphragm type    Start: Recoil   Power: 1.5kW/ 2HP    Net weight: 9.5Kg <br></p>",
    "specifications": {
      "RIPL Code": "RIPL033155",
      "Brand": "KASEI",
      "Model": "5000EA Displacement: 50.8cc Fuel Tank capacity: 0.9L Carburetor: Diaphragm type Start: Recoil Power: 1.5kW/ 2HP Net weight: 9.5Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Manual Cum Part List",
        "url": "/agrimart-media/brochures/kz-5000-ea-2s-with-8_2.pdf",
        "fileName": "kz-5000-ea-2s-with-8_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2824_1.mp4",
        "fileName": "product_2824_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3289",
    "name": "AM-LM-18PT-170P UNIVERSAL-18 LAWN MOWER PUSH TYPE",
    "slug": "am-lm-18pt-170p-universal-18-lawn-mower-push-type-3289",
    "sku": "RIPL036879",
    "riplCode": "RIPL036879",
    "modelNumber": "AM-LM-18PT",
    "category": "Lawn Mower",
    "categoryId": "cat-am-lawn-mower",
    "price": 33980,
    "comparePrice": 33980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 11,
    "images": [
      "/images/products/agrimart/product_3289_1.jpg",
      "/images/products/agrimart/product_3289_2.jpg"
    ],
    "description": "Model: AM-LM-18PT-170PT Cutting width: 46cm, 18\" Cutting Height: 25-75cm, 1\"- 3\" Displacement: 170 CC Deck Material: Steel",
    "descriptionHtml": "<p><b>Model: </b>AM-LM-18PT-170PT&nbsp; &nbsp;&nbsp;<b>Cutting width: </b>46cm, 18\"&nbsp; &nbsp;&nbsp;<b>Cutting Height: </b>25-75cm, 1\"- 3\"&nbsp; <b>&nbsp;Displacement: </b>170 CC&nbsp; &nbsp;&nbsp;<b>Deck Material:</b> Steel&nbsp; &nbsp;&nbsp;</p>",
    "specifications": {
      "Lawn Mower Model": "AM-LM-18PT",
      "RIPL Code": "RIPL036879",
      "Brand": "AGRIMATE",
      "Model": "AM-LM-18PT-170PT",
      "Cutting width": "46cm, 18\"",
      "Cutting Height": "25-75cm, 1\"- 3\"",
      "Displacement": "170 CC",
      "Deck Material": "Steel"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-lm-18pt-170p-universal-18-lawn-mower-push-type.pdf",
        "fileName": "am-lm-18pt-170p-universal-18-lawn-mower-push-type.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-lm-18pt-170p-universal-18-lawn-mower-push-type_2.pdf",
        "fileName": "am-lm-18pt-170p-universal-18-lawn-mower-push-type_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3289_1.mp4",
        "fileName": "product_3289_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3358",
    "name": "KZ-4000TP-PRO-2S KASEI TEA PRUNER 2 IN 1",
    "slug": "kz-4000tp-pro-2s-kasei-tea-pruner-2-in-1-3358",
    "sku": "RIPL036427",
    "riplCode": "RIPL036427",
    "modelNumber": "KZ-4000TP-PRO-2S",
    "category": "Pruner",
    "categoryId": "cat-am-pruner",
    "price": 33980,
    "comparePrice": 33980,
    "brand": "KASEI",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 64,
    "images": [
      "/images/products/agrimart/product_3358_1.jpg",
      "/images/products/agrimart/product_3358_2.jpg",
      "/images/products/agrimart/product_3358_3.jpg"
    ],
    "description": "Model: KZ-4000TP-Pro  Displacement: 40.2 CC  Power Output Max: 1.31kW/1.8HP/ 9900 RPM   F uel Tank capacity: 1.0Ltr  Type of handle: Low Vibration- Double grip  Weight: 11.9 KG",
    "descriptionHtml": "<p><b>Model: </b>KZ-4000TP-Pro  <b>Displacement: </b>40.2 CC  <b>Power Output Max:</b>1.31kW/1.8HP/ 9900 RPM   F<b>uel Tank capacity:</b> 1.0Ltr  <b>Type of handle: </b>Low Vibration- Double grip  <b>Weight: </b>11.9 KG</p>",
    "specifications": {
      "Pruner Model": "KZ-4000TP-PRO-2S",
      "RIPL Code": "RIPL036427",
      "Brand": "KASEI",
      "Model": "KZ-4000TP-Pro",
      "Displacement": "40.2 CC",
      "Power Output Max": "1.31kW/1.8HP/ 9900 RPM F",
      "uel Tank capacity": "1.0Ltr",
      "Type of handle": "Low Vibration- Double grip",
      "Weight": "11.9 KG"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/kz-4000tp-pro-2s-kasei-tea-pruner-2-in-1.pdf",
        "fileName": "kz-4000tp-pro-2s-kasei-tea-pruner-2-in-1.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/kz-4000-tp-pro-2s-with-blade-2-in-1-kz-4000tp-pro-2s_2.pdf",
        "fileName": "kz-4000-tp-pro-2s-with-blade-2-in-1-kz-4000tp-pro-2s_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3370",
    "name": "APW-63-MPG-PRO-2S AGRIMART MINI POWER WEEDER",
    "slug": "apw-63-mpg-pro-2s-agrimart-mini-power-weeder-3370",
    "sku": "RIPL036980",
    "riplCode": "RIPL036980",
    "modelNumber": "APW-63MPG-PRO",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 33980,
    "comparePrice": 33980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 77,
    "images": [
      "/images/products/agrimart/product_3370_1.jpg",
      "/images/products/agrimart/product_3370_2.jpg"
    ],
    "description": "Model: APW-63-MPG-PRO-2 Stroke    Displacement: 63 CC    Power: 3 HP    Weeding width: 43 CM    Weeding Depth: 20-25 CM",
    "descriptionHtml": "<p><b>Model: </b>APW-63-MPG-PRO-2 Stroke   <b>Displacement: </b>63 CC   <b>Power: </b>3 HP   <b>Weeding width:</b> 43 CM   <b>Weeding Depth: </b>20-25 CM </p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "APW-63MPG-PRO",
      "RIPL Code": "RIPL036980",
      "Brand": "AGRIMATE",
      "Model": "APW-63-MPG-PRO-2 Stroke",
      "Displacement": "63 CC",
      "Power": "3 HP",
      "Weeding width": "43 CM",
      "Weeding Depth": "20-25 CM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/apw-63-mpg-pro-agrimart-mini-power-weeder-apw-63mpg-pro_2.pdf",
        "fileName": "apw-63-mpg-pro-agrimart-mini-power-weeder-apw-63mpg-pro_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-1027",
    "name": "PW121C -ELCTRIC-OM HIGH PRESSURE CLEANER",
    "slug": "pw121c-elctric-om-high-pressure-cleaner-1027",
    "sku": "RIPL010048",
    "riplCode": "RIPL010048",
    "modelNumber": "PW121C",
    "category": "Pressure Washer",
    "categoryId": "cat-am-pressure-washer",
    "price": 34400,
    "comparePrice": 34400,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 7,
    "images": [
      "/images/products/agrimart/product_1027_5.jpg",
      "/images/products/agrimart/product_1027_6.jpg",
      "/images/products/agrimart/product_1027_7.jpg",
      "/images/products/agrimart/product_1027_8.jpg"
    ],
    "description": "Max Pressure: 130 bar     Max flow rate: 360L/h      Rated Power: 1700W     Voltage: 230 V    Pump: Metal     Hose reel: Yes",
    "descriptionHtml": "<p><b>Max Pressure: </b>130 bar    <b>Max flow rate:</b> 360L/h     <b>Rated Power:</b> 1700W    <b>Voltage: </b>230 V   <b>Pump:</b> Metal    <b>Hose reel:</b> Yes</p>",
    "specifications": {
      "Pressure Washer Model": "PW121C",
      "RIPL Code": "RIPL010048",
      "Brand": "OLEO MAC",
      "Max Pressure": "130 bar",
      "Max flow rate": "360L/h",
      "Rated Power": "1700W",
      "Voltage": "230 V",
      "Pump": "Metal",
      "Hose reel": "Yes"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/om-high-pressure-cleaner-pw121c-elctric-pw121c.pdf",
        "fileName": "om-high-pressure-cleaner-pw121c-elctric-pw121c.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Parts List",
        "url": "/agrimart-media/brochures/om-high-pressure-cleaner-pw121c-elctric-pw121c_2.pdf",
        "fileName": "om-high-pressure-cleaner-pw121c-elctric-pw121c_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1027.mp4",
        "fileName": "product_1027.mp4",
        "type": "mp4",
        "available": false
      }
    ],
    "accessoriesInfo": "1. Un with\nprotection   2.   Lance\nwith adjustable nozzle head    3.  Drain\nclearing nozzle    4.   Foaming\nlance    5. Water\nfilter fit    6.   Hose\nreel thermoplastic hose    7.   Fixed\nbrush   8.   Rotary\nbrush"
  },
  {
    "id": "am-70",
    "name": "KZ-6300 EA-NEO 2S- KASEI EARTH AUGER WITH 8 inch bit",
    "slug": "kz-6300-ea-neo-2s-kasei-earth-auger-with-8-inch-bit-70",
    "sku": "RIPL019625",
    "riplCode": "RIPL019625",
    "modelNumber": "KZ-6300 EA -NEO 2S",
    "category": "Earth Auger",
    "categoryId": "cat-am-earth-auger",
    "price": 34980,
    "comparePrice": 34980,
    "brand": "KASEI",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 61,
    "images": [
      "/images/products/agrimart/product_70_1.jpg",
      "/images/products/agrimart/product_70_2.jpg",
      "/images/products/agrimart/product_70_3.jpg"
    ],
    "description": "Displacement:  63.3CC     Power output: 2.0KW/7700 RPM      Fuel tank capacity:  1.3L  Auger bit diameter : 8\"     Weight: 10.4KG",
    "descriptionHtml": "<p><b>Displacement: </b>63.3CC    <b>Power output: </b>2.0KW/7700 RPM     <b>Fuel tank capacity: </b>1.3L  <b>Auger bit diameter</b><b>: </b>8\"    <b>Weight:</b> 10.4KG</p>",
    "specifications": {
      "Earth Auger Model": "KZ-6300 EA -NEO 2S",
      "RIPL Code": "RIPL019625",
      "Brand": "KASEI",
      "Displacement": "63.3CC",
      "Power output": "2.0KW/7700 RPM",
      "Fuel tank capacity": "1.3L",
      "Weight": "10.4KG"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/kasei-earth-auger-kz-6300-ea-neo-2s-kz-6300-ea-neo-2s.pdf",
        "fileName": "kasei-earth-auger-kz-6300-ea-neo-2s-kz-6300-ea-neo-2s.pdf",
        "available": true
      },
      {
        "label": "View User Manual",
        "url": "/agrimart-media/brochures/kasei-earth-auger-kz-6300-ea-neo-2s-kz-6300-ea-neo-2s_2.pdf",
        "fileName": "kasei-earth-auger-kz-6300-ea-neo-2s-kz-6300-ea-neo-2s_2.pdf",
        "available": true
      },
      {
        "label": "View Diagram List",
        "url": "/agrimart-media/brochures/kasei-earth-auger-kz-6300-ea-neo-2s-kz-6300-ea-neo-2s_3.pdf",
        "fileName": "kasei-earth-auger-kz-6300-ea-neo-2s-kz-6300-ea-neo-2s_3.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_70_1.mp4",
        "fileName": "product_70_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Fuel mixing can   2. Standard tools   3. Safety kit    4. Mask"
  },
  {
    "id": "am-3372",
    "name": "APW-63-MPG-NEO-2S AGRIMATE MINI POWER WEEDER",
    "slug": "apw-63-mpg-neo-2s-agrimate-mini-power-weeder-3372",
    "sku": "RIPL036979",
    "riplCode": "RIPL036979",
    "modelNumber": "APW-63MPG-NEO",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 35000,
    "comparePrice": 35000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 107,
    "images": [
      "/images/products/agrimart/product_3372_1.jpg",
      "/images/products/agrimart/product_3372_2.jpg"
    ],
    "description": "Model: APW-63-MPG-NEO-2 Stroke    Displacement: 63 CC    Power: 3HP   Weeding width: 43 CM    Weeding Depth: 20-25 CM",
    "descriptionHtml": "<p><b>Model: </b>APW-63-MPG-NEO-2 Stroke <b>  Displacement: </b>63 CC   <b>Power: </b>3HP  <b>Weeding width:</b> 43 CM   <b>Weeding Depth: </b>20-25 CM </p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "APW-63MPG-NEO",
      "RIPL Code": "RIPL036979",
      "Brand": "AGRIMATE",
      "Model": "APW-63-MPG-NEO-2 Stroke",
      "Displacement": "63 CC",
      "Power": "3HP",
      "Weeding width": "43 CM",
      "Weeding Depth": "20-25 CM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/apw-63-mpg-neo-2s-agrimart-mini-power-weeder-apw-63mpg-neo_2.pdf",
        "fileName": "apw-63-mpg-neo-2s-agrimart-mini-power-weeder-apw-63mpg-neo_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-423",
    "name": "BCH-40T BC-PETROL - OLEOMAC WEED CUTTER/ POWER WEEDER",
    "slug": "bch-40t-bc-petrol-oleomac-weed-cutter-power-weeder-423",
    "sku": "RIPL026339",
    "riplCode": "RIPL026339",
    "modelNumber": "BCH 40T",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 37236,
    "comparePrice": 37236,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 46,
    "images": [
      "/images/products/agrimart/product_423_1.jpg",
      "/images/products/agrimart/product_423_2.jpg",
      "/images/products/agrimart/product_423_3.jpg"
    ],
    "description": "Power: 2.0 HP -\n1.5 kW    Displacement : 40.2 cm³    Cutting components : 130 mm dia.  Tap & Go EVO line\nhead with 2.40 mm line - 255 mm dia. disc with 3  blades\nGrip: Handle Bar    Tube diameter : 26 MM    Fuel tank capacity : 0.86 L   weight : 9.9  KG   Harness : Double",
    "descriptionHtml": "<p><b>  <br>\r\nPower: </b>2.0 HP -\r\n1.5 kW   <b>Displacement</b>: 40.2 cm³   <b>Cutting components : </b>130 mm dia. Tap & Go EVO line\r\nhead with 2.40 mm line - 255 mm dia. disc with 3 blades <br><b>Grip: </b>Handle Bar   <b>Tube diameter : </b>26 MM   <b>Fuel tank capacity : </b>0.86 L  <b> weight : </b>9.9 KG  <b> Harness :</b> Double </p>",
    "specifications": {
      "Weed Cutter Model": "BCH 40T",
      "RIPL Code": "RIPL026339",
      "Brand": "OLEO MAC",
      "Power": "2.0 HP - 1.5 kW",
      "Displacement": "40.2 cm³",
      "Cutting components": "130 mm dia. Tap & Go EVO line head with 2.40 mm line - 255 mm dia. disc with 3 blades",
      "Grip": "Handle Bar",
      "Tube diameter": "26 MM",
      "Fuel tank capacity": "0.86 L",
      "weight": "9.9 KG",
      "Harness": "Double"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/om-weed-cutterpower-weeder-bch-40t-petrol-bch-40t.pdf",
        "fileName": "om-weed-cutterpower-weeder-bch-40t-petrol-bch-40t.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Part List",
        "url": "/agrimart-media/brochures/om-weed-cutterpower-weeder-bch-40t-petrol-bch-40t_2.pdf",
        "fileName": "om-weed-cutterpower-weeder-bch-40t-petrol-bch-40t_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Tap and go    2.  Tool kit"
  },
  {
    "id": "am-406",
    "name": "SPARTA-BCH-40 BP-PETROL - OLEOMAC WEED CUTTER / POWER WEEDER",
    "slug": "sparta-bch-40-bp-petrol-oleomac-weed-cutter-power-weeder-406",
    "sku": "RIPL026340",
    "riplCode": "RIPL026340",
    "modelNumber": "BCH 40BP",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 37584,
    "comparePrice": 37584,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 19,
    "images": [
      "/images/products/agrimart/product_406_1.jpg",
      "/images/products/agrimart/product_406_2.jpg",
      "/images/products/agrimart/product_406_3.jpg"
    ],
    "description": "Power/Displacement: 2.0 HP - 1.5 kW/40.2cc   Tube diameter: 26MM    Cutting Components: 130MM Tap&Go EVO line head with 2.40MM Line\nGrip: Single   Harness: Double    Dry Weight without cutting tools: 9.9 KG (40 BP)  10.3 Kg (400 BP)    LH/RH Vibration Level: 4.6 / 3.3 M/S    Fuel Tank Capacity : 0.86L",
    "descriptionHtml": "<p><b>Power/Displacement: </b>2.0 HP - 1.5 kW/40.2cc <b> Tube diameter:</b> 26MM   <b>Cutting Components: </b>130MM Tap&Go EVO line head with 2.40MM Line<br>Grip: Single  <b>Harness:</b> Double   <b>Dry Weight without cutting tools: </b>9.9 KG (40 BP)  10.3 Kg (400 BP)    <b>LH/RH Vibration Level: </b>4.6 / 3.3 M/S    <b>Fuel Tank Capacity</b> : 0.86L</p>",
    "specifications": {
      "Weed Cutter Model": "BCH 40BP",
      "RIPL Code": "RIPL026340",
      "Brand": "OLEO MAC",
      "Power/Displacement": "2.0 HP - 1.5 kW/40.2cc",
      "Tube diameter": "26MM",
      "Cutting Components": "130MM Tap&Go EVO line head with 2.40MM Line Grip: Single",
      "Harness": "Double",
      "Dry Weight without cutting tools": "9.9 KG (40 BP) 10.3 Kg (400 BP)",
      "LH/RH Vibration Level": "4.6 / 3.3 M/S",
      "Fuel Tank Capacity": "0.86L"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/sparta-bch-40-bp-petrol-oleomac-weed-cutter-power-weeder.pdf",
        "fileName": "sparta-bch-40-bp-petrol-oleomac-weed-cutter-power-weeder.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Part List",
        "url": "/agrimart-media/brochures/om-weed-cutter-power-weeder-bch-40bp-petrol-bch-40bp_2.pdf",
        "fileName": "om-weed-cutter-power-weeder-bch-40bp-petrol-bch-40bp_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Blade    2.  Tap and go    3.    Tool kit"
  },
  {
    "id": "am-1839",
    "name": "KZ-2700 PPH-PRO-2S KASEI TELESCOPIC POLE PRUNER",
    "slug": "kz-2700-pph-pro-2s-kasei-telescopic-pole-pruner-1839",
    "sku": "RIPL019626",
    "riplCode": "RIPL019626",
    "modelNumber": "KZ-2700 PPH",
    "category": "Pruner",
    "categoryId": "cat-am-pruner",
    "price": 37980,
    "comparePrice": 37980,
    "brand": "KASEI",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 56,
    "images": [
      "/images/products/agrimart/product_1839_1.jpg"
    ],
    "description": "Displacement: 27.2CC    Power Output:  Max 0.7KW / 0.9 HP/ 9000RPM    Oil Tank Capacity: 0.2L   Fuel Tank Capacity: 0.7L       Length of Main Pipe Section:  2900-4250(MM) telescopic    Weight: 8.3Kg",
    "descriptionHtml": "<p><b>Displacement:</b> 27.2CC   <b>Power Output:</b> Max 0.7KW / 0.9 HP/ 9000RPM   <b>Oil Tank Capacity:</b> 0.2L  <b> Fuel Tank Capacity: </b>0.7L<b>   </b> <b>Length</b> <b>of Main Pipe Section: </b>2900-4250(MM) telescopic   <b>Weight: </b>8.3Kg</p>",
    "specifications": {
      "Pruner Model": "KZ-2700 PPH",
      "RIPL Code": "RIPL019626",
      "Brand": "KASEI",
      "Displacement": "27.2CC",
      "Power Output": "Max 0.7KW / 0.9 HP/ 9000RPM",
      "Oil Tank Capacity": "0.2L",
      "Fuel Tank Capacity": "0.7L",
      "of Main Pipe Section": "2900-4250(MM) telescopic",
      "Weight": "8.3Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/kz-2700-pph-pro-2s-kasei-telescopic-pole-pruner-kz-2700-pph.pdf",
        "fileName": "kz-2700-pph-pro-2s-kasei-telescopic-pole-pruner-kz-2700-pph.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/kasei-pole-pruner-kz-2700-pph-pro-2s-kz-2700-pph_2.pdf",
        "fileName": "kasei-pole-pruner-kz-2700-pph-pro-2s-kz-2700-pph_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1839_1.mp4",
        "fileName": "product_1839_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. 10\" bar- 2 nos.    2. Chain - 2 nos.  3. Bar cover  4. Safety kit    5. Fuel mixing can   6. Standard tools  7. Mask"
  },
  {
    "id": "am-3291",
    "name": "AM-LM-18SP-170P ULTIMATE-18 LAWN MOWER- Self Propelled",
    "slug": "am-lm-18sp-170p-ultimate-18-lawn-mower-self-propelled-3291",
    "sku": "RIPL036880",
    "riplCode": "RIPL036880",
    "modelNumber": "AM-LM-18SP",
    "category": "Lawn Mower",
    "categoryId": "cat-am-lawn-mower",
    "price": 37980,
    "comparePrice": 37980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3291_1.jpg",
      "/images/products/agrimart/product_3291_2.jpg"
    ],
    "description": "Model: AM-LM-18SP-170P    Cutting width: 46cm, 18\"    Cutting Height: 25-75Cm, 1\"- 3\"   Displacement: 170CC   Deck Material: Steel    Grass Bag:  60Ltr",
    "descriptionHtml": "<p><b>Model: </b>AM-LM-18SP-170P   <b>Cutting width: </b>46cm, 18\"   <b>Cutting Height: </b>25-75Cm, 1\"- 3\"  <b> Displacement: </b>170CC  <b> Deck Material:</b> Steel    <b>Grass Bag:</b> 60Ltr<br></p>",
    "specifications": {
      "Lawn Mower Model": "AM-LM-18SP",
      "RIPL Code": "RIPL036880",
      "Brand": "AGRIMATE",
      "Model": "AM-LM-18SP-170P",
      "Cutting width": "46cm, 18\"",
      "Cutting Height": "25-75Cm, 1\"- 3\"",
      "Displacement": "170CC",
      "Deck Material": "Steel",
      "Grass Bag": "60Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-lm-18sp-170p-ultimate-18-lawn-mower-self-propelled.pdf",
        "fileName": "am-lm-18sp-170p-ultimate-18-lawn-mower-self-propelled.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-lm-18sp-170p-ultimate-18-lawn-mower-self-propelled_2.pdf",
        "fileName": "am-lm-18sp-170p-ultimate-18-lawn-mower-self-propelled_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3291_1.mp4",
        "fileName": "product_3291_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3424",
    "name": "BV 250 - BLOWER – HANDHELD",
    "slug": "bv-250-blower-handheld-3424",
    "sku": "RIPL037328",
    "riplCode": "RIPL037328",
    "modelNumber": "BV 250",
    "category": "Blower & Mist Blower",
    "categoryId": "cat-am-blower-mistblower",
    "price": 38264,
    "comparePrice": 38264,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 9,
    "images": [
      "/images/products/agrimart/product_3424_1.jpg",
      "/images/products/agrimart/product_3424_2.jpg",
      "/images/products/agrimart/product_3424_3.jpg"
    ],
    "description": "Model: BV 250     Power: 1.3 HP-1.0 kW     Displacement : 25.4 cm³    Max air Volume :  720 m3/hr      Max. air Speed :  70 m/s    Collection bag capacity : 36 L    Dry Weight without blower tube :  3.7 kg",
    "descriptionHtml": "<p><b>Model: </b>BV 250<b>    Power: </b>1.3 HP-1.0 kW<b>    Displacement </b>: 25.4 cm³    <b>Max air Volume : </b>720 m3/hr     <b>Max. air Speed : </b> 70 m/s   <b>Collection bag capacity</b> : 36 L    <b>Dry Weight without blower tube : </b>3.7 kg</p><p><br></p>",
    "specifications": {
      "Blower Model": "BV 250",
      "RIPL Code": "RIPL037328",
      "Brand": "OLEO MAC",
      "Model": "BV 250",
      "Power": "1.3 HP-1.0 kW",
      "Displacement": "25.4 cm³",
      "Max air Volume": "720 m3/hr",
      "Max. air Speed": "70 m/s",
      "Collection bag capacity": "36 L",
      "Dry Weight without blower tube": "3.7 kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/bv-250-blower-handheld-bv-250.pdf",
        "fileName": "bv-250-blower-handheld-bv-250.pdf",
        "available": true
      },
      {
        "label": "View Diagram and Part list",
        "url": "/agrimart-media/brochures/bv-250-blower-handheld-bv-250_2.pdf",
        "fileName": "bv-250-blower-handheld-bv-250_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-1718",
    "name": "SUPER 3000-GOLD-AUTO-MINI FOG SPRAYER",
    "slug": "super-3000-gold-auto-mini-fog-sprayer-1718",
    "sku": "RIPL026439",
    "riplCode": "RIPL026439",
    "modelNumber": "3000 GOLD",
    "category": "Fogger",
    "categoryId": "cat-am-fogger",
    "price": 39980,
    "comparePrice": 39980,
    "brand": "SUPER GOLD",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 9,
    "images": [
      "/images/products/agrimart/product_1718_1.jpg",
      "/images/products/agrimart/product_1718_2.jpg",
      "/images/products/agrimart/product_1718_3.jpg"
    ],
    "description": "Model :  Super 3000 Gold Fog sprayer    Fuel :   Fuel liquified butane gas    Capacity of chemical tank  : 3L    Weight (empty)  : 4Kg",
    "descriptionHtml": "<p>Model : Super 3000 Gold Fog sprayer   Fuel :  Fuel liquified butane gas   Capacity of chemical tank : 3L   Weight (empty) : 4Kg<br></p>",
    "specifications": {
      "Fogger Model": "3000 GOLD",
      "RIPL Code": "RIPL026439",
      "Brand": "SUPER GOLD",
      "Model": "Super 3000 Gold Fog sprayer Fuel : Fuel liquified butane gas Capacity of chemical tank : 3L Weight (empty) : 4Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": false,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": "Carrying belt"
  },
  {
    "id": "am-3261",
    "name": "AMTH-V120-60 PRO-2S TEA HARVESTER",
    "slug": "amth-v120-60-pro-2s-tea-harvester-3261",
    "sku": "RIPL027048",
    "riplCode": "RIPL027048",
    "modelNumber": "AMTH-V-120-60",
    "category": "Harvester",
    "categoryId": "cat-am-harvester",
    "price": 39980,
    "comparePrice": 39980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 245,
    "images": [
      "/images/products/agrimart/product_3261_1.jpg",
      "/images/products/agrimart/product_3261_2.jpg",
      "/images/products/agrimart/product_3261_3.jpg"
    ],
    "description": "Power: 1 HP    Speed: 7500    Displacement: 25.4CC    Fuel Consumption: 750~800 ml/hr      Engine/Fuel: 2-Stroke/Petrol Mix    Out Put: 425 kg/hr",
    "descriptionHtml": "<p><b>Power: </b>1 HP    <b>Speed:</b> 7500   <b>Displacement: </b>25.4CC   <b>Fuel Consumption: </b>750~800 ml/hr     <b>Engine/Fuel: </b>2-Stroke/Petrol Mix    <b>Out Put:</b> 425 kg/hr<br></p>",
    "specifications": {
      "Harvester Model": "AMTH-V-120-60",
      "RIPL Code": "RIPL027048",
      "Brand": "AGRIMATE",
      "Power": "1 HP",
      "Speed": "7500",
      "Displacement": "25.4CC",
      "Fuel Consumption": "750~800 ml/hr",
      "Engine/Fuel": "2-Stroke/Petrol Mix",
      "Out Put": "425 kg/hr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/amth-v120-60-pro-2s-agrimate-tea-harvester-amth-v-120-60_2.pdf",
        "fileName": "amth-v120-60-pro-2s-agrimate-tea-harvester-amth-v-120-60_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Tool Kit     2. Oil Can    3. Fuel Filter    4. Fuel Can    5. Tea Leaf Bag     6. Grease Gun   7. NGK Spark Plug"
  },
  {
    "id": "am-3554",
    "name": "AM-CCM-CB1200-GT CHAFF CUTTER WITH CONVEYOR BELT",
    "slug": "am-ccm-cb1200-gt-chaff-cutter-with-conveyor-belt-3554",
    "sku": "RIPL038707",
    "riplCode": "RIPL038707",
    "modelNumber": "AM-CCM-CB1200-GT-4B3H -WP",
    "category": "Chaff Cutter",
    "categoryId": "cat-am-chaff-cutter",
    "price": 39980,
    "comparePrice": 39980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 126,
    "images": [
      "/images/products/agrimart/product_3554_1.jpg",
      "/images/products/agrimart/product_3554_2.jpg",
      "/images/products/agrimart/product_3554_3.jpg"
    ],
    "description": "Model:  AM-CCM-CB1200-GT       Power:  2.2KW/3HP-Copper Winding      Motor Voltage:   220v, 50HZ     Blades:  6 BLADES  (5Rotating + 1Fixed)   Chipping      Capacity:  upto   1000Kg/Hr",
    "descriptionHtml": "<p>Model: AM-CCM-CB1200-GT    Power: 2.2KW/3HP-Copper Winding    <b>Motor Voltage:</b> 220v, 50HZ    Blades: 6 BLADES (5Rotating + 1Fixed)  <b>Chipping   </b><b> </b>Capacity:  upto 1000Kg/Hr   </p>",
    "specifications": {
      "Chaff Cutter Model": "AM-CCM-CB1200-GT-4B3H -WP",
      "RIPL Code": "RIPL038707",
      "Brand": "AGRIMATE",
      "Motor Voltage": "220v, 50HZ Blades: 6 BLADES (5Rotating + 1Fixed)"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": false,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-ccm-cb1200-gt-chaff-cutter-with-conveyor-belt-am-ccm-cb1200-gt-4b3h-wp.pdf",
        "fileName": "am-ccm-cb1200-gt-chaff-cutter-with-conveyor-belt-am-ccm-cb1200-gt-4b3h-wp.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-ccm-cb1200-gt-4b3h-wp-chaff-cutter-with-conveyor-belt-am-ccm-cb1200-gt-4b3h-wp_2.pdf",
        "fileName": "am-ccm-cb1200-gt-4b3h-wp-chaff-cutter-with-conveyor-belt-am-ccm-cb1200-gt-4b3h-wp_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . 6 Blades (5 Rotating +1 Fixed Blade)         2 . Conveyor Belt-1200mm"
  },
  {
    "id": "am-3378",
    "name": "AMTP-MC43-2S-DELITE TEA PRUNER WITH METAL CUTCH",
    "slug": "amtp-mc43-2s-delite-tea-pruner-with-metal-cutch-3378",
    "sku": "RIPL037700",
    "riplCode": "RIPL037700",
    "modelNumber": "AMTP-MC43-2S-NEO",
    "category": "Pruner",
    "categoryId": "cat-am-pruner",
    "price": 40100,
    "comparePrice": 40100,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 544,
    "images": [
      "/images/products/agrimart/product_3378_1.jpg",
      "/images/products/agrimart/product_3378_2.jpg"
    ],
    "description": "Model : AMTP-MC43-2S Engine Type : 2Stroke Power : 7500RPM Displacement :43CC Tank Capacity :1.2Ltr",
    "descriptionHtml": "<p><b>Model</b>: AMTP-MC43-2S&nbsp; &nbsp;<b>Engine Type</b>: 2Stroke&nbsp; &nbsp;<b>Power</b>: 7500RPM&nbsp; &nbsp;<b>Displacement</b>:43CC&nbsp; &nbsp;<b>Tank Capacity</b>:1.2Ltr</p>",
    "specifications": {
      "Pruner Model": "AMTP-MC43-2S-NEO",
      "RIPL Code": "RIPL037700",
      "Brand": "AGRIMATE",
      "Model": "AMTP-MC43-2S",
      "Engine Type": "2Stroke",
      "Power": "7500RPM",
      "Displacement": "43CC",
      "Tank Capacity": "1.2Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/amtp-mc43-2s-delite-tea-pruner-with-metal-cutch.pdf",
        "fileName": "amtp-mc43-2s-delite-tea-pruner-with-metal-cutch.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "Tool Kit"
  },
  {
    "id": "am-644",
    "name": "AMWL-432-WETLAND WEEDER",
    "slug": "amwl-432-wetland-weeder-644",
    "sku": "RIPL012795",
    "riplCode": "RIPL012795",
    "modelNumber": "AM-WL-432",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 43980,
    "comparePrice": 43980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 14,
    "images": [
      "/images/products/agrimart/product_644_1.jpg",
      "/images/products/agrimart/product_644_2.jpg",
      "/images/products/agrimart/product_644_3.jpg",
      "/images/products/agrimart/product_644_4.jpg"
    ],
    "description": "Displacement:  1.4 KW / 7500 RPM (42.7CC)     Starter System: Recoil starter (Easy starter)    Carburetion System: Diaphragm    Clutch System: Centrifugal\nDrive System Worm: Gear (40:1 reduction)    Tine Width: Adjustable 75-100MM     Tine Diameter:  314mm    Cultivating Depth:  94mm",
    "descriptionHtml": "<p><b>Displacement: </b>1.4 KW / 7500 RPM (42.7CC)    <b>Starter System:</b> Recoil starter (Easy starter)   <b>Carburetion System:</b> Diaphragm   <b>Clutch System:</b> Centrifugal<br><b>Drive System Worm:</b> Gear (40:1 reduction)   <b> Tine Width:</b> Adjustable 75-100MM    <b>Tine Diameter: </b>314mm   <b>Cultivating Depth: </b>94mm</p><p><br></p><p><br></p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-WL-432",
      "RIPL Code": "RIPL012795",
      "Brand": "AGRIMATE",
      "Displacement": "1.4 KW / 7500 RPM (42.7CC)",
      "Starter System": "Recoil starter (Easy starter)",
      "Carburetion System": "Diaphragm",
      "Clutch System": "Centrifugal",
      "Drive System Worm": "Gear (40:1 reduction)",
      "Tine Width": "Adjustable 75-100MM",
      "Tine Diameter": "314mm",
      "Cultivating Depth": "94mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/agrimate-rotary-power-weeder-wetland-amwl-432-am-wl-432.pdf",
        "fileName": "agrimate-rotary-power-weeder-wetland-amwl-432-am-wl-432.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/agrimate-rotary-power-weeder-wetland-amwl-432-am-wl-432_2.pdf",
        "fileName": "agrimate-rotary-power-weeder-wetland-amwl-432-am-wl-432_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_644_1.mp4",
        "fileName": "product_644_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Blade\n16 No's,    2. Tool kit."
  },
  {
    "id": "am-3418",
    "name": "AM-CTG-1680 CORN THRESHER WITH MOTOR",
    "slug": "am-ctg-1680-corn-thresher-with-motor-3418",
    "sku": "RIPL036957",
    "riplCode": "RIPL036957",
    "modelNumber": "AM-CTG-1680",
    "category": "Thresher",
    "categoryId": "cat-am-thresher",
    "price": 43980,
    "comparePrice": 43980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 7,
    "images": [
      "/images/products/agrimart/product_3418_1.jpg",
      "/images/products/agrimart/product_3418_2.jpg"
    ],
    "description": "Model:  AM-CTG-1680     Power: 3 HP    Phase:  1 PH     Motor Voltage:  220V,50HZ",
    "descriptionHtml": "<p>Model: AM-CTG-1680<b> </b>  Power: 3 HP   Phase: 1 PH    Motor Voltage: 220V,50HZ </p>",
    "specifications": {
      "Thresher": "AM-CTG-1680",
      "RIPL Code": "RIPL036957",
      "Brand": "AGRIMATE",
      "Model": "AM-CTG-1680 Power: 3 HP Phase: 1 PH Motor Voltage: 220V,50HZ"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3432",
    "name": "AM-RTP-170-7P PRO INTERCULTIVATOR / POWER WEEDER",
    "slug": "am-rtp-170-7p-pro-intercultivator-power-weeder-3432",
    "sku": "RIPL037037",
    "riplCode": "RIPL037037",
    "modelNumber": "AM-RTP-170-7P",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 43980,
    "comparePrice": 43980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 198,
    "images": [
      "/images/products/agrimart/product_3432_1.jpg",
      "/images/products/agrimart/product_3432_2.jpg"
    ],
    "description": "Model:  AM-RTP-170-7P     Power :  5.2kw/3600 RPM    Displacement:  212CC    Fuel tank capacity:  3.6Ltr    Cultivating width:  1000   mm    Depth:  100-250mm    Cultivating Blades:  32Nos    Gear : 2Forward+1Reverse",
    "descriptionHtml": "<p>Model: AM-RTP-170-7P   Power : 5.2kw/3600 RPM   Displacement: 212CC   Fuel tank capacity: 3.6Ltr   Cultivating width: 1000 mm   Depth: 100-250mm   Cultivating Blades: 32Nos   <b>Gear</b>: 2Forward+1Reverse  </p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-RTP-170-7P",
      "RIPL Code": "RIPL037037",
      "Brand": "AGRIMATE",
      "Gear": "2Forward+1Reverse"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-rtp-170-7p-pro-intercultivator-power-weeder-am-rtp-170-7p.pdf",
        "fileName": "am-rtp-170-7p-pro-intercultivator-power-weeder-am-rtp-170-7p.pdf",
        "available": true
      },
      {
        "label": "View Engine User Manual",
        "url": "/agrimart-media/brochures/am-rtp-170-7p-pro-intercultivator-power-weeder-am-rtp-170-7p_2.pdf",
        "fileName": "am-rtp-170-7p-pro-intercultivator-power-weeder-am-rtp-170-7p_2.pdf",
        "available": true
      },
      {
        "label": "View Transmission User Manual",
        "url": "/agrimart-media/brochures/am-rtp-170-7p-pro-intercultivator-power-weeder-am-rtp-170-7p_3.pdf",
        "fileName": "am-rtp-170-7p-pro-intercultivator-power-weeder-am-rtp-170-7p_3.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . Tyre with Tube     2.  Side disc     3.  Plough attachment      4.  Tilling blades 32 Nos"
  },
  {
    "id": "am-3283",
    "name": "AM-500HC-4S-BC-PRO- BRUSH CUTTER",
    "slug": "am-500hc-4s-bc-pro-brush-cutter-3283",
    "sku": "RIPL036870",
    "riplCode": "RIPL036870",
    "modelNumber": "AM-500HC-PRO",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 43990,
    "comparePrice": 43990,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 26,
    "images": [
      "/images/products/agrimart/product_3283_1.jpg",
      "/images/products/agrimart/product_3283_2.jpg"
    ],
    "description": "Model: AM-500HC-BC-PRO    Engine Type: 4 Stroke    Displacement: 50CC      Fuel Tank Capacity: 0.9Ltr",
    "descriptionHtml": "<p><b>Model: </b>AM-500HC-BC-PRO   <b>Engine Type: </b>4 Stroke    <b>Displacement:</b> 50CC     <b>Fuel Tank Capacity: </b>0.9Ltr<br></p>",
    "specifications": {
      "Weed Cutter Model": "AM-500HC-PRO",
      "RIPL Code": "RIPL036870",
      "Brand": "AGRIMATE",
      "Model": "AM-500HC-BC-PRO",
      "Engine Type": "4 Stroke",
      "Displacement": "50CC",
      "Fuel Tank Capacity": "0.9Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-500hc-4s-bc-pro-brush-cutter.pdf",
        "fileName": "am-500hc-4s-bc-pro-brush-cutter.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Tap & go    2. Circular Blade     3. 2-Tooth Blade    4. Tools Kit"
  },
  {
    "id": "am-3542",
    "name": "AM-RTP-7P-FCI INTERCULTIVATOR/POWER WEEDER",
    "slug": "am-rtp-7p-fci-intercultivator-power-weeder-3542",
    "sku": "RIPL038460",
    "riplCode": "RIPL038460",
    "modelNumber": "AM-RTP-7P-FCI",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 45580,
    "comparePrice": 45580,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 81,
    "images": [
      "/images/products/agrimart/product_3542_1.jpg",
      "/images/products/agrimart/product_3542_2.jpg",
      "/images/products/agrimart/product_3542_4.jpg"
    ],
    "description": "Model : AM-RTP-7P-FCI Engine : AM170F Power : 3600RPM Cultivating Width : 850-1000 Cultivating Depth : 150-300 Gear : 2Forward",
    "descriptionHtml": "<p><b>Model</b>:&nbsp;AM-RTP-7P-FCI &nbsp;&nbsp;<b>Engine</b>:&nbsp;AM170F &nbsp; <b>Power</b>: 3600RPM&nbsp; &nbsp; &nbsp;&nbsp;<b>Cultivating Width</b>:&nbsp;850-1000 &nbsp; <b>Cultivating Depth</b>: 150-300&nbsp; &nbsp;<b>Gear</b>: 2Forward</p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-RTP-7P-FCI",
      "RIPL Code": "RIPL038460",
      "Brand": "AGRIMATE",
      "Model": "AM-RTP-7P-FCI",
      "Engine": "AM170F",
      "Power": "3600RPM",
      "Cultivating Width": "850-1000",
      "Cultivating Depth": "150-300",
      "Gear": "2Forward"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-rtp-7p-fci-intercultivatorpower-weeder-am-rtp-7p-fci.pdf",
        "fileName": "am-rtp-7p-fci-intercultivatorpower-weeder-am-rtp-7p-fci.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . Solid Tyres 3.5x6    2 . Tilling Blades- 32 Nos.    3 . 2 Side Disc"
  },
  {
    "id": "am-2462",
    "name": "SPARTA-44H-OLEOMAC WEED CUTTER / POWER WEEDER",
    "slug": "sparta-44h-oleomac-weed-cutter-power-weeder-2462",
    "sku": "RIPL027117",
    "riplCode": "RIPL027117",
    "modelNumber": "SPARTA44H",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 45959,
    "comparePrice": 45959,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 60,
    "images": [
      "/images/products/agrimart/product_2462_1.jpg"
    ],
    "description": "Model:  SPARTA 44 H     Power/Displacement:  2.5HP/ 1.8kW/ 40.2  cm 2    Carburetor:  EMAK    Type:  Capacitive electronic   Fuel Tank Capacity:  1.5 ltr     Weight:  8.1 kg     Tube diameter:  28 mm with steel shaft 8 mm / 1500 mm",
    "descriptionHtml": "<p>Model: SPARTA 44 H    Power/Displacement: 2.5HP/ 1.8kW/ 40.2 cm2  Carburetor: EMAK   Type: Capacitive electronic  Fuel Tank Capacity: 1.5 ltr    Weight: 8.1 kg    Tube diameter: 28 mm with steel shaft 8 mm / 1500 mm</p><p><br><br><br></p>",
    "specifications": {
      "Weed Cutter Model": "SPARTA44H",
      "RIPL Code": "RIPL027117",
      "Brand": "OLEO MAC",
      "Model": "SPARTA 44 H Power/Displacement: 2.5HP/ 1.8kW/ 40.2 cm 2 Carburetor: EMAK Type: Capacitive electronic Fuel Tank Capacity: 1.5 ltr Weight: 8.1 kg Tube diameter: 28 mm with steel shaft 8 mm / 1500 mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/sparta-44h-oleomac-weed-cutter-power-weeder.pdf",
        "fileName": "sparta-44h-oleomac-weed-cutter-power-weeder.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Part List",
        "url": "/agrimart-media/brochures/om-weed-cutter-power-weeder-sparta-44h-sparta-44h-sparta44h_2.pdf",
        "fileName": "om-weed-cutter-power-weeder-sparta-44h-sparta-44h-sparta44h_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "https://www.youtube.com/embed/SubZgtFyOFU",
        "type": "youtube",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Tap n Go    2. 3 tooth blade"
  },
  {
    "id": "am-3384",
    "name": "AM-WP5065-HHDE- WATER PUMPSET- DIESEL",
    "slug": "am-wp5065-hhde-water-pumpset-diesel-3384",
    "sku": "RIPL037044",
    "riplCode": "RIPL037044",
    "modelNumber": "AM-WP5065-HHDE",
    "category": "Pumpset",
    "categoryId": "cat-am-pumpset",
    "price": 45980,
    "comparePrice": 45980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3384_1.jpg",
      "/images/products/agrimart/product_3384_2.jpg"
    ],
    "description": "Model: AM-WP5065-HHDE    Engine :178FD       Max. Head : 65Mtr     Max. Discharge: 30(M 3 /H)      Suction:  5Mtr",
    "descriptionHtml": "<p><b>Model: </b>AM-WP5065-HHDE   <b>Engine</b>:178FD      <b>Max. Head</b>: 65Mtr    <b>Max. Discharge: </b>30(M<sup>3</sup>/H)     Suction: 5Mtr  </p>",
    "specifications": {
      "Water Pumpset": "AM-WP5065-HHDE",
      "RIPL Code": "RIPL037044",
      "Brand": "AGRIMATE",
      "Model": "AM-WP5065-HHDE",
      "Engine": "178FD",
      "Max. Head": "65Mtr",
      "Max. Discharge": "30(M 3 /H) Suction: 5Mtr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-wp5065-hhde-water-pumpset-diesel-am-wp5065-hhde.pdf",
        "fileName": "am-wp5065-hhde-water-pumpset-diesel-am-wp5065-hhde.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am-wp5065-hhde-water-pumpset-diesel-am-wp5065-hhde_2.pdf",
        "fileName": "am-wp5065-hhde-water-pumpset-diesel-am-wp5065-hhde_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-247",
    "name": "AMH-200T-4S Brush Cutter",
    "slug": "amh-200t-4s-brush-cutter-247",
    "sku": "RIPL005862",
    "riplCode": "RIPL005862",
    "modelNumber": "AMH 200-4S",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 47980,
    "comparePrice": 47980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 6,
    "images": [
      "/images/products/agrimart/product_247_1.jpg",
      "/images/products/agrimart/product_247_2.jpg",
      "/images/products/agrimart/product_247_3.jpg",
      "/images/products/agrimart/product_247_4.jpg",
      "/images/products/agrimart/product_247_5.jpg",
      "/images/products/agrimart/product_247_6.jpg",
      "/images/products/agrimart/product_247_7.jpg"
    ],
    "description": "Model : AMH-200T-4S       Engine :  GX-35    RPM :  7000RPM  Displacement :  35.8CC     Fuel Tank Capacity : 1 Ltr    Tube Diameter :  28mm     Drive Shaft :  8mm",
    "descriptionHtml": "<p><b>Model : </b>AMH-200T-4S<b> </b>   <b>Engine: </b>GX-35    <b>RPM</b>: 7000RPM  <b>Displacement: </b>35.8CC    <b>Fuel Tank Capacity</b><b>:</b> 1Ltr   <b>Tube Diameter: </b>28mm    <b>Drive Shaft: </b>8mm</p>",
    "specifications": {
      "Weed Cutter Model": "AMH 200-4S",
      "RIPL Code": "RIPL005862",
      "Brand": "AGRIMATE",
      "Model": "AMH-200T-4S",
      "RPM": "7000RPM Displacement : 35.8CC"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/amh-200t-4s-brush-cutter.pdf",
        "fileName": "amh-200t-4s-brush-cutter.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts list",
        "url": "/agrimart-media/brochures/agrimate-honda-power-weeder-amh200t-4s-amh-200-4s_2.pdf",
        "fileName": "agrimate-honda-power-weeder-amh200t-4s-amh-200-4s_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "https://www.youtube.com/embed/bTMB5NJca2I",
        "type": "youtube",
        "available": true
      }
    ],
    "accessoriesInfo": "1.   3 tooth   Blade    2.   Tap and go    3.  S afety articles   4.  Tool kit"
  },
  {
    "id": "am-3348",
    "name": "AM-PTMG-500-170EN PADDY THRESHER WITH ENGINE",
    "slug": "am-ptmg-500-170en-paddy-thresher-with-engine-3348",
    "sku": "RIPL036436",
    "riplCode": "RIPL036436",
    "modelNumber": "AM-PTMG-500-170EN",
    "category": "Thresher",
    "categoryId": "cat-am-thresher",
    "price": 47980,
    "comparePrice": 47980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 9,
    "images": [
      "/images/products/agrimart/product_3348_1.jpg"
    ],
    "description": "Model: AM-PTMG-500-170EN     Displacement:  212CC    Productivity: 500-700 KG/H    Total weight: 65 KG",
    "descriptionHtml": "<p><b>Model: </b>AM-PTMG-500-170EN  <b>  Displacement:</b> 212CC   <b>Productivity:</b> 500-700 KG/H   <b>Total weight:</b> 65 KG </p>",
    "specifications": {
      "Thresher": "AM-PTMG-500-170EN",
      "RIPL Code": "RIPL036436",
      "Brand": "AGRIMATE",
      "Model": "AM-PTMG-500-170EN",
      "Displacement": "212CC",
      "Productivity": "500-700 KG/H",
      "Total weight": "65 KG"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-ptmg-500-170en-paddy-thresher-with-engine-am-ptmg-500-170en.pdf",
        "fileName": "am-ptmg-500-170en-paddy-thresher-with-engine-am-ptmg-500-170en.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-ptmg-500-170en-paddy-thresher-with-engine-am-ptmg-500-170en_2.pdf",
        "fileName": "am-ptmg-500-170en-paddy-thresher-with-engine-am-ptmg-500-170en_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3348_1.mp4",
        "fileName": "product_3348_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3301",
    "name": "AMH-200T-4S",
    "slug": "amh-200t-4s-3301",
    "sku": "DBT24064",
    "riplCode": "DBT24064",
    "modelNumber": "",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 47980,
    "comparePrice": 47980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3301_1.jpg"
    ],
    "description": "Model:  AMH-200T-4S      Engine :  GX-35    RPM :   7000RPM    Displacement :  35.8CC     Fuel Tank Capacity : 1Ltr     Tube Diameter :  28mm     Drive Shaft :  8mm",
    "descriptionHtml": "<p><b>Model: </b>AMH-200T-4S<b>    </b>Engine: GX-35    <b>RPM</b><b>:</b> 7000RPM   Displacement: 35.8CC    Fuel Tank Capacity: 1Ltr   Tube Diameter: 28mm    Drive Shaft: 8mm  <br></p>",
    "specifications": {
      "RIPL Code": "DBT24064",
      "Brand": "AGRIMATE",
      "Model": "AMH-200T-4S"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/amh-200t-4s-dbt.pdf",
        "fileName": "amh-200t-4s-dbt.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.   3 tooth   Blade    2.   Tap and go    3.  S afety articles   4.  Tool kit"
  },
  {
    "id": "am-3546",
    "name": "AM-RTP-7212- PRO-CLASSIC INTER CULTIVATOR/POWER WEEDER",
    "slug": "am-rtp-7212-pro-classic-inter-cultivator-power-weeder-3546",
    "sku": "RIPL038521",
    "riplCode": "RIPL038521",
    "modelNumber": "AM-RTP-7212- PRO-CLASSIC",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 47980,
    "comparePrice": 47980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 76,
    "images": [
      "/images/products/agrimart/product_3546_1.jpg",
      "/images/products/agrimart/product_3546_2.jpg"
    ],
    "description": "Model: AM-RTP-7212-PRO-Classic      Engine Model: AM170F      Power:  3600RPM     Displacement: 212CC      Tilling Width: 550-750-1000mm     Tilling depth:   ≥  100     Gears: 2 Forward 1 Reverse      Fuel Tank capacity: 3.6L",
    "descriptionHtml": "<p><b>Model: </b>AM-RTP-7212-PRO-Classic     <b>Engine Model: </b>AM170F     <b>Power:</b> 3600RPM    <b> Displacement:</b> 212CC     <b>Tilling Width:</b> 550-750-1000mm    <b> Tilling depth:</b> ≥ 100    <b> Gears: </b>2 Forward 1 Reverse     <b>Fuel Tank capacity: </b>3.6L</p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-RTP-7212- PRO-CLASSIC",
      "RIPL Code": "RIPL038521",
      "Brand": "AGRIMATE",
      "Model": "AM-RTP-7212-PRO-Classic",
      "Engine Model": "AM170F",
      "Power": "3600RPM",
      "Displacement": "212CC",
      "Tilling Width": "550-750-1000mm",
      "Tilling depth": "≥ 100",
      "Gears": "2 Forward 1 Reverse",
      "Fuel Tank capacity": "3.6L"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-rtp-7212-pro-classic-inter-cultivatorpower-weeder-am-rtp-7212-pro-classic.pdf",
        "fileName": "am-rtp-7212-pro-classic-inter-cultivatorpower-weeder-am-rtp-7212-pro-classic.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Rubber Tyres  4.00X8    2. Tilling Blades: 32 Nos"
  },
  {
    "id": "am-380",
    "name": "KZ-4000 BC-PRO 2S-KASEI BRUSH CUTTER",
    "slug": "kz-4000-bc-pro-2s-kasei-brush-cutter-380",
    "sku": "RIPL019545",
    "riplCode": "RIPL019545",
    "modelNumber": "KZ-4000BC PRO-2S",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 48000,
    "comparePrice": 48000,
    "brand": "KASEI",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_380_1.jpg",
      "/images/products/agrimart/product_380_2.jpg",
      "/images/products/agrimart/product_380_3.jpg"
    ],
    "description": "Displacement: 40.2 CC     Type of Handle: Double grip    Power Output -Max.1.3kw/ 1.8hp/ 9900 rpm    Fuel Tank Capacity : 1 Ltr    Weight : 7.6 Kg",
    "descriptionHtml": "<p><b>Displacement: </b>40.2 CC    <b>Type of Handle:</b> Double grip   <b>Power Output</b> -Max.1.3kw/ 1.8hp/ 9900 rpm   <b>Fuel Tank Capacity</b>: 1 Ltr   <b>Weight</b>: 7.6 Kg</p>",
    "specifications": {
      "Weed Cutter Model": "KZ-4000BC PRO-2S",
      "RIPL Code": "RIPL019545",
      "Brand": "KASEI",
      "Displacement": "40.2 CC",
      "Type of Handle": "Double grip",
      "Power Output": "Max.1.3kw/ 1.8hp/ 9900 rpm",
      "Fuel Tank Capacity": "1 Ltr",
      "Weight": "7.6 Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/kz-4000-bc-pro-2s-kasei-brush-cutter-kz-4000bc-pro-2s.pdf",
        "fileName": "kz-4000-bc-pro-2s-kasei-brush-cutter-kz-4000bc-pro-2s.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/kz-4000-bc-pro-2s-kasei-brush-cutter-kz-4000bc-pro-2s_2.pdf",
        "fileName": "kz-4000-bc-pro-2s-kasei-brush-cutter-kz-4000bc-pro-2s_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. 3Tooth  Blade    2.   2Tooth Blade    3.  Tap and Go    4. Tools Kit    5. Fuel Mixing Can    6. Safety Kit     7. Harness"
  },
  {
    "id": "am-249",
    "name": "AMH-300T-4S-TAIWAN-Brush Cutter",
    "slug": "amh-300t-4s-taiwan-brush-cutter-249",
    "sku": "RIPL026571",
    "riplCode": "RIPL026571",
    "modelNumber": "AMH-300-T",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 49980,
    "comparePrice": 49980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 7,
    "images": [
      "/images/products/agrimart/product_249_1.jpg",
      "/images/products/agrimart/product_249_2.jpg",
      "/images/products/agrimart/product_249_3.jpg"
    ],
    "description": "Model : AMH-300T-4S     Engine Type: 4 stroke    Engine: GX-50     Power: 1.5kW/ 2HP/ 7000RPM    Displacement:  50 cc     Fuel Tank capacity: 0.65 Ltr   Tube Diameter: 26mm  Drive Shaft: 8mm    Carburetor: Diaphragm type",
    "descriptionHtml": "<p><b>Model : </b>AMH-300T-4S<b>    Engine Type:</b> 4 stroke   <b>Engine:</b> GX-50    <b>Power: </b>1.5kW/ 2HP/ 7000RPM   <b>Displacement:</b> 50 cc    <b>Fuel Tank capacity:</b> 0.65 Ltr  <b>Tube Diameter:</b> 26mm <b> Drive Shaft:</b> 8mm   <b>Carburetor:</b> Diaphragm type</p>",
    "specifications": {
      "Weed Cutter Model": "AMH-300-T",
      "RIPL Code": "RIPL026571",
      "Brand": "AGRIMATE",
      "Model": "AMH-300T-4S",
      "Engine Type": "4 stroke",
      "Engine": "GX-50",
      "Power": "1.5kW/ 2HP/ 7000RPM",
      "Displacement": "50 cc",
      "Fuel Tank capacity": "0.65 Ltr",
      "Tube Diameter": "26mm",
      "Drive Shaft": "8mm",
      "Carburetor": "Diaphragm type"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": "1. 3-Tooth   Blade    2. Tap and go    3. Safety kit    4. Tools kit"
  },
  {
    "id": "am-1917",
    "name": "AM708-PRO-2S-WC- Knapsack Power Sprayer",
    "slug": "am708-pro-2s-wc-knapsack-power-sprayer-1917",
    "sku": "RIPL026590",
    "riplCode": "RIPL026590",
    "modelNumber": "AM 708 PRO 2S WC",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 49980,
    "comparePrice": 49980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_1917_1.jpg",
      "/images/products/agrimart/product_1917_2.jpg",
      "/images/products/agrimart/product_1917_3.jpg",
      "/images/products/agrimart/product_1917_4.jpg"
    ],
    "description": "Model: AM-708-Pro-WC     Engine: AX-34T     Type: 2 Stroke      Power: 0.7KW/ 7500rpm  Working Pressure: 35KG/ CM2    Chemical tank capacity: 20 Ltr     Fuel tank capacity: 0.75 Ltr    Pump: Brass",
    "descriptionHtml": "<p><b>Model: </b>AM-708-Pro-WC   <b>  Engine: </b>AX-34T<b>    Type:</b> 2 Stroke     <b>Power:</b> 0.7KW/ 7500rpm  Working Pressure: 35KG/ CM2   <b>Chemical tank capacity:</b> 20 Ltr    <b>Fuel tank capacity:</b> 0.75<b> </b>Ltr   <b>Pump: </b>Brass</p>",
    "specifications": {
      "Sprayer Model": "AM 708 PRO 2S WC",
      "RIPL Code": "RIPL026590",
      "Brand": "AGRIMATE",
      "Model": "AM-708-Pro-WC",
      "Engine": "AX-34T",
      "Type": "2 Stroke",
      "Power": "0.7KW/ 7500rpm Working Pressure: 35KG/ CM2",
      "Chemical tank capacity": "20 Ltr",
      "Fuel tank capacity": "0.75",
      "Pump": "Brass"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am708-pro-2s-wc-walbro-carburetor-knapsack-power-sprayer-2-stroke-agrimate-am-708-pro-2s-wc_2.pdf",
        "fileName": "am708-pro-2s-wc-walbro-carburetor-knapsack-power-sprayer-2-stroke-agrimate-am-708-pro-2s-wc_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1917_1.mp4",
        "fileName": "product_1917_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Spray gun    2. Paddy lance    3. Hose pipe    4. Fuel mixing can    5. Ball cock    6. Standard tools    7. Mask    8. Repair kit"
  },
  {
    "id": "am-3430",
    "name": "AM-PTMG-500-170EN WITH ENGINE AND WHEEL",
    "slug": "am-ptmg-500-170en-with-engine-and-wheel-3430",
    "sku": "RIPL036914",
    "riplCode": "RIPL036914",
    "modelNumber": "AM-PTMG-500-170EN",
    "category": "Thresher",
    "categoryId": "cat-am-thresher",
    "price": 49980,
    "comparePrice": 49980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3430_1.jpg"
    ],
    "description": "Model:  AM-PTMG-500-170EN         Displacement:  212cc      Productivity:   ≥ 750 KG/H",
    "descriptionHtml": "<p>Model: AM-PTMG-500-170EN      <b>Displacement: </b>212cc     Productivity:  ≥750 KG/H   </p>",
    "specifications": {
      "Thresher": "AM-PTMG-500-170EN",
      "RIPL Code": "RIPL036914",
      "Brand": "AGRIMATE",
      "Displacement": "212cc Productivity: ≥ 750 KG/H"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-ptmg-500-170en-with-engine-and-wheel.pdf",
        "fileName": "am-ptmg-500-170en-with-engine-and-wheel.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-ptmg-500-170en-with-engine-and-wheel_2.pdf",
        "fileName": "am-ptmg-500-170en-with-engine-and-wheel_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-419",
    "name": "OLEO MAC-741 -WEED CUTTER/ POWER WEEDER-PETROL",
    "slug": "oleo-mac-741-weed-cutter-power-weeder-petrol-419",
    "sku": "RIPL019229",
    "riplCode": "RIPL019229",
    "modelNumber": "741",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 50210,
    "comparePrice": 50210,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 46,
    "images": [
      "/images/products/agrimart/product_419_1.jpg",
      "/images/products/agrimart/product_419_2.jpg",
      "/images/products/agrimart/product_419_3.jpg"
    ],
    "description": "Model: OM-741- BC      Power/Displacement : 1.83 kw - 2.5 HP      Engine Type : 2 Stroke       Displacement:  40.2 cm2    Tube Diameter: 28 mm       Grip: H andle bar       Fuel tank capacity: 0.75 L     Harness: D ouble    Weight: 7.9 kg      Cutting components: 130  mm dia. Load & Go head with 3.00 mm line - 255 mm dia. disc with 3 blades",
    "descriptionHtml": "<p>Model: OM-741- BC     Power/Displacement: 1.83 kw - 2.5 HP <b>    Engine Type</b>: 2 Stroke     <b> Displacement: </b>40.2 cm2    <b>Tube Diameter: </b>28 mm      <b>Grip: </b>Handle bar     <b>Fuel tank capacity: </b>0.75 L    <b>Harness: </b>Double   <b> Weight: </b>7.9 kg    Cutting components: 130 mm dia. Load & Go head with 3.00 mm line - 255 mm dia. disc with 3 blades </p>",
    "specifications": {
      "Weed Cutter Model": "741",
      "RIPL Code": "RIPL019229",
      "Brand": "OLEO MAC",
      "Engine Type": "2 Stroke",
      "Displacement": "40.2 cm2",
      "Tube Diameter": "28 mm",
      "Grip": "H andle bar",
      "Fuel tank capacity": "0.75 L",
      "Harness": "D ouble",
      "Weight": "7.9 kg Cutting components: 130 mm dia. Load & Go head with 3.00 mm line - 255 mm dia. disc with 3 blades"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/oleo-mac-741-weed-cutter-power-weeder-petrol.pdf",
        "fileName": "oleo-mac-741-weed-cutter-power-weeder-petrol.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Part List",
        "url": "/agrimart-media/brochures/om-weed-cutterpower-weeder-741-petrol-741_2.pdf",
        "fileName": "om-weed-cutterpower-weeder-741-petrol-741_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_419_1.mp4",
        "fileName": "product_419_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1.  3 Tooth Blade    2. Tap N Go    3.  Tools Kit   4. Harness"
  },
  {
    "id": "am-3327",
    "name": "AM-22K HTP POWER SPRAYER",
    "slug": "am-22k-htp-power-sprayer-3327",
    "sku": "DBT24079",
    "riplCode": "DBT24079",
    "modelNumber": "DBT",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 51580,
    "comparePrice": 51580,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3327_1.jpg"
    ],
    "description": "Model:  AM-22K      Engine Type:  168F/4Stroke      Max.Power : 2.98kw/3600RPM     Displacement:  163CC      Pump : AM-22      Working Pressure:  21-40 Kg/Cm 2      Discharge:  14-22 LPM",
    "descriptionHtml": "<p>Model: AM-22K     Engine Type: 168F/4Stroke     <b>Max.Power</b>: 2.98kw/3600RPM    Displacement: 163CC     Pump: AM-22     Working Pressure: 21-40 Kg/Cm2     Discharge: 14-22 LPM   </p>",
    "specifications": {
      "Sprayer Model": "DBT",
      "RIPL Code": "DBT24079",
      "Brand": "AGRIMATE",
      "Max.Power": "2.98kw/3600RPM Displacement: 163CC Pump : AM-22 Working Pressure: 21-40 Kg/Cm 2 Discharge: 14-22 LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-22k-htp-power-sprayer-dbt.pdf",
        "fileName": "am-22k-htp-power-sprayer-dbt.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Suction Hose-4Mtr    2.  Overflow Hose-4Mtr    3.  Lance-3 feet   4.  Strainer   5.  O Ring Kit"
  },
  {
    "id": "am-514",
    "name": "AMTH-K-4S PRO- AGRIMATE TEA HARVESTOR- Kawasaki",
    "slug": "amth-k-4s-pro-agrimate-tea-harvestor-kawasaki-514",
    "sku": "RIPL024682",
    "riplCode": "RIPL024682",
    "modelNumber": "AMTH PRO-K4S",
    "category": "Harvester",
    "categoryId": "cat-am-harvester",
    "price": 51800,
    "comparePrice": 51800,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 4,
    "images": [
      "/images/products/agrimart/product_514_1.jpg"
    ],
    "description": "Engine: AX- 35TH    Power: 0.6KW/ 7000RPM   Displacement: 25 CC  Fuel tank capacity: 0.55L    Cutting width: 600mm    Weight: 8.5 Kg",
    "descriptionHtml": "<p><b>Engine: </b>AX- 35TH  <b>  Power:</b> 0.6KW/ 7000RPM  <b> Displacement: </b>25 CC  <b>Fuel tank capacity:</b> 0.55L   <b>Cutting width: </b>600mm   <b>Weight: </b>8.5 Kg </p>",
    "specifications": {
      "Harvester Model": "AMTH PRO-K4S",
      "RIPL Code": "RIPL024682",
      "Brand": "AGRIMATE",
      "Engine": "AX- 35TH",
      "Power": "0.6KW/ 7000RPM",
      "Displacement": "25 CC",
      "Fuel tank capacity": "0.55L",
      "Cutting width": "600mm",
      "Weight": "8.5 Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/agrimate-tea-harvestor-amth-pro-k4s-amth-pro-k4s.pdf",
        "fileName": "agrimate-tea-harvestor-amth-pro-k4s-amth-pro-k4s.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_514_1.mp4",
        "fileName": "product_514_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Tea\nBags -3 No's    2. Spare Blade -1 Set    3. Flexible Cable  4. Grease Gun   5. Oil Can  6. Fuel\nMixing Can    7.  Standard Tools,  8. Funnel."
  },
  {
    "id": "am-2001",
    "name": "AMTH-K-2S-Kawasaki -TEA HARVESTER",
    "slug": "amth-k-2s-kawasaki-tea-harvester-2001",
    "sku": "RIPL020347",
    "riplCode": "RIPL020347",
    "modelNumber": "AMTH K 2S",
    "category": "Harvester",
    "categoryId": "cat-am-harvester",
    "price": 51800,
    "comparePrice": 51800,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_2001_1.jpg",
      "/images/products/agrimart/product_2001_2.jpg",
      "/images/products/agrimart/product_2001_3.jpg"
    ],
    "description": "Engine: AX-34T    Power/RPM: 0.75KW/7500RPM    Displacement: 25.6CC    Cutting Width: 600MM    Oil tank capacity: 0.6L    Weight:  8.5KG",
    "descriptionHtml": "<p><b>Engine: </b>AX-34T    <b>Power/RPM:</b> 0.75KW/7500RPM    <b>Displacement:</b> 25.6CC    <b>Cutting Width:</b> 600MM   <b>Oil tank capacity:</b> 0.6L   <b>Weight: </b>8.5KG</p>",
    "specifications": {
      "Harvester Model": "AMTH K 2S",
      "RIPL Code": "RIPL020347",
      "Brand": "AGRIMATE",
      "Engine": "AX-34T",
      "Power/RPM": "0.75KW/7500RPM",
      "Displacement": "25.6CC",
      "Cutting Width": "600MM",
      "Oil tank capacity": "0.6L",
      "Weight": "8.5KG"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/amth-k-2s-amth-k-2s.pdf",
        "fileName": "amth-k-2s-amth-k-2s.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/amth-k-2s-amth-k-2s_2.pdf",
        "fileName": "amth-k-2s-amth-k-2s_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2001_1.mp4",
        "fileName": "product_2001_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Tea bags -3 No's    2. Spare blade -1 Set    3. Flexible cable    4. Grease gun    5. Oil can    6. Fuel mixing can    7. Standard tools    8. Funnel"
  },
  {
    "id": "am-2038",
    "name": "KZ-4000 MT-PRO-2S-4 In 1 POWER WEEDER",
    "slug": "kz-4000-mt-pro-2s-4-in-1-power-weeder-2038",
    "sku": "RIPL024831",
    "riplCode": "RIPL024831",
    "modelNumber": "KZ-4000 MT -PRO 2S",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 51980,
    "comparePrice": 51980,
    "brand": "KASEI",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 38,
    "images": [
      "/images/products/agrimart/product_2038_1.jpg"
    ],
    "description": "Displacement: 40.2cc    Type of Handle: Double grip-Low Vibration    Power Output: Max. 1.5kw / 2hp/ 9900 rpm     Fuel Tank Capacity: 1L    Weight: 4.2 Kg(without attachments) One product can serve multiple purpose:\nCan be used as Brush Cutter | Can be used as Plough | Can be used as Tiller  | Can be used as Hedge Trimmer",
    "descriptionHtml": "<p><b>Displacement:</b> 40.2cc   <b>Type of Handle: </b>Double grip-Low Vibration   <b>Power Output:</b> Max. 1.5kw / 2hp/ 9900 rpm    <b>Fuel Tank Capacity:</b> 1L   <b>Weight: </b>4.2 Kg(without attachments)</p><p><b>One product can serve multiple purpose:</b><br>Can be used as Brush Cutter | Can be used as Plough | Can be used as Tiller  | Can be used as Hedge Trimmer</p>",
    "specifications": {
      "Weed Cutter Model": "KZ-4000 MT -PRO 2S",
      "RIPL Code": "RIPL024831",
      "Brand": "KASEI",
      "Displacement": "40.2cc",
      "Type of Handle": "Double grip-Low Vibration",
      "Power Output": "Max. 1.5kw / 2hp/ 9900 rpm",
      "Fuel Tank Capacity": "1L",
      "Weight": "4.2 Kg(without attachments)",
      "One product can serve multiple purpose": "Can be used as Brush Cutter | Can be used as Plough | Can be used as Tiller | Can be used as Hedge Trimmer"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/kz-4000-mt-pro-2s-4-in-1-power-weeder.pdf",
        "fileName": "kz-4000-mt-pro-2s-4-in-1-power-weeder.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/kz-4000-mt-pro-2s-4-in-1-new-kz-4000-mt-pro-2s_2.pdf",
        "fileName": "kz-4000-mt-pro-2s-4-in-1-new-kz-4000-mt-pro-2s_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Tap and Go attachment    2. Plough    3. Tiller    4. Hedge Trimmer"
  },
  {
    "id": "am-3094",
    "name": "AMTP-TU43-2S-PRO-2 IN 1 Agrimate Tea Pruner with Mitsubushi Engine",
    "slug": "amtp-tu43-2s-pro-2-in-1-agrimate-tea-pruner-with-mitsubushi-engine-3094",
    "sku": "RIPL036416",
    "riplCode": "RIPL036416",
    "modelNumber": "AMTP-TU43-2S-PRO",
    "category": "Pruner",
    "categoryId": "cat-am-pruner",
    "price": 51980,
    "comparePrice": 51980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 58,
    "images": [
      "/images/products/agrimart/product_3094_1.jpg",
      "/images/products/agrimart/product_3094_2.jpg"
    ],
    "description": "Model:  AMTP-TU43-2S-PRO     Engine: Mitsubishi TU43    Power:  1.3HP/7000 RPM   Displacement: 43CC    Engine Type: Air cooling 2 stroke    Carburetor: Diaphragm type Walbro",
    "descriptionHtml": "<p>Model: AMTP-TU43-2S-PRO    <b>Engine: </b>Mitsubishi TU43   <b>Power:</b> 1.3HP/7000 RPM  <b> Displacement: </b>43CC   <b>Engine Type:</b> Air cooling 2 stroke   <b>Carburetor: </b>Diaphragm type Walbro </p>",
    "specifications": {
      "Pruner Model": "AMTP-TU43-2S-PRO",
      "RIPL Code": "RIPL036416",
      "Brand": "AGRIMATE",
      "Engine": "Mitsubishi TU43",
      "Power": "1.3HP/7000 RPM",
      "Displacement": "43CC",
      "Engine Type": "Air cooling 2 stroke",
      "Carburetor": "Diaphragm type Walbro"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/amtp-tu43-2s-pro-2-in-1-agrimate-tea-pruner-with-mitsubushi-engine.pdf",
        "fileName": "amtp-tu43-2s-pro-2-in-1-agrimate-tea-pruner-with-mitsubushi-engine.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/amtp-tu43-2s-wc-pro-agrimate-tea-prunner-2-in-1-with-mitsubushi-engine-amtp-tu43-2s-pro_2.pdf",
        "fileName": "amtp-tu43-2s-wc-pro-agrimate-tea-prunner-2-in-1-with-mitsubushi-engine-amtp-tu43-2s-pro_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3094_1.mp4",
        "fileName": "product_3094_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Tool Kit    2. 80 tooth Blade    3. Safety Article    4. Glues"
  },
  {
    "id": "am-3572",
    "name": "AM-WPD-178SP-3X3-MS WATER PUMP SET - DIESEL",
    "slug": "am-wpd-178sp-3x3-ms-water-pump-set-diesel-3572",
    "sku": "RIPL038928",
    "riplCode": "RIPL038928",
    "modelNumber": "AM-WPD-178SP",
    "category": "Pumpset",
    "categoryId": "cat-am-pumpset",
    "price": 51980,
    "comparePrice": 51980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3572_1.jpg",
      "/images/products/agrimart/product_3572_2.jpg"
    ],
    "description": "Model: AM-WPD-178SP     Engine :178F      Displacement: 296cc     Max Flow rate:  38-42 m³/h    Max Life: 26m    Max  Suction: 8m",
    "descriptionHtml": "<p>Model: AM-WPD-178SP    Engine:178F     Displacement: 296cc    Max Flow rate: 38-42<b> </b>m³/h   Max Life: 26m    <b>Max </b>Suction: 8m   </p>",
    "specifications": {
      "Water Pumpset": "AM-WPD-178SP",
      "RIPL Code": "RIPL038928",
      "Brand": "AGRIMATE",
      "Model": "AM-WPD-178SP Engine :178F Displacement: 296cc Max Flow rate: 38-42 m³/h Max Life: 26m Max Suction: 8m"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-wpd-178sp-3x3-ms-water-pump-set-diesel-am-wpd-178sp.pdf",
        "fileName": "am-wpd-178sp-3x3-ms-water-pump-set-diesel-am-wpd-178sp.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-wpd-178sp-3x3-ms-water-pump-set-diesel-am-wpd-178sp_2.pdf",
        "fileName": "am-wpd-178sp-3x3-ms-water-pump-set-diesel-am-wpd-178sp_2.pdf",
        "available": true
      },
      {
        "label": "View Engine Diagram",
        "url": "/agrimart-media/brochures/am-wpd-178sp-3x3-ms-water-pump-set-diesel-am-wpd-178sp_3.pdf",
        "fileName": "am-wpd-178sp-3x3-ms-water-pump-set-diesel-am-wpd-178sp_3.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-581",
    "name": "SM505-SUNMAX WM500-INTERCULTIVATOR/POWER WEEDER",
    "slug": "sm505-sunmax-wm500-intercultivator-power-weeder-581",
    "sku": "RIPL024824",
    "riplCode": "RIPL024824",
    "modelNumber": "SM505",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 52200,
    "comparePrice": 52200,
    "brand": "SUNMAX",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 1,
    "images": [
      "/images/products/agrimart/product_581_1.jpg",
      "/images/products/agrimart/product_581_2.jpg",
      "/images/products/agrimart/product_581_3.jpg"
    ],
    "description": "Engine Type: Single Cylinder Air-Cooled 4 Stroke Engine    Max. Engine Power: 6 HP    Tilling Width: 600 - 900 mm     Tilling Depth: 150 - 300 cm   Gear Box Oil: SA90    Engine Oil: 20w40/ 15w40",
    "descriptionHtml": "<p><b>Engine Type:</b> Single Cylinder Air-Cooled 4 Stroke Engine   <b> Max. Engine Power: </b>6 HP   <b>Tilling Width:</b> 600 - 900 mm    <b>Tilling Depth:</b> 150 - 300 cm  <b> Gear Box Oil: </b>SA90<b>   Engine Oil: </b>20w40/ 15w40<br><br></p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "SM505",
      "RIPL Code": "RIPL024824",
      "Brand": "SUNMAX",
      "Engine Type": "Single Cylinder Air-Cooled 4 Stroke Engine",
      "Max. Engine Power": "6 HP",
      "Tilling Width": "600 - 900 mm",
      "Tilling Depth": "150 - 300 cm",
      "Gear Box Oil": "SA90",
      "Engine Oil": "20w40/ 15w40"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_581_1.mp4",
        "fileName": "product_581_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Blades- 24 nos.    2. Tool kit"
  },
  {
    "id": "am-2846",
    "name": "AM22+GX 80D-HTP POWER SPRAYER",
    "slug": "am22-gx-80d-htp-power-sprayer-2846",
    "sku": "RIPL005900BOM-R-2",
    "riplCode": "RIPL005900BOM-R-2",
    "modelNumber": "AM 22 + GX 80D NEO",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 52204,
    "comparePrice": 52204,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_2846_1.jpg"
    ],
    "description": "Engine: GX 80  Type: Air cooled 4 stroke   Power: 2HP/ 1.5Kw / 3600 RPM  Strat:  Recoil  Displacement: 79.7cc  Fuel tank capacity: 1.5Ltr    Pump: AMLS-518/ AM22",
    "descriptionHtml": "<b>Engine: </b>GX 80  <b>Type:</b> Air cooled 4 stroke<b>  Power:</b> 2HP/ 1.5Kw / 3600 RPM  <b>Strat:  </b>Recoil  <b>Displacement:</b> 79.7cc <b> Fuel tank capacity:</b> 1.5Ltr   <b>Pump:</b> AMLS-518/ AM22",
    "specifications": {
      "Sprayer Model": "AM 22 + GX 80D NEO",
      "RIPL Code": "RIPL005900BOM-R-2",
      "Brand": "AGRIMATE",
      "Engine": "GX 80",
      "Type": "Air cooled 4 stroke",
      "Power": "2HP/ 1.5Kw / 3600 RPM",
      "Strat": "Recoil",
      "Displacement": "79.7cc",
      "Fuel tank capacity": "1.5Ltr",
      "Pump": "AMLS-518/ AM22"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2846_1.mp4",
        "fileName": "product_2846_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Suction Hose 4Mtr  2. Overflow Hose 4Mtr  3. Strainer  4. O Ring Kit  5. Lance 3 feet"
  },
  {
    "id": "am-1069",
    "name": "C19/20 OM HIGH PRESSURE HANDY POWER SPRAYER - PETROL",
    "slug": "c19-20-om-high-pressure-handy-power-sprayer-petrol-1069",
    "sku": "RIPL010054",
    "riplCode": "RIPL010054",
    "modelNumber": "C19/20",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 52400,
    "comparePrice": 52400,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 47,
    "images": [
      "/images/products/agrimart/product_1069_1.jpg"
    ],
    "description": "Power: 2.1 HP - 1.6 kW     Displacement:  50.2 cm3     Max. delivery rate: 19 L / min     Max. Pressure: 20 Kg / cm2\nWeight: 10.2 Kg",
    "descriptionHtml": "<p><b>Power:</b> 2.1 HP - 1.6 kW    <b>Displacement: </b>50.2 cm3    <b>Max. delivery rate:</b> 19 L / min    <b>Max. Pressure:</b> 20 Kg / cm2 <b>\r\nWeight:</b> 10.2 Kg</p>",
    "specifications": {
      "Sprayer Model": "C19/20",
      "RIPL Code": "RIPL010054",
      "Brand": "OLEO MAC",
      "Power": "2.1 HP - 1.6 kW",
      "Displacement": "50.2 cm3",
      "Max. delivery rate": "19 L / min",
      "Max. Pressure": "20 Kg / cm2",
      "Weight": "10.2 Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/om-high-pressure-spryaer-c1920-petrol-c1920.pdf",
        "fileName": "om-high-pressure-spryaer-c1920-petrol-c1920.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Part List",
        "url": "/agrimart-media/brochures/om-high-pressure-spryaer-c1920-petrol-c1920_2.pdf",
        "fileName": "om-high-pressure-spryaer-c1920-petrol-c1920_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Fittings kit   2. Unions and water filters    3. Spiral hose"
  },
  {
    "id": "am-3548",
    "name": "AM-RTP-7212- DSA-PRO INTERCULTIVATOR/POWER WEEDER With Double Shock Absorber",
    "slug": "am-rtp-7212-dsa-pro-intercultivator-power-weeder-with-double-shock-absorber-3548",
    "sku": "RIPL038522",
    "riplCode": "RIPL038522",
    "modelNumber": "AM-RTP-7212- DSA-PRO",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 53980,
    "comparePrice": 53980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 115,
    "images": [
      "/images/products/agrimart/product_3548_1.jpg",
      "/images/products/agrimart/product_3548_2.jpg"
    ],
    "description": "Model : AM-RTP-7212-DSA-PRO      Engine : AM170F      Power : 7HP/3600RPM      Displacement : 212CC      Tilling Width :550-750-1000mm      Tilling Depth :  ≥  100      Gears : 2 Forward/1 Reverse      Fuel tank capacity : 3.6 L",
    "descriptionHtml": "<p><b>Model</b>: AM-RTP-7212-DSA-PRO     <b>Engine</b>: AM170F     <b>Power</b>: 7HP/3600RPM     <b>Displacement</b>: 212CC     <b>Tilling Width</b>:550-750-1000mm     <b>Tilling Depth</b>: ≥ 100     <b>Gears</b>: 2 Forward/1 Reverse     <b>Fuel tank capacity</b>: 3.6 L</p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-RTP-7212- DSA-PRO",
      "RIPL Code": "RIPL038522",
      "Brand": "AGRIMATE",
      "Model": "AM-RTP-7212-DSA-PRO",
      "Engine": "AM170F",
      "Power": "7HP/3600RPM",
      "Displacement": "212CC",
      "Tilling Width": "550-750-1000mm",
      "Tilling Depth": "≥ 100",
      "Gears": "2 Forward/1 Reverse",
      "Fuel tank capacity": "3.6 L"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-rtp-7212-dsa-pro-intercultivatorpower-weeder-with-double-shock-absorber-am-rtp-7212-dsa-pro.pdf",
        "fileName": "am-rtp-7212-dsa-pro-intercultivatorpower-weeder-with-double-shock-absorber-am-rtp-7212-dsa-pro.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Rubber Tyres 4.00X8    2. Tilling Blades: 32 Nos"
  },
  {
    "id": "am-3313",
    "name": "AM-22 WITH HONDA GX-160 ENGINE HTP POWER SPRAYER",
    "slug": "am-22-with-honda-gx-160-engine-htp-power-sprayer-3313",
    "sku": "DBT24071",
    "riplCode": "DBT24071",
    "modelNumber": "DBT",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 56580,
    "comparePrice": 56580,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3313_1.jpg"
    ],
    "description": "Model: AM22-WITH HONDA GX-160   Engine model:  GX-160     Engine type: Air Cooled 4Stroke    Displacement : 163CC    Power: 2.9KW/3.94HP/3600RPM   Start: Recoil    Fuel tank Capacity: 3.1Ltr    Pump: AM22    RPM : 800   Working Pressure: 20-40kg/Cm 2      Weight: 16kg    Discharge: 18LPM",
    "descriptionHtml": "<p><b>Model: </b>AM22-WITH HONDA GX-160  <b> Engine model: </b>GX-160    <b>Engine type:</b> Air Cooled 4Stroke   <b>Displacement :</b> 163CC   <b>Power: </b>2.9KW/3.94HP/3600RPM <b>  Start: </b>Recoil   <b> Fuel tank Capacity:</b> 3.1Ltr   <b>Pump:</b> AM22   <b>RPM</b>: 800  <b>Working Pressure: </b>20-40kg/Cm<sup>2</sup>  <b>  Weight: </b>16kg   <b>Discharge: </b>18LPM</p>",
    "specifications": {
      "Sprayer Model": "DBT",
      "RIPL Code": "DBT24071",
      "Brand": "AGRIMATE",
      "Model": "AM22-WITH HONDA GX-160",
      "Engine model": "GX-160",
      "Engine type": "Air Cooled 4Stroke",
      "Displacement": "163CC",
      "Power": "2.9KW/3.94HP/3600RPM",
      "Start": "Recoil",
      "Fuel tank Capacity": "3.1Ltr",
      "Pump": "AM22",
      "RPM": "800",
      "Working Pressure": "20-40kg/Cm 2",
      "Weight": "16kg",
      "Discharge": "18LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-22-with-gx-160-engine-dbt.pdf",
        "fileName": "am-22-with-gx-160-engine-dbt.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Lance-3 feet   2. Delivery Hose 50Mtr   3. Suction Hose- 4Mtr   4. Overflow Hose-4Mtr\n5. Strainer  6. O Ring kit"
  },
  {
    "id": "am-96",
    "name": "OM-947-18",
    "slug": "om-947-18-96",
    "sku": "RIPL010004",
    "riplCode": "RIPL010004",
    "modelNumber": "947CS",
    "category": "Chain Saw",
    "categoryId": "cat-am-chain-saw",
    "price": 57980,
    "comparePrice": 57980,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 3,
    "images": [
      "/images/products/agrimart/product_96_1.jpg",
      "/images/products/agrimart/product_96_2.jpg"
    ],
    "description": "Power / Displacement: 2.5 HP/ 1.8 KW    Bar length (nose): 41-46 cm, 16''-18'', (sprocket)    Chain (pitch x gauge): .325''x.058''\nOil Pump: A utomatic, Adjustable, zero flow rate at idle speed    Oil/fuel tank capacity: 0.27 L/0.5 L    W eight: 4 .2 kg",
    "descriptionHtml": "<p><b>Power / Displacement: </b>2.5HP/ 1.8 KW   <b>Bar length (nose): </b>41-46 cm, 16''-18'', (sprocket)   <b>Chain (pitch x gauge): </b>.325''x.058''   <br><b>Oil Pump: </b>Automatic, Adjustable, zero flow rate at idle speed   <b>Oil/fuel tank capacity: </b>0.27 L/0.5 L   <b>W</b><b>eight: </b>4.2 kg</p>",
    "specifications": {
      "Chain Saw Model": "947CS",
      "RIPL Code": "RIPL010004",
      "Brand": "OLEO MAC",
      "Power / Displacement": "2.5 HP/ 1.8 KW",
      "Bar length (nose)": "41-46 cm, 16''-18'', (sprocket)",
      "Chain (pitch x gauge)": ".325''x.058''",
      "Oil Pump": "A utomatic, Adjustable, zero flow rate at idle speed",
      "Oil/fuel tank capacity": "0.27 L/0.5 L",
      "eight": "4 .2 kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/om-chain-saw-947-18-46-cm-petrol-947cs.pdf",
        "fileName": "om-chain-saw-947-18-46-cm-petrol-947cs.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Part List",
        "url": "/agrimart-media/brochures/om-chain-saw-947-18-46-cm-petrol-947cs_2.pdf",
        "fileName": "om-chain-saw-947-18-46-cm-petrol-947cs_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_96_1.mp4",
        "fileName": "product_96_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Bar cover  2. Bar    3. Chain    4. Safety Articles"
  },
  {
    "id": "am-3186",
    "name": "G 44PE -COMFORT PLUS OLEO MAC LAWN MOWER",
    "slug": "g-44pe-comfort-plus-oleo-mac-lawn-mower-3186",
    "sku": "RIPL010056",
    "riplCode": "RIPL010056",
    "modelNumber": "G 44PE",
    "category": "Lawn Mower",
    "categoryId": "cat-am-lawn-mower",
    "price": 57980,
    "comparePrice": 57980,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 62,
    "images": [
      "/images/products/agrimart/product_3186_1.jpg"
    ],
    "description": "Model: G 44PE      Deck: Steel     Power: 1.5 KW     Cutting width: 41CM     Propulsion: push    Grass Box Capacity: 60 Ltr    Lawn Area: 600-800 M2",
    "descriptionHtml": "<p><b>Model: </b>G 44PE     <b>Deck: </b>Steel    <b>Power:</b> 1.5 KW    <b>Cutting width:</b> 41CM    <b>Propulsion: </b>push   <b>Grass Box Capacity:</b> 60 Ltr   <b>Lawn Area: </b>600-800 M2</p>",
    "specifications": {
      "Lawn Mower Model": "G 44PE",
      "RIPL Code": "RIPL010056",
      "Brand": "OLEO MAC",
      "Model": "G 44PE",
      "Deck": "Steel",
      "Power": "1.5 KW",
      "Cutting width": "41CM",
      "Propulsion": "push",
      "Grass Box Capacity": "60 Ltr",
      "Lawn Area": "600-800 M2"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/g-44pe-comfort-plus-oleo-mac-lawn-mower-g-44pe.pdf",
        "fileName": "g-44pe-comfort-plus-oleo-mac-lawn-mower-g-44pe.pdf",
        "available": true
      },
      {
        "label": "View Transmission Diagram",
        "url": "/agrimart-media/brochures/g-44pe-comfort-plus-oleo-mac-lawn-mower-g-44pe_2.pdf",
        "fileName": "g-44pe-comfort-plus-oleo-mac-lawn-mower-g-44pe_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3257",
    "name": "AM-RT-1212-7PR INTERCULTIVATOR/ POWER WEEDER",
    "slug": "am-rt-1212-7pr-intercultivator-power-weeder-3257",
    "sku": "RIPL036739",
    "riplCode": "RIPL036739",
    "modelNumber": "AMRT-1212",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 58500,
    "comparePrice": 58500,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3257_1.jpg"
    ],
    "description": "Model: AM-RT-1212-7PR    Engine: 170FP      Power:  3600RPM     Displacement: 225CC     Fuel Tank Capacity: 3.6Ltr    Cultivating Width: 1050mm    Cultivating Depth: 100mm    Gear : 2Forward+1Reverse",
    "descriptionHtml": "<p><b>Model: </b>AM-RT-1212-7PR  <b>  Engine: </b>170FP   <b>  Power: </b>3600RPM    <b>Displacement: </b>225CC   <b> Fuel Tank Capacity: </b>3.6Ltr   <b>Cultivating Width: </b>1050mm <b>  Cultivating Depth: </b>100mm   <b>Gear</b>: 2Forward+1Reverse</p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AMRT-1212",
      "RIPL Code": "RIPL036739",
      "Brand": "AGRIMATE",
      "Model": "AM-RT-1212-7PR",
      "Engine": "170FP",
      "Power": "3600RPM",
      "Displacement": "225CC",
      "Fuel Tank Capacity": "3.6Ltr",
      "Cultivating Width": "1050mm",
      "Cultivating Depth": "100mm",
      "Gear": "2Forward+1Reverse"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-rt-1212-7pr-intercultivator-power-weeder-amrt-1212.pdf",
        "fileName": "am-rt-1212-7pr-intercultivator-power-weeder-amrt-1212.pdf",
        "available": true
      },
      {
        "label": "View Transmission User Manual",
        "url": "/agrimart-media/brochures/am-rt-1212-7pr-intercultivator-power-weeder-amrt-1212_2.pdf",
        "fileName": "am-rt-1212-7pr-intercultivator-power-weeder-amrt-1212_2.pdf",
        "available": true
      },
      {
        "label": "View Engine Diagram",
        "url": "/agrimart-media/brochures/am-rt-1212-7pr-intercultivator-power-weeder-amrt-1212_3.pdf",
        "fileName": "am-rt-1212-7pr-intercultivator-power-weeder-amrt-1212_3.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3257_1.mp4",
        "fileName": "product_3257_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Plough     2.  Tilling Blades- 32No.s    3. Solid Tyres 4.00x8"
  },
  {
    "id": "am-3315",
    "name": "AM-30 WITH HONDA GX-160 ENGINE HTP Power Sprayer",
    "slug": "am-30-with-honda-gx-160-engine-htp-power-sprayer-3315",
    "sku": "DBT24072",
    "riplCode": "DBT24072",
    "modelNumber": "DBT",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 59580,
    "comparePrice": 59580,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3315_1.jpg"
    ],
    "description": "Model: AM-30 With HONDA GX-160   Engine type:  GX-160/4Stroke    Displacement: 163CC    Power: 2.9KW/3.94HP/3600RPM   Start: Recoil    Fuel tank capacity: 3.1ltr  Pump: AM30    Working Pressure: 20-50kg/Cm 2   Weight: 18kg    RPM : 800  Discharge : 36LPM",
    "descriptionHtml": "<p><b>Model: </b>AM-30 With HONDA GX-160  <b>Engine type:</b> GX-160/4Stroke   <b>Displacement:</b> 163CC   <b>Power: </b>2.9KW/3.94HP/3600RPM <b>  Start: </b>Recoil   <b> Fuel tank capacity:</b> 3.1ltr  <b>Pump:</b> AM30   <b>Working Pressure: </b>20-50kg/Cm<sup>2 </sup><b> Weight:</b>18kg    <b>RPM</b>: 800  <b>Discharge</b>: 36LPM</p>",
    "specifications": {
      "Sprayer Model": "DBT",
      "RIPL Code": "DBT24072",
      "Brand": "AGRIMATE",
      "Model": "AM-30 With HONDA GX-160",
      "Engine type": "GX-160/4Stroke",
      "Displacement": "163CC",
      "Power": "2.9KW/3.94HP/3600RPM",
      "Start": "Recoil",
      "Fuel tank capacity": "3.1ltr",
      "Pump": "AM30",
      "Working Pressure": "20-50kg/Cm 2",
      "Weight": "18kg",
      "RPM": "800",
      "Discharge": "36LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-30-with-gx-160-engine-dbt.pdf",
        "fileName": "am-30-with-gx-160-engine-dbt.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Lance -3feet   2. Delivery Hose - 50Mtr   3. Suction Hose- 4Mtr   4. Overflow hose 4Mtr   5. Strainer  6. O Ring kit"
  },
  {
    "id": "am-3329",
    "name": "AM-30K Power operated sprayer",
    "slug": "am-30k-power-operated-sprayer-3329",
    "sku": "DBT24080",
    "riplCode": "DBT24080",
    "modelNumber": "DBT",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 59580,
    "comparePrice": 59580,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3329_1.jpg"
    ],
    "description": "Model: AM-30K    Engine Type: 168F/4Stroke        Max. Power:  2.98kw/3600RPM    Displacement:  196CC      Pump:  AM-30      Working   Pressure:  21-40Kg/ Cm 2     Discharge :  30-45LPM",
    "descriptionHtml": "<p>Model: AM-30K    Engine Type:168F/4Stroke     Max. Power: 2.98kw/3600RPM   Displacement: 196CC    Pump: AM-30     <b>Working</b> Pressure: 21-40Kg/Cm<sup>2    </sup><b>Discharge</b>: 30-45LPM</p>",
    "specifications": {
      "Sprayer Model": "DBT",
      "RIPL Code": "DBT24080",
      "Brand": "AGRIMATE",
      "Discharge": "30-45LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-30k-power-operated-sprayer-dbt.pdf",
        "fileName": "am-30k-power-operated-sprayer-dbt.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Suction Hose- 4Mtr     2.  Overflow Hose -4Mtr    3.  Strainer    4.  O Ring Kit     5.  Lance-3 feet"
  },
  {
    "id": "am-161",
    "name": "GP-TFF-256-THERMAL GREEN PANTHER FOG SPRAYER",
    "slug": "gp-tff-256-thermal-green-panther-fog-sprayer-161",
    "sku": "RIPL025186",
    "riplCode": "RIPL025186",
    "modelNumber": "GP-TFF-256",
    "category": "Fogger",
    "categoryId": "cat-am-fogger",
    "price": 59980,
    "comparePrice": 59980,
    "brand": "GREEN PANTHER",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 68,
    "images": [
      "/images/products/agrimart/product_161_1.jpg",
      "/images/products/agrimart/product_161_2.jpg"
    ],
    "description": "Chemical Tank Capacity:  6 L    Fuel Tank Capacity :  1.2 L    Fuel Consumption :  2.0 L/H    Fogging Capacity :  25 L/H    Starting method :  Manual & electric  Battery :  Dry battery 3V    Storage battery :  6V 3.3Ah.    Net Weight :  9.7 Kg",
    "descriptionHtml": "<div><b>Chemical Tank Capacity: </b>6 L   <b>Fuel Tank Capacity</b>: 1.2 L   <b>Fuel Consumption</b>: 2.0 L/H   <b>Fogging Capacity</b>: 25 L/H   <b>Starting method</b>: Manual & electric  <b>Battery</b>: Dry battery 3V   <b>Storage battery</b>: 6V 3.3Ah.   <b>Net Weight</b>: 9.7 Kg",
    "specifications": {
      "Fogger Model": "GP-TFF-256",
      "RIPL Code": "RIPL025186",
      "Brand": "GREEN PANTHER",
      "Chemical Tank Capacity": "6 L",
      "Fuel Tank Capacity": "1.2 L",
      "Fuel Consumption": "2.0 L/H",
      "Fogging Capacity": "25 L/H",
      "Starting method": "Manual & electric",
      "Battery": "Dry battery 3V",
      "Storage battery": "6V 3.3Ah.",
      "Net Weight": "9.7 Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/green-panther-fog-sprayer-gp-tff-256-gp-tff-256.pdf",
        "fileName": "green-panther-fog-sprayer-gp-tff-256-gp-tff-256.pdf",
        "available": true
      },
      {
        "label": "View Manual Cum Part List",
        "url": "/agrimart-media/brochures/green-panther-fog-sprayer-gp-tff-256-gp-tff-256_2.pdf",
        "fileName": "green-panther-fog-sprayer-gp-tff-256-gp-tff-256_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3478",
    "name": "AM-4D/5D-PS HTP POWER SPRAYER WITH DIESEL ENGINE",
    "slug": "am-4d-5d-ps-htp-power-sprayer-with-diesel-engine-3478",
    "sku": "RIPL037853",
    "riplCode": "RIPL037853",
    "modelNumber": "AM-4D/5D-PS",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 59980,
    "comparePrice": 59980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 113,
    "images": [
      "/images/products/agrimart/product_3478_1.jpg",
      "/images/products/agrimart/product_3478_2.jpg"
    ],
    "description": "Model : AM-4D/5D-PS Max Power : 3600RPM Displacement : 247CC Pump: AM - 30 RPM : 800-1000 Working pressure : 21-45Kg/Cm 2 Discharge : 30-45LPM",
    "descriptionHtml": "<p><b>Model</b>: AM-4D/5D-PS&nbsp; &nbsp;<b>Max Power</b>: 3600RPM&nbsp; &nbsp; <b>Displacement :</b>247CC&nbsp; &nbsp;<b>Pump:&nbsp;</b>AM<b>-</b>30&nbsp; &nbsp;<b>RPM</b>: 800-1000&nbsp; &nbsp;<b>Working pressure</b>: 21-45Kg/Cm<sup>2&nbsp; &nbsp;&nbsp;</sup><b>Discharge</b>: 30-45LPM&nbsp;</p>",
    "specifications": {
      "Sprayer Model": "AM-4D/5D-PS",
      "RIPL Code": "RIPL037853",
      "Brand": "AGRIMATE",
      "Model": "AM-4D/5D-PS",
      "Max Power": "3600RPM",
      "Displacement": "247CC",
      "Pump": "AM",
      "RPM": "800-1000",
      "Working pressure": "21-45Kg/Cm 2",
      "Discharge": "30-45LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-4d5d-ps-htp-power-sprayer-with-diesel-engine-am-4d5d-ps.pdf",
        "fileName": "am-4d5d-ps-htp-power-sprayer-with-diesel-engine-am-4d5d-ps.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . Suction Hose-4Mtr 2 . Overflow hose-4Mtr 3 . Delivery Hose-8.5mmX50Mtr(2Nos) 4 . Strainer 5 . O-Ring Kit 6 . Lance-3feet"
  },
  {
    "id": "am-3024",
    "name": "AM-CCM-400-1.5K With 3HP Motor Agrimate Chaff Cutter",
    "slug": "am-ccm-400-1-5k-with-3hp-motor-agrimate-chaff-cutter-3024",
    "sku": "RIPL036131",
    "riplCode": "RIPL036131",
    "modelNumber": "AM-CCM - 400-1.5K",
    "category": "Chaff Cutter",
    "categoryId": "cat-am-chaff-cutter",
    "price": 60000,
    "comparePrice": 60000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 63,
    "images": [
      "/images/products/agrimart/product_3024_1.jpg",
      "/images/products/agrimart/product_3024_2.jpg",
      "/images/products/agrimart/product_3024_3.jpg",
      "/images/products/agrimart/product_3024_4.jpg"
    ],
    "description": "Model:  AM-CCM - 400-1.5K     Power: 3HP, 1PH     Single   Speed: 2800 RPM     Blades: 4 Nos.     Chopping Capacity: 1500Kg/Hr",
    "descriptionHtml": "<p><b>Model:</b> AM-CCM - 400-1.5K    <b>Power: </b>3HP, 1PH    <b>Single</b> <b>Speed: </b>2800 RPM    <b>Blades: </b>4 Nos.    <b>Chopping Capacity:</b> 1500Kg/Hr </p>",
    "specifications": {
      "Chaff Cutter Model": "AM-CCM - 400-1.5K",
      "RIPL Code": "RIPL036131",
      "Brand": "AGRIMATE",
      "Model": "AM-CCM - 400-1.5K",
      "Power": "3HP, 1PH",
      "Speed": "2800 RPM",
      "Blades": "4 Nos.",
      "Chopping Capacity": "1500Kg/Hr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View leaflet",
        "url": "/agrimart-media/brochures/am-ccm-400-15k-with-3hp-motor-agrimate-chaff-cutter.pdf",
        "fileName": "am-ccm-400-15k-with-3hp-motor-agrimate-chaff-cutter.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-ccm-400-15k-with-3hp-motor-agrimate-chaff-cutter_2.pdf",
        "fileName": "am-ccm-400-15k-with-3hp-motor-agrimate-chaff-cutter_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3024_1.mp4",
        "fileName": "product_3024_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3368",
    "name": "AM-CCMG-400-3HP ELITE CHAFF CUTTER WITH COPPER MOTOR",
    "slug": "am-ccmg-400-3hp-elite-chaff-cutter-with-copper-motor-3368",
    "sku": "RIPL036956",
    "riplCode": "RIPL036956",
    "modelNumber": "AM-CCMG-400",
    "category": "Chaff Cutter",
    "categoryId": "cat-am-chaff-cutter",
    "price": 60000,
    "comparePrice": 60000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 459,
    "images": [
      "/images/products/agrimart/product_3368_1.jpg",
      "/images/products/agrimart/product_3368_2.jpg",
      "/images/products/agrimart/product_3368_3.jpg"
    ],
    "description": "Model: AM-CCMG-400-3HP ELITE    Power:  3HP,1PH   Single speed:  2800RPM     Blades: 6 Nos. (5Rotating+1Fixed)    Chipping Capacity:  600-1000KG/HR   Voltage:  220V 50HZ",
    "descriptionHtml": "<p><b>Model: </b>AM-CCMG-400-3HP ELITE   <b>Power: </b>3HP,1PH  <b> Single speed: </b>2800RPM   <b> Blades: 6</b>Nos. (5Rotating+1Fixed)   <b>Chipping Capacity: </b>600-1000KG/HR  <b> Voltage: </b>220V 50HZ</p>",
    "specifications": {
      "Chaff Cutter Model": "AM-CCMG-400",
      "RIPL Code": "RIPL036956",
      "Brand": "AGRIMATE",
      "Model": "AM-CCMG-400-3HP ELITE",
      "Power": "3HP,1PH",
      "Single speed": "2800RPM",
      "Blades": "6 Nos. (5Rotating+1Fixed)",
      "Chipping Capacity": "600-1000KG/HR",
      "Voltage": "220V 50HZ"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-ccmg-400-3hp-elite-chaff-cutter-with-copper-motor-am-ccmg-400.pdf",
        "fileName": "am-ccmg-400-3hp-elite-chaff-cutter-with-copper-motor-am-ccmg-400.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-ccmg-400-elite-agrimate-chaff-cutter-am-ccmg-400_2.pdf",
        "fileName": "am-ccmg-400-elite-agrimate-chaff-cutter-am-ccmg-400_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3368_1.mp4",
        "fileName": "product_3368_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "* High Durable steel Case Gear Parts * Adjustable Grass Cutting Length * Grass Cutting Length: 20mm & 40mm"
  },
  {
    "id": "am-2850",
    "name": "AM30+GX 160-HTP POWER SPRAYER",
    "slug": "am30-gx-160-htp-power-sprayer-2850",
    "sku": "RIPL013321BOM",
    "riplCode": "RIPL013321BOM",
    "modelNumber": "AM 30 +GX 160 NEO",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 60344,
    "comparePrice": 60344,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_2850_1.jpg"
    ],
    "description": "Engine model:  GX-160     Engine type: Air cooled 4S Single cylinder    Displacement: 163 CC    Power: 3.6KW / 4.8HP / 3600 RPM   Start: Recoil    Fuel tank capacity: 3.1ltr  Pump: AM30    Working Pressure: 20-50kg/cm2   Weight: 18kg",
    "descriptionHtml": "<p><b>Engine model: </b>GX-160    <b>Engine type:</b> Air cooled 4S Single cylinder   <b>Displacement:</b> 163 CC   <b>Power: </b>3.6KW / 4.8HP / 3600 RPM <b>  Start: </b>Recoil   <b> Fuel tank capacity:</b> 3.1ltr  <b>Pump:</b> AM30   <b>Working Pressure: </b>20-50kg/cm2 <b>  Weight:</b>18kg <br></p>",
    "specifications": {
      "Sprayer Model": "AM 30 +GX 160 NEO",
      "RIPL Code": "RIPL013321BOM",
      "Brand": "AGRIMATE",
      "Engine model": "GX-160",
      "Engine type": "Air cooled 4S Single cylinder",
      "Displacement": "163 CC",
      "Power": "3.6KW / 4.8HP / 3600 RPM",
      "Start": "Recoil",
      "Fuel tank capacity": "3.1ltr",
      "Pump": "AM30",
      "Working Pressure": "20-50kg/cm2",
      "Weight": "18kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2850_1.mp4",
        "fileName": "product_2850_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Lance   2. Delivery hose 50Mtr   3. Suction hose- 4Mtr   4. Overflow hose 4Mtr   5. Suction strainer  6. O ring kit"
  },
  {
    "id": "am-1861",
    "name": "YP-40 DIAPHRAM PUMP-WITH OUT ENGINE GREEN PANTHER Diaphragm Sprayer",
    "slug": "yp-40-diaphram-pump-with-out-engine-green-panther-diaphragm-sprayer-1861",
    "sku": "RIPL014295",
    "riplCode": "RIPL014295",
    "modelNumber": "YP-40",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 63980,
    "comparePrice": 63980,
    "brand": "GREEN PANTHER",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 8,
    "images": [
      "/images/products/agrimart/product_1861_1.jpg"
    ],
    "description": "",
    "descriptionHtml": "<p><br></p>",
    "specifications": {
      "Sprayer Model": "YP-40",
      "RIPL Code": "RIPL014295",
      "Brand": "GREEN PANTHER"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3311",
    "name": "AM-22 WITH HONDA GX-80 ENGINE HTP POWER SPRAYER",
    "slug": "am-22-with-honda-gx-80-engine-htp-power-sprayer-3311",
    "sku": "DBT24070",
    "riplCode": "DBT24070",
    "modelNumber": "DBT",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 65480,
    "comparePrice": 65480,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3311_1.jpg"
    ],
    "description": "Model: AM-22 WITH HONDA GX 80 Engine: GX 80 / 4Stroke Max Power: 3600RPM Displacement: 79.7CC Pump: AM22 RPM : 800 Working Pressure : 20-24Kg/Cm 2 Discharge : 18LPM",
    "descriptionHtml": "<p><b>Model: </b>AM-22<b>&nbsp;</b>WITH HONDA GX 80<b>&nbsp; &nbsp;Engine: </b>GX 80 / 4Stroke<b>&nbsp; &nbsp;Max Power:</b>&nbsp;3600RPM&nbsp; &nbsp;&nbsp; &nbsp;<b>Displacement:</b> 79.7CC&nbsp;&nbsp;<b> </b>&nbsp;<b>Pump:</b>&nbsp;AM22&nbsp; &nbsp;&nbsp;<b>RPM</b>: 800&nbsp; &nbsp;<b>Working Pressure</b>: 20-24Kg/Cm<sup>2</sup>&nbsp; &nbsp;<b>Discharge</b>: 18LPM<br></p>",
    "specifications": {
      "Sprayer Model": "DBT",
      "RIPL Code": "DBT24070",
      "Brand": "AGRIMATE",
      "Model": "AM-22",
      "Engine": "GX 80 / 4Stroke",
      "Max Power": "3600RPM",
      "Displacement": "79.7CC",
      "Pump": "AM22",
      "RPM": "800",
      "Working Pressure": "20-24Kg/Cm 2",
      "Discharge": "18LPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-22-with-honda-gx-80-engine-htp-power-sprayer-dbt.pdf",
        "fileName": "am-22-with-honda-gx-80-engine-htp-power-sprayer-dbt.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Suction Hose - 4Mtr 2. Overflow Hose -4Mtr 3. Strainer 4. O Ring Kit 5. Lance-3 feet"
  },
  {
    "id": "am-3560",
    "name": "AM-PTMG-500-170EN PADDY THRESHER WITH DIESEL ENGINE",
    "slug": "am-ptmg-500-170en-paddy-thresher-with-diesel-engine-3560",
    "sku": "RIPL038742",
    "riplCode": "RIPL038742",
    "modelNumber": "AM-PTMG-500-170EN",
    "category": "Thresher",
    "categoryId": "cat-am-thresher",
    "price": 65980,
    "comparePrice": 65980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 42,
    "images": [
      "/images/products/agrimart/product_3560_1.jpg",
      "/images/products/agrimart/product_3560_2.jpg",
      "/images/products/agrimart/product_3560_3.jpg",
      "/images/products/agrimart/product_3560_4.jpg"
    ],
    "description": "Model : AM-PTMG-500-170EN    Displacement : 247CC    Power : 5HP Diesel Engine    Productivity : 500-750Kg/H",
    "descriptionHtml": "<p> <b>Model</b>: AM-PTMG-500-170EN   <b>Displacement</b>: 247CC   <b>Power</b>: 5HP Diesel Engine    <b>Productivity</b>: 500-750Kg/H</p><p><br></p><p><br></p>",
    "specifications": {
      "Thresher": "AM-PTMG-500-170EN",
      "RIPL Code": "RIPL038742",
      "Brand": "AGRIMATE",
      "Model": "AM-PTMG-500-170EN",
      "Displacement": "247CC",
      "Power": "5HP Diesel Engine",
      "Productivity": "500-750Kg/H"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-2918",
    "name": "SMH-505+HONDA ENGINE SUNMAX POWER WEEDER",
    "slug": "smh-505-honda-engine-sunmax-power-weeder-2918",
    "sku": "RIPL033128",
    "riplCode": "RIPL033128",
    "modelNumber": "SMH505",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 66590,
    "comparePrice": 66590,
    "brand": "SUNMAX",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 14,
    "images": [
      "/images/products/agrimart/product_2918_1.jpg"
    ],
    "description": "No Information Available.",
    "descriptionHtml": "No Information Available.",
    "specifications": {
      "Intercultivator/power Weeder Model": "SMH505",
      "RIPL Code": "RIPL033128",
      "Brand": "SUNMAX"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-2633",
    "name": "G48 PK - COMFORT PLUS OLEO MAC LAWN MOWER - GASOLINE",
    "slug": "g48-pk-comfort-plus-oleo-mac-lawn-mower-gasoline-2633",
    "sku": "RIPL030029",
    "riplCode": "RIPL030029",
    "modelNumber": "G48PK-COMFORT PLUS",
    "category": "Lawn Mower",
    "categoryId": "cat-am-lawn-mower",
    "price": 67132,
    "comparePrice": 67132,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 4,
    "images": [
      "/images/products/agrimart/product_2633_1.jpg",
      "/images/products/agrimart/product_2633_2.jpg"
    ],
    "description": "Model: G 48 PK     Deck: Steel     Engine Make/Model : Emak K 450 OHV    Propulsion: Push Type    Cutting adjustment: Independent     Displacement:   123 cm³    Cutting Height: From 28 to 75mm    Grass box capacity: 60 L     Cutting Width: 41 cm    Mulching/Side discharge: Optical/not available      Weight: 31.5   Kg",
    "descriptionHtml": "<p><b>Model: </b>G 48 PK<b>    Deck: </b>Steel<b>    Engine Make/Model :</b> Emak K 450 OHV   <b>Propulsion: </b>Push Type   <b>Cutting adjustment: </b>Independent    <b>Displacement:</b> 123 cm³   <b>Cutting Height:</b> From 28 to 75mm   <b>Grass box capacity:</b> 60 L    <b>Cutting Width:</b> 41 cm    <b>Mulching/Side discharge:</b> Optical/not available     <b>Weight: </b>31.5<b> </b>Kg<br><br></p>",
    "specifications": {
      "Lawn Mower Model": "G48PK-COMFORT PLUS",
      "RIPL Code": "RIPL030029",
      "Brand": "OLEO MAC",
      "Model": "G 48 PK",
      "Deck": "Steel",
      "Engine Make/Model": "Emak K 450 OHV",
      "Propulsion": "Push Type",
      "Cutting adjustment": "Independent",
      "Displacement": "123 cm³",
      "Cutting Height": "From 28 to 75mm",
      "Grass box capacity": "60 L",
      "Cutting Width": "41 cm",
      "Mulching/Side discharge": "Optical/not available",
      "Weight": "31.5"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/g48-pk-comfort-plus-oleo-mac-lawn-mower-gasoline.pdf",
        "fileName": "g48-pk-comfort-plus-oleo-mac-lawn-mower-gasoline.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Parts List",
        "url": "/agrimart-media/brochures/om-lawn-mower-g48pk-comfort-plus-petrol-g48pk-comfort-plus_2.pdf",
        "fileName": "om-lawn-mower-g48pk-comfort-plus-petrol-g48pk-comfort-plus_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_2633_1.mp4",
        "fileName": "product_2633_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-1604",
    "name": "GREEN PANTHER FOG SPRAYER GP 252 EST",
    "slug": "green-panther-fog-sprayer-gp-252-est-1604",
    "sku": "RIPL023199",
    "riplCode": "RIPL023199",
    "modelNumber": "GP-TFF-252",
    "category": "Fogger",
    "categoryId": "cat-am-fogger",
    "price": 67184,
    "comparePrice": 67184,
    "brand": "GREEN PANTHER",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 2,
    "images": [
      "/images/products/agrimart/product_1604_1.jpg",
      "/images/products/agrimart/product_1604_2.jpg"
    ],
    "description": "Gasoline tank capacity S.S : 1.5L    Solution tank capacity : 6L    Flow rate : 0-42L/H    Pressure in solution tank : 0.25Bar\nPressure in gasoline tank : 0.06Bar    Fuel consumption : 1.5 - 2.0 L/H    Net weight : 8.5kg",
    "descriptionHtml": "<p><b>Gasoline tank capacity S.S :</b> 1.5L   <b>Solution tank capacity :</b> 6L   <b>Flow rate : </b>0-42L/H   <b>Pressure in solution tank : </b>0.25Bar    <br><b>Pressure in gasoline tank :</b> 0.06Bar   <b>Fuel consumption :</b> 1.5 - 2.0 L/H   <b>Net weight : </b>8.5kg</p>",
    "specifications": {
      "Fogger Model": "GP-TFF-252",
      "RIPL Code": "RIPL023199",
      "Brand": "GREEN PANTHER",
      "Gasoline tank capacity S.S": "1.5L",
      "Solution tank capacity": "6L",
      "Flow rate": "0-42L/H",
      "Pressure in solution tank": "0.25Bar",
      "Pressure in gasoline tank": "0.06Bar",
      "Fuel consumption": "1.5 - 2.0 L/H",
      "Net weight": "8.5kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/green-panther-fog-sprayer-gp-tff-252-gp-tff-252.pdf",
        "fileName": "green-panther-fog-sprayer-gp-tff-252-gp-tff-252.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Standard tools    2. Cleaning brush   3. Repair kit    4. Funnel"
  },
  {
    "id": "am-1606",
    "name": "AM162-OM MIST BLOWER BACKPACK-WITH OUT DUSTER KIT-PETROL",
    "slug": "am162-om-mist-blower-backpack-with-out-duster-kit-petrol-1606",
    "sku": "RIPL010079",
    "riplCode": "RIPL010079",
    "modelNumber": "AM162",
    "category": "Blower & Mist Blower",
    "categoryId": "cat-am-blower-mistblower",
    "price": 68800,
    "comparePrice": 68800,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_1606_1.jpg",
      "/images/products/agrimart/product_1606_2.jpg",
      "/images/products/agrimart/product_1606_3.jpg"
    ],
    "description": "Power : 4.5 HP - 3.3 kW     Displacement : 61.3 cm³     Max. air flow: 20.0 m³ / min       Liquid delivery rate:  0.67 ÷ 5.15 L/min    Liquid tank capacity: 16.0 L    Weight : 11.5 Kg",
    "descriptionHtml": "<p><b>Power</b><b>: </b>4.5 HP - 3.3 kW    <b>Displacement</b><b>: </b>61.3 cm³    <b>Max. air flow:</b> 20.0 m³ / min <b>    </b><b>Liquid delivery rate:</b> 0.67 ÷ 5.15 L/min   <b>Liquid tank capacity:</b> 16.0 L   <b>Weight :</b> 11.5 Kg</p>",
    "specifications": {
      "Blower Model": "AM162",
      "RIPL Code": "RIPL010079",
      "Brand": "OLEO MAC",
      "Max. air flow": "20.0 m³ / min",
      "Liquid delivery rate": "0.67 ÷ 5.15 L/min",
      "Liquid tank capacity": "16.0 L",
      "Weight": "11.5 Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am162-om-mist-blower-backpack-with-out-duster-kit-petrol.pdf",
        "fileName": "am162-om-mist-blower-backpack-with-out-duster-kit-petrol.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Parts List",
        "url": "/agrimart-media/brochures/om-mist-blower-backpack-am162-with-out-duster-kit-petrol_2.pdf",
        "fileName": "om-mist-blower-backpack-am162-with-out-duster-kit-petrol_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . Tools Kit"
  },
  {
    "id": "am-58",
    "name": "AF-2000N-NT-SS BODY AGRIMATE FOG SPRAYER",
    "slug": "af-2000n-nt-ss-body-agrimate-fog-sprayer-58",
    "sku": "RIPL005732",
    "riplCode": "RIPL005732",
    "modelNumber": "AF2000N-NT",
    "category": "Fogger",
    "categoryId": "cat-am-fogger",
    "price": 71980,
    "comparePrice": 71980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 1,
    "images": [
      "/images/products/agrimart/product_58_1.jpg",
      "/images/products/agrimart/product_58_2.jpg",
      "/images/products/agrimart/product_58_3.jpg"
    ],
    "description": "Gasoline Tank Capacity: 1.5L    Solution Tank Capacity: 5L    Flow Rate: 8-42L/H     Pressure in Solution Tank: 0.25Bar    Pressure in Gasoline Tank: 0.6Bar\nStarting Method: Manual Pumping     Fuel Consumption: 1.5L/H     Electricity/Battery: 6v / 4 x 1.5v     Weight: 7.9kg",
    "descriptionHtml": "<p><b>Gasoline Tank Capacity:</b> 1.5L   <b>Solution Tank Capacity:</b> 5L   <b>Flow Rate:</b> 8-42L/H    <b>Pressure in Solution Tank:</b> 0.25Bar   <b>Pressure in Gasoline Tank:</b> 0.6Bar  <br><b>Starting Method:</b> Manual Pumping    <b>Fuel Consumption:</b> 1.5L/H    <b>Electricity/Battery:</b> 6v / 4 x 1.5v    <b>Weight:</b> 7.9kg</p><p><o:p></o:p></p>",
    "specifications": {
      "Fogger Model": "AF2000N-NT",
      "RIPL Code": "RIPL005732",
      "Brand": "AGRIMATE",
      "Gasoline Tank Capacity": "1.5L",
      "Solution Tank Capacity": "5L",
      "Flow Rate": "8-42L/H",
      "Pressure in Solution Tank": "0.25Bar",
      "Pressure in Gasoline Tank": "0.6Bar",
      "Starting Method": "Manual Pumping",
      "Fuel Consumption": "1.5L/H",
      "Electricity/Battery": "6v / 4 x 1.5v",
      "Weight": "7.9kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/af-2000n-nt-ss-body-agrimate-fog-sprayer.pdf",
        "fileName": "af-2000n-nt-ss-body-agrimate-fog-sprayer.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/af-2000n-nt-ss-body-agrimate-fogger_2.pdf",
        "fileName": "af-2000n-nt-ss-body-agrimate-fogger_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_58_1.mp4",
        "fileName": "product_58_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Standard tools    2. Cleaning brush    3. Repair kit    4. Funnel"
  },
  {
    "id": "am-1837",
    "name": "POWER CUTTER 983-16",
    "slug": "power-cutter-983-16-1837",
    "sku": "RIPL010083",
    "riplCode": "RIPL010083",
    "modelNumber": "983 TTA",
    "category": "Power Cutter",
    "categoryId": "cat-am-power-cutter",
    "price": 73980,
    "comparePrice": 73980,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_1837_1.jpg"
    ],
    "description": "Type:  Emak 2-stroke    Displacement:  80,7 cm³    Min. Cutting speed:  2500-3000 min -1    Power:    5,1 / 3,7 (9500) HP/kW   Spark plug:  Champion RCJ-7Y – NGK BPR6A    Carburetor:  Walbro WJ 104    Max spindle speed: 5100 giri/min    Max. cutting depth:   100 (4\") mm (in)",
    "descriptionHtml": "<p><b>Type:</b> Emak 2-stroke   <b>Displacement:</b> 80,7 cm³    <b>Min. Cutting speed:</b> 2500-3000 min -1   <b>Power:</b>   5,1 / 3,7 (9500) HP/kW  <b>Spark plug:</b> Champion RCJ-7Y – NGK BPR6A   <b>Carburetor: </b>Walbro WJ 104   <b>Max spindle speed:</b> 5100 giri/min   <b>Max. cutting depth:</b>  100 (4\") mm (in)  </p><p> </p>",
    "specifications": {
      "Power Cutter": "983 TTA",
      "RIPL Code": "RIPL010083",
      "Brand": "OLEO MAC",
      "Type": "Emak 2-stroke",
      "Displacement": "80,7 cm³",
      "Min. Cutting speed": "2500-3000 min -1",
      "Power": "5,1 / 3,7 (9500) HP/kW",
      "Spark plug": "Champion RCJ-7Y – NGK BPR6A",
      "Carburetor": "Walbro WJ 104",
      "Max spindle speed": "5100 giri/min",
      "Max. cutting depth": "100 (4\") mm (in)"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Brochure",
        "url": "/agrimart-media/brochures/power-cutter-983-tta-oleomac-983-tta.pdf",
        "fileName": "power-cutter-983-tta-oleomac-983-tta.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Parts List",
        "url": "/agrimart-media/brochures/power-cutter-983-tta-oleomac-983-tta_2.pdf",
        "fileName": "power-cutter-983-tta-oleomac-983-tta_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-1857",
    "name": "GP-DP-306F WITH ENGINE GREEN PANTHER DIAPHRAGM SPRAYER",
    "slug": "gp-dp-306f-with-engine-green-panther-diaphragm-sprayer-1857",
    "sku": "RIPL025188",
    "riplCode": "RIPL025188",
    "modelNumber": "GP-DP-306F",
    "category": "Sprayer",
    "categoryId": "cat-am-sprayer",
    "price": 73980,
    "comparePrice": 73980,
    "brand": "GREEN PANTHER",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 20,
    "images": [
      "/images/products/agrimart/product_1857_1.jpg"
    ],
    "description": "Model: GP-DP-306F    Max. Flow: 35 L/Min    Max. Pressure: 40 Bar    Max. Speed: 550 rpm   Max. temperature: 50 C     Weight: 11 Kg",
    "descriptionHtml": "<p><b>Model:</b> GP-DP-306F    <b>Max. Flow:</b> 35 L/Min   <b>Max. Pressure:</b> 40 Bar   <b>Max. Speed:</b> 550 rpm  <b>Max. temperature:</b> 50 C    <b>Weight:</b> 11 Kg</p>",
    "specifications": {
      "Sprayer Model": "GP-DP-306F",
      "RIPL Code": "RIPL025188",
      "Brand": "GREEN PANTHER",
      "Model": "GP-DP-306F",
      "Max. Flow": "35 L/Min",
      "Max. Pressure": "40 Bar",
      "Max. Speed": "550 rpm",
      "Max. temperature": "50 C",
      "Weight": "11 Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/green-panther-diaphragm-sprayer-gp-dp-306f-gp-dp-306f.pdf",
        "fileName": "green-panther-diaphragm-sprayer-gp-dp-306f-gp-dp-306f.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3034",
    "name": "AM-CF-PPT-50FT Carbon Fibre Telescopic Manual Pole",
    "slug": "am-cf-ppt-50ft-carbon-fibre-telescopic-manual-pole-3034",
    "sku": "RIPL035658",
    "riplCode": "RIPL035658",
    "modelNumber": "AM-CF-PPT-50FT",
    "category": "Pruner",
    "categoryId": "cat-am-pruner",
    "price": 74200,
    "comparePrice": 74200,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 36,
    "images": [
      "/images/products/agrimart/default.jpg"
    ],
    "description": "1. Attachments are not included with the machine                                  2. Attachments are optional accessories which are chargeable basis.",
    "descriptionHtml": "<p><b>1.</b> Attachments are not included with the machine                                 </p><p><b>2. </b>Attachments are optional accessories which are chargeable basis.</p>",
    "specifications": {
      "Pruner Model": "AM-CF-PPT-50FT",
      "RIPL Code": "RIPL035658",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-421",
    "name": "OM-746T-OLEO MAC-WEED CUTTER/ BRUSH CUTTER -PETROL",
    "slug": "om-746t-oleo-mac-weed-cutter-brush-cutter-petrol-421",
    "sku": "RIPL010147",
    "riplCode": "RIPL010147",
    "modelNumber": "746T",
    "category": "Brush Cutter",
    "categoryId": "cat-am-brush-cutter",
    "price": 77864,
    "comparePrice": 77864,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 8,
    "images": [
      "/images/products/agrimart/product_421_1.jpg",
      "/images/products/agrimart/product_421_2.jpg"
    ],
    "description": "Model: OM-746T-BC       Power/Displacement: 2.5 HP-1.8 kW / 45.7 CM 3      Diameter:  32 mm     Cutting Components: 130mm dia, tap&go head with 3.00mm dia line 305 mm dia. disc with 3 blades      Clutch:  Centifugal    Dry weight without cutting tools:  8.1 KG    Grip:  Handlebar    Fuel tank capacity: 1.50 L    Harness: Double professional    Sound Pressure/ Power level: 91/104 dB(A)    Lh/rh Vibration level : 3.7/5.4 m/s 2",
    "descriptionHtml": "<p><b>Model: </b>OM-746T-BC <b>     Power/Displacement:</b> 2.5 HP-1.8 kW<b>/</b>45.7 CM3    <b>Diameter: </b>32 mm    <b>Cutting Components:</b> 130mm dia, tap&go head with 3.00mm dia line 305 mm dia. disc with 3 blades     <b>Clutch: </b>Centifugal   Dry weight without cutting tools: 8.1 KG   Grip: Handlebar   <b>Fuel tank capacity:</b> 1.50 L   <b>Harness:</b> Double professional   <b>Sound Pressure/ Power level: </b>91/104 dB(A)    <b>Lh/rh Vibration level</b> : 3.7/5.4 m/s<sup>2 </sup><br></p><p><o:p></o:p></p>",
    "specifications": {
      "Weed Cutter Model": "746T",
      "RIPL Code": "RIPL010147",
      "Brand": "OLEO MAC",
      "Model": "OM-746T-BC",
      "Power/Displacement": "2.5 HP-1.8 kW",
      "Diameter": "32 mm",
      "Cutting Components": "130mm dia, tap&go head with 3.00mm dia line 305 mm dia. disc with 3 blades",
      "Clutch": "Centifugal Dry weight without cutting tools: 8.1 KG Grip: Handlebar",
      "Fuel tank capacity": "1.50 L",
      "Harness": "Double professional",
      "Sound Pressure/ Power level": "91/104 dB(A)",
      "Lh/rh Vibration level": "3.7/5.4 m/s 2"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/om-746t-oleo-mac-weed-cutter-power-weeder-petrol.pdf",
        "fileName": "om-746t-oleo-mac-weed-cutter-power-weeder-petrol.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Part List",
        "url": "/agrimart-media/brochures/om-weed-cutterpower-weeder-746t-petrol-746t_2.pdf",
        "fileName": "om-weed-cutterpower-weeder-746t-petrol-746t_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_421_1.mp4",
        "fileName": "product_421_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1.   3 Tooth   Blade    2.  Tap and go     3. Tools Kit     4. Harness"
  },
  {
    "id": "am-596",
    "name": "MH-180RK-OLEO MAC INTERCULTIVATOR (W/O WHEEL) PETROL",
    "slug": "mh-180rk-oleo-mac-intercultivator-w-o-wheel-petrol-596",
    "sku": "RIPL010104",
    "riplCode": "RIPL010104",
    "modelNumber": "MH180R",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 77980,
    "comparePrice": 77980,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 432,
    "images": [
      "/images/products/agrimart/product_596_1.jpg",
      "/images/products/agrimart/product_596_2.jpg",
      "/images/products/agrimart/product_596_3.jpg"
    ],
    "description": "Model: MH180K    Engine: Emak K 800 H OHV     Gear Box: 1 forward + 1 Reverse    Power : 5.5HP     Rotor : 3+3 blades 80CM with protection Disc    Engine Oil:  20w40/ 15w40    Weight: 50kg    Displacement: 183cm 3      Tilling width : 900mm     Tilling Depth : 100mm",
    "descriptionHtml": "<p><b>Model: </b>MH180K   <b>Engine:</b> Emak K 800 H OHV    <b>Gear Box: </b>1 forward + 1 Reverse    <b>Power</b>: 5.5HP    <b>Rotor</b>: 3+3 blades 80CM with protection Disc   Engine Oil: 20w40/ 15w40   <b>Weight:</b> 50kg   <b>Displacement: </b>183cm<sup>3     </sup><b>Tilling width</b>: 900mm    <b>Tilling Depth</b>: 100mm</p><p><o:p></o:p></p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "MH180R",
      "RIPL Code": "RIPL010104",
      "Brand": "OLEO MAC",
      "Model": "MH180K",
      "Engine": "Emak K 800 H OHV",
      "Gear Box": "1 forward + 1 Reverse",
      "Power": "5.5HP",
      "Rotor": "3+3 blades 80CM with protection Disc Engine Oil: 20w40/ 15w40",
      "Weight": "50kg",
      "Displacement": "183cm 3",
      "Tilling width": "900mm",
      "Tilling Depth": "100mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/mh-180rk-oleo-mac-intercultivator-wo-wheel-petrol.pdf",
        "fileName": "mh-180rk-oleo-mac-intercultivator-wo-wheel-petrol.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Parts List",
        "url": "/agrimart-media/brochures/om-rotary-tiller-mh180r-rk-wo-wheel-petrol-mh180rk_2.pdf",
        "fileName": "om-rotary-tiller-mh180r-rk-wo-wheel-petrol-mh180rk_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_596_1.mp4",
        "fileName": "product_596_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Std. Accessories    2. Wheel (Optional)    3. Tools kit"
  },
  {
    "id": "am-3319",
    "name": "MH-180RK Power Weeder",
    "slug": "mh-180rk-power-weeder-3319",
    "sku": "DBT24074",
    "riplCode": "DBT24074",
    "modelNumber": "DBT",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 77980,
    "comparePrice": 77980,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3319_1.jpg"
    ],
    "description": "Model: MH180K Engine: Emak K 800 H OHV Gear Box: 1 forward + 1 Reverse Power : 5.5HP Rotor : 3+3 blades 80CM with protection Disc Engine Oil: 20w40/ 15w40 Weight: 50kg Displacement: 183cm 3 Tilling width : 900mm Tilling Depth : 100mm",
    "descriptionHtml": "<p>Model:&nbsp;MH180K&nbsp; &nbsp;Engine:&nbsp;Emak K 800 H OHV&nbsp; &nbsp;&nbsp;Gear Box:&nbsp;1 forward + 1 Reverse&nbsp; &nbsp;&nbsp;Power: 5.5HP&nbsp; &nbsp;&nbsp;Rotor: 3+3 blades 80CM with protection Disc&nbsp; &nbsp;Engine Oil:&nbsp;20w40/ 15w40&nbsp; &nbsp;Weight:&nbsp;50kg&nbsp; &nbsp;Displacement:&nbsp;183cm<sup>3&nbsp; &nbsp; &nbsp;</sup>Tilling width: 900mm&nbsp; &nbsp;&nbsp;Tilling Depth: 100mm</p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "DBT",
      "RIPL Code": "DBT24074",
      "Brand": "OLEO MAC",
      "Model": "MH180K Engine: Emak K 800 H OHV Gear Box: 1 forward + 1 Reverse Power : 5.5HP Rotor : 3+3 blades 80CM with protection Disc Engine Oil: 20w40/ 15w40 Weight: 50kg Displacement: 183cm 3 Tilling width : 900mm Tilling Depth : 100mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/mh-180rk-power-weeder-dbt.pdf",
        "fileName": "mh-180rk-power-weeder-dbt.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Std. Accessories    2. Wheel (Optional)    3. Tools kit"
  },
  {
    "id": "am-3354",
    "name": "GPEA-196-2 Men Operated Earth Auger",
    "slug": "gpea-196-2-men-operated-earth-auger-3354",
    "sku": "RIPL014151D",
    "riplCode": "RIPL014151D",
    "modelNumber": "GP-Auger",
    "category": "Earth Auger",
    "categoryId": "cat-am-earth-auger",
    "price": 79980,
    "comparePrice": 79980,
    "brand": "GREEN PANTHER",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 28,
    "images": [
      "/images/products/agrimart/product_3354_2.jpg"
    ],
    "description": "Model: GPEA-2M-196L  Engine: 4 Cycle  Power: 196 CC    Max. RPM: 121  Bit Weight: 15 Kgs  Engine Weight: 25 kgs",
    "descriptionHtml": "<b>Model: </b>GPEA-2M-196L <b> Engine: </b>4 Cycle  <b>Power: </b>196 CC   <b>Max. RPM: </b>121  <b>Bit Weight: </b>15 Kgs  <b>Engine Weight:</b> 25 kgs",
    "specifications": {
      "Earth Auger Model": "GP-Auger",
      "RIPL Code": "RIPL014151D",
      "Brand": "GREEN PANTHER",
      "Model": "GPEA-2M-196L",
      "Engine": "4 Cycle",
      "Power": "196 CC",
      "Max. RPM": "121",
      "Bit Weight": "15 Kgs",
      "Engine Weight": "25 kgs"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/gpea-196-2-men-operated-earth-auger_2.pdf",
        "fileName": "gpea-196-2-men-operated-earth-auger_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3374",
    "name": "AM-CTPG-1860 CORN THRESHER CUM PEELER WITH WOODEN CRATE PACKING & WITHOUT MOTOR",
    "slug": "am-ctpg-1860-corn-thresher-cum-peeler-with-wooden-crate-packing-without-motor-3374",
    "sku": "RIPL036958",
    "riplCode": "RIPL036958",
    "modelNumber": "AM-CTPG-1860",
    "category": "Thresher",
    "categoryId": "cat-am-thresher",
    "price": 79980,
    "comparePrice": 79980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 7,
    "images": [
      "/images/products/agrimart/product_3374_1.jpg",
      "/images/products/agrimart/product_3374_2.jpg"
    ],
    "description": "Model: AM-CTPG-1860     Power: 4 HP    Phase: 1 PH     Motor Voltage: 220V,50HZ",
    "descriptionHtml": "<p><b>Model: </b>AM-CTPG-1860    <b>Power: </b>4 HP<b>   Phase: </b>1 PH    <b>Motor Voltage: </b>220V,50HZ </p>",
    "specifications": {
      "Thresher": "AM-CTPG-1860",
      "RIPL Code": "RIPL036958",
      "Brand": "AGRIMATE",
      "Model": "AM-CTPG-1860",
      "Power": "4 HP",
      "Phase": "1 PH",
      "Motor Voltage": "220V,50HZ"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-108",
    "name": "GS-650-18 CHAIN SAW",
    "slug": "gs-650-18-chain-saw-108",
    "sku": "RIPL010088",
    "riplCode": "RIPL010088",
    "modelNumber": "GS650",
    "category": "Chain Saw",
    "categoryId": "cat-am-chain-saw",
    "price": 80352,
    "comparePrice": 80352,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 12,
    "images": [
      "/images/products/agrimart/product_108_1.jpg",
      "/images/products/agrimart/product_108_2.jpg",
      "/images/products/agrimart/product_108_4.jpg"
    ],
    "description": "Model: GS 650 Chain saw      Power / Displacement: 4.7 HP - 3.5 kW/63.4 cm³     Bar length (nose): 46-51 cm,/18''-20'', (replaceable\nsprocket), 51-61-71 cm, / 20\"-24\"-28\"(stellite)      Chain (pitch x gauge): 3/8''x.058''     Oil Pump: A utomatic, adjustable, zero flow rate at idle speed    Oil/fuel tank capacity: 0.45 L/0.80 L     Dry weight without bar and chain: 6.5 kg    Sound Pressure/ Power level: 103.3/1112 dB(A)      Lh/rh Vibration level : 5.3/5.3 m/s 2",
    "descriptionHtml": "<p><b>Model: </b>GS 650 Chain saw<b>     Power / Displacement: </b>4.7 HP - 3.5 kW/63.4 cm³    <b>Bar length (nose): </b>46-51 cm,/18''-20'', (replaceable\r\nsprocket), 51-61-71 cm, / 20\"-24\"-28\"(stellite)      <b>Chain (pitch x gauge): </b>3/8''x.058''    <b>Oil Pump: </b>Automatic, adjustable, zero flow rate at idle speed   <b>Oil/fuel tank capacity: </b>0.45 L/0.80 L    <b>Dry weight without bar and chain: </b>6.5 kg   Sound Pressure/ Power level: 103.3/1112 dB(A)     Lh/rh Vibration level: 5.3/5.3 m/s<sup>2 </sup></p>",
    "specifications": {
      "Chain Saw Model": "GS650",
      "RIPL Code": "RIPL010088",
      "Brand": "OLEO MAC",
      "Model": "GS 650 Chain saw",
      "Power / Displacement": "4.7 HP - 3.5 kW/63.4 cm³",
      "Bar length (nose)": "46-51 cm,/18''-20'', (replaceable sprocket), 51-61-71 cm, / 20\"-24\"-28\"(stellite)",
      "Chain (pitch x gauge)": "3/8''x.058''",
      "Oil Pump": "A utomatic, adjustable, zero flow rate at idle speed",
      "Oil/fuel tank capacity": "0.45 L/0.80 L",
      "Dry weight without bar and chain": "6.5 kg Sound Pressure/ Power level: 103.3/1112 dB(A) Lh/rh Vibration level : 5.3/5.3 m/s 2"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/gs-650-18.pdf",
        "fileName": "gs-650-18.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Parts List",
        "url": "/agrimart-media/brochures/om-chain-saw-gs650-18_2.pdf",
        "fileName": "om-chain-saw-gs650-18_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_108_1.mp4",
        "fileName": "product_108_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1.  Bar Cover    2.  Bar    3.  Chain    4. Tools Kit"
  },
  {
    "id": "am-2989",
    "name": "PW210C OM HIGH PRESSURE WASHER",
    "slug": "pw210c-om-high-pressure-washer-2989",
    "sku": "RIPL010053",
    "riplCode": "RIPL010053",
    "modelNumber": "PW210C",
    "category": "Pressure Washer",
    "categoryId": "cat-am-pressure-washer",
    "price": 81980,
    "comparePrice": 81980,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 1,
    "images": [
      "/images/products/agrimart/product_2989_1.jpg"
    ],
    "description": "No Information Available.",
    "descriptionHtml": "No Information Available.",
    "specifications": {
      "Pressure Washer Model": "PW210C",
      "RIPL Code": "RIPL010053",
      "Brand": "OLEO MAC"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Manual Cum Part List",
        "url": "/agrimart-media/brochures/pw210c-om-high-pressure-washer-pw210c_2.pdf",
        "fileName": "pw210c-om-high-pressure-washer-pw210c_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-90",
    "name": "GS720 WITH 20",
    "slug": "gs720-with-20-90",
    "sku": "RIPL010018",
    "riplCode": "RIPL010018",
    "modelNumber": "GS720",
    "category": "Chain Saw",
    "categoryId": "cat-am-chain-saw",
    "price": 84600,
    "comparePrice": 84600,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 2,
    "images": [
      "/images/products/agrimart/product_90_2.jpg",
      "/images/products/agrimart/product_90_3.jpg",
      "/images/products/agrimart/product_90_4.jpg"
    ],
    "description": "Power/Displacement: 5.4 HP - 4.0 kW/70.8CM 3    Bar Length (Nose): 51 cm/20\" 64-76 cm/25\"-30\"Chain 3/8\" X .058\"    Oil Pump: Automatic/ Adjustable/ Zero flow rate at idle speed    Oil/fuel tank capacity: 0.45 L/0.80 L    Dry weight: 6.8 KG",
    "descriptionHtml": "<p><b>Power/Displacement:</b> 5.4 HP - 4.0 kW/70.8CM<sup>3   </sup><b>Bar Length (Nose): </b>51 cm/20\" 64-76 cm/25\"-30\"Chain 3/8\" X .058\"   <b>Oil Pump: </b>Automatic/ Adjustable/ Zero flow rate at idle speed   <b>Oil/fuel tank capacity: </b>0.45 L/0.80 L   <b>Dry weight: </b>6.8 KG</p><p><o:p></o:p></p><p></p>",
    "specifications": {
      "Chain Saw Model": "GS720",
      "RIPL Code": "RIPL010018",
      "Brand": "OLEO MAC",
      "Power/Displacement": "5.4 HP - 4.0 kW/70.8CM 3",
      "Bar Length (Nose)": "51 cm/20\" 64-76 cm/25\"-30\"Chain 3/8\" X .058\"",
      "Oil Pump": "Automatic/ Adjustable/ Zero flow rate at idle speed",
      "Oil/fuel tank capacity": "0.45 L/0.80 L",
      "Dry weight": "6.8 KG"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/gs720-with-20.pdf",
        "fileName": "gs720-with-20.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Part List",
        "url": "/agrimart-media/brochures/om-chain-saw-gs720-20_2.pdf",
        "fileName": "om-chain-saw-gs720-20_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_90_1.mp4",
        "fileName": "product_90_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1.  Bar Cover    2.  Bar    3.  Chain    4.  Std Tools    5.  Safety Articles"
  },
  {
    "id": "am-604",
    "name": "OM MH160 RK ROTARY TILLER (W/O WHEEL) OLEOMAC",
    "slug": "om-mh160-rk-rotary-tiller-w-o-wheel-oleomac-604",
    "sku": "RIPL019684",
    "riplCode": "RIPL019684",
    "modelNumber": "MH160 RK",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 85726,
    "comparePrice": 85726,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 1,
    "images": [
      "/images/products/agrimart/product_604_1.jpg",
      "/images/products/agrimart/product_604_2.jpg",
      "/images/products/agrimart/product_604_3.jpg"
    ],
    "description": "Engine Make/Model : Emak K 800 H OHV      Displacement : 182 cm³     Gearbox : 1 forward speed + 1 reverse     Rotor : 2+2 blades - 60 cm with protection discs Handle bars : Fully adjustable      Weight : 52 Kg",
    "descriptionHtml": "<p><b>Engine Make/Model : </b>Emak K 800 H OHV     <b>Displacement : </b>182 cm³    <b>Gearbox :</b> 1 forward speed + 1 reverse    <b>Rotor : </b>2+2 blades - 60 cm with protection discs</p><p><b>Handle bars :</b> Fully adjustable     <b>Weight : </b>52 Kg</p><p><o:p></o:p></p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "MH160 RK",
      "RIPL Code": "RIPL019684",
      "Brand": "OLEO MAC",
      "Engine Make/Model": "Emak K 800 H OHV",
      "Displacement": "182 cm³",
      "Gearbox": "1 forward speed + 1 reverse",
      "Rotor": "2+2 blades - 60 cm with protection discs",
      "Handle bars": "Fully adjustable",
      "Weight": "52 Kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/om-rotary-tiller-mh160-rk-wo-wheel-mh160-rk.pdf",
        "fileName": "om-rotary-tiller-mh160-rk-wo-wheel-mh160-rk.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Part List",
        "url": "/agrimart-media/brochures/om-rotary-tiller-mh160-rk-wo-wheel-mh160-rk_2.pdf",
        "fileName": "om-rotary-tiller-mh160-rk-wo-wheel-mh160-rk_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "Scarifier  Potato Digger Roller Brush Single share brush Plough Pair of metal wheels Furrowing tool Pair of tyred wheels Pair of metal wheels Tool Holder"
  },
  {
    "id": "am-3538",
    "name": "AM-RTP-5PH-ELITE - POWER WEEDER / INTERCULTIVATOR",
    "slug": "am-rtp-5ph-elite-power-weeder-intercultivator-3538",
    "sku": "RIPL037989",
    "riplCode": "RIPL037989",
    "modelNumber": "AM-RTP-5PH+GX200 ELITE",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 86400,
    "comparePrice": 86400,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 69,
    "images": [
      "/images/products/agrimart/product_3538_1.jpg",
      "/images/products/agrimart/product_3538_2.jpg"
    ],
    "description": "Model :AM-RTP-5PH-Elite       Engine Model : GX200     Power : 4.3kW/5.8HP     Displacement  :196CC     Fuel tank capacity  :3.1 Ltr     Tilling Depth  :100mm     Tilling   width  :850-1000mm",
    "descriptionHtml": "<p>Model:AM-RTP-5PH-Elite      Engine Model: GX200    Power: 4.3kW/5.8HP    Displacement :196CC    Fuel tank capacity :3.1 Ltr    Tilling Depth :100mm    Tilling width :850-1000mm</p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-RTP-5PH+GX200 ELITE",
      "RIPL Code": "RIPL037989",
      "Brand": "AGRIMATE",
      "Model": "AM-RTP-5PH-Elite Engine Model : GX200 Power : 4.3kW/5.8HP Displacement :196CC Fuel tank capacity :3.1 Ltr Tilling Depth :100mm Tilling width :850-1000mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-rtp-5ph-elite-power-weeder-intercultivator-am-rtp-5phgx200-elite.pdf",
        "fileName": "am-rtp-5ph-elite-power-weeder-intercultivator-am-rtp-5phgx200-elite.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-rtp-5phgx200-elite-3-gear-power-weeder-intercultivator-am-rtp-5phgx200-elite_2.pdf",
        "fileName": "am-rtp-5phgx200-elite-3-gear-power-weeder-intercultivator-am-rtp-5phgx200-elite_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Rubber Tyres 4.00x8     2.  Plough     3.  Tilling Blades :32 Nos."
  },
  {
    "id": "am-3036",
    "name": "AM-CF-PPT-60FT CARBON FIBER -TELESCOPIC POLE",
    "slug": "am-cf-ppt-60ft-carbon-fiber-telescopic-pole-3036",
    "sku": "RIPL035659",
    "riplCode": "RIPL035659",
    "modelNumber": "AM-CF-PPT-60FT",
    "category": "Pruner",
    "categoryId": "cat-am-pruner",
    "price": 88958,
    "comparePrice": 88958,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 6,
    "images": [
      "/images/products/agrimart/product_3036_1.jpg"
    ],
    "description": "1. Attachments are not included with the Machine 2.  Attachments are optional accessories which are chargeable basis",
    "descriptionHtml": "<p><b>1. </b>Attachments are not included with the Machine</p><p><b>2. </b>Attachments are optional accessories which are chargeable basis</p>",
    "specifications": {
      "Pruner Model": "AM-CF-PPT-60FT",
      "RIPL Code": "RIPL035659",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-1706",
    "name": "MIRAGE-3000-ALRITE LAWN MOWER COMMERCIAL",
    "slug": "mirage-3000-alrite-lawn-mower-commercial-1706",
    "sku": "RIPL006093",
    "riplCode": "RIPL006093",
    "modelNumber": "MIRAGE3000",
    "category": "Lawn Mower",
    "categoryId": "cat-am-lawn-mower",
    "price": 89900,
    "comparePrice": 89900,
    "brand": "ALRITE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 71,
    "images": [
      "/images/products/agrimart/product_1706_1.jpg",
      "/images/products/agrimart/product_1706_2.jpg",
      "/images/products/agrimart/product_1706_3.jpg"
    ],
    "description": "Model: MIRAGE 3000     Power: 4 HP,3000W     Cutting Width: 46Cm, 18\"     Grass Box: 50L    Height Adjustment: 12 Settings, Single Lever",
    "descriptionHtml": "<div> <b>Model:</b> MIRAGE 3000    <b>Power:</b> 4 HP,3000W    <b>Cutting Width:</b> 46Cm, 18\"    <b>Grass Box:</b> 50L    <b>Height Adjustment:</b> 12 Settings, Single Lever",
    "specifications": {
      "Lawn Mower Model": "MIRAGE3000",
      "RIPL Code": "RIPL006093",
      "Brand": "ALRITE",
      "Model": "MIRAGE 3000",
      "Power": "4 HP,3000W",
      "Cutting Width": "46Cm, 18\"",
      "Grass Box": "50L",
      "Height Adjustment": "12 Settings, Single Lever"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/mirage-3000-alrite-lawn-mower-commercial-mirage3000.pdf",
        "fileName": "mirage-3000-alrite-lawn-mower-commercial-mirage3000.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/mirage-3000-alrite-lawn-mower-commercial-mirage3000_2.pdf",
        "fileName": "mirage-3000-alrite-lawn-mower-commercial-mirage3000_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1706_1.mp4",
        "fileName": "product_1706_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "Electrical Cable wire- 25 M"
  },
  {
    "id": "am-3321",
    "name": "AM-RT-5P INTERCULTIVATOR/POWER WEEDER",
    "slug": "am-rt-5p-intercultivator-power-weeder-3321",
    "sku": "DBT24075",
    "riplCode": "DBT24075",
    "modelNumber": "DBT-T",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 89980,
    "comparePrice": 89980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3321_1.jpg"
    ],
    "description": "",
    "descriptionHtml": "",
    "specifications": {
      "Intercultivator/power Weeder Model": "DBT-T",
      "RIPL Code": "DBT24075",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3496",
    "name": "AM-MPT-1100-6D-E-3G INTERCULTIVATOR/POWER WEEDER",
    "slug": "am-mpt-1100-6d-e-3g-intercultivator-power-weeder-3496",
    "sku": "RIPL038003",
    "riplCode": "RIPL038003",
    "modelNumber": "AM-MPT-1100-6D(E)",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 89980,
    "comparePrice": 89980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3496_1.jpg",
      "/images/products/agrimart/product_3496_2.jpg"
    ],
    "description": "Model :  AM-MPT-1100-6D-E-3G    Power : 3600RPM    Displacement  :296CC    Gear : 2 Forward + 1 Reverse    Tilling Width : 1000mm    Tilling Depth : 100mm",
    "descriptionHtml": "<p><b>Model</b>:  AM-MPT-1100-6D-E-3G    <b>Power</b>: 3600RPM   <b>Displacement </b>:296CC   <b>Gear</b>: 2 Forward + 1 Reverse   <b>Tilling Width</b>: 1000mm   <b>Tilling Depth</b>: 100mm</p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-MPT-1100-6D(E)",
      "RIPL Code": "RIPL038003",
      "Brand": "AGRIMATE",
      "Model": "AM-MPT-1100-6D-E-3G",
      "Power": "3600RPM",
      "Displacement": "296CC",
      "Gear": "2 Forward + 1 Reverse",
      "Tilling Width": "1000mm",
      "Tilling Depth": "100mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-mpt-1100-6d-e-3-gear-power-weederinter-cultivator-wo-battery-am-mpt-1100-6de.pdf",
        "fileName": "am-mpt-1100-6d-e-3-gear-power-weederinter-cultivator-wo-battery-am-mpt-1100-6de.pdf",
        "available": true
      },
      {
        "label": "View Transmission User Manual",
        "url": "/agrimart-media/brochures/am-mpt-1100-6de4x8-tyrepower-weederinter-cultivator-wo-battery-am-mpt-1100-6de_3.pdf",
        "fileName": "am-mpt-1100-6de4x8-tyrepower-weederinter-cultivator-wo-battery-am-mpt-1100-6de_3.pdf",
        "available": true
      },
      {
        "label": "View Engine User Manual",
        "url": "/agrimart-media/brochures/am-mpt-1100-6de4x8-tyrepower-weederinter-cultivator-wo-battery-am-mpt-1100-6de_4.pdf",
        "fileName": "am-mpt-1100-6de4x8-tyrepower-weederinter-cultivator-wo-battery-am-mpt-1100-6de_4.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . Tyres 4.00x8    2 . Plough    3 . Tilling Blades-32 Blades"
  },
  {
    "id": "am-3028",
    "name": "AM-RT-212-7P-WL- INTERCULTIVATOR/POWER WEEDER",
    "slug": "am-rt-212-7p-wl-intercultivator-power-weeder-3028",
    "sku": "RIPL036135",
    "riplCode": "RIPL036135",
    "modelNumber": "AM-RT-212-7P",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 90000,
    "comparePrice": 90000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 17,
    "images": [
      "/images/products/agrimart/product_3028_1.jpg"
    ],
    "description": "Model:  AM-RT-212-7P-WITH LIGHT     Engine Model: 170FP  RPM: 3600RPM    Displacement:  212CC    Fuel Tank Capacity:  3.5Ltr  Gear:  2 Forward+1 Reverse    Tilling Width:  1000mm    Tilling Depth:  100-250mm",
    "descriptionHtml": "<p><b>Model:</b> AM-RT-212-7P-WITH LIGHT  <b>  Engine Model: </b>170FP  <b>RPM: </b>3600RPM    <b>Displacement:</b> 212CC   <b>Fuel Tank Capacity:</b> 3.5Ltr  <b>Gear:</b> 2 Forward+1 Reverse   <b>Tilling Width:</b> 1000mm   <b>Tilling Depth:</b> 100-250mm </p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-RT-212-7P",
      "RIPL Code": "RIPL036135",
      "Brand": "AGRIMATE",
      "Model": "AM-RT-212-7P-WITH LIGHT",
      "Engine Model": "170FP",
      "RPM": "3600RPM",
      "Displacement": "212CC",
      "Fuel Tank Capacity": "3.5Ltr",
      "Gear": "2 Forward+1 Reverse",
      "Tilling Width": "1000mm",
      "Tilling Depth": "100-250mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View View leaflet",
        "url": "/agrimart-media/brochures/am-rt-212-7p-wl-intercultivatorpower-weeder.pdf",
        "fileName": "am-rt-212-7p-wl-intercultivatorpower-weeder.pdf",
        "available": true
      },
      {
        "label": "View Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-rt-212-7p-wl-with-standard-accessories-am-rt-212-7p_2.pdf",
        "fileName": "am-rt-212-7p-wl-with-standard-accessories-am-rt-212-7p_2.pdf",
        "available": true
      },
      {
        "label": "View Engine Part List",
        "url": "/agrimart-media/brochures/am-rt-212-7p-wl-agrimate-intercultivator_3.pdf",
        "fileName": "am-rt-212-7p-wl-agrimate-intercultivator_3.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3028_1.mp4",
        "fileName": "product_3028_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Tyres: 4.00x8 2. Plough 3. Tilling blades -32Nos"
  },
  {
    "id": "am-1657",
    "name": "PPX270-OLEO MAC TELESCOPIC POLE PRUNER",
    "slug": "ppx270-oleo-mac-telescopic-pole-pruner-1657",
    "sku": "RIPL010132",
    "riplCode": "RIPL010132",
    "modelNumber": "PPX270",
    "category": "Pruner",
    "categoryId": "cat-am-pruner",
    "price": 91960,
    "comparePrice": 91960,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 163,
    "images": [
      "/images/products/agrimart/product_1657_1.jpg",
      "/images/products/agrimart/product_1657_2.jpg",
      "/images/products/agrimart/product_1657_3.jpg"
    ],
    "description": "Model:  PPX270    Power:  1.3 HP-1.0 kW    Displacement:  27cm 3     Adjustment of Pruning head:  From 0° to 90° (5 positions)      Bar length (Nose) :  25 cm/10” (microlite sprocket)  Chain (pitch x gauge):  3/8” x .043”    Overall length of machine :  2.60 m / 3.80 m",
    "descriptionHtml": "<p>Model: PPX270   Power: 1.3 HP-1.0 kW   Displacement: 27cm<sup>3</sup>   <b>Adjustment of Pruning head: </b>From 0° to 90° (5 positions)     <b>Bar length (Nose): </b>25 cm/10” (microlite sprocket) </p><p><b>Chain (pitch x gauge): </b>3/8” x .043”   <b>Overall length of machine: </b>2.60 m / 3.80 m   </p>",
    "specifications": {
      "Pruner Model": "PPX270",
      "RIPL Code": "RIPL010132",
      "Brand": "OLEO MAC",
      "Adjustment of Pruning head": "From 0° to 90° (5 positions)",
      "Bar length (Nose)": "25 cm/10” (microlite sprocket)",
      "Chain (pitch x gauge)": "3/8” x .043”",
      "Overall length of machine": "2.60 m / 3.80 m"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/ppx270-oleo-mac-telescopic-pole-pruner.pdf",
        "fileName": "ppx270-oleo-mac-telescopic-pole-pruner.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Part List",
        "url": "/agrimart-media/brochures/om-telescopic-pruner-ppx270-petrol-ppx270_2.pdf",
        "fileName": "om-telescopic-pruner-ppx270-petrol-ppx270_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Bar Cover     2.   Flat files    3.  Round bars    4.  Harness"
  },
  {
    "id": "am-3218",
    "name": "AM-4000-ATC-H AGRIMATE ARECANUT HARVESTER",
    "slug": "am-4000-atc-h-agrimate-arecanut-harvester-3218",
    "sku": "RIPL025748",
    "riplCode": "RIPL025748",
    "modelNumber": "AM-4000 ATC-H",
    "category": "Harvester",
    "categoryId": "cat-am-harvester",
    "price": 97200,
    "comparePrice": 97200,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 14,
    "images": [
      "/images/products/agrimart/product_3218_1.jpg"
    ],
    "description": "Engine Displacement: 40 CC    Power Output: Max: 1.31kW/ 1.8 HP/ 9900 RPM    Fuel Tank Capacity: 1Ltr   Total weight: 24.5 KG Sprayer Attachment available on request at Extra Price",
    "descriptionHtml": "<p><b>Engine Displacement:</b> 40 CC    <b>Power Output:</b> Max: 1.31kW/ 1.8 HP/ 9900 RPM   <b>Fuel Tank Capacity: </b>1Ltr  <b> Total weight: </b>24.5 KG</p><p>Sprayer Attachment available on request at Extra Price<br></p>",
    "specifications": {
      "Harvester Model": "AM-4000 ATC-H",
      "RIPL Code": "RIPL025748",
      "Brand": "AGRIMATE",
      "Engine Displacement": "40 CC",
      "Power Output": "Max: 1.31kW/ 1.8 HP/ 9900 RPM",
      "Fuel Tank Capacity": "1Ltr",
      "Total weight": "24.5 KG Sprayer Attachment available on request at Extra Price"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-4000-atc-h-agrimate-arecanut-harvester-am-4000-atc-h.pdf",
        "fileName": "am-4000-atc-h-agrimate-arecanut-harvester-am-4000-atc-h.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-4000-atc-h-agrimate-arecanut-harvester-am-4000-atc-h_2.pdf",
        "fileName": "am-4000-atc-h-agrimate-arecanut-harvester-am-4000-atc-h_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3218_1.mp4",
        "fileName": "product_3218_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Harvester    2. Rope - 2 numbers  3. Standard Tools Kit"
  },
  {
    "id": "am-3137",
    "name": "AM-MPTC-5D-M-3G-DELITE - INTERCULTIVATOR / POWER WEEDER",
    "slug": "am-mptc-5d-m-3g-delite-intercultivator-power-weeder-3137",
    "sku": "RIPL036435",
    "riplCode": "RIPL036435",
    "modelNumber": "AM-RTD-5D",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 99200,
    "comparePrice": 99200,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 208,
    "images": [
      "/images/products/agrimart/product_3137_5.jpg",
      "/images/products/agrimart/product_3137_6.jpg",
      "/images/products/agrimart/product_3137_7.jpg"
    ],
    "description": "Model:  AM-MPTC-5D-M-3G-DELITE    Engine: 173FD    Power: 3600 RPM    Displacement: 247CC    Fuel tank capacity: 3.5 Ltr    Gear: 2 Forward + 1 Reverse    Tilling Depth: 150-300 MM    Tilling width: 1050 MM",
    "descriptionHtml": "<p><b>Model: </b>AM-MPTC-5D-M-3G-DELITE   <b>Engine: </b>173FD   <b>Power: </b>3600 RPM   <b>Displacement:</b> 247CC   <b>Fuel tank capacity:</b> 3.5 Ltr   <b>Gear: </b>2 Forward + 1 Reverse   <b>Tilling Depth: </b>150-300 MM   <b>Tilling width: </b>1050 MM </p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-RTD-5D",
      "RIPL Code": "RIPL036435",
      "Brand": "AGRIMATE",
      "Model": "AM-MPTC-5D-M-3G-DELITE",
      "Engine": "173FD",
      "Power": "3600 RPM",
      "Displacement": "247CC",
      "Fuel tank capacity": "3.5 Ltr",
      "Gear": "2 Forward + 1 Reverse",
      "Tilling Depth": "150-300 MM",
      "Tilling width": "1050 MM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-mptc-5d-m-3g-delite-intercultivator-power-weeder-am-rtd-5d.pdf",
        "fileName": "am-mptc-5d-m-3g-delite-intercultivator-power-weeder-am-rtd-5d.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am-mptc-5d-m-3g-delite-intercultivator-power-weeder-am-rtd-5d_2.pdf",
        "fileName": "am-mptc-5d-m-3g-delite-intercultivator-power-weeder-am-rtd-5d_2.pdf",
        "available": true
      },
      {
        "label": "View Engine Diagram",
        "url": "/agrimart-media/brochures/am-mptc-5d-m-3g-delite-intercultivator-power-weeder-am-rtd-5d_3.pdf",
        "fileName": "am-mptc-5d-m-3g-delite-intercultivator-power-weeder-am-rtd-5d_3.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Rubber Tyres 4.00 x 8    2.  Tilling Blades 32. Nos    3. Plough"
  },
  {
    "id": "am-2894",
    "name": "AM-RT-3024-R&F ROTAVATOR 3.ft REGULAR+ SERIES",
    "slug": "am-rt-3024-r-f-rotavator-3-ft-regular-series-2894",
    "sku": "RIPL034045",
    "riplCode": "RIPL034045",
    "modelNumber": "AM-RT-3024-R&F",
    "category": "Rotavator",
    "categoryId": "cat-am-rotavator",
    "price": 105800,
    "comparePrice": 105800,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 1,
    "images": [
      "/images/products/agrimart/product_2894_1.jpg"
    ],
    "description": "No Information Available.",
    "descriptionHtml": "No Information Available.",
    "specifications": {
      "Rotavator": "AM-RT-3024-R&F",
      "RIPL Code": "RIPL034045",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-rt-3024-rf-agrimate-rotavator-3ft-reverse-forward-regular-series.pdf",
        "fileName": "am-rt-3024-rf-agrimate-rotavator-3ft-reverse-forward-regular-series.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3574",
    "name": "AM-WPD-186HH-3X2-ES WATER PUMP SET - DIESEL",
    "slug": "am-wpd-186hh-3x2-es-water-pump-set-diesel-3574",
    "sku": "RIPL038927",
    "riplCode": "RIPL038927",
    "modelNumber": "AM-WPD-186HH",
    "category": "Pumpset",
    "categoryId": "cat-am-pumpset",
    "price": 107980,
    "comparePrice": 107980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 24,
    "images": [
      "/images/products/agrimart/product_3574_1.jpg",
      "/images/products/agrimart/product_3574_2.jpg"
    ],
    "description": "Model:  AM-WPD-186HH    Engine : 186FD     Displacement : 418cc     Max. Flow Rate : 38-42 m³/h    Max Head:  120m    Max  Suction Lift:  8m    Self-Primming Time : 30s/4minutes    Rotational Speed:  3600 RPM",
    "descriptionHtml": "<p>Model: AM-WPD-186HH   Engine: 186FD    Displacement: 418cc    Max. Flow Rate: 38-42 m³/h   Max Head: 120m   <b>Max </b>Suction Lift: 8m    <b>Self-Primming Time</b>: 30s/4minutes   <b>Rotational Speed: </b>3600 RPM</p>",
    "specifications": {
      "Water Pumpset": "AM-WPD-186HH",
      "RIPL Code": "RIPL038927",
      "Brand": "AGRIMATE",
      "Self-Primming Time": "30s/4minutes",
      "Rotational Speed": "3600 RPM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-wpd-186hh-3x2-es-water-pump-set-diesel-am-wpd-186hh.pdf",
        "fileName": "am-wpd-186hh-3x2-es-water-pump-set-diesel-am-wpd-186hh.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-wpd-186hh-3x2-es-water-pump-set-diesel-am-wpd-186hh_2.pdf",
        "fileName": "am-wpd-186hh-3x2-es-water-pump-set-diesel-am-wpd-186hh_2.pdf",
        "available": true
      },
      {
        "label": "View Engine Diagram",
        "url": "/agrimart-media/brochures/am-wpd-186hh-3x2-es-water-pump-set-diesel-am-wpd-186hh_3.pdf",
        "fileName": "am-wpd-186hh-3x2-es-water-pump-set-diesel-am-wpd-186hh_3.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-2898",
    "name": "AM-RT-4024-MS-ST ROTAVATOR 4.ft MINI SERIES",
    "slug": "am-rt-4024-ms-st-rotavator-4-ft-mini-series-2898",
    "sku": "RIPL034047",
    "riplCode": "RIPL034047",
    "modelNumber": "AM-RT-4024-MS-ST",
    "category": "Rotavator",
    "categoryId": "cat-am-rotavator",
    "price": 109800,
    "comparePrice": 109800,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 2,
    "images": [
      "/images/products/agrimart/product_2898_1.jpg"
    ],
    "description": "Model:  AM-RT4024MS-ST    Size:  4.0FT    Blades: 24 Nos    Power: 24+   Speed: 540 RPM    Tilling Width: 1200mm    Weight: 250mm",
    "descriptionHtml": "<p><b>Model: </b>AM-RT4024MS-ST    <b>Size:</b> 4.0FT   <b> Blades: </b>24 Nos   <b>Power: </b>24+  <b> Speed: </b>540 RPM  <b>  Tilling Width:</b> 1200mm    <b>Weight:</b> 250mm </p><p><br></p>",
    "specifications": {
      "Rotavator": "AM-RT-4024-MS-ST",
      "RIPL Code": "RIPL034047",
      "Brand": "AGRIMATE",
      "Model": "AM-RT4024MS-ST",
      "Size": "4.0FT",
      "Blades": "24 Nos",
      "Power": "24+",
      "Speed": "540 RPM",
      "Tilling Width": "1200mm",
      "Weight": "250mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-rt-4024-ms-st-agrimate-rotavator-single-speed-mini-series-4ft-am-rt-4024-ms-st.pdf",
        "fileName": "am-rt-4024-ms-st-agrimate-rotavator-single-speed-mini-series-4ft-am-rt-4024-ms-st.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3458",
    "name": "AM-RTP-9P-MAX-3G - NTERCULTIVATOR/POWER WEEDER High Power Series",
    "slug": "am-rtp-9p-max-3g-ntercultivator-power-weeder-high-power-series-3458",
    "sku": "RIPL037708",
    "riplCode": "RIPL037708",
    "modelNumber": "AM-RTP-9P-MAX",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 110000,
    "comparePrice": 110000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3458_1.jpg",
      "/images/products/agrimart/product_3458_3.jpg"
    ],
    "description": "Model: AM-RTP-9P Max-3G     Power: 3000RPM    Displacement:  389CC   Gear: 2 Forward+1 Reverse     Tilling Width: 1100mm    Tilling Depth : 100mm     Fuel Tank Capacity: 5.4Ltr",
    "descriptionHtml": "<p>  Model: AM-RTP-9P Max-3G    Power: 3000RPM   Displacement: 389CC  Gear: 2 Forward+1 Reverse    Tilling Width: 1100mm   <b>Tilling Depth</b>: 100mm    Fuel Tank Capacity: 5.4Ltr</p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-RTP-9P-MAX",
      "RIPL Code": "RIPL037708",
      "Brand": "AGRIMATE",
      "Tilling Depth": "100mm Fuel Tank Capacity: 5.4Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-rtp-9p-max-3g-ntercultivatorpower-weeder-high-power-series.pdf",
        "fileName": "am-rtp-9p-max-3g-ntercultivatorpower-weeder-high-power-series.pdf",
        "available": true
      },
      {
        "label": "View Transmission User Manual",
        "url": "/agrimart-media/brochures/am-rtp-9p-max-intercultivatorpower-weeder-high-power-series_2.pdf",
        "fileName": "am-rtp-9p-max-intercultivatorpower-weeder-high-power-series_2.pdf",
        "available": true
      },
      {
        "label": "View Engine User Manual",
        "url": "/agrimart-media/brochures/am-rtp-9p-max-intercultivatorpower-weeder-high-power-series_3.pdf",
        "fileName": "am-rtp-9p-max-intercultivatorpower-weeder-high-power-series_3.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Tyres 5.00X12     2.  Plough    3.  Side Disc    4.  Tilling Blade-40 Nos."
  },
  {
    "id": "am-1712",
    "name": "Max 53 THX - Honda Lawn Mower",
    "slug": "max-53-thx-honda-lawn-mower-1712",
    "sku": "RIPL020375",
    "riplCode": "RIPL020375",
    "modelNumber": "MAX53THX",
    "category": "Lawn Mower",
    "categoryId": "cat-am-lawn-mower",
    "price": 116000,
    "comparePrice": 116000,
    "brand": "HONDA",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_1712_1.jpg",
      "/images/products/agrimart/product_1712_2.jpg",
      "/images/products/agrimart/product_1712_3.jpg"
    ],
    "description": "Model: MAX53 THX      Engine make/model:  Honda GCV 170 OHV    Displacement: 166 cm ³     Cutting width: 51 cm    Propulsion(Speed): Self-propelled (3.6 km/h)     Deck:  Aluminium    Cutting adjustment: Central    Cutting height: from 28 to 75 mm    Weight: 41.6 Kg    Grass box capacity: 80L    Mulching/side discharge: Standard/not available",
    "descriptionHtml": "<p>Model: MAX53 THX     Engine make/model: Honda GCV 170 OHV   <b>Displacement: </b>166 cm³   <b>Cutting width: </b>51 cm   <b>Propulsion(Speed):</b> Self-propelled (3.6 km/h)    Deck: Aluminium   <b>Cutting adjustment:</b> Central    <b>Cutting height:</b> from 28 to 75 mm   <b>Weight:</b> 41.6 Kg    <b>Grass box capacity: </b>80L    <b>Mulching/side discharge: </b>Standard/not available</p>",
    "specifications": {
      "Lawn Mower Model": "MAX53THX",
      "RIPL Code": "RIPL020375",
      "Brand": "HONDA",
      "Displacement": "166 cm ³",
      "Cutting width": "51 cm Propulsion(Speed): Self-propelled (3.6 km/h) Deck: Aluminium Cutting adjustment: Central Cutting height: from 28 to 75 mm Weight: 41.6 Kg",
      "Grass box capacity": "80L",
      "Mulching/side discharge": "Standard/not available"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/max-53tk-self-propelled-oleomac-lawn-mower.pdf",
        "fileName": "max-53tk-self-propelled-oleomac-lawn-mower.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Parts List",
        "url": "/agrimart-media/brochures/om-lawn-mower-max53thx-self-propelled-max53thx_2.pdf",
        "fileName": "om-lawn-mower-max53thx-self-propelled-max53thx_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3208",
    "name": "AM-WCS-192FP- AGRIMATE WOOD CHIPPER",
    "slug": "am-wcs-192fp-agrimate-wood-chipper-3208",
    "sku": "RIPL036653",
    "riplCode": "RIPL036653",
    "modelNumber": "AM-WCS-192FP",
    "category": "Wood Chipper",
    "categoryId": "cat-am-wood-chipper",
    "price": 117980,
    "comparePrice": 117980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 12,
    "images": [
      "/images/products/agrimart/product_3208_1.jpg",
      "/images/products/agrimart/product_3208_2.jpg"
    ],
    "description": "Model:  AM-WCS-192FP     Power:  10 Kw     Displacement:  459 CC    C hipping Capacity:  100 MM",
    "descriptionHtml": "<p>Model: AM-WCS-192FP    Power: 10 Kw    Displacement: 459 CC   <b>C</b>hipping Capacity: 100 MM  <br></p>",
    "specifications": {
      "Wood Chipper": "AM-WCS-192FP",
      "RIPL Code": "RIPL036653",
      "Brand": "AGRIMATE",
      "Model": "AM-WCS-192FP Power: 10 Kw Displacement: 459 CC C hipping Capacity: 100 MM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-wcs-192fp-agrimate-wood-chipper-am-wcs-192fp.pdf",
        "fileName": "am-wcs-192fp-agrimate-wood-chipper-am-wcs-192fp.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-wcs-192fp-agrimate-wood-chipper-am-wcs-192fp_2.pdf",
        "fileName": "am-wcs-192fp-agrimate-wood-chipper-am-wcs-192fp_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3208_1.mp4",
        "fileName": "product_3208_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3038",
    "name": "AM-CF-PPT-70FT CARBON FIBER TELESCOPIC-POLE",
    "slug": "am-cf-ppt-70ft-carbon-fiber-telescopic-pole-3038",
    "sku": "RIPL035660",
    "riplCode": "RIPL035660",
    "modelNumber": "AM-CF-PPT-70FT",
    "category": "Pruner",
    "categoryId": "cat-am-pruner",
    "price": 118620,
    "comparePrice": 118620,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 26,
    "images": [
      "/images/products/agrimart/product_3038_1.jpg"
    ],
    "description": "1. Attachments  are not included with the Machine 2. Attachments  are optional accessories which are chargeable basis",
    "descriptionHtml": "<p><b>1. </b>Attachments  are not included with the Machine</p><p><b>2. </b>Attachments  are optional accessories which are chargeable basis</p>",
    "specifications": {
      "Pruner Model": "AM-CF-PPT-70FT",
      "RIPL Code": "RIPL035660",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3550",
    "name": "AM-SM-6048-7P-PRO STUBBLE MOWER",
    "slug": "am-sm-6048-7p-pro-stubble-mower-3550",
    "sku": "RIPL037800",
    "riplCode": "RIPL037800",
    "modelNumber": "AM-SM-6048-7P-PRO",
    "category": "Stubble Mower",
    "categoryId": "cat-am-stubble-mower",
    "price": 119000,
    "comparePrice": 119000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 50,
    "images": [
      "/images/products/agrimart/product_3550_1.jpg",
      "/images/products/agrimart/product_3550_2.jpg"
    ],
    "description": "Model : AM-SM-6048-7P-PRO      Power : 7HP     Displacement : 212CC     Cutting Width : 600MM     Cutting Depth : 10MM     RPM :3600",
    "descriptionHtml": "<p><b>Model</b>: AM-SM-6048-7P-PRO     <b>Power</b>: 7HP    <b>Displacement</b>: 212CC    <b>Cutting Width</b>: 600MM    <b>Cutting Depth</b>: 10MM    <b>RPM</b>:3600</p>",
    "specifications": {
      "Stubble Mower": "AM-SM-6048-7P-PRO",
      "RIPL Code": "RIPL037800",
      "Brand": "AGRIMATE",
      "Model": "AM-SM-6048-7P-PRO",
      "Power": "7HP",
      "Displacement": "212CC",
      "Cutting Width": "600MM",
      "Cutting Depth": "10MM",
      "RPM": "3600"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-sm-6048-7p-pro-stubble-mower-am-sm-6048-7p-pro.pdf",
        "fileName": "am-sm-6048-7p-pro-stubble-mower-am-sm-6048-7p-pro.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-sm-6048-7p-pro-stubble-mower-am-sm-6048-7p-pro_2.pdf",
        "fileName": "am-sm-6048-7p-pro-stubble-mower-am-sm-6048-7p-pro_2.pdf",
        "available": true
      },
      {
        "label": "View Engine User Manual",
        "url": "/agrimart-media/brochures/am-sm-6048-7p-pro-stubble-mower-am-sm-6048-7p-pro_3.pdf",
        "fileName": "am-sm-6048-7p-pro-stubble-mower-am-sm-6048-7p-pro_3.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-1966",
    "name": "AM-MPTC-1100E 6D-(E) 6G AGRIMATE INTERCULTIVATOR W/O BATTERY",
    "slug": "am-mptc-1100e-6d-e-6g-agrimate-intercultivator-w-o-battery-1966",
    "sku": "RIPL028450",
    "riplCode": "RIPL028450",
    "modelNumber": "AM MPT1100 E 6D 6G",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 127980,
    "comparePrice": 127980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 2,
    "images": [
      "/images/products/agrimart/product_1966_1.jpg",
      "/images/products/agrimart/product_1966_2.jpg",
      "/images/products/agrimart/product_1966_3.jpg"
    ],
    "description": "Type: AM 178FD Single Cylinder, Vertical, Diesel Engine-4S, Air Cooled  Power: 4.4kw/ 6HP/ 3600 RPM    Displacement:  296CC      Weeding Width: 800-1000mm     Weeding depth: 150-300mm  Fuel tank capacity: 3.5 Ltr   Gear Box Oil:  SA90    Engine Oil:  20w40/ 15w40",
    "descriptionHtml": "<p><b>Type: </b>AM 178FD Single Cylinder, Vertical, Diesel Engine-4S, Air Cooled  <b>Power: </b>4.4kw/<b> </b>6HP/ 3600 RPM   <b>Displacement: </b>296CC    <b> Weeding Width:</b> 800-1000mm    <b>Weeding depth:</b> 150-300mm <b> Fuel tank capacity:</b> 3.5 Ltr  Gear Box Oil: SA90   Engine Oil: 20w40/ 15w40</p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM MPT1100 E 6D 6G",
      "RIPL Code": "RIPL028450",
      "Brand": "AGRIMATE",
      "Type": "AM 178FD Single Cylinder, Vertical, Diesel Engine-4S, Air Cooled",
      "Power": "4.4kw/",
      "Displacement": "296CC",
      "Weeding Width": "800-1000mm",
      "Weeding depth": "150-300mm",
      "Fuel tank capacity": "3.5 Ltr Gear Box Oil: SA90 Engine Oil: 20w40/ 15w40"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Transmission Diagram with Parts List",
        "url": "/agrimart-media/brochures/am-mptc-1100-e-6d-6g-agrimate-intercultivator_2.pdf",
        "fileName": "am-mptc-1100-e-6d-6g-agrimate-intercultivator_2.pdf",
        "available": true
      },
      {
        "label": "View Engine Part List",
        "url": "/agrimart-media/brochures/am-mptc-1100-e-6d-6g-agrimate-intercultivator_3.pdf",
        "fileName": "am-mptc-1100-e-6d-6g-agrimate-intercultivator_3.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1966_1.mp4",
        "fileName": "product_1966_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Tyre 5.00*12     2. Side Disc    3. Tilling blades 32 nos    4. Plough attachment"
  },
  {
    "id": "am-3345",
    "name": "AM-MPTC-1100-6D-E-6 GEAR AGRIMATE INTERCULTIVATOR W/O BATTERY",
    "slug": "am-mptc-1100-6d-e-6-gear-agrimate-intercultivator-w-o-battery-3345",
    "sku": "RIPL036883",
    "riplCode": "RIPL036883",
    "modelNumber": "AM-MPTC-1100-6D",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 127980,
    "comparePrice": 127980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 1,
    "images": [
      "/images/products/agrimart/product_3345_1.jpg"
    ],
    "description": "Type: AM-178FD Single Cylinder, vertical Diesel   Engine: 4S Air Cooled   Power: 4.4KW/ 6HP/ 3600 RPM   Displacement: 296 CC    Weeding width: 800-1000mm   Weeding Depth: 150-300 mm    Fuel tank capacity: 3.5 Ltr    Gear Box Oil: SA90     Engine Oil: 20w40/ 15w40",
    "descriptionHtml": "<p><b>Type:</b> AM-178FD Single Cylinder, vertical Diesel  <b> Engine: </b>4S Air Cooled  <b>Power: </b>4.4KW/ 6HP/ 3600 RPM  <b>Displacement: </b>296 CC   <b>Weeding width: </b>800-1000mm  <b> Weeding Depth:</b> 150-300 mm   <b>Fuel tank capacity: </b>3.5 Ltr   <b> Gear Box Oil:</b> SA90   <b>  Engine Oil:</b> 20w40/ 15w40 </p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-MPTC-1100-6D",
      "RIPL Code": "RIPL036883",
      "Brand": "AGRIMATE",
      "Type": "AM-178FD Single Cylinder, vertical Diesel",
      "Engine": "4S Air Cooled",
      "Power": "4.4KW/ 6HP/ 3600 RPM",
      "Displacement": "296 CC",
      "Weeding width": "800-1000mm",
      "Weeding Depth": "150-300 mm",
      "Fuel tank capacity": "3.5 Ltr",
      "Gear Box Oil": "SA90",
      "Engine Oil": "20w40/ 15w40"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-mptc-1100-6d-e-6-gear-agrimate-intercultivator-am-mptc-1100-6d_2.pdf",
        "fileName": "am-mptc-1100-6d-e-6-gear-agrimate-intercultivator-am-mptc-1100-6d_2.pdf",
        "available": true
      },
      {
        "label": "View Engine Part List",
        "url": "/agrimart-media/brochures/am-mptc-1100-6d-e-6-gear-agrimate-intercultivator-am-mptc-1100-6d_3.pdf",
        "fileName": "am-mptc-1100-6d-e-6-gear-agrimate-intercultivator-am-mptc-1100-6d_3.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Tyre 400*10    2. Side Disc   3. Tilling Blades 32 nos  4. Plough attachment"
  },
  {
    "id": "am-3408",
    "name": "Multi Crop Harvester / Reaper AM-MPR-7P-3G1.0",
    "slug": "multi-crop-harvester-reaper-am-mpr-7p-3g1-0-3408",
    "sku": "RIPL036610",
    "riplCode": "RIPL036610",
    "modelNumber": "AM-MPR-7P-3G1.0 .",
    "category": "Reaper Harvester",
    "categoryId": "cat-am-reaper-harvester",
    "price": 136200,
    "comparePrice": 136200,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 3,
    "images": [
      "/images/products/agrimart/product_3408_1.jpg"
    ],
    "description": "Model : AM-MPR-7P-3G1.0",
    "descriptionHtml": "<p>Model : AM-MPR-7P-3G1.0  </p>",
    "specifications": {
      "Reaper / Harvester": "AM-MPR-7P-3G1.0 .",
      "RIPL Code": "RIPL036610",
      "Brand": "AGRIMATE",
      "Model": "AM-MPR-7P-3G1.0"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View CATALOGUE",
        "url": "/agrimart-media/brochures/multi-crop-harvester-reaper-am-mpr-7p-3g10-am-mpr-7p-3g10.pdf",
        "fileName": "multi-crop-harvester-reaper-am-mpr-7p-3g10-am-mpr-7p-3g10.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1687_1.mp4",
        "fileName": "product_1687_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "Tool Kit"
  },
  {
    "id": "am-3540",
    "name": "AM-RTP-7P-BRE-6G INTERCULTIVATOR/POWER WEEDER WITH E TYPE DITCHER ATTACHMENT",
    "slug": "am-rtp-7p-bre-6g-intercultivator-power-weeder-with-e-type-ditcher-attachment-3540",
    "sku": "RIPL038461",
    "riplCode": "RIPL038461",
    "modelNumber": "AM-RTP-7P-BRE WITH E-TYPE DITCHING",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 139980,
    "comparePrice": 139980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 9,
    "images": [
      "/images/products/agrimart/product_3540_1.jpg",
      "/images/products/agrimart/product_3540_2.jpg",
      "/images/products/agrimart/product_3540_3.jpg",
      "/images/products/agrimart/product_3540_4.jpg"
    ],
    "description": "Model: AM-RTP-7P-BRE-6G    Engine Model: AM-230F-2    Displacement: 223CC    Tilling Width(mm): 800-1000    Tilling Depth(mm): 150-300    No of Gears: 3 Forward-3 Reverse",
    "descriptionHtml": "<p><b>Model:</b> AM-RTP-7P-BRE-6G    <b>Engine Model: </b>AM-230F-2    <b>Displacement:</b> 223CC    <b>Tilling Width(mm):</b> 800-1000   <b> Tilling Depth(mm):</b> 150-300    <b>No of Gears:</b> 3 Forward-3 Reverse</p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-RTP-7P-BRE WITH E-TYPE DITCHING",
      "RIPL Code": "RIPL038461",
      "Brand": "AGRIMATE",
      "Model": "AM-RTP-7P-BRE-6G",
      "Engine Model": "AM-230F-2",
      "Displacement": "223CC",
      "Tilling Width(mm)": "800-1000",
      "Tilling Depth(mm)": "150-300",
      "No of Gears": "3 Forward-3 Reverse"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-rtp-7p-bre-6g-intercultivatorpower-weeder-with-e-type-ditcher-attachment-am-rtp-7p-bre-with-e-type-ditching.pdf",
        "fileName": "am-rtp-7p-bre-6g-intercultivatorpower-weeder-with-e-type-ditcher-attachment-am-rtp-7p-bre-with-e-type-ditching.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Rubber Tyres: 4.00X8    2.  Ditching Blades-12 Nos    3. 2 Side Dics    4. Back Rotary Blades-24 Nos    5. Center Rotary Blades-32"
  },
  {
    "id": "am-585",
    "name": "AM-MPTC-6600-9P-INTERCULTIVATOR/POWER WEEDER -BACK ROTARY",
    "slug": "am-mptc-6600-9p-intercultivator-power-weeder-back-rotary-585",
    "sku": "RIPL037320",
    "riplCode": "RIPL037320",
    "modelNumber": "AM-MPTC-6600-9P",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 140400,
    "comparePrice": 140400,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 34,
    "images": [
      "/images/products/agrimart/product_585_1.jpg",
      "/images/products/agrimart/product_585_2.jpg",
      "/images/products/agrimart/product_585_3.jpg",
      "/images/products/agrimart/product_585_4.jpg",
      "/images/products/agrimart/product_585_5.jpg"
    ],
    "description": "Model: AM-MPTC-6600-9P    Engine Model: 177FP     Power: 1800RPM    Displacement: 301CC    Fuel tank Capacity: 5.4Ltr    Ditching Width: 290mm    Ditching Depth:  ≥ 60mm     Cultivating Width: 660mm    Cultivating Depth :   ≥ 100mm    Gear; 2 Forward + 2 Reverse",
    "descriptionHtml": "<p><b>Model: </b>AM-MPTC-6600-9P  <b> Engine Model: </b>177FP<b>    Power: </b>1800RPM<b>   Displacement: </b>301CC<b>   Fuel tank Capacity: </b>5.4Ltr <b>  Ditching Width: </b>290mm <b>  Ditching Depth: </b>≥60mm<b>   </b>Cultivating Width: 660mm   <b>Cultivating Depth :</b> ≥100mm <b>  Gear; </b>2 Forward + 2 Reverse  </p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-MPTC-6600-9P",
      "RIPL Code": "RIPL037320",
      "Brand": "AGRIMATE",
      "Model": "AM-MPTC-6600-9P",
      "Engine Model": "177FP",
      "Power": "1800RPM",
      "Displacement": "301CC",
      "Fuel tank Capacity": "5.4Ltr",
      "Ditching Width": "290mm",
      "Ditching Depth": "≥ 60mm",
      "Cultivating Depth": "≥ 100mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-mptc-6600-9p-intercultivatorpower-weeder-back-rotary.pdf",
        "fileName": "am-mptc-6600-9p-intercultivatorpower-weeder-back-rotary.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am-mptc-6600-9p-agrimate-intercultivator-back-rotary_2.pdf",
        "fileName": "am-mptc-6600-9p-agrimate-intercultivator-back-rotary_2.pdf",
        "available": true
      },
      {
        "label": "View Engine Part List",
        "url": "/agrimart-media/brochures/am-mptc-6600-9p-agrimate-intercultivator-back-rotary_3.pdf",
        "fileName": "am-mptc-6600-9p-agrimate-intercultivator-back-rotary_3.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_585_1.mp4",
        "fileName": "product_585_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Tyre 4.00x8 2. Ditching blades -10 Nos 3. Tilling blade- 18 Nos."
  },
  {
    "id": "am-3317",
    "name": "AM-MPT-1100-6D Intercultivator/ Power Weeder",
    "slug": "am-mpt-1100-6d-intercultivator-power-weeder-3317",
    "sku": "DBT24073",
    "riplCode": "DBT24073",
    "modelNumber": "",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 142200,
    "comparePrice": 142200,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3317_1.jpg"
    ],
    "description": "",
    "descriptionHtml": "",
    "specifications": {
      "RIPL Code": "DBT24073",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": "Model: AM-MPT-1100-6D Engine : AM 178F Diesel Engine Power: 4.5kw/3000 RPM Displacement: 296CC Weeding Width: 800-1000mm Weeding depth: 150-300mm Fuel tank capacity: 3.5 Ltr Gear : 4Forward+2Reverse Gear Box Oil: SA90 Engine Oil: 20w40/ 15w40"
  },
  {
    "id": "am-3048",
    "name": "AM-RT-212-7P INTERCULTIVATOR / POWER WEEDER",
    "slug": "am-rt-212-7p-intercultivator-power-weeder-3048",
    "sku": "RIPL036155",
    "riplCode": "RIPL036155",
    "modelNumber": "AM-RT-212-7P",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 151000,
    "comparePrice": 151000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 117,
    "images": [
      "/images/products/agrimart/product_3048_1.jpg",
      "/images/products/agrimart/product_3048_2.jpg",
      "/images/products/agrimart/product_3048_4.jpg"
    ],
    "description": "Model:  AM-RT-212      Engine : GM170FB       Power:  3600RPM     Displacement:  225CC     Fuel tank capacity:  3.5Ltr    Tilling Width:  1000mm    Tilling  Depth:  100-250mm      Gears:  2 Forward+1 Reverse",
    "descriptionHtml": "<p>Model: AM-RT-212     Engine: GM170FB      Power: 3600RPM    Displacement: 225CC    Fuel tank capacity: 3.5Ltr   Tilling Width: 1000mm   <b>Tilling </b>Depth: 100-250mm     Gears: 2 Forward+1 Reverse     </p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-RT-212-7P",
      "RIPL Code": "RIPL036155",
      "Brand": "AGRIMATE",
      "Model": "AM-RT-212 Engine : GM170FB Power: 3600RPM Displacement: 225CC Fuel tank capacity: 3.5Ltr Tilling Width: 1000mm Tilling Depth: 100-250mm Gears: 2 Forward+1 Reverse"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-rt-212-7p-intercultivator-power-weeder.pdf",
        "fileName": "am-rt-212-7p-intercultivator-power-weeder.pdf",
        "available": true
      },
      {
        "label": "View Transmission Diagram",
        "url": "/agrimart-media/brochures/am-rt-212-7p-intercultivator-power-weeder_2.pdf",
        "fileName": "am-rt-212-7p-intercultivator-power-weeder_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3048_2.mp4",
        "fileName": "product_3048_2.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Tyres: 4.00x8     2. Plough     3. Tilling blades - 32 Nos"
  },
  {
    "id": "am-3335",
    "name": "AM-RT-212 INTERCULTIVATOR / POWER WEEDER",
    "slug": "am-rt-212-intercultivator-power-weeder-3335",
    "sku": "DBT24076",
    "riplCode": "DBT24076",
    "modelNumber": "DBT",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 151000,
    "comparePrice": 151000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3335_1.jpg",
      "/images/products/agrimart/product_3335_2.jpg",
      "/images/products/agrimart/product_3335_3.jpg"
    ],
    "description": "",
    "descriptionHtml": "",
    "specifications": {
      "Intercultivator/power Weeder Model": "DBT",
      "RIPL Code": "DBT24076",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": "Model:  AM-RT-212    Engine : GM170FB     Power:  3600RPM    Displacement:  225CC     Fuel tank capacity:  3.5Ltr    Tilling Width: 1000mm    Tilling Depth: 100-250mm     Gears: 2 Forward+1 Reverse"
  },
  {
    "id": "am-3323",
    "name": "AM-MPTC-6600-6D INTERCULTIVATOR/POWER WEEDER",
    "slug": "am-mptc-6600-6d-intercultivator-power-weeder-3323",
    "sku": "DBT24077",
    "riplCode": "DBT24077",
    "modelNumber": "DBT",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 157980,
    "comparePrice": 157980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3323_1.jpg"
    ],
    "description": "",
    "descriptionHtml": "",
    "specifications": {
      "Intercultivator/power Weeder Model": "DBT",
      "RIPL Code": "DBT24077",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [],
    "videos": [],
    "accessoriesInfo": "Model: AM-MPTC-6600-6D Engine Model: 178F Power: 1700RPM Displacement: 296CC Fuel tank Capacity: 3Ltr Ditching width: 290mm Ditching Depth: ≥ 60mm Cultivating Width : 660mm Cultivating Depth : ≥ 100mm Gear: 2Forward+2Reverse"
  },
  {
    "id": "am-3109",
    "name": "AM-MPTC-1100-9D (E) -3G-ELECTRIC START W/O BATTERY 3GEAR - INTERCULTIVATOR/POWER WEEDER",
    "slug": "am-mptc-1100-9d-e-3g-electric-start-w-o-battery-3gear-intercultivator-power-weeder-3109",
    "sku": "RIPL037290",
    "riplCode": "RIPL037290",
    "modelNumber": "AM-MPTC-1100-9D (E) WC",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 169000,
    "comparePrice": 169000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 42,
    "images": [
      "/images/products/agrimart/product_3109_4.jpg",
      "/images/products/agrimart/product_3109_5.jpg",
      "/images/products/agrimart/product_3109_6.jpg",
      "/images/products/agrimart/product_3109_7.jpg"
    ],
    "description": "Model: AM-MPT-1100-9D-3G       Engine AM-186FA       Power:  3600RPM     Displacement: 418 CC    Fuel Tank Capacity:  4.5Ltr     Gear: 2 forward + 1 reverse    Tilling width: 1400 MM    Tilling depth: 250-300 MM",
    "descriptionHtml": "<p><b>Model: </b>AM-MPT-1100-9D-3G<b>     </b>Engine AM-186FA   <b> </b>  <b> Power:</b> 3600RPM   <b> Displacement:</b> 418 CC   <b>Fuel Tank Capacity:</b> 4.5Ltr    <b>Gear: </b>2 forward + 1 reverse   <b>Tilling width: </b>1400 MM   <b>Tilling depth:</b> 250-300 MM    </p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-MPTC-1100-9D (E) WC",
      "RIPL Code": "RIPL037290",
      "Brand": "AGRIMATE",
      "Model": "AM-MPT-1100-9D-3G",
      "Power": "3600RPM",
      "Displacement": "418 CC",
      "Fuel Tank Capacity": "4.5Ltr",
      "Gear": "2 forward + 1 reverse",
      "Tilling width": "1400 MM",
      "Tilling depth": "250-300 MM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-mptc-1100-9d-e-3g-electric-start-wo-battery-3gear-intercultivatorpower-weeder.pdf",
        "fileName": "am-mptc-1100-9d-e-3g-electric-start-wo-battery-3gear-intercultivatorpower-weeder.pdf",
        "available": true
      },
      {
        "label": "View Transmission Diagram",
        "url": "/agrimart-media/brochures/am-mptc-1100-9d-e-wc-agrimate-rotary-tiller-am-mptc-1100-9d-e-wc_2.pdf",
        "fileName": "am-mptc-1100-9d-e-wc-agrimate-rotary-tiller-am-mptc-1100-9d-e-wc_2.pdf",
        "available": true
      },
      {
        "label": "View Engine Diagram",
        "url": "/agrimart-media/brochures/am-mptc-1100-9d-e-wc-agrimate-rotary-tiller-am-mptc-1100-9d-e-wc_3.pdf",
        "fileName": "am-mptc-1100-9d-e-wc-agrimate-rotary-tiller-am-mptc-1100-9d-e-wc_3.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Tyres 5.00x12     2. Plough     3.  Side disc   4. Tilling Blades- 40 Nos"
  },
  {
    "id": "am-3396",
    "name": "AM-MPTC-1100-9D-3G- MANUAL START - INTERCULTIVATOR/POWER WEEDER",
    "slug": "am-mptc-1100-9d-3g-manual-start-intercultivator-power-weeder-3396",
    "sku": "RIPL036411",
    "riplCode": "RIPL036411",
    "modelNumber": "AM-MPT1100-9D",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 169000,
    "comparePrice": 169000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 3,
    "images": [
      "/images/products/agrimart/product_3396_1.jpg",
      "/images/products/agrimart/product_3396_2.jpg"
    ],
    "description": "Model: AM-MPTC-1100-9D-3G     Engine Model:  186FA      Power:  3600RPM     Displacement:  418CC    Gear:  2Forward+1Reverse    Tilling width:  1400mm    Tilling\ndepth:  250-300mm       Fuel Tank Capacity: 4.5Ltr",
    "descriptionHtml": "<p><b>Model: </b>AM-MPTC-1100-9D-3G<b>    Engine Model: </b>186FA    <b> Power:</b> 3600RPM   <b> Displacement:</b> 418CC   <b>Gear: </b>2Forward+1Reverse   <b>Tilling width: </b>1400mm   <b>Tilling\r\ndepth:</b> 250-300mm      <b>Fuel Tank Capacity:</b> 4.5Ltr<o:p></o:p></p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-MPT1100-9D",
      "RIPL Code": "RIPL036411",
      "Brand": "AGRIMATE",
      "Model": "AM-MPTC-1100-9D-3G",
      "Engine Model": "186FA",
      "Power": "3600RPM",
      "Displacement": "418CC",
      "Gear": "2Forward+1Reverse",
      "Tilling width": "1400mm",
      "Tilling depth": "250-300mm",
      "Fuel Tank Capacity": "4.5Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-mptc-1100-9d-3g-manual-start-intercultivatorpower-weeder.pdf",
        "fileName": "am-mptc-1100-9d-3g-manual-start-intercultivatorpower-weeder.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-mptc-1100-9d-agrimate-intercultivator-am-mpt1100-9d_2.pdf",
        "fileName": "am-mptc-1100-9d-agrimate-intercultivator-am-mpt1100-9d_2.pdf",
        "available": true
      },
      {
        "label": "View Engine Part List",
        "url": "/agrimart-media/brochures/am-mptc-1100-9d-agrimate-intercultivator-am-mpt1100-9d_3.pdf",
        "fileName": "am-mptc-1100-9d-agrimate-intercultivator-am-mpt1100-9d_3.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Tyres- 5.00x12    2. Side Disc   3.\nTilling Blades- 40Nos.   4 . Plough"
  },
  {
    "id": "am-2908",
    "name": "AM-RT-7048HD+ ROTAVATOR 7.ft HD + SERIES",
    "slug": "am-rt-7048hd-rotavator-7-ft-hd-series-2908",
    "sku": "RIPL033120",
    "riplCode": "RIPL033120",
    "modelNumber": "AM-RT-7048HD+",
    "category": "Rotavator",
    "categoryId": "cat-am-rotavator",
    "price": 179800,
    "comparePrice": 179800,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 1,
    "images": [
      "/images/products/agrimart/product_2908_1.jpg",
      "/images/products/agrimart/product_2908_2.jpg"
    ],
    "description": "No Information Available.",
    "descriptionHtml": "No Information Available.",
    "specifications": {
      "Rotavator": "AM-RT-7048HD+",
      "RIPL Code": "RIPL033120",
      "Brand": "AGRIMATE"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View",
        "url": "/agrimart-media/brochures/am-rt-7048hd-agrimate-rotavator-multispeed-hd-series-7ft-am-rt-7048hd.pdf",
        "fileName": "am-rt-7048hd-agrimate-rotavator-multispeed-hd-series-7ft-am-rt-7048hd.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3117",
    "name": "AM-MT-320M-WT WHEEL TROLLEY/TRANSPORTER",
    "slug": "am-mt-320m-wt-wheel-trolley-transporter-3117",
    "sku": "RIPL036445",
    "riplCode": "RIPL036445",
    "modelNumber": "AM-MT-320M-WT",
    "category": "Transporter",
    "categoryId": "cat-am-transporter",
    "price": 180000,
    "comparePrice": 180000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 6,
    "images": [
      "/images/products/agrimart/product_3117_1.jpg"
    ],
    "description": "Model: AM-MT-320M-WT    Displacement: 7HP / 212 CC   Speed: 3600RPM    Gear: 3 Forward + 1 Reverse    Max. load: 350 KG",
    "descriptionHtml": "<p><b>Model: </b>AM-MT-320M-WT   <b>Displacement:</b> 7HP / 212 CC  <b> Speed:</b> 3600RPM   <b>Gear: </b>3 Forward + 1 Reverse   <b>Max. load: </b>350 KG  <br></p>",
    "specifications": {
      "Transporter": "AM-MT-320M-WT",
      "RIPL Code": "RIPL036445",
      "Brand": "AGRIMATE",
      "Model": "AM-MT-320M-WT",
      "Displacement": "7HP / 212 CC",
      "Speed": "3600RPM",
      "Gear": "3 Forward + 1 Reverse",
      "Max. load": "350 KG"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Transmission Diagram",
        "url": "/agrimart-media/brochures/am-mt-320m-wt-agrimate-wheel-trolleytransporter-am-mt-320m-wt_2.pdf",
        "fileName": "am-mt-320m-wt-agrimate-wheel-trolleytransporter-am-mt-320m-wt_2.pdf",
        "available": true
      },
      {
        "label": "View Engine Part List",
        "url": "/agrimart-media/brochures/am-mt-320m-wt-agrimate-wheel-trolleytransporter-am-mt-320m-wt_3.pdf",
        "fileName": "am-mt-320m-wt-agrimate-wheel-trolleytransporter-am-mt-320m-wt_3.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3117_1.mp4",
        "fileName": "product_3117_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "Tool Kit"
  },
  {
    "id": "am-3412",
    "name": "AM-MPTC-2620-DBG-9D - INTERCULTIVATOR/POWER WEEDER",
    "slug": "am-mptc-2620-dbg-9d-intercultivator-power-weeder-3412",
    "sku": "RIPL028078",
    "riplCode": "RIPL028078",
    "modelNumber": "AM-MPTC-2620-DGB-9D (E) 3 GEAR",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 189000,
    "comparePrice": 189000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 30,
    "images": [
      "/images/products/agrimart/product_3412_1.jpg"
    ],
    "description": "Model: AM-MPTC-2620-DBG-9D     Engine model:  186FD      Displacement:  418CC   P ower:  3600RPM     Fuel tank capacity:  5.5Ltr     Ditching Width:  290mm    Ditching Depth:  ≥ 60mm    Cultivating depth:  620mm    Cultivating Depth: 150-300mm",
    "descriptionHtml": "<p>Model: AM-MPTC-2620-DBG-9D    Engine model: 186FD     Displacement: 418CC   Power: 3600RPM    Fuel tank capacity: 5.5Ltr    Ditching Width: 290mm   Ditching Depth: ≥60mm   Cultivating depth: 620mm    <b>Cultivating Depth:</b> 150-300mm</p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-MPTC-2620-DGB-9D (E) 3 GEAR",
      "RIPL Code": "RIPL028078",
      "Brand": "AGRIMATE",
      "Cultivating Depth": "150-300mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-mptc-2620-dbg-9d-intercultivatorpower-weeder.pdf",
        "fileName": "am-mptc-2620-dbg-9d-intercultivatorpower-weeder.pdf",
        "available": true
      },
      {
        "label": "View Transmission Diagram",
        "url": "/agrimart-media/brochures/am-mptc-2620-dgb-9d-e-3-gear-agrimate-intercultivator-am-mptc-2620-dgb-9d-e-3-gear_2.pdf",
        "fileName": "am-mptc-2620-dgb-9d-e-3-gear-agrimate-intercultivator-am-mptc-2620-dgb-9d-e-3-gear_2.pdf",
        "available": true
      },
      {
        "label": "View Engine Diagram",
        "url": "/agrimart-media/brochures/am-mptc-2620-dgb-9d-e-3-gear-agrimate-intercultivator-am-mptc-2620-dgb-9d-e-3-gear_3.pdf",
        "fileName": "am-mptc-2620-dgb-9d-e-3-gear-agrimate-intercultivator-am-mptc-2620-dgb-9d-e-3-gear_3.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1690_1.mp4",
        "fileName": "product_1690_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1.   Rubber Tyres 4.00x8       2.  Ditching blade - 10 Nos.    3.   Iron wheel    4 . Tilling blades -20 No's"
  },
  {
    "id": "am-1663",
    "name": "AM-MPTC-1100-9D (E) ELECTRIC START WITH BATTERY- INTERCULTIVATOR/POWER WEEDER",
    "slug": "am-mptc-1100-9d-e-electric-start-with-battery-intercultivator-power-weeder-1663",
    "sku": "RIPL027233",
    "riplCode": "RIPL027233",
    "modelNumber": "AM-MPT-1100-9D",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 192200,
    "comparePrice": 192200,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 81,
    "images": [
      "/images/products/agrimart/product_1663_1.jpg",
      "/images/products/agrimart/product_1663_2.jpg",
      "/images/products/agrimart/product_1663_3.jpg"
    ],
    "description": "Model: AM-MPTC-11009D     Engine Model: 186FA     Displacement:  418CC     Fuel tank capacity:  5Ltr    Tilling  Width:  1400mm     Tilling depth:  150-300mm     Power:  3600RPM    Gear :  4 Forward + 2 Reverse",
    "descriptionHtml": "<p>﻿<b>Model: </b>AM-MPTC-11009D    <b>Engine Model:</b>186FA    <b>Displacement: </b>418CC    <b>Fuel tank capacity: </b>5Ltr   <b>Tilling</b><b> Width:</b> 1400mm    <b> Tilling depth:</b> 150-300mm    <b>Power:</b> 3600RPM   <b>Gear: </b>4 Forward + 2 Reverse</p><p><br></p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-MPT-1100-9D",
      "RIPL Code": "RIPL027233",
      "Brand": "AGRIMATE",
      "Model": "AM-MPTC-11009D",
      "Engine Model": "186FA",
      "Displacement": "418CC",
      "Fuel tank capacity": "5Ltr",
      "Width": "1400mm",
      "Tilling depth": "150-300mm",
      "Power": "3600RPM",
      "Gear": "4 Forward + 2 Reverse"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-mptc-1100-9d-e-intercultivatorpower-weeder.pdf",
        "fileName": "am-mptc-1100-9d-e-intercultivatorpower-weeder.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/agrimate-rotary-tiller-am-mpt-1100-9d-e-am-mpt-1100-9d_2.pdf",
        "fileName": "agrimate-rotary-tiller-am-mpt-1100-9d-e-am-mpt-1100-9d_2.pdf",
        "available": true
      },
      {
        "label": "View Engine Part List",
        "url": "/agrimart-media/brochures/am-mpt-1100-9d-e-agrimate-intercultivator_3.pdf",
        "fileName": "am-mpt-1100-9d-e-agrimate-intercultivator_3.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1663_1.mp4",
        "fileName": "product_1663_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Tilling blades - 40 nos.   2. Side Disc    3.  Tyre 5.00 X 12     4.  Plough"
  },
  {
    "id": "am-3562",
    "name": "AM-CRH-188FD CORN HARVESTER+BAGGING - ELECTRIC START WITH BATTERY",
    "slug": "am-crh-188fd-corn-harvester-bagging-electric-start-with-battery-3562",
    "sku": "RIPL038045",
    "riplCode": "RIPL038045",
    "modelNumber": "AM-CRH-188FD",
    "category": "Harvester",
    "categoryId": "cat-am-harvester",
    "price": 195980,
    "comparePrice": 195980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 34,
    "images": [
      "/images/products/agrimart/product_3562_1.jpg"
    ],
    "description": "Model: AM-CRH-188FD    Power: 8.5kw/11 HP     RPM: 3600      Displacement: 456CC      Harvesting Rows: 1      Row Width: 570      Harvesting Hourly Productivity (hm\n²/h):   ≥ 0.2",
    "descriptionHtml": "<p><b>Model: </b>AM-CRH-188FD    <b>Power:</b> 8.5kw/11 HP    <b> RPM:</b> 3600     <b>Displacement: </b>456CC     <b>Harvesting Rows: </b>1     <b>Row Width:</b> 570     <b>Harvesting Hourly Productivity (hm\r\n²/h):  </b><b>≥ </b>0.2</p>",
    "specifications": {
      "Harvester Model": "AM-CRH-188FD",
      "RIPL Code": "RIPL038045",
      "Brand": "AGRIMATE",
      "Model": "AM-CRH-188FD",
      "Power": "8.5kw/11 HP",
      "RPM": "3600",
      "Displacement": "456CC",
      "Harvesting Rows": "1",
      "Row Width": "570"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-crh-188fd-agrimate-corn-harvesterbagging-electric-start-with-battery-am-crh-188fd.pdf",
        "fileName": "am-crh-188fd-agrimate-corn-harvesterbagging-electric-start-with-battery-am-crh-188fd.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-crh-188fd-agrimate-corn-harvesterbagging-electric-start-with-battery-am-crh-188fd_2.pdf",
        "fileName": "am-crh-188fd-agrimate-corn-harvesterbagging-electric-start-with-battery-am-crh-188fd_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-78",
    "name": "MTL-85R-WITH OUT BIT (REVERSE GEAR)-PETROL EARTH AUGER",
    "slug": "mtl-85r-with-out-bit-reverse-gear-petrol-earth-auger-78",
    "sku": "RIPL010038",
    "riplCode": "RIPL010038",
    "modelNumber": "MTL - 85 R",
    "category": "Earth Auger",
    "categoryId": "cat-am-earth-auger",
    "price": 199980,
    "comparePrice": 199980,
    "brand": "OLEO MAC",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 51,
    "images": [
      "/images/products/agrimart/product_78_4.jpg",
      "/images/products/agrimart/product_78_5.jpg",
      "/images/products/agrimart/product_78_6.jpg"
    ],
    "description": "Power: 5.7 HP - 4.2 kW      Displacement: 80.7 CM    Optional    Bit diameter: from 8 to 50 cm     Weight without bit: 30.6 KG",
    "descriptionHtml": "<p><b>Power:</b> 5.7 HP - 4.2 kW     <b>Displacement:</b> 80.7 CM    <b>Optional </b> <b>Bit diameter:</b> from 8 to 50 cm    <b>Weight without bit: </b>30.6 KG   </p>",
    "specifications": {
      "Earth Auger Model": "MTL - 85 R",
      "RIPL Code": "RIPL010038",
      "Brand": "OLEO MAC",
      "Power": "5.7 HP - 4.2 kW",
      "Displacement": "80.7 CM",
      "Bit diameter": "from 8 to 50 cm",
      "Weight without bit": "30.6 KG"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/mtl-85r-with-out-bit-reverse-gear-petrol-earth-auger-mtl-85-r.pdf",
        "fileName": "mtl-85r-with-out-bit-reverse-gear-petrol-earth-auger-mtl-85-r.pdf",
        "available": true
      },
      {
        "label": "View Illustrated Part List",
        "url": "/agrimart-media/brochures/om-earth-auger-mtl-85r-reverse-gear-petrol-without-bit-mtl-85-r_2.pdf",
        "fileName": "om-earth-auger-mtl-85r-reverse-gear-petrol-without-bit-mtl-85-r_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_78_1.mp4",
        "fileName": "product_78_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  },
  {
    "id": "am-510",
    "name": "AMTH-K-320-2S-Kawasaki -AGRIMATE TEA HARVESTER",
    "slug": "amth-k-320-2s-kawasaki-agrimate-tea-harvester-510",
    "sku": "RIPL006044",
    "riplCode": "RIPL006044",
    "modelNumber": "AMTH-2M",
    "category": "Harvester",
    "categoryId": "cat-am-harvester",
    "price": 199980,
    "comparePrice": 199980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 5,
    "images": [
      "/images/products/agrimart/product_510_1.jpg",
      "/images/products/agrimart/product_510_2.jpg",
      "/images/products/agrimart/product_510_3.jpg"
    ],
    "description": "Type: 2S    Engine: AX-52T    Power/RPM: 2.2KW/7500RPM    Displacement: 49.4CC    Fuel Tank Capacity: 1.4L    Cutting Width: 1200MM    Weight: 16.3KG",
    "descriptionHtml": "<p><b>Type:</b> 2S   <b>Engine:</b> AX-52T   <b>Power/RPM:</b> 2.2KW/7500RPM   <b>Displacement: </b>49.4CC   <b>Fuel Tank Capacity:</b> 1.4L   <b>Cutting Width:</b> 1200MM   <b>Weight: </b>16.3KG</p>",
    "specifications": {
      "Harvester Model": "AMTH-2M",
      "RIPL Code": "RIPL006044",
      "Brand": "AGRIMATE",
      "Type": "2S",
      "Engine": "AX-52T",
      "Power/RPM": "2.2KW/7500RPM",
      "Displacement": "49.4CC",
      "Fuel Tank Capacity": "1.4L",
      "Cutting Width": "1200MM",
      "Weight": "16.3KG"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/agrimate-two-men-operated-harvestor-amth-2m-320-amth-2m.pdf",
        "fileName": "agrimate-two-men-operated-harvestor-amth-2m-320-amth-2m.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/agrimate-two-men-operated-harvester-amth-2m-320-amth-2m_2.pdf",
        "fileName": "agrimate-two-men-operated-harvester-amth-2m-320-amth-2m_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1. Tea bag- 1 No.   2. Oil can    3. Fuel mixing can    4. Standard tools"
  },
  {
    "id": "am-2842",
    "name": "AM-GR-4G120-GED WITH AGRIMATE ENGINE Crop Harvester / Reaper",
    "slug": "am-gr-4g120-ged-with-agrimate-engine-crop-harvester-reaper-2842",
    "sku": "RIPL028152",
    "riplCode": "RIPL028152",
    "modelNumber": "AM-GR-4G-120-GED",
    "category": "Reaper Harvester",
    "categoryId": "cat-am-reaper-harvester",
    "price": 199980,
    "comparePrice": 199980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 23,
    "images": [
      "/images/products/agrimart/product_2842_1.jpg"
    ],
    "description": "Model: AM GR-4G120 GED   P ower:  5.1kw/7HP     Displacement:  212CC     Cutting width: 1200mm      Cutting height:  50mm      Speed: 3600RPM   Productivity: 5 to 7Hr/Ha    Working speed: 2.6~3.6 km/h   Fuel tank capacity: 3.1Ltr",
    "descriptionHtml": "<p><b>Model:</b> AM GR-4G120 GED   Power: 5.1kw/7HP    Displacement: 212CC    <b>Cutting width: </b>1200mm     Cutting height: 50mm     <b>Speed: </b>3600RPM  <b> Productivity: </b>5 to 7Hr/Ha   <b>Working speed: </b>2.6~3.6 km/h  <b>Fuel tank capacity:</b> 3.1Ltr  </p>",
    "specifications": {
      "Reaper / Harvester": "AM-GR-4G-120-GED",
      "RIPL Code": "RIPL028152",
      "Brand": "AGRIMATE",
      "Model": "AM GR-4G120 GED P ower: 5.1kw/7HP Displacement: 212CC",
      "Cutting width": "1200mm Cutting height: 50mm",
      "Speed": "3600RPM",
      "Productivity": "5 to 7Hr/Ha",
      "Working speed": "2.6~3.6 km/h",
      "Fuel tank capacity": "3.1Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-gr-4g120-ged-with-agrimate-engine-crop-harvester-reaper.pdf",
        "fileName": "am-gr-4g120-ged-with-agrimate-engine-crop-harvester-reaper.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am-gr-4g120-ged-with-agrimate-engine-crop-harvester-reaper_2.pdf",
        "fileName": "am-gr-4g120-ged-with-agrimate-engine-crop-harvester-reaper_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": ""
  },
  {
    "id": "am-3115",
    "name": "AM-MT-320M AGRIMATE TRACK TROLLEY/ TRANSPORTER",
    "slug": "am-mt-320m-agrimate-track-trolley-transporter-3115",
    "sku": "RIPL036444",
    "riplCode": "RIPL036444",
    "modelNumber": "AM-MT-320M",
    "category": "Transporter",
    "categoryId": "cat-am-transporter",
    "price": 203800,
    "comparePrice": 203800,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 12,
    "images": [
      "/images/products/agrimart/product_3115_1.jpg"
    ],
    "description": "Model: AM-RT-320M    Displacement: 7HP / 212 CC   Speed: 3600RPM    Gear: 3 Forward + 1 Reverse    Max. load: 350 KG",
    "descriptionHtml": "<p><b>Model: </b>AM-RT-320M   <b>Displacement:</b> 7HP / 212 CC  <b> Speed:</b> 3600RPM   <b>Gear: </b>3 Forward + 1 Reverse   <b>Max. load: </b>350 KG  </p>",
    "specifications": {
      "Transporter": "AM-MT-320M",
      "RIPL Code": "RIPL036444",
      "Brand": "AGRIMATE",
      "Model": "AM-RT-320M",
      "Displacement": "7HP / 212 CC",
      "Speed": "3600RPM",
      "Gear": "3 Forward + 1 Reverse",
      "Max. load": "350 KG"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Transmission Diagram",
        "url": "/agrimart-media/brochures/am-mt-320m-agrimate-track-trolley-transporter-am-mt-320m_2.pdf",
        "fileName": "am-mt-320m-agrimate-track-trolley-transporter-am-mt-320m_2.pdf",
        "available": true
      },
      {
        "label": "View Engine Part List",
        "url": "/agrimart-media/brochures/am-mt-320m-agrimate-track-trolley-transporter-am-mt-320m_3.pdf",
        "fileName": "am-mt-320m-agrimate-track-trolley-transporter-am-mt-320m_3.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3115_1.mp4",
        "fileName": "product_3115_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "Tool Kit"
  },
  {
    "id": "am-3482",
    "name": "AM-MPT-1100-9D-DGB-E WITH F TYPE DITCHER W/O BATTERY - INTERCULTIVATOR / POWER WEEDER",
    "slug": "am-mpt-1100-9d-dgb-e-with-f-type-ditcher-w-o-battery-intercultivator-power-weeder-3482",
    "sku": "RIPL037914",
    "riplCode": "RIPL037914",
    "modelNumber": "",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 233980,
    "comparePrice": 233980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 10,
    "images": [
      "/images/products/agrimart/product_3482_1.jpg",
      "/images/products/agrimart/product_3482_2.jpg"
    ],
    "description": "Model:  AM-MPT-1100-9D DGB-E       Power: 8.8  Kw      Tilling width: 14 00MM     Tilling Depth:  250-300MM",
    "descriptionHtml": "<p>Model: AM-MPT-1100-9D DGB-E     Power: 8.8 Kw    Tilling width: 1400MM    Tilling Depth: 250-300MM   </p>",
    "specifications": {
      "RIPL Code": "RIPL037914",
      "Brand": "AGRIMATE",
      "Model": "AM-MPT-1100-9D DGB-E Power: 8.8 Kw Tilling width: 14 00MM Tilling Depth: 250-300MM"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-mpt-1100-9d-dgb-e-with-f-type-ditcher-wo-battery-inter-cultivator-power-weeder-am-mpt-1100-9d-dfb-e.pdf",
        "fileName": "am-mpt-1100-9d-dgb-e-with-f-type-ditcher-wo-battery-inter-cultivator-power-weeder-am-mpt-1100-9d-dfb-e.pdf",
        "available": true
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-mpt-1100-9d-dgb-e-inter-cultivator-power-weeder-with-f-type-ditching-wo-battery-am-mpt-1100-9d-dfb-e_2.pdf",
        "fileName": "am-mpt-1100-9d-dgb-e-inter-cultivator-power-weeder-with-f-type-ditching-wo-battery-am-mpt-1100-9d-dfb-e_2.pdf",
        "available": true
      },
      {
        "label": "View Transmission User Manual",
        "url": "/agrimart-media/brochures/am-mpt-1100-9d-dgb-e-inter-cultivator-power-weeder-with-f-type-ditching-wo-battery-am-mpt-1100-9d-dfb-e_3.pdf",
        "fileName": "am-mpt-1100-9d-dgb-e-inter-cultivator-power-weeder-with-f-type-ditching-wo-battery-am-mpt-1100-9d-dfb-e_3.pdf",
        "available": true
      },
      {
        "label": "View F type Ditcher User Manual",
        "url": "/agrimart-media/brochures/am-mpt-1100-9d-dgb-e-inter-cultivator-power-weeder-with-f-type-ditching-wo-battery-am-mpt-1100-9d-dfb-e_4.pdf",
        "fileName": "am-mpt-1100-9d-dgb-e-inter-cultivator-power-weeder-with-f-type-ditching-wo-battery-am-mpt-1100-9d-dfb-e_4.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1.  Tyre 5.00*12     2.  Back Rotary-24 No.s     3.  Ditching Blades-12 No.s    4. Center Rotary- 40 No.s"
  },
  {
    "id": "am-1978",
    "name": "AM-GR-4G120-GE- MULTI CROP HARVESTER / REAPER",
    "slug": "am-gr-4g120-ge-multi-crop-harvester-reaper-1978",
    "sku": "RIPL027355",
    "riplCode": "RIPL027355",
    "modelNumber": "AM MCR 4G120 GE",
    "category": "Reaper Harvester",
    "categoryId": "cat-am-reaper-harvester",
    "price": 239800,
    "comparePrice": 239800,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 1,
    "images": [
      "/images/products/agrimart/product_1978_1.jpg",
      "/images/products/agrimart/product_1978_2.jpg",
      "/images/products/agrimart/product_1978_3.jpg",
      "/images/products/agrimart/product_1978_4.jpg"
    ],
    "description": "Model: AM GR-4G120 GE    Displacement : 212CC    Cutting width: 1200mm    Power: 5.1kw/7HP   Speed:  3600 RPM   Productivity: 5to7 Hr/Ha    Working speed: 2.6~3.6 km/h    Placing type: Sidewise    Fuel tank capacity: 3.5Ltr  Starting system: Recoil Start  Cutting height:  50mm",
    "descriptionHtml": "<p><b>Model:</b> AM GR-4G120 GE   <b>Displacement</b>: 212CC   <b>Cutting width: </b>1200mm   <b>Power:</b> 5.1kw/7HP  <b>Speed: </b>3600 RPM  <b> Productivity: </b>5to7 Hr/Ha   <b>Working speed: </b>2.6~3.6 km/h   <b>Placing type:</b> Sidewise   <b>Fuel tank capacity:</b>3.5Ltr  <b>Starting system: </b>Recoil Start  <b>Cutting height:</b> 50mm</p><p><br></p>",
    "specifications": {
      "Reaper / Harvester": "AM MCR 4G120 GE",
      "RIPL Code": "RIPL027355",
      "Brand": "AGRIMATE",
      "Model": "AM GR-4G120 GE",
      "Displacement": "212CC",
      "Cutting width": "1200mm",
      "Power": "5.1kw/7HP",
      "Speed": "3600 RPM",
      "Productivity": "5to7 Hr/Ha",
      "Working speed": "2.6~3.6 km/h",
      "Placing type": "Sidewise",
      "Fuel tank capacity": "3.5Ltr",
      "Starting system": "Recoil Start",
      "Cutting height": "50mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-gr-4g120-ge-multi-crop-harvester-reaper.pdf",
        "fileName": "am-gr-4g120-ge-multi-crop-harvester-reaper.pdf",
        "available": true
      },
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/am-gr-4g120-ge-multi-crop-harvester-reaper_2.pdf",
        "fileName": "am-gr-4g120-ge-multi-crop-harvester-reaper_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_1978_1.mp4",
        "fileName": "product_1978_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "OPTIONAL ACCESSORIES:  1.  Counter Weight for Reaper    2. Reaper High frame for tall crops"
  },
  {
    "id": "am-3602",
    "name": "AM-MPTC-1100-9D-E-BEAST INTERCULTIVATOR/POWER WEEDER WITH 9GEAR",
    "slug": "am-mptc-1100-9d-e-beast-intercultivator-power-weeder-with-9gear-3602",
    "sku": "RIPL039061",
    "riplCode": "RIPL039061",
    "modelNumber": "AM-MPTC-1100-9D-E-BEAST",
    "category": "Intercultivator / Power Weeder",
    "categoryId": "cat-am-intercultivator",
    "price": 291980,
    "comparePrice": 291980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 68,
    "images": [
      "/images/products/agrimart/product_3602_1.jpg",
      "/images/products/agrimart/product_3602_2.jpg",
      "/images/products/agrimart/product_3602_3.jpg",
      "/images/products/agrimart/product_3602_4.jpg"
    ],
    "description": "Model:  AM-MPTC-1100-9D-E-BEAST      Engine Model: 195FA    Power: 3600RPM     Displacement:  531CC    Gear:    5F, 2N & 2R     Tilling width:  Upto 1000mm    Tilling depth:  ≥150 mm      Fuel Tank Capacity:  5.5Ltr",
    "descriptionHtml": "<p>Model: AM-MPTC-1100-9D-E-BEAST     Engine Model: 195FA   Power: 3600RPM    Displacement: 531CC   Gear:  5F, 2N & 2R   Tilling width: Upto 1000mm   Tilling depth: ≥150 mm     Fuel Tank Capacity: 5.5Ltr</p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-MPTC-1100-9D-E-BEAST",
      "RIPL Code": "RIPL039061",
      "Brand": "AGRIMATE",
      "Model": "AM-MPTC-1100-9D-E-BEAST Engine Model: 195FA Power: 3600RPM Displacement: 531CC Gear: 5F, 2N & 2R Tilling width: Upto 1000mm Tilling depth: ≥150 mm Fuel Tank Capacity: 5.5Ltr"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": true,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-mptc-1100-9d-e-beast-intercultivatorpower-weeder-with-9gear-am-mptc-1100-9d-e-beast.pdf",
        "fileName": "am-mptc-1100-9d-e-beast-intercultivatorpower-weeder-with-9gear-am-mptc-1100-9d-e-beast.pdf",
        "available": false
      },
      {
        "label": "View User Manual Cum Part List",
        "url": "/agrimart-media/brochures/am-mptc-1100-9d-e-beast-intercultivatorpower-weeder-with-9gear-am-mptc-1100-9d-e-beast_2.pdf",
        "fileName": "am-mptc-1100-9d-e-beast-intercultivatorpower-weeder-with-9gear-am-mptc-1100-9d-e-beast_2.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . Tilling blades Disc - 40 Nos.     2 . Back Rotary Blades -20Nos."
  },
  {
    "id": "am-3590",
    "name": "AM-MPTC-1100-12D-4WHEEL ELECTRIC START WITH BATTERY WITH LED LIGHT",
    "slug": "am-mptc-1100-12d-4wheel-electric-start-with-battery-with-led-light-3590",
    "sku": "RIPL038524",
    "riplCode": "RIPL038524",
    "modelNumber": "AM-MPTC-1100-12D",
    "category": "Garden Tools",
    "categoryId": "cat-am-garden-tools",
    "price": 337980,
    "comparePrice": 337980,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 6,
    "images": [
      "/images/products/agrimart/product_3590_1.jpg",
      "/images/products/agrimart/product_3590_2.jpg"
    ],
    "description": "Model : AM-MPTC-1100-12D    Engine : 192FD     Power : 3600RPM     Displacement : 499CC     Fuel Tank Capacity : 5.5Ltr     Gear: Front Gearbox 2F - 1R & Back Gearbox 3F    Tilling Width : 1350mm    Tilling Depth : ≥100mm",
    "descriptionHtml": "<p><b>Model</b>: AM-MPTC-1100-12D   <b>Engine</b>: 192FD    <b>Power</b>: 3600RPM    <b>Displacement</b>: 499CC    <b>Fuel Tank Capacity</b>: 5.5Ltr    <b>Gear: </b>Front Gearbox 2F - 1R & Back Gearbox 3F   <b>Tilling Width</b>: 1350mm   <b>Tilling Depth</b>: ≥100mm</p>",
    "specifications": {
      "Intercultivator/power Weeder Model": "AM-MPTC-1100-12D",
      "RIPL Code": "RIPL038524",
      "Brand": "AGRIMATE",
      "Model": "AM-MPTC-1100-12D",
      "Engine": "192FD",
      "Power": "3600RPM",
      "Displacement": "499CC",
      "Fuel Tank Capacity": "5.5Ltr",
      "Gear": "Front Gearbox 2F - 1R & Back Gearbox 3F",
      "Tilling Width": "1350mm",
      "Tilling Depth": "≥100mm"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-mptc-1100-12d-4wheel-electric-start-with-battery-with-led-light-am-mptc-1100-12d.pdf",
        "fileName": "am-mptc-1100-12d-4wheel-electric-start-with-battery-with-led-light-am-mptc-1100-12d.pdf",
        "available": true
      }
    ],
    "videos": [],
    "accessoriesInfo": "1 . ATV Tyres 19 x 7.00-8      2 . Deep Hoe blades - 12(6+6)     3 . Tilling Blades - 40 Nos"
  },
  {
    "id": "am-153",
    "name": "AF-4000NK-VM-KOREA ISI THERMAL FOG SPRAYER SS BODY VEHICLE MOUNT",
    "slug": "af-4000nk-vm-korea-isi-thermal-fog-sprayer-ss-body-vehicle-mount-153",
    "sku": "RIPL005729",
    "riplCode": "RIPL005729",
    "modelNumber": "AF4000NK",
    "category": "Fogger",
    "categoryId": "cat-am-fogger",
    "price": 360000,
    "comparePrice": 360000,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 12,
    "images": [
      "/images/products/agrimart/product_153_1.jpg",
      "/images/products/agrimart/product_153_2.jpg",
      "/images/products/agrimart/product_153_4.jpg"
    ],
    "description": "Gasoline Tank Capacity : 16L    Type: Thermal Aerosol fog   Solution Tank Capacity : 100-150Ltr    Flow Rate : 85L/H    Solution Tank Material : Stainless Steel 304L    Starting Method: Remote    Fuel Consumption : 3.3L/H    Weight:  45kg    Made   in : Korea",
    "descriptionHtml": "<div><b>Gasoline Tank Capacity</b><b>:</b> 16L   <b>Type: </b>Thermal Aerosol fog <b>  Solution Tank Capacity</b><b>:</b> 100-150Ltr   <b>Flow Rate</b><b>:</b> 85L/H   <b>Solution Tank Material</b><b>:</b> Stainless Steel 304L   <b>Starting Method: </b>Remote   <b>Fuel Consumption</b><b>:</b> 3.3L/H   <b>Weight:</b> 45kg   <b>Made</b> <b>in</b><b>:</b> Korea",
    "specifications": {
      "Fogger Model": "AF4000NK",
      "RIPL Code": "RIPL005729",
      "Brand": "AGRIMATE",
      "Type": "Thermal Aerosol fog",
      "Starting Method": "Remote",
      "Weight": "45kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View User Manual cum Parts List",
        "url": "/agrimart-media/brochures/agrimate-fogger-vm-af4000nk-af4000nk_2.pdf",
        "fileName": "agrimate-fogger-vm-af4000nk-af4000nk_2.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_153_1.mp4",
        "fileName": "product_153_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": "1. Standard tools   2. Funnel"
  },
  {
    "id": "am-3552",
    "name": "AM-4G90-RBDE MULTIPURPOSE REAPER/HARVESTER CUM BINDER",
    "slug": "am-4g90-rbde-multipurpose-reaper-harvester-cum-binder-3552",
    "sku": "RIPL038447",
    "riplCode": "RIPL038447",
    "modelNumber": "AM-4G90-RBDE ( Electric Start)",
    "category": "Reaper Harvester",
    "categoryId": "cat-am-reaper-harvester",
    "price": 515600,
    "comparePrice": 515600,
    "brand": "AGRIMATE",
    "rating": 4.8,
    "reviewsCount": 14,
    "stock": 15,
    "images": [
      "/images/products/agrimart/product_3552_1.jpg",
      "/images/products/agrimart/product_3552_2.jpg"
    ],
    "description": "Model:  AM-4G90-RBDE     Power:  5.67kW/7HP     RPM:  2600    Cutting width:  90cm    Gear:   2 Forward & 1 Reverse    Weight:  320kg",
    "descriptionHtml": "<p>Model: AM-4G90-RBDE    Power: 5.67kW/7HP    RPM: 2600   Cutting width: 90cm    <b>Gear:  </b>2 Forward & 1 Reverse   <b>Weight: </b>320kg</p>",
    "specifications": {
      "Reaper / Harvester": "AM-4G90-RBDE ( Electric Start)",
      "RIPL Code": "RIPL038447",
      "Brand": "AGRIMATE",
      "Gear": "2 Forward & 1 Reverse",
      "Weight": "320kg"
    },
    "targetCrops": [],
    "cropStages": [],
    "isBestSeller": false,
    "isFeatured": true,
    "brochures": [
      {
        "label": "View Leaflet",
        "url": "/agrimart-media/brochures/am-4g90-rbde-multipurpose-reaperharvester-cum-binder-am-4g90-rbde-electric-start.pdf",
        "fileName": "am-4g90-rbde-multipurpose-reaperharvester-cum-binder-am-4g90-rbde-electric-start.pdf",
        "available": true
      }
    ],
    "videos": [
      {
        "url": "/agrimart-media/videos/product_3552_1.mp4",
        "fileName": "product_3552_1.mp4",
        "type": "mp4",
        "available": true
      }
    ],
    "accessoriesInfo": ""
  }
];

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

