import { Inject, Injectable } from '@nestjs/common';
import {
  Pothos,
  PothosRef,
  PothosSchema,
  SchemaBuilderToken,
  Builder,
} from 'src/pothos';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatroomSchema extends PothosSchema {
  constructor(
    @Inject(SchemaBuilderToken) private readonly builder: Builder,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  @PothosRef()
  chatRoom() {
    return this.builder.prismaObject('ChatRoom', {
      fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        chats: t.relation('chats'),
        users: t.relation('users'),
        haveJoined: t.field({
          type: 'Boolean',
          resolve: async (parent, args, context, info) => {
            if (!context?.user?.id) {
              return false;
            }
            const count = await this.prisma.chatRoom.count({
              where: {
                users: {
                  some: {
                    id: context?.user?.id,
                  },
                },
              },
            });
            return count > 0;
          },
        }),
        createdAt: t.expose('createdAt', { type: 'DateTime' }),
        updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
      }),
    });
  }

  @Pothos()
  init(): void {
    this.builder.mutationField('createRoom', (t) =>
      t.field({
        type: this.chatRoom(),
        args: {
          name: t.arg.string({ required: true }),
        },
        resolve: (root, { name }) => {
          return this.prisma.chatRoom.create({
            data: {
              name,
            },
          });
        },
      }),
    );
    this.builder.queryFields((t) => ({
      rooms: t.prismaConnection(
        {
          type: this.chatRoom(),
          cursor: 'id',
          args: {},
          totalCount: (parent, args, context, info) =>
            this.prisma.chatRoom.count(),
          resolve: (query, parent, args, context, info) =>
            this.prisma.chatRoom.findMany({ ...query }),
        },
        {}, // optional options for the Connection type
        {}, // optional options for the Edge type),
      ),
    }));
  }
}
