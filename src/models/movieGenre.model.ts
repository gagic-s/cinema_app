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
  tableName: "movie_genres",
  timestamps: false,
})
export default class MovieGenre extends Model {
  @ForeignKey(() => Movie)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: false,
  })
  movie_id!: UUID;

  @ForeignKey(() => Genre)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    unique: false,
  })
  genre_id!: UUID;
}
