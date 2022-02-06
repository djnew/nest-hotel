import { Module } from '@nestjs/common';
import { UsersController } from 'src/users/controller/users.controller';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProvider } from 'src/users/users.provider';
import { UsersService } from 'src/users/service/users.service';
import { UsersFilterService } from 'src/users/service/users-filter.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersFilterService, ...UserProvider],
  exports: [...UserProvider],
})
export class UsersModule {}
