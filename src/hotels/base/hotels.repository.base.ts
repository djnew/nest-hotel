import { IHotel } from './hotels.types.base';

export const I_HOTELS_REPOSITORY: unique symbol = Symbol('IHotelsRepository');

export interface IHotelsRepository {
  makeId(id: string): IHotel['_id'];
}
