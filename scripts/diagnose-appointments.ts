import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function diagnose() {
  console.log('=== FULL APPOINTMENT DIAGNOSIS ===\n');

  // 1. Check domain ownership
  const domain = await prisma.domain.findUnique({
    where: { id: '3d464d05-1e1a-43f5-982f-6f3b9c0b0a85' },
    include: { User: true, customer: true }
  });

  console.log('Domain:', domain?.name);
  console.log('Domain userId:', domain?.userId);
  console.log('Domain User clerkId:', domain?.User?.clerkId);
  console.log('Domain User fullname:', domain?.User?.fullname);
  console.log('Domain customers count:', domain?.customer?.length);
  console.log('');

  // 2. Check all bookings linked to this domain
  const bookings = await prisma.bookings.findMany({
    where: { domainId: '3d464d05-1e1a-43f5-982f-6f3b9c0b0a85' },
    include: {
      Customer: {
        include: {
          Domain: {
            include: { User: true }
          }
        }
      }
    }
  });

  console.log(`Bookings for domain: ${bookings.length}`);
  bookings.forEach((b, i) => {
    console.log(`\nBooking ${i+1}:`);
    console.log('  id:', b.id);
    console.log('  email:', b.email);
    console.log('  slot:', b.slot);
    console.log('  date:', b.date);
    console.log('  customerId:', b.customerId);
    console.log('  Customer.Domain.id:', b.Customer?.Domain?.id);
    console.log('  Customer.Domain.userId:', b.Customer?.Domain?.userId);
    console.log('  Customer.Domain.User.clerkId:', b.Customer?.Domain?.User?.clerkId);
  });

  // 3. Try the exact query used in onGetAllBookingsForCurrentUser
  if (domain?.User?.clerkId) {
    console.log('\n--- Running query with clerkId:', domain.User.clerkId, '---');
    const result = await prisma.bookings.findMany({
      where: {
        Customer: {
          Domain: {
            User: { clerkId: domain.User.clerkId }
          }
        }
      }
    });
    console.log('Query returned:', result.length, 'bookings');
  }

  await prisma.$disconnect();
}

diagnose();
