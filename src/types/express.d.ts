import AuthenticatedUser from '../middleware/adminMiddleware.js';
import { Request } from 'express';  

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}