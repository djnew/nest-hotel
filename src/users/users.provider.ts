import { I_USER_SERVICE } from './base/users.service.base';
import { UsersService } from './service/users.service';

export const UserProvider = [
  {
    provide: I_USER_SERVICE,
    useClass: UsersService,
  },
];
