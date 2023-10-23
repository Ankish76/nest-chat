import { Global, Module } from '@nestjs/common';
import { RedisPubsubService } from './redis-pubsub.service';

@Global()
@Module({
  providers: [RedisPubsubService],
  exports: [RedisPubsubService],
})
export class RedisPubsubModule {}
