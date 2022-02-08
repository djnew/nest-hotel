import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { Express } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { RoomsService } from 'src/hotels/service/rooms/rooms.service';
import { LoginGuard } from '../../auth/guard/login.guard';
import { editFileName, imageFileFilter } from '../../multer/multer.files';
import { Roles } from '../../users/decorator/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { CreateRoom } from '../dto/create-room.dto';

@Controller('api')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  @Post('admin/hotel-rooms')
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
    @Body() createRoomDto: CreateRoom,
  ) {
    const newRoom = await this.roomsService.create({
      ...createRoomDto,
      isEnabled: true,
      images: images.map((image) => image.path),
    });

    return {
      id: newRoom.id,
      description: newRoom.description,
      images: newRoom.images,
      isEnabled: newRoom.isEnabled,
      hotel: {
        id: newRoom.hotel._id,
        title: newRoom.hotel.title,
        description: newRoom.hotel.description,
      },
    };
  }
}
