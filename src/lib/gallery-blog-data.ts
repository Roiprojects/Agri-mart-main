import { DbGalleryItem, DbBlogPost, DbBlogReview } from './dev-db';

export function getInitialGalleryAndBlogData(): {
  galleryItems: DbGalleryItem[];
  blogPosts: DbBlogPost[];
  blogReviews: DbBlogReview[];
} {
  const galleryItems: DbGalleryItem[] = [
    {
      id: 'gal-01',
      title: 'Emerald Terraces & Open Fields',
      subject: 'Green agricultural fields',
      caption: 'Lush green agricultural terraces and crop rows thriving during the active vegetative monsoon season.',
      image: '/images/gallery/01-green-fields.jpg',
      photographer: 'Dan Meyers',
      sourceUrl: 'https://unsplash.com/photos/green-grass-field-under-blue-sky-during-daytime-unsplash',
      license: 'Unsplash License (Free commercial & non-commercial use)',
      alt: 'Expansive lush green agricultural fields under open sky',
      displayOrder: 1,
      isPublished: true,
    },
    {
      id: 'gal-02',
      title: 'Morning Crop Inspection',
      subject: 'Farmer working in a field',
      caption: 'Farmer inspecting crop leaf vigor, root moisture, and early growth patterns in dawn sunlight.',
      image: '/images/gallery/02-farmer-working.jpg',
      photographer: 'No One Cares',
      sourceUrl: 'https://unsplash.com/photos/person-in-black-shirt-standing-on-green-grass-field-during-daytime',
      license: 'Unsplash License (Free commercial & non-commercial use)',
      alt: 'Farmer actively working and tending crops in an agricultural field',
      displayOrder: 2,
      isPublished: true,
    },
    {
      id: 'gal-03',
      title: 'Primary Tillage & Deep Ploughing',
      subject: 'Tractor preparing soil',
      caption: 'Heavy tractor turning topsoil to break hard crusts, bury stubble, and establish an aerated seedbed.',
      image: '/images/gallery/03-tractor-soil.jpg',
      photographer: 'Raphael Biscaldi',
      sourceUrl: 'https://unsplash.com/photos/red-tractor-on-green-field',
      license: 'Unsplash License (Free commercial & non-commercial use)',
      alt: 'Red farm tractor cultivating and preparing soil for seasonal sowing',
      displayOrder: 3,
      isPublished: true,
    },
    {
      id: 'gal-04',
      title: 'Precision Sowing & Seedling Establishment',
      subject: 'Seed sowing',
      caption: 'Careful placement of certified seeds into moist, friable soil for optimal root contact and uniform emergence.',
      image: '/images/gallery/04-seed-sowing.jpg',
      photographer: 'Markus Spiske',
      sourceUrl: 'https://unsplash.com/photos/person-holding-green-plant-during-daytime',
      license: 'Unsplash License (Free commercial & non-commercial use)',
      alt: 'Hand and implement sowing seeds and seedlings into rich soil',
      displayOrder: 4,
      isPublished: true,
    },
    {
      id: 'gal-05',
      title: 'Pressurized Irrigation Network',
      subject: 'Irrigation',
      caption: 'Targeted sprinkler and drip irrigation delivering water directly to canopies while preventing runoff losses.',
      image: '/images/gallery/05-irrigation.jpg',
      photographer: 'Etienne Girardet',
      sourceUrl: 'https://unsplash.com/photos/water-sprinkler-on-green-grass-field',
      license: 'Unsplash License (Free commercial & non-commercial use)',
      alt: 'Modern water sprinkler irrigation system watering farm crops',
      displayOrder: 5,
      isPublished: true,
    },
    {
      id: 'gal-06',
      title: 'Crop Protection & Foliar Spraying',
      subject: 'Crop spraying',
      caption: 'Even droplet dispersal across foliage to manage pests and deliver organic bio-nutrients effectively.',
      image: '/images/gallery/06-crop-spraying.jpg',
      photographer: 'James Baltz',
      sourceUrl: 'https://unsplash.com/photos/white-and-red-plane-flying-over-green-grass-field',
      license: 'Unsplash License (Free commercial & non-commercial use)',
      alt: 'Agricultural spraying operation across agricultural fields',
      displayOrder: 6,
      isPublished: true,
    },
    {
      id: 'gal-07',
      title: 'Golden Grain Field Harvest',
      subject: 'Harvesting',
      caption: 'Harvesting mature grain crops during clear dry weather to safeguard grain moisture and quality.',
      image: '/images/gallery/07-harvesting.jpg',
      photographer: 'Kelly Sikkema',
      sourceUrl: 'https://unsplash.com/photos/wheat-field-during-sunset',
      license: 'Unsplash License (Free commercial & non-commercial use)',
      alt: 'Harvesting golden grain crops at the end of a successful crop cycle',
      displayOrder: 7,
      isPublished: true,
    },
    {
      id: 'gal-08',
      title: 'Farm Mechanization & Power Weeders',
      subject: 'Farm equipment',
      caption: 'Modern walk-behind power weeders and multi-crop attachments engineered for inter-cultivation and weed control.',
      image: '/images/gallery/08-farm-equipment.jpg',
      photographer: 'Randy Fath',
      sourceUrl: 'https://unsplash.com/photos/green-tractor-on-green-grass-field',
      license: 'Unsplash License (Free commercial & non-commercial use)',
      alt: 'Modern agricultural power machinery and farm equipment in a field yard',
      displayOrder: 8,
      isPublished: true,
    },
    {
      id: 'gal-09',
      title: 'Horticulture & Vegetable Rows',
      subject: 'Vegetable cultivation',
      caption: 'Raised planting beds and inter-cropped vegetables grown with bio-fertilizers and organic mulch.',
      image: '/images/gallery/09-vegetable-cultivation.jpg',
      photographer: 'Benjamin Davies',
      sourceUrl: 'https://unsplash.com/photos/green-vegetables-on-field',
      license: 'Unsplash License (Free commercial & non-commercial use)',
      alt: 'Lush organic vegetable cultivation in raised garden and farm beds',
      displayOrder: 9,
      isPublished: true,
    },
    {
      id: 'gal-10',
      title: 'Post-Harvest Grain & Seed Storage',
      subject: 'Crop storage',
      caption: 'Dry, well-ventilated warehouse storage and moisture-resistant bags keeping harvest produce safe from spoilage.',
      image: '/images/gallery/10-crop-storage.jpg',
      photographer: 'Peter Miller',
      sourceUrl: 'https://unsplash.com/photos/brown-sacks-on-brown-wooden-shelf',
      license: 'Unsplash License (Free commercial & non-commercial use)',
      alt: 'Well-stored grain sacks in an agricultural storage warehouse',
      displayOrder: 10,
      isPublished: true,
    },
  ];

  const blogPosts: DbBlogPost[] = [
    {
      id: 'post-1',
      slug: 'choosing-farm-equipment-for-your-land',
      title: 'Choosing Farm Equipment for Your Land',
      excerpt:
        'A practical decision guide to evaluate parcel size, soil type, and crop spacing before investing in power tillers, tractors, and attachments.',
      content: `Selecting farm equipment is one of the most significant operational decisions a farmer makes. Investing in the wrong machine can lock up scarce capital, while the right machine dramatically cuts turnaround time between seasons and preserves soil structure.

### 1. Assessing Land Size and Topography
The scale and slope of your land dictate the horsepower and maneuverability required:
- Smallholdings (1 to 3 Acres): Compact walk-behind power weeders (5HP to 7HP) excel in narrow terraced plots, orchards, and fragmented holdings where larger tractors cannot turn.
- Medium Farms (4 to 10 Acres): Multi-speed power tillers and mini-tractors (18HP to 24HP) balance row-crop accessibility with sufficient drawbar pull for rotavators and trailer haulage.
- Large Acreages (10+ Acres): Standard 40HP to 50HP tractors are best suited for deep primary tillage, heavy disk harrowing, and large laser leveling.

### 2. Matching Machinery to Soil Texture
Heavy black cotton soils require equipment with high torque and heat-treated boron blades capable of breaking sticky clods without stalling. In contrast, sandy loam and red soils demand lighter machinery that avoids excessive pulverization.

### 3. Attachment Versatility and Multi-Crop Compatibility
Before purchasing any power unit, evaluate the accessory ecosystem. A versatile power weeder should accommodate interchangeable attachments such as adjustable ridgers, ditchers, paddy wetland cage wheels, and water pump takeoffs.

### Practical Conclusion
Match your equipment choices to your most bottlenecked activity. Starting with versatile, right-sized implements ensures sustainable farm finances and dependable seasonal performance.`,
      author: 'Agri Mart Editorial',
      authorRole: 'Field Mechanization Desk',
      date: '2026-03-10',
      category: 'Equipment Guide',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
      readingTime: '5 min read',
      tags: ['Farm Equipment', 'Power Weeder', 'Tractor', 'Mechanization', 'Land Planning'],
      isPublished: true,
    },
    {
      id: 'post-2',
      slug: 'beginners-guide-to-soil-preparation',
      title: 'A Beginner’s Guide to Soil Preparation',
      excerpt:
        'Master the foundational steps of primary ploughing, organic matter incorporation, moisture management, and fine seedbed preparation.',
      content: `Healthy crops begin long before seeds are placed in the ground. Thorough soil preparation creates a welcoming root zone, balances soil moisture and aeration, and suppresses early weed competition.

### 1. Checking Soil Moisture: The 'Vapsa' Principle
Never till soil when it is saturated or bone dry. If a handful of soil holds together gently into a ball and crumbles cleanly under light thumb pressure, it has reached the ideal moisture window ('Vapsa') for tilling.

### 2. Primary vs. Secondary Tillage
Primary tillage deep-ploughs using a mouldboard or disc plough to invert soil, bury weed residues, and expose pests to sunlight. Secondary tillage uses rotavators or harrows to break clods into a fine tilth.

### 3. Incorporating Organic Matter Early
Apply well-rotted farmyard manure (FYM) or compost at least 15 to 20 days prior to final harrowing to enrich soil microbiology and water-holding capacity.

### Practical Conclusion
A well-aerated, friable seedbed enables swift germination, robust taproot elongation, and uniform crop emergence.`,
      author: 'Agri Mart Editorial',
      authorRole: 'Agronomy & Soil Care Desk',
      date: '2026-03-12',
      category: 'Soil Health',
      image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
      readingTime: '6 min read',
      tags: ['Soil Preparation', 'Ploughing', 'Compost', 'Tillage', 'Seedbed'],
      isPublished: true,
    },
    {
      id: 'post-3',
      slug: 'simple-ways-to-use-water-more-efficiently',
      title: 'Simple Ways to Use Water More Efficiently',
      excerpt:
        'Accessible field strategies including drip scheduling, organic mulching, and night-time irrigation to prevent evaporation losses.',
      content: `Water is increasingly the defining factor for agricultural resilience across peninsular India. Efficient water management does not require complex systems; disciplined practices yield immediate water savings.

### 1. Shifting from Flood to Targeted Drip and Furrow Systems
Traditional flood irrigation loses up to 45% of applied water. Inline drip emitters deliver water directly to crop collars, while alternate furrow watering reduces consumption without sacrificing canopy vigor.

### 2. The Protective Power of Organic Mulching
Covering open soil beds with crop straw, dry leaves, or sugarcane trash retards solar evaporation, buffers roots against heat, and enriches soil organic matter as it decomposes.

### 3. Strategic Scheduling and System Maintenance
Irrigating during early morning or evening hours reduces evaporation losses caused by hot winds. Routine bi-weekly line flushing and filter cleaning guarantee uniform pressure.

### Practical Conclusion
Simple practices like mulching and pressurized drip lines protect crop yields while securing valuable groundwater reserves.`,
      author: 'Agri Mart Editorial',
      authorRole: 'Sustainable Irrigation Desk',
      date: '2026-03-14',
      category: 'Water Management',
      image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80',
      readingTime: '4 min read',
      tags: ['Irrigation', 'Water Efficiency', 'Drip Systems', 'Mulching', 'Sustainability'],
      isPublished: true,
    },
    {
      id: 'post-4',
      slug: 'buying-or-renting-farm-equipment',
      title: 'Buying or Renting Farm Equipment',
      excerpt:
        'A clear cost-per-acre comparison to determine when hiring equipment by the day makes better financial sense than outright purchase.',
      content: `Modern farm machinery promises speed, but purchasing heavy equipment outright can strain seasonal liquidity. Deciding between buying and renting requires an honest appraisal of annual operational hours.

### 1. The 100-Hour Annual Threshold
As a general benchmark, equipment that operates fewer than 80 to 100 hours per calendar year is cheaper to rent. Specialized implements like combine harvesters and laser levelers are best rented; high-frequency tools like power weeders justify direct ownership.

### 2. Factoring Total Cost of Ownership
Purchasing involves capital depreciation, routine parts and oil replacement, and covered storage overhead.

### 3. Advantages of On-Demand Rental
Renting grants immediate access to modern, well-maintained machinery while freeing farm capital for high-quality seeds and soil amendments.

### Practical Conclusion
Calculate your anticipated operational hours and compare rental day rates against annual ownership costs to make the right capital decision.`,
      author: 'Agri Mart Editorial',
      authorRole: 'Farm Economics & Operations',
      date: '2026-03-15',
      category: 'Farm Economics',
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
      readingTime: '5 min read',
      tags: ['Equipment Rental', 'Farm Economics', 'Machinery Budgeting', 'Power Weeder', 'Tools'],
      isPublished: true,
    },
    {
      id: 'post-5',
      slug: 'maintaining-your-sprayer-and-farm-tools',
      title: 'Maintaining Your Sprayer and Farm Tools',
      excerpt:
        'Daily cleanout routines, diaphragm seal checks, nozzle calibration, and seasonal storage steps to keep farm implements lasting for years.',
      content: `Agricultural sprayers and handheld tools protect crop investments, yet chemical residues and prolonged neglect frequently cause premature equipment failure. Routine preventive maintenance safeguards both tools and operator safety.

### 1. The Triple-Rinse Cleanout Rule
Empty leftover solution safely, fill the tank one-third full with fresh water, pump through all lines and nozzles for two minutes, and store the tank inverted to dry.

### 2. Nozzle Care and Calibration
Never clean clogged nozzle orifices using metal wire or nails. Soak in warm water and clean gently with a soft-bristled brush to protect precision spray patterns.

### 3. Battery and Engine Maintenance
Recharge battery sprayers every 30 days during the off-season. For engines, check motor oil levels and clean foam air filters regularly.

### Practical Conclusion
A disciplined 10-minute cleanup routine at the end of each working day prevents costly repairs and doubles the lifespan of farm implements.`,
      author: 'Agri Mart Editorial',
      authorRole: 'Workshop & Maintenance Desk',
      date: '2026-03-16',
      category: 'Maintenance',
      image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
      readingTime: '5 min read',
      tags: ['Sprayer Maintenance', 'Farm Tools', 'Preventive Care', 'Nozzles', 'Workshop'],
      isPublished: true,
    },
    {
      id: 'post-6',
      slug: 'planning-the-seven-stages-of-a-crop-cycle',
      title: 'Planning the Seven Stages of a Crop Cycle',
      excerpt:
        'From basal land prep to post-harvest storage: how aligning your inputs with crop growth milestones ensures higher yields.',
      content: `Successful agriculture relies on synchronized timing. Every crop navigates a predictable biological progression, and applying inputs or mechanization interventions at the exact stage maximizes results.

### 1. Stages 1 & 2: Soil Preparation & Sowing
Deep tillage and organic matter incorporation establish soil tilth. Seed treatment and precise sowing depth ensure uniform germination.

### 2. Stages 3 & 4: Vegetative Vigor & Flowering
Mechanical weeding between days 20 to 45 shatters crusts and conserves moisture. Adequate moisture during flowering prevents bud drop.

### 3. Stages 5, 6 & 7: Fruit Filling, Harvest & Storage
Optimize micronutrients during grain filling. Harvest during dry weather and dry grains below 12% moisture before hermetic warehouse storage.

### Practical Conclusion
Organize your farm calendar around these seven foundational milestones for consistent seasonal productivity.`,
      author: 'Agri Mart Editorial',
      authorRole: 'Crop Advisory Desk',
      date: '2026-03-17',
      category: 'Crop Management',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      readingTime: '6 min read',
      tags: ['Crop Cycle', '7 Stages', 'Crop Guidance', 'Harvesting', 'Farm Management'],
      isPublished: true,
    },
  ];

  return { galleryItems, blogPosts, blogReviews: [] };
}
