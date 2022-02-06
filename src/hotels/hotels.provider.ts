import { HotelsService } from './service/hotels/hotels.service';
import { I_HOTELS_SERVICE } from './service/hotels/i-hotels.service';
import { I_ROOMS_SERVICE } from './service/rooms/i-rooms.service';
import { RoomsService } from './service/rooms/rooms.service';

export const HotelsProvider = [
  {
    provide: I_ROOMS_SERVICE,
    useClass: RoomsService,
  },
  {
    provide: I_HOTELS_SERVICE,
    useClass: HotelsService,
  },
];
