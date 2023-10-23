import { Global, Module } from '@nestjs/common';
import { ChatroomSchema } from './chatroom.schema';

@Global()
@Module({
  providers: [ChatroomSchema],
  exports: [ChatroomSchema],
})
export class ChatroomModule {}
