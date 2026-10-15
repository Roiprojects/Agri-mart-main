export interface JobWorkType {
  id: string;
  name: string;
  nameKn?: string;
  description: string;
  rate: number;
  rateUnit: string;
  equipmentNeeded: string;
  estimatedDuration: string;
}

export interface ServiceDefinition {
  id: string;
  slug: string;
  name: string;
  nameKn: string;
  category: string;
  shortDescription: string;
  description: string;
  baseRatePerAcre: number;
  equipmentUsed: string;
  timeEstimate: string;
  badge: string;
  iconName: string;
  jobWorkTypes: JobWorkType[];
  faq: { q: string; a: string }[];
}

export const SERVICES_CATALOGUE: ServiceDefinition[] = [
  {
    id: 'srv-tractor',
    slug: 'tractor-services',
    name: 'Tractor Precision Ploughing & Land Preparation',
    nameKn: '',
    category: 'Heavy Farm Mechanization',
    badge: 'High Demand',
    iconName: 'Tractor',
    baseRatePerAcre: 1200,
    equipmentUsed: '45–55 HP 4WD Tractors with MB Plough, Disc Harrow & Cultivator',
    timeEstimate: '1.5 to 2.5 hours / acre',
    shortDescription: 'Deep primary tillage, disc harrowing, and field leveling with experienced certified tractor operators.',
    description:
      'Eliminate the heavy capital expenditure of tractor ownership. Agri Mart Mega dispatches modern 4WD tractors with seasoned operators directly to your farm parcel coordinates. Our tractor services cover virgin land breaking, sugarcane ratoon pulverizing, mouldboard deep tilling, and laser precision leveling.',
    jobWorkTypes: [
      {
        id: 'jw-mb-plough',
        name: 'Mouldboard (MB) Deep Ploughing',
        nameKn: '',
        description: 'Deep furrow slicing (up to 12 inches) to invert hard pan soil, kill subterranean grubs, and optimize aeration.',
        rate: 1400,
        rateUnit: 'per acre',
        equipmentNeeded: '55HP Tractor + 2/3 Bottom MB Plough',
        estimatedDuration: '2.0 hours/acre',
      },
      {
        id: 'jw-disc-harrow',
        name: 'Disc Harrow Clod Crushing & Aeration',
        nameKn: '',
        description: 'Secondary tillage to crush stubborn clay clods, chop weed roots, and prepare a fine seedbed.',
        rate: 1100,
        rateUnit: 'per acre',
        equipmentNeeded: '45HP Tractor + 16/20 Disc Harrow',
        estimatedDuration: '1.2 hours/acre',
      },
      {
        id: 'jw-laser-level',
        name: 'Laser Guided Precision Land Leveling',
        nameKn: '',
        description: 'Transmitter guided grading ensuring 0% slope deviations. Reduces water consumption by 25–30% and guarantees uniform germination.',
        rate: 1800,
        rateUnit: 'per acre',
        equipmentNeeded: '50HP Tractor + Laser Transmitter Scraper',
        estimatedDuration: '2.5 hours/acre',
      },
      {
        id: 'jw-ridger-furrow',
        name: 'Ridger & Furrow Making for Row Crops',
        nameKn: '',
        description: 'Uniform furrow shaping for sugarcane, cotton, potato, and maize with drip lateral placement alignment.',
        rate: 950,
        rateUnit: 'per acre',
        equipmentNeeded: '45HP Tractor + Adjustable 3-Row Ridger',
        estimatedDuration: '1.0 hours/acre',
      },
    ],
    faq: [
      {
        q: 'Does the rental service include diesel and operator?',
        a: 'Yes, all Agri Mart Mega service bookings are all-inclusive (diesel, implement, operator, and transit charges). No hidden surcharges.',
      },
      {
        q: 'How does the operator locate my farm bund?',
        a: 'Our smart GPS service locks onto your submitted GPS latitude/longitude. The tractor unit navigates directly using the driver mobile app.',
      },
    ],
  },
  {
    id: 'srv-rotavator',
    slug: 'rotavator-services',
    name: 'Rotavator Tilling & Wet Puddling',
    nameKn: '',
    category: 'Soil Pulverization',
    badge: 'Popular',
    iconName: 'RotateCw',
    baseRatePerAcre: 1100,
    equipmentUsed: '7-Foot Multi-Speed Heavy Duty Rotavators',
    timeEstimate: '1.0 to 1.5 hours / acre',
    shortDescription: 'High-speed rotary pulverization for uniform seedbed tilth and paddy wet puddling.',
    description:
      'Create the perfect fine tilth in a single pass. Our rotavator fleet features boron steel L/C blades and multi-speed gearboxes suited for both dry black cotton soils and wet paddy wetland puddling.',
    jobWorkTypes: [
      {
        id: 'jw-dry-rotary',
        name: 'Dry Soil Fine Tilth Pulverization',
        nameKn: '',
        description: 'Single-pass pulverization breaking stubble and clods into loose, fertile seedbeds ready for vegetable and pulse sowing.',
        rate: 1100,
        rateUnit: 'per acre',
        equipmentNeeded: '7-Foot Heavy Duty Rotavator + 45HP Tractor',
        estimatedDuration: '1.2 hours/acre',
      },
      {
        id: 'jw-wet-puddling',
        name: 'Wet Wetland Paddy Puddling',
        nameKn: '',
        description: 'Double pass puddle churning in flooded paddy fields with cage wheels to create impermeable subsoil basin and retain standing water.',
        rate: 1350,
        rateUnit: 'per acre',
        equipmentNeeded: 'Tractor with Iron Cage Wheels + 6-Foot Wetland Rotavator',
        estimatedDuration: '1.5 hours/acre',
      },
    ],
    faq: [
      {
        q: 'Can rotavators chop through green manure crops (sunhemp/dhaincha)?',
        a: 'Yes, our rotavators incorporate standing green manure into the soil within 1–2 passes, speeding up microbial decomposition.',
      },
    ],
  },
  {
    id: 'srv-harvesting',
    slug: 'harvesting-services',
    name: 'Mechanical Harvesting & Reaping',
    nameKn: '',
    category: 'Crop Harvesting',
    badge: 'Peak Season',
    iconName: 'Wheat',
    baseRatePerAcre: 2200,
    equipmentUsed: 'Track Combine Harvesters & Self-Propelled Reapers',
    timeEstimate: '45 mins to 1.2 hours / acre',
    shortDescription: 'Rapid mechanized harvesting for paddy, wheat, soybean, and maize with 99% grain recovery.',
    description:
      'Avoid harvest delays and seasonal labour bottlenecks. Our crawler track combine harvesters operate smoothly even in damp, boggy paddy fields, threshing, de-chaffing, and bagging clean grain directly.',
    jobWorkTypes: [
      {
        id: 'jw-combine-paddy',
        name: 'Crawler Track Combine Harvester (Paddy/Wheat)',
        nameKn: '',
        description: 'Complete reaping, threshing, and cleaning with rubber crawlers that prevent bogging in wet black soil.',
        rate: 2600,
        rateUnit: 'per acre',
        equipmentNeeded: 'Rubber Track 88HP Combine Harvester',
        estimatedDuration: '50 mins/acre',
      },
      {
        id: 'jw-reaper-binder',
        name: 'Self-Propelled Reaper & Straw Bundler',
        nameKn: '',
        description: 'Cuts cereal crops 2 inches from ground level and ties uniform bundles, preserving valuable livestock fodder.',
        rate: 1800,
        rateUnit: 'per acre',
        equipmentNeeded: '10HP Self-Propelled Reaper Binder',
        estimatedDuration: '1.5 hours/acre',
      },
    ],
    faq: [
      {
        q: 'What is the grain loss percentage with your combine harvesters?',
        a: 'Grain loss is certified under 1.2%, significantly lower than manual handling and transport losses.',
      },
    ],
  },
  {
    id: 'srv-spraying',
    slug: 'spraying-services',
    name: 'Drone & Boom Precision Spraying',
    nameKn: '',
    category: 'Plant Protection',
    badge: 'DGCA Certified',
    iconName: 'CloudRain',
    baseRatePerAcre: 450,
    equipmentUsed: '10L/16L Hexacopter Agri-Drones & Tractor Boom Sprayers',
    timeEstimate: '7 to 12 minutes / acre',
    shortDescription: 'Uniform droplet micron-spraying minimizing chemical runoff and safeguarding operator health.',
    description:
      'Deploy DGCA-certified drone pilots and ultra-low volume (ULV) atomizers. Agri Mart Mega agricultural drones cover an entire acre in under 8 minutes, penetrating underleaf canopies with prop-wash turbulence for 100% pest eradication.',
    jobWorkTypes: [
      {
        id: 'jw-drone-micron',
        name: 'Hexacopter Drone Micron-Spraying',
        nameKn: '',
        description: 'Centrifugal atomizing nozzles producing 120-micron droplets. Covers 1 acre with only 10 litres of water.',
        rate: 450,
        rateUnit: 'per acre',
        equipmentNeeded: 'DGCA Certified 16L Drone + Pilot & Agronomist',
        estimatedDuration: '8 mins/acre',
      },
      {
        id: 'jw-tractor-boom',
        name: 'Tractor 24-Nozzle Boom Sprayer',
        nameKn: '',
        description: 'High-volume systematic fungicide / micronutrient drenching for broad-acre cotton, groundnut, and sugarcane crops.',
        rate: 650,
        rateUnit: 'per acre',
        equipmentNeeded: '400-Litre Tank 30-Foot Boom Sprayer',
        estimatedDuration: '25 mins/acre',
      },
    ],
    faq: [
      {
        q: 'Do you provide the chemicals or does the farmer?',
        a: 'You can provide your own inputs or order certified bio-inputs directly via Agri Mart Mega with a bundled service discount.',
      },
    ],
  },
  {
    id: 'srv-cultivation',
    slug: 'cultivation-services',
    name: 'Inter-Cultivation & Weeding Operations',
    nameKn: '',
    category: 'Crop Maintenance',
    badge: 'Cost Saver',
    iconName: 'Sparkles',
    baseRatePerAcre: 850,
    equipmentUsed: '7HP–9HP Power Weeders with Ridger and Ditcher',
    timeEstimate: '1.5 to 2 hours / acre',
    shortDescription: 'Mechanized inter-row weeding and earthing-up for row crops, reducing manual weeding costs by 70%.',
    description:
      'Keep weed competition at zero during critical vegetative stages. Our operators handle maneuverable mini-power weeders with reverse gearboxes, cutting weeds and aerating roots without damaging crop stems.',
    jobWorkTypes: [
      {
        id: 'jw-weeder-inter',
        name: 'Power Weeder Inter-Row Weeding',
        nameKn: '',
        description: 'High RPM rotary tilling between crop rows (2 to 4 feet spacing) uprooting weeds and mulching them into soil.',
        rate: 850,
        rateUnit: 'per acre',
        equipmentNeeded: '7HP Petrol Power Weeder + Skilled Operator',
        estimatedDuration: '1.5 hours/acre',
      },
      {
        id: 'jw-earthing-up',
        name: 'Earthing-Up & Root Mound Bedding',
        nameKn: '',
        description: 'Mounding soil around base of sugarcane, banana, or potato plants to support root anchoring and prevent lodging.',
        rate: 950,
        rateUnit: 'per acre',
        equipmentNeeded: 'Power Weeder with Ditcher Attachment',
        estimatedDuration: '1.8 hours/acre',
      },
    ],
    faq: [
      {
        q: 'What is the minimum row spacing required?',
        a: 'Our adjustable rotary weeders can operate in row spacings as tight as 18 inches up to 5 feet.',
      },
    ],
  },
  {
    id: 'srv-labour',
    slug: 'labour-services',
    name: 'Skilled Agricultural Labour Gangs',
    nameKn: '',
    category: 'Farm Manpower',
    badge: 'Verified Crews',
    iconName: 'Users',
    baseRatePerAcre: 3500,
    equipmentUsed: 'Trained farm labor gangs with personal protective gear',
    timeEstimate: '1 full day / 2–3 acres',
    shortDescription: 'Organized, reliable farm labour crews for paddy transplanting, fruit picking, pruning, and sugarcane harvesting.',
    description:
      'Overcome seasonal farm labour shortages. Agri Mart Mega coordinates vetted, experienced labour groups led by designated supervisors (Mestry) for transplanting, manual weeding, harvesting, and sorting.',
    jobWorkTypes: [
      {
        id: 'jw-paddy-transplant',
        name: 'Paddy Mat / Line Transplanting Crew',
        nameKn: '',
        description: 'Experienced 10-person gang ensuring proper hill density (30–33 hills/sq.m) and uniform root depth.',
        rate: 3800,
        rateUnit: 'per acre',
        equipmentNeeded: '10-Person Verified Labour Gang',
        estimatedDuration: '1 Day/acre',
      },
      {
        id: 'jw-harvest-labour',
        name: 'Manual Harvest, De-husking & Bagging Crew',
        nameKn: '',
        description: 'Cotton picking, maize cob de-husking, or onion bulb harvesting and on-field sorting.',
        rate: 3200,
        rateUnit: 'per acre',
        equipmentNeeded: '8-Person Crew with Harvesting Kits',
        estimatedDuration: '1 Day/acre',
      },
    ],
    faq: [
      {
        q: 'Are workers insured and verified?',
        a: 'All labour gangs registered under Agri Mart Mega undergo KYC verification and have standard rural accident cover.',
      },
    ],
  },
  {
    id: 'srv-soil-testing',
    slug: 'soil-testing-services',
    name: 'Comprehensive 14-Parameter Soil & Water Testing',
    nameKn: '',
    category: 'Scientific Diagnostics',
    badge: 'NABL Certified Lab',
    iconName: 'FlaskConical',
    baseRatePerAcre: 550,
    equipmentUsed: 'Precision GPS Core Sampler & Spectrophotometer Lab Analyzer',
    timeEstimate: 'Sample collected in 30 mins; Lab report in 48 hours',
    shortDescription: 'Field sample collection by agronomist + NABL laboratory testing for NPK, micronutrients, pH, EC, and Organic Carbon.',
    description:
      'Stop guessing your fertilizer dosages. An Agri Mart field technician visits your GPS farm coordinates to draw scientific zig-zag core soil samples. Delivered with a customized Kannada/English Soil Health Card and crop-specific fertilizer prescription.',
    jobWorkTypes: [
      {
        id: 'jw-soil-14-param',
        name: 'Full 14-Parameter Soil Fertility Analysis',
        nameKn: '',
        description: 'Measures Nitrogen, Phosphorus, Potassium, Zinc, Boron, Iron, Manganese, Copper, Sulphur, pH, EC, and Organic Carbon.',
        rate: 650,
        rateUnit: 'per sample',
        equipmentNeeded: 'GPS Core Sampler + Digital Lab Testing',
        estimatedDuration: 'Report in 48h',
      },
      {
        id: 'jw-water-irrigation',
        name: 'Borewell / Canal Irrigation Water Suitability Test',
        nameKn: '',
        description: 'Analysis of Total Dissolved Solids (TDS), Sodium Adsorption Ratio (SAR), Boron toxicity, and salinity risks.',
        rate: 450,
        rateUnit: 'per sample',
        equipmentNeeded: 'Hermetic Sample Flask + Lab Analysis',
        estimatedDuration: 'Report in 24h',
      },
    ],
    faq: [
      {
        q: 'How does this save fertilizer costs?',
        a: 'Most farmers over-apply DAP and urea by 35%. The Soil Health Card tells you exactly what nutrients your field already holds.',
      },
    ],
  },
  {
    id: 'srv-consultation',
    slug: 'farm-consultation',
    name: 'Certified Agronomist On-Field Consultation',
    nameKn: '',
    category: 'Agronomy Advisory',
    badge: 'UAS Dharwad Certified',
    iconName: 'GraduationCap',
    baseRatePerAcre: 750,
    equipmentUsed: 'Digital Microscope, Chlorophyll Meter & Soil Moisture Probe',
    timeEstimate: '1.5 hours on-field consultation',
    shortDescription: 'Field visit by M.Sc Agronomy scientists for pest diagnosis, fertigation scheduling, and yield enhancement.',
    description:
      'Bring university-level agricultural expertise to your farm bund. Our certified agronomists diagnose persistent wilting, root grubs, nutrient deficiencies, and formulate custom organic or integrated pest management (IPM) regimens.',
    jobWorkTypes: [
      {
        id: 'jw-field-visit',
        name: 'On-Field Diagnostic Visit & Prescription',
        nameKn: '',
        description: 'Complete inspection of crop rows, root zone health check, and written spray/fertigation schedule.',
        rate: 850,
        rateUnit: 'per visit',
        equipmentNeeded: 'Diagnostic Kit + Mobile Farm Report',
        estimatedDuration: '1.5 hours',
      },
      {
        id: 'jw-package-season',
        name: 'Full-Season 4-Visit Advisory Package',
        nameKn: '',
        description: 'Covers Sowing, Vegetative, Flowering, and Pre-Harvest stages with continuous WhatsApp SOS phone support.',
        rate: 2800,
        rateUnit: 'per crop season',
        equipmentNeeded: 'Dedicated Agronomist Assignment',
        estimatedDuration: 'Full Crop Cycle',
      },
    ],
    faq: [
      {
        q: 'Which crops do your experts specialize in?',
        a: 'We specialize in Karnataka agro-climatic crops: Sugarcane, Byadgi Chilli, Cotton, Arecanut, Maize, Paddy, and Horticulture vegetables.',
      },
    ],
  },
  {
    id: 'srv-operators',
    slug: 'equipment-operators',
    name: 'Certified Machinery & Tractor Operators',
    nameKn: '',
    category: 'Machinery Operators',
    badge: 'Verified Drivers',
    iconName: 'HardHat',
    baseRatePerAcre: 700,
    equipmentUsed: 'Licensed commercial operators with min. 5 years heavy equipment experience',
    timeEstimate: 'Per Day (8-hour shift)',
    shortDescription: 'Hire skilled, background-checked operators to drive your own tractors, power tillers, or harvesters.',
    description:
      'Own farm equipment but lack trained drivers? Hire certified machinery operators by the day or week. Every operator is trained in safety protocols, implement hitching, and fuel-efficient gear management.',
    jobWorkTypes: [
      {
        id: 'jw-tractor-driver',
        name: 'Experienced Tractor Driver Deployment',
        nameKn: '',
        description: '8-hour duty shift for ploughing, harrowing, or trailer haulage on the farmer’s own machinery.',
        rate: 750,
        rateUnit: 'per day (8 hrs)',
        equipmentNeeded: 'Driver Deployment with Safety Gear',
        estimatedDuration: '8 hours/day',
      },
      {
        id: 'jw-harvester-driver',
        name: 'Combine Harvester Master Operator',
        nameKn: '',
        description: 'Specialist driver for multi-crop combine harvesters capable of handling tricky wet wetland maneuvers.',
        rate: 1200,
        rateUnit: 'per day (8 hrs)',
        equipmentNeeded: 'Master Harvester Operator',
        estimatedDuration: '8 hours/day',
      },
    ],
    faq: [
      {
        q: 'What if equipment gets damaged during operation?',
        a: 'Our operators are professionally certified and follow standardized RPM and gear parameters to prevent implement wear and tear.',
      },
    ],
  },
  {
    id: 'srv-custom-agri',
    slug: 'custom-agri-services',
    name: 'Custom Agricultural & Smart Farm Engineering',
    nameKn: '',
    category: 'Farm Infrastructure',
    badge: 'Turnkey Solutions',
    iconName: 'Wrench',
    baseRatePerAcre: 1500,
    equipmentUsed: 'High-voltage solar energizers, trenchers & HDPE butt-fusion machines',
    timeEstimate: 'Project based (1 to 3 days)',
    shortDescription: 'Custom engineering including solar wild-boar fencing, drip fertigation automation, and shaded nursery setup.',
    description:
      'Turnkey solutions for farm infrastructure. Protect your standing yield with government-compliant solar pulsating electric fencing or automate your drip irrigation valves with solar controllers.',
    jobWorkTypes: [
      {
        id: 'jw-solar-fence',
        name: 'Solar Wild-Boar Protection Electric Fence Setup',
        nameKn: '',
        description: 'Non-lethal pulsed energizer with 4-strand galvanised steel wire, solar panel, battery, and earth pit rods.',
        rate: 65,
        rateUnit: 'per running meter',
        equipmentNeeded: 'Solar Energizer + Installation Crew',
        estimatedDuration: '1–2 Days',
      },
      {
        id: 'jw-drip-manifold',
        name: 'Drip Irrigation Screen Filter & Venturi Setup',
        nameKn: '',
        description: 'Installation of sand/screen filter batteries, pressure release valves, and venturi injectors for fertilizer dosing.',
        rate: 2200,
        rateUnit: 'per setup',
        equipmentNeeded: 'Plumbing & Pressure Testing Rig',
        estimatedDuration: '4–6 Hours',
      },
    ],
    faq: [
      {
        q: 'Is the solar electric fence safe for livestock and humans?',
        a: 'Yes, it delivers short 0.1-second pulsating non-lethal shocks complying with BIS standards that deter animals without harm.',
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return SERVICES_CATALOGUE.find((s) => s.slug === slug);
}

export function getServiceById(id: string): ServiceDefinition | undefined {
  return SERVICES_CATALOGUE.find((s) => s.id === id);
}
