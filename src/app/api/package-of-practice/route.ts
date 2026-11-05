import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { devDb } from '@/lib/dev-db';
import { validatePhoneNumber, validateEmailOptional, validatePinCode } from '@/lib/validation';

export interface FarmerLoginAccount {
  id: string;
  username: string;
  name: string;
  mobile: string;
  password: string;
  email?: string;
  updatedAt: string;
}

export interface PopSubmissionRecord {
  id: string;
  userId?: string;
  isUserSubmitted?: boolean;
  loginUsername?: string;
  loginPassword?: string;
  trackingCode: string;
  slNo: string;
  farmerId: string;
  name: string;
  mobileNumber: string;
  emailId: string;
  date: string;
  surveyNumber: string;
  address: string;
  pinCode: string;
  villagePanchayat: string;
  taluk: string;
  district: string;
  state: string;
  language: string;
  jobWorkLocation: string;
  acres: string;
  soilType: string;
  irrigationType: string;
  waterSource: string;
  cropType?: string;
  crop: string;
  variety: string;
  plantingDate: string;
  cropAge: string;
  cropAcreage: string;
  gpsLocation?: string;
  gpsLatitude?: number | string;
  gpsLongitude?: number | string;
  gpsAccuracy?: number | string;
  plantCount: string;
  spacing?: string;
  currentCropStage?: string;
  additionalCrops?: any[];
  cropCycleDays: string;
  cropStage: string;
  mainRequirement: string;
  problemType: string;
  solutionType: string;
  applicationMethod: string;
  serviceType: string;
  farmMaterial: string;
  equipment: string;
  harvestPlanning: string;
  packagingType: string;
  // Tab 2: Farmer Lifecycle (Additional Features to Build into the Farmer Profile App)
  // 1. Farmer Visit and Advisory History
  visitDate?: string;
  advisorName?: string;
  visitCropStage?: string;
  cropObservations?: string;
  visitRecommendations?: string;
  visitApplicationType?: string;
  farmerFeedback?: string;
  visitPhotographs?: string;
  nextFollowUpDate?: string;
  // 2. Pest, Disease and Crop Problem Tracking
  problemFieldPhotos?: string;
  problemSymptoms?: string;
  problemSeverity?: string;
  problemActionsTaken?: string;
  problemResolved?: string;
  // 3. Irrigation and Weather Alerts
  waterAvailability?: string;
  irrigationSchedules?: string;
  rainfallAlert?: string;
  heatAlert?: string;
  weatherAlerts?: string;
  // 4. Soil Health and Fertilizer Recommendations
  soilTestReport?: string;
  soilReportFileName?: string;
  soilReportFileData?: string;
  nutrientRecommendations?: string;
  fertilizerHistory?: string;
  nextSoilTestDate?: string;
  // 5. Harvest, Yield and Market Information
  harvestingDate?: string;
  harvestedQuantity?: string;
  sellingPrice?: string;
  buyerName?: string;
  marketExpenses?: string;
  cropWiseReturns?: string;
  localMarketPriceInfo?: string;
  harvestPicking?: string;
  // 6. Farmer Communication and Follow-ups
  whatsappConsent?: string;
  advisoryMessages?: string;
  trainingAttendance?: string;
  communicationReminders?: string;
  schemeInformation?: string;
  pendingActions?: string;
  // 7. Problem and Solution Summary (Backend Managed)
  problemSummary?: string;
  solutionSummary?: string;
  cropLifecycleMap?: Record<string, any>;
  cropExtraLifecycleStagesMap?: Record<string, any[]>;

  vleFpoNo?: string;
  distanceFromVle?: string;
  schedule: any[];
  isPopTableEnabled?: boolean;
  status: 'SUBMITTED' | 'VERIFIED' | 'IN_PROGRESS' | 'COMPLETED';
  submittedAt: string;
  updatedAt: string;
}

