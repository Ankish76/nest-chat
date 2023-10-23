import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { MessageType } from '@prisma/client';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    return expect(service).toBeDefined();
  });

  it('should add chatroom', () => {
    return expect(
      service.chatRoom.create({ data: { name: 'Test Chat Room' } }),
    ).resolves.toMatchObject({ id: expect.anything(), name: 'Test Chat Room' });
  });
  it('should add user', () => {
    return expect(
      service.user.create({ data: { name: 'Test User' } }),
    ).resolves.toMatchObject({
      id: expect.anything(),
      name: 'Test User',
    });
  });
  it('should link user to chat room', async () => {
    const room = await service.chatRoom.create({
      data: { name: 'Test Chat Room' },
    });
    return expect(
      service.user.create({
        select: {
          rooms: true,
        },
        data: {
          name: 'Test User 2',
          rooms: {
            connect: {
              id: room.id,
            },
          },
        },
      }),
    ).resolves.toMatchObject({
      rooms: [
        {
          id: room.id,
        },
      ],
    });
  });
  it('should add join message', async () => {
    const room = await service.chatRoom.create({
      data: { name: 'Test Chat Room' },
    });
    return expect(
      service.user.create({
        select: {
          chats: true,
        },
        data: {
          name: 'Test User 2',
          rooms: {
            connect: {
              id: room.id,
            },
          },
          chats: {
            create: {
              message: 'Test User 2 Joined',
              type: MessageType.JOIN,
              roomId: room.id,
            },
          },
        },
      }),
    ).resolves.toMatchObject({
      chats: [
        {
          id: expect.anything(),
          message: 'Test User 2 Joined',
          type: MessageType.JOIN,
          roomId: room.id,
        },
      ],
    });
  });
  it('should add convo message', async () => {
    const room = await service.chatRoom.create({
      data: { name: 'Test Chat Room' },
    });
    return expect(
      service.user.create({
        select: {
          chats: true,
        },
        data: {
          name: 'Test User 2',
          rooms: {
            connect: {
              id: room.id,
            },
          },
          chats: {
            createMany: {
              data: [
                {
                  message: 'Test User 2 Joined',
                  type: MessageType.JOIN,
                  roomId: room.id,
                },
                {
                  message: 'Test Message',
                  type: MessageType.CONVO,
                  roomId: room.id,
                },
              ],
            },
          },
        },
      }),
    ).resolves.toMatchObject({
      chats: [
        {
          id: expect.anything(),
          message: 'Test User 2 Joined',
          type: MessageType.JOIN,
          roomId: room.id,
        },
        {
          id: expect.anything(),
          message: 'Test Message',
          type: MessageType.CONVO,
          roomId: room.id,
        },
      ],
    });
  });
});
