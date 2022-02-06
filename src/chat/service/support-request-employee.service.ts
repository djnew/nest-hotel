import { Injectable } from '@nestjs/common';
import { ID } from '../../types/types';
import { MarkMessagesAsReadDto } from '../dto/chat-request.dto';
import { MessageDocument } from '../entities/message.entity';

export const I_SUPPORT_REQUEST_EMPLOYEE_SERVICE =
  'I_SUPPORT_REQUEST_EMPLOYEE_SERVICE';

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<MessageDocument[]>;
  closeRequest(supportRequest: ID): Promise<void>;
}

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  closeRequest(supportRequest: ID): Promise<void> {
    return Promise.resolve(undefined);
  }

  getUnreadCount(supportRequest: ID): Promise<MessageDocument[]> {
    return Promise.resolve([]);
  }

  markMessagesAsRead(params: MarkMessagesAsReadDto) {}
}
