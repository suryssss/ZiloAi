import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findIds() {
  try {
    const domain = await prisma.domain.findFirst({
        where: { id: '3d464d05-1e1a-43f5-982f-6f3b9c0b0a85' },
        include: { customer: true }
    });

    if (domain) {
      console.log('Domain:', domain.name);
      console.log('Customers found:', domain.customer.length);
      domain.customer.forEach(c => {
          console.log(`- Email: ${c.email}, ID: ${c.id}`);
      });
    } else {
      console.log('Domain not found.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findIds();
