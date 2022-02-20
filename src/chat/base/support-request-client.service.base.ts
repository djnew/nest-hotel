import {
  CreateSupportRequestDto,
  ISupportRequest,
  ISupportRequestResponse,
  MessagesMarkMessagesAsRead,
} from './chat.types.base';

export const I_SUPPORT_REQUEST_CLIENT_SERVICE: unique symbol = Symbol(
  'ISupportRequestClientService',
);

export interface ISupportRequestClientService {
  createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<ISupportRequestResponse>;

  markMessagesAsRead(
    supportRequest: ISupportRequest['_id'],
  ): Promise<MessagesMarkMessagesAsRead>;

  getUnreadCount(supportRequest: ISupportRequest['_id']): Promise<number>;
}
