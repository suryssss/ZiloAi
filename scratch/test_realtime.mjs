import { PrismaClient } from '@prisma/client';
import PusherServer from 'pusher';

const prisma = new PrismaClient();

const pusherServer = new PusherServer({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.NEXT_PUSHER_APP_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTOR,
  useTLS: true,
});

async function testRealtimeChat() {
  console.log('--- Realtime Chat Test ---');
  
  try {
    const chatRoom = await prisma.chatRoom.findFirst({
        select: { id: true }
    });

    if (!chatRoom) {
      console.log('No chat rooms found in database. Cannot test specific chatRoom trigger.');
      return;
    }

    console.log('Using ChatRoom ID:', chatRoom.id);

    const response = await pusherServer.trigger(chatRoom.id, 'realtime-mode', {
      chat: {
        message: 'System test message',
        id: 'test-id',
        role: 'assistant',
      },
    });

    if (response.status === 200) {
      console.log('✅ Pusher trigger for chatRoom ' + chatRoom.id + ' successful!');
    } else {
      console.log('❌ Pusher trigger failed with status:', response.status);
    }
  } catch (error) {
    console.error('Test failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testRealtimeChat();
