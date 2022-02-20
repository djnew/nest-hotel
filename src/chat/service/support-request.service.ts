import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  HotelEmitterEvents,
  HotelEventEmitter,
} from '../../event-emitter/emitter';
import { ID } from '../../types/types';
import {
  I_USERS_REPOSITORY,
  IUsersRepository,
} from '../../users/base/users.repository.base';
import {
  I_USER_SERVICE,
  IUserService,
} from '../../users/base/users.service.base';

import {
  GetChatListParams,
  IMessageResponse,
  ISupportRequest,
  ISupportRequestResponse,
  MessageDocument,
  SendMessageDto,
  SupportRequestDocument,
  SupportRequestsSubscribers,
} from '../base/chat.types.base';
import { ISupportRequestService } from '../base/support-request.service.base';
import { SupportRequest } from '../entities/support-request.entity';
import { MessagesRepository } from '../repository/messages.repository';
import { SupportRequestsRepository } from '../repository/support-requests.repository';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestEmployeeService } from './support-request-employee.service';
import { SupportRequestFilterService } from './support-request-filter.service';

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly supportRequestFilter: SupportRequestFilterService,
    @Inject(I_USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    @Inject(I_USER_SERVICE)
    private readonly userService: IUserService,
    private readonly supportRequestClient: SupportRequestClientService,
    private readonly supportRequestEmployee: SupportRequestEmployeeService,
    private readonly messagesRepository: MessagesRepository,
    private readonly supportRequestsRepository: SupportRequestsRepository,
  ) {}

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<ISupportRequestResponse[]> {
    const { filter, limit, offset } =
      this.supportRequestFilter.createRequestListFilter(params);

    const supportRequests = await this.supportRequestsRepository.search(
      filter,
      offset,
      limit,
    );

    if ('user' in params) {
      return supportRequests.map((supportRequest) => ({
        id: supportRequest.id,
        createAt: supportRequest.createdAt.toDateString(),
        isActive: supportRequest.isActive,
        hasNewMessages: Boolean(
          this.supportRequestClient.getUnreadCount(
            this.supportRequestsRepository.makeId(supportRequest.id),
          ),
        ),
      }));
    } else {
      return supportRequests.map((supportRequest) => ({
        id: supportRequest.id,
        createAt: supportRequest.createdAt.toDateString(),
        isActive: supportRequest.isActive,
        hasNewMessages: Boolean(
          this.supportRequestEmployee.getUnreadCount(
            this.supportRequestsRepository.makeId(supportRequest.id),
          ),
        ),
        client: {
          id: 'id' in supportRequest.user ? supportRequest.user.id : '',
          name: 'name' in supportRequest.user ? supportRequest.user.name : '',
          email:
            'email' in supportRequest.user ? supportRequest.user.email : '',
          contactPhone:
            'contactPhone' in supportRequest.user
              ? supportRequest.user.contactPhone
              : '',
        },
      }));
    }
  }

  async getMessages(id: ISupportRequest['_id']): Promise<IMessageResponse[]> {
    const supportRequest = await this.supportRequestsRepository.getById(id);
    const messages = await this.messagesRepository.search({
      id: supportRequest.messages,
    });
    return messages.map((message) => ({
      id: message.id,
      createdAt: message.sentAt.toDateString(),
      text: message.text,
      readAt: message.readAt.toDateString(),
      author: {
        id: 'id' in message.author ? message.author.id : '',
        name: 'name' in message.author ? message.author.name : '',
      },
    }));
  }

  async sendMessage(data: SendMessageDto): Promise<IMessageResponse> {
    const message = await this.messagesRepository.create(data);
    if (message) {
      return {
        id: message.id,
        createdAt: message.sentAt.toDateString(),
        text: message.text,
        readAt: message.readAt.toDateString() || null,
        author: await this.userService.findById(
          this.usersRepository.makeId(message.author.toString()),
        ),
      };
    } else {
      throw new BadRequestException();
    }
  }

  getSupportRequestById(id: ISupportRequest['_id']) {
    return this.supportRequestsRepository.getById(id);
  }

  subscribe(handler: SupportRequestsSubscribers['fn']): () => void {
    HotelEventEmitter.on(
      HotelEmitterEvents.SEND_MESSAGE,
      (supportRequest: ID, message: MessageDocument) => {
        handler(supportRequest, message);
      },
    );
    return;
  }

  unsubscribe(handler: SupportRequestsSubscribers['fn']): void {
    HotelEventEmitter.off(HotelEmitterEvents.SEND_MESSAGE, handler);
  }
}
