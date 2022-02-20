import { IReservation } from './reservation.type.base';

export const I_RESERVATIONS_REPOSITORY: unique symbol = Symbol(
  'IReservationsRepository',
);

export interface IReservationsRepository {
  makeId(id: string): IReservation['_id'];
}
