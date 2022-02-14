import { IsOptional, IsString } from 'class-validator';

export class CreateRoomDTO {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  hotel: string;

  images: string[];
}
