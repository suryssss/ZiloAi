import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const user = await prisma.user.findFirst({
    where: { clerkId: 'user_39WrWT4OhV1PIXNTJBf0LA67uBP' },
    include: {
      domains: {
        include: {
          customer: true
        }
      }
    }
  });
  if (user && user.domains.length > 0) {
    const domain = user.domains[0];
    const customerId = domain.customer.length > 0 ? domain.customer[0].id : 'dummy-id';
    console.log(`http://localhost:3000/portal/${domain.id}/appointment/${customerId}`);
  }
}
check();
