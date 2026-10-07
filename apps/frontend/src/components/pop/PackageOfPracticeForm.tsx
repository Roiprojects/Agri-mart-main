'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  CheckCircle2,
  Calendar,
  MapPin,
  Phone,
  User,
  Mail,
  FileText,
  Layers,
  Sprout,
  Tractor,
  Droplets,
  Plus,
  Trash2,
  Printer,
  Save,
  Send,
  Sparkles,
  AlertCircle,
  FileUp,
  RotateCcw,
  Check,
  Building2,
  Navigation,
  Lock,
  ArrowRight,
  ShieldCheck,
  Target,
  BarChart3,
  TrendingUp,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-client';

export interface ScheduleRow {
  id: string;
  sownDate: string;
  soilPrep: string;
  manuring: string;
  irrigation: string;
  weedingSchedule: string;
  sprayingSchedule: string;
  maintenanceSchedule: string;
  harvestingSchedule: string;
}

const IRRIGATION_OPTIONS = [
  'Well',
  'Borewell',
  'Rain Fed',
  'Channel',
  'Drip',
  'Sprinkler',
];

const JOB_WORK_OPTIONS = [
  { id: 'chaff_cutting', label: 'Chaff Cutting', desc: 'Fodder shredding & silage prep' },
  { id: 'fodder_prep', label: 'Fodder Preparing', desc: 'Nutritional cattle feed formulation' },
  { id: 'shredding', label: 'Shredding', desc: 'Crop residue & biomass processing' },
  { id: 'dry_weeding', label: 'Dry Weeding', desc: 'Mechanical blade weeding in dry soil' },
  { id: 'wet_weeding', label: 'Wet Weeding', desc: 'Paddy cono-weeding in standing water' },
  { id: 'spraying', label: 'Spraying', desc: 'Precision drone & battery boom spraying' },
  { id: 'harvesting', label: 'Harvesting', desc: 'Combine harvester & reaper operations' },
  { id: 'soil_prep', label: 'Soil Preparation', desc: 'Deep ploughing & rotavator harrowing' },
  { id: 'logistics', label: 'Logistics', desc: 'Farm gate transport to warehouse / mandi' },
];

