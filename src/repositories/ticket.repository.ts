import { UUID } from "crypto";
import { Reservation, Screening, Ticket } from "../db/index.js";
import { DatabaseException } from "../exceptions/DatabaseException.js";
import { Op } from "sequelize";
import { NotFoundException } from "../exceptions/NotFoundException.js";
import { GetAllTicketsForAdminDTO, TicketDTO } from "../dto/ticket.dto.js";
import ticketMapper from "../mappers/ticket.mapper.js";

interface ITicketRepository {
  save(ticket: Ticket): Promise<Ticket>;
  retrieveAll(searchParams: { reservation_id: UUID }): Promise<any>;
  retrieveById(ticketId: UUID): Promise<Ticket>;
  //   update(ticket: Screening): Promise<number>;
  //   delete(ticketId: UUID): Promise<number>;
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

  //   async update(screening: Screening): Promise<number> {
  //     const {
  //       id,
  //       screeningDate,
  //       screeningTime,
  //       ticketPrice,
  //       screeningColumns,
  //       screeningRows,
  //     } = screening;
  //     try {
  //       const affectedRows = await Screening.update(
  //         {
  //           screeningDate,
  //           screeningTime,
  //           ticketPrice,
  //           screeningColumns,
  //           screeningRows,
  //         },
  //         { where: { screening_id: id } }
  //       );

  //       return affectedRows[0];
  //     } catch (error: any) {
  //       throw new DatabaseException(error.message);
  //     }
  //   }

  //   async delete(screeningId: UUID): Promise<number> {
  //     try {
  //       const affectedRows = await Screening.destroy({
  //         where: { screening_id: screeningId },
  //       });
  //       return affectedRows;
  //     } catch (error: any) {
  //       throw new DatabaseException(error.message);
  //     }
  //   }
}

export default new TicketRepository();
