import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ID } from '../../types/types';

export interface IUser {
  _id?: ID;
  email: string;
  passwordHash: string;
  name: string;
  contactPhone: string;
  role: string;
}

export type UserDocument = IUser & Document;

@Schema()
export class User implements IUser {
  @Prop()
  contactPhone: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  passwordHash: string;
  @Prop({ required: true, default: 'client' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
