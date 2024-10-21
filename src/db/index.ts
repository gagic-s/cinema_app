import { Sequelize } from "sequelize-typescript";
import { config, dialect } from "../config/db.config.js";
import { defineAssociations } from "./associations.js";
import Movie from "../models/movie.model.js";
import Screening from "../models/screening.model.js";
import Genre from "../models/genre.model.js";
import MovieGenre from "../models/movieGenre.model.js";
import Reservation from "../models/reservation.model.js";
import User from "../models/user.model.js";
import Ticket from "../models/ticket.model.js";

export { Movie, Screening, Genre, MovieGenre, Reservation, User, Ticket };

class Database {
  public sequelize: Sequelize | undefined;

  constructor() {
    this.connectToDatabase();
  }

  private async connectToDatabase() {
    this.sequelize = new Sequelize({
      database: config.DB,
      username: config.USER,
      password: config.PASSWORD,
      host: config.HOST,
      dialect: dialect,
      pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle,
      },
      models: [Movie, Screening, Genre, MovieGenre, Reservation, User, Ticket],
    });

    defineAssociations();

    await this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((err) => {
        console.error("Unable to connect to the Database:", err);
      });
  }
}

export default Database;
