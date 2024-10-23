import { UUID } from "crypto";
import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
} from "sequelize-typescript";
import { Movie, MovieGenre } from "../db/index.js";

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
  movies!: Movie[];
}
