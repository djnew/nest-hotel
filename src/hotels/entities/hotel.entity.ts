import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ID } from '../../types/types';

export type HotelDocument = IHotel & Document;

export interface IHotel {
  _id?: ID;
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  description?: string;
}

@Schema({ timestamps: true })
export class Hotel implements IHotel {
  @Prop({ required: true })
  title: string;

  @Prop({ optional: true })
  description: string;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
