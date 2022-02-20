import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { make } from 'ts-brand';
import { IUsersRepository } from '../base/users.repository.base';
import { IUser, UserDocument } from '../base/users.types.base';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository implements IUsersRepository {
  private logger: Logger = new Logger('UsersRepository');
  private readonly idMaker;
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.idMaker = make<IUser['_id']>();
  }
  makeId(id: string): IUser['_id'] {
    return this.idMaker(id);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const userParams: IUser = {
      email: createUserDto.email,
      passwordHash,
      name: createUserDto.name,
      contactPhone: createUserDto.contactPhone,
      role: createUserDto.role,
    };
    const newUser = new this.userModel(userParams);
    try {
      await newUser.save();
      return newUser;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }
  async search(filter, limit: number, offset: number): Promise<UserDocument[]> {
    try {
      return await this.userModel
        .find(filter)
        .limit(limit)
        .skip(offset)
        .select('-__v')
        .exec();
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async getById(id: IUser['_id']): Promise<UserDocument> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async getOneByFilter(filter): Promise<UserDocument> {
    try {
      return this.userModel.findOne(filter).exec();
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }
}
