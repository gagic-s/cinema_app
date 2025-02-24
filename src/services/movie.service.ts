import { UUID } from "crypto";
import movieRepository from "../repositories/movie.repository.js";
import { Request, Response } from "express";
import { Movie } from "../db/index.js";
import { validate as uuidValidate } from "uuid";
import MovieMapper from "../mappers/movie.mapper.js";

interface IMovieService {
  addMovieWithGenres(req: Request, res: Response): Promise<Response>;
  getAllMovies(req: Request, res: Response): Promise<Movie[]>;
  getOneMovie(req: Request, res: Response): Promise<Movie>;
  updateMovie(req: Request, res: Response): Promise<Movie>;
  deleteMovie(req: Request, res: Response): Promise<Movie>;
}

class MovieService implements IMovieService {
  async addMovieWithGenres(req: Request, res: Response): Promise<Response> {
    const { name, originalName, duration, genreNames } = req.body as {
      name: string;
      originalName: string;
      duration: number;
      genreNames: string[];
    };

    const posterImage = req.file;

    try {
      if (!name) {
        return res.status(400).json({
          message: "You must provide name.",
        });
      }

      if (!originalName) {
        return res.status(400).json({
          message: "You must provide original name.",
        });
      }

      if (!duration) {
        return res.status(400).json({
          message: "You must provide duration.",
        });
      }

      if (!Array.isArray(genreNames)) {
        return res.status(400).json({
          message: "You must provide at least one genre .",
        });
      }

      if (!posterImage) {
        return res.status(400).json({
          message: "You must provide poster image.",
        });
      }
      // create the movie first
      const movie = await movieRepository.save({
        name,
        originalName,
        duration,
        posterImage,
      });

      //TODO: zanrovi ce se birati na principu selekta, nema potrebe da se kreiraju ako ne postoje
      //create genre array
      // const genres: Genre[] = [];
      // for (const genreName of genreNames) {
      //   // find the genre by name
      //   //operator Op.in ?
      //   let genre = await Genre.findOne({ where: { name: genreName } });

      //   // if genre doesn't exist, create it
      //   if (!genre) {
      //     genre = await Genre.create({ name: genreName });
      //   }
      //   // push genre to genres array
      //   genres.push(genre);
      // }
      // // associate the genres with the movie
      // await movieRepository.addGenresToMovie(movie, genres);

      //return movie
      return res.status(201).json(movie);
    } catch (err: any) {
      return res.status(500).json({
        message: err.message,
      });
    }
  }

  async getAllMovies(req: Request, res: Response): Promise<any> {
    try {
      const searchParams: {
        movieName?: string;
        date?: string;
        limit?: number;
        offset?: number;
      } = {
        movieName: req.query.movieName?.toString() || "",
        date: req.query.date?.toString() || "",
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
      };

      const movies = await movieRepository.retrieveAll(searchParams);
      res.status(200).json(movies.map(MovieMapper.toMovieResponse));
    } catch (error) {
      res
        .status(500)
        .json({ message: "Some error occurred while retrieving movies." });
    }
  }

  async getOneMovie(req: Request, res: Response): Promise<any> {
    const id: UUID = req.params.id as UUID;

    if (!uuidValidate(id)) {
      return res.status(400).json({ message: `Invalid UUID: ${id}` });
    }

    try {
      const movie = await movieRepository.retrieveById(id);

      if (!movie) {
        return res
          .status(404)
          .json({ message: `Movie with id=${id} not found.` });
      }

      res.status(200).json(movie);
    } catch (err) {
      res.status(500).json({
        message: `Error retrieving Movie with id=${id}.`,
      });
    }
  }

  async updateMovie(req: Request, res: Response): Promise<any> {
    try {
      const movie: Movie = { ...req.body, id: req.params.id as UUID };
      const updated = await movieRepository.update(movie);

      res.status(updated === 1 ? 200 : 404).json({
        message:
          updated === 1
            ? "Movie was updated successfully."
            : `Cannot update Movie with id=${movie.id}. Maybe it was not found or request body is empty!`,
      });
    } catch {
      res
        .status(500)
        .json({ message: `Error updating Movie with id=${req.params.id}.` });
    }
  }

  async deleteMovie(req: Request, res: Response): Promise<any> {
    const id: UUID = req.params.id as UUID;

    if (!uuidValidate(id)) {
      return res.status(400).json({ message: `Invalid UUID: ${id}` });
    }

    try {
      const deleted = await movieRepository.delete(id);

      res.status(deleted === 1 ? 200 : 404).json({
        message:
          deleted === 1
            ? "Movie was deleted successfully!"
            : `Movie with id=${id} not found.`,
      });
    } catch (err) {
      res.status(500).json({
        message: `Could not delete Movie with id==${id}.`,
      });
    }
  }
}

export default new MovieService();
