import { ID } from '../../types/types';
import { IRoom } from '../entities/room.entity';

export class CreateRoom {
  title: string;
  description: string;
  hotel: string;
  images: string[];
}

export class CreateRoomDto implements IRoom {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  hotel: ID;
  images?: string[];
  isEnabled: boolean;
}
