import PusherServer from 'pusher';

// Note: Ensure you run this with 'node --env-file=.env scratch/test_pusher.mjs' from the project root
const pusherServer = new PusherServer({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.NEXT_PUSHER_APP_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTOR,
  useTLS: true,
});

async function testPusher() {
  console.log('\n--- Pusher Connectivity Test ---');
  console.log('App ID:', process.env.NEXT_PUBLIC_PUSHER_APP_ID || 'MISSING');
  console.log('Key:', process.env.NEXT_PUBLIC_PUSHER_APP_KEY || 'MISSING');
  console.log('Cluster:', process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTOR || 'MISSING');

  if (!process.env.NEXT_PUSHER_APP_SECRET) {
    console.error('❌ Error: NEXT_PUSHER_APP_SECRET is missing from environment.');
    return;
  }

  try {
    console.log('Sending test event to "test-channel"...');
    const response = await pusherServer.trigger('test-channel', 'test-event', {
      message: 'Hello from ZiloAI test script!',
      timestamp: new Date().toISOString()
    });

    if (response.status === 200) {
      console.log('✅ Success: Pusher triggered successfully!');
      console.log('Response Status:', response.status, response.statusText);
    } else {
      console.log('❌ Failed: Pusher returned status ' + response.status);
      const text = await response.text();
      console.log('Response details:', text);
    }
  } catch (error) {
    console.error('❌ Error: Pusher trigger failed:');
    console.error(error.message);
  }
}

testPusher();
