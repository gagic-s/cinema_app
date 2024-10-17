import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "genre_test",
})
export default class Genre extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id",
  })
  id?: number;

  @Column({
    type: DataType.STRING(55),
    field: "name",
  })
  name?: string;
}
