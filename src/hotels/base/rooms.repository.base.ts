import { IRoom } from './rooms.types.base';

export const I_ROOMS_REPOSITORY: unique symbol = Symbol('IRoomsRepository');

export interface IRoomsRepository {
  makeId(id: string): IRoom['_id'];
}
