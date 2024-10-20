import { Request, Response } from "express";
import MovieService from "../services/movie.service.js";

export default class MovieController {
  create(req: Request, res: Response) {
    try {
      MovieService.addMovie(req, res);
    } catch (error) {}
  }

  findAll(req: Request, res: Response) {
    try {
      MovieService.getAllMovies(req, res);
    } catch (error) {}
  }

  findOne(req: Request, res: Response) {
    try {
      MovieService.getOneMovie(req, res);
    } catch (error) {}
  }

  update(req: Request, res: Response) {
    try {
      MovieService.updateMovie(req, res);
    } catch (error) {}
  }

  delete(req: Request, res: Response) {
    try {
      MovieService.deleteMovie(req, res);
    } catch (error) {}
  }
}
