import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const domain = await prisma.domain.findUnique({
    where: { id: 'c1055d91-5146-4bec-a351-58356b2f1739' },
    include: { User: true }
  });
  console.log('Domain c105... belongs to User:', domain?.User?.clerkId, domain?.User?.fullname);
}
check();
