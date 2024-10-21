import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Genre, Movie } from "../db/index.js";
import { UUID } from "crypto";

@Table({
  tableName: "movieGenres",
})
export default class MovieGenre extends Model {
  @ForeignKey(() => Movie)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    field: "movie_id",
  })
  movie_id!: UUID;

  @ForeignKey(() => Genre)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    field: "genre_id",
  })
  genre_id!: UUID;
}
