import { UUID } from "crypto";
import { Request, Response } from "express";
import { validate as uuidValidate } from "uuid";
import { Genre } from "../../db";
import genreRepository from "./genre.repository.js";
import genreMapper from "./genre.mapper.js";

interface IGenreService {
  addGenre(req: Request, res: Response): Promise<Genre>;
  getAllGenres(req: Request, res: Response): Promise<Genre[]>;
  getOneGenre(req: Request, res: Response): Promise<Genre>;
  updateGenre(req: Request, res: Response): Promise<Genre>;
  deleteGenre(req: Request, res: Response): Promise<Genre>;
}

class GenreService implements IGenreService {
  async addGenre(req: Request, res: Response): Promise<any> {
    if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }
    //kotroler mora da prima genre i da vraca genre ili dto genre

    try {
      const genre: Genre = req.body;

      const savedGenre = await genreRepository.save(genre);
      const genreDto = genreMapper.toGenreDTO(savedGenre);
      res.status(201).send(genreDto);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving genres.",
      });
    }
  }

  async getAllGenres(req: Request, res: Response): Promise<any> {
    const name = typeof req.query.name === "string" ? req.query.name : "";
    try {
      const genres = await genreRepository.retrieveAll({ name });

      res.status(200).send(genres);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving genres.",
      });
    }
  }

  async getOneGenre(req: Request, res: Response): Promise<any> {
    const id: UUID = req.params.id as UUID;

    // check if ID is a valid UUID
    const validatedUUID = uuidValidate(id);

    if (!validatedUUID)
      return res.status(500).send({
        message: `Error retrieving Genre with id=${id}. Id has to be a valid UUID`,
      });

    try {
      const genre = await genreRepository.retrieveById(id);

      if (genre) res.status(200).send(genre);
      else
        res.status(404).send({
          message: `Cannot find Genre with id=${id}.`,
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Genre with id=${id}.`,
      });
    }
  }

  async updateGenre(req: Request, res: Response): Promise<any> {
    let genre: Genre = req.body;
    genre.id = req.params.id as UUID;

    try {
      const num = await genreRepository.update(genre);

      if (num) {
        res.send({
          message: "Genre was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Genre with id=${genre.id}. Maybe Genre was not found or req.body is empty!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Genre with id=${genre.id}.`,
      });
    }
  }

  async deleteGenre(req: Request, res: Response): Promise<any> {
    const id: UUID = req.params.id as UUID;

    // check if ID is a valid UUID
    const validatedUUID = uuidValidate(id);

    if (!validatedUUID)
      return res.status(500).send({
        message: `Error deleting Genre with id=${id}. Id has to be a valid UUID`,
      });

    try {
      const num = await genreRepository.delete(id);

      if (num == 1) {
        res.send({
          message: "Genre was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Genre with id=${id}. Maybe Genre was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Genre with id==${id}.`,
      });
    }
  }
}

export default new GenreService();
