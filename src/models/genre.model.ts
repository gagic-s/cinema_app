import { UUID } from "crypto";
import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsToMany,
} from "sequelize-typescript";
import Movie from "./movie.model.js";
import MovieGenre from "./movieGenre.model.js";

@Table({
  tableName: "genres",
})
export default class Genre extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    field: "genre_id",
    defaultValue: DataType.UUIDV4,
  })
  genre_id?: UUID;

  @Column({
    type: DataType.STRING(55),
    field: "name",
    unique: true,
  })
  name?: string;

  @BelongsToMany(() => Movie, () => MovieGenre)
  genres!: Movie[];
}
