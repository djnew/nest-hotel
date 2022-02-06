import { UsersService, I_USER_SERVICE } from './service/users.service';

export const UserProvider = [
  {
    provide: I_USER_SERVICE,
    useClass: UsersService,
  },
];
