import Genre from "../models/genre.model.js";
import genreRepository from "../repositories/genre.repository.js";
import { Request, Response } from "express";

export default class GenreController {
  async create(req: Request, res: Response) {
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
  async findAll(req: Request, res: Response) {
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

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

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

  async update(req: Request, res: Response) {
    let genre: Genre = req.body;
    genre.id = parseInt(req.params.id);

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

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

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

  // pool.query("SELECT * FROM genres", (err: any, results) => {
  //   if (err) throw err;
  //   res.status(200).json(results.rows);
  // });
}

//get single genre
const getGenreById = (req: Request, res: Response) => {
  console.log("get one");
  // const id = req.params.id;
  // pool.query(
  //   "SELECT * FROM genres WHERE genre_id = $1",
  //   [id],
  //   (err: any, results: any) => {
  //     if (err) throw err;

  //     res.status(200).json(results.rows);
  //   }
  // );
};

// add genre
const addGenre = (req: Request, res: Response) => {
  const { genrename } = req.body;
  console.log("add");
  //check if name exists
  // pool.query(
  //   "SELECT * FROM genres WHERE genrename = $1",
  //   [genrename],
  //   (err: any, results: any) => {
  //     if (results.rows.length) {
  //       return res.send("Genre name already exist");
  //     }

  //     //add genre
  //     const newGenreId = generateId();
  //     pool.query(
  //       "INSERT INTO genres (genre_id, genrename) VALUES ($1, $2)",
  //       [newGenreId, genrename],
  //       (err: any, results: any) => {
  //         if (err) throw err;

  //         res.status(201).send("Genre successfully created");
  //       }
  //     );
  //   }
  // );
};

// delete genre
const deleteGenre = (req: Request, res: Response) => {
  console.log("Deleted");
  // const id = req.params.id;

  // //check if name exists
  // pool.query(
  //   "SELECT * FROM genres WHERE genre_id = $1",
  //   [id],
  //   (err: any, results: any) => {
  //     if (!results.rows.length) {
  //       return res.send("Genre not found");
  //     }

  //     pool.query(
  //       "DELETE FROM genres WHERE genre_id = $1",
  //       [id],
  //       (err: any, results: any) => {
  //         if (err) throw err;
  //         res.status(200).send("Genre successfully deleted");
  //       }
  //     );
  //   }
  // );
};

const updateGenre = (req: Request, res: Response) => {
  console.log("Updated");
  // const id = req.params.id;
  // const newGenreName = req.body.genrename;

  // //check if name exists
  // pool.query(
  //   "SELECT * FROM genres WHERE genre_id = $1",
  //   [id],
  //   (err: any, results: any) => {
  //     if (!results.rows.length) {
  //       return res.send("Genre not found");
  //     }

  //     pool.query(
  //       "UPDATE genres SET genrename = $1 WHERE genre_id = $2",
  //       [newGenreName, id],
  //       (err: any, results: any) => {
  //         if (err) throw err;
  //         res.status(200).send("Genre successfully updated");
  //       }
  //     );
  //   }
  // );
};
