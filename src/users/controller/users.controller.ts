import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/service/users.service';
import { LocalAuthGuard } from '../../auth/guard/local-auth.guard';
import { LoginGuard } from '../../auth/guard/login.guard';
import {
  I_USERS_REPOSITORY,
  IUsersRepository,
} from '../base/users.repository.base';
import { SearchUserParams, UserRole } from '../base/users.types.base';
import { Roles } from '../decorator/roles.decorator';

@Controller('api')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(I_USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('admin/users')
  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  findAll(@Req() req, @Query() params: SearchUserParams) {
    return this.usersService.findAll(params);
  }

  @Get('manager/users')
  @Roles(UserRole.Manager)
  @UseGuards(LoginGuard)
  findAllManager(@Req() req, @Query() params: SearchUserParams) {
    return this.usersService.findAll(params);
  }

  @Post('/admin/users')
  createUser(@Body() params: CreateUserDto) {
    return this.usersService.create(params);
  }

  @Post('client/register')
  createClient(@Body() params: CreateUserDto) {
    params.role = UserRole.Client;
    return this.usersService.create(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(this.usersRepository.makeId(id));
  }

  @UseGuards(new LocalAuthGuard())
  @Post('auth/login')
  login(@Req() req) {
    return {
      email: req.user.email,
      name: req.user.name,
      contactPhone: req.user.contactPhone,
    };
  }

  @Post('auth/logout')
  logout(@Req() req) {
    req.logout();
    return;
  }
}
