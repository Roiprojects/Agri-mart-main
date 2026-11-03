import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { SEED_PRODUCTS } from '@/lib/seed-data';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sprout,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tractor,
  Droplets,
  Package,
} from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import CropStagesExplorer from '@/components/crop-guidance/CropStagesExplorer';
import CropSpecificMasterGuides from '@/components/crop-guidance/CropSpecificMasterGuides';
import {
  DEFAULT_CROP_GUIDANCE_PAGE_CONTENT,
  DEFAULT_CROP_MASTER_GUIDES,
} from '@/lib/crop-guidance-defaults';
import { getFrontendApiCache } from '@/lib/api-client';

export const metadata: Metadata = {
  title: 'Crop Guidance & 7-Stage Package of Practices | AGRI MART MEGA',
  description:
    'Comprehensive agronomist-verified 7-stage crop management guide for Karnataka farmers. Soil preparation, certified sowing, balanced NPK fertilizing, precision irrigation, weed protection, harvesting, and safe storage.',
  alternates: {
    canonical: `https://www.${SITE_CONFIG.domain}/crop-guidance`,
  },
  openGraph: {
    title: 'Crop Guidance & 7-Stage Package of Practices | AGRI MART MEGA',
    description:
      'Comprehensive agronomist-verified 7-stage crop management guide for Karnataka farmers. Soil preparation, certified sowing, balanced fertilizing, precision irrigation, weed protection, harvesting, and safe storage.',
    url: `https://www.${SITE_CONFIG.domain}/crop-guidance`,
    siteName: SITE_CONFIG.name,
    locale: 'en_IN',
    type: 'article',
  },
};

