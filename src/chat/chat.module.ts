import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatProvider } from './chat.provider';
import { Message, MessageSchema } from './entities/message.entity';
import {
  SupportRequest,
  SupportRequestSchema,
} from './entities/support-request.entity';
import { ChatService } from './service/chat.service';
import { ChatGateway } from './chat.gateway';
import { SupportRequestService } from './service/support-request.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      {
        name: SupportRequest.name,
        schema: SupportRequestSchema,
      },
    ]),
  ],
  providers: [ChatGateway, ChatService, SupportRequestService, ...ChatProvider],
  exports: [...ChatProvider],
})
export class ChatModule {}
