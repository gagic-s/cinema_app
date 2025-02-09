import { Router } from "express";
import TicketController from "../controllers/ticket.controller.js";

class TicketRoutes {
  router = Router();
  controller = new TicketController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Create a new Movie
    this.router.post("/", this.controller.create);
    // Retrieve all Movies
    this.router.get("/", this.controller.findAll);
    // // Retrieve a single Movie with id
    // this.router.get("/:id", this.controller.findOne);
    // Update a Movie with id
    // this.router.put("/:id", this.controller.update);
    // // Delete a Movie with id
    // this.router.delete("/:id", this.controller.delete);
  }
}

export default new TicketRoutes().router;
