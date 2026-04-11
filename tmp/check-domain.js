const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();
async function main() {
  const domain = await client.domain.findUnique({
    where: { id: 'c1055d91-5146-4bec-a351-58356b2f1739' },
    include: { chatBot: true }
  });
  console.log('Domain:', JSON.stringify(domain, null, 2));
}
main().finally(() => client.$disconnect());
