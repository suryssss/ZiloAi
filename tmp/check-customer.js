const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const customers = await p.customer.findMany({
    select: {
      id: true,
      email: true,
      questions: {
        select: { id: true, question: true, answered: true }
      }
    },
    take: 5
  });
  console.log('CUSTOMERS:', JSON.stringify(customers, null, 2));
  await p.$disconnect();
}

main().catch(e => { console.log('ERROR:', e.message); p.$disconnect(); });
