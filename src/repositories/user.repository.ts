import { UUID } from "crypto";
import { User } from "../db/index.js";
import { DatabaseException } from "../exceptions/DatabaseException.js";
import { Op } from "sequelize";
import { NotFoundException } from "../exceptions/NotFoundException.js";

interface IUserRepository {
  save(user: User, isAdmin: boolean): Promise<User>;
  retrieveAll(searchParams: { email: string }): Promise<User[]>;
  retrieveById(userId: UUID): Promise<User>;
  update(user: User): Promise<number>;
  delete(userId: UUID): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

class UserRepository implements IUserRepository {
  async save(user: User, isAdmin: boolean): Promise<User> {
    try {
      return await User.create({
        firstName: user.firstName,
        lastName: user.lastName,
        dob: user.dob,
        username: user.username,
        email: user.email,
        password: user.password,
        isAdmin: isAdmin,
      });
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async retrieveAll(searchParams: {
    email: string;
    username?: string;
  }): Promise<User[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.email) {
        condition.email = { [Op.iLike]: `%${searchParams.email}%` };
      }

      if (searchParams?.username) {
        condition.username = { [Op.iLike]: `%${searchParams.username}%` };
      }

      return await User.findAll({ where: condition });
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async retrieveById(userId: UUID): Promise<User> {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new NotFoundException("User");
      }

      return user;
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async update(user: User): Promise<number> {
    const {
      user_id,
      firstName,
      lastName,
      dob,
      username,
      email,
      password,
      isAdmin,
    } = user;
    try {
      const affectedRows = await User.update(
        {
          user_id,
          firstName,
          lastName,
          dob,
          username,
          email,
          password,
          isAdmin,
        },
        { where: { user_id: user_id } }
      );

      return affectedRows[0];
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }

  async delete(userId: UUID): Promise<number> {
    try {
      const affectedRows = await User.destroy({
        where: { userId: userId },
      });
      return affectedRows;
    } catch (error: any) {
      throw new DatabaseException(error.message);
    }
  }
}

export default new UserRepository();
