import { Request, Response, NextFunction } from "express";

export interface AuthenticatedUser {
  userId: string;
  isAdmin: boolean;
}
const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user as AuthenticatedUser;
  if (!user.isAdmin) {
    res.status(403).json({ message: "Access Denied: Admins only" });
    return;
  }

  next();
};

export default adminMiddleware;