const STAGE_DETAILS = [
  {
    id: 1,
    title: 'Stage 1: Preparation of Soil',
    subtitle: 'Deep Ploughing, Hardpan Shattering & Basal Conditioning',
    summary:
      'Proper land prep ensures root aeration, moisture retention, and uniform seedbeds. Conduct 12-parameter soil testing before basal manure application.',
    keyActions: [
      'Perform primary deep summer ploughing (25-30 cm depth) to destroy dormant insect pupae and weed rhizomes.',
      'Rotavator secondary tilling to achieve optimum clod size (2-5 cm) for seedbed moisture retention.',
      'Incorporate 5-8 tonnes of well-decomposed FYM (Farm Yard Manure) or vermicompost per acre.',
      'Correct soil pH using agricultural gypsum for alkali soils or dolomite lime for acidic soils.',
    ],
    recommendedTools: ['Heavy 55HP 4WD Tractors', 'Reversible Ploughs', 'Multi-Speed Rotavators'],
  },
  {
    id: 2,
    title: 'Stage 2: Sowing & Seed Treatment',
    subtitle: 'Certified Hybrids, Bio-Priming & Precision Spacing',
    summary:
      'High germination vigor starts with certified seeds treated against seed-borne pathogens, damping-off fungi, and early sucking pests.',
    keyActions: [
      'Select university-recommended certified hybrid varieties adapted to local agro-climatic zones.',
      'Treat seeds with Trichoderma viride (10g/kg) and Pseudomonas fluorescens for biological wilt immunity.',
      'Apply chemical seed dressing (Thiamethoxam 30 FS @ 5ml/kg) for 30-day sucking pest protection.',
      'Maintain calibrated row-to-row and plant-to-plant geometry using pneumatic seed drills.',
    ],
    recommendedTools: ['Pneumatic Seed Drills', 'Bio-Fungicide Seed Dressers', 'Germination Trays'],
  },
  {
    id: 3,
    title: 'Stage 3: General Manuring Practices',
    checklistTitle: 'Agronomist Action Checklist',
    subtitle: 'Balanced NPK Nutrition, Secondary & Micronutrients',
    summary:
      'Targeted nutrition avoids fertilizer burning, minimizes nutrient leaching, and maximizes yield response per unit of nutrient applied.',
    keyActions: [
      "Conduct a soil test before applying manure or fertilizers to understand the soil's nutrient status.",
      'Apply well-decomposed farmyard manure (FYM) or compost to improve soil fertility, soil structure, and microbial activity.',
      'Incorporate organic manure into the soil before planting, wherever suitable.',
      'Apply manure in the recommended quantity and at the appropriate time according to crop requirements.',
      'Avoid applying undecomposed manure or excessive fertilizers, as they may harm plants and affect soil health.',
      'Store manure and fertilizers properly to prevent nutrient losses and contamination.',
    ],
    recommendedTools: ['Fertilizer Broadcasters', 'Fertigation Venturi Injectors', 'Soil Test Kits'],
  },
  {
    id: 4,
    title: 'Stage 4: General Irrigation Practices',
    checklistTitle: 'Agronomist Action Checklist',
    subtitle: 'Critical Growth Stages, Drip Efficiency & Moisture Sensor Audits',
    summary:
      'Water management tailored to crop phenology prevents root asphyxiation in clay soils and water stress during pollination.',
    keyActions: [
      "Schedule irrigation according to the crop's age, growth stage, weather conditions, and soil moisture.",
      'Utilize smart irrigation technologies, such as FYLLO, soil moisture sensors, and automated irrigation systems, to monitor soil moisture and improve irrigation efficiency.',
      'Check soil moisture regularly to determine when irrigation is needed.',
      'Ensure uniform water distribution throughout the field and check for clogged or damaged irrigation lines.',
      'Avoid over-irrigation and water stagnation to maintain healthy root growth and prevent waterlogging.',
      'Prefer irrigation during cooler hours, such as early morning or evening, to reduce evaporation losses.',
      'Regularly inspect and maintain irrigation systems to ensure efficient water use.',
    ],
    recommendedTools: ['Drip Irrigation Kits', 'Centrifugal Water Pumps', 'Digital Tensiometers'],
  },
  {
    id: 5,
    title: 'Stage 5: Weed, Pest & Disease Management',
    checklistTitle: 'Agronomist Action Checklist',
    subtitle: 'Integrated Pest Management (IPM), Weeders & Micro-Spraying',
    summary:
      'Combine mechanical inter-cultivation with selective green-label agrochemicals and drone atomization for residue-free produce.',
    keyActions: [
      'Regularly monitor the field to identify weeds, insect pests, and disease symptoms at an early stage.',
      'Control weeds using suitable manual, mechanical, or chemical methods to reduce competition for water, nutrients, and sunlight.',
      'Follow Integrated Pest Management (IPM) practices, including field sanitation, crop rotation, traps, and biological control wherever suitable.',
      'Identify the pest or disease correctly before selecting an appropriate control measure.',
      'Use recommended plant protection products only when necessary, following label instructions, dosage, and safety precautions.',
      'Use boom sprayers wherever suitable to ensure uniform spray coverage and consistent application across the field.',
      'Rotate pesticides with different modes of action to help prevent resistance development.',
      'Remove and safely dispose of heavily infested or diseased plant parts where appropriate.',
      'Inspect the crop after treatment to evaluate effectiveness and monitor further pest or disease development.',
    ],
    recommendedTools: ['7HP Rotary Power Weeders', '16L Agri Drones', 'Battery Knapsack Sprayers'],
  },
  {
    id: 6,
    title: 'Stage 6: Harvesting Mechanization',
    subtitle: 'Physiological Maturity, Low-Shatter Harvesters & Moisture Check',
    summary:
      'Timely mechanical harvesting cuts labor costs by 70%, prevents weather damage, and curtails field shattering loss below 1.5%.',
    keyActions: [
      'Confirm physiological maturity (e.g., 80-85% grains turning golden yellow, 20-22% moisture).',
      'Deploy self-propelled reaper harvesters with clean reciprocating cutter bars and windrowers.',
      'Avoid harvesting under morning dew to prevent grain clogging in threshing drums.',
      'Separate diseased or lodged crop patches to prevent contamination of prime grade produce.',
    ],
    recommendedTools: ['Self-Propelled Reaper Harvesters', 'Multi-Crop Threshers', 'Grain Moisture Meters'],
  },
  {
    id: 7,
    title: 'Stage 7: Storage & Post-Harvest Preservation',
    subtitle: 'Grain Drying, Hermetic Storage & Fumigation Protocols',
    summary:
      'Preserve grain viability and market price by drying down to 12% moisture and storing in hermetic pest-proof storage systems.',
    keyActions: [
      'Solar-dry grains on clean HDPE tarpaulins until safe storage moisture (<12-13%) is reached.',
      'Store in multi-layer hermetic bags (PICS bags) that deplete oxygen and eliminate storage weevils naturally.',
      'Clean and disinfect godowns using approved pyrethrum sprays prior to stacking bags on wooden dunnage.',
      'Inspect grain stocks bi-weekly for temperature spikes, insect webbing, or moisture condensation.',
    ],
    recommendedTools: ['HDPE Tarpaulins', 'Hermetic Grain Bags', 'Digital Temperature Probes'],
  },
];

