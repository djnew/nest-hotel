import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { make } from 'ts-brand';
import { IHotelsRepository } from '../base/hotels.repository.base';
import {
  HotelDocument,
  IHotel,
  IHotelInSearchRoomResponse,
} from '../base/hotels.types.base';
import { CreateHotelDTO } from '../dto/create-hotel.dto';
import { Hotel } from '../entities/hotel.entity';

@Injectable()
export class HotelsRepository implements IHotelsRepository {
  private logger: Logger = new Logger('HotelsRepository');
  private readonly idMaker;

  constructor(
    @InjectModel(Hotel.name)
    private readonly hotelModel: Model<IHotelInSearchRoomResponse>,
  ) {
    this.idMaker = make<IHotel['_id']>();
  }

  makeId(id: string): IHotel['_id'] {
    return this.idMaker(id);
  }

  async create(createHotelDto: CreateHotelDTO): Promise<HotelDocument> {
    const newHotel = new this.hotelModel(createHotelDto);
    try {
      await newHotel.save();
      return newHotel;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async getById(id: IHotel['_id']): Promise<HotelDocument> {
    try {
      return await this.hotelModel.findOne({ _id: id }).exec();
    } catch (e) {}
  }

  async update(id: IHotel['_id'], data: Partial<IHotel>) {
    try {
      await this.hotelModel.updateOne({ _id: id }, data);
      return true;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async search(
    filter,
    limit: number = null,
    offset: number = null,
  ): Promise<HotelDocument[]> {
    try {
      const hotels = this.hotelModel.find(filter).select('-__v');
      if (limit) {
        hotels.limit(limit);
      }
      if (offset) {
        hotels.skip(offset);
      }
      return hotels.exec();
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }
}
