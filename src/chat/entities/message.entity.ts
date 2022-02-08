import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ID } from '../../types/types';

export type MessageDocument = IMessage & Document;

export interface IMessage {
  _id?: ID;
  author: ID;
  sentAt: Date;
  text?: string;
  readAt: Date;
}

@Schema()
export class Message implements IMessage {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  author: ID;
  @Prop({ required: true })
  readAt: Date;
  @Prop({ required: true })
  sentAt: Date;
  @Prop({ optional: true })
  text?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
