import { Document } from 'mongoose';
import { Brand } from 'ts-brand';
import { ID } from '../../types/types';
import {
  IChatUserResponse,
  IUser,
  UserDocument,
} from '../../users/base/users.types.base';

export interface IMessage {
  _id?: Brand<ID, IMessage>;
  author: IUser['_id'] | UserDocument;
  sentAt: Date;
  text?: string;
  readAt: Date;
}

export type MessageDocument = IMessage & Document;
export type SupportRequestDocument = ISupportRequest & Document;

export interface ISupportRequest {
  _id?: Brand<ID, ISupportRequest>;
  user: IUser['_id'] | UserDocument;
  createdAt: Date;
  messages?: IMessage['_id'][];
  isActive?: boolean;
}

export interface ISupportRequestResponse {
  id: ID;
  createAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
  client?: IChatUserResponse;
}

export interface IMessageResponse {
  id: ID;
  createdAt: string;
  text: string;
  readAt: string;
  author: IChatUserResponse;
}

export interface CreateSupportRequestDto {
  user: IUser['_id'];
  text: string;
}

export interface SupportRequestsSubscribers {
  supportRequestId: string;
  wsClientId: string;
  fn: (supportRequest: ID, message: MessageDocument) => void;
}

export interface SendMessageDto {
  author: IUser['_id'];
  supportRequest: ISupportRequest['_id'];
  text: string;
}

export interface MarkMessagesAsReadDto {
  user: IUser['_id'];
  supportRequest: ISupportRequest['_id'];
  createdBefore: Date;
}

export interface GetChatListParams {
  user?: IUser['_id'];
  isActive: boolean;
  limit?: number;
  offset?: number;
}

export interface CreateSupportRequestDto {
  user: IUser['_id'];
  text: string;
}

export interface SendMessageDto {
  author: IUser['_id'];
  supportRequest: ISupportRequest['_id'];
  text: string;
}

export interface MarkMessagesAsReadDto {
  user: IUser['_id'];
  supportRequest: ISupportRequest['_id'];
  createdBefore: Date;
}

export interface SupportRequestFilter {
  title?: unknown;
  hotel?: unknown;
  isEnabled?: unknown;
}

export interface MessagesMarkMessagesAsRead {
  success: true;
}
