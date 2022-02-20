import { IUser } from '../../users/base/users.types.base';
import {
  IReservation,
  IReservationCreate,
  IReservationResponse,
  ReservationSearchOptions,
} from './reservation.type.base';

export const I_RESERVATION_SERVICE: unique symbol = Symbol(
  'IReservationService',
);

export interface IReservationService {
  addReservation(data: IReservationCreate): Promise<IReservationResponse>;

  removeReservation(
    id: IReservation['_id'],
    userId: IUser['_id'],
  ): Promise<void>;

  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<IReservationResponse[]>;
}
