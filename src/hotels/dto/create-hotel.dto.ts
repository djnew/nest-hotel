import { IsOptional, IsString } from 'class-validator';

export class CreateHotelDTO {
  @IsString()
  title: string;
  @IsString()
  @IsOptional()
  description: string;
}
