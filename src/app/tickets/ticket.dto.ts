import { UUID } from "crypto";

export class TicketDTO {
  screening_id!: UUID;
  ticket_row!: number;
  ticket_column!: number;
  reservation_id!: UUID;
}

export class GetAllTicketsForAdminDTO {
  screening_id!: UUID;
  ticket_row!: number;
  ticket_column!: number;
  reservation_id!: UUID;
  createdAt!: Date;
  updatedAt!: Date;
  reservationCode!: string;
  email!: string;
  ticketPrice!: number;
}
