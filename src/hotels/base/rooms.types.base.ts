import { Document } from 'mongoose';
import { Brand } from 'ts-brand';
import { ID } from '../../types/types';
import {
  HotelDocument,
  IHotel,
  IHotelInCreateRoomResponse,
  IHotelInSearchRoomResponse,
} from './hotels.types.base';

export type RoomDocument = IRoom & Document;

export interface ICreateRoomResponse {
  id: string;
  description: string;
  images: string[];
  isEnabled: boolean;
  hotel: IHotelInCreateRoomResponse;
}

export interface IRoom {
  _id?: Brand<ID, IRoom>;
  createdAt?: Date;
  updatedAt?: Date;
  isEnabled: boolean;
  hotel: IHotel['_id'] | HotelDocument;
  description?: string;
  images?: string[];
}

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  title?: string;
  isEnabled?: boolean;
  hotel?: string;
}

export interface ISearchRoomResponse {
  id: string;
  images: string[];
  description: string;
  hotel: IHotelInSearchRoomResponse;
}

export interface RoomFilter {
  title?: unknown;
  hotel?: unknown;
  isEnabled?: unknown;
}
