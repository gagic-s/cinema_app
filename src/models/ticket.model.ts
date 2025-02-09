import { UUID } from "crypto";
import {
  Model,
  Table,
  Column,
  ForeignKey,
  DataType,
} from "sequelize-typescript";
import { Screening } from "../db/index.js"; // Import for type checking
import { Reservation } from "../db/index.js"; // Import for type checking

@Table({
  tableName: "tickets",
})
export default class Ticket extends Model {
  @ForeignKey(() => Screening)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true, // Part of composite primary key
  })
  screening_id!: UUID;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true, // Part of composite primary key
  })
  ticket_row!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true, // Part of composite primary key
  })
  ticket_column!: number;

  @ForeignKey(() => Reservation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  reservation_id!: UUID;
}
