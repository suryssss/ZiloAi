import { PrismaClient } from '@prisma/client';
import { onBookNewAppointment } from '../src/actions/appointment';

const prisma = new PrismaClient();

async function testAppointmentForLatestUser() {
  console.log('--- TEST APPOINTMENT API FOR LATEST USER ---');
  try {
    // 1. Get the latest user that has a domain
    const user = await prisma.user.findFirst({
      where: {
        domains: {
          some: {}
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        domains: {
          include: {
            customer: true
          }
        }
      }
    });

    if (!user || user.domains.length === 0) {
      console.log('No user with a domain found.');
      return;
    }

    const domain = user.domains[0];
    const domainId = domain.id;
    
    // Create a mock customer if they don't have one
    let customer;
    if (domain.customer.length === 0) {
      customer = await prisma.customer.create({
        data: {
          domainId: domain.id,
          email: 'test-user-own-booking@example.com'
        }
      });
    } else {
      customer = domain.customer[0];
    }
    
    const customerId = customer.id;
    const email = customer.email || 'test-user-own-booking@example.com';
    const slot = '3:00 PM';
    const date = new Date().toISOString(); 

    console.log(`Booking for User: ${user.fullname} (Clerk ID: ${user.clerkId})`);
    console.log(`Domain: ${domain.name}`);
    console.log(`Slot: ${slot}, Date: ${date}`);

    // Call the server action properly
    const result = await onBookNewAppointment(domainId, customerId, slot, date, email);
    
    console.log('Response from API:', result);
    
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testAppointmentForLatestUser();
