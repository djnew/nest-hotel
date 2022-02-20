import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelsModule } from '../hotels/hotels.module';
import { UsersModule } from '../users/users.module';
import { Reservation, ReservationScheme } from './entities/reservation.entity';
import { ReservationsRepository } from './repository/reservations.repository';
import { ReservationProvider } from './reservation.provider';
import { ReservationsService } from './service/reservations.service';
import { ReservationsController } from './reservations.controller';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationScheme },
    ]),
    HotelsModule,
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    ReservationsRepository,
    ...ReservationProvider,
  ],
  exports: [...ReservationProvider],
})
export class ReservationsModule {}
