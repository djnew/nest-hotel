import { Document } from 'mongoose';
import { Brand } from 'ts-brand';

export type HotelDocument = IHotel & Document;

export interface IHotel {
  _id?: Brand<string, IHotel>;
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  description?: string;
}

export interface IHotelInCreateRoomResponse {
  id: string;
  title: string;
  description: string;
}

export interface IHotelInSearchRoomResponse {
  id: string;
  title: string;
  description?: string;
}
export interface HotelFilter {
  title?: string;
  id?: string;
}
export interface HotelFilterObject {
  key: string;
  val: unknown;
}
