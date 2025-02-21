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
console.log(req.body)

if(req.body.id) {
  const existingUser: User = await userService.getOneUser(req,res);
  if (existingUser) {
   res.status(400).json({ message: "Email already exists" });
  }

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

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
async login(req: Request, res: Response): Promise<void> {
  console.log("body" ,req.body)
  try {
    const {  password } = req.body;

    const userResponse = await userRepository.retrieveAll({ email: req.body.email });
    const user = userResponse[0];

    if (!user)  res.status(400).json({ message: "Invalid email or password" });
   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)  res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user.user_id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    console.log('token', token) 
    
    res.json({token,  user: { id: user.user_id, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
};
}
