import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fix() {
  console.log('Creating customer and booking on your actual domain...');

  // Your domain 3d464d05, owned by user_3BpdBrpSAyh8Mw0R8TqQSqAa7cX
  const domainId = '3d464d05-1e1a-43f5-982f-6f3b9c0b0a85';

  // Create a real customer on your domain
  let customer = await prisma.customer.findFirst({
    where: { domainId, email: 'surya.rithwik2005@gmail.com' }
  });

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        domainId,
        email: 'surya.rithwik2005@gmail.com',
        chatRoom: { create: {} },
      }
    });
    console.log('Created customer:', customer.id);
  } else {
    console.log('Found existing customer:', customer.id);
  }

  // Print the test portal link for this domain
  console.log('\n=== YOUR CORRECT PORTAL LINK ===');
  console.log(`http://localhost:3000/portal/${domainId}/appointment/${customer.id}`);

  await prisma.$disconnect();
}

fix();
