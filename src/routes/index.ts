import { Application } from "express";
import genresRoutes from "./genre.routes.js";
import movieRoutes from "./movie.routes.js";

export default class Routes {
  constructor(app: Application) {
    app.use("/api/genres", genresRoutes);
    app.use("/api/movies", movieRoutes);
  }
}
