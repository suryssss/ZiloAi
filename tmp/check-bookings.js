const { PrismaClient } = require('@prisma/client');
const client = new PrismaClient();
async function main() {
  const bookings = await client.bookings.findMany();
  console.log('BOOKINGS:', JSON.stringify(bookings, null, 2));
}
main().finally(() => client.$disconnect());
