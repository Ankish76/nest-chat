import { Inject, Injectable } from '@nestjs/common';
import { MessageType } from '@prisma/client';
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
export class UserSchema extends PothosSchema {
  constructor(
    @Inject(SchemaBuilderToken) private readonly builder: Builder,
    private readonly prisma: PrismaService,
    private readonly pubsub: RedisPubsubService,
  ) {
    super();
  }

  @PothosRef()
  user() {
    return this.builder.prismaObject('User', {
      fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        rooms: t.relation('rooms'),
        createdAt: t.expose('createdAt', { type: 'DateTime' }),
        updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
      }),
    });
  }

  @Pothos()
  init(): void {
    this.builder.mutationField('joinRoom', (t) =>
      t.field({
        type: this.user(),
        args: {
          name: t.arg.string({ required: true }),
          roomId: t.arg.string({ required: true }),
        },
        resolve: async (root, { name, roomId }) => {
          const user = await this.prisma.user.create({
            include: { chats: true },
            data: {
              name,
              rooms: {
                connect: {
                  id: roomId,
                },
              },
              chats: {
                create: {
                  message: `${name} has joined`,
                  roomId,
                  type: MessageType.JOIN,
                },
              },
            },
          });
          this.pubsub.publish(`chat-added-${roomId}`, user.chats[0]);
          return user;
        },
      }),
    );
    this.builder.queryFields((t) => ({
      users: t.prismaConnection(
        {
          type: this.user(),
          cursor: 'id',
          args: {},
          totalCount: (parent, args, context, info) => this.prisma.user.count(),
          resolve: (query, parent, args, context, info) =>
            this.prisma.user.findMany({ ...query }),
        },
        {}, // optional options for the Connection type
        {}, // optional options for the Edge type),
      ),
    }));
  }
}