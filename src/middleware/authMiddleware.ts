import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

 const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access Denied: No token provided" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined.");
    }

    const decoded = jwt.verify(token, secret)
    req.user = decoded; // ✅ This must match the expected structure in `AuthenticatedRequest`

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;