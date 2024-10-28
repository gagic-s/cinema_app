import { Request, Response } from "express";
import { User } from "../db/index.js";
import { NotFoundException } from "../exceptions/NotFoundException.js";
import { ValidationException } from "../exceptions/ValidationException.js";
import { isValidEmail } from "../util/helper.reservation.js";
import { DatabaseException } from "../exceptions/DatabaseException.js";
import { UUID } from "crypto";
import { validate as uuidValidate } from "uuid";
import userRepository from "../repositories/user.repository.js";

interface IUserService {
  addUser(req: Request, res: Response): Promise<any>;
  getAllUsers(req: Request, res: Response): Promise<any[]>;
  getOneUser(req: Request, res: Response): Promise<any>;
  updateUser(req: Request, res: Response): Promise<any>;
  deleteUser(req: Request, res: Response): Promise<any>;
}

class UserService implements IUserService {
  async addUser(req: Request, res: Response): Promise<any> {
    const { firstName, lastName, dob, username, email, password } = req.body;

    //validate email
    const isEmailValid = isValidEmail(email);

    // Validate required fields
    if (!firstName) {
      throw new ValidationException("Missing required user fields.");
    }

    if (!lastName) {
      throw new ValidationException("Missing last name.");
    }

    if (!dob) {
      throw new ValidationException("Missing dob");
    }

    if (!username) {
      throw new ValidationException("Missing username.");
    }

    if (!password) {
      throw new ValidationException("Missing pasword.");
    }

    if (!isEmailValid) {
      throw new ValidationException("Missing email.");
    }

    //check if user is admin
    const isAdmin = false;

    const search = { email: email, username: username };

    // Check if the user email exists
    const user = await userRepository.retrieveAll(search);
    user.forEach((element) => {
      console.log(element);
    });
    if (user.length) {
      throw new ValidationException("User email or username not valid");
    }

    try {
      const user: User = req.body;
      console.log(user);
      const savedUser = await userRepository.save(user, isAdmin);
      res.status(201).send(savedUser);
    } catch (error: any) {
      throw new DatabaseException(`${error.message}njaaaaaaaaa`);
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<any> {
    const email = typeof req.query.email === "string" ? req.query.email : "";

    try {
      const users = await userRepository.retrieveAll({ email });

      res.status(200).send(users);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving users.",
      });
    }
  }

  async getOneUser(req: Request, res: Response): Promise<any> {
    const id: UUID = req.params.id as UUID;
    // check if ID is a valid UUID
    const validatedUUID = uuidValidate(id);

    if (!validatedUUID) throw new ValidationException("User");

    try {
      const user = await userRepository.retrieveById(id);

      if (user) res.status(200).send(user);
      else throw new NotFoundException("User");
    } catch (err: any) {
      throw new DatabaseException(err.message);
    }
  }

  async updateUser(req: Request, res: Response): Promise<any> {
    let user: User = req.body;
    user.id = req.params.id as UUID;

    try {
      const num = await userRepository.update(user);

      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${user.id}. Maybe User was not found or req.body is empty!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating User with id=${user.id}.`,
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<any> {
    const id: UUID = req.params.id as UUID;

    // check if ID is a valid UUID
    const validatedUUID = uuidValidate(id);

    if (!validatedUUID) throw new ValidationException("User");

    try {
      const num = await userRepository.delete(id);

      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        throw new NotFoundException("User");
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete User with id==${id}.`,
      });
    }
  }
}

export default new UserService();
