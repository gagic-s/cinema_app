// models/ticket.model.ts
import { UUID } from "crypto";
import {
  Model,
  Table,
  Column,
  ForeignKey,
  DataType,
  BelongsTo,
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
    field: "screening_id",
  })
  screening_id!: UUID;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true, // Part of composite primary key
    field: "screening_rows",
  })
  screening_rows!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true, // Part of composite primary key
    field: "screening_columns",
  })
  screening_columns!: number;

  @ForeignKey(() => Reservation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  reservation_id!: UUID;

  @BelongsTo(() => Screening)
  screening!: Screening; // This defines the relationship to Screening

  @BelongsTo(() => Reservation)
  reservation!: Reservation; // This defines the relationship to Reservation
}
