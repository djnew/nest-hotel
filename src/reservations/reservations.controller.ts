import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginGuard } from '../auth/guard/login.guard';
import {
  I_ROOMS_REPOSITORY,
  IRoomsRepository,
} from '../hotels/base/rooms.repository.base';
import {
  I_USERS_REPOSITORY,
  IUsersRepository,
} from '../users/base/users.repository.base';
import { UserRole } from '../users/base/users.types.base';
import { Roles } from '../users/decorator/roles.decorator';
import { IReservationCreate } from './base/reservation.type.base';
import {
  I_RESERVATIONS_REPOSITORY,
  IReservationsRepository,
} from './base/reservations.repository.base';
import { ReservationSearchDto } from './dto/reservation-search.dto';
import { ReservationDto } from './dto/reservation.dto';
import { ReservationsService } from './service/reservations.service';

@Controller('api')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    @Inject(I_RESERVATIONS_REPOSITORY)
    private readonly reservationRepository: IReservationsRepository,
    @Inject(I_USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    @Inject(I_ROOMS_REPOSITORY)
    private readonly roomRepository: IRoomsRepository,
  ) {}

  @Post('client/reservations')
  @Roles(UserRole.Client)
  @UseGuards(LoginGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Req() request, @Body() createReservationDto: ReservationDto) {
    const { endDate, startDate, hotelRoom } = createReservationDto;
    const reservationCreateData: IReservationCreate = {
      dateEnd: endDate,
      dateStart: startDate,
      userId: this.usersRepository.makeId(request.user.id),
      roomId: this.roomRepository.makeId(hotelRoom),
    };
    return this.reservationsService.addReservation(reservationCreateData);
  }

  @Get('client/reservations/')
  @Roles(UserRole.Client)
  @UseGuards(LoginGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  getAllUserReservationClient(
    @Req() req,
    @Query() reservationSearch: ReservationSearchDto,
  ) {
    return this.reservationsService.getReservations({
      user: this.usersRepository.makeId(req.user.id),
      dateEnd: reservationSearch.endDate,
      dateStart: reservationSearch.startDate,
    });
  }

  @Get('manager/reservations/:userId')
  @Roles(UserRole.Manager)
  @UseGuards(LoginGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  getAllUserReservation(
    @Req() req,
    @Param('userId') userId: string,
    @Query() reservationSearch: ReservationSearchDto,
  ) {
    return this.reservationsService.getReservations({
      user: this.usersRepository.makeId(userId),
      dateEnd: reservationSearch.endDate,
      dateStart: reservationSearch.startDate,
    });
  }

  @Delete('/client/reservations/:reservationId')
  @Roles(UserRole.Client)
  @UseGuards(LoginGuard)
  removeClientReservation(@Req() req, @Param('reservationId') id: string) {
    return this.reservationsService.removeReservation(
      this.reservationRepository.makeId(id),
      this.usersRepository.makeId(req.user.id),
    );
  }

  @Delete('/manager/reservations/:userId/:reservationId')
  @Roles(UserRole.Manager)
  @UseGuards(LoginGuard)
  remove(@Param('userId') userId: string, @Param('reservationId') id: string) {
    return this.reservationsService.removeReservation(
      this.reservationRepository.makeId(id),
      this.usersRepository.makeId(userId),
    );
  }
}
