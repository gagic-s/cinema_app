import { UUID } from "crypto";
import { Screening } from "../db/index.js";
import { DatabaseException } from "../exceptions/DatabaseException.js";
import { Op } from "sequelize";
import { NotFoundException } from "../exceptions/NotFoundException.js";

interface IScreeningRepository {
  save(screening: Screening): Promise<Screening>;
  retrieveAll(searchParams: { name: string }): Promise<Screening[]>;
  retrieveById(screeningId: UUID): Promise<Screening>;
  update(screening: Screening): Promise<number>;
  delete(screeningId: UUID): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class ScreeningRepository implements IScreeningRepository {
  async save(screening: Screening): Promise<Screening> {
    try {
      return await Screening.create({
        movie_id: screening.movie_id,
        screeningDate: screening.screeningDate,
        screeningTime: screening.screeningTime,
        ticketPrice: screening.ticketPrice,
        screeningRows: screening.screeningRows,
        screeningColumns: screening.screeningColumns,
      });
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async retrieveAll(searchParams: { name?: string }): Promise<Screening[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.name) {
        condition.name = { [Op.iLike]: `%${searchParams.name}%` };
      }

      return await Screening.findAll({ where: condition });
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async retrieveById(screeningId: UUID): Promise<Screening> {
    try {
      const screening = await Screening.findByPk(screeningId);
      if (!screening) {
        throw new NotFoundException("Screening");
      }

      return screening;
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async update(screening: Screening): Promise<number> {
    const {
      id,
      screeningDate,
      screeningTime,
      ticketPrice,
      screeningColumns,
      screeningRows,
    } = screening;
    try {
      const affectedRows = await Screening.update(
        {
          screeningDate,
          screeningTime,
          ticketPrice,
          screeningColumns,
          screeningRows,
        },
        { where: { screening_id: id } }
      );

      return affectedRows[0];
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async delete(screeningId: UUID): Promise<number> {
    try {
      const affectedRows = await Screening.destroy({
        where: { screening_id: screeningId },
      });
      return affectedRows;
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }
}

export default new ScreeningRepository();
