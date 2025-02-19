import { UUID } from "crypto";
import { Model, Table, Column, DataType } from "sequelize-typescript";

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
  movie_id!: UUID;

  @Column({
    type: DataType.STRING(55),
    field: "name",
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING(55),
    field: "originalName",
    allowNull: false,
  })
  originalName!: string;

  @Column({
    type: DataType.STRING(100),
    field: "posterImage",
    allowNull: false,
  })
  posterImage!: string;

  @Column({
    type: DataType.STRING(100),
    field: "posterPublicId",
    allowNull: false,
  })
  posterPublicId!: string;

  @Column({
    type: DataType.INTEGER,
    field: "duration",
    allowNull: false,
  })
  duration!: number;
}
