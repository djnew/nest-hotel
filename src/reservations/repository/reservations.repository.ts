import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { make } from 'ts-brand';
import { IHotelInSearchRoomResponse } from '../../hotels/base/hotels.types.base';
import { ISearchRoomResponse } from '../../hotels/base/rooms.types.base';
import { IUser } from '../../users/base/users.types.base';
import {
  IReservation,
  ReservationDocument,
} from '../base/reservation.type.base';
import { IReservationsRepository } from '../base/reservations.repository.base';
import { Reservation } from '../entities/reservation.entity';

@Injectable()
export class ReservationsRepository implements IReservationsRepository {
  private readonly idMaker;

  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
  ) {
    this.idMaker = make<IReservation['_id']>();
  }

  makeId(id: string): IReservation['_id'] {
    return this.idMaker(id);
  }

  async remove(id: IReservation['_id']): Promise<void> {
    await this.reservationModel.deleteOne({ _id: id });
  }

  async getById(
    id: IReservation['_id'],
    userId: IUser['_id'] = null,
  ): Promise<
    ReservationDocument & { hotelId: IHotelInSearchRoomResponse } & {
      roomId: ISearchRoomResponse;
    }
  > {
    const filter = {
      id,
    };
    if (userId) {
      filter['userId'] = userId;
    }
    return this.reservationModel
      .findOne(filter)
      .populate<{ hotelId: IHotelInSearchRoomResponse }>('hotelId')
      .populate<{ roomId: ISearchRoomResponse }>('roomId');
  }

  async search(filter): Promise<ReservationDocument[]> {
    return this.reservationModel
      .find(filter)
      .populate<Pick<ReservationDocument, 'hotelId'>>('hotelId')
      .populate<Pick<ReservationDocument, 'roomId'>>('roomId')
      .exec();
  }

  async create(data: IReservation): Promise<ReservationDocument> {
    const newReservation = new this.reservationModel(data);
    await newReservation.save();
    return newReservation;
  }
}