const DEFAULT_POP_FORMS: PopSubmissionRecord[] = [
  {
    id: 'pop-2026-001',
    userId: 'usr-farmer-01',
    isUserSubmitted: true,
    trackingCode: 'CDF-2026-4812',
    slNo: 'CDF-2026-4812',
    farmerId: 'FRM-KA-2026-1042',
    name: 'Ramesh Kumar Gowda',
    mobileNumber: '9845190812',
    emailId: 'ramesh.farmer@agrimart.in',
    date: '2026-10-18',
    surveyNumber: '142/2A',
    address: 'No. 48, Temple Street, Koppa Village',
    pinCode: '571428',
    villagePanchayat: 'Koppa',
    taluk: 'Maddur',
    district: 'Mandya',
    state: 'Karnataka',
    language: 'Kannada / English',
    jobWorkLocation: 'Near Koppa Main Canal Road, Maddur Taluk',
    acres: '3.5 Acres',
    soilType: 'Red Sandy Loam / Black Cotton Soil',
    irrigationType: 'Drip / Furrow Irrigation',
    waterSource: 'Borewell',
    cropType: 'Field and commercial crops',
    crop: 'Maize',
    variety: 'Hybrid Maize (NK-6240 / Pioneer 3396)',
    plantingDate: '2026-09-22',
    cropAge: '28 Days',
    cropAcreage: '2.0 Acres',
    plantCount: '33,333 Plants / Acre',
    spacing: '60cm x 20cm',
    currentCropStage: 'Vegetative growth',
    additionalCrops: [
      {
        id: 'crop-ramesh-2',
        cropType: 'Vegetables',
        crop: 'Tomato',
        variety: 'Arka Rakshak F1 Hybrid',
        plantingDate: '2026-09-28',
        cropAge: '30 Days',
        cropAcreage: '1.0 Acre',
        plantCount: '11,000 Plants / Acre',
        spacing: '90cm x 45cm',
        currentCropStage: 'Flowering',
        surveyNumber: '142/2A',
        lifecycleData: {
          visitDate: '2026-10-20',
          advisorName: 'Dr. Anand Nadagouda',
          visitCropStage: 'Flowering',
          cropObservations: 'Early flowering truss initiated; plants staked on bamboo poles.',
          visitRecommendations: 'Install 12 yellow sticky traps/acre; apply Calcium Nitrate 4kg/acre via drip.',
          visitApplicationType: 'Drip / fertigation',
          farmerFeedback: 'Good vegetative vigor after staking.',
          visitPhotographs: '',
          nextFollowUpDate: '2026-11-04',
          problemFieldPhotos: '',
          problemSymptoms: 'Minor serpentine leaf miner trails on lower leaves',
          problemSeverity: 'Low',
          problemActionsTaken: 'Pruned affected basal leaves & sprayed Neem Oil 10000 ppm @ 2ml/L',
          problemResolved: 'Yes - Resolved',
          waterAvailability: 'Adequate (Borewell / Canal)',
          irrigationSchedules: 'Daily 40 mins drip irrigation',
          rainfallAlert: 'Clear weather forecasted',
          heatAlert: 'Normal (30°C)',
          weatherAlerts: 'Mandya District: Favorable conditions for tomato fruit set',
          soilTestReport: 'pH 6.8, Red Sandy Loam, Adequate K & Ca',
          soilReportFileName: '',
          soilReportFileData: '',
          nutrientRecommendations: '19:19:19 @ 3kg/acre + Boron 20% @ 1g/L foliar spray',
          fertilizerHistory: 'Basal FYM 2 Tonnes + DAP 40kg applied at bed preparation',
          nextSoilTestDate: '2027-03-15',
          harvestingDate: '2026-12-20',
          harvestedQuantity: 'Grade A - Export / Retail Quality',
          sellingPrice: '36',
          marketExpenses: '₹2,800',
          cropWiseReturns: '₹95,000 / Acre expected',
          localMarketPriceInfo: 'Mandya / Maddur Market: ₹34 - ₹38 / kg',
          harvestPicking: 'Multi-Picking (Every 4-5 Days in 20kg Crates)',
          whatsappConsent: 'Yes - Subscribed',
          advisoryMessages: 'Tomato price & blight alerts active',
          trainingAttendance: 'Attended Maddur IPM Field Day (Oct 2026)',
          communicationReminders: 'Staking wire tightening reminder at Day 35',
          schemeInformation: 'Horticulture Drip & Mulching Subsidy enrolled',
          pendingActions: 'Monitor for Tuta pinworm at fruit set stage',
          problemSummary: 'Minor serpentine leaf miner trails on lower leaves during early flowering.',
          solutionSummary: 'Removed lower affected leaves + Sprayed Neem Oil 10000 ppm @ 2ml/L + Installed 12 yellow sticky traps/acre.',
        },
      },
      {
        id: 'crop-ramesh-3',
        cropType: 'Spices and condiments',
        crop: 'Turmeric',
        variety: 'Prathibha / Salem Variety',
        plantingDate: '2026-08-15',
        cropAge: '73 Days',
        cropAcreage: '0.5 Acre',
        plantCount: '44,000 Rhizomes / Acre',
        spacing: '45cm x 20cm',
        currentCropStage: 'Vegetative growth',
        surveyNumber: '142/2B',
        lifecycleData: {
          visitDate: '2026-10-20',
          advisorName: 'Dr. Anand Nadagouda',
          visitCropStage: 'Vegetative growth',
          cropObservations: 'Active rhizome bulking and pseudostem tillering; foliage dark green.',
          visitRecommendations: 'Drench Trichoderma viride + Pseudomonas @ 2.5kg/acre in FYM to prevent rhizome rot.',
          visitApplicationType: 'Soil drenching',
          farmerFeedback: 'Zero rhizome rot seen so far after raised bed planting.',
          visitPhotographs: '',
          nextFollowUpDate: '2026-11-15',
          problemFieldPhotos: '',
          problemSymptoms: 'Occasional small oval brown spots on older leaves (Leaf Blotch)',
          problemSeverity: 'Low',
          problemActionsTaken: 'Sprayed Mancozeb 75% WP @ 2.5g/L and improved furrow drainage',
          problemResolved: 'Yes - Resolved',
          waterAvailability: 'Adequate (Borewell / Canal)',
          irrigationSchedules: 'Every 6-7 days via furrow / drip without water stagnation',
          rainfallAlert: 'Light showers expected',
          heatAlert: 'Normal (29°C)',
          weatherAlerts: 'Ensure drainage channels remain open after rain to prevent rhizome rot',
          soilTestReport: 'pH 6.8, High Organic Matter, Good drainage',
          soilReportFileName: '',
          soilReportFileData: '',
          nutrientRecommendations: 'Top dress 25kg MOP + Micronutrient mixture @ 5kg/acre at earthing up',
          fertilizerHistory: 'Basal Neem Cake 100kg + FYM + 1st Urea & MOP split completed',
          nextSoilTestDate: '2027-03-15',
          harvestingDate: '2027-04-15',
          harvestedQuantity: 'Grade A - Export / Retail Quality',
          sellingPrice: '145',
          marketExpenses: '₹2,100',
          cropWiseReturns: '₹1,20,000 / Acre expected (cured fingers)',
          localMarketPriceInfo: 'Chamarajanagar / Erode Turmeric Market: ₹14,000 - ₹15,200 / Quintal',
          harvestPicking: 'Single Rhizome Digging & Curing Harvest at 8 Months',
          whatsappConsent: 'Yes - Subscribed',
          advisoryMessages: 'Turmeric curing & market price updates enabled',
          trainingAttendance: 'Attended Maddur IPM Field Day (Oct 2026)',
          communicationReminders: 'Second earthing-up reminder at Day 90',
          schemeInformation: 'Spices Board Rhizome Multiplication Scheme eligible',
          pendingActions: 'Inspect collar zone for moisture stagnation after rain',
          problemSummary: 'Mild Leaf Blotch spots on older lower leaves during active rhizome bulking.',
          solutionSummary: 'Foliar spray of Mancozeb 75% WP @ 2.5g/L + Preventive Trichoderma viride soil enrichment.',
        },
      },
    ],
    cropCycleDays: '110',
    cropStage: 'Vegetative growth',
    mainRequirement: 'Advisory with field visit',
    problemType: 'Insect pests',
    solutionType: 'Integrated Pest Management (IPM)',
    applicationMethod: 'Foliar Whorl Spray & Basal Soil Incorporation',
    serviceType: 'Mechanical Deep Ploughing, Boom Spraying & Combine Harvesting',
    farmMaterial: 'Sprayer parts',
    equipment: 'Sprayer',
    harvestPlanning: 'Mechanical Combine Harvest at 16–18% Grain Moisture & Sun Drying to 12%',
    packagingType: '50 kg Jute / PP Woven Moisture-Proof Gunny Bags',
    visitDate: '2026-10-18',
    advisorName: 'Dr. Anand Nadagouda',
    visitCropStage: 'Vegetative growth',
    cropObservations: 'Healthy knee-high stand; minor whorl pinholes noticed in border rows.',
    visitRecommendations: 'Spray Spinetoram 11.7 SC @ 0.5ml/L directly into whorl and top-dress 35kg Urea/acre.',
    visitApplicationType: 'Foliar spray',
    farmerFeedback: 'Satisfied with germination and early vigor.',
    visitPhotographs: '',
    nextFollowUpDate: '2026-11-02',
    problemFieldPhotos: '',
    problemSymptoms: 'Pinholes and window-pane feeding on young whorl leaves',
    problemSeverity: 'Moderate',
    problemActionsTaken: 'Installed 8 pheromone traps/acre and applied Spinetoram 11.7 SC whorl spray',
    problemResolved: 'In Progress',
    waterAvailability: 'Adequate / Sufficient',
    irrigationSchedules: 'Every 5 days via furrow / drip',
    rainfallAlert: 'Light scattered showers expected in 72 hours',
    heatAlert: 'Normal (29°C - 31°C)',
    weatherAlerts: 'Mandya District: Clear skies suitable for foliar application',
    soilTestReport: 'pH 6.8, EC 0.32 dS/m, OC 0.65%, Medium N, High K',
    nutrientRecommendations: 'Basal DAP 50kg + Top dress Urea 35kg + Zinc Sulphate 10kg/acre',
    fertilizerHistory: 'Applied 50kg DAP & 10kg Zinc Sulphate on 2026-09-22',
    nextSoilTestDate: '2027-03-15',
    harvestingDate: '2027-01-10',
    harvestedQuantity: 'Good',
    sellingPrice: '24',
    marketExpenses: '₹3,200',
    cropWiseReturns: '₹68,000 / Acre expected',
    localMarketPriceInfo: 'Mandya APMC: ₹23 - ₹25 / kg',
    harvestPicking: 'Single Combine Harvest',
    whatsappConsent: 'Yes - Opted In',
    advisoryMessages: 'Weekly Kannada WhatsApp voice & text crop advisory active',
    trainingAttendance: 'Attended Maddur IPM Field Day (Oct 2026)',
    communicationReminders: 'Next top-dressing reminder on Day 45',
    schemeInformation: 'PM-KISAN & Raitha Siri eligible',
    pendingActions: 'Verify FAW trap count after 7 days',
    problemSummary: 'Early Fall Armyworm (FAW) whorl incidence and mild nitrogen stress at knee-high vegetative stage.',
    solutionSummary: 'Directed whorl spray of Spinetoram 11.7 SC @ 0.5ml/L + 8 pheromone traps/acre + 35kg Urea top-dressing.',
    vleFpoNo: 'VLE-KA-MND-042',
    distanceFromVle: '4.5',
    schedule: [
      {
        id: '1',
        stageName: 'Stage 1: Land Prep & Sowing',
        dayRange: 'Day 0 – Day 15',
        startDay: 0,
        endDay: 15,
        sownDate: 'Day 0 (Sowing)',
        soilPrep: 'Deep summer ploughing (25-30cm), rotavator harrowing with 5 tonnes FYM/acre',
        manuring: 'Basal dose: 50kg DAP + 25kg MOP + 10kg Zinc Sulphate per acre',
        irrigation: 'Light pre-sowing soaking or immediate post-sowing flush irrigation',
        weedingSchedule: 'Atrazine 50% WP @ 1kg/acre within 48 hours of sowing (pre-emergence)',
        sprayingSchedule: 'Chlorantraniliprole 18.5 SC @ 0.4ml/L seed furrows for wireworms',
        maintenanceSchedule: 'Maintain 60cm row-to-row & 20cm plant-to-plant spacing geometry',
        harvestingSchedule: 'Plan drying yard and husking equipment preparation',
        keyProblem: 'Seedling blight, soil wireworms & early weed competition',
        recommendedSolution: 'Seed dressing with Thiram @ 2g/kg seed + Pre-emergence Atrazine 50% WP spray within 48 hrs',
      },
      {
        id: '2',
        stageName: 'Stage 2: Knee-High Vegetative',
        dayRange: 'Day 16 – Day 45',
        startDay: 16,
        endDay: 45,
        sownDate: 'Day 20-25 (Knee High)',
        soilPrep: 'Inter-cultivation with power weeder to loosen soil clods',
        manuring: 'First top dressing: 35kg Urea + 10kg Neem-coated Urea per acre',
        irrigation: 'Critical irrigation stage: Ensure adequate root-zone moisture',
        weedingSchedule: 'Tembotrione 34.4 SC @ 115ml/acre for broadleaf and grass weeds',
        sprayingSchedule: 'Spinetoram 11.7 SC @ 0.5ml/L for Fall Armyworm (FAW) funnel spray',
        maintenanceSchedule: 'Earthing up operation along rows to prevent lodging in monsoon winds',
        harvestingSchedule: 'Monitor cob initiation milestones',
        keyProblem: 'Fall Armyworm (FAW) whorl damage & nitrogen deficiency yellowing',
        recommendedSolution: 'Direct whorl spray of Spinetoram 11.7 SC @ 0.5ml/L + Top dress 35kg Urea/acre',
      },
    ],
    status: 'SUBMITTED',
    submittedAt: '2026-10-18T10:30:00.000Z',
    updatedAt: '2026-10-18T10:30:00.000Z',
  },
  {
    id: 'pop-2026-002',
    userId: 'usr-farmer-02',
    isUserSubmitted: true,
    trackingCode: 'CDF-2026-7391',
    slNo: 'CDF-2026-7391',
    farmerId: 'FRM-KA-2026-2189',
    name: 'Basavaraj S. Patil',
    mobileNumber: '9901245678',
    emailId: 'basavaraj.patil@gmail.com',
    date: '2026-10-19',
    surveyNumber: '88/1B',
    address: 'Main Road, Kundgol Cross, Dharwad',
    pinCode: '581113',
    villagePanchayat: 'Kundgol',
    taluk: 'Kundgol',
    district: 'Dharwad',
    state: 'Karnataka',
    language: 'Kannada',
    jobWorkLocation: 'Survey 88/1B, Kundgol North Block',
    acres: '5.0 Acres',
    soilType: 'Clayey Loam / Alluvial Soil',
    irrigationType: 'Canal / Check-Basin Flood (AWD)',
    waterSource: 'Canal / Borewell',
    cropType: 'Field and commercial crops',
    crop: 'Paddy',
    variety: 'BPT-5204 (Sona Masuri)',
    plantingDate: '2026-09-10',
    cropAge: '40 Days',
    cropAcreage: '5.0 Acres',
    plantCount: '1,30,000 Hills / Acre',
    spacing: '20cm x 15cm',
    currentCropStage: 'Vegetative growth',
    additionalCrops: [],
    cropCycleDays: '130',
    cropStage: 'Vegetative growth',
    mainRequirement: 'Materials / inputs',
    problemType: 'Insect pests',
    solutionType: 'Disease management',
    applicationMethod: 'Basal Granule Broadcast & Canopy Foliar Spray',
    serviceType: 'Wet Cage-Wheel Puddling, Cono-Weeding & Track Combine Harvesting',
    farmMaterial: 'Sprayer',
    equipment: 'Power weeder',
    harvestPlanning: 'Drain Field 10 Days Pre-Harvest; Track Combine Harvest at 20% Moisture',
    packagingType: '60 kg / 75 kg Standard Paddy Gunny Bags',
    visitDate: '2026-10-19',
    advisorName: 'Dr. H. M. Patil',
    visitCropStage: 'Vegetative growth',
    cropObservations: 'Active tillering (18-22 tillers/hill); minor dead-heart symptoms in low-lying patch.',
    visitRecommendations: 'Maintain AWD 3-5cm water level; apply Chlorantraniliprole 18.5 SC @ 0.3ml/L + Hexaconazole 5% EC @ 2ml/L.',
    visitApplicationType: 'Foliar spray',
    farmerFeedback: 'Cono-weeding reduced weed pressure significantly.',
    visitPhotographs: '',
    nextFollowUpDate: '2026-11-05',
    problemFieldPhotos: '',
    problemSymptoms: 'Dead-heart in central shoot and lower sheath water-soaked lesions',
    problemSeverity: 'Low',
    problemActionsTaken: 'Installed pheromone traps and applied Chlorantraniliprole + Hexaconazole spray',
    problemResolved: 'Resolved',
    waterAvailability: 'Adequate / Sufficient',
    irrigationSchedules: 'Alternate Wetting and Drying (AWD) 3-5 cm',
    rainfallAlert: 'Moderate rain expected next week',
    heatAlert: 'Normal (28°C)',
    weatherAlerts: 'Dharwad District: Humid conditions — monitor for BPH at plant base',
    soilTestReport: 'pH 7.2, Clayey Loam, High Organic Carbon, Zinc slightly deficient',
    nutrientRecommendations: 'Basal Zinc Sulphate 10kg/acre + Split Urea + Bio-potash',
    fertilizerHistory: 'Basal 50kg DAP + 10kg ZnSO4; 1st split 30kg Urea',
    nextSoilTestDate: '2027-04-10',
    harvestingDate: '2027-01-18',
    harvestedQuantity: 'Premium',
    sellingPrice: '32',
    marketExpenses: '₹4,500',
    cropWiseReturns: '₹82,000 / Acre expected',
    localMarketPriceInfo: 'Hubballi-Dharwad APMC: ₹30 - ₹34 / kg (Sona Masuri)',
    harvestPicking: 'Track Combine Single Harvest',
    whatsappConsent: 'Yes - Opted In',
    advisoryMessages: 'Subscribed to Paddy Blast & BPH weather alerts',
    trainingAttendance: 'Attended Kundgol FPO Paddy Workshop',
    communicationReminders: 'Panicle initiation top-dressing reminder on Day 55',
    schemeInformation: 'PMFBY Crop Insurance enrolled',
    pendingActions: 'Inspect base of hills for Brown Plant Hopper at Day 50',
    problemSummary: 'Yellow Stem Borer dead-heart symptoms and early Sheath Blight in low-lying bund corners.',
    solutionSummary: 'AWD water regulation + Foliar spray of Chlorantraniliprole 18.5 SC @ 0.3ml/L and Hexaconazole 5% EC @ 2ml/L.',
    vleFpoNo: 'VLE-KA-DWD-019',
    distanceFromVle: '3.0',
    schedule: [
      {
        id: '1',
        stageName: 'Stage 1: Puddling & Transplanting',
        dayRange: 'Day 0 – Day 20',
        startDay: 0,
        endDay: 20,
        sownDate: 'Day 0 (Transplanting)',
        soilPrep: 'Wet puddling with cage wheels (2 passes), level with wooden plank',
        manuring: 'Basal: 50kg DAP + 20kg MOP + 10kg Zinc Sulphate per acre',
        irrigation: 'Maintain thin water layer (2-3 cm) during first 7 days after transplanting',
        weedingSchedule: 'Pretilachlor 50% EC @ 500ml/acre at 3-5 days after transplanting',
        sprayingSchedule: 'Cartap Hydrochloride 4G @ 7.5kg/acre broadcast for stem borer',
        maintenanceSchedule: '2-3 seedlings per hill with 20cm x 15cm geometric spacing',
        harvestingSchedule: 'Log seed variety batch in procurement ledger',
        keyProblem: 'Zinc deficiency (Khaira disease) & early barnyard grass weeds',
        recommendedSolution: 'Apply 10kg Zinc Sulphate/acre basally + Broadcast Pretilachlor 50% EC @ 500ml/acre',
      },
      {
        id: '2',
        stageName: 'Stage 2: Active Tillering',
        dayRange: 'Day 21 – Day 50',
        startDay: 21,
        endDay: 50,
        sownDate: 'Day 25-30 (Tillering)',
        soilPrep: 'Rotary cono-weeder pass to aerate root rhizosphere',
        manuring: 'First split: 30kg Urea + 5kg Bio-potash broadcast',
        irrigation: 'Alternate wetting and drying (AWD) cycle of 3-5 cm standing water',
        weedingSchedule: 'Bispyribac-sodium 10% SC @ 80ml/acre if grasses persist',
        sprayingSchedule: 'Hexaconazole 5% EC @ 2ml/L against sheath blight & brown spot',
        maintenanceSchedule: 'Fill gaps in uneven patches; rogue out wild paddy variants',
        harvestingSchedule: 'Review procurement forward pricing index',
        keyProblem: 'Dead-heart symptoms from Yellow Stem Borer & Sheath Blight',
        recommendedSolution: 'Install 8 pheromone traps/acre + Spray Chlorantraniliprole 18.5 SC @ 0.3ml/L',
      },
    ],
    status: 'VERIFIED',
    submittedAt: '2026-10-19T14:15:00.000Z',
    updatedAt: '2026-10-19T14:15:00.000Z',
  },
  {
    id: 'pop-2026-003',
    userId: 'usr-farmer-test-03',
    isUserSubmitted: true,
    trackingCode: 'CDF-2026-9901',
    slNo: 'CDF-2026-9901',
    farmerId: 'FRM-KA-2026-9901',
    name: 'Manjunath H. Gowda (Test Farmer)',
    mobileNumber: '9741568902',
    emailId: 'manjunath.testfarmer@agrimart.in',
    date: '2026-10-27',
    surveyNumber: '215/4C',
    address: 'No. 12, Kolar-Chikkaballapur Highway, Siddlaghatta Cross',
    pinCode: '562105',
    villagePanchayat: 'Handiganala',
    taluk: 'Sidlaghatta',
    district: 'Chikkaballapur',
    state: 'Karnataka',
    language: 'Kannada / Telugu / English',
    jobWorkLocation: 'Block C, Handiganala Horticultural Belt, Sidlaghatta',
    acres: '4.0 Acres',
    soilType: 'Red Loamy Soil',
    irrigationType: 'Drip Irrigation',
    waterSource: 'Borewell + Farm Pond',
    cropType: 'Vegetables',
    crop: 'Tomato',
    variety: 'Arka Rakshak F1 Triple Disease Resistant',
    plantingDate: '2026-09-15',
    cropAge: '42 Days',
    cropAcreage: '2.5 Acres',
    plantCount: '11,000 Plants / Acre',
    spacing: '90 cm x 45 cm',
    currentCropStage: 'Flowering',
    additionalCrops: [
      {
        id: 'crop-test-2',
        cropType: 'Spices and condiments',
        crop: 'Chilli',
        variety: 'Byadgi Kaddi / Arka Meghana',
        plantingDate: '2026-09-25',
        cropAge: '32 Days',
        cropAcreage: '1.5 Acres',
        plantCount: '14,500 Plants / Acre',
        spacing: '60 cm x 45 cm',
        currentCropStage: 'Vegetative growth',
        surveyNumber: '215/4C',
        lifecycleData: {
          visitDate: '2026-10-27',
          advisorName: 'Dr. Naveen Kumar R.',
          visitCropStage: 'Vegetative growth',
          cropObservations: 'Active branching in Byadgi Chilli; mild upward leaf curl noticed on 4% of plants.',
          visitRecommendations: 'Install blue & yellow sticky traps (20/acre); spray Diafenthiuron 50% WP @ 1g/L for thrips & mites.',
          visitApplicationType: 'Foliar spray',
          farmerFeedback: 'Blue sticky traps are catching thrips effectively.',
          visitPhotographs: '',
          nextFollowUpDate: '2026-11-12',
          problemFieldPhotos: '',
          problemSymptoms: 'Upward boat-shaped curling of young leaves caused by Thrips',
          problemSeverity: 'Low',
          problemActionsTaken: 'Installed 20 blue sticky traps/acre & sprayed Neem Oil 10000 ppm + Diafenthiuron',
          problemResolved: 'Yes - Resolved',
          waterAvailability: 'Adequate (Borewell / Canal)',
          irrigationSchedules: 'Alternate day drip irrigation (40 mins)',
          rainfallAlert: 'Clear skies expected after 48 hours',
          heatAlert: 'Normal (29°C)',
          weatherAlerts: 'Avoid excess nitrogen to prevent succulent growth attracting thrips',
          soilTestReport: 'pH 6.7, Red Loamy, Good drainage, Micronutrient sufficient',
          soilReportFileName: '',
          soilReportFileData: '',
          nutrientRecommendations: 'Apply 12:61:0 (MAP) @ 3kg/acre via drip for strong branching',
          fertilizerHistory: 'Basal FYM + Neem Cake + 1st vegetative fertigation completed',
          nextSoilTestDate: '2027-03-20',
          harvestingDate: '2026-12-10',
          harvestedQuantity: 'Grade A - Export / Retail Quality',
          sellingPrice: '185',
          marketExpenses: '₹3,500',
          cropWiseReturns: '₹1,10,000 / Acre projected',
          localMarketPriceInfo: 'Byadgi / Chickballapur Market: ₹175 - ₹195 / kg',
          harvestPicking: '1st Picking Planned at Day 75',
          whatsappConsent: 'Yes - Subscribed',
          advisoryMessages: 'Chilli leaf curl & thrips alert enabled',
          trainingAttendance: 'Completed Precision Drip Fertigation & IPM Demo (Oct 2026)',
          communicationReminders: 'Micronutrient chelated spray reminder at Day 40',
          schemeInformation: 'Spice Board Quality Improvement Scheme eligible',
          pendingActions: 'Check underside of leaves for yellow mites in 7 days',
          problemSummary: 'Early Thrips incidence causing upward leaf curl in vegetative stage of Chilli.',
          solutionSummary: 'Installed 20 blue sticky traps/acre + Foliar spray of Diafenthiuron 50% WP @ 1g/L and Neem Oil 10000 ppm.',
        },
      },
    ],
    cropCycleDays: '125',
    cropStage: 'Flowering',
    mainRequirement: 'Integrated Pest & Nutrient Management (IPNM)',
    problemType: 'Tuta absoluta (Pinworm) & Early Blight',
    solutionType: 'Biological + Targeted Foliar Spray',
    applicationMethod: 'Foliar Spray & Drip Fertigation',
    serviceType: 'Power Boom Spraying & Staking Support',
    farmMaterial: 'Pheromone Traps & Water Soluble Fertilizers (19:19:19, 13:0:45)',
    equipment: 'Battery Power Sprayer',
    harvestPlanning: 'Multi-Picking Staggered Harvest in 20 kg Plastic Crates',
    packagingType: '20 kg Ventilated Plastic Tomato Crates',
    visitDate: '2026-10-27',
    advisorName: 'Dr. Naveen Kumar R.',
    visitCropStage: 'Flowering',
    cropObservations: 'Vigorous flowering and early fruit set on lower trusses; minor pinworm leaf mining noticed on border rows.',
    visitRecommendations: 'Install 15 Tuta pheromone traps/acre; spray Chlorantraniliprole 18.5 SC @ 0.3ml/L + Azoxystrobin 23% SC @ 1ml/L; fertigate 0:52:34 @ 4kg/acre.',
    visitApplicationType: 'Foliar spray',
    farmerFeedback: 'Drip fertigation schedule improved flower retention significantly.',
    visitPhotographs: '',
    nextFollowUpDate: '2026-11-10',
    problemFieldPhotos: '',
    problemSymptoms: 'Irregular blotch mines on leaves and pinholes on young green calyx',
    problemSeverity: 'Medium',
    problemActionsTaken: 'Installed delta sticky traps with Tuta lures & applied targeted evening spray',
    problemResolved: 'Under Observation',
    waterAvailability: 'Adequate (Borewell / Canal)',
    irrigationSchedules: 'Daily 45 mins drip irrigation + Bi-weekly venturi fertigation',
    rainfallAlert: 'Light evening drizzle forecasted in 48 hours',
    heatAlert: 'Normal (27°C - 30°C)',
    weatherAlerts: 'Chikkaballapur Advisory: Morning dew high — apply preventive fungicide against Early Blight',
    soilTestReport: 'pH 6.6, EC 0.28 dS/m, OC 0.78%, High Available K, Calcium moderate',
    soilReportFileName: '',
    soilReportFileData: '',
    nutrientRecommendations: 'Weekly Calcium Nitrate 5kg/acre + Boron 20% foliar spray @ 1g/L at fruit set',
    fertilizerHistory: 'Basal 2 Tonnes Enriched Vermicompost + Neem Cake 150kg + 19:19:19 Drip Fertigation',
    nextSoilTestDate: '2027-03-20',
    harvestingDate: '2026-11-30',
    harvestedQuantity: 'Grade A - Export / Retail Quality',
    sellingPrice: '38',
    marketExpenses: '₹4,800',
    cropWiseReturns: '₹1,45,000 / Acre projected',
    localMarketPriceInfo: 'Kolar / Chikkaballapur APMC: ₹35 - ₹42 / kg (Crate Rate ₹760)',
    harvestPicking: '1st Picking - Multi-Picking (Every 4 Days)',
    whatsappConsent: 'Yes - Subscribed',
    advisoryMessages: 'Daily mandi price & weather alert active on WhatsApp',
    trainingAttendance: 'Completed Precision Drip Fertigation & IPM Demo (Oct 2026)',
    communicationReminders: 'Calcium Nitrate fertigation reminder in 3 days',
    schemeInformation: 'NHM Mulching & Drip Subsidy Approved',
    pendingActions: 'Monitor Tuta trap catch count after 5 days',
    problemSummary: 'Moderate Tuta absoluta (South American Pinworm) leaf mining and early blight risk due to morning dew at flowering stage.',
    solutionSummary: 'Installed 15 Tuta delta pheromone traps/acre + Foliar spray of Chlorantraniliprole 18.5 SC @ 0.3ml/L & Azoxystrobin 23% SC @ 1ml/L + Calcium-Boron foliar nutrition.',
    cropLifecycleMap: {
      primary: {
        visitDate: '2026-10-27',
        advisorName: 'Dr. Naveen Kumar R.',
        visitCropStage: 'Flowering',
        cropObservations: 'Vigorous flowering and early fruit set on lower trusses; minor pinworm leaf mining noticed on border rows.',
        visitRecommendations: 'Install 15 Tuta pheromone traps/acre; spray Chlorantraniliprole 18.5 SC @ 0.3ml/L + Azoxystrobin 23% SC @ 1ml/L; fertigate 0:52:34 @ 4kg/acre.',
        visitApplicationType: 'Foliar spray',
        farmerFeedback: 'Drip fertigation schedule improved flower retention significantly.',
        visitPhotographs: '',
        nextFollowUpDate: '2026-11-10',
        problemFieldPhotos: '',
        problemSymptoms: 'Irregular blotch mines on leaves and pinholes on young green calyx',
        problemSeverity: 'Medium',
        problemActionsTaken: 'Installed delta sticky traps with Tuta lures & applied targeted evening spray',
        problemResolved: 'Under Observation',
        waterAvailability: 'Adequate (Borewell / Canal)',
        irrigationSchedules: 'Daily 45 mins drip irrigation + Bi-weekly venturi fertigation',
        rainfallAlert: 'Light evening drizzle forecasted in 48 hours',
        heatAlert: 'Normal (27°C - 30°C)',
        weatherAlerts: 'Chikkaballapur Advisory: Morning dew high — apply preventive fungicide against Early Blight',
        soilTestReport: 'pH 6.6, EC 0.28 dS/m, OC 0.78%, High Available K, Calcium moderate',
        soilReportFileName: '',
        soilReportFileData: '',
        nutrientRecommendations: 'Weekly Calcium Nitrate 5kg/acre + Boron 20% foliar spray @ 1g/L at fruit set',
        fertilizerHistory: 'Basal 2 Tonnes Enriched Vermicompost + Neem Cake 150kg + 19:19:19 Drip Fertigation',
        nextSoilTestDate: '2027-03-20',
        harvestingDate: '2026-11-30',
        harvestedQuantity: 'Grade A - Export / Retail Quality',
        sellingPrice: '38',
        marketExpenses: '₹4,800',
        cropWiseReturns: '₹1,45,000 / Acre projected',
        localMarketPriceInfo: 'Kolar / Chikkaballapur APMC: ₹35 - ₹42 / kg (Crate Rate ₹760)',
        harvestPicking: '1st Picking - Multi-Picking (Every 4 Days)',
        whatsappConsent: 'Yes - Subscribed',
        advisoryMessages: 'Daily mandi price & weather alert active on WhatsApp',
        trainingAttendance: 'Completed Precision Drip Fertigation & IPM Demo (Oct 2026)',
        communicationReminders: 'Calcium Nitrate fertigation reminder in 3 days',
        schemeInformation: 'NHM Mulching & Drip Subsidy Approved',
        pendingActions: 'Monitor Tuta trap catch count after 5 days',
        problemSummary: 'Moderate Tuta absoluta (South American Pinworm) leaf mining and early blight risk due to morning dew at flowering stage.',
        solutionSummary: 'Installed 15 Tuta delta pheromone traps/acre + Foliar spray of Chlorantraniliprole 18.5 SC @ 0.3ml/L & Azoxystrobin 23% SC @ 1ml/L + Calcium-Boron foliar nutrition.',
      },
      'crop-test-2': {
        visitDate: '2026-10-27',
        advisorName: 'Dr. Naveen Kumar R.',
        visitCropStage: 'Vegetative growth',
        cropObservations: 'Active branching in Byadgi Chilli; mild upward leaf curl noticed on 4% of plants.',
        visitRecommendations: 'Install blue & yellow sticky traps (20/acre); spray Diafenthiuron 50% WP @ 1g/L for thrips & mites.',
        visitApplicationType: 'Foliar spray',
        farmerFeedback: 'Blue sticky traps are catching thrips effectively.',
        visitPhotographs: '',
        nextFollowUpDate: '2026-11-12',
        problemFieldPhotos: '',
        problemSymptoms: 'Upward boat-shaped curling of young leaves caused by Thrips',
        problemSeverity: 'Low',
        problemActionsTaken: 'Installed 20 blue sticky traps/acre & sprayed Neem Oil 10000 ppm + Diafenthiuron',
        problemResolved: 'Yes - Resolved',
        waterAvailability: 'Adequate (Borewell / Canal)',
        irrigationSchedules: 'Alternate day drip irrigation (40 mins)',
        rainfallAlert: 'Clear skies expected after 48 hours',
        heatAlert: 'Normal (29°C)',
        weatherAlerts: 'Avoid excess nitrogen to prevent succulent growth attracting thrips',
        soilTestReport: 'pH 6.7, Red Loamy, Good drainage, Micronutrient sufficient',
        soilReportFileName: '',
        soilReportFileData: '',
        nutrientRecommendations: 'Apply 12:61:0 (MAP) @ 3kg/acre via drip for strong branching',
        fertilizerHistory: 'Basal FYM + Neem Cake + 1st vegetative fertigation completed',
        nextSoilTestDate: '2027-03-20',
        harvestingDate: '2026-12-10',
        harvestedQuantity: 'Grade A - Export / Retail Quality',
        sellingPrice: '185',
        marketExpenses: '₹3,500',
        cropWiseReturns: '₹1,10,000 / Acre projected',
        localMarketPriceInfo: 'Byadgi / Chickballapur Market: ₹175 - ₹195 / kg',
        harvestPicking: '1st Picking Planned at Day 75',
        whatsappConsent: 'Yes - Subscribed',
        advisoryMessages: 'Chilli leaf curl & thrips alert enabled',
        trainingAttendance: 'Completed Precision Drip Fertigation & IPM Demo (Oct 2026)',
        communicationReminders: 'Micronutrient chelated spray reminder at Day 40',
        schemeInformation: 'Spice Board Quality Improvement Scheme eligible',
        pendingActions: 'Check underside of leaves for yellow mites in 7 days',
        problemSummary: 'Early Thrips incidence causing upward leaf curl in vegetative stage of Chilli.',
        solutionSummary: 'Installed 20 blue sticky traps/acre + Foliar spray of Diafenthiuron 50% WP @ 1g/L and Neem Oil 10000 ppm.',
      },
    },
    vleFpoNo: 'VLE-KA-CKB-088',
    distanceFromVle: '2.5',
    schedule: [
      {
        id: '1',
        stageName: 'Stage 1: Raised Bed Prep, Mulching & Transplanting',
        dayRange: 'Day 0 – Day 20',
        startDay: 0,
        endDay: 20,
        sownDate: 'Day 0 (Transplanting)',
        soilPrep: 'Deep ploughing, raised beds (90cm width) with 25-micron silver-black plastic mulch',
        manuring: 'Basal: 2 Tonnes Vermicompost + 150kg Neem Cake + 50kg DAP + Trichoderma viride',
        irrigation: 'Pre-transplanting drip wetting + Daily 30 mins root establishment drip',
        weedingSchedule: 'Silver-black mulching suppresses 90% weeds; hand-weed inter-bed furrows',
        sprayingSchedule: 'Imidacloprid 17.8 SL @ 0.3ml/L drench/spray at Day 10 for whitefly vectors',
        maintenanceSchedule: 'Gap filling within 7 days; install bamboo/GI wire staking poles',
        harvestingSchedule: 'Register F1 hybrid lot for retail crate procurement',
        keyProblem: 'Damping-off in collar zone & early whitefly transmission of ToLCV',
        recommendedSolution: 'Drench Copper Oxychloride @ 2g/L at root zone + Install 15 yellow sticky traps/acre',
      },
      {
        id: '2',
        stageName: 'Stage 2: Vegetative Branching & Staking',
        dayRange: 'Day 21 – Day 40',
        startDay: 21,
        endDay: 40,
        sownDate: 'Day 25-35 (Vegetative)',
        soilPrep: 'Ensure furrow drainage channels are clear around mulched beds',
        manuring: 'Drip Fertigation: 19:19:19 @ 4kg/acre twice weekly + Humic acid',
        irrigation: 'Daily 40 mins drip cycle based on tensiometer moisture reading',
        weedingSchedule: 'Clean bunds and furrow pathways to eliminate alternate virus hosts',
        sprayingSchedule: 'Abamectin 1.9 EC @ 0.5ml/L + Mancozeb 75% WP @ 2g/L preventive spray',
        maintenanceSchedule: 'First string tying of main stem to overhead GI wire trellis',
        harvestingSchedule: 'Estimate truss density per plant',
        keyProblem: 'Serpentine leaf miner & early bacterial leaf spot',
        recommendedSolution: 'Spray Neem Seed Kernel Extract (NSKE 5%) or Spinosad 45 SC @ 0.3ml/L',
      },
      {
        id: '3',
        stageName: 'Stage 3: Flowering & Fruit Set (Active Stage)',
        dayRange: 'Day 41 – Day 70',
        startDay: 41,
        endDay: 70,
        sownDate: 'Day 42 (Flowering)',
        soilPrep: 'Check emitter discharge uniformity across all drip laterals',
        manuring: 'Fertigate 0:52:34 @ 4kg/acre + Calcium Nitrate 5kg/acre + Boron 20% @ 1g/L spray',
        irrigation: 'Maintain consistent moisture; avoid water stress during flower pollination',
        weedingSchedule: 'Spot weeding along field borders',
        sprayingSchedule: 'Chlorantraniliprole 18.5 SC @ 0.3ml/L + Azoxystrobin 23% SC @ 1ml/L',
        maintenanceSchedule: 'Second level trellising & pruning of lower senescent leaves below 1st truss',
        harvestingSchedule: 'Book 20kg plastic crates for 1st picking at Day 72',
        keyProblem: 'Tuta absoluta (Pinworm), Early Blight & Blossom End Rot (Calcium deficiency)',
        recommendedSolution: '15 Tuta pheromone traps/acre + Chlorantraniliprole 18.5 SC @ 0.3ml/L + Foliar Calcium-Boron',
      },
      {
        id: '4',
        stageName: 'Stage 4: Fruit Development & Multi-Picking Harvest',
        dayRange: 'Day 71 – Day 125',
        startDay: 71,
        endDay: 125,
        sownDate: 'Day 75+ (Harvesting)',
        soilPrep: 'Keep inter-row pathways dry for harvesting crate movement',
        manuring: 'Fertigate 13:0:45 (Potassium Nitrate) @ 5kg/acre for fruit colour & firmness',
        irrigation: 'Regulated drip irrigation after each picking cycle',
        weedingSchedule: 'Maintain clean harvesting lanes',
        sprayingSchedule: 'Use zero-PHI biologicals (Bt / Beauveria) during active picking intervals',
        maintenanceSchedule: 'Grade fruits into Grade-A (50mm+) and Grade-B at farm gate packhouse',
        harvestingSchedule: 'Multi-picking every 4 days at breaker/turning stage in 20kg plastic crates',
        keyProblem: 'Helicoverpa fruit borer & post-harvest bruising',
        recommendedSolution: 'Harvest at breaker stage into smooth plastic crates; use HaNPV @ 250 LE/acre',
      },
    ],
    status: 'VERIFIED',
    submittedAt: '2026-10-27T05:30:00.000Z',
    updatedAt: '2026-10-27T05:30:00.000Z',
  },
];

