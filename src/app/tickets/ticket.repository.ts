import { UUID } from "crypto";
import { Op } from "sequelize";
import { Reservation, Screening, Ticket } from "../../db/index.js";
import { TicketDTO } from "./ticket.dto.js";
import { DatabaseException } from "../../exceptions/DatabaseException.js";
import { NotFoundException } from "../../exceptions/NotFoundException.js";
import ticketMapper from "./ticket.mapper.js";

interface ITicketRepository {
  save(ticket: Ticket): Promise<Ticket>;
  retrieveAll(searchParams: { reservation_id: UUID }): Promise<any>;
  retrieveById(ticketId: UUID): Promise<Ticket>;
  //TODO: delete(ticketId: UUID): Promise<number>;
}

class TicketRepository implements ITicketRepository {
  async save(ticket: TicketDTO): Promise<Ticket> {
    try {
      return await Ticket.create({
        screening_id: ticket.screening_id,
        ticket_row: ticket.ticket_row,
        ticket_column: ticket.ticket_column,
        reservation_id: ticket.reservation_id,
      });
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async retrieveAll(searchParams: { reservation_id?: UUID }): Promise<any> {
    const condition: any = {};

    try {
      if (searchParams.reservation_id) {
        condition.reservation_id = {
          [Op.iLike]: `%${searchParams.reservation_id}%`,
        };
      }

      const tickets = await Ticket.findAll({
        where: condition,
        include: [
          {
            model: Reservation,
            where: searchParams.reservation_id
              ? { screeningDate: searchParams.reservation_id }
              : undefined,
            attributes: ["reservationCode", "email"],
          },
          {
            model: Screening,
            attributes: ["ticketPrice"],
          },
        ],
        // limit: searchParams.limit || undefined, // Apply limit if specified
        // offset: searchParams.offset || undefined,
      });

      return ticketMapper.toTicketsForAdminDTOs(tickets);
    } catch (error: any) {
      new DatabaseException(error.message);
    }
  }

  async retrieveById(ticketId: UUID): Promise<any> {
    try {
      const ticket = await Ticket.findByPk(ticketId);
      if (!ticket) {
        throw new NotFoundException("Ticket");
      }

      return ticket;
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

}

export default new TicketRepository();
