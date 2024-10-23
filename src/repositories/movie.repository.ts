import { Op } from "sequelize";
import { UUID } from "crypto";
import { Genre, Movie } from "../db/index.js";
import { NotFoundException } from "../exceptions/NotFoundException.js";
import { DatabaseException } from "../exceptions/DatabaseException.js";

interface IMovieRepository {
  save({
    name,
    originalName,
    posterImage,
    duration,
  }: {
    name: string;
    originalName: string;
    posterImage: string;
    duration: number;
  }): Promise<Movie>;
  addGenresToMovie(movie: Movie, genres: Genre[]): Promise<void>;
  retrieveAll(searchParams: { name: string }): Promise<Movie[]>;
  retrieveById(movieId: UUID): Promise<Movie | null>;
  update(movie: Movie): Promise<number>;
  delete(movieId: UUID): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class MovieRepository implements IMovieRepository {
  async save({
    name,
    originalName,
    posterImage,
    duration,
  }: {
    name: string;
    originalName: string;
    posterImage: string;
    duration: number;
  }): Promise<Movie> {
    try {
      return await Movie.create({
        name: name,
        originalName: originalName,
        posterImage: posterImage,
        duration: duration,
      });
    } catch (err) {
      throw new Error("Failed to create Movie!");
    }
  }

  async addGenresToMovie(movie: Movie, genres: Genre[]): Promise<void> {
    try {
      // add the association in the movieGenres table
      // if I put movie.addGenres it shows addGenres doesn't exist on Movie WHY?
      return await (movie as any).addGenres(genres);
    } catch (error) {
      throw new Error("Failed to add Genres!");
    }
  }

  async retrieveAll(searchParams: { name?: string }): Promise<Movie[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.name)
        condition.name = { [Op.iLike]: `%${searchParams.name}%` };

      return await Movie.findAll({ where: condition });
    } catch (error) {
      throw new Error("Failed to retrieve Genre!");
    }
  }

  async retrieveById(movieId: UUID): Promise<Movie | null> {
    try {
      const movie = await Movie.findByPk(movieId);
      if (!movie) {
        throw new NotFoundException("Movie");
      }
      return movie;
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async update(movie: Movie): Promise<number> {
    const { id, name } = movie;

    try {
      const affectedRows = await Movie.update({ name }, { where: { id: id } });

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update Genre!");
    }
  }

  async delete(movieId: UUID): Promise<number> {
    try {
      const affectedRows = await Movie.destroy({
        where: { id: movieId },
      });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete Genre!");
    }
  }
}

export default new MovieRepository();
