import { IRoom, RoomDocument } from 'src/hotels/entities/room.entity';
import { ID } from 'src/types/types';

export const I_ROOMS_SERVICE = 'I_ROOMS_SERVICE';

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  title: string;
  isEnabled?: true;
}

export interface HotelRoomService {
  create(data: Partial<IRoom>): Promise<RoomDocument>;
  findById(id: ID, isEnabled?: true): Promise<RoomDocument>;
  search(params: SearchRoomsParams): Promise<RoomDocument[]>;
  update(id: ID, data: Partial<RoomDocument>): Promise<RoomDocument>;
}
