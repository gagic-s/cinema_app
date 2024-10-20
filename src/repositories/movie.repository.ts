import { Op } from "sequelize";
import Movie from "../models/movie.model.js";
import { UUID } from "crypto";

interface IMovieRepository {
  save(movie: Movie): Promise<Movie>;
  retrieveAll(searchParams: { name: string }): Promise<Movie[]>;
  retrieveById(movieId: UUID): Promise<Movie | null>;
  update(movie: Movie): Promise<number>;
  delete(movieId: UUID): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class MovieRepository implements IMovieRepository {
  async save(movie: Movie): Promise<Movie> {
    try {
      return await Movie.create({
        name: movie.name,
        originalName: movie.originalName,
        duration: movie.duration,
        posterImage: movie.posterImage,
      });
    } catch (err) {
      throw new Error("Failed to create Genre!");
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
      return await Movie.findByPk(movieId);
    } catch (error) {
      throw new Error("Failed to retrieve Genres!");
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
