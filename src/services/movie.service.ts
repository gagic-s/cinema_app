import { UUID } from "crypto";
import Movie from "../models/movie.model.js";
import movieRepository from "../repositories/movie.repository.js";
import { Request, Response } from "express";

interface IMovieService {
  addMovie(req: Request, res: Response): Promise<Movie>;
  getAllMovies(req: Request, res: Response): Promise<Movie[]>;
  getOneMovie(req: Request, res: Response): Promise<Movie>;
  updateMovie(req: Request, res: Response): Promise<Movie>;
  deleteMovie(req: Request, res: Response): Promise<Movie>;
}

class MovieService implements IMovieService {
  async addMovie(req: Request, res: Response): Promise<any> {
    if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    try {
      const genre: Movie = req.body;

      const savedGenre = await movieRepository.save(genre);

      res.status(201).send(savedGenre);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving movies.",
      });
    }
  }

  async getAllMovies(req: Request, res: Response): Promise<any> {
    const name = typeof req.query.name === "string" ? req.query.name : "";

    try {
      const genres = await movieRepository.retrieveAll({ name });

      res.status(200).send(genres);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving movies.",
      });
    }
  }

  async getOneMovie(req: Request, res: Response): Promise<any> {
    const id: UUID = req.params.id as UUID;
    //URADITI VALIDACIJU
    try {
      const genre = await movieRepository.retrieveById(id);

      if (genre) res.status(200).send(genre);
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

  async updateMovie(req: Request, res: Response): Promise<any> {
    let genre: Movie = req.body;
    genre.id = req.params.id as UUID;

    try {
      const num = await movieRepository.update(genre);

      if (num == 1) {
        res.send({
          message: "Movie was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Movie with id=${genre.id}. Maybe Movie was not found or req.body is empty!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Movie with id=${genre.id}.`,
      });
    }
  }

  async deleteMovie(req: Request, res: Response): Promise<any> {
    const id: UUID = req.params.id as UUID;

    try {
      const num = await movieRepository.delete(id);

      if (num == 1) {
        res.send({
          message: "Movie was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Movie with id=${id}. Maybe Movie was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Movie with id==${id}.`,
      });
    }
  }
}

export default new MovieService();
