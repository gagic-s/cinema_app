import { UUID } from "crypto";
import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "screenings",
})
export default class Screening extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    field: "screening_id",
    defaultValue: DataType.UUIDV4,
  })
  screening_id!: UUID;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: "screeningDate",
  })
  screeningDate!: Date;

  @Column({
    type: DataType.TIME,
    allowNull: false,
    field: "screeningTime",
  })
  screeningTime!: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: "ticketPrice",
  })
  ticketPrice!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "screeningRows",
  })
  screeningRows!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: "screeningColumns",
  })
  screeningColumns!: number;
}
