const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://agrim141:0NgfZ4jLnnZQeCPfGsuRAPG8U@168.119.64.101:5432/agrim141',
    },
  },
});

async function main() {
  console.log('--- Testing PostgreSQL Connection ---');
  console.log('Host: 168.119.64.101:5432');
  console.log('DB: agrim141');
  console.log('User: agrim141');

  try {
    const info = await prisma.$queryRawUnsafe('SELECT current_database(), current_user, version()');
    console.log('SUCCESS! Server response:', info);

    const tables = await prisma.$queryRawUnsafe("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    console.log(`Found ${tables.length} tables in public schema:`);
    tables.forEach(t => console.log(' - ' + t.table_name));

  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
