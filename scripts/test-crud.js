const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://agrim141:0NgfZ4jLnnZQeCPfGsuRAPG8U@168.119.64.101:5432/agrim141',
    },
  },
});

async function main() {
  console.log('Testing CRUD operations on remote PostgreSQL (168.119.64.101:5432/agrim141)...');

  // Insert a record into PackageOfPractice
  const testRecord = await prisma.packageOfPractice.create({
    data: {
      slNo: 'TEST-CDF-' + Date.now(),
      vleFpoNo: 'VLE-KA-MND-042',
      district: 'Mandya',
      taluk: 'Maddur',
      villagePanchayat: 'Koppa',
      state: 'Karnataka',
      name: 'Ramesh Kumar',
      mobileNumber: '9876543210',
      emailId: 'ramesh.farmer@example.com',
      address: 'Koppa Village, Maddur Taluk',
      surveyNumber: '142/2A',
      acres: 3.5,
      pinCode: '571425',
      jobWorkLocation: 'Near Maddur canal branch',
      distanceFromVle: 4.5,
      irrigation: ['Borewell', 'Drip'],
      jobWork: ['Soil Preparation', 'Spraying'],
      crop: 'Maize',
      cropCycleDays: 110,
      popAttached: 'Attached (Agri-Mart Digital POP Active)',
      schedule: [
        {
          sownDate: 'Day 0',
          soilPrep: 'Deep summer ploughing',
          manuring: 'DAP 50kg',
          irrigation: 'Pre-sowing flush',
          weedingSchedule: 'Atrazine 1kg',
          sprayingSchedule: 'Chlorantraniliprole 18.5 SC',
          maintenanceSchedule: '60cm x 20cm spacing',
          harvestingSchedule: 'Prepare yard',
        },
      ],
      status: 'SUBMITTED',
    },
  });

  console.log('Successfully created record in PostgreSQL:');
  console.log(' - ID:', testRecord.id);
  console.log(' - Sl.No:', testRecord.slNo);
  console.log(' - Farmer:', testRecord.name);
  console.log(' - Crop:', testRecord.crop);

  // Query back
  const retrieved = await prisma.packageOfPractice.findUnique({
    where: { id: testRecord.id },
  });
  console.log('Successfully queried back from PostgreSQL:', retrieved.slNo);

  // Clean up test record
  await prisma.packageOfPractice.delete({
    where: { id: testRecord.id },
  });
  console.log('Successfully cleaned up test record.');

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
