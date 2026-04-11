import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getChatRoomId() {
  try {
    const customer = await prisma.customer.findFirst({
      where: { email: 'surya.rithwik2005@gmail.com' },
      include: {
        chatRoom: {
          select: { id: true }
        }
      }
    });

    if (customer && customer.chatRoom.length > 0) {
      console.log('\n--- YOUR CHATROOM ID ---');
      console.log(customer.chatRoom[0].id);
      console.log('------------------------\n');
    } else {
      console.log('No chatroom found for surya.rithwik2005@gmail.com');
      // List all available chatrooms as fallback
      const allRooms = await prisma.chatRoom.findMany({ 
          take: 5,
          select: { id: true }
      });
      console.log('Recent ChatRoom IDs in DB:', allRooms.map(r => r.id));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getChatRoomId();
