import { Transform, Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class SearchHotelsDTO {
  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit: number;

  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  offset: number;
}
