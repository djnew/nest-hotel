import { ID } from '../../types/types';
import { IHotelInSearchRoomResponse, IHotel } from './hotels.types.base';
import { SearchRoomsParams } from './rooms.types.base';

export const I_HOTELS_SERVICE: unique symbol = Symbol('IHotelsService');

export interface IHotelsService {
  create(data: any): Promise<IHotelInSearchRoomResponse>;

  findById(id: ID): Promise<IHotelInSearchRoomResponse>;

  search(
    params: Pick<IHotelInSearchRoomResponse, 'title'>,
  ): Promise<IHotelInSearchRoomResponse[]>;

  makeHotelId(id: string): IHotel['_id'];
}

export interface IHotelServiceAdditionalMethods {
  searchHotelByCustomFilter(
    filter: SearchRoomsParams,
    limit: number,
    offset: number,
  ): Promise<IHotelInSearchRoomResponse[]>;
}
