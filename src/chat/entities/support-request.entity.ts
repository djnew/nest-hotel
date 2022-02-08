import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ID } from '../../types/types';

export type SupportRequestDocument = ISupportRequest & Document;

export interface ISupportRequest {
  _id?: ID;
  user: ID;
  createdAt: Date;
  messages?: ID[];
  isActive?: boolean;
}

@Schema({ timestamps: true })
export class SupportRequest implements ISupportRequest {
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ optional: true })
  isActive?: boolean;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Message', optional: true })
  messages?: ID[];
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  user: ID;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
