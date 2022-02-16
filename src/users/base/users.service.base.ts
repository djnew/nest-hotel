import {
  IUser,
  IUserResponse,
  SearchUserParams,
  UserDocument,
} from './users.types.base';

export const I_USER_SERVICE: unique symbol = Symbol('IUserService');

export interface IUserService {
  create(data: Partial<IUser>): Promise<IUserResponse>;

  findById(id: IUser['_id']): Promise<IUserResponse>;

  findByEmail(email: string): Promise<UserDocument>;

  findAll(params: SearchUserParams): Promise<IUserResponse[]>;

  makeUserId(id: string): IUser['_id'];
}
