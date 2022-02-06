import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HotelsService } from 'src/hotels/service/hotels/hotels.service';
import { CreateHotelDto } from 'src/hotels/dto/create-hotel.dto';
import { UpdateHotelDto } from 'src/hotels/dto/update-hotel.dto';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelsService.create(createHotelDto);
  }
}
