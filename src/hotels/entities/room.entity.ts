import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ID } from '../../types/types';
import { HotelDocument } from './hotel.entity';

export type RoomDocument = IRoom & Document;

export interface IRoom {
  _id?: ID;
  createdAt?: Date;
  updatedAt?: Date;
  isEnabled: boolean;
  hotel: HotelDocument | ID;
  description?: string;
  images?: string[];
}

@Schema({ timestamps: true })
export class Room implements IRoom {
  @Prop({ required: true })
  isEnabled: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Hotel' })
  hotel: HotelDocument | ID;

  @Prop({ optional: true })
  description: string;

  @Prop({ optional: true })
  images: string[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
