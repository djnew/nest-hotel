import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomDocument } from '../../hotels/entities/room.entity';
import {
  HotelRoomService,
  I_ROOMS_SERVICE,
} from '../../hotels/service/rooms/i-rooms.service';
import { ReservationDto } from '../dto/reservation.dto';
import {
  Reservation,
  ReservationDocument,
} from '../entities/reservation.entity';
import { ReservationSearchOptions } from './i-reservations.service';

export interface IReservation {
  addReservation(data: ReservationDto): Promise<ReservationDocument>;
  removeReservation(id: string): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<ReservationDocument>>;
}

@Injectable()
export class ReservationsService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
    @Inject(I_ROOMS_SERVICE)
    private readonly roomService: HotelRoomService,
  ) {}

  async addReservation(data: ReservationDto): Promise<ReservationDocument> {
    try {
      const room: RoomDocument = await this.roomService.findById(data.room);

      if (room) {
        const reservation: ReservationDocument[] =
          await this.reservationModel.find({
            roomId: data.room,
            dateStart: { $gte: data.dateStart, $lte: data.dateEnd },
            dateEnd: { $gte: data.dateStart, $lte: data.dateEnd },
          });
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
}
