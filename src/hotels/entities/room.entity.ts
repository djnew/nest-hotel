import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { IHotel } from '../base/hotels.types.base';
import { IRoom } from '../base/rooms.types.base';

@Schema({ timestamps: true })
export class Room implements IRoom {
  @Prop({ required: true })
  isEnabled: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Hotel' })
  hotel: IHotel['_id'];

  @Prop({ optional: true })
  description: string;

  @Prop({ optional: true })
  images: string[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
