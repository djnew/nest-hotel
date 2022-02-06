import { IUser } from 'src/users/entities/user.entity';

export class CreateUserDto implements IUser {
  contactPhone: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
}
