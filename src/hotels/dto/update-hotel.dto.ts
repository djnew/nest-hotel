import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelDTO } from './create-hotel.dto';

export class UpdateHotelDto extends PartialType(CreateHotelDTO) {}
