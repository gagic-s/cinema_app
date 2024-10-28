import { Router } from "express";
import UserController from "../controllers/user.controller.js";

class UserRoutes {
  router = Router();
  controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Create a new User
    this.router.post("/", this.controller.create);
    // Retrieve all User
    this.router.get("/", this.controller.findAll);
    // Retrieve a single User with id
    this.router.get("/:id", this.controller.findOne);
    // Update a User with id
    this.router.put("/:id", this.controller.update);
    // Delete a User with id
    this.router.delete("/:id", this.controller.delete);
  }
}

export default new UserRoutes().router;
