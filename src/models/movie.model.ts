import { UUID } from "crypto";
import {
  Model,
  Table,
  Column,
  DataType,
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import Genre from "./genre.model.js";
import MovieGenre from "./movieGenre.model.js";

@Table({
  tableName: "movies",
})
export default class Movie extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    field: "movie_id",
    defaultValue: DataType.UUIDV4,
  })
  movie_id?: UUID;

  @Column({
    type: DataType.STRING(55),
    field: "name",
    allowNull: false,
  })
  name?: string;

  @Column({
    type: DataType.STRING(55),
    field: "originalName",
    allowNull: false,
  })
  originalName?: string;

  @Column({
    type: DataType.STRING(100),
    field: "posterImage",
    allowNull: false,
  })
  posterImage?: string;

  @Column({
    type: DataType.INTEGER,
    field: "duration",
    allowNull: false,
  })
  duration?: string;

  @BelongsToMany(() => Genre, () => MovieGenre)
  genres!: Genre[];
}
