import { ISupportRequest, MessagesMarkMessagesAsRead } from './chat.types.base';

export const I_SUPPORT_REQUEST_EMPLOYEE_SERVICE: unique symbol = Symbol(
  'ISupportRequestEmployeeService',
);

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(
    supportRequest: ISupportRequest['_id'],
  ): Promise<MessagesMarkMessagesAsRead>;

  getUnreadCount(supportRequest: ISupportRequest['_id']): Promise<number>;

  closeRequest(supportRequest: ISupportRequest['_id']): Promise<void>;
}
