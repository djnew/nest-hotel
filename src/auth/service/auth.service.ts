import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  I_USER_SERVICE,
  IUserService,
} from '../../users/service/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(I_USER_SERVICE)
    private readonly userService: IUserService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(username);
    if (!user) {
      return null;
    }
    const checkPass = bcrypt.compare(pass, user.passwordHash);
    if (!checkPass) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user.toObject();
    return result;
  }
}
