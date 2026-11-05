'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  CheckCircle2,
  Sprout,
  Tractor,
  Droplets,
  Printer,
  Save,
  Send,
  Sparkles,
  RotateCcw,
  Lock,
  ArrowRight,
  ShieldCheck,
  Target,
  BarChart3,
  TrendingUp,
  LogOut,
  HelpCircle,
  FileText,
  Download,
  Activity,
  Check,
  Clock,
  Camera,
  Eye,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import CropConfirmationModal from '@/components/crop/CropConfirmationModal';
import { FieldCameraCaptureModal, CropSummaryItem, sanitizeFieldPhotos } from '@/components/pop/FieldCameraCaptureModal';
import { CROP_VARIETIES_BY_CATEGORY, ALL_CROP_VARIETIES } from '@/lib/crop-varieties';
import { useAuth } from '@/lib/auth-client';
import { validatePhoneNumber, validateEmailOptional, validatePinCode } from '@/lib/validation';

export interface ScheduleRow {
  id: string;
  stageName: string;
  dayRange: string;
  startDay: number;
  endDay: number;
  sownDate: string;
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

export interface CropPresetData {
  days: number;
  defaultVariety: string;
  defaultSoilType: string;
  defaultIrrigationType: string;
  defaultWaterSource: string;
  defaultPlantCountPerAcre: string;
  defaultMainRequirement: string;
  defaultProblemType: string;
  defaultSolutionType: string;
  defaultApplicationMethod: string;
  defaultServiceType: string;
  defaultFarmMaterial: string;
  defaultEquipment: string;
  defaultHarvestPlanning: string;
  defaultPackagingType: string;
  schedule: ScheduleRow[];
}

const POP_PRESETS: Record<string, CropPresetData> = {
  Maize: {
    days: 110,
    defaultVariety: 'Hybrid Maize (NK-6240 / Pioneer 3396)',
    defaultSoilType: 'Red Sandy Loam / Black Cotton Soil',
    defaultIrrigationType: 'Drip / Furrow Irrigation',
    defaultWaterSource: 'Borewell',
    defaultPlantCountPerAcre: '33,333 Plants / Acre',
    defaultMainRequirement: 'Balanced NPK Nutrition & Fall Armyworm (FAW) Protection',
    defaultProblemType: 'Fall Armyworm (FAW), Stem Borer & Turcicum Leaf Blight',
    defaultSolutionType: 'Integrated Pest Management (Spinetoram 11.7 SC + Azoxystrobin)',
    defaultApplicationMethod: 'Foliar Whorl Spray & Basal Soil Incorporation',
    defaultServiceType: 'Mechanical Deep Ploughing, Boom Spraying & Combine Harvesting',
    defaultFarmMaterial: 'Certified Hybrid Seed, DAP, Urea, MOP, Zinc Sulphate & Pheromone Traps',
    defaultEquipment: 'Tractor Rotavator, Power Weeder, Battery Boom Sprayer & Combine Harvester',
    defaultHarvestPlanning: 'Mechanical Combine Harvest at 16–18% Grain Moisture & Sun Drying to 12%',
    defaultPackagingType: '50 kg Jute / PP Woven Moisture-Proof Gunny Bags',
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
        recommendedSolution: 'Direct whorl spray of Spinetoram 11.7 SC @ 0.5ml/L or Emamectin Benzoate @ 0.4g/L + Top dress 35kg Urea/acre',
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
        recommendedSolution: 'Uninterrupted irrigation during silking + Foliar spray of Azoxystrobin + Difenoconazole @ 1ml/L + 15kg MOP/acre',
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
        recommendedSolution: 'Harvest immediately upon black layer formation using Combine Harvester; sun-dry kernels to 12% moisture before bagging',
      },
    ],
  },
  Paddy: {
    days: 130,
    defaultVariety: 'BPT-5204 (Sona Masuri) / IR-64',
    defaultSoilType: 'Clayey Loam / Alluvial Soil',
    defaultIrrigationType: 'Canal / Check-Basin Flood (AWD)',
    defaultWaterSource: 'Canal / Borewell',
    defaultPlantCountPerAcre: '1,30,000 Hills / Acre',
    defaultMainRequirement: 'Puddling Leveling, Split Nitrogen & Stem Borer / Blast Management',
    defaultProblemType: 'Yellow Stem Borer, Brown Plant Hopper (BPH) & Neck Blast',
    defaultSolutionType: 'Systemic Fungicide + Granular Insecticide (Cartap + Tricyclazole)',
    defaultApplicationMethod: 'Basal Granule Broadcast & Canopy Foliar Spray',
    defaultServiceType: 'Wet Cage-Wheel Puddling, Cono-Weeding & Track Combine Harvesting',
    defaultFarmMaterial: 'Certified Paddy Seeds, DAP, Urea, Zinc Sulphate, Cartap 4G, Tricyclazole',
    defaultEquipment: 'Tractor Cage Wheel, Cono Weeder, Knapsack Sprayer & Track Combine Harvester',
    defaultHarvestPlanning: 'Drain Field 10 Days Pre-Harvest; Track Combine Harvest at 20% Moisture',
    defaultPackagingType: '60 kg / 75 kg Standard Paddy Gunny Bags',
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
        recommendedSolution: 'Apply 10kg Zinc Sulphate/acre basally + Broadcast Pretilachlor 50% EC @ 500ml/acre mixed with sand within 4 DAT',
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
        recommendedSolution: 'Part canopy and spray Pymetrozine 50% WG @ 0.6g/L at plant base for BPH + Tricyclazole 75% WP @ 0.6g/L for Neck Blast',
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
        recommendedSolution: 'Drain water completely 10 days prior to harvest; harvest with Track Combine at 85% golden panicle stage and dry to 14%',
      },
    ],
  },
  Tomato: {
    days: 120,
    defaultVariety: 'Arka Rakshak / Syngenta Abhinav F1',
    defaultSoilType: 'Well-Drained Red Loam (pH 6.5–7.0)',
    defaultIrrigationType: 'Inline Drip Fertigation with Mulch',
    defaultWaterSource: 'Borewell / Farm Pond',
    defaultPlantCountPerAcre: '12,000 Plants / Acre',
    defaultMainRequirement: 'Raised Bed Mulching, Trellis Staking & Water-Soluble Fertigation',
    defaultProblemType: 'Early/Late Blight, Leaf Miner, Whitefly (ToLCV) & Fruit Borer',
    defaultSolutionType: 'Bio-Root Drenching + Preventive Systemic Spray + Calcium/Boron Fertigation',
    defaultApplicationMethod: 'Venturi Drip Fertigation & High-Pressure Foliar Spray',
    defaultServiceType: 'Raised Bed Preparation, Mulch Laying, Staking & Refrigerated Crate Transport',
    defaultFarmMaterial: 'Silver-Black Mulch Sheet, Bamboo/GI Wire, 19:19:19, 13:00:45, Calcium Nitrate',
    defaultEquipment: 'Bed Maker, Drip Venturi Injector, Power Sprayer & Ventilated Plastic Crates',
    defaultHarvestPlanning: 'Multi-Pick Harvesting Every 4 Days at Breaker/Turning Stage',
    defaultPackagingType: '20 kg Ventilated Returnable Plastic Crates',
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
        recommendedSolution: 'Root zone drenching with Trichoderma viride @ 10g/L + Install 15 yellow/blue sticky traps per acre immediately after planting',
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
        recommendedSolution: 'Spray Cyantraniliprole 10.26 OD @ 1.8ml/L + Prune lower 15cm side suckers touching the mulch sheet to improve airflow',
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
        keyProblem: 'Blossom End Rot (Calcium deficiency), flower drop & Fruit Borer (Helicoverpa)',
        recommendedSolution: 'Drip fertigate Calcium Nitrate @ 4kg/acre + Foliar Boron 20% @ 1g/L + Spray Flubendiamide 39.35 SC @ 0.3ml/L',
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
        recommendedSolution: 'Weekly 0:0:50 SOP fertigation for skin firmness + Bio-safe Azadirachtin 10,000 ppm @ 3ml/L + Grade into 20kg ventilated plastic crates',
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
  'Arunachal Pradesh': [
    'Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Kamle', 'Kra Daadi',
    'Kurung Kumey', 'Lepa Rada', 'Lohit', 'Longding', 'Lower Dibang Valley', 'Lower Siang',
    'Lower Subansiri', 'Namsai', 'Pakke Kessang', 'Papum Pare', 'Shi Yomi', 'Siang', 'Tawang',
    'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang', 'Itanagar Capital Complex',
  ],
  'Assam': [
    'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang',
    'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai',
    'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur',
    'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar',
    'Tinsukia', 'Udalguri', 'West Karbi Anglong',
  ],
  'Bihar': [
    'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar',
    'Darbhanga', 'East Champaran (Motihari)', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur (Bhabua)',
    'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger (Monghyr)',
    'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia (Purnea)', 'Rohtas', 'Saharsa', 'Samastipur',
    'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran',
  ],
  'Chhattisgarh': [
    'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada',
    'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 'Jashpur',
    'Kabirdham (Kawardha)', 'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Mungeli',
    'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja',
  ],
  'Goa': [
    'North Goa', 'South Goa',
  ],
  'Gujarat': [
    'Ahmedabad', 'Amreli', ' Anand', 'Aravalli', 'Banaskantha (Palanpur)', 'Bharuch', 'Bhavnagar',
    'Botad', 'Chhota Udaipur', 'Dahod', 'Dangs (Ahwa)', 'Devbhoomi Dwarka', 'Gandhinagar',
    'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kachchh', 'Kheda (Nadiad)', 'Mahisagar', 'Mehsana',
    'Morbi', 'Narmada (Rajpipla)', 'Navsari', 'Panchmahal (Godhra)', 'Patan', 'Porbandar', 'Rajkot',
    'Sabarkantha (Himmatnagar)', 'Surat', 'Surendranagar', 'Tapi (Vyara)', 'Vadodara', 'Valsad',
  ],
  'Haryana': [
    'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram (Gurgaon)', 'Hisar',
    'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal',
    'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar',
  ],
  'Himachal Pradesh': [
    'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti', 'Mandi',
    'Shimla', 'Sirmaur', 'Solan', 'Una',
  ],
  'Jharkhand': [
    'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', ' Dumka', 'East Singhbhum', 'Garhwa', 'Giridih',
    'Godda', 'Gumla', 'Hazaribag', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga',
    'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Seraikela-Kharsawan', 'Simdega',
    'West Singhbhum',
  ],
  'Karnataka': KARNATAKA_DISTRICTS,
  'Kerala': [
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode',
    'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad',
  ],
  'Madhya Pradesh': [
    'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind',
    'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori',
    'Guna', 'Gwalior', 'Harda', 'Hoshangabad (Narmadapuram)', 'Indore', 'Jabalpur', 'Jhabua',
    'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch',
    'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni',
    'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain',
    'Umaria', 'Vidisha',
  ],
  'Maharashtra': [
    'Ahmednagar', 'Akola', 'Amravati', 'Chhatrapati Sambhajinagar (Aurangabad)', 'Beed', 'Bhandara',
    'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna',
    'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar',
    'Nashik', 'Dharashiv (Osmanabad)', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri',
    'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal',
  ],
  'Manipur': [
    'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching',
    'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal',
    'Ukhrul',
  ],
  'Meghalaya': [
    'East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'Eastern West Khasi Hills',
    'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills',
    'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills',
  ],
  'Mizoram': [
    'Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit',
    'Saiha', 'Saitual', 'Serchhip',
  ],
  'Nagaland': [
    'Chumoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Niuland',
    'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyu', 'Tuensang', 'Wokha', 'Zunheboto',
  ],
  'Odisha': [
    'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh',
    'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi',
    'Kandhamal', 'Kendrapara', 'Kendujhar (Keonjhar)', 'Khordha', 'Koraput', 'Malkangiri',
    'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur',
    'Subarnapur (Sonepur)', 'Sundargarh',
  ],
  'Punjab': [
    'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur',
    'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Malerkotla', 'Mansa',
    'Moga', 'Sri Muktsar Sahib', 'Pathankot', 'Patiala', 'Rupnagar', 'Sahibzada Ajit Singh Nagar (Mohali)',
    'Sangrur', 'Shahid Bhagat Singh Nagar (Nawanshahr)', 'Tarn Taran',
  ],
  'Rajasthan': [
    'Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi',
    'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer',
    'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh',
    'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur',
  ],
  'Sikkim': [
    'Gangtok (East Sikkim)', 'Gyalshing (West Sikkim)', 'Mangan (North Sikkim)', 'Namchi (South Sikkim)',
    'Pakyong', 'Soreng',
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
  'Tripura': [
    'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti',
    'West Tripura',
  ],
  'Uttar Pradesh': [
    'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh',
    'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti',
    'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah',
    'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar (Noida)', 'Ghaziabad',
    'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun',
    'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi',
    'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri',
    'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh',
    'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur',
    'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi',
  ],
  'Uttarakhand': [
    'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital',
    'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi',
  ],
  'West Bengal': [
    'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 'Hooghly',
    'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia',
    'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman',
    'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur',
  ],
  'Andaman and Nicobar Islands': [
    'Nicobar', 'North and Middle Andaman', 'South Andaman',
  ],
  'Chandigarh': [
    'Chandigarh',
  ],
  'Dadra and Nagar Haveli and Daman and Diu': [
    'Dadra and Nagar Haveli', 'Daman', 'Diu',
  ],
  'Delhi (NCT)': [
    'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
    'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi',
  ],
  'Jammu and Kashmir': [
    'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua',
    'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba',
    'Shopian', 'Srinagar', 'Udhampur',
  ],
  'Ladakh': [
    'Kargil', 'Leh',
  ],
  'Lakshadweep': [
    'Lakshadweep',
  ],
  'Puducherry': [
    'Karaikal', 'Mahe', 'Puducherry', 'Yanam',
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
  'Ragi / Finger millet',
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

const EMPTY_FORM_DATA = {
  id: '',
  // 1. Farm Profile — all fields empty (not hardcoded)
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

  // 2. Crop Selection — all fields empty (not hardcoded)
  cropType: '',
  crop: '',
  variety: '',
  plantingDate: '',
  cropAge: '',
  cropAcreage: '',
  plantCount: '',
  spacing: '',
  currentCropStage: '',
  additionalCrops: [] as CropSelectionItem[],

  // 3. Crop Requirements and Services — all fields empty (not hardcoded)
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

  // Legacy / API sync fields
  vleFpoNo: '',
  distanceFromVle: '',
  irrigation: [] as string[],
  jobWork: [] as string[],
  popAttached: '',

  // =========================================================================
  // 2. Additional Features to Build into the Farmer Profile App (Farmer Lifecycle)
  // =========================================================================
  // 1. Farmer Visit and Advisory History
  visitDate: '',
  advisorName: '',
  visitCropStage: '',
  cropObservations: '',
  visitRecommendations: '',
  visitApplicationType: '',
  farmerFeedback: '',
  visitPhotographs: '',
  nextFollowUpDate: '',

  // 2. Pest, Disease and Crop Problem Tracking
  problemFieldPhotos: '',
  problemSymptoms: '',
  problemSeverity: '',
  problemActionsTaken: '',
  problemResolved: '',

  // 3. Irrigation and Weather Alerts
  waterAvailability: '',
  irrigationSchedules: '',
  rainfallAlert: '',
  heatAlert: '',
  weatherAlerts: '',

  // 4. Soil Health and Fertilizer Recommendations
  soilTestReport: '',
  soilReportFileName: '',
  soilReportFileData: '',
  nutrientRecommendations: '',
  fertilizerHistory: '',
  nextSoilTestDate: '',

  // 5. Harvest, Yield and Market Information
  harvestingDate: '',
  harvestedQuantity: '',
  sellingPrice: '',
  buyerName: '',
  marketExpenses: '',
  cropWiseReturns: '',
  localMarketPriceInfo: '',
  harvestPicking: '',

  // 6. Farmer Communication and Follow-ups
  whatsappConsent: '',
  advisoryMessages: '',
  trainingAttendance: '',
  communicationReminders: '',
  schemeInformation: '',
  pendingActions: '',

  // 7. Problem and Solution Summary
  problemSummary: '',
  solutionSummary: '',
  isPopTableEnabled: true,
};

export default function PackageOfPracticeForm() {
  const { user, isLoggedIn, logout, login } = useAuth();

  // Active Tab right below the Package of Practice (POP) hero banner:
  // 'form' -> Tab 1: Farmer Data Form
  // 'lifecycle' -> Tab 2: Farmer Lifecycle
  const [activeTab, setActiveTab] = useState<'form' | 'lifecycle'>('form');

  // Complete Form State — starts completely empty (no hardcoded values)
  const [formData, setFormData] = useState({ ...EMPTY_FORM_DATA });

  // Read-only Standardized POP Activity Schedule Table
  const [schedule, setSchedule] = useState<ScheduleRow[]>(POP_PRESETS.Maize.schedule);

  // Status & UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [savedDraftToast, setSavedDraftToast] = useState(false);

  // Soil Type, Irrigation Type, Crop Type, Crop, State & District Dropdown States
  const [soilDropdownOpen, setSoilDropdownOpen] = useState(false);
  const [newSoilInput, setNewSoilInput] = useState('');
  const [irrigationDropdownOpen, setIrrigationDropdownOpen] = useState(false);
  const [newIrrigationInput, setNewIrrigationInput] = useState('');
  const [cropTypeDropdownOpen, setCropTypeDropdownOpen] = useState(false);
  const [newCropTypeInput, setNewCropTypeInput] = useState('');
  const [cropDropdownOpen, setCropDropdownOpen] = useState(false);
  const [newCropInput, setNewCropInput] = useState('');
  const [varietyDropdownOpen, setVarietyDropdownOpen] = useState(false);
  const [newVarietyInput, setNewVarietyInput] = useState('');
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [newStateInput, setNewStateInput] = useState('');
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [newDistrictInput, setNewDistrictInput] = useState('');
  const [problemDropdownOpen, setProblemDropdownOpen] = useState(false);
  const [newProblemInput, setNewProblemInput] = useState('');
  const [solutionDropdownOpen, setSolutionDropdownOpen] = useState(false);
  const [newSolutionInput, setNewSolutionInput] = useState('');
  const [mainReqDropdownOpen, setMainReqDropdownOpen] = useState(false);
  const [newMainReqInput, setNewMainReqInput] = useState('');
  const [cropStageDropdownOpen, setCropStageDropdownOpen] = useState(false);
  const [newCropStageInput, setNewCropStageInput] = useState('');

  // Yes/No + Dropdown states for Materials Required & Equipment Required
  const [materialsRequiredChoice, setMaterialsRequiredChoice] = useState<'YES' | 'NO' | ''>('');
  const [materialsDropdownOpen, setMaterialsDropdownOpen] = useState(false);
  const [newMaterialInput, setNewMaterialInput] = useState('');

  const [equipmentRequiredChoice, setEquipmentRequiredChoice] = useState<'YES' | 'NO' | ''>('');
  const [equipmentDropdownOpen, setEquipmentDropdownOpen] = useState(false);
  const [newEquipmentInput, setNewEquipmentInput] = useState('');

  // Application Type & Crop Stage dropdown states inside 1. Farmer Visit and Advisory History
  const [visitCropStageDropdownOpen, setVisitCropStageDropdownOpen] = useState(false);
  const [newVisitCropStageInput, setNewVisitCropStageInput] = useState('');
  const [visitAppTypeDropdownOpen, setVisitAppTypeDropdownOpen] = useState(false);
  const [newVisitAppTypeInput, setNewVisitAppTypeInput] = useState('');

  // Harvested Quantity dropdown state inside 5. Harvest, Yield and Market Information
  const [harvestQuantityDropdownOpen, setHarvestQuantityDropdownOpen] = useState(false);
  const [newHarvestQuantityInput, setNewHarvestQuantityInput] = useState('');

  // Dropdown states for dynamically added Additional Crop Selection blocks
  const [currentCropStageDropdownOpen, setCurrentCropStageDropdownOpen] = useState(false);
  const [newCurrentCropStageInput, setNewCurrentCropStageInput] = useState('');
  const [extraCropTypeOpenId, setExtraCropTypeOpenId] = useState<string | null>(null);
  const [extraCropOpenId, setExtraCropOpenId] = useState<string | null>(null);
  const [extraVarietyOpenId, setExtraVarietyOpenId] = useState<string | null>(null);
  const [extraCurrentCropStageOpenId, setExtraCurrentCropStageOpenId] = useState<string | null>(
    null
  );
  const [extraCropTypeInputs, setExtraCropTypeInputs] = useState<Record<string, string>>({});
  const [extraCropInputs, setExtraCropInputs] = useState<Record<string, string>>({});
  const [extraVarietyInputs, setExtraVarietyInputs] = useState<Record<string, string>>({});
  const [extraCurrentCropStageInputs, setExtraCurrentCropStageInputs] = useState<
    Record<string, string>
  >({});

  // Selected Crop Button in Tab 2: Farmer Lifecycle ('primary' for Crop #1, or cropBlock.id for Crop #2, #3, etc.)
  const [selectedLifecycleCropId, setSelectedLifecycleCropId] = useState<string>('primary');
  // Per-crop Farmer Lifecycle state map so each crop button displays only its own Farmer Lifecycle details
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
    url: _url,
  }: {
    fileName: string;
    url: string;
  }) => {
    const targetField = cameraModalConfig.targetFieldName;

    setFormData((prev: any) => {
      const currentVal = String(prev[targetField] || '');
      const existing = currentVal
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
      const updatedList = existing.includes(fileName) ? existing : [...existing, fileName];
      const clamped = updatedList.slice(0, 5);
      const clampedStr = clamped.join(', ');

      const nextAdditional = (prev.additionalCrops || []).map((item: any) => {
        if (item.id === selectedLifecycleCropId) {
          return {
            ...item,
            lifecycleData: {
              ...(item.lifecycleData || {}),
              [targetField]: clampedStr,
            },
          };
        }
        return item;
      });

      return {
        ...prev,
        [targetField]: clampedStr,
        additionalCrops: nextAdditional,
      };
    });

    // Update active crop lifecycle map (up to 5 photos per crop)
    setCropLifecycleMap((prev) => {
      const currentMapLc = prev[selectedLifecycleCropId] || EMPTY_LIFECYCLE_DATA;
      const currentVal = String((currentMapLc as any)[targetField] || '');
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
          [targetField]: clamped.join(', '),
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
      const remainingStr = remaining.join(', ');

      const nextAdditional = (prev.additionalCrops || []).map((item: any) => {
        if (item.id === selectedLifecycleCropId) {
          return {
            ...item,
            lifecycleData: {
              ...(item.lifecycleData || {}),
              [fieldName]: remainingStr,
            },
          };
        }
        return item;
      });

      return {
        ...prev,
        [fieldName]: remainingStr,
        additionalCrops: nextAdditional,
      };
    });

    setCropLifecycleMap((prev) => {
      const currentMapLc = prev[selectedLifecycleCropId] || EMPTY_LIFECYCLE_DATA;
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

  // Inline Login / Sign In state (Phone Number or Username + Password)
  const [authMode, setAuthMode] = useState<'login' | 'signin'>('login');

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
    setCropConfirmModal({
      isOpen: true,
      type: 'add',
    });
  };

  const handleOpenDeleteCropModal = (targetId: string, cropName?: string) => {
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
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authMobile, setAuthMobile] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccessMessage, setAuthSuccessMessage] = useState('');

  const extractLifecycleFromState = (state: Record<string, any>): CropLifecycleData => {
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
        ...(prev[selectedLifecycleCropId] || extractLifecycleFromState(formData)),
        ...updates,
      },
    }));
  };

  const handleSelectLifecycleCrop = (targetCropId: string) => {
    if (targetCropId === selectedLifecycleCropId) return;

    const currentData = extractLifecycleFromState(formData);
    const updatedMap: Record<string, CropLifecycleData> = {
      ...cropLifecycleMap,
      [selectedLifecycleCropId]: currentData,
    };

    const targetItem = (formData.additionalCrops || []).find((c) => c.id === targetCropId);
    const rawTarget: CropLifecycleData =
      updatedMap[targetCropId] ||
      (targetItem?.lifecycleData
        ? { ...EMPTY_LIFECYCLE_DATA, ...targetItem.lifecycleData }
        : { ...EMPTY_LIFECYCLE_DATA });
    const targetData: CropLifecycleData =
      targetCropId === 'primary'
        ? {
            ...rawTarget,
            soilReportFileName: rawTarget.soilReportFileName || '',
            soilReportFileData: rawTarget.soilReportFileData || '',
          }
        : {
            ...rawTarget,
            soilReportFileName:
              rawTarget.soilReportFileName ||
              targetItem?.soilReportFileName ||
              targetItem?.lifecycleData?.soilReportFileName ||
              '',
            soilReportFileData:
              rawTarget.soilReportFileData ||
              targetItem?.soilReportFileData ||
              targetItem?.lifecycleData?.soilReportFileData ||
              '',
          };

    setCropLifecycleMap(updatedMap);
    setSelectedLifecycleCropId(targetCropId);
    setVisitCropStageDropdownOpen(false);
    setVisitAppTypeDropdownOpen(false);
    setHarvestQuantityDropdownOpen(false);
    setNewVisitCropStageInput('');
    setNewVisitAppTypeInput('');
    setNewHarvestQuantityInput('');

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
    setFormData((prev) => ({
      ...prev,
      additionalCrops: (prev.additionalCrops || []).map((item) =>
        item.id === blockId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleRemoveAdditionalCrop = (blockId: string) => {
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

  // Districts filtered strictly by the currently selected State
  const availableStateDistricts = STATE_DISTRICTS_MAP[formData.state] || [];

  // When a particular person logs in, prefill ONLY if that person has filled data earlier.
  // When signed out (!user), keep the entire Package of Practice page completely fresh and empty.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agrimart_pop_draft_v2');
    }

    if (!user) {
      setFormData({ ...EMPTY_FORM_DATA });
      setSelectedLifecycleCropId('primary');
      setCropLifecycleMap({});
      setCropExtraLifecycleStagesMap({});
      setSchedule(POP_PRESETS.Maize.schedule);
      setSubmissionSuccess(false);
      setSubmissionId('');
      return;
    }

    let cancelled = false;
    const checkUserPreviousSubmission = async () => {
      try {
        const userPhone = (user.mobile || user.phone || '').replace(/\D/g, '').slice(-10);
        const params = new URLSearchParams({
          forUser: '1',
          userId: user.id || '',
          mobile: userPhone,
          email: user.email || '',
          username: user.name || '',
        });

        const res = await fetch(`/api/package-of-practice?${params.toString()}`, {
          cache: 'no-store',
        });
        const json = await res.json();

        if (cancelled) return;

        if (json.success && (json.lastBackendUpdatedRecord || json.record)) {
          const rec = json.lastBackendUpdatedRecord || json.record;
          const primarySavedLc = (rec as any).cropLifecycleMap?.primary || {};
          const primarySoilFileName =
            primarySavedLc.soilReportFileName ?? rec.soilReportFileName ?? '';
          const primarySoilFileData =
            primarySavedLc.soilReportFileData ?? rec.soilReportFileData ?? '';
          const loadedForm = {
            ...EMPTY_FORM_DATA,
            id: rec.id || '',
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
            additionalCrops: Array.isArray(rec.additionalCrops) ? rec.additionalCrops : [],
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
            irrigation: [],
            jobWork: [],
            popAttached: '',
            visitDate: primarySavedLc.visitDate || rec.visitDate || '',
            advisorName: primarySavedLc.advisorName || rec.advisorName || '',
            visitCropStage: primarySavedLc.visitCropStage || rec.visitCropStage || '',
            cropObservations: primarySavedLc.cropObservations || rec.cropObservations || '',
            visitRecommendations:
              primarySavedLc.visitRecommendations || rec.visitRecommendations || '',
            visitApplicationType:
              primarySavedLc.visitApplicationType || rec.visitApplicationType || '',
            farmerFeedback: primarySavedLc.farmerFeedback || rec.farmerFeedback || '',
            visitPhotographs: sanitizeFieldPhotos(primarySavedLc.visitPhotographs || rec.visitPhotographs || ''),
            nextFollowUpDate: primarySavedLc.nextFollowUpDate || rec.nextFollowUpDate || '',
            problemFieldPhotos: sanitizeFieldPhotos(primarySavedLc.problemFieldPhotos || rec.problemFieldPhotos || ''),
            problemSymptoms: primarySavedLc.problemSymptoms || rec.problemSymptoms || '',
            problemSeverity: primarySavedLc.problemSeverity || rec.problemSeverity || '',
            problemActionsTaken:
              primarySavedLc.problemActionsTaken || rec.problemActionsTaken || '',
            problemResolved: primarySavedLc.problemResolved || rec.problemResolved || '',
            waterAvailability: primarySavedLc.waterAvailability || rec.waterAvailability || '',
            irrigationSchedules:
              primarySavedLc.irrigationSchedules || rec.irrigationSchedules || '',
            rainfallAlert: primarySavedLc.rainfallAlert || rec.rainfallAlert || '',
            heatAlert: primarySavedLc.heatAlert || rec.heatAlert || '',
            weatherAlerts: primarySavedLc.weatherAlerts || rec.weatherAlerts || '',
            soilTestReport: primarySavedLc.soilTestReport || rec.soilTestReport || '',
            soilReportFileName: primarySoilFileName,
            soilReportFileData: primarySoilFileData,
            nutrientRecommendations:
              primarySavedLc.nutrientRecommendations || rec.nutrientRecommendations || '',
            fertilizerHistory: primarySavedLc.fertilizerHistory || rec.fertilizerHistory || '',
            nextSoilTestDate: primarySavedLc.nextSoilTestDate || rec.nextSoilTestDate || '',
            harvestingDate: primarySavedLc.harvestingDate || rec.harvestingDate || '',
            harvestedQuantity: primarySavedLc.harvestedQuantity || rec.harvestedQuantity || '',
            sellingPrice: primarySavedLc.sellingPrice || rec.sellingPrice || '',
            buyerName: primarySavedLc.buyerName || rec.buyerName || '',
            marketExpenses: primarySavedLc.marketExpenses || rec.marketExpenses || '',
            cropWiseReturns: primarySavedLc.cropWiseReturns || rec.cropWiseReturns || '',
            localMarketPriceInfo:
              primarySavedLc.localMarketPriceInfo || rec.localMarketPriceInfo || '',
            harvestPicking: primarySavedLc.harvestPicking || rec.harvestPicking || '',
            whatsappConsent: primarySavedLc.whatsappConsent || rec.whatsappConsent || '',
            advisoryMessages: primarySavedLc.advisoryMessages || rec.advisoryMessages || '',
            trainingAttendance: primarySavedLc.trainingAttendance || rec.trainingAttendance || '',
            communicationReminders:
              primarySavedLc.communicationReminders || rec.communicationReminders || '',
            schemeInformation: primarySavedLc.schemeInformation || rec.schemeInformation || '',
            pendingActions: primarySavedLc.pendingActions || rec.pendingActions || '',
            problemSummary: primarySavedLc.problemSummary || rec.problemSummary || '',
            solutionSummary: primarySavedLc.solutionSummary || rec.solutionSummary || '',
          };
          const initialLifecycleMap: Record<string, CropLifecycleData> = {
            primary: {
              ...extractLifecycleFromState(loadedForm),
              soilReportFileName: primarySoilFileName,
              soilReportFileData: primarySoilFileData,
            },
          };
          (loadedForm.additionalCrops || []).forEach((item: CropSelectionItem) => {
            const mapLc = (rec as any).cropLifecycleMap?.[item.id] || {};
            const itemLc = item.lifecycleData || {};
            initialLifecycleMap[item.id] = {
              ...EMPTY_LIFECYCLE_DATA,
              ...mapLc,
              ...itemLc,
              soilReportFileName:
                item.soilReportFileName ||
                itemLc.soilReportFileName ||
                mapLc.soilReportFileName ||
                '',
              soilReportFileData:
                item.soilReportFileData ||
                itemLc.soilReportFileData ||
                mapLc.soilReportFileData ||
                '',
            };
          });
          setCropLifecycleMap(initialLifecycleMap);
          setSelectedLifecycleCropId((prevCropId) => {
            const existsInExtra = (loadedForm.additionalCrops || []).some(
              (c: CropSelectionItem) => c.id === prevCropId
            );
            const activeCropId = prevCropId !== 'primary' && existsInExtra ? prevCropId : 'primary';
            const activeLc = initialLifecycleMap[activeCropId] || initialLifecycleMap.primary;
            const isTableActive =
              rec.isPopTableEnabled !== undefined
                ? Boolean(rec.isPopTableEnabled)
                : json.globalPopTableEnabled !== undefined
                ? Boolean(json.globalPopTableEnabled)
                : true;
            setFormData({
              ...loadedForm,
              ...activeLc,
              isPopTableEnabled: isTableActive,
            });
            return activeCropId;
          });
          const loadedExtraStages: Record<string, CropLifecycleData[]> = {};
          const rawExtra = (rec as any).cropExtraLifecycleStagesMap || {};
          for (const [k, v] of Object.entries(rawExtra)) {
            if (Array.isArray(v)) {
              loadedExtraStages[k] = v.map((stageObj: any) => ({
                ...EMPTY_LIFECYCLE_DATA,
                ...(stageObj || {}),
              }));
            }
          }
          setCropExtraLifecycleStagesMap(loadedExtraStages);

          if (Array.isArray(rec.schedule) && rec.schedule.length > 0) {
            setSchedule(rec.schedule);
          } else if (rec.crop && POP_PRESETS[rec.crop]) {
            setSchedule(POP_PRESETS[rec.crop].schedule);
          }
        } else {
          // User has NOT filled data earlier -> keep all fields completely empty
          const isTableActive =
            json.globalPopTableEnabled !== undefined ? Boolean(json.globalPopTableEnabled) : true;
          setFormData({ ...EMPTY_FORM_DATA, isPopTableEnabled: isTableActive });
          setSelectedLifecycleCropId('primary');
          setCropLifecycleMap({});
          setCropExtraLifecycleStagesMap({});
          setSchedule(POP_PRESETS.Maize.schedule);
        }
      } catch {
        if (!cancelled) {
          setFormData({ ...EMPTY_FORM_DATA });
          setSelectedLifecycleCropId('primary');
          setCropLifecycleMap({});
          setCropExtraLifecycleStagesMap({});
        }
      }
    };

    checkUserPreviousSubmission();
    const handleWindowFocusOrVisible = () => {
      if (!document.hidden) {
        checkUserPreviousSubmission();
      }
    };
    window.addEventListener('focus', handleWindowFocusOrVisible);
    document.addEventListener('visibilitychange', handleWindowFocusOrVisible);
    const pollInterval =
      activeTab === 'lifecycle'
        ? window.setInterval(() => {
            if (!document.hidden) {
              checkUserPreviousSubmission();
            }
          }, 3000)
        : null;
    return () => {
      cancelled = true;
      window.removeEventListener('focus', handleWindowFocusOrVisible);
      document.removeEventListener('visibilitychange', handleWindowFocusOrVisible);
      if (pollInterval) {
        window.clearInterval(pollInterval);
      }
    };
  }, [user, activeTab]);

  // Handle Form Input changes (no hardcoded field overwriting)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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
      setFormData((prev) => ({ ...prev, crop: value }));
      if (value && POP_PRESETS[value]) {
        setSchedule(POP_PRESETS[value].schedule);
      }
      return;
    }

    if (LIFECYCLE_FIELD_KEYS.includes(name as keyof CropLifecycleData)) {
      updateLifecycleFields({ [name]: value } as Partial<CropLifecycleData>);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate current crop progress days & percentage
  const numericAgeDays = (() => {
    const match = String(formData.cropAge || '').match(/\d+/);
    if (match) return parseInt(match[0], 10);
    if (formData.plantingDate) {
      const planted = new Date(formData.plantingDate);
      if (!isNaN(planted.getTime())) {
        return Math.max(0, Math.floor((Date.now() - planted.getTime()) / (1000 * 60 * 60 * 24)));
      }
    }
    return 0;
  })();

  const totalCycleDays = Math.max(1, parseInt(formData.cropCycleDays, 10) || 110);
  const progressPercent =
    numericAgeDays > 0
      ? Math.min(100, Math.max(5, Math.round((numericAgeDays / totalCycleDays) * 100)))
      : 0;

  const getStageStatus = (row: ScheduleRow): 'COMPLETED' | 'CURRENT' | 'UPCOMING' => {
    if (numericAgeDays <= 0) return 'UPCOMING';
    if (numericAgeDays > row.endDay) return 'COMPLETED';
    if (numericAgeDays >= row.startDay && numericAgeDays <= row.endDay) return 'CURRENT';
    return 'UPCOMING';
  };

  const handleSaveDraft = () => {
    setSavedDraftToast(true);
    setTimeout(() => setSavedDraftToast(false), 3500);
  };

  const triggerUploadedFileDownload = (targetFileName: string, fileData: string) => {
    try {
      const commaIndex = fileData.indexOf(',');
      const header = fileData.slice(0, commaIndex);
      const base64String = fileData.slice(commaIndex + 1);
      const mimeMatch = header.match(/data:([^;]+);/);
      const mimeType =
        mimeMatch?.[1] ||
        (targetFileName.toLowerCase().endsWith('.jpg') ||
        targetFileName.toLowerCase().endsWith('.jpeg')
          ? 'image/jpeg'
          : 'application/pdf');
      const byteCharacters = atob(base64String);
      const byteArrays = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteArrays], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = targetFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
    } catch {
      const link = document.createElement('a');
      link.href = fileData;
      link.download = targetFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadSoilReport = async (
    fileName?: string,
    fileData?: string,
    cropName?: string,
    _soilSummary?: string,
    targetCropId?: string
  ) => {
    const cleanName = (fileName || '').trim();
    if (fileData && fileData.startsWith('data:')) {
      const targetFileName = cleanName || `${cropName || formData.crop || 'Crop'}_Soil_Report.pdf`;
      triggerUploadedFileDownload(targetFileName, fileData);
      return;
    }

    // Fetch latest record from backend in case a Soil Report was just uploaded in the backend
    try {
      const userPhone = (user?.mobile || user?.phone || formData.mobileNumber || '')
        .replace(/\D/g, '')
        .slice(-10);
      const params = new URLSearchParams({
        forUser: '1',
        userId: user?.id || '',
        mobile: userPhone,
        email: user?.email || formData.emailId || '',
      });
      const res = await fetch(`/api/package-of-practice?${params.toString()}`, {
        cache: 'no-store',
      });
      const json = await res.json();
      const rec = json?.lastBackendUpdatedRecord || json?.record;
      if (rec) {
        const cropKey = targetCropId || selectedLifecycleCropId;
        let fetchedName = '';
        let fetchedData = '';
        if (cropKey === 'primary') {
          fetchedName =
            rec.cropLifecycleMap?.primary?.soilReportFileName || rec.soilReportFileName || '';
          fetchedData =
            rec.cropLifecycleMap?.primary?.soilReportFileData || rec.soilReportFileData || '';
        } else {
          const extraCrop = (rec.additionalCrops || []).find((c: any) => c.id === cropKey);
          fetchedName =
            extraCrop?.soilReportFileName ||
            extraCrop?.lifecycleData?.soilReportFileName ||
            rec.cropLifecycleMap?.[cropKey]?.soilReportFileName ||
            '';
          fetchedData =
            extraCrop?.soilReportFileData ||
            extraCrop?.lifecycleData?.soilReportFileData ||
            rec.cropLifecycleMap?.[cropKey]?.soilReportFileData ||
            '';
        }
        if (fetchedData && fetchedData.startsWith('data:')) {
          const finalName =
            fetchedName.trim() || `${cropName || formData.crop || 'Crop'}_Soil_Report.pdf`;
          setCropLifecycleMap((prev) => ({
            ...prev,
            [cropKey]: {
              ...(prev[cropKey] || EMPTY_LIFECYCLE_DATA),
              soilReportFileName: finalName,
              soilReportFileData: fetchedData,
            },
          }));
          if (selectedLifecycleCropId === cropKey) {
            setFormData((prev) => ({
              ...prev,
              soilReportFileName: finalName,
              soilReportFileData: fetchedData,
            }));
          }
          triggerUploadedFileDownload(finalName, fetchedData);
          return;
        }
      }
    } catch {
      // ignore network error and show message below
    }

    alert('No Soil Report (JPG / PDF) has been uploaded from the backend for this crop yet.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter Farmer Name.');
      return;
    }

    const phoneValidation = validatePhoneNumber(formData.mobileNumber);
    if (!phoneValidation.valid) {
      alert(phoneValidation.error || 'Please enter a valid 10-digit Mobile Number.');
      return;
    }

    const emailValidation = validateEmailOptional(formData.emailId);
    if (!emailValidation.valid) {
      alert(emailValidation.error || 'Please enter a valid Email ID or leave it empty.');
      return;
    }

    const pinValidation = validatePinCode(formData.pinCode);
    if (!pinValidation.valid) {
      alert(pinValidation.error || 'Please enter a valid 6-digit Pin Code.');
      return;
    }

    setIsSubmitting(true);

    try {
      const currentActiveLifecycle = extractLifecycleFromState(formData);
      const updatedMap: Record<string, CropLifecycleData> = {
        ...cropLifecycleMap,
        [selectedLifecycleCropId]: currentActiveLifecycle,
      };
      const primaryLifecycle =
        selectedLifecycleCropId === 'primary'
          ? {
              ...currentActiveLifecycle,
              soilReportFileName:
                currentActiveLifecycle.soilReportFileName ||
                cropLifecycleMap.primary?.soilReportFileName ||
                '',
              soilReportFileData:
                currentActiveLifecycle.soilReportFileData ||
                cropLifecycleMap.primary?.soilReportFileData ||
                '',
            }
          : updatedMap['primary'] || currentActiveLifecycle;
      updatedMap.primary = primaryLifecycle;
      const syncedAdditionalCrops = (formData.additionalCrops || []).map((item) => {
        const lc =
          item.id === selectedLifecycleCropId
            ? currentActiveLifecycle
            : updatedMap[item.id] || item.lifecycleData || { ...EMPTY_LIFECYCLE_DATA };
        const soilName =
          lc.soilReportFileName ||
          item.soilReportFileName ||
          item.lifecycleData?.soilReportFileName ||
          '';
        const soilData =
          lc.soilReportFileData ||
          item.soilReportFileData ||
          item.lifecycleData?.soilReportFileData ||
          '';
        const mergedLc = {
          ...lc,
          soilReportFileName: soilName,
          soilReportFileData: soilData,
        };
        updatedMap[item.id] = mergedLc;
        return {
          ...item,
          soilReportFileName: soilName,
          soilReportFileData: soilData,
          lifecycleData: mergedLc,
        };
      });

      const response = await fetch('/api/package-of-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ...primaryLifecycle,
          additionalCrops: syncedAdditionalCrops,
          cropLifecycleMap: updatedMap,
          cropExtraLifecycleStagesMap,
          mobileNumber: phoneValidation.cleaned,
          emailId: emailValidation.cleaned || '',
          pinCode: pinValidation.cleaned,
          userId: user?.id || '',
          schedule,
          submittedAt: new Date().toISOString(),
        }),
      });

      const result = await response
        .json()
        .catch(() => ({ success: false, error: 'Failed to parse server response.' }));

      if (!response.ok || !result.success) {
        alert(result.error || 'Validation failed. Please check your mobile number, email, and PIN code.');
        return;
      }

      if (result.record?.id) {
        setFormData((prev) => ({
          ...prev,
          id: result.record.id,
          slNo: result.trackingCode || prev.slNo,
        }));
      }

      setSubmissionId(result.trackingCode || formData.slNo || 'SUBMITTED');
      setSubmissionSuccess(true);
    } catch (err: any) {
      alert(err?.message || 'Network error while submitting form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all form entries?')) {
      setFormData({ ...EMPTY_FORM_DATA });
      setSelectedLifecycleCropId('primary');
      setCropLifecycleMap({});
      setCropExtraLifecycleStagesMap({});
      setSchedule(POP_PRESETS.Maize.schedule);
      setSubmissionSuccess(false);
      setSubmissionId('');
    }
  };

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agrimart_pop_draft_v2');
    }
    logout();
    setFormData({ ...EMPTY_FORM_DATA });
    setSelectedLifecycleCropId('primary');
    setCropLifecycleMap({});
    setCropExtraLifecycleStagesMap({});
    setSchedule(POP_PRESETS.Maize.schedule);
    setSubmissionSuccess(false);
    setSubmissionId('');
    setActiveTab('form');
    setAuthError('');
    setAuthSuccessMessage('Signed out successfully. Page reset to a fresh form.');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCredentialAuth = async (submitType: 'login' | 'signin') => {
    setAuthError('');
    setAuthSuccessMessage('');

    const rawIdentifier = authIdentifier.trim();
    const rawPassword = authPassword.trim();

    if (!rawIdentifier) {
      setAuthError('Please enter your Phone Number or Username.');
      return;
    }

    if (!rawPassword) {
      setAuthError('Please enter your Password.');
      return;
    }

    const digitsOnly = rawIdentifier.replace(/\D/g, '');
    const isPhoneIdentifier = digitsOnly.length === 10 && /^\d+$/.test(rawIdentifier.replace(/[\s+-]/g, ''));

    if (
      !isPhoneIdentifier &&
      rawIdentifier.replace(/[\s+-]/g, '') !== '' &&
      /^\d+$/.test(rawIdentifier.replace(/[\s+-]/g, '')) &&
      digitsOnly.length !== 10
    ) {
      setAuthError('Please enter a valid 10-digit Phone Number or a valid Username.');
      return;
    }

    try {
      const res = await fetch('/api/package-of-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'AUTH_FARMER_ACCOUNT',
          identifier: rawIdentifier,
          password: rawPassword,
          submitType,
          fullName: authFullName.trim(),
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setAuthError(json.error || 'Authentication failed. Please check your credentials.');
        return;
      }

      const acc = json.account;
      if (typeof window !== 'undefined' && Array.isArray(json.farmerAccounts)) {
        localStorage.setItem('agrimart_user_accounts_v1', JSON.stringify(json.farmerAccounts));
      }

      // Start with a fresh form state before logging in; if the user has prior saved records in DB, useEffect will load them
      setFormData({ ...EMPTY_FORM_DATA });
      setSelectedLifecycleCropId('primary');
      setCropLifecycleMap({});
      setCropExtraLifecycleStagesMap({});
      setSubmissionSuccess(false);
      setSubmissionId('');

      login({
        id: acc.id,
        name: acc.name,
        mobile: acc.mobile,
        phone: acc.mobile,
        email: acc.email || '',
        role: 'CUSTOMER',
        isVerified: true,
      });

      setAuthPassword('');
      setAuthError('');
      setAuthSuccessMessage(
        submitType === 'signin'
          ? `Signed in successfully as ${acc.name}.`
          : `Logged in successfully as ${acc.name}.`
      );
    } catch (err: any) {
      setAuthError(err?.message || 'Unable to connect to authentication server.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Draft Notification Banner */}
      {savedDraftToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-agri-dark text-white px-5 py-3.5 rounded-2xl shadow-hover flex items-center gap-3 border border-emerald-500/40 animate-fadeSlideUp">
          <CheckCircle2 className="w-5 h-5 text-agri-yellow" />
          <span className="text-sm font-semibold">Form draft saved locally!</span>
        </div>
      )}

      {/* Top Account Status Bar */}
      {isLoggedIn ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2.5 text-agri-green-dark">
            <div className="w-2.5 h-2.5 rounded-full bg-agri-green animate-pulse" />
            <span>
              Logged in as: <strong>{user?.name}</strong>
              {user?.mobile ? ` (${user.mobile})` : ''}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-slate-600 hover:text-rose-600 font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch Account / Sign Out</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2.5 text-slate-700 font-semibold">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>
              {authSuccessMessage || 'Signed Out — Fresh Package of Practice page ready. Log In or Sign In below.'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthError('');
                document.getElementById('pop-auth-panel')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer border ${
                authMode === 'login'
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setAuthError('');
                document.getElementById('pop-auth-panel')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer border ${
                authMode === 'signin'
                  ? 'bg-agri-yellow text-agri-dark border-amber-400 shadow-xs'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-amber-50'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* Top Hero Banner — Package of Practice (POP) */}
      <div className="bg-gradient-to-r from-agri-dark via-emerald-950 to-agri-dark text-white rounded-3xl p-8 sm:p-12 shadow-card relative overflow-hidden print:hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-agri-yellow text-agri-dark text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              <ClipboardList className="w-3.5 h-3.5" />
              Agronomic Science & Crop Management
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Package of Practice (POP)
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              A comprehensive, university-tested agronomic roadmap providing farmers with verified step-by-step guidance across all phenological stages — from land preparation and seed treatment to precision harvesting.
            </p>

            {!isLoggedIn && (
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                    document.getElementById('pop-auth-panel')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-agri-yellow hover:bg-amber-400 text-agri-dark px-5 py-3 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-agri-dark" />
                  <span>Log In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthError('');
                    document.getElementById('pop-auth-panel')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 px-5 py-3 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
            <Button
              variant="golden"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print Official Form
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSaveDraft}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Draft
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Reset Form
            </Button>
          </div>
        </div>
      </div>

      {/* ACCOUNT LOGIN / SIGN IN PANEL (Phone Number or Username with Password) */}
      {!isLoggedIn && (
        <div
          id="pop-auth-panel"
          className="bg-white border-2 border-emerald-500/40 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 print:hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black shrink-0">
                <Lock className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-black text-agri-dark uppercase tracking-wide">
                  {authMode === 'login'
                    ? 'Farmer Account Log In'
                    : 'Farmer Account Sign In'}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Enter your Phone Number or Username with Password to access or save your Package of Practice records
                </div>
              </div>
            </div>

            {/* Separate Log In and Sign In Mode Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border-2 ${
                  authMode === 'login'
                    ? 'bg-emerald-700 text-white border-emerald-900 shadow-xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError('');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border-2 ${
                  authMode === 'signin'
                    ? 'bg-agri-yellow text-agri-dark border-amber-500 shadow-xs'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-200'
                }`}
              >
                Sign In
              </button>
            </div>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-xs font-bold">
              {authError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className={authMode === 'signin' ? 'md:col-span-3' : 'md:col-span-4'}>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number or Username <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={authIdentifier}
                onChange={(e) => setAuthIdentifier(e.target.value)}
                placeholder="Enter 10-digit Phone or Username"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>

            {authMode === 'signin' && (
              <div className="md:col-span-3">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  value={authFullName}
                  onChange={(e) => setAuthFullName(e.target.value)}
                  placeholder="Enter Farmer Full Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                />
              </div>
            )}

            <div className={authMode === 'signin' ? 'md:col-span-3' : 'md:col-span-4'}>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCredentialAuth(authMode);
                  }
                }}
                placeholder="Enter Password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
              />
            </div>

            {/* Separate Log In and Sign In Submit Buttons */}
            <div className={authMode === 'signin' ? 'md:col-span-3 flex items-center gap-2' : 'md:col-span-4 flex items-center gap-2'}>
              <button
                type="button"
                onClick={() => handleCredentialAuth('login')}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                type="button"
                onClick={() => handleCredentialAuth('signin')}
                className="flex-1 bg-agri-yellow hover:bg-amber-400 text-agri-dark font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 border border-amber-400"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2 COLORFUL TABS DIRECTLY BELOW THE PACKAGE OF PRACTICE (POP) HERO BANNER  */}
      {/* Tab 1: Farmer Data Form | Tab 2: Farmer Lifecycle                         */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-2 border-emerald-500/40 rounded-3xl p-2.5 shadow-lg print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex items-center justify-between gap-3 px-6 py-4 rounded-2xl text-left transition-all cursor-pointer border-2 ${
              activeTab === 'form'
                ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white border-amber-300 shadow-lg scale-[1.01]'
                : 'bg-white/10 text-emerald-100 border-white/15 hover:bg-white/20 hover:border-white/30'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-black shadow-sm ${
                  activeTab === 'form'
                    ? 'bg-amber-400 text-emerald-950'
                    : 'bg-emerald-800/80 text-emerald-200'
                }`}
              >
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-black uppercase tracking-wider">
                  1. Farmer Data Form
                </div>
                <div
                  className={`text-[11px] font-semibold ${
                    activeTab === 'form' ? 'text-emerald-50' : 'text-emerald-200/80'
                  }`}
                >
                  Farm Profile, Crop Selection & POP Schedule Table
                </div>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                activeTab === 'form'
                  ? 'bg-amber-300 text-emerald-950'
                  : 'bg-white/10 text-emerald-200'
              }`}
            >
              {activeTab === 'form' ? 'Active Tab' : 'Open Form'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lifecycle')}
            className={`flex items-center justify-between gap-3 px-6 py-4 rounded-2xl text-left transition-all cursor-pointer border-2 ${
              activeTab === 'lifecycle'
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 border-white shadow-lg scale-[1.01]'
                : 'bg-white/10 text-amber-100 border-white/15 hover:bg-white/20 hover:border-white/30'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-black shadow-sm ${
                  activeTab === 'lifecycle'
                    ? 'bg-emerald-950 text-amber-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-black uppercase tracking-wider">
                  2. Farmer Lifecycle
                </div>
                <div
                  className={`text-[11px] font-semibold ${
                    activeTab === 'lifecycle' ? 'text-slate-900' : 'text-amber-100/80'
                  }`}
                >
                  Visits, Pest Tracking, Weather, Soil, Yield & Follow-ups
                </div>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                activeTab === 'lifecycle'
                  ? 'bg-emerald-950 text-amber-300'
                  : 'bg-white/10 text-amber-200'
              }`}
            >
              {activeTab === 'lifecycle' ? 'Active Tab' : '6 Modules'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8 print:hidden">
        {activeTab === 'form' && (
          <>
        {/* FARMER DATA FORMS CONTAINER — Colorful Section Headers & Tinted Labels with Crisp Black Input Text */}
        <div className="bg-white text-black rounded-3xl border-2 border-emerald-600/40 shadow-card overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-6 py-6 text-center border-b-2 border-emerald-700">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <ClipboardList className="w-3.5 h-3.5" />
              Official Agronomy & Farmer Intake
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-white">
              FARMER DATA FORMS
            </h2>
            <p className="text-xs text-emerald-100 font-medium mt-1">
              Complete Farm Profile, Crop Selection & Crop Requirements Intake
            </p>
          </div>

          <div className="p-5 sm:p-8 space-y-8">
          {/* ===================================================== */}
          {/* 1. FARM PROFILE (Emerald Theme)                       */}
          {/* ===================================================== */}
          <div className="rounded-2xl border-2 border-emerald-600 shadow-sm">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white px-5 py-3 rounded-t-[14px] flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-400 text-emerald-950 font-black text-sm flex items-center justify-center shadow-xs">
                  1
                </span>
                <span>Farm Profile</span>
              </h3>
              <span className="text-[11px] font-bold bg-white/15 px-3 py-1 rounded-full text-emerald-50">
                Farmer & Land Registry
              </span>
            </div>

            <div className="bg-white text-black">
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-emerald-200">
                {/* Farmer Name */}
                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Farmer Name <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-emerald-200">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter Farmer Name"
                    required
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
                  />
                </div>

                {/* Farmer ID */}
                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Farmer ID
                </label>
                <div className="md:col-span-4 bg-white p-2">
                  <input
                    type="text"
                    name="farmerId"
                    value={formData.farmerId}
                    onChange={handleInputChange}
                    placeholder="Enter Farmer ID"
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-mono font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Row 2: Mobile Number | Email ID */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-emerald-200">
                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Mobile Number <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-emerald-200">
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit Mobile Number"
                    maxLength={10}
                    required
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
                  />
                </div>

                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Email ID
                </label>
                <div className="md:col-span-4 bg-white p-2">
                  <input
                    type="email"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleInputChange}
                    placeholder="Enter Email ID"
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Row 3: Date */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-emerald-200">
                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Date
                </label>
                <div className="md:col-span-10 bg-white p-2">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Row 4: Address (Full Width) */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-emerald-200">
                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-4 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Address
                </label>
                <div className="md:col-span-10 bg-white p-2">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter Complete Address"
                    className="w-full bg-white px-2.5 py-2 text-sm font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Row 5: Pin Code | Village */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-emerald-200">
                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Pin Code
                </label>
                <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-emerald-200">
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit Pin Code"
                    maxLength={6}
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
                  />
                </div>

                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Village
                </label>
                <div className="md:col-span-4 bg-white p-2">
                  <input
                    type="text"
                    name="villagePanchayat"
                    value={formData.villagePanchayat}
                    onChange={handleInputChange}
                    placeholder="Enter Village"
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Row 6: Taluk | District */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-emerald-200">
                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Taluk
                </label>
                <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-emerald-200">
                  <input
                    type="text"
                    name="taluk"
                    value={formData.taluk}
                    onChange={handleInputChange}
                    placeholder="Enter Taluk"
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
                  />
                </div>

                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  District
                </label>
                <div className="md:col-span-4 bg-white p-2 relative">
                  {/* Custom Dropdown Trigger Button for District */}
                  <button
                    type="button"
                    onClick={() => setDistrictDropdownOpen((prev) => !prev)}
                    className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className={formData.district ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                      {formData.district ||
                        (formData.state
                          ? `-- Select ${formData.state} District --`
                          : '-- Select State First or Enter District --')}
                    </span>
                    <span className="text-emerald-700 text-xs font-black">
                      {districtDropdownOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Dropdown Menu with "Other District" + Text Box on 1st Row & ONLY Selected State's Districts */}
                  {districtDropdownOpen && (
                    <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-emerald-600 rounded-xl shadow-2xl overflow-hidden">
                      <div className="max-h-60 overflow-y-auto divide-y divide-emerald-100">
                        {/* 1st Row at the Top of the Column: "Other District" + Text Box next to it */}
                        <div className="w-full px-3.5 py-2 bg-white hover:bg-emerald-50/50 flex items-center gap-2.5">
                          <span className="text-xs font-bold text-black shrink-0">
                            Other District
                          </span>
                          <input
                            type="text"
                            value={newDistrictInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewDistrictInput(val);
                              setFormData((prev) => ({ ...prev, district: val }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                setDistrictDropdownOpen(false);
                              }
                            }}
                            placeholder="Enter the district name"
                            className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        {/* District Options List — Strictly Only the Selected State's Districts */}
                        {availableStateDistricts.length > 0 ? (
                          availableStateDistricts.map((dist) => {
                            const isSelected = formData.district === dist;
                            return (
                              <button
                                key={dist}
                                type="button"
                                onClick={() => {
                                  setNewDistrictInput('');
                                  setFormData((prev) => ({ ...prev, district: dist }));
                                  setDistrictDropdownOpen(false);
                                }}
                                className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white font-bold'
                                    : 'bg-white hover:bg-emerald-50 text-black'
                                }`}
                              >
                                <span>{dist}</span>
                              </button>
                            );
                          })
                        ) : (
                          <div className="px-3.5 py-2.5 text-xs text-neutral-500 italic bg-emerald-50/30">
                            {formData.state
                              ? `Custom state "${formData.state}" selected — enter district in Other District above.`
                              : 'Please select a State first to display that state’s districts.'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 7: State | Language */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-emerald-200">
                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  State
                </label>
                <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-emerald-200 relative">
                  {/* Custom Dropdown Trigger Button for State */}
                  <button
                    type="button"
                    onClick={() => setStateDropdownOpen((prev) => !prev)}
                    className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className={formData.state ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                      {formData.state || '-- Select or Enter State --'}
                    </span>
                    <span className="text-emerald-700 text-xs font-black">
                      {stateDropdownOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Dropdown Menu with "Other State" + Text Box on 1st Row & All Indian States */}
                  {stateDropdownOpen && (
                    <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-emerald-600 rounded-xl shadow-2xl overflow-hidden">
                      <div className="max-h-60 overflow-y-auto divide-y divide-emerald-100">
                        {/* 1st Row at the Top of the Column: "Other State" + Text Box next to it */}
                        <div className="w-full px-3.5 py-2 bg-white hover:bg-emerald-50/50 flex items-center gap-2.5">
                          <span className="text-xs font-bold text-black shrink-0">
                            Other State
                          </span>
                          <input
                            type="text"
                            value={newStateInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewStateInput(val);
                              setFormData((prev) => ({
                                ...prev,
                                state: val,
                                district:
                                  STATE_DISTRICTS_MAP[val]?.includes(prev.district)
                                    ? prev.district
                                    : '',
                              }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                setStateDropdownOpen(false);
                              }
                            }}
                            placeholder="Enter the state name"
                            className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        {/* All Indian States Options List */}
                        {INDIAN_STATES.map((st) => {
                          const isSelected = formData.state === st;
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                setNewStateInput('');
                                setFormData((prev) => {
                                  const nextDistricts = STATE_DISTRICTS_MAP[st] || [];
                                  return {
                                    ...prev,
                                    state: st,
                                    district: nextDistricts.includes(prev.district)
                                      ? prev.district
                                      : '',
                                  };
                                });
                                setStateDropdownOpen(false);
                              }}
                              className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-600 text-white font-bold'
                                  : 'bg-white hover:bg-emerald-50 text-black'
                              }`}
                            >
                              <span>{st}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Language
                </label>
                <div className="md:col-span-4 bg-white p-2">
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    placeholder="Enter Language"
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Row 8: Location (Full Width) */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-emerald-200">
                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-4 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Location
                </label>
                <div className="md:col-span-10 bg-white p-2">
                  <input
                    type="text"
                    name="jobWorkLocation"
                    value={formData.jobWorkLocation}
                    onChange={handleInputChange}
                    placeholder="Enter Farm Location / Landmark"
                    className="w-full bg-white px-2.5 py-2 text-sm font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Row 9: Farm Acreage | Soil Type */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-emerald-200">
                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Farm Acreage
                </label>
                <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-emerald-200">
                  <input
                    type="text"
                    name="acres"
                    value={formData.acres}
                    onChange={handleInputChange}
                    placeholder="Enter Farm Acreage"
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
                  />
                </div>

                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Soil Type
                </label>
                <div className="md:col-span-4 bg-white p-2 relative">
                  {/* Custom Dropdown Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setSoilDropdownOpen((prev) => !prev)}
                    className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className={formData.soilType ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                      {formData.soilType || '-- Select or Enter Soil Type --'}
                    </span>
                    <span className="text-emerald-700 text-xs font-black">
                      {soilDropdownOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Dropdown Menu with "Other Soil" + Text Box on the 1st Row at the Top of the Column */}
                  {soilDropdownOpen && (
                    <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-emerald-600 rounded-xl shadow-2xl overflow-hidden">
                      <div className="max-h-60 overflow-y-auto divide-y divide-emerald-100">
                        {/* 1st Row at the Top of the Column: "Other Soil" + Text Box next to it (No Save button, does not add to scroll list) */}
                        <div className="w-full px-3.5 py-2 bg-white hover:bg-emerald-50/50 flex items-center gap-2.5">
                          <span className="text-xs font-bold text-black shrink-0">
                            Other Soil
                          </span>
                          <input
                            type="text"
                            value={newSoilInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewSoilInput(val);
                              setFormData((prev) => ({ ...prev, soilType: val }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                setSoilDropdownOpen(false);
                              }
                            }}
                            placeholder="Enter the soil name"
                            className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        {/* Soil Type Options List (Only standard soil options in scroll) */}
                        {BASE_SOIL_TYPES.map((soilOption) => {
                          const isSelected = formData.soilType === soilOption;
                          return (
                            <button
                              key={soilOption}
                              type="button"
                              onClick={() => {
                                setNewSoilInput('');
                                setFormData((prev) => ({ ...prev, soilType: soilOption }));
                                setSoilDropdownOpen(false);
                              }}
                              className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-600 text-white font-bold'
                                  : 'bg-white hover:bg-emerald-50 text-black'
                              }`}
                            >
                              <span>{soilOption}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 10: Irrigation Type | Water Source */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Irrigation Type
                </label>
                <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-emerald-200 relative">
                  {/* Custom Dropdown Trigger Button for Irrigation Type */}
                  <button
                    type="button"
                    onClick={() => setIrrigationDropdownOpen((prev) => !prev)}
                    className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className={formData.irrigationType ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                      {formData.irrigationType || '-- Select or Enter Irrigation Type --'}
                    </span>
                    <span className="text-emerald-700 text-xs font-black">
                      {irrigationDropdownOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Dropdown Menu with "Other Irrigation" + Text Box on the 1st Row at the Top of the Column */}
                  {irrigationDropdownOpen && (
                    <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-emerald-600 rounded-xl shadow-2xl overflow-hidden">
                      <div className="max-h-60 overflow-y-auto divide-y divide-emerald-100">
                        {/* 1st Row at the Top of the Column: "Other Irrigation" + Text Box next to it */}
                        <div className="w-full px-3.5 py-2 bg-white hover:bg-emerald-50/50 flex items-center gap-2.5">
                          <span className="text-xs font-bold text-black shrink-0">
                            Other Irrigation
                          </span>
                          <input
                            type="text"
                            value={newIrrigationInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewIrrigationInput(val);
                              setFormData((prev) => ({ ...prev, irrigationType: val }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                setIrrigationDropdownOpen(false);
                              }
                            }}
                            placeholder="Enter the irrigation name"
                            className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        {/* Irrigation Type Options List */}
                        {BASE_IRRIGATION_TYPES.map((irrOption) => {
                          const isSelected = formData.irrigationType === irrOption;
                          return (
                            <button
                              key={irrOption}
                              type="button"
                              onClick={() => {
                                setNewIrrigationInput('');
                                setFormData((prev) => ({ ...prev, irrigationType: irrOption }));
                                setIrrigationDropdownOpen(false);
                              }}
                              className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-600 text-white font-bold'
                                  : 'bg-white hover:bg-emerald-50 text-black'
                              }`}
                            >
                              <span>{irrOption}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <label className="md:col-span-2 bg-emerald-50/90 px-4 py-3 text-xs font-bold text-emerald-950 flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                  Water Source
                </label>
                <div className="md:col-span-4 bg-white p-2">
                  <input
                    type="text"
                    name="waterSource"
                    value={formData.waterSource}
                    onChange={handleInputChange}
                    placeholder="Enter Water Source"
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================== */}
          {/* 2. CROP SELECTION (Amber / Golden Theme)              */}
          {/* ===================================================== */}
          <div className="rounded-2xl border-2 border-amber-500 shadow-sm">
            <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white px-5 py-3 rounded-t-[14px] flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-white text-amber-900 font-black text-sm flex items-center justify-center shadow-xs">
                  2
                </span>
                <span>Crop Selection</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAddCropModal}
                  className="bg-white hover:bg-amber-50 text-amber-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm border border-amber-200 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+ Add New Crop</span>
                </button>
                {(formData.crop || formData.cropType || (formData.additionalCrops && formData.additionalCrops.length > 0)) && (
                  <button
                    type="button"
                    onClick={() => handleOpenDeleteCropModal('primary', formData.crop || 'Crop #1')}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-sm transition cursor-pointer flex items-center gap-1"
                    title="Delete this crop"
                  >
                    <span>Delete Crop</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white text-black">
              {/* Row 1: Crop type | Crop */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-amber-200">
                <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                  Crop type
                </label>
                <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-amber-200 relative">
                  {/* Custom Dropdown Trigger Button for Crop Type */}
                  <button
                    type="button"
                    onClick={() => setCropTypeDropdownOpen((prev) => !prev)}
                    className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className={formData.cropType ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                      {formData.cropType || '-- Select or Enter Crop Type --'}
                    </span>
                    <span className="text-amber-700 text-xs font-black">
                      {cropTypeDropdownOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Dropdown Menu with "Other Crop Type" + Text Box on the 1st Row at the Top of the Column */}
                  {cropTypeDropdownOpen && (
                    <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-amber-500 rounded-xl shadow-2xl overflow-hidden">
                      <div className="max-h-60 overflow-y-auto divide-y divide-amber-100">
                        {/* 1st Row at the Top of the Column: "Other Crop Type" + Text Box next to it */}
                        <div className="w-full px-3.5 py-2 bg-white hover:bg-amber-50/50 flex items-center gap-2.5">
                          <span className="text-xs font-bold text-black shrink-0">
                            Other Crop Type
                          </span>
                          <input
                            type="text"
                            value={newCropTypeInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewCropTypeInput(val);
                              setFormData((prev) => ({ ...prev, cropType: val }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                setCropTypeDropdownOpen(false);
                              }
                            }}
                            placeholder="Enter the crop type"
                            className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        {/* Crop Type Options List */}
                        {BASE_CROP_TYPES.map((cropTypeOption) => {
                          const isSelected = formData.cropType === cropTypeOption;
                          return (
                            <button
                              key={cropTypeOption}
                              type="button"
                              onClick={() => {
                                setNewCropTypeInput('');
                                setFormData((prev) => ({ ...prev, cropType: cropTypeOption }));
                                setCropTypeDropdownOpen(false);
                              }}
                              className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-500 text-slate-950 font-bold'
                                  : 'bg-white hover:bg-amber-50 text-black'
                              }`}
                            >
                              <span>{cropTypeOption}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                  Crop
                </label>
                <div className="md:col-span-4 bg-white p-2 relative">
                  {/* Custom Dropdown Trigger Button for Crop */}
                  <button
                    type="button"
                    onClick={() => setCropDropdownOpen((prev) => !prev)}
                    className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className={formData.crop ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                      {formData.crop || '-- Select or Enter Crop --'}
                    </span>
                    <span className="text-amber-700 text-xs font-black">
                      {cropDropdownOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Dropdown Menu with "Other Crop" + Text Box on the 1st Row at the Top of the Column */}
                  {cropDropdownOpen && (
                    <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-amber-500 rounded-xl shadow-2xl overflow-hidden">
                      <div className="max-h-60 overflow-y-auto divide-y divide-amber-100">
                        {/* 1st Row at the Top of the Column: "Other Crop" + Text Box next to it */}
                        <div className="w-full px-3.5 py-2 bg-white hover:bg-amber-50/50 flex items-center gap-2.5">
                          <span className="text-xs font-bold text-black shrink-0">
                            Other Crop
                          </span>
                          <input
                            type="text"
                            value={newCropInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewCropInput(val);
                              setFormData((prev) => ({ ...prev, crop: val }));
                              if (val && POP_PRESETS[val]) {
                                setSchedule(POP_PRESETS[val].schedule);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                setCropDropdownOpen(false);
                              }
                            }}
                            placeholder="Enter the crop name"
                            className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        {/* Crop Options List */}
                        {BASE_CROPS.map((cropOption) => {
                          const isSelected = formData.crop === cropOption;
                          return (
                            <button
                              key={cropOption}
                              type="button"
                              onClick={() => {
                                setNewCropInput('');
                                setFormData((prev) => ({ ...prev, crop: cropOption }));
                                if (POP_PRESETS[cropOption]) {
                                  setSchedule(POP_PRESETS[cropOption].schedule);
                                }
                                setCropDropdownOpen(false);
                              }}
                              className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-500 text-slate-950 font-bold'
                                  : 'bg-white hover:bg-amber-50 text-black'
                              }`}
                            >
                              <span>{cropOption}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Variety | Planting Date */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-amber-200">
                <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                  Variety
                </label>
                <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-amber-200 relative">
                  {/* Custom Dropdown Trigger Button for Variety */}
                  <button
                    type="button"
                    onClick={() => setVarietyDropdownOpen((prev) => !prev)}
                    className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className={formData.variety ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                      {formData.variety || '-- Select or Enter Variety --'}
                    </span>
                    <span className="text-amber-700 text-xs font-black">
                      {varietyDropdownOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Dropdown Menu with "Other Variety" on the 1st Row at the Top */}
                  {varietyDropdownOpen && (
                    <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-amber-500 rounded-xl shadow-2xl overflow-hidden">
                      <div className="max-h-64 overflow-y-auto divide-y divide-amber-100">
                        {/* 1st Row at the Top: "Other Variety" + Text Box */}
                        <div className="w-full px-3.5 py-2 bg-white hover:bg-amber-50/50 flex items-center gap-2.5">
                          <span className="text-xs font-bold text-black shrink-0">
                            Other Variety
                          </span>
                          <input
                            type="text"
                            value={newVarietyInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewVarietyInput(val);
                              setFormData((prev) => ({ ...prev, variety: val }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                setVarietyDropdownOpen(false);
                              }
                            }}
                            placeholder="Enter the variety"
                            className="flex-1 bg-white px-3 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-amber-400 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          {newVarietyInput.trim() && (
                            <button
                              type="button"
                              onClick={() => setVarietyDropdownOpen(false)}
                              className="text-[11px] font-bold px-2 py-0.5 bg-amber-600 text-white rounded hover:bg-amber-700 cursor-pointer"
                            >
                              Done
                            </button>
                          )}
                        </div>

                        {/* Variety Options Grouped by Category */}
                        {CROP_VARIETIES_BY_CATEGORY.map((group) => (
                          <div key={group.category} className="py-1">
                            <div className="px-3.5 py-1 bg-amber-100/70 text-[10px] font-black uppercase tracking-wider text-amber-950">
                              {group.category}
                            </div>
                            {group.varieties.map((varOption) => {
                              const isSelected = formData.variety === varOption;
                              return (
                                <button
                                  key={varOption}
                                  type="button"
                                  onClick={() => {
                                    setNewVarietyInput('');
                                    setFormData((prev) => ({ ...prev, variety: varOption }));
                                    setVarietyDropdownOpen(false);
                                  }}
                                  className={`w-full px-3.5 py-1.5 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                    isSelected
                                      ? 'bg-amber-500 text-slate-950 font-bold'
                                      : 'bg-white hover:bg-amber-50 text-black'
                                  }`}
                                >
                                  <span>{varOption}</span>
                                  {isSelected && <span className="text-xs font-black">✓</span>}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                  Planting Date
                </label>
                <div className="md:col-span-4 bg-white p-2">
                  <input
                    type="date"
                    name="plantingDate"
                    value={formData.plantingDate}
                    onChange={handleInputChange}
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Row 3: Crop Age | Crop Acreage */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-amber-200">
                <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                  Crop Age
                </label>
                <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-amber-200">
                  <input
                    type="text"
                    name="cropAge"
                    value={formData.cropAge}
                    onChange={handleInputChange}
                    placeholder="Enter Crop Age"
                    className="w-full bg-white px-2.5 py-1.5 text-sm text-black font-semibold placeholder:text-neutral-400 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                  />
                </div>

                <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                  Crop Acreage
                </label>
                <div className="md:col-span-4 bg-white p-2">
                  <input
                    type="text"
                    name="cropAcreage"
                    value={formData.cropAcreage}
                    onChange={handleInputChange}
                    placeholder="Enter Crop Acreage"
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Row 4: Plant Count | Spacing */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-b border-amber-200">
                <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                  Plant Count
                </label>
                <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-amber-200">
                  <input
                    type="text"
                    name="plantCount"
                    value={formData.plantCount}
                    onChange={handleInputChange}
                    placeholder="Enter Plant Count"
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                  />
                </div>

                <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                  Spacing
                </label>
                <div className="md:col-span-4 bg-white p-2">
                  <input
                    type="text"
                    name="spacing"
                    value={formData.spacing}
                    onChange={handleInputChange}
                    placeholder="Enter Spacing"
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Row 5: Current Crop Stage | Survey Number */}
              <div className="grid grid-cols-1 md:grid-cols-12 rounded-b-[14px]">
                <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200 rounded-bl-[14px]">
                  Current Crop Stage
                </label>
                <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-amber-200">
                  <input
                    type="text"
                    name="currentCropStage"
                    value={formData.currentCropStage || ''}
                    onChange={handleInputChange}
                    placeholder="Enter Current Crop Stage"
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                  />
                </div>

                <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                  Survey Number
                </label>
                <div className="md:col-span-4 bg-white p-2 rounded-br-[14px]">
                  <input
                    type="text"
                    name="surveyNumber"
                    value={formData.surveyNumber || ''}
                    onChange={handleInputChange}
                    placeholder="Enter Survey Number"
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* ADDITIONAL CROP SELECTION BLOCKS (Opened when clicking + Add New Crop) */}
          {/* ===================================================================== */}
          {(formData.additionalCrops || []).map((cropBlock, idx) => {
            const isExtraTypeOpen = extraCropTypeOpenId === cropBlock.id;
            const isExtraCropOpen = extraCropOpenId === cropBlock.id;
            const isExtraVarietyOpen = extraVarietyOpenId === cropBlock.id;
            const isExtraStageOpen = extraCurrentCropStageOpenId === cropBlock.id;
            const customTypeVal = extraCropTypeInputs[cropBlock.id] || '';
            const customCropVal = extraCropInputs[cropBlock.id] || '';
            const customVarietyVal = extraVarietyInputs[cropBlock.id] || '';
            const customStageVal = extraCurrentCropStageInputs[cropBlock.id] || '';

            return (
              <div key={cropBlock.id} className="rounded-2xl border-2 border-amber-500 shadow-sm">
                <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white px-5 py-3 rounded-t-[14px] flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-white text-amber-900 font-black text-sm flex items-center justify-center shadow-xs">
                      2.{idx + 2}
                    </span>
                    <span>Crop Selection (Crop #{idx + 2})</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenAddCropModal}
                      className="bg-white hover:bg-amber-50 text-amber-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-sm border border-amber-200 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>+ Add New Crop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDeleteCropModal(cropBlock.id, cropBlock.crop || `Crop #${idx + 2}`)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-sm transition cursor-pointer"
                    >
                      <span>Delete Crop</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white text-black">
                  {/* Row 1: Crop type | Crop */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-amber-200">
                    <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                      Crop type
                    </label>
                    <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-amber-200 relative">
                      <button
                        type="button"
                        onClick={() =>
                          setExtraCropTypeOpenId((prev) => (prev === cropBlock.id ? null : cropBlock.id))
                        }
                        className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <span className={cropBlock.cropType ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                          {cropBlock.cropType || '-- Select or Enter Crop Type --'}
                        </span>
                        <span className="text-amber-700 text-xs font-black">
                          {isExtraTypeOpen ? '▲' : '▼'}
                        </span>
                      </button>

                      {isExtraTypeOpen && (
                        <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-amber-500 rounded-xl shadow-2xl overflow-hidden">
                          <div className="max-h-60 overflow-y-auto divide-y divide-amber-100">
                            <div className="w-full px-3.5 py-2 bg-white hover:bg-amber-50/50 flex items-center gap-2.5">
                              <span className="text-xs font-bold text-black shrink-0">
                                Other Crop Type
                              </span>
                              <input
                                type="text"
                                value={customTypeVal}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setExtraCropTypeInputs((prev) => ({ ...prev, [cropBlock.id]: val }));
                                  handleUpdateAdditionalCrop(cropBlock.id, 'cropType', val);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    setExtraCropTypeOpenId(null);
                                  }
                                }}
                                placeholder="Enter the crop type"
                                className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>

                            {BASE_CROP_TYPES.map((cropTypeOption) => {
                              const isSelected = cropBlock.cropType === cropTypeOption;
                              return (
                                <button
                                  key={cropTypeOption}
                                  type="button"
                                  onClick={() => {
                                    setExtraCropTypeInputs((prev) => ({ ...prev, [cropBlock.id]: '' }));
                                    handleUpdateAdditionalCrop(cropBlock.id, 'cropType', cropTypeOption);
                                    setExtraCropTypeOpenId(null);
                                  }}
                                  className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                    isSelected
                                      ? 'bg-amber-500 text-slate-950 font-bold'
                                      : 'bg-white hover:bg-amber-50 text-black'
                                  }`}
                                >
                                  <span>{cropTypeOption}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                      Crop
                    </label>
                    <div className="md:col-span-4 bg-white p-2 relative">
                      <button
                        type="button"
                        onClick={() =>
                          setExtraCropOpenId((prev) => (prev === cropBlock.id ? null : cropBlock.id))
                        }
                        className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <span className={cropBlock.crop ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                          {cropBlock.crop || '-- Select or Enter Crop --'}
                        </span>
                        <span className="text-amber-700 text-xs font-black">
                          {isExtraCropOpen ? '▲' : '▼'}
                        </span>
                      </button>

                      {isExtraCropOpen && (
                        <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-amber-500 rounded-xl shadow-2xl overflow-hidden">
                          <div className="max-h-60 overflow-y-auto divide-y divide-amber-100">
                            <div className="w-full px-3.5 py-2 bg-white hover:bg-amber-50/50 flex items-center gap-2.5">
                              <span className="text-xs font-bold text-black shrink-0">
                                Other Crop
                              </span>
                              <input
                                type="text"
                                value={customCropVal}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setExtraCropInputs((prev) => ({ ...prev, [cropBlock.id]: val }));
                                  handleUpdateAdditionalCrop(cropBlock.id, 'crop', val);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    setExtraCropOpenId(null);
                                  }
                                }}
                                placeholder="Enter the crop name"
                                className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>

                            {BASE_CROPS.map((cropOption) => {
                              const isSelected = cropBlock.crop === cropOption;
                              return (
                                <button
                                  key={cropOption}
                                  type="button"
                                  onClick={() => {
                                    setExtraCropInputs((prev) => ({ ...prev, [cropBlock.id]: '' }));
                                    handleUpdateAdditionalCrop(cropBlock.id, 'crop', cropOption);
                                    setExtraCropOpenId(null);
                                  }}
                                  className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                    isSelected
                                      ? 'bg-amber-500 text-slate-950 font-bold'
                                      : 'bg-white hover:bg-amber-50 text-black'
                                  }`}
                                >
                                  <span>{cropOption}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Variety | Planting Date */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-amber-200">
                    <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                      Variety
                    </label>
                    <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-amber-200 relative">
                      <button
                        type="button"
                        onClick={() =>
                          setExtraVarietyOpenId((prev) => (prev === cropBlock.id ? null : cropBlock.id))
                        }
                        className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <span className={cropBlock.variety ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                          {cropBlock.variety || '-- Select or Enter Variety --'}
                        </span>
                        <span className="text-amber-700 text-xs font-black">
                          {isExtraVarietyOpen ? '▲' : '▼'}
                        </span>
                      </button>

                      {isExtraVarietyOpen && (
                        <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-amber-500 rounded-xl shadow-2xl overflow-hidden">
                          <div className="max-h-64 overflow-y-auto divide-y divide-amber-100">
                            {/* 1st Row at the Top: "Other Variety" + Text Box */}
                            <div className="w-full px-3.5 py-2 bg-white hover:bg-amber-50/50 flex items-center gap-2.5">
                              <span className="text-xs font-bold text-black shrink-0">
                                Other Variety
                              </span>
                              <input
                                type="text"
                                value={customVarietyVal}
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
                                placeholder="Enter the variety"
                                className="flex-1 bg-white px-3 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-amber-400 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                              {customVarietyVal.trim() && (
                                <button
                                  type="button"
                                  onClick={() => setExtraVarietyOpenId(null)}
                                  className="text-[11px] font-bold px-2 py-0.5 bg-amber-600 text-white rounded hover:bg-amber-700 cursor-pointer"
                                >
                                  Done
                                </button>
                              )}
                            </div>

                            {/* Variety Options Grouped by Category */}
                            {CROP_VARIETIES_BY_CATEGORY.map((group) => (
                              <div key={group.category} className="py-1">
                                <div className="px-3.5 py-1 bg-amber-100/70 text-[10px] font-black uppercase tracking-wider text-amber-950">
                                  {group.category}
                                </div>
                                {group.varieties.map((varOption) => {
                                  const isSelected = cropBlock.variety === varOption;
                                  return (
                                    <button
                                      key={varOption}
                                      type="button"
                                      onClick={() => {
                                        setExtraVarietyInputs((prev) => ({ ...prev, [cropBlock.id]: '' }));
                                        handleUpdateAdditionalCrop(cropBlock.id, 'variety', varOption);
                                        setExtraVarietyOpenId(null);
                                      }}
                                      className={`w-full px-3.5 py-1.5 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                        isSelected
                                          ? 'bg-amber-500 text-slate-950 font-bold'
                                          : 'bg-white hover:bg-amber-50 text-black'
                                      }`}
                                    >
                                      <span>{varOption}</span>
                                      {isSelected && <span className="text-xs font-black">✓</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                      Planting Date
                    </label>
                    <div className="md:col-span-4 bg-white p-2">
                      <input
                        type="date"
                        value={cropBlock.plantingDate}
                        onChange={(e) =>
                          handleUpdateAdditionalCrop(cropBlock.id, 'plantingDate', e.target.value)
                        }
                        className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Row 3: Crop Age | Crop Acreage */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-amber-200">
                    <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                      Crop Age
                    </label>
                    <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-amber-200">
                      <input
                        type="text"
                        value={cropBlock.cropAge}
                        onChange={(e) =>
                          handleUpdateAdditionalCrop(cropBlock.id, 'cropAge', e.target.value)
                        }
                        placeholder="Enter Crop Age"
                        className="w-full bg-white px-2.5 py-1.5 text-sm text-black font-semibold placeholder:text-neutral-400 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                      />
                    </div>

                    <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                      Crop Acreage
                    </label>
                    <div className="md:col-span-4 bg-white p-2">
                      <input
                        type="text"
                        value={cropBlock.cropAcreage}
                        onChange={(e) =>
                          handleUpdateAdditionalCrop(cropBlock.id, 'cropAcreage', e.target.value)
                        }
                        placeholder="Enter Crop Acreage"
                        className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Row 4: Plant Count | Spacing */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-amber-200">
                    <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                      Plant Count
                    </label>
                    <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-amber-200">
                      <input
                        type="text"
                        value={cropBlock.plantCount}
                        onChange={(e) =>
                          handleUpdateAdditionalCrop(cropBlock.id, 'plantCount', e.target.value)
                        }
                        placeholder="Enter Plant Count"
                        className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                      />
                    </div>

                    <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                      Spacing
                    </label>
                    <div className="md:col-span-4 bg-white p-2">
                      <input
                        type="text"
                        value={cropBlock.spacing || ''}
                        onChange={(e) =>
                          handleUpdateAdditionalCrop(cropBlock.id, 'spacing', e.target.value)
                        }
                        placeholder="Enter Spacing"
                        className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Row 5: Current Crop Stage | Survey Number */}
                  <div className="grid grid-cols-1 md:grid-cols-12 rounded-b-[14px]">
                    <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200 rounded-bl-[14px]">
                      Current Crop Stage
                    </label>
                    <div className="md:col-span-4 bg-white p-2 border-b md:border-b-0 md:border-r border-amber-200">
                      <input
                        type="text"
                        value={cropBlock.currentCropStage || ''}
                        onChange={(e) =>
                          handleUpdateAdditionalCrop(
                            cropBlock.id,
                            'currentCropStage',
                            e.target.value
                          )
                        }
                        placeholder="Enter Current Crop Stage"
                        className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                      />
                    </div>

                    <label className="md:col-span-2 bg-amber-50/90 px-4 py-3 text-xs font-bold text-amber-950 flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                      Survey Number
                    </label>
                    <div className="md:col-span-4 bg-white p-2 rounded-br-[14px]">
                      <input
                        type="text"
                        value={cropBlock.surveyNumber || ''}
                        onChange={(e) =>
                          handleUpdateAdditionalCrop(
                            cropBlock.id,
                            'surveyNumber',
                            e.target.value
                          )
                        }
                        placeholder="Enter Survey Number"
                        className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* ===================================================== */}
          {/* 3. CROP REQUIREMENTS AND SERVICES (Sky / Indigo Theme)*/}
          {/* ===================================================== */}
          <div className="rounded-2xl border-2 border-sky-600 shadow-sm">
            <div className="bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 text-white px-5 py-3 rounded-t-[14px] flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-300 text-sky-950 font-black text-sm flex items-center justify-center shadow-xs">
                  3
                </span>
                <span>Crop Requirements and Services</span>
              </h3>
              <span className="text-[11px] font-bold bg-white/15 px-3 py-1 rounded-full text-sky-50">
                Diagnosis, Inputs & Mechanization
              </span>
            </div>

            <div className="divide-y divide-sky-200 bg-white text-black">
              {/* Crop Stage */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                <label className="md:col-span-3 bg-sky-50/90 px-4 py-3.5 text-xs font-bold text-sky-950 flex items-center border-b md:border-b-0 md:border-r border-sky-200">
                  Crop Stage
                </label>
                <div className="md:col-span-9 bg-white p-2 relative">
                  {/* Custom Dropdown Trigger Button for Crop Stage */}
                  <button
                    type="button"
                    onClick={() => setCropStageDropdownOpen((prev) => !prev)}
                    className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className={formData.cropStage ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                      {formData.cropStage || '-- Select or Enter Crop Stage --'}
                    </span>
                    <span className="text-sky-700 text-xs font-black">
                      {cropStageDropdownOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Dropdown Menu with "Other Stage" + Text Box on the 1st Row at the Top of the Column */}
                  {cropStageDropdownOpen && (
                    <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-sky-600 rounded-xl shadow-2xl overflow-hidden">
                      <div className="max-h-60 overflow-y-auto divide-y divide-sky-100">
                        {/* 1st Row at the Top of the Column: "Other Stage" + Text Box next to it */}
                        <div className="w-full px-3.5 py-2 bg-white hover:bg-sky-50/50 flex items-center gap-2.5">
                          <span className="text-xs font-bold text-black shrink-0">
                            Other Stage
                          </span>
                          <input
                            type="text"
                            value={newCropStageInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewCropStageInput(val);
                              setFormData((prev) => ({ ...prev, cropStage: val }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                setCropStageDropdownOpen(false);
                              }
                            }}
                            placeholder="Enter the crop stage"
                            className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        {/* Crop Stage Options List */}
                        {BASE_CROP_STAGES.map((stageOption) => {
                          const isSelected = formData.cropStage === stageOption;
                          return (
                            <button
                              key={stageOption}
                              type="button"
                              onClick={() => {
                                setNewCropStageInput('');
                                setFormData((prev) => ({ ...prev, cropStage: stageOption }));
                                setCropStageDropdownOpen(false);
                              }}
                              className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                isSelected
                                  ? 'bg-sky-600 text-white font-bold'
                                  : 'bg-white hover:bg-sky-50 text-black'
                              }`}
                            >
                              <span>{stageOption}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Requirement */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                <label className="md:col-span-3 bg-sky-50/90 px-4 py-3.5 text-xs font-bold text-sky-950 flex items-center border-b md:border-b-0 md:border-r border-sky-200">
                  Main Requirement
                </label>
                <div className="md:col-span-9 bg-white p-2 relative">
                  {/* Custom Dropdown Trigger Button for Main Requirement */}
                  <button
                    type="button"
                    onClick={() => setMainReqDropdownOpen((prev) => !prev)}
                    className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className={formData.mainRequirement ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                      {formData.mainRequirement || '-- Select or Enter Main Requirement --'}
                    </span>
                    <span className="text-sky-700 text-xs font-black">
                      {mainReqDropdownOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Dropdown Menu with "Other Requirement" + Text Box on the 1st Row at the Top of the Column */}
                  {mainReqDropdownOpen && (
                    <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-sky-600 rounded-xl shadow-2xl overflow-hidden">
                      <div className="max-h-60 overflow-y-auto divide-y divide-sky-100">
                        {/* 1st Row at the Top of the Column: "Other Requirement" + Text Box next to it */}
                        <div className="w-full px-3.5 py-2 bg-white hover:bg-sky-50/50 flex items-center gap-2.5">
                          <span className="text-xs font-bold text-black shrink-0">
                            Other Requirement
                          </span>
                          <input
                            type="text"
                            value={newMainReqInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewMainReqInput(val);
                              setFormData((prev) => ({ ...prev, mainRequirement: val }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                setMainReqDropdownOpen(false);
                              }
                            }}
                            placeholder="Enter the requirement name"
                            className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        {/* Main Requirement Options List */}
                        {BASE_MAIN_REQUIREMENTS.map((reqOption) => {
                          const isSelected = formData.mainRequirement === reqOption;
                          return (
                            <button
                              key={reqOption}
                              type="button"
                              onClick={() => {
                                setNewMainReqInput('');
                                setFormData((prev) => ({ ...prev, mainRequirement: reqOption }));
                                setMainReqDropdownOpen(false);
                              }}
                              className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                isSelected
                                  ? 'bg-sky-600 text-white font-bold'
                                  : 'bg-white hover:bg-sky-50 text-black'
                              }`}
                            >
                              <span>{reqOption}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Problem Type */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                <label className="md:col-span-3 bg-sky-50/90 px-4 py-3.5 text-xs font-bold text-sky-950 flex items-center border-b md:border-b-0 md:border-r border-sky-200">
                  Problem Type
                </label>
                <div className="md:col-span-9 bg-white p-2 relative">
                  {/* Custom Dropdown Trigger Button for Problem Type */}
                  <button
                    type="button"
                    onClick={() => setProblemDropdownOpen((prev) => !prev)}
                    className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className={formData.problemType ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                      {formData.problemType || '-- Select or Enter Problem Type --'}
                    </span>
                    <span className="text-sky-700 text-xs font-black">
                      {problemDropdownOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Dropdown Menu with "Other Problem" + Text Box on the 1st Row at the Top of the Column */}
                  {problemDropdownOpen && (
                    <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-sky-600 rounded-xl shadow-2xl overflow-hidden">
                      <div className="max-h-60 overflow-y-auto divide-y divide-sky-100">
                        {/* 1st Row at the Top of the Column: "Other Problem" + Text Box next to it */}
                        <div className="w-full px-3.5 py-2 bg-white hover:bg-sky-50/50 flex items-center gap-2.5">
                          <span className="text-xs font-bold text-black shrink-0">
                            Other Problem
                          </span>
                          <input
                            type="text"
                            value={newProblemInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewProblemInput(val);
                              setFormData((prev) => ({ ...prev, problemType: val }));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                setProblemDropdownOpen(false);
                              }
                            }}
                            placeholder="Enter the problem name"
                            className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        {/* Problem Type Options List */}
                        {BASE_PROBLEM_TYPES.map((probOption) => {
                          const isSelected = formData.problemType === probOption;
                          return (
                            <button
                              key={probOption}
                              type="button"
                              onClick={() => {
                                setNewProblemInput('');
                                setFormData((prev) => ({ ...prev, problemType: probOption }));
                                setProblemDropdownOpen(false);
                              }}
                              className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                isSelected
                                  ? 'bg-sky-600 text-white font-bold'
                                  : 'bg-white hover:bg-sky-50 text-black'
                              }`}
                            >
                              <span>{probOption}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Materials Required (Yes/No + Dropdown when Yes) */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                <label className="md:col-span-3 bg-sky-50/90 px-4 py-3.5 text-xs font-bold text-sky-950 flex items-center border-b md:border-b-0 md:border-r border-sky-200">
                  Materials Required
                </label>
                <div className="md:col-span-9 bg-white p-2 space-y-2 relative">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex rounded-lg border border-sky-300 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setMaterialsRequiredChoice('YES');
                          if (formData.farmMaterial === 'No') {
                            setFormData((prev) => ({ ...prev, farmMaterial: '' }));
                          }
                        }}
                        className={`px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                          materialsRequiredChoice === 'YES' ||
                          (formData.farmMaterial && formData.farmMaterial !== 'No')
                            ? 'bg-sky-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-sky-50'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMaterialsRequiredChoice('NO');
                          setMaterialsDropdownOpen(false);
                          setFormData((prev) => ({ ...prev, farmMaterial: 'No' }));
                        }}
                        className={`px-4 py-1.5 text-xs font-bold border-l border-sky-300 transition cursor-pointer ${
                          materialsRequiredChoice === 'NO' || formData.farmMaterial === 'No'
                            ? 'bg-slate-700 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        No
                      </button>
                    </div>

                    {(materialsRequiredChoice === 'YES' ||
                      (formData.farmMaterial && formData.farmMaterial !== 'No')) && (
                      <div className="flex-1 min-w-[220px] relative">
                        <button
                          type="button"
                          onClick={() => setMaterialsDropdownOpen((prev) => !prev)}
                          className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <span
                            className={
                              formData.farmMaterial && formData.farmMaterial !== 'No'
                                ? 'text-black font-semibold'
                                : 'text-neutral-400 font-normal'
                            }
                          >
                            {formData.farmMaterial && formData.farmMaterial !== 'No'
                              ? formData.farmMaterial
                              : '-- Select or Enter Material --'}
                          </span>
                          <span className="text-sky-700 text-xs font-black">
                            {materialsDropdownOpen ? '▲' : '▼'}
                          </span>
                        </button>

                        {materialsDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border-2 border-sky-600 rounded-xl shadow-2xl overflow-hidden">
                            <div className="max-h-60 overflow-y-auto divide-y divide-sky-100">
                              <div className="w-full px-3.5 py-2 bg-white hover:bg-sky-50/50 flex items-center gap-2.5">
                                <span className="text-xs font-bold text-black shrink-0">
                                  Other Material
                                </span>
                                <input
                                  type="text"
                                  value={newMaterialInput}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setNewMaterialInput(val);
                                    setFormData((prev) => ({ ...prev, farmMaterial: val }));
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      setMaterialsDropdownOpen(false);
                                    }
                                  }}
                                  placeholder="Enter the material name"
                                  className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                              </div>

                              {BASE_MATERIAL_OPTIONS.map((matOption) => {
                                const isSelected = formData.farmMaterial === matOption;
                                return (
                                  <button
                                    key={matOption}
                                    type="button"
                                    onClick={() => {
                                      setNewMaterialInput('');
                                      setFormData((prev) => ({ ...prev, farmMaterial: matOption }));
                                      setMaterialsDropdownOpen(false);
                                    }}
                                    className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                      isSelected
                                        ? 'bg-sky-600 text-white font-bold'
                                        : 'bg-white hover:bg-sky-50 text-black'
                                    }`}
                                  >
                                    <span>{matOption}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Equipment Required (Yes/No + Dropdown when Yes) */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                <label className="md:col-span-3 bg-sky-50/90 px-4 py-3.5 text-xs font-bold text-sky-950 flex items-center border-b md:border-b-0 md:border-r border-sky-200">
                  Equipment Required
                </label>
                <div className="md:col-span-9 bg-white p-2 space-y-2 relative">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex rounded-lg border border-sky-300 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setEquipmentRequiredChoice('YES');
                          if (formData.equipment === 'No') {
                            setFormData((prev) => ({ ...prev, equipment: '' }));
                          }
                        }}
                        className={`px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                          equipmentRequiredChoice === 'YES' ||
                          (formData.equipment && formData.equipment !== 'No')
                            ? 'bg-sky-600 text-white'
                            : 'bg-white text-slate-700 hover:bg-sky-50'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEquipmentRequiredChoice('NO');
                          setEquipmentDropdownOpen(false);
                          setFormData((prev) => ({ ...prev, equipment: 'No' }));
                        }}
                        className={`px-4 py-1.5 text-xs font-bold border-l border-sky-300 transition cursor-pointer ${
                          equipmentRequiredChoice === 'NO' || formData.equipment === 'No'
                            ? 'bg-slate-700 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        No
                      </button>
                    </div>

                    {(equipmentRequiredChoice === 'YES' ||
                      (formData.equipment && formData.equipment !== 'No')) && (
                      <div className="flex-1 min-w-[220px] relative">
                        <button
                          type="button"
                          onClick={() => setEquipmentDropdownOpen((prev) => !prev)}
                          className="w-full bg-white px-3 py-1.5 text-sm font-semibold text-left text-black border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <span
                            className={
                              formData.equipment && formData.equipment !== 'No'
                                ? 'text-black font-semibold'
                                : 'text-neutral-400 font-normal'
                            }
                          >
                            {formData.equipment && formData.equipment !== 'No'
                              ? formData.equipment
                              : '-- Select or Enter Equipment --'}
                          </span>
                          <span className="text-sky-700 text-xs font-black">
                            {equipmentDropdownOpen ? '▲' : '▼'}
                          </span>
                        </button>

                        {equipmentDropdownOpen && (
                          <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border-2 border-sky-600 rounded-xl shadow-2xl overflow-hidden">
                            <div className="max-h-60 overflow-y-auto divide-y divide-sky-100">
                              <div className="w-full px-3.5 py-2 bg-white hover:bg-sky-50/50 flex items-center gap-2.5">
                                <span className="text-xs font-bold text-black shrink-0">
                                  Other Equipment
                                </span>
                                <input
                                  type="text"
                                  value={newEquipmentInput}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setNewEquipmentInput(val);
                                    setFormData((prev) => ({ ...prev, equipment: val }));
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      setEquipmentDropdownOpen(false);
                                    }
                                  }}
                                  placeholder="Enter the equipment name"
                                  className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                              </div>

                              {BASE_EQUIPMENT_OPTIONS.map((eqOption) => {
                                const isSelected = formData.equipment === eqOption;
                                return (
                                  <button
                                    key={eqOption}
                                    type="button"
                                    onClick={() => {
                                      setNewEquipmentInput('');
                                      setFormData((prev) => ({ ...prev, equipment: eqOption }));
                                      setEquipmentDropdownOpen(false);
                                    }}
                                    className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                      isSelected
                                        ? 'bg-sky-600 text-white font-bold'
                                        : 'bg-white hover:bg-sky-50 text-black'
                                    }`}
                                  >
                                    <span>{eqOption}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Harvest Planning */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                <label className="md:col-span-3 bg-sky-50/90 px-4 py-3.5 text-xs font-bold text-sky-950 flex items-center border-b md:border-b-0 md:border-r border-sky-200">
                  Harvest Planning
                </label>
                <div className="md:col-span-9 bg-white p-2">
                  <input
                    type="text"
                    name="harvestPlanning"
                    value={formData.harvestPlanning}
                    onChange={handleInputChange}
                    placeholder="Enter Harvest Planning"
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Packaging Type */}
              <div className="grid grid-cols-1 md:grid-cols-12">
                <label className="md:col-span-3 bg-sky-50/90 px-4 py-3.5 text-xs font-bold text-sky-950 flex items-center border-b md:border-b-0 md:border-r border-sky-200">
                  Packaging Type
                </label>
                <div className="md:col-span-9 bg-white p-2">
                  <input
                    type="text"
                    name="packagingType"
                    value={formData.packagingType}
                    onChange={handleInputChange}
                    placeholder="Enter Packaging Type"
                    className="w-full bg-white px-2.5 py-1.5 text-sm font-semibold text-black placeholder:text-neutral-400 border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Submit Actions — Placed Above Package of Practice (POP) Activity Schedule Table */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 rounded-2xl border-2 border-emerald-500/40 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg print:hidden">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-md">
              <Send className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <div className="font-black text-white text-sm sm:text-base">
                Ready to submit Farmer Data Form & POP?
              </div>
              <div className="text-xs text-emerald-200">
                Submission immediately alerts your assigned VLE, regional warehouse, and procurement agronomist.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              leftIcon={<Save className="w-4 h-4" />}
              className="bg-white/10 text-white border-white/25 hover:bg-white/20"
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              variant="golden"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
              className="px-8 font-black shadow-md"
            >
              Submit Digital Form
            </Button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* SECTION 4: Package of Practice (POP) Activity Schedule Table          */}
        {/* Read-Only on Front Page — Shows Full Crop Progress, Details & Solution */}
        {/* ===================================================================== */}
        {formData.isPopTableEnabled !== false && (
          <div className="bg-white rounded-2xl border border-agri-border shadow-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-agri-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agri-pale flex items-center justify-center text-agri-green font-black">
                4
              </div>
              <div>
                <h2 className="text-lg font-bold text-agri-dark">
                  Package of Practice (POP) Activity Schedule Table
                </h2>
                <p className="text-xs text-agri-secondary">
                  Stage-Wise Agronomic Details & Verified Solutions (Read-Only View)
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-agri-green-dark text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-agri-green" />
              <span>University Verified POP Schedule ({formData.crop || 'Maize'})</span>
            </div>
          </div>

          {/* Read-Only Schedule Table (No Add Stage Row button, No Action column, No front-page editing) */}
          <div className="overflow-x-auto rounded-xl border border-agri-border shadow-inner">
            <table className="w-full text-left text-xs border-collapse min-w-[1250px]">
              <thead className="bg-agri-dark text-white font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 border-r border-white/10 w-36">Sown Date & Stage</th>
                  <th className="p-3 border-r border-white/10 w-28">Crop Progress</th>
                  <th className="p-3 border-r border-white/10 w-44">Soil Preparation</th>
                  <th className="p-3 border-r border-white/10 w-44">Manuring</th>
                  <th className="p-3 border-r border-white/10 w-36">Irrigation</th>
                  <th className="p-3 border-r border-white/10 w-40">Weeding Schedule</th>
                  <th className="p-3 border-r border-white/10 w-44">Spraying Schedule</th>
                  <th className="p-3 border-r border-white/10 w-40">Maintenance</th>
                  <th className="p-3 border-r border-white/10 w-40">Harvesting</th>
                  <th className="p-3 w-56 bg-emerald-950 text-emerald-300">
                    Crop Problem & Recommended Solution
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-agri-border bg-white">
                {schedule
                  .filter((row) => row.isEnabled !== false)
                  .map((row) => {
                  const status = getStageStatus(row);
                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors align-top ${
                        status === 'CURRENT'
                          ? 'bg-amber-50/40'
                          : status === 'COMPLETED'
                          ? 'bg-emerald-50/20'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="p-3 border-r border-agri-border/60">
                        <div className="font-bold text-agri-green-dark text-xs">
                          {row.sownDate}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                          {row.stageName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {row.dayRange}
                        </div>
                      </td>

                      <td className="p-3 border-r border-agri-border/60">
                        {status === 'COMPLETED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        )}
                        {status === 'CURRENT' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                            <Clock className="w-3 h-3" />
                            Active Stage
                          </span>
                        )}
                        {status === 'UPCOMING' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-300 text-[10px] font-semibold">
                            Upcoming
                          </span>
                        )}
                      </td>

                      <td className="p-3 border-r border-agri-border/60 text-[11px] text-slate-700 leading-relaxed">
                        {row.soilPrep}
                      </td>
                      <td className="p-3 border-r border-agri-border/60 text-[11px] text-slate-700 leading-relaxed">
                        {row.manuring}
                      </td>
                      <td className="p-3 border-r border-agri-border/60 text-[11px] text-slate-700 leading-relaxed">
                        {row.irrigation}
                      </td>
                      <td className="p-3 border-r border-agri-border/60 text-[11px] text-slate-700 leading-relaxed">
                        {row.weedingSchedule}
                      </td>
                      <td className="p-3 border-r border-agri-border/60 text-[11px] text-slate-700 leading-relaxed">
                        {row.sprayingSchedule}
                      </td>
                      <td className="p-3 border-r border-agri-border/60 text-[11px] text-slate-700 leading-relaxed">
                        {row.maintenanceSchedule}
                      </td>
                      <td className="p-3 border-r border-agri-border/60 text-[11px] text-slate-700 leading-relaxed">
                        {row.harvestingSchedule}
                      </td>
                      <td className="p-3 bg-emerald-50/40 text-[11px] leading-relaxed space-y-1.5">
                        <div>
                          <span className="font-bold text-rose-700">Problem: </span>
                          <span className="text-slate-700">{row.keyProblem}</span>
                        </div>
                        <div>
                          <span className="font-bold text-emerald-800">Solution: </span>
                          <span className="text-emerald-950 font-medium">{row.recommendedSolution}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-agri-secondary">
            <span>
              Showing <strong>{schedule.filter((row) => row.isEnabled !== false).length}</strong> standardized POP crop stages with progress & solutions
            </span>
            <span className="text-[11px] text-slate-500 italic">
              Read-only university schedule — managed and synchronized via Agri-Mart Admin & Agronomy Registry
            </span>
          </div>
        </div>
      )}
          </>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FARMER LIFECYCLE                                                   */}
        {/* 2. Additional Features to Build into the Farmer Profile App               */}
        {/* Colorful Section Headers & Tinted Labels with Crisp Black Input Text      */}
        {/* ========================================================================= */}
        {activeTab === 'lifecycle' && (
          <div className="bg-white text-black rounded-3xl border-2 border-emerald-600/40 shadow-card overflow-hidden">
            {/* Colorful Top Header Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-indigo-950 text-white px-6 py-6 text-center border-b-2 border-emerald-700">
              <div className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 shadow-xs">
                <Sprout className="w-3.5 h-3.5" />
                Complete Farmer Lifecycle & Advisory Suite
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-white">
                2. Additional Features to Build into the Farmer Profile App
              </h2>
              <p className="text-xs text-emerald-100 font-medium mt-1">
                FARMER LIFECYCLE — Visit & Advisory, Pest & Disease Tracking, Irrigation & Weather Alerts, Soil Health, Harvest & Market, and Farmer Communication
              </p>
            </div>

            <div className="p-5 sm:p-8 space-y-8">
              {/* Linked Farmer Reference Row (synced with Tab 1) */}
              <div className="border-2 border-emerald-500 rounded-2xl overflow-hidden bg-emerald-50/50 shadow-xs">
                <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white px-4 py-2 text-xs font-extrabold uppercase tracking-wider flex items-center justify-between">
                  <span>Farmer Reference (Synced with Tab 1: Farmer Data Form)</span>
                  <span className="text-[10px] text-amber-300 font-bold">Auto-Synced</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-2 bg-emerald-100/80 text-emerald-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-emerald-300">
                    Farmer Name <span className="text-red-600 ml-1">*</span>
                  </div>
                  <div className="md:col-span-4 p-2 border-b md:border-b-0 md:border-r border-emerald-300 bg-white">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter Farmer Full Name"
                      className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-emerald-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="md:col-span-2 bg-emerald-100/80 text-emerald-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-emerald-300">
                    Mobile Number <span className="text-red-600 ml-1">*</span>
                  </div>
                  <div className="md:col-span-4 p-2 bg-white">
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="10-digit Mobile Number"
                      maxLength={10}
                      className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-emerald-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* ===================================================================== */}
              {/* CROP SELECTOR BUTTONS & SELECTED CROP DETAILS ABOVE SECTION 1         */}
              {/* ===================================================================== */}
              {(() => {
                const allCropsList = [
                  {
                    id: 'primary',
                    index: 1,
                    cropType: formData.cropType,
                    crop: formData.crop,
                    variety: formData.variety,
                    plantingDate: formData.plantingDate,
                    cropAge: formData.cropAge,
                    cropAcreage: formData.cropAcreage,
                    plantCount: formData.plantCount,
                    spacing: formData.spacing,
                    surveyNumber: formData.surveyNumber,
                  },
                  ...(formData.additionalCrops || []).map((item, idx) => ({
                    id: item.id,
                    index: idx + 2,
                    cropType: item.cropType,
                    crop: item.crop,
                    variety: item.variety,
                    plantingDate: item.plantingDate,
                    cropAge: item.cropAge,
                    cropAcreage: item.cropAcreage,
                    plantCount: item.plantCount,
                    spacing: item.spacing,
                    surveyNumber: item.surveyNumber || formData.surveyNumber,
                  })),
                ];

                const activeCrop =
                  allCropsList.find((c) => c.id === selectedLifecycleCropId) || allCropsList[0];

                return (
                  <div className="rounded-2xl border-2 border-amber-500 bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/50 shadow-sm overflow-hidden">
                    {/* Header + Crop Buttons Bar */}
                    <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sprout className="w-5 h-5 text-white shrink-0" />
                        <span className="text-sm sm:text-base font-extrabold tracking-wide">
                          Select Crop to View & Edit Farmer Lifecycle Details ({allCropsList.length}{' '}
                          {allCropsList.length === 1 ? 'Crop' : 'Crops'} Added)
                        </span>
                      </div>
                      <span className="text-[11px] font-black bg-white/20 px-3 py-1 rounded-full text-white">
                        Click a crop button below to switch lifecycle records
                      </span>
                    </div>

                    {/* Crop Buttons Row */}
                    <div className="p-4 bg-amber-50/60 border-b border-amber-200 flex flex-wrap items-center gap-3">
                      {allCropsList.map((cropEntry) => {
                        const isSelected = activeCrop.id === cropEntry.id;
                        const labelName = cropEntry.crop || `Crop ${cropEntry.index}`;
                        return (
                          <button
                            key={cropEntry.id}
                            type="button"
                            onClick={() => handleSelectLifecycleCrop(cropEntry.id)}
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
                          Selected Crop #{activeCrop.index} Details:{' '}
                          <strong className="text-amber-300">
                            {activeCrop.crop || `Crop #${activeCrop.index}`}
                          </strong>
                        </span>
                        <span className="text-[10px] text-emerald-200 font-bold">
                          Showing Farmer Lifecycle below for Crop #{activeCrop.index} only
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 divide-y sm:divide-y-0 sm:divide-x divide-amber-200 border-b border-amber-200 text-xs">
                        <div className="p-2.5">
                          <div className="text-[10px] font-bold text-amber-900 uppercase">
                            Crop Type
                          </div>
                          <div className="font-extrabold text-black mt-0.5 truncate">
                            {activeCrop.cropType || '—'}
                          </div>
                        </div>
                        <div className="p-2.5">
                          <div className="text-[10px] font-bold text-amber-900 uppercase">
                            Crop Name
                          </div>
                          <div className="font-extrabold text-emerald-800 mt-0.5 truncate">
                            {activeCrop.crop || '—'}
                          </div>
                        </div>
                        <div className="p-2.5">
                          <div className="text-[10px] font-bold text-amber-900 uppercase">
                            Variety
                          </div>
                          <div className="font-bold text-black mt-0.5 truncate">
                            {activeCrop.variety || '—'}
                          </div>
                        </div>
                        <div className="p-2.5">
                          <div className="text-[10px] font-bold text-amber-900 uppercase">
                            Planting Date
                          </div>
                          <div className="font-bold text-black mt-0.5 truncate">
                            {activeCrop.plantingDate || '—'}
                          </div>
                        </div>
                        <div className="p-2.5">
                          <div className="text-[10px] font-bold text-amber-900 uppercase">
                            Crop Age
                          </div>
                          <div className="font-bold text-black mt-0.5 truncate">
                            {activeCrop.cropAge || '—'}
                          </div>
                        </div>
                        <div className="p-2.5">
                          <div className="text-[10px] font-bold text-amber-900 uppercase">
                            Crop Acreage
                          </div>
                          <div className="font-bold text-black mt-0.5 truncate">
                            {activeCrop.cropAcreage || '—'}
                          </div>
                        </div>
                        <div className="p-2.5">
                          <div className="text-[10px] font-bold text-amber-900 uppercase">
                            Plant Count
                          </div>
                          <div className="font-bold text-black mt-0.5 truncate">
                            {activeCrop.plantCount || '—'}
                          </div>
                        </div>
                        <div className="p-2.5">
                          <div className="text-[10px] font-bold text-amber-900 uppercase">
                            Spacing
                          </div>
                          <div className="font-bold text-black mt-0.5 truncate">
                            {activeCrop.spacing || '—'}
                          </div>
                        </div>
                        <div className="p-2.5">
                          <div className="text-[10px] font-bold text-amber-900 uppercase">
                            Survey Number
                          </div>
                          <div className="font-bold text-black mt-0.5 truncate">
                            {activeCrop.surveyNumber || '—'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ===================================================== */}
              {/* 1. Farmer Visit and Advisory History (Emerald Theme)  */}
              {/* ===================================================== */}
              <div className="rounded-2xl border-2 border-emerald-600 shadow-sm">
                <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white px-5 py-3.5 rounded-t-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-400 text-emerald-950 font-black text-sm flex items-center justify-center shrink-0">
                        1
                      </span>
                      <span>Farmer Visit and Advisory History</span>
                    </h3>
                    <p className="text-xs text-emerald-100 mt-0.5">
                      Record each field visit, advisor name, crop observations, recommendations, farmer feedback, photographs, and next follow-up date.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full text-amber-300 shrink-0 self-start sm:self-center">
                    Field Advisory
                  </span>
                </div>

                <div className="bg-white text-black">
                  {/* Row 1: Field Visit Date & Advisor Name */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-emerald-200">
                    <div className="md:col-span-2 bg-emerald-50/90 text-emerald-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                      Field Visit Date
                    </div>
                    <div className="md:col-span-4 p-2 border-b md:border-b-0 md:border-r border-emerald-200 bg-white">
                      <input
                        type="date"
                        name="visitDate"
                        value={formData.visitDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="md:col-span-2 bg-emerald-50/90 text-emerald-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                      Advisor Name
                    </div>
                    <div className="md:col-span-4 p-2 bg-white">
                      <input
                        type="text"
                        name="advisorName"
                        value={formData.advisorName}
                        onChange={handleInputChange}
                        placeholder="Enter Agronomist / Advisor Name"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Row above Crop Observations: Crop Stage Dropdown */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-emerald-200">
                    <div className="md:col-span-2 bg-emerald-50/90 text-emerald-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                      Crop Stage
                    </div>
                    <div className="md:col-span-10 p-2 bg-white relative">
                      <button
                        type="button"
                        onClick={() => setVisitCropStageDropdownOpen((prev) => !prev)}
                        className="w-full bg-white px-3 py-2 text-sm font-semibold text-left text-black border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <span className={formData.visitCropStage ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                          {formData.visitCropStage || '-- Select or Enter Crop Stage --'}
                        </span>
                        <span className="text-emerald-700 text-xs font-black">
                          {visitCropStageDropdownOpen ? '▲' : '▼'}
                        </span>
                      </button>

                      {visitCropStageDropdownOpen && (
                        <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-emerald-600 rounded-xl shadow-2xl overflow-hidden">
                          <div className="max-h-60 overflow-y-auto divide-y divide-emerald-100">
                            {/* 1st Row at the Top of the Column: "Other Stage" + Text Box next to it */}
                            <div className="w-full px-3.5 py-2 bg-white hover:bg-emerald-50/50 flex items-center gap-2.5">
                              <span className="text-xs font-bold text-black shrink-0">
                                Other Stage
                              </span>
                              <input
                                type="text"
                                value={newVisitCropStageInput}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setNewVisitCropStageInput(val);
                                  updateLifecycleFields({ visitCropStage: val });
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    setVisitCropStageDropdownOpen(false);
                                  }
                                }}
                                placeholder="Enter the crop stage"
                                className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>

                            {/* All 23 Crop Stage Options List */}
                            {BASE_CROP_STAGES.map((stageOption) => {
                              const isSelected = formData.visitCropStage === stageOption;
                              return (
                                <button
                                  key={stageOption}
                                  type="button"
                                  onClick={() => {
                                    setNewVisitCropStageInput('');
                                    updateLifecycleFields({ visitCropStage: stageOption });
                                    setVisitCropStageDropdownOpen(false);
                                  }}
                                  className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                    isSelected
                                      ? 'bg-emerald-600 text-white font-bold'
                                      : 'bg-white hover:bg-emerald-50 text-black'
                                  }`}
                                >
                                  <span>{stageOption}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Crop Observations & Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-emerald-200">
                    <div className="md:col-span-2 bg-emerald-50/90 text-emerald-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                      Crop Observations
                    </div>
                    <div className="md:col-span-4 p-2 border-b md:border-b-0 md:border-r border-emerald-200 bg-white">
                      <textarea
                        name="cropObservations"
                        value={formData.cropObservations}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Record field and crop growth observations"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="md:col-span-2 bg-emerald-50/90 text-emerald-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                      Recommendations
                    </div>
                    <div className="md:col-span-4 p-2 bg-white">
                      <textarea
                        name="visitRecommendations"
                        value={formData.visitRecommendations}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Enter advisor agronomic recommendations"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Row after Recommendations: Application Type Dropdown */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-emerald-200">
                    <div className="md:col-span-2 bg-emerald-50/90 text-emerald-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                      Application Type
                    </div>
                    <div className="md:col-span-10 p-2 bg-white relative">
                      <button
                        type="button"
                        onClick={() => setVisitAppTypeDropdownOpen((prev) => !prev)}
                        className="w-full bg-white px-3 py-2 text-sm font-semibold text-left text-black border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <span className={formData.visitApplicationType ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}>
                          {formData.visitApplicationType || '-- Select or Enter Application Type --'}
                        </span>
                        <span className="text-emerald-700 text-xs font-black">
                          {visitAppTypeDropdownOpen ? '▲' : '▼'}
                        </span>
                      </button>

                      {visitAppTypeDropdownOpen && (
                        <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-emerald-600 rounded-xl shadow-2xl overflow-hidden">
                          <div className="max-h-60 overflow-y-auto divide-y divide-emerald-100">
                            {/* 1st Row at the Top of the Column: "Other Application Type" + Text Box next to it */}
                            <div className="w-full px-3.5 py-2 bg-white hover:bg-emerald-50/50 flex items-center gap-2.5">
                              <span className="text-xs font-bold text-black shrink-0">
                                Other Application Type
                              </span>
                              <input
                                type="text"
                                value={newVisitAppTypeInput}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setNewVisitAppTypeInput(val);
                                  updateLifecycleFields({ visitApplicationType: val });
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    setVisitAppTypeDropdownOpen(false);
                                  }
                                }}
                                placeholder="Enter the application type"
                                className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>

                            {/* Application Type Options List */}
                            {BASE_APPLICATION_TYPES.map((appOption) => {
                              const isSelected = formData.visitApplicationType === appOption;
                              return (
                                <button
                                  key={appOption}
                                  type="button"
                                  onClick={() => {
                                    setNewVisitAppTypeInput('');
                                    updateLifecycleFields({ visitApplicationType: appOption });
                                    setVisitAppTypeDropdownOpen(false);
                                  }}
                                  className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                    isSelected
                                      ? 'bg-emerald-600 text-white font-bold'
                                      : 'bg-white hover:bg-emerald-50 text-black'
                                  }`}
                                >
                                  <span>{appOption}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Farmer Feedback, Photographs & Next Follow-up Date */}
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-2 bg-emerald-50/90 text-emerald-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                      Farmer Feedback
                    </div>
                    <div className="md:col-span-3 p-2 border-b md:border-b-0 md:border-r border-emerald-200 bg-white">
                      <input
                        type="text"
                        name="farmerFeedback"
                        value={formData.farmerFeedback}
                        onChange={handleInputChange}
                        placeholder="Farmer's response / feedback"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="md:col-span-2 bg-emerald-50/90 text-emerald-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                      Photographs
                    </div>
                    <div className="md:col-span-2 p-2 border-b md:border-b-0 md:border-r border-emerald-200 bg-white">
                      {(() => {
                        const photoList = sanitizeFieldPhotos(formData.visitPhotographs)
                          .split(',')
                          .map((s: string) => s.trim())
                          .filter(Boolean);
                        const count = photoList.length;

                        return (
                          <div className="relative flex items-center w-full">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenCameraModal(
                                  'farmer-visit-photographs',
                                  'Farmer Visit Photographs',
                                  'visitPhotographs'
                                )
                              }
                              className="absolute left-2.5 z-10 p-1 text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100 rounded-md transition-all cursor-pointer flex items-center justify-center group"
                              title="Open Field Camera to capture photograph (Up to 5 images per crop)"
                            >
                              <Camera className="w-4 h-4 transition-transform group-hover:scale-110" />
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
                              className="w-full text-left pl-9 pr-20 py-2 text-sm font-bold bg-white border border-emerald-300 rounded-lg hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all flex items-center justify-between cursor-pointer shadow-sm"
                              title="Click to view or capture photos"
                            >
                              <span className={count > 0 ? "text-emerald-950" : "text-slate-400 font-medium"}>
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
                              className="absolute right-2 z-10 px-2 py-0.5 rounded-md text-xs font-black bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
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
                    <div className="md:col-span-1 bg-emerald-50/90 text-emerald-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-emerald-200">
                      Next Follow-up
                    </div>
                    <div className="md:col-span-2 p-2 bg-white">
                      <input
                        type="date"
                        name="nextFollowUpDate"
                        value={formData.nextFollowUpDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ===================================================== */}
              {/* 2. Pest, Disease and Crop Problem Tracking (Rose)     */}
              {/* ===================================================== */}
              <div className="rounded-2xl border-2 border-rose-600 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-rose-700 via-red-600 to-orange-700 text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-white text-rose-900 font-black text-sm flex items-center justify-center shrink-0">
                        2
                      </span>
                      <span>Pest, Disease and Crop Problem Tracking</span>
                    </h3>
                    <p className="text-xs text-rose-100 mt-0.5">
                      Upload field photos, record symptoms and severity, document actions taken, and track whether the problem was resolved.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full text-amber-200 shrink-0 self-start sm:self-center">
                    Plant Protection
                  </span>
                </div>

                <div className="bg-white text-black">
                  {/* Row 1: Field Photos, Symptoms & Severity */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-rose-200">
                    <div className="md:col-span-2 bg-rose-50/90 text-rose-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-rose-200">
                      Upload Field Photos
                    </div>
                    <div className="md:col-span-3 p-2 border-b md:border-b-0 md:border-r border-rose-200 bg-white">
                      {(() => {
                        const photoList = sanitizeFieldPhotos(formData.problemFieldPhotos)
                          .split(',')
                          .map((s: string) => s.trim())
                          .filter(Boolean);
                        const count = photoList.length;

                        return (
                          <div className="relative flex items-center w-full">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenCameraModal(
                                  'pest-disease-tracking',
                                  'Pest & Disease Field Photos',
                                  'problemFieldPhotos'
                                )
                              }
                              className="absolute left-2.5 z-10 p-1 text-rose-700 hover:text-rose-950 hover:bg-rose-100 rounded-md transition-all cursor-pointer flex items-center justify-center group"
                              title="Open Field Camera to capture problem photo (Up to 5 images per crop)"
                            >
                              <Camera className="w-4 h-4 transition-transform group-hover:scale-110" />
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
                              className="w-full text-left pl-9 pr-20 py-2 text-sm font-bold bg-white border border-rose-300 rounded-lg hover:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all flex items-center justify-between cursor-pointer shadow-sm"
                              title="Click to view or capture problem photos"
                            >
                              <span className={count > 0 ? "text-rose-950" : "text-slate-400 font-medium"}>
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
                              className="absolute right-2 z-10 px-2 py-0.5 rounded-md text-xs font-black bg-rose-100 hover:bg-rose-200 text-rose-800 flex items-center gap-1 cursor-pointer transition-colors"
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
                    <div className="md:col-span-2 bg-rose-50/90 text-rose-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-rose-200">
                      Symptoms
                    </div>
                    <div className="md:col-span-2 p-2 border-b md:border-b-0 md:border-r border-rose-200 bg-white">
                      <input
                        type="text"
                        name="problemSymptoms"
                        value={formData.problemSymptoms}
                        onChange={handleInputChange}
                        placeholder="Observed symptoms"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div className="md:col-span-1 bg-rose-50/90 text-rose-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-rose-200">
                      Severity
                    </div>
                    <div className="md:col-span-2 p-2 bg-white">
                      <select
                        name="problemSeverity"
                        value={formData.problemSeverity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="">-- Select --</option>
                        <option value="Low">Low</option>
                        <option value="Moderate">Moderate</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Actions Taken & Problem Resolved Status */}
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-2 bg-rose-50/90 text-rose-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-rose-200">
                      Actions Taken
                    </div>
                    <div className="md:col-span-5 p-2 border-b md:border-b-0 md:border-r border-rose-200 bg-white">
                      <textarea
                        name="problemActionsTaken"
                        value={formData.problemActionsTaken}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Document treatment, spray, or corrective actions taken"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div className="md:col-span-2 bg-rose-50/90 text-rose-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-rose-200">
                      Problem Resolved?
                    </div>
                    <div className="md:col-span-3 p-2 bg-white flex items-center">
                      <select
                        name="problemResolved"
                        value={formData.problemResolved}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <option value="">-- Select Status --</option>
                        <option value="Resolved">Yes - Resolved</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Pending Follow-up">Pending Follow-up</option>
                        <option value="Unresolved">No - Unresolved</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===================================================== */}
              {/* 3. Irrigation and Weather Alerts (Sky / Blue Theme)   */}
              {/* ===================================================== */}
              <div className="rounded-2xl border-2 border-sky-600 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-sky-700 via-blue-600 to-indigo-700 text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-300 text-sky-950 font-black text-sm flex items-center justify-center shrink-0">
                        3
                      </span>
                      <span>Irrigation and Weather Alerts</span>
                    </h3>
                    <p className="text-xs text-sky-100 mt-0.5">
                      Record water availability and irrigation schedules. Provide relevant rainfall, heat, and weather alerts based on the farm&apos;s location.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full text-sky-100 shrink-0 self-start sm:self-center">
                    Water & Climate
                  </span>
                </div>

                <div className="bg-white text-black">
                  {/* Row 1: Water Availability & Irrigation Schedules */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-sky-200">
                    <div className="md:col-span-2 bg-sky-50/90 text-sky-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-sky-200">
                      Water Availability
                    </div>
                    <div className="md:col-span-4 p-2 border-b md:border-b-0 md:border-r border-sky-200 bg-white">
                      <select
                        name="waterAvailability"
                        value={formData.waterAvailability}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="">-- Select Water Availability --</option>
                        <option value="Adequate / Sufficient">Adequate / Sufficient</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Low / Scarcity">Low / Scarcity</option>
                        <option value="Critical Shortage">Critical Shortage</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 bg-sky-50/90 text-sky-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-sky-200">
                      Irrigation Schedules
                    </div>
                    <div className="md:col-span-4 p-2 bg-white">
                      <input
                        type="text"
                        name="irrigationSchedules"
                        value={formData.irrigationSchedules}
                        onChange={handleInputChange}
                        placeholder="e.g., Every 4 days / Drip 2 hrs daily"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  {/* Row 2: Rainfall Alert, Heat Alert & Location Weather Alerts */}
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-2 bg-sky-50/90 text-sky-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-sky-200">
                      Rainfall Alert
                    </div>
                    <div className="md:col-span-2 p-2 border-b md:border-b-0 md:border-r border-sky-200 bg-white">
                      <input
                        type="text"
                        name="rainfallAlert"
                        value={formData.rainfallAlert}
                        onChange={handleInputChange}
                        placeholder="Rainfall forecast / alert"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div className="md:col-span-2 bg-sky-50/90 text-sky-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-sky-200">
                      Heat Alert
                    </div>
                    <div className="md:col-span-2 p-2 border-b md:border-b-0 md:border-r border-sky-200 bg-white">
                      <input
                        type="text"
                        name="heatAlert"
                        value={formData.heatAlert}
                        onChange={handleInputChange}
                        placeholder="Temperature / heat alert"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div className="md:col-span-2 bg-sky-50/90 text-sky-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-sky-200">
                      Weather Alerts (Location)
                    </div>
                    <div className="md:col-span-2 p-2 bg-white">
                      <input
                        type="text"
                        name="weatherAlerts"
                        value={formData.weatherAlerts}
                        onChange={handleInputChange}
                        placeholder="Location weather advisory"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ===================================================== */}
              {/* 4. Soil Health and Fertilizer Recommendations (Amber) */}
              {/* ===================================================== */}
              <div className="rounded-2xl border-2 border-amber-600 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-white text-amber-900 font-black text-sm flex items-center justify-center shrink-0">
                        4
                      </span>
                      <span>Soil Health and Fertilizer Recommendations</span>
                    </h3>
                    <p className="text-xs text-amber-50 mt-0.5">
                      Keep test reports, crop-specific nutrient recommendations, fertilizer application history, and the next testing date in one place.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full text-amber-50 shrink-0 self-start sm:self-center">
                    Soil & Nutrition
                  </span>
                </div>

                <div className="bg-white text-black">
                  {/* Row 1: Test Reports & Next Testing Date */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-amber-200">
                    <div className="md:col-span-2 bg-amber-50/90 text-amber-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                      Soil Test Reports
                    </div>
                    <div className="md:col-span-4 p-2 border-b md:border-b-0 md:border-r border-amber-200 bg-white">
                      <input
                        type="text"
                        name="soilTestReport"
                        value={formData.soilTestReport}
                        onChange={handleInputChange}
                        placeholder="pH, EC, Organic Carbon, NPK status / Report ID"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="md:col-span-2 bg-amber-50/90 text-amber-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                      Next Testing Date
                    </div>
                    <div className="md:col-span-4 p-2 bg-white">
                      <input
                        type="date"
                        name="nextSoilTestDate"
                        value={formData.nextSoilTestDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Row 2: Crop-Specific Nutrient Recommendations & Fertilizer Application History */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-amber-200">
                    <div className="md:col-span-2 bg-amber-50/90 text-amber-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                      Crop-Specific Nutrient Recommendations
                    </div>
                    <div className="md:col-span-4 p-2 border-b md:border-b-0 md:border-r border-amber-200 bg-white">
                      <textarea
                        name="nutrientRecommendations"
                        value={formData.nutrientRecommendations}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Recommended basal & top-dressing NPK / micronutrients"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="md:col-span-2 bg-amber-50/90 text-amber-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                      Fertilizer Application History
                    </div>
                    <div className="md:col-span-4 p-2 bg-white">
                      <textarea
                        name="fertilizerHistory"
                        value={formData.fertilizerHistory}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Record dates, fertilizers applied, and quantities"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Row 3: Download Soil Report (JPG or PDF Format) — Crop-Specific */}
                  {(() => {
                    const matchedExtraCrop =
                      selectedLifecycleCropId === 'primary'
                        ? null
                        : (formData.additionalCrops || []).find(
                            (c) => c.id === selectedLifecycleCropId
                          );
                    const activeCropLabel =
                      selectedLifecycleCropId === 'primary'
                        ? formData.crop || 'Crop #1'
                        : matchedExtraCrop?.crop || 'Selected Crop';
                    const activeCropSoilFileName =
                      selectedLifecycleCropId === 'primary'
                        ? cropLifecycleMap.primary?.soilReportFileName ||
                          formData.soilReportFileName ||
                          ''
                        : matchedExtraCrop?.soilReportFileName ||
                          matchedExtraCrop?.lifecycleData?.soilReportFileName ||
                          cropLifecycleMap[selectedLifecycleCropId]?.soilReportFileName ||
                          '';
                    const activeCropSoilFileData =
                      selectedLifecycleCropId === 'primary'
                        ? cropLifecycleMap.primary?.soilReportFileData ||
                          formData.soilReportFileData ||
                          ''
                        : matchedExtraCrop?.soilReportFileData ||
                          matchedExtraCrop?.lifecycleData?.soilReportFileData ||
                          cropLifecycleMap[selectedLifecycleCropId]?.soilReportFileData ||
                          '';
                    const activeCropSoilSummary =
                      selectedLifecycleCropId === 'primary'
                        ? cropLifecycleMap.primary?.soilTestReport || formData.soilTestReport || ''
                        : matchedExtraCrop?.lifecycleData?.soilTestReport ||
                          cropLifecycleMap[selectedLifecycleCropId]?.soilTestReport ||
                          formData.soilTestReport ||
                          '';

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="md:col-span-2 bg-amber-50/90 text-amber-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-amber-200">
                          Download Soil Report (JPG / PDF)
                        </div>
                        <div className="md:col-span-10 p-3 bg-white flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleDownloadSoilReport(
                                activeCropSoilFileName,
                                activeCropSoilFileData,
                                activeCropLabel,
                                activeCropSoilSummary,
                                selectedLifecycleCropId
                              )
                            }
                            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-lg shadow-xs transition cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Soil Report (JPG / PDF)</span>
                          </button>

                          {activeCropSoilFileName && activeCropSoilFileData ? (
                            <div className="inline-flex items-center gap-2.5 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-950">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{activeCropSoilFileName}</span>
                              <span className="text-[11px] bg-amber-200/80 text-amber-950 font-bold px-2 py-0.5 rounded">
                                {activeCropLabel}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-500 font-medium">
                              No Soil Report (JPG / PDF) uploaded from backend yet.
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* ===================================================== */}
              {/* 5. Harvest, Yield and Market Information (Purple)     */}
              {/* ===================================================== */}
              <div className="rounded-2xl border-2 border-purple-600 shadow-sm">
                <div className="bg-gradient-to-r from-purple-700 via-violet-700 to-indigo-800 text-white px-5 py-3.5 rounded-t-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-300 text-purple-950 font-black text-sm flex items-center justify-center shrink-0">
                        5
                      </span>
                      <span>Harvest, Yield and Market Information</span>
                    </h3>
                    <p className="text-xs text-purple-100 mt-0.5">
                      Record harvesting date, harvested quantity, selling price (per kg), market expenses, and crop-wise returns. Add relevant local market price information.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full text-amber-200 shrink-0 self-start sm:self-center">
                    Yield & Market Returns
                  </span>
                </div>

                <div className="bg-white text-black rounded-b-[14px]">
                  {/* Row 1 (Starting): Harvesting Date (Separate Field) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-purple-200">
                    <div className="md:col-span-2 bg-purple-50/90 text-purple-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-purple-200">
                      Harvesting Date
                    </div>
                    <div className="md:col-span-10 p-2 bg-white">
                      <input
                        type="date"
                        name="harvestingDate"
                        value={formData.harvestingDate}
                        onChange={handleInputChange}
                        className="w-full sm:max-w-xs px-3 py-2 text-sm font-semibold text-black bg-white border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Row 2: Harvested Quantity (with Dropdown), Selling Price (per kg) & Harvest Picking */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-purple-200">
                    <div className="md:col-span-2 bg-purple-50/90 text-purple-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-purple-200">
                      Harvested Quantity
                    </div>
                    <div className="md:col-span-2 p-2 border-b md:border-b-0 md:border-r border-purple-200 bg-white relative">
                      {/* Custom Dropdown Trigger Button for Harvested Quantity */}
                      <button
                        type="button"
                        onClick={() => setHarvestQuantityDropdownOpen((prev) => !prev)}
                        className="w-full bg-white px-3 py-2 text-sm font-semibold text-left text-black border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <span className={`truncate ${formData.harvestedQuantity ? 'text-black font-semibold' : 'text-neutral-400 font-normal'}`}>
                          {formData.harvestedQuantity || '-- Select Quality / Qty --'}
                        </span>
                        <span className="text-purple-700 text-xs font-black shrink-0">
                          {harvestQuantityDropdownOpen ? '▲' : '▼'}
                        </span>
                      </button>

                      {/* Dropdown Menu with "Other" + Text Box on 1st Row & Quality Options */}
                      {harvestQuantityDropdownOpen && (
                        <div className="absolute left-2 right-2 top-full mt-1 z-50 bg-white border-2 border-purple-600 rounded-xl shadow-2xl overflow-hidden min-w-[260px]">
                          <div className="max-h-60 overflow-y-auto divide-y divide-purple-100">
                            {/* 1st Row at the Top of the Column: "Other" + Text Box next to it */}
                            <div className="w-full px-3.5 py-2 bg-white hover:bg-purple-50/50 flex items-center gap-2.5">
                              <span className="text-xs font-bold text-black shrink-0">
                                Other
                              </span>
                              <input
                                type="text"
                                value={newHarvestQuantityInput}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setNewHarvestQuantityInput(val);
                                  updateLifecycleFields({ harvestedQuantity: val });
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    setHarvestQuantityDropdownOpen(false);
                                  }
                                }}
                                placeholder="Enter quality / quantity"
                                className="flex-1 bg-white px-2.5 py-1 text-xs font-semibold text-black placeholder:text-neutral-400 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>

                            {/* Quality Options List */}
                            {BASE_HARVEST_QUALITY_OPTIONS.map((qualityOption) => {
                              const isSelected = formData.harvestedQuantity === qualityOption;
                              return (
                                <button
                                  key={qualityOption}
                                  type="button"
                                  onClick={() => {
                                    setNewHarvestQuantityInput('');
                                    updateLifecycleFields({ harvestedQuantity: qualityOption });
                                    setHarvestQuantityDropdownOpen(false);
                                  }}
                                  className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                    isSelected
                                      ? 'bg-purple-600 text-white font-bold'
                                      : 'bg-white hover:bg-purple-50 text-black'
                                  }`}
                                >
                                  <span>{qualityOption}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2 bg-purple-50/90 text-purple-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-purple-200">
                      Selling Price (per kg)
                    </div>
                    <div className="md:col-span-2 p-2 border-b md:border-b-0 md:border-r border-purple-200 bg-white">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          name="sellingPrice"
                          value={formData.sellingPrice}
                          onChange={handleInputChange}
                          placeholder="e.g., ₹25 / kg"
                          className="w-full pl-3 pr-16 py-2 text-sm font-semibold text-black bg-white border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="absolute right-2.5 text-[11px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md pointer-events-none">
                          per kg
                        </span>
                      </div>
                    </div>
                    <div className="md:col-span-2 bg-purple-50/90 text-purple-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-purple-200">
                      Harvest Picking
                    </div>
                    <div className="md:col-span-2 p-2 bg-white">
                      <input
                        type="text"
                        name="harvestPicking"
                        value={formData.harvestPicking}
                        onChange={handleInputChange}
                        placeholder="e.g., 1st Picking / Multiple Pickings"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Row 2: Market Expenses, Crop-Wise Returns & Local Market Price Information */}
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-2 bg-purple-50/90 text-purple-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-purple-200">
                      Market Expenses
                    </div>
                    <div className="md:col-span-2 p-2 border-b md:border-b-0 md:border-r border-purple-200 bg-white">
                      <input
                        type="text"
                        name="marketExpenses"
                        value={formData.marketExpenses}
                        onChange={handleInputChange}
                        placeholder="Transport, loading, etc."
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="md:col-span-2 bg-purple-50/90 text-purple-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-purple-200">
                      Crop-Wise Returns
                    </div>
                    <div className="md:col-span-2 p-2 border-b md:border-b-0 md:border-r border-purple-200 bg-white">
                      <input
                        type="text"
                        name="cropWiseReturns"
                        value={formData.cropWiseReturns}
                        onChange={handleInputChange}
                        placeholder="Net / Gross returns (₹)"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="md:col-span-2 bg-purple-50/90 text-purple-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-purple-200">
                      Local Market Price Info
                    </div>
                    <div className="md:col-span-2 p-2 bg-white">
                      <input
                        type="text"
                        name="localMarketPriceInfo"
                        value={formData.localMarketPriceInfo}
                        onChange={handleInputChange}
                        placeholder="APMC / Local Mandi rate"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ===================================================== */}
              {/* 6. Farmer Communication and Follow-ups (Teal / Cyan)  */}
              {/* ===================================================== */}
              <div className="rounded-2xl border-2 border-teal-600 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-teal-700 via-cyan-700 to-emerald-800 text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-300 text-teal-950 font-black text-sm flex items-center justify-center shrink-0">
                        6
                      </span>
                      <span>Farmer Communication and Follow-ups</span>
                    </h3>
                    <p className="text-xs text-teal-100 mt-0.5">
                      Record WhatsApp consent, advisory messages, training attendance, reminders, and pending actions.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full text-amber-200 shrink-0 self-start sm:self-center">
                    WhatsApp & Follow-Ups
                  </span>
                </div>

                <div className="bg-white text-black">
                  {/* Row 1: WhatsApp Consent, Advisory Messages & Training Attendance */}
                  <div className="grid grid-cols-1 md:grid-cols-12 border-b border-teal-200">
                    <div className="md:col-span-2 bg-teal-50/90 text-teal-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-teal-200">
                      WhatsApp Consent
                    </div>
                    <div className="md:col-span-2 p-2 border-b md:border-b-0 md:border-r border-teal-200 bg-white">
                      <select
                        name="whatsappConsent"
                        value={formData.whatsappConsent}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">-- Select --</option>
                        <option value="Yes - Opted In">Yes - Opted In</option>
                        <option value="No - Opted Out">No - Opted Out</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 bg-teal-50/90 text-teal-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-teal-200">
                      Advisory Messages
                    </div>
                    <div className="md:col-span-2 p-2 border-b md:border-b-0 md:border-r border-teal-200 bg-white">
                      <input
                        type="text"
                        name="advisoryMessages"
                        value={formData.advisoryMessages}
                        onChange={handleInputChange}
                        placeholder="SMS / WhatsApp advisories"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="md:col-span-2 bg-teal-50/90 text-teal-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-teal-200">
                      Training Attendance
                    </div>
                    <div className="md:col-span-2 p-2 bg-white">
                      <input
                        type="text"
                        name="trainingAttendance"
                        value={formData.trainingAttendance}
                        onChange={handleInputChange}
                        placeholder="Workshops / Demos attended"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Row 2: Reminders & Pending Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-2 bg-teal-50/90 text-teal-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-teal-200">
                      Reminders
                    </div>
                    <div className="md:col-span-4 p-2 border-b md:border-b-0 md:border-r border-teal-200 bg-white">
                      <input
                        type="text"
                        name="communicationReminders"
                        value={formData.communicationReminders}
                        onChange={handleInputChange}
                        placeholder="Scheduled reminders"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="md:col-span-2 bg-teal-50/90 text-teal-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-teal-200">
                      Pending Actions
                    </div>
                    <div className="md:col-span-4 p-2 bg-white">
                      <input
                        type="text"
                        name="pendingActions"
                        value={formData.pendingActions}
                        onChange={handleInputChange}
                        placeholder="Next pending follow-up"
                        className="w-full px-3 py-2 text-sm font-semibold text-black bg-white border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Colorful Submit Bar inside Farmer Lifecycle Tab */}
              <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 rounded-2xl border-2 border-emerald-500/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-md">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-white">
                      Ready to save Farmer Lifecycle & Advisory Records?
                    </h4>
                    <p className="text-xs text-emerald-200">
                      Saves all 6 Farmer Lifecycle sections together with your Farmer Data Form & POP record.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    leftIcon={<Save className="w-4 h-4" />}
                    className="bg-white/10 text-white border-white/25 hover:bg-white/20"
                  >
                    Save as Draft
                  </Button>
                  <Button
                    type="submit"
                    variant="golden"
                    size="lg"
                    isLoading={isSubmitting}
                    leftIcon={<Send className="w-4 h-4" />}
                    className="font-black shadow-md"
                  >
                    Submit Digital Form
                  </Button>
                </div>
              </div>

              {/* ===================================================== */}
              {/* 7. Problem and Solution Summary Section (Below Submit)*/}
              {/* Read-Only on Frontend — Edited in Backend Only        */}
              {/* ===================================================== */}
              <div className="rounded-2xl border-2 border-indigo-600 overflow-hidden shadow-sm">
                <div className="bg-gradient-to-r from-indigo-800 via-blue-800 to-emerald-800 text-white px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-amber-300 text-indigo-950 font-black text-sm flex items-center justify-center shrink-0">
                        7
                      </span>
                      <span>Problem and Solution Summary</span>
                    </h3>
                    <p className="text-xs text-indigo-100 mt-0.5">
                      Read-only view of Problem Summary and Solution Summary (managed and edited in Backend only).
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full text-amber-300 shrink-0 self-start sm:self-center">
                    View Only (Backend Managed)
                  </span>
                </div>

                <div className="bg-white text-black">
                  {/* Only the Problem Summary & Solution Summary Row — Read-Only View */}
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-2 bg-indigo-50/90 text-indigo-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-indigo-200">
                      Problem Summary
                    </div>
                    <div className="md:col-span-4 p-3 border-b md:border-b-0 md:border-r border-indigo-200 bg-slate-50/60">
                      <div className="w-full min-h-[76px] px-3 py-2 text-sm font-semibold text-black bg-white border border-indigo-200 rounded-lg whitespace-pre-wrap">
                        {formData.problemSummary ? (
                          formData.problemSummary
                        ) : (
                          <span className="text-neutral-400 font-normal">
                            No Problem Summary entered yet (Editable in Backend only)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2 bg-indigo-50/90 text-indigo-950 p-3 font-bold text-xs flex items-center border-b md:border-b-0 md:border-r border-indigo-200">
                      Solution Summary
                    </div>
                    <div className="md:col-span-4 p-3 bg-slate-50/60">
                      <div className="w-full min-h-[76px] px-3 py-2 text-sm font-semibold text-black bg-white border border-indigo-200 rounded-lg whitespace-pre-wrap">
                        {formData.solutionSummary ? (
                          formData.solutionSummary
                        ) : (
                          <span className="text-neutral-400 font-normal">
                            No Solution Summary entered yet (Editable in Backend only)
                          </span>
                        )}
                      </div>
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
                    cropType: formData.cropType,
                    crop: formData.crop,
                    variety: formData.variety,
                    plantingDate: formData.plantingDate,
                    cropAge: formData.cropAge,
                    cropAcreage: formData.cropAcreage,
                    plantCount: formData.plantCount,
                    spacing: formData.spacing,
                    surveyNumber: formData.surveyNumber,
                  },
                  ...(formData.additionalCrops || []).map((item, idx) => ({
                    id: item.id,
                    index: idx + 2,
                    cropType: item.cropType,
                    crop: item.crop,
                    variety: item.variety,
                    plantingDate: item.plantingDate,
                    cropAge: item.cropAge,
                    cropAcreage: item.cropAcreage,
                    plantCount: item.plantCount,
                    spacing: item.spacing,
                    surveyNumber: item.surveyNumber || formData.surveyNumber,
                  })),
                ];

                const activeCrop =
                  allCropsList.find((c) => c.id === selectedLifecycleCropId) || allCropsList[0];

                const activeCropStages: CropLifecycleData[] = [
                  extractLifecycleFromState(formData),
                  ...(cropExtraLifecycleStagesMap[activeCrop.id] || []),
                ];

                return (
                  <div className="rounded-2xl border-2 border-emerald-700 bg-white shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <ClipboardList className="w-5 h-5 text-amber-300 shrink-0" />
                        <span className="text-sm sm:text-base font-extrabold tracking-wide uppercase">
                          Filled Farmer Lifecycle Details Overview — Crop #{activeCrop.index}:{' '}
                          <strong className="text-amber-300">
                            {activeCrop.crop || `Crop #${activeCrop.index}`}
                          </strong>
                        </span>
                      </div>
                      <span className="text-[11px] font-bold bg-white/15 px-3 py-1 rounded-full text-emerald-100">
                        Showing Crop #{activeCrop.index} of {allCropsList.length} • {activeCropStages.length}{' '}
                        {activeCropStages.length === 1 ? 'Stage' : 'Stages'}
                      </span>
                    </div>

                    <div className="p-4 bg-white">
                      <div className="overflow-x-auto rounded-xl border border-agri-border shadow-inner">
                        <table className="w-full text-left text-xs border-collapse min-w-[1250px]">
                          <thead className="bg-agri-dark text-white font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                              <th className="p-3 border-r border-white/10 w-36">
                                Visit Date &amp; Stage
                              </th>
                              <th className="p-3 border-r border-white/10 w-28">
                                Crop Progress
                              </th>
                              <th className="p-3 border-r border-white/10 w-44">
                                Visit &amp; Advisory
                              </th>
                              <th className="p-3 border-r border-white/10 w-44">
                                Pest &amp; Disease Tracking
                              </th>
                              <th className="p-3 border-r border-white/10 w-36">
                                Irrigation &amp; Weather
                              </th>
                              <th className="p-3 border-r border-white/10 w-40">
                                Soil Health &amp; Fertilizer
                              </th>
                              <th className="p-3 border-r border-white/10 w-44">
                                Harvest &amp; Market Info
                              </th>
                              <th className="p-3 border-r border-white/10 w-40">
                                Communication &amp; Follow-up
                              </th>
                              <th className="p-3 border-r border-white/10 w-40">
                                Yield &amp; Returns
                              </th>
                              <th className="p-3 w-56 bg-emerald-950 text-emerald-300">
                                Crop Problem &amp; Recommended Solution
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-agri-border bg-white">
                            {activeCropStages.map((lc, stageRowIdx) => {
                              const cropRow = activeCrop;
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
                                  className={`transition-colors align-top ${
                                    isCurrent ? 'bg-amber-50/40' : 'hover:bg-slate-50/80'
                                  }`}
                                >
                                  {/* 1. Visit Date & Stage */}
                                  <td className="p-3 border-r border-agri-border/60">
                                    <div className="font-bold text-agri-green-dark text-xs">
                                      {lc.visitDate ||
                                        (stageRowIdx === 0 && cropRow.plantingDate
                                          ? cropRow.plantingDate
                                          : `Stage #${stageRowIdx + 1}`)}
                                    </div>
                                    <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                                      {lc.visitCropStage || 'Stage Not Recorded'}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                      {cropRow.crop || `Crop #${cropRow.index}`}
                                      {cropRow.variety ? ` (${cropRow.variety})` : ''}
                                      {' • '}Stage #{stageRowIdx + 1}
                                    </div>
                                  </td>

                                  {/* 2. Crop Progress */}
                                  <td className="p-3 border-r border-agri-border/60">
                                    {isResolved ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Resolved
                                      </span>
                                    ) : hasVisitData ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
                                        <Clock className="w-3 h-3" />
                                        Active Stage
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-300 text-[10px] font-semibold">
                                        Upcoming
                                      </span>
                                    )}
                                    {lc.nextFollowUpDate && (
                                      <div className="text-[10px] font-mono text-slate-500 mt-1.5">
                                        Next: {lc.nextFollowUpDate}
                                      </div>
                                    )}
                                  </td>

                                  {/* 3. Visit & Advisory */}
                                  <td className="p-3 border-r border-agri-border/60 text-[11px] text-slate-700 leading-relaxed space-y-1">
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
                                  </td>

                                  {/* 4. Pest & Disease Tracking */}
                                  <td className="p-3 border-r border-agri-border/60 text-[11px] text-slate-700 leading-relaxed space-y-1">
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
                                  </td>

                                  {/* 5. Irrigation & Weather */}
                                  <td className="p-3 border-r border-agri-border/60 text-[11px] text-slate-700 leading-relaxed space-y-1">
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
                                  </td>

                                  {/* 6. Soil Health & Fertilizer */}
                                  <td className="p-3 border-r border-agri-border/60 text-[11px] text-slate-700 leading-relaxed space-y-1">
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
                                  </td>

                                  {/* 7. Harvest & Market Info */}
                                  <td className="p-3 border-r border-agri-border/60 text-[11px] text-slate-700 leading-relaxed space-y-1">
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
                                  </td>

                                  {/* 8. Communication & Follow-up */}
                                  <td className="p-3 border-r border-agri-border/60 text-[11px] text-slate-700 leading-relaxed space-y-1">
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
                                  </td>

                                  {/* 9. Yield & Returns */}
                                  <td className="p-3 border-r border-agri-border/60 text-[11px] text-slate-700 leading-relaxed space-y-1">
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
                                  </td>

                                  {/* 10. Crop Problem & Recommended Solution */}
                                  <td className="p-3 bg-emerald-50/40 text-[11px] leading-relaxed space-y-1.5">
                                    <div>
                                      <span className="font-bold text-rose-700">Problem: </span>
                                      <span className="text-slate-700">
                                        {lc.problemSummary || lc.problemSymptoms || '—'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-bold text-emerald-800">Solution: </span>
                                      <span className="text-emerald-950 font-medium">
                                        {lc.solutionSummary ||
                                          lc.visitRecommendations ||
                                          lc.problemActionsTaken ||
                                          '—'}
                                      </span>
                                    </div>
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
            </div>
          </div>
        )}
      </form>

      {/* SUBMISSION SUCCESS MODAL */}
      {submissionSuccess && (
        <div className="fixed inset-0 z-50 bg-agri-dark/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-agri-border space-y-6 animate-scaleIn">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-agri-green flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-agri-dark">
                Registration Successful!
              </h3>
              <p className="text-xs sm:text-sm text-agri-secondary">
                The Farmer Data Form and Package of Practice (POP) has been logged in the Agri-Mart Procurement & Agronomy Registry.
              </p>
            </div>

            <div className="bg-agri-cream rounded-2xl p-4 border border-agri-border/80 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-agri-border/60">
                <span className="text-slate-500">Tracking Reference No:</span>
                <strong className="text-agri-green font-mono font-bold text-sm">
                  {submissionId}
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-agri-border/60">
                <span className="text-slate-500">Farmer Name & ID:</span>
                <strong className="text-agri-dark">
                  {formData.name} ({formData.farmerId})
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-agri-border/60">
                <span className="text-slate-500">District / Taluk / Village:</span>
                <span className="text-agri-dark font-medium">
                  {formData.district}, {formData.taluk}, {formData.villagePanchayat}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-agri-border/60">
                <span className="text-slate-500">Crop & Variety:</span>
                <span className="text-agri-dark font-medium">
                  {formData.crop} ({formData.variety})
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Recommended Solution:</span>
                <span className="text-agri-green-dark font-bold">{formData.solutionType}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="golden"
                className="flex-1"
                onClick={handlePrint}
                leftIcon={<Printer className="w-4 h-4" />}
              >
                Print Slip
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => setSubmissionSuccess(false)}
              >
                Close & View Form
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT STYLESHEET VIEW (Visible ONLY during window.print()) */}
      <div className="hidden print:block font-serif text-black p-4 space-y-4">
        <div className="text-center pb-3 border-b-2 border-black">
          <h1 className="text-xl font-bold uppercase tracking-wider text-black">
            FARMER DATA FORMS &amp; PACKAGE OF PRACTICE (POP)
          </h1>
          <p className="text-xs">AGRI MART MEGA - GREENSHIELD INDUSTRIES PVT LTD</p>
        </div>

        <div className="font-bold text-xs uppercase">1. Farm Profile</div>
        <table className="w-full border-collapse border border-black text-xs">
          <tbody>
            <tr>
              <td className="border border-black p-1.5 font-bold w-1/5">Farmer Name:</td>
              <td className="border border-black p-1.5 w-3/10">{formData.name}</td>
              <td className="border border-black p-1.5 font-bold w-1/5">Farmer ID:</td>
              <td className="border border-black p-1.5 w-3/10">{formData.farmerId}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Mobile Number:</td>
              <td className="border border-black p-1.5">{formData.mobileNumber}</td>
              <td className="border border-black p-1.5 font-bold">Email ID:</td>
              <td className="border border-black p-1.5">{formData.emailId || '-'}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Date:</td>
              <td className="border border-black p-1.5">{formData.date}</td>
              <td className="border border-black p-1.5 font-bold">Survey Number:</td>
              <td className="border border-black p-1.5">{formData.surveyNumber}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Address:</td>
              <td className="border border-black p-1.5" colSpan={3}>{formData.address}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Pin Code:</td>
              <td className="border border-black p-1.5">{formData.pinCode}</td>
              <td className="border border-black p-1.5 font-bold">Village:</td>
              <td className="border border-black p-1.5">{formData.villagePanchayat}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Taluk:</td>
              <td className="border border-black p-1.5">{formData.taluk}</td>
              <td className="border border-black p-1.5 font-bold">District:</td>
              <td className="border border-black p-1.5">{formData.district}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">State:</td>
              <td className="border border-black p-1.5">{formData.state}</td>
              <td className="border border-black p-1.5 font-bold">Language:</td>
              <td className="border border-black p-1.5">{formData.language}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Location:</td>
              <td className="border border-black p-1.5" colSpan={3}>{formData.jobWorkLocation}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Farm Acreage:</td>
              <td className="border border-black p-1.5">{formData.acres}</td>
              <td className="border border-black p-1.5 font-bold">Soil Type:</td>
              <td className="border border-black p-1.5">{formData.soilType}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Irrigation Type:</td>
              <td className="border border-black p-1.5">{formData.irrigationType}</td>
              <td className="border border-black p-1.5 font-bold">Water Source:</td>
              <td className="border border-black p-1.5">{formData.waterSource}</td>
            </tr>
          </tbody>
        </table>

        <div className="font-bold text-xs uppercase">2. Crop Selection</div>
        <table className="w-full border-collapse border border-black text-xs">
          <tbody>
            <tr>
              <td className="border border-black p-1.5 font-bold w-1/5">Type of Crop:</td>
              <td className="border border-black p-1.5 w-3/10">{formData.crop}</td>
              <td className="border border-black p-1.5 font-bold w-1/5">Variety:</td>
              <td className="border border-black p-1.5 w-3/10">{formData.variety}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Planting Date:</td>
              <td className="border border-black p-1.5">{formData.plantingDate}</td>
              <td className="border border-black p-1.5 font-bold">Crop Age:</td>
              <td className="border border-black p-1.5">{formData.cropAge}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Crop Acreage:</td>
              <td className="border border-black p-1.5">{formData.cropAcreage}</td>
              <td className="border border-black p-1.5 font-bold">Plant Count:</td>
              <td className="border border-black p-1.5">{formData.plantCount}</td>
            </tr>
          </tbody>
        </table>

        <div className="font-bold text-xs uppercase">3. Crop Requirements and Services</div>
        <table className="w-full border-collapse border border-black text-xs">
          <tbody>
            <tr>
              <td className="border border-black p-1.5 font-bold w-1/4">Crop Stage:</td>
              <td className="border border-black p-1.5">{formData.cropStage}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Main Requirement:</td>
              <td className="border border-black p-1.5">{formData.mainRequirement}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Problem Type:</td>
              <td className="border border-black p-1.5">{formData.problemType}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Application Method:</td>
              <td className="border border-black p-1.5">{formData.applicationMethod}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Service Type:</td>
              <td className="border border-black p-1.5">{formData.serviceType}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Farm Material:</td>
              <td className="border border-black p-1.5">{formData.farmMaterial}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Equipment:</td>
              <td className="border border-black p-1.5">{formData.equipment}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Harvest Planning:</td>
              <td className="border border-black p-1.5">{formData.harvestPlanning}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Packaging Type:</td>
              <td className="border border-black p-1.5">{formData.packagingType}</td>
            </tr>
          </tbody>
        </table>

        {formData.isPopTableEnabled !== false && (
          <>
            <div className="font-bold text-xs uppercase">
              4. Package of Practice (POP) Activity Schedule Table:
            </div>

            <table className="w-full border-collapse border border-black text-[10px]">
              <thead>
                <tr className="bg-slate-100 font-bold">
                  <th className="border border-black p-1">Sown Date & Stage</th>
                  <th className="border border-black p-1">Soil Preparation</th>
                  <th className="border border-black p-1">Manuring</th>
                  <th className="border border-black p-1">Irrigation</th>
                  <th className="border border-black p-1">Weeding Schedule</th>
                  <th className="border border-black p-1">Spraying Schedule</th>
                  <th className="border border-black p-1">Maintenance</th>
                  <th className="border border-black p-1">Harvesting</th>
                  <th className="border border-black p-1">Problem & Solution</th>
                </tr>
              </thead>
              <tbody>
                {schedule
                  .filter((r) => r.isEnabled !== false)
                  .map((r, i) => (
                    <tr key={i}>
                      <td className="border border-black p-1 font-bold">
                        {r.sownDate} ({r.stageName})
                      </td>
                      <td className="border border-black p-1">{r.soilPrep}</td>
                      <td className="border border-black p-1">{r.manuring}</td>
                      <td className="border border-black p-1">{r.irrigation}</td>
                      <td className="border border-black p-1">{r.weedingSchedule}</td>
                      <td className="border border-black p-1">{r.sprayingSchedule}</td>
                      <td className="border border-black p-1">{r.maintenanceSchedule}</td>
                      <td className="border border-black p-1">{r.harvestingSchedule}</td>
                      <td className="border border-black p-1">
                        <strong>Problem:</strong> {r.keyProblem} <br />
                        <strong>Solution:</strong> {r.recommendedSolution}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}

        <div className="mt-8 pt-6 flex justify-between text-xs">
          <div>Farmer Signature / Thumb Impression: ___________________</div>
          <div>Authorized VLE / FPO Signature: ___________________</div>
        </div>
      </div>

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
        farmerName={formData.name || user?.name || 'Farmer'}
        farmerId={formData.farmerId || user?.id || ''}
        mobileNumber={formData.mobileNumber || user?.mobile || ''}
        totalAcreage={formData.acres || '10'}
        activeCropId={selectedLifecycleCropId}
        activeCropName={
          (selectedLifecycleCropId === 'primary'
            ? formData.crop
            : (formData.additionalCrops || []).find((c) => c.id === selectedLifecycleCropId)?.crop) ||
          formData.crop ||
          'General Crop'
        }
        activeCropAcreage={
          (selectedLifecycleCropId === 'primary'
            ? formData.cropAcreage
            : (formData.additionalCrops || []).find((c) => c.id === selectedLifecycleCropId)?.cropAcreage) ||
          formData.cropAcreage ||
          ''
        }
        activeVariety={
          (selectedLifecycleCropId === 'primary'
            ? formData.variety
            : (formData.additionalCrops || []).find((c) => c.id === selectedLifecycleCropId)?.variety) ||
          formData.variety ||
          ''
        }
        activeCropType={
          (selectedLifecycleCropId === 'primary'
            ? formData.cropType
            : (formData.additionalCrops || []).find((c) => c.id === selectedLifecycleCropId)?.cropType) ||
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
          ...(formData.additionalCrops || []).map((c, i) => ({
            cropId: c.id,
            cropName: c.crop || `Crop #${i + 2}`,
            cropAcreage: c.cropAcreage || '',
            variety: c.variety || '',
            cropType: c.cropType || '',
          })),
        ]}
        currentFieldPhotos={
          selectedLifecycleCropId === 'primary'
            ? String((formData as any)[cameraModalConfig.targetFieldName] || '')
            : String(
                cropLifecycleMap[selectedLifecycleCropId]?.[
                  cameraModalConfig.targetFieldName as keyof CropLifecycleData
                ] ||
                  (formData.additionalCrops || []).find((c) => c.id === selectedLifecycleCropId)?.lifecycleData?.[
                    cameraModalConfig.targetFieldName as keyof CropLifecycleData
                  ] ||
                  (formData as any)[cameraModalConfig.targetFieldName] ||
                  ''
              )
        }
        onPhotoSaved={handlePhotoSavedFromModal}
        onPhotoDeleted={(photoFileName) =>
          handleRemovePhotoFromField(cameraModalConfig.targetFieldName, photoFileName)
        }
      />
    </div>
  );
}
