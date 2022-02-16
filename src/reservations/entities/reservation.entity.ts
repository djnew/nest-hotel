import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { IHotel } from '../../hotels/base/hotels.types.base';
import { IRoom } from '../../hotels/base/rooms.types.base';
import { ID } from '../../types/types';
import { IUser } from '../../users/base/users.types.base';
import { IReservation } from '../base/reservation.type.base';

@Schema()
export class Reservation implements IReservation {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  userId: IUser['_id'];

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Hotel',
  })
  hotelId: IHotel['_id'];

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Room',
  })
  roomId: IRoom['_id'];

  @Prop({ required: true })
  dateEnd: Date;

  @Prop({ required: true })
  dateStart: Date;
}

export const ReservationScheme = SchemaFactory.createForClass(Reservation);
