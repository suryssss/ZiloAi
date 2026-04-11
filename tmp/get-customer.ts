
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // Get any existing customer
    const customer = await prisma.customer.findFirst({
        include: { Domain: true },
        where: { domainId: "c1055d91-5146-4bec-a351-58356b2f1739" }
    })
    
    if (customer) {
        console.log(`DOMAIN_ID: ${customer.domainId}`)
        console.log(`CUSTOMER_ID: ${customer.id}`)
        console.log(`URL: http://localhost:3000/portal/${customer.domainId}/appointment/${customer.id}`)
    } else {
        console.log("No custom found. Creating a test one...");
        // Fallback: create a dummy if none available
        const newCustomer = await prisma.customer.create({
            data: {
                email: "test.appointment@example.com",
                domainId: "c1055d91-5146-4bec-a351-58356b2f1739"
            }
        });
        console.log(`DOMAIN_ID: ${newCustomer.domainId}`)
        console.log(`CUSTOMER_ID: ${newCustomer.id}`)
        console.log(`URL: http://localhost:3000/portal/${newCustomer.domainId}/appointment/${newCustomer.id}`)
    }
}

main().catch(console.error).finally(() => prisma.$disconnect())
