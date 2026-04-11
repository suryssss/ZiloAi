const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();
async function main() {
  const customer = await client.customer.findUnique({
    where: { id: '92b4f3bd-7b5f-45ec-a7f0-e4d0c56738a1' },
    select: { domainId: true }
  });
  console.log('Customer Domain:', customer);
}
main().finally(() => client.$disconnect());
