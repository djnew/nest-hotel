import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Get,
  Query,
  ValidationPipe,
  UsePipes,
  Param,
} from '@nestjs/common';
import { Express } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { RoomsService } from 'src/hotels/service/rooms/rooms.service';
import { LoginGuard } from '../../auth/guard/login.guard';
import { editFileName, imageFileFilter } from '../../multer/multer.files';
import { UserRole } from '../../users/base/users.types.base';
import { Roles } from '../../users/decorator/roles.decorator';
import { CreateRoomDTO } from '../dto/create-room.dto';
import { SearchRoomsDTO } from '../dto/search-rooms.dto';
import { HotelsService } from '../service/hotels/hotels.service';

@Controller('api')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly hotelService: HotelsService,
  ) {}

  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  @Post('admin/hotel-rooms')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: './files/hotelRoomImages/',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() createRoomDto: CreateRoomDTO,
  ) {
    const { hotel: hotelId, ...params } = createRoomDto;
    return await this.roomsService.create({
      ...params,
      hotel: this.hotelService.makeHotelId(hotelId),
      isEnabled: true,
      images: images.map((image) => image.path),
    });
  }

  @Get('common/hotel-rooms')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getRooms(@Query() searchParams: SearchRoomsDTO) {
    return await this.roomsService.search(searchParams);
  }

  @Get('common/hotel-rooms/:id')
  async getRoom(@Param('id') id: string) {
    return await this.roomsService.findById(this.roomsService.makeRoomId(id));
  }
}
