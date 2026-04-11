import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findChatRoom() {
  try {
    const customer = await prisma.customer.findFirst({
      where: { email: 'surya.rithwik2005@gmail.com' },
      include: { chatRoom: true }
    });

    if (customer && customer.chatRoom.length > 0) {
      console.log('--- ChatRoom Found ---');
      console.log('Customer:', customer.email);
      console.log('ChatRoom ID:', customer.chatRoom[0].id);
    } else {
      console.log('No chatroom found for this email.');
      const allRooms = await prisma.chatRoom.findMany({ take: 5 });
      console.log('Other available rooms:', allRooms.map(r => r.id));
    }
  } catch (error) {
    console.error('Error finding chatroom:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findChatRoom();
