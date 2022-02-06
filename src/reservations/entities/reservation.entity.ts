import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ID } from '../../types/types';

export type ReservationDocument = IReservation & Document;

export interface IReservation {
  _id?: ID;
  userId: ID;
  hotelId: ID;
  roomId: ID;
  dateStart: Date;
  dateEnd: Date;
}

@Schema()
export class Reservation implements IReservation {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  userId: ID;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Hotel',
  })
  hotelId: ID;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Room',
  })
  roomId: ID;

  @Prop({ required: true })
  dateEnd: Date;

  @Prop({ required: true })
  dateStart: Date;
}

export const ReservationScheme = SchemaFactory.createForClass(Reservation);
