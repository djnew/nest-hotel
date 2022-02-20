import { ISupportRequest } from './chat.types.base';

export const I_SUPPORT_REQUESTS_REPOSITORY: unique symbol = Symbol(
  'ISupportRequestsRepository',
);

export interface ISupportRequestsRepository {
  makeId(id: string): ISupportRequest['_id'];
}
