import pool from "../db.js";
import generateId from "../utils.js";
import { Request, Response } from "express";

// get all genres
const getGenres = (req: Request, res: Response) => {
  pool.query("SELECT * FROM genres", (err: any, results) => {
    if (err) throw err;
    res.status(200).json(results.rows);
  });
};

//get single genre
const getGenreById = (req: Request, res: Response) => {
  const id = req.params.id;
  pool.query(
    "SELECT * FROM genres WHERE genre_id = $1",
    [id],
    (err: any, results: any) => {
      if (err) throw err;

      res.status(200).json(results.rows);
    }
  );
};

// add genre
const addGenre = (req: Request, res: Response) => {
  const { genrename } = req.body;

  //check if name exists
  pool.query(
    "SELECT * FROM genres WHERE genrename = $1",
    [genrename],
    (err: any, results: any) => {
      if (results.rows.length) {
        return res.send("Genre name already exist");
      }

      //add genre
      const newGenreId = generateId();
      pool.query(
        "INSERT INTO genres (genre_id, genrename) VALUES ($1, $2)",
        [newGenreId, genrename],
        (err: any, results: any) => {
          if (err) throw err;

          res.status(201).send("Genre successfully created");
        }
      );
    }
  );
};

// delete genre
const deleteGenre = (req: Request, res: Response) => {
  const id = req.params.id;

  //check if name exists
  pool.query(
    "SELECT * FROM genres WHERE genre_id = $1",
    [id],
    (err: any, results: any) => {
      if (!results.rows.length) {
        return res.send("Genre not found");
      }

      pool.query(
        "DELETE FROM genres WHERE genre_id = $1",
        [id],
        (err: any, results: any) => {
          if (err) throw err;
          res.status(200).send("Genre successfully deleted");
        }
      );
    }
  );
};

const updateGenre = (req: Request, res: Response) => {
  const id = req.params.id;
  const newGenreName = req.body.genrename;

  //check if name exists
  pool.query(
    "SELECT * FROM genres WHERE genre_id = $1",
    [id],
    (err: any, results: any) => {
      if (!results.rows.length) {
        return res.send("Genre not found");
      }

      pool.query(
        "UPDATE genres SET genrename = $1 WHERE genre_id = $2",
        [newGenreName, id],
        (err: any, results: any) => {
          if (err) throw err;
          res.status(200).send("Genre successfully updated");
        }
      );
    }
  );
};

export { getGenres, getGenreById, addGenre, deleteGenre, updateGenre };
