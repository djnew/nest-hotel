import { EventEmitter } from 'events';

export const HotelEventEmitter = new EventEmitter();

export enum HotelEmitterEvents {
  SEND_MESSAGE = 'sendMessage',
}
