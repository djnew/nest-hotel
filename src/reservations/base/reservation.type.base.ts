import * as dayjs from 'dayjs';
import { Document } from 'mongoose';
import { Brand } from 'ts-brand';
import {
  IHotel,
  IHotelInSearchRoomResponse,
} from '../../hotels/base/hotels.types.base';
import { IRoom, ISearchRoomResponse } from '../../hotels/base/rooms.types.base';
import { ID } from '../../types/types';
import { IUser } from '../../users/base/users.types.base';

export interface ReservationSearchOptions {
  user: IUser['_id'];
  dateStart: dayjs.Dayjs;
  dateEnd: dayjs.Dayjs;
}

export type ReservationDocument = IReservation & Document;

export interface IReservation {
  _id?: Brand<ID, IReservation>;
  dateStart: Date;
  dateEnd: Date;
  userId: Brand<ID, IUser>;
  hotelId: Brand<ID, IHotel> | IHotelInSearchRoomResponse;
  roomId: Brand<ID, IRoom> | ISearchRoomResponse;
}

export interface IReservationCreate {
  dateStart: dayjs.Dayjs;
  dateEnd: dayjs.Dayjs;
  userId: Brand<ID, IUser>;
  roomId: Brand<ID, IRoom>;
}

export interface IReservationResponse {
  hotel: IHotelInSearchRoomResponse;
  hotelRoom: ISearchRoomResponse;
  startDate: string;
  endDate: string;
}
