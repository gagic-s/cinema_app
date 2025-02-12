import { UUID } from "crypto";
import { Reservation } from "../db";
import {
  CreateReservationResponse,
  ReservationTicket,
} from "../dto/reservations/createReservation.dto";

class ReservationMapper {
  toCreateReservationResponse(
    reservation: Reservation,
    tickets: ReservationTicket[]
  ): CreateReservationResponse {
    return {
      reservation_id: reservation.reservation_id as UUID,
      reservationCode: reservation.reservationCode,
      email: reservation.reservationCode,
      totalPrice: reservation.totalPrice,
      screening_id: reservation.screening_id as UUID,
      user_id: reservation.user_id as UUID,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
      tickets: tickets,
    };
  }
}

export default new ReservationMapper();
