import { Application } from "express";
import genresRoutes from "./genre.routes.js";
import movieRoutes from "./movie.routes.js";
import screeningRoutes from "./screening.routes.js";
import reservationRoutes from "./reservation.routes.js";
import userRoutes from "./user.routes.js";
import ticketRoutes from "./ticket.routes.js";
import authRoutes from "./auth.routes.js";


export default class Routes {
  constructor(app: Application) {
    app.use("/api/genres", genresRoutes);
    app.use("/api/movies", movieRoutes);
    app.use("/api/screenings", screeningRoutes);
    app.use("/api/reservations", reservationRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/tickets", ticketRoutes);
    app.use("/api/auth", authRoutes);
  }
}
