export interface GalleryPhotoType {
  id: string;
  title: string;
  subject: string;
  caption: string;
  image: string;
  photographer: string;
  sourceUrl: string;
  license: string;
  alt: string;
}

export const GALLERY_PHOTOS: GalleryPhotoType[] = [
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
  },
];
