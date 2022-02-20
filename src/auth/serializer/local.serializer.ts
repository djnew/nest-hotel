import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import {
  I_USERS_REPOSITORY,
  IUsersRepository,
} from '../../users/base/users.repository.base';
import { UserDocument } from '../../users/base/users.types.base';
import {
  I_USER_SERVICE,
  IUserService,
} from '../../users/base/users.service.base';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    private readonly authService: AuthService,
    @Inject(I_USER_SERVICE)
    private readonly userService: IUserService,
    @Inject(I_USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {
    super();
  }

  serializeUser(user: UserDocument, done: CallableFunction) {
    const { id, role, name } = user;
    done(null, JSON.stringify({ id, role, name }));
  }

  async deserializeUser(userJSON: string, done: CallableFunction) {
    const user = JSON.parse(userJSON);
    return await this.userService
      .findById(this.usersRepository.makeId(user.id))
      .then((user) => done(null, user))
      .catch((error) => done(error));
  }
}
