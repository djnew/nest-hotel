import { IUser } from '../../users/base/users.types.base';
import { ReservationDto } from '../dto/reservation.dto';
import {
  IReservation,
  IReservationResponse,
  ReservationSearchOptions,
} from './reservation.type.base';

export const I_RESERVATION_SERVICE: unique symbol = Symbol(
  'IReservationService',
);

export interface IReservationService {
  addReservation(data: ReservationDto): Promise<IReservationResponse>;

  removeReservation(
    id: IReservation['_id'],
    userId: IUser['_id'],
  ): Promise<void>;

  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<IReservationResponse[]>;

  makeReservationId(id: string): IReservation['_id'];
}
