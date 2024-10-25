import { Request, Response } from "express";
import reservationService from "../services/reservation.service.js";

export default class ReservationController {
  create(req: Request, res: Response) {
    try {
      reservationService.addReservation(req, res);
    } catch (error) {}
  }

  findAll(req: Request, res: Response) {
    try {
      reservationService.getAllReservation(req, res);
    } catch (error) {}
  }

  findOne(req: Request, res: Response) {
    try {
      reservationService.getOneReservation(req, res);
    } catch (error) {}
  }

  update(req: Request, res: Response) {
    try {
      reservationService.updateReservation(req, res);
    } catch (error) {}
  }

  delete(req: Request, res: Response) {
    try {
      reservationService.deleteReservation(req, res);
    } catch (error) {}
  }
}
