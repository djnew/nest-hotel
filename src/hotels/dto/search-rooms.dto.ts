import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { SearchRoomsParams } from '../base/rooms.types.base';

export class SearchRoomsDTO implements SearchRoomsParams {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isEnabled: true;

  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit: number;

  @IsInt()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  offset: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsString()
  hotel?: string;
}
