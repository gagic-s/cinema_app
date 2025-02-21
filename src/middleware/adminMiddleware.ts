import { Request, Response, NextFunction } from "express";

export interface AuthenticatedUser {
  userId: string;
  isAdmin: boolean;
}
const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log(req.user);
  if (!req.user || !req.body.isAdmin) {
    res.status(403).json({ message: "Access Denied: Admins only" });
    return;
  }

  next(); // ✅ Ensure it only calls next() and doesn't return a response
};

export default adminMiddleware;

