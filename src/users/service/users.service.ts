import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SearchUserParams } from 'src/users/service/i-users.service';
import { IUser, User, UserDocument } from 'src/users/entities/user.entity';
import { ID } from 'src/types/types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersFilterService } from 'src/users/service/users-filter.service';

export const I_USER_SERVICE = 'I_USER_SERVICE';

export interface IUserService {
  create(data: Partial<IUser>): Promise<IUser>;
  findById(id: ID): Promise<IUser>;
  findByEmail(email: string): Promise<IUser>;
  findAll(params: SearchUserParams): Promise<IUser[]>;
}

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly filterService: UsersFilterService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const newUser = new this.userModel(createUserDto);
    try {
      return newUser.save();
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  async findAll(params: SearchUserParams): Promise<IUser[]> {
    const { filter, offset, limit } =
      this.filterService.createUserListFilter(params);
    try {
      return await this.userModel
        .find(filter)
        .limit(limit)
        .skip(offset)
        .select('-__v')
        .exec();
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }

  async findById(id: ID): Promise<IUser> {
    try {
      return this.userModel.findOne({ _id: id });
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }

  async findByEmail(email: string): Promise<IUser> {
    try {
      return this.userModel.findOne({ email: email }).select('-__v');
    } catch (e) {
      console.error(e);
      throw new NotFoundException();
    }
  }
}
