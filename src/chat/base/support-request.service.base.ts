import { ID } from '../../types/types';
import {
  GetChatListParams,
  IMessageResponse,
  ISupportRequest,
  ISupportRequestResponse,
  MessageDocument,
  SendMessageDto,
  SupportRequestDocument,
  SupportRequestsSubscribers,
} from './chat.types.base';

export interface ISupportRequestService {
  findSupportRequests(
    params: GetChatListParams,
  ): Promise<ISupportRequestResponse[]>;

  sendMessage(data: SendMessageDto): Promise<IMessageResponse>;

  getMessages(
    supportRequest: ISupportRequest['_id'],
  ): Promise<IMessageResponse[]>;

  subscribe(handler: SupportRequestsSubscribers['fn']): () => void;
}

export const I_SUPPORT_REQUEST_SERVICE: unique symbol = Symbol(
  'ISupportRequestService',
);
