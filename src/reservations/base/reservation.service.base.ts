import { ReservationDto } from '../dto/reservation.dto';
import {
  IReservation,
  ISaveReservationResponse,
  ReservationDocument,
  ReservationSearchOptions,
} from './reservation.type.base';

export const I_RESERVATION_SERVICE: unique symbol = Symbol(
  'IReservationService',
);

export interface IReservationService {
  addReservation(data: ReservationDto): Promise<ISaveReservationResponse>;

  removeReservation(id: string): Promise<void>;

  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<ReservationDocument[]>;

  makeReservationId(id: string): IReservation['_id'];
}
