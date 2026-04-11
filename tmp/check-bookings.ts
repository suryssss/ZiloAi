
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log("Fetching all bookings...");
    const bookings = await prisma.bookings.findMany({
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

    console.log(`Found ${bookings.length} bookings.`);
    for (const b of bookings) {
        console.log(`Booking ID: ${b.id}`);
        console.log(`  email: ${b.email}`);
        console.log(`  domainId: ${b.domainId}`);
        console.log(`  customerId: ${b.customerId}`);
        if(b.Customer?.Domain?.User) {
           console.log(`  Belongs to Clerk User ID: ${b.Customer.Domain.User.clerkId}`);
        } else {
           console.log(`  WARNING: Missing Customer, Domain, or User link!`);
        }
        console.log('-----');
    }
}

main().catch(console.error).finally(() => prisma.$disconnect())
