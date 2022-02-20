import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateHotelDTO } from 'src/hotels/dto/create-hotel.dto';
import { HotelsService } from 'src/hotels/service/hotels/hotels.service';
import { LoginGuard } from '../../auth/guard/login.guard';
import { UserRole } from '../../users/base/users.types.base';
import { Roles } from '../../users/decorator/roles.decorator';
import {
  I_HOTELS_REPOSITORY,
  IHotelsRepository,
} from '../base/hotels.repository.base';
import { SearchHotelsDTO } from '../dto/search-hotels.dto';

@Controller('api')
export class HotelsController {
  constructor(
    private readonly hotelsService: HotelsService,
    @Inject(I_HOTELS_REPOSITORY)
    private readonly hotelRepository: IHotelsRepository,
  ) {}

  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  @UsePipes(new ValidationPipe())
  @Post('admin/hotels')
  async create(@Body() createHotelDto: CreateHotelDTO) {
    return this.hotelsService.create(createHotelDto);
  }

  @Get('admin/hotels/')
  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getHotels(@Query() searchHotelsDto: SearchHotelsDTO) {
    const { limit, offset, ...filter } = searchHotelsDto;
    return this.hotelsService.searchHotelByCustomFilter(filter, limit, offset);
  }

  @Get('admin/hotels/:id')
  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  async getHotel(@Param('id') id: string) {
    return this.hotelsService.findById(this.hotelRepository.makeId(id));
  }
}
