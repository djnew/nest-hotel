import { IUser } from './users.types.base';

export const I_USERS_REPOSITORY = Symbol('IUsersRepository');

export interface IUsersRepository {
  makeId(id: string): IUser['_id'];
}
