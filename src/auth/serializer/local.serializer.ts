import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
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
  ) {
    super();
  }

  serializeUser(user: UserDocument, done: CallableFunction) {
    done(null, user._id.toString());
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    console.log('userId', userId);
    return await this.userService
      .findById(this.userService.makeUserId(userId))
      .then((user) => done(null, user))
      .catch((error) => done(error));
  }
}
