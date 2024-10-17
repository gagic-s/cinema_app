import { Router } from "express";
import GenreController from "../controllers/genres.controller.js";

class GenreRoutes {
  router = Router();
  controller = new GenreController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Genre
    this.router.post("/", this.controller.create);
    // Retrieve all Genre
    this.router.get("/", this.controller.findAll);
    // Retrieve a single Zanr with id
    this.router.get("/:id", this.controller.findOne);
    // Update a Zanr with id
    this.router.put("/:id", this.controller.update);
    // Delete a Genre with id
    this.router.delete("/:id", this.controller.delete);
  }
}

export default new GenreRoutes().router;
