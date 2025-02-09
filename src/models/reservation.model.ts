import { Screening, User } from "../db/index.js";
import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
  PrimaryKey,
  Default,
} from "sequelize-typescript";

@Table({
  tableName: "reservations",
})
export default class Reservation extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  reservation_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  reservationCode!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  totalPrice!: number;

  @ForeignKey(() => Screening)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  screening_id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true, // Optional association
  })
  user_id?: string;
}
