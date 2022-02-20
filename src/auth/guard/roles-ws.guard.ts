import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/base/users.types.base';
import { ROLES_KEY } from '../../users/decorator/roles.decorator';

@Injectable()
export class RolesWsGuard implements CanActivate {
  private logger: Logger = new Logger('RolesGuard');
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const client = context.switchToWs().getClient();
    if (!requiredRoles || !client.handshake.session.passport.user) {
      client.disconnect(true);
      return true;
    }
    const user = JSON.parse(client.handshake.session.passport.user);
    this.logger.log(requiredRoles);
    if (!requiredRoles.some((role) => user[ROLES_KEY]!.includes(role))) {
      client.disconnect(true);
    }
    return requiredRoles.some((role) => user[ROLES_KEY]!.includes(role));
  }
}
