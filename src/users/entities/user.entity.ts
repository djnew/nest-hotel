import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser, UserRole } from '../base/users.types.base';

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
  @Prop({ required: true, default: UserRole.Client })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
