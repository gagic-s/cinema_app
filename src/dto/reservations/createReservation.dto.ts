import { UUID } from "crypto";

export class ReservationTicket {
  ticket_row!: number;
  ticket_column!: number;
}

export default class CreateReservationRequest {
  screening_id!: UUID;
  email!: string;
  totalPrice!: number;
  reservationCode!: string;
  ticketsData!: ReservationTicket[];
}

export class CreateReservationResponse {
  reservation_id!: UUID;
  reservationCode!: string;
  email!: string;
  totalPrice!: number;
  screening_id!: UUID;
  user_id!: UUID;
  createdAt!: string;
  updatedAt!: string;
  tickets!: ReservationTicket[];
}
