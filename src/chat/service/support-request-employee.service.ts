import { forwardRef, Inject, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import {
  ISupportRequest,
  MessagesMarkMessagesAsRead,
} from '../base/chat.types.base';
import { ISupportRequestEmployeeService } from '../base/support-request-employee.service.base';
import { MessagesRepository } from '../repository/messages.repository';
import { SupportRequestsRepository } from '../repository/support-requests.repository';
import { SupportRequestService } from './support-request.service';

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    private readonly supportRequestRepository: SupportRequestsRepository,
    private readonly messagesRepository: MessagesRepository,
  ) {}

  closeRequest(supportRequest: ISupportRequest['_id']): Promise<void> {
    // todo надо сделать
    return Promise.resolve(undefined);
  }

  async getUnreadCount(id: ISupportRequest['_id']): Promise<number> {
    const supportRequest = await this.supportRequestRepository.getById(id);
    return this.messagesRepository.countMessageByFilter({
      id: supportRequest.messages,
      author: supportRequest.user,
      readAt: null,
    });
  }

  async markMessagesAsRead(
    id: ISupportRequest['_id'],
  ): Promise<MessagesMarkMessagesAsRead> {
    const supportRequest = await this.supportRequestRepository.getById(id);

    await this.messagesRepository.updateMany(
      {
        id: supportRequest.messages,
        author: supportRequest.user,
        readAt: null,
      },
      {
        readAt: dayjs(),
      },
    );

    return {
      success: true,
    };
  }
}
