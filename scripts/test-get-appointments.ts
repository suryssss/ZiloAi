import { PrismaClient } from '@prisma/client';
import { onGetAllBookingsForCurrentUser } from '../src/actions/appointment';

const prisma = new PrismaClient();

async function testGet() {
  console.log('--- TEST GET APPOINTMENTS ---');
  try {
    const clerkId = 'user_39WrWT4OhV1PIXNTJBf0LA67uBP';
    console.log(`Getting appointments for clerkId: ${clerkId}`);
    
    // First let's do a raw prisma check to see if we can find it
    const directCheck = await prisma.bookings.findMany({
      where: {
        Customer: {
          Domain: {
            User: {
              clerkId: clerkId
            }
          }
        }
      },
      include: {
        Customer: {
          include: {
            Domain: {
              include: {
                User: true
              }
            }
          }
        }
      }
    });

    console.log('Direct Prisma Deep Query returned count:', directCheck.length);
    if (directCheck.length > 0) {
       console.log('Sample booking domain User clerk ID:', directCheck[0].Customer?.Domain?.User?.clerkId);
    }
    
    // Then call the server action
    const actionResult = await onGetAllBookingsForCurrentUser(clerkId);
    console.log('onGetAllBookingsForCurrentUser returned count:', actionResult?.bookings?.length);
    
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testGet();
