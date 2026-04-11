
import { onAiChatBotAssistant, onGetCurrentChatBot } from '../src/actions/bot/index';

const DOMAIN_ID = 'c1055d91-5146-4bec-a351-58356b2f1739';

async function testBot() {
    console.log('--- TEST BOT CONFIG ---');
    try {
        const chatbot = await onGetCurrentChatBot(DOMAIN_ID);
        console.log('Bot Result:', chatbot ? 'FOUND' : 'NOT FOUND');
    } catch (e) {
        console.log('Bot Config Error:', e);
    }

    console.log('\n--- TEST AI ASSISTANT ---');
    try {
        // Mock session chat history
        const chat: any[] = [{ role: 'assistant', content: 'Hello' }];
        const response = await onAiChatBotAssistant(
            DOMAIN_ID,
            chat,
            'user',
            'I want to know your services'
        );
        console.log('AI Response:', JSON.stringify(response, null, 2));
    } catch (e) {
        console.log('AI Assistant Error:', e);
    }
}

testBot();
