import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { IUser } from '../../users/base/users.types.base';
import { IMessage } from '../base/chat.types.base';

@Schema()
export class Message implements IMessage {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  author: IUser['_id'];

  @Prop({ optional: true })
  readAt: Date;

  @Prop({ required: true })
  sentAt: Date;

  @Prop({ optional: true })
  text?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
