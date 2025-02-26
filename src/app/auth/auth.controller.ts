import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../../db/index.js";
import { NotFoundException } from "../../exceptions/NotFoundException.js";
import { ValidationException } from "../../exceptions/ValidationException.js";
import sendEmail from "../../util/emailService.js";
import { isValidEmail } from "../../util/helper.reservation.js";
import userRepository from "../users/user.repository.js";
import userService from "../users/user.service.js";




export default class AuthController {
  async register(req: Request, res: Response): Promise<void> {
  try {
    
    const { firstName, lastName, dob, username, email, password, isAdmin } = req.body;
    const isEmailValid = isValidEmail(email);

    if (!firstName || !lastName || !dob || !username || !isEmailValid || !password) {
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
      password,
      isAdmin: isAdmin || false,
      isVerified: false,
    });

    const token = jwt.sign(
      { userId: newUser.user_id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    ); 

     // Verification link
     const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

      // Send verification email
    await sendEmail(email, "Verify Your Email", "email-verification", {
      name: newUser.firstName + " " + newUser.lastName,
      verificationLink,
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

    if (!user.isVerified) {
      res.status(403).json({ message: "Please verify your email first" });
    }

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

async verifyEmail (req: Request, res: Response): Promise<any> {

  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
     throw new ValidationException("Token");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ValidationException("JWT_SECRET is not defined.");
    }

    // Verify token
    const decoded = jwt.verify(token, secret)  as JwtPayload;

    if (typeof decoded === "string" || !decoded.userId) {
      throw new ValidationException("Invalid token payload.");
    }
    const user = await userRepository.retrieveById(decoded.userId);

    if (!user) {
      throw new NotFoundException("User");
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified." });
    }

    // Update user as verified
    await userRepository.update(
      { user_id: user.user_id, isVerified: true }
    );  
    

    res.json({ message: "Email verified successfully!" });
  } catch (error: any) {
    res.status(500).json({ message: "Invalid or expired token.", error: error.message });
  }
};
}
