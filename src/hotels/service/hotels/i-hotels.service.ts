import { HotelDocument } from 'src/hotels/entities/hotel.entity';
import { ID } from 'src/types/types';

export const I_HOTELS_SERVICE = 'I_HOTELS_SERVICE';

export interface IHotelService {
  create(data: any): Promise<HotelDocument>;
  findById(id: ID): Promise<HotelDocument>;
  search(params: Pick<HotelDocument, 'title'>): Promise<HotelDocument[]>;
}
