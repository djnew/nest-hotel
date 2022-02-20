import { Document } from 'mongoose';
import { Brand } from 'ts-brand';
import { ID } from '../../types/types';

export enum UserRole {
  Client = 'client',
  Admin = 'admin',
  Manager = 'manager',
}

export interface IUser {
  _id?: Brand<ID, IUser>;
  email: string;
  passwordHash: string;
  name: string;
  contactPhone: string;
  role: string;
}

export interface IUserResponse {
  id: ID;
  email: string;
  name: string;
  role?: string;
  contactPhone?: string;
}

export interface IChatUserResponse {
  id: ID;
  name: string;
  email?: string;
  contactPhone?: string;
}

export type UserDocument = IUser & Document;

export interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}
