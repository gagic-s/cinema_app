import { Request, Response } from "express";
import userService from "../services/user.service.js";

export default class UserController {
  create(req: Request, res: Response) {
    try {
      userService.addUser(req, res);
    } catch (error) {}
  }

  findAll(req: Request, res: Response) {
    try {
      userService.getAllUsers(req, res);
    } catch (error) {}
  }

  findOne(req: Request, res: Response) {
    try {
      userService.getOneUser(req, res);
    } catch (error) {}
  }

  update(req: Request, res: Response) {
    try {
      userService.updateUser(req, res);
    } catch (error) {}
  }

  delete(req: Request, res: Response) {
    try {
      userService.deleteUser(req, res);
    } catch (error) {}
  }
}
