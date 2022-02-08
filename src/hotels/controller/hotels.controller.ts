import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { HotelsService } from 'src/hotels/service/hotels/hotels.service';
import { CreateHotel } from 'src/hotels/dto/create-hotel.dto';
import { LoginGuard } from '../../auth/guard/login.guard';
import { Roles } from '../../users/decorator/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@Controller('api')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  @Post('admin/hotels')
  async create(@Body() createHotelDto: CreateHotel) {
    const newHotel = await this.hotelsService.create(createHotelDto);
    return {
      id: newHotel.id,
      title: newHotel.title,
      description: newHotel.description,
    };
  }
}
