import Movie from "../models/movie.model.js";
import Screening from "../models/screening.model.js";
import Genre from "../models/genre.model.js";
import MovieGenre from "../models/movieGenre.model.js";
import Reservation from "../models/reservation.model.js";
import User from "../models/user.model.js";
import Ticket from "../models/ticket.model.js";

export function defineAssociations() {
  Movie.hasMany(Screening, { foreignKey: "movie_id" });
  Screening.belongsTo(Movie, { foreignKey: "movie_id" });

  Movie.belongsToMany(Genre, {
    through: MovieGenre,
    foreignKey: "movie_id",
    otherKey: "genre_id",
  });
  Genre.belongsToMany(Movie, {
    through: MovieGenre,
    foreignKey: "genre_id",
    otherKey: "movie_id",
  });

  Screening.hasMany(Reservation, { foreignKey: "screening_id" });
  Reservation.belongsTo(Screening, { foreignKey: "screening_id" });

  User.hasMany(Reservation, { foreignKey: "user_id", onDelete: "SET NULL" }); // User has many Reservations
  Reservation.belongsTo(User, { foreignKey: "user_id" }); // Reservation belongs to User

  Screening.hasMany(Ticket, { foreignKey: "screening_id" }); // Screening has many Tickets
  Ticket.belongsTo(Screening, { foreignKey: "screening_id" }); // Ticket belongs to Screening

  Reservation.hasMany(Ticket, { foreignKey: "reservation_id" }); // Reservation has many Tickets
  Ticket.belongsTo(Reservation, { foreignKey: "reservation_id" }); // Ticket belongs to Reservation
}
