import { Injectable } from '@nestjs/common';
import { SearchRoomsParams } from 'src/hotels/service/rooms/i-rooms.service';

export interface RoomFilter {
  title: string;
  isEnable?: true;
}

@Injectable()
export class RoomsFilterService {
  createRoomsListFilter(searchParams: SearchRoomsParams): {
    filter: RoomFilter;
    limit: number;
    offset: number;
  } {
    const { limit, offset } = searchParams;
    const filterParamName = ['title', 'isEnabled'];
    const filter: RoomFilter = {
      title: '',
    };
    Object.keys(searchParams).map((key: string) => {
      if (filterParamName.includes(key)) {
        filter[key] = {
          $regex: new RegExp(searchParams[key]),
          $options: 'i',
        };
      }
    });
    return {
      filter,
      limit,
      offset,
    };
  }
}
