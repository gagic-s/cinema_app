import express, { Express } from "express";
import router from "./routes/genres.js";
import connectingToPostgres from "./sequelize.js";

const app: Express = express();
app.use(express.json());

app.use("/api/v1/genres", router);

connectingToPostgres();

app.listen(8000, () => console.log("Server is running on port 8000"));
