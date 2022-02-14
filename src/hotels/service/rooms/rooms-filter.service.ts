import { Injectable, Logger } from '@nestjs/common';
import { RoomFilter, SearchRoomsParams } from '../../base/rooms.types.base';

@Injectable()
export class RoomsFilterService {
  private logger: Logger = new Logger('RoomsFilterService');

  createRoomsListFilter(searchParams: SearchRoomsParams): {
    filter: RoomFilter;
    limit: number;
    offset: number;
  } {
    const { limit, offset } = searchParams;

    const filter: RoomFilter = {};
    Object.keys(searchParams).map((key: string) => {
      if (this[key] !== undefined) {
        filter[key] = this[key](searchParams[key]);
      }
    });
    return {
      filter,
      limit,
      offset,
    };
  }

  hotel(val: string) {
    return val;
  }

  title(val: string) {
    return {
      $regex: new RegExp(val),
      $options: 'i',
    };
  }

  isEnabled(val: boolean) {
    return { $eq: val };
  }
}
