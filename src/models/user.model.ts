import { UUID } from "crypto";
import bcrypt from "bcryptjs";

import { Model, Table, Column, DataType, Unique, BeforeCreate, BeforeUpdate, IsEmail } from "sequelize-typescript";

@Table({
  tableName: "user",
})
export default class User extends Model {
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    field: "user_id",
    defaultValue: DataType.UUIDV4,
  })
  user_id!: UUID;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "firstName",
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "lastName",
  })
  lastName!: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: "dob",
  })
  dob!: Date;

  @Unique
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    validate: {
      len: [4, 20],
    },
    field: "username",
  })
  username!: string;

  @Unique
  @IsEmail
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "email",
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "password",
  })
  password!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: "isAdmin",
  })
  isAdmin!: boolean;
}
