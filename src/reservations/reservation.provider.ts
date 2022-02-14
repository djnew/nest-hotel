import { I_RESERVATION_SERVICE } from './base/reservation.service.base';
import { ReservationsService } from './service/reservations.service';

export const ReservationProvider = [
  {
    provide: I_RESERVATION_SERVICE,
    useClass: ReservationsService,
  },
];
