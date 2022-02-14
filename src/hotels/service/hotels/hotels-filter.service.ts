import { Injectable, Logger } from '@nestjs/common';
import { HotelFilter, HotelFilterObject } from '../../base/hotels.types.base';
import { RoomFilter } from '../../base/rooms.types.base';

@Injectable()
export class HotelsFilterService {
  private logger: Logger = new Logger('HotelsFilterService');
  createHotelsListFilter(searchParams: RoomFilter): HotelFilter {
    const filter: HotelFilter = {};
    Object.keys(searchParams).map((key: string) => {
      if (this[key] !== undefined) {
        const filterObject = this[key](searchParams[key]);
        filter[filterObject.key] = filterObject.val;
      }
    });
    return filter;
  }
  hotel(val: string): HotelFilterObject {
    return {
      key: '_id',
      val,
    };
  }
  title(val: string): HotelFilterObject {
    return {
      key: 'title',
      val,
    };
  }
}
