import { UUID } from "crypto";
import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "genre",
})
export default class Genre extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    field: "id",
    defaultValue: DataType.UUIDV4,
  })
  id?: UUID;

  @Column({
    type: DataType.STRING(55),
    field: "name",
    unique: true,
  })
  name?: string;
}
