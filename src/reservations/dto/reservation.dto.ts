export interface ReservationDto {
  _id?: string;
  user: string;
  hotel: string;
  room: string;
  dateStart: Date;
  dateEnd: Date;
}
