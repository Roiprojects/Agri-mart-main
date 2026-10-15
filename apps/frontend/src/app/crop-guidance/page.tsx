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
    title: 'Stage 3: Manure & Fertilizer Management',
    subtitle: 'Balanced NPK Nutrition, Secondary & Micronutrients',
    summary:
      'Targeted nutrition avoids fertilizer burning, minimizes nutrient leaching, and maximizes yield response per unit of nutrient applied.',
    keyActions: [
      'Apply 100% recommended Phosphorus and 50% Potash as basal fertilizer during final land preparation.',
      'Split Nitrogen into 3 equal splits: 1/3 basal, 1/3 at active tillering/vegetative, 1/3 at panicle/flowering.',
      'Top-dress Chelated Zinc (Zn-EDTA 12%) and Boron (20%) to avert deficiency chlorosis and flower drop.',
      'Use slow-release Neem Coated Urea (NCU) to minimize volatilization and run-off losses.',
    ],
    recommendedTools: ['Fertilizer Broadcasters', 'Fertigation Venturi Injectors', 'Soil Test Kits'],
  },
  {
    id: 4,
    title: 'Stage 4: Precision Irrigation Scheduling',
    subtitle: 'Critical Growth Stages, Drip Efficiency & Moisture Sensor Audits',
    summary:
      'Water management tailored to crop phenology prevents root asphyxiation in clay soils and water stress during pollination.',
    keyActions: [
      'Identify moisture-sensitive stages: CRI in wheat, flowering in cotton, panicle initiation in paddy.',
      'Adopt inline drip irrigation (2.4 LPH emitters at 40cm spacing) to save 45-60% water.',
      'Irrigate during evening or early morning hours to minimize surface evaporation losses.',
      'Utilize tensiometers or digital soil moisture sensors to trigger irrigation at 50% field capacity.',
    ],
    recommendedTools: ['Drip Irrigation Kits', 'Centrifugal Water Pumps', 'Digital Tensiometers'],
  },
  {
    id: 5,
    title: 'Stage 5: Weed & Pest Protection',
    subtitle: 'Integrated Pest Management (IPM), Weeders & Micro-Spraying',
    summary:
      'Combine mechanical inter-cultivation with selective green-label agrochemicals and drone atomization for residue-free produce.',
    keyActions: [
      'Execute mechanical weeding at 20-25 DAS using 7HP rotary power weeders between crop rows.',
      'Install yellow/blue sticky traps (15 traps/acre) and pheromone lures for early insect scouting.',
      'Deploy autonomous drone spraying for uniform micron droplet coverage underneath leaf canopies.',
      'Rotate chemical modes of action (IRAC/FRAC groups) to prevent insecticidal resistance development.',
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

export default async function CropGuidancePage() {
  let stages = STAGE_DETAILS;
  try {
    const backendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'http://localhost:3011';
    const res = await fetch(`${backendUrl}/api/crop-guidance`, {
      next: { revalidate: 30, tags: ['crop-guidance'] },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        stages = json.data.map((item: any) => ({
          id: item.stageNumber ?? item.id,
          title: item.title,
          subtitle: item.subtitle,
          summary: item.summary,
          keyActions: item.keyActions || [],
          recommendedTools: item.recommendedTools || [],
          recommendedProducts: item.recommendedProducts || [],
        }));
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
        <div className="bg-gradient-to-br from-brand-darkGreen via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-12 shadow-xl border border-emerald-900/40">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="warning" size="sm">
                Agronomy Knowledge Hub
              </Badge>
              <span className="text-xs text-emerald-300 font-medium">
                Karnataka Package of Practices (POP)
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              7-Stage Scientific Crop Lifecycle Management
            </h1>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Maximize your farm productivity, soil carbon, and net margins. Our agronomist-curated
              action plans combine state agricultural university guidelines with precision machinery
              and bio-care products.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/ai-advisory"
                className="bg-brand-gold hover:brightness-105 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Consult AI Crop Doctor
              </Link>
              <Link
                href="/services"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition border border-white/20 flex items-center gap-2"
              >
                <Tractor className="w-4 h-4" /> Book Field Machinery
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stage Anchor Links */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Quick Navigation: {stages.length} Stages of Agricultural Production
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
            {stages.map((stage) => (
              <a
                key={stage.id}
                href={`#stage-${stage.id}`}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-brand-lightGreen border border-slate-200 hover:border-brand-green/30 text-slate-800 hover:text-brand-green font-semibold transition flex flex-col items-center justify-center gap-1"
              >
                <span className="w-5 h-5 rounded-full bg-brand-green text-white text-[10px] flex items-center justify-center font-bold">
                  {stage.id}
                </span>
                <span className="line-clamp-1">{stage.title.includes(': ') ? stage.title.split(': ')[1] : stage.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* The Stages Detailed Walkthrough */}
        <div className="space-y-8">
          {stages.map((stage) => {
            const stageProducts = SEED_PRODUCTS.filter((p) => p.cropStages.includes(stage.id)).slice(
              0,
              2
            );

            return (
              <div
                key={stage.id}
                id={`stage-${stage.id}`}
                className="scroll-mt-24 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 hover:border-brand-green/30 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-lightGreen text-brand-green font-extrabold text-xs">
                        Stage {stage.id}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Standard POP</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {stage.title}
                    </h3>
                    <div className="text-xs sm:text-sm font-semibold text-brand-green mt-0.5">
                      {stage.subtitle}
                    </div>
                  </div>

                  <Link
                    href={`/shop?stage=${stage.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green hover:text-brand-greenDark shrink-0"
                  >
                    View Stage {stage.id} Products <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{stage.summary}</p>

                {/* Key Agronomy Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-green" /> Agronomist Action Checklist
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                      {stage.keyActions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-brand-green font-bold">&bull;</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-brand-lightGreen/30 rounded-2xl p-5 border border-brand-green/20 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-greenDark flex items-center gap-1.5">
                      <Tractor className="w-4 h-4 text-brand-green" /> Mechanized Tools & Equipment
                    </h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {stage.recommendedTools.map((tool, i) => (
                        <span
                          key={i}
                          className="bg-white text-slate-800 text-xs px-3 py-1.5 rounded-xl font-medium border border-brand-green/20 shadow-xs"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-brand-green/20">
                      <div className="text-xs text-slate-600">
                        Need tractor or operator assistance for this stage?
                      </div>
                      <Link
                        href="/services"
                        className="inline-block text-xs font-bold text-brand-green hover:underline mt-1"
                      >
                        Book Stage {stage.id} Mechanization Services &rarr;
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Recommended Products for this stage */}
                {stageProducts.length > 0 && (
                  <div className="pt-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Recommended Inputs for Stage {stage.id}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {stageProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AI Advisory Call to Action */}
        <div className="bg-brand-lightGreen rounded-3xl p-6 sm:p-10 border border-brand-green/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <Badge variant="success" size="sm">
              Free Farmer Advisory
            </Badge>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Need Custom Advice for Your Specific Soil & Crop?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Upload a photo of your affected leaf or enter your crop stage to receive immediate
              agronomist diagnostics powered by Google Gemini AI.
            </p>
          </div>
          <Link
            href="/ai-advisory"
            className="bg-brand-green hover:bg-brand-greenDark text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow transition shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Open AI Crop Doctor
          </Link>
        </div>
      </div>
    </>
  );
}
