import { IMessage } from './chat.types.base';

export const I_MESSAGES_REPOSITORY: unique symbol = Symbol(
  'IMessagesRepository',
);

export interface IMessagesRepository {
  makeId(id: string): IMessage['_id'];
}
