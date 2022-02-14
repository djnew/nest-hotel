import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { make } from 'ts-brand';
import {
  I_HOTELS_SERVICE,
  IHotelsService,
} from '../../hotels/base/hotels.service.base';
import { IHotel } from '../../hotels/base/hotels.types.base';
import {
  I_ROOMS_SERVICE,
  IHotelRoomsService,
} from '../../hotels/base/rooms.service.base';
import { IRoom, RoomDocument } from '../../hotels/base/rooms.types.base';
import { IReservationService } from '../base/reservation.service.base';
import {
  IReservation,
  ReservationDocument,
  ReservationSearchOptions,
} from '../base/reservation.type.base';
import { ReservationDto } from '../dto/reservation.dto';
import { Reservation } from '../entities/reservation.entity';

@Injectable()
export class ReservationsService implements IReservationService {
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

  async addReservation(data: ReservationDto): Promise<ReservationDocument> {
    try {
      const room: RoomDocument = await this.roomService.findById(data.room);

      if (room) {
        const reservation: ReservationDocument[] =
          await this.searchReservationForDates(
            this.roomService.makeRoomId(data.room),
            this.hotelService.makeHotelId(data.hotel),
            data.dateStart,
            data.dateEnd,
          );

        if (!reservation.length) {
          const newReservation = new this.reservationModel(data);
          await newReservation.save();
          return newReservation;
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
      dateStart: { $gte: dateStart, $lte: dateEnd },
      dateEnd: { $gte: dateStart, $lte: dateEnd },
    });
  }

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<ReservationDocument>> {
    try {
      return await this.reservationModel.find({
        userId: filter.user,
        dateStart: { $gte: filter.dateStart, $lte: filter.dateEnd },
        dateEnd: { $gte: filter.dateStart, $lte: filter.dateEnd },
      });
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

  async removeReservation(id: string): Promise<void> {
    await this.reservationModel.deleteOne({ _id: id });
  }

  makeReservationId(id: string): IReservation['_id'] {
    return this.makeId(id);
  }
}
