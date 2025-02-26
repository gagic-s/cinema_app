import { Ticket } from "../../db/index.js";
import { TicketDTO, GetAllTicketsForAdminDTO } from "../../app/tickets/ticket.dto.js";

class TicketMapper {
  toTicketDTO(ticket: Ticket): TicketDTO {
    return {
      screening_id: ticket.screening_id!,
      ticket_row: ticket.ticket_row!,
      ticket_column: ticket.ticket_column!,
      reservation_id: ticket.reservation_id!,
    };
  }

  toTicketModel(ticketDTO: TicketDTO) {
    return {
      screening_id: ticketDTO.screening_id!,
      ticket_row: ticketDTO.ticket_row!,
      ticket_column: ticketDTO.ticket_column!,
      reservation_id: ticketDTO.reservation_id!,
    };
  }

  toTicketsForAdminDto(response: any): GetAllTicketsForAdminDTO {
    return {
      screening_id: response.screening_id,
      ticket_row: response.ticket_row,
      ticket_column: response.ticket_column,
      reservation_id: response.reservation_id,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      reservationCode:
        response.dataValues.Reservation.dataValues.reservationCode, // Using optional chaining
      email: response.dataValues.Reservation.dataValues.email, // Using optional chaining
      ticketPrice: response.dataValues.Screening.dataValues.ticketPrice, // Using optional chaining
    };
  }

  // Method to map an array of responses to an array of DTOs
  //TODO create an interface for the response
  toTicketsForAdminDTOs(responses: any[]): TicketDTO[] {
    return responses.map((response) => this.toTicketsForAdminDto(response));
  }
}
export default new TicketMapper();
