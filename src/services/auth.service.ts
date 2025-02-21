import { Request, Response } from "express";
import Genre from "../models/genre.model.js";

interface IAuthService {
  login(req: Request, res: Response): Promise<Genre>;
  register(req: Request, res: Response): Promise<Genre[]>;
 }

class AuthService implements IAuthService {
  async login(req: Request, res: Response): Promise<any> {}
  async register(req: Request, res: Response): Promise<any> {}
}

export default new AuthService();
