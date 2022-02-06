import { ReservationDto } from '../dto/reservation.dto';
import { ReservationDocument } from '../entities/reservation.entity';

export interface ReservationSearchOptions {
  user: string;
  dateStart: Date;
  dateEnd: Date;
}
