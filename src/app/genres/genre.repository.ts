import { Op } from "sequelize";
import { UUID } from "crypto";
import { Genre } from "../../db/index.js";
import { DatabaseException } from "../../exceptions/DatabaseException.js";

interface IGenreRepository {
  save(genre: Genre): Promise<Genre>;
  retrieveAll(searchParams: { name: string }): Promise<Genre[]>;
  retrieveById(genreId: UUID): Promise<Genre | null>;
  update(genre: Genre): Promise<Genre>;
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
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }
  async retrieveAll(searchParams: { name?: string }): Promise<Genre[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.name)
        condition.name = { [Op.iLike]: `%${searchParams.name}%` };

      return await Genre.findAll({ where: condition });
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async retrieveById(genreId: UUID): Promise<Genre | null> {
    try {
      return await Genre.findByPk(genreId);
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async update(genre: Genre): Promise<Genre> {
    const { id, name } = genre;

    try {
      const [_, updatedGenres] = await Genre.update(
        { name },
        { where: { id: id }, returning: true }
      );
      // TODO vratiti updateovan genre umesto samo potvrde da bi front imao  odmah sa cime da radi umesto da salje novi zahtev
      return updatedGenres[0];
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async delete(genreId: UUID): Promise<number> {
    try {
      const affectedRows = await Genre.destroy({
        where: { id: genreId },
      });

      return affectedRows;
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }
}

export default new GenreRepository();
