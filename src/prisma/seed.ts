import { serverConfig } from '../config/server';

import { prisma } from './index';

const { defaultRoomId } = serverConfig;
const seed = async () => {
  const user = await prisma.chatRoom.findUnique({
    where: {
      id: defaultRoomId,
    },
  });
  if (!user) {
    console.log('adding default chatRoom');
    await prisma.chatRoom.create({
      data: {
        id: defaultRoomId,
        name: 'Default Chat Room',
      },
    });
    console.log('added default chatRoom');
  }
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
