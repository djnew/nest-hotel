import { Injectable } from '@nestjs/common';
import { ID } from '../../types/types';
import {
  CreateSupportRequestDto,
  MarkMessagesAsReadDto,
} from '../dto/chat-request.dto';
import { MessageDocument } from '../entities/message.entity';
import { SupportRequestDocument } from '../entities/support-request.entity';

export const I_SUPPORT_REQUEST_CLIENT_SERVICE =
  'I_SUPPORT_REQUEST_CLIENT_SERVICE';

export interface ISupportRequestClientService {
  createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequestDocument>;
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<MessageDocument[]>;
}

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequestDocument> {
    return Promise.resolve(undefined);
  }

  getUnreadCount(supportRequest: ID): Promise<MessageDocument[]> {
    return Promise.resolve([]);
  }

  markMessagesAsRead(params: MarkMessagesAsReadDto) {}
}
