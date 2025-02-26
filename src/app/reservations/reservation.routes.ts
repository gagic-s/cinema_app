import { Router } from "express";
import ReservationController from "./reservation.controller.js";

class ReservationRoutes {
  router = Router();
  controller = new ReservationController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Create a new Reservation
    this.router.post("/", this.controller.create);
    // Retrieve all Reservation
    this.router.get("/", this.controller.findAll);
    // Retrieve a single Reservation with id
    this.router.get("/:id", this.controller.findOne);
    // Update a Reservation with id
    this.router.put("/:id", this.controller.update);
    // Delete a Reservation with id
    this.router.delete("/:id", this.controller.delete);
  }
}

export default new ReservationRoutes().router;
