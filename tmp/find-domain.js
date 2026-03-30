
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const domain = await prisma.domain.findFirst();
  if (domain) {
    console.log('Valid Domain ID for testing:', domain.id);
  } else {
    console.log('No domains found in the database. Please create one in the dashboard.');
  }
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
