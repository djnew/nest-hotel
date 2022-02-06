import { Injectable } from '@nestjs/common';
import { ID } from '../../types/types';
import { GetChatListParams, SendMessageDto } from '../dto/chat-request.dto';
import { MessageDocument } from '../entities/message.entity';
import { SupportRequestDocument } from '../entities/support-request.entity';

export const I_SUPPORT_REQUEST_SERVICE = 'I_SUPPORT_REQUEST_SERVICE';

export interface ISupportRequestService {
  findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequestDocument[]>;
  sendMessage(data: SendMessageDto): Promise<MessageDocument>;
  getMessages(supportRequest: ID): Promise<MessageDocument[]>;
  subscribe(
    handler: (
      supportRequest: SupportRequestDocument,
      message: MessageDocument,
    ) => void,
  ): () => void;
}

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequestDocument[]> {
    return Promise.resolve([]);
  }

  getMessages(supportRequest: ID): Promise<MessageDocument[]> {
    return Promise.resolve([]);
  }

  sendMessage(data: SendMessageDto): Promise<MessageDocument> {
    return Promise.resolve(undefined);
  }

  subscribe(
    handler: (
      supportRequest: SupportRequestDocument,
      message: MessageDocument,
    ) => void,
  ): () => void {
    return function () {
      return;
    };
  }
}
