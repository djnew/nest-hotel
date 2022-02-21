import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  I_HOTELS_REPOSITORY,
  IHotelsRepository,
} from '../../hotels/base/hotels.repository.base';
import {
  I_HOTELS_SERVICE,
  IHotelsService,
} from '../../hotels/base/hotels.service.base';
import { IHotel } from '../../hotels/base/hotels.types.base';
import {
  I_ROOMS_SERVICE,
  IHotelRoomsService,
} from '../../hotels/base/rooms.service.base';
import { IRoom } from '../../hotels/base/rooms.types.base';
import { IUser } from '../../users/base/users.types.base';
import { IReservationService } from '../base/reservation.service.base';
import {
  IReservation,
  IReservationCreate,
  IReservationResponse,
  ReservationDocument,
  ReservationSearchOptions,
} from '../base/reservation.type.base';
import { ReservationsRepository } from '../repository/reservations.repository';

@Injectable()
export class ReservationsService implements IReservationService {
  private logger: Logger = new Logger('ReservationsService');

  constructor(
    @Inject(I_ROOMS_SERVICE)
    private readonly roomService: IHotelRoomsService,
    @Inject(ReservationsRepository)
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(I_HOTELS_REPOSITORY)
    private readonly hotelRepository: IHotelsRepository,
  ) {}

  async addReservation(
    data: IReservationCreate,
  ): Promise<IReservationResponse> {
    if (!data.dateStart.isValid() || !data.dateEnd.isValid()) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Не верно указана дата',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const room = await this.roomService.findById(data.roomId);
      this.logger.debug(room);
      if (room) {
        const hotelId = this.hotelRepository.makeId(room.hotel.id);
        const reservation: ReservationDocument[] =
          await this.searchReservationForDates(
            data.roomId,
            hotelId,
            data.dateStart.format('YYYY-MM-DD'),
            data.dateEnd.format('YYYY-MM-DD'),
          );

        if (!reservation.length) {
          const newReservation = await this.reservationsRepository.create({
            roomId: data.roomId,
            userId: data.userId,
            hotelId,
            dateEnd: data.dateEnd.toDate(),
            dateStart: data.dateStart.toDate(),
          });

          const reservationWithHotelAndRoom =
            await this.reservationsRepository.getById(newReservation.id);
          this.logger.debug(reservationWithHotelAndRoom);
          return {
            startDate: reservationWithHotelAndRoom.dateStart.toDateString(),
            endDate: reservationWithHotelAndRoom.dateEnd.toDateString(),
            hotelRoom: {
              description: reservationWithHotelAndRoom.roomId.description,
              images: reservationWithHotelAndRoom.roomId.images,
            },
            hotel: {
              title: reservationWithHotelAndRoom.hotelId.title,
              description: reservationWithHotelAndRoom.hotelId.description,
            },
          };
        }
      }

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Номер с указанным ID не существует или отключен',
        },
        HttpStatus.BAD_REQUEST,
      );
    } catch (e) {
      console.error(e);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Номер с указанным ID не существует или отключен',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async searchReservationForDates(
    roomId: IRoom['_id'],
    hotelId: IHotel['_id'],
    dateStart: string,
    dateEnd: string,
  ): Promise<ReservationDocument[]> {
    const filter = {
      roomId: roomId,
      hotelId: hotelId,
      $or: [
        { dateStart: { $gte: dateStart, $lte: dateEnd } },
        { dateEnd: { $gte: dateStart, $lte: dateEnd } },
      ],
    };
    return this.reservationsRepository.search(filter);
  }

  async getReservations(
    searchOptions: ReservationSearchOptions,
  ): Promise<IReservationResponse[]> {
    if (
      !searchOptions.dateStart.isValid() ||
      !searchOptions.dateStart.isValid()
    ) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Не верно указана дата',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const filter = {
        userId: searchOptions.user,
        $or: [
          {
            dateStart: {
              $gte: searchOptions.dateStart.format('YYYY-MM-DD'),
              $lte: searchOptions.dateEnd.format('YYYY-MM-DD'),
            },
          },
          {
            dateEnd: {
              $gte: searchOptions.dateStart.format('YYYY-MM-DD'),
              $lte: searchOptions.dateEnd.format('YYYY-MM-DD'),
            },
          },
        ],
      };

      const reservations = await this.reservationsRepository.search(filter);
      this.logger.log(reservations);
      this.logger.log(filter);
      return reservations.map((reservation) => ({
        startDate: reservation.dateStart.toDateString(),
        endDate: reservation.dateEnd.toDateString(),
        hotelRoom: {
          description:
            'description' in reservation.roomId
              ? reservation.roomId.description
              : '',
          images:
            'images' in reservation.roomId ? reservation.roomId.images : [],
        },
        hotel: {
          title:
            'title' in reservation.hotelId ? reservation.hotelId.title : '',
          description:
            'description' in reservation.hotelId
              ? reservation.hotelId.description
              : '',
        },
      }));
    } catch (e) {
      console.error(e);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Номер с указанным ID не существует или отключен',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeReservation(
    id: IReservation['_id'],
    userId: IUser['_id'],
  ): Promise<void> {
    const reservation = await this.reservationsRepository.getById(id, userId);
    if (!reservation) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Бронь с таким ИД не существует или не привязана к данному пользователю',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.reservationsRepository.remove(id);
  }
}
