import { Router } from "express";
import TicketController from "./ticket.controller.js";

class TicketRoutes {
  router = Router();
  controller = new TicketController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Create a new Ticket
    this.router.post("/", this.controller.create);
    //TODO: Delete a Ticket with id
    // this.router.delete("/:id", this.controller.delete);
  }
}

export default new TicketRoutes().router;
