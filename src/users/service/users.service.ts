import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Connection, Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersFilterService } from 'src/users/service/users-filter.service';
import { make } from 'ts-brand';
import { IUserService } from '../base/users.service.base';
import {
  IUser,
  IUserResponse,
  SearchUserParams,
  UserDocument,
  UserRole,
} from '../base/users.types.base';

@Injectable()
export class UsersService implements IUserService {
  private logger: Logger = new Logger('UsersService');
  private readonly makeId;

  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly filterService: UsersFilterService,
  ) {
    this.makeId = make<IUser['_id']>();
  }

  async create(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const userRoles = Object.values(UserRole) as string[];
    if (!userRoles.includes(createUserDto.role)) {
      this.logger.error(
        `Создание пользователя с несуществующей ролью: ${JSON.stringify(
          createUserDto,
        )}`,
      );
      throw new BadRequestException();
    }
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
      const { id, email, name } = await newUser.save();
      return { id, email, name };
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException();
    }
  }

  async findAll(params: SearchUserParams): Promise<IUserResponse[]> {
    const { filter, offset, limit } =
      this.filterService.createUserListFilter(params);

    try {
      const userList = await this.userModel
        .find(filter)
        .limit(limit)
        .skip(offset)
        .select('-__v')
        .exec();
      return userList.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
      }));
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException();
    }
  }

  async findById(id: IUser['_id']): Promise<IUserResponse> {
    this.logger.log('findById', id);
    try {
      const user = await this.userModel.findOne({ _id: id }).exec();
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    } catch (e) {
      this.logger.error(e);
      throw new NotFoundException();
    }
  }

  async findByEmail(email: string): Promise<UserDocument> {
    try {
      return await this.userModel.findOne({ email: email }).exec();
    } catch (e) {
      this.logger.error(e);
      throw new NotFoundException();
    }
  }

  makeUserId(id: string): IUser['_id'] {
    return this.makeId(id);
  }
}
