import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { HotelsService } from 'src/hotels/service/hotels/hotels.service';
import { CreateHotelDTO } from 'src/hotels/dto/create-hotel.dto';
import { LoginGuard } from '../../auth/guard/login.guard';
import { UserRole } from '../../users/base/users.types.base';
import { Roles } from '../../users/decorator/roles.decorator';

@Controller('api')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  @Post('admin/hotels')
  async create(@Body() createHotelDto: CreateHotelDTO) {
    const newHotel = await this.hotelsService.create(createHotelDto);
    return {
      id: newHotel.id,
      title: newHotel.title,
      description: newHotel.description,
    };
  }
}
