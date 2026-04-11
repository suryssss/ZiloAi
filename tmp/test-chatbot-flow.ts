
import { onAiChatBotAssistant, onGetCurrentChatBot } from '../src/actions/bot/index';
import { client } from '../src/lib/prisma';

const DOMAIN_ID = 'c1055d91-5146-4bec-a351-58356b2f1739';
const TEST_EMAIL = `test-${Date.now()}@example.com`;

async function testFullFlow() {
    console.log('--- STARTING CHATBOT FLOW TEST ---');
    
    // 1. Check Bot Config
    const chatbot = await onGetCurrentChatBot(DOMAIN_ID);
    if (!chatbot) {
        console.error('❌ Bot not found for domain:', DOMAIN_ID);
        return;
    }
    console.log('✅ Bot found:', chatbot.name);

    // 2. First Message (Introduction)
    console.log('\n--- MESSAGE 1: Intro ---');
    const chat1: any[] = [];
    const res1 = await onAiChatBotAssistant(DOMAIN_ID, chat1, 'user', 'Hello, who are you?');
    console.log('Bot Response:', res1?.response?.content);

    // 3. Second Message (Giving Email)
    console.log('\n--- MESSAGE 2: Providing Email ---');
    const chat2 = [...chat1, { role: 'user', content: 'Hello, who are you?' }, { role: 'assistant', content: res1?.response?.content }];
    const res2 = await onAiChatBotAssistant(DOMAIN_ID, chat2, 'user', `My email is ${TEST_EMAIL}`);
    console.log('Bot Response:', res2?.response?.content);

    // 4. Verify Customer Creation in DB
    console.log('\n--- VERIFYING DB ---');
    const customer = await client.customer.findFirst({
        where: { email: TEST_EMAIL }
    });
    if (customer) {
        console.log('✅ Customer successfully created in DB:', customer.email);
        
        // Clean up test data
        await client.customer.delete({ where: { id: customer.id } });
        console.log('🗑️ Test customer cleaned up.');
    } else {
        console.error('❌ Customer was NOT created in DB.');
    }

    console.log('\n--- FLOW TEST COMPLETE ---');
}

testFullFlow().catch(console.error).finally(() => client.$disconnect());
