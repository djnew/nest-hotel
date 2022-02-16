import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Logger,
  UseGuards,
  Req,
  Get,
  Query,
  Inject,
} from '@nestjs/common';
import { LoginGuard } from '../auth/guard/login.guard';
import { I_USER_SERVICE, IUserService } from '../users/base/users.service.base';
import { UserRole } from '../users/base/users.types.base';
import { Roles } from '../users/decorator/roles.decorator';
import { ReservationSearchOptions } from './base/reservation.type.base';
import { ReservationSearchDto } from './dto/reservation-search.dto';
import { ReservationDto } from './dto/reservation.dto';
import { ReservationsService } from './service/reservations.service';

@Controller('api')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    @Inject(I_USER_SERVICE) private readonly userService: IUserService,
  ) {}

  @Post('client/reservations')
  @Roles(UserRole.Client)
  @UseGuards(LoginGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Req() request, @Body() createReservationDto: ReservationDto) {
    createReservationDto.userId = request.user.id;
    return this.reservationsService.addReservation(createReservationDto);
  }

  @Get('client/reservations/:userId')
  @Roles(UserRole.Manager)
  @UseGuards(LoginGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  getAllUserReservation(
    @Req() req,
    @Param() userId: string,
    @Query() reservationSearch: ReservationSearchDto,
  ) {
    return this.reservationsService.getReservations({
      user: this.userService.makeUserId(userId),
      dateEnd: reservationSearch.endDate,
      dateStart: reservationSearch.startDate,
    });
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
