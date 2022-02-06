import { Controller, Post, Body } from '@nestjs/common';
import { CreateHotelDto } from 'src/hotels/dto/create-hotel.dto';
import { RoomsService } from 'src/hotels/service/rooms/rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.roomsService.create(createHotelDto);
  }
}
