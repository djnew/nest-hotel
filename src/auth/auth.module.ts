import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { LocalSerializer } from './serializer/local.serializer';
import { AuthService } from './service/auth.service';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [UsersModule],
  providers: [AuthService, LocalStrategy, LocalAuthGuard, LocalSerializer],
})
export class AuthModule {}
