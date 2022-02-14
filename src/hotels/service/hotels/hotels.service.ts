import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHotelDTO } from 'src/hotels/dto/create-hotel.dto';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { make } from 'ts-brand';
import {
  IHotelServiceAdditionalMethods,
  IHotelsService,
} from '../../base/hotels.service.base';
import {
  IHotelInSearchRoomResponse,
  IHotel,
} from '../../base/hotels.types.base';
import { RoomFilter } from '../../base/rooms.types.base';
import { HotelsFilterService } from './hotels-filter.service';

@Injectable()
export class HotelsService
  implements IHotelsService, IHotelServiceAdditionalMethods
{
  private readonly makeId;

  constructor(
    @InjectModel(Hotel.name)
    private readonly hotelModel: Model<IHotelInSearchRoomResponse>,
    @Inject(HotelsFilterService)
    private readonly hotelFilter: HotelsFilterService,
  ) {
    this.makeId = make<IHotel['_id']>();
  }

  async create(
    createHotelDto: CreateHotelDTO,
  ): Promise<IHotelInSearchRoomResponse> {
    const newHotel = new this.hotelModel(createHotelDto);
    try {
      await newHotel.save();
      return newHotel;
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  async findById(id: IHotel['_id']): Promise<IHotelInSearchRoomResponse> {
    try {
      const room = await this.hotelModel.findOne({ _id: id }).exec();
      return {
        id: room.id,
        title: room.title,
        description: room.description,
      };
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  async search(
    params: Pick<IHotelInSearchRoomResponse, 'title'>,
  ): Promise<IHotelInSearchRoomResponse[]> {
    try {
      return this.hotelModel
        .find({
          title: {
            $regex: new RegExp(params.title),
            $options: 'i',
          },
        })
        .select('-__v');
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  makeHotelId(id: string): IHotel['_id'] {
    return this.makeId(id);
  }

  async searchHotelByCustomFilter(
    filterRooms: RoomFilter,
    limit = null,
    offset = null,
  ): Promise<IHotelInSearchRoomResponse[]> {
    try {
      const filter = this.hotelFilter.createHotelsListFilter(filterRooms);
      const hotelsQuery = this.hotelModel.find(filter).select('-__v');
      if (limit) {
        hotelsQuery.limit(limit);
      }
      if (offset) {
        hotelsQuery.skip(offset);
      }
      const hotels = await hotelsQuery.exec();
      return hotels.map((hotel) => ({
        id: hotel.id,
        title: hotel.title,
        description: hotel.description,
      }));
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }
}
