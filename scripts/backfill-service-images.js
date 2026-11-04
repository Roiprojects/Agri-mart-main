const fs = require('fs');
const path = require('path');

const SERVICE_DEFAULT_IMAGES = {
  'srv-tractor': '/images/gallery/03-tractor-soil.jpg',
  'srv-rotavator': '/images/gallery/04-seed-sowing.jpg',
  'srv-harvesting': '/images/gallery/07-harvesting.jpg',
  'srv-spraying': '/images/banners/hero_service_drone.jpg',
  'srv-cultivation': '/images/gallery/08-farm-equipment.jpg',
  'srv-labour': '/images/gallery/02-farmer-working.jpg',
  'srv-soil-testing': '/images/gallery/05-irrigation.jpg',
  'srv-consultation': '/images/gallery/01-green-fields.jpg',
  'srv-operators': '/images/gallery/09-vegetable-cultivation.jpg',
  'srv-custom-agri': '/images/banners/hero_rental.jpg',
};

const dbPaths = [
  path.join(__dirname, '../data/dev-database.json'),
  path.join(__dirname, '../apps/backend/data/dev-database.json'),
  path.join(__dirname, '../apps/frontend/data/dev-database.json'),
];

dbPaths.forEach((dbPath) => {
  if (fs.existsSync(dbPath)) {
    try {
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (db.services && Array.isArray(db.services)) {
        db.services = db.services.map((s) => ({
          ...s,
          image: s.image || s.imageUrl || SERVICE_DEFAULT_IMAGES[s.id] || '/images/gallery/03-tractor-soil.jpg',
          imageUrl: s.imageUrl || s.image || SERVICE_DEFAULT_IMAGES[s.id] || '/images/gallery/03-tractor-soil.jpg',
        }));
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
        console.log(`Updated services with images in: ${dbPath}`);
      }
    } catch (e) {
      console.error(`Error updating ${dbPath}:`, e.message);
    }
  }
});
