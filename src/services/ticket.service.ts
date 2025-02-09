import { UUID } from "crypto";
import movieRepository from "../repositories/movie.repository.js";
import { Request, Response } from "express";
import { Genre, Movie, Ticket } from "../db/index.js";
import { validate as uuidValidate } from "uuid";
import { ValidationException } from "../exceptions/ValidationException.js";
import ticketRepository from "../repositories/ticket.repository.js";
import { DatabaseException } from "../exceptions/DatabaseException.js";
import { TicketDTO } from "../dto/ticket.dto.js";
import ticketMapper from "../mappers/ticket.mapper.js";

interface ITicketService {
  addTicket(ticketData: TicketDTO): Promise<TicketDTO>;
  getAllTickets(reservation_id?: UUID): Promise<Ticket[]>;
  getOneTicket(req: Request, res: Response): Promise<Ticket>;
  //   updateTicket(req: Request, res: Response): Promise<Ticket>;
  //   deleteTicket(req: Request, res: Response): Promise<Ticket>;
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
      // create the ticket first
      const ticket = await ticketRepository.save(ticketData);

      const ticketDTO = ticketMapper.toTicketDTO(ticket);

      //return ticket
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

  //   async updateMovie(req: Request, res: Response): Promise<any> {
  //     let genre: Movie = req.body;
  //     genre.id = req.params.id as UUID;

  //     try {
  //       const num = await movieRepository.update(genre);

  //       if (num == 1) {
  //         res.send({
  //           message: "Movie was updated successfully.",
  //         });
  //       } else {
  //         res.send({
  //           message: `Cannot update Movie with id=${genre.id}. Maybe Movie was not found or req.body is empty!`,
  //         });
  //       }
  //     } catch (err) {
  //       res.status(500).send({
  //         message: `Error updating Movie with id=${genre.id}.`,
  //       });
  //     }
  //   }

  //   async deleteMovie(req: Request, res: Response): Promise<any> {
  //     const id: UUID = req.params.id as UUID;

  //     // check if ID is a valid UUID
  //     const validatedUUID = uuidValidate(id);

  //     if (!validatedUUID)
  //       return res.status(500).send({
  //         message: `Error deleting Movie with id=${id}. Id has to be a valid UUID`,
  //       });

  //     try {
  //       const num = await movieRepository.delete(id);

  //       if (num == 1) {
  //         res.send({
  //           message: "Movie was deleted successfully!",
  //         });
  //       } else {
  //         res.send({
  //           message: `Cannot delete Movie with id=${id}. Maybe Movie was not found!`,
  //         });
  //       }
  //     } catch (err) {
  //       res.status(500).send({
  //         message: `Could not delete Movie with id==${id}.`,
  //       });
  //     }
  //   }
}

export default new TicketService();