const DUMMY_SOIL_FILENAMES = new Set([
  'Koppa_Plot142_SoilReport.pdf',
  'Sidlaghatta_Plot215_SoilReport.pdf',
]);

function getSharedDbPaths(): string[] {
  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, 'data', 'dev-database.json'),
    path.resolve(cwd, '..', 'backend', 'data', 'dev-database.json'),
    path.resolve(cwd, '..', 'frontend', 'data', 'dev-database.json'),
    path.resolve(cwd, 'apps', 'backend', 'data', 'dev-database.json'),
    path.resolve(cwd, 'apps', 'frontend', 'data', 'dev-database.json'),
  ];
  return Array.from(new Set(candidates));
}

const globalPopCache = globalThis as unknown as {
  __popLastMtimeMs?: number;
  __popNormalized?: boolean;
  __popSaveTimer?: ReturnType<typeof setTimeout> | null;
};

function syncFromSharedDisk(): any {
  const raw = devDb.getRawData() as any;
  let maxMtime = 0;
  let newestPath: string | null = null;

  for (const dbPath of getSharedDbPaths()) {
    try {
      const stat = fs.statSync(dbPath);
      if (stat.mtimeMs > maxMtime) {
        maxMtime = stat.mtimeMs;
        newestPath = dbPath;
      }
    } catch {
      // ignore missing candidate paths
    }
  }

  if (
    newestPath &&
    maxMtime > (globalPopCache.__popLastMtimeMs || 0)
  ) {
    try {
      const parsed = JSON.parse(fs.readFileSync(newestPath, 'utf-8'));
      if (Array.isArray(parsed.popForms) && parsed.popForms.length > 0) {
        raw.popForms = parsed.popForms;
        globalPopCache.__popNormalized = false;
      }
      if (Array.isArray(parsed.customSoilTypes)) {
        raw.customSoilTypes = parsed.customSoilTypes;
      }
      if (parsed.lastBackendUpdatedPopId) {
        raw.lastBackendUpdatedPopId = parsed.lastBackendUpdatedPopId;
      }
      globalPopCache.__popLastMtimeMs = maxMtime;
    } catch {
      // ignore read error
    }
  }
  return raw;
}

