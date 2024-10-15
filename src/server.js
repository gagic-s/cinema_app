import express from "express";
import routes from "./routes/genres.js";
import connectingToPostgres from "./sequelize.js";

const app = express();
app.use(express.json());

app.use("/api/v1/genres", routes);

connectingToPostgres();

app.listen(8000, () => console.log("Server is running on port 8000"));
