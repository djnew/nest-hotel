import { Logger, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { LoginWsGuard } from '../auth/guard/login-ws.guard';
import { RolesWsGuard } from '../auth/guard/roles-ws.guard';
import { ID } from '../types/types';
import { UserRole } from '../users/base/users.types.base';
import { Roles } from '../users/decorator/roles.decorator';
import {
  MessageDocument,
  SupportRequestsSubscribers,
} from './base/chat.types.base';
import { SubscribeDTO } from './dto/subscribe.dto';
import { SupportRequestService } from './service/support-request.service';

@WebSocketGateway()
export class ChatGateway {
  private logger: Logger = new Logger('ChatGateway');
  private subscribers: SupportRequestsSubscribers[] = [];

  constructor(private readonly supportRequest: SupportRequestService) {}

  @SubscribeMessage('subscribeToChat')
  @Roles(UserRole.Client)
  @UseGuards(LoginWsGuard, RolesWsGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  chatSubscribe(
    @MessageBody() body: SubscribeDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const subscribeHandler = (supportRequest: ID, message: MessageDocument) => {
      if (body.chatId === supportRequest)
        client.emit('sendMessage', {
          id: message.id,
          createdAt: message.sentAt.toLocaleString(),
          text: message.text,
          readAt: message.readAt.toLocaleString(),
          author: {
            id: 'id' in message.author ? message.author.id : '',
            name: 'name' in message.author ? message.author.name : '',
          },
        });
      return;
    };
    const subscribe = this.subscribers.find(
      (s) => s.wsClientId === client.id && s.supportRequestId === body.chatId,
    );
    if (!subscribe) {
      this.supportRequest.subscribe(subscribeHandler);
      this.subscribers.push({
        supportRequestId: body.chatId,
        wsClientId: client.id,
        fn: subscribeHandler,
      });
    }
  }

  @SubscribeMessage('unsubscribeToChat')
  @Roles(UserRole.Client)
  @UseGuards(LoginWsGuard, RolesWsGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  chatUnsubscribe(
    @MessageBody() body: SubscribeDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const subscribe = this.subscribers.find(
      (s) => s.wsClientId === client.id && s.supportRequestId === body.chatId,
    );
    if (subscribe) {
      this.supportRequest.unsubscribe(subscribe.fn);
      this.subscribers = this.subscribers.filter(
        (s) => s.wsClientId !== client.id && s.supportRequestId !== body.chatId,
      );
    }
  }

  afterInit() {
    this.logger.log('ChatGateway Init');
  }

  handleDisconnect(client: Socket) {
    const subscribe = this.subscribers.filter(
      (s) => s.wsClientId === client.id,
    );
    if (subscribe.length) {
      subscribe.forEach((s) => {
        this.supportRequest.unsubscribe(s.fn);
      });
      this.subscribers = this.subscribers.filter(
        (s) => s.wsClientId !== client.id,
      );
    }
    this.logger.debug(
      `Client disconnected: ${client.id}, user${client.handshake['session'].passport?.user}`,
    );
  }

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
    this.logger.debug(`curUser ${client.handshake['session'].passport?.user}`);
    client.emit('chat.msgToClient', {
      name: 'server',
      text: `you id: ${client.id}`,
    });
  }
}
