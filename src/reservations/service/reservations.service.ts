import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { make } from 'ts-brand';
import {
  I_HOTELS_SERVICE,
  IHotelsService,
} from '../../hotels/base/hotels.service.base';
import {
  IHotel,
  IHotelInSearchRoomResponse,
} from '../../hotels/base/hotels.types.base';
import {
  I_ROOMS_SERVICE,
  IHotelRoomsService,
} from '../../hotels/base/rooms.service.base';
import {
  IRoom,
  ISearchRoomResponse,
  RoomDocument,
} from '../../hotels/base/rooms.types.base';
import { IUser } from '../../users/base/users.types.base';
import { IReservationService } from '../base/reservation.service.base';
import {
  IReservation,
  IReservationResponse,
  ReservationDocument,
  ReservationSearchOptions,
} from '../base/reservation.type.base';
import { ReservationDto } from '../dto/reservation.dto';
import { Reservation } from '../entities/reservation.entity';

@Injectable()
export class ReservationsService implements IReservationService {
  private logger: Logger = new Logger('RoomsService');
  private readonly makeId;

  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
    @Inject(I_HOTELS_SERVICE)
    private readonly hotelService: IHotelsService,
    @Inject(I_ROOMS_SERVICE)
    private readonly roomService: IHotelRoomsService,
  ) {
    this.makeId = make<IReservation['_id']>();
  }

  async addReservation(data: ReservationDto): Promise<IReservationResponse> {
    if (!data.startDate.isValid() || !data.endDate.isValid()) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Не верно указана дата',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const room = await this.roomService.findById(
        this.roomService.makeRoomId(data.hotelRoom),
      );
      this.logger.debug(room);
      if (room) {
        const reservation: ReservationDocument[] =
          await this.searchReservationForDates(
            this.roomService.makeRoomId(data.hotelRoom),
            this.hotelService.makeHotelId(room.hotel.id),
            data.startDate.format('YYYY-MM-DD'),
            data.endDate.format('YYYY-MM-DD'),
          );

        if (!reservation.length) {
          const newReservation = new this.reservationModel({
            roomId: data.hotelRoom,
            userId: data.userId,
            hotelId: room.hotel.id,
            dateEnd: data.endDate,
            dateStart: data.startDate,
          });
          await newReservation.save();
          const reservationWithHotelAndRoom = await this.reservationModel
            .findOne({
              id: newReservation.id,
            })
            .populate<{ hotelId: IHotelInSearchRoomResponse }>('hotelId')
            .populate<{ roomId: ISearchRoomResponse }>('roomId')
            .exec();
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
    return this.reservationModel.find({
      roomId: roomId,
      hotelId: hotelId,
      $or: [
        { dateStart: { $gte: dateStart, $lte: dateEnd } },
        { dateEnd: { $gte: dateStart, $lte: dateEnd } },
      ],
    });
  }

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<IReservationResponse[]> {
    if (!filter.dateStart.isValid() || !filter.dateStart.isValid()) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Не верно указана дата',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const reservations = await this.reservationModel
        .find({
          userId: filter.user,
          $or: [
            { dateStart: { $gte: filter.dateStart, $lte: filter.dateEnd } },
            { dateEnd: { $gte: filter.dateStart, $lte: filter.dateEnd } },
          ],
        })
        .populate<Pick<ReservationDocument, 'hotelId'>>('hotelId')
        .populate<Pick<ReservationDocument, 'roomId'>>('roomId')
        .exec();
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
    const reservation = await this.reservationModel.findOne({
      id,
      userId,
    });
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
    await this.reservationModel.deleteOne({ _id: id });
  }

  makeReservationId(id: string): IReservation['_id'] {
    return this.makeId(id);
  }
}