function saveToSharedDisk(): void {
  const raw = devDb.getRawData() as any;
  globalPopCache.__popLastMtimeMs = Date.now() + 2000;
  globalPopCache.__popNormalized = true;
  devDb.save();

  if (globalPopCache.__popSaveTimer) {
    clearTimeout(globalPopCache.__popSaveTimer);
  }
  globalPopCache.__popSaveTimer = setTimeout(async () => {
    for (const dbPath of getSharedDbPaths()) {
      try {
        if (fs.existsSync(dbPath)) {
          const content = await fs.promises.readFile(dbPath, 'utf-8');
          const parsed = JSON.parse(content);
          parsed.popForms = raw.popForms;
          parsed.customSoilTypes = raw.customSoilTypes || [];
          if (raw.lastBackendUpdatedPopId !== undefined) {
            parsed.lastBackendUpdatedPopId = raw.lastBackendUpdatedPopId;
          }
          if (Array.isArray(raw.farmerProfiles)) {
            parsed.farmerProfiles = raw.farmerProfiles;
          }
          await fs.promises.writeFile(dbPath, JSON.stringify(parsed, null, 2), 'utf-8');
        }
      } catch {
        // ignore write errors on non-existent candidate dirs
      }
    }
    globalPopCache.__popLastMtimeMs = Date.now();
  }, 25);
}

