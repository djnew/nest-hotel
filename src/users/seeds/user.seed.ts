import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { ErrorWithCode } from '../../types/types';
import { UsersService } from '../service/users.service';

@Injectable()
export class UserSeed {
  constructor(private readonly userService: UsersService) {}

  @Command({
    command: 'create:user',
    describe: 'create a user',
  })
  async create(
    @Positional({
      name: 'email',
      describe: 'user email',
      alias: 'e',
      type: 'string',
    })
    email: string,
    @Positional({
      name: 'password',
      describe: 'user password',
      alias: 'p',
      type: 'string',
    })
    password: string,
    @Positional({
      name: 'role',
      describe: 'user role: client | admin | manager',
      type: 'string',
      alias: 'r',
    })
    role: string,
  ) {
    try {
      const user = await this.userService.create({
        contactPhone: '79000000000',
        email,
        name: email,
        role,
        password,
      });
      console.log({
        status: true,
        user,
      });
    } catch (error) {
      const e = error as ErrorWithCode;
      if (e.code === 11000) {
        return console.log({
          status: false,
          message: `Пользователь с таким логином: ${email} уже зарегистрирован`,
        });
      }
      return console.log({
        status: false,
        message: 'Что-то пошло не так',
      });
    }
  }
}
