import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { ID } from '../../types/types';
import { IReservation } from '../base/reservation.type.base';

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