function stripDummySoilReports(rec: any): boolean {
  let modified = false;
  if (
    rec.soilReportFileName &&
    DUMMY_SOIL_FILENAMES.has(rec.soilReportFileName) &&
    !rec.soilReportFileData
  ) {
    rec.soilReportFileName = '';
    modified = true;
  }
  if (rec.cropLifecycleMap && typeof rec.cropLifecycleMap === 'object') {
    for (const key of Object.keys(rec.cropLifecycleMap)) {
      const lc = rec.cropLifecycleMap[key];
      if (
        lc &&
        lc.soilReportFileName &&
        DUMMY_SOIL_FILENAMES.has(lc.soilReportFileName) &&
        !lc.soilReportFileData
      ) {
        lc.soilReportFileName = '';
        modified = true;
      }
    }
  }
  if (Array.isArray(rec.additionalCrops)) {
    for (const ac of rec.additionalCrops) {
      if (
        ac &&
        ac.soilReportFileName &&
        DUMMY_SOIL_FILENAMES.has(ac.soilReportFileName) &&
        !ac.soilReportFileData &&
        !ac.lifecycleData?.soilReportFileData
      ) {
        ac.soilReportFileName = '';
        modified = true;
      }
      if (
        ac?.lifecycleData &&
        ac.lifecycleData.soilReportFileName &&
        DUMMY_SOIL_FILENAMES.has(ac.lifecycleData.soilReportFileName) &&
        !ac.lifecycleData.soilReportFileData
      ) {
        ac.lifecycleData.soilReportFileName = '';
        modified = true;
      }
    }
  }
  return modified;
}

function getPopFormsList(): PopSubmissionRecord[] {
  const raw = syncFromSharedDisk();
  if (!raw.popForms || !Array.isArray(raw.popForms)) {
    raw.popForms = [...DEFAULT_POP_FORMS];
    globalPopCache.__popNormalized = true;
    saveToSharedDisk();
  } else if (!globalPopCache.__popNormalized) {
    let changed = false;
    // Ensure any newly added default seed records exist in raw.popForms
    for (const def of DEFAULT_POP_FORMS) {
      if (!raw.popForms.some((r: any) => r.id === def.id || r.trackingCode === def.trackingCode)) {
        raw.popForms.unshift({ ...def });
        changed = true;
      }
    }
    raw.popForms = raw.popForms.map((rec: any) => {
      if (stripDummySoilReports(rec)) {
        changed = true;
      }
      const def = DEFAULT_POP_FORMS.find((d) => d.id === rec.id);
      if (!def) return rec;
      const merged: any = { ...def, ...rec };
      for (const k of Object.keys(def)) {
        if (k === 'soilReportFileName' || k === 'soilReportFileData' || k === 'cropLifecycleMap') {
          continue;
        }
        if ((merged[k] === undefined || merged[k] === '') && (def as any)[k]) {
          merged[k] = (def as any)[k];
          changed = true;
        }
      }
      if (
        Array.isArray(def.additionalCrops) &&
        def.additionalCrops.length > 0 &&
        (!Array.isArray(merged.additionalCrops) || merged.additionalCrops.length === 0)
      ) {
        merged.additionalCrops = def.additionalCrops;
        changed = true;
      } else if (Array.isArray(merged.additionalCrops) && Array.isArray(def.additionalCrops)) {
        merged.additionalCrops = merged.additionalCrops.map((ac: any, acIdx: number) => {
          const defAc = def.additionalCrops?.[acIdx];
          let updatedAc = ac;
          if (defAc && !updatedAc.currentCropStage && defAc.currentCropStage) {
            changed = true;
            updatedAc = { ...updatedAc, currentCropStage: defAc.currentCropStage };
          }
          if (defAc && !updatedAc.surveyNumber && defAc.surveyNumber) {
            changed = true;
            updatedAc = { ...updatedAc, surveyNumber: defAc.surveyNumber };
          }
          return updatedAc;
        });
      }
      if (def.isUserSubmitted && !merged.isUserSubmitted) {
        merged.isUserSubmitted = true;
        changed = true;
      }
      if (def.userId && !merged.userId) {
        merged.userId = def.userId;
        changed = true;
      }
      return merged;
    });
    globalPopCache.__popNormalized = true;
    if (changed) {
      saveToSharedDisk();
    }
  }
  return raw.popForms;
}

const DEFAULT_FARMER_ACCOUNTS: FarmerLoginAccount[] = [
  {
    id: 'usr-farmer-01',
    username: 'ramesh.gowda',
    name: 'Ramesh Kumar Gowda',
    mobile: '9845190812',
    password: 'Ramesh@1042',
    email: 'ramesh.farmer@agrimart.in',
    updatedAt: '2026-10-18T10:00:00.000Z',
  },
  {
    id: 'usr-farmer-test-03',
    username: 'manjunath.gowda',
    name: 'Manjunath H. Gowda',
    mobile: '9741568902',
    password: 'Manjunath@8902',
    email: 'manjunath.testfarmer@agrimart.in',
    updatedAt: '2026-10-20T10:00:00.000Z',
  },
  {
    id: 'usr-farmer-02',
    username: 'basavaraj.patil',
    name: 'Basavaraj S. Patil',
    mobile: '9901245678',
    password: 'Basavaraj@5678',
    email: 'basavaraj.patil@gmail.com',
    updatedAt: '2026-10-15T10:00:00.000Z',
  },
];

