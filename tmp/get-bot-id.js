const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const domain = await prisma.domain.findFirst();
  console.log('DOMAIN_ID:', domain ? domain.id : 'NOT_FOUND');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
