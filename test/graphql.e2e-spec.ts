import { Test, TestingModule } from '@nestjs/testing';
import request, { supertestWs } from 'supertest-graphql';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import {
  AddMessageDocument,
  ChatSubDocument,
  ChatsDocument,
  CreateRoomDocument,
  JoinRoomDocument,
  RoomsDocument,
  UsersDocument,
} from 'src/generated/graphql-operations';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageType } from '@prisma/client';

const gql = '/graphql';

describe('GraphQL Test', () => {
  let app: INestApplication;
  let service: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();
    service = module.get<PrismaService>(PrismaService);
    await service.chat.deleteMany();
    await service.user.deleteMany();
    await service.chatRoom.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(gql, () => {
    describe('rooms', () => {
      it('should get rooms', () => {
        return expect(
          request(app.getHttpServer()).query(RoomsDocument),
        ).resolves.toMatchObject({
          data: {
            rooms: {
              edges: [],
            },
          },
        });
      });
      it('should add rooms', () => {
        expect(
          request(app.getHttpServer()).mutate(CreateRoomDocument, {
            name: 'Test',
          }),
        ).resolves.toMatchObject({
          data: {
            createRoom: {
              name: 'Test',
            },
          },
        });
        return expect(
          request(app.getHttpServer()).query(RoomsDocument),
        ).resolves.toMatchObject({
          data: {
            rooms: {
              edges: [{ node: { name: 'Test' } }],
            },
          },
        });
      });
    });
    describe('users', () => {
      it('should get user', () => {
        return expect(
          request(app.getHttpServer()).query(UsersDocument),
        ).resolves.toMatchObject({
          data: {
            users: {
              edges: [],
            },
          },
        });
      });
      it('should join room', async () => {
        const { data } = (await request(app.getHttpServer()).mutate(
          CreateRoomDocument,
          {
            name: 'Test',
          },
        )) as any;
        const roomId = data.createRoom?.id;
        return expect(
          request(app.getHttpServer()).mutate(JoinRoomDocument, {
            roomId,
            name: 'Test user',
          }),
        ).resolves.toMatchObject({
          data: {
            joinRoom: {
              name: 'Test user',
            },
          },
        });
      });
    });
    describe('chat', () => {
      it('should get chats', async () => {
        const { data } = (await request(app.getHttpServer()).mutate(
          CreateRoomDocument,
          {
            name: 'Test',
          },
        )) as any;
        const roomId = data.createRoom?.id;
        return expect(
          request(app.getHttpServer()).query(ChatsDocument, { roomId }),
        ).resolves.toMatchObject({
          data: {
            chats: {
              edges: [],
            },
          },
        });
      });
      it('should add chats', async () => {
        const { data } = (await request(app.getHttpServer()).mutate(
          CreateRoomDocument,
          {
            name: 'Test',
          },
        )) as any;
        const roomId = data.createRoom?.id;
        const { data: joinData } = (await request(app.getHttpServer()).mutate(
          JoinRoomDocument,
          {
            roomId,
            name: 'Test user',
          },
        )) as any;
        const userId = joinData?.joinRoom?.id;
        return expect(
          request(app.getHttpServer()).mutate(AddMessageDocument, {
            roomId,
            userId,
            message: 'Test Message',
          }),
        ).resolves.toMatchObject({
          data: {
            addMessage: {
              message: 'Test Message',
            },
          },
        });
      });
      it('should get chats', async () => {
        const { data } = (await request(app.getHttpServer()).mutate(
          CreateRoomDocument,
          {
            name: 'Test',
          },
        )) as any;
        const roomId = data.createRoom?.id;
        const { data: joinData } = (await request(app.getHttpServer()).mutate(
          JoinRoomDocument,
          {
            roomId,
            name: 'Test user',
          },
        )) as any;
        const userId = joinData?.joinRoom?.id;
        await request(app.getHttpServer()).mutate(AddMessageDocument, {
          roomId,
          userId,
          message: 'Test Message',
        });
        return expect(
          request(app.getHttpServer()).query(ChatsDocument, { roomId }),
        ).resolves.toMatchObject({
          data: {
            chats: {
              edges: [
                { node: { type: MessageType.JOIN } },
                { node: { type: MessageType.CONVO } },
              ],
            },
          },
        });
      });
      // can not test subscription with supertest  => https://github.com/davidje13/superwstest#why-isnt-requestapp-supported
      // it('should subscribe to chat add', async () => {
      //   const sub = await supertestWs(app.getHttpServer()).subscribe(
      //     ChatSubDocument,
      //   );
      //   const { data } = (await request(app.getHttpServer()).mutate(
      //     CreateRoomDocument,
      //     {
      //       name: 'Test',
      //     },
      //   )) as any;
      //   const roomId = data.createRoom?.id;
      //   const { data: joinData } = (await request(app.getHttpServer()).mutate(
      //     JoinRoomDocument,
      //     {
      //       roomId,
      //       name: 'Test user',
      //     },
      //   )) as any;
      //   const userId = joinData?.joinRoom?.id;
      //   request(app.getHttpServer()).mutate(AddMessageDocument, {
      //     roomId,
      //     userId,
      //     message: 'Test Message',
      //   });
      //   const { data: subData } = await sub.next().expectNoErrors();
      //   return expect(subData).toMatchObject({
      //     chatSub: {
      //       message: 'Test Message',
      //       type: MessageType.CONVO,
      //     },
      //   });
      // });
    });
  });
});
