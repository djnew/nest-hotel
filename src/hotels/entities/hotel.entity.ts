import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IHotel } from '../base/hotels.types.base';

@Schema({ timestamps: true })
export class Hotel implements IHotel {
  @Prop({ required: true })
  title: string;

  @Prop({ optional: true })
  description: string;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
