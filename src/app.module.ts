import { Module } from '@nestjs/common';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { AppService } from './app.service';
import { ChatroomModule } from './chatroom/chatroom.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PothosModule } from './pothos/pothos.module';
import { createBuilder } from './pothos/builder';
import { PrismaModule } from './prisma/prisma.module';
import { PothosApolloDriver } from './pothos/pothos.driver';
import { AppController } from './app.controller';
import { RedisPubsubService } from './redis-pubsub/redis-pubsub.service';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';
import { RedisPubsubModule } from './redis-pubsub/redis-pubsub.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    RedisPubsubModule,
    ChatroomModule,
    ChatModule,
    UserModule,
    PothosModule.forRoot({
      builder: {
        inject: [PrismaService, RedisPubsubService],
        useFactory: (prisma: PrismaService, pubsub: RedisPubsubService) =>
          createBuilder({ prisma, pubsub }),
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: PothosApolloDriver,
      subscriptions: {
        'graphql-ws': true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RedisPubsubService, RedisService],
})
export class AppModule {}
