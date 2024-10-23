import { UUID } from "crypto";
import movieRepository from "../repositories/movie.repository.js";
import { Request, Response } from "express";
import { Genre, Movie } from "../db/index.js";

interface IMovieService {
  addMovieWithGenres(req: Request, res: Response): Promise<Response>;
  getAllMovies(req: Request, res: Response): Promise<Movie[]>;
  getOneMovie(req: Request, res: Response): Promise<Movie>;
  updateMovie(req: Request, res: Response): Promise<Movie>;
  deleteMovie(req: Request, res: Response): Promise<Movie>;
}

class MovieService implements IMovieService {
  async addMovieWithGenres(req: Request, res: Response): Promise<Response> {
    const {
      name,
      originalName,
      posterImage,
      duration,
      genreNames,
    }: {
      name: string;
      originalName: string;
      posterImage: string;
      duration: number;
      genreNames: string[];
    } = req.body;

    // check if genreNames is not empty and is an array
    if (!Array.isArray(genreNames) || genreNames.length === 0) {
      return res.status(400).send({
        //shows the same error message if its not an array, maybe there should be another validation !Array.isArray(genreNames => create an array with the value that was sent as the first value of the array
        message: "You must provide at least one genre to create a movie.",
      });
    }
    try {
      // create the movie first
      const movie = await movieRepository.save({
        name,
        originalName,
        posterImage,
        duration,
      });

      //create genre array
      const genres: Genre[] = [];
      for (const genreName of genreNames) {
        // find the genre by name
        let genre = await Genre.findOne({ where: { name: genreName } });

        // if genre doesn't exist, create it
        if (!genre) {
          genre = await Genre.create({ name: genreName });
          console.log(`CREATED NEW GENRE: ${genreName}`);
        }

        // push genre to genres array
        genres.push(genre);
      }

      console.log(
        `ALL GENRES: ${genres.map((g) => g.name)}\n ${genres.map(
          (g) => g.genre_id
        )}\n`
      );

      // associate the genres with the movie
      await movieRepository.addGenresToMovie(movie, genres);

      //return movie
      return res.status(201).send(movie);
    } catch (err) {
      return res.status(500).send({
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
