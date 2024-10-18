import { UUID } from "crypto";
import Genre from "../models/genre.model.js";
import genreRepository from "../repositories/genre.repository.js";
import { Request, Response } from "express";

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

    try {
      const genre: Genre = req.body;

      const savedGenre = await genreRepository.save(genre);

      res.status(201).send(savedGenre);
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
    //URADITI VALIDACIJU
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

      if (num == 1) {
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
