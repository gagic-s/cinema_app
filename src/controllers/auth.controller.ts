import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userService from "../services/user.service.js";
import { User } from "../db/index.js";
import userRepository from "../repositories/user.repository.js";



export default class AuthController {
  async register(req: Request, res: Response): Promise<void> {
  try {
    
    const { firstName, lastName, dob, username, email, password, isAdmin } = req.body;

    if (!firstName || !lastName || !dob || !username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if(req.body.id) {
    const existingUser: User = await userService.getOneUser(req,res);

    if (existingUser) {
    res.status(400).json({ message: "Email already exists" });
    return;}
}

    const newUser = await User.create({
      firstName,
      lastName,
      dob,
      username,
      email,
      password, // Will be hashed before saving
      isAdmin: isAdmin || false,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
async login(req: Request, res: Response): Promise<void> {

  if (!req.body.email || !req.body.password) {
    res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const {  password } = req.body;

    const userResponse = await userRepository.retrieveAll({ email: req.body.email });
    const user = userResponse[0];

    if (!user) {
      res.status(400).json({ message: "Invalid email" }); return;
    } 
   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid password" }); return
    } 

    const token = jwt.sign(
      { userId: user.user_id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    
    res.json({token,  user: { id: user.user_id, name: user.firstName.concat(` ${user.lastName}`) , email: user.email, dob: user.dob, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
}
