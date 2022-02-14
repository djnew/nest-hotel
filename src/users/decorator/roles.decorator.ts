import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../base/users.types.base';

export const ROLES_KEY = 'role';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
