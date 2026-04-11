
import { onAiChatBotAssistant } from '../src/actions/bot/index';
import { onBookNewAppointment } from '../src/actions/appointment/index';
import { client } from '../src/lib/prisma';

const DOMAIN_ID = 'c1055d91-5146-4bec-a351-58356b2f1739';
const TEST_EMAIL = `test_${Date.now()}@example.com`;

async function testFullFlow() {
    console.log('--- STARTING INTEGRATION TEST ---');
    
    // 1. Send email to bot to trigger customer creation
    console.log(`\n[1] Creating customer with email: ${TEST_EMAIL}`);
    try {
        const response: any = await onAiChatBotAssistant(
            DOMAIN_ID,
            [],
            'user',
            `Hi, my email is ${TEST_EMAIL}`
        );
        console.log('Bot Response:', response?.response?.content.substring(0, 50) + '...');
    } catch (e) {
        console.error('Bot Error:', e);
    }

    // 2. Fetch the created customer from DB
    console.log('\n[2] Fetching customer from DB');
    let customerId: string | undefined;
    try {
        const customer = await client.customer.findFirst({
            where: { email: TEST_EMAIL }
        });
        if (customer) {
            console.log('Customer Found:', customer.id);
            customerId = customer.id;
        } else {
            console.error('Customer not found in DB!');
        }
    } catch (e) {
        console.error('DB Error:', e);
    }

    // 3. Book an appointment
    if (customerId) {
        console.log('\n[3] Booking appointment');
        try {
            const booking = await onBookNewAppointment(
                DOMAIN_ID,
                customerId,
                '10:00 AM',
                '2026-04-01T00:00:00.000Z',
                TEST_EMAIL
            );
            console.log('Booking Result:', JSON.stringify(booking, null, 2));
        } catch (e) {
            console.error('Booking Error:', e);
        }
    }

    // Cleanup: I'll leave the test data for the user to see, or delete it later.
    console.log('\n--- INTEGRATION TEST COMPLETE ---');
}

testFullFlow();
