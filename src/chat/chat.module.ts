import { Global, Module } from '@nestjs/common';
import { ChatSchema } from './chat.schema';

@Global()
@Module({
  providers: [ChatSchema],
  exports: [ChatSchema],
})
export class ChatModule {}
