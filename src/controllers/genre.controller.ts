import { Request, Response } from "express";
import GenreService from "../services/genre.service.js";

export default class GenreController {
  create(req: Request, res: Response) {
    try {
      GenreService.addGenre(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }

  findAll(req: Request, res: Response) {
    try {
      GenreService.getAllGenres(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }

  findOne(req: Request, res: Response) {
    try {
      GenreService.getOneGenre(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }

  update(req: Request, res: Response) {
    try {
      GenreService.updateGenre(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }

  delete(req: Request, res: Response) {
    try {
      GenreService.deleteGenre(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }
}
