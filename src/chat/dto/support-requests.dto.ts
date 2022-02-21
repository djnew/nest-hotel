import { IsString } from 'class-validator';

export class SupportRequestsDto {
  @IsString()
  text: string;
}
