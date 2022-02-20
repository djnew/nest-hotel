import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHotelDTO } from 'src/hotels/dto/create-hotel.dto';
import { make } from 'ts-brand';
import {
  IHotelServiceAdditionalMethods,
  IHotelsService,
} from '../../base/hotels.service.base';
import {
  IHotel,
  IHotelInSearchRoomResponse,
} from '../../base/hotels.types.base';
import { RoomFilter } from '../../base/rooms.types.base';
import { HotelsRepository } from '../../repository/hotels.repository';
import { HotelsFilterService } from './hotels-filter.service';

@Injectable()
export class HotelsService
  implements IHotelsService, IHotelServiceAdditionalMethods
{
  constructor(
    @Inject(HotelsFilterService)
    private readonly hotelFilter: HotelsFilterService,
    @Inject(HotelsRepository)
    private readonly hotelRepository: HotelsRepository,
  ) {}

  async create(
    createHotelDto: CreateHotelDTO,
  ): Promise<IHotelInSearchRoomResponse> {
    const hotel = this.hotelRepository.create(createHotelDto);
    if (hotel) {
      return hotel;
    } else {
      throw new BadRequestException();
    }
  }

  async findById(id: IHotel['_id']): Promise<IHotelInSearchRoomResponse> {
    const room = await this.hotelRepository.getById(id);
    if (room) {
      return {
        id: room.id,
        title: room.title,
        description: room.description,
      };
    } else {
      throw new NotFoundException();
    }
  }

  async search(
    params: Pick<IHotelInSearchRoomResponse, 'title'>,
  ): Promise<IHotelInSearchRoomResponse[]> {
    const hotels = await this.hotelRepository.search(false);
    if (hotels) {
      return hotels;
    } else {
      throw new NotFoundException();
    }
  }

  async searchHotelByCustomFilter(
    filterRooms: RoomFilter,
    limit: number = null,
    offset: number = null,
  ): Promise<IHotelInSearchRoomResponse[]> {
    try {
      const filter = this.hotelFilter.createHotelsListFilter(filterRooms);
      const hotels = await this.hotelRepository.search(filter, limit, offset);
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
