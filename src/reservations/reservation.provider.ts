import { I_RESERVATION_SERVICE } from './base/reservation.service.base';
import { I_RESERVATIONS_REPOSITORY } from './base/reservations.repository.base';
import { ReservationsRepository } from './repository/reservations.repository';
import { ReservationsService } from './service/reservations.service';

export const ReservationProvider = [
  {
    provide: I_RESERVATION_SERVICE,
    useClass: ReservationsService,
  },
  {
    provide: I_RESERVATIONS_REPOSITORY,
    useClass: ReservationsRepository,
  },
];
