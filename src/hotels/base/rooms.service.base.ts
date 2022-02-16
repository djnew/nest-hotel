import { ID } from '../../types/types';
import {
  ICreateRoomResponse,
  IRoom,
  ISearchRoomResponse,
  RoomDocument,
  SearchRoomsParams,
} from './rooms.types.base';

export const I_ROOMS_SERVICE: unique symbol = Symbol('IHotelRoomsService');

export interface IHotelRoomsService {
  create(data: Partial<IRoom>): Promise<ICreateRoomResponse>;

  findById(id: IRoom['_id'], isEnabled?: true): Promise<ISearchRoomResponse>;

  search(params: SearchRoomsParams): Promise<ISearchRoomResponse[]>;

  update(id: ID, data: Partial<RoomDocument>): Promise<ICreateRoomResponse>;

  makeRoomId(id: string): IRoom['_id'];
}
