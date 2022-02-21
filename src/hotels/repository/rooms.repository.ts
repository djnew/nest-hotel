import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { make } from 'ts-brand';
import { IHotelInSearchRoomResponse } from '../base/hotels.types.base';
import { IRoomsRepository } from '../base/rooms.repository.base';
import { IRoom, RoomDocument } from '../base/rooms.types.base';
import { Room } from '../entities/room.entity';

@Injectable()
export class RoomsRepository implements IRoomsRepository {
  private readonly idMaker;
  private logger: Logger = new Logger('RoomsRepository');

  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
  ) {
    this.idMaker = make<IRoom['_id']>();
  }

  makeId(id: string): IRoom['_id'] {
    return this.idMaker(id);
  }

  async create(data: Partial<IRoom>): Promise<RoomDocument> {
    const room = new this.roomModel(data);
    try {
      await room.save();
      return room;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async getById(
    id: IRoom['_id'],
  ): Promise<RoomDocument & { hotel: IHotelInSearchRoomResponse }> {
    try {
      return this.roomModel
        .findOne({ _id: id })
        .populate<{ hotel: IHotelInSearchRoomResponse }>('hotel')
        .orFail()
        .exec();
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async getOneByFilter(filter): Promise<RoomDocument> {
    try {
      return this.roomModel
        .findOne(filter)
        .populate<{ hotel: IHotelInSearchRoomResponse }>('hotel')
        .orFail()
        .exec();
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async update(id: IRoom['_id'], data: Partial<IRoom>) {
    try {
      await this.roomModel.updateOne({ _id: id }, data);
      return true;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async search(
    filter,
    offset: number = null,
    limit: number = null,
  ): Promise<RoomDocument[]> {
    try {
      const rooms = this.roomModel
        .find(filter)
        .populate<Pick<RoomDocument, 'hotel'>>({
          path: 'hotel',
        });
      if (limit) {
        rooms.limit(limit);
      }
      if (offset) {
        rooms.skip(offset);
      }
      return await rooms.exec();
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }
}
