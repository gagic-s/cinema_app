import { Application } from "express";
import authRoutes from "../app/auth/auth.routes.js";
import genresRoutes from "../app/genres/genre.routes.js";
import movieRoutes from "../app/movies/movie.routes.js";
import reservationRoutes from "../app/reservations/reservation.routes.js";
import screeningRoutes from "../app/screenings/screening.routes.js";
import ticketRoutes from "../app/tickets/ticket.routes.js";
import userRoutes from "../app/users/user.routes.js";



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
