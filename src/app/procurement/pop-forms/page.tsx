'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { validatePhoneNumber, validateEmailOptional, validatePinCode } from '@/lib/validation';
import {
  Sprout,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  ArrowLeft,
  Phone,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  X,
  ClipboardList,
  ShieldCheck,
  Activity,
  Check,
  Clock,
  Save,
  ChevronDown,
  FileText,
  Download,
  Camera,
} from 'lucide-react';
import CropConfirmationModal from '@/components/crop/CropConfirmationModal';
import { FieldCameraCaptureModal } from '@/components/pop/FieldCameraCaptureModal';
import { CROP_VARIETIES_BY_CATEGORY, ALL_CROP_VARIETIES } from '@/lib/crop-varieties';

export interface PopScheduleStage {
  id: string;
  stageName: string;
  dayRange: string;
  startDay: number;
  endDay: number;
  sownDate: string;
  stageStatus?: 'COMPLETED' | 'CURRENT' | 'UPCOMING';
  isEnabled?: boolean;
  soilPrep: string;
  manuring: string;
  irrigation: string;
  weedingSchedule: string;
  sprayingSchedule: string;
  maintenanceSchedule: string;
  harvestingSchedule: string;
  keyProblem: string;
  recommendedSolution: string;
}

export interface CropLifecycleData {
  visitDate: string;
  advisorName: string;
  visitCropStage: string;
  cropObservations: string;
  visitRecommendations: string;
  visitApplicationType: string;
  farmerFeedback: string;
  visitPhotographs: string;
  nextFollowUpDate: string;
  problemFieldPhotos: string;
  problemSymptoms: string;
  problemSeverity: string;
  problemActionsTaken: string;
  problemResolved: string;
  waterAvailability: string;
  irrigationSchedules: string;
  rainfallAlert: string;
  heatAlert: string;
  weatherAlerts: string;
  soilTestReport: string;
  soilReportFileName: string;
  soilReportFileData: string;
  nutrientRecommendations: string;
  fertilizerHistory: string;
  nextSoilTestDate: string;
  harvestingDate: string;
  harvestedQuantity: string;
  sellingPrice: string;
  buyerName: string;
  marketExpenses: string;
  cropWiseReturns: string;
  localMarketPriceInfo: string;
  harvestPicking: string;
  whatsappConsent: string;
  advisoryMessages: string;
  trainingAttendance: string;
  communicationReminders: string;
  schemeInformation: string;
  pendingActions: string;
  problemSummary: string;
  solutionSummary: string;
}

export interface CropSelectionItem {
  id: string;
  cropType: string;
  crop: string;
  variety: string;
  plantingDate: string;
  cropAge: string;
  cropAcreage: string;
  plantCount: string;
  spacing: string;
  currentCropStage?: string;
  surveyNumber?: string;
  soilReportFileName?: string;
  soilReportFileData?: string;
  lifecycleData?: Partial<CropLifecycleData>;
}

export interface PopSubmissionRecord {
  id: string;
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
  plantCount: string;
  spacing?: string;
  currentCropStage?: string;
  additionalCrops?: CropSelectionItem[];
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
  vleFpoNo?: string;
  distanceFromVle?: string;
  visitDate?: string;
  advisorName?: string;
  visitCropStage?: string;
  cropObservations?: string;
  visitRecommendations?: string;
  visitApplicationType?: string;
  farmerFeedback?: string;
  visitPhotographs?: string;
  nextFollowUpDate?: string;
  problemFieldPhotos?: string;
  problemSymptoms?: string;
  problemSeverity?: string;
  problemActionsTaken?: string;
  problemResolved?: string;
  waterAvailability?: string;
  irrigationSchedules?: string;
  rainfallAlert?: string;
  heatAlert?: string;
  weatherAlerts?: string;
  soilTestReport?: string;
  soilReportFileName?: string;
  soilReportFileData?: string;
  nutrientRecommendations?: string;
  fertilizerHistory?: string;
  nextSoilTestDate?: string;
  harvestingDate?: string;
  harvestedQuantity?: string;
  sellingPrice?: string;
  buyerName?: string;
  marketExpenses?: string;
  cropWiseReturns?: string;
  localMarketPriceInfo?: string;
  harvestPicking?: string;
  whatsappConsent?: string;
  advisoryMessages?: string;
  trainingAttendance?: string;
  communicationReminders?: string;
  schemeInformation?: string;
  pendingActions?: string;
  problemSummary?: string;
  solutionSummary?: string;
  schedule: PopScheduleStage[];
  isPopTableEnabled?: boolean;
  status: 'SUBMITTED' | 'VERIFIED' | 'IN_PROGRESS' | 'COMPLETED';
  submittedAt: string;
  updatedAt: string;
}

const POP_SCHEDULES_BY_CROP: Record<string, { days: number; schedule: PopScheduleStage[] }> = {
  Maize: {
    days: 110,
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
      {
        id: '3',
        stageName: 'Stage 3: Tasseling & Silking',
        dayRange: 'Day 46 – Day 85',
        startDay: 46,
        endDay: 85,
        sownDate: 'Day 50-60 (Tasseling & Silking)',
        soilPrep: 'Clear field borders to prevent pest migration from wild grasses',
        manuring: 'Second top dressing: 35kg Urea + 15kg MOP (Potash for kernel filling)',
        irrigation: 'Most critical moisture period: Maintain continuous field saturation',
        weedingSchedule: 'Spot hand weeding around irrigation furrows',
        sprayingSchedule: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/L against Maydis leaf blight',
        maintenanceSchedule: 'Detasseling of rogue/diseased plants if producing seed maize',
        harvestingSchedule: 'Coordinate combine harvester booking at nearest VLE hub',
        keyProblem: 'Moisture stress poor pollination & Turcicum / Maydis leaf blight',
        recommendedSolution: 'Uninterrupted irrigation during silking + Foliar spray of Azoxystrobin + Difenoconazole @ 1ml/L',
      },
      {
        id: '4',
        stageName: 'Stage 4: Physiological Maturity & Harvest',
        dayRange: 'Day 86 – Day 110',
        startDay: 86,
        endDay: 110,
        sownDate: 'Day 95-110 (Maturity)',
        soilPrep: 'Field drying preparation; stop all intercultural machinery passes',
        manuring: 'No chemical fertilizers. Optional micronutrient spray on late greens',
        irrigation: 'Withhold irrigation 10-12 days before scheduled harvest',
        weedingSchedule: 'Nil',
        sprayingSchedule: 'Nil (observe pre-harvest pesticide withholding interval)',
        maintenanceSchedule: 'Check black layer formation at kernel base for physiological maturity',
        harvestingSchedule: 'Mechanical combine harvesting at 15-18% grain moisture. Sun dry to 12%',
        keyProblem: 'Cob rot due to unseasonal rain & post-harvest aflatoxin moisture',
        recommendedSolution: 'Harvest immediately upon black layer formation using Combine Harvester; sun-dry kernels to 12% moisture',
      },
    ],
  },
  Paddy: {
    days: 130,
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
        recommendedSolution: 'Install 8 pheromone traps/acre + Spray Chlorantraniliprole 18.5 SC @ 0.3ml/L + Hexaconazole 5% EC @ 2ml/L',
      },
      {
        id: '3',
        stageName: 'Stage 3: Panicle Initiation & Booting',
        dayRange: 'Day 51 – Day 95',
        startDay: 51,
        endDay: 95,
        sownDate: 'Day 55-65 (Panicle Initiation)',
        soilPrep: 'Check bund integrity and water inlet/outlet drainage',
        manuring: 'Second split: 25kg Urea + 15kg MOP per acre',
        irrigation: 'Maintain uniform 5cm standing water without drying until milk stage',
        weedingSchedule: 'Manual rogueing of tall weeds overtopping paddy canopy',
        sprayingSchedule: 'Trifloxystrobin 25% + Tebuconazole 50% WG @ 0.4g/L for neck blast immunity',
        maintenanceSchedule: 'Install pheromone traps for yellow stem borer monitoring',
        harvestingSchedule: 'Schedule paddy reaper booking with local Agri-Mart service center',
        keyProblem: 'Neck Blast infection & Brown Plant Hopper (BPH) hopperburn at base',
        recommendedSolution: 'Part canopy and spray Pymetrozine 50% WG @ 0.6g/L at plant base + Tricyclazole 75% WP @ 0.6g/L',
      },
      {
        id: '4',
        stageName: 'Stage 4: Ripening & Harvesting',
        dayRange: 'Day 96 – Day 130',
        startDay: 96,
        endDay: 130,
        sownDate: 'Day 115-130 (Harvesting)',
        soilPrep: 'Drain all standing water 10 days before harvest for ground firmness',
        manuring: 'Nil',
        irrigation: 'Completely drained for dry mechanized movement',
        weedingSchedule: 'Nil',
        sprayingSchedule: 'Nil',
        maintenanceSchedule: 'Harvest when 85-90% panicles turn golden yellow with grain moisture ~20%',
        harvestingSchedule: 'Harvest using track combine harvester; thresh, clean, and bag at 14% moisture',
        keyProblem: 'Grain shattering & lodging if over-matured in standing water',
        recommendedSolution: 'Drain water completely 10 days prior to harvest; harvest with Track Combine at 85% golden panicle stage',
      },
    ],
  },
  Tomato: {
    days: 120,
    schedule: [
      {
        id: '1',
        stageName: 'Stage 1: Raised Beds & Transplanting',
        dayRange: 'Day 0 – Day 18',
        startDay: 0,
        endDay: 18,
        sownDate: 'Day 0 (Transplanting)',
        soilPrep: 'Raised beds (90cm width) with silver-black mulch and drip tape',
        manuring: 'Basal: 10 tonnes compost + 50kg 19:19:19 + 25kg Neem cake per acre',
        irrigation: 'Drip fertigation for 45 minutes pre-wetting beds before planting',
        weedingSchedule: 'Plastic mulch prevents 95% weed growth in beds',
        sprayingSchedule: 'Drenching with Trichoderma viride & Pseudomonas @ 10g/L around roots',
        maintenanceSchedule: 'Staking with bamboo poles and GI wire trellis system',
        harvestingSchedule: 'Prepare plastic harvest crates (Agri-Mart standard 20kg crates)',
        keyProblem: 'Damping-off / collar rot & early whitefly leaf curl virus vector',
        recommendedSolution: 'Root zone drenching with Trichoderma viride @ 10g/L + Install 15 yellow/blue sticky traps/acre',
      },
      {
        id: '2',
        stageName: 'Stage 2: Vegetative Growth & Staking',
        dayRange: 'Day 19 – Day 42',
        startDay: 19,
        endDay: 42,
        sownDate: 'Day 20-30 (Vegetative & Staking)',
        soilPrep: 'Clear furrow aisles using battery-operated mini weeder',
        manuring: 'Fertigate 12:61:00 (MAP) @ 3kg/acre twice a week through venturi',
        irrigation: 'Daily drip irrigation 4-6 liters per plant based on tensiometer',
        weedingSchedule: 'Manual aisle cleaning between plastic mulch strips',
        sprayingSchedule: 'Cyantraniliprole 10.26 OD @ 1.8ml/L for leaf miner & whitefly control',
        maintenanceSchedule: 'Pruning of ground suckers; tying main stems to trellis wires',
        harvestingSchedule: 'Verify cold storage transit availability at dark warehouse',
        keyProblem: 'Serpentine leaf miner, thrips & lower leaf early blight spots',
        recommendedSolution: 'Spray Cyantraniliprole 10.26 OD @ 1.8ml/L + Prune lower 15cm side suckers',
      },
      {
        id: '3',
        stageName: 'Stage 3: Flowering & Fruit Setting',
        dayRange: 'Day 43 – Day 74',
        startDay: 43,
        endDay: 74,
        sownDate: 'Day 45-60 (Flowering & Fruit Set)',
        soilPrep: 'Earthing up soil along mulch edges to secure wind resistance',
        manuring: 'Fertigate 13:00:45 (Potassium Nitrate) + Calcium Nitrate @ 4kg/acre',
        irrigation: 'Consistent drip cycles to prevent blossom end rot (BER)',
        weedingSchedule: 'Nil',
        sprayingSchedule: 'Fame (Flubendiamide) @ 0.3ml/L against tomato fruit borer',
        maintenanceSchedule: 'Vibrate trellis wires lightly in mornings to enhance self-pollination',
        harvestingSchedule: 'First selective picking of breaker stage fruits for distant transit',
        keyProblem: 'Blossom End Rot (Calcium deficiency), flower drop & Fruit Borer',
        recommendedSolution: 'Drip fertigate Calcium Nitrate @ 4kg/acre + Foliar Boron 20% @ 1g/L + Spray Flubendiamide @ 0.3ml/L',
      },
      {
        id: '4',
        stageName: 'Stage 4: Peak Harvest & Grading',
        dayRange: 'Day 75 – Day 120',
        startDay: 75,
        endDay: 120,
        sownDate: 'Day 75-120 (Peak Harvest Phase)',
        soilPrep: 'Maintain aisle pathways clean and dry for picking carts',
        manuring: '0:0:50 (SOP) + Boron @ 2kg/acre weekly to sustain fruit firmness',
        irrigation: 'Regulated drip cycles after every harvest pick',
        weedingSchedule: 'Nil',
        sprayingSchedule: 'Neem oil 10,000 ppm @ 3ml/L (bio-safe for continuous picking)',
        maintenanceSchedule: 'Pick every 3-4 days in cool early morning or late afternoon hours',
        harvestingSchedule: 'Grade into A/B/C quality sizes, pack in ventilated crates, ship to Agri-Mart hub',
        keyProblem: 'Fruit cracking, Tuta absoluta pinworm & post-harvest bruising',
        recommendedSolution: 'Weekly 0:0:50 SOP fertigation + Bio-safe Azadirachtin 10,000 ppm @ 3ml/L + Grade into 20kg crates',
      },
    ],
  },
};

const KARNATAKA_DISTRICTS = [
  'Bagalkot',
  'Ballari (Bellary)',
  'Belagavi (Belgaum)',
  'Bengaluru Rural',
  'Bengaluru Urban',
  'Bidar',
  'Chamarajanagar',
  'Chikkaballapur',
  'Chikkamagaluru',
  'Chitradurga',
  'Dakshina Kannada',
  'Davanagere',
  'Dharwad',
  'Gadag',
  'Hassan',
  'Haveri',
  'Kalaburagi (Gulbarga)',
  'Kodagu',
  'Kolar',
  'Koppal',
  'Mandya',
  'Mysuru (Mysore)',
  'Raichur',
  'Ramanagara',
  'Shivamogga (Shimoga)',
  'Tumakuru (Tumkur)',
  'Udupi',
  'Uttara Kannada',
  'Vijayanagara',
  'Yadgir',
];

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

const STATE_DISTRICTS_MAP: Record<string, string[]> = {
  'Andhra Pradesh': [
    'Alluri Sitharama Raju', 'Anakapalli', 'Anantapuramu', 'Annamayya', 'Bapatla', 'Chittoor',
    'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Krishna',
    'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam', 'Prakasam',
    'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Srikakulam', 'Tirupati', 'Visakhapatnam',
    'Vizianagaram', 'West Godavari', 'YSR Kadapa',
  ],
  'Karnataka': KARNATAKA_DISTRICTS,
  'Kerala': [
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode',
    'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad',
  ],
  'Maharashtra': [
    'Ahmednagar', 'Akola', 'Amravati', 'Chhatrapati Sambhajinagar (Aurangabad)', 'Beed', 'Bhandara',
    'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna',
    'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar',
    'Nashik', 'Dharashiv (Osmanabad)', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri',
    'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal',
  ],
  'Tamil Nadu': [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
    'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai',
    'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
    'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni',
    'Thoothukudi (Tuticorin)', 'Tiruchirappalli', 'Tirunelveli', 'Tirupattur', 'Tiruppur',
    'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar',
  ],
  'Telangana': [
    'Adilabad', 'Bhadradri Kothagudem', 'Hanamkonda', 'Hyderabad', 'Jagtial', 'Jangaon',
    'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam',
    'Komaram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak',
    'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal',
    'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet',
    'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri',
  ],
};

const BASE_SOIL_TYPES = [
  'Red soil',
  'Red sandy soil',
  'Sandy loam',
  'Loamy soil',
  'Clay soil',
  'Black soil',
  'Gravelly soil',
];

const BASE_IRRIGATION_TYPES = [
  'Drip irrigation',
  'Sprinkler',
  'Flood/Furrow irrigation',
  'Rainfed',
];

const BASE_CROP_TYPES = [
  'Fruit crops',
  'Flower crops',
  'Vegetable crops',
  'Field and commercial crops',
];

const BASE_CROPS = [
  'Pomegranate',
  'Grapes',
  'Mango',
  'Guava',
  'Sapota',
  'Papaya',
  'Banana',
  'Dragon fruit',
  'Rose',
  'Chrysanthemum',
  'Marigold',
  'Tomato',
  'Chilli',
  'Capsicum',
  'Brinjal',
  'Beans',
  'Groundnut',
  'Ridge gourd',
  'Snake gourd',
  'Bottle gourd',
  'Bitter gourd',
  'Cabbage',
  'Cauliflower',
  'Leafy vegetables',
  'Maize',
  'Paddy',
  'Ragi / Finger millet',
];

const BASE_CROP_STAGES = [
  'Land preparation',
  'Nursery',
  'Planting / establishment',
  'Germination',
  'Transplanting',
  'Vegetative growth',
  'Bud initiation',
  'Flowering',
  'Fruit setting',
  'Fruit development',
  'Fruit maturation',
  'Veraison / colour development',
  'Grain filling',
  'Tasseling and silking',
  'Pod setting',
  'Pod development',
  'Harvesting',
  'Post-harvest',
  'Dormancy',
  'Pruning',
  'Bud break',
  'Shoot growth',
  'Physiological maturity',
];

const BASE_PROBLEM_TYPES = [
  'Insect pests',
  'Diseases',
  'Nutrient problems',
  'Plant growth',
  'Soil problems',
  'Water problems',
  'Weed problems',
  'Quality problems',
];

const BASE_SOLUTION_TYPES = [
  'Crop advisory',
  'Insect pest management',
  'Disease management',
  'Nutrient management',
  'Soil improvement',
  'Irrigation and water management',
  'Weed management',
  'Flowering and fruit-setting management',
  'Fruit quality improvement',
  'Harvest and post-harvest management',
  'Preventive management',
  'Integrated Pest Management (IPM)',
  'Soil and water testing',
];

const BASE_MAIN_REQUIREMENTS = [
  'Advisory',
  'Advisory with field visit',
  'Machinery',
  'Materials / inputs',
  'Testing and diagnosis',
  'Field visits and other services',
];

const BASE_EQUIPMENT_OPTIONS = [
  'Tractor',
  'Rotavator',
  'Cultivator',
  'Sprayer',
  'Power weeder',
  'Tiller',
  'Seeder',
  'Pruning tools',
  'Harvesting equipment',
  'Eart agar',
  'Planter',
  'Fertigation equipment',
  'Drip installation tools',
  'Crates',
  'Weed mat',
  'Shade net',
  'Sprayer parts',
  'Spray gun',
  'Dripping material',
  'Pond sheet',
  'Mulching sheet',
  'Sickle',
];

const BASE_MATERIAL_OPTIONS = [
  'Weed mat',
  'Shade net',
  'Sprayer parts',
  'Spray gun',
  'Dripping material',
  'Pond sheet',
  'Mulching sheet',
  'Sickle',
  'Tractor',
  'Rotavator',
  'Cultivator',
  'Sprayer',
  'Power weeder',
  'Tiller',
  'Seeder',
  'Pruning tools',
  'Harvesting equipment',
  'Eart agar',
  'Planter',
  'Fertigation equipment',
  'Drip installation tools',
  'Crates',
];

const BASE_APPLICATION_TYPES = [
  'Soil application',
  'Basal application',
  'Drip / fertigation',
  'Foliar spray',
  'Seed treatment',
  'Seedling / root dip',
  'Drenching',
  'Broadcasting',
  'Spot application',
  'Bait / trap application',
  'Mechanical application',
  'No physical application — advisory only',
];

const BASE_HARVEST_QUALITY_OPTIONS = [
  'Good',
  'Medium',
  'Medium to Low',
  'Poor quality',
  'Premium',
];

const CROP_OPTIONS = BASE_CROPS;

const LIFECYCLE_FIELD_KEYS: (keyof CropLifecycleData)[] = [
  'visitDate',
  'advisorName',
  'visitCropStage',
  'cropObservations',
  'visitRecommendations',
  'visitApplicationType',
  'farmerFeedback',
  'visitPhotographs',
  'nextFollowUpDate',
  'problemFieldPhotos',
  'problemSymptoms',
  'problemSeverity',
  'problemActionsTaken',
  'problemResolved',
  'waterAvailability',
  'irrigationSchedules',
  'rainfallAlert',
  'heatAlert',
  'weatherAlerts',
  'soilTestReport',
  'soilReportFileName',
  'soilReportFileData',
  'nutrientRecommendations',
  'fertilizerHistory',
  'nextSoilTestDate',
  'harvestingDate',
  'harvestedQuantity',
  'sellingPrice',
  'buyerName',
  'marketExpenses',
  'cropWiseReturns',
  'localMarketPriceInfo',
  'harvestPicking',
  'whatsappConsent',
  'advisoryMessages',
  'trainingAttendance',
  'communicationReminders',
  'schemeInformation',
  'pendingActions',
  'problemSummary',
  'solutionSummary',
];

const EMPTY_LIFECYCLE_DATA: CropLifecycleData = {
  visitDate: '',
  advisorName: '',
  visitCropStage: '',
  cropObservations: '',
  visitRecommendations: '',
  visitApplicationType: '',
  farmerFeedback: '',
  visitPhotographs: '',
  nextFollowUpDate: '',
  problemFieldPhotos: '',
  problemSymptoms: '',
  problemSeverity: '',
  problemActionsTaken: '',
  problemResolved: '',
  waterAvailability: '',
  irrigationSchedules: '',
  rainfallAlert: '',
  heatAlert: '',
  weatherAlerts: '',
  soilTestReport: '',
  soilReportFileName: '',
  soilReportFileData: '',
  nutrientRecommendations: '',
  fertilizerHistory: '',
  nextSoilTestDate: '',
  harvestingDate: '',
  harvestedQuantity: '',
  sellingPrice: '',
  buyerName: '',
  marketExpenses: '',
  cropWiseReturns: '',
  localMarketPriceInfo: '',
  harvestPicking: '',
  whatsappConsent: '',
  advisoryMessages: '',
  trainingAttendance: '',
  communicationReminders: '',
  schemeInformation: '',
  pendingActions: '',
  problemSummary: '',
  solutionSummary: '',
};

// Empty Form State for "+ Add New Farmer" (all entered details empty so user can enter them)
const EMPTY_RECORD: Omit<PopSubmissionRecord, 'id' | 'submittedAt' | 'updatedAt'> = {
  loginUsername: '',
  loginPassword: '',
  trackingCode: '',
  slNo: '',
  farmerId: '',
  name: '',
  mobileNumber: '',
  emailId: '',
  date: '',
  surveyNumber: '',
  address: '',
  pinCode: '',
  villagePanchayat: '',
  taluk: '',
  district: '',
  state: '',
  language: '',
  jobWorkLocation: '',
  acres: '',
  soilType: '',
  irrigationType: '',
  waterSource: '',
  cropType: '',
  crop: '',
  variety: '',
  plantingDate: '',
  cropAge: '',
  cropAcreage: '',
  plantCount: '',
  spacing: '',
  currentCropStage: '',
  additionalCrops: [],
  cropCycleDays: '',
  cropStage: '',
  mainRequirement: '',
  problemType: '',
  solutionType: '',
  applicationMethod: '',
  serviceType: '',
  farmMaterial: '',
  equipment: '',
  harvestPlanning: '',
  packagingType: '',
  vleFpoNo: '',
  distanceFromVle: '',
  visitDate: '',
  advisorName: '',
  visitCropStage: '',
  cropObservations: '',
  visitRecommendations: '',
  visitApplicationType: '',
  farmerFeedback: '',
  visitPhotographs: '',
  nextFollowUpDate: '',
  problemFieldPhotos: '',
  problemSymptoms: '',
  problemSeverity: '',
  problemActionsTaken: '',
  problemResolved: '',
  waterAvailability: '',
  irrigationSchedules: '',
  rainfallAlert: '',
  heatAlert: '',
  weatherAlerts: '',
  soilTestReport: '',
  soilReportFileName: '',
  soilReportFileData: '',
  nutrientRecommendations: '',
  fertilizerHistory: '',
  nextSoilTestDate: '',
  harvestingDate: '',
  harvestedQuantity: '',
  sellingPrice: '',
  buyerName: '',
  marketExpenses: '',
  cropWiseReturns: '',
  localMarketPriceInfo: '',
  harvestPicking: '',
  whatsappConsent: '',
  advisoryMessages: '',
  trainingAttendance: '',
  communicationReminders: '',
  schemeInformation: '',
  pendingActions: '',
  problemSummary: '',
  solutionSummary: '',
  schedule: POP_SCHEDULES_BY_CROP.Maize.schedule,
  isPopTableEnabled: true,
  status: 'SUBMITTED',
};

