import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as path from 'path';
import { Room } from 'src/hotels/entities/room.entity';
import { RoomsFilterService } from 'src/hotels/service/rooms/rooms-filter.service';
import { make } from 'ts-brand';
import { IHotelInSearchRoomResponse } from '../../base/hotels.types.base';
import { IHotelRoomsService } from '../../base/rooms.service.base';
import {
  ICreateRoomResponse,
  IRoom,
  ISearchRoomResponse,
  RoomDocument,
  SearchRoomsParams,
} from '../../base/rooms.types.base';
import { RoomsRepository } from '../../repository/rooms.repository';
import { HotelsService } from '../hotels/hotels.service';

@Injectable()
export class RoomsService implements IHotelRoomsService {
  private logger: Logger = new Logger('RoomsService');

  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    private readonly roomFilter: RoomsFilterService,
    private readonly hotelService: HotelsService,
    private readonly roomRepository: RoomsRepository,
  ) {}

  async create(data: Partial<IRoom>): Promise<ICreateRoomResponse> {
    const newRoom = await this.roomRepository.create(data);
    if (newRoom) {
      const room = await this.roomRepository.getById(newRoom.id);
      return {
        id: room.id,
        description: room.description,
        images: room.images,
        isEnabled: room.isEnabled,
        hotel: {
          id: room.hotel.id,
          title: room.hotel.title,
          description: room.hotel.description,
        },
      };
    } else {
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
    const room = await this.roomRepository.getOneByFilter(findParams);
    if (room) {
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
    } else {
      throw new NotFoundException();
    }
  }

  async search(params: SearchRoomsParams): Promise<ISearchRoomResponse[]> {
    this.logger.debug(JSON.stringify(params));
    const { filter, limit, offset } =
      this.roomFilter.createRoomsListFilter(params);

    let hotels: IHotelInSearchRoomResponse[];
    if ('hotel' in filter || 'title' in filter) {
      hotels = await this.hotelService.searchHotelByCustomFilter(filter);
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

    const rooms = await this.roomRepository.search(filter, offset, limit);

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
  }

  async update(
    id: IRoom['_id'],
    data: Partial<IRoom>,
  ): Promise<ICreateRoomResponse> {
    const book = await this.roomRepository.getById(id);
    book.images.forEach((image) => {
      if (!data.images.includes(image)) {
        fs.rmSync(path.resolve('../../../', image));
      }
    });
    const updated = await this.roomRepository.update(id, data);
    if (!updated) {
      throw new BadRequestException();
    }
    const roomUpdated = await this.roomRepository.getById(id);

    return {
      id: roomUpdated.id,
      description: roomUpdated.description,
      images: roomUpdated.images,
      isEnabled: roomUpdated.isEnabled,
      hotel: {
        id: roomUpdated.hotel.id,
        title: roomUpdated.hotel.title,
        description: roomUpdated.hotel.description,
      },
    };
  }
}
