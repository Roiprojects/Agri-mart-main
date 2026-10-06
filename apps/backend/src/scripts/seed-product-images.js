const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/dev-database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const productImages = {
  'prod-001': [
    '/images/gallery/08-farm-equipment.jpg',
    '/images/banners/hero_equipment_buy.jpg',
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=800&q=80'
  ],
  'prod-002': [
    '/images/gallery/06-crop-spraying.jpg',
    'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80'
  ],
  'prod-003': [
    '/images/gallery/01-green-fields.jpg',
    'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80'
  ],
  'prod-004': [
    '/images/gallery/02-farmer-working.jpg',
    'https://images.unsplash.com/photo-1592417817098-8f3d6eb2251a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80'
  ],
  'prod-005': [
    '/images/gallery/04-seed-sowing.jpg',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
  ],
  'prod-006': [
    '/images/gallery/05-irrigation.jpg',
    'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80'
  ],
  'prod-1789644257308': [
    '/images/gallery/03-tractor-soil.jpg',
    'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'
  ],
  'prod-1790744671602': [
    '/images/gallery/09-vegetable-cultivation.jpg',
    'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80'
  ],
  'prod-1790744707040': [
    '/images/gallery/10-crop-storage.jpg',
    'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80'
  ],
  'prod-straw-bag-01': [
    '/images/gallery/07-harvesting.jpg',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
  ]
};

// Update product names and descriptions for demo products
const demo1 = db.products.find(p => p.id === 'prod-1790744671602');
if (demo1) {
  demo1.name = 'Solar Powered Pest Light Trap & Insect Catcher';
  demo1.nameKn = 'ಸೌರ ಚಾಲಿತ ಕೀಟ ಬಲೆ';
  demo1.shortDescription = 'Automatic day-night sensor solar light trap for eco-friendly pest control in paddy and cotton.';
  demo1.description = '100% solar powered insect light trap equipped with 12V lithium-ion battery, high-efficiency UV LED light, and auto-cutoff sensor. Controls armyworms, bollworms, and leafhoppers without chemical sprays.';
  demo1.price = 2490;
  demo1.comparePrice = 3200;
  demo1.categoryId = 'cat-protection';
}

const demo2 = db.products.find(p => p.id === 'prod-1790744707040');
if (demo2) {
  demo2.name = 'Heavy-Duty UV Stabilized Agricultural Tarpaulin (24x18 ft, 250 GSM)';
  demo2.nameKn = 'ಕೃಷಿ ಟಾರ್ಪಲಿನ್ ಶೀಟ್';
  demo2.shortDescription = 'Multi-layer 250 GSM waterproof tarpaulin with reinforced brass eyelets for crop & grain storage.';
  demo2.description = 'Heavy-duty 100% virgin HDPE tarpaulin sheet designed for Indian monsoon conditions. Protects harvested paddy, maize, cotton, and farm equipment from heavy rains, mildew, and harsh UV exposure.';
  demo2.price = 1850;
  demo2.comparePrice = 2400;
  demo2.categoryId = 'cat-tools';
}

const strawBag = db.products.find(p => p.id === 'prod-straw-bag-01');
if (strawBag) {
  strawBag.name = 'Kisan Multi-Purpose Harvesting Straw Basket & Bag';
  strawBag.nameKn = 'ಕಟಾವು ಬುಟ್ಟಿ ಮತ್ತು ಚೀಲ';
  strawBag.shortDescription = 'Handwoven durable natural fibre harvesting bag for vegetables, fruits, and field collections.';
  strawBag.description = 'Traditional, reinforced organic woven straw basket crafted for comfortable on-shoulder carrying during chili, tomato, and vegetable picking.';
  strawBag.price = 269;
  strawBag.comparePrice = 349;
  strawBag.categoryId = 'cat-tools';
}

// Clear and rebuild media array
db.media = db.media || [];
const now = new Date().toISOString();

Object.entries(productImages).forEach(([prodId, urls]) => {
  const prod = db.products.find(p => p.id === prodId);
  const prodName = prod ? prod.name : prodId;
  
  // Set images array on product object
  if (prod) {
    prod.images = urls;
  }
  
  // Remove existing media for this product
  db.media = db.media.filter(m => m.productId !== prodId);
  
  // Add fresh media items
  urls.forEach((url, idx) => {
    db.media.push({
      id: `med-${prodId}-${idx + 1}`,
      productId: prodId,
      url: url,
      altText: `${prodName} - Image ${idx + 1}`,
      type: 'IMAGE',
      isPrimary: idx === 0,
      displayOrder: idx + 1,
      createdAt: now
    });
  });
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully updated dev-database.json with all product images and media records!');
