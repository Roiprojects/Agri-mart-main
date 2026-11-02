export interface GuideTableSection {
  id?: string;
  title: string;
  badge: string;
  theme: 'emerald' | 'amber' | 'rose' | 'sky';
  headers: string[];
  rows: string[][];
}

export interface CropMasterGuide {
  id: string;
  name: string;
  category: string;
  tagline: string;
  sections: GuideTableSection[];
}

export interface CropGuidancePageContent {
  heroBadge: string;
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  masterSectionBadge: string;
  masterSectionTitle: string;
  masterSectionDescription: string;
  aiBannerBadge: string;
  aiBannerTitle: string;
  aiBannerDescription: string;
  aiBannerCtaText: string;
  aiBannerCtaHref: string;
}

export const DEFAULT_CROP_GUIDANCE_PAGE_CONTENT: CropGuidancePageContent = {
  heroBadge: 'Agronomy Knowledge Hub',
  heroSubtitle: 'Karnataka Package of Practices (POP)',
  heroTitle: 'Scientific Common Practice Crop Management',
  heroDescription:
    'Maximize your farm productivity, soil carbon, and net margins. Our agronomist-curated action plans combine state agricultural university guidelines with precision machinery and bio-care products.',
  primaryCtaText: 'Consult AI Crop Doctor',
  primaryCtaHref: '/ai-advisory',
  secondaryCtaText: 'Book Field Machinery',
  secondaryCtaHref: '/services',
  masterSectionBadge: 'Crop-Specific Master Agronomy & IPM Guides',
  masterSectionTitle: 'Complete Cultivation, Pest, Disease & Nutrient Field Guides',
  masterSectionDescription:
    'Stage-by-stage cultivation practices, farmer verification checks, pest & disease identification, chemical/biological active ingredients, and physiological disorder management for commercial horticulture crops.',
  aiBannerBadge: 'Free Farmer Advisory',
  aiBannerTitle: 'Need Custom Advice for Your Specific Soil & Crop?',
  aiBannerDescription:
    'Upload a photo of your affected leaf or enter your crop stage to receive immediate agronomist diagnostics powered by Google Gemini AI.',
  aiBannerCtaText: 'Open AI Crop Doctor',
  aiBannerCtaHref: '/ai-advisory',
};

export const DEFAULT_CROP_GUIDANCE_STAGES = [
  {
    id: 'cg-stage-1',
    stageNumber: 1,
    crop: 'All Crops',
    title: 'Stage 1: Preparation of Soil',
    checklistTitle: 'Agronomist Action Checklist',
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
    recommendedProducts: [
      'AgriPro Power Tiller 12HP',
      'FieldKing Hydraulic Reversible MB Plough',
      'Shaktiman Rotary Tiller 6ft',
    ],
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'cg-stage-2',
    stageNumber: 2,
    crop: 'All Crops',
    title: 'Stage 2: Sowing & Seed Treatment',
    checklistTitle: 'Agronomist Action Checklist',
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
    recommendedProducts: [
      'Certified Hybrid Paddy Seeds (RNR 15048)',
      'Bayer Gaucho FS 600 Seed Dresser',
      'Anand Agro Bio-Fungicide Trichoderma',
    ],
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'cg-stage-3',
    stageNumber: 3,
    crop: 'All Crops',
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
    recommendedProducts: [
      'IFFCO Neem Coated Urea',
      'Coromandel Gromor 19:19:19 Water Soluble',
      'Multiplex Zinc Micronutrient 12%',
    ],
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'cg-stage-4',
    stageNumber: 4,
    crop: 'All Crops',
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
    recommendedProducts: [
      'Jain Drip Kit 1 Acre Turbo Line',
      'Kirloskar 5HP Submersible Water Pump',
      'Automatic Irrigation Controller Timer',
    ],
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'cg-stage-5',
    stageNumber: 5,
    crop: 'All Crops',
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
    recommendedProducts: [
      'KisanKraft 16L Dual Motor Battery Sprayer',
      'Balwaan 7HP Petrol Inter-Row Weeder',
      'Yellow Sticky Traps (Pack of 25)',
    ],
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 'cg-stage-6',
    stageNumber: 6,
    crop: 'All Crops',
    title: 'Stage 6: Harvesting Mechanization',
    checklistTitle: 'Agronomist Action Checklist',
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
    recommendedProducts: [
      'VST Shakti Paddy Reaper 4-Row',
      'AgriPro Digital Grain Moisture Meter',
      'Mahindra Multi-Crop High Output Thresher',
    ],
    displayOrder: 6,
    isActive: true,
  },
  {
    id: 'cg-stage-7',
    stageNumber: 7,
    crop: 'All Crops',
    title: 'Stage 7: Storage & Post-Harvest Preservation',
    checklistTitle: 'Agronomist Action Checklist',
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
    recommendedProducts: [
      'Multi-Layer PICS Hermetic Grain Bags (50kg x 10)',
      'Tadpatri Heavy Duty 250 GSM HDPE Tarpaulin',
      'Grain Storage Temperature & Moisture Probe',
    ],
    displayOrder: 7,
    isActive: true,
  },
];

