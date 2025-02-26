import { UUID } from "crypto";
import { Request, Response } from "express";
import { validate as uuidValidate } from "uuid";
import { Screening } from "../../db/index.js";
import { DatabaseException } from "../../exceptions/DatabaseException.js";
import { NotFoundException } from "../../exceptions/NotFoundException.js";
import { ValidationException } from "../../exceptions/ValidationException.js";
import screeningMapper from "./screening.mapper.js";
import movieRepository from "../movies/movie.repository.js";
import screeningRepository from "./screening.repository.js";

interface IScreeningService {
  addScreening(req: Request, res: Response): Promise<any>;
  getAllScreenings(req: Request, res: Response): Promise<any>;
  getOneScreening(req: Request, res: Response): Promise<any>;
  updateScreening(req: Request, res: Response): Promise<any>;
  deleteScreening(req: Request, res: Response): Promise<any>;
}

class ScreeningService implements IScreeningService {
  async addScreening(req: Request, res: Response): Promise<any> {
    const {
      movie_id,
      screeningDate,
      screeningTime,
      ticketPrice,
      screeningRows,
      screeningColumns,
    } = req.body;

    // Validate required fields
    if (
      !movie_id ||
      !screeningDate ||
      !screeningTime ||
      !ticketPrice ||
      !screeningRows ||
      !screeningColumns
    ) {
      throw new ValidationException("Missing required screening fields.");
    }

    // Check if the movie exists
    const movie = await movieRepository.retrieveById(movie_id);
    if (!movie) {
      throw new NotFoundException("Movie");
    }

    try {
      const screening: Screening = req.body;
      const savedScreening = await screeningRepository.save(screening);
      res.status(201).send(savedScreening);
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async getAllScreenings(req: Request, res: Response): Promise<any> {
    const date = typeof req.query.date === "string" ? req.query.date : "";
    const genreName =
      typeof req.query.genreName === "string" ? req.query.genreName : "";

    try {
      const genres = await screeningRepository.retrieveAll({ date, genreName });

      res.status(200).send(genres);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving movies.",
      });
    }
  }

  async getOneScreening(req: Request, res: Response): Promise<any> {
    const id: UUID = req.params.id as UUID;
    // check if ID is a valid UUID
    const validatedUUID = uuidValidate(id);

    if (!validatedUUID) throw new ValidationException("Screening");

    try {
      const screening = await screeningRepository.retrieveById(id);

      if (screening) {
        const screeningResponse =
          screeningMapper.toRetrieveScreeningResponse(screening);
        res.status(200).send(screeningResponse);
      } else throw new NotFoundException("Screening");
    } catch (err: any) {
      throw new DatabaseException(err.message);
    }
  }

  async updateScreening(req: Request, res: Response): Promise<any> {
    let screening: Screening = req.body;
    screening.id = req.params.id as UUID;

    try {
      const num = await screeningRepository.update(screening);

      if (num == 1) {
        res.send({
          message: "Screening was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Screening with id=${screening.id}. Maybe Screening was not found or req.body is empty!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Screening with id=${screening.id}.`,
      });
    }
  }

  async deleteScreening(req: Request, res: Response): Promise<any> {
    const id: UUID = req.params.id as UUID;

    // check if ID is a valid UUID
    const validatedUUID = uuidValidate(id);

    if (!validatedUUID) throw new ValidationException("Screening");

    try {
      const num = await screeningRepository.delete(id);

      if (num == 1) {
        res.send({
          message: "Screening was deleted successfully!",
        });
      } else {
        throw new NotFoundException("Screening");
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Screening with id==${id}.`,
      });
    }
  }
}

export default new ScreeningService();
