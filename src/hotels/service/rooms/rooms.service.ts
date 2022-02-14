import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from 'src/hotels/entities/room.entity';
import { RoomsFilterService } from 'src/hotels/service/rooms/rooms-filter.service';
import { ID } from 'src/types/types';
import { make } from 'ts-brand';
import { HotelDocument } from '../../base/hotels.types.base';
import { IHotelRoomsService } from '../../base/rooms.service.base';
import {
  ICreateRoomResponse,
  IRoom,
  ISearchRoomResponse,
  RoomDocument,
  SearchRoomsParams,
} from '../../base/rooms.types.base';
import { HotelsService } from '../hotels/hotels.service';

@Injectable()
export class RoomsService implements IHotelRoomsService {
  private readonly makeId;
  private logger: Logger = new Logger('RoomsService');

  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @Inject(RoomsFilterService) private readonly roomFilter: RoomsFilterService,
    @Inject(HotelsService) private readonly hotelService: HotelsService,
  ) {
    this.makeId = make<IRoom['_id']>();
  }

  async create(data: Partial<IRoom>): Promise<ICreateRoomResponse> {
    const newRoom = new this.roomModel(data);
    try {
      await newRoom.save();
      const room: RoomDocument & { hotel: HotelDocument } = await this.roomModel
        .findById(newRoom.id)
        .populate<{ hotel: HotelDocument }>('hotel')
        .orFail()
        .exec();
      return {
        id: room.id,
        description: room.description,
        images: room.images,
        isEnabled: room.isEnabled,
        hotel: {
          id: room.hotel._id,
          title: room.hotel.title,
          description: room.hotel.description,
        },
      };
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  async findById(
    id: IRoom['_id'],
    isEnabled?: true,
  ): Promise<ISearchRoomResponse> {
    const findParams = {
      _id: id,
    };
    if (isEnabled) {
      findParams['isEnabled'] = true;
    }
    try {
      const room = await this.roomModel
        .findOne(findParams)
        .populate<Pick<RoomDocument, 'hotel'>>({
          path: 'hotel',
        })
        .exec();
      return {
        id: room.id,
        images: room.images,
        description: room.description,
        hotel: {
          id: 'id' in room.hotel ? room.hotel.id : '',
          title: 'title' in room.hotel ? room.hotel.title : '',
          description:
            'description' in room.hotel ? room.hotel.description : '',
        },
      };
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  async search(params: SearchRoomsParams): Promise<ISearchRoomResponse[]> {
    try {
      this.logger.debug(JSON.stringify(params));
      const { filter, limit, offset } =
        this.roomFilter.createRoomsListFilter(params);

      let hotels: HotelDocument[];
      if ('hotel' in filter || 'title' in filter) {
        hotels = await this.hotelService.searchHotelByRoomFilter(filter);
        if (!hotels.length) {
          throw new NotFoundException();
        }
      }

      const roomFilterEnabled = {};
      if ('isEnabled' in filter) {
        roomFilterEnabled['isEnabled'] = filter.isEnabled;
      }
      this.logger.debug(hotels);
      if (hotels) {
        roomFilterEnabled['hotel'] = hotels.map((hotel) => hotel.id);
      }

      const rooms = await this.roomModel
        .find(roomFilterEnabled)
        .populate<Pick<RoomDocument, 'hotel'>>({
          path: 'hotel',
        })
        .limit(limit)
        .skip(offset);

      if (!rooms.length) {
        throw new NotFoundException();
      }

      return rooms.map((room) => ({
        id: room.id,
        images: room.images,
        description: room.description,
        hotel: {
          id: 'id' in room.hotel ? room.hotel.id : '',
          title: 'title' in room.hotel ? room.hotel.title : '',
        },
      }));
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  async update(id: ID, data: Partial<RoomDocument>): Promise<RoomDocument> {
    return Promise.resolve(undefined);
  }

  makeRoomId(id: string): IRoom['_id'] {
    return this.makeId(id);
  }
}
