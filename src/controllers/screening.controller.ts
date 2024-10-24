import { Request, Response } from "express";
import screeningService from "../services/screening.service.js";

export default class ScreeningController {
  create(req: Request, res: Response) {
    try {
      screeningService.addScreening(req, res);
    } catch (error) {}
  }

  findAll(req: Request, res: Response) {
    try {
      screeningService.getAllScreenings(req, res);
    } catch (error) {}
  }

  findOne(req: Request, res: Response) {
    try {
      screeningService.getOneScreening(req, res);
    } catch (error) {}
  }

  update(req: Request, res: Response) {
    try {
      screeningService.updateScreening(req, res);
    } catch (error) {}
  }

  delete(req: Request, res: Response) {
    try {
      screeningService.deleteScreening(req, res);
    } catch (error) {}
  }
}
