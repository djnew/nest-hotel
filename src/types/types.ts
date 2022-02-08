import { ObjectId } from 'mongoose';

export type ID = string | ObjectId;

export interface ErrorWithCode extends Error {
  code?: number;
}
