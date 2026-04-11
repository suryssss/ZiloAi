
import { 
    onAiChatBotAssistant, 
    onGetCurrentChatBot 
} from '../src/actions/bot/index';
import { 
    onGetDomainProductsAndConnectedAccountId 
} from '../src/actions/payments/index';
import { 
    onBookNewAppointment 
} from '../src/actions/appointment/index';

const DOMAIN_ID = 'c1055d91-5146-4bec-a351-58356b2f1739'; // elanic.vercel.app

async function runTests() {
    console.log('--- STARTING ENDPOINT TESTS ---');

    // 1. Test Fetching Chatbot Config
    console.log('\n[1] Testing: onGetCurrentChatBot');
    try {
        const bot = await onGetCurrentChatBot(DOMAIN_ID);
        console.log('Result:', bot ? 'Success (Bot Found)' : 'Failed (Bot Not Found)');
        if (bot) console.log('Bot Name:', bot.name);
    } catch (e) {
        console.error('Error:', e.message);
    }

    // 2. Test Fetching Domain Products
    console.log('\n[2] Testing: onGetDomainProductsAndConnectedAccountId');
    try {
        const data = await onGetDomainProductsAndConnectedAccountId(DOMAIN_ID);
        console.log('Result:', data ? `Success (${data.products.length} products found)` : 'Failed');
    } catch (e) {
        console.error('Error:', e.message);
    }

    // 3. Test AI Chat Response (Simulated User Message)
    console.log('\n[3] Testing: onAiChatBotAssistant');
    try {
        const response = await onAiChatBotAssistant(
            DOMAIN_ID, 
            [{ role: 'assistant', content: 'Hello' }], 
            'user', 
            'Hello, I want to know about your services'
        );
        console.log('AI Response:', response?.response?.content || 'NO RESPONSE');
    } catch (e) {
        console.error('Error:', e.message);
    }

    // 4. Test Appointment Booking (Public)
    console.log('\n[4] Testing: onBookNewAppointment');
    try {
        // We need a customer ID. Let's try to find one from the domain.
        // For now, use a dummy or try to fetch one.
        console.log('Skipping booking test - requires valid Customer ID');
    } catch (e) {
        console.error('Error:', e.message);
    }

    console.log('\n--- ENDPOINT TESTS COMPLETE ---');
}

runTests();
