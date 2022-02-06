import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { ReservationDto } from './dto/reservation.dto';
import { ReservationSearchOptions } from './service/i-reservations.service';
import { ReservationsService } from './service/reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() createReservationDto: ReservationDto) {
    return this.reservationsService.addReservation(createReservationDto);
  }

  @Post()
  findAll(@Body() params: ReservationSearchOptions) {
    return this.reservationsService.getReservations(params);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.removeReservation(id);
  }
}
