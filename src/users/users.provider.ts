import { I_USERS_REPOSITORY } from './base/users.repository.base';
import { I_USER_SERVICE } from './base/users.service.base';
import { UsersRepository } from './repository/users.repository';
import { UsersService } from './service/users.service';

export const UserProvider = [
  {
    provide: I_USER_SERVICE,
    useClass: UsersService,
  },
  {
    provide: I_USERS_REPOSITORY,
    useClass: UsersRepository,
  },
];
