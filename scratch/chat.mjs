import readline from 'readline';

const CHATROOM_ID = '6ceff9f3-9608-48af-a56c-199f2310b2f6';
const API_URL = 'http://localhost:3000/api/pusher/test';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n--- 🚀 Real-time Terminal Chat ---');
console.log('Target ChatRoom:', CHATROOM_ID);
console.log('Type your message and press ENTER to send.');
console.log('Type "exit" to quit.\n');

const ask = () => {
  rl.question('You (Assistant): ', async (message) => {
    if (message.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatroomId: CHATROOM_ID,
          message: message,
          role: 'assistant'
        })
      });

      if (response.ok) {
        console.log('✅ Sent');
      } else {
        const err = await response.text();
        console.log('❌ Error:', response.status, err);
      }
    } catch (error) {
      console.log('❌ Network Error:', error.message);
    }
    ask();
  });
};

ask();