export const DEFAULT_CROP_MASTER_GUIDES: CropMasterGuide[] = [
  // =========================================================================
  // 1. ROSE
  // =========================================================================
  {
    id: 'rose',
    name: 'Rose',
    category: 'Floriculture & Commercial Cut Flowers',
    tagline:
      'Complete Rose Cultivation Stages, Pest & Disease IPM, and Nutrient & Physiological Disorder Management',
    sections: [
      {
        title: 'Rose Cultivation Stages & Growth Guide',
        badge: 'Cultivation & Growth Stages',
        theme: 'emerald',
        headers: [
          'Stage Name',
          'Key Objectives & Activities',
          'Field Management & Best Practices',
          'Farmer Verification Check',
        ],
        rows: [
          [
            'Land Preparation',
            'Select sunny location with good drainage; test soil pH, EC, and nutrient status; remove weeds, stones, and crop residues.',
            'Prepare fine soil and raised beds where drainage is needed. Incorporate well-decomposed organic manure according to soil test and local recommendations. Plan irrigation and drainage facilities.',
            'Is the soil suitable, fertile, well-drained, and free of weeds?',
          ],
          [
            'Planting & Establishment',
            'Select healthy, disease-free plants suited to the intended market; follow recommended spacing for variety and production system.',
            'Plant carefully without damaging roots. Irrigate after planting as needed. Replace dead or weak plants and monitor establishment.',
            'Are the plants establishing uniformly across the field?',
          ],
          [
            'Vegetative Growth',
            'Maintain appropriate soil moisture; apply fertilizers based on plant growth and nutrient requirements.',
            'Remove weeds and monitor new shoots. Check regularly for aphids, thrips, mites, leaf spots, powdery mildew, and downy mildew.',
            'Are leaves green and shoots growing normally without pest/disease stress?',
          ],
          [
            'Pruning & Shoot Management',
            'Prune according to variety, growing system (polyhouse vs open field), and target flowering schedule.',
            'Remove dead, diseased, and weak branches. Maintain proper plant structure and airflow. Clean pruning tools and dispose of infected plant material appropriately. Adjust irrigation and nutrition according to regrowth.',
            'Are healthy new shoots developing uniformly after pruning?',
          ],
          [
            'Bud Formation & Flowering',
            'Maintain balanced nutrition and suitable irrigation; monitor bud development and flower quality.',
            'Inspect buds, petals, and young shoots for thrips, mites, and caterpillars. Check for flower deformation, bud drop, and disease symptoms. Use only verified crop-protection measures when necessary.',
            'Are buds developing uniformly with good color and shape?',
          ],
          [
            'Harvesting & Postharvest',
            'Harvest at the appropriate bud-opening stage for target market (tight bud for long distance, loose for local).',
            'Use clean, sharp cutting tools. Handle flowers gently to avoid bruising and petal damage. Grade according to stem length, bud size, and flower quality. Keep harvested flowers cool, hydrated, and transport promptly.',
            'Are flowers meeting market requirements for freshness, stem length, and quality?',
          ],
        ],
      },
      {
        title: 'Major Rose Pests - Symptoms & Management',
        badge: 'Pest Diagnostics & IPM',
        theme: 'amber',
        headers: [
          'Pest Common Name',
          'Common Symptoms & Field Signs',
          'Cultural & IPM Management',
          'Recommended Chemical / Active Ingredients',
        ],
        rows: [
          [
            'Aphids',
            'Clusters of small insects on tender shoots and buds, curled leaves, sticky honeydew, and distorted growth.',
            'Remove severely infected shoots where practical, monitor regularly, and conserve natural enemies such as ladybird beetles.',
            'Acetamiprid, Flonicamid',
          ],
          [
            'Thrips',
            'Silvery or brown scars on petals, damaged buds, and deformed flowers.',
            'Inspect flower buds, use suitable blue/yellow monitoring traps, and remove badly damaged flowers.',
            'Spinetoram, Spinosad',
          ],
          [
            'Spider Mites',
            'Fine yellow speckling, bronzing, leaf drying, and sometimes fine webbing on leaf undersides.',
            'Inspect leaf undersides, reduce dust where practical, and avoid conditions that favor mite outbreaks.',
            'Abamectin, Hexythiazox',
          ],
          [
            'Caterpillars',
            'Irregular holes in leaves, chewed buds, and damaged petals with visible larvae or droppings.',
            'Handpick larvae where feasible, remove heavily damaged plant material, and monitor for fresh feeding.',
            'Chlorantraniliprole, Bacillus thuringiensis (Bt)',
          ],
        ],
      },
      {
        title: 'Major Rose Diseases - Symptoms & Management',
        badge: 'Disease Management',
        theme: 'rose',
        headers: [
          'Disease Name',
          'Common Symptoms & Field Identification',
          'Cultural & Preventive Management',
          'Recommended Fungicides / Actives',
        ],
        rows: [
          [
            'Powdery Mildew',
            'White powdery growth on leaves, shoots, and buds; leaves may curl or become distorted.',
            'Improve airflow, avoid excessive nitrogen fertilization, and remove heavily infected material.',
            'Sulphur, Myclobutanil, Propiconazole',
          ],
          [
            'Black Spot',
            'Dark, roughly circular leaf spots, often surrounded by yellowing; premature leaf fall may occur.',
            'Remove fallen infected leaves, avoid overhead irrigation where possible, and maintain good canopy airflow.',
            'Mancozeb, Copper-based fungicides',
          ],
          [
            'Downy Mildew',
            'Angular reddish-purple to brown leaf lesions, sometimes with grey fungal growth on leaf undersides under humid conditions.',
            'Reduce prolonged leaf wetness, improve ventilation, and remove infected plant debris promptly.',
            'Metalaxyl-based products, Dimethomorph, Mancozeb',
          ],
          [
            'Botrytis Flower Blight (Grey Mould)',
            'Brown or rotting petals and buds; grey fuzzy fungal growth may develop in humid conditions.',
            'Remove affected flowers, reduce humidity and condensation in polyhouses, and avoid prolonged flower wetness.',
            'Disease-specific fungicides (e.g., Iprodione, Fenhexamid)',
          ],
          [
            'Dieback & Stem Canker',
            'Shoots drying from the tip, dark stem lesions, or dead sections of branches following pruning.',
            'Prune affected stems back to healthy tissue when appropriate, disinfect tools between affected plants, and remove infected wood.',
            'Copper Oxychloride / Pastes on pruned cuts',
          ],
        ],
      },
      {
        title: 'Common Rose Nutrient & Physiological Disorders',
        badge: 'Nutrition & Disorders',
        theme: 'sky',
        headers: [
          'Problem / Disorder',
          'Possible Symptoms & Visual Signs',
          'General Management & Corrective Actions',
        ],
        rows: [
          [
            'Nitrogen Deficiency',
            'Older leaves become pale green or yellow; overall weak growth and thin stems.',
            'Review fertilizer programme and soil test; apply balanced nitrogen split doses.',
          ],
          [
            'Iron Deficiency',
            'Young leaves turn yellow (chlorosis) while veins remain greener; stunted growth.',
            'Check soil pH, root health, and irrigation-water quality. Apply chelated iron (Fe-EDTA) foliar spray.',
          ],
          [
            'Magnesium Deficiency',
            'Older leaves show interveinal yellowing (chlorosis between veins), starting from margins.',
            'Confirm deficiency via leaf analysis before applying Magnesium Sulfate (Epsom salt).',
          ],
          [
            'Water Stress',
            'Wilting, poor growth, premature bud drop, or reduced flower opening quality.',
            'Check soil moisture, field drainage, drip irrigation uniformity, and watering schedule.',
          ],
          [
            'Poor Flower Quality',
            'Small buds, short stems, blind shoots, or uneven flower development and color.',
            'Review overall crop nutrition, light availability, ambient temperature, pruning timing, and pest pressure.',
          ],
        ],
      },
    ],
  },

  // =========================================================================
  // 2. CHRYSANTHEMUM
  // =========================================================================
  {
    id: 'chrysanthemum',
    name: 'Chrysanthemum',
    category: 'Floriculture & Commercial Loose / Cut Flowers',
    tagline:
      'Complete Chrysanthemum Cultivation Stages, Integrated Pest Management, Field Disease Control & Physiological Disorders',
    sections: [
      {
        title: 'Chrysanthemum Cultivation Stages & Growth Guide',
        badge: 'Cultivation & Growth Stages',
        theme: 'emerald',
        headers: [
          'Stage Name',
          'Key Objectives & Activities',
          'Field Management & Best Practices',
          'Critical Monitoring Points',
        ],
        rows: [
          [
            'Land Preparation',
            'Select sunny field with good drainage; test soil pH, EC, and nutrient status; remove weeds and crop residues.',
            'Prepare fine tilth and raised beds where drainage is required. Incorporate well-decomposed FYM based on soil test.',
            'Soil pH/EC level, drainage clearance, weed-free bed preparation.',
          ],
          [
            'Planting & Establishment',
            'Select healthy, disease-free cuttings suited to variety/market; follow recommended spacing.',
            'Plant carefully and irrigate immediately post-planting. Gap-fill dead/weak plants promptly.',
            'Uniform plant establishment, early pest symptoms, root establishment.',
          ],
          [
            'Vegetative Growth',
            'Maintain even soil moisture; balance crop nutrition; avoid excessive nitrogen.',
            'Apply fertilizers based on soil test and crop stage. Remove weeds and monitor shoot vigor.',
            'Leaf color, shoot growth, presence of aphids/thrips/mites/leaf spot.',
          ],
          [
            'Pinching & Plant Shaping',
            'Pinch growing tips to encourage branching for spray varieties; maintain plant frame.',
            'Remove weak, damaged, or diseased shoots. Maintain plant density for good airflow.',
            'Correct timing for pinching, canopy airflow, elimination of weak stems.',
          ],
          [
            'Bud Formation & Flowering',
            'Maintain balanced nutrition and regular irrigation during bud emergence and flowering.',
            'Monitor flower quality, size, color, and stem strength. Apply targeted protection only after diagnosis.',
            'Thrips/aphids in buds, flower discoloration, bud rot, uniform bloom.',
          ],
          [
            'Harvesting & Postharvest',
            'Harvest flowers at correct maturity; use clean, sharp tools; handle gently.',
            'Grade by stem length, flower size, color, and freshness. Keep hydrated in cool shadow, transport quickly.',
            'Petal damage/bruising, hydration levels, stem length grading, cool-chain.',
          ],
        ],
      },
      {
        title: 'Major Chrysanthemum Pests & Integrated Management',
        badge: 'Pest Diagnostics & IPM',
        theme: 'amber',
        headers: [
          'Pest Common Name',
          'Scientific / Type',
          'Common Symptoms & Field Signs',
          'General & IPM Management Strategies',
        ],
        rows: [
          [
            'Aphids',
            'Aphis gossypii / Macrosiphoniella',
            'Clusters of insects on tender shoots and leaf undersides, curled leaves, stunted growth, distorted flowers.',
            'Remove heavily infested shoots, control weeds, monitor regularly, conserve beneficial insects (ladybird beetles).',
          ],
          [
            'Thrips',
            'Frankliniella occidentalis / Thrips tabaci',
            'Silvery or brown scars on petals, damaged flower heads, distorted buds, premature flower drop.',
            'Inspect buds, deploy yellow/blue sticky traps for monitoring, remove badly damaged flowers, eliminate host weeds.',
          ],
          [
            'Spider Mites',
            'Tetranychus urticae',
            'Yellow speckling, bronzed leaves, leaf drying, fine webbing on undersides under heavy infestation.',
            'Inspect leaf undersides regularly, manage field dust, confirm mite presence before miticide application.',
          ],
          [
            'Whiteflies',
            'Bemisia tabaci',
            'Small white insects on leaf undersides, leaf yellowing, sticky honeydew secretion, sooty mould growth.',
            'Monitor leaf undersides, place yellow sticky traps, keep borders weed-free, remove affected foliage.',
          ],
          [
            'Leaf Miners',
            'Liriomyza trifolii',
            'Winding white lines or blotchy tunnels inside leaf tissue, premature leaf drop.',
            'Pick and destroy mined leaves in early stage, remove surrounding weed hosts.',
          ],
          [
            'Caterpillars / Flower Feeders',
            'Helicoverpa armigera / Spodoptera',
            'Holes in leaves, chewed buds, eaten petals; visible larvae or dark frass/droppings.',
            'Handpick larvae on small holdings, install pheromone traps for monitoring, clear chewed flowers.',
          ],
          [
            'Bud Borer',
            'Helicoverpa spp.',
            'Holes drilled into flower buds, damaged flower centers, larvae feeding inside developing buds.',
            'Inspect buds regularly during formation stage, pick and destroy infested buds, apply targeted IPM control.',
          ],
          [
            'Nematodes',
            'Meloidogyne / Aphelenchoides',
            'Stunted plants, poor vigor, patchy wilting during hot periods, swollen or damaged roots.',
            'Use clean, certified planting material, practice crop rotation, obtain lab root/soil diagnosis before planting.',
          ],
        ],
      },
      {
        title: 'Major Chrysanthemum Diseases & Field Control',
        badge: 'Disease Management',
        theme: 'rose',
        headers: [
          'Disease Name',
          'Causal Agent Type',
          'Common Symptoms & Visual Identification',
          'Cultural & Preventive Management',
        ],
        rows: [
          [
            'Wilt',
            'Fungal (Fusarium spp.)',
            'Yellowing of leaves, drooping shoots, poor vigor, progressive plant collapse.',
            'Use healthy cuttings, ensure well-drained soil, avoid waterlogging, rogue out diseased plants.',
          ],
          [
            'Root Rot / Stem Rot',
            'Fungal (Pythium / Rhizoctonia)',
            'Brown or rotting roots, darkened stem base at soil line, sudden wilting and plant death.',
            'Ensure excellent field drainage, avoid over-watering, use sanitized growing media and clean cuttings.',
          ],
          [
            'Rust / White Rust',
            'Fungal (Puccinia horiana / chrysanthemi)',
            'Rust-colored or pale raised pustules on leaf undersides; yellowing and drying on upper surface.',
            'Remove infected leaves immediately, avoid overhead sprinkling, improve crop canopy aeration.',
          ],
          [
            'Septoria / Leaf Spots',
            'Fungal (Septoria chrysanthemella)',
            'Brown or dark circular leaf spots, yellow halos, premature leaf drying from bottom upwards.',
            'Collect and destroy fallen infected leaves, improve plant spacing, avoid unnecessary leaf wetness.',
          ],
          [
            'Powdery Mildew',
            'Fungal (Oidium chrysanthemi)',
            'White powdery fungal growth on upper leaf surfaces and shoots; leaf curling and drying.',
            'Maintain adequate spacing, avoid excessive nitrogen fertilization, clear infected crop debris.',
          ],
          [
            'Grey Mould / Botrytis',
            'Fungal (Botrytis cinerea)',
            'Brown soft rotting of petals and buds; grey fuzzy fungal growth in humid conditions.',
            'Remove rotting flower heads promptly, reduce humidity around crop, avoid free water on flowers.',
          ],
          [
            'Bacterial Blight',
            'Bacterial (Erwinia / Pseudomonas)',
            'Water-soaked lesions on stems/leaves, stem darkening, foul rot, rapid wilting.',
            'Use certified disease-free cuttings, sanitize tools, avoid field work when plants are wet.',
          ],
          [
            'Viral Diseases',
            'Virus (TSWV / CSVd / CMV)',
            'Mosaic patterns, mottled leaves, severe stunting, ring spots, distorted flowers, uneven bloom color.',
            'Plant virus-indexed material, rogue infected plants immediately, control vectors (thrips/aphids).',
          ],
        ],
      },
      {
        title: 'Nutrient Management & Physiological Disorders',
        badge: 'Nutrition & Disorders',
        theme: 'sky',
        headers: [
          'Nutrient / Disorder',
          'Type',
          'Key Deficiency / Disorder Symptoms',
          'Corrective & Preventive Actions',
        ],
        rows: [
          [
            'Nitrogen (N) Deficiency',
            'Primary Nutrient',
            'Pale green to light yellow older leaves, thin stems, stunted vegetative growth.',
            'Apply balanced N dose as per soil test; split applications during vegetative growth.',
          ],
          [
            'Nitrogen (N) Excess',
            'Nutrient Imbalance',
            'Overly lush, dark green soft growth, weak stems, delayed flowering, high pest susceptibility.',
            'Reduce N fertigation; balance with adequate Potassium and Phosphorus.',
          ],
          [
            'Phosphorus (P) Deficiency',
            'Primary Nutrient',
            'Dull dark green foliage with purplish tinge on leaf undersides/stems, weak root growth.',
            'Apply basal phosphatic fertilizer (SSB/DAP) during bed preparation.',
          ],
          [
            'Potassium (K) Deficiency',
            'Primary Nutrient',
            'Marginal leaf scorching/browning starting on older leaves, weak flower stems.',
            'Apply Potassium Sulfate or MOP in split doses prior to bud formation.',
          ],
          [
            'Iron (Fe) Chlorosis',
            'Micro-nutrient',
            'Interveinal chlorosis (yellowing between veins) on young top leaves.',
            'Foliar spray of Fe-EDTA or Ferrous Sulfate; correct alkaline soil pH.',
          ],
          [
            'Calcium (Ca) Deficiency',
            'Secondary Nutrient',
            'Tip burn on young leaves, weak pedicels, flower stem collapse, distorted buds.',
            'Maintain soil moisture; apply CalMag/Calcium Nitrate during active growth.',
          ],
          [
            'Crown Budding',
            'Physiological',
            'Premature formation of crown buds instead of normal vegetative growth.',
            'Ensure proper daylength/lighting management; avoid cold stress in nursery.',
          ],
          [
            'Petal Scorch / Sunscald',
            'Environmental',
            'Browning and drying of outer ray florets exposed to high heat and direct sun.',
            'Use shade net structures during peak summer; maintain optimal misting/humidity.',
          ],
        ],
      },
    ],
  },

  // =========================================================================
  // 3. POMEGRANATE
  // =========================================================================
  {
    id: 'pomegranate',
    name: 'Pomegranate',
    category: 'Orchard & Fruit Crops (Bhagwa / Kesar)',
    tagline:
      'Complete Pomegranate Orchard Management, Bahar Regulation, Pest & Bacterial Blight (Teliya) Control, and Physiological Disorders',
    sections: [
      {
        title: 'Pomegranate Cultivation Stages & Growth Guide',
        badge: 'Cultivation & Growth Stages',
        theme: 'emerald',
        headers: [
          'Activity / Stage',
          'General Guidance & Practices',
          'Farmer Verification Check',
        ],
        rows: [
          [
            'Climate & Location',
            'Generally suited to warm, semi-arid conditions; excessive humidity and rainfall can increase disease pressure (especially Bacterial Blight / Teliya).',
            'Is the orchard exposed to prolonged humidity or heavy rainfall?',
          ],
          [
            'Soil Management',
            'Prefer well-drained soil (loamy to sandy loams). Assess soil pH (6.5 - 7.5), EC (<1.0 dS/m), salinity, and nutrient status before planting.',
            'What is the soil type, pH, and EC level?',
          ],
          [
            'Land Preparation',
            'Clear weeds, prepare planting pits (60cm x 60cm x 60cm) or raised beds according to local recommendations, and ensure good field drainage.',
            'Is field drainage adequate and pits enriched with organic compost?',
          ],
          [
            'Variety Selection',
            'Bhagwa (Kesar) is widely grown commercially; choose a variety suited to local climate, market demand, and bacterial blight tolerance.',
            'What is the selected variety name and nursery certification status?',
          ],
          [
            'Planting Material',
            'Use healthy, true-to-type air-layerings (gootee) or tissue-cultured plants from a reliable, certified nursery.',
            'What is the nursery source, certification, and plant health condition?',
          ],
          [
            'Spacing & Layout',
            'Follow local recommendations based on variety, soil, canopy system, and production practices (e.g., 4.5m x 3m or 5m x 4m).',
            'What is the spacing between plants and rows?',
          ],
          [
            'Irrigation Management',
            'Use drip irrigation where suitable. Maintain reasonably consistent soil moisture and strictly avoid waterlogging or sudden moisture fluctuations.',
            'What is the irrigation method, schedule, and drip emitter status?',
          ],
          [
            'Nutrition & Fertigation',
            'Plan manure and fertilizers according to plant age, crop load, soil tests, petiole analysis, and irrigation water quality.',
            'Is a soil/petiole test available for fertigation planning?',
          ],
          [
            'Training & Pruning',
            'Maintain a suitable multi-stem (3-4 stems) canopy system; remove unwanted suckers, criss-cross branches, and diseased/dead wood regularly.',
            'What is the pruning frequency and canopy sanitation record?',
          ],
          [
            'Weed Management',
            'Control weeds through mulching or mechanical weeding, and maintain overall orchard hygiene to reduce pest harbors.',
            'What is the weed pressure and orchard sanitation status?',
          ],
          [
            'Bahar Management',
            'Plan flowering/even-year harvest management (Haste Bahar, Ambe Bahar, or Mrig Bahar) according to water availability, market prices, and disease risk.',
            'Which Bahar is selected and what is the current crop stage?',
          ],
          [
            'Harvesting & Postharvest',
            'Harvest at full maturity based on fruit colour, rind characteristics, metallic sound on tapping, and market requirements.',
            'What are the maturity indicators and intended target market?',
          ],
        ],
      },
      {
        title: 'Major Pomegranate Pests - Symptoms & Management',
        badge: 'Pest Diagnostics & IPM',
        theme: 'amber',
        headers: [
          'Pest Common Name',
          'Common Symptoms & Field Signs',
          'General / Non-Chemical Management',
          'Active Ingredients / Options to Evaluate',
        ],
        rows: [
          [
            'Anar Butterfly / Fruit Borer',
            'Entry holes in fruits, internal rotting/excreta on fruit surface, damaged seeds, and premature fruit drop.',
            'Inspect orchard regularly; remove and destroy infested fruits; maintain orchard sanitation; consider fruit bagging (butter paper) where practical.',
            'Spinosad, Chlorantraniliprole, Emamectin Benzoate',
          ],
          [
            'Thrips',
            'Silvery or browned patches, corky scab on young fruits and flowers, leaf curling, and flower drop.',
            'Monitor tender shoots and young fruits; manage weeds that harbour thrips; protect/encourage beneficial insects.',
            'Spinetoram, Cyantraniliprole, Solitary Spinosad',
          ],
          [
            'Whiteflies',
            'Small white insects on leaf undersides, leaf yellowing, sticky honeydew secretion, and sooty mould growth.',
            'Inspect leaf undersides; remove heavily infested plant material where practical; deploy yellow sticky traps; conserve natural enemies.',
            'Cyantraniliprole or other approved option',
          ],
          [
            'Mealybugs',
            'White cottony-like clusters on shoots, leaves, or fruits; sticky honeydew and stunted vegetative growth.',
            'Remove/heavily trim infested plant parts where practical; manage ants where appropriate; control weeds; conserve natural enemies.',
            'Biological controls such as Cryptolaemus montrouzieri; Buprofezin, Spirotetramat',
          ],
          [
            'Aphids',
            'Clusters on tender shoots/buds, curled leaves, and sticky honeydew.',
            'Monitor new growth; remove/trim localized affected shoots where practical; conserve beneficial insects.',
            'Acetamiprid, Flonicamid',
          ],
          [
            'Stem / shot-hole borers',
            'Holes in stems or branches, frass, tunnelling and branch drying or decline.',
            'Inspect trunks and branches; remove badly damaged wood where appropriate; maintain plant vigour; obtain expert identification.',
            'Do stem swabbing/pasting with a solution of red soil or red oxide 3 to 4 kg dissolved in 10 litres of water and mixed along with 30 gm COC, 30 ml of chlorpyriphos/marshal and 20 ml of neem oil. This will help in management of stem borer and shoot hole borer',
          ],
          [
            'Fruit flies / other fruit-damaging insects',
            'Punctures, internal damage, softening and fruit decay; symptoms may have other causes.',
            'Confirm pest; remove damaged fruits; maintain orchard hygiene; use appropriate monitoring traps when recommended.',
            'Pest-specific trapping and approved control measures after identification.',
          ],
        ],
      },
      {
        title: 'Major Pomegranate Diseases - Symptoms & Management',
        badge: 'Disease Management',
        theme: 'rose',
        headers: [
          'Disease Name',
          'Common Symptoms & Identification',
          'General Management & Cultural Control',
          'Active Ingredients / Fungicide Options',
        ],
        rows: [
          [
            'Bacterial Blight (Teliya)',
            'Dark, water-soaked or angular spots on leaves, stems, flowers, and dark oily split cracks on fruits.',
            'Use healthy planting material; remove infested leaves/branches; sanitize secateurs; minimize spray mist spread; rogue out severely infected plants.',
            'Bordeaux mixture (0.5%), Copper Hydroxide, Streptomycin Sulfate + Tetracycline (where approved)',
          ],
          [
            'Anthracnose',
            'Dark leaf spots, fruit lesions, and brown or dark fruit rot spots.',
            'Remove infected shoots/fruits; maintain canopy airflow; avoid prolonged leaf wetness; confirm diagnosis.',
            'Mancozeb, Azoxystrobin, Difenoconazole',
          ],
          [
            'Fruit Rot / Heart Rot',
            'Brown or blackened internal arils, softening, and decayed fruit quality.',
            'Remove rotting fruits; prevent fruit injury during weeding/pruning; maintain drainage; reduce excessive canopy moisture.',
            'Tebuconazole, Azoxystrobin, Copper formulations',
          ],
          [
            'Alternaria / Cercospora Leaf & Fruit Spot',
            'Brown to dark leaf spots, yellowing, premature leaf fall, and fruit blemishes.',
            'Improve canopy airflow; remove infected debris; avoid prolonged leaf wetness.',
            'Mancozeb, Difenoconazole, Chlorothalonil',
          ],
          [
            'Wilt (Fusarium / Ceratocystis)',
            'Yellowing, wilting, branch drying, and progressive plant decline; internal stem vascular browning.',
            'Check irrigation, drainage, and root health; avoid waterlogging; use qualified diagnostic labs to examine roots or vascular tissue.',
            'Drench with Carbendazim, Propiconazole, or Trichoderma harzianum (for early stage). Management practices for wilt should be carried out ONLY when the vine infection is <25%. If infection >25%, chemical control is ineffective; rogue and burn plant.',
          ],
        ],
      },
      {
        title: 'Common Pomegranate Nutrient & Physiological Disorders',
        badge: 'Nutrition & Disorders',
        theme: 'sky',
        headers: [
          'Problem / Disorder',
          'Category',
          'Common Symptoms / Possible Causes',
          'General Management & Corrective Actions',
        ],
        rows: [
          [
            'Nitrogen Deficiency',
            'Primary Nutrient',
            'Pale yellow leaves and weak shoot growth.',
            'Review nitrogen supply, plant age, and soil test results before adjusting dosage.',
          ],
          [
            'Potassium Deficiency',
            'Primary Nutrient',
            'Poor fruit development/quality, dull rind color, sometimes marginal leaf scorching.',
            'Assess potassium status and crop load before changing fertigation schedule.',
          ],
          [
            'Iron Deficiency',
            'Micro-nutrient',
            'Yellowing of young leaves while veins remain green (interveinal chlorosis).',
            'Check soil pH, drainage, and irrigation water quality. Apply Ferrous Sulfate / Fe-EDTA foliar spray.',
          ],
          [
            'Boron Deficiency / Imbalance',
            'Micro-nutrient',
            'Poor fruit development, internal aril discoloration, fruit cracking, or brittle shoots.',
            'Confirm deficiency before application; apply Solubor (20% Boron) @ 1g/L spray.',
          ],
          [
            'Fruit Cracking',
            'Physiological',
            'Splits in fruit rind often associated with moisture fluctuations, weather stress, or Calcium/Boron deficiency.',
            'Maintain consistent soil moisture; assess maturity; inspect for disease; apply Calcium Nitrate + Boron.',
          ],
          [
            'Sunburn / Sunscald',
            'Environmental',
            'Discolored or damaged brownish skin on exposed fruit surfaces.',
            'Maintain suitable canopy cover; use paper bagging or kaolin spray protection during peak summer.',
          ],
          [
            'Fruit Drop',
            'Physiological / Pest',
            'Premature fruit fall during flower/setting stage.',
            'Assess irrigation, pollination, nutrition, weather, and thrips/borer pest pressure.',
          ],
          [
            'Small Fruit / Poor Colour',
            'Quality Issue',
            'Underdeveloped size, uneven color, or low market value.',
            'Review thinning, maturity stage, crop load, irrigation, and potassium/boron fertigation.',
          ],
        ],
      },
    ],
  },

  // =========================================================================
  // 4. GRAPE
  // =========================================================================
  {
    id: 'grape',
    name: 'Grape',
    category: 'Viticulture & Commercial Table / Wine / Raisin Grapes',
    tagline:
      'Complete Vineyard Setup, April & October Pruning, GA3 Berry Management, Pest & Disease Protocols, and Physiological Disorders',
    sections: [
      {
        title: 'Grape Cultivation Stages & Growth Guide',
        badge: 'Cultivation & Growth Stages',
        theme: 'emerald',
        headers: [
          'Stage Name',
          'Key Objectives & Activities',
          'Field Management & Best Practices',
          'Farmer Verification Check',
        ],
        rows: [
          [
            'Land Prep & Vineyard Setup',
            'Select well-drained deep loamy/sandy-loam soil; test soil pH (6.5-7.5) and EC (<1.0 dS/m). Install trellis support structure (Bower/Y-trellis).',
            'Plow deep, dig trenches (90 cm width x 90 cm depth), fill with FYM, green manure, and basal P&K. Install drip irrigation network.',
            'Is the soil drainage tested, trellis structure sturdy, and drip line uniform?',
          ],
          [
            'Planting & Rootstock Establishment',
            'Plant rooted cuttings or grafted rootstocks (e.g., Dogridge, Salt Creek) suited to salinity/drought conditions of Karnataka.',
            'Plant at recommended spacing (e.g., 10ft x 6ft or 8ft x 5ft). Irrigate immediately and train young shoot up the bamboo stake to trellis wire.',
            'Are rootstocks establishing uniformly and trained straight to the wire?',
          ],
          [
            'April Pruning (Foundation Pruning)',
            'Prune back shoots to 1-2 buds (back pruning) after harvest (April-May) to build vegetative canopy and store food reserves.',
            'Apply balanced NPK, organic manure, and micronutrients. Train sub-canes and pinch growing tips at 4-5 leaves to induce secondary branches.',
            'Is cane diameter thick (8-10 mm) with well-developed mature buds?',
          ],
          [
            'October Pruning (Forward/Fruit Pruning)',
            'Prune canes to 5-9 buds (fruit pruning) in October to induce flowering and fruit load.',
            'Apply Hydrogen Cyanamide (dormancy breaker) on buds for uniform sprouting. Manage initial shoot growth and remove unwanted weak shoots.',
            'Are buds breaking uniformly across all canes within 10-14 days?',
          ],
          [
            'Flowering, Berry Set & Thinning',
            'Manage canopy microclimate, apply GA3 (Gibberellic Acid) for berry elongation and cluster loosening as per variety protocols.',
            'Perform manual cluster thinning, shoot tipping, and leaf removal around clusters to improve sunlight penetration and spray coverage.',
            'Are clusters loose, uniform, and free of flower/berry drop?',
          ],
          [
            'Berry Development & Veraison',
            'Ensure adequate Potassium and water balance during berry enlargement and sugar accumulation (veraison stage).',
            'Monitor TSS (Brix), manage irrigation to prevent berry cracking, protect clusters from bird damage and sunburn using paper covers.',
            'Are berries reaching target TSS (°Brix) and uniform color without splitting?',
          ],
          [
            'Harvesting & Postharvest',
            'Harvest bunches based on market requirement (°Brix > 16-18 for table grapes, acidity balance for wine/raisin).',
            'Use clean, sharp shears; clip stems carefully. Place in corrugated boxes with SO2 (Sulfur Dioxide) pads for cold storage transport.',
            'Are bunches free of powdery mildew, bruising, or berry shattering?',
          ],
        ],
      },
      {
        title: 'Major Grape Pests - Symptoms & Management',
        badge: 'Pest Diagnostics & IPM',
        theme: 'amber',
        headers: [
          'Pest Common Name',
          'Common Symptoms & Field Signs',
          'Cultural & IPM Management',
          'Recommended Chemical / Actives',
          'Further Action & Notes',
        ],
        rows: [
          [
            'Thrips',
            'Silvery/scabby patches on leaves and berries, berry scarring, leaf curling, distorted shoot growth.',
            'Deploy blue sticky traps, keep vineyard weed-free, avoid water stress during berry set stage.',
            'Spinetoram, Fipronil, Imidacloprid',
            'Critical window: Pre-bloom to berry set (3-5mm berry stage). Rotate chemical classes to prevent resistance.',
          ],
          [
            'Mealybugs',
            'White cottony masses on bark, trunk, canes, and berry bunches; honey-dew secretion with sooty mould development.',
            'De-bark main trunk and arms during foundation pruning, release predator Cryptolaemus beetles, apply sticky bands on trunk.',
            'Buprofezin, Spirotetramat, Chlorpyrifos (bark drench)',
            'Drench trunk base and bark thoroughly. Avoid late sprays near harvest to prevent chemical residue on fruit.',
          ],
          [
            'Flea Beetle',
            'Holes in emerging buds during bud burst post-October pruning; complete destruction of sprouting buds.',
            'Shake vines over sticky sheets in early morning to collect beetles; clean loose bark.',
            'Lambda-cyhalothrin, Imidacloprid',
            'Crucial during initial bud sprouting (Days 3 to 15 post-pruning).',
          ],
          [
            'Spider Mites',
            'Bronzing/browning of leaves, fine webbing on lower leaf surfaces, premature leaf drop in summer.',
            'Maintain adequate soil moisture, minimize dust on field roads, conserve predatory mites.',
            'Abamectin, Hexythiazox, Spiromesifen',
            'Inspect leaf undersides during hot, dry spells (March-May).',
          ],
          [
            'Caterpillars / Spodoptera',
            'Chewed leaves, defoliation, holes in developing berries and cluster stems.',
            'Handpick larvae, use pheromone traps for monitoring, spray Bt (Bacillus thuringiensis).',
            'Emamectin Benzoate, Chlorantraniliprole',
            'Monitor tender shoot growth post-pruning.',
          ],
        ],
      },
      {
        title: 'Major Grape Diseases - Symptoms & Management',
        badge: 'Disease Management',
        theme: 'rose',
        headers: [
          'Disease Name',
          'Common Symptoms & Field Identification',
          'Cultural & Preventive Management',
          'Recommended Fungicides / Actives',
          'Further Action & Diagnosis Notes',
        ],
        rows: [
          [
            'Downy Mildew',
            'Oily/yellow spots on upper leaf surface, white cottony fungal down on undersides; infected flowers/berries turn brown and dry up.',
            'Improve canopy ventilation, ensure proper drainage, remove low-hanging foliage, avoid leaf wetness during humid weather.',
            'Kresoxim-methyl, Dimethomorph, Cymoxanil + Mancozeb, Copper Hydroxide',
            'Severe threat during high humidity/rain post-October pruning. Spray immediately after rains.',
          ],
          [
            'Powdery Mildew',
            'White grey powdery growth on leaves, shoots, and berries; berry cracking, hardening, and failure to ripen.',
            'Train canopy for good sunlight penetration, remove dense foliage, maintain balanced nitrogen application.',
            'Azoxystrobin, Myclobutanil, Penconazole, Sulphur (WP)',
            'Prevalent during dry, cool weather with high humidity (Nov-Jan). Sulfur application restricted above 35°C.',
          ],
          [
            'Anthracnose',
            'Dark brown circular sunken spots ("bird\'s eye" lesions) on leaves, shoots, and berries; stem cankers and vine dieback.',
            'Prune and burn infected shoots during April pruning; spray copper paste on pruning cuts.',
            'Carbendazim, Copper Oxychloride, Dithianon, Pyraclostrobin',
            'Common during early monsoon/warm wet conditions post-foundation pruning.',
          ],
          [
            'Bacterial Leaf Spot / Canker',
            'Water-soaked angular spots on leaves, black streaks on stems, longitudinal cracking of canes and shoots.',
            'Use disease-free planting material, sanitize secateurs with alcohol/bleach between vines, remove diseased canes.',
            'Streptomycin Sulfate + Tetracycline, Copper Hydroxide',
            'Bacterial pathogen (Xanthomonas ampelina); strictly avoid overhead irrigation.',
          ],
          [
            'Botrytis Bunch Rot',
            'Soft brown rotting of berries near maturity, grey mould growth under high moisture/rain during harvest.',
            'Keep clusters well-aerated, manage cluster density using GA3 thinning, handle bunches carefully.',
            'Iprodione, Fenhexamid, Pyrimethanil',
            'Apply preventive sprays before cluster closure and veraison if rain is forecasted.',
          ],
        ],
      },
      {
        title: 'Common Grape Nutrient & Physiological Disorders',
        badge: 'Nutrition & Disorders',
        theme: 'sky',
        headers: [
          'Problem / Disorder',
          'Possible Symptoms & Visual Signs',
          'General Management & Corrective Actions',
        ],
        rows: [
          [
            'Nitrogen Deficiency',
            'Pale yellow leaves starting from older foliage, reduced shoot growth, thin canes.',
            'Apply split fertigation of Urea / Ammonium Nitrate based on petiole test.',
          ],
          [
            'Potassium Deficiency',
            'Marginal scorching and browning of leaves ("leaf burn"), poor berry color and low sugar (°Brix).',
            'Fertigate Potassium Sulfate (SOP) during berry growth and veraison stages.',
          ],
          [
            'Magnesium Deficiency',
            'Interveinal chlorosis on older leaves (yellowing between main veins while veins stay green).',
            'Foliar spray of Magnesium Sulfate (0.5-1.0%) post-pruning and during berry development.',
          ],
          [
            'Boron Deficiency',
            'Hen and Chicken disorder (small seedless berries mixed with normal ones), death of shoot tips.',
            'Apply Solubor / Borax (foliar spray at pre-bloom and post-set) based on soil/petiole analysis.',
          ],
          [
            'Zinc Deficiency',
            'Little leaf disorder, reset growth, broad terminal sinus on leaves, poor berry set.',
            'Foliar spray of Zinc Sulfate (0.2%) prior to flowering stage.',
          ],
          [
            'Berry Cracking / Splitting',
            'Longitudinal cracks on berries during maturity due to sudden rain or uneven irrigation.',
            'Maintain uniform soil moisture; apply Calcium Nitrate + Boron during berry growth.',
          ],
          [
            'Pink Berry Disorder',
            'White grape varieties turning pinkish due to high night temperatures or uneven light exposure.',
            'Use cluster shading nets/paper covers; maintain balanced canopy microclimate.',
          ],
        ],
      },
    ],
  },
];

