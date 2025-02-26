import { UUID } from "crypto";
import { Request, Response } from "express";
import { validate as uuidValidate } from "uuid";
import { Ticket } from "../../db/index.js";
import { TicketDTO } from "./ticket.dto.js";
import { DatabaseException } from "../../exceptions/DatabaseException.js";
import { ValidationException } from "../../exceptions/ValidationException.js";
import ticketMapper from "./ticket.mapper.js";
import ticketRepository from "./ticket.repository.js";
import movieRepository from "../movies/movie.repository.js";

interface ITicketService {
  addTicket(ticketData: TicketDTO): Promise<TicketDTO>;
  getAllTickets(reservation_id?: UUID): Promise<Ticket[]>;
  getOneTicket(req: Request, res: Response): Promise<Ticket>;
  //TODO: deleteTicket(req: Request, res: Response): Promise<Ticket>;
}

class TicketService implements ITicketService {
  async addTicket(ticketData: TicketDTO): Promise<TicketDTO> {
    // check if has all required fields
    if (
      !ticketData.screening_id ||
      !ticketData.ticket_row ||
      !ticketData.ticket_column ||
      !ticketData.reservation_id
    ) {
      throw new ValidationException("All fields are required.");
    }

    try {
      const ticket = await ticketRepository.save(ticketData);

      const ticketDTO = ticketMapper.toTicketDTO(ticket);

      return ticketDTO;
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async getAllTickets(reservation_id?: UUID): Promise<Ticket[]> {
    const searchParams: {
      reservation_id?: UUID;
    } = {};

    searchParams.reservation_id = reservation_id;

    try {
      const tickets: Ticket[] = await ticketRepository.retrieveAll(
        searchParams
      );

      return tickets;
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async getOneTicket(req: Request, res: Response): Promise<any> {
    const id: UUID = req.params.id as UUID;
    // check if ID is a valid UUID
    const validatedUUID = uuidValidate(id);

    if (!validatedUUID)
      return res.status(500).send({
        message: `Error retrieving Movie with id=${id}. Id has to be a valid UUID`,
      });

    try {
      const movie = await movieRepository.retrieveById(id);

      if (movie) res.status(200).send(movie);
      else
        res.status(404).send({
          message: `Cannot find Movie with id=${id}.`,
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Movie with id=${id}.`,
      });
    }
  }

}

export default new TicketService();