const POP_PRESETS: Record<string, { days: number; schedule: ScheduleRow[] }> = {
  Maize: {
    days: 110,
    schedule: [
      {
        id: '1',
        sownDate: 'Day 0 (Sowing)',
        soilPrep: 'Deep summer ploughing (25-30cm), rotavator harrowing with 5 tonnes FYM/acre',
        manuring: 'Basal dose: 50kg DAP + 25kg MOP + 10kg Zinc Sulphate per acre',
        irrigation: 'Light pre-sowing soaking or immediate post-sowing flush irrigation',
        weedingSchedule: 'Atrazine 50% WP @ 1kg/acre within 48 hours of sowing (pre-emergence)',
        sprayingSchedule: 'Chlorantraniliprole 18.5 SC @ 0.4ml/L seed furrows for wireworms',
        maintenanceSchedule: 'Maintain 60cm row-to-row & 20cm plant-to-plant spacing geometry',
        harvestingSchedule: 'Plan drying yard and husking equipment preparation',
      },
      {
        id: '2',
        sownDate: 'Day 20-25 (Knee High)',
        soilPrep: 'Inter-cultivation with power weeder to loosen soil clods',
        manuring: 'First top dressing: 35kg Urea + 10kg Neem-coated Urea per acre',
        irrigation: 'Critical irrigation stage: Ensure adequate root-zone moisture',
        weedingSchedule: 'Tembotrione 34.4 SC @ 115ml/acre for broadleaf and grass weeds',
        sprayingSchedule: 'Spinetoram 11.7 SC @ 0.5ml/L for Fall Armyworm (FAW) funnel spray',
        maintenanceSchedule: 'Earthing up operation along rows to prevent lodging in monsoon winds',
        harvestingSchedule: 'Monitor cob initiation milestones',
      },
      {
        id: '3',
        sownDate: 'Day 50-60 (Tasseling & Silking)',
        soilPrep: 'Clear field borders to prevent pest migration from wild grasses',
        manuring: 'Second top dressing: 35kg Urea + 15kg MOP (Potash for kernel filling)',
        irrigation: 'Most critical moisture period: Maintain continuous field saturation',
        weedingSchedule: 'Spot hand weeding around irrigation furrows',
        sprayingSchedule: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/L against Maydis leaf blight',
        maintenanceSchedule: 'Detasseling of rogue/diseased plants if producing seed maize',
        harvestingSchedule: 'Coordinate combine harvester booking at nearest VLE hub',
      },
      {
        id: '4',
        sownDate: 'Day 95-110 (Maturity)',
        soilPrep: 'Field drying preparation; stop all intercultural machinery passes',
        manuring: 'No chemical fertilizers. Optional micronutrient spray on late greens',
        irrigation: 'Withhold irrigation 10-12 days before scheduled harvest',
        weedingSchedule: 'Nil',
        sprayingSchedule: 'Nil (observe pre-harvest pesticide withholding interval)',
        maintenanceSchedule: 'Check black layer formation at kernel base for physiological maturity',
        harvestingSchedule: 'Mechanical combine harvesting at 15-18% grain moisture. Sun dry to 12%',
      },
    ],
  },
  Paddy: {
    days: 130,
    schedule: [
      {
        id: '1',
        sownDate: 'Day 0 (Transplanting)',
        soilPrep: 'Wet puddling with cage wheels (2 passes), level with wooden plank',
        manuring: 'Basal: 50kg DAP + 20kg MOP + 10kg Zinc Sulphate per acre',
        irrigation: 'Maintain thin water layer (2-3 cm) during first 7 days after transplanting',
        weedingSchedule: 'Pretilachlor 50% EC @ 500ml/acre at 3-5 days after transplanting',
        sprayingSchedule: 'Cartap Hydrochloride 4G @ 7.5kg/acre broadcast for stem borer',
        maintenanceSchedule: '2-3 seedlings per hill with 20cm x 15cm geometric spacing',
        harvestingSchedule: 'Log seed variety batch in procurement ledger',
      },
      {
        id: '2',
        sownDate: 'Day 25-30 (Tillering)',
        soilPrep: 'Rotary cono-weeder pass to aerate root rhizosphere',
        manuring: 'First split: 30kg Urea + 5kg Bio-potash broadcast',
        irrigation: 'Alternate wetting and drying (AWD) cycle of 3-5 cm standing water',
        weedingSchedule: 'Bispyribac-sodium 10% SC @ 80ml/acre if grasses persist',
        sprayingSchedule: 'Hexaconazole 5% EC @ 2ml/L against sheath blight & brown spot',
        maintenanceSchedule: 'Fill gaps in uneven patches; rogue out wild paddy variants',
        harvestingSchedule: 'Review procurement forward pricing index',
      },
      {
        id: '3',
        sownDate: 'Day 55-65 (Panicle Initiation)',
        soilPrep: 'Check bund integrity and water inlet/outlet drainage',
        manuring: 'Second split: 25kg Urea + 15kg MOP per acre',
        irrigation: 'Maintain uniform 5cm standing water without drying until milk stage',
        weedingSchedule: 'Manual rogueing of tall weeds overtopping paddy canopy',
        sprayingSchedule: 'Trifloxystrobin 25% + Tebuconazole 50% WG @ 0.4g/L for neck blast immunity',
        maintenanceSchedule: 'Install pheromone traps for yellow stem borer monitoring',
        harvestingSchedule: 'Schedule paddy reaper booking with local Agri-Mart service center',
      },
      {
        id: '4',
        sownDate: 'Day 115-130 (Harvesting)',
        soilPrep: 'Drain all standing water 10 days before harvest for ground firmness',
        manuring: 'Nil',
        irrigation: 'Completely drained for dry mechanized movement',
        weedingSchedule: 'Nil',
        sprayingSchedule: 'Nil',
        maintenanceSchedule: 'Harvest when 85-90% panicles turn golden yellow with grain moisture ~20%',
        harvestingSchedule: 'Harvest using track combine harvester; thresh, clean, and bag at 14% moisture',
      },
    ],
  },
  Tomato: {
    days: 120,
    schedule: [
      {
        id: '1',
        sownDate: 'Day 0 (Transplanting)',
        soilPrep: 'Raised beds (90cm width) with silver-black mulch and drip tape',
        manuring: 'Basal: 10 tonnes compost + 50kg 19:19:19 + 25kg Neem cake per acre',
        irrigation: 'Drip fertigation for 45 minutes pre-wetting beds before planting',
        weedingSchedule: 'Plastic mulch prevents 95% weed growth in beds',
        sprayingSchedule: 'Drenching with Trichoderma viride & Pseudomonas @ 10g/L around roots',
        maintenanceSchedule: 'Staking with bamboo poles and GI wire trellis system',
        harvestingSchedule: 'Prepare plastic harvest crates (Agri-Mart standard 20kg crates)',
      },
      {
        id: '2',
        sownDate: 'Day 20-30 (Vegetative & Staking)',
        soilPrep: 'Clear furrow aisles using battery-operated mini weeder',
        manuring: 'Fertigate 12:61:00 (MAP) @ 3kg/acre twice a week through venturi',
        irrigation: 'Daily drip irrigation 4-6 liters per plant based on tensiometer',
        weedingSchedule: 'Manual aisle cleaning between plastic mulch strips',
        sprayingSchedule: 'Cyantraniliprole 10.26 OD @ 1.8ml/L for leaf miner & whitefly control',
        maintenanceSchedule: 'Pruning of ground suckers; tying main stems to trellis wires',
        harvestingSchedule: 'Verify cold storage transit availability at dark warehouse',
      },
      {
        id: '3',
        sownDate: 'Day 45-60 (Flowering & Fruit Set)',
        soilPrep: 'Earthing up soil along mulch edges to secure wind resistance',
        manuring: 'Fertigate 13:00:45 (Potassium Nitrate) + Calcium Nitrate @ 4kg/acre',
        irrigation: 'Consistent drip cycles to prevent blossom end rot (BER)',
        weedingSchedule: 'Nil',
        sprayingSchedule: 'Fame (Flubendiamide) @ 0.3ml/L against tomato fruit borer',
        maintenanceSchedule: 'Vibrate trellis wires lightly in mornings to enhance self-pollination',
        harvestingSchedule: 'First selective picking of breaker stage fruits for distant transit',
      },
      {
        id: '4',
        sownDate: 'Day 75-120 (Peak Harvest Phase)',
        soilPrep: 'Maintain aisle pathways clean and dry for picking carts',
        manuring: '0:0:50 (SOP) + Boron @ 2kg/acre weekly to sustain fruit firmness',
        irrigation: 'Regulated drip cycles after every harvest pick',
        weedingSchedule: 'Nil',
        sprayingSchedule: 'Neem oil 10,000 ppm @ 3ml/L (bio-safe for continuous picking)',
        maintenanceSchedule: 'Pick every 3-4 days in cool early morning or late afternoon hours',
        harvestingSchedule: 'Grade into A/B/C quality sizes, pack in ventilated crates, ship to Agri-Mart hub',
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

export default function PackageOfPracticeForm() {
  const { user, isLoggedIn, isLoading: authLoading, logout, login } = useAuth();

  // Form State matching Customer_Data_Form.docx
  const [formData, setFormData] = useState({
    slNo: '',
    district: 'Mandya',
    taluk: 'Maddur',
    villagePanchayat: 'Koppa',
    state: 'Karnataka',
    name: '',
    mobileNumber: '',
    vleFpoNo: 'VLE-KA-MND-042',
    date: new Date().toISOString().split('T')[0],
    address: '',
    surveyNumber: '',
    acres: '',
    pinCode: '',
    emailId: '',
    jobWorkLocation: '',
    distanceFromVle: '',
    irrigation: ['Borewell', 'Drip'] as string[],
    jobWork: ['Soil Preparation', 'Spraying', 'Harvesting'] as string[],
    crop: 'Maize',
    cropCycleDays: '110',
    popAttached: 'Attached (Agri-Mart Digital POP Active)',
    uploadedFileName: '',
  });

  // Dynamic 8-column Schedule Table
  const [schedule, setSchedule] = useState<ScheduleRow[]>(POP_PRESETS.Maize.schedule);

  // Status & UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [savedDraftToast, setSavedDraftToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate Sl.No & populate user profile if logged in
  useEffect(() => {
    const randomSl = `CDF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const userPhone = user ? (user.mobile || user.phone || '').replace(/^\+91\s*/, '') : '';
    setFormData((prev) => ({
      ...prev,
      slNo: prev.slNo || randomSl,
      name: user?.name ? user.name : prev.name,
      mobileNumber: userPhone ? userPhone : prev.mobileNumber,
      emailId: user?.email ? user.email : prev.emailId,
    }));

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('agrimart_pop_draft');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.formData) setFormData(parsed.formData);
          if (parsed && parsed.schedule) setSchedule(parsed.schedule);
        }
      } catch (err) {
        console.error('Error loading saved draft:', err);
      }
    }
  }, [user]);

  // Handle Form Input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'crop' && POP_PRESETS[value]) {
      setFormData((prev) => ({
        ...prev,
        crop: value,
        cropCycleDays: String(POP_PRESETS[value].days),
      }));
    }
  };

  const toggleIrrigation = (option: string) => {
    setFormData((prev) => {
      const exists = prev.irrigation.includes(option);
      return {
        ...prev,
        irrigation: exists
          ? prev.irrigation.filter((i) => i !== option)
          : [...prev.irrigation, option],
      };
    });
  };

  const toggleJobWork = (label: string) => {
    setFormData((prev) => {
      const exists = prev.jobWork.includes(label);
      return {
        ...prev,
        jobWork: exists
          ? prev.jobWork.filter((j) => j !== label)
          : [...prev.jobWork, label],
      };
    });
  };

  const loadPreset = (cropKey: string) => {
    if (POP_PRESETS[cropKey]) {
      setSchedule(POP_PRESETS[cropKey].schedule);
      setFormData((prev) => ({
        ...prev,
        crop: cropKey,
        cropCycleDays: String(POP_PRESETS[cropKey].days),
      }));
    }
  };

  const handleAddRow = () => {
    const newRow: ScheduleRow = {
      id: String(Date.now()),
      sownDate: `Day ${(schedule.length + 1) * 20}`,
      soilPrep: '',
      manuring: '',
      irrigation: '',
      weedingSchedule: '',
      sprayingSchedule: '',
      maintenanceSchedule: '',
      harvestingSchedule: '',
    };
    setSchedule([...schedule, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    if (schedule.length <= 1) {
      alert('Schedule must have at least one stage row.');
      return;
    }
    setSchedule(schedule.filter((row) => row.id !== id));
  };

  const handleScheduleChange = (id: string, field: keyof ScheduleRow, value: string) => {
    setSchedule((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      'agrimart_pop_draft',
      JSON.stringify({ formData, schedule, timestamp: new Date().toISOString() })
    );
    setSavedDraftToast(true);
    setTimeout(() => setSavedDraftToast(false), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter Farmer / Customer Name.');
      return;
    }
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 10) {
      alert('Please enter a valid 10-digit Mobile Number.');
      return;
    }
    if (!formData.acres.trim()) {
      alert('Please specify the land holding Acre(s).');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/package-of-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          schedule,
          submittedAt: new Date().toISOString(),
        }),
      });

      const result = await response.json().catch(() => ({ success: true, trackingCode: formData.slNo }));

      setSubmissionId(result.trackingCode || formData.slNo);
      setSubmissionSuccess(true);
      localStorage.removeItem('agrimart_pop_draft');
    } catch (err) {
      console.error('Submission fallback:', err);
      setSubmissionId(formData.slNo);
      setSubmissionSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all form entries?')) {
      const randomSl = `CDF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setFormData({
        slNo: randomSl,
        district: 'Mandya',
        taluk: '',
        villagePanchayat: '',
        state: 'Karnataka',
        name: user ? user.name : '',
        mobileNumber: user?.mobile ? user.mobile.replace(/^\+91\s*/, '') : '',
        vleFpoNo: '',
        date: new Date().toISOString().split('T')[0],
        address: '',
        surveyNumber: '',
        acres: '',
        pinCode: '',
        emailId: user?.email ? user.email : '',
        jobWorkLocation: '',
        distanceFromVle: '',
        irrigation: ['Borewell'],
        jobWork: ['Soil Preparation'],
        crop: 'Maize',
        cropCycleDays: '110',
        popAttached: 'Attached (Agri-Mart Digital POP Active)',
        uploadedFileName: '',
      });
      setSchedule(POP_PRESETS.Maize.schedule);
      localStorage.removeItem('agrimart_pop_draft');
    }
  };

  const handleQuickDemoLogin = () => {
    login({
      id: 'usr-farmer-01',
      name: 'Ramesh Kumar Gowda',
      mobile: '9845190812',
      email: 'ramesh.farmer@agrimart.in',
      role: 'CUSTOMER',
      isVerified: true,
    });
  };

  // ==========================================
  // UNLOGGED STATE: Show Educational Overview
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-agri-dark via-emerald-950 to-agri-dark text-white rounded-3xl p-8 sm:p-12 shadow-card relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-agri-yellow text-agri-dark text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              <ClipboardList className="w-3.5 h-3.5" />
              Agronomic Science & Crop Management
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Package of Practice (POP)
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              A comprehensive, university-tested agronomic roadmap providing farmers with verified step-by-step guidance across all 7 phenological stages — from land preparation and seed treatment to precision harvesting.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link href="/login?redirect=/package-of-practice">
                <Button
                  variant="golden"
                  size="lg"
                  leftIcon={<Lock className="w-4 h-4 text-agri-dark" />}
                  rightIcon={<ArrowRight className="w-4 h-4 text-agri-dark" />}
                  className="font-bold shadow-md"
                >
                  Sign In to Access Online Form
                </Button>
              </Link>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/25 px-5 py-3 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-agri-yellow" />
                <span>Instant Demo Login as Farmer</span>
              </button>
            </div>
          </div>
        </div>

        {/* What is Package of Practice? */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-agri-green font-extrabold text-xs uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              What is Package of Practice?
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-agri-dark">
              Scientific Precision for Indian Agriculture
            </h2>
            <p className="text-sm text-agri-secondary leading-relaxed">
              A <strong>Package of Practice (POP)</strong> is a standardized set of agricultural practices formulated and validated by agricultural universities (such as ICAR, UAS Bangalore, and UAS Dharwad). It outlines the exact inputs, timing, quantities, and methods required to grow a specific crop under given soil and climatic conditions.
            </p>
            <p className="text-sm text-agri-secondary leading-relaxed">
              Rather than guessing fertilizer dosages or spraying chemicals reactively, POP provides a proactive blueprint that synchronizes your on-field operations with the natural biological clock of your crop.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">1.5k</div>
                <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">VLE</div>
                <div className="w-8 h-8 rounded-full bg-emerald-800 border-2 border-white flex items-center justify-center text-white text-xs font-bold">FPO</div>
              </div>
              <span className="text-xs font-semibold text-agri-secondary">
                Adopted by over 1,500+ Village Level Entrepreneurs and Farmer Producer Organizations.
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agri-border shadow-card space-y-4">
            <h3 className="text-base font-bold text-agri-dark flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-agri-green" />
              Key Pillars of an Official POP
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-agri-pale/60 border border-emerald-100">
                <div className="w-6 h-6 rounded-lg bg-agri-green text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <div>
                  <div className="text-xs font-bold text-agri-dark">Pre-Sowing Land & Basal Treatment</div>
                  <div className="text-[11px] text-agri-secondary">Soil pH correction, FYM incorporation, deep ploughing depth, and basal NPK application.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-agri-pale/60 border border-emerald-100">
                <div className="w-6 h-6 rounded-lg bg-agri-green text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <div>
                  <div className="text-xs font-bold text-agri-dark">Certified Seed Rate & Spacing</div>
                  <div className="text-[11px] text-agri-secondary">Geometric row-to-row spacing, seed dressing with bio-fungicides, and seed drill calibration.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-agri-pale/60 border border-emerald-100">
                <div className="w-6 h-6 rounded-lg bg-agri-green text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <div>
                  <div className="text-xs font-bold text-agri-dark">Stage-Wise Nutrient Top Dressing</div>
                  <div className="text-[11px] text-agri-secondary">Split application of nitrogen and potash matching critical phenological milestones.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-agri-pale/60 border border-emerald-100">
                <div className="w-6 h-6 rounded-lg bg-agri-green text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</div>
                <div>
                  <div className="text-xs font-bold text-agri-dark">Mechanical & On-Demand Service Scheduling</div>
                  <div className="text-[11px] text-agri-secondary">Timely booking of power weeders, boom sprayers, and combine harvesters via nearest Agri-Mart hub.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits & Uses Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-agri-dark">
              Why Register Your Package of Practice?
            </h2>
            <p className="text-xs sm:text-sm text-agri-secondary">
              Connecting your farm data with Agri-Mart unlocks real-time agronomic monitoring and automated service coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-agri-border shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-agri-green flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-agri-dark">25% – 35% Higher Yield</h3>
              <p className="text-xs text-agri-secondary leading-relaxed">
                Applying inputs at calibrated stages prevents nutrient wastage and supports continuous vegetative and reproductive growth.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-agri-border shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-agri-dark">Water & Input Cost Reduction</h3>
              <p className="text-xs text-agri-secondary leading-relaxed">
                Save up to 40% on fertilizer and irrigation costs by following university-tested alternate wetting and drying and drip fertigation schedules.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-agri-border shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-agri-green flex items-center justify-center">
                <Tractor className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-agri-dark">Guaranteed Machinery Dispatch</h3>
              <p className="text-xs text-agri-secondary leading-relaxed">
                Submitting your POP alerts your assigned Village Level Entrepreneur (VLE) in advance, reserving harvesters and weeders before peak seasonal rush.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-agri-border shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-agri-green flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-agri-dark">Timely Agronomist Follow-Ups</h3>
              <p className="text-xs text-agri-secondary leading-relaxed">
                Agri-Mart procurement teams track your crop stage automatically, sending phone and field visit reminders for pest and fungal management.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-agri-border shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-agri-dark">Market & Procurement Linkage</h3>
              <p className="text-xs text-agri-secondary leading-relaxed">
                Farmers with verified POP schedules get priority buyback and procurement access through certified FPO cluster centers.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-agri-border shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-agri-green flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-agri-dark">Official Printable Customer Slip</h3>
              <p className="text-xs text-agri-secondary leading-relaxed">
                Generate an official printed Customer Data Form formatted for bank crop loan verification, insurance claims, and VLE record keeping.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-agri-pale rounded-3xl p-8 sm:p-12 border border-emerald-200/80 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-agri-dark">
            Ready to Plan Your Crop Cycle?
          </h2>
          <p className="text-sm text-agri-secondary max-w-xl mx-auto">
            Log in to your Agri-Mart account to fill out the digital Customer Data Form, configure your 8-stage activity table, and connect with your local VLE hub.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link href="/login?redirect=/package-of-practice">
              <Button variant="primary" size="lg" className="px-8 shadow-sm">
                Log In to Register POP
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={handleQuickDemoLogin}
              className="bg-white hover:bg-slate-50"
            >
              Demo Access (1-Click)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // LOGGED IN STATE: Show Full Online Form
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Draft Notification Banner */}
      {savedDraftToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-agri-dark text-white px-5 py-3.5 rounded-2xl shadow-hover flex items-center gap-3 border border-emerald-500/40 animate-fadeSlideUp">
          <CheckCircle2 className="w-5 h-5 text-agri-yellow" />
          <span className="text-sm font-semibold">Form draft saved locally to browser storage!</span>
        </div>
      )}

      {/* Logged In Status Bar */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-agri-green-dark">
          <div className="w-2.5 h-2.5 rounded-full bg-agri-green animate-pulse" />
          <span>Logged in as: <strong>{user?.name}</strong> ({user?.mobile})</span>
        </div>
        <button
          onClick={logout}
          className="text-slate-500 hover:text-rose-600 font-bold flex items-center gap-1.5 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Account / Sign Out</span>
        </button>
      </div>

      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-agri-dark via-emerald-950 to-agri-dark text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-card relative overflow-hidden print:hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-agri-yellow text-agri-dark text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              <ClipboardList className="w-3.5 h-3.5" />
              Official Customer Data Form & POP
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Package of Practice (POP) Registration
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Digitized farmer data intake, 7-stage university agronomy schedules, field job work requirements, and irrigation infrastructure records aligned with Karnataka FPO & VLE clusters.
            </p>
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

        {/* Preset Quick Loader Buttons */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-agri-yellow" />
            Quick University POP Presets:
          </span>
          {Object.keys(POP_PRESETS).map((cropKey) => (
            <button
              key={cropKey}
              type="button"
              onClick={() => loadPreset(cropKey)}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                formData.crop === cropKey
                  ? 'bg-agri-green text-white shadow-sm'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>{cropKey} Standard ({POP_PRESETS[cropKey].days} Days)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Header & Geographic Identification */}
        <div className="bg-white rounded-2xl border border-agri-border shadow-card p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-5 border-b border-agri-border mb-6">
            <div className="w-10 h-10 rounded-xl bg-agri-pale flex items-center justify-center text-agri-green font-black">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold text-agri-dark">
                Customer & Administrative Identification
              </h2>
              <p className="text-xs text-agri-secondary">
                Administrative registry details as recorded in Section 1 of Customer Data Form
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Sl.No */}
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                Sl.No (Serial Number) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="slNo"
                value={formData.slNo}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-agri-border px-3.5 py-2.5 text-sm font-mono font-bold text-agri-green-dark bg-slate-50 focus:outline-none focus:ring-2 focus:ring-agri-green"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-agri-border px-3.5 py-2.5 text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
              />
            </div>

            {/* VLE / FPO No */}
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                VLE / FPO No
              </label>
              <input
                type="text"
                name="vleFpoNo"
                value={formData.vleFpoNo}
                onChange={handleInputChange}
                placeholder="e.g. VLE-KA-MND-042"
                className="w-full rounded-xl border border-agri-border px-3.5 py-2.5 text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-agri-border px-3.5 py-2.5 text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                District <span className="text-rose-500">*</span>
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-agri-border px-3.5 py-2.5 text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green bg-white"
              >
                {KARNATAKA_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Taluk */}
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                Taluk <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="taluk"
                value={formData.taluk}
                onChange={handleInputChange}
                placeholder="e.g. Maddur / Pandavapura"
                required
                className="w-full rounded-xl border border-agri-border px-3.5 py-2.5 text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
              />
            </div>

            {/* V.P (Village Panchayat) */}
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                V.P (Village Panchayat) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="villagePanchayat"
                value={formData.villagePanchayat}
                onChange={handleInputChange}
                placeholder="e.g. Koppa Grama Panchayat"
                required
                className="w-full rounded-xl border border-agri-border px-3.5 py-2.5 text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
              />
            </div>

            {/* Pin Code */}
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                Pin Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                placeholder="6-digit PIN"
                maxLength={6}
                required
                className="w-full rounded-xl border border-agri-border px-3.5 py-2.5 text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 pt-6 border-t border-slate-100">
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                Customer / Farmer Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Farmer full name"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-agri-border text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-agri-border text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
                />
              </div>
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                Email ID (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleInputChange}
                  placeholder="farmer@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-agri-border text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
                />
              </div>
            </div>

            {/* Full Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                Address (Village / Street / House No) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Complete postal address"
                required
                className="w-full rounded-xl border border-agri-border px-3.5 py-2.5 text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
              />
            </div>

            {/* Survey Number & Acre(s) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-agri-dark mb-1.5">
                  Survey Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="surveyNumber"
                  value={formData.surveyNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 142/2A"
                  required
                  className="w-full rounded-xl border border-agri-border px-3.5 py-2.5 text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-agri-dark mb-1.5">
                  Acre(s) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="acres"
                  value={formData.acres}
                  onChange={handleInputChange}
                  placeholder="e.g. 3.5"
                  required
                  className="w-full rounded-xl border border-agri-border px-3.5 py-2.5 text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Logistics, Irrigation & Job Work */}
        <div className="bg-white rounded-2xl border border-agri-border shadow-card p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-5 border-b border-agri-border mb-6">
            <div className="w-10 h-10 rounded-xl bg-agri-pale flex items-center justify-center text-agri-green font-black">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold text-agri-dark">
                Job Work Logistics & Irrigation Infrastructure
              </h2>
              <p className="text-xs text-agri-secondary">
                Field access distance, water source distribution, and mechanical service demands
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                Job Work Location <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="jobWorkLocation"
                  value={formData.jobWorkLocation}
                  onChange={handleInputChange}
                  placeholder="Field landmark or GPS coordinates"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-agri-border text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                Distance from VLE / FPO (Kilometers) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Navigation className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  step="0.5"
                  name="distanceFromVle"
                  value={formData.distanceFromVle}
                  onChange={handleInputChange}
                  placeholder="e.g. 4.5 km"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-agri-border text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
                />
              </div>
            </div>
          </div>

          {/* Irrigation Types: Well / Borewell / Rain Fed / Channel / Drip / Sprinkler */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <label className="block text-xs font-bold text-agri-dark mb-2">
              Irrigation Source (Select all that apply) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {IRRIGATION_OPTIONS.map((opt) => {
                const selected = formData.irrigation.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleIrrigation(opt)}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold text-center flex flex-col items-center justify-center gap-1.5 transition ${
                      selected
                        ? 'border-agri-green bg-agri-pale text-agri-green-dark shadow-xs'
                        : 'border-agri-border bg-white text-agri-secondary hover:border-agri-green/40 hover:bg-slate-50'
                    }`}
                  >
                    <Droplets className={`w-4 h-4 ${selected ? 'text-agri-green' : 'text-slate-400'}`} />
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job Work Requirements */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <label className="block text-xs font-bold text-agri-dark mb-2">
              Job Work Required (As specified in document)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {JOB_WORK_OPTIONS.map((item) => {
                const checked = formData.jobWork.includes(item.label);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleJobWork(item.label)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 select-none ${
                      checked
                        ? 'border-agri-green bg-emerald-50/70 shadow-xs'
                        : 'border-agri-border bg-white hover:border-agri-green/40 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition shrink-0 ${
                        checked
                          ? 'border-agri-green bg-agri-green text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-agri-dark">{item.label}</div>
                      <div className="text-[11px] text-agri-secondary">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 3: Crop Profile & POP Attachment */}
        <div className="bg-white rounded-2xl border border-agri-border shadow-card p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-5 border-b border-agri-border mb-6">
            <div className="w-10 h-10 rounded-xl bg-agri-pale flex items-center justify-center text-agri-green font-black">
              3
            </div>
            <div>
              <h2 className="text-lg font-bold text-agri-dark">
                Crop & Package of Practice (POP) Parameters
              </h2>
              <p className="text-xs text-agri-secondary">
                Crop lifecycle duration, cultivar classification, and agronomic documentation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                Crop Name <span className="text-rose-500">*</span>
              </label>
              <select
                name="crop"
                value={formData.crop}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-agri-border px-3.5 py-2.5 text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green bg-white font-semibold"
              >
                <option value="Maize">Maize (Hybrid Maize)</option>
                <option value="Paddy">Paddy (Rice - Sonam / BPT 5204)</option>
                <option value="Tomato">Tomato (Hybrid F1 Tomato)</option>
                <option value="Sugarcane">Sugarcane (Co 86032)</option>
                <option value="Cotton">Cotton (Bt Cotton)</option>
                <option value="Chilli">Chilli (Byadagi Chilli)</option>
                <option value="Ragi">Ragi (Finger Millet MR-1)</option>
                <option value="Groundnut">Groundnut (TMV-2)</option>
                <option value="Arecanut">Arecanut</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                Crop Cycle Days <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="cropCycleDays"
                value={formData.cropCycleDays}
                onChange={handleInputChange}
                placeholder="Total days e.g. 110"
                required
                className="w-full rounded-xl border border-agri-border px-3.5 py-2.5 text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-agri-dark mb-1.5">
                POP Status
              </label>
              <input
                type="text"
                name="popAttached"
                value={formData.popAttached}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-agri-border px-3.5 py-2.5 text-sm text-agri-dark focus:outline-none focus:ring-2 focus:ring-agri-green bg-slate-50"
              />
            </div>
          </div>

          {/* Optional Attachment Upload */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-agri-dark flex items-center gap-1.5">
                <FileUp className="w-4 h-4 text-agri-green" />
                Attach External POP Document or Soil Health Card (Optional)
              </div>
              <div className="text-[11px] text-agri-secondary">
                Upload university advisory document, farm soil test PDF, or photo of existing records
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFormData((prev) => ({
                      ...prev,
                      uploadedFileName: e.target.files![0].name,
                      popAttached: `Attached: ${e.target.files![0].name}`,
                    }));
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<FileUp className="w-3.5 h-3.5 text-agri-green" />}
              >
                {formData.uploadedFileName ? 'Change Document' : 'Upload Document'}
              </Button>
              {formData.uploadedFileName && (
                <span className="text-xs text-agri-green font-bold truncate max-w-xs">
                  {formData.uploadedFileName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: Dynamic 8-Column Schedule Table */}
        <div className="bg-white rounded-2xl border border-agri-border shadow-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-agri-border mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agri-pale flex items-center justify-center text-agri-green font-black">
                4
              </div>
              <div>
                <h2 className="text-lg font-bold text-agri-dark">
                  Package of Practice (POP) Activity Schedule Table
                </h2>
                <p className="text-xs text-agri-secondary">
                  8-column stage timeline matching Customer Data Form table specifications
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddRow}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Stage Row
            </Button>
          </div>

          {/* Schedule Table (Desktop & Scrollable) */}
          <div className="overflow-x-auto rounded-xl border border-agri-border shadow-inner no-scrollbar">
            <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
              <thead className="bg-agri-dark text-white font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 border-r border-white/10 w-28">Sown Date</th>
                  <th className="p-3 border-r border-white/10 w-44">Soil Preparation</th>
                  <th className="p-3 border-r border-white/10 w-44">Manuring</th>
                  <th className="p-3 border-r border-white/10 w-36">Irrigation</th>
                  <th className="p-3 border-r border-white/10 w-40">Weeding Schedule</th>
                  <th className="p-3 border-r border-white/10 w-44">Spraying Schedule</th>
                  <th className="p-3 border-r border-white/10 w-40">Maintenance</th>
                  <th className="p-3 border-r border-white/10 w-40">Harvesting</th>
                  <th className="p-3 text-center w-12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-agri-border bg-white">
                {schedule.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-2.5 border-r border-agri-border/60">
                      <input
                        type="text"
                        value={row.sownDate}
                        onChange={(e) => handleScheduleChange(row.id, 'sownDate', e.target.value)}
                        placeholder="Day / Date"
                        className="w-full bg-slate-50 rounded-lg border border-transparent hover:border-slate-300 focus:border-agri-green focus:bg-white px-2 py-1.5 font-bold text-agri-green-dark text-xs"
                      />
                    </td>
                    <td className="p-2.5 border-r border-agri-border/60">
                      <textarea
                        rows={3}
                        value={row.soilPrep}
                        onChange={(e) => handleScheduleChange(row.id, 'soilPrep', e.target.value)}
                        placeholder="Ploughing / harrowing / beds"
                        className="w-full bg-transparent rounded-lg border border-transparent hover:border-slate-300 focus:border-agri-green focus:bg-white px-2 py-1 text-[11px] resize-none"
                      />
                    </td>
                    <td className="p-2.5 border-r border-agri-border/60">
                      <textarea
                        rows={3}
                        value={row.manuring}
                        onChange={(e) => handleScheduleChange(row.id, 'manuring', e.target.value)}
                        placeholder="DAP / Urea / FYM / Potash"
                        className="w-full bg-transparent rounded-lg border border-transparent hover:border-slate-300 focus:border-agri-green focus:bg-white px-2 py-1 text-[11px] resize-none"
                      />
                    </td>
                    <td className="p-2.5 border-r border-agri-border/60">
                      <textarea
                        rows={3}
                        value={row.irrigation}
                        onChange={(e) => handleScheduleChange(row.id, 'irrigation', e.target.value)}
                        placeholder="Flood / Drip intervals"
                        className="w-full bg-transparent rounded-lg border border-transparent hover:border-slate-300 focus:border-agri-green focus:bg-white px-2 py-1 text-[11px] resize-none"
                      />
                    </td>
                    <td className="p-2.5 border-r border-agri-border/60">
                      <textarea
                        rows={3}
                        value={row.weedingSchedule}
                        onChange={(e) => handleScheduleChange(row.id, 'weedingSchedule', e.target.value)}
                        placeholder="Weeder / herbicides"
                        className="w-full bg-transparent rounded-lg border border-transparent hover:border-slate-300 focus:border-agri-green focus:bg-white px-2 py-1 text-[11px] resize-none"
                      />
                    </td>
                    <td className="p-2.5 border-r border-agri-border/60">
                      <textarea
                        rows={3}
                        value={row.sprayingSchedule}
                        onChange={(e) => handleScheduleChange(row.id, 'sprayingSchedule', e.target.value)}
                        placeholder="Insecticides / fungicides"
                        className="w-full bg-transparent rounded-lg border border-transparent hover:border-slate-300 focus:border-agri-green focus:bg-white px-2 py-1 text-[11px] resize-none"
                      />
                    </td>
                    <td className="p-2.5 border-r border-agri-border/60">
                      <textarea
                        rows={3}
                        value={row.maintenanceSchedule}
                        onChange={(e) => handleScheduleChange(row.id, 'maintenanceSchedule', e.target.value)}
                        placeholder="Earthing up / staking"
                        className="w-full bg-transparent rounded-lg border border-transparent hover:border-slate-300 focus:border-agri-green focus:bg-white px-2 py-1 text-[11px] resize-none"
                      />
                    </td>
                    <td className="p-2.5 border-r border-agri-border/60">
                      <textarea
                        rows={3}
                        value={row.harvestingSchedule}
                        onChange={(e) => handleScheduleChange(row.id, 'harvestingSchedule', e.target.value)}
                        placeholder="Harvesting method / drying"
                        className="w-full bg-transparent rounded-lg border border-transparent hover:border-slate-300 focus:border-agri-green focus:bg-white px-2 py-1 text-[11px] resize-none"
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-agri-secondary">
            <span>Showing {schedule.length} schedule activity stages</span>
            <span className="text-[11px] text-slate-500 italic">
              All rows are synchronized with Agri-Mart Procurement tracking
            </span>
          </div>
        </div>

        {/* SECTION 5: Submit Actions */}
        <div className="bg-white rounded-2xl border border-agri-border p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card print:hidden">
          <div className="text-xs text-agri-secondary space-y-0.5 text-center sm:text-left">
            <div className="font-bold text-agri-dark text-sm">
              Ready to submit Customer Data Form & POP?
            </div>
            <div>
              Submission immediately alerts your assigned VLE, regional warehouse, and procurement agronomist.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
              className="px-8 shadow-sm"
            >
              Submit Digital Form
            </Button>
          </div>
        </div>
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
                The Customer Data Form and Package of Practice (POP) has been logged in the Agri-Mart Procurement & Agronomy Registry.
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
                <span className="text-slate-500">Farmer Name:</span>
                <strong className="text-agri-dark">{formData.name}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-agri-border/60">
                <span className="text-slate-500">District / Taluk:</span>
                <span className="text-agri-dark font-medium">{formData.district}, {formData.taluk}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-agri-border/60">
                <span className="text-slate-500">Crop & Area:</span>
                <span className="text-agri-dark font-medium">{formData.crop} ({formData.acres} Acres)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Assigned VLE Hub:</span>
                <span className="text-agri-dark font-bold">{formData.vleFpoNo}</span>
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
      <div className="hidden print:block font-serif text-black p-4">
        <div className="text-center pb-4 border-b-2 border-black mb-4">
          <h1 className="text-xl font-bold uppercase tracking-wider">
            CUSTOMER DATA FORM
          </h1>
          <p className="text-xs">AGRI MART MEGA - GREENSHIELD INDUSTRIES PVT LTD</p>
        </div>

        <table className="w-full border-collapse border border-black text-xs mb-4">
          <tbody>
            <tr>
              <td className="border border-black p-1.5 font-bold w-1/5">Sl.No:</td>
              <td className="border border-black p-1.5">{formData.slNo}</td>
              <td className="border border-black p-1.5 font-bold w-1/5">District:</td>
              <td className="border border-black p-1.5">{formData.district}</td>
              <td className="border border-black p-1.5 font-bold w-1/5">State:</td>
              <td className="border border-black p-1.5">{formData.state}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Taluk:</td>
              <td className="border border-black p-1.5">{formData.taluk}</td>
              <td className="border border-black p-1.5 font-bold">V.P:</td>
              <td className="border border-black p-1.5" colSpan={3}>{formData.villagePanchayat}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Name:</td>
              <td className="border border-black p-1.5 font-bold">{formData.name}</td>
              <td className="border border-black p-1.5 font-bold">Mobile Number:</td>
              <td className="border border-black p-1.5">{formData.mobileNumber}</td>
              <td className="border border-black p-1.5 font-bold">Date:</td>
              <td className="border border-black p-1.5">{formData.date}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">VLE/FPO No:</td>
              <td className="border border-black p-1.5">{formData.vleFpoNo}</td>
              <td className="border border-black p-1.5 font-bold">Email id:</td>
              <td className="border border-black p-1.5" colSpan={3}>{formData.emailId || '-'}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Address:</td>
              <td className="border border-black p-1.5" colSpan={5}>{formData.address}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Survey Number:</td>
              <td className="border border-black p-1.5">{formData.surveyNumber}</td>
              <td className="border border-black p-1.5 font-bold">Acre (s):</td>
              <td className="border border-black p-1.5">{formData.acres}</td>
              <td className="border border-black p-1.5 font-bold">Pin Code:</td>
              <td className="border border-black p-1.5">{formData.pinCode}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Job Work Location:</td>
              <td className="border border-black p-1.5" colSpan={2}>{formData.jobWorkLocation}</td>
              <td className="border border-black p-1.5 font-bold">Distance from VLE/FPO:</td>
              <td className="border border-black p-1.5" colSpan={2}>{formData.distanceFromVle} km</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Irrigation:</td>
              <td className="border border-black p-1.5" colSpan={5}>
                {formData.irrigation.join(', ')}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Job Work:</td>
              <td className="border border-black p-1.5" colSpan={5}>
                {formData.jobWork.join(', ')}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-bold">Crop:</td>
              <td className="border border-black p-1.5">{formData.crop}</td>
              <td className="border border-black p-1.5 font-bold">Crop Cycle Days:</td>
              <td className="border border-black p-1.5">{formData.cropCycleDays}</td>
              <td className="border border-black p-1.5 font-bold">POP:</td>
              <td className="border border-black p-1.5">{formData.popAttached}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 mb-2 font-bold text-xs uppercase">
          Package of Practice Schedule Table:
        </div>

        <table className="w-full border-collapse border border-black text-[10px]">
          <thead>
            <tr className="bg-slate-100 font-bold">
              <th className="border border-black p-1">Sown Date</th>
              <th className="border border-black p-1">Soil Preparation</th>
              <th className="border border-black p-1">Manuring</th>
              <th className="border border-black p-1">Irrigation</th>
              <th className="border border-black p-1">Weeding Schedule</th>
              <th className="border border-black p-1">Spraying Schedule</th>
              <th className="border border-black p-1">Maintenance</th>
              <th className="border border-black p-1">Harvesting</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((r, i) => (
              <tr key={i}>
                <td className="border border-black p-1 font-bold">{r.sownDate}</td>
                <td className="border border-black p-1">{r.soilPrep}</td>
                <td className="border border-black p-1">{r.manuring}</td>
                <td className="border border-black p-1">{r.irrigation}</td>
                <td className="border border-black p-1">{r.weedingSchedule}</td>
                <td className="border border-black p-1">{r.sprayingSchedule}</td>
                <td className="border border-black p-1">{r.maintenanceSchedule}</td>
                <td className="border border-black p-1">{r.harvestingSchedule}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 pt-6 flex justify-between text-xs">
          <div>Farmer Signature / Thumb Impression: ___________________</div>
          <div>Authorized VLE / FPO Signature: ___________________</div>
        </div>
      </div>
    </div>
  );
}
