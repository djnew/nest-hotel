import {
  BadRequestException,
  Inject,
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
import { UsersRepository } from '../repository/users.repository';

@Injectable()
export class UsersService implements IUserService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
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
    const user = await this.usersRepository.create(createUserDto);
    if (user) {
      const { id, email, name } = user;
      return { id, email, name };
    } else {
      throw new BadRequestException();
    }
  }

  async findAll(params: SearchUserParams): Promise<IUserResponse[]> {
    const { filter, offset, limit } =
      this.filterService.createUserListFilter(params);

    try {
      const userList = await this.usersRepository.search(filter, limit, offset);
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
    try {
      const user = await this.usersRepository.getById(id);
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
    const user = await this.usersRepository.getOneByFilter({ email: email });
    if (!user) {
      throw new NotFoundException();
    } else {
      return user;
    }
  }
}
