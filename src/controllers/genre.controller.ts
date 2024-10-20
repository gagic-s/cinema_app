import { Request, Response } from "express";
import GenreService from "../services/genre.service.js";

export default class GenreController {
  create(req: Request, res: Response) {
    try {
      GenreService.addGenre(req, res);
    } catch (error) {}
  }

  findAll(req: Request, res: Response) {
    try {
      GenreService.getAllGenres(req, res);
    } catch (error) {}
  }

  findOne(req: Request, res: Response) {
    try {
      GenreService.getOneGenre(req, res);
    } catch (error) {}
  }

  update(req: Request, res: Response) {
    try {
      GenreService.updateGenre(req, res);
    } catch (error) {}
  }

  delete(req: Request, res: Response) {
    try {
      GenreService.deleteGenre(req, res);
    } catch (error) {}
  }
}
