import { Request, Response } from "express";
import userService from "./user.service.js";

export default class UserController {

  create(req: Request, res: Response) {
    try {
      userService.createUser(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }

  findAll(req: Request, res: Response) {
    try {
      userService.getAllUsers(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }

  findOne(req: Request, res: Response) {
    try {
      userService.getOneUser(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }

  update(req: Request, res: Response) {
    try {
      userService.updateUser(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }

  delete(req: Request, res: Response) {
    try {
      userService.deleteUser(req, res);
    } catch (error: any) {
      res.sendStatus(error.status).json(error.message);
    }
  }
}
