import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SearchUserParams } from 'src/users/service/i-users.service';
import {
  IUser,
  IUserResponse,
  User,
  UserDocument,
  UserRole,
} from 'src/users/entities/user.entity';
import { ID } from 'src/types/types';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { UsersFilterService } from 'src/users/service/users-filter.service';

export const I_USER_SERVICE = 'I_USER_SERVICE';

export interface IUserService {
  create(data: Partial<IUser>): Promise<IUserResponse>;

  findById(id: ID): Promise<IUserResponse>;

  findByEmail(email: string): Promise<UserDocument>;

  findAll(params: SearchUserParams): Promise<IUserResponse[]>;
}

@Injectable()
export class UsersService implements IUserService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly filterService: UsersFilterService,
  ) {}

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

  async findById(id: ID): Promise<IUserResponse> {
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
}
