import { UUID } from "crypto";
import { Model, Table, Column, ForeignKey } from "sequelize-typescript";
import Movie from "./movie.model.js";
import Genre from "./genre.model.js";

@Table({
  tableName: "movieGenres",
})
export default class MovieGenre extends Model {
  @ForeignKey(() => Movie)
  @Column({
    primaryKey: true,
  })
  movie_id!: UUID;

  @ForeignKey(() => Genre)
  @Column({
    primaryKey: true,
  })
  genre_id!: UUID;
}
