import { Router } from "express";
import GenreController from "../controllers/genre.controller.js";

class GenreRoutes {
  router = Router();
  controller = new GenreController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Create a new Genre
    this.router.post("/", this.controller.create);
    // Retrieve all Genre
    this.router.get("/", this.controller.findAll);
    // Retrieve a single Genre with id
    this.router.get("/:id", this.controller.findOne);
    // Update a Genre with id
    this.router.put("/:id", this.controller.update);
    // Delete a Genre with id
    this.router.delete("/:id", this.controller.delete);
  }
}

export default new GenreRoutes().router;
