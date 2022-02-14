import { Document } from 'mongoose';
import { Brand } from 'ts-brand';
import { ID } from '../../types/types';

export interface ReservationSearchOptions {
  user: string;
  dateStart: Date;
  dateEnd: Date;
}

export type ReservationDocument = IReservation & Document;

export interface IReservation {
  _id?: Brand<ID, IReservation>;
  userId: ID;
  hotelId: ID;
  roomId: ID;
  dateStart: Date;
  dateEnd: Date;
}
