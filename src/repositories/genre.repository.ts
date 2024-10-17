import { Op } from "sequelize";
import Genre from "../models/genre.model.js";
import { UUID } from "crypto";

interface IGenreRepository {
  save(genre: Genre): Promise<Genre>;
  retrieveAll(searchParams: { name: string }): Promise<Genre[]>;
  retrieveById(genreId: UUID): Promise<Genre | null>;
  update(genre: Genre): Promise<number>;
  delete(genreId: UUID): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class GenreRepository implements IGenreRepository {
  async save(genre: Genre): Promise<Genre> {
    try {
      return await Genre.create({
        name: genre.name,
      });
    } catch (err) {
      throw new Error("Failed to create Genre!");
    }
  }
  async retrieveAll(searchParams: { name?: string }): Promise<Genre[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.name)
        condition.name = { [Op.iLike]: `%${searchParams.name}%` };

      return await Genre.findAll({ where: condition });
    } catch (error) {
      throw new Error("Failed to retrieve Genre!");
    }
  }

  async retrieveById(genreId: UUID): Promise<Genre | null> {
    try {
      return await Genre.findByPk(genreId);
    } catch (error) {
      throw new Error("Failed to retrieve Genres!");
    }
  }

  async update(genre: Genre): Promise<number> {
    const { id, name } = genre;

    try {
      const affectedRows = await Genre.update({ name }, { where: { id: id } });

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update Genre!");
    }
  }

  async delete(genreId: UUID): Promise<number> {
    try {
      const affectedRows = await Genre.destroy({
        where: { id: genreId },
      });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete Genre!");
    }
  }
}

export default new GenreRepository();
