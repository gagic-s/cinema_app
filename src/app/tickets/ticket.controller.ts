import { UUID } from "crypto";
import { Request, Response } from "express";
import { TicketDTO } from "./ticket.dto.js";
import { DatabaseException } from "../../exceptions/DatabaseException.js";
import ticketMapper from "./ticket.mapper.js";
import ticketService from "./ticket.service.js";

export default class TicketController {
  async create(req: Request, res: Response) {
    try {
      const ticket: TicketDTO = ticketMapper.toTicketDTO(req.body);
      const newTicket = await ticketService.addTicket(ticket);
      res.status(201).send(newTicket);
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async findAll(req: Request, res: Response) {
    const { reservation_id } = req.query;

    const reservationId = (reservation_id as UUID) || "";

    try {
      const tickets = await ticketService.getAllTickets(reservationId);
      res.status(200).send(tickets);
    } catch (error) {
      res.status(500).send({
        message: "Some error occurred while retrieving tickets.",
      });
    }
  }

  // findOne(req: Request, res: Response) {
  //   try {
  //     ticketService.getOneTicket(req, res);
  //   } catch (error) {}
  // }

  //   update(req: Request, res: Response) {
  //     try {
  //       MovieService.updateMovie(req, res);
  //     } catch (error) {}
  //   }

  //   delete(req: Request, res: Response) {
  //     try {
  //       MovieService.deleteMovie(req, res);
  //     } catch (error) {}
  //   }
}
