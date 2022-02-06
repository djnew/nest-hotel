import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHotelDto } from 'src/hotels/dto/create-hotel.dto';
import { IHotelService } from 'src/hotels/service/hotels/i-hotels.service';
import { Hotel, HotelDocument } from 'src/hotels/entities/hotel.entity';
import { ID } from 'src/types/types';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private readonly hotelModel: Model<HotelDocument>,
  ) {}
  async create(createHotelDto: CreateHotelDto): Promise<HotelDocument> {
    const newHotel = new this.hotelModel(createHotelDto);
    try {
      await newHotel.save();
      return newHotel;
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  async findById(id: ID): Promise<HotelDocument> {
    try {
      return this.hotelModel.findOne({ _id: id });
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  async search(params: Pick<HotelDocument, 'title'>): Promise<HotelDocument[]> {
    try {
      return this.hotelModel
        .find({
          title: {
            $regex: new RegExp(params.title),
            $options: 'i',
          },
        })
        .select('-__v');
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }
}
