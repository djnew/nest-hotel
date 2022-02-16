import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import * as dayjs from 'dayjs';

export class ReservationSearchDto {
  @IsNotEmpty()
  @Transform(({ value }) => dayjs(value), { toClassOnly: true })
  startDate: dayjs.Dayjs;

  @IsNotEmpty()
  @Transform(({ value }) => dayjs(value), { toClassOnly: true })
  endDate: dayjs.Dayjs;

  @IsString()
  user: string;
}
