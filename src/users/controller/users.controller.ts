import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/service/users.service';
import { LocalAuthGuard } from '../../auth/guard/local-auth.guard';
import { LoginGuard } from '../../auth/guard/login.guard';
import { SearchUserParams, UserRole } from '../base/users.types.base';
import { Roles } from '../decorator/roles.decorator';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('admin/users')
  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  findAll(@Req() req, @Body() params: SearchUserParams) {
    console.log(req.user);
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
    return this.usersService.findById(id);
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
