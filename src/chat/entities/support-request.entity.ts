import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { IUser } from '../../users/base/users.types.base';
import { IMessage, ISupportRequest } from '../base/chat.types.base';

@Schema({ timestamps: true })
export class SupportRequest implements ISupportRequest {
  @Prop({ required: true })
  createdAt: Date;

  @Prop({ optional: true })
  isActive?: boolean;

  @Prop({ optional: true })
  messages?: IMessage['_id'][];

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: IUser['_id'];
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
