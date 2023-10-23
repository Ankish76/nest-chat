import { Inject, Injectable } from '@nestjs/common';
import { Chat, MessageType } from '@prisma/client';
import {
  Pothos,
  PothosRef,
  PothosSchema,
  SchemaBuilderToken,
  Builder,
} from 'src/pothos';

import { PrismaService } from 'src/prisma/prisma.service';
import { RedisPubsubService } from 'src/redis-pubsub/redis-pubsub.service';

@Injectable()
export class ChatSchema extends PothosSchema {
  constructor(
    @Inject(SchemaBuilderToken) private readonly builder: Builder,
    private readonly prisma: PrismaService,
    private readonly pubsub: RedisPubsubService,
  ) {
    super();
  }

  @PothosRef()
  chat() {
    return this.builder.prismaObject('Chat', {
      fields: (t) => ({
        id: t.exposeID('id'),
        message: t.exposeString('message'),
        type: t.exposeString('type'),
        room: t.relation('room'),
        user: t.relation('user'),
        createdAt: t.expose('createdAt', { type: 'DateTime' }),
        updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
      }),
    });
  }

  @Pothos()
  init(): void {
    this.builder.mutationField('addMessage', (t) =>
      t.field({
        type: this.chat(),
        args: {
          message: t.arg.string({ required: true }),
          roomId: t.arg.string({ required: true }),
          userId: t.arg.string({ required: true }), // [TODO] get from cookies
        },
        resolve: async (root, { message, roomId, userId }) => {
          const chat = await this.prisma.chat.create({
            data: {
              message,
              roomId,
              userId,
              type: MessageType.CONVO,
            },
          });
          this.pubsub.publish(`chat-added-${roomId}`, chat);
          return chat;
        },
      }),
    );
    this.builder.subscriptionField('chatSub', (t) =>
      t.field({
        args: {
          roomId: t.arg.string({ required: true }),
        },
        type: this.chat(),
        subscribe: (root, { roomId }, ctx, info) =>
          this.pubsub.asyncIterator(`chat-added-${roomId}`) as any,
        resolve: (chat: Chat) => {
          //[TODO] verify this
          return chat;
        },
      }),
    );
    this.builder.queryFields((t) => ({
      chats: t.prismaConnection(
        {
          type: this.chat(),
          cursor: 'id',
          args: {
            roomId: t.arg.string({ required: true }),
          },
          totalCount: (parent, { roomId }, context, info) =>
            this.prisma.chat.count({
              where: {
                roomId,
              },
            }),
          resolve: (query, parent, { roomId }, context, info) =>
            this.prisma.chat.findMany({
              ...query,
              where: {
                roomId,
              },
              orderBy: {
                createdAt: 'asc',
              },
            }),
        },
        {}, // optional options for the Connection type
        {}, // optional options for the Edge type),
      ),
    }));
  }
}
