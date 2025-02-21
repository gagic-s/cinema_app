import express, { Application } from "express";
import cors from "cors";
import Routes from "./routes/index.js";
import databaseInstance from "./db/index.js";

export default class Server {
  constructor(app: Application) {
    this.config(app);
    this.syncDatabase();
    new Routes(app);
  }

  private config(app: Application): void {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    // Logging middleware
    app.use((req, res, next) => {
      console.log(`Received ${req.method} request for ${req.url}`);
      next();
    });
  
  }

  private syncDatabase(): void {
    databaseInstance.sequelize?.sync();
  }
}