export const revalidate = 60;

export default async function CropGuidancePage() {
  let stages = STAGE_DETAILS;
  let masterGuides = DEFAULT_CROP_MASTER_GUIDES;
  let pageContent = DEFAULT_CROP_GUIDANCE_PAGE_CONTENT;
  try {
    const rawBackendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'http://127.0.0.1:3011';
    const backendUrl = rawBackendUrl.replace('://localhost:', '://127.0.0.1:');
    const cgUrl = `${backendUrl}/api/crop-guidance`;
    const cache = getFrontendApiCache();
    const cached = cache.get(cgUrl);
    let json: any = null;

    if (cached && Date.now() - cached.timestamp < 120000) {
      json = cached.data;
    } else {
      const res = await fetch(cgUrl, {
        cache: 'no-store',
      });
      if (res.ok) {
        json = await res.json();
        cache.set(cgUrl, { data: json, timestamp: Date.now() });
      } else if (cached) {
        json = cached.data;
      }
    }

    if (json) {
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        stages = json.data.map((item: any) => {
          const stNum = item.stageNumber ?? item.id;
          return {
            id: stNum,
            title: item.title,
            checklistTitle: item.checklistTitle || 'Agronomist Action Checklist',
            subtitle: item.subtitle,
            summary: item.summary,
            keyActions: item.keyActions || [],
            recommendedTools: item.recommendedTools || [],
            recommendedProducts: item.recommendedProducts || [],
          };
        });
      }
      if (Array.isArray(json.masterGuides) && json.masterGuides.length > 0) {
        masterGuides = json.masterGuides;
      }
      if (json.pageContent) {
        pageContent = { ...DEFAULT_CROP_GUIDANCE_PAGE_CONTENT, ...json.pageContent };
      }
    }
  } catch {
    // Fallback to static STAGE_DETAILS
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Crop Guidance & 7-Stage POP' },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://www.${SITE_CONFIG.domain}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Crop Guidance',
        item: `https://www.${SITE_CONFIG.domain}/crop-guidance`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-12 shadow-xl border border-emerald-800/60">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="warning" size="sm">
                {pageContent.heroBadge}
              </Badge>
              <span className="text-xs sm:text-sm text-amber-300 font-bold tracking-wide">
                {pageContent.heroSubtitle}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {pageContent.heroTitle}
            </h1>
            <p className="text-sm sm:text-base text-white/95 font-medium leading-relaxed">
              {pageContent.heroDescription}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href={pageContent.primaryCtaHref || '/ai-advisory'}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> {pageContent.primaryCtaText}
              </Link>
              <Link
                href={pageContent.secondaryCtaHref || '/services'}
                className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition border border-white/30 flex items-center gap-2"
              >
                <Tractor className="w-4 h-4" /> {pageContent.secondaryCtaText}
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Navigation: 7 Stages of Agricultural Production (Stage opens only when clicked) */}
        <CropStagesExplorer stages={stages} allProducts={SEED_PRODUCTS} />

        {/* Crop-Specific Master Guides (Rose, Chrysanthemum, Pomegranate, Grape, etc.) */}
        <CropSpecificMasterGuides
          initialGuides={masterGuides}
          badgeText={pageContent.masterSectionBadge}
          titleText={pageContent.masterSectionTitle}
          descriptionText={pageContent.masterSectionDescription}
        />

        {/* AI Advisory Call to Action */}
        <div className="bg-emerald-50 rounded-3xl p-6 sm:p-10 border border-emerald-300 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <Badge variant="success" size="sm">
              {pageContent.aiBannerBadge}
            </Badge>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {pageContent.aiBannerTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 max-w-xl leading-relaxed">
              {pageContent.aiBannerDescription}
            </p>
          </div>
          <Link
            href={pageContent.aiBannerCtaHref || '/ai-advisory'}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow transition shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> {pageContent.aiBannerCtaText}
          </Link>
        </div>
      </div>
    </>
  );
}
