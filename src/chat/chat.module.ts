import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatProvider } from './chat.provider';
import { Message, MessageSchema } from './entities/message.entity';
import {
  SupportRequest,
  SupportRequestSchema,
} from './entities/support-request.entity';
import { MessagesRepository } from './repository/messages.repository';
import { SupportRequestsRepository } from './repository/support-requests.repository';
import { SupportRequestClientService } from './service/support-request-client.service';
import { SupportRequestEmployeeService } from './service/support-request-employee.service';
import { SupportRequestFilterService } from './service/support-request-filter.service';
import { SupportRequestService } from './service/support-request.service';

@Module({
  controllers: [ChatController],
  imports: [
    UsersModule,
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
    SupportRequestService,
    SupportRequestEmployeeService,
    SupportRequestClientService,
    SupportRequestFilterService,
    SupportRequestsRepository,
    MessagesRepository,
    ...ChatProvider,
  ],
  exports: [...ChatProvider],
})
export class ChatModule {}
