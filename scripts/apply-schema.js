const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://agrim141:0NgfZ4jLnnZQeCPfGsuRAPG8U@168.119.64.101:5432/agrim141',
    },
  },
});

async function main() {
  console.log('Connecting to PostgreSQL database agrim141 on 168.119.64.101...');

  const sqlContent = fs.readFileSync('scripts/init-schema.sql', 'utf8');

  // Split SQL commands by semicolon at the end of lines
  const rawStatements = sqlContent
    .split(/;\s*[\r\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  console.log(`Loaded ${rawStatements.length} SQL statements to execute.`);

  let successCount = 0;
  let skipCount = 0;

  for (let i = 0; i < rawStatements.length; i++) {
    const stmt = rawStatements[i];
    // Ignore pure comments
    if (stmt.startsWith('--')) continue;

    try {
      await prisma.$executeRawUnsafe(stmt);
      successCount++;
      if (successCount % 10 === 0 || i === rawStatements.length - 1) {
        console.log(`Executed ${i + 1}/${rawStatements.length} statements...`);
      }
    } catch (err) {
      // If type or table already exists, log and continue
      if (err.message && (err.message.includes('already exists') || err.message.includes('duplicate key'))) {
        skipCount++;
      } else {
        console.error(`Error executing statement #${i + 1}:`, stmt.substring(0, 100));
        console.error('Details:', err.message);
      }
    }
  }

  console.log(`\nCompleted! Successfully executed: ${successCount}, Skipped: ${skipCount}`);

  const tables = await prisma.$queryRawUnsafe(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  );
  console.log(`\nTables in agrim141 database (${tables.length}):`);
  tables.forEach((t) => console.log(' - ' + t.table_name));

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
