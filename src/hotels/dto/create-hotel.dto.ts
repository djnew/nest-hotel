import { IHotel } from 'src/hotels/entities/hotel.entity';

export class CreateHotelDto implements IHotel {
  _id?: string;
  createdAt: Date;
  description: string;
  title: string;
  updatedAt: Date;
}
