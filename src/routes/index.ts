import { Application } from "express";
import genresRoutes from "./genres.routes.js";

export default class Routes {
  constructor(app: Application) {
    app.use("/api/genres", genresRoutes);
  }
}