function getFarmerLoginAccounts(): FarmerLoginAccount[] {
  const raw = devDb.getRawData() as any;
  if (!raw.farmerLoginAccounts || !Array.isArray(raw.farmerLoginAccounts)) {
    raw.farmerLoginAccounts = [...DEFAULT_FARMER_ACCOUNTS];
    saveToSharedDisk();
  } else {
    let added = false;
    for (const defAcc of DEFAULT_FARMER_ACCOUNTS) {
      const exists = raw.farmerLoginAccounts.some(
        (a: FarmerLoginAccount) => a.mobile === defAcc.mobile || a.id === defAcc.id
      );
      if (!exists) {
        raw.farmerLoginAccounts.push({ ...defAcc });
        added = true;
      }
    }
    if (added) saveToSharedDisk();
  }
  return raw.farmerLoginAccounts;
}

function upsertFarmerLoginAccount(input: {
  id?: string;
  username?: string;
  name?: string;
  mobile?: string;
  password?: string;
  email?: string;
}): FarmerLoginAccount {
  const raw = devDb.getRawData() as any;
  const accounts = getFarmerLoginAccounts();
  const cleanPhone = String(input.mobile || '').replace(/\D/g, '').slice(-10);
  const rawUsername = String(input.username || input.name || cleanPhone || '').trim();
  const lowerUsername = rawUsername.toLowerCase();

  const existingIdx = accounts.findIndex(
    (a) =>
      (input.id && a.id === input.id) ||
      (cleanPhone && a.mobile === cleanPhone) ||
      (lowerUsername && a.username.toLowerCase() === lowerUsername) ||
      (lowerUsername && a.name.toLowerCase() === lowerUsername)
  );

  const now = new Date().toISOString();
  if (existingIdx >= 0) {
    const prev = accounts[existingIdx];
    const updated: FarmerLoginAccount = {
      ...prev,
      username: rawUsername || prev.username,
      name: String(input.name || prev.name || rawUsername).trim(),
      mobile: cleanPhone || prev.mobile,
      password:
        input.password !== undefined && String(input.password).trim() !== ''
          ? String(input.password).trim()
          : prev.password,
      email: input.email !== undefined ? String(input.email).trim() : prev.email,
      updatedAt: now,
    };
    accounts[existingIdx] = updated;
    raw.farmerLoginAccounts = accounts;
    return updated;
  }

  const created: FarmerLoginAccount = {
    id:
      input.id ||
      `usr-${cleanPhone || rawUsername.toLowerCase().replace(/[^a-z0-9]/g, '') || Date.now()}`,
    username: rawUsername || cleanPhone || 'farmer',
    name: String(input.name || rawUsername || `Farmer (${cleanPhone})`).trim(),
    mobile: cleanPhone,
    password: String(input.password || `Farmer@${cleanPhone.slice(-4) || '1234'}`).trim(),
    email: String(input.email || '').trim(),
    updatedAt: now,
  };
  accounts.unshift(created);
  raw.farmerLoginAccounts = accounts;
  return created;
}

function attachAccountPasswordsToRecords(records: PopSubmissionRecord[]): PopSubmissionRecord[] {
  const accounts = getFarmerLoginAccounts();
  return records.map((rec) => {
    const recPhone = (rec.mobileNumber || '').replace(/\D/g, '').slice(-10);
    const recNameLower = (rec.name || '').trim().toLowerCase();
    const matchedAcc = accounts.find(
      (a) =>
        (rec.userId && a.id === rec.userId) ||
        (recPhone && a.mobile === recPhone) ||
        (recNameLower &&
          (a.name.toLowerCase() === recNameLower || a.username.toLowerCase() === recNameLower))
    );
    const defaultUsername =
      rec.loginUsername ||
      matchedAcc?.username ||
      (rec.emailId ? rec.emailId.split('@')[0] : '') ||
      recPhone ||
      rec.name;
    const defaultPassword =
      rec.loginPassword ||
      matchedAcc?.password ||
      `Farmer@${(recPhone || '1234').slice(-4)}`;
    return {
      ...rec,
      loginUsername: defaultUsername,
      loginPassword: defaultPassword,
    };
  });
}

function getCustomSoilTypes(): string[] {
  const raw = devDb.getRawData() as any;
  if (!raw.customSoilTypes || !Array.isArray(raw.customSoilTypes)) {
    raw.customSoilTypes = [];
  }
  return raw.customSoilTypes;
}

