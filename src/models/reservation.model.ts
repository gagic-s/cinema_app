import { UUID } from "crypto";
import { Screening, User } from "../db/index.js";
import {
  Model,
  Table,
  Column,
  DataType,
  Unique,
  ForeignKey,
  IsEmail,
  BelongsTo,
} from "sequelize-typescript";

@Table({
  tableName: "reservations",
})
export default class Reservation extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    field: "reservation_id",
    defaultValue: DataType.UUIDV4,
  })
  reservation_id!: UUID;

  @ForeignKey(() => Screening)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  screening_id?: UUID;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "reservationCode",
  })
  reservationCode!: string;

  @IsEmail
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "email",
  })
  email!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: "totalPrice",
  })
  totalPrice!: number;

  // @ForeignKey(() => User)
  // @Column({
  //   type: DataType.UUID,
  //   allowNull: true, // Allows reservations without an associated user
  // })
  // userId?: string;

  //LAZA pitati zasto ovde ima problem sa inicijalizacijom ako dodam BelongsTo
  // @BelongsTo(() => User)
  // user?: User;
}
