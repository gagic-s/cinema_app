import { UUID } from "crypto";
import {
  Model,
  Table,
  Column,
  DataType,
  Unique,
  ForeignKey,
  IsEmail,
} from "sequelize-typescript";
import { Screening, User } from "../db/index.js";

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

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true, // Allow null, so user may not exist
  })
  user_id?: UUID; // Change to optional

  //LAZA pitati zasto ovde ima problem sa inicijalizacijom ako dodam BelongsTo
  //@BelongsTo(() => User)
  //user?: User;
}
