import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Model } from 'mongoose';
import { make } from 'ts-brand';
import {
  CreateSupportRequestDto,
  ISupportRequest,
  SupportRequestDocument,
} from '../base/chat.types.base';
import { ISupportRequestsRepository } from '../base/support-requests.repository.base';
import { SupportRequest } from '../entities/support-request.entity';

@Injectable()
export class SupportRequestsRepository implements ISupportRequestsRepository {
  private logger: Logger = new Logger('SupportRequestsRepository');
  private readonly idMaker;

  constructor(
    @InjectModel(SupportRequest.name)
    private readonly supportRequestModel: Model<SupportRequestDocument>,
  ) {
    this.idMaker = make<ISupportRequest['_id']>();
  }

  makeId(id: string): ISupportRequest['_id'] {
    return undefined;
  }

  async create(
    params: CreateSupportRequestDto,
  ): Promise<SupportRequestDocument> {
    try {
      const supportRequest = new this.supportRequestModel({
        params,
        isActive: true,
        createdAt: dayjs(),
      });
      await supportRequest.save();
      return supportRequest;
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  async getById(id: ISupportRequest['_id']): Promise<SupportRequestDocument> {
    try {
      return this.supportRequestModel.findOne({ id }).exec();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async search(
    filter,
    offset: number = null,
    limit: number = null,
  ): Promise<SupportRequestDocument[]> {
    const supportRequests = this.supportRequestModel.find(filter);
    if (limit) {
      supportRequests.limit(limit);
    }
    if (offset) {
      supportRequests.skip(offset);
    }

    return supportRequests
      .populate<Pick<SupportRequestDocument, 'user'>>('user')
      .exec();
  }
}
