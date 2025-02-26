import { Request, Response } from "express";
import genreService from "./genre.service.js";

export default class GenreController {
  create(req: Request, res: Response) {
    try {
      genreService.addGenre(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }

  findAll(req: Request, res: Response) {
    try {
      genreService.getAllGenres(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }

  findOne(req: Request, res: Response) {
    try {
      genreService.getOneGenre(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }

  update(req: Request, res: Response) {
    try {
      genreService.updateGenre(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }

  delete(req: Request, res: Response) {
    try {
      genreService.deleteGenre(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }
}
