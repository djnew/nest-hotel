import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import { Model } from 'mongoose';
import { make } from 'ts-brand';
import {
  IMessage,
  MessageDocument,
  SendMessageDto,
} from '../base/chat.types.base';
import { IMessagesRepository } from '../base/messages.repository.base';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessagesRepository implements IMessagesRepository {
  private logger: Logger = new Logger('MessagesRepository');
  private readonly idMaker;

  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private eventEmitter: EventEmitter2,
  ) {
    this.idMaker = make<IMessage['_id']>();
  }

  makeId(id: string): IMessage['_id'] {
    return this.idMaker(id);
  }

  async create(data: SendMessageDto): Promise<MessageDocument> {
    try {
      const message = new this.messageModel({
        author: data.author,
        sentAt: dayjs(),
        text: data.text,
      });
      this.eventEmitter.emit('message.create', await message.save());
      return message;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async countMessageByFilter(filter): Promise<number> {
    return this.messageModel.countDocuments(filter).exec();
  }

  async updateMany(filter, params) {
    await this.messageModel.updateMany(filter, params).exec();
  }

  async search(filter) {
    return await this.messageModel
      .find(filter)
      .populate<Pick<MessageDocument, 'author'>>({
        path: 'author',
      })
      .exec();
  }
}
