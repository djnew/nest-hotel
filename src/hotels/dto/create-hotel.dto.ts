import { IHotel } from 'src/hotels/entities/hotel.entity';

export class CreateHotel {
  title: string;
  description: string;
}

export class CreateHotelDto implements IHotel {
  _id?: string;
  createdAt: Date;
  description: string;
  title: string;
  updatedAt: Date;
}
