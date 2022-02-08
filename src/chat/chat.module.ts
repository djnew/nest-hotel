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
import { SupportRequestClientService } from './service/support-request-client.service';
import { SupportRequestEmployeeService } from './service/support-request-employee.service';
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
  providers: [
    ChatGateway,
    ChatService,
    SupportRequestService,
    SupportRequestEmployeeService,
    SupportRequestClientService,
    ...ChatProvider,
  ],
  exports: [...ChatProvider],
})
export class ChatModule {}
