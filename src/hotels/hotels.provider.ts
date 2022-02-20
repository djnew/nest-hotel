import { I_HOTELS_REPOSITORY } from './base/hotels.repository.base';
import { I_HOTELS_SERVICE } from './base/hotels.service.base';
import { I_ROOMS_REPOSITORY } from './base/rooms.repository.base';
import { I_ROOMS_SERVICE } from './base/rooms.service.base';
import { HotelsRepository } from './repository/hotels.repository';
import { RoomsRepository } from './repository/rooms.repository';
import { HotelsService } from './service/hotels/hotels.service';
import { RoomsService } from './service/rooms/rooms.service';

export const HotelsProvider = [
  {
    provide: I_ROOMS_SERVICE,
    useClass: RoomsService,
  },
  {
    provide: I_ROOMS_REPOSITORY,
    useClass: RoomsRepository,
  },
  {
    provide: I_HOTELS_SERVICE,
    useClass: HotelsService,
  },
  {
    provide: I_HOTELS_REPOSITORY,
    useClass: HotelsRepository,
  },
];
