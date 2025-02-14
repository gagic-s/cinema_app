import { Request, Response } from "express";
import { Reservation } from "../db/index.js";
import { NotFoundException } from "../exceptions/NotFoundException.js";
import { ValidationException } from "../exceptions/ValidationException.js";
import reservationRepository from "../repositories/reservation.repository.js";
import screeningRepository from "../repositories/screening.repository.js";
import {
  generateReservationCode,
  isValidEmail,
} from "../util/helper.reservation.js";
import { DatabaseException } from "../exceptions/DatabaseException.js";
import { UUID } from "crypto";
import { validate as uuidValidate } from "uuid";
import CreateReservationRequest from "../dto/reservations/createReservation.dto.js";
import reservationMapper from "../mappers/reservation.mapper.js";

interface IReservationService {
  addReservation(req: Request, res: Response): Promise<any>;
  getAllReservation(req: Request, res: Response): Promise<any[]>;
  getOneReservation(req: Request, res: Response): Promise<any>;
  updateReservation(req: Request, res: Response): Promise<any>;
  deleteReservation(req: Request, res: Response): Promise<any>;
}

class ReservationService implements IReservationService {
  async addReservation(req: Request, res: Response): Promise<any> {
    const { screening_id, email, totalPrice, ticketsData } = req.body;

    console.log(req.body);
    //validate email
    const isEmailValid = isValidEmail(email);

    // Validate required fields
    if (
      !screening_id ||
      !email ||
      !totalPrice ||
      !isEmailValid ||
      !ticketsData.length
    ) {
      throw new ValidationException("Missing required reservation fields.");
    }

    //create reservation code
    const reservationCode = generateReservationCode(6);

    // Check if the screening exists
    const screening = await screeningRepository.retrieveById(screening_id);
    if (!screening) {
      throw new NotFoundException("Reservation");
    }

    try {
      const reservation: CreateReservationRequest = req.body;
      reservation.reservationCode = reservationCode;
      reservation.ticketsData = ticketsData;
      const savedReservation = await reservationRepository.save(reservation);

      res.status(201).send(savedReservation);
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async getAllReservation(req: Request, res: Response): Promise<any> {
    const screening_id =
      typeof req.query.screening_id === "string" ? req.query.screening_id : "";

    try {
      const genres = await reservationRepository.retrieveAll({ screening_id });

      res.status(200).send(genres);
    } catch (err: any) {
      throw new DatabaseException(err.message);
    }
  }

  async getOneReservation(req: Request, res: Response): Promise<any> {
    const id: UUID = req.params.id as UUID;
    // check if ID is a valid UUID
    const validatedUUID = uuidValidate(id);

    if (!validatedUUID) throw new ValidationException("Reservation");

    try {
      const reservation = await reservationRepository.retrieveById(id);

      if (reservation) res.status(200).send(reservation);
      else throw new NotFoundException("Reservation");
    } catch (err: any) {
      throw new DatabaseException(err.message);
    }
  }

  async updateReservation(req: Request, res: Response): Promise<any> {
    let reservation: Reservation = req.body;
    reservation.id = req.params.id as UUID;

    try {
      const num = await reservationRepository.update(reservation);

      if (num == 1) {
        res.send({
          message: "Reservation was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Reservation with id=${reservation.id}. Maybe Reservation was not found or req.body is empty!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Reservation with id=${reservation.id}.`,
      });
    }
  }

  async deleteReservation(req: Request, res: Response): Promise<any> {
    const id: UUID = req.params.id as UUID;

    // check if ID is a valid UUID
    const validatedUUID = uuidValidate(id);

    if (!validatedUUID) throw new ValidationException("Reservation");

    try {
      const num = await reservationRepository.delete(id);

      if (num == 1) {
        res.send({
          message: "Reservation was deleted successfully!",
        });
      } else {
        throw new NotFoundException("Reservation");
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Reservation with id==${id}.`,
      });
    }
  }
}

export default new ReservationService();
