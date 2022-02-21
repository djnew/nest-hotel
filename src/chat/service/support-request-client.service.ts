import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { IUser } from '../../users/base/users.types.base';
import {
  CreateSupportRequestDto,
  ISupportRequest,
  ISupportRequestResponse,
  MessagesMarkMessagesAsRead,
} from '../base/chat.types.base';
import { ISupportRequestClientService } from '../base/support-request-client.service.base';
import { MessagesRepository } from '../repository/messages.repository';
import { SupportRequestsRepository } from '../repository/support-requests.repository';

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  private logger: Logger = new Logger('SupportRequestClientService');
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly supportRequestRepository: SupportRequestsRepository,
  ) {}

  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<ISupportRequestResponse> {
    this.logger.log(data);
    const supportRequest = await this.supportRequestRepository.create(data);
    if (supportRequest) {
      const message = await this.messagesRepository.create({
        author: data.user,
        text: data.text,
        supportRequest: supportRequest.id,
      });
      await this.supportRequestRepository.updateMessage(supportRequest.id, [
        message.id,
      ]);
      return {
        id: supportRequest.id,
        createAt: supportRequest.createdAt.toDateString(),
        isActive: supportRequest.isActive,
        hasNewMessages: false,
      };
    } else {
      throw new BadRequestException();
    }
  }

  async checkAccess(id: ISupportRequest['_id'], userId: IUser['_id']) {
    const supportRequest = await this.supportRequestRepository.getById(id);
    return supportRequest.user === userId;
  }

  async getUnreadCount(id: ISupportRequest['_id']): Promise<number> {
    const supportRequest = await this.supportRequestRepository.getById(id);

    return this.messagesRepository.countMessageByFilter({
      id: supportRequest.messages,
      author: { $ne: supportRequest.user },
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
        author: { $ne: supportRequest.user },
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
