import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRoom, Room, RoomDocument } from 'src/hotels/entities/room.entity';
import {
  HotelRoomService,
  SearchRoomsParams,
} from 'src/hotels/service/rooms/i-rooms.service';
import { RoomsFilterService } from 'src/hotels/service/rooms/rooms-filter.service';
import { ID } from 'src/types/types';
import { HotelDocument } from '../../entities/hotel.entity';

@Injectable()
export class RoomsService implements HotelRoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @Inject(RoomsFilterService) private readonly roomFilter: RoomsFilterService,
  ) {}

  async create(
    data: Partial<IRoom>,
  ): Promise<RoomDocument & { hotel: HotelDocument }> {
    const newRoom = new this.roomModel(data);
    try {
      await newRoom.save();
      return this.roomModel
        .findById(newRoom.id)
        .populate<{ hotel: HotelDocument }>('hotel')
        .orFail()
        .exec();
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  async findById(id: ID, isEnabled?: true): Promise<RoomDocument> {
    const findParams = {
      _id: id,
    };
    if (isEnabled) {
      findParams['isEnabled'] = true;
    }
    try {
      return this.roomModel.findOne(findParams);
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  async search(params: SearchRoomsParams): Promise<RoomDocument[]> {
    try {
      const { filter, limit, offset } =
        this.roomFilter.createRoomsListFilter(params);

      let roomFilterEnabled = {};
      if ('isEnabled' in filter) {
        roomFilterEnabled = {
          isEnabled: true,
        };
      }
      return await this.roomModel
        .find(roomFilterEnabled)
        .populate({
          path: 'hotel',
          match: {
            title: {
              $regex: new RegExp(filter.title),
              $options: 'i',
            },
          },
        })
        .limit(limit)
        .skip(offset);
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  async update(id: ID, data: Partial<RoomDocument>): Promise<RoomDocument> {
    return Promise.resolve(undefined);
  }
}
