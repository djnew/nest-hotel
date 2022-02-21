import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { RoomsService } from 'src/hotels/service/rooms/rooms.service';
import { LoginGuard } from '../../auth/guard/login.guard';
import { editFileName, imageFileFilter } from '../../multer/multer.files';
import { UserRole } from '../../users/base/users.types.base';
import { Roles } from '../../users/decorator/roles.decorator';
import {
  I_HOTELS_REPOSITORY,
  IHotelsRepository,
} from '../base/hotels.repository.base';
import {
  I_ROOMS_REPOSITORY,
  IRoomsRepository,
} from '../base/rooms.repository.base';
import { CreateRoomDTO } from '../dto/create-room.dto';
import { SearchRoomsDTO } from '../dto/search-rooms.dto';
import { HotelsService } from '../service/hotels/hotels.service';

@Controller('api')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly hotelService: HotelsService,
    @Inject(I_HOTELS_REPOSITORY)
    private readonly hotelRepository: IHotelsRepository,
    @Inject(I_ROOMS_REPOSITORY)
    private readonly roomRepository: IRoomsRepository,
  ) {}

  @Post('admin/hotel-rooms')
  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
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
      hotel: this.hotelRepository.makeId(hotelId),
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
    return await this.roomsService.findById(this.roomRepository.makeId(id));
  }

  @Put('admin/hotel-rooms/:id')
  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
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
  async updateRoom(
    @Param('id') id: string,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() createRoomDto: CreateRoomDTO,
  ) {
    const { images: oldImages, ...params } = createRoomDto;
    let img;
    if (typeof oldImages === 'object') {
      img = oldImages;
    } else {
      img = [oldImages];
    }
    const updateParams = {
      ...params,
      images: [...images.map((image) => image.path), ...img],
      hotel: this.hotelRepository.makeId(createRoomDto.hotel),
    };
    return this.roomsService.update(
      this.roomRepository.makeId(id),
      updateParams,
    );
  }
}
