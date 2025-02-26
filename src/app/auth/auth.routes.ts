import { Router } from "express";
import AuthController from "./auth.controller.js";




class AuthRoutes {
  router = Router();
  controller = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // login
    this.router.post("/login", this.controller.login);
    // register
    this.router.post("/register", this.controller.register);
     // verify email
    this.router.get("/verify-email", this.controller.verifyEmail);
  }
}

export default new AuthRoutes().router;
