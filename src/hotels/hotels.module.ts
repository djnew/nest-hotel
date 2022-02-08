import { Module } from '@nestjs/common';
import { HotelsService } from 'src/hotels/service/hotels/hotels.service';
import { HotelsController } from 'src/hotels/controller/hotels.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from 'src/hotels/entities/hotel.entity';
import { Room, RoomSchema } from 'src/hotels/entities/room.entity';
import { RoomsFilterService } from 'src/hotels/service/rooms/rooms-filter.service';
import { RoomsService } from 'src/hotels/service/rooms/rooms.service';
import { RoomsController } from './controller/rooms.controller';
import { HotelsProvider } from './hotels.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: Room.name, schema: RoomSchema },
    ]),
  ],
  controllers: [HotelsController, RoomsController],
  providers: [
    HotelsService,
    RoomsService,
    RoomsFilterService,
    ...HotelsProvider,
  ],
  exports: [...HotelsProvider],
})
export class HotelsModule {}
