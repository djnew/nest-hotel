import { I_HOTELS_SERVICE } from './base/hotels.service.base';
import { I_ROOMS_SERVICE } from './base/rooms.service.base';
import { HotelsService } from './service/hotels/hotels.service';
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
