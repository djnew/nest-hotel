import { ID } from '../../types/types';
import { HotelDocument, IHotel } from './hotels.types.base';
import { SearchRoomsParams } from './rooms.types.base';

export const I_HOTELS_SERVICE: unique symbol = Symbol('IHotelsService');

export interface IHotelsService {
  create(data: any): Promise<HotelDocument>;

  findById(id: ID): Promise<HotelDocument>;

  search(params: Pick<HotelDocument, 'title'>): Promise<HotelDocument[]>;

  makeHotelId(id: string): IHotel['_id'];
}

export interface IHotelServiceAdditionalMethods {
  searchHotelByRoomFilter(filter: SearchRoomsParams): Promise<HotelDocument[]>;
}