const globalPopClientCache = globalThis as unknown as {
  __popRecordsCache?: PopSubmissionRecord[];
};

export default function ProcurementPopFormsPage() {
  const [records, setRecords] = useState<PopSubmissionRecord[]>(
    () => globalPopClientCache.__popRecordsCache || []
  );
  const [farmerAccounts, setFarmerAccounts] = useState<
    Array<{
      id: string;
      username: string;
      name: string;
      mobile: string;
      password: string;
      email?: string;
      updatedAt: string;
    }>
  >([]);
  const [loading, setLoading] = useState<boolean>(
    () => !(globalPopClientCache.__popRecordsCache && globalPopClientCache.__popRecordsCache.length > 0)
  );
  const [saving, setSaving] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCrop, setFilterCrop] = useState('All');

  // Unified Full Form Modal: 'VIEW' | 'EDIT' | 'CREATE' | null
  const [modalMode, setModalMode] = useState<'VIEW' | 'EDIT' | 'CREATE' | null>(null);
  const [modalTab, setModalTab] = useState<'form' | 'lifecycle'>('form');
  const [activeRecord, setActiveRecord] = useState<PopSubmissionRecord | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_RECORD });

  // Custom Dropdown States & Refs inside Modal
  const [isSoilDropdownOpen, setIsSoilDropdownOpen] = useState(false);
  const [customSoilText, setCustomSoilText] = useState('');
  const soilDropdownRef = useRef<HTMLDivElement>(null);

  const [isIrrigationDropdownOpen, setIsIrrigationDropdownOpen] = useState(false);
  const [customIrrigationText, setCustomIrrigationText] = useState('');
  const irrigationDropdownRef = useRef<HTMLDivElement>(null);

  const [isCropTypeDropdownOpen, setIsCropTypeDropdownOpen] = useState(false);
  const [customCropTypeText, setCustomCropTypeText] = useState('');
  const cropTypeDropdownRef = useRef<HTMLDivElement>(null);

  const [isCropDropdownOpen, setIsCropDropdownOpen] = useState(false);
  const [customCropText, setCustomCropText] = useState('');
  const cropDropdownRef = useRef<HTMLDivElement>(null);

  const [isVarietyDropdownOpen, setIsVarietyDropdownOpen] = useState(false);
  const [customVarietyText, setCustomVarietyText] = useState('');
  const varietyDropdownRef = useRef<HTMLDivElement>(null);
  const [extraVarietyOpenId, setExtraVarietyOpenId] = useState<string | null>(null);
  const [extraVarietyInputs, setExtraVarietyInputs] = useState<Record<string, string>>({});

  const [isCurrentCropStageDropdownOpen, setIsCurrentCropStageDropdownOpen] = useState(false);
  const [customCurrentCropStageText, setCustomCurrentCropStageText] = useState('');
  const currentCropStageDropdownRef = useRef<HTMLDivElement>(null);

  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [customStateText, setCustomStateText] = useState('');
  const stateDropdownRef = useRef<HTMLDivElement>(null);

  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [customDistrictText, setCustomDistrictText] = useState('');
  const districtDropdownRef = useRef<HTMLDivElement>(null);

  const [isCropStageDropdownOpen, setIsCropStageDropdownOpen] = useState(false);
  const [customCropStageText, setCustomCropStageText] = useState('');
  const cropStageDropdownRef = useRef<HTMLDivElement>(null);

  const [isMainRequirementDropdownOpen, setIsMainRequirementDropdownOpen] = useState(false);
  const [customMainRequirementText, setCustomMainRequirementText] = useState('');
  const mainRequirementDropdownRef = useRef<HTMLDivElement>(null);

  const [isProblemTypeDropdownOpen, setIsProblemTypeDropdownOpen] = useState(false);
  const [customProblemTypeText, setCustomProblemTypeText] = useState('');
  const problemTypeDropdownRef = useRef<HTMLDivElement>(null);

  const [isSolutionTypeDropdownOpen, setIsSolutionTypeDropdownOpen] = useState(false);
  const [customSolutionTypeText, setCustomSolutionTypeText] = useState('');
  const solutionTypeDropdownRef = useRef<HTMLDivElement>(null);

  // Yes/No + Dropdown states for Materials Required & Equipment Required
  const [materialRequiredChoice, setMaterialRequiredChoice] = useState<'Yes' | 'No'>('Yes');
  const [isMaterialDropdownOpen, setIsMaterialDropdownOpen] = useState(false);
  const [customMaterialText, setCustomMaterialText] = useState('');
  const materialDropdownRef = useRef<HTMLDivElement>(null);

  const [equipmentRequiredChoice, setEquipmentRequiredChoice] = useState<'Yes' | 'No'>('Yes');
  const [isEquipmentDropdownOpen, setIsEquipmentDropdownOpen] = useState(false);
  const [customEquipmentText, setCustomEquipmentText] = useState('');
  const equipmentDropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown states inside Tab 2: Farmer Lifecycle
  const [isVisitCropStageDropdownOpen, setIsVisitCropStageDropdownOpen] = useState(false);
  const [customVisitCropStageText, setCustomVisitCropStageText] = useState('');
  const visitCropStageDropdownRef = useRef<HTMLDivElement>(null);

  const [isVisitAppTypeDropdownOpen, setIsVisitAppTypeDropdownOpen] = useState(false);
  const [customVisitAppTypeText, setCustomVisitAppTypeText] = useState('');
  const visitAppTypeDropdownRef = useRef<HTMLDivElement>(null);

  const [isHarvestQtyDropdownOpen, setIsHarvestQtyDropdownOpen] = useState(false);
  const [customHarvestQtyText, setCustomHarvestQtyText] = useState('');
  const harvestQtyDropdownRef = useRef<HTMLDivElement>(null);

  // Per-Crop Lifecycle Switcher
  const [selectedLifecycleCropId, setSelectedLifecycleCropId] = useState<string>('primary');
  const [cropLifecycleMap, setCropLifecycleMap] = useState<Record<string, CropLifecycleData>>({});
  const [cropExtraLifecycleStagesMap, setCropExtraLifecycleStagesMap] = useState<
    Record<string, CropLifecycleData[]>
  >({});

  // Field Camera Modal State for photographing crops and saving to DB
  const [cameraModalConfig, setCameraModalConfig] = useState<{
    isOpen: boolean;
    sectionId: string;
    sectionName: string;
    targetFieldName: string;
  }>({
    isOpen: false,
    sectionId: 'farmer-visit-photographs',
    sectionName: 'Farmer Visit Photographs',
    targetFieldName: 'visitPhotographs',
  });

  const handleOpenCameraModal = (
    sectionId: string,
    sectionName: string,
    targetFieldName: string
  ) => {
    setCameraModalConfig({
      isOpen: true,
      sectionId,
      sectionName,
      targetFieldName,
    });
  };

  const handlePhotoSavedFromModal = ({
    fileName,
    url,
  }: {
    fileName: string;
    url: string;
  }) => {
    setFormData((prev: any) => {
      const currentVal = String(prev[cameraModalConfig.targetFieldName] || '');
      const existing = currentVal
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
      const updatedList = existing.includes(fileName) ? existing : [...existing, fileName];
      const clamped = updatedList.slice(0, 5);
      return {
        ...prev,
        [cameraModalConfig.targetFieldName]: clamped.join(', '),
      };
    });

    setCropLifecycleMap((prev) => {
      const currentMapLc =
        prev[selectedLifecycleCropId] || extractLifecycleFromFormData(formData);
      const currentVal = String((currentMapLc as any)[cameraModalConfig.targetFieldName] || '');
      const existing = currentVal
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
      const updatedList = existing.includes(fileName) ? existing : [...existing, fileName];
      const clamped = updatedList.slice(0, 5);
      return {
        ...prev,
        [selectedLifecycleCropId]: {
          ...currentMapLc,
          [cameraModalConfig.targetFieldName]: clamped.join(', '),
        },
      };
    });
  };

  const handleRemovePhotoFromField = (fieldName: string, photoFileName: string) => {
    setFormData((prev: any) => {
      const currentVal = String(prev[fieldName] || '');
      const remaining = currentVal
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s && s !== photoFileName);
      return {
        ...prev,
        [fieldName]: remaining.join(', '),
      };
    });

    setCropLifecycleMap((prev) => {
      const currentMapLc =
        prev[selectedLifecycleCropId] || extractLifecycleFromFormData(formData);
      const currentVal = String((currentMapLc as any)[fieldName] || '');
      const remaining = currentVal
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s && s !== photoFileName);
      return {
        ...prev,
        [selectedLifecycleCropId]: {
          ...currentMapLc,
          [fieldName]: remaining.join(', '),
        },
      };
    });
  };

  const availableStateDistricts =
    STATE_DISTRICTS_MAP[formData.state] || KARNATAKA_DISTRICTS;

  const extractLifecycleFromFormData = (state: Record<string, any>): CropLifecycleData => {
    const out: any = { ...EMPTY_LIFECYCLE_DATA };
    for (const k of LIFECYCLE_FIELD_KEYS) {
      out[k] = state[k] || '';
    }
    return out;
  };

  const updateLifecycleFields = (updates: Partial<CropLifecycleData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...updates };
      if (selectedLifecycleCropId !== 'primary') {
        next.additionalCrops = (prev.additionalCrops || []).map((item) =>
          item.id === selectedLifecycleCropId
            ? {
                ...item,
                lifecycleData: {
                  ...(item.lifecycleData || {}),
                  ...updates,
                },
              }
            : item
        );
      }
      return next;
    });
    setCropLifecycleMap((prev) => ({
      ...prev,
      [selectedLifecycleCropId]: {
        ...(prev[selectedLifecycleCropId] || extractLifecycleFromFormData(formData)),
        ...updates,
      },
    }));
  };

  const handleAddLifecycleStageRow = (cropId: string) => {
    if (modalMode === 'VIEW') return;
    setCropExtraLifecycleStagesMap((prev) => ({
      ...prev,
      [cropId]: [...(prev[cropId] || []), { ...EMPTY_LIFECYCLE_DATA }],
    }));
  };

  const handleRemoveLifecycleStageRow = (cropId: string, extraRowIdx: number) => {
    if (modalMode === 'VIEW') return;
    setCropExtraLifecycleStagesMap((prev) => ({
      ...prev,
      [cropId]: (prev[cropId] || []).filter((_, i) => i !== extraRowIdx),
    }));
  };

  const updateCropRowLifecycleField = (
    cropId: string,
    field: keyof CropLifecycleData,
    value: string,
    stageRowIdx: number = 0
  ) => {
    if (modalMode === 'VIEW') return;
    if (stageRowIdx > 0) {
      const extraIdx = stageRowIdx - 1;
      setCropExtraLifecycleStagesMap((prev) => {
        const list = [...(prev[cropId] || [])];
        list[extraIdx] = {
          ...(list[extraIdx] || { ...EMPTY_LIFECYCLE_DATA }),
          [field]: value,
        };
        return {
          ...prev,
          [cropId]: list,
        };
      });
      return;
    }
    if (cropId === selectedLifecycleCropId) {
      updateLifecycleFields({ [field]: value } as Partial<CropLifecycleData>);
      return;
    }
    setCropLifecycleMap((prev) => {
      const existing =
        prev[cropId] ||
        (cropId === 'primary'
          ? extractLifecycleFromFormData(formData)
          : {
              ...EMPTY_LIFECYCLE_DATA,
              ...((formData.additionalCrops || []).find((ac) => ac.id === cropId)?.lifecycleData ||
                {}),
            });
      return {
        ...prev,
        [cropId]: {
          ...existing,
          [field]: value,
        },
      };
    });
    if (cropId !== 'primary') {
      setFormData((prev) => ({
        ...prev,
        additionalCrops: (prev.additionalCrops || []).map((item) =>
          item.id === cropId
            ? {
                ...item,
                lifecycleData: {
                  ...(item.lifecycleData || { ...EMPTY_LIFECYCLE_DATA }),
                  [field]: value,
                },
              }
            : item
        ),
      }));
    }
  };

  const handleSelectLifecycleCrop = (targetCropId: string) => {
    if (targetCropId === selectedLifecycleCropId) return;

    const currentData = extractLifecycleFromFormData(formData);
    const updatedMap: Record<string, CropLifecycleData> = {
      ...cropLifecycleMap,
      [selectedLifecycleCropId]: currentData,
    };

    const targetItem = (formData.additionalCrops || []).find((c) => c.id === targetCropId);
    const targetData: CropLifecycleData =
      updatedMap[targetCropId] ||
      (targetItem?.lifecycleData
        ? { ...EMPTY_LIFECYCLE_DATA, ...targetItem.lifecycleData }
        : { ...EMPTY_LIFECYCLE_DATA });

    setCropLifecycleMap(updatedMap);
    setSelectedLifecycleCropId(targetCropId);
    setIsVisitCropStageDropdownOpen(false);
    setIsVisitAppTypeDropdownOpen(false);
    setIsHarvestQtyDropdownOpen(false);

    setFormData((prev) => ({
      ...prev,
      ...targetData,
      additionalCrops: (prev.additionalCrops || []).map((item) => {
        if (item.id === selectedLifecycleCropId) {
          return { ...item, lifecycleData: currentData };
        }
        return item;
      }),
    }));
  };

  const handleAddNewCropBlock = () => {
    if (modalMode === 'VIEW') return;
    const newBlock: CropSelectionItem = {
      id: `crop-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      cropType: '',
      crop: '',
      variety: '',
      plantingDate: '',
      cropAge: '',
      cropAcreage: '',
      plantCount: '',
      spacing: '',
      currentCropStage: '',
      surveyNumber: '',
      lifecycleData: { ...EMPTY_LIFECYCLE_DATA },
    };
    setCropLifecycleMap((prev) => ({
      ...prev,
      [newBlock.id]: { ...EMPTY_LIFECYCLE_DATA },
    }));
    setFormData((prev) => ({
      ...prev,
      additionalCrops: [...(prev.additionalCrops || []), newBlock],
    }));
  };

  const handleUpdateAdditionalCrop = (
    blockId: string,
    field: keyof CropSelectionItem,
    value: string
  ) => {
    if (modalMode === 'VIEW') return;
    setFormData((prev) => ({
      ...prev,
      additionalCrops: (prev.additionalCrops || []).map((item) =>
        item.id === blockId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleRemoveAdditionalCrop = (blockId: string) => {
    if (modalMode === 'VIEW') return;
    if (selectedLifecycleCropId === blockId) {
      handleSelectLifecycleCrop('primary');
    }
    setCropLifecycleMap((prev) => {
      const copy = { ...prev };
      delete copy[blockId];
      return copy;
    });
    setFormData((prev) => ({
      ...prev,
      additionalCrops: (prev.additionalCrops || []).filter((item) => item.id !== blockId),
    }));
  };

  // Confirmation Modal state for Adding / Deleting Crops
  const [cropConfirmModal, setCropConfirmModal] = useState<{
    isOpen: boolean;
    type: 'add' | 'delete';
    targetId?: string;
    cropName?: string;
  }>({
    isOpen: false,
    type: 'add',
  });

  const handleOpenAddCropModal = () => {
    if (modalMode === 'VIEW') return;
    setCropConfirmModal({
      isOpen: true,
      type: 'add',
    });
  };

  const handleOpenDeleteCropModal = (targetId: string, cropName?: string) => {
    if (modalMode === 'VIEW') return;
    setCropConfirmModal({
      isOpen: true,
      type: 'delete',
      targetId,
      cropName: cropName || 'this crop',
    });
  };

  const handleConfirmCropModal = () => {
    if (cropConfirmModal.type === 'add') {
      handleAddNewCropBlock();
    } else if (cropConfirmModal.type === 'delete' && cropConfirmModal.targetId) {
      if (cropConfirmModal.targetId === 'primary') {
        if (formData.additionalCrops && formData.additionalCrops.length > 0) {
          const [firstAdditional, ...remaining] = formData.additionalCrops;
          const promotedLifecycle = cropLifecycleMap[firstAdditional.id] || EMPTY_LIFECYCLE_DATA;
          setCropLifecycleMap((prev) => {
            const copy = { ...prev };
            copy['primary'] = promotedLifecycle;
            delete copy[firstAdditional.id];
            return copy;
          });
          setFormData((prev) => ({
            ...prev,
            cropType: firstAdditional.cropType,
            crop: firstAdditional.crop,
            variety: firstAdditional.variety,
            plantingDate: firstAdditional.plantingDate,
            cropAge: firstAdditional.cropAge,
            cropAcreage: firstAdditional.cropAcreage,
            plantCount: firstAdditional.plantCount,
            spacing: firstAdditional.spacing,
            currentCropStage: firstAdditional.currentCropStage || '',
            surveyNumber: firstAdditional.surveyNumber || prev.surveyNumber,
            additionalCrops: remaining,
          }));
        } else {
          setCropLifecycleMap((prev) => ({
            ...prev,
            primary: { ...EMPTY_LIFECYCLE_DATA },
          }));
          setFormData((prev) => ({
            ...prev,
            cropType: '',
            crop: '',
            variety: '',
            plantingDate: '',
            cropAge: '',
            cropAcreage: '',
            plantCount: '',
            spacing: '',
            currentCropStage: '',
          }));
        }
      } else {
        handleRemoveAdditionalCrop(cropConfirmModal.targetId);
      }
    }
    setCropConfirmModal({ isOpen: false, type: 'add' });
  };

  const autoPersistSoilReportToBackend = async (
    nextPrimarySoilName: string,
    nextPrimarySoilData: string,
    nextAdditionalCrops: CropSelectionItem[],
    nextLifecycleMap: Record<string, CropLifecycleData>,
    toastMsg: string
  ) => {
    const targetRecordId =
      activeRecord?.id || formData.trackingCode || formData.slNo || records[0]?.id;
    if (!targetRecordId) {
      showToast(toastMsg);
      return;
    }
    try {
      const updatedPrimaryLc: CropLifecycleData = {
        ...(nextLifecycleMap.primary || extractLifecycleFromFormData(formData)),
        soilReportFileName: nextPrimarySoilName,
        soilReportFileData: nextPrimarySoilData,
      };
      const finalLifecycleMap: Record<string, CropLifecycleData> = {
        ...nextLifecycleMap,
        primary: updatedPrimaryLc,
      };
      nextAdditionalCrops.forEach((c) => {
        if (c.lifecycleData) {
          finalLifecycleMap[c.id] = c.lifecycleData;
        }
      });

      const res = await fetch('/api/package-of-practice', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: targetRecordId,
          fromBackend: true,
          soilReportFileName: nextPrimarySoilName,
          soilReportFileData: nextPrimarySoilData,
          additionalCrops: nextAdditionalCrops,
          cropLifecycleMap: finalLifecycleMap,
        }),
      });
      const json = await res.json();
      if (json.success && json.record) {
        setActiveRecord(json.record);
        setRecords((prev) =>
          prev.map((r) => (r.id === json.record.id ? json.record : r))
        );
        showToast(`${toastMsg} (Saved to Backend)`);
      } else {
        showToast(toastMsg);
      }
    } catch {
      showToast(toastMsg);
    }
  };

  const handlePrimarySoilReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isValidType =
      file.type === 'image/jpeg' ||
      file.type === 'application/pdf' ||
      ext === 'jpg' ||
      ext === 'jpeg' ||
      ext === 'pdf';
    if (!isValidType) {
      showToast('Please upload a soil report in JPG or PDF format only.', 'error');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      const updatedPrimary: CropLifecycleData = {
        ...(cropLifecycleMap.primary || extractLifecycleFromFormData(formData)),
        soilReportFileName: file.name,
        soilReportFileData: dataUrl,
      };
      const nextMap: Record<string, CropLifecycleData> = {
        ...cropLifecycleMap,
        primary: updatedPrimary,
      };
      setCropLifecycleMap(nextMap);
      if (selectedLifecycleCropId === 'primary') {
        setFormData((prev) => ({
          ...prev,
          soilReportFileName: file.name,
          soilReportFileData: dataUrl,
        }));
      }
      autoPersistSoilReportToBackend(
        file.name,
        dataUrl,
        formData.additionalCrops || [],
        nextMap,
        `Uploaded Soil Report "${file.name}" for ${formData.crop || 'Primary Crop'}`
      );
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePrimarySoilReport = () => {
    const updatedPrimary: CropLifecycleData = {
      ...(cropLifecycleMap.primary || extractLifecycleFromFormData(formData)),
      soilReportFileName: '',
      soilReportFileData: '',
    };
    const nextMap: Record<string, CropLifecycleData> = {
      ...cropLifecycleMap,
      primary: updatedPrimary,
    };
    setCropLifecycleMap(nextMap);
    if (selectedLifecycleCropId === 'primary') {
      setFormData((prev) => ({
        ...prev,
        soilReportFileName: '',
        soilReportFileData: '',
      }));
    }
    autoPersistSoilReportToBackend(
      '',
      '',
      formData.additionalCrops || [],
      nextMap,
      `Removed Soil Report for ${formData.crop || 'Primary Crop'}`
    );
  };

  const handleAdditionalCropSoilReportUpload = (
    cropId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isValidType =
      file.type === 'image/jpeg' ||
      file.type === 'application/pdf' ||
      ext === 'jpg' ||
      ext === 'jpeg' ||
      ext === 'pdf';
    if (!isValidType) {
      showToast('Please upload a soil report in JPG or PDF format only.', 'error');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      const targetCropObj = (formData.additionalCrops || []).find((c) => c.id === cropId);
      const updatedCropLc: CropLifecycleData = {
        ...(cropLifecycleMap[cropId] || targetCropObj?.lifecycleData || EMPTY_LIFECYCLE_DATA),
        soilReportFileName: file.name,
        soilReportFileData: dataUrl,
      };
      const nextMap: Record<string, CropLifecycleData> = {
        ...cropLifecycleMap,
        [cropId]: updatedCropLc,
      };
      const nextAdditionalCrops = (formData.additionalCrops || []).map((item) =>
        item.id === cropId
          ? {
              ...item,
              soilReportFileName: file.name,
              soilReportFileData: dataUrl,
              lifecycleData: {
                ...(item.lifecycleData || EMPTY_LIFECYCLE_DATA),
                soilReportFileName: file.name,
                soilReportFileData: dataUrl,
              },
            }
          : item
      );
      setCropLifecycleMap(nextMap);
      setFormData((prev) => ({
        ...prev,
        ...(selectedLifecycleCropId === cropId
          ? { soilReportFileName: file.name, soilReportFileData: dataUrl }
          : {}),
        additionalCrops: nextAdditionalCrops,
      }));
      const primarySoilName =
        selectedLifecycleCropId === 'primary'
          ? formData.soilReportFileName || ''
          : cropLifecycleMap.primary?.soilReportFileName || '';
      const primarySoilData =
        selectedLifecycleCropId === 'primary'
          ? formData.soilReportFileData || ''
          : cropLifecycleMap.primary?.soilReportFileData || '';
      autoPersistSoilReportToBackend(
        primarySoilName,
        primarySoilData,
        nextAdditionalCrops,
        nextMap,
        `Uploaded Soil Report "${file.name}" for ${targetCropObj?.crop || 'Additional Crop'}`
      );
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveAdditionalCropSoilReport = (cropId: string) => {
    const targetCropObj = (formData.additionalCrops || []).find((c) => c.id === cropId);
    const updatedCropLc: CropLifecycleData = {
      ...(cropLifecycleMap[cropId] || targetCropObj?.lifecycleData || EMPTY_LIFECYCLE_DATA),
      soilReportFileName: '',
      soilReportFileData: '',
    };
    const nextMap: Record<string, CropLifecycleData> = {
      ...cropLifecycleMap,
      [cropId]: updatedCropLc,
    };
    const nextAdditionalCrops = (formData.additionalCrops || []).map((item) =>
      item.id === cropId
        ? {
            ...item,
            soilReportFileName: '',
            soilReportFileData: '',
            lifecycleData: {
              ...(item.lifecycleData || EMPTY_LIFECYCLE_DATA),
              soilReportFileName: '',
              soilReportFileData: '',
            },
          }
        : item
    );
    setCropLifecycleMap(nextMap);
    setFormData((prev) => ({
      ...prev,
      ...(selectedLifecycleCropId === cropId
        ? { soilReportFileName: '', soilReportFileData: '' }
        : {}),
      additionalCrops: nextAdditionalCrops,
    }));
    const primarySoilName =
      selectedLifecycleCropId === 'primary'
        ? formData.soilReportFileName || ''
        : cropLifecycleMap.primary?.soilReportFileName || '';
    const primarySoilData =
      selectedLifecycleCropId === 'primary'
        ? formData.soilReportFileData || ''
        : cropLifecycleMap.primary?.soilReportFileData || '';
    autoPersistSoilReportToBackend(
      primarySoilName,
      primarySoilData,
      nextAdditionalCrops,
      nextMap,
      `Removed Soil Report for ${targetCropObj?.crop || 'Additional Crop'}`
    );
  };

  const handleDownloadSoilReport = (
    fileName?: string,
    fileData?: string,
    cropName?: string,
    _soilSummary?: string
  ) => {
    const cleanName = (fileName || '').trim();
    if (!fileData || !fileData.startsWith('data:')) {
      showToast('No Soil Report (JPG / PDF) uploaded yet for this crop.', 'error');
      return;
    }
    const targetFileName = cleanName || `${cropName || formData.crop || 'Crop'}_Soil_Report.pdf`;

    try {
      const [header, base64Part] = fileData.split(',');
      const mimeMatch = header.match(/data:([^;]+)/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'application/pdf';
      const byteCharacters = atob(base64Part);
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteNumbers], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = targetFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch {
      const link = document.createElement('a');
      link.href = fileData;
      link.download = targetFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<PopSubmissionRecord | null>(null);

  // Toast
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchRecords = async () => {
    try {
      if (!globalPopClientCache.__popRecordsCache || globalPopClientCache.__popRecordsCache.length === 0) {
        setLoading(true);
      }
      const res = await fetch('/api/package-of-practice', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.records)) {
        globalPopClientCache.__popRecordsCache = json.records;
        setRecords(json.records);
        if (Array.isArray(json.farmerAccounts)) {
          setFarmerAccounts(json.farmerAccounts);
        }
      } else {
        showToast(json.error || 'Failed to load Farmer POP Forms', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error loading Farmer POP Forms', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Filtered records by Farmer Name, Mobile Number, Crop Type, ID, Village
  const filteredRecords = records.filter((r) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (r.name || '').toLowerCase().includes(q) ||
      (r.mobileNumber || '').toLowerCase().includes(q) ||
      (r.crop || '').toLowerCase().includes(q) ||
      (r.farmerId || '').toLowerCase().includes(q) ||
      (r.trackingCode || '').toLowerCase().includes(q) ||
      (r.villagePanchayat || '').toLowerCase().includes(q) ||
      (r.district || '').toLowerCase().includes(q);

    const matchesCrop =
      filterCrop === 'All' || (r.crop || '').toLowerCase() === filterCrop.toLowerCase();

    return matchesSearch && matchesCrop;
  });

  const resetAllDropdowns = () => {
    setIsSoilDropdownOpen(false);
    setIsIrrigationDropdownOpen(false);
    setIsCropTypeDropdownOpen(false);
    setIsCropDropdownOpen(false);
    setIsVarietyDropdownOpen(false);
    setExtraVarietyOpenId(null);
    setIsCurrentCropStageDropdownOpen(false);
    setIsStateDropdownOpen(false);
    setIsDistrictDropdownOpen(false);
    setIsCropStageDropdownOpen(false);
    setIsMainRequirementDropdownOpen(false);
    setIsProblemTypeDropdownOpen(false);
    setIsSolutionTypeDropdownOpen(false);
    setIsMaterialDropdownOpen(false);
    setIsEquipmentDropdownOpen(false);
    setIsVisitCropStageDropdownOpen(false);
    setIsVisitAppTypeDropdownOpen(false);
    setIsHarvestQtyDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const refs = [
        soilDropdownRef,
        irrigationDropdownRef,
        cropTypeDropdownRef,
        cropDropdownRef,
        varietyDropdownRef,
        currentCropStageDropdownRef,
        stateDropdownRef,
        districtDropdownRef,
        cropStageDropdownRef,
        mainRequirementDropdownRef,
        problemTypeDropdownRef,
        solutionTypeDropdownRef,
        materialDropdownRef,
        equipmentDropdownRef,
        visitCropStageDropdownRef,
        visitAppTypeDropdownRef,
        harvestQtyDropdownRef,
      ];
      const clickedInsideAny = refs.some((r) => r.current && r.current.contains(target));
      if (!clickedInsideAny) {
        resetAllDropdowns();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const populateFormFromRecord = (rec: PopSubmissionRecord) => {
    resetAllDropdowns();
    const cropSchedule =
      Array.isArray(rec.schedule) && rec.schedule.length > 0
        ? rec.schedule
        : (POP_SCHEDULES_BY_CROP[rec.crop] || POP_SCHEDULES_BY_CROP.Maize).schedule;

    const primaryLifecycle: CropLifecycleData = {
      visitDate: rec.visitDate || '',
      advisorName: rec.advisorName || '',
      visitCropStage: rec.visitCropStage || '',
      cropObservations: rec.cropObservations || '',
      visitRecommendations: rec.visitRecommendations || '',
      visitApplicationType: rec.visitApplicationType || '',
      farmerFeedback: rec.farmerFeedback || '',
      visitPhotographs: rec.visitPhotographs || '',
      nextFollowUpDate: rec.nextFollowUpDate || '',
      problemFieldPhotos: rec.problemFieldPhotos || '',
      problemSymptoms: rec.problemSymptoms || '',
      problemSeverity: rec.problemSeverity || '',
      problemActionsTaken: rec.problemActionsTaken || '',
      problemResolved: rec.problemResolved || '',
      waterAvailability: rec.waterAvailability || '',
      irrigationSchedules: rec.irrigationSchedules || '',
      rainfallAlert: rec.rainfallAlert || '',
      heatAlert: rec.heatAlert || '',
      weatherAlerts: rec.weatherAlerts || '',
      soilTestReport: (rec as any).cropLifecycleMap?.primary?.soilTestReport || rec.soilTestReport || '',
      soilReportFileName:
        (rec as any).cropLifecycleMap?.primary?.soilReportFileName ?? rec.soilReportFileName ?? '',
      soilReportFileData:
        (rec as any).cropLifecycleMap?.primary?.soilReportFileData ?? rec.soilReportFileData ?? '',
      nutrientRecommendations: rec.nutrientRecommendations || '',
      fertilizerHistory: rec.fertilizerHistory || '',
      nextSoilTestDate: rec.nextSoilTestDate || '',
      harvestingDate: rec.harvestingDate || '',
      harvestedQuantity: rec.harvestedQuantity || '',
      sellingPrice: rec.sellingPrice || '',
      buyerName: rec.buyerName || '',
      marketExpenses: rec.marketExpenses || '',
      cropWiseReturns: rec.cropWiseReturns || '',
      localMarketPriceInfo: rec.localMarketPriceInfo || '',
      harvestPicking: rec.harvestPicking || '',
      whatsappConsent: rec.whatsappConsent || '',
      advisoryMessages: rec.advisoryMessages || '',
      trainingAttendance: rec.trainingAttendance || '',
      communicationReminders: rec.communicationReminders || '',
      schemeInformation: rec.schemeInformation || '',
      pendingActions: rec.pendingActions || '',
      problemSummary: rec.problemSummary || '',
      solutionSummary: rec.solutionSummary || '',
    };

    const nextMap: Record<string, CropLifecycleData> = {
      primary: primaryLifecycle,
    };
    const extraCrops = Array.isArray(rec.additionalCrops) ? rec.additionalCrops : [];
    for (const item of extraCrops) {
      if (item?.id) {
        const mergedLc = {
          ...EMPTY_LIFECYCLE_DATA,
          ...((rec as any).cropLifecycleMap?.[item.id] || {}),
          ...(item.lifecycleData || (item as any).lifecycle || {}),
        };
        if (item.soilReportFileName && !mergedLc.soilReportFileName) {
          mergedLc.soilReportFileName = item.soilReportFileName;
        }
        if (item.soilReportFileData && !mergedLc.soilReportFileData) {
          mergedLc.soilReportFileData = item.soilReportFileData;
        }
        nextMap[item.id] = mergedLc;
      }
    }
    setCropLifecycleMap(nextMap);
    const savedExtraStages: Record<string, CropLifecycleData[]> = {};
    const rawExtraMap = (rec as any).cropExtraLifecycleStagesMap || {};
    for (const [k, v] of Object.entries(rawExtraMap)) {
      if (Array.isArray(v)) {
        savedExtraStages[k] = v.map((stageObj: any) => ({
          ...EMPTY_LIFECYCLE_DATA,
          ...(stageObj || {}),
        }));
      }
    }
    setCropExtraLifecycleStagesMap(savedExtraStages);
    setSelectedLifecycleCropId('primary');
    setMaterialRequiredChoice(
      rec.farmMaterial === 'No' || rec.farmMaterial === 'Not Required' ? 'No' : 'Yes'
    );
    setEquipmentRequiredChoice(
      rec.equipment === 'No' || rec.equipment === 'Not Required' ? 'No' : 'Yes'
    );

    setFormData({
      loginUsername: rec.loginUsername || rec.mobileNumber || '',
      loginPassword: rec.loginPassword || `Farmer@${(rec.mobileNumber || '1234').slice(-4)}`,
      trackingCode: rec.trackingCode || rec.slNo || '',
      slNo: rec.slNo || rec.trackingCode || '',
      farmerId: rec.farmerId || '',
      name: rec.name || '',
      mobileNumber: rec.mobileNumber || '',
      emailId: rec.emailId || '',
      date: rec.date || '',
      surveyNumber: rec.surveyNumber || '',
      address: rec.address || '',
      pinCode: rec.pinCode || '',
      villagePanchayat: rec.villagePanchayat || '',
      taluk: rec.taluk || '',
      district: rec.district || '',
      state: rec.state || '',
      language: rec.language || '',
      jobWorkLocation: rec.jobWorkLocation || '',
      acres: rec.acres || '',
      soilType: rec.soilType || '',
      irrigationType: rec.irrigationType || '',
      waterSource: rec.waterSource || '',
      cropType: rec.cropType || '',
      crop: rec.crop || '',
      variety: rec.variety || '',
      plantingDate: rec.plantingDate || '',
      cropAge: rec.cropAge || '',
      cropAcreage: rec.cropAcreage || '',
      plantCount: rec.plantCount || '',
      spacing: rec.spacing || '',
      currentCropStage: rec.currentCropStage || rec.cropStage || '',
      additionalCrops: extraCrops,
      cropCycleDays: rec.cropCycleDays || '',
      cropStage: rec.cropStage || '',
      mainRequirement: rec.mainRequirement || '',
      problemType: rec.problemType || '',
      solutionType: rec.solutionType || '',
      applicationMethod: rec.applicationMethod || '',
      serviceType: rec.serviceType || '',
      farmMaterial: rec.farmMaterial || '',
      equipment: rec.equipment || '',
      harvestPlanning: rec.harvestPlanning || '',
      packagingType: rec.packagingType || '',
      vleFpoNo: rec.vleFpoNo || '',
      distanceFromVle: rec.distanceFromVle || '',
      ...primaryLifecycle,
      schedule: cropSchedule,
      isPopTableEnabled: rec.isPopTableEnabled !== undefined ? Boolean(rec.isPopTableEnabled) : true,
      status: rec.status || 'SUBMITTED',
    });
  };

  // Open VIEW Modal — Full Form visible in read-only mode
  const handleOpenView = (rec: PopSubmissionRecord) => {
    setActiveRecord(rec);
    populateFormFromRecord(rec);
    setModalTab('form');
    setModalMode('VIEW');
  };

  // Open EDIT Modal — Full Form with only the entered details editable
  const handleOpenEdit = (rec: PopSubmissionRecord) => {
    setActiveRecord(rec);
    populateFormFromRecord(rec);
    setModalTab('form');
    setModalMode('EDIT');
  };

  // Open ADD NEW FARMER Modal — Exact same Full Form with empty fields to enter details
  const handleOpenCreate = () => {
    resetAllDropdowns();
    setActiveRecord(null);
    setSelectedLifecycleCropId('primary');
    setCropLifecycleMap({ primary: { ...EMPTY_LIFECYCLE_DATA } });
    setCropExtraLifecycleStagesMap({});
    setMaterialRequiredChoice('Yes');
    setEquipmentRequiredChoice('Yes');
    setFormData({
      ...EMPTY_RECORD,
      schedule: POP_SCHEDULES_BY_CROP.Maize.schedule,
    });
    setModalTab('form');
    setModalMode('CREATE');
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (modalMode === 'VIEW') return;
    const { name, value } = e.target;

    if (name === 'mobileNumber') {
      setFormData((prev) => ({ ...prev, mobileNumber: value.replace(/\D/g, '').slice(0, 10) }));
      return;
    }

    if (name === 'pinCode') {
      setFormData((prev) => ({ ...prev, pinCode: value.replace(/\D/g, '').slice(0, 6) }));
      return;
    }

    if (name === 'crop') {
      const preset = POP_SCHEDULES_BY_CROP[value] || POP_SCHEDULES_BY_CROP.Maize;
      setFormData((prev) => ({
        ...prev,
        crop: value,
        schedule: preset.schedule,
      }));
      return;
    }

    if (LIFECYCLE_FIELD_KEYS.includes(name as keyof CropLifecycleData)) {
      updateLifecycleFields({ [name]: value } as Partial<CropLifecycleData>);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save Create or Edit
  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'VIEW') return;

    if (!formData.name.trim()) {
      showToast('Farmer Name is required', 'error');
      return;
    }

    const isEdit = modalMode === 'EDIT' && !!activeRecord;
    const otherMobiles = records
      .filter((r) => !(isEdit && r.id === activeRecord.id))
      .map((r) => r.mobileNumber)
      .filter(Boolean);

    const phoneValidation = validatePhoneNumber(formData.mobileNumber, otherMobiles);
    if (!phoneValidation.valid) {
      showToast(phoneValidation.error || 'Please enter a valid 10-digit Mobile Number', 'error');
      return;
    }

    const emailValidation = validateEmailOptional(formData.emailId);
    if (!emailValidation.valid) {
      showToast(emailValidation.error || 'Please enter a valid Email ID', 'error');
      return;
    }

    const pinValidation = validatePinCode(formData.pinCode);
    if (!pinValidation.valid) {
      showToast(pinValidation.error || 'Please enter a valid 6-digit PIN Code', 'error');
      return;
    }

    const rawPrimaryLifecycle =
      selectedLifecycleCropId === 'primary'
        ? extractLifecycleFromFormData(formData)
        : cropLifecycleMap.primary || extractLifecycleFromFormData(formData);
    const primaryLifecycle: CropLifecycleData = {
      ...rawPrimaryLifecycle,
      soilReportFileName:
        rawPrimaryLifecycle.soilReportFileName ||
        cropLifecycleMap.primary?.soilReportFileName ||
        '',
      soilReportFileData:
        rawPrimaryLifecycle.soilReportFileData ||
        cropLifecycleMap.primary?.soilReportFileData ||
        '',
    };

    const syncedAdditionalCrops = (formData.additionalCrops || []).map((c) => {
      const lc =
        selectedLifecycleCropId === c.id
          ? extractLifecycleFromFormData(formData)
          : cropLifecycleMap[c.id] || c.lifecycleData || { ...EMPTY_LIFECYCLE_DATA };
      const finalSoilName = lc.soilReportFileName || c.soilReportFileName || '';
      const finalSoilData = lc.soilReportFileData || c.soilReportFileData || '';
      return {
        ...c,
        soilReportFileName: finalSoilName,
        soilReportFileData: finalSoilData,
        lifecycleData: {
          ...lc,
          soilReportFileName: finalSoilName,
          soilReportFileData: finalSoilData,
        },
      };
    });

    const syncedCropLifecycleMap: Record<string, CropLifecycleData> = {
      ...cropLifecycleMap,
      primary: primaryLifecycle,
    };
    syncedAdditionalCrops.forEach((c) => {
      syncedCropLifecycleMap[c.id] = c.lifecycleData as CropLifecycleData;
    });

    try {
      setSaving(true);
      const res = await fetch('/api/package-of-practice', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isEdit ? { id: activeRecord.id } : {}),
          fromBackend: true,
          ...formData,
          ...primaryLifecycle,
          additionalCrops: syncedAdditionalCrops,
          cropLifecycleMap: syncedCropLifecycleMap,
          cropExtraLifecycleStagesMap,
          mobileNumber: phoneValidation.cleaned,
          emailId: emailValidation.cleaned || '',
          pinCode: pinValidation.cleaned,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(
          json.message ||
            (isEdit
              ? `Updated Farmer Data Form for ${formData.name}`
              : `Added new Farmer Data Form for ${formData.name}`)
        );
        setModalMode(null);
        setActiveRecord(null);
        fetchRecords();
      } else {
        showToast(json.error || 'Failed to save form', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving form', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setSaving(true);
      const res = await fetch(
        `/api/package-of-practice?id=${encodeURIComponent(deleteTarget.id)}`,
        {
          method: 'DELETE',
        }
      );
      const json = await res.json();
      if (json.success) {
        showToast(`Deleted Farmer Data Form for "${deleteTarget.name}"`);
        if (activeRecord?.id === deleteTarget.id) {
          setModalMode(null);
          setActiveRecord(null);
        }
        setDeleteTarget(null);
        fetchRecords();
      } else {
        showToast(json.error || 'Failed to delete form', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting form', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Calculate crop progress for Section 4 inside the modal
  const numericAgeDays = (() => {
    const match = String(formData.cropAge || '').match(/\d+/);
    if (match) return parseInt(match[0], 10);
    if (formData.plantingDate) {
      const planted = new Date(formData.plantingDate);
      if (!isNaN(planted.getTime())) {
        return Math.max(0, Math.floor((Date.now() - planted.getTime()) / (1000 * 60 * 60 * 24)));
      }
    }
    return 25;
  })();

  const totalCycleDays = Math.max(1, parseInt(formData.cropCycleDays, 10) || 110);
  const progressPercent = Math.min(100, Math.max(5, Math.round((numericAgeDays / totalCycleDays) * 100)));

  const activeSchedule: PopScheduleStage[] =
    Array.isArray(formData.schedule) && formData.schedule.length > 0
      ? formData.schedule
      : (POP_SCHEDULES_BY_CROP[formData.crop] || POP_SCHEDULES_BY_CROP.Maize).schedule;

  const getStageStatus = (row: PopScheduleStage): 'COMPLETED' | 'CURRENT' | 'UPCOMING' => {
    if (row.stageStatus === 'COMPLETED' || row.stageStatus === 'CURRENT' || row.stageStatus === 'UPCOMING') {
      return row.stageStatus;
    }
    const sDay = row.startDay ?? 0;
    const eDay = row.endDay ?? 30;
    if (numericAgeDays > eDay) return 'COMPLETED';
    if (numericAgeDays >= sDay && numericAgeDays <= eDay) return 'CURRENT';
    return 'UPCOMING';
  };

  const handleScheduleRowChange = (
    rowIdx: number,
    field: keyof PopScheduleStage,
    value: any
  ) => {
    if (modalMode === 'VIEW') return;
    setFormData((prev) => {
      const baseList =
        Array.isArray(prev.schedule) && prev.schedule.length > 0
          ? prev.schedule
          : (POP_SCHEDULES_BY_CROP[prev.crop] || POP_SCHEDULES_BY_CROP.Maize).schedule;
      const updated = baseList.map((item, i) =>
        i === rowIdx ? { ...item, [field]: value } : item
      );
      return { ...prev, schedule: updated };
    });
  };

  const handleAddScheduleStage = () => {
    if (modalMode === 'VIEW') return;
    setFormData((prev) => {
      const baseList =
        Array.isArray(prev.schedule) && prev.schedule.length > 0
          ? prev.schedule
          : (POP_SCHEDULES_BY_CROP[prev.crop] || POP_SCHEDULES_BY_CROP.Maize).schedule;
      const nextNum = baseList.length + 1;
      const newStage: PopScheduleStage = {
        id: `stage-${Date.now()}`,
        stageName: `Stage ${nextNum}: Growth & Maintenance`,
        dayRange: `Day ${(nextNum - 1) * 25 + 1} – Day ${nextNum * 25}`,
        startDay: (nextNum - 1) * 25 + 1,
        endDay: nextNum * 25,
        sownDate: `Day ${(nextNum - 1) * 25 + 1}`,
        stageStatus: 'UPCOMING',
        isEnabled: true,
        soilPrep: '',
        manuring: '',
        irrigation: '',
        weedingSchedule: '',
        sprayingSchedule: '',
        maintenanceSchedule: '',
        harvestingSchedule: '',
        keyProblem: '',
        recommendedSolution: '',
      };
      return { ...prev, schedule: [...baseList, newStage] };
    });
  };

  const handleRemoveScheduleStage = (rowIdx: number) => {
    if (modalMode === 'VIEW') return;
    setFormData((prev) => {
      const baseList =
        Array.isArray(prev.schedule) && prev.schedule.length > 0
          ? prev.schedule
          : (POP_SCHEDULES_BY_CROP[prev.crop] || POP_SCHEDULES_BY_CROP.Maize).schedule;
      if (baseList.length <= 1) return prev;
      return {
        ...prev,
        schedule: baseList.filter((_, i) => i !== rowIdx),
      };
    });
  };

  const isReadOnly = modalMode === 'VIEW';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-800 text-xs">
      {/* Toast Notification */}
      {toast && (
        <div
          style={{ zIndex: 10000 }}
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-xs font-semibold flex items-center gap-2 max-w-md ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Back Button */}
      <div>
        <Link
          href="/procurement"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-extrabold shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700" />
          <span>Back</span>
        </Link>
      </div>

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-[#183526] to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B4D334] text-slate-950 uppercase tracking-wide">
              Package of Practice (POP)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <ClipboardList className="w-7 h-7 text-[#F7C629]" />
            <span>Package of Practice — Farmer Data &amp; POP Forms</span>
          </h1>
          <p className="text-slate-300 text-xs max-w-2xl">
            Every Package of Practice (POP) &amp; Farmer Data Form filled by a farmer automatically comes and sits here. View the full form, Edit entered details, Delete, or click Add New Farmer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Farmer</span>
          </button>
        </div>
      </div>

      {/* SEARCH & CROP FILTER BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Farmer Name, Mobile Number, Crop Type, or Farmer ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600">Crop Type:</span>
          <select
            value={filterCrop}
            onChange={(e) => setFilterCrop(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:border-emerald-600 outline-none"
          >
            <option value="All">All Crops ({records.length})</option>
            {CROP_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {(searchQuery || filterCrop !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterCrop('All');
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* FARMER LOGIN ACCOUNTS & PASSWORDS DIRECTORY (VISIBLE TO ADMIN) */}
      {farmerAccounts.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-300/80 shadow-xs overflow-hidden">
          <div className="px-5 py-3 bg-amber-50/90 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2">
            <div className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Farmer Login Accounts &amp; Passwords — Admin View ({farmerAccounts.length})</span>
            </div>
            <span className="text-[11px] font-semibold text-amber-900">
              All registered farmer usernames, mobile numbers &amp; login passwords visible for Admin
            </span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {farmerAccounts.map((acc) => (
              <div
                key={acc.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="font-extrabold text-slate-900 text-xs truncate">
                    {acc.name}
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono truncate">
                    Login ID: <strong>{acc.username}</strong>
                    {acc.mobile && acc.mobile !== acc.username ? ` (${acc.mobile})` : ''}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Password
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-amber-950 font-mono font-black text-xs">
                    {acc.password}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FARMER POP SUBMISSIONS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="font-extrabold text-slate-800 text-xs flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Saved Farmer Data Forms ({filteredRecords.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Farmer ID / Tracking</th>
                <th className="py-3 px-4">Farmer Name</th>
                <th className="py-3 px-4">Mobile Number</th>
                <th className="py-3 px-4">Login Account &amp; Password</th>
                <th className="py-3 px-4">Crop Type</th>
                <th className="py-3 px-4">Village / District & Acreage</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions (View / Edit / Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Loading saved Farmer Data Forms...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No Farmer Data Forms found. Click &ldquo;Add New Farmer&rdquo; to add one.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-emerald-50/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-emerald-700">
                        {rec.farmerId || rec.trackingCode}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {rec.trackingCode || rec.slNo}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{rec.name}</span>
                      </div>
                      {rec.emailId && (
                        <div className="text-[11px] text-slate-500">{rec.emailId}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        {rec.mobileNumber}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="text-[11px] text-slate-600 font-mono">
                          ID: <strong className="text-slate-900">{rec.loginUsername || rec.mobileNumber}</strong>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 font-mono font-black text-xs">
                          <span>Password:</span>
                          <span className="text-emerald-900">
                            {rec.loginPassword || `Farmer@${(rec.mobileNumber || '1234').slice(-4)}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs">
                          <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                          {rec.crop}
                        </span>
                        {Array.isArray(rec.additionalCrops) &&
                          rec.additionalCrops
                            .filter((ac) => ac && ac.crop)
                            .map((ac, acIdx) => (
                              <span
                                key={ac.id || acIdx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-900 border border-teal-300 font-bold text-xs"
                              >
                                <Sprout className="w-3 h-3 text-teal-700" />
                                {ac.crop}
                              </span>
                            ))}
                      </div>
                      {rec.variety && (
                        <div className="text-[11px] text-slate-500 mt-1 max-w-[200px] truncate">
                          {rec.variety}
                          {Array.isArray(rec.additionalCrops) && rec.additionalCrops.length > 0
                            ? ` (+${rec.additionalCrops.length} more crop${rec.additionalCrops.length > 1 ? 's' : ''})`
                            : ''}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>
                          {rec.villagePanchayat || '-'}, {rec.district || '-'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Acreage: <strong>{rec.acres || rec.cropAcreage || '-'}</strong>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {rec.date || '-'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenView(rec)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-[11px] inline-flex items-center gap-1 transition cursor-pointer"
                          title="View Full Farmer Data Form"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(rec)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] inline-flex items-center gap-1 transition cursor-pointer"
                          title="Edit Entered Details in Full Form"
                        >
                          <Edit className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(rec)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] inline-flex items-center gap-1 transition cursor-pointer"
                          title="Delete Farmer Data Form"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FULL FARMER DATA FORM & POP SCHEDULE MODAL (VIEW / EDIT / ADD NEW FARMER) */}
      {/* White Background & Black Font                                             */}
      {/* ========================================================================= */}
      {modalMode && (
        <div
          style={{ zIndex: 9995 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-5"
        >
          <div className="bg-white text-black rounded-3xl shadow-2xl border-2 border-black max-w-6xl w-full max-h-[94vh] flex flex-col overflow-hidden">
            {/* Modal Top Header */}
            <div className="px-6 py-4 bg-white text-black border-b-2 border-black flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-black" />
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-black" style={{ color: '#000000' }}>
                    {modalMode === 'VIEW'
                      ? `View Full Farmer Data Form — ${formData.name}`
                      : modalMode === 'EDIT'
                      ? `Edit Farmer Data Form — ${formData.name}`
                      : 'Add New Farmer — Farmer Data Form'}
                  </h3>
                  <p className="text-[11px] text-black">
                    {modalMode === 'VIEW'
                      ? 'Read-Only View of the Complete Farmer Data Form & POP Activity Schedule'
                      : modalMode === 'EDIT'
                      ? 'Edit the entered farmer & crop details below and click Update Farmer Form'
                      : 'Enter the new farmer details below and click Save New Farmer'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {modalMode === 'VIEW' && activeRecord && (
                  <button
                    type="button"
                    onClick={() => setModalMode('EDIT')}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-100 text-black border border-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Switch to Edit Mode</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setModalMode(null);
                    setActiveRecord(null);
                  }}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Full Form Body */}
            <form onSubmit={handleSaveRecord} className="p-5 sm:p-8 overflow-y-auto space-y-8 text-xs bg-white text-black">
              {/* 2 Colorful Tabs: 1. Farmer Data Form | 2. Farmer Lifecycle */}
              <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-2 border-emerald-500/40 rounded-2xl p-2 shadow-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setModalTab('form')}
                    className={`flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer border-2 ${
                      modalTab === 'form'
                        ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white border-amber-300 shadow-md'
                        : 'bg-white/10 text-emerald-100 border-white/15 hover:bg-white/20'
                    }`}
                  >
                    <ClipboardList className="w-4 h-4 shrink-0" />
                    <span>1. Farmer Data Form</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalTab('lifecycle')}
                    className={`flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer border-2 ${
                      modalTab === 'lifecycle'
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-white shadow-md'
                        : 'bg-white/10 text-amber-100 border-white/15 hover:bg-white/20'
                    }`}
                  >
                    <Sprout className="w-4 h-4 shrink-0" />
                    <span>2. Farmer Lifecycle</span>
                  </button>
                </div>
              </div>

              {modalTab === 'form' && (
                <>
              <div className="bg-white text-black rounded-2xl border-2 border-emerald-600/50 p-5 sm:p-7 space-y-8">
                <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-xl p-4 text-center">
                  <h2 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-white">
                    FARMER DATA FORMS
                  </h2>
                  <p className="text-xs text-emerald-100 font-semibold mt-1">
                    {modalMode === 'VIEW'
                      ? 'Complete Submitted Record (Read-Only)'
                      : 'Enter / Edit Farmer Details in Sections 1, 2 & 3'}
                  </p>
                </div>

                {/* ===================================================== */}
                {/* 1. FARM PROFILE                                       */}
                {/* ===================================================== */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-black flex items-center gap-2" style={{ color: '#000000' }}>
                    <span className="text-black font-black">1</span>
                    <span>Farm Profile</span>
                  </h3>

                  <div className="border border-black rounded-lg bg-white text-black">
                    {/* Row 1: Farmer Name | Farmer ID */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Farmer Name {!isReadOnly && <span className="text-red-600 ml-1">*</span>}
                      </label>
                      <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                        <input
                          type="text"
                          name="name"
                          readOnly={isReadOnly}
                          required={!isReadOnly}
                          value={formData.name}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Farmer Name'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>

                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Farmer ID
                      </label>
                      <div className="md:col-span-4 bg-white p-2">
                        <input
                          type="text"
                          name="farmerId"
                          readOnly={isReadOnly}
                          value={formData.farmerId}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Farmer ID'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm font-mono text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Row 2: Mobile Number | Email ID */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Mobile Number {!isReadOnly && <span className="text-red-600 ml-1">*</span>}
                      </label>
                      <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                        <input
                          type="tel"
                          name="mobileNumber"
                          readOnly={isReadOnly}
                          required={!isReadOnly}
                          value={formData.mobileNumber}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter 10-digit Mobile Number'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>

                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Email ID
                      </label>
                      <div className="md:col-span-4 bg-white p-2">
                        <input
                          type="email"
                          name="emailId"
                          readOnly={isReadOnly}
                          value={formData.emailId}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Email ID'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Row 2B: Login Username | Account Password (Visible to Admin) */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                      <label className="md:col-span-2 bg-amber-50/70 px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Login Username
                      </label>
                      <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                        <input
                          type="text"
                          name="loginUsername"
                          readOnly={isReadOnly}
                          value={formData.loginUsername || ''}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Username or Phone Number'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm font-mono font-bold text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>

                      <label className="md:col-span-2 bg-amber-50/70 px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Account Password
                      </label>
                      <div className="md:col-span-4 bg-white p-2">
                        <input
                          type="text"
                          name="loginPassword"
                          readOnly={isReadOnly}
                          value={formData.loginPassword || ''}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Farmer Account Password'}
                          className={`w-full bg-amber-50/60 px-2.5 py-1.5 text-sm font-mono font-black text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Row 3: Date */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Date
                      </label>
                      <div className="md:col-span-10 bg-white p-2">
                        <input
                          type="date"
                          name="date"
                          readOnly={isReadOnly}
                          value={formData.date}
                          onChange={handleFieldChange}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Row 4: Address (Full Width) */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                      <label className="md:col-span-2 bg-white px-4 py-4 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Address
                      </label>
                      <div className="md:col-span-10 bg-white p-2">
                        <input
                          type="text"
                          name="address"
                          readOnly={isReadOnly}
                          value={formData.address}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Complete Address'}
                          className={`w-full bg-white px-2.5 py-2 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Row 5: Pin Code | Village */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Pin Code
                      </label>
                      <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                        <input
                          type="text"
                          name="pinCode"
                          readOnly={isReadOnly}
                          value={formData.pinCode}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter 6-digit Pin Code'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>

                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Village
                      </label>
                      <div className="md:col-span-4 bg-white p-2">
                        <input
                          type="text"
                          name="villagePanchayat"
                          readOnly={isReadOnly}
                          value={formData.villagePanchayat}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Village'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Row 6: Taluk | District */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Taluk
                      </label>
                      <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                        <input
                          type="text"
                          name="taluk"
                          readOnly={isReadOnly}
                          value={formData.taluk}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Taluk'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>

                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        District
                      </label>
                      <div className="md:col-span-4 bg-white p-2">
                        {isReadOnly ? (
                          <input
                            type="text"
                            readOnly
                            value={formData.district || '-'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black cursor-default focus:outline-none"
                          />
                        ) : (
                          <div className="relative" ref={districtDropdownRef}>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !isDistrictDropdownOpen;
                                resetAllDropdowns();
                                setIsDistrictDropdownOpen(next);
                              }}
                              className="w-full bg-white px-2.5 py-1.5 text-sm text-black flex items-center justify-between border border-black rounded focus:outline-none cursor-pointer"
                            >
                              <span className={formData.district ? 'text-black font-semibold' : 'text-neutral-500'}>
                                {formData.district || '-- Select District --'}
                              </span>
                              <ChevronDown className="w-4 h-4 text-black shrink-0" />
                            </button>

                            {isDistrictDropdownOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                  <div className="text-[10px] font-bold text-black uppercase mb-1">
                                    Row 1: Other District (Type below)
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={customDistrictText}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCustomDistrictText(val);
                                        setFormData((prev) => ({ ...prev, district: val }));
                                      }}
                                      placeholder="Type custom district..."
                                      className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setIsDistrictDropdownOpen(false)}
                                      className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                                {availableStateDistricts.map((dist) => (
                                  <button
                                    key={dist}
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => ({ ...prev, district: dist }));
                                      setCustomDistrictText('');
                                      setIsDistrictDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                      formData.district === dist ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                    }`}
                                  >
                                    <span>{dist}</span>
                                    {formData.district === dist && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 7: State | Language */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        State
                      </label>
                      <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                        {isReadOnly ? (
                          <input
                            type="text"
                            readOnly
                            value={formData.state || '-'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black cursor-default focus:outline-none"
                          />
                        ) : (
                          <div className="relative" ref={stateDropdownRef}>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !isStateDropdownOpen;
                                resetAllDropdowns();
                                setIsStateDropdownOpen(next);
                              }}
                              className="w-full bg-white px-2.5 py-1.5 text-sm text-black flex items-center justify-between border border-black rounded focus:outline-none cursor-pointer"
                            >
                              <span className={formData.state ? 'text-black font-semibold' : 'text-neutral-500'}>
                                {formData.state || '-- Select State --'}
                              </span>
                              <ChevronDown className="w-4 h-4 text-black shrink-0" />
                            </button>

                            {isStateDropdownOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                  <div className="text-[10px] font-bold text-black uppercase mb-1">
                                    Row 1: Other State (Type below)
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={customStateText}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCustomStateText(val);
                                        setFormData((prev) => ({ ...prev, state: val }));
                                      }}
                                      placeholder="Type custom state..."
                                      className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setIsStateDropdownOpen(false)}
                                      className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                                {INDIAN_STATES.map((st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        state: st,
                                        district:
                                          STATE_DISTRICTS_MAP[st] && !STATE_DISTRICTS_MAP[st].includes(prev.district)
                                            ? ''
                                            : prev.district,
                                      }));
                                      setCustomStateText('');
                                      setIsStateDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                      formData.state === st ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                    }`}
                                  >
                                    <span>{st}</span>
                                    {formData.state === st && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Language
                      </label>
                      <div className="md:col-span-4 bg-white p-2">
                        <input
                          type="text"
                          name="language"
                          readOnly={isReadOnly}
                          value={formData.language}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Language'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Row 8: Location (Full Width) */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                      <label className="md:col-span-2 bg-white px-4 py-4 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Location
                      </label>
                      <div className="md:col-span-10 bg-white p-2">
                        <input
                          type="text"
                          name="jobWorkLocation"
                          readOnly={isReadOnly}
                          value={formData.jobWorkLocation}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Farm Location / Landmark'}
                          className={`w-full bg-white px-2.5 py-2 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Row 9: Farm Acreage | Soil Type */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Farm Acreage
                      </label>
                      <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                        <input
                          type="text"
                          name="acres"
                          readOnly={isReadOnly}
                          value={formData.acres}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Farm Acreage'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>

                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Soil Type
                      </label>
                      <div className="md:col-span-4 bg-white p-2">
                        {isReadOnly ? (
                          <input
                            type="text"
                            readOnly
                            value={formData.soilType || '-'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black cursor-default focus:outline-none"
                          />
                        ) : (
                          <div className="relative" ref={soilDropdownRef}>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !isSoilDropdownOpen;
                                resetAllDropdowns();
                                setIsSoilDropdownOpen(next);
                              }}
                              className="w-full bg-white px-2.5 py-1.5 text-sm text-black flex items-center justify-between border border-black rounded focus:outline-none cursor-pointer"
                            >
                              <span className={formData.soilType ? 'text-black font-semibold' : 'text-neutral-500'}>
                                {formData.soilType || '-- Select Soil Type --'}
                              </span>
                              <ChevronDown className="w-4 h-4 text-black shrink-0" />
                            </button>

                            {isSoilDropdownOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                  <div className="text-[10px] font-bold text-black uppercase mb-1">
                                    Row 1: Other Soil Type (Type below)
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={customSoilText}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCustomSoilText(val);
                                        setFormData((prev) => ({ ...prev, soilType: val }));
                                      }}
                                      placeholder="Type custom soil type..."
                                      className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setIsSoilDropdownOpen(false)}
                                      className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                                {BASE_SOIL_TYPES.map((soil) => (
                                  <button
                                    key={soil}
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => ({ ...prev, soilType: soil }));
                                      setCustomSoilText('');
                                      setIsSoilDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                      formData.soilType === soil ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                    }`}
                                  >
                                    <span>{soil}</span>
                                    {formData.soilType === soil && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 10: Irrigation Type | Water Source */}
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Irrigation Type
                      </label>
                      <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                        {isReadOnly ? (
                          <input
                            type="text"
                            readOnly
                            value={formData.irrigationType || '-'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black cursor-default focus:outline-none"
                          />
                        ) : (
                          <div className="relative" ref={irrigationDropdownRef}>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !isIrrigationDropdownOpen;
                                resetAllDropdowns();
                                setIsIrrigationDropdownOpen(next);
                              }}
                              className="w-full bg-white px-2.5 py-1.5 text-sm text-black flex items-center justify-between border border-black rounded focus:outline-none cursor-pointer"
                            >
                              <span className={formData.irrigationType ? 'text-black font-semibold' : 'text-neutral-500'}>
                                {formData.irrigationType || '-- Select Irrigation Type --'}
                              </span>
                              <ChevronDown className="w-4 h-4 text-black shrink-0" />
                            </button>

                            {isIrrigationDropdownOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                  <div className="text-[10px] font-bold text-black uppercase mb-1">
                                    Row 1: Other Irrigation Type (Type below)
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={customIrrigationText}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCustomIrrigationText(val);
                                        setFormData((prev) => ({ ...prev, irrigationType: val }));
                                      }}
                                      placeholder="Type custom irrigation..."
                                      className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setIsIrrigationDropdownOpen(false)}
                                      className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                                {BASE_IRRIGATION_TYPES.map((irr) => (
                                  <button
                                    key={irr}
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => ({ ...prev, irrigationType: irr }));
                                      setCustomIrrigationText('');
                                      setIsIrrigationDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                      formData.irrigationType === irr ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                    }`}
                                  >
                                    <span>{irr}</span>
                                    {formData.irrigationType === irr && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Water Source
                      </label>
                      <div className="md:col-span-4 bg-white p-2">
                        <input
                          type="text"
                          name="waterSource"
                          readOnly={isReadOnly}
                          value={formData.waterSource}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Water Source'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===================================================== */}
                {/* 2. CROP SELECTION                                     */}
                {/* ===================================================== */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-black flex items-center gap-2" style={{ color: '#000000' }}>
                      <span className="text-black font-black">2</span>
                      <span>Crop Selection</span>
                    </h3>
                    {!isReadOnly && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleOpenAddCropModal}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Crop</span>
                        </button>
                        {(formData.crop || formData.cropType || (formData.additionalCrops && formData.additionalCrops.length > 0)) && (
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteCropModal('primary', formData.crop || 'Crop #1')}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-xs transition cursor-pointer"
                            title="Delete this crop"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Crop</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border border-black rounded-lg bg-white text-black">
                    {/* Row 1: Crop type | Crop */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Crop type
                      </label>
                      <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                        {isReadOnly ? (
                          <input
                            type="text"
                            readOnly
                            value={formData.cropType || '-'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black cursor-default focus:outline-none"
                          />
                        ) : (
                          <div className="relative" ref={cropTypeDropdownRef}>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !isCropTypeDropdownOpen;
                                resetAllDropdowns();
                                setIsCropTypeDropdownOpen(next);
                              }}
                              className="w-full bg-white px-2.5 py-1.5 text-sm text-black flex items-center justify-between border border-black rounded focus:outline-none cursor-pointer"
                            >
                              <span className={formData.cropType ? 'text-black font-semibold' : 'text-neutral-500'}>
                                {formData.cropType || '-- Select Crop Type --'}
                              </span>
                              <ChevronDown className="w-4 h-4 text-black shrink-0" />
                            </button>

                            {isCropTypeDropdownOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                  <div className="text-[10px] font-bold text-black uppercase mb-1">
                                    Row 1: Other Crop Type (Type below)
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={customCropTypeText}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCustomCropTypeText(val);
                                        setFormData((prev) => ({ ...prev, cropType: val }));
                                      }}
                                      placeholder="Type custom crop type..."
                                      className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setIsCropTypeDropdownOpen(false)}
                                      className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                                {BASE_CROP_TYPES.map((ct) => (
                                  <button
                                    key={ct}
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => ({ ...prev, cropType: ct }));
                                      setCustomCropTypeText('');
                                      setIsCropTypeDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                      formData.cropType === ct ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                    }`}
                                  >
                                    <span>{ct}</span>
                                    {formData.cropType === ct && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Crop
                      </label>
                      <div className="md:col-span-4 bg-white p-2">
                        {isReadOnly ? (
                          <input
                            type="text"
                            readOnly
                            value={formData.crop || '-'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm font-bold text-black cursor-default focus:outline-none"
                          />
                        ) : (
                          <div className="relative" ref={cropDropdownRef}>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !isCropDropdownOpen;
                                resetAllDropdowns();
                                setIsCropDropdownOpen(next);
                              }}
                              className="w-full bg-white px-2.5 py-1.5 text-sm font-bold text-black flex items-center justify-between border border-black rounded focus:outline-none cursor-pointer"
                            >
                              <span className={formData.crop ? 'text-black font-bold' : 'text-neutral-500'}>
                                {formData.crop || '-- Select Crop --'}
                              </span>
                              <ChevronDown className="w-4 h-4 text-black shrink-0" />
                            </button>

                            {isCropDropdownOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                  <div className="text-[10px] font-bold text-black uppercase mb-1">
                                    Row 1: Other Crop (Type below)
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={customCropText}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCustomCropText(val);
                                        setFormData((prev) => ({ ...prev, crop: val }));
                                      }}
                                      placeholder="Type custom crop..."
                                      className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setIsCropDropdownOpen(false)}
                                      className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                                {BASE_CROPS.map((c) => (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => {
                                      const tmpl = POP_SCHEDULES_BY_CROP[c];
                                      setFormData((prev) => ({
                                        ...prev,
                                        crop: c,
                                        ...(tmpl
                                          ? {
                                              cropCycleDays: String(tmpl.days || prev.cropCycleDays),
                                              schedule: tmpl.schedule.map((s) => ({ ...s })),
                                            }
                                          : {}),
                                      }));
                                      setCustomCropText('');
                                      setIsCropDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                      formData.crop === c ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                    }`}
                                  >
                                    <span>{c}</span>
                                    {formData.crop === c && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Variety | Planting Date */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Variety
                      </label>
                      <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                        {isReadOnly ? (
                          <input
                            type="text"
                            name="variety"
                            readOnly
                            value={formData.variety || '-'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black cursor-default focus:outline-none"
                          />
                        ) : (
                          <div className="relative" ref={varietyDropdownRef}>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !isVarietyDropdownOpen;
                                resetAllDropdowns();
                                setIsVarietyDropdownOpen(next);
                              }}
                              className="w-full bg-white px-2.5 py-1.5 text-sm font-bold text-black flex items-center justify-between border border-black rounded focus:outline-none cursor-pointer"
                            >
                              <span className={formData.variety ? 'text-black font-bold' : 'text-neutral-500'}>
                                {formData.variety || '-- Select Variety --'}
                              </span>
                              <ChevronDown className="w-4 h-4 text-black shrink-0" />
                            </button>

                            {isVarietyDropdownOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                  <div className="text-[10px] font-bold text-black uppercase mb-1">
                                    Row 1: Other Variety (Type below)
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={customVarietyText}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCustomVarietyText(val);
                                        setFormData((prev) => ({ ...prev, variety: val }));
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          setIsVarietyDropdownOpen(false);
                                        }
                                      }}
                                      placeholder="Type custom variety..."
                                      className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setIsVarietyDropdownOpen(false)}
                                      className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                                {CROP_VARIETIES_BY_CATEGORY.map((group) => (
                                  <div key={group.category} className="py-1">
                                    <div className="px-3 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-black border-y border-neutral-200">
                                      {group.category}
                                    </div>
                                    {group.varieties.map((varOpt) => (
                                      <button
                                        key={varOpt}
                                        type="button"
                                        onClick={() => {
                                          setFormData((prev) => ({ ...prev, variety: varOpt }));
                                          setCustomVarietyText('');
                                          setIsVarietyDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                          formData.variety === varOpt ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                        }`}
                                      >
                                        <span>{varOpt}</span>
                                        {formData.variety === varOpt && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                      </button>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Planting Date
                      </label>
                      <div className="md:col-span-4 bg-white p-2">
                        <input
                          type="date"
                          name="plantingDate"
                          readOnly={isReadOnly}
                          value={formData.plantingDate}
                          onChange={handleFieldChange}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Row 3: Crop Age | Crop Acreage */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Crop Age
                      </label>
                      <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                        <input
                          type="text"
                          name="cropAge"
                          readOnly={isReadOnly}
                          value={formData.cropAge}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Crop Age (e.g. 28 Days)'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black font-semibold placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>

                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Crop Acreage
                      </label>
                      <div className="md:col-span-4 bg-white p-2">
                        <input
                          type="text"
                          name="cropAcreage"
                          readOnly={isReadOnly}
                          value={formData.cropAcreage}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Crop Acreage'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Row 4: Plant Count | Spacing */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Plant Count
                      </label>
                      <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                        <input
                          type="text"
                          name="plantCount"
                          readOnly={isReadOnly}
                          value={formData.plantCount}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Plant Count'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>

                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Spacing
                      </label>
                      <div className="md:col-span-4 bg-white p-2">
                        <input
                          type="text"
                          name="spacing"
                          readOnly={isReadOnly}
                          value={formData.spacing || ''}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Spacing (e.g. 60 cm x 20 cm)'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Row 5: Current Crop Stage | Survey Number */}
                    <div className="grid grid-cols-1 md:grid-cols-12 rounded-b-lg">
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black rounded-bl-lg">
                        Current Crop Stage
                      </label>
                      <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                        <input
                          type="text"
                          name="currentCropStage"
                          readOnly={isReadOnly}
                          value={formData.currentCropStage || ''}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Current Crop Stage'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black font-semibold placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>

                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Survey Number
                      </label>
                      <div className="md:col-span-4 bg-white p-2 rounded-br-lg">
                        <input
                          type="text"
                          name="surveyNumber"
                          readOnly={isReadOnly}
                          value={formData.surveyNumber || ''}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Survey Number'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black font-semibold placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Crop Blocks */}
                  {(formData.additionalCrops || []).map((cropBlock, index) => (
                    <div key={cropBlock.id} className="border border-black rounded-lg bg-white text-black mt-4">
                      <div className="bg-emerald-50 border-b border-black px-4 py-2 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-black">
                          Additional Crop #{index + 2}
                        </span>
                        {!isReadOnly && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleOpenAddCropModal}
                              className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add New Crop</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenDeleteCropModal(cropBlock.id, cropBlock.crop || `Additional Crop #${index + 2}`)}
                              className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete Crop</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Row 1: Crop type | Crop */}
                      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                        <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                          Crop type
                        </label>
                        <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                          {isReadOnly ? (
                            <input
                              type="text"
                              readOnly
                              value={cropBlock.cropType || '-'}
                              className="w-full bg-white px-2.5 py-1.5 text-sm text-black cursor-default"
                            />
                          ) : (
                            <select
                              value={cropBlock.cropType}
                              onChange={(e) => handleUpdateAdditionalCrop(cropBlock.id, 'cropType', e.target.value)}
                              className="w-full bg-white px-2.5 py-1.5 text-sm text-black border border-black rounded focus:outline-none"
                            >
                              <option value="">-- Select Crop Type --</option>
                              {BASE_CROP_TYPES.map((ct) => (
                                <option key={ct} value={ct}>
                                  {ct}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                          Crop
                        </label>
                        <div className="md:col-span-4 bg-white p-2">
                          {isReadOnly ? (
                            <input
                              type="text"
                              readOnly
                              value={cropBlock.crop || '-'}
                              className="w-full bg-white px-2.5 py-1.5 text-sm font-bold text-black cursor-default"
                            />
                          ) : (
                            <select
                              value={cropBlock.crop}
                              onChange={(e) => handleUpdateAdditionalCrop(cropBlock.id, 'crop', e.target.value)}
                              className="w-full bg-white px-2.5 py-1.5 text-sm font-bold text-black border border-black rounded focus:outline-none"
                            >
                              <option value="">-- Select Crop --</option>
                              {BASE_CROPS.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Variety | Planting Date */}
                      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                        <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                          Variety
                        </label>
                        <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                          {isReadOnly ? (
                            <input
                              type="text"
                              readOnly
                              value={cropBlock.variety || '-'}
                              className="w-full bg-white px-2.5 py-1.5 text-sm text-black cursor-default focus:outline-none rounded"
                            />
                          ) : (
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setExtraVarietyOpenId((prev) => (prev === cropBlock.id ? null : cropBlock.id))
                                }
                                className="w-full bg-white px-2.5 py-1.5 text-sm font-bold text-black flex items-center justify-between border border-black rounded focus:outline-none cursor-pointer"
                              >
                                <span className={cropBlock.variety ? 'text-black font-bold' : 'text-neutral-500'}>
                                  {cropBlock.variety || '-- Select Variety --'}
                                </span>
                                <ChevronDown className="w-4 h-4 text-black shrink-0" />
                              </button>

                              {extraVarietyOpenId === cropBlock.id && (
                                <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                  <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                    <div className="text-[10px] font-bold text-black uppercase mb-1">
                                      Row 1: Other Variety (Type below)
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="text"
                                        value={extraVarietyInputs[cropBlock.id] || ''}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setExtraVarietyInputs((prev) => ({ ...prev, [cropBlock.id]: val }));
                                          handleUpdateAdditionalCrop(cropBlock.id, 'variety', val);
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            setExtraVarietyOpenId(null);
                                          }
                                        }}
                                        placeholder="Type custom variety..."
                                        className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setExtraVarietyOpenId(null)}
                                        className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>
                                  {CROP_VARIETIES_BY_CATEGORY.map((group) => (
                                    <div key={group.category} className="py-1">
                                      <div className="px-3 py-1 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-black border-y border-neutral-200">
                                        {group.category}
                                      </div>
                                      {group.varieties.map((varOpt) => (
                                        <button
                                          key={varOpt}
                                          type="button"
                                          onClick={() => {
                                            handleUpdateAdditionalCrop(cropBlock.id, 'variety', varOpt);
                                            setExtraVarietyInputs((prev) => ({ ...prev, [cropBlock.id]: '' }));
                                            setExtraVarietyOpenId(null);
                                          }}
                                          className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                            cropBlock.variety === varOpt ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                          }`}
                                        >
                                          <span>{varOpt}</span>
                                          {cropBlock.variety === varOpt && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                        </button>
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                          Planting Date
                        </label>
                        <div className="md:col-span-4 bg-white p-2">
                          <input
                            type="date"
                            readOnly={isReadOnly}
                            value={cropBlock.plantingDate}
                            onChange={(e) => handleUpdateAdditionalCrop(cropBlock.id, 'plantingDate', e.target.value)}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black focus:outline-none rounded"
                          />
                        </div>
                      </div>

                      {/* Row 3: Crop Age | Crop Acreage */}
                      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                        <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                          Crop Age
                        </label>
                        <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                          <input
                            type="text"
                            readOnly={isReadOnly}
                            value={cropBlock.cropAge}
                            onChange={(e) => handleUpdateAdditionalCrop(cropBlock.id, 'cropAge', e.target.value)}
                            placeholder={isReadOnly ? '-' : 'Enter Crop Age'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black font-semibold focus:outline-none rounded"
                          />
                        </div>

                        <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                          Crop Acreage
                        </label>
                        <div className="md:col-span-4 bg-white p-2">
                          <input
                            type="text"
                            readOnly={isReadOnly}
                            value={cropBlock.cropAcreage}
                            onChange={(e) => handleUpdateAdditionalCrop(cropBlock.id, 'cropAcreage', e.target.value)}
                            placeholder={isReadOnly ? '-' : 'Enter Crop Acreage'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black focus:outline-none rounded"
                          />
                        </div>
                      </div>

                      {/* Row 4: Plant Count | Spacing */}
                      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                        <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                          Plant Count
                        </label>
                        <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                          <input
                            type="text"
                            readOnly={isReadOnly}
                            value={cropBlock.plantCount}
                            onChange={(e) => handleUpdateAdditionalCrop(cropBlock.id, 'plantCount', e.target.value)}
                            placeholder={isReadOnly ? '-' : 'Enter Plant Count'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black focus:outline-none rounded"
                          />
                        </div>

                        <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                          Spacing
                        </label>
                        <div className="md:col-span-4 bg-white p-2">
                          <input
                            type="text"
                            readOnly={isReadOnly}
                            value={cropBlock.spacing}
                            onChange={(e) => handleUpdateAdditionalCrop(cropBlock.id, 'spacing', e.target.value)}
                            placeholder={isReadOnly ? '-' : 'Enter Spacing'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black focus:outline-none rounded"
                          />
                        </div>
                      </div>

                      {/* Row 5: Current Crop Stage | Survey Number */}
                      <div className="grid grid-cols-1 md:grid-cols-12 rounded-b-lg">
                        <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black rounded-bl-lg">
                          Current Crop Stage
                        </label>
                        <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                          <input
                            type="text"
                            readOnly={isReadOnly}
                            value={cropBlock.currentCropStage || ''}
                            onChange={(e) =>
                              handleUpdateAdditionalCrop(
                                cropBlock.id,
                                'currentCropStage',
                                e.target.value
                              )
                            }
                            placeholder={isReadOnly ? '-' : 'Enter Current Crop Stage'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black focus:outline-none rounded"
                          />
                        </div>

                        <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                          Survey Number
                        </label>
                        <div className="md:col-span-4 bg-white p-2 rounded-br-lg">
                          <input
                            type="text"
                            readOnly={isReadOnly}
                            value={cropBlock.surveyNumber || ''}
                            onChange={(e) =>
                              handleUpdateAdditionalCrop(
                                cropBlock.id,
                                'surveyNumber',
                                e.target.value
                              )
                            }
                            placeholder={isReadOnly ? '-' : 'Enter Survey Number'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black focus:outline-none rounded"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ===================================================== */}
                {/* 3. CROP REQUIREMENTS AND SERVICES                     */}
                {/* ===================================================== */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-black flex items-center gap-2" style={{ color: '#000000' }}>
                    <span className="text-black font-black">3</span>
                    <span>Crop Requirements and Services</span>
                  </h3>

                  <div className="border border-black rounded-lg divide-y divide-black bg-white text-black">
                    {/* 1. Crop Stage (Dropdown) */}
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <label className="md:col-span-3 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Crop Stage
                      </label>
                      <div className="md:col-span-9 bg-white p-2">
                        {isReadOnly ? (
                          <input
                            type="text"
                            readOnly
                            value={formData.cropStage || '-'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black cursor-default"
                          />
                        ) : (
                          <div className="relative" ref={cropStageDropdownRef}>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !isCropStageDropdownOpen;
                                resetAllDropdowns();
                                setIsCropStageDropdownOpen(next);
                              }}
                              className="w-full bg-white px-2.5 py-1.5 text-sm text-black flex items-center justify-between border border-black rounded focus:outline-none cursor-pointer"
                            >
                              <span className={formData.cropStage ? 'text-black font-semibold' : 'text-neutral-500'}>
                                {formData.cropStage || '-- Select Crop Stage --'}
                              </span>
                              <ChevronDown className="w-4 h-4 text-black shrink-0" />
                            </button>

                            {isCropStageDropdownOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                  <div className="text-[10px] font-bold text-black uppercase mb-1">
                                    Row 1: Other Crop Stage (Type below)
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={customCropStageText}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCustomCropStageText(val);
                                        setFormData((prev) => ({ ...prev, cropStage: val }));
                                      }}
                                      placeholder="Type custom crop stage..."
                                      className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setIsCropStageDropdownOpen(false)}
                                      className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                                {BASE_CROP_STAGES.map((st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => ({ ...prev, cropStage: st }));
                                      setCustomCropStageText('');
                                      setIsCropStageDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                      formData.cropStage === st ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                    }`}
                                  >
                                    <span>{st}</span>
                                    {formData.cropStage === st && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3. Main Requirement (Dropdown) */}
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <label className="md:col-span-3 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Main Requirement
                      </label>
                      <div className="md:col-span-9 bg-white p-2">
                        {isReadOnly ? (
                          <input
                            type="text"
                            readOnly
                            value={formData.mainRequirement || '-'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black cursor-default"
                          />
                        ) : (
                          <div className="relative" ref={mainRequirementDropdownRef}>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !isMainRequirementDropdownOpen;
                                resetAllDropdowns();
                                setIsMainRequirementDropdownOpen(next);
                              }}
                              className="w-full bg-white px-2.5 py-1.5 text-sm text-black flex items-center justify-between border border-black rounded focus:outline-none cursor-pointer"
                            >
                              <span className={formData.mainRequirement ? 'text-black font-semibold' : 'text-neutral-500'}>
                                {formData.mainRequirement || '-- Select Main Requirement --'}
                              </span>
                              <ChevronDown className="w-4 h-4 text-black shrink-0" />
                            </button>

                            {isMainRequirementDropdownOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                  <div className="text-[10px] font-bold text-black uppercase mb-1">
                                    Row 1: Other Main Requirement (Type below)
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={customMainRequirementText}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCustomMainRequirementText(val);
                                        setFormData((prev) => ({ ...prev, mainRequirement: val }));
                                      }}
                                      placeholder="Type custom main requirement..."
                                      className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setIsMainRequirementDropdownOpen(false)}
                                      className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                                {BASE_MAIN_REQUIREMENTS.map((req) => (
                                  <button
                                    key={req}
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => ({ ...prev, mainRequirement: req }));
                                      setCustomMainRequirementText('');
                                      setIsMainRequirementDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                      formData.mainRequirement === req ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                    }`}
                                  >
                                    <span>{req}</span>
                                    {formData.mainRequirement === req && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 4. Problem Type (Dropdown) */}
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <label className="md:col-span-3 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Problem Type
                      </label>
                      <div className="md:col-span-9 bg-white p-2">
                        {isReadOnly ? (
                          <input
                            type="text"
                            readOnly
                            value={formData.problemType || '-'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black cursor-default"
                          />
                        ) : (
                          <div className="relative" ref={problemTypeDropdownRef}>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !isProblemTypeDropdownOpen;
                                resetAllDropdowns();
                                setIsProblemTypeDropdownOpen(next);
                              }}
                              className="w-full bg-white px-2.5 py-1.5 text-sm text-black flex items-center justify-between border border-black rounded focus:outline-none cursor-pointer"
                            >
                              <span className={formData.problemType ? 'text-black font-semibold' : 'text-neutral-500'}>
                                {formData.problemType || '-- Select Problem Type --'}
                              </span>
                              <ChevronDown className="w-4 h-4 text-black shrink-0" />
                            </button>

                            {isProblemTypeDropdownOpen && (
                              <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                  <div className="text-[10px] font-bold text-black uppercase mb-1">
                                    Row 1: Other Problem Type (Type below)
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={customProblemTypeText}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setCustomProblemTypeText(val);
                                        setFormData((prev) => ({ ...prev, problemType: val }));
                                      }}
                                      placeholder="Type custom problem type..."
                                      className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setIsProblemTypeDropdownOpen(false)}
                                      className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                                {BASE_PROBLEM_TYPES.map((prob) => (
                                  <button
                                    key={prob}
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => ({ ...prev, problemType: prob }));
                                      setCustomProblemTypeText('');
                                      setIsProblemTypeDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                      formData.problemType === prob ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                    }`}
                                  >
                                    <span>{prob}</span>
                                    {formData.problemType === prob && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 6. Application Method */}
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <label className="md:col-span-3 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Application Method
                      </label>
                      <div className="md:col-span-9 bg-white p-2">
                        <input
                          type="text"
                          name="applicationMethod"
                          readOnly={isReadOnly}
                          value={formData.applicationMethod}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Application Method'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* 7. Service Type */}
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <label className="md:col-span-3 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Service Type
                      </label>
                      <div className="md:col-span-9 bg-white p-2">
                        <input
                          type="text"
                          name="serviceType"
                          readOnly={isReadOnly}
                          value={formData.serviceType}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Service Type'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* 8. Materials Required (Yes/No + Dropdown) */}
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <label className="md:col-span-3 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Materials Required
                      </label>
                      <div className="md:col-span-9 bg-white p-2">
                        {isReadOnly ? (
                          <input
                            type="text"
                            readOnly
                            value={formData.farmMaterial || '-'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black cursor-default"
                          />
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setMaterialRequiredChoice('Yes')}
                                className={`px-3.5 py-1 rounded text-xs font-bold border border-black cursor-pointer ${
                                  materialRequiredChoice === 'Yes'
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-white text-black hover:bg-neutral-100'
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setMaterialRequiredChoice('No');
                                  setFormData((prev) => ({ ...prev, farmMaterial: 'Not Required' }));
                                  setIsMaterialDropdownOpen(false);
                                }}
                                className={`px-3.5 py-1 rounded text-xs font-bold border border-black cursor-pointer ${
                                  materialRequiredChoice === 'No'
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-white text-black hover:bg-neutral-100'
                                }`}
                              >
                                No
                              </button>
                            </div>

                            {materialRequiredChoice === 'Yes' && (
                              <div className="relative" ref={materialDropdownRef}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = !isMaterialDropdownOpen;
                                    resetAllDropdowns();
                                    setIsMaterialDropdownOpen(next);
                                  }}
                                  className="w-full bg-white px-2.5 py-1.5 text-sm text-black flex items-center justify-between border border-black rounded focus:outline-none cursor-pointer"
                                >
                                  <span className={formData.farmMaterial ? 'text-black font-semibold' : 'text-neutral-500'}>
                                    {formData.farmMaterial || '-- Select Material Required --'}
                                  </span>
                                  <ChevronDown className="w-4 h-4 text-black shrink-0" />
                                </button>

                                {isMaterialDropdownOpen && (
                                  <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                    <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                      <div className="text-[10px] font-bold text-black uppercase mb-1">
                                        Row 1: Other Material (Type below)
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="text"
                                          value={customMaterialText}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setCustomMaterialText(val);
                                            setFormData((prev) => ({ ...prev, farmMaterial: val }));
                                          }}
                                          placeholder="Type custom farm material..."
                                          className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setIsMaterialDropdownOpen(false)}
                                          className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                        >
                                          Done
                                        </button>
                                      </div>
                                    </div>
                                    {BASE_MATERIAL_OPTIONS.map((mat) => (
                                      <button
                                        key={mat}
                                        type="button"
                                        onClick={() => {
                                          setFormData((prev) => ({ ...prev, farmMaterial: mat }));
                                          setCustomMaterialText('');
                                          setIsMaterialDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                          formData.farmMaterial === mat ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                        }`}
                                      >
                                        <span>{mat}</span>
                                        {formData.farmMaterial === mat && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 9. Equipment Required (Yes/No + Dropdown) */}
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <label className="md:col-span-3 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Equipment Required
                      </label>
                      <div className="md:col-span-9 bg-white p-2">
                        {isReadOnly ? (
                          <input
                            type="text"
                            readOnly
                            value={formData.equipment || '-'}
                            className="w-full bg-white px-2.5 py-1.5 text-sm text-black cursor-default"
                          />
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEquipmentRequiredChoice('Yes')}
                                className={`px-3.5 py-1 rounded text-xs font-bold border border-black cursor-pointer ${
                                  equipmentRequiredChoice === 'Yes'
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-white text-black hover:bg-neutral-100'
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEquipmentRequiredChoice('No');
                                  setFormData((prev) => ({ ...prev, equipment: 'Not Required' }));
                                  setIsEquipmentDropdownOpen(false);
                                }}
                                className={`px-3.5 py-1 rounded text-xs font-bold border border-black cursor-pointer ${
                                  equipmentRequiredChoice === 'No'
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-white text-black hover:bg-neutral-100'
                                }`}
                              >
                                No
                              </button>
                            </div>

                            {equipmentRequiredChoice === 'Yes' && (
                              <div className="relative" ref={equipmentDropdownRef}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = !isEquipmentDropdownOpen;
                                    resetAllDropdowns();
                                    setIsEquipmentDropdownOpen(next);
                                  }}
                                  className="w-full bg-white px-2.5 py-1.5 text-sm text-black flex items-center justify-between border border-black rounded focus:outline-none cursor-pointer"
                                >
                                  <span className={formData.equipment ? 'text-black font-semibold' : 'text-neutral-500'}>
                                    {formData.equipment || '-- Select Equipment Required --'}
                                  </span>
                                  <ChevronDown className="w-4 h-4 text-black shrink-0" />
                                </button>

                                {isEquipmentDropdownOpen && (
                                  <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                    <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                      <div className="text-[10px] font-bold text-black uppercase mb-1">
                                        Row 1: Other Equipment (Type below)
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="text"
                                          value={customEquipmentText}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setCustomEquipmentText(val);
                                            setFormData((prev) => ({ ...prev, equipment: val }));
                                          }}
                                          placeholder="Type custom equipment..."
                                          className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => setIsEquipmentDropdownOpen(false)}
                                          className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                        >
                                          Done
                                        </button>
                                      </div>
                                    </div>
                                    {BASE_EQUIPMENT_OPTIONS.map((eq) => (
                                      <button
                                        key={eq}
                                        type="button"
                                        onClick={() => {
                                          setFormData((prev) => ({ ...prev, equipment: eq }));
                                          setCustomEquipmentText('');
                                          setIsEquipmentDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                          formData.equipment === eq ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                        }`}
                                      >
                                        <span>{eq}</span>
                                        {formData.equipment === eq && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 10. Harvest Planning */}
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <label className="md:col-span-3 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Harvest Planning
                      </label>
                      <div className="md:col-span-9 bg-white p-2">
                        <input
                          type="text"
                          name="harvestPlanning"
                          readOnly={isReadOnly}
                          value={formData.harvestPlanning}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Harvest Planning'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* 11. Packaging Type */}
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <label className="md:col-span-3 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Packaging Type
                      </label>
                      <div className="md:col-span-9 bg-white p-2">
                        <input
                          type="text"
                          name="packagingType"
                          readOnly={isReadOnly}
                          value={formData.packagingType}
                          onChange={handleFieldChange}
                          placeholder={isReadOnly ? '-' : 'Enter Packaging Type'}
                          className={`w-full bg-white px-2.5 py-1.5 text-sm text-black placeholder:text-neutral-500 focus:outline-none rounded ${
                            isReadOnly ? 'cursor-default' : 'focus:ring-1 focus:ring-black'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons — Placed Above Package of Practice (POP) Activity Schedule Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="text-xs text-slate-600 space-y-0.5 text-center sm:text-left">
                  <div className="font-bold text-slate-900 text-sm">
                    {modalMode === 'VIEW'
                      ? 'Viewing Farmer Data Form & POP'
                      : 'Ready to submit Farmer Data Form & POP?'}
                  </div>
                  <div>
                    Submission immediately updates the Agri-Mart Procurement & Agronomy Registry.
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setModalMode(null);
                      setActiveRecord(null);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-black bg-white text-black hover:bg-neutral-100 font-bold cursor-pointer"
                  >
                    {modalMode === 'VIEW' ? 'Close' : 'Cancel'}
                  </button>

                  {modalMode !== 'VIEW' && (
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {saving
                          ? 'Saving...'
                          : modalMode === 'EDIT'
                          ? 'Update Farmer Form'
                          : 'Submit Digital Form'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* ===================================================================== */}
              {/* 4. Package of Practice (POP) Activity Schedule Table                  */}
              {/* ===================================================================== */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5 text-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black">
                      4
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Package of Practice (POP) Activity Schedule Table
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Crop Progress, Stage-Wise Agronomic Details & Verified Solutions ({formData.crop || 'Maize'})
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Master POP Schedule Table Enable/Disable Switch Toggle */}
                    <button
                      type="button"
                      onClick={async () => {
                        const nextVal = formData.isPopTableEnabled === false ? true : false;
                        setFormData((prev) => ({
                          ...prev,
                          isPopTableEnabled: nextVal,
                        }));
                        try {
                          await fetch('/api/package-of-practice', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              action: 'TOGGLE_POP_TABLE',
                              recordId: activeRecord?.id || formData.id || '',
                              isPopTableEnabled: nextVal,
                            }),
                          });
                        } catch {
                          // local state updated
                        }
                      }}
                      title={
                        formData.isPopTableEnabled !== false
                          ? 'Click to disable POP Activity Schedule Table'
                          : 'Click to enable POP Activity Schedule Table'
                      }
                      className="bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-1.5 rounded-full inline-flex items-center gap-2.5 transition shadow-xs cursor-pointer select-none"
                    >
                      <span
                        className={`text-xs font-bold transition-colors ${
                          formData.isPopTableEnabled !== false ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {formData.isPopTableEnabled !== false ? 'Enabled' : 'Disabled'}
                      </span>
                      <div
                        className={`relative inline-flex h-5 w-10 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                          formData.isPopTableEnabled !== false ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                            formData.isPopTableEnabled !== false ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </button>

                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={handleAddScheduleStage}
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Stage Row</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Notice when POP Schedule is Disabled in Backend */}
                {formData.isPopTableEnabled === false && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" />
                      <span>
                        <strong>POP Activity Schedule Table is Disabled:</strong> This section is hidden on the farmer frontend, but fully preserved here in the backend for management.
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 uppercase bg-rose-100 px-2 py-0.5 rounded shrink-0">
                      Backend Only
                    </span>
                  </div>
                )}

                {/* POP Activity Schedule Table (Clean Inline Editable with Thin Gray Scrollbar) */}
                <style>{`
                  .pop-thin-scroll::-webkit-scrollbar {
                    width: 2.5px;
                    height: 2.5px;
                  }
                  .pop-thin-scroll::-webkit-scrollbar-button {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                  }
                  .pop-thin-scroll::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .pop-thin-scroll::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 9999px;
                  }
                  .pop-thin-scroll::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                  }
                  .pop-thin-scroll::-webkit-scrollbar-corner {
                    background: transparent;
                  }
                  .pop-table-x-scroll::-webkit-scrollbar {
                    height: 6px;
                  }
                  .pop-table-x-scroll::-webkit-scrollbar-button {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                  }
                  .pop-table-x-scroll::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 9999px;
                  }
                  .pop-table-x-scroll::-webkit-scrollbar-thumb {
                    background: #94a3b8;
                    border-radius: 9999px;
                  }
                  .pop-table-x-scroll::-webkit-scrollbar-thumb:hover {
                    background: #64748b;
                  }
                `}</style>
                <div className="overflow-x-auto rounded-xl border border-slate-200 pop-table-x-scroll">
                  <table className="w-full text-left text-xs border-collapse min-w-[1150px]">
                    <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3 border-r border-white/10 w-40">Sown Date & Stage</th>
                        <th className="p-3 border-r border-white/10 w-28">Crop Progress</th>
                        <th className="p-3 border-r border-white/10 w-40">Soil Preparation</th>
                        <th className="p-3 border-r border-white/10 w-40">Manuring</th>
                        <th className="p-3 border-r border-white/10 w-36">Irrigation</th>
                        <th className="p-3 border-r border-white/10 w-36">Weeding</th>
                        <th className="p-3 border-r border-white/10 w-40">Spraying</th>
                        <th className="p-3 border-r border-white/10 w-36">Maintenance</th>
                        <th className="p-3 border-r border-white/10 w-36">Harvesting</th>
                        <th className="p-3 w-56 bg-emerald-950 text-emerald-300">
                          Problem & Solution
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {activeSchedule.map((row, idx) => {
                        const status = getStageStatus(row);

                        return (
                          <tr key={row.id || idx} className="align-top hover:bg-slate-50/40">
                            {/* 1. Sown Date & Stage */}
                            <td className="p-2 border-r border-slate-200">
                              {isReadOnly ? (
                                <>
                                  <div className="font-bold text-emerald-800">{row.sownDate}</div>
                                  <div className="text-[11px] font-semibold text-slate-600">
                                    {row.stageName}
                                  </div>
                                  <div className="text-[10px] font-mono text-slate-400">
                                    {row.dayRange}
                                  </div>
                                  <div className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 flex items-center justify-between gap-1 shadow-2xs mt-1 select-none">
                                    <span
                                      className={`text-[10px] font-bold ${
                                        row.isEnabled !== false ? 'text-emerald-600' : 'text-rose-600'
                                      }`}
                                    >
                                      {row.isEnabled !== false ? 'Enabled' : 'Disabled'}
                                    </span>
                                    <div
                                      className={`relative inline-flex h-4 w-8 shrink-0 items-center rounded-full p-0.5 ${
                                        row.isEnabled !== false ? 'bg-emerald-500' : 'bg-rose-500'
                                      }`}
                                    >
                                      <span
                                        className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ${
                                          row.isEnabled !== false ? 'translate-x-4' : 'translate-x-0'
                                        }`}
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="space-y-1">
                                  <input
                                    type="text"
                                    value={row.sownDate || ''}
                                    onChange={(e) => handleScheduleRowChange(idx, 'sownDate', e.target.value)}
                                    placeholder="Day 0 (Sowing)"
                                    className="w-full bg-white font-bold text-emerald-800 text-xs px-2 py-1 rounded-md border border-emerald-500/40 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                  />
                                  <textarea
                                    rows={2}
                                    value={row.stageName || ''}
                                    onChange={(e) => handleScheduleRowChange(idx, 'stageName', e.target.value)}
                                    placeholder="Stage Name"
                                    className="w-full bg-white text-[11px] font-semibold text-slate-700 px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-snug focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                  />
                                  <input
                                    type="text"
                                    value={row.dayRange || ''}
                                    onChange={(e) => handleScheduleRowChange(idx, 'dayRange', e.target.value)}
                                    placeholder="Day 0 – Day 20"
                                    className="w-full bg-white text-[10px] font-mono text-slate-500 px-2 py-1 rounded-md border border-emerald-500/40 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                  />

                                  {/* Enable / Disable Switch Toggle for Stage Row */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = row.isEnabled !== false;
                                      handleScheduleRowChange(idx, 'isEnabled', !current);
                                    }}
                                    title={
                                      row.isEnabled !== false
                                        ? 'Click to disable this stage row'
                                        : 'Click to enable this stage row'
                                    }
                                    className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-md px-2 py-1 flex items-center justify-between gap-1 shadow-2xs cursor-pointer select-none transition-colors"
                                  >
                                    <span
                                      className={`text-[10px] font-bold transition-colors ${
                                        row.isEnabled !== false ? 'text-emerald-600' : 'text-rose-600'
                                      }`}
                                    >
                                      {row.isEnabled !== false ? 'Enabled' : 'Disabled'}
                                    </span>
                                    <div
                                      className={`relative inline-flex h-4 w-8 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out p-0.5 ${
                                        row.isEnabled !== false ? 'bg-emerald-500' : 'bg-rose-500'
                                      }`}
                                    >
                                      <span
                                        className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
                                          row.isEnabled !== false ? 'translate-x-4' : 'translate-x-0'
                                        }`}
                                      />
                                    </div>
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* 2. Crop Progress */}
                            <td className="p-2 border-r border-slate-200">
                              {isReadOnly ? (
                                <>
                                  {status === 'COMPLETED' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                      <Check className="w-3 h-3" /> Completed
                                    </span>
                                  )}
                                  {status === 'CURRENT' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                                      <Clock className="w-3 h-3" /> Active Stage
                                    </span>
                                  )}
                                  {status === 'UPCOMING' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                                      Upcoming
                                    </span>
                                  )}
                                </>
                              ) : (
                                <div className="space-y-2">
                                  <select
                                    value={status}
                                    onChange={(e) =>
                                      handleScheduleRowChange(
                                        idx,
                                        'stageStatus',
                                        e.target.value as 'COMPLETED' | 'CURRENT' | 'UPCOMING'
                                      )
                                    }
                                    className={`px-2 py-1 rounded-full text-[10px] font-bold border border-emerald-500/30 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer ${
                                      status === 'COMPLETED'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : status === 'CURRENT'
                                        ? 'bg-amber-100 text-amber-900'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    <option value="COMPLETED">✓ Completed</option>
                                    <option value="CURRENT">Active Stage</option>
                                    <option value="UPCOMING">Upcoming</option>
                                  </select>
                                  {activeSchedule.length > 1 && (
                                    <div>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveScheduleStage(idx)}
                                        className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold inline-flex items-center gap-0.5 cursor-pointer"
                                        title="Remove stage row"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* 3. Soil Preparation */}
                            <td className="p-2 border-r border-slate-200 text-[11px]">
                              {isReadOnly ? (
                                row.soilPrep
                              ) : (
                                <textarea
                                  rows={4}
                                  value={row.soilPrep || ''}
                                  onChange={(e) => handleScheduleRowChange(idx, 'soilPrep', e.target.value)}
                                  placeholder="Soil preparation..."
                                  className="w-full bg-white text-[11px] text-slate-800 px-2 py-1.5 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              )}
                            </td>

                            {/* 4. Manuring */}
                            <td className="p-2 border-r border-slate-200 text-[11px]">
                              {isReadOnly ? (
                                row.manuring
                              ) : (
                                <textarea
                                  rows={4}
                                  value={row.manuring || ''}
                                  onChange={(e) => handleScheduleRowChange(idx, 'manuring', e.target.value)}
                                  placeholder="Manuring..."
                                  className="w-full bg-white text-[11px] text-slate-800 px-2 py-1.5 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              )}
                            </td>

                            {/* 5. Irrigation */}
                            <td className="p-2 border-r border-slate-200 text-[11px]">
                              {isReadOnly ? (
                                row.irrigation
                              ) : (
                                <textarea
                                  rows={4}
                                  value={row.irrigation || ''}
                                  onChange={(e) => handleScheduleRowChange(idx, 'irrigation', e.target.value)}
                                  placeholder="Irrigation..."
                                  className="w-full bg-white text-[11px] text-slate-800 px-2 py-1.5 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              )}
                            </td>

                            {/* 6. Weeding */}
                            <td className="p-2 border-r border-slate-200 text-[11px]">
                              {isReadOnly ? (
                                row.weedingSchedule
                              ) : (
                                <textarea
                                  rows={4}
                                  value={row.weedingSchedule || ''}
                                  onChange={(e) => handleScheduleRowChange(idx, 'weedingSchedule', e.target.value)}
                                  placeholder="Weeding..."
                                  className="w-full bg-white text-[11px] text-slate-800 px-2 py-1.5 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              )}
                            </td>

                            {/* 7. Spraying */}
                            <td className="p-2 border-r border-slate-200 text-[11px]">
                              {isReadOnly ? (
                                row.sprayingSchedule
                              ) : (
                                <textarea
                                  rows={4}
                                  value={row.sprayingSchedule || ''}
                                  onChange={(e) => handleScheduleRowChange(idx, 'sprayingSchedule', e.target.value)}
                                  placeholder="Spraying..."
                                  className="w-full bg-white text-[11px] text-slate-800 px-2 py-1.5 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              )}
                            </td>

                            {/* 8. Maintenance */}
                            <td className="p-2 border-r border-slate-200 text-[11px]">
                              {isReadOnly ? (
                                row.maintenanceSchedule
                              ) : (
                                <textarea
                                  rows={4}
                                  value={row.maintenanceSchedule || ''}
                                  onChange={(e) => handleScheduleRowChange(idx, 'maintenanceSchedule', e.target.value)}
                                  placeholder="Maintenance..."
                                  className="w-full bg-white text-[11px] text-slate-800 px-2 py-1.5 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              )}
                            </td>

                            {/* 9. Harvesting */}
                            <td className="p-2 border-r border-slate-200 text-[11px]">
                              {isReadOnly ? (
                                row.harvestingSchedule
                              ) : (
                                <textarea
                                  rows={4}
                                  value={row.harvestingSchedule || ''}
                                  onChange={(e) => handleScheduleRowChange(idx, 'harvestingSchedule', e.target.value)}
                                  placeholder="Harvesting..."
                                  className="w-full bg-white text-[11px] text-slate-800 px-2 py-1.5 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              )}
                            </td>

                            {/* 10. Problem & Solution */}
                            <td className="p-2 bg-emerald-50/40 text-[11px] space-y-1">
                              {isReadOnly ? (
                                <>
                                  <div>
                                    <strong className="text-rose-700">Problem:</strong> {row.keyProblem}
                                  </div>
                                  <div>
                                    <strong className="text-emerald-800">Solution:</strong>{' '}
                                    {row.recommendedSolution}
                                  </div>
                                </>
                              ) : (
                                <div className="space-y-1">
                                  <div>
                                    <strong className="text-rose-700">Problem:</strong>
                                    <textarea
                                      rows={2}
                                      value={row.keyProblem || ''}
                                      onChange={(e) => handleScheduleRowChange(idx, 'keyProblem', e.target.value)}
                                      placeholder="Enter problem..."
                                      className="w-full bg-white text-[11px] text-slate-800 px-2 py-1 rounded-md border border-rose-400/50 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-rose-500 focus:ring-1 focus:ring-rose-400 focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <strong className="text-emerald-800">Solution:</strong>
                                    <textarea
                                      rows={2}
                                      value={row.recommendedSolution || ''}
                                      onChange={(e) =>
                                        handleScheduleRowChange(idx, 'recommendedSolution', e.target.value)
                                      }
                                      placeholder="Enter solution..."
                                      className="w-full bg-white text-[11px] text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                    />
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {!isReadOnly && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {saving
                          ? 'Saving...'
                          : modalMode === 'EDIT'
                          ? 'Save POP Activity Schedule & Form'
                          : 'Submit Digital Form'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
                </>
              )}

              {/* ========================================================================= */}
              {/* TAB 2 IN MODAL: FARMER LIFECYCLE                                          */}
              {/* 2. Additional Features to Build into the Farmer Profile App               */}
              {/* ========================================================================= */}
              {modalTab === 'lifecycle' && (
                <div className="bg-white text-black rounded-2xl border-2 border-emerald-600/50 p-5 sm:p-7 space-y-6">
                  <style>{`
                    .pop-thin-scroll::-webkit-scrollbar {
                      width: 2.5px;
                      height: 2.5px;
                    }
                    .pop-thin-scroll::-webkit-scrollbar-button {
                      display: none !important;
                      width: 0 !important;
                      height: 0 !important;
                    }
                    .pop-thin-scroll::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    .pop-thin-scroll::-webkit-scrollbar-thumb {
                      background: #cbd5e1;
                      border-radius: 9999px;
                    }
                    .pop-thin-scroll::-webkit-scrollbar-thumb:hover {
                      background: #94a3b8;
                    }
                    .pop-thin-scroll::-webkit-scrollbar-corner {
                      background: transparent;
                    }
                    .pop-table-x-scroll::-webkit-scrollbar {
                      height: 6px;
                    }
                    .pop-table-x-scroll::-webkit-scrollbar-button {
                      display: none !important;
                      width: 0 !important;
                      height: 0 !important;
                    }
                    .pop-table-x-scroll::-webkit-scrollbar-track {
                      background: #f1f5f9;
                      border-radius: 9999px;
                    }
                    .pop-table-x-scroll::-webkit-scrollbar-thumb {
                      background: #94a3b8;
                      border-radius: 9999px;
                    }
                    .pop-table-x-scroll::-webkit-scrollbar-thumb:hover {
                      background: #64748b;
                    }
                  `}</style>
                  <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-indigo-950 text-white rounded-xl p-4 text-center">
                    <h2 className="text-lg sm:text-xl font-black tracking-wider uppercase text-amber-300">
                      2. Additional Features to Build into the Farmer Profile App
                    </h2>
                    <p className="text-xs text-emerald-100 font-semibold mt-1">
                      FARMER LIFECYCLE — Visit & Advisory, Pest & Disease Tracking, Irrigation & Weather Alerts, Soil Health, Harvest & Market, and Farmer Communication
                    </p>
                  </div>

                  {/* Linked Farmer Reference Row */}
                  <div className="border border-black rounded-lg overflow-hidden bg-white text-black">
                    <div className="grid grid-cols-1 md:grid-cols-12">
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Farmer Name
                      </label>
                      <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-black">
                        <input
                          type="text"
                          name="name"
                          readOnly={isReadOnly}
                          value={formData.name}
                          onChange={handleFieldChange}
                          placeholder="Enter Farmer Name"
                          className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black border border-black rounded-md"
                        />
                      </div>
                      <label className="md:col-span-2 bg-white px-4 py-3 text-xs font-bold text-black flex items-center border-b md:border-b-0 md:border-r border-black">
                        Mobile Number
                      </label>
                      <div className="md:col-span-4 bg-white p-2">
                        <input
                          type="tel"
                          name="mobileNumber"
                          readOnly={isReadOnly}
                          value={formData.mobileNumber}
                          onChange={handleFieldChange}
                          placeholder="Enter 10-digit Mobile Number"
                          className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black border border-black rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ===================================================================== */}
                  {/* CROP SELECTOR BUTTONS (ABOVE 1. FARMER VISIT AND ADVISORY HISTORY)    */}
                  {/* ===================================================================== */}
                  {(() => {
                    const allCropsList = [
                      {
                        id: 'primary',
                        index: 1,
                        label: formData.crop ? `Crop 1: ${formData.crop}` : 'Crop 1 (Primary Crop)',
                        cropType: formData.cropType || '—',
                        crop: formData.crop || '—',
                        variety: formData.variety || '—',
                        plantingDate: formData.plantingDate || '—',
                        cropAge: formData.cropAge || '—',
                        cropAcreage: formData.cropAcreage || '—',
                        plantCount: formData.plantCount || '—',
                        spacing: formData.spacing || '—',
                        surveyNumber: formData.surveyNumber || '—',
                      },
                      ...(formData.additionalCrops || []).map((c, idx) => ({
                        id: c.id,
                        index: idx + 2,
                        label: c.crop ? `Crop ${idx + 2}: ${c.crop}` : `Crop ${idx + 2}`,
                        cropType: c.cropType || '—',
                        crop: c.crop || '—',
                        variety: c.variety || '—',
                        plantingDate: c.plantingDate || '—',
                        cropAge: c.cropAge || '—',
                        cropAcreage: c.cropAcreage || '—',
                        plantCount: c.plantCount || '—',
                        spacing: c.spacing || '—',
                        surveyNumber: c.surveyNumber || formData.surveyNumber || '—',
                      })),
                    ];

                    const activeCropInfo =
                      allCropsList.find((item) => item.id === selectedLifecycleCropId) || allCropsList[0];

                    return (
                      <div className="rounded-2xl border-2 border-amber-500 bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/50 shadow-sm overflow-hidden">
                        {/* Header + Crop Buttons Bar */}
                        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Sprout className="w-5 h-5 text-white shrink-0" />
                            <span className="text-sm sm:text-base font-extrabold tracking-wide">
                              Select Crop to View &amp; Edit Farmer Lifecycle Details ({allCropsList.length}{' '}
                              {allCropsList.length === 1 ? 'Crop' : 'Crops'} Added)
                            </span>
                          </div>
                          <span className="text-[11px] font-black bg-white/20 px-3 py-1 rounded-full text-white">
                            Click a crop button below to switch lifecycle records
                          </span>
                        </div>

                        {/* Crop Buttons Row */}
                        <div className="p-4 bg-amber-50/60 border-b border-amber-200 flex flex-wrap items-center gap-3">
                          {allCropsList.map((cropBtn) => {
                            const isSelected = activeCropInfo.id === cropBtn.id;
                            const labelName =
                              cropBtn.crop && cropBtn.crop !== '—'
                                ? cropBtn.crop
                                : `Crop ${cropBtn.index}`;
                            return (
                              <button
                                key={cropBtn.id}
                                type="button"
                                onClick={() => handleSelectLifecycleCrop(cropBtn.id)}
                                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer shadow-xs border-2 ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white border-emerald-800 shadow-md scale-[1.02]'
                                    : 'bg-white hover:bg-amber-100/80 text-slate-900 border-amber-400'
                                }`}
                              >
                                <span>{labelName}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Selected Crop Collected Details Card */}
                        <div className="bg-white text-black">
                          <div className="bg-emerald-900 text-white px-4 py-2 text-xs font-extrabold uppercase tracking-wider flex flex-wrap items-center justify-between gap-2">
                            <span>
                              Selected Crop #{activeCropInfo.index} Details:{' '}
                              <strong className="text-amber-300">
                                {activeCropInfo.crop !== '—' ? activeCropInfo.crop : `Crop #${activeCropInfo.index}`}
                              </strong>
                            </span>
                            <span className="text-[10px] text-emerald-200 font-bold">
                              Showing Farmer Lifecycle below for Crop #{activeCropInfo.index} only
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 divide-y sm:divide-y-0 sm:divide-x divide-amber-200 text-xs">
                            <div className="p-2.5">
                              <div className="text-[10px] font-bold text-amber-900 uppercase">Crop Type</div>
                              <div className="font-extrabold text-black mt-0.5 truncate">{activeCropInfo.cropType}</div>
                            </div>
                            <div className="p-2.5">
                              <div className="text-[10px] font-bold text-amber-900 uppercase">Crop Name</div>
                              <div className="font-extrabold text-emerald-800 mt-0.5 truncate">{activeCropInfo.crop}</div>
                            </div>
                            <div className="p-2.5">
                              <div className="text-[10px] font-bold text-amber-900 uppercase">Variety</div>
                              <div className="font-bold text-black mt-0.5 truncate">{activeCropInfo.variety}</div>
                            </div>
                            <div className="p-2.5">
                              <div className="text-[10px] font-bold text-amber-900 uppercase">Planting Date</div>
                              <div className="font-bold text-black mt-0.5 truncate">{activeCropInfo.plantingDate}</div>
                            </div>
                            <div className="p-2.5">
                              <div className="text-[10px] font-bold text-amber-900 uppercase">Crop Age</div>
                              <div className="font-bold text-black mt-0.5 truncate">{activeCropInfo.cropAge}</div>
                            </div>
                            <div className="p-2.5">
                              <div className="text-[10px] font-bold text-amber-900 uppercase">Crop Acreage</div>
                              <div className="font-bold text-black mt-0.5 truncate">{activeCropInfo.cropAcreage}</div>
                            </div>
                            <div className="p-2.5">
                              <div className="text-[10px] font-bold text-amber-900 uppercase">Plant Count</div>
                              <div className="font-bold text-black mt-0.5 truncate">{activeCropInfo.plantCount}</div>
                            </div>
                            <div className="p-2.5">
                              <div className="text-[10px] font-bold text-amber-900 uppercase">Spacing</div>
                              <div className="font-bold text-black mt-0.5 truncate">{activeCropInfo.spacing}</div>
                            </div>
                            <div className="p-2.5">
                              <div className="text-[10px] font-bold text-amber-900 uppercase">Survey Number</div>
                              <div className="font-bold text-black mt-0.5 truncate">{activeCropInfo.surveyNumber}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 1. Farmer Visit and Advisory History */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-black">
                      1. Farmer Visit and Advisory History
                    </h3>
                    <div className="border border-black rounded-lg bg-white text-black">
                      {/* Row 1: Field Visit Date | Advisor Name */}
                      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Field Visit Date
                        </div>
                        <div className="md:col-span-4 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <input
                            type="date"
                            name="visitDate"
                            disabled={isReadOnly}
                            value={formData.visitDate || ''}
                            onChange={handleFieldChange}
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Advisor Name
                        </div>
                        <div className="md:col-span-4 p-1.5 bg-white">
                          <input
                            type="text"
                            name="advisorName"
                            disabled={isReadOnly}
                            value={formData.advisorName || ''}
                            onChange={handleFieldChange}
                            placeholder="Advisor Name"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                      </div>

                      {/* Row 2: Crop Stage (Dropdown) | Application Type (Dropdown) */}
                      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Crop Stage
                        </div>
                        <div className="md:col-span-4 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          {isReadOnly ? (
                            <input
                              type="text"
                              readOnly
                              value={formData.visitCropStage || '-'}
                              className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                            />
                          ) : (
                            <div className="relative" ref={visitCropStageDropdownRef}>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = !isVisitCropStageDropdownOpen;
                                  resetAllDropdowns();
                                  setIsVisitCropStageDropdownOpen(next);
                                }}
                                className="w-full bg-white px-2.5 py-1.5 text-xs font-semibold text-black flex items-center justify-between border border-black rounded-md cursor-pointer"
                              >
                                <span className={formData.visitCropStage ? 'text-black font-semibold' : 'text-neutral-500'}>
                                  {formData.visitCropStage || '-- Select Crop Stage --'}
                                </span>
                                <ChevronDown className="w-4 h-4 text-black shrink-0" />
                              </button>

                              {isVisitCropStageDropdownOpen && (
                                <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                  <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                    <div className="text-[10px] font-bold text-black uppercase mb-1">
                                      Row 1: Other Crop Stage (Type below)
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="text"
                                        value={customVisitCropStageText}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setCustomVisitCropStageText(val);
                                          updateLifecycleFields({ visitCropStage: val });
                                        }}
                                        placeholder="Type custom crop stage..."
                                        className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setIsVisitCropStageDropdownOpen(false)}
                                        className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>
                                  {BASE_CROP_STAGES.map((st) => (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => {
                                        updateLifecycleFields({ visitCropStage: st });
                                        setCustomVisitCropStageText('');
                                        setIsVisitCropStageDropdownOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                        formData.visitCropStage === st ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                      }`}
                                    >
                                      <span>{st}</span>
                                      {formData.visitCropStage === st && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Application Type
                        </div>
                        <div className="md:col-span-4 p-1.5 bg-white">
                          {isReadOnly ? (
                            <input
                              type="text"
                              readOnly
                              value={formData.visitApplicationType || '-'}
                              className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                            />
                          ) : (
                            <div className="relative" ref={visitAppTypeDropdownRef}>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = !isVisitAppTypeDropdownOpen;
                                  resetAllDropdowns();
                                  setIsVisitAppTypeDropdownOpen(next);
                                }}
                                className="w-full bg-white px-2.5 py-1.5 text-xs font-semibold text-black flex items-center justify-between border border-black rounded-md cursor-pointer"
                              >
                                <span className={formData.visitApplicationType ? 'text-black font-semibold' : 'text-neutral-500'}>
                                  {formData.visitApplicationType || '-- Select Application Type --'}
                                </span>
                                <ChevronDown className="w-4 h-4 text-black shrink-0" />
                              </button>

                              {isVisitAppTypeDropdownOpen && (
                                <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                                  <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                    <div className="text-[10px] font-bold text-black uppercase mb-1">
                                      Row 1: Other Application Type (Type below)
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="text"
                                        value={customVisitAppTypeText}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setCustomVisitAppTypeText(val);
                                          updateLifecycleFields({ visitApplicationType: val });
                                        }}
                                        placeholder="Type custom application type..."
                                        className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setIsVisitAppTypeDropdownOpen(false)}
                                        className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>
                                  {BASE_APPLICATION_TYPES.map((app) => (
                                    <button
                                      key={app}
                                      type="button"
                                      onClick={() => {
                                        updateLifecycleFields({ visitApplicationType: app });
                                        setCustomVisitAppTypeText('');
                                        setIsVisitAppTypeDropdownOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                        formData.visitApplicationType === app ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                      }`}
                                    >
                                      <span>{app}</span>
                                      {formData.visitApplicationType === app && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Row 3: Crop Observations | Recommendations */}
                      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Crop Observations
                        </div>
                        <div className="md:col-span-4 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <input
                            type="text"
                            name="cropObservations"
                            disabled={isReadOnly}
                            value={formData.cropObservations || ''}
                            onChange={handleFieldChange}
                            placeholder="Crop observations"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Recommendations
                        </div>
                        <div className="md:col-span-4 p-1.5 bg-white">
                          <input
                            type="text"
                            name="visitRecommendations"
                            disabled={isReadOnly}
                            value={formData.visitRecommendations || ''}
                            onChange={handleFieldChange}
                            placeholder="Recommendations"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                      </div>

                      {/* Row 4: Farmer Feedback | Photographs | Next Follow-up */}
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Farmer Feedback
                        </div>
                        <div className="md:col-span-3 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <input
                            type="text"
                            name="farmerFeedback"
                            disabled={isReadOnly}
                            value={formData.farmerFeedback || ''}
                            onChange={handleFieldChange}
                            placeholder="Farmer feedback"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Photographs
                        </div>
                        <div className="md:col-span-2 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          {(() => {
                            const photoList = (formData.visitPhotographs || '')
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean);
                            const count = photoList.length;

                            return (
                              <div className="relative flex items-center w-full">
                                <button
                                  type="button"
                                  disabled={isReadOnly}
                                  onClick={() =>
                                    handleOpenCameraModal(
                                      'farmer-visit-photographs',
                                      'Farmer Visit Photographs',
                                      'visitPhotographs'
                                    )
                                  }
                                  className="absolute left-2 z-10 p-1 text-emerald-700 hover:text-emerald-950 hover:bg-emerald-50 rounded cursor-pointer flex items-center justify-center group disabled:opacity-50"
                                  title="Open Field Camera to capture photograph (Up to 5 images per crop)"
                                >
                                  <Camera className="w-4 h-4 transition-transform group-hover:scale-110" />
                                </button>
                                <button
                                  type="button"
                                  disabled={isReadOnly}
                                  onClick={() =>
                                    handleOpenCameraModal(
                                      'farmer-visit-photographs',
                                      'Farmer Visit Photographs',
                                      'visitPhotographs'
                                    )
                                  }
                                  className="w-full text-left pl-8 pr-16 py-1.5 font-bold text-sm bg-white border border-black rounded-md hover:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all flex items-center justify-between cursor-pointer disabled:bg-slate-100"
                                  title="Click to view or capture photos"
                                >
                                  <span className={count > 0 ? "text-black" : "text-slate-400 font-medium"}>
                                    {count === 0 ? "0 / 5 Photos" : `${count} / 5 Photos Captured`}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenCameraModal(
                                      'farmer-visit-photographs',
                                      'Farmer Visit Photographs',
                                      'visitPhotographs'
                                    )
                                  }
                                  className="absolute right-1.5 z-10 px-1.5 py-0.5 rounded text-[11px] font-black bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
                                  title="View captured photos"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{count}/5</span>
                                </button>
                                <input
                                  type="hidden"
                                  name="visitPhotographs"
                                  value={formData.visitPhotographs || ''}
                                />
                              </div>
                            );
                          })()}
                        </div>
                        <div className="md:col-span-1 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Next Follow-up
                        </div>
                        <div className="md:col-span-2 p-1.5 bg-white">
                          <input
                            type="date"
                            name="nextFollowUpDate"
                            disabled={isReadOnly}
                            value={formData.nextFollowUpDate || ''}
                            onChange={handleFieldChange}
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Pest, Disease and Crop Problem Tracking */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-black">
                      2. Pest, Disease and Crop Problem Tracking
                    </h3>
                    <div className="border border-black rounded-lg overflow-hidden bg-white text-black">
                      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Field Photos
                        </div>
                        <div className="md:col-span-3 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          {(() => {
                            const photoList = (formData.problemFieldPhotos || '')
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean);
                            const count = photoList.length;

                            return (
                              <div className="relative flex items-center w-full">
                                <button
                                  type="button"
                                  disabled={isReadOnly}
                                  onClick={() =>
                                    handleOpenCameraModal(
                                      'pest-disease-tracking',
                                      'Pest & Disease Field Photos',
                                      'problemFieldPhotos'
                                    )
                                  }
                                  className="absolute left-2 z-10 p-1 text-rose-700 hover:text-rose-950 hover:bg-rose-50 rounded cursor-pointer flex items-center justify-center group disabled:opacity-50"
                                  title="Open Field Camera to capture problem photo (Up to 5 images per crop)"
                                >
                                  <Camera className="w-4 h-4 transition-transform group-hover:scale-110" />
                                </button>
                                <button
                                  type="button"
                                  disabled={isReadOnly}
                                  onClick={() =>
                                    handleOpenCameraModal(
                                      'pest-disease-tracking',
                                      'Pest & Disease Field Photos',
                                      'problemFieldPhotos'
                                    )
                                  }
                                  className="w-full text-left pl-8 pr-16 py-1.5 font-bold text-sm bg-white border border-black rounded-md hover:border-rose-600 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all flex items-center justify-between cursor-pointer disabled:bg-slate-100"
                                  title="Click to view or capture problem photos"
                                >
                                  <span className={count > 0 ? "text-black" : "text-slate-400 font-medium"}>
                                    {count === 0
                                      ? "0 / 5 Problem Photos"
                                      : count === 1
                                      ? "1 / 5 Problem Photo Captured"
                                      : `${count} / 5 Problem Photos Captured`}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenCameraModal(
                                      'pest-disease-tracking',
                                      'Pest & Disease Field Photos',
                                      'problemFieldPhotos'
                                    )
                                  }
                                  className="absolute right-1.5 z-10 px-1.5 py-0.5 rounded text-[11px] font-black bg-rose-100 hover:bg-rose-200 text-rose-800 flex items-center gap-1 cursor-pointer transition-colors"
                                  title="View problem photos"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{count}/5</span>
                                </button>
                                <input
                                  type="hidden"
                                  name="problemFieldPhotos"
                                  value={formData.problemFieldPhotos || ''}
                                />
                              </div>
                            );
                          })()}
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Symptoms
                        </div>
                        <div className="md:col-span-2 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <input
                            type="text"
                            name="problemSymptoms"
                            disabled={isReadOnly}
                            value={formData.problemSymptoms || ''}
                            onChange={handleFieldChange}
                            placeholder="Symptoms"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-1 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Severity
                        </div>
                        <div className="md:col-span-2 p-1.5 bg-white">
                          {isReadOnly ? (
                            <input
                              type="text"
                              readOnly
                              value={formData.problemSeverity || '-'}
                              className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                            />
                          ) : (
                            <select
                              name="problemSeverity"
                              value={formData.problemSeverity || ''}
                              onChange={handleFieldChange}
                              className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                            >
                              <option value="">-- Select --</option>
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                              <option value="Critical">Critical</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Actions Taken
                        </div>
                        <div className="md:col-span-6 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <input
                            type="text"
                            name="problemActionsTaken"
                            disabled={isReadOnly}
                            value={formData.problemActionsTaken || ''}
                            onChange={handleFieldChange}
                            placeholder="Actions taken"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Problem Resolved?
                        </div>
                        <div className="md:col-span-2 p-1.5 bg-white">
                          {isReadOnly ? (
                            <input
                              type="text"
                              readOnly
                              value={formData.problemResolved || '-'}
                              className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                            />
                          ) : (
                            <select
                              name="problemResolved"
                              value={formData.problemResolved || ''}
                              onChange={handleFieldChange}
                              className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                            >
                              <option value="">-- Select --</option>
                              <option value="Yes - Resolved">Yes - Resolved</option>
                              <option value="No - Pending">No - Pending</option>
                              <option value="Under Observation">Under Observation</option>
                              <option value="Follow-up Required">Follow-up Required</option>
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Irrigation and Weather Alerts */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-black">
                      3. Irrigation and Weather Alerts
                    </h3>
                    <div className="border border-black rounded-lg overflow-hidden bg-white text-black">
                      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Water Availability
                        </div>
                        <div className="md:col-span-4 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          {isReadOnly ? (
                            <input
                              type="text"
                              readOnly
                              value={formData.waterAvailability || '-'}
                              className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                            />
                          ) : (
                            <select
                              name="waterAvailability"
                              value={formData.waterAvailability || ''}
                              onChange={handleFieldChange}
                              className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                            >
                              <option value="">-- Select Water Availability --</option>
                              <option value="Adequate (Borewell / Canal)">Adequate (Borewell / Canal)</option>
                              <option value="Moderate">Moderate</option>
                              <option value="Low / Scarce">Low / Scarce</option>
                              <option value="Rainfed Only">Rainfed Only</option>
                              <option value="Critical Shortage">Critical Shortage</option>
                            </select>
                          )}
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Irrigation Schedules
                        </div>
                        <div className="md:col-span-4 p-1.5 bg-white">
                          <input
                            type="text"
                            name="irrigationSchedules"
                            disabled={isReadOnly}
                            value={formData.irrigationSchedules || ''}
                            onChange={handleFieldChange}
                            placeholder="Irrigation schedules"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Rainfall Alert
                        </div>
                        <div className="md:col-span-2 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <input
                            type="text"
                            name="rainfallAlert"
                            disabled={isReadOnly}
                            value={formData.rainfallAlert || ''}
                            onChange={handleFieldChange}
                            placeholder="Rainfall alert"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Heat Alert
                        </div>
                        <div className="md:col-span-2 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <input
                            type="text"
                            name="heatAlert"
                            disabled={isReadOnly}
                            value={formData.heatAlert || ''}
                            onChange={handleFieldChange}
                            placeholder="Heat alert"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Weather Alerts
                        </div>
                        <div className="md:col-span-2 p-1.5 bg-white">
                          <input
                            type="text"
                            name="weatherAlerts"
                            disabled={isReadOnly}
                            value={formData.weatherAlerts || ''}
                            onChange={handleFieldChange}
                            placeholder="Weather alerts"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Soil Health and Fertilizer Recommendations */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-black">
                      4. Soil Health and Fertilizer Recommendations
                    </h3>
                    <div className="border border-black rounded-lg overflow-hidden bg-white text-black">
                      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Soil Test Reports
                        </div>
                        <div className="md:col-span-4 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <input
                            type="text"
                            name="soilTestReport"
                            disabled={isReadOnly}
                            value={formData.soilTestReport || ''}
                            onChange={handleFieldChange}
                            placeholder="Test report summary"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Next Testing Date
                        </div>
                        <div className="md:col-span-4 p-1.5 bg-white">
                          <input
                            type="date"
                            name="nextSoilTestDate"
                            disabled={isReadOnly}
                            value={formData.nextSoilTestDate || ''}
                            onChange={handleFieldChange}
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Nutrient Recommendations
                        </div>
                        <div className="md:col-span-4 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <input
                            type="text"
                            name="nutrientRecommendations"
                            disabled={isReadOnly}
                            value={formData.nutrientRecommendations || ''}
                            onChange={handleFieldChange}
                            placeholder="Crop-specific nutrient recommendation"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Fertilizer History
                        </div>
                        <div className="md:col-span-4 p-1.5 bg-white">
                          <input
                            type="text"
                            name="fertilizerHistory"
                            disabled={isReadOnly}
                            value={formData.fertilizerHistory || ''}
                            onChange={handleFieldChange}
                            placeholder="Fertilizer application history"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                      </div>
                      {/* Row 3: Upload Soil Report (JPG / PDF) */}
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="md:col-span-2 bg-amber-50/90 text-amber-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-black">
                          Upload Soil Report (JPG / PDF)
                        </div>
                        <div className="md:col-span-10 p-3 bg-white flex flex-wrap items-center gap-3">
                          <label className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-lg shadow-xs transition cursor-pointer">
                            <FileText className="w-4 h-4" />
                            <span>Choose JPG or PDF File</span>
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.pdf,image/jpeg,application/pdf"
                              onChange={(e) => {
                                if (selectedLifecycleCropId === 'primary') {
                                  handlePrimarySoilReportUpload(e);
                                } else {
                                  handleAdditionalCropSoilReportUpload(selectedLifecycleCropId, e);
                                }
                              }}
                              className="hidden"
                            />
                          </label>

                          {formData.soilReportFileName ? (
                            <div className="inline-flex items-center gap-2.5 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-950">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{formData.soilReportFileName}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDownloadSoilReport(
                                    formData.soilReportFileName,
                                    formData.soilReportFileData,
                                    selectedLifecycleCropId === 'primary'
                                      ? formData.crop
                                      : (formData.additionalCrops || []).find(
                                          (c) => c.id === selectedLifecycleCropId
                                        )?.crop || formData.crop,
                                    formData.soilTestReport
                                  )
                                }
                                className="text-emerald-700 hover:text-emerald-900 font-bold ml-1 inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (selectedLifecycleCropId === 'primary') {
                                    handleRemovePrimarySoilReport();
                                  } else {
                                    handleRemoveAdditionalCropSoilReport(selectedLifecycleCropId);
                                  }
                                }}
                                className="text-rose-600 hover:text-rose-800 font-bold ml-1 cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-500">
                              Supported formats: <strong>.JPG, .JPEG, .PDF</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5. Harvest, Yield and Market Information */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-black">
                      5. Harvest, Yield and Market Information
                    </h3>
                    <div className="border border-black rounded-lg bg-white text-black">
                      {/* Row 1 (Starting): Harvesting Date (Separate Field) */}
                      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Harvesting Date
                        </div>
                        <div className="md:col-span-10 p-1.5 bg-white">
                          <input
                            type="date"
                            name="harvestingDate"
                            disabled={isReadOnly}
                            value={formData.harvestingDate || ''}
                            onChange={handleFieldChange}
                            className="w-full sm:max-w-xs px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                      </div>

                      {/* Row 2: Harvested Quantity (Dropdown) | Selling Price (per kg) | Harvest Picking */}
                      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Harvested Quantity
                        </div>
                        <div className="md:col-span-2 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          {isReadOnly ? (
                            <input
                              type="text"
                              readOnly
                              value={formData.harvestedQuantity || '-'}
                              className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                            />
                          ) : (
                            <div className="relative" ref={harvestQtyDropdownRef}>
                              <button
                                type="button"
                                onClick={() => {
                                  const next = !isHarvestQtyDropdownOpen;
                                  resetAllDropdowns();
                                  setIsHarvestQtyDropdownOpen(next);
                                }}
                                className="w-full bg-white px-2.5 py-1.5 text-xs font-semibold text-black flex items-center justify-between border border-black rounded-md cursor-pointer"
                              >
                                <span className={formData.harvestedQuantity ? 'text-black font-semibold' : 'text-neutral-500'}>
                                  {formData.harvestedQuantity || '-- Select --'}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-black shrink-0" />
                              </button>

                              {isHarvestQtyDropdownOpen && (
                                <div className="absolute left-0 right-0 top-full mt-1 z-[999] bg-white border-2 border-black rounded-lg shadow-2xl max-h-64 overflow-y-auto min-w-[240px]">
                                  <div className="p-2 border-b border-black bg-neutral-50 sticky top-0 z-10">
                                    <div className="text-[10px] font-bold text-black uppercase mb-1">
                                      Row 1: Other Quantity / Quality (Type below)
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="text"
                                        value={customHarvestQtyText}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setCustomHarvestQtyText(val);
                                          updateLifecycleFields({ harvestedQuantity: val });
                                        }}
                                        placeholder="Type harvested quantity..."
                                        className="w-full bg-white px-2 py-1 text-xs text-black border border-black rounded focus:outline-none"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setIsHarvestQtyDropdownOpen(false)}
                                        className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded cursor-pointer shrink-0"
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>
                                  {BASE_HARVEST_QUALITY_OPTIONS.map((hq) => (
                                    <button
                                      key={hq}
                                      type="button"
                                      onClick={() => {
                                        updateLifecycleFields({ harvestedQuantity: hq });
                                        setCustomHarvestQtyText('');
                                        setIsHarvestQtyDropdownOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 border-b border-neutral-200 last:border-b-0 flex items-center justify-between cursor-pointer ${
                                        formData.harvestedQuantity === hq ? 'bg-emerald-100 text-black font-bold' : 'text-black'
                                      }`}
                                    >
                                      <span>{hq}</span>
                                      {formData.harvestedQuantity === hq && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Selling Price (per kg)
                        </div>
                        <div className="md:col-span-2 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <input
                            type="text"
                            name="sellingPrice"
                            disabled={isReadOnly}
                            value={formData.sellingPrice || ''}
                            onChange={handleFieldChange}
                            placeholder="Rs. / kg"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Harvest Picking
                        </div>
                        <div className="md:col-span-2 p-1.5 bg-white">
                          <input
                            type="text"
                            name="harvestPicking"
                            disabled={isReadOnly}
                            value={formData.harvestPicking || ''}
                            onChange={handleFieldChange}
                            placeholder="e.g. 1st Picking / Multi-Picking"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                      </div>

                      {/* Row 2: Market Expenses | Crop-Wise Returns | Local Market Price Info */}
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Market Expenses
                        </div>
                        <div className="md:col-span-2 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <input
                            type="text"
                            name="marketExpenses"
                            disabled={isReadOnly}
                            value={formData.marketExpenses || ''}
                            onChange={handleFieldChange}
                            placeholder="Expenses"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Crop-Wise Returns
                        </div>
                        <div className="md:col-span-2 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <input
                            type="text"
                            name="cropWiseReturns"
                            disabled={isReadOnly}
                            value={formData.cropWiseReturns || ''}
                            onChange={handleFieldChange}
                            placeholder="Returns"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Local Market Price Info
                        </div>
                        <div className="md:col-span-2 p-1.5 bg-white">
                          <input
                            type="text"
                            name="localMarketPriceInfo"
                            disabled={isReadOnly}
                            value={formData.localMarketPriceInfo || ''}
                            onChange={handleFieldChange}
                            placeholder="Mandi price info"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 6. Farmer Communication and Follow-ups */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-black">
                      6. Farmer Communication and Follow-ups
                    </h3>
                    <div className="border border-black rounded-lg overflow-hidden bg-white text-black">
                      <div className="grid grid-cols-1 md:grid-cols-12 border-b border-black">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          WhatsApp Consent
                        </div>
                        <div className="md:col-span-2 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          {isReadOnly ? (
                            <input
                              type="text"
                              readOnly
                              value={formData.whatsappConsent || '-'}
                              className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                            />
                          ) : (
                            <select
                              name="whatsappConsent"
                              value={formData.whatsappConsent || ''}
                              onChange={handleFieldChange}
                              className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                            >
                              <option value="">-- Select --</option>
                              <option value="Yes - Subscribed">Yes - Subscribed</option>
                              <option value="No - Opted Out">No - Opted Out</option>
                              <option value="SMS Only">SMS Only</option>
                            </select>
                          )}
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Advisory Messages
                        </div>
                        <div className="md:col-span-2 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <input
                            type="text"
                            name="advisoryMessages"
                            disabled={isReadOnly}
                            value={formData.advisoryMessages || ''}
                            onChange={handleFieldChange}
                            placeholder="Advisory messages"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Training Attendance
                        </div>
                        <div className="md:col-span-2 p-1.5 bg-white">
                          <input
                            type="text"
                            name="trainingAttendance"
                            disabled={isReadOnly}
                            value={formData.trainingAttendance || ''}
                            onChange={handleFieldChange}
                            placeholder="Training attendance"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Reminders
                        </div>
                        <div className="md:col-span-4 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <input
                            type="text"
                            name="communicationReminders"
                            disabled={isReadOnly}
                            value={formData.communicationReminders || ''}
                            onChange={handleFieldChange}
                            placeholder="Reminders"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Pending Actions
                        </div>
                        <div className="md:col-span-4 p-1.5 bg-white">
                          <input
                            type="text"
                            name="pendingActions"
                            disabled={isReadOnly}
                            value={formData.pendingActions || ''}
                            onChange={handleFieldChange}
                            placeholder="Pending actions"
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 7. Problem and Solution Summary (Backend Editable) */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-black">
                      7. Problem and Solution Summary (Backend Managed)
                    </h3>
                    <div className="border border-black rounded-lg overflow-hidden bg-white text-black">
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Problem Summary
                        </div>
                        <div className="md:col-span-4 p-1.5 border-b md:border-b-0 md:border-r border-black bg-white">
                          <textarea
                            name="problemSummary"
                            rows={3}
                            disabled={isReadOnly}
                            value={formData.problemSummary || ''}
                            onChange={handleFieldChange}
                            placeholder="Enter complete summary of crop problems, pest/disease incidence, or field challenges..."
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2 p-2.5 font-bold bg-white text-black border-b md:border-b-0 md:border-r border-black flex items-center">
                          Solution Summary
                        </div>
                        <div className="md:col-span-4 p-1.5 bg-white">
                          <textarea
                            name="solutionSummary"
                            rows={3}
                            disabled={isReadOnly}
                            value={formData.solutionSummary || ''}
                            onChange={handleFieldChange}
                            placeholder="Enter complete summary of recommended solutions, sprays/inputs applied, and outcome..."
                            className="w-full px-2.5 py-1.5 font-semibold text-black bg-white border border-black rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ===================================================================== */}
                  {/* BOTTOM OVERVIEW TABLE: FILLED FARMER LIFECYCLE DETAILS SUMMARY        */}
                  {/* ===================================================================== */}
                  {(() => {
                    const allCropsList = [
                      {
                        id: 'primary',
                        index: 1,
                        label: formData.crop ? `Crop 1: ${formData.crop}` : 'Crop 1 (Primary Crop)',
                        cropType: formData.cropType || '-',
                        crop: formData.crop || '-',
                        variety: formData.variety || '-',
                        plantingDate: formData.plantingDate || '-',
                        cropAge: formData.cropAge || '-',
                        cropAcreage: formData.cropAcreage || '-',
                        plantCount: formData.plantCount || '-',
                        spacing: formData.spacing || '-',
                      },
                      ...(formData.additionalCrops || []).map((c, idx) => ({
                        id: c.id,
                        index: idx + 2,
                        label: c.crop ? `Crop ${idx + 2}: ${c.crop}` : `Crop ${idx + 2}`,
                        cropType: c.cropType || '-',
                        crop: c.crop || '-',
                        variety: c.variety || '-',
                        plantingDate: c.plantingDate || '-',
                        cropAge: c.cropAge || '-',
                        cropAcreage: c.cropAcreage || '-',
                        plantCount: c.plantCount || '-',
                        spacing: c.spacing || '-',
                      })),
                    ];

                    const activeCropInfo =
                      allCropsList.find((item) => item.id === selectedLifecycleCropId) || allCropsList[0];

                    const activeCropStages: CropLifecycleData[] = [
                      extractLifecycleFromFormData(formData),
                      ...(cropExtraLifecycleStagesMap[activeCropInfo.id] || []),
                    ];

                    return (
                      <div className="rounded-2xl border-2 border-emerald-700 bg-white shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <ClipboardList className="w-5 h-5 text-amber-300 shrink-0" />
                            <span className="text-sm sm:text-base font-extrabold tracking-wide uppercase">
                              Filled Farmer Lifecycle Details Overview — Crop #{activeCropInfo.index}:{' '}
                              <strong className="text-amber-300">
                                {activeCropInfo.crop !== '-' ? activeCropInfo.crop : `Crop #${activeCropInfo.index}`}
                              </strong>
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="text-[11px] font-bold bg-white/15 px-3 py-1 rounded-full text-emerald-100">
                              Showing Crop #{activeCropInfo.index} of {allCropsList.length} • {activeCropStages.length}{' '}
                              {activeCropStages.length === 1 ? 'Stage' : 'Stages'}
                            </span>
                            {!isReadOnly && (
                              <button
                                type="button"
                                onClick={() => handleAddLifecycleStageRow(activeCropInfo.id)}
                                className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs px-3.5 py-1.5 rounded-lg shadow transition-all cursor-pointer"
                              >
                                <Plus className="w-4 h-4 stroke-[2.5]" />
                                Add Stage
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="p-4 bg-white">
                          <div className="overflow-x-auto rounded-xl border border-slate-200 pop-table-x-scroll bg-white">
                            <table className="w-full text-left text-xs border-collapse min-w-[1250px]">
                              <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                  <th className="p-3 border-r border-white/10 w-40">
                                    Visit Date &amp; Stage
                                  </th>
                                  <th className="p-3 border-r border-white/10 w-28">
                                    Crop Progress
                                  </th>
                                  <th className="p-3 border-r border-white/10 w-40">
                                    Visit &amp; Advisory
                                  </th>
                                  <th className="p-3 border-r border-white/10 w-40">
                                    Pest &amp; Disease Tracking
                                  </th>
                                  <th className="p-3 border-r border-white/10 w-36">
                                    Irrigation &amp; Weather
                                  </th>
                                  <th className="p-3 border-r border-white/10 w-36">
                                    Soil Health &amp; Fertilizer
                                  </th>
                                  <th className="p-3 border-r border-white/10 w-40">
                                    Harvest &amp; Market Info
                                  </th>
                                  <th className="p-3 border-r border-white/10 w-36">
                                    Communication &amp; Follow-up
                                  </th>
                                  <th className="p-3 border-r border-white/10 w-36">
                                    Yield &amp; Returns
                                  </th>
                                  <th className="p-3 w-56 bg-emerald-950 text-emerald-300">
                                    Crop Problem &amp; Recommended Solution
                                  </th>
                                </tr>
                              </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                              {activeCropStages.map((lc, stageRowIdx) => {
                                const cropRow = activeCropInfo;
                                const cIdx = cropRow.index - 1;
                                const isCurrent = stageRowIdx === 0;

                                const resolvedText = (lc.problemResolved || '').toLowerCase();
                                const isResolved =
                                  resolvedText.includes('yes') || resolvedText.includes('resolved');
                                const hasVisitData = Boolean(
                                  lc.visitDate ||
                                    lc.visitCropStage ||
                                    lc.cropObservations ||
                                    lc.problemSummary
                                );

                                return (
                                  <tr
                                    key={`${cropRow.id}-stage-${stageRowIdx}`}
                                    className={`align-top transition-colors ${
                                      isCurrent ? 'bg-amber-50/40' : 'hover:bg-slate-50/60'
                                    }`}
                                  >
                                    {/* 1. Visit Date & Stage */}
                                    <td className="p-2 border-r border-slate-200">
                                      {isReadOnly ? (
                                        <>
                                          <div className="font-bold text-emerald-800">
                                            {lc.visitDate ||
                                              (stageRowIdx === 0 && cropRow.plantingDate !== '-'
                                                ? cropRow.plantingDate
                                                : `Stage #${stageRowIdx + 1}`)}
                                          </div>
                                          <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                                            {lc.visitCropStage || 'Stage Not Recorded'}
                                          </div>
                                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                            {cropRow.crop !== '-' ? cropRow.crop : `Crop #${cIdx + 1}`}
                                            {cropRow.variety !== '-' ? ` (${cropRow.variety})` : ''}
                                            {' • '}Stage #{stageRowIdx + 1}
                                          </div>
                                        </>
                                      ) : (
                                        <div className="space-y-1">
                                          <input
                                            type="date"
                                            value={lc.visitDate || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'visitDate',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            className="w-full bg-white font-bold text-emerald-800 text-xs px-2 py-1 rounded-md border border-emerald-500/40 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                          />
                                          <textarea
                                            rows={2}
                                            value={lc.visitCropStage || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'visitCropStage',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder={`Stage #${stageRowIdx + 1} Name / Crop Stage`}
                                            className="w-full bg-white text-[11px] font-semibold text-slate-700 px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-snug focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                          />
                                          <div className="text-[10px] font-mono text-slate-500 px-1">
                                            {cropRow.crop !== '-' ? cropRow.crop : `Crop #${cIdx + 1}`}
                                            {cropRow.variety !== '-' ? ` (${cropRow.variety})` : ''}
                                            {' • '}Stage #{stageRowIdx + 1}
                                          </div>
                                        </div>
                                      )}
                                    </td>

                                    {/* 2. Crop Progress */}
                                    <td className="p-2 border-r border-slate-200">
                                      {isReadOnly ? (
                                        <>
                                          {isResolved ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                              <Check className="w-3 h-3" /> Resolved
                                            </span>
                                          ) : hasVisitData ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                                              <Clock className="w-3 h-3" /> Active Stage
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                                              Upcoming
                                            </span>
                                          )}
                                          {lc.nextFollowUpDate && (
                                            <div className="text-[10px] font-mono text-slate-500 mt-1.5">
                                              Next: {lc.nextFollowUpDate}
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <div className="space-y-1.5">
                                          <select
                                            value={lc.problemResolved || 'In Progress'}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'problemResolved',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            className={`w-full px-2 py-1 rounded-full text-[10px] font-bold border border-emerald-500/30 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer ${
                                              isResolved
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-amber-100 text-amber-900'
                                            }`}
                                          >
                                            <option value="In Progress">Active Stage</option>
                                            <option value="Under Observation">Under Observation</option>
                                            <option value="Yes - Resolved">✓ Resolved</option>
                                          </select>
                                          <div className="space-y-0.5">
                                            <span className="text-[10px] font-bold text-slate-600 block">
                                              Next Follow-up:
                                            </span>
                                            <input
                                              type="date"
                                              value={lc.nextFollowUpDate || ''}
                                              onChange={(e) =>
                                                updateCropRowLifecycleField(
                                                  cropRow.id,
                                                  'nextFollowUpDate',
                                                  e.target.value,
                                                  stageRowIdx
                                                )
                                              }
                                              className="w-full bg-white text-[10px] font-mono text-slate-700 px-1.5 py-1 rounded-md border border-emerald-500/40 focus:border-emerald-600 focus:outline-none"
                                            />
                                          </div>
                                          {stageRowIdx > 0 && (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleRemoveLifecycleStageRow(
                                                  cropRow.id,
                                                  stageRowIdx - 1
                                                )
                                              }
                                              className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200 transition-colors cursor-pointer"
                                            >
                                              <Trash2 className="w-3 h-3" /> Delete Stage
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </td>

                                    {/* 3. Visit & Advisory */}
                                    <td className="p-2 border-r border-slate-200 text-[11px] text-slate-700 leading-relaxed space-y-1">
                                      {isReadOnly ? (
                                        <>
                                          {lc.advisorName && (
                                            <div>
                                              <strong className="text-slate-900">Advisor:</strong>{' '}
                                              {lc.advisorName}
                                            </div>
                                          )}
                                          <div>{lc.cropObservations || '—'}</div>
                                          {lc.visitRecommendations && (
                                            <div className="text-emerald-800 font-medium">
                                              Rec: {lc.visitRecommendations}
                                            </div>
                                          )}
                                          {lc.visitApplicationType && (
                                            <div className="text-[10px] text-slate-500">
                                              Method: {lc.visitApplicationType}
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <div className="space-y-1">
                                          <input
                                            type="text"
                                            value={lc.advisorName || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'advisorName',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Advisor Name..."
                                            className="w-full bg-white text-[11px] font-semibold text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 focus:border-emerald-600 focus:outline-none"
                                          />
                                          <textarea
                                            rows={2}
                                            value={lc.cropObservations || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'cropObservations',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Crop observations..."
                                            className="w-full bg-white text-[11px] text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:outline-none"
                                          />
                                          <textarea
                                            rows={2}
                                            value={lc.visitRecommendations || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'visitRecommendations',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Recommendations..."
                                            className="w-full bg-white text-[11px] text-emerald-800 font-medium px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:outline-none"
                                          />
                                        </div>
                                      )}
                                    </td>

                                    {/* 4. Pest & Disease Tracking */}
                                    <td className="p-2 border-r border-slate-200 text-[11px] text-slate-700 leading-relaxed space-y-1">
                                      {isReadOnly ? (
                                        <>
                                          <div>{lc.problemSymptoms || '—'}</div>
                                          {lc.problemSeverity && (
                                            <div>
                                              <strong className="text-rose-700">Severity:</strong>{' '}
                                              {lc.problemSeverity}
                                            </div>
                                          )}
                                          {lc.problemActionsTaken && (
                                            <div>
                                              <strong className="text-slate-900">Action:</strong>{' '}
                                              {lc.problemActionsTaken}
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <div className="space-y-1">
                                          <textarea
                                            rows={2}
                                            value={lc.problemSymptoms || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'problemSymptoms',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Symptoms..."
                                            className="w-full bg-white text-[11px] text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:outline-none"
                                          />
                                          <input
                                            type="text"
                                            value={lc.problemSeverity || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'problemSeverity',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Severity (Low / Medium / High)"
                                            className="w-full bg-white text-[11px] font-semibold text-rose-700 px-2 py-1 rounded-md border border-emerald-500/40 focus:border-emerald-600 focus:outline-none"
                                          />
                                          <textarea
                                            rows={2}
                                            value={lc.problemActionsTaken || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'problemActionsTaken',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Actions taken..."
                                            className="w-full bg-white text-[11px] text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:outline-none"
                                          />
                                        </div>
                                      )}
                                    </td>

                                    {/* 5. Irrigation & Weather */}
                                    <td className="p-2 border-r border-slate-200 text-[11px] text-slate-700 leading-relaxed space-y-1">
                                      {isReadOnly ? (
                                        <>
                                          {lc.waterAvailability && (
                                            <div>
                                              <strong className="text-slate-900">Water:</strong>{' '}
                                              {lc.waterAvailability}
                                            </div>
                                          )}
                                          <div>{lc.irrigationSchedules || '—'}</div>
                                          {(lc.rainfallAlert || lc.heatAlert || lc.weatherAlerts) && (
                                            <div className="text-[10px] text-sky-800 font-medium">
                                              {[lc.rainfallAlert, lc.heatAlert, lc.weatherAlerts]
                                                .filter(Boolean)
                                                .join(' • ')}
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <div className="space-y-1">
                                          <input
                                            type="text"
                                            value={lc.waterAvailability || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'waterAvailability',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Water availability..."
                                            className="w-full bg-white text-[11px] font-semibold text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 focus:border-emerald-600 focus:outline-none"
                                          />
                                          <textarea
                                            rows={2}
                                            value={lc.irrigationSchedules || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'irrigationSchedules',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Irrigation schedule..."
                                            className="w-full bg-white text-[11px] text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:outline-none"
                                          />
                                          <textarea
                                            rows={2}
                                            value={lc.weatherAlerts || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'weatherAlerts',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Weather alerts..."
                                            className="w-full bg-white text-[10px] text-sky-800 font-medium px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:outline-none"
                                          />
                                        </div>
                                      )}
                                    </td>

                                    {/* 6. Soil Health & Fertilizer */}
                                    <td className="p-2 border-r border-slate-200 text-[11px] text-slate-700 leading-relaxed space-y-1">
                                      {isReadOnly ? (
                                        <>
                                          {lc.soilTestReport && (
                                            <div>
                                              <strong className="text-slate-900">Soil:</strong>{' '}
                                              {lc.soilTestReport}
                                            </div>
                                          )}
                                          <div>{lc.nutrientRecommendations || '—'}</div>
                                          {lc.fertilizerHistory && (
                                            <div className="text-[10px] text-slate-500">
                                              History: {lc.fertilizerHistory}
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <div className="space-y-1">
                                          <textarea
                                            rows={2}
                                            value={lc.soilTestReport || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'soilTestReport',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Soil test report..."
                                            className="w-full bg-white text-[11px] text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:outline-none"
                                          />
                                          <textarea
                                            rows={2}
                                            value={lc.nutrientRecommendations || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'nutrientRecommendations',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Nutrient recommendations..."
                                            className="w-full bg-white text-[11px] text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:outline-none"
                                          />
                                          <textarea
                                            rows={2}
                                            value={lc.fertilizerHistory || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'fertilizerHistory',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Fertilizer history..."
                                            className="w-full bg-white text-[10px] text-slate-600 px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:outline-none"
                                          />
                                        </div>
                                      )}
                                    </td>

                                    {/* 7. Harvest & Market Info */}
                                    <td className="p-2 border-r border-slate-200 text-[11px] text-slate-700 leading-relaxed space-y-1">
                                      {isReadOnly ? (
                                        <>
                                          {lc.harvestingDate && (
                                            <div>
                                              <strong className="text-slate-900">Date:</strong>{' '}
                                              {lc.harvestingDate}
                                            </div>
                                          )}
                                          {lc.harvestedQuantity && (
                                            <div>
                                              <strong className="text-slate-900">Qty:</strong>{' '}
                                              {lc.harvestedQuantity}
                                            </div>
                                          )}
                                          {lc.harvestPicking && (
                                            <div>
                                              <strong className="text-slate-900">Picking:</strong>{' '}
                                              {lc.harvestPicking}
                                            </div>
                                          )}
                                          <div>{lc.localMarketPriceInfo || '—'}</div>
                                        </>
                                      ) : (
                                        <div className="space-y-1">
                                          <input
                                            type="date"
                                            value={lc.harvestingDate || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'harvestingDate',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            className="w-full bg-white text-[11px] font-semibold text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 focus:border-emerald-600 focus:outline-none"
                                          />
                                          <input
                                            type="text"
                                            value={lc.harvestedQuantity || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'harvestedQuantity',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Harvested Qty / Grade..."
                                            className="w-full bg-white text-[11px] font-semibold text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 focus:border-emerald-600 focus:outline-none"
                                          />
                                          <input
                                            type="text"
                                            value={lc.harvestPicking || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'harvestPicking',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Harvest Picking..."
                                            className="w-full bg-white text-[11px] text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 focus:border-emerald-600 focus:outline-none"
                                          />
                                          <textarea
                                            rows={2}
                                            value={lc.localMarketPriceInfo || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'localMarketPriceInfo',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Local market price info..."
                                            className="w-full bg-white text-[11px] text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:outline-none"
                                          />
                                        </div>
                                      )}
                                    </td>

                                    {/* 8. Communication & Follow-up */}
                                    <td className="p-2 border-r border-slate-200 text-[11px] text-slate-700 leading-relaxed space-y-1">
                                      {isReadOnly ? (
                                        <>
                                          {lc.whatsappConsent && (
                                            <div>
                                              <strong className="text-slate-900">WhatsApp:</strong>{' '}
                                              {lc.whatsappConsent}
                                            </div>
                                          )}
                                          <div>{lc.advisoryMessages || '—'}</div>
                                          {lc.pendingActions && (
                                            <div className="text-[10px] text-amber-800 font-medium">
                                              Pending: {lc.pendingActions}
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <div className="space-y-1">
                                          <input
                                            type="text"
                                            value={lc.whatsappConsent || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'whatsappConsent',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="WhatsApp Consent..."
                                            className="w-full bg-white text-[11px] font-semibold text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 focus:border-emerald-600 focus:outline-none"
                                          />
                                          <textarea
                                            rows={2}
                                            value={lc.advisoryMessages || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'advisoryMessages',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Advisory messages..."
                                            className="w-full bg-white text-[11px] text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:outline-none"
                                          />
                                          <textarea
                                            rows={2}
                                            value={lc.pendingActions || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'pendingActions',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Pending actions..."
                                            className="w-full bg-white text-[10px] text-amber-800 font-medium px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:outline-none"
                                          />
                                        </div>
                                      )}
                                    </td>

                                    {/* 9. Yield & Returns */}
                                    <td className="p-2 border-r border-slate-200 text-[11px] text-slate-700 leading-relaxed space-y-1">
                                      {isReadOnly ? (
                                        <>
                                          {lc.sellingPrice && (
                                            <div>
                                              <strong className="text-slate-900">Price:</strong>{' '}
                                              {lc.sellingPrice}
                                            </div>
                                          )}
                                          {lc.marketExpenses && (
                                            <div>
                                              <strong className="text-slate-900">Expenses:</strong>{' '}
                                              {lc.marketExpenses}
                                            </div>
                                          )}
                                          <div className="font-bold text-emerald-800">
                                            {lc.cropWiseReturns || '—'}
                                          </div>
                                        </>
                                      ) : (
                                        <div className="space-y-1">
                                          <input
                                            type="text"
                                            value={lc.sellingPrice || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'sellingPrice',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Selling Price (Rs/kg)"
                                            className="w-full bg-white text-[11px] font-semibold text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 focus:border-emerald-600 focus:outline-none"
                                          />
                                          <input
                                            type="text"
                                            value={lc.marketExpenses || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'marketExpenses',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Market Expenses..."
                                            className="w-full bg-white text-[11px] text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 focus:border-emerald-600 focus:outline-none"
                                          />
                                          <input
                                            type="text"
                                            value={lc.cropWiseReturns || ''}
                                            onChange={(e) =>
                                              updateCropRowLifecycleField(
                                                cropRow.id,
                                                'cropWiseReturns',
                                                e.target.value,
                                                stageRowIdx
                                              )
                                            }
                                            placeholder="Crop-Wise Returns..."
                                            className="w-full bg-white text-[11px] font-bold text-emerald-800 px-2 py-1 rounded-md border border-emerald-500/40 focus:border-emerald-600 focus:outline-none"
                                          />
                                        </div>
                                      )}
                                    </td>

                                    {/* 10. Problem & Solution */}
                                    <td className="p-2 bg-emerald-50/40 text-[11px] leading-relaxed space-y-1">
                                      {isReadOnly ? (
                                        <>
                                          <div>
                                            <strong className="text-rose-700">Problem:</strong>{' '}
                                            {lc.problemSummary || lc.problemSymptoms || '—'}
                                          </div>
                                          <div>
                                            <strong className="text-emerald-800">Solution:</strong>{' '}
                                            {lc.solutionSummary ||
                                              lc.visitRecommendations ||
                                              lc.problemActionsTaken ||
                                              '—'}
                                          </div>
                                        </>
                                      ) : (
                                        <div className="space-y-1">
                                          <div>
                                            <strong className="text-rose-700">Problem:</strong>
                                            <textarea
                                              rows={2}
                                              value={lc.problemSummary || ''}
                                              onChange={(e) =>
                                                updateCropRowLifecycleField(
                                                  cropRow.id,
                                                  'problemSummary',
                                                  e.target.value,
                                                  stageRowIdx
                                                )
                                              }
                                              placeholder="Enter problem summary..."
                                              className="w-full bg-white text-[11px] text-slate-800 px-2 py-1 rounded-md border border-rose-400/50 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-rose-500 focus:ring-1 focus:ring-rose-400 focus:outline-none"
                                            />
                                          </div>
                                          <div>
                                            <strong className="text-emerald-800">Solution:</strong>
                                            <textarea
                                              rows={2}
                                              value={lc.solutionSummary || ''}
                                              onChange={(e) =>
                                                updateCropRowLifecycleField(
                                                  cropRow.id,
                                                  'solutionSummary',
                                                  e.target.value,
                                                  stageRowIdx
                                                )
                                              }
                                              placeholder="Enter solution summary..."
                                              className="w-full bg-white text-[11px] text-slate-800 px-2 py-1 rounded-md border border-emerald-500/40 resize-none overflow-y-auto pop-thin-scroll leading-relaxed focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Modal Save Bar inside Tab 2 */}
                  <div className="bg-white rounded-2xl border-2 border-black p-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-black">
                      {modalMode === 'VIEW'
                        ? 'Read-Only View — Click "Edit Farmer Form" to modify Farmer Lifecycle details.'
                        : 'Save changes to Farmer Lifecycle & Farmer Data Form.'}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setModalMode(null);
                          setActiveRecord(null);
                        }}
                        className="px-4 py-2 rounded-xl border border-black bg-white hover:bg-neutral-100 text-black font-bold text-xs cursor-pointer"
                      >
                        Close
                      </button>
                      {modalMode === 'VIEW' ? (
                        <button
                          type="button"
                          onClick={() => setModalMode('EDIT')}
                          className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Farmer Form</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>
                            {saving
                              ? 'Saving...'
                              : modalMode === 'CREATE'
                              ? 'Save New Farmer'
                              : 'Update Farmer Form'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* DELETE CONFIRMATION MODAL                                           */}
      {/* =================================================================== */}
      {deleteTarget && (
        <div
          style={{ zIndex: 9998 }}
          className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">Delete Farmer Data Form</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete the Farmer Data Form for{' '}
              <strong>{deleteTarget.name}</strong> ({deleteTarget.mobileNumber} — {deleteTarget.crop})?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
              >
                {saving ? 'Deleting...' : 'Yes, Delete Form'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Confirmation Modal for Adding / Deleting Crops */}
      <CropConfirmationModal
        isOpen={cropConfirmModal.isOpen}
        type={cropConfirmModal.type}
        cropName={cropConfirmModal.cropName}
        onConfirm={handleConfirmCropModal}
        onCancel={() => setCropConfirmModal({ isOpen: false, type: 'add' })}
      />

      {/* Field Camera Capture & Crop Photographic Gallery Modal */}
      <FieldCameraCaptureModal
        isOpen={cameraModalConfig.isOpen}
        onClose={() => setCameraModalConfig((prev) => ({ ...prev, isOpen: false }))}
        farmerName={formData.name || 'Farmer'}
        farmerId={formData.farmerId || ''}
        mobileNumber={formData.mobileNumber || ''}
        totalAcreage={formData.acres || '10'}
        activeCropId={selectedLifecycleCropId}
        activeCropName={
          (selectedLifecycleCropId === 'primary'
            ? formData.crop
            : (formData.additionalCrops || []).find((c: any) => c.id === selectedLifecycleCropId)?.crop) ||
          formData.crop ||
          'General Crop'
        }
        activeCropAcreage={
          (selectedLifecycleCropId === 'primary'
            ? formData.cropAcreage
            : (formData.additionalCrops || []).find((c: any) => c.id === selectedLifecycleCropId)?.cropAcreage) ||
          formData.cropAcreage ||
          ''
        }
        activeVariety={
          (selectedLifecycleCropId === 'primary'
            ? formData.variety
            : (formData.additionalCrops || []).find((c: any) => c.id === selectedLifecycleCropId)?.variety) ||
          formData.variety ||
          ''
        }
        activeCropType={
          (selectedLifecycleCropId === 'primary'
            ? formData.cropType
            : (formData.additionalCrops || []).find((c: any) => c.id === selectedLifecycleCropId)?.cropType) ||
          formData.cropType ||
          ''
        }
        sectionId={cameraModalConfig.sectionId}
        sectionName={cameraModalConfig.sectionName}
        targetFieldName={cameraModalConfig.targetFieldName}
        allCropsSummary={[
          {
            cropId: 'primary',
            cropName: formData.crop || 'Crop 1',
            cropAcreage: formData.cropAcreage || formData.acres || '',
            variety: formData.variety || '',
            cropType: formData.cropType || '',
          },
          ...(formData.additionalCrops || []).map((c: any, i: number) => ({
            cropId: c.id,
            cropName: c.crop || `Crop #${i + 2}`,
            cropAcreage: c.cropAcreage || '',
            variety: c.variety || '',
            cropType: c.cropType || '',
          })),
        ]}
        onPhotoSaved={handlePhotoSavedFromModal}
      />
    </div>
  );
}
