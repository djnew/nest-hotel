import { IsString } from 'class-validator';

export class SubscribeDTO {
  @IsString()
  chatId: string;
}
