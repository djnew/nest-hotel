import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginWsGuard extends AuthGuard('local') {
  private logger: Logger = new Logger('LoginWsGuard');
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const httpContext = context.switchToWs();
    const client = httpContext.getClient();

    try {
      if (client.handshake.session.passport.user) {
        return true;
      }
      client.disconnect(true);
    } catch (e) {
      client.disconnect(true);
      throw new UnauthorizedException();
    }
  }
}
