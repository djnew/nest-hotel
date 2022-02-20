import { Injectable, Logger } from '@nestjs/common';
import {
  GetChatListParams,
  SupportRequestFilter,
} from '../base/chat.types.base';

@Injectable()
export class SupportRequestFilterService {
  private logger: Logger = new Logger('SupportRequestFilterService');

  createRequestListFilter(searchParams: GetChatListParams): {
    filter: SupportRequestFilter;
    limit: number;
    offset: number;
  } {
    const { limit, offset } = searchParams;

    const filter: SupportRequestFilter = {};
    Object.keys(searchParams).map((key: string) => {
      if (this[key] !== undefined) {
        filter[key] = this[key](searchParams[key]);
      }
    });
    return {
      filter,
      limit,
      offset,
    };
  }

  user(val: string) {
    return val;
  }

  isActive(val: boolean) {
    return { $eq: val };
  }
}
