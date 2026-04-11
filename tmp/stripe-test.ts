
import { onGetStripeClientSecret } from '../src/actions/stripe/index';

async function testStripe() {
    console.log('--- TESTING STRIPE PAYMENT INTENT ---');
    try {
        const result = await onGetStripeClientSecret('PRO');
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (e) {
        console.error('Stripe Error:', e);
    }
}

testStripe();