function saveCustomSoilType(soilName: string): string[] {
  const cleaned = String(soilName || '').trim();
  if (!cleaned || cleaned.toLowerCase() === 'other') return getCustomSoilTypes();
  const raw = devDb.getRawData() as any;
  const list = getCustomSoilTypes();
  if (!list.some((s) => s.toLowerCase() === cleaned.toLowerCase())) {
    list.unshift(cleaned);
    raw.customSoilTypes = list;
    saveToSharedDisk();
  }
  return list;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('code');
    const forUser = searchParams.get('forUser');
    const userId = (searchParams.get('userId') || '').trim();
    const mobile = (searchParams.get('mobile') || '').replace(/\D/g, '').slice(-10);
    const email = (searchParams.get('email') || '').trim().toLowerCase();
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const crop = searchParams.get('crop');

    let records = attachAccountPasswordsToRecords(getPopFormsList());
    const farmerAccounts = getFarmerLoginAccounts();
    const raw = devDb.getRawData() as any;
    const lastBackendUpdatedId = raw.lastBackendUpdatedPopId || null;
    const lastBackendUpdatedRecord = lastBackendUpdatedId
      ? records.find((r) => r.id === lastBackendUpdatedId) || null
      : null;

    // Check if the logged-in user has filled data earlier
    if (forUser === '1') {
      const username = (searchParams.get('username') || '').trim().toLowerCase();
      if (!userId && !mobile && !email && !username) {
        return NextResponse.json({
          success: true,
          record: null,
          matchedUserRecord: null,
          lastBackendUpdatedId: null,
          lastBackendUpdatedRecord: null,
          customSoilTypes: getCustomSoilTypes(),
          farmerAccounts,
        });
      }

      const found = records.find((r) => {
        if (userId && r.userId && r.userId === userId) return true;
        const recMobile = (r.mobileNumber || '').replace(/\D/g, '').slice(-10);
        if (mobile && recMobile && recMobile === mobile) return true;
        if (email && r.emailId && r.emailId.toLowerCase() === email) return true;
        if (username && username.length >= 3) {
          const recName = (r.name || '').trim().toLowerCase();
          const recLoginUser = (r.loginUsername || '').trim().toLowerCase();
          const recEmailPrefix = (r.emailId || '').trim().toLowerCase().split('@')[0];
          if (recName === username || recLoginUser === username || recEmailPrefix === username) {
            return true;
          }
        }
        return false;
      });

      const globalPopTableEnabled =
        raw.globalPopTableEnabled !== undefined ? Boolean(raw.globalPopTableEnabled) : true;
      const effectiveRecord = found
        ? {
            ...found,
            isPopTableEnabled:
              found.isPopTableEnabled !== undefined
                ? Boolean(found.isPopTableEnabled)
                : globalPopTableEnabled,
          }
        : null;

      return NextResponse.json({
        success: true,
        globalPopTableEnabled,
        record: effectiveRecord,
        matchedUserRecord: found || null,
        lastBackendUpdatedId: found ? found.id : null,
        lastBackendUpdatedRecord: effectiveRecord,
        customSoilTypes: getCustomSoilTypes(),
        farmerAccounts,
      });
    }

    if (id) {
      const found = records.find(
        (r) => r.id === id || r.trackingCode === id || r.slNo === id || r.farmerId === id
      );
      if (!found) {
        return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, record: found, farmerAccounts });
    }

    if (search) {
      records = records.filter(
        (r) =>
          (r.name || '').toLowerCase().includes(search) ||
          (r.mobileNumber || '').toLowerCase().includes(search) ||
          (r.loginUsername || '').toLowerCase().includes(search) ||
          (r.loginPassword || '').toLowerCase().includes(search) ||
          (r.crop || '').toLowerCase().includes(search) ||
          (r.farmerId || '').toLowerCase().includes(search) ||
          (r.trackingCode || '').toLowerCase().includes(search) ||
          (r.villagePanchayat || '').toLowerCase().includes(search) ||
          (r.district || '').toLowerCase().includes(search)
      );
    }

    if (crop && crop !== 'All') {
      records = records.filter((r) => (r.crop || '').toLowerCase() === crop.toLowerCase());
    }

    const globalPopTableEnabled =
      raw.globalPopTableEnabled !== undefined ? Boolean(raw.globalPopTableEnabled) : true;

    return NextResponse.json({
      success: true,
      total: records.length,
      globalPopTableEnabled,
      records,
      farmerAccounts,
      customSoilTypes: getCustomSoilTypes(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Quick endpoint to store a newly entered custom soil type from the 1st row of the Soil Type dropdown
    if (data.action === 'ADD_SOIL_TYPE' && data.soilType) {
      const updatedSoilTypes = saveCustomSoilType(data.soilType);
      return NextResponse.json({
        success: true,
        message: `Saved custom soil type "${data.soilType}" successfully.`,
        customSoilTypes: updatedSoilTypes,
      });
    }

    // Quick endpoint to toggle POP Activity Schedule Table enabled/disabled status
    if (data.action === 'TOGGLE_POP_TABLE') {
      const raw = devDb.getRawData() as any;
      const records = getPopFormsList();
      raw.globalPopTableEnabled = Boolean(data.isPopTableEnabled);
      if (data.recordId) {
        const rIdx = records.findIndex((r) => r.id === data.recordId);
        if (rIdx >= 0) {
          records[rIdx].isPopTableEnabled = Boolean(data.isPopTableEnabled);
        }
      }
      saveToSharedDisk();
      return NextResponse.json({
        success: true,
        globalPopTableEnabled: raw.globalPopTableEnabled,
      });
    }

    // Endpoint to authenticate or register a Farmer Login Account (Phone Number or Username + Password)
    // and store the password so it is visible to the Admin in Backend
    if (data.action === 'AUTH_FARMER_ACCOUNT') {
      const rawIdentifier = String(data.identifier || '').trim();
      const rawPassword = String(data.password || '').trim();
      const submitType = data.submitType === 'signin' ? 'signin' : 'login';
      const rawFullName = String(data.fullName || '').trim();

      if (!rawIdentifier || !rawPassword) {
        return NextResponse.json(
          { success: false, error: 'Phone Number / Username and Password are required.' },
          { status: 400 }
        );
      }

      const digitsOnly = rawIdentifier.replace(/\D/g, '');
      const isPhoneIdentifier =
        digitsOnly.length === 10 && /^\d+$/.test(rawIdentifier.replace(/[\s+-]/g, ''));
      const cleanPhone = isPhoneIdentifier ? digitsOnly.slice(-10) : '';
      const lowerId = rawIdentifier.toLowerCase();

      const accounts = getFarmerLoginAccounts();
      const records = getPopFormsList();

      const matchedAcc = accounts.find(
        (a) =>
          (cleanPhone && a.mobile === cleanPhone) ||
          a.username.toLowerCase() === lowerId ||
          a.name.toLowerCase() === lowerId
      );

      const matchedPop = records.find((r) => {
        const recPhone = (r.mobileNumber || '').replace(/\D/g, '').slice(-10);
        if (cleanPhone && recPhone === cleanPhone) return true;
        if ((r.name || '').trim().toLowerCase() === lowerId) return true;
        if ((r.loginUsername || '').trim().toLowerCase() === lowerId) return true;
        if ((r.emailId || '').trim().toLowerCase().split('@')[0] === lowerId) return true;
        return false;
      });

      if (
        submitType === 'login' &&
        matchedAcc &&
        matchedAcc.password &&
        matchedAcc.password !== rawPassword
      ) {
        return NextResponse.json(
          { success: false, error: 'Invalid password for this Phone Number / Username.' },
          { status: 401 }
        );
      }

      const resolvedName =
        rawFullName ||
        matchedAcc?.name ||
        matchedPop?.name ||
        (isPhoneIdentifier ? `Farmer (${cleanPhone})` : rawIdentifier);
      const resolvedMobile = cleanPhone || matchedAcc?.mobile || matchedPop?.mobileNumber || '';
      const resolvedUsername = isPhoneIdentifier
        ? matchedAcc?.username || matchedPop?.loginUsername || cleanPhone
        : rawIdentifier;

      const savedAccount = upsertFarmerLoginAccount({
        id: matchedAcc?.id || matchedPop?.userId,
        username: resolvedUsername,
        name: resolvedName,
        mobile: resolvedMobile,
        password: rawPassword,
        email: matchedAcc?.email || matchedPop?.emailId || '',
      });

      // Also sync the loginUsername and loginPassword directly onto any matching POP form record
      const raw = devDb.getRawData() as any;
      if (Array.isArray(raw.popForms)) {
        raw.popForms = raw.popForms.map((rec: PopSubmissionRecord) => {
          const recPhone = (rec.mobileNumber || '').replace(/\D/g, '').slice(-10);
          if (
            (savedAccount.id && rec.userId === savedAccount.id) ||
            (resolvedMobile && recPhone === resolvedMobile) ||
            (rec.name || '').trim().toLowerCase() === resolvedName.toLowerCase()
          ) {
            return {
              ...rec,
              userId: rec.userId || savedAccount.id,
              loginUsername: savedAccount.username,
              loginPassword: savedAccount.password,
            };
          }
          return rec;
        });
      }

      saveToSharedDisk();

      return NextResponse.json({
        success: true,
        account: savedAccount,
        farmerAccounts: getFarmerLoginAccounts(),
      });
    }

    const raw = devDb.getRawData() as any;
    const records = getPopFormsList();
    const now = new Date().toISOString();

    if (data.soilType) {
      saveCustomSoilType(data.soilType);
    }

    const existingIdx = records.findIndex(
      (r) =>
        (data.id && r.id === data.id) ||
        (data.userId && r.userId && r.userId === String(data.userId).trim() && r.isUserSubmitted)
    );

    const otherMobiles = records
      .filter((_, idx) => idx !== existingIdx)
      .map((r) => r.mobileNumber)
      .filter(Boolean);

    const phoneValidation = validatePhoneNumber(data.mobileNumber, otherMobiles);
    if (!phoneValidation.valid) {
      return NextResponse.json({ success: false, error: phoneValidation.error }, { status: 400 });
    }

    const emailValidation = validateEmailOptional(data.emailId);
    if (!emailValidation.valid) {
      return NextResponse.json({ success: false, error: emailValidation.error }, { status: 400 });
    }

    const pinValidation = validatePinCode(data.pinCode);
    if (!pinValidation.valid) {
      return NextResponse.json({ success: false, error: pinValidation.error }, { status: 400 });
    }

    const trackingCode =
      data.slNo || data.trackingCode || `CDF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const farmerId = String(data.farmerId || '').trim();

    const syncedAccount = upsertFarmerLoginAccount({
      id: data.userId ? String(data.userId).trim() : undefined,
      username:
        data.loginUsername ||
        (emailValidation.cleaned ? emailValidation.cleaned.split('@')[0] : '') ||
        phoneValidation.cleaned!,
      name: String(data.name || '').trim(),
      mobile: phoneValidation.cleaned!,
      password: data.loginPassword ? String(data.loginPassword).trim() : undefined,
      email: emailValidation.cleaned || '',
    });

    const newRecord: PopSubmissionRecord = {
      id: data.id || `pop-${Date.now()}`,
      userId: data.userId ? String(data.userId).trim() : syncedAccount.id,
      isUserSubmitted: true,
      loginUsername: syncedAccount.username,
      loginPassword: syncedAccount.password,
      trackingCode,
      slNo: trackingCode,
      farmerId,
      name: String(data.name || '').trim(),
      mobileNumber: phoneValidation.cleaned!,
      emailId: emailValidation.cleaned || '',
      date: String(data.date || '').trim(),
      surveyNumber: String(data.surveyNumber || '').trim(),
      address: String(data.address || '').trim(),
      pinCode: pinValidation.cleaned!,
      villagePanchayat: String(data.villagePanchayat || '').trim(),
      taluk: String(data.taluk || '').trim(),
      district: String(data.district || '').trim(),
      state: String(data.state || '').trim(),
      language: String(data.language || '').trim(),
      jobWorkLocation: String(data.jobWorkLocation || '').trim(),
      acres: String(data.acres || '').trim(),
      soilType: String(data.soilType || '').trim(),
      irrigationType: String(data.irrigationType || '').trim(),
      waterSource: String(data.waterSource || '').trim(),
      cropType: String(data.cropType || '').trim(),
      crop: String(data.crop || '').trim(),
      variety: String(data.variety || '').trim(),
      plantingDate: String(data.plantingDate || '').trim(),
      cropAge: String(data.cropAge || '').trim(),
      cropAcreage: String(data.cropAcreage || '').trim(),
      gpsLocation: String(data.gpsLocation || '').trim(),
      gpsLatitude: data.gpsLatitude !== undefined && data.gpsLatitude !== '' ? Number(data.gpsLatitude) : undefined,
      gpsLongitude: data.gpsLongitude !== undefined && data.gpsLongitude !== '' ? Number(data.gpsLongitude) : undefined,
      gpsAccuracy: data.gpsAccuracy !== undefined && data.gpsAccuracy !== '' ? Number(data.gpsAccuracy) : undefined,
      plantCount: String(data.plantCount || '').trim(),
      spacing: String(data.spacing || '').trim(),
      currentCropStage: String(data.currentCropStage || data.cropStage || '').trim(),
      additionalCrops: Array.isArray(data.additionalCrops) ? data.additionalCrops : [],
      cropCycleDays: String(data.cropCycleDays || '').trim(),
      cropStage: String(data.cropStage || '').trim(),
      mainRequirement: String(data.mainRequirement || '').trim(),
      problemType: String(data.problemType || '').trim(),
      solutionType: String(data.solutionType || '').trim(),
      applicationMethod: String(data.applicationMethod || '').trim(),
      serviceType: String(data.serviceType || '').trim(),
      farmMaterial: String(data.farmMaterial || '').trim(),
      equipment: String(data.equipment || '').trim(),
      harvestPlanning: String(data.harvestPlanning || '').trim(),
      packagingType: String(data.packagingType || '').trim(),
      // Tab 2: Farmer Lifecycle fields
      visitDate: String(data.visitDate || '').trim(),
      advisorName: String(data.advisorName || '').trim(),
      visitCropStage: String(data.visitCropStage || '').trim(),
      cropObservations: String(data.cropObservations || '').trim(),
      visitRecommendations: String(data.visitRecommendations || '').trim(),
      visitApplicationType: String(data.visitApplicationType || '').trim(),
      farmerFeedback: String(data.farmerFeedback || '').trim(),
      visitPhotographs: String(data.visitPhotographs || '').trim(),
      nextFollowUpDate: String(data.nextFollowUpDate || '').trim(),
      problemFieldPhotos: String(data.problemFieldPhotos || '').trim(),
      problemSymptoms: String(data.problemSymptoms || '').trim(),
      problemSeverity: String(data.problemSeverity || '').trim(),
      problemActionsTaken: String(data.problemActionsTaken || '').trim(),
      problemResolved: String(data.problemResolved || '').trim(),
      waterAvailability: String(data.waterAvailability || '').trim(),
      irrigationSchedules: String(data.irrigationSchedules || '').trim(),
      rainfallAlert: String(data.rainfallAlert || '').trim(),
      heatAlert: String(data.heatAlert || '').trim(),
      weatherAlerts: String(data.weatherAlerts || '').trim(),
      soilTestReport: String(data.soilTestReport || '').trim(),
      soilReportFileName:
        data.soilReportFileName !== undefined && String(data.soilReportFileName).trim() !== ''
          ? String(data.soilReportFileName).trim()
          : existingIdx >= 0
          ? records[existingIdx].soilReportFileName || ''
          : '',
      soilReportFileData:
        data.soilReportFileData !== undefined && String(data.soilReportFileData).trim() !== ''
          ? String(data.soilReportFileData).trim()
          : existingIdx >= 0
          ? records[existingIdx].soilReportFileData || ''
          : '',
      nutrientRecommendations: String(data.nutrientRecommendations || '').trim(),
      fertilizerHistory: String(data.fertilizerHistory || '').trim(),
      nextSoilTestDate: String(data.nextSoilTestDate || '').trim(),
      harvestingDate: String(data.harvestingDate || '').trim(),
      harvestedQuantity: String(data.harvestedQuantity || '').trim(),
      sellingPrice: String(data.sellingPrice || '').trim(),
      buyerName: String(data.buyerName || '').trim(),
      marketExpenses: String(data.marketExpenses || '').trim(),
      cropWiseReturns: String(data.cropWiseReturns || '').trim(),
      localMarketPriceInfo: String(data.localMarketPriceInfo || '').trim(),
      harvestPicking: String(data.harvestPicking || '').trim(),
      whatsappConsent: String(data.whatsappConsent || '').trim(),
      advisoryMessages: String(data.advisoryMessages || '').trim(),
      trainingAttendance: String(data.trainingAttendance || '').trim(),
      communicationReminders: String(data.communicationReminders || '').trim(),
      schemeInformation: String(data.schemeInformation || '').trim(),
      pendingActions: String(data.pendingActions || '').trim(),
      problemSummary:
        data.problemSummary !== undefined && String(data.problemSummary).trim() !== ''
          ? String(data.problemSummary).trim()
          : existingIdx >= 0
          ? records[existingIdx].problemSummary || ''
          : '',
      solutionSummary:
        data.solutionSummary !== undefined && String(data.solutionSummary).trim() !== ''
          ? String(data.solutionSummary).trim()
          : existingIdx >= 0
          ? records[existingIdx].solutionSummary || ''
          : '',
      cropLifecycleMap:
        data.cropLifecycleMap && typeof data.cropLifecycleMap === 'object'
          ? data.cropLifecycleMap
          : existingIdx >= 0
          ? records[existingIdx].cropLifecycleMap || {}
          : {},
      cropExtraLifecycleStagesMap:
        data.cropExtraLifecycleStagesMap && typeof data.cropExtraLifecycleStagesMap === 'object'
          ? data.cropExtraLifecycleStagesMap
          : existingIdx >= 0
          ? records[existingIdx].cropExtraLifecycleStagesMap || {}
          : {},
      vleFpoNo: String(data.vleFpoNo || '').trim(),
      distanceFromVle: String(data.distanceFromVle || '').trim(),
      schedule: Array.isArray(data.schedule) ? data.schedule : [],
      isPopTableEnabled: data.isPopTableEnabled !== undefined ? Boolean(data.isPopTableEnabled) : true,
      status: data.status || 'SUBMITTED',
      submittedAt: data.submittedAt || now,
      updatedAt: now,
    };

    if (data.isPopTableEnabled !== undefined) {
      raw.globalPopTableEnabled = Boolean(data.isPopTableEnabled);
    }

    if (existingIdx >= 0) {
      records[existingIdx] = {
        ...records[existingIdx],
        ...newRecord,
        id: records[existingIdx].id,
      };
      if (data.fromBackend) {
        raw.lastBackendUpdatedPopId = records[existingIdx].id;
      }
    } else {
      records.unshift(newRecord);
      if (data.fromBackend) {
        raw.lastBackendUpdatedPopId = newRecord.id;
      }
    }
    raw.popForms = records;

    // Also synchronize into Procurement Farmer Profiles so they appear in Active Farmer Profiles too
    if (Array.isArray(raw.farmerProfiles) && newRecord.name) {
      const existingFarmerIdx = raw.farmerProfiles.findIndex(
        (fp: any) =>
          (fp.mobile && fp.mobile.replace(/\D/g, '').slice(-10) === newRecord.mobileNumber.replace(/\D/g, '').slice(-10)) ||
          fp.farmerName?.toLowerCase() === newRecord.name.toLowerCase()
      );
      const numericAcres = parseFloat(newRecord.acres) || 3.5;
      if (existingFarmerIdx >= 0) {
        const currentCrops = Array.isArray(raw.farmerProfiles[existingFarmerIdx].primaryCrops)
          ? raw.farmerProfiles[existingFarmerIdx].primaryCrops
          : [];
        if (!currentCrops.includes(newRecord.crop)) {
          currentCrops.unshift(newRecord.crop);
        }
        raw.farmerProfiles[existingFarmerIdx] = {
          ...raw.farmerProfiles[existingFarmerIdx],
          farmerName: newRecord.name,
          mobile: newRecord.mobileNumber,
          village: newRecord.villagePanchayat || raw.farmerProfiles[existingFarmerIdx].village,
          taluk: newRecord.taluk || raw.farmerProfiles[existingFarmerIdx].taluk,
          district: newRecord.district || raw.farmerProfiles[existingFarmerIdx].district,
          totalAcreage: numericAcres,
          soilType: newRecord.soilType || raw.farmerProfiles[existingFarmerIdx].soilType,
          primaryCrops: currentCrops,
          sowingDate: newRecord.plantingDate || raw.farmerProfiles[existingFarmerIdx].sowingDate,
          expectedHarvestDate: newRecord.harvestingDate || raw.farmerProfiles[existingFarmerIdx].expectedHarvestDate,
          notes: `POP Registered (${newRecord.trackingCode}): ${newRecord.problemType} -> ${newRecord.solutionType}`,
        };
      } else {
        raw.farmerProfiles.unshift({
          id: `fp-${Date.now()}`,
          farmerName: newRecord.name,
          mobile: newRecord.mobileNumber,
          village: newRecord.villagePanchayat || 'Koppa',
          taluk: newRecord.taluk || 'Maddur',
          district: newRecord.district || 'Mandya',
          totalAcreage: numericAcres,
          soilType: newRecord.soilType || 'Red Sandy Loam',
          primaryCrops: [newRecord.crop],
          currentCropStage: 'TILLERING_VEGETATIVE',
          sowingDate: newRecord.plantingDate || now.split('T')[0],
          expectedHarvestDate: newRecord.harvestingDate || '2026-12-30',
          totalSpend: 0,
          successfulOrdersCount: 1,
          assignedAgronomist: 'Dr. Anand Nadagouda',
          notes: `POP Registered (${newRecord.trackingCode}): ${newRecord.problemType} -> ${newRecord.solutionType}`,
        });
      }
    }

    saveToSharedDisk();

    return NextResponse.json({
      success: true,
      message: 'Farmer Data Form & Package of Practice (POP) saved to Procurement Command successfully.',
      trackingCode,
      record: newRecord,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to submit form' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const raw = devDb.getRawData() as any;
    const records = getPopFormsList();
    const now = new Date().toISOString();

    const targetId = body.id || body.trackingCode || body.slNo;
    if (!targetId) {
      return NextResponse.json(
        { success: false, error: 'Record ID is required for update' },
        { status: 400 }
      );
    }

    const idx = records.findIndex(
      (r) => r.id === targetId || r.trackingCode === targetId || r.slNo === targetId
    );
    if (idx < 0) {
      return NextResponse.json(
        { success: false, error: 'Farmer Data Form record not found' },
        { status: 404 }
      );
    }

    if (body.mobileNumber !== undefined) {
      const otherMobiles = records
        .filter((_, i) => i !== idx)
        .map((r) => r.mobileNumber)
        .filter(Boolean);
      const phoneValidation = validatePhoneNumber(body.mobileNumber, otherMobiles);
      if (!phoneValidation.valid) {
        return NextResponse.json({ success: false, error: phoneValidation.error }, { status: 400 });
      }
      body.mobileNumber = phoneValidation.cleaned;
    }

    if (body.emailId !== undefined) {
      const emailValidation = validateEmailOptional(body.emailId);
      if (!emailValidation.valid) {
        return NextResponse.json({ success: false, error: emailValidation.error }, { status: 400 });
      }
      body.emailId = emailValidation.cleaned || '';
    }

    if (body.pinCode !== undefined) {
      const pinValidation = validatePinCode(body.pinCode);
      if (!pinValidation.valid) {
        return NextResponse.json({ success: false, error: pinValidation.error }, { status: 400 });
      }
      body.pinCode = pinValidation.cleaned;
    }

    const updatedFarmerAccount = upsertFarmerLoginAccount({
      id: body.userId || records[idx].userId,
      username:
        body.loginUsername !== undefined
          ? String(body.loginUsername).trim()
          : records[idx].loginUsername || body.mobileNumber || records[idx].mobileNumber,
      name: body.name !== undefined ? String(body.name).trim() : records[idx].name,
      mobile: body.mobileNumber !== undefined ? body.mobileNumber : records[idx].mobileNumber,
      password:
        body.loginPassword !== undefined && String(body.loginPassword).trim() !== ''
          ? String(body.loginPassword).trim()
          : records[idx].loginPassword,
      email: body.emailId !== undefined ? body.emailId : records[idx].emailId,
    });

    records[idx] = {
      ...records[idx],
      ...body,
      isPopTableEnabled:
        body.isPopTableEnabled !== undefined
          ? Boolean(body.isPopTableEnabled)
          : records[idx].isPopTableEnabled !== undefined
          ? records[idx].isPopTableEnabled
          : true,
      loginUsername: updatedFarmerAccount.username,
      loginPassword: updatedFarmerAccount.password,
      isUserSubmitted: true,
      updatedAt: now,
    };

    if (body.isPopTableEnabled !== undefined) {
      raw.globalPopTableEnabled = Boolean(body.isPopTableEnabled);
    }

    raw.popForms = records;
    raw.lastBackendUpdatedPopId = records[idx].id;

    // Also synchronize updated customer details into Procurement Farmer Profiles
    const updatedRec = records[idx];
    if (Array.isArray(raw.farmerProfiles) && updatedRec.name) {
      const existingFarmerIdx = raw.farmerProfiles.findIndex(
        (fp: any) =>
          (fp.mobile &&
            fp.mobile.replace(/\D/g, '').slice(-10) ===
              (updatedRec.mobileNumber || '').replace(/\D/g, '').slice(-10)) ||
          fp.farmerName?.toLowerCase() === updatedRec.name.toLowerCase()
      );
      const numericAcres = parseFloat(updatedRec.acres) || 3.5;
      if (existingFarmerIdx >= 0) {
        const currentCrops = Array.isArray(raw.farmerProfiles[existingFarmerIdx].primaryCrops)
          ? raw.farmerProfiles[existingFarmerIdx].primaryCrops
          : [];
        if (updatedRec.crop && !currentCrops.includes(updatedRec.crop)) {
          currentCrops.unshift(updatedRec.crop);
        }
        raw.farmerProfiles[existingFarmerIdx] = {
          ...raw.farmerProfiles[existingFarmerIdx],
          farmerName: updatedRec.name,
          mobile: updatedRec.mobileNumber,
          village: updatedRec.villagePanchayat || raw.farmerProfiles[existingFarmerIdx].village,
          taluk: updatedRec.taluk || raw.farmerProfiles[existingFarmerIdx].taluk,
          district: updatedRec.district || raw.farmerProfiles[existingFarmerIdx].district,
          totalAcreage: numericAcres,
          soilType: updatedRec.soilType || raw.farmerProfiles[existingFarmerIdx].soilType,
          primaryCrops: currentCrops,
          sowingDate: updatedRec.plantingDate || raw.farmerProfiles[existingFarmerIdx].sowingDate,
          expectedHarvestDate: updatedRec.harvestingDate || raw.farmerProfiles[existingFarmerIdx].expectedHarvestDate,
          notes: `POP Updated (${updatedRec.trackingCode}): ${updatedRec.problemType} -> ${updatedRec.solutionType}`,
        };
      }
    }

    saveToSharedDisk();

    return NextResponse.json({
      success: true,
      record: records[idx],
      message: `Updated POP & Farmer Data Form for "${records[idx].name}" successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update form' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get('id');
    let idsToDelete: string[] = [];

    if (queryId) {
      idsToDelete.push(queryId);
    } else {
      const body = await request.json().catch(() => ({}));
      if (body.id) idsToDelete.push(body.id);
      if (Array.isArray(body.ids)) idsToDelete.push(...body.ids);
    }

    if (idsToDelete.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No form ID provided to delete' },
        { status: 400 }
      );
    }

    const raw = devDb.getRawData() as any;
    const records = getPopFormsList();
    const remaining = records.filter(
      (r) => !idsToDelete.includes(r.id) && !idsToDelete.includes(r.trackingCode)
    );
    const deletedCount = records.length - remaining.length;

    raw.popForms = remaining;
    saveToSharedDisk();

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Deleted ${deletedCount} Farmer Data Form(s) successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete form' },
      { status: 500 }
    );
  }
}
